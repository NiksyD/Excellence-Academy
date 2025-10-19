# Excellence Academy - Static Assets Structure

This document outlines the organization of CSS, JavaScript, and other static assets for the Excellence Academy web application.

## 📁 Directory Structure

```
wwwroot/
├── css/                          # Stylesheets
│   ├── Home/                     # Home page specific styles
│   │   └── parallax.css          # Parallax effects & animations
│   ├── ActivityReservation/      # Activity reservation styles
│   ├── GatePass/                 # Gate pass styles
│   ├── LockerRequest/            # Locker request styles
│   └── site.css                  # Global utility classes
├── js/                           # JavaScript files
│   ├── Home/                     # Home page specific scripts
│   │   ├── parallax.js           # Parallax controller class
│   │   └── parallax-config.js    # Configuration settings
│   ├── ActivityReservation/      # Activity reservation scripts
│   ├── GatePass/                 # Gate pass scripts
│   ├── LockerRequest/            # Locker request scripts
│   └── Student/                  # Student management scripts
├── lib/                          # Third-party libraries
└── uploads/                      # File uploads
```

## 🎨 CSS Architecture

### site.css
Global utility classes available across the entire application:
- **Animation utilities**: `.fade-in`, `.slide-up`, `.bounce-in`
- **Hover effects**: `.hover-lift`, `.hover-scale`, `.hover-glow`
- **Responsive visibility**: `.mobile-only`, `.desktop-only`
- **Accessibility**: Reduced motion support, focus improvements

### Home/parallax.css
Specialized styles for the landing page parallax effects:
- **Parallax containers**: Background layers and positioning
- **Floating shapes**: Animated geometric elements
- **Particles system**: Floating particle animations
- **Wave animations**: SVG-based wave effects
- **Keyframe animations**: All custom animation definitions

## 🚀 JavaScript Architecture

### Home/parallax.js
Main parallax controller with object-oriented design:
- **ParallaxController class**: Manages all parallax effects
- **Modular methods**: Separate functions for each animation type
- **Performance optimized**: Uses `requestAnimationFrame` and throttling
- **Accessibility aware**: Respects `prefers-reduced-motion`

### Home/parallax-config.js
Configuration file for easy customization:
- **Animation settings**: Speed, easing, duration values
- **Breakpoints**: Responsive behavior thresholds
- **Performance settings**: Throttling and optimization options
- **Element selectors**: Centralized selector definitions

## 🔧 Usage Examples

### Including Parallax Effects
```html
@section Styles {
    <link rel="stylesheet" href="~/css/Home/parallax.css" asp-append-version="true" />
}

@section Scripts {
    <script src="~/js/Home/parallax-config.js" asp-append-version="true"></script>
    <script src="~/js/Home/parallax.js" asp-append-version="true"></script>
}
```

### Using Utility Classes
```html
<!-- Animated card -->
<div class="card hover-lift smooth-transition">
    <div class="card-body">
        <h5 class="text-shimmer">Animated Title</h5>
        <p class="fade-in">Content with animation</p>
    </div>
</div>

<!-- Responsive visibility -->
<div class="mobile-only">Mobile only content</div>
<div class="desktop-only">Desktop only content</div>
```

### Scroll Reveal Elements
```html
<div class="scroll-reveal" data-delay="100">
    Content that animates in on scroll
</div>

<h3 class="counter" data-target="2500">0</h3>
```

## 📱 Responsive Design

The refactored CSS follows mobile-first principles:
- **Breakpoints**: 768px (tablet), 992px (desktop), 1200px (large)
- **Performance**: Heavy animations disabled on mobile devices
- **Accessibility**: Respects user's motion preferences

## 🎯 Performance Features

### CSS Optimizations
- **Hardware acceleration**: `will-change` properties for animated elements
- **Efficient selectors**: Specific, non-nested selectors
- **Conditional animations**: Disabled on mobile for better performance

### JavaScript Optimizations
- **Event throttling**: Scroll events limited to 60fps
- **Intersection Observer**: Better viewport detection
- **Conditional loading**: Features disabled based on device capabilities

## 🛠 Maintenance Guidelines

### Adding New Animations
1. Add keyframes to `parallax.css`
2. Update `parallax-config.js` with new settings
3. Extend `ParallaxController` class methods
4. Test on mobile devices for performance

### Creating Page-Specific Assets
1. Create folder under `/css/` and `/js/`
2. Follow naming convention: `[PageName]/[feature].css`
3. Include utility classes from `site.css`
4. Document any new patterns

### Browser Support
- **Modern browsers**: Full feature support
- **Older browsers**: Graceful degradation with fallbacks
- **Accessibility**: WCAG compliant with motion preferences

## 🔄 Migration Notes

The refactoring moved:
- **Inline styles** → External CSS files
- **Inline scripts** → Modular JavaScript classes
- **Hard-coded values** → Configurable settings
- **Monolithic code** → Organized, maintainable structure

This improves:
- **Performance**: Better caching and minification
- **Maintainability**: Organized, documented code
- **Reusability**: Shared utility classes
- **Scalability**: Easy to extend and modify
