/**
 * @file auth_guard.js
 * @description Admin Page Route Guard.
 * Enforces Security Protocol: Immediate redirection for unauthorized access.
 */

 (() => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');

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
                } else {
                    window.location.replace(target);
                }
            });
    };

    // Security Protocol: Anti-flicker UI block to prevent layout leaks
    document.documentElement.style.display = 'none';

    // 1. Check Authentication Session (simulated via localStorage for now)
    // Production would verify a secure httpOnly cookie or JWT token
    const rawSession = localStorage.getItem('userSession');
    
    // Use try-catch for secure parsing
    let sessionData = null;
    try {
        sessionData = rawSession ? JSON.parse(rawSession) : null;
    } catch (e) {
        // Silent failure to avoid leaking logs, assume no session
        sessionData = null;
    }

    // Temporary mock for testing: If no session exists, inject a GUEST session to force redirect, 
    // or let it be null. But to test Admin, user would manually set this in console.
    // e.g., localStorage.setItem('userSession', JSON.stringify({ role: 'SUPER_ADMIN', name: '총괄관리자' }))

    const hasAdminRole = typeof sessionData?.role === 'string'
        ? sessionData.role === 'ADMIN'
        : Array.isArray(sessionData?.roles) && sessionData.roles.includes('ADMIN');

    // Security Protocol: Strict Role and Malformation Check
    // Prevent simple string manipulation by requiring a structured object
    // Also simulate expiry checking
    const isValidSession = sessionData 
        && typeof sessionData === 'object'
        && hasAdminRole
        && sessionData.exp 
        && new Date(sessionData.exp) > new Date(); // Ensure token is not expired

    if (!isValidSession) {
        // Security Protocol: Opaque redirection. No detailed error message.
        // Prevent storing admin page in history on bounce
        try {
            redirectByRoute('HOME');
        } catch(e) {
            // [6] Redirect fallback for environments where router breaks
            const target = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('index.html', window.location.href).href;
            window.location.replace(target);
        }
        return; // Halt execution immediately
    }

    // Security Protocol: Unblock UI rendering logically
    document.documentElement.style.display = '';

    // 2. Audit Log (Simulated)
    // Log administrative access
    const logAdminAccess = () => {
        const timestamp = new Date().toISOString();
        // In reality, this would be an API call:
        // fetch('/api/admin/audit', { method: 'POST', body: JSON.stringify({ action: 'ACCESS_ADMIN_PAGE', ts: timestamp }) });
        
        // For local simulation, just store in local array imuuttably
        const logs = JSON.parse(localStorage.getItem('adminSysLogs') || '[]');
        const role = sessionData.role || (Array.isArray(sessionData.roles) ? sessionData.roles.join(',') : 'UNKNOWN');
        const newLogs = [...logs, { event: 'LOGIN', roles: role, time: timestamp }];
        localStorage.setItem('adminSysLogs', JSON.stringify(newLogs));
    };

    logAdminAccess();
    
    // Attach session to window for the dashboard to use safely
    window.AdminSession = Object.freeze({ ...sessionData });

})();
