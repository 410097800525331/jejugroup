/* ==================== Strict Full Page Scroll Controller ==================== */
let isMainScrollInitialized = false;

function initMainScroll() {
    if (isMainScrollInitialized) return;
    const header = document.querySelector('.header');
    const footer = document.querySelector('footer');
    if (!header || !footer) return;
    isMainScrollInitialized = true;
    
    // --- Configuration ---
    const SCROLL_COOLDOWN = 1500; // Time in ms to ignore input after scroll
    const sections = document.querySelectorAll('.section');
    const isNormalScrollPage =
        document.body.classList.contains('customer-center-page') ||
        document.body.classList.contains('scroll-normal') ||
        document.body.classList.contains('login-page') ||
        document.body.classList.contains('signup-page') ||
        document.body.classList.contains('reservation-page');
    
    // UI Elements
    const topBtn = document.getElementById('topBtn');
    const navLinks = document.querySelectorAll('.gnb-link');

    // --- State ---
    let currentSectionIndex = 0; // 0 to sections.length (where last index is Footer)
    let isScrolling = false;
    let lastScrollTime = 0;
    let touchStartY = 0;

    // The total number of stops = sections + footer
    // Indices: 0, 1, ..., sections.length-1, sections.length (Footer)
    const maxIndex = sections.length; 

    // --- Smooth Scroll Animation Engine ---
    const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(Math.min(timeElapsed / duration, 1)); // Normalize time

            window.scrollTo(0, startPosition + (distance * run));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure we land exactly on target
                window.scrollTo(0, targetPosition);
                isScrolling = false; // Release lock only after animation finishes
            }
        }

        requestAnimationFrame(animation);
    }

    // --- Scroll Function ---
    function scrollToCurrentIndex() {
        isScrolling = true;

        let targetTop = 0;

        if (currentSectionIndex < sections.length) {
            targetTop = sections[currentSectionIndex].offsetTop;
        } else {
            targetTop = footer.offsetTop;
        }

        // Use custom animation
        // Duration: 1000ms for a slow, premium feel
        smoothScrollTo(targetTop, 1000); 

        // Note: isScrolling is now reset inside smoothScrollTo's callback
        // We set a backup timeout just in case animation glitch (safety net)
        setTimeout(() => {
            isScrolling = false;
        }, 1200);
    }

    // --- Input Handlers ---
    
    // 1. Wheel Event
    window.addEventListener('wheel', (e) => {
        // Allow default scroll for specific pages
        if (isNormalScrollPage) {
            return;
        }

        e.preventDefault(); // Lock native scroll

        const now = new Date().getTime();
        if (now - lastScrollTime < SCROLL_COOLDOWN) return;

        if (isScrolling) return;

        if (e.deltaY > 0) {
            // Scroll Down
            if (currentSectionIndex < maxIndex) {
                lastScrollTime = now;
                currentSectionIndex++;
                scrollToCurrentIndex();
            }
        } else {
            // Scroll Up
            if (currentSectionIndex > 0) {
                lastScrollTime = now;
                currentSectionIndex--;
                scrollToCurrentIndex();
            }
        }
    }, { passive: false });

    // 2. Keyboard Event
    window.addEventListener('keydown', (e) => {
        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        
        // Allow default scroll for specific pages
        if (isNormalScrollPage) {
            return;
        }

        // ?혚??筌≪럩혶???田??????혞???혵???????승곎?筌띉됪묾?(RayPersona: ??혳??野껋?혰혱 癰귣똾혱?
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' || 
            document.querySelector('.weather-overlay.active')) {
            return;
        }

        if (keys.includes(e.key)) {
            e.preventDefault();
            
            const now = new Date().getTime();
            if (now - lastScrollTime < SCROLL_COOLDOWN) return;

            if (isScrolling) return;

            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
                if (currentSectionIndex < maxIndex) {
                    lastScrollTime = now;
                    currentSectionIndex++;
                    scrollToCurrentIndex();
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                if (currentSectionIndex > 0) {
                    lastScrollTime = now;
                    currentSectionIndex--;
                    scrollToCurrentIndex();
                }
            } else if (e.key === 'Home') {
                lastScrollTime = now;
                currentSectionIndex = 0;
                scrollToCurrentIndex();
            } else if (e.key === 'End') {
                lastScrollTime = now;
                currentSectionIndex = maxIndex;
                scrollToCurrentIndex();
            }
        }
    }, { passive: false });

    if (isNormalScrollPage) {
        return;
    }

    // --- UI Observers (Keep UI in sync with visual position) ---
    // This runs independently to update header colors/navs regardless of how we got there
    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine logic based on visible section
                
                // Update Index (in case of manual hash navigation or resize)
                // We trust our logic, but this helps sync if something goes off-beat
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== -1 && !isScrolling) {
                     // Note: We don't force currentSectionIndex here during active scroll
                     // to avoid race conditions, but it CAN be useful for resize.
                     // For strict scroll, we mostly rely on the variable.
                     currentSectionIndex = index;
                }

                // Header Style
                if (entry.target.id === 'section-1') {
                    header.classList.remove('transparent', 'section2plus-header', 'footer-header');
                    header.classList.add('section1-header');
                    if (topBtn) topBtn.classList.remove('show');
                } else {
                    header.classList.remove('section1-header', 'footer-header');
                    header.classList.add('transparent', 'section2plus-header');
                    if (topBtn) topBtn.classList.add('show');
                }

                // Nav Link Active State
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active'); 
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
    observer.observe(footer); // Observe footer too if needed for some UI logic

    // --- Click Handlers (Integration) ---

    // GNB Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Internal links only
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Update index based on target
                    currentSectionIndex = Array.from(sections).indexOf(targetSection);
                    scrollToCurrentIndex();
                }
            }
        });
    });

    // Top Button
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            currentSectionIndex = 0;
            scrollToCurrentIndex();
        });
    }

    // Scroll Down Button
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            currentSectionIndex = 1; // Go to section 2
            scrollToCurrentIndex();
        });
    }
}

document.addEventListener('DOMContentLoaded', initMainScroll);
document.addEventListener('mainHeaderLoaded', initMainScroll);
document.addEventListener('mainFooterLoaded', initMainScroll);

// ==================== ???紐꽷??田? 疫꿸퀡혡?(??? ?혱?혮 ?혙?력? ??=================
// =======================================================================

const changeLanguage = (lang) => {
    // ?혥????꽷?혨筌??혚???꽷?
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (langData[lang] && langData[lang][key] !== undefined) {
             // HTML ?혵域???혮???????怨빧?筌Ｂ섊뵳?
             if (el.innerHTML.includes('<') && el.innerHTML.includes('>')) {
                // 疫꿸퀣??HTML ?닌듼??田??혱筌???혥??紐? 獄쎛? ???혛??곤）?嚥? 
                // data-lang????혳?혱?혬 ?혬?혣???혥??紐? ?혞?혬 野꺜?혙 亦끒??혱椰?? 
                // ?諭田┑??혵域?strong ??揶쎛 ??혮??html ?얜챷혷혨??겶씲?langData???혮?혱??겶???
                el.innerHTML = langData[lang][key];
             } else {
                el.textContent = langData[lang][key];
             }
        }
    });

    // Placeholder ?혚???꽷?
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (langData[lang] && langData[lang][key] !== undefined) {
            el.placeholder = langData[lang][key];
        }
    });

    document.documentElement.lang = lang;
};

let isLangToggleInitialized = false;
// 疫꿸퀡???紐꽷???쇽＆혮 (localStorage ?혨?혬 疫꿸퀡??첎?
let currentLang = localStorage.getItem('jeju_lang') || 'ko';

// Run initial translation immediately for static text
changeLanguage(currentLang);

function initLangToggle() {
    if (isLangToggleInitialized) return;
    const langToggleButton = document.querySelector('.lang-toggle');
    if (!langToggleButton) return;
    isLangToggleInitialized = true;

    langToggleButton.addEventListener('click', () => {
        currentLang = (currentLang === 'ko') ? 'en' : 'ko';
        // 甕걔???혥????혚???꽷?
        langToggleButton.textContent = (currentLang === 'ko') ? 'English' : '\uD55C\uAD6D\uC5B4';
        localStorage.setItem('jeju_lang', currentLang);
        changeLanguage(currentLang);
        
        // FAB ????삘뀲 ?뚮똾혧?혣??혨?혙 ?혣??
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLang }));
        document.dispatchEvent(new CustomEvent('fabLanguageChanged', { detail: currentLang }));
    });

    langToggleButton.textContent = (currentLang === 'ko') ? 'English' : '\uD55C\uAD6D\uC5B4';

}

document.addEventListener('DOMContentLoaded', initLangToggle);
document.addEventListener('mainHeaderLoaded', initLangToggle);

/* ==================== Video Transition ==================== */
let isVideoTransitionInitialized = false;
const VIDEO_TRANSITION_DURATION_MS = 4000;
const VIDEO_TRANSITION_FALLBACK_MS = 5000;

const isVideoTransitionEligibleLink = (link) => {
    const route = link.getAttribute('data-route') || '';
    const href = link.getAttribute('href') || '';

    if (!route && !href) {
        return false;
    }

    if (route === 'SERVICES.STAY.MAIN' || route === 'SERVICES.AIR.MAIN') {
        return true;
    }

    return href.includes('hotel/jejuhotel.html') || href.includes('jejuair/index.html');
};

const resolveVideoTransitionTarget = (link) => {
    const route = link.getAttribute('data-route') || '';
    const routeHref = link.getAttribute('href') || '';
    
    if (routeHref && routeHref !== '#') {
        return routeHref;
    }

    if (route === 'SERVICES.AIR.MAIN') {
        return 'jejuair/index.html';
    }

    return 'jejustay/pages/hotel/jejuhotel.html';
};

const resolveVideoTransitionSource = () => (
    window.location.pathname.includes('/jejustay/pages/')
        ? '../../../assets/videos/takeoff.mp4'
        : 'assets/videos/takeoff.mp4'
);

const attachVideoTransitionListener = (event, targetHref, videoOverlay, transitionVideo) => {
    if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    videoOverlay.style.display = 'flex';
    videoOverlay.offsetHeight; // Force reflow
    videoOverlay.classList.add('active');

    transitionVideo.src = resolveVideoTransitionSource();
    transitionVideo.load();
    transitionVideo.muted = true;
    transitionVideo.playsInline = true;
    transitionVideo.currentTime = 0;

    let navigationTriggered = false;
    const triggerNavigation = () => {
        if (navigationTriggered) {
            return;
        }

        navigationTriggered = true;
        if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
            window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetHref, 'video-transition');
            return;
        }

        window.location.assign(targetHref);
    };

    const playPromise = transitionVideo.play();
    if (playPromise && typeof playPromise.then === 'function') {
        playPromise
            .then(() => {
                // Keep the overlay for the transition duration, then navigate.
                setTimeout(() => {
                    triggerNavigation();
                }, VIDEO_TRANSITION_DURATION_MS);
            })
            .catch(() => {
                // On autoplay failure, keep the same delay so animation is still visible.
                setTimeout(() => {
                    triggerNavigation();
                }, VIDEO_TRANSITION_DURATION_MS);
            });
    } else {
        setTimeout(() => {
            triggerNavigation();
        }, VIDEO_TRANSITION_DURATION_MS);
    }

    // Safe fallback in case onended does not fire after load/play.
    transitionVideo.onended = () => {
        triggerNavigation();
    };

    setTimeout(() => {
        if (videoOverlay.classList.contains('active')) {
            triggerNavigation();
        }
    }, VIDEO_TRANSITION_FALLBACK_MS);
};

function initVideoTransitions() {
    if (isVideoTransitionInitialized) return;
    if (!document.querySelector('.header')) return;
    isVideoTransitionInitialized = true;

    const videoOverlay = document.getElementById('video-overlay');
    const transitionVideo = document.getElementById('transition-video');

    if (!videoOverlay || !transitionVideo) {
        return;
    }

    const onNavClickCapture = (event) => {
        const link = event.target.closest('a[data-route], a[href]');
        if (!link || !isVideoTransitionEligibleLink(link)) {
            return;
        }

        link.setAttribute('data-route-animated-nav', 'true');

        const targetHref = resolveVideoTransitionTarget(link);
        attachVideoTransitionListener(event, targetHref, videoOverlay, transitionVideo);
    };

    (document.body || document).addEventListener('click', onNavClickCapture, { capture: true });
}

document.addEventListener('DOMContentLoaded', initVideoTransitions);
document.addEventListener('mainHeaderLoaded', initVideoTransitions);
