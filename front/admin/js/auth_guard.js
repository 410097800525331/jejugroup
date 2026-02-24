/**
 * @file auth_guard.js
 * @description Admin Page Route Guard.
 * Enforces Security Protocol: Immediate redirection for unauthorized access.
 */

 (() => {
    'use strict';

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

    const isAuthorized = sessionData && sessionData.role && sessionData.role.includes('ADMIN');

    if (!isAuthorized) {
        // Security Protocol: Opaque redirection. No detailed error message.
        // Prevent storing admin page in history on bounce
        window.location.replace('../../index.html');
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
        const newLogs = [...logs, { event: 'LOGIN', role: sessionData.role, time: timestamp }];
        localStorage.setItem('adminSysLogs', JSON.stringify(newLogs));
    };

    logAdminAccess();
    
    // Attach session to window for the dashboard to use safely
    window.AdminSession = Object.freeze({ ...sessionData });

})();
