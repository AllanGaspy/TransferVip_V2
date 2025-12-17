// WhatsApp Business API Integration
class WhatsAppIntegration {
  constructor() {
    this.phoneNumber = '+5521982428730';
    this.defaultMessage = 'Olá, gostaria de um orçamento para transfer.';
    this.init();
  }

  init() {
    // Initialize WhatsApp buttons
    this.bindEvents();
  }

  bindEvents() {
    // Event delegation to support dynamically inserted buttons
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-whatsapp]');
      if (!button) return;
      e.preventDefault();
      const service = button.dataset.service || '';
      const vehicle = button.dataset.vehicle || '';
      this.openWhatsApp(service, vehicle);
    });
  }

  generateLink(service = '', vehicle = '') {
    const message = this.generateMessage(service, vehicle);
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
  }

  generateMessage(service, vehicle) {
    let resolvedService = service;
    if (!resolvedService) {
      const path = (location.pathname || '').toLowerCase();
      if (path.includes('frota-blindados')) resolvedService = 'Orçamento Blindados';
      else if (path.includes('frota-executivos')) resolvedService = 'Orçamento Executivo';
      else resolvedService = 'Orçamento';
    }

    const ensurePeriod = (text) => {
      const t = String(text || '').trim();
      if (!t) return '';
      return /[\.\!\?]$/.test(t) ? t : `${t}.`;
    };

    const lines = [
      ensurePeriod(this.defaultMessage),
      `Serviço: ${ensurePeriod(resolvedService)}`,
      vehicle ? `Veículo: ${ensurePeriod(vehicle)}` : null,
      `Aguardo mais informações e valores.`,
    ].filter(Boolean);

    return lines.join('\n');
  }

  openWhatsApp(service = '', vehicle = '') {
    const link = this.generateLink(service, vehicle);

    // Track WhatsApp click
    this.trackClick(service, vehicle);

    // Open WhatsApp
    window.open(link, '_blank');
  }

  trackClick(service, vehicle) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_click', {
        service: service,
        vehicle: vehicle,
        timestamp: new Date().toISOString()
      });
    }

    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Contact', {
        content_name: service || 'General Inquiry',
        content_category: vehicle || 'Transfer Service'
      });
    }

    // Console log for debugging
    console.log('WhatsApp click tracked:', { service, vehicle });
  }
}

// Floating WhatsApp Button
class FloatingWhatsApp {
  constructor() {
    this.button = null;
    this.init();
  }

  init() {
    this.createButton();
    this.bindEvents();
  }

  createButton() {
    const button = document.createElement('a');
    button.href = '#';
    button.className = 'fixed bottom-6 right-6 z-50 whatsapp-button shadow-lg';
    button.innerHTML = `
      <i class="fab fa-whatsapp text-xl"></i>
      <span class="hidden md:inline">WhatsApp</span>
    `;
    button.setAttribute('data-whatsapp', 'floating');
    button.setAttribute('data-service', 'General Inquiry');

    document.body.appendChild(button);
    this.button = button;
  }

  bindEvents() {
    if (this.button) {
      this.button.addEventListener('click', (e) => {
        e.preventDefault();
        const whatsapp = new WhatsAppIntegration();
        whatsapp.openWhatsApp();
      });
    }
  }
}

// Initialize WhatsApp Integration
document.addEventListener('DOMContentLoaded', () => {
  new WhatsAppIntegration();
  new FloatingWhatsApp();
});

export { WhatsAppIntegration, FloatingWhatsApp };
