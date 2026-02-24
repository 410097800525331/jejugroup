/**
 * JEJU STAY - Mega Menu & Staggered Animation Controller
 * 
 * [Features]
 * 1. Crazy Raccoon Style Staggered Text Animation
 * 2. Glassmorphism Mega Menu showing/hiding logic with sequence animation
 */

/**
 * Initialize Staggered Navigation Text
 * Splits text into characters and sets up the 2-layer structure for animation.
 */
const initStaggerNav = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Find the specific span that contains the text to animate
        // We look for [data-lang] or just the immediate text span if generic
        const textSpan = link.querySelector('span[data-lang]') || link.querySelector('span');
        
        if (!textSpan) return;
        
        // Prevent double initialization
        if (textSpan.classList.contains('stagger-ready')) return;
        
        const originalText = textSpan.textContent.trim();
        
        // Clear original text and replace with stagger structure
        textSpan.textContent = '';
        textSpan.classList.add('stagger-ready');
        
        const wrapper = document.createElement('span');
        wrapper.className = 'stagger-wrapper';

        // Helper to create a group of span chars
        const createGroup = (cls) => {
            const group = document.createElement('span');
            group.className = cls;
            
            originalText.split('').forEach((char, i) => {
                const s = document.createElement('span');
                s.className = 'stagger-char';
                s.textContent = char === ' ' ? '\u00A0' : char; // Preserve space
                // Stagger delay: 30ms per character
                s.style.transitionDelay = `${i * 30}ms`; 
                group.appendChild(s);
            });
            
            return group;
        };

        wrapper.appendChild(createGroup('stagger-original'));
        wrapper.appendChild(createGroup('stagger-clone'));
        
        textSpan.appendChild(wrapper);

        // Hover Event Listeners
        let isAnimating = false;
        
        link.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            link.classList.add('is-animating');
            
            // Allow re-trigger only after animation + buffer
            // Duration approx: (char count * 30ms) + 300ms transition
            const totalDuration = (originalText.length * 30) + 350;
            
            setTimeout(() => {
                link.classList.remove('is-animating');
                isAnimating = false;
            }, totalDuration);
        });
    });
};

/**
 * Initialize Mega Menu Logic
 * Handles the sequential entrance of cards and hover states.
 */
const initMegaMenuLogic = () => {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const menu = item.querySelector('.mega-dropdown');
        if (!menu) return;

        let openTimeout;
        let closeTimeout;

        // Mouse Enter: Open Menu
        item.addEventListener('mouseenter', () => {
            clearTimeout(closeTimeout); // Cancel pending close
            
            // Small delay to prevent accidental flickering
            openTimeout = setTimeout(() => {
                // Close other open mega menus first if necessary (optional, but good for UX)
                document.querySelectorAll('.mega-dropdown.active').forEach(other => {
                    if(other !== menu) other.classList.remove('active');
                });

                menu.classList.add('active');
                
                // Animate Cards Sequence using JS for precise control
                const cards = menu.querySelectorAll('.mega-card');
                cards.forEach((card, i) => {
                    // Reset first
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    card.style.transition = 'none';

                    // Trigger reflow
                    void card.offsetWidth;

                    // Apply animation with delay
                    // 60ms interval (0.06s)
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60 + 50); // +50ms initial offset
                });

            }, 50);
        });

        // Mouse Leave: Close Menu
        item.addEventListener('mouseleave', () => {
            clearTimeout(openTimeout);
            
            closeTimeout = setTimeout(() => {
                menu.classList.remove('active');
            }, 100); 
        });
        
        // Also ensure menu stays open when hovering the menu itself (redundant if menu is child of nav-item, but safe)
        menu.addEventListener('mouseenter', () => clearTimeout(closeTimeout));
        menu.addEventListener('mouseleave', () => {
             closeTimeout = setTimeout(() => {
                menu.classList.remove('active');
            }, 100);
        });
    });
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
       initStaggerNav();
       initMegaMenuLogic();
    });
} else {
    initStaggerNav();
    initMegaMenuLogic();
}
