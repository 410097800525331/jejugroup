/*
 * JEJU STAY - Interactive JavaScript (Range Calendar 기능 최종 수정)
 */

// 전역 변수
let currentMonth = new Date();
let calendarState = {
    checkIn: null,  // 확정된 체크인 (Timestamp)
    checkOut: null, // 확정된 체크아웃 (Timestamp)
    tempCheckIn: null,  // 팝업 내 임시 체크인
    tempCheckOut: null  // 팝업 내 임시 체크아웃
};

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initHeader();
    initMobileMenu();
    initWishlistButtons();
    initScrollAnimations();
    initSearchTabs();
    initDestinationDropdown();
    initCalendar(); 
    initGuestSelector();
});

/* ========== [유지] 공통 기능 ========== */
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => mobileNav.classList.toggle('active'));
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

/* ========== [수정] 검색 및 캘린더 로직 ========== */

function initSearchTabs() {
    const tabs = document.querySelectorAll('.search-tab-large');
    const hotelForm = document.getElementById('searchFormHotel');
    const activityForm = document.getElementById('searchFormActivity');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'activity') {
                hotelForm.classList.add('hidden');
                activityForm.classList.remove('hidden');
            } else {
                hotelForm.classList.remove('hidden');
                activityForm.classList.add('hidden');
            }
        });
    });
}

function initDestinationDropdown() {
    const destField = document.getElementById('destinationFieldLarge');
    const destInput = document.getElementById('destinationInput');
    const destDropdown = document.getElementById('destinationDropdown');

    destField?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups('destinationDropdown');
        destDropdown.classList.toggle('active');
        destField.classList.toggle('active');
    });

    document.querySelectorAll('.destination-item, .destination-item-text').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            destInput.value = item.dataset.value;
            destDropdown.classList.remove('active');
            destField.classList.remove('active');
        });
    });
    
    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!destField?.contains(e.target)) {
            destDropdown?.classList.remove('active');
            destField?.classList.remove('active');
        }
    });
}

/* ========== [수정] Range Calendar 초기화 ========== */
function initCalendar() {
    const checkInField = document.getElementById('checkInField');
    const checkOutField = document.getElementById('checkOutField');
    const calendarPopup = document.getElementById('calendarPopup');

    function openCalendar(e) {
        e.stopPropagation();
        closeAllPopups('calendarPopup');
        
        // 팝업을 열 때 이전 선택 날짜를 임시 변수에 복사
        calendarState.tempCheckIn = calendarState.checkIn;
        calendarState.tempCheckOut = calendarState.checkOut;
        
        calendarPopup.classList.add('active');
        checkInField.classList.add('active');
        
        renderCalendar();
    }

    checkInField?.addEventListener('click', (e) => openCalendar(e));
    checkOutField?.addEventListener('click', (e) => openCalendar(e));

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

    // 캘린더 팝업 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!checkInField?.contains(e.target) && !checkOutField?.contains(e.target) && !calendarPopup?.contains(e.target)) {
            calendarPopup?.classList.remove('active');
            checkInField?.classList.remove('active');
            checkOutField?.classList.remove('active');
        }
    });
}

/* ========== [수정] Range Calendar 날짜 선택 로직 ========== */

// 호버 상태 관리를 위한 변수 추가
let hoverDate = null;

function handleDateClick(timestamp) {
    // 오늘 이전 날짜는 선택 불가
    const todayTs = new Date().setHours(0, 0, 0, 0);
    if (timestamp < todayTs) return;

    // 1. 첫 번째 선택 (체크인)
    if (!calendarState.tempCheckIn || (calendarState.tempCheckIn && calendarState.tempCheckOut)) {
        calendarState.tempCheckIn = timestamp;
        calendarState.tempCheckOut = null;
        
        // UI 즉시 업데이트 (렌더링)
        renderCalendar();
    }
    // 2. 두 번째 선택 (체크아웃)
    else {
        // 체크인 날짜보다 이전 날짜를 클릭한 경우 -> 새로운 체크인으로 설정
        if (timestamp < calendarState.tempCheckIn) {
            calendarState.tempCheckIn = timestamp;
            renderCalendar();
        }
        // 같은 날짜 클릭 (허용하지 않거나, 1박으로 설정 등 정책에 따름. 여기선 무시)
        else if (timestamp === calendarState.tempCheckIn) {
            return;
        }
        // 정상적인 체크아웃 선택
        else {
            calendarState.tempCheckOut = timestamp;
            
            // 확정 날짜로 저장
            calendarState.checkIn = calendarState.tempCheckIn;
            calendarState.checkOut = calendarState.tempCheckOut;
            
            // 디스플레이 업데이트
            updateDateDisplay('checkIn', new Date(calendarState.checkIn));
            updateDateDisplay('checkOut', new Date(calendarState.checkOut));
            
            renderCalendar();

            // 팝업 닫기 (약간의 지연 후)
            setTimeout(() => {
                closeAllPopups();
            }, 300);
        }
    }
}

function handleDateHover(timestamp) {
    // 체크인만 선택된 상태일 때만 미리보기 동작
    if (calendarState.tempCheckIn && !calendarState.tempCheckOut) {
        hoverDate = timestamp;
        updateHoverStyles();
    }
}

// 호버 스타일만 업데이트하는 가벼운 함수 (전체 렌더링 방지)
function updateHoverStyles() {
    const days = document.querySelectorAll('.calendar-day:not(.empty):not(.disabled)');
    const start = calendarState.tempCheckIn;
    const currentHover = hoverDate;

    days.forEach(dayEl => {
        // 기존 미리보기 클래스 제거
        dayEl.classList.remove('in-range-preview', 'preview-end');

        const dayTs = parseInt(dayEl.dataset.timestamp);

        if (start && currentHover && dayTs > start && dayTs <= currentHover) {
            // 범위 내 날짜
            if (dayTs < currentHover) {
                dayEl.classList.add('in-range-preview');
            }
            // 끝나는 날짜 (마우스 위치)
            else if (dayTs === currentHover) {
                dayEl.classList.add('preview-end');
                // 시작 날짜에도 has-preview 클래스 추가하여 오른쪽 모서리 제어
                const startEl = document.querySelector(`.calendar-day[data-timestamp='${start}']`);
                if (startEl) startEl.classList.add('has-preview');
            }
        } else {
             // 범위 밖이나 호버 해제 시 has-preview 제거
             const startEl = document.querySelector(`.calendar-day[data-timestamp='${start}']`);
             if (startEl) startEl.classList.remove('has-preview');
        }
    });
}

/** 캘린더 그리기 */
function renderCalendar() {
    const leftDaysElement = document.getElementById('leftCalendarDays');
    const rightDaysElement = document.getElementById('rightCalendarDays');
    if (!leftDaysElement || !rightDaysElement) return;

    // 현재 달과 다음 달 계산
    const leftDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const rightDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    document.getElementById('leftMonthTitle').textContent = `${leftDate.getFullYear()}년 ${leftDate.getMonth() + 1}월`;
    document.getElementById('rightMonthTitle').textContent = `${rightDate.getFullYear()}년 ${rightDate.getMonth() + 1}월`;

    // HTML 생성
    leftDaysElement.innerHTML = generateDaysHTML(leftDate);
    rightDaysElement.innerHTML = generateDaysHTML(rightDate);

    // 이벤트 리스너 및 스타일 적용
    const todayTs = new Date().setHours(0, 0, 0, 0);
    
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
        const d = parseInt(dayEl.dataset.day);
        const m = parseInt(dayEl.dataset.month);
        const y = parseInt(dayEl.dataset.year);
        const currentTs = new Date(y, m - 1, d).setHours(0, 0, 0, 0);
        
        // 데이터 속성에 타임스탬프 저장 (호버 로직용)
        dayEl.dataset.timestamp = currentTs;

        // 1. 오늘 날짜
        if (currentTs === todayTs) {
            dayEl.classList.add('today');
        }
        
        // 2. 과거 날짜 비활성화
        if (currentTs < todayTs) {
            dayEl.classList.add('disabled');
        }

        // 3. 선택 로직 (스타일링)
        const start = calendarState.tempCheckIn;
        const end = calendarState.tempCheckOut;

        // 체크인 날짜
        if (start === currentTs) {
            dayEl.classList.add('check-in');
            if (end) dayEl.classList.add('has-range');
        }

        // 체크아웃 날짜
        if (end === currentTs) {
            dayEl.classList.add('check-out');
            if (start) dayEl.classList.add('has-range');
        }

        // 범위 내 날짜
        if (start && end && currentTs > start && currentTs < end) {
            dayEl.classList.add('in-range');
        }

        // 이벤트 연결
        if (!dayEl.classList.contains('disabled')) {
            dayEl.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDateClick(currentTs);
            });
            
            // 호버 이벤트 추가
            dayEl.addEventListener('mouseenter', () => {
                handleDateHover(currentTs);
            });
        }
    });
}

function generateDaysHTML(date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const lastDay = new Date(y, m + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // 월요일 시작 기준 보정
    
    let html = '';
    for (let i = 0; i < startOffset; i++) html += '<div class="calendar-day empty"></div>';
    for (let d = 1; d <= lastDay; d++) {
        html += `<div class="calendar-day" data-year="${y}" data-month="${m + 1}" data-day="${d}">${d}</div>`;
    }
    return html;
}

function updateDateDisplay(type, dateObj) {
    const displayId = type === 'checkIn' ? 'checkInDisplay' : 'checkOutDisplay';
    const dayId = type === 'checkIn' ? 'checkInDay' : 'checkOutDay';
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    document.getElementById(displayId).textContent = 
        `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
    document.getElementById(dayId).textContent = dayNames[dateObj.getDay()] + '요일';
}

function initGuestSelector() {
    const guestField = document.getElementById('guestFieldLarge');
    const guestPopup = document.getElementById('guestPopupLarge');
    
    // 팝업 토글
    guestField?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups('guestPopupLarge');
        guestPopup.classList.toggle('active');
        guestField.classList.toggle('active');
    });
    
    // 카운터 버튼 로직
    document.querySelectorAll('.counter-btn-new').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.dataset.target;
            const span = document.getElementById(`${target}CountLarge`);
            let val = parseInt(span.textContent);
            
            // 최소값 정의
            const minValues = {
                'rooms': 1,
                'adults': 1,
                'children': 0
            };
            
            if (btn.classList.contains('plus')) {
                val++;
            } else {
                if (val > minValues[target]) {
                    val--;
                }
            }
            
            span.textContent = val;
            updateGuestSummary();
        });
    });
}

function updateGuestSummary() {
    const rooms = parseInt(document.getElementById('roomsCountLarge').textContent);
    const adults = parseInt(document.getElementById('adultsCountLarge').textContent);
    const children = parseInt(document.getElementById('childrenCountLarge').textContent);
    
    const guestSummary = document.getElementById('guestSummary');
    const roomSummary = document.getElementById('roomSummary');
    
    // 요약 텍스트 업데이트
    let guestText = `성인 ${adults}명`;
    if (children > 0) {
        guestText += `, 아동 ${children}명`;
    }
    
    guestSummary.textContent = guestText;
    roomSummary.textContent = `객실 ${rooms}개`;
}

function closeAllPopups(exceptId) {
    const popups = ['destinationDropdown', 'calendarPopup', 'guestPopupLarge'];
    
    const popupMap = {
        'destinationDropdown': document.getElementById('destinationDropdown'),
        'calendarPopup': document.getElementById('calendarPopup'),
        'guestPopupLarge': document.getElementById('guestPopupLarge')
    };
    
    Object.keys(popupMap).forEach(key => {
        if (key !== exceptId && popupMap[key]) {
            popupMap[key].classList.remove('active');
        }
    });
    
    // 모든 필드 active 제거
    if (!exceptId) {
        document.querySelectorAll('.search-field-new').forEach(f => f.classList.remove('active'));
    }
}

document.addEventListener('click', () => closeAllPopups());
