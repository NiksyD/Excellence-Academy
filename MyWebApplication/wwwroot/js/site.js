/**
 * ============================================
 * GLOBAL SITE FUNCTIONALITY
 * Excellence Academy Application
 * ============================================
 */

// Global site controller
const SiteController = {
    init() {
        this.setupGlobalEventListeners();
        this.setupAccessibilityFeatures();
        this.setupPerformanceOptimizations();
        this.initializeLoadingStates();
    },

    /**
     * Set up global event listeners
     */
    setupGlobalEventListeners() {
        // Global smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Handle Schedule Visit button globally
        const scheduleVisitBtn = document.querySelector(".schedule-visit-btn");
        if (scheduleVisitBtn) {
            scheduleVisitBtn.addEventListener("click", this.handleScheduleVisit.bind(this));
        }

        // Global form enhancements
        this.setupFormEnhancements();
    },

    /**
     * Handle smooth scrolling for anchor links
     */
    handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    },

    /**
     * Handle Schedule Visit button clicks
     */
    handleScheduleVisit(e) {
        const target = document.querySelector("#contact");
        if (target) {
            // If on home page and contact section exists, scroll to it
            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
        // Otherwise, let it navigate to home page with #contact anchor
    },

    /**
     * Set up form enhancements
     */
    setupFormEnhancements() {
        // Add loading states to forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                    
                    // Re-enable after 5 seconds to prevent permanent lock
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 5000);
                }
            });
        });

        // Enhanced input focus effects
        document.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    },

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link visually-hidden';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 9999;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Enhanced keyboard navigation
        document.addEventListener('keydown', function(e) {
            // ESC key closes modals
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    const modalInstance = bootstrap.Modal.getInstance(openModal);
                    if (modalInstance) modalInstance.hide();
                }
            }
        });
    },

    /**
     * Set up performance optimizations
     */
    setupPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        this.preloadCriticalResources();
    },

    /**
     * Initialize loading states
     */
    initializeLoadingStates() {
        // Remove loading class from body when everything is ready
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            document.body.classList.remove('loading');
        });

        // Show loading state initially
        document.body.classList.add('loading');
    },

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const criticalFonts = [
            '/lib/bootstrap/dist/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];

        criticalFonts.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            document.head.appendChild(link);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    SiteController.init();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteController;
}

// Make available globally
window.SiteController = SiteController;
