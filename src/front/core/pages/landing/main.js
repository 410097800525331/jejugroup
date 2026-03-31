/* ==================== Strict Full Page Scroll Controller ==================== */
let isMainScrollInitialized = false;

function initMainScroll(retryCount = 0) {
    if (isMainScrollInitialized) return;
    const header = document.querySelector('.header');
    const footer = document.querySelector('footer');
    if (!header || !footer) {
        if (retryCount < 40) {
            window.setTimeout(() => initMainScroll(retryCount + 1), 50);
        }
        return;
    }
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

    const normalizePathname = (pathname) => {
        if (!pathname || pathname === '/') {
            return '/index.html';
        }

        if (pathname.endsWith('/')) {
            return `${pathname}index.html`;
        }

        return pathname;
    };

    const resolveSectionIdFromHref = (href) => {
        if (!href) {
            return null;
        }

        try {
            if (href.startsWith('#')) {
                return href.substring(1) || null;
            }

            const resolvedUrl = new URL(href, window.location.href);
            const currentUrl = new URL(window.location.href);
            if (
                normalizePathname(resolvedUrl.pathname) !== normalizePathname(currentUrl.pathname) ||
                !resolvedUrl.hash
            ) {
                return null;
            }

            return resolvedUrl.hash.substring(1) || null;
        } catch (_error) {
            return null;
        }
    };

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
                    header.classList.remove('scrolled', 'section2plus-header', 'footer-header');
                    header.classList.add('section1-header');
                    if (topBtn) topBtn.classList.remove('show');
                } else {
                    // 섹션 2부터는 흰색 배경에 어두운 글자 스타일 (scrolled 클래스 활용)
                    header.classList.remove('section1-header', 'footer-header');
                    header.classList.add('scrolled', 'section2plus-header');
                    if (topBtn) topBtn.classList.add('show');
                }

                // Nav Link Active State
                navLinks.forEach(link => {
                    const targetSectionId = resolveSectionIdFromHref(link.getAttribute('href'));
                    if (targetSectionId === entry.target.id) {
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
            const targetId = resolveSectionIdFromHref(link.getAttribute('href'));
            if (!targetId) {
                return;
            }

            const targetSection = document.getElementById(targetId);
            if (!targetSection) {
                return;
            }

            e.preventDefault();
            currentSectionIndex = Array.from(sections).indexOf(targetSection);
            scrollToCurrentIndex();
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

const whenStageReady = (stage, callback) => {
    const lifecycle = window.__JEJU_RUNTIME_LIFECYCLE__;
    if (lifecycle?.whenReady) {
        lifecycle.whenReady(stage).then(() => callback());
        return;
    }

    callback();
};

document.addEventListener('DOMContentLoaded', () => {
    whenStageReady('main-shell', initMainScroll);
});

// ==================== Landing Language Bridge ====================

const LANDING_LANGUAGE_STORAGE_KEYS = ['jeju_lang', 'front.lang', 'jeju_fab_lang'];
const LANDING_LANGUAGE_EVENTS = ['languageChanged', 'fabLanguageChanged', 'front:i18n-change'];

const landingI18n = (() => {
    const bridge = window.frontI18n;
    if (bridge) {
        return bridge;
    }

    const listeners = new Set();
    let nativeEventsBound = false;
    let suppressNativeEventNotify = 0;

    const normalizeLang = (value) => {
        if (typeof value !== 'string') {
            return null;
        }

        const trimmed = value.trim().toLowerCase();
        if (trimmed.indexOf('en') === 0) {
            return 'en';
        }

        if (trimmed.indexOf('ko') === 0) {
            return 'ko';
        }

        return null;
    };

    const readPersistedLang = () => {
        try {
            for (const storageKey of LANDING_LANGUAGE_STORAGE_KEYS) {
                const storedLang = normalizeLang(window.localStorage.getItem(storageKey));
                if (storedLang) {
                    return storedLang;
                }
            }
        } catch (_error) {
            return null;
        }

        return null;
    };

    const readDocumentLang = () => {
        const documentLang = normalizeLang(document.documentElement && document.documentElement.lang);
        if (documentLang) {
            return documentLang;
        }

        if (document.body && document.body.dataset) {
            const bodyLang = normalizeLang(document.body.dataset.currentLang || document.body.getAttribute('data-current-lang'));
            if (bodyLang) {
                return bodyLang;
            }
        }

        return null;
    };

    const updateDocumentLang = (lang) => {
        if (document.documentElement) {
            document.documentElement.setAttribute('lang', lang);
            document.documentElement.lang = lang;
        }

        if (document.body) {
            if (typeof document.body.removeAttribute === 'function') {
                document.body.removeAttribute('data-lang');
            }

            if (document.body.dataset) {
                if (Object.prototype.hasOwnProperty.call(document.body.dataset, 'lang')) {
                    try {
                        delete document.body.dataset.lang;
                    } catch (_error) {
                        document.body.dataset.lang = '';
                    }
                }

                document.body.dataset.currentLang = lang;
            } else if (typeof document.body.setAttribute === 'function') {
                document.body.setAttribute('data-current-lang', lang);
            }
        }
    };

    const isCurrentLangCarrierNode = (node) => {
        return node === document.documentElement || node === document.body;
    };

    const persistLang = (lang) => {
        try {
            for (const storageKey of LANDING_LANGUAGE_STORAGE_KEYS) {
                window.localStorage.setItem(storageKey, lang);
            }
        } catch (_error) {
            // 저장 실패는 조용히 무시한다.
        }
    };

    const resolveCurrentLang = (preferredLang) => {
        const explicit = normalizeLang(preferredLang);
        if (explicit) {
            return explicit;
        }

        const persisted = readPersistedLang();
        if (persisted) {
            return persisted;
        }

        const documentLang = readDocumentLang();
        if (documentLang) {
            return documentLang;
        }

        const navigatorLang = normalizeLang(window.navigator && window.navigator.language);
        if (navigatorLang) {
            return navigatorLang;
        }

        return 'ko';
    };

    const translate = (key, options) => {
        const config = options && typeof options === 'object' ? options : {};
        const lang = resolveCurrentLang(config.lang);
        const fallback = Object.prototype.hasOwnProperty.call(config, 'fallback') ? config.fallback : key;
        const pack = window.langData && window.langData[lang];

        if (pack && Object.prototype.hasOwnProperty.call(pack, key)) {
            const translated = pack[key];
            return typeof translated === 'string' ? translated : translated == null ? '' : String(translated);
        }

        return fallback == null ? '' : fallback;
    };

    const applyLanguageToRoot = (rootNode, options) => {
        const config = options && typeof options === 'object' ? options : {};
        const scope = rootNode || document;
        const lang = resolveCurrentLang(config.lang);
        let translatedCount = 0;

        if (!scope || typeof scope.querySelectorAll !== 'function') {
            return translatedCount;
        }

        scope.querySelectorAll('[data-lang]').forEach((node) => {
            if (isCurrentLangCarrierNode(node)) {
                return;
            }

            const token = node.getAttribute('data-lang') || (node.dataset && node.dataset.lang);
            if (!token) {
                return;
            }

            const translated = translate(token, { lang, fallback: token });
            const renderHtml = (config && config.renderHtml) || node.dataset.langHtml === 'true' || node.getAttribute('data-lang-html') === 'true';

            if (renderHtml) {
                node.innerHTML = translated;
            } else {
                node.textContent = translated;
            }

            if (node.tagName && /^(INPUT|TEXTAREA)$/i.test(node.tagName) && 'value' in node) {
                node.value = translated;
            }

            translatedCount += 1;
        });

        scope.querySelectorAll('[data-lang-placeholder]').forEach((node) => {
            const token = node.getAttribute('data-lang-placeholder') || (node.dataset && node.dataset.langPlaceholder);
            if (!token) {
                return;
            }

            node.setAttribute('placeholder', translate(token, { lang, fallback: token }));
            translatedCount += 1;
        });

        updateDocumentLang(lang);
        return translatedCount;
    };

    const extractEventLang = (event) => {
        if (!event) {
            return null;
        }

        if (typeof event.detail === 'string') {
            return normalizeLang(event.detail);
        }

        if (event.detail && typeof event.detail === 'object') {
            return normalizeLang(event.detail.lang || event.detail.currentLang || event.detail.value);
        }

        return null;
    };

    const notifySubscribers = (detail) => {
        listeners.forEach((listener) => {
            try {
                listener(detail);
            } catch (_error) {
                // 구독자 예외는 다른 구독자를 막지 않게 삼킨다.
            }
        });
    };

    const syncFromExternalEvent = (event) => {
        if (!event || suppressNativeEventNotify > 0) {
            return;
        }

        const lang = extractEventLang(event);
        if (!lang) {
            return;
        }

        const previousLang = resolveCurrentLang();
        persistLang(lang);
        updateDocumentLang(lang);
        notifySubscribers({
            lang,
            previousLang,
            source: event.type || 'external',
            external: true,
            eventDetail: event.detail,
        });
    };

    const bindNativeLanguageListeners = () => {
        if (nativeEventsBound) {
            return;
        }

        const handler = (event) => {
            syncFromExternalEvent(event);
        };

        LANDING_LANGUAGE_EVENTS.forEach((eventName) => {
            document.addEventListener(eventName, handler);
            window.addEventListener(eventName, handler);
        });

        nativeEventsBound = true;
    };

    const dispatchLanguageChange = (detail) => {
        if (typeof window.CustomEvent !== 'function') {
            return false;
        }

        const eventDetail = detail && typeof detail === 'object' && !Array.isArray(detail)
            ? detail
            : { lang: resolveCurrentLang(detail) };

        suppressNativeEventNotify += 1;
        try {
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: eventDetail.lang }));
            document.dispatchEvent(new CustomEvent('fabLanguageChanged', { detail: eventDetail.lang }));
            document.dispatchEvent(new CustomEvent('front:i18n-change', { detail: eventDetail }));
        } finally {
            suppressNativeEventNotify = Math.max(0, suppressNativeEventNotify - 1);
        }

        return true;
    };

    bindNativeLanguageListeners();

    return {
        DEFAULT_LANG: 'ko',
        LANGUAGE_CHANGED_EVENT: 'languageChanged',
        FAB_LANGUAGE_CHANGED_EVENT: 'fabLanguageChanged',
        LANGUAGE_CHANGE_EVENT: 'front:i18n-change',
        resolveCurrentLang,
        getCurrentLang() {
            return resolveCurrentLang();
        },
        translate,
        applyLanguageToRoot,
        setCurrentLang(nextLang, options) {
            const config = options && typeof options === 'object' ? options : {};
            const resolved = resolveCurrentLang(nextLang);
            const previousLang = resolveCurrentLang();
            const payload = {
                lang: resolved,
                previousLang,
                source: config.source || 'landing-fallback',
            };

            if (config.persist !== false) {
                persistLang(resolved);
            }

            updateDocumentLang(resolved);
            notifySubscribers(payload);
            dispatchLanguageChange(payload);
            return resolved;
        },
        subscribeLanguageChange(listener) {
            if (typeof listener !== 'function') {
                return function unsubscribe() {};
            }

            listeners.add(listener);
            return function unsubscribe() {
                listeners.delete(listener);
            };
        },
        unsubscribeLanguageChange(listener) {
            return listeners.delete(listener);
        },
        dispatchLanguageChange,
    };
})();

let isLangToggleInitialized = false;
let isLandingLanguageInitialized = false;
let langToggleButton = null;
let landingLanguageUnsubscribe = null;

const resolveLandingLang = (payload) => {
    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'detail')) {
        return resolveLandingLang(payload.detail);
    }

    if (typeof payload === 'string') {
        const normalized = payload.trim().toLowerCase();
        if (normalized.indexOf('en') === 0) {
            return 'en';
        }
        if (normalized.indexOf('ko') === 0) {
            return 'ko';
        }
    }

    if (payload && typeof payload === 'object') {
        return resolveLandingLang(payload.lang || payload.currentLang || payload.value || payload.previousLang);
    }

    if (typeof landingI18n.resolveCurrentLang === 'function') {
        return landingI18n.resolveCurrentLang();
    }

    return 'ko';
};

const syncLangToggleLabel = (lang) => {
    if (!langToggleButton) {
        return;
    }

    langToggleButton.textContent = lang === 'ko' ? 'English' : '한국어';
};

    const applyLandingLanguage = (payload) => {
        const lang = resolveLandingLang(payload);

        if (typeof landingI18n.applyLanguageToRoot === 'function') {
            if (document.body) {
                if (typeof document.body.removeAttribute === 'function') {
                    document.body.removeAttribute('data-lang');
                }

                if (document.body.dataset && Object.prototype.hasOwnProperty.call(document.body.dataset, 'lang')) {
                    try {
                        delete document.body.dataset.lang;
                    } catch (_error) {
                        document.body.dataset.lang = '';
                    }
                }
            }

            landingI18n.applyLanguageToRoot(document, { lang });
        }

    syncLangToggleLabel(lang);
    return lang;
};

const bindLandingLanguageSync = () => {
    if (landingLanguageUnsubscribe || typeof landingI18n.subscribeLanguageChange !== 'function') {
        return;
    }

    landingLanguageUnsubscribe = landingI18n.subscribeLanguageChange((detail) => {
        applyLandingLanguage(detail);
    });
};

const initLandingLanguage = () => {
    if (isLandingLanguageInitialized) {
        return;
    }

    isLandingLanguageInitialized = true;
    bindLandingLanguageSync();
    applyLandingLanguage(resolveLandingLang());
};

function initLangToggle() {
    if (isLangToggleInitialized) return;
    langToggleButton = document.querySelector('.lang-toggle');
    if (!langToggleButton) return;
    isLangToggleInitialized = true;

    syncLangToggleLabel(resolveLandingLang());

    langToggleButton.addEventListener('click', () => {
        const nextLang = resolveLandingLang() === 'ko' ? 'en' : 'ko';
        landingI18n.setCurrentLang(nextLang, { source: 'landing-toggle' });
    });
}

initLandingLanguage();

document.addEventListener('DOMContentLoaded', () => {
    initLandingLanguage();
    whenStageReady('main-header', initLangToggle);
});

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

document.addEventListener('DOMContentLoaded', () => {
    whenStageReady('main-header', initVideoTransitions);
});
