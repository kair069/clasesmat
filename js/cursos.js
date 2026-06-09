// JavaScript Interactivo para Cursos - ClasesMat
// Funcionalidades avanzadas para experiencia de usuario premium

document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos del DOM
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');
  const searchInput = document.getElementById('courseSearch');
  const curriculumSections = document.querySelectorAll('.curriculum-section');
  
  // Estado de la aplicación
  let activeFilter = 'all';
  let searchTerm = '';
  
  // Inicialización
  initializeApp();
  
  function initializeApp() {
    setupFilterSystem();
    setupSearchSystem();
    setupCurriculumToggle();
    setupScrollAnimations();
    setupCourseInteractions();
    setupAnalytics();
    
    console.log('🚀 ClasesMat Cursos App inicializada correctamente');
  }
  
  // SISTEMA DE FILTROS
  // SISTEMA DE FILTROS
  function setupFilterSystem() {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        setActiveFilter(filter);
        filterCourses();
      });
    });
  }
  
  function setActiveFilter(filter) {
    // Remover clase active de todos los botones
    filterBtns.forEach(btn => btn.classList.remove('active'));
    
    // Agregar clase active al botón seleccionado
    const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
    
    activeFilter = filter;
    trackEvent('filter_change', filter);
  }
  
  function filterCourses() {
    courseCards.forEach(card => {
      const categories = card.getAttribute('data-category');
      const shouldShow = shouldShowCard(categories);
      
      if (shouldShow) {
        showCard(card);
      } else {
        hideCard(card);
      }
    });
    
    updateResultsCount();
  }
  
  function shouldShowCard(categories) {
    if (activeFilter === 'all') return true;
    
    if (!categories) return false;
    
    const cardCategories = categories.split(' ');
    return cardCategories.includes(activeFilter);
  }
  
  function showCard(card) {
    card.style.display = 'block';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 50);
  }
  
  function hideCard(card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      card.style.display = 'none';
    }, 300);
  }
  
  // SISTEMA DE BÚSQUEDA
  function setupSearchSystem() {
    if (searchInput) {
      searchInput.addEventListener('input', debounce(handleSearch, 300));
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      });
    }
  }
  
  function handleSearch() {
    searchTerm = searchInput.value.toLowerCase().trim();
    filterCourses();
    trackEvent('search_performed', searchTerm);
  }
  
  function shouldShowCard(categories) {
    // Filtro por categoría
    const matchesFilter = activeFilter === 'all' || 
                         (categories && categories.split(' ').includes(activeFilter));
    
    // Filtro por búsqueda
    let matchesSearch = true;
    if (searchTerm) {
      const card = [...courseCards].find(c => c.getAttribute('data-category') === categories);
      if (card) {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const topics = Array.from(card.querySelectorAll('.topic-item'))
                          .map(topic => topic.textContent.toLowerCase());
        
        const searchableContent = [title, description, ...topics].join(' ');
        matchesSearch = searchableContent.includes(searchTerm);
      }
    }
    
    return matchesFilter && matchesSearch;
  }
  
  function updateResultsCount() {
    const visibleCards = Array.from(courseCards).filter(card => 
      card.style.display !== 'none'
    ).length;
    
    // Actualizar contador si existe
    const resultsCounter = document.getElementById('resultsCounter');
    if (resultsCounter) {
      resultsCounter.textContent = `${visibleCards} curso${visibleCards !== 1 ? 's' : ''} encontrado${visibleCards !== 1 ? 's' : ''}`;
    }
  }
  
  // CURRICULUM TOGGLE
  function setupCurriculumToggle() {
    curriculumSections.forEach(section => {
      const header = section.querySelector('h4');
      const content = section.querySelector('.topics-grid');
      
      if (header && content) {
        // Inicialmente ocultar contenido
        content.style.display = 'none';
        header.style.cursor = 'pointer';
        header.innerHTML += ' <i class="fas fa-chevron-down" style="margin-left: auto; transition: transform 0.3s ease;"></i>';
        
        header.addEventListener('click', function() {
          const isVisible = content.style.display !== 'none';
          const chevron = header.querySelector('.fa-chevron-down');
          
          if (isVisible) {
            // Ocultar
            content.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
              content.style.display = 'none';
            }, 300);
            chevron.style.transform = 'rotate(0deg)';
          } else {
            // Mostrar
            content.style.display = 'grid';
            content.style.animation = 'slideDown 0.3s ease';
            chevron.style.transform = 'rotate(180deg)';
          }
          
          trackEvent('curriculum_toggle', section.querySelector('h4').textContent);
        });
      }
    });
  }
  
  // ANIMACIONES DE SCROLL
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Animación escalonada para grids
          if (entry.target.classList.contains('courses-grid')) {
            const cards = entry.target.querySelectorAll('.course-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);
    
    // Observar elementos
    document.querySelectorAll('.section-title, .courses-grid, .course-card').forEach(el => {
      observer.observe(el);
    });
  }
  
  // INTERACCIONES DE CURSOS
  function setupCourseInteractions() {
    courseCards.forEach(card => {
      // Hover effects
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        trackEvent('course_hover', this.querySelector('h3').textContent);
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
      
      // Click en card para expandir
      card.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-course')) {
          expandCourse(this);
        }
      });
    });
  }
  
  function expandCourse(card) {
    const courseTitle = card.querySelector('h3').textContent;
    
    // Crear modal o expandir in-place
    const isExpanded = card.classList.contains('expanded');
    
    if (isExpanded) {
      collapseCourse(card);
    } else {
      // Colapsar otros cursos expandidos
      document.querySelectorAll('.course-card.expanded').forEach(expandedCard => {
        if (expandedCard !== card) {
          collapseCourse(expandedCard);
        }
      });
      
      expandCourseDetails(card);
    }
    
    trackEvent('course_expand', courseTitle);
  }
  
  function expandCourseDetails(card) {
    card.classList.add('expanded');
    
    // Agregar contenido expandido si no existe
    if (!card.querySelector('.expanded-content')) {
      const expandedContent = createExpandedContent(card);
      card.appendChild(expandedContent);
    }
    
    // Smooth scroll al curso
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  function collapseCourse(card) {
    card.classList.remove('expanded');
    const expandedContent = card.querySelector('.expanded-content');
    if (expandedContent) {
      expandedContent.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        expandedContent.remove();
      }, 300);
    }
  }
  
  function createExpandedContent(card) {
    const courseTitle = card.querySelector('h3').textContent;
    const expandedDiv = document.createElement('div');
    expandedDiv.className = 'expanded-content';
    expandedDiv.innerHTML = `
      <div class="expanded-inner">
        <h4>Información Detallada del Curso</h4>
        <div class="course-details-grid">
          <div class="detail-section">
            <h5><i class="fas fa-clock"></i> Modalidad</h5>
            <p>Clases en vivo + grabadas<br>Horarios flexibles<br>Soporte 24/7</p>
          </div>
          <div class="detail-section">
            <h5><i class="fas fa-certificate"></i> Certificación</h5>
            <p>Certificado verificable<br>Reconocimiento profesional<br>Badge LinkedIn</p>
          </div>
          <div class="detail-section">
            <h5><i class="fas fa-users"></i> Metodología</h5>
            <p>Proyectos reales<br>Casos de estudio<br>Mentoría personalizada</p>
          </div>
          <div class="detail-section">
            <h5><i class="fas fa-tools"></i> Recursos</h5>
            <p>Material descargable<br>Códigos fuente<br>Bases de datos</p>
          </div>
        </div>
        <div class="instructor-profile">
          <img src="https://github.com/kair069.png" alt="Instructor" class="instructor-avatar">
          <div class="instructor-info">
            <h5>Tu Instructor Experto</h5>
            <p>Especialista en ${courseTitle} con 5+ años de experiencia enseñando a estudiantes de todas las carreras.</p>
            <div class="instructor-stats">
              <span><i class="fas fa-star"></i> 4.9/5 Rating</span>
              <span><i class="fas fa-users"></i> 500+ Estudiantes</span>
              <span><i class="fas fa-award"></i> Certificado</span>
            </div>
          </div>
        </div>
        <div class="action-buttons">
          <button class="btn-action primary" onclick="enrollCourse('${courseTitle}')">
            <i class="fas fa-graduation-cap"></i> Inscribirse Ahora
          </button>
          <button class="btn-action secondary" onclick="previewCourse('${courseTitle}')">
            <i class="fas fa-play"></i> Vista Previa Gratis
          </button>
          <button class="btn-action outline" onclick="contactInstructor('${courseTitle}')">
            <i class="fas fa-comments"></i> Consultar
          </button>
        </div>
      </div>
    `;
    
    return expandedDiv;
  }
  
  // ANALYTICS Y TRACKING
  function setupAnalytics() {
    // Track tiempo en página
    let startTime = Date.now();
    let timeOnPage = 0;
    
    setInterval(() => {
      timeOnPage = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', debounce(() => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestones
        if (maxScrollDepth >= 25 && !window.tracked25) {
          trackEvent('scroll_depth', '25%');
          window.tracked25 = true;
        }
        if (maxScrollDepth >= 50 && !window.tracked50) {
          trackEvent('scroll_depth', '50%');
          window.tracked50 = true;
        }
        if (maxScrollDepth >= 75 && !window.tracked75) {
          trackEvent('scroll_depth', '75%');
          window.tracked75 = true;
        }
        if (maxScrollDepth >= 90 && !window.tracked90) {
          trackEvent('scroll_depth', '90%');
          window.tracked90 = true;
        }
      }
    }, 500));
    
    // Track exit intent
    document.addEventListener('mouseout', function(e) {
      if (e.clientY <= 0) {
        trackEvent('exit_intent', 'top');
        showExitIntentModal();
      }
    });
    
    // Track cuando el usuario se va de la página
    window.addEventListener('beforeunload', function() {
      trackEvent('page_exit', `time_on_page_${timeOnPage}s`);
    });
  }
  
  function trackEvent(action, label, value = 1) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': 'Cursos',
        'event_label': label,
        'value': value
      });
    }
    
    // Console log para debugging
    console.log(`📊 Event tracked: ${action} - ${label}`);
    
    // Enviar a backend si es necesario
    sendEventToBackend(action, label, value);
  }
  
  function sendEventToBackend(action, label, value) {
    // Opcional: enviar eventos al backend
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        label,
        value,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(err => {
      console.log('Analytics backend not available:', err);
    });
  }
  
  function showExitIntentModal() {
    if (window.exitIntentShown) return;
    window.exitIntentShown = true;
    
    const modal = document.createElement('div');
    modal.className = 'exit-intent-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-inner">
          <h3>¡Espera! 🎓</h3>
          <p>Antes de irte, obtén un <strong>20% de descuento</strong> en cualquier curso</p>
          <div class="discount-code">
            <span>Código: <strong>CLASESMAT20</strong></span>
          </div>
          <div class="modal-actions">
            <a href="https://wa.me/51968269924?text=Hola, quiero aplicar el descuento CLASESMAT20" 
               target="_blank" class="btn-modal primary">
              <i class="fab fa-whatsapp"></i> Usar Descuento
            </a>
            <button class="btn-modal secondary" onclick="closeExitModal()">
              Tal vez después
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.modal-close').addEventListener('click', closeExitModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeExitModal);
    
    trackEvent('exit_intent_modal', 'shown');
  }
  
  // FUNCIONES PÚBLICAS
  window.enrollCourse = function(courseTitle) {
    trackEvent('enroll_click', courseTitle);
    
    const message = encodeURIComponent(`¡Hola! Quiero inscribirme en el curso "${courseTitle}". ¿Podrían darme más información sobre fechas y precios?`);
    window.open(`https://wa.me/51968269924?text=${message}`, '_blank');
  };
  
  window.previewCourse = function(courseTitle) {
    trackEvent('preview_click', courseTitle);
    
    // Mostrar modal de preview
    showPreviewModal(courseTitle);
  };
  
  window.contactInstructor = function(courseTitle) {
    trackEvent('contact_instructor', courseTitle);
    
    const message = encodeURIComponent(`Hola, tengo algunas preguntas sobre el curso "${courseTitle}". ¿Podrían ayudarme?`);
    window.open(`https://wa.me/51968269924?text=${message}`, '_blank');
  };
  
  window.closeExitModal = function() {
    const modal = document.querySelector('.exit-intent-modal');
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  };
  
  function showPreviewModal(courseTitle) {
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content large">
        <button class="modal-close">&times;</button>
        <div class="modal-inner">
          <h3>Vista Previa: ${courseTitle}</h3>
          <div class="preview-content">
            <div class="video-container">
              <div class="video-placeholder">
                <i class="fas fa-play-circle"></i>
                <p>Video de muestra del curso</p>
                <small>Duración: 15 minutos</small>
              </div>
            </div>
            <div class="preview-info">
              <h4>Lo que aprenderás:</h4>
              <ul>
                <li>Conceptos fundamentales</li>
                <li>Ejercicios prácticos paso a paso</li>
                <li>Aplicaciones en casos reales</li>
                <li>Herramientas y software</li>
              </ul>
              <div class="preview-stats">
                <div class="stat">
                  <i class="fas fa-users"></i>
                  <span>150+ estudiantes</span>
                </div>
                <div class="stat">
                  <i class="fas fa-star"></i>
                  <span>4.9/5 rating</span>
                </div>
                <div class="stat">
                  <i class="fas fa-certificate"></i>
                  <span>Certificado incluido</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-modal primary" onclick="enrollCourse('${courseTitle}')">
              <i class="fas fa-graduation-cap"></i> Inscribirse Ahora
            </button>
            <button class="btn-modal secondary" onclick="closePreviewModal()">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', closePreviewModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closePreviewModal);
  }
  
  window.closePreviewModal = function() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  };
  
  // UTILIDADES
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
  
  // CSS ANIMATIONS
  const additionalStyles = `
    .animate-in {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.6s ease;
    }
    
    .course-card {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    .expanded-content {
      margin-top: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border-radius: 12px;
      border: 1px solid #bae6fd;
      animation: slideDown 0.5s ease;
    }
    
    .course-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .detail-section h5 {
      color: var(--primary-color);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .detail-section p {
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-secondary);
    }
    
    .instructor-profile {
      display: flex;
      gap: 16px;
      background: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .instructor-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .instructor-info h5 {
      color: var(--primary-color);
      margin-bottom: 8px;
    }
    
    .instructor-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 8px;
    }
    
    .instructor-stats span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .btn-action {
      flex: 1;
      min-width: 120px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    
    .btn-action.primary {
      background: var(--gradient-accent);
      color: white;
    }
    
    .btn-action.secondary {
      background: var(--gradient-primary);
      color: white;
    }
    
    .btn-action.outline {
      background: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
    }
    
    .btn-action:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    /* Modal styles */
    .exit-intent-modal,
    .preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }
    
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
    }
    
    .modal-content {
      position: relative;
      background: white;
      border-radius: 20px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }
    
    .modal-content.large {
      max-width: 800px;
    }
    
    .modal-close {
      position: absolute;
      top: 15px;
      right: 20px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-secondary);
      z-index: 1;
    }
    
    .modal-inner {
      padding: 30px;
    }
    
    .modal-inner h3 {
      color: var(--primary-color);
      margin-bottom: 16px;
      text-align: center;
    }
    
    .discount-code {
      background: var(--gradient-accent);
      color: white;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      margin: 16px 0;
      font-weight: 600;
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    
    .btn-modal {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.3s ease;
    }
    
    .btn-modal.primary {
      background: var(--gradient-accent);
      color: white;
    }
    
    .btn-modal.secondary {
      background: var(--border-color);
      color: var(--text-primary);
    }
    
    .btn-modal:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Preview modal específico */
    .preview-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .video-container {
      aspect-ratio: 16/9;
      background: #f3f4f6;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .video-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--text-secondary);
    }
    
    .video-placeholder i {
      font-size: 3rem;
      color: var(--secondary-color);
      margin-bottom: 8px;
    }
    
    .preview-info ul {
      list-style: none;
      padding: 0;
    }
    
    .preview-info li {
      padding: 4px 0;
      position: relative;
      padding-left: 20px;
    }
    
    .preview-info li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-color);
      font-weight: bold;
    }
    
    .preview-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    
    .preview-stats .stat {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .preview-stats i {
      color: var(--secondary-color);
    }
    
    @media (max-width: 768px) {
      .course-details-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .instructor-profile {
        flex-direction: column;
        text-align: center;
      }
      
      .preview-content {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        width: 95%;
      }
    }
  `;
  
  // Agregar estilos
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
  
  console.log('✅ ClasesMat Cursos: Sistema interactivo cargado completamente');
});