/**
 * Calendar Component Logic
 */

let currentMonth = new Date();
let calendarState = {
    checkIn: null,
    checkOut: null,
    tempCheckIn: null,
    tempCheckOut: null
};
let hoverDate = null;

function initCalendarComponent() {
    const calendarPopup = document.getElementById('calendarPopup');
    const dateFieldContainer = document.getElementById('checkInField'); 

    if (!calendarPopup || !dateFieldContainer) return;

    dateFieldContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = calendarPopup.classList.contains('active');
        if (typeof closeAllPopups === 'function') closeAllPopups('calendarPopup');

        if (!isActive) {
            calendarState.tempCheckIn = calendarState.checkIn;
            calendarState.tempCheckOut = calendarState.checkOut;
            calendarPopup.classList.add('active');
            renderCalendar();
        } else {
            calendarPopup.classList.remove('active');
        }
    });

    calendarPopup.addEventListener('click', (e) => e.stopPropagation());

    const tabCalendar = document.getElementById('tab-calendar');
    const tabFlexible = document.getElementById('tab-flexible');
    const panelCalendar = document.getElementById('panel-calendar');
    const panelFlexible = document.getElementById('panel-flexible');

    function switchTab(targetTab) {
        if(tabCalendar) tabCalendar.classList.remove('active');
        if(tabFlexible) tabFlexible.classList.remove('active');
        if(panelCalendar) panelCalendar.classList.remove('active');
        if(panelFlexible) panelFlexible.classList.remove('active');

        if(targetTab === tabCalendar) {
            tabCalendar.classList.add('active');
            panelCalendar.classList.add('active');
        } else {
            tabFlexible.classList.add('active');
            panelFlexible.classList.add('active');
        }
    }

    if(tabCalendar) tabCalendar.addEventListener('click', (e) => { e.stopPropagation(); switchTab(tabCalendar); });
    if(tabFlexible) tabFlexible.addEventListener('click', (e) => { e.stopPropagation(); switchTab(tabFlexible); });

    document.querySelectorAll('.Flexible-Option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.Flexible-Option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

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

    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState = { checkIn: null, checkOut: null, tempCheckIn: null, tempCheckOut: null };
        updateCalendarDisplay();
        renderCalendar();
    });

    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        if (typeof closeAllPopups === 'function') closeAllPopups();
        else calendarPopup.classList.remove('active');
    });
}

function renderCalendar() {
    const container = document.getElementById('calendarMonths');
    if (!container) return;

    container.innerHTML = '';
    const leftDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const rightDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    [leftDate, rightDate].forEach(date => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'DayPicker-Month';
        
        const caption = document.createElement('div');
        caption.className = 'DayPicker-Caption';
        caption.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        monthDiv.appendChild(caption);

        const weekdays = document.createElement('div');
        weekdays.className = 'DayPicker-Weekdays';
        ['월', '화', '수', '목', '금', '토', '일'].forEach(d => {
            const wd = document.createElement('div');
            wd.className = 'DayPicker-Weekday';
            wd.innerHTML = d;
            weekdays.appendChild(wd);
        });
        monthDiv.appendChild(weekdays);

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
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; 
    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayTs = new Date().setHours(0,0,0,0);

    let html = '';
    for(let i=0; i<startOffset; i++) {
        html += `<div class="DayPicker-Day DayPicker-Day--outside"></div>`;
    }

    for(let d=1; d<=lastDate; d++) {
        const currentTs = new Date(year, month, d).getTime();
        let classes = ['DayPicker-Day'];
        if (currentTs < todayTs) classes.push('DayPicker-Day--disabled');
        if (currentTs === todayTs) classes.push('DayPicker-Day--today');

        const checkIn = calendarState.tempCheckIn || calendarState.checkIn;
        const checkOut = calendarState.tempCheckOut || calendarState.checkOut;

        if (checkIn && currentTs === checkIn) classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkIn', 'DayPicker-Day--hasRange');
        if (checkOut && currentTs === checkOut) classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut', 'DayPicker-Day--hasRange');
        if (checkIn && checkOut && currentTs > checkIn && currentTs < checkOut) classes.push('DayPicker-Day--inRange');
        if (checkIn && !checkOut && hoverDate && currentTs > checkIn && currentTs <= hoverDate) classes.push('DayPicker-Day--hoverRange');

        html += `<div class="${classes.join(' ')}" data-timestamp="${currentTs}">${d}</div>`;
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
            if (calendarState.tempCheckIn && !calendarState.tempCheckOut && ts > calendarState.tempCheckIn) {
                hoverDate = ts;
                renderCalendar(); 
            }
        });
    });
}

function handleDateClick(timestamp) {
    if (!calendarState.tempCheckIn || (calendarState.tempCheckIn && calendarState.tempCheckOut)) {
        calendarState.tempCheckIn = timestamp;
        calendarState.tempCheckOut = null;
    } else {
        if (timestamp < calendarState.tempCheckIn) {
            calendarState.tempCheckIn = timestamp;
        } else if (timestamp > calendarState.tempCheckIn) {
            calendarState.tempCheckOut = timestamp;
        }
    }
    updateCalendarDisplay();
    renderCalendar();
}

function updateCalendarDisplay() {
    updateSingleDisplay('checkIn', calendarState.tempCheckIn);
    updateSingleDisplay('checkOut', calendarState.tempCheckOut);
}

function updateSingleDisplay(type, ts) {
    const el = document.getElementById(type + 'Display');
    if (!el) return;
    if (!ts) {
        el.textContent = '날짜 선택';
        el.style.color = '#999';
    } else {
        const d = new Date(ts);
        el.textContent = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        el.style.color = '#333';
    }
}

// Global initialization
window.initCalendarComponent = initCalendarComponent;