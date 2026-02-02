
/**
 * Staggered Text Animation (Crazy Raccoon Style)
 * Logic: Trigger -> Animate -> Wait -> Snap Back (Silent Reset)
 */

document.addEventListener('DOMContentLoaded', () => {
    initStaggerNav();
});

function initStaggerNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Find the text span (usually has data-lang)
        const textSpan = link.querySelector('span[data-lang]');
        if (!textSpan) return;

        const originalText = textSpan.textContent.trim();
        if (!originalText) return;

        // 1. DOM Hydration: Create Split Structure
        // We need two groups: Original and Clone
        const wrapper = document.createElement('span');
        wrapper.className = 'stagger-wrapper';

        const groupOriginal = createSplitGroup(originalText, 'stagger-original');
        const groupClone = createSplitGroup(originalText, 'stagger-clone');

        wrapper.appendChild(groupOriginal);
        wrapper.appendChild(groupClone);

        // Replace old text content with new wrapper
        textSpan.textContent = '';
        textSpan.appendChild(wrapper);

        // 2. Event Logic
        // State to prevent re-triggering while running
        let isAnimating = false;
        const CHAR_DELAY = 30; // ms per char
        const DURATION = 300;  // ms active transition
        const BUFFER = 50;     // extra buffer for safety

        link.addEventListener('mouseenter', () => {
            if (isAnimating) return; // Ignore if already running
            isAnimating = true;

            // Activate Animation
            link.classList.add('is-animating');

            // Calculate total run time
            // Last char delay + duration
            const totalTime = (originalText.length * CHAR_DELAY) + DURATION + BUFFER;

            // Auto Reset Timer
            setTimeout(() => {
                // Remove class to Snap Back
                // Because CSS inactive transition is 0s, this happens instantly/invisibly
                link.classList.remove('is-animating');
                isAnimating = false;
            }, totalTime);
        });
    });
}

/**
 * Helper to create a group of span characters
 */
function createSplitGroup(text, className) {
    const group = document.createElement('span');
    group.className = className;
    group.setAttribute('aria-hidden', className.includes('clone')); // Clone is decorative

    text.split('').forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'stagger-char';
        charSpan.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
        charSpan.style.transitionDelay = `${index * 30}ms`;
        group.appendChild(charSpan);
    });

    return group;
}
