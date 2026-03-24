(() => {
    'use strict';

    if (window.AdminSidebarUI) {
        return;
    }

    const SIDEBAR_STORAGE_KEY = 'adminSidebarOpen';
    const DESKTOP_MIN_WIDTH = 1024;

    const isDesktopViewport = () => window.innerWidth > DESKTOP_MIN_WIDTH;

    const getInitialSidebarOpen = () => {
        try {
            const persisted = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
            if (persisted === 'true') return true;
            if (persisted === 'false') return false;
        } catch (error) {
            console.warn('[AdminSidebarUI] Failed to read persisted sidebar value:', error);
        }

        return isDesktopViewport();
    };

    const persistSidebarOpen = (isOpen) => {
        try {
            window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(Boolean(isOpen)));
        } catch (error) {
            console.warn('[AdminSidebarUI] Failed to persist sidebar value:', error);
        }
    };

    const applySidebarUI = ({ layout, sidebar, isOpen }) => {
        if (!layout || !sidebar) {
            return;
        }

        if (isDesktopViewport()) {
            layout.classList.toggle('sidebar-collapsed', !isOpen);
            sidebar.classList.remove('open');
            return;
        }

        layout.classList.remove('sidebar-collapsed');
        sidebar.classList.toggle('open', Boolean(isOpen));
    };

    window.AdminSidebarUI = Object.freeze({
        applySidebarUI,
        getInitialSidebarOpen,
        persistSidebarOpen
    });
})();
