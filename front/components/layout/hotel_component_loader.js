/**
 * JEJU STAY Component Loader
 * Handles dynamic injection of Header and Footer
 */

async function loadComponent(elementId, path, basePath, callback) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        let html = await response.text();
        
        // Dynamically replace {BASE_PATH} with the actual basePath
        html = html.replace(/\{BASE_PATH\}/g, basePath);
        
        document.getElementById(elementId).innerHTML = html;
        
        // Re-initialize Lucide icons if present
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        if (callback) callback();
    } catch (error) {
        console.error('Component loading error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Dynamically determine the base path from the script script
    let basePath = '';
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('hotel_component_loader.js')) {
            basePath = src.split('components/layout/hotel_component_loader.js')[0];
            break;
        }
    }
    
    // Ensure basePath doesn't break if it's empty
    const headerPath = `${basePath}components/layout/header/header.html`;
    const footerPath = `${basePath}components/layout/footer/footer.html`;

    loadComponent('hotel-header-placeholder', headerPath, basePath, () => {
        console.log('Header loaded');
        document.dispatchEvent(new Event('mainHeaderLoaded'));
        // Initialize header scripts after injection
        if (typeof initHeader === 'function') initHeader();
        if (typeof initStaggerNav === 'function') initStaggerNav();
    });
    
    loadComponent('hotel-footer-placeholder', footerPath, basePath, () => {
        console.log('Footer loaded');
        document.dispatchEvent(new Event('mainFooterLoaded'));
        // Initialize footer scripts after injection
        if (typeof initFooter === 'function') initFooter();
    });
});
