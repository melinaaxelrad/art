# Routing Fix Summary

## Changes Made

### 1. Base Path Constant
- Added `BASE_PATH` constant in `app.js` that detects `/art/` subdirectory
- Single source of truth for base path detection
- Used by `getBasePath()` and `getImagePath()` functions

### 2. Hash Routing Implementation
- **Router (`router.js`)**: Converted to hash-based routing
  - All routes now use `#/route` format (e.g., `#/blog`, `#/images/1`)
  - Router reads from `window.location.hash` instead of `pathname`
  - Handles hash changes via `hashchange` event

### 3. Navigation Links Fixed
- **All navbar links** in `index.html` now use `href="#"` and `data-route` attributes
- **All internal links** in `app.js` updated to use hash routing:
  - Portfolio → `data-route="/"`
  - Blog → `data-route="/blog"`
  - Image detail → `data-route="/images/:id"`
  - Blog post → `data-route="/blog/:slug"`
  - Admin → `data-route="/admin"`
  - About/Contact → `data-route="/#about"` and `data-route="/#contact"`

### 4. Router Updates
- Router detects base path automatically
- Handles section anchors (About, Contact) by navigating to home then scrolling
- Handles direct visits to paths (converts to hash routes)

### 5. 404.html Fallback
- Updated to handle hash routing
- Converts direct path visits (e.g., `/art/blog`) to hash routes (`/art/#/blog`)
- Ensures refresh on any route works correctly

## How It Works

### URL Format
- **Home**: `/art/` or `/art/#/`
- **Blog**: `/art/#/blog`
- **Blog Post**: `/art/#/blog/post-slug`
- **Image Detail**: `/art/#/images/1`
- **Admin**: `/art/#/admin`

### Navigation Flow
1. User clicks link with `data-route` attribute
2. Router intercepts click and prevents default
3. Router sets `window.location.hash` to `#/route`
4. Router calls appropriate handler function
5. Page content updates without full reload

### Base Path Detection
- Checks `window.location.pathname` for `/art/`
- If found, sets `BASE_PATH = '/art/'`
- Otherwise, `BASE_PATH = '/'` (for local dev or root deployment)

## Testing Checklist

- [ ] Click "Portfolio" → stays on `/art/#/` (or `/art/`)
- [ ] Click "Blog" → navigates to `/art/#/blog`
- [ ] Click "Login" → navigates to `/art/#/admin`
- [ ] Click artwork → navigates to `/art/#/images/1`
- [ ] Click blog post → navigates to `/art/#/blog/slug`
- [ ] Click "About" → scrolls to about section (stays on `/art/#/`)
- [ ] Click "Contact" → scrolls to contact section (stays on `/art/#/`)
- [ ] Navigate Blog → Portfolio → Blog (no errors)
- [ ] Direct visit to `/art/#/blog` works
- [ ] Refresh on `/art/#/blog` still shows blog page
- [ ] All image paths load correctly (use `/art/images/...`)
- [ ] Mobile menu links work correctly

## Files Changed

1. **`router.js`** - Converted to hash routing, added base path detection
2. **`app.js`** - Added BASE_PATH constant, updated all navigation links
3. **`index.html`** - Updated all navbar links to use hash routing
4. **`404.html`** - Updated to handle hash routing redirects
5. **`admin.js`** - No changes needed (already uses router)

## Notes

- Hash routing is recommended for GitHub Pages because it doesn't require server configuration
- All URLs will have the `/art/` prefix preserved
- Deep links work via hash routing
- Refresh works because hash is part of URL (browser preserves it)

