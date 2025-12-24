// Simple client-side router for SPA
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Handle initial load
        window.addEventListener('load', () => {
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
                this.navigate(route);
            }
        });
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname || '/';
        const hash = window.location.hash || '';

        // Handle hash routes (for backward compatibility)
        if (hash && (path === '/' || path === '/index.html')) {
            const hashRoute = hash.substring(1);
            if (hashRoute === 'portfolio' || hashRoute === 'about' || hashRoute === 'contact') {
                // Render home first, then scroll
                this.routes['/']?.();
                setTimeout(() => {
                    const section = document.querySelector(`#${hashRoute}`);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                return;
            }
        }

        // Handle path routes
        if (path === '/' || path === '/index.html') {
            this.routes['/']?.();
        } else if (path.startsWith('/images/')) {
            const id = path.split('/images/')[1];
            this.routes['/images/:id']?.(id);
        } else if (path === '/blog' || path.startsWith('/blog/')) {
            if (path === '/blog') {
                this.routes['/blog']?.();
            } else {
                const slug = path.split('/blog/')[1];
                this.routes['/blog/:slug']?.(slug);
            }
        } else {
            this.routes['/']?.();
        }
    }
}

const router = new Router();

