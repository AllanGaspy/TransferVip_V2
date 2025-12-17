// Main JavaScript for Transfer VIP Premium Redesign

// Mobile Menu Controller
class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector('[data-mobile-menu]');
    this.navContent = document.querySelector('[data-nav-content]');
    this.init();
  }

  init() {
    this.menuToggle?.addEventListener('click', () => this.toggle());
    document.addEventListener('click', (e) => this.closeOnClickOutside(e));

    // Close menu when clicking on links
    const navLinks = this.navContent?.querySelectorAll('a');
    navLinks?.forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  }

  toggle() {
    const isOpen = this.navContent?.classList.contains('show');
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.navContent?.classList.add('show');
    this.menuToggle?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.navContent?.classList.remove('show');
    this.menuToggle?.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeOnClickOutside(e) {
    if (!this.menuToggle?.contains(e.target) && !this.navContent?.contains(e.target)) {
      this.close();
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    this.init();
  }

  init() {
    const isInViewport = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => {
        if (isInViewport(el)) {
          el.classList.add('animated');
        } else {
          observer.observe(el);
        }
      });
    } else {
      this.elements.forEach(el => el.classList.add('animated'));
    }
  }
}

// Header Scroll Effect
class HeaderScroll {
  constructor() {
    this.header = document.querySelector('[data-header]');
    this.lastScrollY = window.scrollY;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      this.header?.classList.add('scrolled');
    } else {
      this.header?.classList.remove('scrolled');
    }

    this.lastScrollY = currentScrollY;
  }
}

// Initialize Components
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile menu
  new MobileMenu();

  // Initialize scroll animations
  new ScrollAnimations();

  // Initialize header scroll effect
  new HeaderScroll();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Remove initial image shimmer to avoid flicker

  // Replace incorrect WhatsApp SVG icons with Font Awesome
  const replaceIcon = (el, sizeClass = 'text-lg') => {
    const i = document.createElement('i');
    i.className = `fab fa-whatsapp ${sizeClass}`;
    el.replaceWith(i);
  };
  document.querySelectorAll('a[href*="wa.me"] svg').forEach(svg => replaceIcon(svg));
  document.querySelectorAll('button[data-whatsapp] svg').forEach(svg => replaceIcon(svg, 'text-xl'));

  console.log('🚀 Transfer VIP Premium Redesign initialized!');
});

// Enable animations only after full page load to avoid initial flicker
window.addEventListener('load', () => {
  document.documentElement.classList.add('animations-enabled');
});

// Export for use in other modules
export { MobileMenu, ScrollAnimations, HeaderScroll };
