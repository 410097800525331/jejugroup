/*
 * JEJU STAY - Private & Emotional Stay Interactive JavaScript
 * Premium Logic: Pill Search, Smooth Animations, Exclusive Interactions
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
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    initHeader();
    initMobileMenu();
    initWishlistButtons();
    initScrollAnimations();
    
    // Initialize Search Manager (Premium Pill Logic)
    window.searchManager = new PrivateSearchManager();
    
    // Global click listener to close popups
    document.addEventListener('click', () => {
        closeAllPopups();
    });
    
    // GSAP Animations
    initPremiumAnimations();
});

/* ========== GSAP Animations ========== */
function initPremiumAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Text Parallax & Fade
        gsap.from('.hero-subtitle-top', {
            y: 30, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2
        });
        gsap.from('.search-widget-large', {
            y: 30, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.5
        });

        // Destinations Stagger
        gsap.utils.toArray('.destinations-grid .destination-card').forEach((card, i) => {
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

        // Promo Cards Stagger
        gsap.from('.promo-card', {
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

/* ========== 공통 기능 ========== */
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
            e.preventDefault(); 
            e.stopPropagation();
            btn.classList.toggle('active'); // Simply toggle active class for visual feedback
            
            // Toast
            const isAdded = btn.classList.contains('active');
            window.searchManager.showToast(isAdded ? '위시리스트에 저장되었습니다.' : '위시리스트에서 삭제되었습니다.');
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
    document.querySelectorAll('.hotel-card').forEach(el => observer.observe(el));
}

/* ========== Private Search Manager ========== */
class PrivateSearchManager {
    constructor() {
        this.state = {
            destination: '',
            dates: { start: null, end: null },
            guests: { rooms: 1, adults: 2, children: 0 }, // Private usually 2 adults default
            isTyping: false
        };
        
        this.init();
    }

    init() {
        this.bindDestination();
        this.bindCalendar(); // Integrated Calendar Logic
        this.bindGuests();
        this.bindSearchButton();
    }

    /* --- Security: Input Sanitization --- */
    sanitize(str) {
        const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;'};
        const reg = /[&<>"'/]/ig;
        return str.replace(reg, (match) => (map[match]));
    }

    /* --- Destination Logic --- */
    bindDestination() {
        const field = document.getElementById('destinationFieldLarge');
        const input = document.getElementById('destinationInput');
        const dropdown = document.getElementById('destinationDropdown');
        const listItems = document.querySelectorAll('.destination-item');

        if (!field || !input || !dropdown) return;

        // Toggle Dropdown
        field.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopup('destinationDropdown');
        });

        // Input Handling
        input.addEventListener('input', (e) => {
            const val = this.sanitize(e.target.value);
            this.state.destination = val;
        });

        // Selection
        listItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.dataset.value;
                input.value = val;
                this.state.destination = val;
                closeAllPopups();
            });
        });
    }

    /* --- Calendar Logic (Integrated) --- */
    bindCalendar() {
        // Assume markup exists: #checkInField, #calendarPopup, #prevMonth, #nextMonth, #btn-clear, #btn-confirm
        // Just verify presence
        const dateField = document.getElementById('checkInField');
        if(dateField) {
           // We'll call the standalone initCalendar function for now, 
           // or we can encapsulate it here if we want strict OOP.
           // For consistency with existing code style, we'll keep the function pattern below
           // but trigger it here.
           initCalendar();
        }
    }

    /* --- Guest Logic --- */
    bindGuests() {
        const field = document.getElementById('guestFieldLarge');
        // Note: For Private Stay, we might not have a complex guest popup in the current HTML.
        // Let's check HTML. It has #guestFieldLarge but seemingly no Popup Markup in the provided file view?
        // Wait, looking at `private_stay.html` line 250...
        // <div class="search-item guest-item-new" id="guestFieldLarge"> ... </div>
        // It DOES NOT have the popup markup inside it in the provided file content.
        // I need to ADD the guest popup markup to HTML first.
        // For now, I will write the logic assuming the markup WILL be there.
        
        // Actually, looking at `jejustay_life.html`, the popup is inside the item. 
        // I will add the popup markup in the HTML step.
    }

    /* --- Search Action --- */
    bindSearchButton() {
        const btn = document.getElementById('searchBtn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                const searchData = {
                    destination: this.state.destination,
                    checkIn: calendarState.checkIn,
                    checkOut: calendarState.checkOut,
                    guests: this.state.guests
                };
                console.log('Private Stay Search:', searchData);
                this.showToast('프리미엄 숙소를 검색합니다...');
            });
        }
    }

    /* --- Utilities --- */
    togglePopup(id) {
        const el = document.getElementById(id);
        if(!el) return;
        
        const isActive = el.classList.contains('active');
        closeAllPopups(); // Close others
        
        if (!isActive) {
            el.classList.add('active');
            if(el.parentElement) el.parentElement.classList.add('active');
        }
    }

    showToast(msg) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(44, 36, 27, 0.95); color: #c7916b; padding: 14px 28px;
            border-radius: 4px; z-index: 10000; font-size: 0.95rem; font-family: 'Noto Serif KR', serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid #c7916b;
            animation: fadeInUp 0.4s ease-out;
        `;
        div.textContent = msg;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transform = 'translate(-50%, 20px)';
            div.style.transition = 'all 0.4s ease';
            setTimeout(() => div.remove(), 400);
        }, 2500);
    }
}

/* ========== Global Helpers ========== */
function closeAllPopups(excludeId = null) {
    const popups = document.querySelectorAll('.destination-dropdown, .calendar-popup-new, .guest-popup-new, .options-popup-new');
    const items = document.querySelectorAll('.search-item');

    popups.forEach(p => {
        if (p.id !== excludeId) {
            p.classList.remove('active');
            if(p.id.includes('options')) p.style.display = 'none';
        }
    });
    
    items.forEach(i => {
        const popup = i.querySelector('.destination-dropdown, .calendar-popup-new, .guest-popup-new');
        if (popup && popup.id !== excludeId) i.classList.remove('active');
    });
}

function updateDateDisplay(type, dateObj) {
    const el = document.getElementById(`${type}Display`);
    if (!el) return;

    if (dateObj) {
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();
        // const day = ['일','월','화','수','목','금','토'][dateObj.getDay()];
        el.textContent = `${m}월 ${d}일`;
        el.classList.add('selected');
    } else {
        el.textContent = type === 'checkIn' ? '체크인' : '체크아웃';
        el.classList.remove('selected');
    }
}

/* ========== Calendar Logic (Simplified for Private Stay) ========== */
function initCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    const dateFieldContainer = document.getElementById('checkInField'); 

    if (!calendarPopup || !dateFieldContainer) return;

    // Toggle
    dateFieldContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = calendarPopup.classList.contains('active');
        closeAllPopups('calendarPopup');

        if (!isActive) {
            calendarState.tempCheckIn = calendarState.checkIn;
            calendarState.tempCheckOut = calendarState.checkOut;
            calendarPopup.classList.add('active');
            dateFieldContainer.classList.add('active');
            renderCalendar(); 
        }
    });

    calendarPopup.addEventListener('click', e => e.stopPropagation());

    // Navigation
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

    // Clear & Confirm
    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState = { checkIn: null, checkOut: null, tempCheckIn: null, tempCheckOut: null };
        updateDateDisplay('checkIn', null);
        updateDateDisplay('checkOut', null);
        renderCalendar();
    });

    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        closeAllPopups();
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
        ['일','월','화','수','목','금','토'].forEach(d => {
            const wd = document.createElement('div');
            wd.className = 'DayPicker-Weekday';
            wd.textContent = d;
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
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    // We want Sun as first column? Yes, standard.
    const startOffset = firstDay; 
    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayTs = new Date().setHours(0,0,0,0);
    let html = '';

    for(let i=0; i<startOffset; i++) html += `<div class="DayPicker-Day DayPicker-Day--outside"></div>`;

    for(let d=1; d<=lastDate; d++) {
        const currentTs = new Date(year, month, d).getTime();
        let classes = ['DayPicker-Day'];
        
        if (currentTs < todayTs) classes.push('DayPicker-Day--disabled');
        if (currentTs === todayTs) classes.push('DayPicker-Day--today');

        const { tempCheckIn, tempCheckOut, checkIn, checkOut } = calendarState;
        const selStart = tempCheckIn || checkIn;
        const selEnd = tempCheckOut || checkOut;

        if (selStart && currentTs === selStart) classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkIn');
        if (selEnd && currentTs === selEnd) classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut');
        if (selStart && selEnd && currentTs > selStart && currentTs < selEnd) classes.push('DayPicker-Day--inRange');

        html += `<div class="${classes.join(' ')}" data-timestamp="${currentTs}">${d}</div>`;
    }
    return html;
}

function attachDayListeners() {
    document.querySelectorAll('.DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)').forEach(day => {
        day.addEventListener('click', (e) => {
            e.stopPropagation();
            const ts = parseInt(day.dataset.timestamp);
            handleDateClick(ts);
        });
    });
}

function handleDateClick(ts) {
    const { tempCheckIn, tempCheckOut } = calendarState;

    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
        calendarState.tempCheckIn = ts;
        calendarState.tempCheckOut = null;
    } else {
        if (ts < tempCheckIn) {
            calendarState.tempCheckIn = ts;
        } else if (ts === tempCheckIn) {
            return;
        } else {
            calendarState.tempCheckOut = ts;
        }
    }
    
    updateResults();
    renderCalendar();
}

function updateResults() {
    if (calendarState.tempCheckIn) updateDateDisplay('checkIn', new Date(calendarState.tempCheckIn));
    if (calendarState.tempCheckOut) updateDateDisplay('checkOut', new Date(calendarState.tempCheckOut));
}
