(() => {
    'use strict';

    const currentScript = document.currentScript;
    if (currentScript && !currentScript.dataset.adminRuntime) {
        currentScript.dataset.adminRuntime = new URL(currentScript.getAttribute('src') || '', window.location.href).href;
        currentScript.dataset.adminLoaded = 'true';
    }

    if (window.AdminAuth) {
        return;
    }

    const AUTH_STATE_ATTR = 'data-admin-auth-state';
    const AUTH_GUARD_STYLE_ID = 'admin-auth-guard-style';
    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const localAdminPromise = import('../../core/auth/local_admin.js');
    const sessionManagerPromise = import('../../core/auth/session_manager.js');

    const ensureAuthGuardGate = () => {
        const root = document.documentElement;
        if (!root.getAttribute(AUTH_STATE_ATTR)) {
            root.setAttribute(AUTH_STATE_ATTR, 'pending');
        }

        if (document.getElementById(AUTH_GUARD_STYLE_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = AUTH_GUARD_STYLE_ID;
        style.textContent = `
            html[data-admin-auth-state="pending"] body.admin-mode .admin-layout,
            html[data-admin-auth-state="pending"] body.admin-mode .admin-sidebar-toggle {
                visibility: hidden !important;
            }
        `;

        (document.head || root).appendChild(style);
    };

    const setAuthState = (state) => {
        document.documentElement.setAttribute(AUTH_STATE_ATTR, state);
    };

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
                const fallback = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('index.html', window.location.href).href;
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(fallback, 'admin-guard-fallback');
                    return;
                }
                window.location.replace(fallback);
            });
    };

    const logAdminAccess = (sessionData) => {
        const timestamp = new Date().toISOString();
        const logs = JSON.parse(window.localStorage.getItem('adminSysLogs') || '[]');
        const role = sessionData.role || (Array.isArray(sessionData.roles) ? sessionData.roles.join(',') : 'UNKNOWN');
        const newLogs = [...logs, { event: 'LOGIN', roles: role, time: timestamp }];
        window.localStorage.setItem('adminSysLogs', JSON.stringify(newLogs));
    };

    const runGuard = async () => {
        try {
            const [{ hasAdminAccess }, { resolveSession }] = await Promise.all([
                localAdminPromise,
                sessionManagerPromise
            ]);
            const resolvedSession = await resolveSession();
            const sessionData = hasAdminAccess(resolvedSession) ? resolvedSession : null;

            if (!sessionData) {
                redirectByRoute('HOME');
                return null;
            }

            setAuthState('ready');
            window.AdminSession = Object.freeze({ ...sessionData });
            logAdminAccess(sessionData);
            return window.AdminSession;
        } catch (error) {
            console.error('[AdminGuard] Session verification failed:', error);
            redirectByRoute('HOME');
            return null;
        }
    };

    ensureAuthGuardGate();

    window.AdminAuth = Object.freeze({
        waitForAdminSession
    });

    window.__ADMIN_SESSION_PROMISE__ = runGuard();
})();
