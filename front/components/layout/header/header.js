/**
 * JEJU STAY Component: Header Logic
 */

function initHeader() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    // 1. Scroll Effect (Glassmorphism)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mega Menu Preview Logic
    const megaItems = document.querySelectorAll('.mega-menu-item');
    megaItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const previewId = this.dataset.preview;
            const parentDropdown = this.closest('.mega-dropdown');
            if (!parentDropdown) return;
            
            const previewArea = parentDropdown.querySelector('.mega-menu-preview');
            if (!previewArea) return;

            const previewImages = previewArea.querySelectorAll('.preview-image');
            
            previewImages.forEach(img => {
                if (img.id === previewId) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        });
    });

    // 3. Mobile Menu Toggle
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            // Change icon if needed (handled by CSS active state or manual lucide update)
        });
    }

    // 4. Staggered Text Animation
    if (typeof initStaggerNav === 'function') {
        initStaggerNav();
    }
}

// Export if using modules, but here we'll just keep it global for simplicity in static site
window.initHeader = initHeader;

// Security Protocol: Dynamic GNB Rendering & Auth State Sync
document.addEventListener('DOMContentLoaded', () => {
    // Slight delay to ensure header component is loaded if injected dynamically
    setTimeout(() => {
        const adminBtn = document.getElementById('headerAdminBtn');
        const loginBtn = document.getElementById('headerLoginBtn');
        
        try {
            const rawSession = localStorage.getItem('userSession');
            const sessionData = rawSession ? JSON.parse(rawSession) : null;
            
            if (sessionData) {
                // If logged in, mutate Login button to Logout
                if (loginBtn) {
                    const span = loginBtn.querySelector('span');
                    if (span) span.textContent = '로그아웃';
                    
                    const icon = loginBtn.querySelector('i');
                    if (icon) icon.setAttribute('data-lucide', 'log-out');
                    
                    loginBtn.href = '#';
                    loginBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        localStorage.removeItem('userSession');
                        window.location.reload();
                    });
                }
                
                // Expose Admin feature only to Admin role
                if (adminBtn && sessionData.role && sessionData.role.includes('ADMIN')) {
                    adminBtn.style.display = 'flex';
                }
            }
            
            // Re-initialize lucide icons for mutated items
            if (window.lucide) {
                window.lucide.createIcons();
            }
        } catch (e) {
            // Immutable/Silent fail on parse error
            console.error('Session parsing error');
        }
    }, 100);
});
