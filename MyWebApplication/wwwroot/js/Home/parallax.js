/**
 * ============================================
 * PARALLAX EFFECTS & ANIMATIONS
 * Excellence Academy Landing Page
 * ============================================
 */

class ParallaxController {
    constructor() {
        this.isInitialized = false;
        this.ticking = false;
        this.init();
    }

    /**
     * Initialize all parallax effects and event listeners
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.initializeAnimations();
        this.isInitialized = true;
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Scroll event with throttling
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => this.updateAnimations());
                this.ticking = true;
            }
        });

        // Mouse move parallax for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        }

        // Smooth scroll for anchor links
        this.setupSmoothScroll();
    }

    /**
     * Initialize animations on page load
     */
    initializeAnimations() {
        this.scrollReveal();
        this.animateCounters();
    }

    /**
     * Update all animations during scroll
     */
    updateAnimations() {
        this.parallaxScroll();
        this.scrollReveal();
        this.animateCounters();
        this.ticking = false;
    }

    /**
     * Main parallax scrolling effect
     */
    parallaxScroll() {
        const scrolled = window.pageYOffset;
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        parallaxSections.forEach(section => {
            const speed = section.dataset.scrollSpeed || 0.5;
            const yPos = -(scrolled * speed);
            section.style.transform = `translateY(${yPos}px)`;
        });
        
        this.animateFloatingShapes(scrolled);
        this.animateParticles(scrolled);
    }

    /**
     * Animate floating shapes based on scroll position
     */
    animateFloatingShapes(scrolled) {
        const shapes = document.querySelectorAll('.floating-shapes .shape');
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            const rotation = scrolled * 0.1;
            shape.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
    }

    /**
     * Animate particles based on scroll position
     */
    animateParticles(scrolled) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = 0.2 + (index * 0.03);
            const yPos = -(scrolled * speed);
            particle.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * Handle mouse move parallax effect
     */
    handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        const shapes = document.querySelectorAll('.floating-shapes .shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const currentTransform = shape.style.transform || '';
            const mouseTransform = `translate(${x * speed * 0.1}px, ${y * speed * 0.1}px)`;
            shape.style.transform = currentTransform + ' ' + mouseTransform;
        });
    }

    /**
     * Scroll reveal animation for elements coming into view
     */
    scrollReveal() {
        const reveals = document.querySelectorAll('.scroll-reveal');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    /**
     * Animate counters when they come into view
     */
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            if (counter.classList.contains('counting')) return;
            
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                this.startCounterAnimation(counter);
            }
        });
    }

    /**
     * Start counter animation for a specific counter element
     */
    startCounterAnimation(counter) {
        counter.classList.add('counting');
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            // Format counter text based on target value
            if (target > 100) {
                counter.textContent = current.toLocaleString() + '+';
            } else if (target === 98) {
                counter.textContent = current + '%';
            } else {
                counter.textContent = current + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    /**
     * Set up smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        // Handle all anchor links on this page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Handle navbar schedule visit button when on home page
        const scheduleVisitBtn = document.querySelector('.schedule-visit-btn');
        if (scheduleVisitBtn) {
            scheduleVisitBtn.addEventListener('click', (e) => {
                const target = document.querySelector('#contact');
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Debounce function to limit the rate of function execution
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Check if device prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return window.innerWidth <= 991.98;
}

/**
 * ============================================
 * INITIALIZATION
 * ============================================
 */

// Initialize parallax controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Respect user's motion preferences
    if (prefersReducedMotion()) {
        console.log('Reduced motion preferred - animations disabled');
        return;
    }

    // Initialize parallax effects
    new ParallaxController();
    
    // Add additional page-specific enhancements
    initializePageEnhancements();
});

/**
 * Initialize additional page enhancements
 */
function initializePageEnhancements() {
    // Add loading animation class removal
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Enhanced hover effects for cards
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Add intersection observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * ============================================
 * EXPORT FOR MODULE USAGE (if needed)
 * ============================================
 */

// If using ES6 modules, uncomment the line below
// export { ParallaxController, debounce, prefersReducedMotion, isMobileDevice };
