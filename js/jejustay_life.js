/*
 * JEJU STAY - Life (Long Stay) Interactive JavaScript
 * Based on hotel.js, extended for Long Term Stay logic
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

// Constants
const MIN_STAY_DAYS = 14;
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
    // initSearchTabs(); // 롱스테이 페이지는 탭 없음
    // initDestinationDropdown(); // Deprecated -> SearchManager
    // initGuestSelector(); // Deprecated -> SearchManager
    // initOptionsPopup(); // Deprecated -> SearchManager
    // initMobileSearch(); // Deprecated -> SearchManager
    
    // Initialize Search Manager (Class-based Architecture)
    window.searchManager = new SearchManager();
    
    // Global click listener to close popups when clicking outside
    // (Relies on stopPropagation in triggers/popups)
    document.addEventListener('click', () => {
        closeAllPopups();
    });
    
    // GSAP Animations
    initStandardsAnimation();
});

/* ========== GSAP Animations ========== */
/* ========== GSAP Animations ========== */
function initStandardsAnimation() {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Standards Section Cards Stagger
        // Initial set for GSAP to handle 'from' state correctly if needed, 
        // but using 'to' with 'from' styles or 'from' directly is better.
        // User requested gsap.from() logic in description but JSON config suggests simple vars.
        // Actually, JSON says "vars: { y: 50, opacity: 0 ... }" which implies a "from" state or a "to" state destination?
        // Wait, "targetSelector... vars ... y: 50, opacity: 0" usually means "animate TO this" or "Start FROM this"?
        // Detailed instruction says: "initStandardsAnimation 함수를 생성하고, 내부에서 gsap.from() 메서드를 사용하여 애니메이션을 정의하십시오." (Use gsap.from())
        // "타겟 요소인 .standard-card-wrapper들이 초기 상태에서 y: 50 위치와 opacity: 0에서 시작하여 본래 위치로 돌아오도록 설정하십시오."
        // This confirms: FROM y:50, opacity:0 TO y:0, opacity:1.
        
        gsap.from('.standard-card-wrapper', {
            scrollTrigger: {
                trigger: '.standards-section',
                start: 'top 85%', // Viewport hit
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            clearProps: "all" // Ensure CSS hover works after animation
        });
    } else {
        console.warn('GSAP not found. Falling back to IntersectionObserver.');
        // Fallback for non-GSAP environments
        const cards = document.querySelectorAll('.standard-card-wrapper');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Simple stagger simulation with partial timeout or just CSS transition delay
                    setTimeout(() => {
                         entry.target.style.opacity = '1';
                         entry.target.style.transform = 'translateY(0)';
                         entry.target.style.transition = 'all 0.8s ease-out';
                    }, index * 200); // 0.2s stagger
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(c => {
             // Set initial state for fallback
             c.style.opacity = '0';
             c.style.transform = 'translateY(50px)';
             observer.observe(c);
        });
    }
}

/* ========== 공통 기능 (hotel.js와 동일) ========== */
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
            
            const id = parseInt(btn.dataset.id);
            const hotel = longStayHotels.find(h => h.id === id);
            
            if(hotel && window.FABState) {
                // Calculate Price for display
                const NIGHTS = 30;
                const standardTotal = hotel.priceDaily * NIGHTS;
                const finalTotal = Math.round(standardTotal * (1 - hotel.discountRate));
                const priceStr = `₩${finalTotal.toLocaleString()}`; 
                
                // Construct Item Object
                const item = {
                    id: hotel.id,
                    name: hotel.name,
                    location: hotel.location,
                    image: hotel.image,
                    price: priceStr
                };
                
                FABState.addToWishlist(item);
            }
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
    document.querySelectorAll('.hotel-card, .destination-card, .curation-card').forEach(el => observer.observe(el));
    
    // Global Language Change Listener
    document.addEventListener('fabLanguageChanged', (e) => {
        // 1. Re-render Calendar (Month names, etc.)
        renderCalendar();
        
        // 2. Re-render Hotel List (localized data)
        renderLongStayHotels();
        
        // 3. Re-run Amenity Filter Summary update to refresh text
        const amenityField = document.getElementById('amenityField');
        if (amenityField && typeof amenityField.updateSummary === 'function') {
            amenityField.updateSummary();
        }
        
        // 4. Update Summary Dates if selected
        updateDateDisplay('checkIn', calendarState.tempCheckIn ? new Date(calendarState.tempCheckIn) : calendarState.checkIn ? new Date(calendarState.checkIn) : null);
        updateDateDisplay('checkOut', calendarState.tempCheckOut ? new Date(calendarState.tempCheckOut) : calendarState.checkOut ? new Date(calendarState.checkOut) : null);

        // 5. Update Warning Message if present
        if (document.getElementById('stayWarning').style.display === 'block') {
             // Re-trigger validation logic or just hide it to avoid stale text?
             updateWarning(document.getElementById('stayWarning').textContent); // Trigger update if logic allows, or reset
        }
        
        // 6. Update Search Button text if package rate applied
        checkPackageRate();
    });
}

/* ========== Search Manager (Class-based Architecture) ========== */
class SearchManager {
    constructor() {
        this.state = {
            destination: '',
            dates: { start: null, end: null },
            guests: { rooms: 1, adults: 1, children: 0 },
            options: [],
            isTyping: false
        };
        
        this.init();
    }

    init() {
        this.bindDestination();
        this.bindGuests();
        this.bindOptions();
        this.bindSearchButton();
        this.bindPopups();
    }

    /* --- Security: Input Sanitization --- */
    sanitize(str) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
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

        // Input Handling with Debounce
        input.addEventListener('input', this.debounce((e) => {
            const val = this.sanitize(e.target.value);
            this.state.destination = val;
            this.updateTitle('destinationInput', val); // Dynamic Tooltip
        }, 300));

        // Selection
        listItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.dataset.value;
                input.value = val;
                this.state.destination = val;
                this.updateTitle('destinationInput', val); // Dynamic Tooltip
                closeAllPopups();
            });
        });
    }

    /* --- Guest Logic --- */
    bindGuests() {
        const field = document.getElementById('guestFieldLarge');
        const popup = document.getElementById('guestPopupLarge');
        const summary = document.getElementById('guestSummary');
        
        if (!field || !popup) return;

        field.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopup('guestPopupLarge');
        });
        
        popup.addEventListener('click', e => e.stopPropagation());

        // Counter Logic
        const btns = popup.querySelectorAll('.counter-btn-new');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = btn.dataset.target; // rooms, adults, children
                const isPlus = btn.classList.contains('plus');
                const display = document.getElementById(`${target}CountLarge`);
                
                if (!display) return;
                
                let currentVal = parseInt(display.textContent);
                const min = target === 'children' ? 0 : 1;
                const max = 20; // Hard limit for security

                if (isPlus && currentVal < max) currentVal++;
                if (!isPlus && currentVal > min) currentVal--;
                
                display.textContent = currentVal;
                this.state.guests[target] = currentVal;
                this.updateGuestSummary();
            });
        });
    }

    updateGuestSummary() {
        const { rooms, adults, children } = this.state.guests;
        const el = document.getElementById('guestSummary');
        if (el) {
            let txt = `성인 ${adults}명, 객실 ${rooms}개`;
            if (children > 0) txt += `, 아동 ${children}명`;
            el.textContent = txt;
            this.updateTitle('guestSummary', txt); // Dynamic Tooltip
        }
    }

    /* --- Options Logic --- */
    bindOptions() {
        const field = document.getElementById('optionsFieldLarge');
        const popup = document.getElementById('optionsPopupLarge');
        const summary = document.getElementById('optionsSummary');

        if (!field || !popup) return;

        field.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopup('optionsPopupLarge');
        });

        popup.addEventListener('click', e => e.stopPropagation());

        const checks = popup.querySelectorAll('.option-checkbox');
        checks.forEach(chk => {
            chk.addEventListener('change', () => {
                // Use Span Content for accurate display label
                const checkedNodes = Array.from(popup.querySelectorAll('.option-checkbox:checked'));
                const labels = checkedNodes.map(c => c.nextElementSibling.textContent.trim());
                this.state.options = checkedNodes.map(c => c.value); // State keeps values
                
                if (labels.length === 0) {
                    summary.textContent = "전체"; // Zero Truncation: Shortest possible text
                    summary.style.color = "#999";
                } else {
                    // Strict Length Logic: "Keyword + 외 N"
                    summary.textContent = labels.length > 1 
                        ? `${labels[0]} 외 ${labels.length - 1}` 
                        : labels[0];
                    summary.style.color = "var(--text-main)";
                }
                this.updateTitle('optionsSummary', labels.join(', ')); // Full list in tooltip
            });
        });
    }

    /* --- Search Action --- */
    bindSearchButton() {
        const btn = document.getElementById('searchBtn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                // Prevent Form Submit if type submit
                // e.preventDefault(); 
                // But we have onsubmit="return false" in HTML form
                
                // Collect Data
                const searchData = {
                    destination: this.state.destination,
                    checkIn: calendarState.checkIn, // Global state
                    checkOut: calendarState.checkOut,
                    guests: this.state.guests,
                    options: this.state.options
                };
                
                console.log('Safe Search Data:', searchData);
                // Implementation: Navigate or Filter List
                this.showToast('검색 결과가 업데이트 되었습니다.');
            });
        }
    }

    /* --- Utilities --- */
    togglePopup(id) {
        const el = document.getElementById(id);
        const isActive = el.classList.contains('active') || el.style.display === 'block'; // Legacy support
        
        closeAllPopups(id); // Helper global function
        
        if (!isActive) {
            el.classList.add('active');
            el.parentElement.classList.add('active'); // active class on parent item
            if (id.includes('options')) el.style.display = 'block'; // Handling legacy style
        }
    }
    
    // Popup binding for mobile expand is integrated or can be added here
    bindPopups() {
       // Mobile Summary Click
       const mobileSummary = document.getElementById('mobileSearchSummary');
       if (mobileSummary) {
           mobileSummary.addEventListener('click', () => {
               document.querySelector('.global-search-container').classList.toggle('expanded');
           });
       }
    }

    updateTitle(id, text) {
        const el = document.getElementById(id);
        if (el) el.title = text;
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    showToast(msg) {
        // Create simple toast
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: white; padding: 12px 24px;
            border-radius: 50px; z-index: 9999;font-size: 0.9rem;
            animation: fadeIn 0.3s;
        `;
        div.textContent = msg;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, 2000);
    }
}

/* ========== Long Stay Calendar Logic (Keep Existing) ========== */
// ... (Calendar functions omitted for brevity in replace, but needed in full file)
// Since replace_file_content replaces a block, I must ensure I don't delete calendar logic if I target a range.
// But I am rewriting the file structure slightly.
// Wait, I should not overwrite initCalendar if I don't include it in replacement.
// The replace_file_content tool requires TargetContent to match EXACTLY.
// It is better to use the "EndLine" feature carefully or replace specific function blocks.
// However, the previous tool call showed initAmenityFilter at line 89.
// And closeAllPopups at line 388.
// I will replace from initHeader downwards to overwrite Filter and Utility functions, but preserve initCalendar if possible?
// Looking at the file, initCalendar is lines 100-176.
// I can replace initAmenityFilter block specifically.
// And append initMobileSearch at the end.
// And update closeAllPopups.

// Let's do partial replacements to be safe.

// 1. Replace initAmenityFilter
// 2. Add initMobileSearch at bottom
// 3. Update closeAllPopups


/* ========== Long Stay Calendar Logic (Ported from hotel.js with Long Stay Validation) ========== */
function initCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    const dateFieldContainer = document.getElementById('checkInField'); 

    if (!calendarPopup || !dateFieldContainer) return;

    // 1. Toggle Calendar
    dateFieldContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const isActive = calendarPopup.classList.contains('active');
        closeAllPopups('calendarPopup');

        if (!isActive) {
            // Synch temp state on open
            calendarState.tempCheckIn = calendarState.checkIn;
            calendarState.tempCheckOut = calendarState.checkOut;
            
            calendarPopup.classList.add('active');
            dateFieldContainer.classList.add('active');
            renderCalendar(); 
        } else {
            calendarPopup.classList.remove('active');
            dateFieldContainer.classList.remove('active');
        }
    });

    // 2. Prevent propagation
    calendarPopup.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 2-1. Tab Switching Logic (Added from hotel.js)
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

    // 2-2. Flexible Option Logic
    document.querySelectorAll('.Flexible-Option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.Flexible-Option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            // For logic consistency: maybe set a state? 
            // Currently just UI selection as per hotel.js
        });
    });

    // 3. Navigation
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

    // 4. Clear
    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState = { checkIn: null, checkOut: null, tempCheckIn: null, tempCheckOut: null };
        updateDateDisplay('checkIn', null);
        updateDateDisplay('checkOut', null);
        renderCalendar();
        updateWarning(null);
    });

    // 5. Confirm (With Long Stay Validation)
    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Validation: Min Stay Check
        if (calendarState.tempCheckIn && calendarState.tempCheckOut) {
            const days = (calendarState.tempCheckOut - calendarState.tempCheckIn) / ONE_DAY_MS;
            if (days < MIN_STAY_DAYS) {
                alert(`장기 체류 서비스는 최소 ${MIN_STAY_DAYS}박부터 예약 가능합니다.`);
                return;
            }
        }
        
        // Confirm Logic
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        closeAllPopups();
        
        // Update UI/Price
        checkPackageRate();
    });

    // Initial warning update
    updateWarning(null);
}

function updateWarning(message) {
    const warningEl = document.getElementById('stayWarning');
    if (!warningEl) return;
    
    if (message) {
        warningEl.textContent = message;
        warningEl.style.display = 'block';
    } else {
        warningEl.style.display = 'none';
    }
}

function checkPackageRate() {
    if (calendarState.checkIn && calendarState.checkOut) {
        const days = (calendarState.checkOut - calendarState.checkIn) / ONE_DAY_MS;
        if (days >= 28) {
            const searchBtn = document.getElementById('searchBtn');
            if(searchBtn) {
                searchBtn.style.background = 'linear-gradient(45deg, #FF5000, #FF8A00)';
                searchBtn.title = `한 달 살기 특가 적용 (${days}박)`;
            }
        }
    }
}

/* ========== Rendering Logic (Agoda Style) ========== */
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
            wd.textContent = d;
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
    const firstDay = new Date(year, month, 1).getDay();
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
        
        // Disabled
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
            classes.push('DayPicker-Day--hasRange');
        }
        if (checkOut && currentTs === checkOut) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut');
            classes.push('DayPicker-Day--hasRange');
        }
        
        // Range
        if (checkIn && checkOut && currentTs > checkIn && currentTs < checkOut) {
            classes.push('DayPicker-Day--inRange');
        }

        // Hover Range (Server-side rendering part of logic, mostly handled by JS event)
        if (checkIn && !checkOut && hoverDate) {
            if (currentTs > checkIn && currentTs <= hoverDate) {
                classes.push('DayPicker-Day--hoverRange');
            }
        }

        html += `<div class="${classes.join(' ')}" 
                 data-timestamp="${currentTs}" 
                 data-day="${d}">${d}</div>`;
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

            // Only effective if checkIn is selected but checkOut is not
            if (tempCheckIn && !tempCheckOut) {
                if (ts > tempCheckIn) {
                    hoverDate = ts;
                    updateHoverEffect(); 
                }
            }
        });
    });

    // Mouse Leave Container
    const calendarContainer = document.getElementById('dayPickerContainer');
    if (calendarContainer) {
        calendarContainer.onmouseleave = () => {
            if (hoverDate) {
                hoverDate = null;
                updateHoverEffect();
            }
        };
    }
}

// Optimized Hover Effect
function updateHoverEffect() {
    const { tempCheckIn, tempCheckOut } = calendarState;
    const days = document.querySelectorAll('.DayPicker-Day');

    days.forEach(day => {
        const ts = parseInt(day.dataset.timestamp);
        
        // Reset hover class
        day.classList.remove('DayPicker-Day--hoverRange');

        // Apply new hover class
        if (tempCheckIn && !tempCheckOut && hoverDate) {
            if (ts > tempCheckIn && ts <= hoverDate) {
                day.classList.add('DayPicker-Day--hoverRange');
            }
        }
    });
}

function handleDateClick(timestamp) {
    const { tempCheckIn, tempCheckOut } = calendarState;

    // Case 1: Start new selection
    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
        calendarState.tempCheckIn = timestamp;
        calendarState.tempCheckOut = null;
        hoverDate = null;
    } 
    // Case 2: Complete selection
    else {
        if (timestamp < tempCheckIn) {
            // New Start Date
            calendarState.tempCheckIn = timestamp;
            hoverDate = null;
        } else if (timestamp === tempCheckIn) {
            return; 
        } else {
            // End Date
            calendarState.tempCheckOut = timestamp;
            hoverDate = null;
        }
    }
    
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
    const elDisplay = document.getElementById(displayId);
    
    if (!elDisplay) return;

    if (!dateObj) {
        elDisplay.textContent = '날짜 선택';
        return;
    }

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    
    elDisplay.textContent = `${y}-${m}-${d}`;
}



/* ========== State Management (v2.0) ========== */
const AppState = {
    destination: localStorage.getItem('jeju_destination') || '',
    
    setDestination(dest) {
        this.destination = dest;
        localStorage.setItem('jeju_destination', dest);
    }
};

/* ========== Monthly Stay Data & Rendering Logic (v2.0) ========== */

const longStayHotels = [
    {
        id: 1,
        name: "그랜드 하얏트 제주",
        nameEn: "Grand Hyatt Jeju",
        location: "제주시 노형동 · 해변까지 도보 5분",
        locationEn: "Nohyeong-dong, Jeju · 5 min to beach",
        image: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2021/02/22/2059/CJUGH-P050-King-Guestroom-City-View.jpg/CJUGH-P050-King-Guestroom-City-View.16x9.jpg?w=600&q=80",
        rating: 9.2,
        star: 4,
        reviews: 2341,
        recommendation: "특가",
        recommendationEn: "Special Offer",
        amenities: ["kitchen", "washer", "parking"],
        specs: [
            { icon: "wifi", text: "무료 와이파이", textEn: "Free Wifi" },
            { icon: "waves", text: "수영장", textEn: "Pool" },
            { icon: "utensils", text: "조식 포함", textEn: "Breakfast" }
        ],
        reviewLabel: "최고",
        reviewLabelEn: "Excellent",
        priceDaily: 480000,
        discountRate: 0.25,
        currency: "KRW",
        infra: {
            mart: "이마트 도보 10분",
            hospital: "한라병원 차량 15분",
            bus: "노형오거리 도보 5분"
        },
        infraEn: {
             mart: "E-Mart 10min walk",
             hospital: "Halla Hosp. 15min drive",
             bus: "Nohyeong Jct. 5min walk"
        }
    },
    {
        id: 2,
        name: "오사카 리츠칼튼",
        nameEn: "The Ritz-Carlton Osaka",
        location: "오사카 키타구 · 우메다역 도보 3분",
        locationEn: "Kita-ku, Osaka · 3 min to Umeda Stn",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        rating: 9.5,
        star: 5,
        reviews: 4521,
        recommendation: "특가",
        recommendationEn: "Special Offer",
        amenities: ["desk", "fitness", "spa"],
        specs: [
            { icon: "wifi", text: "무료 와이파이", textEn: "Free Wifi" },
            { icon: "dumbbell", text: "피트니스", textEn: "Fitness" },
            { icon: "sparkles", text: "스파", textEn: "Spa" }
        ],
        reviewLabel: "최고",
        reviewLabelEn: "Excellent",
        priceDaily: 550000,
        discountRate: 0.10,
        infra: {
            mart: "라이프마켓 도보 3분",
            hospital: "오사카시립병원 차량 10분",
            bus: "우메다역 도보 3분"
        },
        infraEn: {
             mart: "Life Market 3min walk",
             hospital: "Osaka City Hosp. 10min drive",
             bus: "Umeda Stn 3min walk"
        }
    },
    {
        id: 3,
        name: "파리 에펠뷰 아파트",
        nameEn: "Paris Eiffel View Apt",
        location: "프랑스 파리 · 7구",
        locationEn: "7th Arr, Paris · France",
        image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=600&q=80",
        rating: 8.9,
        star: 3,
        reviews: 320,
        recommendation: "최저가 보장",
        recommendationEn: "Best Price",
        amenities: ["kitchen", "subway"],
        specs: [
            { icon: "wifi", text: "와이파이", textEn: "Free Wifi" },
            { icon: "utensils", text: "주방", textEn: "Kitchen" },
            { icon: "train", text: "역세권", textEn: "Near Metro" }
        ],
        reviewLabel: "매우 좋음",
        reviewLabelEn: "Very Good",
        priceDaily: 350000,
        discountRate: 0.30,
        infra: {
            mart: "까르푸 도보 5분",
            hospital: "아메리칸병원 차량 20분",
            bus: "비하켐역 도보 2분"
        },
        infraEn: {
             mart: "Carrefour 5min walk",
             hospital: "American Hosp. 20min drive",
             bus: "Bir-Hakeim 2min walk"
        }
    }
];

function renderLongStayHotels(hotelsData = longStayHotels) {
    const listContainer = document.getElementById('hotelList');
    if (!listContainer) return;

    // Determine current language and currency state
    const currency = window.FABState ? FABState.currency : 'KRW';
    // Use FABState language if available, otherwise fall back to DOM or 'ko'
    const lang = window.FABState ? FABState.language : (document.documentElement.lang || 'ko');
    const isEn = lang === 'en';
    const rate = 1300; // Fixed rate for demo
    const symbol = currency === 'KRW' ? '₩' : '$';

    // Helper to format money based on active currency
    const formatMoney = (krw) => {
        if (currency === 'KRW') return krw.toLocaleString();
        return Math.round(krw / rate).toLocaleString();
    };

    // Helper for Translation with Fallback
    const t = (key, fallback) => {
        if (window.langData && langData[lang] && langData[lang][key]) return langData[lang][key];
        return fallback || key;
    };

    // Pre-fetch commonly used translation values
    // Fix: reviewSuffix fallback should be safe
    const txtReviewSuffix = t('reviewSuffix', isEn ? " reviews" : "개");
    
    // Fallback constants to prevent English stuck or Key showing
    const labelDailySave = t('lifeDailySave', isEn ? "Save per night" : "1박 대비 절약");
    const labelPerNight = t('lifePerNightMsg', isEn ? "Approx. per night" : "1박 환산 시 약");
    const labelTotal30 = t('lifeTotal30', isEn ? "Total for 30 nights (Tax incl.)" : "30박 세금포함 총액");
    const labelAvg = t('lifePerNightAvg', isEn ? "Avg per night" : "1박 평균");
    const labelUtility = t('lifeUtilityIncl', isEn ? "Utilities included" : "공과금 포함");
    const labelMember = t('lifeMemberDiscount', isEn ? "Jeju Air Member Discount Applied" : "제주항공 회원 추가 할인 적용");
    const labelTax = t('lifeTaxServiceIncl', isEn ? "Tax & Service Charge Included" : "세금 및 봉사료 포함");

    listContainer.innerHTML = hotelsData.map(hotel => {
        // Calculation Logic
        const NIGHTS = 30;
        let pDaily = hotel.priceDaily;

        const standardTotal = pDaily * NIGHTS;
        const finalTotal = Math.round(standardTotal * (1 - hotel.discountRate));
        const savedAmount = standardTotal - finalTotal;

        // Localized Strings
        const name = isEn && hotel.nameEn ? hotel.nameEn : hotel.name;
        const location = isEn && hotel.locationEn ? hotel.locationEn : hotel.location;
        const recommendation = isEn && hotel.recommendationEn ? hotel.recommendationEn : hotel.recommendation;
        const reviewLabel = isEn && hotel.reviewLabelEn ? hotel.reviewLabelEn : hotel.reviewLabel;
        
        // Stars
        const starsHtml = Array(5).fill(0).map((_, i) => 
            `<i data-lucide="star" class="${i < hotel.star ? 'star-icon filled' : ''}" style="width:14px; height:14px;"></i>` 
        ).join('');

        // Spec Items
        const specsHtml = hotel.specs.map(s => 
            `<span><i data-lucide="${s.icon}"></i> ${isEn && s.textEn ? s.textEn : s.text}</span>`
        ).join('');

        // Check Wishlist State
        const isInWishlist = window.FABState ? FABState.isInWishlist(hotel.id) : false;
        const activeClass = isInWishlist ? 'active' : '';

        // Review Logic Correction:
        // If English: "Reviews 2,341 reviews" (if included) or "Reviews 2,341"
        // If Korean: "리뷰 2,341개"
        // t('reviewSuffix') usually brings space prefix in EN, so we handle carefullly.
        
        let reviewStr = "";
        if (isEn) {
             reviewStr = `Reviews ${hotel.reviews.toLocaleString()}`;
        } else {
             // Removing 'reviewSuffix' literal risk
             reviewStr = `리뷰 ${hotel.reviews.toLocaleString()}${txtReviewSuffix}`;
        }

        return `
            <article class="hotel-card-horizontal" data-amenity="${hotel.amenities.join(',')}" onclick="updateInfraUI(${hotel.id})">
                <div class="card-image-wrap">
                    <img src="${hotel.image}" alt="${name}">
                    <button class="wishlist-btn ${activeClass}" data-id="${hotel.id}"><i data-lucide="heart"></i></button>
                    <!-- v2.0 Savings Badge -->
                    <span class="stay-discount-badge">${labelDailySave} <span data-price-krw="${savedAmount}">${symbol}${formatMoney(savedAmount)}</span></span>
                </div>
                <div class="card-content">
                    <div class="card-info">
                        <div class="card-header">
                            <span class="badge-recommend">${recommendation}</span>
                            <div class="star-rating" style="color:#FFB300; display:flex; gap:2px;">
                                ${starsHtml}
                            </div>
                        </div>
                        <h3 class="card-title">${name}</h3>
                        <p class="card-location"><i data-lucide="map-pin"></i> ${location}</p>
                        <div class="card-specs">
                            ${specsHtml}
                        </div>
                        <div class="card-review-badge">
                            <span class="score">${hotel.rating}</span>
                            <span class="label">${reviewLabel} · ${reviewStr}</span>
                        </div>
                    </div>
                    
                    <div class="card-price-section">
                        <!-- Tooltip -->
                        <div class="price-tooltip">${labelPerNight} <span data-price-krw="${Math.round(finalTotal/30)}">${symbol}${formatMoney(Math.round(finalTotal/30))}</span></div>
                        
                        <div class="price-container">
                            <span class="monthly-price-label">${labelTotal30}</span>
                            <!-- Tone-on-tone Highlight -->
                            <div class="monthly-price highlight"><span data-price-krw="${finalTotal}">${symbol}${formatMoney(finalTotal)}</span></div>
                            <div class="per-night-price">${labelAvg} <span data-price-krw="${pDaily}">${symbol}${formatMoney(pDaily)}</span></div>
                        </div>

                        <div class="badges-container">
                            <span class="badge-utility"><i data-lucide="zap" style="width:12px; height:12px;"></i> ${labelUtility}</span>
                            <span class="badge-member">${labelMember}</span>
                        </div>
                        
                        <span class="tax-label">${labelTax}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Re-initialize Lucide icons for new content
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Re-init wishlist buttons
    if(typeof initWishlistButtons === 'function') initWishlistButtons();
}

// v2.0 Dynamic Infra UI
// v2.0 Dynamic Infra UI
function updateInfraUI(hotelId) {
    const hotel = longStayHotels.find(h => h.id === hotelId);
    if(!hotel) return;

    // Check language
    const lang = document.documentElement.lang || 'ko';
    const isEn = lang === 'en';
    
    // Select correct infra object
    const infra = (isEn && hotel.infraEn) ? hotel.infraEn : hotel.infra;
    if (!infra) return;

    const ids = {
        mart: 'infra-mart-dist',
        hosp: 'infra-hosp-dist',
        bus: 'infra-bus-dist'
    };

    if(document.getElementById(ids.mart)) document.getElementById(ids.mart).textContent = infra.mart;
    if(document.getElementById(ids.hosp)) document.getElementById(ids.hosp).textContent = infra.hospital;
    if(document.getElementById(ids.bus)) document.getElementById(ids.bus).textContent = infra.bus;
}

// Global Wishlist Sync Listener
document.addEventListener('fabWishlistUpdated', (e) => {
    const wishlist = e.detail;
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const isIn = wishlist.some(item => item.id === id);
        if (isIn) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});

// v2.0 Search Logic
function initSearchLogic() {
    const btn = document.getElementById('searchBtn');
    if(!btn) return;

    btn.addEventListener('click', () => {
        // Get Filters
        const destInput = document.getElementById('destinationInput')?.value.trim();
        const checkedAmenities = Array.from(document.querySelectorAll('.amenity-option input[type="checkbox"]:checked')).map(c => c.value);
        
        // Filter Data
        let filtered = longStayHotels;
        
        if (destInput) {
            filtered = filtered.filter(h => h.name.includes(destInput) || h.location.includes(destInput));
        }
        
        if (checkedAmenities.length > 0) {
            filtered = filtered.filter(h => {
                 return checkedAmenities.every(req => h.amenities.includes(req));
            });
        }
        
        // Render
        renderLongStayHotels(filtered);
    });
}

// Ensure it runs after DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Run Init Logic
    renderLongStayHotels();
    initSearchLogic();
    
    // Initial Infra Load (Data for first hotel)
    if(longStayHotels.length > 0) updateInfraUI(longStayHotels[0].id);
});