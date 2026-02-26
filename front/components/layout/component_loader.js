/**
 * JEJU GROUP Global Component Loader
 * Handles dynamic injection of Header and Footer with absolute path resolution
 */

async function loadComponent(elementId, path, basePath, callback) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        let html = await response.text();
        
        // Dynamically replace {BASE_PATH} with the actual basePath
        html = html.replace(/\{BASE_PATH\}/g, basePath);
        
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = html;
        }
        
        // Re-initialize Lucide icons if present
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        if (callback) callback();
    } catch (error) {
        console.error('Component loading error:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let initRouterBinder;
    
    // 컴포넌트 로더의 위치가 기준이 되도록 basePath 탐색을 수행합니다.
    let basePath = '';
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('component_loader.js') && !src.includes('hotel_component_loader.js')) {
            basePath = src.split('components/layout/component_loader.js')[0];
            break;
        }
    }

    try {
        // basePath를 이용하여 현재 페이지 깊이에 상관없이 정확히 core/utils 폴더를 찌르도록 수정
        const routerPath = basePath + 'core/utils/router_binder.js';
        const routerModule = await import(routerPath);
        initRouterBinder = routerModule.initRouterBinder;
        initRouterBinder(); 
    } catch (e) {
        console.warn('Router Binder failed to load:', e);
    }
    
    // Check if the current page needs the main header
    const mainHeaderPlaceholder = document.getElementById('main-header-placeholder');
    if (mainHeaderPlaceholder) {
        const headerPath = `${basePath}components/layout/header/main_header.html`;
        loadComponent('main-header-placeholder', headerPath, basePath, () => {
            console.log('Main Header loaded');
            document.dispatchEvent(new Event('mainHeaderLoaded'));
        });
    }

    const mainFooterPlaceholder = document.getElementById('main-footer-placeholder');
    if (mainFooterPlaceholder) {
        const footerPath = `${basePath}components/layout/footer/main_footer.html`;
        loadComponent('main-footer-placeholder', footerPath, basePath, () => {
            console.log('Main Footer loaded');
            document.dispatchEvent(new Event('mainFooterLoaded'));
        });
    }
});
