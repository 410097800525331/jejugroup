/**
 * @file auth_guard.js
 * @description Admin Route Guard
 */

(() => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const localAdminPromise = import('../../core/auth/local_admin.js');

    const redirectByRoute = (routeKey, options = {}) => {
        const { mode = 'replace', params = {} } = options;
        routeResolverPromise
            .then(({ resolveRoute }) => {
                const targetUrl = resolveRoute(routeKey, params);
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, 'admin-guard', { mode });
                    return;
                }
                if (mode === 'assign') {
                    window.location.assign(targetUrl);
                    return;
                }
                window.location.replace(targetUrl);
            })
            .catch((error) => {
                console.error('[AdminGuard] Route resolution failed:', error);
                const target = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('index.html', window.location.href).href;
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(target, 'admin-guard-fallback');
                    return;
                }
                window.location.replace(target);
            });
    };

    const logAdminAccess = (sessionData) => {
        const timestamp = new Date().toISOString();
        const logs = JSON.parse(localStorage.getItem('adminSysLogs') || '[]');
        const role = sessionData.role || (Array.isArray(sessionData.roles) ? sessionData.roles.join(',') : 'UNKNOWN');
        const newLogs = [...logs, { event: 'LOGIN', roles: role, time: timestamp }];
        localStorage.setItem('adminSysLogs', JSON.stringify(newLogs));
    };

    const runGuard = async () => {
        document.documentElement.style.display = 'none';

        try {
            const { isLocalFrontEnvironment, buildLocalFrontAdminSession } = await localAdminPromise;

            if (!isLocalFrontEnvironment()) {
                redirectByRoute('HOME');
                return;
            }

            const sessionData = buildLocalFrontAdminSession();
            window.AdminSession = Object.freeze({ ...sessionData });
            logAdminAccess(sessionData);
            document.documentElement.style.display = '';
        } catch (error) {
            console.error('[AdminGuard] Session verification failed:', error);
            redirectByRoute('HOME');
        }
    };

    runGuard();
})();
