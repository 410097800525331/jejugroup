/* ========== Activities Page Logic ========== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (lucide) lucide.createIcons();

    // 2. Initialize Sticky Filter Logic
    initFilterBar();

    // 3. Initialize Shared Element Transition for Auth Modal
    initAuthModal();

    // 4. Initialize Lazy Loading
    initLazyLoad();

    // 5. Initialize Animations
    animateCards();

    // 6. Initialize Header Scroll Logic
    initHeaderScroll();
});

/* --- Filter Bar Logic --- */
function initFilterBar() {
    const chips = document.querySelectorAll('.filter-chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            // Active State Toggle
            chips.forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Animation (Stagger Effect)
            const cards = document.querySelectorAll('.activity-card');
            
            // GSAP Stagger Animation for "Filtering" feedback
            gsap.fromTo(cards, 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );

            // In a real app, you would filter the DOM elements here based on data-category
        });
    });
}

/* --- Shared Element Transition (Auth Modal) --- */
function initAuthModal() {
    const triggerBtn = document.getElementById('authBtn');
    const banner = document.getElementById('authBanner');
    const modalLayer = document.getElementById('authModalLayer');
    const modalContent = document.querySelector('.auth-modal-content');
    const closeBtn = document.getElementById('closeAuthModal');

    if (!triggerBtn || !banner || !modalLayer) return;

    triggerBtn.addEventListener('click', () => {
        // 1. Get positions
        const bannerRect = banner.getBoundingClientRect();
        
        // 2. Prepare Modal State
        modalLayer.classList.add('active');
        
        // 3. GSAP FLIP-like Animation
        // Expand from the banner size/pos to the centered modal size/pos
        
        gsap.fromTo(modalContent,
            {
                width: bannerRect.width,
                height: bannerRect.height,
                x: bannerRect.left - (window.innerWidth / 2 - bannerRect.width / 2), // Offset to center relative
                y: bannerRect.top - (window.innerHeight / 2 - bannerRect.height / 2),
                opacity: 0.5,
                borderRadius: '16px' // Match banner radius
            },
            {
                width: '500px',
                height: 'auto',
                x: 0,
                y: 0,
                opacity: 1,
                borderRadius: '20px',
                duration: 0.5,
                ease: "cubic-bezier(0.19, 1, 0.22, 1)" // Expo-ish ease
            }
        );
    });

    // Close Logic
    const closeAction = () => {
        gsap.to(modalContent, {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modalLayer.classList.remove('active');
                gsap.set(modalContent, { clearProps: "all" }); // Reset for next open
            }
        });
    };

    closeBtn.addEventListener('click', closeAction);
    modalLayer.addEventListener('click', (e) => {
        if(e.target === modalLayer) closeAction();
    });
}

/* --- Lazy Loading --- */
function initLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add a fade-in class or handled by CSS transition on opacity if src changes
                // Since we use native loading="lazy", browsers handle fetch, but we can add effects
                img.style.opacity = 0;
                setTimeout(() => {
                    img.style.opacity = 1;
                }, 100);
                obs.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

/* --- Initial Card Entrance --- */
function animateCards() {
    gsap.from(".activity-card", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
    });
}

/* --- Header Scroll Logic --- */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    // Initial check
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
