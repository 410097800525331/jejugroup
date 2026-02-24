/**
 * JEJU STAY - Unified Header Controller
 * handles scroll effects and theme switching
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    if (!header) return;

    const initHeaderScroll = () => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    };

    // Check if the page is a light-background page
    // These pages should have 'light-mode' by default to ensure visibility
    const lightPages = [
        'deals_partner.html',
        'travel_checklist.html',
        'customer_center.html',
        'reservation_check.html',
        'travel_tips.html',
        'deals_member.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();
    
    if (lightPages.includes(currentPage)) {
        header.classList.add('light-mode');
    } else {
        initHeaderScroll();
    }
});
