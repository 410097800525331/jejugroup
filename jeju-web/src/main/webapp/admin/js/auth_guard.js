/**
 * @file auth_guard.js
 * @description Admin Route Guard
 */

(() => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const sessionManagerPromise = import('../../core/auth/session_manager.js');

    const redirectByRoute = (routeKey, mode = 'replace') => {
        routeResolverPromise
            .then(({ resolveRoute }) => {
                const targetUrl = resolveRoute(routeKey);
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

    const hasAdminRole = (session) => {
        if (!session || typeof session !== 'object') {
            return false;
        }

        if (typeof session.role === 'string') {
            return session.role.includes('ADMIN');
        }

        return Array.isArray(session.roles) && session.roles.includes('ADMIN');
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
            const { resolveSession, clearSession } = await sessionManagerPromise;
            const sessionData = await resolveSession();

            if (!hasAdminRole(sessionData)) {
                clearSession();
                redirectByRoute('HOME');
                return;
            }

            window.AdminSession = Object.freeze({ ...sessionData });
            logAdminAccess(sessionData);
            document.documentElement.style.display = '';
        } catch (error) {
            console.error('[AdminGuard] Session verification failed:', error);
            try {
                const { clearSession } = await sessionManagerPromise;
                clearSession();
            } catch (clearError) {
                // 세션 정리 실패는 무시하고 리다이렉트 우선
            }
            redirectByRoute('HOME');
        }
    };

    runGuard();
})();
