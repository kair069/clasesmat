/**
 * ===== PORTAFOLIO - JavaScript Completo =====
 * Funcionalidad avanzada para el portafolio profesional
 */

class PortfolioManager {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');
    this.skillBars = document.querySelectorAll('.skill-progress');
    this.achievementNumbers = document.querySelectorAll('.achievement-number');
    this.currentFilter = 'all';
    this.animationObserver = null;
    
    this.init();
  }

  init() {
    this.setupFilterSystem();
    this.setupScrollAnimations();
    this.setupSkillAnimations();
    this.setupCountAnimations();
    this.setupProjectInteractions();
    this.setupParallaxEffects();
    this.setupTypewriterEffect();
    this.setupContactTracking();
    
    console.log('✅ Portfolio Manager initialized');
  }

  setupFilterSystem() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const filter = button.getAttribute('data-filter');
        this.filterProjects(filter);
        this.updateActiveFilter(button);
        this.trackFilterUsage(filter);
      });
    });
  }

  filterProjects(filter) {
    this.currentFilter = filter;
    
    this.projectCards.forEach((card, index) => {
      const categories = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || (categories && categories.includes(filter));
      
      if (shouldShow) {
        this.showProject(card, index);
      } else {
        this.hideProject(card);
      }
    });
  }

  showProject(card, index) {
    card.classList.remove('hidden');
    card.classList.add('visible');
    card.style.display = 'flex';
    
    // Animación escalonada
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
    }, index * 100);
  }

  hideProject(card) {
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

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger specific animations
          if (entry.target.classList.contains('skill-progress')) {
            this.animateSkillBar(entry.target);
          }
          
          if (entry.target.classList.contains('achievement-number')) {
            this.animateNumber(entry.target);
          }
          
          if (entry.target.classList.contains('project-card')) {
            this.animateProjectCard(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.fade-in, .project-card, .skill-progress, .achievement-number').forEach(el => {
      this.animationObserver.observe(el);
    });
  }

  setupSkillAnimations() {
    // Skill bars animation will be triggered by intersection observer
    this.skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      bar.setAttribute('data-final-width', progress + '%');
    });
  }

  animateSkillBar(skillBar) {
    const finalWidth = skillBar.getAttribute('data-final-width');
    
    setTimeout(() => {
      skillBar.style.width = finalWidth;
    }, 200);
  }

  setupCountAnimations() {
    this.achievementNumbers.forEach(number => {
      const finalValue = number.textContent;
      number.textContent = '0';
      number.setAttribute('data-final', finalValue);
    });
  }

  animateNumber(element) {
    const finalValue = element.getAttribute('data-final');
    const isPercent = finalValue.includes('%');
    const hasPlus = finalValue.includes('+');
    
    let targetNumber;
    let suffix = '';
    
    if (isPercent) {
      targetNumber = parseInt(finalValue);
      suffix = '%';
    } else if (hasPlus) {
      targetNumber = parseInt(finalValue.replace('+', ''));
      suffix = '+';
    } else {
      targetNumber = parseInt(finalValue);
    }

    let current = 0;
    const increment = targetNumber / 80; // Slower animation for better effect
    const duration = 16; // 60fps
    
    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current) + suffix;
      
      if (current >= targetNumber) {
        element.textContent = finalValue;
        clearInterval(timer);
      }
    }, duration);
  }

  setupProjectInteractions() {
    this.projectCards.forEach(card => {
      // Enhanced hover effects
      card.addEventListener('mouseenter', () => {
        this.addProjectHoverEffect(card);
      });

      card.addEventListener('mouseleave', () => {
        this.removeProjectHoverEffect(card);
      });

      // Track project clicks
      const projectLinks = card.querySelectorAll('.btn-project');
      projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const projectTitle = card.querySelector('h3').textContent;
          const linkType = link.textContent.toLowerCase();
          this.trackProjectInteraction(projectTitle, linkType);
        });
      });
    });
  }

  addProjectHoverEffect(card) {
    // Add particle effect
    this.createProjectParticles(card);
    
    // Animate tech tags
    const techTags = card.querySelectorAll('.tech-tag');
    techTags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'scale(1.1)';
        tag.style.background = 'rgba(255, 255, 255, 0.3)';
      }, index * 50);
    });
  }

  removeProjectHoverEffect(card) {
    // Reset tech tags
    const techTags = card.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
      tag.style.transform = 'scale(1)';
      tag.style.background = 'rgba(255, 255, 255, 0.2)';
    });
  }

  createProjectParticles(card) {
    const particles = card.querySelectorAll('.project-particle');
    if (particles.length > 0) return; // Avoid duplicates

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'project-particle';
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #0ea5e9, #06b6d4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: 0;
      `;
      
      const overlay = card.querySelector('.project-overlay');
      if (overlay) {
        overlay.style.position = 'relative';
        overlay.appendChild(particle);
        
        // Animate particle
        particle.animate([
          { 
            opacity: 1, 
            transform: 'translate(0, 0) scale(1)' 
          },
          { 
            opacity: 0, 
            transform: `translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px) scale(0)` 
          }
        ], {
          duration: 1200,
          easing: 'ease-out'
        }).onfinish = () => particle.remove();
      }
    }
  }

  animateProjectCard(card) {
    // Staggered animation for project cards
    const delay = Array.from(this.projectCards).indexOf(card) * 150;
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, delay);
  }

  setupParallaxEffects() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      // Hero background parallax
      const heroBg = document.querySelector('.portfolio-hero-bg');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      // Profile avatar subtle movement
      const avatar = document.querySelector('.avatar-img');
      if (avatar && scrolled < window.innerHeight) {
        avatar.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 + scrolled * 0.0001})`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  setupTypewriterEffect() {
    const profileDescription = document.querySelector('.profile-description');
    if (profileDescription) {
      const text = profileDescription.textContent;
      profileDescription.textContent = '';
      
      let index = 0;
      const typeWriter = () => {
        if (index < text.length) {
          profileDescription.textContent += text.charAt(index);
          index++;
          setTimeout(typeWriter, 30);
        }
      };
      
      // Start typewriter after page load
      setTimeout(typeWriter, 1500);
    }
  }

  setupContactTracking() {
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = btn.classList[1]; // whatsapp, linkedin, etc.
        this.trackContactClick(platform);
        
        // Visual feedback
        this.addClickEffect(btn);
      });
    });

    // Track profile links
    const profileLinks = document.querySelectorAll('.profile-links .btn');
    profileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const platform = link.href.includes('github') ? 'github' : 'linkedin';
        this.trackProfileLinkClick(platform);
      });
    });
  }

  addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
  }

  // Search functionality
  searchProjects(query) {
    const searchTerm = query.toLowerCase();
    
    this.projectCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const techTags = Array.from(card.querySelectorAll('.tech-tag'))
        .map(tag => tag.textContent.toLowerCase())
        .join(' ');
      
      const content = `${title} ${description} ${techTags}`;
      
      if (content.includes(searchTerm)) {
        this.showProject(card, 0);
      } else {
        this.hideProject(card);
      }
    });
  }

  // GitHub stats integration
  async loadGitHubStats() {
    try {
      const response = await fetch('https://api.github.com/users/kair069');
      const data = await response.json();
      
      // Update stats
      const statsElements = document.querySelectorAll('.stat-number');
      if (statsElements[0]) {
        statsElements[0].textContent = data.public_repos + '+';
      }
      
      console.log('GitHub stats loaded:', data);
    } catch (error) {
      console.log('GitHub API not accessible:', error);
    }
  }

  // Dynamic project loading
  async loadProjectDetails(projectId) {
    // Simulate loading project details
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: projectId,
          technologies: ['React', 'Node.js', 'MongoDB'],
          features: ['Real-time updates', 'Responsive design', 'API integration'],
          demo_url: '#',
          github_url: '#'
        });
      }, 500);
    });
  }

  // Tracking methods
  trackFilterUsage(filter) {
    this.trackEvent('Portfolio', 'Filter Used', filter);
  }

  trackProjectInteraction(projectTitle, linkType) {
    this.trackEvent('Portfolio', 'Project Interaction', `${projectTitle} - ${linkType}`);
  }

  trackContactClick(platform) {
    this.trackEvent('Portfolio', 'Contact Click', platform);
  }

  trackProfileLinkClick(platform) {
    this.trackEvent('Portfolio', 'Profile Link', platform);
  }

  trackEvent(category, action, label) {
    if (typeof trackEvent === 'function') {
      trackEvent(category, action, label);
    } else {
      console.log(`Portfolio Event: ${category} - ${action} - ${label}`);
    }
  }

  // Public methods
  setFilter(filter) {
    this.filterProjects(filter);
    const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (filterBtn) {
      this.updateActiveFilter(filterBtn);
    }
  }

  refresh() {
    this.setFilter('all');
    this.loadGitHubStats();
  }

  getProjectsByCategory(category) {
    return Array.from(this.projectCards).filter(card => {
      const categories = card.getAttribute('data-category');
      return categories && categories.includes(category);
    });
  }
}

// Utility functions
function createProjectSearchBar() {
  const searchBar = document.createElement('div');
  searchBar.innerHTML = `
    <div class="portfolio-search" style="max-width: 500px; margin: 0 auto 2rem; position: relative;">
      <input type="text" id="portfolioSearch" placeholder="Buscar proyectos..." 
             style="width: 100%; padding: 15px 20px 15px 60px; border: 2px solid rgba(14, 165, 233, 0.2); border-radius: 30px; font-size: 1rem; background: white;">
      <i class="fas fa-search" style="position: absolute; left: 25px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 1.2rem;"></i>
    </div>
  `;
  
  const filterSection = document.querySelector('.portfolio-filters .container');
  if (filterSection) {
    filterSection.insertBefore(searchBar, filterSection.firstChild);
    
    // Search functionality
    const searchInput = document.getElementById('portfolioSearch');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        window.portfolioManager.searchProjects(e.target.value);
      }, 300);
    });
  }
}

// GitHub contributions widget
function createGitHubWidget() {
  const widget = document.createElement('div');
  widget.innerHTML = `
    <div class="github-widget" style="margin: 2rem 0; text-align: center;">
      <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Actividad en GitHub</h3>
      <img src="https://github-readme-stats.vercel.app/api?username=kair069&show_icons=true&theme=radical" 
           alt="GitHub Stats" style="max-width: 100%; border-radius: 10px;">
      <br><br>
      <img src="https://github-readme-streak-stats.herokuapp.com/?user=kair069&theme=radical" 
           alt="GitHub Streak" style="max-width: 100%; border-radius: 10px;">
    </div>
  `;
  
  const contactSection = document.querySelector('.contact-section .container');
  if (contactSection) {
    contactSection.appendChild(widget);
  }
}

// Dynamic background particles
function createBackgroundParticles() {
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
  
  const hero = document.querySelector('.portfolio-hero');
  if (hero) {
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(6, 182, 212, 0.6);
        border-radius: 50%;
        animation: float-particle ${8 + Math.random() * 15}s infinite linear;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 8}s;
      `;
      particlesContainer.appendChild(particle);
    }
  }
}

// Performance optimization
function optimizeAnimations() {
  // Reduce animations on mobile devices
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.transition = 'all 0.2s ease';
    });
  }
  
  // Pause animations when page is not visible
  document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('[style*="animation"]');
    particles.forEach(particle => {
      if (document.hidden) {
        particle.style.animationPlayState = 'paused';
      } else {
        particle.style.animationPlayState = 'running';
      }
    });
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main portfolio manager
  window.portfolioManager = new PortfolioManager();
  
  // Create additional widgets (optional)
  // createProjectSearchBar();
  // createGitHubWidget();
  
  // Create background effects
  createBackgroundParticles();
  
  // Optimize for performance
  optimizeAnimations();
  
  // Load GitHub stats
  setTimeout(() => {
    window.portfolioManager.loadGitHubStats();
  }, 2000);
  
  console.log('🚀 Portfolio fully loaded and optimized!');
});

// Handle scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioManager;
}