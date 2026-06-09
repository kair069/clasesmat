/**
 * ===== SERVICIOS - JavaScript Específico =====
 * Funcionalidad para filtros, animaciones y interacciones
 */

class ServicesPage {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.serviceCards = document.querySelectorAll('.service-card');
    this.currentFilter = 'all';
    
    this.init();
  }

  init() {
    this.setupFilterSystem();
    this.setupAnimations();
    this.setupServiceCardEffects();
    this.setupCountAnimations();
    this.setupFormHandling();
    
    console.log('✅ Servicios page initialized');
  }

  setupFilterSystem() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const filter = button.getAttribute('data-filter');
        this.filterServices(filter);
        this.updateActiveFilter(button);
      });
    });
  }

  filterServices(filter) {
    this.currentFilter = filter;
    
    this.serviceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        this.showCard(card);
      } else {
        this.hideCard(card);
      }
    });

    // Tracking
    this.trackFilterUsage(filter);
  }

  showCard(card) {
    card.classList.remove('hidden');
    card.classList.add('visible');
    card.style.display = 'flex';
    
    // Animación de entrada
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
    }, 100);
  }

  hideCard(card) {
    card.classList.add('hidden');
    card.classList.remove('visible');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8) translateY(20px)';
    
    setTimeout(() => {
      if (card.classList.contains('hidden')) {
        card.style.display = 'none';
      }
    }, 300);
  }

  updateActiveFilter(activeButton) {
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    activeButton.classList.add('active');
  }

  setupAnimations() {
    // Intersection Observer para animaciones de scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animación especial para stats
          if (entry.target.classList.contains('stat-number')) {
            this.animateNumber(entry.target);

          }
        }
      });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.fade-in, .service-card, .process-step').forEach(el => {
      observer.observe(el);
    });
  }

  setupServiceCardEffects() {
    this.serviceCards.forEach(card => {
      // Efecto hover mejorado
      card.addEventListener('mouseenter', () => {
        this.addCardHoverEffect(card);
      });

      card.addEventListener('mouseleave', () => {
        this.removeCardHoverEffect(card);
      });

      // Click en botón de servicio
      const serviceBtn = card.querySelector('.btn-service');
      if (serviceBtn) {
        serviceBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleServiceRequest(card);
        });
      }
    });
  }

  addCardHoverEffect(card) {
    const icon = card.querySelector('.service-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }

    // Efecto de partículas sutil
    this.createCardParticles(card);
  }

  removeCardHoverEffect(card) {
    const icon = card.querySelector('.service-icon');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  }

  createCardParticles(card) {
    const particles = card.querySelectorAll('.card-particle');
    if (particles.length > 0) return; // Evitar duplicados

    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'card-particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #0ea5e9, #06b6d4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: 0;
      `;
      
      card.style.position = 'relative';
      card.appendChild(particle);
      
      // Animar partícula
      particle.animate([
        { opacity: 1, transform: 'translate(0, 0) scale(1)' },
        { opacity: 0, transform: `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(0)` }
      ], {
        duration: 1000,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
  }

  setupCountAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const finalValue = stat.textContent;
      stat.textContent = '20';
      stat.setAttribute('data-final', finalValue);
    });
  }

  animateNumber(element) {
    const finalValue = element.getAttribute('data-final');
    const isPercent = finalValue.includes('%');
    const isTime = finalValue.includes('/');
    
    let targetNumber;
    let suffix = '';
    
    if (isPercent) {
      targetNumber = parseInt(finalValue);
      suffix = '%';
    } else if (isTime) {
      element.textContent = finalValue;
      return;
    } else {
      targetNumber = parseInt(finalValue.replace('+', ''));
      suffix = '+';
    }

    let current = 0;
    const increment = targetNumber / 60; // 60 frames para suavidad
    
    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current) + suffix;
      
      if (current >= targetNumber) {
        element.textContent = finalValue;
        clearInterval(timer);
      }
    }, 16);
  }

  handleServiceRequest(card) {
    const serviceName = card.querySelector('h3').textContent;
    const price = card.querySelector('.price-from').textContent;
    
    // Crear mensaje personalizado para WhatsApp
    const message = encodeURIComponent(
      `¡Hola! Me interesa el servicio "${serviceName}" (${price}). ¿Podrían darme más información?`
    );
    
    const whatsappUrl = `https://wa.me/51968269924?text=${message}`;
    
    // Tracking
    this.trackServiceRequest(serviceName);
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Efecto visual
    this.addClickEffect(card);
  }

  addClickEffect(card) {
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      card.style.transform = '';
      card.style.transition = '';
    }, 150);
  }

  setupFormHandling() {
    // Manejar clicks en CTAs
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.href && btn.href.includes('wa.me')) {
          this.trackEvent('CTA', 'WhatsApp Click', 'Services Page');
        } else if (btn.href && btn.href.includes('contacto')) {
          this.trackEvent('CTA', 'Contact Form Click', 'Services Page');
        }
      });
    });
  }

  // Método para búsqueda de servicios
  searchServices(query) {
    const searchTerm = query.toLowerCase();
    
    this.serviceCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const features = Array.from(card.querySelectorAll('.service-features li'))
        .map(li => li.textContent.toLowerCase())
        .join(' ');
      
      const content = `${title} ${description} ${features}`;
      
      if (content.includes(searchTerm)) {
        this.showCard(card);
      } else {
        this.hideCard(card);
      }
    });
  }

  // Método para obtener servicios por categoría
  getServicesByCategory(category) {
    return Array.from(this.serviceCards).filter(card => {
      return card.getAttribute('data-category') === category;
    });
  }

  // Tracking de eventos
  trackEvent(category, action, label) {
    if (typeof trackEvent === 'function') {
      trackEvent(category, action, label);
    } else {
      console.log(`Services Event: ${category} - ${action} - ${label}`);
    }
  }

  trackFilterUsage(filter) {
    this.trackEvent('Services', 'Filter Used', filter);
  }

  trackServiceRequest(serviceName) {
    this.trackEvent('Services', 'Service Requested', serviceName);
  }

  // Método público para refrescar
  refresh() {
    this.filterServices('all');
    this.updateActiveFilter(document.querySelector('.filter-btn[data-filter="all"]'));
  }

  // Método público para filtrar programáticamente
  setFilter(filter) {
    this.filterServices(filter);
    const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (filterBtn) {
      this.updateActiveFilter(filterBtn);
    }
  }
}

// Funciones adicionales para efectos especiales
function createServiceSearchBar() {
  const searchBar = document.createElement('div');
  searchBar.innerHTML = `
    <div class="service-search" style="max-width: 500px; margin: 0 auto 2rem; position: relative;">
      <input type="text" id="serviceSearch" placeholder="Buscar servicios..." 
             style="width: 100%; padding: 12px 20px 12px 50px; border: 2px solid rgba(14, 165, 233, 0.2); border-radius: 25px; font-size: 1rem;">
      <i class="fas fa-search" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #64748b;"></i>
    </div>
  `;
  
  const filterSection = document.querySelector('.services-filter .container');
  if (filterSection) {
    filterSection.insertBefore(searchBar, filterSection.firstChild);
    
    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('serviceSearch');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        window.servicesPage.searchServices(e.target.value);
      }, 300);
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.servicesPage = new ServicesPage();
  
  // Crear barra de búsqueda (opcional)
  // createServiceSearchBar();
  
  // Animación inicial
  setTimeout(() => {
    document.body.classList.add('services-loaded');
  }, 100);
});

// Scroll suave para enlaces internos
document.addEventListener('DOMContentLoaded', () => {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ServicesPage;
}