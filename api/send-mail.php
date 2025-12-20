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

$rows = '';
$rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Nome</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($nome) . '</td></tr>';
$rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Email</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($email) . '</td></tr>';
$rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Telefone</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($telefone) . '</td></tr>';
$rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Serviço</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($servico) . '</td></tr>';
if ($veiculo) $rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Veículo</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($veiculo) . '</td></tr>';
if ($data) $rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Data</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($data) . '</td></tr>';
if ($hora) $rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Hora</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($hora) . '</td></tr>';
if ($passageiros) $rows .= '<tr><td style="padding:8px 12px;color:#6b7280;width:30%">Passageiros</td><td style="padding:8px 12px;color:#111827;font-weight:600">' . htmlspecialchars($passageiros) . '</td></tr>';
$html = '
  <div style="background:#f3f4f6;padding:24px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#111827;color:#ffffff;padding:16px 24px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-weight:700;font-size:16px;letter-spacing:.3px;">Transfer VIP Tour</div>
          <div style="font-size:12px;color:#f59e0b;">Novo contato</div>
        </div>
      </div>
      <div style="padding:20px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          ' . $rows . '
        </table>
        <div style="margin-top:16px;color:#374151;font-size:14px;">Mensagem</div>
        <div style="margin-top:8px;padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;color:#111827;line-height:1.5;">
          ' . nl2br(htmlspecialchars($mensagem)) . '
        </div>
      </div>
      <div style="padding:12px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">Este e-mail foi gerado pelo site Transfer VIP Tour</div>
    </div>
  </div>
';
$text = "NOVO CONTATO\n\n" .
  "Nome: " . $nome . "\n" .
  "Email: " . $email . "\n" .
  "Telefone: " . $telefone . "\n" .
  "Serviço: " . $servico . "\n" .
  ($veiculo ? ("Veículo: " . $veiculo . "\n") : '') .
  ($data ? ("Data: " . $data . "\n") : '') .
  ($hora ? ("Hora: " . $hora . "\n") : '') .
  ($passageiros ? ("Passageiros: " . $passageiros . "\n") : '') .
  "\nMensagem:\n" . $mensagem;

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
      'text' => $text,
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
      'content' => [
        [ 'type' => 'text/plain', 'value' => $text ],
        [ 'type' => 'text/html', 'value' => $html ],
      ],
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

