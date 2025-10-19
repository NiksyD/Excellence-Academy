/**
 * ============================================
 * PARALLAX CONFIGURATION
 * Excellence Academy Landing Page
 * ============================================
 */

const ParallaxConfig = {
    // Animation settings
    animation: {
        parallaxSpeed: {
            slow: 0.1,
            medium: 0.3,
            fast: 0.5
        },
        easing: {
            ease: 'ease',
            easeInOut: 'ease-in-out',
            easeOut: 'ease-out'
        },
        duration: {
            fast: 300,
            medium: 600,
            slow: 1000,
            counter: 2000
        }
    },

    // Breakpoints for responsive behavior
    breakpoints: {
        mobile: 767.98,
        tablet: 991.98,
        desktop: 1200
    },

    // Performance settings
    performance: {
        throttleDelay: 16, // ~60fps
        intersectionThreshold: 0.1,
        reducedMotionRespect: true
    },

    // Selectors for various elements
    selectors: {
        parallaxSection: '.parallax-section',
        floatingShapes: '.floating-shapes .shape',
        particles: '.particle',
        scrollReveal: '.scroll-reveal',
        counters: '.counter',
        heroSection: '.hero-section',
        scheduleVisitBtn: '.schedule-visit-btn'
    },

    // Animation states
    classes: {
        revealed: 'revealed',
        counting: 'counting',
        loaded: 'loaded',
        inViewport: 'in-viewport'
    },

    // Floating shapes configuration
    shapes: {
        count: 6,
        sizes: [40, 60, 80, 100, 120],
        colors: ['rgba(255, 255, 255, 0.1)', 'rgba(102, 126, 234, 0.1)'],
        animationDelays: [0, 1, 2, 3, 4, 5]
    },

    // Particles configuration
    particles: {
        count: 8,
        size: 4,
        color: 'rgba(255, 255, 255, 0.6)',
        animationDuration: 8
    },

    // Counter formatting rules
    counters: {
        formatRules: {
            2500: { suffix: '+', locale: true },
            150: { suffix: '+', locale: false },
            98: { suffix: '%', locale: false },
            50: { suffix: '+', locale: false }
        }
    }
};

// Export configuration for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParallaxConfig;
}

// Make available globally
window.ParallaxConfig = ParallaxConfig;
