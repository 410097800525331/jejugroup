/*

 * JEJU STAY - Interactive JavaScript (Global OTA Style Refactor)
 * 수정된 로직: 이벤트 버블링 방지, 팝업 제어 중앙화, 통합된 날짜 선택 확인
 */

// 전역 변수
let currentMonth = new Date();
let calendarState = {
    checkIn: null,  // 확정된 체크인 (Timestamp)
    checkOut: null, // 확정된 체크아웃 (Timestamp)
    tempCheckIn: null,  // 팝업 내 임시 체크인
    tempCheckOut: null  // 팝업 내 임시 체크아웃
};
let hoverDate = null;

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
    const calendarPopup = document.getElementById('calendarPopup');
    // HTML 구조상 #checkInField는 이제 날짜 전체 영역(Checkin+Checkout)을 감싸는 컨테이너 ID로 사용됨
    const dateFieldContainer = document.getElementById('checkInField'); 

    if (!calendarPopup || !dateFieldContainer) return;

    // 1. 날짜 영역 클릭 시 토글
    dateFieldContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // 버블링 방지
        
        const isActive = calendarPopup.classList.contains('active');
        closeAllPopups('calendarPopup');

        if (!isActive) {
            // [Fix] 팝업 열 때 확정된 날짜를 임시 상태로 동기화
            calendarState.tempCheckIn = calendarState.checkIn;
            calendarState.tempCheckOut = calendarState.checkOut;
            
            calendarPopup.classList.add('active');
            renderCalendar(); // 열릴 때 렌더링
        } else {
            calendarPopup.classList.remove('active');
        }
    });

    // 2. 팝업 내부 클릭 전파 방지
    calendarPopup.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 2-1. [수정] 탭 전환 로직 (캘린더 vs 날짜미정)
    const tabCalendar = document.getElementById('tab-calendar');
    const tabFlexible = document.getElementById('tab-flexible');
    const panelCalendar = document.getElementById('panel-calendar');
    const panelFlexible = document.getElementById('panel-flexible');

    function switchTab(targetTab) {
        [tabCalendar, tabFlexible].forEach(t => {
            if(t) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            }
        });
        [panelCalendar, panelFlexible].forEach(p => {
            if(p) {
                p.classList.remove('active');
                p.style.display = 'none';
            }
        });

        if(targetTab) {
            targetTab.classList.add('active');
            targetTab.setAttribute('aria-selected', 'true');
            
            if (targetTab === tabCalendar && panelCalendar) {
                panelCalendar.classList.add('active');
                panelCalendar.style.display = 'block';
            } else if (targetTab === tabFlexible && panelFlexible) {
                panelFlexible.classList.add('active');
                panelFlexible.style.display = 'block';
            }
        }
    }

    if(tabCalendar) tabCalendar.addEventListener('click', (e) => { e.stopPropagation(); switchTab(tabCalendar); });
    if(tabFlexible) tabFlexible.addEventListener('click', (e) => { e.stopPropagation(); switchTab(tabFlexible); });

    // 2-2. [추가] 날짜미정 옵션 선택 로직
    document.querySelectorAll('.Flexible-Option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            // 단일 선택 로직
            document.querySelectorAll('.Flexible-Option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            // (선택 시 바로 닫길 원하면 closeAllPopups() 추가 가능, 여기선 유지)
        });
    });


    // 3. 월 이동 버튼
    document.getElementById('prevMonth')?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth')?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });

    // 4. 초기화 버튼
    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState = { checkIn: null, checkOut: null, tempCheckIn: null, tempCheckOut: null };
        updateDateDisplay('checkIn', null);
        updateDateDisplay('checkOut', null);
        renderCalendar();
    });

    // 5. 확인 버튼
    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        // 임시 선택을 확정
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        closeAllPopups(); // 닫기
    });
}

/* ========== [기능] 달력 렌더링 로직 (Agoda Style) ========== */
function renderCalendar() {
    const container = document.getElementById('calendarMonths');
    if (!container) return;

    container.innerHTML = '';

    const leftDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const rightDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    [leftDate, rightDate].forEach(date => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'DayPicker-Month';
        
        // Caption
        const caption = document.createElement('div');
        caption.className = 'DayPicker-Caption';
        caption.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        monthDiv.appendChild(caption);

        // Weekdays
        const weekdays = document.createElement('div');
        weekdays.className = 'DayPicker-Weekdays';
        const daysRaw = ['월', '화', '수', '목', '금', '토', '일'];
        daysRaw.forEach(d => {
            const wd = document.createElement('div');
            wd.className = 'DayPicker-Weekday';
            wd.innerHTML = d;
            weekdays.appendChild(wd);
        });
        monthDiv.appendChild(weekdays);

        // Body (Days)
        const body = document.createElement('div');
        body.className = 'DayPicker-Body';
        body.innerHTML = generateMonthDaysHTML(date);
        monthDiv.appendChild(body);

        container.appendChild(monthDiv);
    });

    attachDayListeners();
}

function generateMonthDaysHTML(dateObj) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    
    // 월요일 시작 보정 (0:일 -> 6, 1:월 -> 0)
    // 하지만 보통 Date.getDay()는 일요일=0. 달력 UI가 월요일 시작인지 일요일 시작인지에 따라 다름.
    // 기존 코드: 월(0)~일(6) 순서라면, getDay() (일=0, 월=1...) -> 월=1 => offset 0
    // 여기서는 일요일 시작 달력으로 가정하거나, 디자인에 맞춤. 
    // 기존 Agoda 스타일 예제에서는 월요일 시작이었으므로:
    const firstDay = new Date(year, month, 1).getDay(); // 0(일)~6(토)
    // 월요일 시작을 위해 보정: 일(0)->6, 월(1)->0, ...
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayTs = new Date().setHours(0,0,0,0);

    let html = '';

    // Empty cells
    for(let i=0; i<startOffset; i++) {
        html += `<div class="DayPicker-Day DayPicker-Day--outside"></div>`;
    }

    // Days
    for(let d=1; d<=lastDate; d++) {
        const currentTs = new Date(year, month, d).getTime();
        
        let classes = ['DayPicker-Day'];
        
        // Disabled (과거)
        if (currentTs < todayTs) {
            classes.push('DayPicker-Day--disabled');
        }

        // Today
        if (currentTs === todayTs) {
            classes.push('DayPicker-Day--today');
        }

        // Selection Logic
        const checkIn = calendarState.tempCheckIn || calendarState.checkIn;
        const checkOut = calendarState.tempCheckOut || calendarState.checkOut;

        if (checkIn && currentTs === checkIn) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkIn');
            classes.push('DayPicker-Day--hasRange'); // 시작점 표시
        }
        if (checkOut && currentTs === checkOut) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut');
            classes.push('DayPicker-Day--hasRange'); // 끝점 표시
        }
        
        // Confirmed Range
        if (checkIn && checkOut && currentTs > checkIn && currentTs < checkOut) {
            classes.push('DayPicker-Day--inRange');
        }

        // Hover Range Logic
        // 시작일만 선택되어 있고, 종료일은 아직 미선택 상태일 때
        if (checkIn && !checkOut && hoverDate) {
            if (currentTs > checkIn && currentTs <= hoverDate) {
                classes.push('DayPicker-Day--hoverRange');
            }
        }

        html += `
            <div class="${classes.join(' ')}" 
                 data-timestamp="${currentTs}"
                 data-day="${d}">
                 ${d}
            </div>
        `;
    }
    return html;
}

function attachDayListeners() {
    const days = document.querySelectorAll('.DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)');
    
    days.forEach(day => {
        // Click
        day.addEventListener('click', (e) => {
            e.stopPropagation();
            const ts = parseInt(day.dataset.timestamp);
            handleDateClick(ts);
        });

        // Hover (MouseEnter)
        day.addEventListener('mouseenter', (e) => {
            const ts = parseInt(day.dataset.timestamp);
            const { tempCheckIn, tempCheckOut } = calendarState;

            // 시작 날짜만 선택된 상태일 때만 호버 효과 적용
            if (tempCheckIn && !tempCheckOut) {
                if (ts > tempCheckIn) {
                    hoverDate = ts;
                    updateHoverEffect(); // 리렌더링 대신 클래스만 토글
                }
            }
        });
    });

    // Calendar Container Leave (MouseLeave)
    const calendarContainer = document.getElementById('dayPickerContainer');
    if (calendarContainer) {
        calendarContainer.onmouseleave = () => {
            if (hoverDate) {
                hoverDate = null;
                updateHoverEffect(); // Class update only
            }
        };
    }
}

// [Optimization] Re-render 없이 클래스만 토글하여 호버 효과 처리
function updateHoverEffect() {
    const { tempCheckIn, tempCheckOut } = calendarState;
    const days = document.querySelectorAll('.DayPicker-Day');

    days.forEach(day => {
        const ts = parseInt(day.dataset.timestamp);
        
        // Reset hover class
        day.classList.remove('DayPicker-Day--hoverRange');

        // Apply new hover class if valid
        if (tempCheckIn && !tempCheckOut && hoverDate) {
            if (ts > tempCheckIn && ts <= hoverDate) {
                day.classList.add('DayPicker-Day--hoverRange');
            }
        }
    });
}

function handleDateClick(timestamp) {
    const { tempCheckIn, tempCheckOut } = calendarState;

    // Case 1: 아무것도 선택 안된 상태 or 둘 다 선택된 상태 (새로운 시작)
    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
        calendarState.tempCheckIn = timestamp;
        calendarState.tempCheckOut = null;
        hoverDate = null; // 초기화
    } 
    // Case 2: 시작일만 선택된 상태 (종료일 선택 시도)
    else {
        if (timestamp < tempCheckIn) {
            // 시작일보다 이전 날짜 클릭 -> 시작일 변경
            calendarState.tempCheckIn = timestamp;
            hoverDate = null;
        } else if (timestamp === tempCheckIn) {
            // 시작일과 같은 날짜 -> 무시 (혹은 취소 로직)
            return; 
        } else {
            // 종료일 설정
            calendarState.tempCheckOut = timestamp;
            hoverDate = null; // 호버 효과 종료
        }
    }
    
    // UI 업데이트
    updateResults();
    renderCalendar();
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
