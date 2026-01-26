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
let hoverDate = null;

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
/* ========== [수정] Agoda-style Range Calendar 초기화 ========== */
function initCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    const checkInField = document.getElementById('checkInField');
    const checkOutField = document.getElementById('checkOutField');

    // 1. Toggle Popup
    // 1. Toggle Popup Logic (Refactored for Container-based outside click)
    const dateFieldGroup = document.querySelector('.date-field-group');

    function toggleCalendar(event) {
        // Prevent event from bubbling if it originated from the fields
        event.stopPropagation();
        
        const isActive = calendarPopup.classList.contains('active');
        
        // Close other popups
        closeAllPopups('calendarPopup');

        if (!isActive) {
            calendarPopup.classList.add('active');
            dateFieldGroup.classList.add('active'); // Optional: Add active state to container
            renderCalendar();
        } else {
            // Allow toggling off if clicking the field again
            calendarPopup.classList.remove('active');
            dateFieldGroup.classList.remove('active');
        }
    }

    checkInField?.addEventListener('click', toggleCalendar);
    checkOutField?.addEventListener('click', toggleCalendar);

    // Prevent clicks inside the popup from closing it
    calendarPopup?.addEventListener('click', (e) => e.stopPropagation());

    // 2. Navigation
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

    // 3. Tabs Logic
    const tabCalendar = document.getElementById('tab-calendar');
    const tabFlexible = document.getElementById('tab-flexible');
    const panelCalendar = document.getElementById('panel-calendar');
    const panelFlexible = document.getElementById('panel-flexible');

    function switchTab(targetTab) {
        [tabCalendar, tabFlexible].forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        [panelCalendar, panelFlexible].forEach(p => p.classList.remove('active'));

        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        
        if (targetTab === tabCalendar) panelCalendar.classList.add('active');
        else panelFlexible.classList.add('active');
    }

    tabCalendar?.addEventListener('click', () => switchTab(tabCalendar));
    tabFlexible?.addEventListener('click', () => switchTab(tabFlexible));

    // 4. Bottom Buttons
    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState.checkIn = null;
        calendarState.checkOut = null;
        calendarState.tempCheckIn = null;
        calendarState.tempCheckOut = null;
        updateDateDisplay('checkIn', null);
        updateDateDisplay('checkOut', null);
        renderCalendar();
    });

    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        // [Fix] Confirm selection
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        closeAllPopups();
    });

    // 6. Flexible Options Interaction
    document.querySelectorAll('.Flexible-Option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.Flexible-Option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            // Logic to handle flexible date selection can be added here
        });
    });

    // 5. Global Click Output
    // 5. Global Click Output (Updated)
    document.addEventListener('click', (e) => {
        // If click is outside the date field group, close the calendar
        if (calendarPopup?.classList.contains('active') && 
            !dateFieldGroup?.contains(e.target)) {
            calendarPopup.classList.remove('active');
            dateFieldGroup?.classList.remove('active');
        }
    });
}

/* ========== [수정] Agoda-style Rendering Logic ========== */

function renderCalendar() {
    const container = document.getElementById('calendarMonths');
    if (!container) return;

    // reset
    container.innerHTML = '';

    const leftDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const rightDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    [leftDate, rightDate].forEach(date => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'DayPicker-Month';
        monthDiv.setAttribute('role', 'grid');

        // Caption
        const caption = document.createElement('div');
        caption.className = 'DayPicker-Caption';
        caption.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        monthDiv.appendChild(caption);

        // Weekdays
        const weekdays = document.createElement('div');
        weekdays.className = 'DayPicker-Weekdays';
        weekdays.setAttribute('role', 'rowgroup');
        const daysRaw = ['월', '화', '수', '목', '금', '토', '일'];
        daysRaw.forEach(d => {
            const wd = document.createElement('div');
            wd.className = 'DayPicker-Weekday';
            wd.setAttribute('role', 'columnheader');
            wd.innerHTML = `<abbr title="${d}요일">${d}</abbr>`;
            weekdays.appendChild(wd);
        });
        monthDiv.appendChild(weekdays);

        // Body
        const body = document.createElement('div');
        body.className = 'DayPicker-Body';
        body.setAttribute('role', 'rowgroup');
        body.innerHTML = generateMonthDaysHTML(date);
        monthDiv.appendChild(body);

        container.appendChild(monthDiv);
    });

    attachDayListeners();
}

function generateMonthDaysHTML(dateObj) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    
    // 월요일 시작 (0:Mon ... 6:Sun)
    const firstDay = new Date(year, month, 1).getDay(); // 0(Sun)~6(Sat)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayTs = new Date().setHours(0,0,0,0);

    let html = '';

    // Empty cells
    for(let i=0; i<startOffset; i++) {
        html += `<div class="DayPicker-Day DayPicker-Day--outside" aria-disabled="true"></div>`;
    }

    // Days
    for(let d=1; d<=lastDate; d++) {
        const currentTs = new Date(year, month, d).getTime();
        
        let classes = ['DayPicker-Day'];
        let ariaDisabled = 'false';
        let ariaSelected = 'false';

        // Disabled
        if (currentTs < todayTs) {
            classes.push('DayPicker-Day--disabled');
            ariaDisabled = 'true';
        }

        // Today
        if (currentTs === todayTs) {
            classes.push('DayPicker-Day--today');
        }

        // Selection
        const checkIn = calendarState.tempCheckIn || calendarState.checkIn;
        const checkOut = calendarState.tempCheckOut || calendarState.checkOut;

        if (checkIn && currentTs === checkIn) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkIn');
            if (checkOut || hoverDate > checkIn) classes.push('DayPicker-Day--hasRange');
            ariaSelected = 'true';
        }

        if (checkOut && currentTs === checkOut) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut');
            if (checkIn) classes.push('DayPicker-Day--hasRange');
            ariaSelected = 'true';
        }

        if (checkIn && checkOut && currentTs > checkIn && currentTs < checkOut) {
            classes.push('DayPicker-Day--inRange');
        }

        // Preview Range (Static) - 호버 시 동적 처리는 updateHoverStyles에서
        if (checkIn && !checkOut && hoverDate && currentTs > checkIn && currentTs <= hoverDate) {
             // Initial render might not catch this unless re-rendered on hover, 
             // but we rely mainly on CSS classes toggled by JS.
        }

        html += `
            <div class="${classes.join(' ')}" 
                 role="gridcell" 
                 tabindex="${ariaDisabled === 'true' ? -1 : 0}"
                 aria-disabled="${ariaDisabled}"
                 aria-selected="${ariaSelected}"
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
        day.addEventListener('click', (e) => {
            e.stopPropagation();
            const ts = parseInt(day.dataset.timestamp);
            handleDateClick(ts);
        });
        day.addEventListener('mouseenter', () => {
             const ts = parseInt(day.dataset.timestamp);
             handleDateHover(ts);
        });
    });
}

function handleDateClick(timestamp) {
    const todayTs = new Date().setHours(0, 0, 0, 0);
    if (timestamp < todayTs) return;

    if (!calendarState.tempCheckIn || (calendarState.tempCheckIn && calendarState.tempCheckOut)) {
        calendarState.tempCheckIn = timestamp;
        calendarState.tempCheckOut = null;
        renderCalendar();
    } else {
        if (timestamp < calendarState.tempCheckIn) {
            calendarState.tempCheckIn = timestamp;
            renderCalendar();
        } else if (timestamp === calendarState.tempCheckIn) {
            return;
        } else {
            calendarState.tempCheckOut = timestamp;
            // 즉시 확정하지 않고 '확인' 버튼을 기다릴 수도 있으나, 
            // 유저 경험상 선택 시 UI 업데이트는 필요.
            // 여기서는 Input값은 업데이트하되, 팝업 닫기는 '확인' 버튼에 위임 or 자동 닫기 X
            
            // Input Display Update
            updateDateDisplay('checkIn', new Date(calendarState.tempCheckIn));
            updateDateDisplay('checkOut', new Date(calendarState.tempCheckOut));
            
            renderCalendar();
        }
    }
}

function handleDateHover(timestamp) {
    if (calendarState.tempCheckIn && !calendarState.tempCheckOut) {
        hoverDate = timestamp;
        updateHoverStyles();
    }
}

function updateHoverStyles() {
    const days = document.querySelectorAll('.DayPicker-Day:not(.DayPicker-Day--outside):not(.DayPicker-Day--disabled)');
    const start = calendarState.tempCheckIn;
    const currentHover = hoverDate;

    days.forEach(dayEl => {
        dayEl.classList.remove('DayPicker-Day--inRange', 'DayPicker-Day--previewEnd', 'DayPicker-Day--hasRange');
        
        // Restore base selection classes
        if (dayEl.classList.contains('DayPicker-Day--checkIn')) dayEl.classList.add('DayPicker-Day--hasRange');

        const dayTs = parseInt(dayEl.dataset.timestamp);

        if (start && currentHover && dayTs > start && dayTs <= currentHover) {
             if (dayTs < currentHover) {
                 dayEl.classList.add('DayPicker-Day--inRange');
             } else if (dayTs === currentHover) {
                 dayEl.classList.add('DayPicker-Day--previewEnd');
             }
        }
    });
}

function updateDateDisplay(type, dateObj) {
    const displayId = type === 'checkIn' ? 'checkInDisplay' : 'checkOutDisplay';
    const dayId = type === 'checkIn' ? 'checkInDay' : 'checkOutDay';
    const lang = document.documentElement.lang || 'ko';
    
    // Localized Day Names
    const dayNames = lang === 'en' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['일', '월', '화', '수', '목', '금', '토'];
    
    const elDisplay = document.getElementById(displayId); // Explicitly get element to be safe
    const elDay = document.getElementById(dayId);

    if (!dateObj) {
        if (lang === 'en') {
            if(elDisplay) elDisplay.textContent = 'Select Date';
            if(elDay) elDay.textContent = type === 'checkIn' ? 'Check-in' : 'Check-out';
        } else {
            if(elDisplay) elDisplay.textContent = '날짜 선택';
            if(elDay) elDay.textContent = type === 'checkIn' ? '체크인' : '체크아웃';
        }
        return;
    }

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    
    if(elDisplay) elDisplay.textContent = `${y}-${m}-${d}`;
    if(elDay) elDay.textContent = dayNames[dateObj.getDay()];
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
    
    // 언어 상태 확인 (document.documentElement.lang 사용)
    const lang = document.documentElement.lang || 'ko';

    // 요약 텍스트 업데이트
    let guestText = '';
    let roomText = '';

    if (lang === 'en') {
        guestText = `Adult${adults > 1 ? 's' : ''} ${adults}`;
        if (children > 0) {
            guestText += `, Child${children > 1 ? 'ren' : ''} ${children}`;
        }
        roomText = `Room${rooms > 1 ? 's' : ''} ${rooms}`;
    } else {
        guestText = `성인 ${adults}명`;
        if (children > 0) {
            guestText += `, 아동 ${children}명`;
        }
        roomText = `객실 ${rooms}개`;
    }
    
    guestSummary.textContent = guestText;
    roomSummary.textContent = roomText;
}

// 언어 변경 이벤트 감지
// 언어 변경 이벤트 감지 (Isolated for FAB)
// 언어 변경 이벤트 감지 (Isolated for FAB)
document.addEventListener('fabLanguageChanged', (e) => {
    updateGuestSummary();
    
    // Update dates if they exist (to prevent data-lang overwriting selected dates)
    const checkInDate = calendarState.checkIn ? new Date(calendarState.checkIn) : (calendarState.tempCheckIn ? new Date(calendarState.tempCheckIn) : null);
    const checkOutDate = calendarState.checkOut ? new Date(calendarState.checkOut) : (calendarState.tempCheckOut ? new Date(calendarState.tempCheckOut) : null);
    
    updateDateDisplay('checkIn', checkInDate);
    updateDateDisplay('checkOut', checkOutDate);
    
    // Also re-render Calendar for month names
    renderCalendar();
});

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
        document.querySelectorAll('.date-field-group').forEach(f => f.classList.remove('active'));
    }
}

document.addEventListener('click', () => closeAllPopups());
