/*
 * JEJU STAY - Interactive JavaScript (Fixed & Stabilized)
 */

// 전역 변수
let currentMonth = new Date();
let calendarState = {
    checkIn: null,  // Timestamp로 저장
    checkOut: null, // Timestamp로 저장
    hoverDate: null // Timestamp로 저장
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

/* ========== [수정] 캘린더 초기화 및 열기 로직 개선 ========== */
function initCalendar() {
    const checkInField = document.getElementById('checkInField');
    const checkOutField = document.getElementById('checkOutField');
    const calendarPopup = document.getElementById('calendarPopup');

    function openCalendar(e, isCheckOut = false) {
        e.stopPropagation();
        closeAllPopups('calendarPopup'); // 다른 팝업 닫기
        calendarPopup.classList.add('active');
        checkInField.classList.add('active');
        
        if (isCheckOut) {
            checkOutField.classList.add('active');
            // [핵심 수정] 체크아웃 필드를 눌러 열었을 때, 
            // 이미 범위가 설정되어 있다면 체크아웃만 다시 선택하도록 상태 조정
            if (calendarState.checkIn && calendarState.checkOut) {
                calendarState.checkOut = null; // 체크아웃 초기화 (재선택 유도)
            }
        }
        renderCalendar();
    }

    checkInField?.addEventListener('click', (e) => openCalendar(e, false));
    checkOutField?.addEventListener('click', (e) => openCalendar(e, true));

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
}

/* ========== [수정] 날짜 클릭 핸들러 로직 개선 ========== */
function handleDateClick(timestamp) {
    const dateObj = new Date(timestamp);

    // 1. 체크인이 아직 없거나, 사용자가 기존 체크인보다 '이전' 날짜를 클릭한 경우
    // -> 새로운 체크인 날짜로 설정
    if (!calendarState.checkIn || timestamp < calendarState.checkIn) {
        calendarState.checkIn = timestamp;
        calendarState.checkOut = null; // 체크아웃 초기화
        updateDateDisplay('checkIn', dateObj);
    }
    // 2. 체크인이 이미 있고, 클릭한 날짜가 체크인보다 '이후'인 경우
    // -> 체크아웃 날짜로 확정
    else if (timestamp > calendarState.checkIn) {
        calendarState.checkOut = timestamp;
        updateDateDisplay('checkOut', dateObj);
        
        // UI 갱신 (범위 표시)
        renderCalendar();
        
        // [UX 개선] 날짜 선택 완료 시 팝업 닫기 (지연 시간 0.2초)
        setTimeout(() => {
            closeAllPopups();
        }, 200);
        return; // 여기서 종료하여 아래 중복 렌더링 방지
    }
    // 3. (예외 처리) 체크인 날짜를 다시 클릭한 경우
    else if (timestamp === calendarState.checkIn) {
         // 아무 동작 안 하거나, 체크아웃을 초기화하여 다시 선택하게 함
         calendarState.checkOut = null;
    }

    renderCalendar();
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
    const todayTs = new Date().setHours(0,0,0,0);
    
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
        const d = parseInt(dayEl.dataset.day);
        const m = parseInt(dayEl.dataset.month);
        const y = parseInt(dayEl.dataset.year);
        const currentTs = new Date(y, m - 1, d).setHours(0,0,0,0);

        // 1. 오늘 날짜 - FF5000 보더
        if (currentTs === todayTs) dayEl.classList.add('today');
        
        // 2. 과거 날짜 비활성화
        if (currentTs < todayTs) dayEl.classList.add('disabled');

        // 3. 선택 로직 (스타일링)
        const start = calendarState.checkIn;
        const end = calendarState.checkOut;
        const hover = calendarState.hoverDate;

        if (start === currentTs) dayEl.classList.add('selected');
        if (end === currentTs) dayEl.classList.add('selected');

        // 범위 표시 (확정된 범위)
        if (start && end && currentTs > start && currentTs < end) {
            dayEl.classList.add('in-range');
        }
        // 범위 표시 (호버 중 임시 범위)
        else if (start && !end && hover && currentTs > start && currentTs <= hover) {
            dayEl.classList.add('in-range-temp');
            if (currentTs === hover) dayEl.classList.add('hover-end');
        }

        // 클릭 이벤트 연결
        if (!dayEl.classList.contains('disabled')) {
            dayEl.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDateClick(currentTs);
            });
            
            dayEl.addEventListener('mouseenter', () => {
                if (calendarState.checkIn && !calendarState.checkOut) {
                    calendarState.hoverDate = currentTs;
                    renderCalendar(); // 호버 시 리렌더링하여 범위 표시
                }
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
    guestField?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups('guestPopupLarge');
        guestPopup.classList.toggle('active');
        guestField.classList.toggle('active');
    });
    
    // (인원수 증감 로직 생략 없이 유지하려면 기존 코드의 해당 부분 사용)
    document.querySelectorAll('.counter-btn-new').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.dataset.target;
            const span = document.getElementById(`${target}CountLarge`);
            let val = parseInt(span.textContent);
            if (btn.classList.contains('plus')) val++;
            else if (val > 0) val--;
            span.textContent = val;
        });
    });
}

function closeAllPopups(exceptId) {
    const popups = ['destinationDropdown', 'calendarPopup', 'guestPopupLarge'];
    const fields = ['destinationFieldLarge', 'checkInField', 'guestFieldLarge']; // ID 매핑 필요
    
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
        calendarState.hoverDate = null;
    }
}
document.addEventListener('click', () => closeAllPopups());