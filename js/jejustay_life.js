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
    initDestinationDropdown(); // 기존 목적지 검색 유지
    initCalendar(); // 롱스테이 전용 로직 포함
    initAmenityFilter();
    initMobileSearch();
    
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

function initDestinationDropdown() {
    const destField = document.getElementById('destinationFieldLarge');
    const destInput = document.getElementById('destinationInput');
    const destDropdown = document.getElementById('destinationDropdown');
    
    if (destField && destDropdown) {
        // Toggle Dropdown
        destField.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = destDropdown.classList.contains('active');
            closeAllPopups(); // Close others
            
            if (!isActive) {
                destDropdown.classList.add('active');
                destField.classList.add('active');
            }
        });

        // Handle Item Click
        document.querySelectorAll('.destination-item, .destination-item-text').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.dataset.value;
                if (destInput) destInput.value = val;
                closeAllPopups();
            });
        });
    }
}

/* ========== Amenity Filter Logic ========== */
function initAmenityFilter() {
    const amenityField = document.getElementById('amenityField');
    const amenityDropdown = document.getElementById('amenityDropdown');
    const amenitySummary = document.getElementById('amenitySummary');
    const checkboxes = document.querySelectorAll('.amenity-option input[type="checkbox"]');
    
    if (!amenityField || !amenityDropdown) return;

    // Attach update function to element for external access
    amenityField.updateSummary = updateFilterState;

    // Toggle Dropdown
    amenityField.addEventListener('click', (e) => {
        if (e.target.closest('.amenity-dropdown')) return; // checkbox click
        e.stopPropagation();
        const isActive = amenityDropdown.classList.contains('active');
        closeAllPopups(); // Close others
        if (!isActive) {
            amenityDropdown.classList.add('active');
            amenityField.classList.add('active');
        }
    });

    // Handle Filter Change
    checkboxes.forEach(chk => {
        chk.addEventListener('change', () => {
            updateFilterState();
        });
    });

    function updateFilterState() {
        const lang = document.documentElement.lang || 'ko';
        const checked = Array.from(checkboxes).filter(c => c.checked);
        
        // 1. Update Summary Text
        if (checked.length === 0) {
            // Use lang_data keys if simple, or hardcoded fallback
            amenitySummary.textContent = lang === 'en' ? 'Kitchen, Washer, etc.' : '주방, 세탁기 등';
            amenitySummary.style.color = '#94a3b8';
        } else {
            const labels = checked.map(c => c.nextElementSibling.textContent);
            amenitySummary.textContent = labels.join(', ');
            amenitySummary.style.color = 'var(--primary)';
        }

        // 2. Filter Hotel Cards
        const selectedValues = checked.map(c => c.value);
        filterCards(selectedValues);
    }

    function filterCards(amenities) {
        const cards = document.querySelectorAll('.hotel-card-horizontal');
        cards.forEach(card => {
            const cardAmenities = (card.dataset.amenity || '').split(',');
            // Check if card has ALL selected amenities
            const isMatch = amenities.every(val => cardAmenities.includes(val));
            
            if (isMatch) {
                card.style.display = 'flex';
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

/* ========== Mobile Search Interaction ========== */
function initMobileSearch() {
    const summaryView = document.getElementById('mobileSearchSummary');
    const searchWidget = document.querySelector('.search-widget-large');
    
    if (summaryView && searchWidget) {
        summaryView.addEventListener('click', () => {
            searchWidget.classList.toggle('expanded');
        });
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


/* ========== Long Stay Calendar Logic ========== */
function initCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    const checkInField = document.getElementById('checkInField');
    const checkOutField = document.getElementById('checkOutField');
    const dateFieldGroup = document.querySelector('.date-field-group');

    function toggleCalendar(event) {
        event.stopPropagation();
        const isActive = calendarPopup.classList.contains('active');
        closeAllPopups('calendarPopup');

        if (!isActive) {
            calendarPopup.classList.add('active');
            dateFieldGroup.classList.add('active');
            renderCalendar();
        } else {
            calendarPopup.classList.remove('active');
            dateFieldGroup.classList.remove('active');
        }
    }

    checkInField?.addEventListener('click', toggleCalendar);
    checkOutField?.addEventListener('click', toggleCalendar);
    calendarPopup?.addEventListener('click', (e) => e.stopPropagation());

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

    // Actions
    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState = { checkIn: null, checkOut: null, tempCheckIn: null, tempCheckOut: null };
        updateDateDisplay('checkIn', null);
        updateDateDisplay('checkOut', null);
        renderCalendar();
        updateWarning(null);
    });

    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        // Validation Check on Confirm
        if (calendarState.tempCheckIn && calendarState.tempCheckOut) {
            const days = (calendarState.tempCheckOut - calendarState.tempCheckIn) / ONE_DAY_MS;
            if (days < MIN_STAY_DAYS) {
                alert(`장기 체류 서비스는 최소 ${MIN_STAY_DAYS}박부터 예약 가능합니다.`);
                return;
            }
        }
        
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        closeAllPopups();
        
        // 여기에 "패키지 요금 적용" 로직 시뮬레이션
        checkPackageRate();
    });

    document.addEventListener('click', (e) => {
        if (calendarPopup?.classList.contains('active') && !dateFieldGroup?.contains(e.target)) {
            calendarPopup.classList.remove('active');
            dateFieldGroup?.classList.remove('active');
        }
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
            // 한 달 살기 패키지 적용 알림 (간단히 Alert 또는 UI 변경)
            // console.log("Monthly Package Rate Applied");
            // 실제 구현에서는 가격 정보를 업데이트하겠지만, 여기서는 데모용으로 Alert 대신
            // 검색 버튼 텍스트를 변경해보겠습니다.
            const searchBtn = document.getElementById('searchBtn');
            if(searchBtn) {
                searchBtn.innerHTML = `<span>한 달 살기 특가 검색 (${days}박)</span>`;
                searchBtn.style.background = 'linear-gradient(45deg, #FF5000, #FF8A00)';
            }
        }
    }
}

/* ========== Rendering Logic (Copied & Adapted) ========== */
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
        const daysRaw = ['월', '화', '수', '목', '금', '토', '일'];
        daysRaw.forEach(d => {
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
        let ariaDisabled = 'false';

        if (currentTs < todayTs) {
            classes.push('DayPicker-Day--disabled');
            ariaDisabled = 'true';
        }

        // Highlight Today
        if (currentTs === todayTs) {
            classes.push('DayPicker-Day--today');
        }

        const checkIn = calendarState.tempCheckIn || calendarState.checkIn;
        const checkOut = calendarState.tempCheckOut || calendarState.checkOut;

        if (checkIn && currentTs === checkIn) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkIn');
            if (checkOut || hoverDate > checkIn) classes.push('DayPicker-Day--hasRange');
        }
        if (checkOut && currentTs === checkOut) {
            classes.push('DayPicker-Day--selected', 'DayPicker-Day--checkOut');
            if (checkIn) classes.push('DayPicker-Day--hasRange');
        }
        if (checkIn && checkOut && currentTs > checkIn && currentTs < checkOut) {
            classes.push('DayPicker-Day--inRange');
        }

        html += `<div class="${classes.join(' ')}" role="gridcell" 
                 data-timestamp="${currentTs}" data-day="${d}">${d}</div>`;
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
    if (!calendarState.tempCheckIn || (calendarState.tempCheckIn && calendarState.tempCheckOut)) {
        calendarState.tempCheckIn = timestamp;
        calendarState.tempCheckOut = null;
        updateWarning(null); // Reset warning
    } else {
        if (timestamp < calendarState.tempCheckIn) {
            calendarState.tempCheckIn = timestamp;
        } else if (timestamp === calendarState.tempCheckIn) {
            return;
        } else {
            calendarState.tempCheckOut = timestamp;
            
            // Check Warning immediately
            const diff = (timestamp - calendarState.tempCheckIn) / ONE_DAY_MS;
            if (diff < MIN_STAY_DAYS) {
                updateWarning(`* 최소 ${MIN_STAY_DAYS}박 이상 선택해야 합니다 (현재 ${diff}박)`);
                // 선택은 허용하되 경고 표시 (Confirm 시 막음)
            } else {
                updateWarning(null);
                if (diff >= 28) {
                    updateWarning(`* 한 달 살기 패키지 요금이 적용됩니다 (${diff}박)`);
                     document.getElementById('stayWarning').style.color = 'var(--primary)'; // Positive Color
                }
            }
        }
    }
    
    // Update UI
    updateDateDisplay('checkIn', calendarState.tempCheckIn ? new Date(calendarState.tempCheckIn) : null);
    updateDateDisplay('checkOut', calendarState.tempCheckOut ? new Date(calendarState.tempCheckOut) : null);
    renderCalendar();
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
        if (dayEl.classList.contains('DayPicker-Day--checkIn')) dayEl.classList.add('DayPicker-Day--hasRange');

        const dayTs = parseInt(dayEl.dataset.timestamp);
        if (start && currentHover && dayTs > start && dayTs <= currentHover) {
             if (dayTs < currentHover) dayEl.classList.add('DayPicker-Day--inRange');
             else if (dayTs === currentHover) dayEl.classList.add('DayPicker-Day--previewEnd');
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

    const elDisplay = document.getElementById(displayId);
    const elDay = document.getElementById(dayId);
    
    if (!elDisplay || !elDay) return;

    if (!dateObj) {
        // Fallback Text (Localized)
        if (lang === 'en') {
             elDisplay.textContent = 'Select Date';
             elDay.textContent = type === 'checkIn' ? 'Check-in' : 'Check-out';
        } else {
             elDisplay.textContent = '날짜 선택';
             elDay.textContent = type === 'checkIn' ? '체크인' : '체크아웃';
        }
        return;
    }

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    
    elDisplay.textContent = `${y}-${m}-${d}`;
    elDay.textContent = dayNames[dateObj.getDay()];
}

function closeAllPopups(exceptId) {
    const popups = ['calendarPopup', 'amenityDropdown', 'destinationDropdown']; // Add others if needed
    popups.forEach(id => {
        if (id !== exceptId) {
            const p = document.getElementById(id);
            if(p) p.classList.remove('active');
        }
    });

    // Remove active state from trigger fields if nothing is open
    if (!exceptId) {
        document.querySelectorAll('.date-field-group').forEach(f => f.classList.remove('active'));
        document.getElementById('amenityField')?.classList.remove('active');
        document.getElementById('destinationFieldLarge')?.classList.remove('active');
    } else {
        // Close others' triggers when opening one
        if (exceptId !== 'calendarPopup') document.querySelectorAll('.date-field-group').forEach(f => f.classList.remove('active'));
        if (exceptId !== 'amenityDropdown') document.getElementById('amenityField')?.classList.remove('active');
        if (exceptId !== 'destinationDropdown') document.getElementById('destinationFieldLarge')?.classList.remove('active');
    }
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