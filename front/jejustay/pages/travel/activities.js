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

    // 5. Initialize Animations (Pre-hide to prevent FOUC)
    gsap.set(".activity-card", { autoAlpha: 0, y: 50 });

    // 6. Initialize Header Scroll Logic
    initHeaderScroll();

    // 7. Initialize Wishlist Buttons
    initWishlistButtons();

    // 8. Initialize Mobile Menu
    initMobileMenu();
});

// Trigger Animation when everything is loaded (Images, Fonts)
window.addEventListener('load', () => {
    animateCards();
});

/* --- Filter Bar Logic --- */
function initFilterBar() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.activity-card'); // Select all cards at initiation

    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            // 1. Update Active State
            chips.forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const category = e.currentTarget.dataset.category;

            // 2. Filter Logic with GSAP
            // First, animate out *all* cards
            gsap.to(cards, {
                autoAlpha: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    // After fade out, change display properties
                    cards.forEach(card => {
                        const cardCategory = card.dataset.category;
                        if (category === 'all' || cardCategory === category) {
                            card.style.display = 'flex'; // Restore layout
                        } else {
                            card.style.display = 'none'; // Remove from layout
                        }
                    });

                    // Recalculate GSAP (since layout changed)
                    // Then animate in only the visible ones
                    const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
                    
                    gsap.fromTo(visibleCards, 
                        { autoAlpha: 0, y: 20 },
                        { 
                            autoAlpha: 1, 
                            y: 0, 
                            duration: 0.4, 
                            stagger: 0.05, 
                            ease: "power2.out",
                            clearProps: "y" // Keep opacity/visibility, clear transform
                        }
                    );
                }
            });
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
    gsap.to(".activity-card", {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all" // Ensure no inline styles remain after animation to allow hover effects
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

/* --- Wishlist Button Logic --- */
function initWishlistButtons() {
    const buttons = document.querySelectorAll('.wishlist-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click event

            const isActive = btn.classList.contains('active');
            
            // Toggle State
            btn.classList.toggle('active');

            // Animation
            if (!isActive) { // activating
                gsap.fromTo(btn, 
                    { scale: 1 },
                    { 
                        scale: 1.4, 
                        duration: 0.4, 
                        ease: "elastic.out(1, 0.3)",
                        onComplete: () => gsap.to(btn, { scale: 1, duration: 0.2 })
                    }
                );
            } else { // deactivating
                gsap.to(btn, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 });
            }
        });
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
}
