/*

 * JEJU STAY - Interactive JavaScript (Global OTA Style Refactor)
 * 수정된 로직: 이벤트 버블링 방지, 팝업 제어 중앙화, 통합된 날짜 선택 확인
 */

// 전역 변수
let calendarState = {
    checkIn: null,  // 확정된 체크인 (Timestamp)
    checkOut: null, // 확정된 체크아웃 (Timestamp)
    tempCheckIn: null,  // 팝업 내 임시 체크인
    tempCheckOut: null  // 팝업 내 임시 체크아웃
};
let calendarController = null;

document.addEventListener('DOMContentLoaded', function() {
    // 아이콘 생성
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // 초기화 함수 실행
    initHeader();
    initMobileMenu();
    initWishlistButtons();
    initScrollAnimations();
    initSearchTabs();
    
    // [중요] 리팩토링된 핵심 기능
    initDestinationDropdown();
    initCalendar(); 
    initGuestSelector();
    
    // [중요] 전역 클릭 리스너 (팝업 닫기)
    document.addEventListener('click', (e) => {
        closeAllPopups(); 
    });

    // [전용] 프리미엄 애니메이션 (GSAP가 로드된 경우만 실행)
    initPremiumAnimations();
});

/* ========== [유지] 공통 기능 ========== */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
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

function initWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            btn.classList.toggle('active');
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hotel-card, .destination-card').forEach(el => observer.observe(el));
}

function initSearchTabs() {
    const tabs = document.querySelectorAll('.search-tab-large');
    const hotelForm = document.getElementById('searchFormHotel');
    const activityForm = document.getElementById('searchFormActivity');
    
    if (!tabs || !hotelForm) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'activity' && activityForm) {
                hotelForm.classList.add('hidden');
                activityForm.classList.remove('hidden');
            } else {
                hotelForm.classList.remove('hidden');
                if (activityForm) activityForm.classList.add('hidden');
            }
        });
    });
}

/* ========== [리팩토링] 팝업 제어 중앙화 ========== */
// 모든 팝업을 닫는 함수 (예외 ID 지정 가능)
function closeAllPopups(exceptId = null) {
    const popupMap = {
        'destinationDropdown': document.getElementById('destinationDropdown'),
        'calendarPopup': document.getElementById('calendarPopup'),
        'guestPopupLarge': document.getElementById('guestPopupLarge')
    };
    
    Object.keys(popupMap).forEach(key => {
        const popup = popupMap[key];
        // 예외 ID가 아니고 팝업이 존재하면 닫기
        if (key !== exceptId && popup && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    });

    // 필드 활성 상태 제거 (CSS 시각 효과용)
    const activeFields = document.querySelectorAll('.active-field'); // 나중에 CSS 추가 시 활용을 위해 클래스 토글
    // 여기서는 간단히 로직만 처리하거나, 필요 시 필드의 active 클래스 제거 로직 추가
}

/* ========== [리팩토링] 여행지 선택 (Destination) ========== */
function initDestinationDropdown() {
    const destField = document.getElementById('destinationFieldLarge');
    const destInput = document.getElementById('destinationInput');
    const destDropdown = document.getElementById('destinationDropdown');

    if (!destField || !destDropdown) return;

    // 1. 여행지 필드 클릭 시 토글
    destField.addEventListener('click', (e) => {
        e.stopPropagation(); // 버블링 방지 (문서 클릭으로 닫히지 않게)
        
        const isActive = destDropdown.classList.contains('active');
        closeAllPopups('destinationDropdown'); // 다른 팝업 닫기
        
        if (!isActive) {
            destDropdown.classList.add('active');
            // destField.classList.add('active');
        } else {
            destDropdown.classList.remove('active');
            // destField.classList.remove('active');
        }
    });

    // 2. Input 클릭 시 이벤트 전파 중단 (입력 도중 닫히지 않게)
    if (destInput) {
        destInput.addEventListener('click', (e) => {
            e.stopPropagation();
            // 입력창 클릭 시 드롭다운이 닫혀있다면 열어주는 것도 좋은 UX
            if (!destDropdown.classList.contains('active')) {
                 closeAllPopups('destinationDropdown');
                 destDropdown.classList.add('active');
            }
        });
    }

    // 3. 아이템 선택 시
    document.querySelectorAll('.destination-item, .destination-item-text').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // 상위로 전파 방지
            const val = item.dataset.value;
            if (destInput) destInput.value = val;
            
            destDropdown.classList.remove('active');
        });
    });
    
    // 드롭다운 내부 클릭 시 닫히지 않도록
    destDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/* ========== [리팩토링] 날짜 선택 (Calendar) ========== */
function initCalendar() {
    if (!window.JJRangeCalendar || calendarController) return;

    calendarController = window.JJRangeCalendar.createRangeCalendar({
        state: calendarState,
        weekStartsOn: 'monday',
        weekdayLabels: ['월', '화', '수', '목', '금', '토', '일'],
        monthLabelFormatter: (dateObj) => `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월`,
        showHoverRange: true,
        enableTabs: true,
        enableFlexibleOptions: true,
        toggleMode: 'toggle',
        closeAllPopups: (exceptId) => closeAllPopups(exceptId),
        onTempChange: () => updateResults()
    }).init();
}

function renderCalendar() {
    if (calendarController) {
        calendarController.renderCalendar();
    }
}

function updateResults() {
    if (calendarState.tempCheckIn) updateDateDisplay('checkIn', new Date(calendarState.tempCheckIn));
    else updateDateDisplay('checkIn', null);

    if (calendarState.tempCheckOut) updateDateDisplay('checkOut', new Date(calendarState.tempCheckOut));
    else updateDateDisplay('checkOut', null);
}

function updateDateDisplay(type, dateObj) {
    const displayId = type === 'checkIn' ? 'checkInDisplay' : 'checkOutDisplay';
    const el = document.getElementById(displayId);
    if (!el) return;

    if (!dateObj) {
        const placeholder = type === 'checkIn' ? '체크인' : '체크아웃';
        el.textContent = placeholder; // '날짜 선택' 대신 명확한 placeholder
        el.style.color = '#999';
        return;
    }

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    el.textContent = `${y}-${m}-${d}`;
    el.style.color = '#333';
}


/* ========== [리팩토링] 인원 선택 (Guest) ========== */
function initGuestSelector() {
    const guestField = document.getElementById('guestFieldLarge');
    const guestPopup = document.getElementById('guestPopupLarge');
    
    if (!guestField || !guestPopup) return;

    // 1. 토글
    guestField.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = guestPopup.classList.contains('active');
        closeAllPopups('guestPopupLarge');
        
        if (!isActive) {
            guestPopup.classList.add('active');
        } else {
            guestPopup.classList.remove('active');
        }
    });

    // 2. 팝업 내부 클릭 방지
    guestPopup.addEventListener('click', (e) => e.stopPropagation());

    // 3. 증감 버튼 로직
    document.querySelectorAll('.counter-btn-new').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // 버튼 클릭 시 팝업 닫히지 않게
            
            const target = btn.dataset.target; // 'rooms', 'adults', 'children'
            const span = document.getElementById(`${target}CountLarge`);
            if (!span) return;

            let val = parseInt(span.textContent);
            const minValues = { 'rooms': 1, 'adults': 1, 'children': 0 };

            if (btn.classList.contains('plus')) {
                val++;
            } else {
                if (val > minValues[target]) val--;
            }
            
            span.textContent = val;
            updateGuestSummary();
        });
    });
}

function updateGuestSummary() {
    const rooms = parseInt(document.getElementById('roomsCountLarge').textContent || 1);
    const adults = parseInt(document.getElementById('adultsCountLarge').textContent || 1);
    const children = parseInt(document.getElementById('childrenCountLarge').textContent || 0);
    
    const summaryEl = document.getElementById('guestSummary');
    if (summaryEl) {
        let text = `성인 ${adults}명, 객실 ${rooms}개`;
        if (children > 0) text += `, 아동 ${children}명`;
        summaryEl.textContent = text;
    }
}

/* ========== [추가] GSAP Premium Animations (Private Stay) ========== */
function initPremiumAnimations() {
    // GSAP 라이브러리가 로드되었는지 확인
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Text Parallax & Fade
        const heroSubtitle = document.querySelector('.hero-subtitle-top');
        if (heroSubtitle) {
            gsap.from(heroSubtitle, {
                y: 30, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2
            });
        }

        const searchWidget = document.querySelector('.search-widget-large');
        if (searchWidget) {
            gsap.from(searchWidget, {
                y: 30, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.5
            });
        }

        // Destinations Stagger (존재 시)
        const destinationCards = document.querySelectorAll('.destinations-grid .destination-card');
        if (destinationCards.length > 0) {
            gsap.utils.toArray(destinationCards).forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: '.destinations-grid',
                        start: 'top 85%'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    delay: i * 0.15
                });
            });
        }

        // Promo Cards Stagger (존재 시)
        const promoCards = document.querySelectorAll('.promo-card');
        if (promoCards.length > 0) {
            gsap.from(promoCards, {
                scrollTrigger: {
                    trigger: '.promo-section',
                    start: 'top 85%'
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });
        }
    }
}
