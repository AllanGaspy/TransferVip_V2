document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-button');
  const successBox = document.getElementById('success-message');
  const errorBox = document.getElementById('error-message');
  if (!form) return;

  const show = (el) => el && el.classList && el.classList.remove('hidden');
  const hide = (el) => el && el.classList && el.classList.add('hidden');

  const phoneInput = document.getElementById('telefone')
  const formatBRPhone = (val) => {
    const digits = String(val).replace(/\D/g, '')
    if (digits.length < 10) return val
    const ddd = digits.slice(0, 2)
    const rest = digits.slice(2)
    if (rest.length >= 9) {
      const first = rest.slice(0, 5)
      const last = rest.slice(5, 9)
      return `(${ddd}) ${first}${last ? '-' + last : ''}`
    } else {
      const first = rest.slice(0, 4)
      const last = rest.slice(4, 8)
      return `(${ddd}) ${first}${last ? '-' + last : ''}`
    }
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const cur = phoneInput.value
      phoneInput.value = formatBRPhone(cur)
    })
    phoneInput.addEventListener('blur', () => {
      phoneInput.value = formatBRPhone(phoneInput.value)
    })
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hide(successBox); hide(errorBox);

    const data = Object.fromEntries(new FormData(form).entries());
    const required = ['nome', 'email', 'telefone', 'servico', 'data', 'mensagem'];
    for (const k of required) {
      if (!data[k] || String(data[k]).trim() === '') {
        show(form.querySelector(`#${k}`)?.parentElement?.querySelector('.error-message'));
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      show(form.querySelector('#email')?.parentElement?.querySelector('.error-message'));
      return;
    }

    submitBtn.disabled = true;
    form.classList.add('opacity-70');

    try {
      const resp = await fetch('/api/send-mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) throw new Error(json.error || 'Falha ao enviar');
      show(successBox);
      form.reset();
    } catch (err) {
      const msg = errorBox?.querySelector('p');
      if (msg) msg.textContent = 'Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.';
      show(errorBox);
    } finally {
      submitBtn.disabled = false;
      form.classList.remove('opacity-70');
    }
  });
});
