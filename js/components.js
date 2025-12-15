/**
 * Vehicle Card Component
 * Handles animations and interactions for vehicle showcase cards
 */
class VehicleCard {
    constructor(element, index = 0) {
        this.element = element;
        this.index = index;
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        // Stagger animation based on index
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(30px)';

        setTimeout(() => {
            this.element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.element.style.opacity = '1';
            this.element.style.transform = 'translateY(0)';
        }, this.index * 200);
    }

    setupInteractions() {
        // Add hover effects for vehicle images
        const imageContainer = this.element.querySelector('.vehicle-image-container');
        if (imageContainer) {
            imageContainer.addEventListener('mouseenter', () => {
                imageContainer.style.transform = 'scale(1.05)';
                imageContainer.style.transition = 'transform 0.3s ease';
            });

            imageContainer.addEventListener('mouseleave', () => {
                imageContainer.style.transform = 'scale(1)';
            });
        }

        // Add click tracking for buttons
        const buttons = this.element.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Track vehicle interest
                const vehicleName = this.element.querySelector('h3')?.textContent || 'Veículo';
                this.trackEvent('vehicle_interest', {
                    vehicle: vehicleName,
                    button_text: button.textContent.trim()
                });
            });
        });
    }

    trackEvent(eventName, data) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', data);
        }

        // Console log for debugging
        console.log(`Event: ${eventName}`, data);
    }
}

/**
 * Service Card Component
 * Handles service showcase cards with animations and interactions
 */
class ServiceCard {
    constructor(element, index = 0) {
        this.element = element;
        this.index = index;
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        // Stagger animation based on index
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(30px)';

        setTimeout(() => {
            this.element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.element.style.opacity = '1';
            this.element.style.transform = 'translateY(0)';
        }, this.index * 150);
    }

    setupInteractions() {
        // Add hover effects
        this.element.addEventListener('mouseenter', () => {
            this.element.style.transform = 'translateY(-10px)';
            this.element.style.transition = 'transform 0.3s ease';

            // Animate service icon
            const icon = this.element.querySelector('.service-icon > div');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'translateY(0)';

            // Reset icon animation
            const icon = this.element.querySelector('.service-icon > div');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        // Add click tracking for buttons
        const buttons = this.element.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Track service interest
                const serviceName = this.element.querySelector('h3')?.textContent || 'Serviço';
                this.trackEvent('service_interest', {
                    service: serviceName,
                    button_text: button.textContent.trim()
                });
            });
        });
    }

    trackEvent(eventName, data) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', data);
        }

        // Console log for debugging
        console.log(`Event: ${eventName}`, data);
    }
}

/**
 * Form Validator Component
 * Handles form validation and submission
 */
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupValidation();
        this.setupSubmission();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        // Clear previous error
        this.clearError(field);

        // Check if required
        if (required && !value) {
            this.showError(field, 'Este campo é obrigatório.');
            return false;
        }

        // Type-specific validation
        if (value) {
            switch (type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        this.showError(field, 'Por favor, insira um e-mail válido.');
                        return false;
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        this.showError(field, 'Por favor, insira um telefone válido.');
                        return false;
                    }
                    break;
                case 'date':
                    if (!this.isValidDate(value)) {
                        this.showError(field, 'Por favor, insira uma data válida.');
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;

        field.classList.add('border-red-500');
        field.parentNode.appendChild(errorDiv);
    }

    clearError(field) {
        field.classList.remove('border-red-500');
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.form.reset();

            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Track form submission
            this.trackEvent('form_submission', {
                form_id: this.form.id,
                service: this.form.querySelector('[name="servico"]')?.value || 'não especificado'
            });
        }, 2000);
    }

    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4';
        messageDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;

        this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    isValidDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    trackEvent(eventName, data) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', data);
        }

        // Console log for debugging
        console.log(`Form Event: ${eventName}`, data);
    }
}

/**
 * Contact Form Handler
 * Specific implementation for contact page form
 */
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupPhoneMask();
        this.setupFormValidator();
        this.setupWhatsAppIntegration();
    }

    setupPhoneMask() {
        const phoneInput = this.form.querySelector('input[type="tel"]');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }

            e.target.value = value;
        });
    }

    setupFormValidator() {
        new FormValidator('contact-form');
    }

    setupWhatsAppIntegration() {
        const whatsappCheckbox = this.form.querySelector('input[name="whatsapp"]');
        if (!whatsappCheckbox) return;

        this.form.addEventListener('submit', (e) => {
            if (whatsappCheckbox.checked) {
                // Delay WhatsApp opening to allow form processing
                setTimeout(() => {
                    this.openWhatsAppFromForm();
                }, 1000);
            }
        });
    }

    openWhatsAppFromForm() {
        const nome = this.form.querySelector('[name="nome"]')?.value || '';
        const telefone = this.form.querySelector('[name="telefone"]')?.value || '';
        const servico = this.form.querySelector('[name="servico"]')?.value || '';
        const data = this.form.querySelector('[name="data"]')?.value || '';
        const mensagem = this.form.querySelector('[name="mensagem"]')?.value || '';

        let whatsappMessage = `Olá! Recebi seu formulário de contato.\n\n`;
        whatsappMessage += `Nome: ${nome}\n`;
        whatsappMessage += `Telefone: ${telefone}\n`;
        if (servico) whatsappMessage += `Serviço: ${this.getServiceName(servico)}\n`;
        if (data) whatsappMessage += `Data: ${this.formatDate(data)}\n`;
        if (mensagem) whatsappMessage += `Mensagem: ${mensagem}\n`;
        whatsappMessage += `\nEntrarei em contato em breve!`;

        // Use the WhatsApp integration
        if (window.whatsappIntegration) {
            window.whatsappIntegration.openWhatsApp('formulario-contato', whatsappMessage);
        }
    }

    getServiceName(serviceValue) {
        const serviceNames = {
            'transfer-aeroporto': 'Transfer Aeroporto',
            'transporte-corporativo': 'Transporte Corporativo',
            'city-tour': 'City Tour VIP',
            'eventos-casamentos': 'Eventos & Casamentos',
            'transporte-interestadual': 'Transporte Interestadual',
            'logistica-vip': 'Logística VIP',
            'frota-executiva': 'Frota Executiva',
            'frota-blindada': 'Frota Blindada',
            'outro': 'Outro'
        };

        return serviceNames[serviceValue] || serviceValue;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form if on contact page
    if (document.getElementById('contact-form')) {
        new ContactFormHandler();
    }
});
