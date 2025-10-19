/**
 * ============================================
 * MAC-STYLE DOCK NAVIGATION CONTROLLER
 * Excellence Academy - Modern Navigation
 * ============================================
 */

class MacDockController {
    constructor() {
        this.dock = null;
        this.dockItems = [];
        this.currentPath = window.location.pathname.toLowerCase();
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize the Mac dock controller
     */
    init() {
        if (this.isInitialized) return;
        
        this.dock = document.querySelector('.mac-dock');
        if (!this.dock) return;

        this.dockItems = Array.from(this.dock.querySelectorAll('.dock-item:not(.dock-brand)'));
        this.setupEventListeners();
        this.setActiveItem();
        // Proximity effect disabled - interferes with hover
        // this.setupProximityEffect();
        this.setupAccessibility();
        
        this.isInitialized = true;
    }

    /**
     * Set up event listeners for dock functionality
     */
    setupEventListeners() {
        // Handle clicks with visual feedback
        this.dockItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleItemClick(e, item);
            });

            // Add ripple effect on click
            item.addEventListener('mousedown', (e) => {
                this.createRippleEffect(e, item);
            });
        });

        // Handle dock actions
        const dockActions = this.dock.querySelectorAll('.dock-action');
        dockActions.forEach(action => {
            action.addEventListener('click', (e) => {
                this.handleActionClick(e, action);
            });
        });

        // Handle window resize for responsive behavior
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle route changes (for SPA-like behavior)
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname.toLowerCase();
            this.setActiveItem();
        });
    }

    /**
     * Handle dock item clicks with smooth transitions
     */
    handleItemClick(e, item) {
        // Remove active class from all items
        this.dockItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Add click animation
        item.style.transform = 'translateY(-8px) scale(1.1)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    }

    /**
     * Handle dock action clicks
     */
    handleActionClick(e, action) {
        // Add click feedback
        action.style.transform = 'translateY(-4px) scale(0.95)';
        setTimeout(() => {
            action.style.transform = '';
        }, 150);
    }

    /**
     * Create ripple effect on click
     */
    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Set active dock item based on current route
     */
    setActiveItem() {
        // Remove active class from all items
        this.dockItems.forEach(item => item.classList.remove('active'));

        // Determine active item based on current path
        let activeItem = null;

        if (this.currentPath === '/' || this.currentPath.includes('/home')) {
            activeItem = this.dock.querySelector('[data-tooltip="Home"]');
        } else if (this.currentPath.includes('/student')) {
            activeItem = this.dock.querySelector('[data-tooltip="Student Portal"]');
        } else if (this.currentPath.includes('/gatepass')) {
            activeItem = this.dock.querySelector('[data-tooltip="Gate Pass"]');
        } else if (this.currentPath.includes('/activityreservation')) {
            activeItem = this.dock.querySelector('[data-tooltip="Activity Reservations"]');
        } else if (this.currentPath.includes('/lockerrequest')) {
            activeItem = this.dock.querySelector('[data-tooltip="Locker Request"]');
        }

        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    /**
     * Setup proximity effect for neighboring items
     */
    setupProximityEffect() {
        this.dockItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Apply proximity effect to neighbors
                const prevItem = this.dockItems[index - 1];
                const nextItem = this.dockItems[index + 1];

                if (prevItem) {
                    prevItem.style.transform = 'translateY(-4px) scale(1.1)';
                    prevItem.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                if (nextItem) {
                    nextItem.style.transform = 'translateY(-4px) scale(1.1)';
                    nextItem.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            });

            item.addEventListener('mouseleave', () => {
                // Reset neighbors
                const prevItem = this.dockItems[index - 1];
                const nextItem = this.dockItems[index + 1];

                setTimeout(() => {
                    if (prevItem && !prevItem.matches(':hover')) {
                        prevItem.style.transform = '';
                    }
                    if (nextItem && !nextItem.matches(':hover')) {
                        nextItem.style.transform = '';
                    }
                }, 100);
            });
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Keyboard navigation
        this.dock.addEventListener('keydown', (e) => {
            const focusedElement = document.activeElement;
            const currentIndex = this.dockItems.indexOf(focusedElement);

            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPreviousItem(currentIndex);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusNextItem(currentIndex);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.dockItems[0]?.focus();
                    break;
                case 'End':
                    e.preventDefault();
                    this.dockItems[this.dockItems.length - 1]?.focus();
                    break;
            }
        });

        // Make dock items focusable
        this.dockItems.forEach(item => {
            item.setAttribute('tabindex', '0');
        });

        // Focus management
        this.dock.addEventListener('focusin', () => {
            this.dock.style.outline = '2px solid #667eea';
            this.dock.style.outlineOffset = '4px';
        });

        this.dock.addEventListener('focusout', () => {
            this.dock.style.outline = '';
            this.dock.style.outlineOffset = '';
        });
    }

    /**
     * Focus previous dock item
     */
    focusPreviousItem(currentIndex) {
        if (currentIndex > 0) {
            this.dockItems[currentIndex - 1].focus();
        } else {
            this.dockItems[this.dockItems.length - 1].focus();
        }
    }

    /**
     * Focus next dock item
     */
    focusNextItem(currentIndex) {
        if (currentIndex < this.dockItems.length - 1) {
            this.dockItems[currentIndex + 1].focus();
        } else {
            this.dockItems[0].focus();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Hide dock on mobile, show traditional navbar
        if (window.innerWidth <= 991.98) {
            this.dock.style.display = 'none';
        } else {
            this.dock.style.display = 'flex';
        }
    }

    /**
     * Utility function for debouncing
     */
    debounce(func, wait) {
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
     * Add magnetic effect to dock items
     */
    addMagneticEffect() {
        this.dockItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;
                
                item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.2)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });
    }

    /**
     * Public method to update active state (for SPA scenarios)
     */
    updateActiveState(path) {
        this.currentPath = path.toLowerCase();
        this.setActiveItem();
    }
}

/**
 * ============================================
 * INITIALIZATION
 * ============================================
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if on desktop
    if (window.innerWidth > 991.98) {
        window.MacDockController = new MacDockController();
    }
});

// Reinitialize on window resize if needed
window.addEventListener('resize', () => {
    if (window.innerWidth > 991.98 && !window.MacDockController) {
        window.MacDockController = new MacDockController();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MacDockController;
}
