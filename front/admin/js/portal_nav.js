(() => {
    'use strict';

    if (window.AdminPortalNav) {
        return;
    }

    const routeResolverPromise = import('../../core/utils/path_resolver.js');

    const navigateByRoute = (routeKey) => {
        routeResolverPromise
            .then(({ resolveRoute }) => {
                const targetUrl = resolveRoute(routeKey);
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, 'admin-portal-nav');
                    return;
                }

                window.location.assign(targetUrl);
            })
            .catch((error) => {
                console.error('[AdminPortalNav] Route resolution failed:', error);
                const fallback = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('../../index.html', window.location.href).href;
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(fallback, 'admin-portal-nav-fallback');
                    return;
                }

                window.location.assign(fallback);
            });
    };

    const bindPortalNav = () => {
        const routeLinks = document.querySelectorAll('.admin-portal-nav .route-link[data-route]');
        if (!routeLinks.length) {
            return;
        }

        routeLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const routeKey = link.dataset.route;
                if (!routeKey) {
                    return;
                }

                navigateByRoute(routeKey);
            });
        });
    };

    bindPortalNav();

    window.AdminPortalNav = Object.freeze({
        bindPortalNav,
        navigateByRoute
    });
})();
