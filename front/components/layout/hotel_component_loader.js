/**
 * JEJU STAY Component Loader
 * Handles dynamic injection of Header and Footer
 */

async function loadComponent(elementId, path, callback) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        const html = await response.text();
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
    // Use absolute paths for components
    // Old heuristic removed since all paths are now domain-based and relative to root.
    
    const headerPath = `/components/layout/header/header.html`;
    const footerPath = `/components/layout/footer/footer.html`;

    loadComponent('hotel-header-placeholder', headerPath, () => {
        console.log('Header loaded');
        // Initialize header scripts after injection
        if (typeof initHeader === 'function') initHeader();
        if (typeof initStaggerNav === 'function') initStaggerNav();
    });
    
    loadComponent('hotel-footer-placeholder', footerPath, () => {
        console.log('Footer loaded');
        // Initialize footer scripts after injection
        if (typeof initFooter === 'function') initFooter();
    });
});
