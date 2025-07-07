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
  typingSpeed: 90,
  deletingSpeed: 40,
  pauseTime: 2000,
  scrollOffset: 100,
  animationDuration: 600,
  debounceDelay: 100
};

const TYPING_TEXTS = [
  "Desarrollador Power Platform & Web Full Stack",
  "Especialista en React.js y JavaScript ES6+", 
  "Consultor Microsoft Power Platform",
  "Automatización de procesos empresariales ",
  "Especialista en transformación digital empresarial",
  "Experiencia de usuario y frontend moderno",
  "Ingeniero en TI "
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
// NAVIGATION MANAGEMENT
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
    // Hide all sections
    this.contentSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionId;
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
// CONTACT FUNCTIONALITY
// ====================================
class ContactManager {
  constructor() {
    this.contactItems = document.querySelectorAll('.contact-item');
    this.init();
  }
  
  init() {
    this.contactItems.forEach(item => {
      item.addEventListener('click', () => {
        const link = item.querySelector('a');
        if (link) {
          window.open(link.href, '_blank');
        }
      });
    });
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
    
    // Initialize contact manager
    this.components.contact = new ContactManager();
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
  // Prepare and trigger CV download
  const link = document.createElement('a');
  link.href = '../doc/Nicolás Muñoz CV Actualizado.pdf'; // Ruta al archivo PDF
  link.download = 'Nicolas_Munoz_CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification('🔄 Preparando descarga del CV...', 'info');
  
  setTimeout(() => {
    showNotification('✅ CV descargado exitosamente', 'success');
    console.log('📄 CV download simulated');
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
 * Analytics tracking (placeholder for future implementation)
 */
function trackEvent(eventName, properties = {}) {
  console.log(`📊 Event tracked: ${eventName}`, properties);
  
  // Future implementation could include:
  // gtag('event', eventName, properties);
  // or other analytics services
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
if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
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
    ScrollAnimations,
    showNotification,
    downloadCV,
    scrollToSection
  };
}


