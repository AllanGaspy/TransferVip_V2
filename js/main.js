// Main JavaScript for Transfer VIP Premium Redesign

// Mobile Menu Controller
class MobileMenu {
  constructor() {
    this.menuToggle = null;
    this.navContent = null;
    this.overlay = null;
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-mobile-menu]');
      const overlayEl = e.target.closest('[data-mobile-overlay]');

      if (toggleBtn) {
        e.preventDefault();
        this.menuToggle = toggleBtn;
        this.navContent = document.querySelector('[data-nav-content]');
        this.overlay = document.querySelector('[data-mobile-overlay]');
        this.toggle();
        return;
      }

      if (overlayEl) {
        e.preventDefault();
        this.close();
        return;
      }

      if (this.navContent && !this.navContent.contains(e.target)) {
        this.close();
      }
    });

    const bindIfAvailable = () => {
      const btn = document.querySelector('[data-mobile-menu]');
      const nav = document.querySelector('[data-nav-content]');
      const ov = document.querySelector('[data-mobile-overlay]');
      if (btn) this.menuToggle = btn;
      if (nav) this.navContent = nav;
      if (ov) this.overlay = ov;
      if (this.overlay && !this._overlayBound) {
        this.overlay.addEventListener('click', () => this.close());
        this._overlayBound = true;
      }
      if (this.menuToggle && !this._buttonBound) {
        this.menuToggle.addEventListener('click', (e) => { e.preventDefault(); this.toggle(); });
        this._buttonBound = true;
      }
    };

    bindIfAvailable();
    const observer = new MutationObserver(() => bindIfAvailable());
    observer.observe(document.body, { childList: true, subtree: true });
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
    if (!this.navContent) return
    this.navContent.classList.remove('hidden')
    this.navContent.style.display = 'block'
    this.navContent.classList.add('show')
    this.navContent.classList.remove('opacity-0')
    this.navContent.classList.remove('scale-y-0')
    this.navContent.style.maxHeight = '100vh'
    this.menuToggle?.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.overlay?.classList.remove('hidden');
  }

  close() {
    if (!this.navContent) return
    this.navContent.classList.remove('show')
    this.navContent.classList.add('opacity-0')
    this.navContent.classList.add('scale-y-0')
    this.navContent.classList.add('hidden')
    this.navContent.style.maxHeight = ''
    this.navContent.style.display = ''
    this.menuToggle?.classList.remove('active');
    document.body.style.overflow = '';
    this.overlay?.classList.add('hidden');
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
  const mm = new MobileMenu();
  // Fallback global togglers for inline handlers
  window.MobileMenuInstance = mm;
  window.__mobileMenuToggle = () => {
    try { mm.toggle(); } catch {}
    return false;
  };
  window.__mobileMenuClose = () => {
    try { mm.close(); } catch {}
    return false;
  };

  // Initialize scroll animations
  new ScrollAnimations();

  // Initialize header scroll effect
  new HeaderScroll();

  // Smooth scroll for anchor links (skip bare '#')
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || ''
      if (href === '#' || href.trim() === '#') return
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

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
