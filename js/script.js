/**
 * ====================================
 * NICOLÁS MUÑOZ - PERSONAL WEBSITE
 * Professional Frontend Development
 * ====================================
 */

// ====================================
// CONFIGURATION & CONSTANTS
// ====================================
const CONFIG = {
  typingSpeed: 80,
  deletingSpeed: 40,
  pauseTime: 2000,
  scrollOffset: 100,
  animationDuration: 600,
  debounceDelay: 100
};

const TYPING_TEXTS = [
  "Desarrollador Power Platform & Web Full Stack",
  "Especialista en React.js y JavaScript ES6+", 
  "Consultor Microsoft Azure y M365",
  "Automatización de procesos empresariales",
  "Experiencia de usuario y frontend moderno",
  "Estudiante de Ingeniería en Tecnologías TI"
];

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Debounce function to limit function calls
 */
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

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</span>
    <span>${message}</span>
  `;
  
  // Styling
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 20px',
    background: type === 'success' ? 'var(--success-color)' : 'var(--primary-purple)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-medium)',
    boxShadow: 'var(--shadow-heavy)',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-out',
    maxWidth: '300px',
    wordWrap: 'break-word'
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  // Auto remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// ====================================
// TYPING ANIMATION CLASS
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
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      // Deleting characters
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      // Adding characters
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    let speed = this.isDeleting ? this.config.deletingSpeed : this.config.typingSpeed;
    
    // Add some randomness to typing speed for natural effect
    speed += Math.random() * 50;
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      // Finished typing current text
      speed = this.config.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      // Finished deleting current text
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
// PROJECTS CAROUSEL MANAGEMENT
// ====================================
class ProjectsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.project-slide');
    this.navButtons = document.querySelectorAll('.carousel-btn');
    this.galleries = [];
    
    this.init();
  }
  
  init() {
    this.initGalleries();
    this.showSlide(0);
    this.setupAutoRotation();
  }
  
  initGalleries() {
    // Initialize galleries for each project
    this.slides.forEach((slide, index) => {
      const images = slide.querySelectorAll('.project-image');
      this.galleries.push({
        currentImage: 0,
        images: images
      });
      
      // Set first image as active
      if (images.length > 0) {
        images[0].classList.add('active');
      }
    });
  }
  
  showSlide(index) {
    // Hide all slides
    this.slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Remove active from all nav buttons
    this.navButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show target slide
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
      this.navButtons[index].classList.add('active');
      this.currentSlide = index;
    }
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }
  
  prevSlide() {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.showSlide(prevIndex);
  }
  
  changeGalleryImage(galleryIndex, direction) {
    const gallery = this.galleries[galleryIndex];
    if (!gallery || gallery.images.length <= 1) return;
    
    // Remove active from current image
    gallery.images[gallery.currentImage].classList.remove('active');
    
    // Calculate next image index
    if (direction === 1) {
      gallery.currentImage = (gallery.currentImage + 1) % gallery.images.length;
    } else {
      gallery.currentImage = gallery.currentImage === 0 ? gallery.images.length - 1 : gallery.currentImage - 1;
    }
    
    // Add active to new image
    gallery.images[gallery.currentImage].classList.add('active');
  }
  
  setupAutoRotation() {
    // Auto-rotate galleries every 4 seconds
    setInterval(() => {
      this.galleries.forEach((gallery, index) => {
        if (gallery.images.length > 1) {
          this.changeGalleryImage(index, 1);
        }
      });
    }, 4000);
  }
}

// ====================================
// CONTACT FORM MANAGEMENT
// ====================================
class ContactManager {
  constructor() {
    this.contactCards = document.querySelectorAll('.contact-card');
    this.ctaButtons = document.querySelectorAll('.cta-btn');
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.addAnimations();
  }
  
  bindEvents() {
    // Track contact card interactions
    this.contactCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const link = card.querySelector('a');
        if (link) {
          trackEvent('contact_card_click', {
            method: index === 0 ? 'email' : index === 1 ? 'phone' : 'linkedin',
            card_index: index
          });
        }
      });
    });
    
    // Track CTA button clicks
    this.ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const isEmail = button.classList.contains('primary');
        trackEvent('cta_click', {
          type: isEmail ? 'email' : 'whatsapp',
          button_text: button.textContent.trim()
        });
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      });
    });
  }
  
  addAnimations() {
    // Stagger animation for contact cards
    this.contactCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-on-scroll');
    });
  }
}

// ====================================
// ENHANCED NAVIGATION MANAGER
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
        
        // Track navigation
        trackEvent('navigation_click', {
          section: sectionId,
          from_section: this.currentSection
        });
      });
    });
  }
  
  showSection(sectionId) {
    // Hide all sections with fade out
    this.contentSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section with fade in
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      setTimeout(() => {
        targetSection.classList.add('active');
      }, 150);
      this.currentSection = sectionId;
      
      // If showing projects, reset carousel
      if (sectionId === 'projects' && window.projectsCarousel) {
        window.projectsCarousel.showSlide(0);
      }
    }
  }
  
  setActiveMenuItem(activeItem) {
    // Remove active class from all menu items
    this.menuItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked item
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
// SCROLL ANIMATIONS
// ====================================
class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.init();
  }
  
  init() {
    this.setupElements();
    this.bindScrollEvent();
    this.checkElements(); // Initial check
  }
  
  setupElements() {
    // Add animation classes to elements
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
    const handleScroll = throttle(() => {
      this.checkElements();
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
  }
  
  checkElements() {
    this.elements.forEach(element => {
      if (isInViewport(element, 100) && !element.classList.contains('animated')) {
        element.classList.add('animated');
      }
    });
  }
}

// ====================================
// PARALLAX EFFECTS
// ====================================
class ParallaxEffects {
  constructor() {
    this.header = document.querySelector('.cabecera');
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    const handleScroll = throttle(() => {
      this.updateParallax();
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll);
  }
  
  updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Apply transform with GPU acceleration
    this.header.style.transform = `translate3d(0, ${rate}px, 0)`;
  }
}

// ====================================
// SKILL INTERACTIONS
// ====================================
class SkillInteractions {
  constructor() {
    this.skillChips = document.querySelectorAll('.skill-chip');
    this.colors = [
      'linear-gradient(135deg, #6c5ce7, #5f3dc4)',
      'linear-gradient(135deg, #fd79a8, #e84393)',
      'linear-gradient(135deg, #fdcb6e, #e17055)',
      'linear-gradient(135deg, #00b894, #00a085)',
      'linear-gradient(135deg, #0984e3, #74b9ff)'
    ];
    
    this.init();
  }
  
  init() {
    this.skillChips.forEach(chip => {
      chip.addEventListener('mouseenter', () => {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        chip.style.background = randomColor;
      });
      
      chip.addEventListener('mouseleave', () => {
        chip.style.background = 'linear-gradient(135deg, var(--primary-purple), var(--dark-purple))';
      });
    });
  }
}

// ====================================
// PERFORMANCE MONITOR
// ====================================
class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.init();
  }
  
  init() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.startTime;
      console.log(`🚀 Página cargada en ${Math.round(loadTime)}ms`);
      
      // Show welcome notification after page loads
      setTimeout(() => {
        showNotification('¡Bienvenido a mi portafolio profesional!', 'success');
      }, 500);
    });
    
    // Monitor scroll performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          // Scroll performance logic here
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
  }
}

// ====================================
// THEME MANAGER
// ====================================
class ThemeManager {
  constructor() {
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }
  
  init() {
    // Listen for system theme changes
    this.prefersDark.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
    
    // Apply initial theme
    if (this.prefersDark.matches) {
      document.body.classList.add('dark-theme');
    }
  }
}

// ====================================
// MAIN APPLICATION CLASS
// ====================================
class PersonalWebsite {
  constructor() {
    this.isLoaded = false;
    this.components = {};
    
    this.init();
  }
  
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize all components
      this.initializeComponents();
      
      // Setup global event listeners
      this.setupGlobalEvents();
      
      // Mark as loaded
      this.isLoaded = true;
      
      console.log('✅ Personal Website initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing website:', error);
    }
  }
  
  initializeComponents() {
    // Initialize typing animation
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
      this.components.typing = new TypingAnimation(typedElement, TYPING_TEXTS, {
        typingSpeed: CONFIG.typingSpeed,
        deletingSpeed: CONFIG.deletingSpeed,
        pauseTime: CONFIG.pauseTime
      });
    }
    
    // Initialize navigation
    this.components.navigation = new NavigationManager();
    
    // Initialize projects carousel
    this.components.projectsCarousel = new ProjectsCarousel();
    window.projectsCarousel = this.components.projectsCarousel; // Global access
    
    // Initialize contact manager
    this.components.contact = new ContactManager();
    
    // Initialize scroll animations
    this.components.scrollAnimations = new ScrollAnimations();
    
    // Initialize parallax effects
    this.components.parallax = new ParallaxEffects();
    
    // Initialize skill interactions
    this.components.skillInteractions = new SkillInteractions();
    
    // Initialize performance monitor
    this.components.performance = new PerformanceMonitor();
    
    // Initialize theme manager
    this.components.theme = new ThemeManager();
  }
  
  setupGlobalEvents() {
    // Handle external links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="http"]') || e.target.closest('a[href^="http"]')) {
        const link = e.target.matches('a') ? e.target : e.target.closest('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        });
      }
    });
    
    // Handle visibility change (pause animations when tab is not visible)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animations
        if (this.components.typing) {
          this.components.typing.pause();
        }
      } else {
        // Resume animations
        if (this.components.typing) {
          this.components.typing.resume();
        }
      }
    });
  }
}

// ====================================
// GLOBAL FUNCTIONS
// ====================================

/**
 * Download CV function
 */
function downloadCV() {
  // Simulate CV download
  showNotification('🔄 Preparando descarga del CV...', 'info');
  
  setTimeout(() => {
    showNotification('✅ CV descargado exitosamente', 'success');
    
    // In a real implementation, you would have:
    // const link = document.createElement('a');
    // link.href = '/assets/cv-nicolas-munoz.pdf';
    // link.download = 'Nicolas_Munoz_CV.pdf';
    // link.click();
    
    console.log('📄 CV download simulated');
    trackEvent('cv_download', { method: 'button_click' });
  }, 1500);
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
 * Handle contact form submission (if added)
 */
function handleContactSubmission(formData) {
  showNotification('📧 Mensaje enviado correctamente', 'success');
  console.log('Contact form data:', formData);
}

/**
 * Toggle mobile menu (for future mobile improvements)
 */
function toggleMobileMenu() {
  const menu = document.querySelector('.menu-principal');
  if (menu) {
    menu.classList.toggle('mobile-active');
  }
}

/**
 * Projects Carousel Functions
 */
function changeSlide(index) {
  if (window.projectsCarousel) {
    window.projectsCarousel.showSlide(index);
    trackEvent('project_slide_change', { slide_index: index });
  }
}

function changeGalleryImage(galleryIndex, direction) {
  if (window.projectsCarousel) {
    window.projectsCarousel.changeGalleryImage(galleryIndex, direction);
    trackEvent('gallery_image_change', { 
      gallery_index: galleryIndex, 
      direction: direction > 0 ? 'next' : 'prev' 
    });
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
  
  window.open(`mailto:jonimates2000@gmail.com?subject=${subject}&body=${body}`);
  trackEvent('contact_email_open', { method: 'enhanced' });
}

function openWhatsApp() {
  const message = encodeURIComponent('Hola Nicolás, me interesa conocer sobre tus servicios de Power Platform y automatización de procesos empresariales. ¿Podríamos conversar?');
  window.open(`https://wa.me/593992844325?text=${message}`, '_blank');
  trackEvent('contact_whatsapp_open', { method: 'enhanced' });
}

/**
 * Analytics tracking (placeholder for future implementation)
 */
function trackEvent(eventName, properties = {}) {
  console.log(`📊 Event tracked: ${eventName}`, properties);
  
  // Future implementation could include:
  // gtag('event', eventName, properties);
  // or other analytics services
}

/**
 * Handle contact form submission (if added)
 */
function handleContactSubmission(formData) {
  showNotification('📧 Mensaje enviado correctamente', 'success');
  console.log('Contact form data:', formData);
}

/**
 * Toggle mobile menu (for future mobile improvements)
 */
function toggleMobileMenu() {
  const menu = document.querySelector('.menu-principal');
  if (menu) {
    menu.classList.toggle('mobile-active');
  }
}

// ====================================
// ERROR HANDLING
// ====================================
window.addEventListener('error', (e) => {
  console.error('❌ JavaScript Error:', e.error);
  
  // In production, you might want to send errors to a logging service
  // logError(e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled Promise Rejection:', e.reason);
  
  // Prevent default browser error handling
  e.preventDefault();
});

// ====================================
// INITIALIZATION
// ====================================

// Initialize the application
const website = new PersonalWebsite();

// Add some useful debugging functions to window for development
if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
  window.website = website;
  window.showNotification = showNotification;
  window.CONFIG = CONFIG;
}

// ====================================
// SERVICE WORKER (for future PWA implementation)
// ====================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Future implementation for PWA
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered:', registration))
    //   .catch(error => console.log('SW registration failed:', error));
  });
}

// ====================================
// EXPORT FOR MODULE USAGE (if needed)
// ====================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PersonalWebsite,
    TypingAnimation,
    NavigationManager,
    ProjectsCarousel,
    ContactManager,
    ScrollAnimations,
    showNotification,
    downloadCV,
    scrollToSection,
    changeSlide,
    changeGalleryImage
  };
}