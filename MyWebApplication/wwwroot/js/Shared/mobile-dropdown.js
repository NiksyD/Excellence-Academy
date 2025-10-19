/**
 * ============================================
 * MOBILE DROPDOWN NAVIGATION CONTROLLER
 * OpenRouter-Style Dropdown Menu
 * ============================================
 */

class MobileDropdownController {
    constructor() {
        this.trigger = null;
        this.dropdown = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    /**
     * Initialize the mobile dropdown controller
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Set up the dropdown functionality
     */
    setup() {
        this.trigger = document.querySelector('.mobile-nav-trigger');
        this.dropdown = document.querySelector('.mobile-nav-dropdown');
        this.overlay = document.querySelector('.mobile-nav-overlay');

        if (!this.trigger || !this.dropdown || !this.overlay) {
            return;
        }

        this.setupEventListeners();
        this.setActiveLink();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Toggle dropdown on trigger click
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Close dropdown when overlay is clicked
        this.overlay.addEventListener('click', () => {
            this.close();
        });

        // Close dropdown when a nav link is clicked (with small delay for navigation)
        const navLinks = this.dropdown.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default - let the link work naturally
                // Just close the dropdown after a small delay
                setTimeout(() => {
                    this.close();
                }, 50);
            });
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Prevent dropdown from closing when clicking inside it (except on links)
        this.dropdown.addEventListener('click', (e) => {
            // Only stop propagation if it's not a link
            if (!e.target.closest('.mobile-nav-link') && !e.target.closest('.mobile-action-btn')) {
                e.stopPropagation();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.dropdown.contains(e.target) && !this.trigger.contains(e.target)) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991.98 && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Toggle dropdown open/close
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open the dropdown
     */
    open() {
        this.isOpen = true;
        this.trigger.classList.add('active');
        this.dropdown.classList.add('active');
        this.overlay.classList.add('active');
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Add animation
        this.dropdown.style.animation = 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    /**
     * Close the dropdown
     */
    close() {
        this.isOpen = false;
        this.trigger.classList.remove('active');
        this.dropdown.classList.remove('active');
        this.overlay.classList.remove('active');
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }

    /**
     * Set active navigation link based on current page
     */
    setActiveLink() {
        const currentPath = window.location.pathname.toLowerCase();
        const navLinks = this.dropdown.querySelectorAll('.mobile-nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (!href) return;

            // Check if current path matches the link
            if (currentPath === '/' || currentPath === '/home') {
                if (href === '/' || href.toLowerCase().includes('/home')) {
                    link.classList.add('active');
                }
            } else if (currentPath.includes(href.toLowerCase()) && href !== '/') {
                link.classList.add('active');
            }
        });
    }

    /**
     * Update active state (for SPA scenarios)
     */
    updateActiveState(path) {
        this.setActiveLink();
    }
}

/**
 * ============================================
 * INITIALIZATION
 * ============================================
 */

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.MobileDropdownController = new MobileDropdownController();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileDropdownController;
}
