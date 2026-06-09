/**
 * ===== NAVEGACIÓN MODERNA - AyudaMat =====
 * JavaScript optimizado para la navegación sin conflictos
 */

class ModernNavigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navMenu = document.getElementById('navMenu');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.logo = document.querySelector('.logo');
    
    this.lastScrollY = window.scrollY;
    this.isMenuOpen = false;
    this.scrollThreshold = 100;
    this.navTicking = false; // Variable específica para navegación
    
    this.init();
  }

  init() {
    if (!this.navbar) {
      console.warn('Navbar no encontrado');
      return;
    }
    
    this.setupEventListeners();
    this.setupScrollEffects();
    this.setupActiveSection();
    this.setupSmoothScrolling();
    this.setupKeyboardNavigation();
    this.setupIntersectionObserver();
    
    console.log('✅ Navegación moderna inicializada');
  }

  setupEventListeners() {
    // Menú móvil
    this.mobileMenuBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // Cerrar menú al hacer clic en un enlace
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (this.isMenuOpen) {
          this.closeMobileMenu();
        }
        this.setActiveLink(link);
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Efectos en hover del logo
    this.logo?.addEventListener('mouseenter', () => this.addLogoEffect());
    this.logo?.addEventListener('mouseleave', () => this.removeLogoEffect());

    // Redimensionar ventana
    window.addEventListener('resize', this.debounce(() => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }, 250));
  }

  setupScrollEffects() {
    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Añadir clase 'scrolled'
      if (currentScrollY > 20) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      // Ocultar/mostrar navbar al hacer scroll (solo si no está el menú abierto)
      if (!this.isMenuOpen && currentScrollY > this.scrollThreshold) {
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
          // Scrolling down
          this.navbar.classList.add('hidden');
        } else {
          // Scrolling up
          this.navbar.classList.remove('hidden');
        }
      } else {
        this.navbar.classList.remove('hidden');
      }

      this.lastScrollY = currentScrollY;
      this.navTicking = false;
    };

    // Scroll optimizado solo para navegación
    window.addEventListener('scroll', () => {
      if (!this.navTicking) {
        requestAnimationFrame(updateNavbar);
        this.navTicking = true;
      }
    }, { passive: true });
  }

  setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length === 0) return;

    const updateActiveLink = () => {
      let currentSection = '';
      const scrollY = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    };

    // Throttled scroll para active section
    let activeTicking = false;
    window.addEventListener('scroll', () => {
      if (!activeTicking) {
        requestAnimationFrame(updateActiveLink);
        activeTicking = true;
        setTimeout(() => { activeTicking = false; }, 100);
      }
    }, { passive: true });

    // Activar enlace inicial
    updateActiveLink();
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          
          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });

            // Añadir efecto visual al enlace
            this.addClickEffect(link);
            
            // Tracking para analytics
            this.trackNavigation(targetId);
          }
        });
      }
    });
  }

  setupKeyboardNavigation() {
    this.navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (index + 1) % this.navLinks.length;
            this.navLinks[nextIndex].focus();
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = (index - 1 + this.navLinks.length) % this.navLinks.length;
            this.navLinks[prevIndex].focus();
            break;
          case 'Home':
            e.preventDefault();
            this.navLinks[0].focus();
            break;
          case 'End':
            e.preventDefault();
            this.navLinks[this.navLinks.length - 1].focus();
            break;
        }
      });
    });
  }

  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.updateActiveNavLink(id);
        }
      });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  openMobileMenu() {
    this.navMenu.classList.add('active');
    this.mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Cambiar icono del botón móvil
    const icon = this.mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
    
    // Animación escalonada de los enlaces
    this.navLinks.forEach((link, index) => {
      link.style.animationDelay = `${(index + 1) * 0.1}s`;
    });

    // Accesibilidad
    this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    this.navMenu.setAttribute('aria-hidden', 'false');
    
    // Focus en el primer enlace
    setTimeout(() => {
      this.navLinks[0]?.focus();
    }, 300);

    // Tracking
    this.trackEvent('Navigation', 'Mobile Menu', 'Open');
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
    
    // Restaurar icono del botón móvil
    const icon = this.mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
    
    // Accesibilidad
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    this.navMenu.setAttribute('aria-hidden', 'true');
    
    // Limpiar delays de animación
    this.navLinks.forEach(link => {
      link.style.animationDelay = '';
    });

    // Tracking
    this.trackEvent('Navigation', 'Mobile Menu', 'Close');
  }

  setActiveLink(activeLink) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  updateActiveNavLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }

  addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      element.style.transform = '';
      element.style.transition = '';
    }, 100);
  }

  addLogoEffect() {
    if (this.logo) {
      this.logo.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))';
    }
  }

  removeLogoEffect() {
    if (this.logo) {
      this.logo.style.filter = '';
    }
  }

  // Método optimizado para efectos de performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Método para detectar si es dispositivo móvil
  isMobile() {
    return window.innerWidth <= 768;
  }

  // Tracking de eventos de navegación
  trackEvent(category, action, label) {
    if (typeof trackEvent === 'function') {
      trackEvent(category, action, label);
    } else {
      console.log(`Nav Event: ${category} - ${action} - ${label}`);
    }
  }

  trackNavigation(sectionId) {
    this.trackEvent('Navigation', 'Section Click', sectionId);
  }

  // Método público para refrescar la navegación
  refresh() {
    this.setupActiveSection();
    console.log('Navegación refrescada');
  }

  // Método público para destruir la navegación
  destroy() {
    // Remover event listeners
    window.removeEventListener('scroll', this.setupScrollEffects);
    window.removeEventListener('resize', this.setupEventListeners);
    
    // Restaurar estados
    document.body.style.overflow = '';
    this.navMenu.classList.remove('active');
    this.mobileMenuBtn.classList.remove('active');
    
    console.log('Navegación destruida');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const navigation = new ModernNavigation();
  
  // Exponer globalmente para debugging y compatibilidad
  window.navigation = navigation;
});

// Efectos adicionales optimizados
document.addEventListener('DOMContentLoaded', () => {
  // Añadir efecto de carga a la navegación
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.opacity = '0';
    navbar.style.transform = 'translateY(-100%)';
    
    setTimeout(() => {
      navbar.style.transition = 'all 0.6s ease';
      navbar.style.transform = 'translateY(0)';
      navbar.style.opacity = '1';
    }, 100);
  }

  // Efecto de highlight optimizado para enlaces
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.setProperty('--highlight', '1');
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.setProperty('--highlight', '0');
    });
  });

  // Ripple effect optimizado para botones de navegación
  const navButtons = document.querySelectorAll('.btn-whatsapp, .mobile-menu-btn');
  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Solo crear ripple si no existe uno activo
      if (this.querySelector('.ripple')) return;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        z-index: 1;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      ripple.animate([
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 }
      ], {
        duration: 600,
        easing: 'ease-out'
      }).onfinish = () => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      };
    });
  });

  // Tracking de WhatsApp en navegación
  document.querySelectorAll('.btn-whatsapp').forEach(btn => {
    btn.addEventListener('click', function() {
      if (typeof trackEvent === 'function') {
        trackEvent('WhatsApp', 'Click', 'Navigation');
      }
    });
  });
});

// Optimización de performance con Intersection Observer
if ('IntersectionObserver' in window) {
  const lazyNavEffects = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('nav-effects-loaded');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.nav-link').forEach(link => {
    lazyNavEffects.observe(link);
  });
}

// Manejo de errores específico para navegación
window.addEventListener('error', (e) => {
  if (e.target && e.target.closest('.navbar')) {
    console.warn('Error en navegación:', e.message);
  }
});

// Exportar para uso en módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernNavigation;
}