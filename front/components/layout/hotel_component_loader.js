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

// Utility to dynamically load scripts
async function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
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

    loadComponent('hotel-header-placeholder', headerPath, basePath, async () => {
        console.log('Header loaded');
        document.dispatchEvent(new Event('mainHeaderLoaded'));
        
        // Dynamically load header.js to ensure mega-menu logic works across all pages
        try {
            await loadScript(`${basePath}components/layout/header/header.js`);
            // Initialize header scripts after injection and script load
            if (typeof initHeader === 'function') initHeader();
            if (typeof initStaggerNav === 'function') initStaggerNav();
        } catch (error) {
            console.error('Failed to load header script:', error);
        }
    });
    
    loadComponent('hotel-footer-placeholder', footerPath, basePath, () => {
        console.log('Footer loaded');
        document.dispatchEvent(new Event('mainFooterLoaded'));
        // Initialize footer scripts after injection
        if (typeof initFooter === 'function') initFooter();
    });
});
