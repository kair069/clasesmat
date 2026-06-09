// JavaScript para AyudaMat - Sitio Web Profesional

// ===== NAVEGACIÓN REMOVIDA - MANEJADA POR nav.js =====
// Se eliminaron las funciones de navegación para evitar conflictos:
// - Navbar scroll effect (líneas 3-9)
// - Mobile menu toggle (líneas 11-20) 
// - Smooth scrolling duplicado (líneas 22-31)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all fade-in and scale-in elements
document.querySelectorAll('.fade-in, .scale-in').forEach(el => {
  observer.observe(el);
});

// Typing effect for hero title
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Enhanced scroll animations (solo para efectos visuales, no navegación)
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero-bg');
  if (parallax) {
    parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Count up animation for stats
function animateCount(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);
    
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, 16);
}

// Particle effect for hero background
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  `;
  
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: float-particle ${5 + Math.random() * 10}s infinite linear;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
      `;
      particlesContainer.appendChild(particle);
    }
  }
}

// Initialize particles
createParticles();

// Form validation and submission (if contact form exists)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
      <div style="background: #10b981; color: white; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
        ✅ ¡Mensaje enviado exitosamente! Te contactaremos pronto.
      </div>
    `;
    contactForm.appendChild(successMsg);
    
    // Reset form
    contactForm.reset();
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      successMsg.remove();
    }, 5000);
  });
}

// Loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Enhanced button hover effects (excluyendo botones de navegación)
document.querySelectorAll('.btn:not(.nav-link):not(.btn-whatsapp)').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) scale(1.02)';
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// Service card interactive effects
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) rotateY(5deg)';
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotateY(0)';
  });
});

// Advanced scroll reveal animation (optimizado para no conflictar)
const revealElements = document.querySelectorAll('.fade-in, .scale-in');

function reveal() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
}

// Solo ejecutar si nav.js no está presente (fallback)
if (!window.navigation) {
  window.addEventListener('scroll', reveal);
  reveal(); // Check on load
}

// WhatsApp button pulse effect
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
  setInterval(() => {
    whatsappBtn.style.animation = 'none';
    setTimeout(() => {
      whatsappBtn.style.animation = 'pulse 2s infinite';
    }, 10);
  }, 10000);
}

// Dynamic year in footer
const yearElement = document.querySelector('.footer p strong');
if (yearElement) {
  yearElement.textContent = `© ${new Date().getFullYear()} AyudaMat`;
}

// Performance optimization: debounced scroll handler (solo para efectos no-nav)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Solo scroll effects no relacionados con navegación
const debouncedScrollHandler = debounce(() => {
  // Solo efectos de revelado si nav.js no está activo
  if (!window.navigation) {
    reveal();
  }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for external resources
window.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    console.log('Image failed to load:', e.target.src);
  }
});

// Analytics event tracking (placeholder)
function trackEvent(category, action, label) {
  // Replace with actual analytics code
  console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track button clicks (excluyendo navegación)
document.querySelectorAll('.btn:not(.nav-link):not(.btn-whatsapp)').forEach(btn => {
  btn.addEventListener('click', function() {
    const btnText = this.textContent.trim();
    trackEvent('Button', 'Click', btnText);
  });
});

// Track WhatsApp clicks (solo el botón flotante)
document.querySelectorAll('.whatsapp-float').forEach(link => {
  link.addEventListener('click', function() {
    trackEvent('WhatsApp', 'Click', 'Float Button');
  });
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 AyudaMat main.js loaded - Navigation handled by nav.js');
  
  // Agregar efectos adicionales de carga
  const body = document.body;
  body.classList.add('loaded');
  
  // Efectos de texto animado en el hero
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transition = 'opacity 1s ease-in-out';
    }, 500);
  }
});

// Efecto de cursor personalizado (opcional)
function createCursorEffect() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: rgba(0, 102, 204, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.display = 'block';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });
}

// Activar cursor personalizado en desktop
if (window.innerWidth > 1024) {
  createCursorEffect();
}

// Manejo de errores global
window.addEventListener('error', function(e) {
  console.log('Error handled:', e.message);
});

// Optimización de scroll para móviles (solo efectos no-nav)
let mainTicking = false;

function updateMainScroll() {
  // Solo efectos visuales, no navegación
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero-bg');
  if (parallax) {
    parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
  mainTicking = false;
}

function requestMainTick() {
  if (!mainTicking) {
    requestAnimationFrame(updateMainScroll);
    mainTicking = true;
  }
}

window.addEventListener('scroll', requestMainTick);