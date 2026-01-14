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

### JavaScript Modules

The codebase uses logical separation (not ES modules):

- **js/main.js**: Core page interactions (tabs, navbar scroll effects, mobile menu, smooth scrolling, component loading)
- **js/comments.js**: Full-featured collaboration/comment system with element-level annotation, LocalStorage persistence, and URL sharing
- **js/auth.js**: Authentication forms (SMS verification, tab switching)

### CSS Architecture

The design system uses **CSS custom properties** (`:root`) for complete design tokens:

- **Primary Blue**: `#0056D2` (brand color)
- **Typography**: Inter, SF Pro Text, system-ui
- **Shadows**: Diffused shadows (not hard shadows) with glassmorphism effects
- **Responsive**: Mobile-first with built-in breakpoints

See `DESIGN_GUIDE.md` for the complete color palette and accessibility guidelines (WCAG AA/AAA compliant).

### Page Structure

- **index.html**: Homepage with hero section, product matrix, tabbed application scenarios, customer cases
- **products.html**: Product details with vertical sidebar navigation and tab-based content
- **community.html**: Community/open source page
- **register.html**: Authentication/registration page
- **docs/index.html**: Documentation hub with three-column layout (sidebar nav, main content, TOC)

### Comment/Collaboration System

A unique feature: floating toolbar for element-level commenting with visual pins, LocalStorage persistence, JSON import/export, and URL-based sharing (Base64 encoded comments in hash). Keyboard shortcuts: `C` for comment mode, `F` for toolbar collapse.

## Navigation Architecture

The navbar (`components/navbar.html`) implements complex mega-menus with nested submenus:
- Product dropdown (3-column layout)
- Application scenarios (hierarchical structure)
- Community section (extensive dropdown)
- Mobile-responsive hamburger menu
- Search input (placeholder - ⌘K shortcut hint)
- Language switcher (i18n dropdown)
- "Ask AI" button (placeholder)

## Code Style

- Clean, well-commented Chinese comments throughout
- BEM-like CSS naming conventions
- ES6+ JavaScript with modern patterns (classes, async/await, arrow functions, template literals)
- No linting/formatting tools configured

## Testing

No testing infrastructure is currently in place.
