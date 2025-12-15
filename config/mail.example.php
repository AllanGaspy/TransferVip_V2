<?php
// Copy this file to mail.local.php and fill in real credentials.
// Do NOT commit mail.local.php with real secrets.

return [
  'provider' => 'resend', // or 'sendgrid'
  'from_email' => 'no-reply@seu-dominio.com',
  'from_name' => 'Transfer VIP Tour',
  'to_email' => 'transferviptourcontact@gmail.com',
  // Provider API keys
  'resend_api_key' => 're_XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'sendgrid_api_key' => 'SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
];

