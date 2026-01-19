# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **KaiwuDB official website** - a static HTML/CSS/JavaScript marketing site for KaiwuDB, a distributed multi-model database targeting industrial IoT, digital energy, and automotive scenarios.

**Tech Stack**: Pure vanilla JavaScript (no frameworks, no build tools). Deployed on Vercel.

## Local Development

This is a static site with no build process or dependencies. Serve the files using any HTTP server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# VS Code: Use Live Server extension
```

## Deployment

The site uses **Vercel** for hosting with automatic Git integration. Deployment config is in `vercel.json`:

```json
{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}
```

This enables SPA-style routing - all routes redirect to `index.html` for client-side routing.

## Architecture

### Component Loading Pattern

Shared components (`navbar.html`, `footer.html`) are **dynamically loaded via JavaScript fetch**, not server-side includes. The `loadComponent()` function in `js/main.js` handles this with automatic path adjustment for the nested `docs/` directory.

**Important**: When adding new shared components, update `main.js` to load them.

### JavaScript Architecture

The codebase uses a modular pattern with global functions and classes (not ES modules):

- **js/main.js**: Core page interactions including:
  - Tab switching (`.tab-btn` / `.tab-content`)
  - Navbar scroll effects and mega-menu positioning
  - Mobile hamburger menu and dropdown management
  - Smooth scrolling for anchor links
  - Component loading (`loadComponent()`)
  - Hero carousel (`HeroCarousel` class)
  - Industry panels for scenarios/cases dropdowns
  - Success stories industry tab switching
  - Community section with stats animation and feed pagination

- **js/auth.js**: Authentication forms (SMS verification, tab switching)

- **js/community-logic.js**: Community page specific interactions (193 lines)

- **docs/js/docs.js**: Documentation-specific logic (TOC scroll highlighting)

**Key Pattern**: Most features are initialized via `init*()` functions called from `DOMContentLoaded`. When adding new features, follow this pattern by creating an `initFeatureName()` function and calling it from the main initialization block.

### CSS Architecture

The design system uses **CSS custom properties** (`:root`) for complete design tokens. See `css/style.css:6-57` for the full design system definition:

- **Primary Blue**: `#0056D2` (brand color)
- **Typography**: Inter, SF Pro Text, system-ui
- **Shadows**: Diffused shadows (not hard shadows) with glassmorphism effects
- **Responsive**: Mobile-first with built-in breakpoints
- **Transitions**: Cubic-bezier easing for polished feel (`--transition-fast`, `--transition-smooth`)

See `DESIGN_GUIDE.md` for the complete color palette and accessibility guidelines (WCAG AA/AAA compliant).

**CSS Organization**:
- `css/style.css`: Core design system and global styles
- `css/products.css`: Product page specific styles
- `css/community.css`: Community page styles
- `css/auth.css`: Authentication/registration page styles
- `css/success-stories.css`: Success stories section styles
- `docs/css/docs.css`: Documentation hub styles

### Page Structure

- **index.html**: Homepage with hero carousel, advantages accordion, success stories tabs, community feed
- **about.html**: Company introduction and contact information
- **products.html**: Product details with vertical sidebar navigation and tab-based content
- **community.html**: Community/open source page
- **register.html**: Authentication/registration page
- **customer-cases.html**: Customer case studies with architecture diagrams
- **docs/index.html**: Documentation hub with three-column layout (sidebar nav, main content, TOC)

### Interactive Component Patterns

**Hero Carousel** (`HeroCarousel` class in js/main.js:436-548):
- Auto-play with mouse pause and visibility detection
- Arrow controls and dot indicators
- Keyboard navigation (ArrowLeft/ArrowRight)

**Advantages Accordion** (js/main.js:772-867):
- Click and hover-to-expand behavior
- Only one item open at a time (exclusive accordion)
- Synchronizes with visual shape state changes

**Success Stories** (js/main.js:869-1142):
- Industry-based tab filtering
- Dynamic content rendering with fade transitions
- Data-driven from `successCasesData` and `industryTabsConfig`

**Community Feed** (js/main.js:257-430):
- Pagination with `loadMoreFeed()`
- Animated stat counters using IntersectionObserver
- Like button interactions with global `window.toggleLike()` function

**Mega-Menus** (js/main.js:553-761):
- `initScenariosDropdownPanel()`: Solution/industry hover panels
- `initCasesDropdownPanel()`: Customer case industry panels
- Dynamic content updates with fade transitions
- Dropdown positioning adjusts based on navbar height

## Navigation Architecture

The navbar (`components/navbar.html`) implements complex mega-menus with nested submenus:
- Product dropdown (3-column layout)
- Application scenarios (hierarchical structure)
- Community section (extensive dropdown)
- Mobile-responsive hamburger menu
- Search input (placeholder - ⌘K shortcut hint)
- Language switcher (i18n dropdown)
- "Ask AI" button (placeholder)

**Important**: Dropdown positioning is dynamically calculated in `updateDropdownTop()` to account for navbar height changes (scroll state, notification bar close).

## Code Style

- Clean, well-commented Chinese comments throughout
- BEM-like CSS naming conventions
- ES6+ JavaScript with modern patterns (classes, async/await, arrow functions, template literals)
- No linting/formatting tools configured
- Global functions used for cross-component communication (e.g., `window.toggleLike()`)

## External Dependencies

**Minimal dependencies** - The site uses only one external library:

- **Lucide Icons** (via CDN): `https://unpkg.com/lucide@latest`
  - Lightweight icon library used throughout the site
  - Initialized with `lucide.createIcons()` after DOM loads
  - Call again after dynamic content updates to refresh icons

**No other external libraries** - all functionality is pure vanilla JavaScript.

## Development Guidelines

### Adding New Features

1. Create an initialization function following the `initFeatureName()` pattern
2. Call your function from the main `DOMContentLoaded` listener in `js/main.js`
3. Use CSS custom properties from `:root` for styling consistency
4. Follow BEM-like naming conventions for CSS classes
5. Add Chinese comments for code clarity

### Adding New Pages

1. Include shared component placeholders:
   ```html
   <div id="navbar-placeholder"></div>
   <div id="footer-placeholder"></div>
   ```
2. Link appropriate CSS files (always include `css/style.css`)
3. Include `js/main.js` or create page-specific JS
4. Update `components/navbar.html` to add navigation links
5. Test component loading - verify paths work for both root and `docs/` directory

### Adding Shared Components

1. Create HTML file in `components/` directory
2. Add `<div id="component-placeholder"></div>` to pages that need it
3. Call `loadComponent('component-placeholder', 'components/component.html')` in `main.js`
4. Add `data-nav-link` attributes to links that need path adjustment for `docs/` directory

### Working with Icons

1. Use Lucide icons: `<i data-lucide="icon-name"></i>`
2. Reference [Lucide documentation](https://lucide.dev/icons/) for available icons
3. Call `lucide.createIcons()` after updating DOM content dynamically

## Testing

No testing infrastructure is currently in place.
