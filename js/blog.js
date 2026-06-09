// ===== BLOG JAVASCRIPT - CLASESMAT =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INICIALIZACIÓN =====
    initializeFilters();
    initializeSearch();
    initializeLoadMore();
    initializeNewsletter();
    initializeScrollEffects();
    initializeRedirectHandlers();
    
    // ===== SISTEMA DE FILTROS =====
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const articles = document.querySelectorAll('.article-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Actualizar botones activos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar artículos con animación
                articles.forEach(article => {
                    const articleCategory = article.getAttribute('data-category');
                    
                    if (category === 'all' || articleCategory === category) {
                        article.style.display = 'block';
                        article.classList.add('fade-in');
                        setTimeout(() => {
                            article.classList.remove('fade-in');
                        }, 500);
                    } else {
                        article.style.display = 'none';
                    }
                });
                
                // Animación de contador
                updateVisibleCount();
            });
        });
    }
    
    // ===== SISTEMA DE BÚSQUEDA =====
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const articles = document.querySelectorAll('.article-card');
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.toLowerCase().trim();
            
            // Debounce para mejor rendimiento
            searchTimeout = setTimeout(() => {
                articles.forEach(article => {
                    const title = article.querySelector('h3').textContent.toLowerCase();
                    const content = article.querySelector('p').textContent.toLowerCase();
                    const category = article.querySelector('.category').textContent.toLowerCase();
                    
                    const isVisible = title.includes(searchTerm) || 
                                    content.includes(searchTerm) || 
                                    category.includes(searchTerm);
                    
                    if (isVisible) {
                        article.style.display = 'block';
                        article.classList.add('fade-in');
                    } else {
                        article.style.display = 'none';
                    }
                });
                
                updateVisibleCount();
                
                // Si no hay resultados, mostrar mensaje
                showSearchResults(searchTerm);
                
            }, 300);
        });
        
        // Limpiar búsqueda con Escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.blur();
                resetFilters();
            }
        });
    }
    
    // ===== CARGAR MÁS ARTÍCULOS =====
    function initializeLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const articlesGrid = document.getElementById('articlesGrid');
        
        // Artículos adicionales para simular carga
        const additionalArticles = [
            {
                category: 'programacion',
                title: 'Web Scraping con Python: Beautifulsoup y Selenium',
                excerpt: 'Aprende a extraer datos de sitios web de forma automatizada usando las mejores herramientas de Python.',
                author: 'Ing. Pedro Vargas',
                date: '1 Jun 2025',
                readTime: '22 min',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
                url: 'https://wordpress7.com/web-scraping-python'
            },
            {
                category: 'matematicas',
                title: 'Álgebra Lineal para Machine Learning',
                excerpt: 'Conceptos fundamentales de álgebra lineal aplicados al aprendizaje automático y ciencia de datos.',
                author: 'Dr. Miguel Ángel',
                date: '28 May 2025',
                readTime: '30 min',
                image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
                url: 'https://wordpress8.com/algebra-lineal-ml'
            },
            {
                category: 'estadistica',
                title: 'Análisis de Varianza (ANOVA) Paso a Paso',
                excerpt: 'Guía completa para realizar análisis de varianza y interpretar sus resultados correctamente.',
                author: 'Dra. Sofia Herrera',
                date: '25 May 2025',
                readTime: '16 min',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
                url: 'https://wordpress9.com/anova-tutorial'
            }
        ];
        
        let articlesLoaded = 0;
        const articlesPerLoad = 3;
        
        loadMoreBtn.addEventListener('click', function() {
            // Animación de carga
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            this.disabled = true;
            
            setTimeout(() => {
                const articlesToAdd = additionalArticles.slice(articlesLoaded, articlesLoaded + articlesPerLoad);
                
                articlesToAdd.forEach((articleData, index) => {
                    const articleElement = createArticleElement(articleData);
                    articlesGrid.appendChild(articleElement);
                    
                    // Animación escalonada
                    setTimeout(() => {
                        articleElement.classList.add('fade-in');
                    }, index * 100);
                });
                
                articlesLoaded += articlesToAdd.length;
                
                // Restaurar botón
                this.innerHTML = '<i class="fas fa-plus"></i> Cargar más artículos';
                this.disabled = false;
                
                // Ocultar botón si no hay más artículos
                if (articlesLoaded >= additionalArticles.length) {
                    this.style.display = 'none';
                    
                    // Mostrar mensaje de final
                    const endMessage = document.createElement('p');
                    endMessage.textContent = '🎉 ¡Has visto todos nuestros artículos!';
                    endMessage.style.textAlign = 'center';
                    endMessage.style.color = '#666';
                    endMessage.style.fontStyle = 'italic';
                    endMessage.style.marginTop = '2rem';
                    this.parentElement.appendChild(endMessage);
                }
                
                updateVisibleCount();
                
            }, 1000);
        });
    }
    
    // ===== NEWSLETTER =====
    function initializeNewsletter() {
        const subscribeBtn = document.getElementById('subscribeBtn');
        const emailInput = document.getElementById('newsletterEmail');
        
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                emailInput.focus();
                return;
            }
            
            // Animación de envío
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suscribiendo...';
            this.disabled = true;
            
            // Simular envío
            setTimeout(() => {
                showNotification('¡Gracias por suscribirte! 🎉', 'success');
                emailInput.value = '';
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Efecto confetti (opcional)
                createConfetti();
                
            }, 2000);
        });
        
        // Suscripción con Enter
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                subscribeBtn.click();
            }
        });
    }
    
    // ===== EFECTOS DE SCROLL =====
    function initializeScrollEffects() {
        // Progress bar de scroll
        const progressBar = document.querySelector('.scroll-progress');
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (progressBar) {
                progressBar.style.width = scrolled + '%';
            }
        });
        
        // Parallax en hero
        const hero = document.querySelector('.blog-hero');
        const heroContent = document.querySelector('.hero-content');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
        
        // Animaciones al scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos
        document.querySelectorAll('.article-card, .newsletter-section, .cta-section').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== REDIRECCIÓN A WORDPRESS =====
    function initializeRedirectHandlers() {
        const readMoreLinks = document.querySelectorAll('.read-more');
        
        readMoreLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const url = this.getAttribute('data-url');
                if (url) {
                    // Animación de clic
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Mostrar loading
                    showNotification('Redirigiendo al artículo...', 'info');
                    
                    // Redireccionar después de un breve delay
                    setTimeout(() => {
                        window.open(url, '_blank');
                    }, 500);
                }
            });
        });
    }
    
    // ===== FUNCIONES AUXILIARES =====
    
    function createArticleElement(data) {
        const article = document.createElement('article');
        article.className = 'article-card';
        article.setAttribute('data-category', data.category);
        
        const categoryColors = {
            'matematicas': 'Matemáticas',
            'programacion': 'Programación',
            'estadistica': 'Estadística',
            'tutoriales': 'Tutoriales'
        };
        
        article.innerHTML = `
            <div class="article-image">
                <img src="${data.image}" alt="${data.title}" loading="lazy">
                <div class="read-time">${data.readTime}</div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="category">${categoryColors[data.category]}</span>
                    <span class="date">${data.date}</span>
                </div>
                <h3>${data.title}</h3>
                <p>${data.excerpt}</p>
                <div class="article-footer">
                    <div class="author">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" alt="Autor">
                        <span>${data.author}</span>
                    </div>
                    <a href="#" class="read-more" data-url="${data.url}">
                        Leer más <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        
        // Agregar event listener al nuevo enlace
        const readMoreLink = article.querySelector('.read-more');
        readMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            if (url) {
                showNotification('Redirigiendo al artículo...', 'info');
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 500);
            }
        });
        
        return article;
    }
    
    function updateVisibleCount() {
        const visibleArticles = document.querySelectorAll('.article-card[style*="block"], .article-card:not([style*="none"])').length;
        const totalArticles = document.querySelectorAll('.article-card').length;
        
        // Actualizar contador en algún lugar de la UI si existe
        const counter = document.getElementById('articlesCounter');
        if (counter) {
            counter.textContent = `Mostrando ${visibleArticles} de ${totalArticles} artículos`;
        }
    }
    
    function resetFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const articles = document.querySelectorAll('.article-card');
        const searchInput = document.getElementById('searchInput');
        
        // Resetear filtros
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButtons[0].classList.add('active'); // "Todos"
        
        // Mostrar todos los artículos
        articles.forEach(article => {
            article.style.display = 'block';
        });
        
        // Limpiar búsqueda
        searchInput.value = '';
        
        updateVisibleCount();
    }
    
    function showSearchResults(searchTerm) {
        const articlesGrid = document.getElementById('articlesGrid');
        const visibleArticles = document.querySelectorAll('.article-card[style*="block"], .article-card:not([style*="none"])').length;
        
        // Remover mensaje anterior si existe
        const existingMessage = document.getElementById('searchMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Si hay término de búsqueda pero no resultados
        if (searchTerm && visibleArticles === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.id = 'searchMessage';
            noResultsMessage.className = 'search-message';
            noResultsMessage.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No se encontraron resultados</h3>
                    <p>No hay artículos que coincidan con "${searchTerm}"</p>
                    <button onclick="resetSearchAndFilters()" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-refresh"></i> Ver todos los artículos
                    </button>
                </div>
            `;
            articlesGrid.appendChild(noResultsMessage);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Remover notificación anterior si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
        
        // Cerrar al hacer clic
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    function createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}vw;
                z-index: 10000;
                pointer-events: none;
                border-radius: 50%;
                animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 4000);
        }
    }
    
    // ===== FUNCIONES GLOBALES =====
    window.resetSearchAndFilters = function() {
        resetFilters();
        const searchMessage = document.getElementById('searchMessage');
        if (searchMessage) {
            searchMessage.remove();
        }
    };
    
    // ===== SMOOTH SCROLL PARA ENLACES INTERNOS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // ===== LAZY LOADING PARA IMÁGENES =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== TECLADO SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K para búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            searchInput.focus();
            searchInput.select();
        }
        
        // Escape para cerrar modales/búsquedas
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (document.activeElement === searchInput) {
                searchInput.blur();
                resetFilters();
            }
        }
    });
    
    // ===== PERFORMANCE MONITORING =====
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Blog Performance:', {
                        'Dom Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        'Page Load Time': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        'Total Load Time': Math.round(perfData.loadEventEnd - perfData.navigationStart)
                    });
                }, 1000);
            });
        }
    }
    
    logPerformance();
    
    // ===== ANALYTICS TRACKING (simulado) =====
    function trackEvent(category, action, label) {
        console.log('Analytics Event:', { category, action, label });
        // Aquí integrarías con Google Analytics, etc.
    }
    
    // Tracking de clics en artículos
    document.addEventListener('click', function(e) {
        if (e.target.closest('.read-more')) {
            const articleTitle = e.target.closest('.article-card').querySelector('h3').textContent;
            trackEvent('Blog', 'Article Click', articleTitle);
        }
        
        if (e.target.closest('.filter-btn')) {
            const category = e.target.closest('.filter-btn').getAttribute('data-category');
            trackEvent('Blog', 'Filter Click', category);
        }
        
        if (e.target.closest('#subscribeBtn')) {
            trackEvent('Blog', 'Newsletter Subscribe', 'Footer');
        }
    });
    
    console.log('✅ Blog JavaScript initialized successfully!');
});

// ===== CSS ANIMATIONS FOR CONFETTI =====
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
    
    .search-message {
        grid-column: 1 / -1;
        margin: 2rem 0;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
            transform: translateY(-100%) !important;
        }
        
        .notification.show {
            transform: translateY(0) !important;
        }
    }
`;
document.head.appendChild(style);