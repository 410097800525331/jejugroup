/**
 * @file auth_guard.js
 * @description Admin Route Guard
 */

(() => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const localAdminPromise = import('../../core/auth/local_admin.js');
    const sessionManagerPromise = import('../../core/auth/session_manager.js');
    const waitForAdminSession = async () => {
        const pendingSession = window.__ADMIN_SESSION_PROMISE__;
        if (pendingSession && typeof pendingSession.then === 'function') {
            try {
                await pendingSession;
            } catch (_error) {
                // 가드 내부에서 리다이렉트까지 처리하므로 여기서는 삼킨다
            }
        }
        return window.AdminSession || null;
    };

    window.AdminAuth = Object.freeze({
        waitForAdminSession
    });

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
            const [{ hasAdminAccess, resolveAdminSession }, { resolveSession }] = await Promise.all([
                localAdminPromise,
                sessionManagerPromise
            ]);
            const resolvedSession = await resolveSession();
            const sessionData = hasAdminAccess(resolvedSession) ? resolvedSession : resolveAdminSession();

            if (!sessionData) {
                redirectByRoute('HOME');
                return;
            }

            window.AdminSession = Object.freeze({ ...sessionData });
            logAdminAccess(sessionData);
            document.documentElement.style.display = '';
            return window.AdminSession;
        } catch (error) {
            console.error('[AdminGuard] Session verification failed:', error);
            redirectByRoute('HOME');
            return null;
        }
    };

    window.__ADMIN_SESSION_PROMISE__ = runGuard();
})();
