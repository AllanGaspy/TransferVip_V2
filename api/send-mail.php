<?php
header('Content-Type: application/json; charset=utf-8');

// Load local mail config
$configPath = __DIR__ . '/../config/mail.local.php';
if (!file_exists($configPath)) {
  http_response_code(501);
  echo json_encode([
    'ok' => false,
    'error' => 'Mail configuration missing. Copy config/mail.example.php to config/mail.local.php and set API key.'
  ]);
  exit;
}
$config = require $configPath;

// Accept JSON or form data
$input = [];
if ($_SERVER['CONTENT_TYPE'] ?? '' ) {
  $ctype = strtolower($_SERVER['CONTENT_TYPE']);
  if (str_contains($ctype, 'application/json')) {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];
  } else {
    $input = $_POST;
  }
}

// Extract and validate
$nome = trim($input['nome'] ?? '');
$email = trim($input['email'] ?? '');
$telefone = trim($input['telefone'] ?? '');
$servico = trim($input['servico'] ?? '');
$veiculo = trim($input['veiculo'] ?? '');
$data = trim($input['data'] ?? '');
$hora = trim($input['hora'] ?? '');
$passageiros = trim($input['passageiros'] ?? '');
$mensagem = trim($input['mensagem'] ?? '');

if ($nome === '' || $email === '' || $telefone === '' || $servico === '' || $mensagem === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Campos obrigatórios ausentes']);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Email inválido']);
  exit;
}

// Build email content
$subject = 'Novo contato via site - ' . ($servico ?: 'Solicitação');
$toEmail = $config['to_email'] ?? 'transferviptourcontact@gmail.com';
$fromEmail = $config['from_email'] ?? 'no-reply@seu-dominio.com';
$fromName = $config['from_name'] ?? 'Transfer VIP Tour';

$html = '<h2 style="margin:0 0 12px; font-family:Poppins, Arial;">Novo contato</h2>' .
  '<p style="margin:0 0 8px;">Nome: <strong>' . htmlspecialchars($nome) . '</strong></p>' .
  '<p style="margin:0 0 8px;">Email: <strong>' . htmlspecialchars($email) . '</strong></p>' .
  '<p style="margin:0 0 8px;">Telefone: <strong>' . htmlspecialchars($telefone) . '</strong></p>' .
  '<p style="margin:0 0 8px;">Serviço: <strong>' . htmlspecialchars($servico) . '</strong></p>' .
  ($veiculo ? '<p style="margin:0 0 8px;">Veículo: <strong>' . htmlspecialchars($veiculo) . '</strong></p>' : '') .
  ($data ? '<p style="margin:0 0 8px;">Data: <strong>' . htmlspecialchars($data) . '</strong></p>' : '') .
  ($hora ? '<p style="margin:0 0 8px;">Hora: <strong>' . htmlspecialchars($hora) . '</strong></p>' : '') .
  ($passageiros ? '<p style="margin:0 0 8px;">Passageiros: <strong>' . htmlspecialchars($passageiros) . '</strong></p>' : '') .
  '<p style="margin:12px 0 0;">Mensagem:</p>' .
  '<div style="padding:12px; background:#f7f7f7; border-radius:8px;">' . nl2br(htmlspecialchars($mensagem)) . '</div>';

// Send via provider
$provider = strtolower($config['provider'] ?? '');
try {
  if ($provider === 'resend') {
    $apiKey = $config['resend_api_key'] ?? '';
    if (!$apiKey) throw new Exception('Resend API key missing');

    $payload = [
      'from' => $fromName . ' <' . $fromEmail . '>',
      'to' => [$toEmail],
      'subject' => $subject,
      'html' => $html,
      'reply_to' => $email,
    ];
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
      ],
      CURLOPT_POSTFIELDS => json_encode($payload),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 15,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($err || $code >= 300) {
      throw new Exception('Resend error: ' . ($err ?: $resp));
    }
  } else if ($provider === 'sendgrid') {
    $apiKey = $config['sendgrid_api_key'] ?? '';
    if (!$apiKey) throw new Exception('SendGrid API key missing');
    $payload = [
      'personalizations' => [[
        'to' => [['email' => $toEmail]],
        'subject' => $subject,
      ]],
      'from' => ['email' => $fromEmail, 'name' => $fromName],
      'reply_to' => ['email' => $email],
      'content' => [[ 'type' => 'text/html', 'value' => $html ]],
    ];
    $ch = curl_init('https://api.sendgrid.com/v3/mail/send');
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
      ],
      CURLOPT_POSTFIELDS => json_encode($payload),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 15,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($err || $code >= 300) {
      throw new Exception('SendGrid error: ' . ($err ?: $resp));
    }
  } else {
    throw new Exception('Unsupported provider');
  }
  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}

