// Simple client-side router for SPA with hash routing and base path support
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.basePath = this.detectBasePath();
        this.init();
    }

    detectBasePath() {
        const path = window.location.pathname;
        if (path.includes('/art/')) {
            return '/art/';
        }
        return '/';
    }

    init() {
        // Handle initial load
        window.addEventListener('load', () => {
            this.handleRoute();
        });

        // Handle hash changes (for hash routing)
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                // Handle routes with hash anchors like /#about
                if (route && route.includes('#')) {
                    const parts = route.split('#');
                    const mainRoute = parts[0] || '/';
                    const anchor = parts[1];
                    // Navigate to main route first
                    this.navigate(mainRoute);
                    // Then scroll to anchor
                    if (anchor) {
                        setTimeout(() => {
                            const section = document.querySelector(`#${anchor}`);
                            if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 200);
                        return;
                    }
                }
                this.navigate(route);
            }
        });
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        // Use hash routing
        window.location.hash = `/${cleanPath}`;
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash || '';
        const pathname = window.location.pathname;
        let route = '';

        // If there's a hash, use it for routing
        if (hash) {
            // Extract route from hash (format: #/route or #/route/param)
            if (hash.startsWith('#/')) {
                route = hash.substring(2); // Remove '#/'
            } else if (hash.startsWith('#')) {
                route = hash.substring(1); // Remove '#'
            }
        } else {
            // No hash - check if we're on a path that should be a route
            // This handles direct visits to /art/blog etc (shouldn't happen with hash routing, but handle it)
            if (this.basePath !== '/' && pathname.startsWith(this.basePath)) {
                const pathAfterBase = pathname.substring(this.basePath.length);
                if (pathAfterBase && pathAfterBase !== 'index.html') {
                    // Convert path to hash route
                    window.location.hash = `/${pathAfterBase}`;
                    return; // Will be handled by hashchange event
                }
            }
        }

        // Handle section anchors (for backward compatibility)
        // Routes like #about, #contact should go to home and scroll
        if (route === 'portfolio' || route === 'about' || route === 'contact') {
            this.routes['/']?.();
            setTimeout(() => {
                const section = document.querySelector(`#${route}`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            return;
        }
        
        // Handle routes that include hash anchors like /#about, /#contact
        if (route.includes('#about') || route.includes('#contact')) {
            this.routes['/']?.();
            setTimeout(() => {
                const sectionName = route.includes('#about') ? 'about' : 'contact';
                const section = document.querySelector(`#${sectionName}`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            return;
        }

        // Handle main routes
        if (!route || route === '') {
            this.routes['/']?.();
        } else if (route === 'admin') {
            this.routes['/admin']?.();
        } else if (route.startsWith('images/')) {
            const id = route.split('images/')[1];
            this.routes['/images/:id']?.(id);
        } else if (route === 'blog') {
            this.routes['/blog']?.();
        } else if (route.startsWith('blog/')) {
            const slug = route.split('blog/')[1];
            this.routes['/blog/:slug']?.(slug);
        } else {
            // Fallback to home
            this.routes['/']?.();
        }
    }
}

const router = new Router();

