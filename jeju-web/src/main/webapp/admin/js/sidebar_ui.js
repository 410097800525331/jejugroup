/**
 * @file sidebar_ui.js
 * @description 관리자 사이드바 표시 흐름과 저장값을 한 군데서 맞춘다
 */

(() => {
    'use strict';

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
        if (!layout || !sidebar) return;

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
