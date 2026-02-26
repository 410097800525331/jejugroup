/* ==================== Strict Full Page Scroll Controller ==================== */
let isMainScrollInitialized = false;

function initMainScroll() {
    if (isMainScrollInitialized) return;
    const header = document.querySelector('.header');
    if (!header) return;
    isMainScrollInitialized = true;
    
    // --- Configuration ---
    const SCROLL_COOLDOWN = 1500; // Time in ms to ignore input after scroll
    const sections = document.querySelectorAll('.section');
    const footer = document.querySelector('footer');
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

        // 입력 창이나 날씨 오버레이 활성화 시 스크롤 막기 (RayPersona: 사용자 경험 보호)
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

// ==================== ✨ 언어 토글 기능 (오류 수정 완료) ✨ =================
// =======================================================================

const changeLanguage = (lang) => {
    // 텍스트 콘텐츠 업데이트
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (langData[lang] && langData[lang][key] !== undefined) {
             // HTML 태그 포함 여부에 따라 처리
             if (el.innerHTML.includes('<') && el.innerHTML.includes('>')) {
                // 기존 HTML 구조 유지하면서 텍스트만 바꿀 수 없으므로, 
                // data-lang을 사용하는 요소는 텍스트만 있는 것을 권장하거나, 
                // 특정 태그(strong 등)가 포함된 html 문자열을 langData에 정의해야 함.
                el.innerHTML = langData[lang][key];
             } else {
                el.textContent = langData[lang][key];
             }
        }
    });

    // Placeholder 업데이트
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (langData[lang] && langData[lang][key] !== undefined) {
            el.placeholder = langData[lang][key];
        }
    });

    document.documentElement.lang = lang;
};

let isLangToggleInitialized = false;
// 기본 언어 설정 (localStorage 또는 기본값)
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
        // 버튼 텍스트 업데이트
        langToggleButton.textContent = (currentLang === 'ko') ? 'English' : '한국어';
        localStorage.setItem('jeju_lang', currentLang);
        changeLanguage(currentLang);
        
        // FAB 등 다른 컴포넌트에도 알림
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLang }));
        document.dispatchEvent(new CustomEvent('fabLanguageChanged', { detail: currentLang }));
    });

    langToggleButton.textContent = (currentLang === 'ko') ? 'English' : '한국어';
}

document.addEventListener('DOMContentLoaded', initLangToggle);
document.addEventListener('mainHeaderLoaded', initLangToggle);

/* ==================== 비디오 전환 로직 ==================== */
let isVideoTransitionInitialized = false;

function initVideoTransitions() {
    if (isVideoTransitionInitialized) return;
    if (!document.querySelector('.header')) return;
    isVideoTransitionInitialized = true;

    // 호텔 페이지로 이동하는 모든 링크 선택 (버튼 포함)
    const hotelLinks = Array.from(document.querySelectorAll('a[href]')).filter(link => {
        const href = link.getAttribute('href') || '';
        return href.includes('hotel/jejuhotel.html');
    });
    const videoOverlay = document.getElementById('video-overlay');
    const transitionVideo = document.getElementById('transition-video');

    if (hotelLinks.length > 0 && videoOverlay && transitionVideo) {
        hotelLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 

                // 오버레이 표시 및 비디오 초기화
                videoOverlay.style.display = 'flex';
                videoOverlay.offsetHeight; // Force reflow
                videoOverlay.classList.add('active');
                
                // 비디오 속성 세팅 및 명시적 로드
                const targetHref = link.getAttribute('href') || './jejuhotel.html';

                const transitionVideoSrc = window.location.pathname.includes('/jejustay/pages/')
                    ? '../../../assets/videos/takeoff.mp4'
                    : 'assets/videos/takeoff.mp4';
                transitionVideo.src = transitionVideoSrc;
                transitionVideo.load();
                transitionVideo.muted = true;
                transitionVideo.playsInline = true;
                transitionVideo.currentTime = 0;
                
                console.log("비디오 로딩 및 재생 시도...");
                const playPromise = transitionVideo.play();

                let navigationTriggered = false;
                const triggerNavigation = () => {
                    if (!navigationTriggered) {
                        navigationTriggered = true;
                        window.location.href = targetHref;
                    }
                };

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // 자동 재생 성공
                        console.log("비디오 재생 시작");
                        
                        // 4초 후 강제 이동
                        setTimeout(() => {
                            console.log("4초 경과: 페이지 이동");
                            triggerNavigation();
                        }, 4000);
                    })
                    .catch(error => {
                        console.error("비디오 재생 실패:", error);
                        // 재생 실패 시 즉시 이동
                        triggerNavigation();
                    });
                }

                // 비디오가 4초보다 짧을 경우 종료 시 이동
                transitionVideo.onended = () => {
                    triggerNavigation();
                };

                // 만약 비디오가 너무 오래(5초) 끝나지 않으면 강제 이동 (안전 장치 - 4초 로직 실패 시 대비)
                setTimeout(() => {
                    if (videoOverlay.classList.contains('active')) {
                        triggerNavigation();
                    }
                }, 5000); 
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initVideoTransitions);
document.addEventListener('mainHeaderLoaded', initVideoTransitions);
