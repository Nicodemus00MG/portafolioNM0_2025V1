/**
 * ====================================
 * NICOLÁS MUÑOZ - PERSONAL WEBSITE OPTIMIZED
 * HIGH PERFORMANCE FRONTEND DEVELOPMENT
 * ====================================
 */

// ====================================
// OPTIMIZED CONFIGURATION & CONSTANTS
// ====================================
const CONFIG = {
  typingSpeed: 60,        // Faster typing
  deletingSpeed: 30,      // Faster deleting
  pauseTime: 1500,        // Shorter pause
  scrollOffset: 100,
  animationDuration: 200, // Much faster animations
  debounceDelay: 50       // Faster debounce
};

const TYPING_TEXTS = [
  "Desarrollador Power Platform & Web Full Stack",
  "Especialista en React.js y JavaScript ES6+", 
  "Consultor Microsoft Azure y M365",
  "Automatización de procesos empresariales",
  "Experiencia de usuario y frontend moderno"
];

// ====================================
// OPTIMIZED UTILITY FUNCTIONS
// ====================================

/**
 * Fast debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Fast throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Optimized viewport check
 */
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight - offset && rect.bottom >= offset;
}

/**
 * Fast smooth scroll
 */
function smoothScrollTo(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
}

/**
 * Optimized notification system
 */
function showNotification(message, type = 'info', duration = 2000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</span>
    <span>${message}</span>
  `;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 16px',
    background: type === 'success' ? '#03dac6' : '#6c5ce7',
    color: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transform: 'translateX(100%)',
    transition: 'transform 0.2s ease-out',
    maxWidth: '300px',
    fontSize: '14px'
  });
  
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 200);
  }, duration);
}

// ====================================
// OPTIMIZED TYPING ANIMATION
// ====================================
class TypingAnimation {
  constructor(element, texts, config) {
    this.element = element;
    this.texts = texts;
    this.config = config;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    
    this.start();
  }
  
  start() {
    this.type();
  }
  
  type() {
    if (this.isPaused) return;
    
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    let speed = this.isDeleting ? this.config.deletingSpeed : this.config.typingSpeed;
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      speed = this.config.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
    }
    
    setTimeout(() => this.type(), speed);
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    this.type();
  }
}

// ====================================
// OPTIMIZED PROJECTS CAROUSEL
// ====================================
class ProjectsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.project-slide');
    this.navButtons = document.querySelectorAll('.carousel-btn');
    this.galleries = [];
    this.autoRotateInterval = null;
    
    this.init();
  }
  
  init() {
    this.initGalleries();
    this.showSlide(0);
    this.setupAutoRotation();
  }
  
  initGalleries() {
    this.slides.forEach((slide, index) => {
      const images = slide.querySelectorAll('.project-image');
      this.galleries.push({
        currentImage: 0,
        images: images
      });
      
      if (images.length > 0) {
        images[0].classList.add('active');
      }
    });
  }
  
  showSlide(index) {
    if (index === this.currentSlide) return;
    
    // Hide all slides
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show target slide
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
      this.navButtons[index].classList.add('active');
      this.currentSlide = index;
    }
  }
  
  changeGalleryImage(galleryIndex, direction) {
    const gallery = this.galleries[galleryIndex];
    if (!gallery || gallery.images.length <= 1) return;
    
    gallery.images[gallery.currentImage].classList.remove('active');
    
    if (direction === 1) {
      gallery.currentImage = (gallery.currentImage + 1) % gallery.images.length;
    } else {
      gallery.currentImage = gallery.currentImage === 0 ? gallery.images.length - 1 : gallery.currentImage - 1;
    }
    
    gallery.images[gallery.currentImage].classList.add('active');
  }
  
  setupAutoRotation() {
    // Auto-rotate galleries every 6 seconds (slower for better UX)
    this.autoRotateInterval = setInterval(() => {
      this.galleries.forEach((gallery, index) => {
        if (gallery.images.length > 1) {
          this.changeGalleryImage(index, 1);
        }
      });
    }, 6000);
  }
  
  destroy() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }
}

// ====================================
// OPTIMIZED NAVIGATION MANAGER
// ====================================
class NavigationManager {
  constructor() {
    this.currentSection = 'about';
    this.menuItems = document.querySelectorAll('.menu-item[data-section]');
    this.contentSections = document.querySelectorAll('.content-section');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateActiveStates();
  }
  
  bindEvents() {
    this.menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        this.showSection(sectionId);
        this.setActiveMenuItem(item);
      });
    });
  }
  
  showSection(sectionId) {
    // Hide all sections immediately
    this.contentSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section with minimal delay
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      // Use requestAnimationFrame for smooth transition
      requestAnimationFrame(() => {
        targetSection.classList.add('active');
      });
      this.currentSection = sectionId;
    }
  }
  
  setActiveMenuItem(activeItem) {
    this.menuItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
  }
  
  updateActiveStates() {
    const activeMenuItem = document.querySelector(`.menu-item[data-section="${this.currentSection}"]`);
    if (activeMenuItem) {
      this.setActiveMenuItem(activeMenuItem);
    }
  }
}

// ====================================
// OPTIMIZED SCROLL ANIMATIONS
// ====================================
class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.isObserving = false;
    this.init();
  }
  
  init() {
    this.setupElements();
    this.bindScrollEvent();
    this.checkElements();
  }
  
  setupElements() {
    const elementsToAnimate = [
      '.card',
      '.quick-stat',
      '.skill-category',
      '.timeline-item',
      '.noticia-item',
      '.proyecto-item',
      '.servicio-item'
    ];
    
    elementsToAnimate.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.add('animate-on-scroll');
        this.elements.push(el);
      });
    });
  }
  
  bindScrollEvent() {
    // Use optimized scroll handler
    const handleScroll = throttle(() => {
      this.checkElements();
    }, 16); // 60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  checkElements() {
    this.elements.forEach(element => {
      if (isInViewport(element, 50) && !element.classList.contains('animated')) {
        element.classList.add('animated');
      }
    });
  }
}

// ====================================
// SIMPLIFIED PARALLAX EFFECTS
// ====================================
class ParallaxEffects {
  constructor() {
    this.header = document.querySelector('.cabecera');
    this.isActive = true;
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    // Simplified parallax for better performance
    const handleScroll = throttle(() => {
      if (this.isActive) {
        this.updateParallax();
      }
    }, 16);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Disable parallax on mobile for better performance
    if (window.innerWidth <= 768) {
      this.isActive = false;
    }
  }
  
  updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3; // Reduced effect for performance
    
    this.header.style.transform = `translate3d(0, ${rate}px, 0)`;
  }
}

// ====================================
// OPTIMIZED CONTACT MANAGER
// ====================================
class ContactManager {
  constructor() {
    this.contactCards = document.querySelectorAll('.contact-card');
    this.ctaButtons = document.querySelectorAll('.cta-btn');
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.contactCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const link = card.querySelector('a');
        if (link && !link.href.startsWith('#')) {
          if (link.href.startsWith('tel:') || link.href.startsWith('mailto:')) {
            window.location.href = link.href;
          } else {
            window.open(link.href, '_blank', 'noopener,noreferrer');
          }
        }
      });
    });
    
    this.ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 100);
      });
    });
  }
}

// ====================================
// OPTIMIZED MAIN APPLICATION
// ====================================
class PersonalWebsite {
  constructor() {
    this.isLoaded = false;
    this.components = {};
    this.loadStartTime = performance.now();
    
    this.init();
  }
  
  async init() {
    try {
      // Wait for DOM
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize components
      this.initializeComponents();
      
      // Setup global events
      this.setupGlobalEvents();
      
      // Mark as loaded and show body
      this.finishLoading();
      
      console.log('✅ Website loaded successfully');
      
    } catch (error) {
      console.error('❌ Error initializing website:', error);
    }
  }
  
  initializeComponents() {
    // Initialize typing animation
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
      this.components.typing = new TypingAnimation(typedElement, TYPING_TEXTS, CONFIG);
    }
    
    // Initialize navigation
    this.components.navigation = new NavigationManager();
    
    // Initialize projects carousel
    this.components.projectsCarousel = new ProjectsCarousel();
    window.projectsCarousel = this.components.projectsCarousel;
    
    // Initialize contact manager
    this.components.contact = new ContactManager();
    
    // Initialize scroll animations
    this.components.scrollAnimations = new ScrollAnimations();
    
    // Initialize parallax effects (only on desktop)
    if (window.innerWidth > 768) {
      this.components.parallax = new ParallaxEffects();
    }
  }
  
  setupGlobalEvents() {
    // Handle external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="http"]');
      if (link) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (this.components.typing) {
        if (document.hidden) {
          this.components.typing.pause();
        } else {
          this.components.typing.resume();
        }
      }
    });
    
    // Handle resize
    window.addEventListener('resize', debounce(() => {
      // Disable parallax on mobile
      if (window.innerWidth <= 768 && this.components.parallax) {
        this.components.parallax.isActive = false;
      } else if (window.innerWidth > 768 && this.components.parallax) {
        this.components.parallax.isActive = true;
      }
    }, 250));
  }
  
  finishLoading() {
    const loadTime = performance.now() - this.loadStartTime;
    
    // Remove loading class and show content
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    this.isLoaded = true;
    
    // Show welcome notification
    setTimeout(() => {
      showNotification('¡Bienvenido a mi portafolio profesional!', 'success');
    }, 300);
    
    console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`);
  }
}

// ====================================
// GLOBAL FUNCTIONS - OPTIMIZED
// ====================================

/**
 * FUNCIÓN downloadCV() CORREGIDA - DESCARGA PDF REAL
 */
function downloadCV() {
  showNotification('🔄 Preparando descarga del CV...', 'info', 1000);
  
  // Ruta al CV PDF real en tu proyecto
  const cvPath = 'doc/Nicolás Muñoz CV Actualizado.pdf';
  
  // Crear enlace de descarga
  const link = document.createElement('a');
  link.href = cvPath;
  link.download = 'Nicolas_Munoz_CV_2025.pdf'; // Nombre para la descarga
  link.style.display = 'none';
  
  // Verificar si el archivo existe antes de descargar
  fetch(cvPath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // El archivo existe, proceder con la descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          showNotification('✅ CV descargado exitosamente', 'success');
        }, 500);
        
        console.log('📄 CV PDF downloaded successfully');
      } else {
        // El archivo no existe, mostrar error
        showNotification('❌ Error: CV no encontrado', 'error');
        console.error('CV file not found at:', cvPath);
      }
    })
    .catch(error => {
      // Error en la verificación, intentar descarga directa
      console.warn('Could not verify CV file, attempting direct download:', error);
      
      // Intentar descarga directa
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        showNotification('✅ CV descargado exitosamente', 'success');
      }, 500);
    });
}

// ALTERNATIVA SIMPLIFICADA (si tienes problemas con fetch)
function downloadCVSimple() {
  showNotification('🔄 Descargando CV...', 'info', 800);
  
  // Crear enlace directo al PDF
  const link = document.createElement('a');
  link.href = 'doc/Nicolás Muñoz CV Actualizado.pdf';
  link.download = 'Nicolas_Munoz_CV_2025.pdf';
  link.target = '_blank'; // Abrir en nueva pestaña como backup
  
  // Agregar al DOM temporalmente
  document.body.appendChild(link);
  
  // Hacer click programáticamente
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  
  // Notificación de éxito
  setTimeout(() => {
    showNotification('✅ CV descargado exitosamente', 'success');
  }, 300);
  
  console.log('📄 CV PDF download initiated');
}

/**
 * Projects Carousel Functions
 */
function changeSlide(index) {
  if (window.projectsCarousel) {
    window.projectsCarousel.showSlide(index);
  }
}

function changeGalleryImage(galleryIndex, direction) {
  if (window.projectsCarousel) {
    window.projectsCarousel.changeGalleryImage(galleryIndex, direction);
  }
}

/**
 * Scroll to section function
 */
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    smoothScrollTo(element, CONFIG.scrollOffset);
  }
}

/**
 * Enhanced Contact Functions
 */
function openEmailClient() {
  const subject = encodeURIComponent('Consulta Power Platform - Nicolás Muñoz');
  const body = encodeURIComponent(`Hola Nicolás,

Me interesa conocer más sobre tus servicios de automatización con Power Platform.

¿Podrías proporcionarme más información sobre:
- Soluciones de automatización
- Precios y tiempos de implementación
- Casos de éxito similares

Saludos cordiales.`);
  
  window.location.href = `mailto:jonimates2000@gmail.com?subject=${subject}&body=${body}`;
}

function openWhatsApp() {
  const message = encodeURIComponent('Hola Nicolás, me interesa conocer sobre tus servicios de Power Platform y automatización de procesos empresariales. ¿Podríamos conversar?');
  window.open(`https://wa.me/593992844325?text=${message}`, '_blank', 'noopener,noreferrer');
}

/**
 * Analytics tracking
 */
function trackEvent(eventName, properties = {}) {
  console.log(`📊 Event: ${eventName}`, properties);
}

// ====================================
// ERROR HANDLING - OPTIMIZED
// ====================================
window.addEventListener('error', (e) => {
  console.error('❌ JavaScript Error:', e.error);
  
  // Show user-friendly message for critical errors
  if (e.error && e.error.message) {
    showNotification('Ha ocurrido un error. Recargando página...', 'error');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled Promise Rejection:', e.reason);
  e.preventDefault();
});

// ====================================
// OPTIMIZED INITIALIZATION
// ====================================

// Initialize application immediately
const website = new PersonalWebsite();

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.website = website;
  window.showNotification = showNotification;
  window.CONFIG = CONFIG;
  console.log('🛠️ Development mode: Debug tools available');
}

// ====================================
// PERFORMANCE OPTIMIZATIONS
// ====================================

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    'img/nm_foto.jpg',
    'img/papps1.jpeg',
    'img/papps3.jpeg',
    'img/papps5.jpeg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Service Worker for caching (future implementation)
if ('serviceWorker' in navigator && 'caches' in window) {
  window.addEventListener('load', () => {
    // Future PWA implementation
    console.log('🔧 Service Worker support detected');
  });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  preloadCriticalImages();
});

// ====================================
// EXPORT FOR TESTING
// ====================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PersonalWebsite,
    TypingAnimation,
    NavigationManager,
    ProjectsCarousel,
    downloadCV,
    changeSlide,
    changeGalleryImage
  };
}