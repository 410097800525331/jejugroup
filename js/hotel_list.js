// 1. Mock Data (Hiroshima Expanded)
const hotelData = [
    {
        id: 1,
        name: "리가 로얄 호텔 히로시마 (RIHGA Royal Hotel Hiroshima)",
        image: "https://images.unsplash.com/photo-1724497213617-89767cc40ae2?auto=format&fit=crop&w=800&q=80",
        stars: 5,
        location: "히로시마, 나카 워드",
        score: 9.0,
        reviews: 3420,
        badges: ["시내 중심", "공항 리무진 정류장"],
        priceOriginal: 250000,
        priceFinal: 185000,
        isSoldOut: false
    },
    {
        id: 2,
        name: "쉐라톤 그랜드 히로시마 호텔 (Sheraton Grand Hiroshima Hotel)",
        image: "https://images.unsplash.com/photo-1565825662884-a55d1a5133fc?auto=format&fit=crop&w=800&q=80",
        stars: 5,
        location: "히로시마역 도보 1분",
        score: 9.3,
        reviews: 1502,
        badges: ["럭셔리", "역세권"],
        priceOriginal: 320000,
        priceFinal: 280000,
        isSoldOut: false
    },
    {
        id: 3,
        name: "더 놋 히로시마 (THE KNOT HIROSHIMA)",
        image: "https://images.unsplash.com/photo-1560078444-7fbc3a39bc6d?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마, 평화 기념 공원 인근",
        score: 8.9,
        reviews: 850,
        badges: ["루프탑 바", "디자인 호텔"],
        priceOriginal: 150000,
        priceFinal: 98000,
        isSoldOut: false
    },
    {
        id: 4,
        name: "호텔 그란비아 히로시마 (Hotel Granvia Hiroshima)",
        image: "https://images.unsplash.com/photo-1658167865945-7e9949fa4d69?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마역 직결",
        score: 8.8,
        reviews: 4240,
        badges: ["편리한 교통", "가족 여행객 추천"],
        priceOriginal: 180000,
        priceFinal: 140000,
        isSoldOut: false
    },
    {
        id: 5,
        name: "칸데오 호텔 히로시마 핫초보리 (Candeo Hotels Hiroshima)",
        image: "https://images.unsplash.com/photo-1589935525482-047064b3796c?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마, 핫초보리",
        score: 8.7,
        reviews: 2100,
        badges: ["스카이스파", "사우나"],
        priceOriginal: 130000,
        priceFinal: 95000,
        isSoldOut: false
    },
    {
        id: 6,
        name: "미츠이 가든 호텔 히로시마 (Mitsui Garden Hotel Hiroshima)",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마, 나카 워드",
        score: 8.6,
        reviews: 1800,
        badges: ["조식 맛집", "세련된 객실"],
        priceOriginal: 110000,
        priceFinal: 85000,
        isSoldOut: false
    },
    {
        id: 7,
        name: "아파 호텔 히로시마 에키마에 (APA Hotel)",
        image: "https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&w=800&q=80",
        stars: 3,
        location: "히로시마역 도보 5분",
        score: 7.8,
        reviews: 5500,
        badges: ["가성비", "대욕장"],
        priceOriginal: 80000,
        priceFinal: 55000,
        isSoldOut: false
    },
    {
        id: 8,
        name: "도미 인 히로시마 (Dormy Inn Hiroshima)",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        stars: 3,
        location: "히로시마, 평화대로",
        score: 9.1,
        reviews: 3200,
        badges: ["온천", "무료 야식"],
        priceOriginal: 120000,
        priceFinal: 90000,
        isSoldOut: false
    },
    {
        id: 9,
        name: "그랜드 프린스 호텔 히로시마 (Grand Prince Hotel)",
        image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마 베이 에어리어",
        score: 8.9,
        reviews: 2800,
        badges: ["오션뷰", "리조트"],
        priceOriginal: 220000,
        priceFinal: 160000,
        isSoldOut: false
    },
    {
        id: 10,
        name: "네스트 호텔 히로시마 핫초보리 (Nest Hotel)",
        image: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80",
        stars: 3,
        location: "히로시마, 핫초보리",
        score: 8.4,
        reviews: 980,
        badges: ["모던 디자인", "베이커리"],
        priceOriginal: 90000,
        priceFinal: 65000,
        isSoldOut: false
    },
    {
        id: 11,
        name: "히로시마 워싱턴 호텔 (Hiroshima Washington Hotel)",
        image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=800&q=80",
        stars: 3,
        location: "히로시마, 나카 워드",
        score: 8.5,
        reviews: 1450,
        badges: ["쇼핑 중심지", "넓은 욕실"],
        priceOriginal: 100000,
        priceFinal: 75000,
        isSoldOut: false
    },
    {
        id: 12,
        name: "키로 히로시마 바이 더 쉐어 호텔 (KIRO Hiroshima)",
        image: "https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?auto=format&fit=crop&w=800&q=80",
        stars: 3,
        location: "히로시마, 미카와초",
        score: 9.2,
        reviews: 670,
        badges: ["감성 숙소", "바/라운지"],
        priceOriginal: 110000,
        priceFinal: 88000,
        isSoldOut: false
    },
    {
        id: 13,
        name: "호텔 인터게이트 히로시마 (Hotel Intergate)",
        image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마, 핫초보리",
        score: 8.8,
        reviews: 1100,
        badges: ["라운지 무료", "대욕장"],
        priceOriginal: 135000,
        priceFinal: 105000,
        isSoldOut: false
    },
    {
        id: 14,
        name: "ANA 크라운 플라자 히로시마 (ANA Crowne Plaza)",
        image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마, 나카 워드",
        score: 8.6,
        reviews: 2300,
        badges: ["클럽 라운지", "비즈니스"],
        priceOriginal: 160000,
        priceFinal: 120000,
        isSoldOut: false
    },
    {
        id: 15,
        name: "오리엔탈 호텔 히로시마 (Oriental Hotel Hiroshima)",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        stars: 4,
        location: "히로시마, 평화대로",
        score: 8.5,
        reviews: 3100,
        badges: ["아트 호텔", "뷰 맛집"],
        priceOriginal: 115000,
        priceFinal: 80000,
        isSoldOut: false
    }
];

// ==========================================
// [Ported] Search Logic (Calendar, Guest, Destination)
// ==========================================

// Global State
let currentMonth = new Date();
let calendarState = {
    checkIn: null, checkOut: null,
    tempCheckIn: null, tempCheckOut: null
};
let hoverDate = null;

document.addEventListener('DOMContentLoaded', () => {
    // [Fix] Lucide 아이콘 렌더링 초기화
    if (window.lucide) {
        lucide.createIcons();
    }

    // 1. Icons
    // if (window.lucide) lucide.createIcons(); // Removing duplicate if exists or just keeping the new one active.

    // 2. URL Params & Init
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('dest') || '히로시마';
    
    const destInput = document.getElementById('destinationInput');
    if(destInput) destInput.value = destination;

    // 3. Initialize Interactive Components
    initDestinationDropdown();
    initCalendar();
    initGuestSelector();

    // 4. Render Initial List
    renderHotels(hotelData);
    setupEventListeners(); // Existing filter listeners
});

/* ========== Destination Dropdown ========== */
function initDestinationDropdown() {
    const destField = document.getElementById('destinationFieldLarge');
    const destInput = document.getElementById('destinationInput');
    const destDropdown = document.getElementById('destinationDropdown');

    if(!destField || !destDropdown) return;

    destField.addEventListener('click', (e) => {
        // Only toggle if clicking outside the input (or clicking the input logic)
        // actually input click should also open it.
        e.stopPropagation();
        closeAllPopups('destinationDropdown');
        destDropdown.classList.toggle('active');
    });

    document.querySelectorAll('.destination-item, .destination-item-text').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            destInput.value = item.dataset.value;
            destDropdown.classList.remove('active');
        });
    });
}

/* ========== Calendar Logic (Agoda Style) ========== */
function initCalendar() {
    const calendarPopup = document.getElementById('calendarPopup');
    const checkInField = document.getElementById('checkInField');
    const checkOutField = document.getElementById('checkOutField');
    const dateFieldContainer = document.querySelector('.search-dates');

    if(!calendarPopup) return;

    function toggleCalendar(e) {
        e.stopPropagation();
        const isActive = calendarPopup.classList.contains('active');
        closeAllPopups('calendarPopup');
        if (!isActive) {
            calendarPopup.classList.add('active');
            renderCalendar();
        } else {
            calendarPopup.classList.remove('active');
        }
    }

    checkInField?.addEventListener('click', toggleCalendar);
    checkOutField?.addEventListener('click', toggleCalendar);
    calendarPopup.addEventListener('click', (e) => e.stopPropagation());

    calendarPopup.addEventListener('click', (e) => e.stopPropagation());

    // Tabs Logic
    const tabCalendar = document.getElementById('tab-calendar');
    const tabFlexible = document.getElementById('tab-flexible');
    const panelCalendar = document.getElementById('panel-calendar');
    const panelFlexible = document.getElementById('panel-flexible');

    function switchTab(targetTab) {
        [tabCalendar, tabFlexible].forEach(t => t.classList.remove('active'));
        [panelCalendar, panelFlexible].forEach(p => p.classList.remove('active'));
        
        targetTab.classList.add('active');
        if (targetTab === tabCalendar) panelCalendar.classList.add('active');
        else panelFlexible.classList.add('active');
    }

    tabCalendar?.addEventListener('click', (e) => { e.stopPropagation(); switchTab(tabCalendar); });
    tabFlexible?.addEventListener('click', (e) => { e.stopPropagation(); switchTab(tabFlexible); });

    // Month Nav
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

    // Clear/Confirm
    document.getElementById('btn-clear')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState = { checkIn: null, checkOut: null, tempCheckIn: null, tempCheckOut: null };
        updateDateDisplay('checkIn', null); updateDateDisplay('checkOut', null);
        renderCalendar();
    });
    document.getElementById('btn-confirm')?.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarState.checkIn = calendarState.tempCheckIn;
        calendarState.checkOut = calendarState.tempCheckOut;
        closeAllPopups();
    });

    // Outside Click for Calendar handled by global closer
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
    const year = dateObj.getFullYear(), month = dateObj.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayTs = new Date().setHours(0,0,0,0);
    
    let html = '';
    for(let i=0; i<firstDay; i++) html += `<div class="DayPicker-Day" style="visibility:hidden"></div>`;
    
    for(let d=1; d<=lastDate; d++) {
        const ts = new Date(year, month, d).getTime();
        let classes = ['DayPicker-Day'];
        
        if(ts < todayTs) classes.push('DayPicker-Day--disabled');
        if(ts === todayTs) classes.push('DayPicker-Day--today');
        
        const start = calendarState.tempCheckIn || calendarState.checkIn;
        const end = calendarState.tempCheckOut || calendarState.checkOut;
        
        if(start && ts === start) {
            classes.push('DayPicker-Day--checkIn');
            if(end) classes.push('DayPicker-Day--hasRange');
        }
        if(end && ts === end) {
            classes.push('DayPicker-Day--checkOut');
            if(start) classes.push('DayPicker-Day--hasRange');
        }
        if(start && end && ts > start && ts < end) classes.push('DayPicker-Day--inRange');
        
        html += `<div class="${classes.join(' ')}" data-timestamp="${ts}">${d}</div>`;
    }
    return html;
}

function attachDayListeners() {
    document.querySelectorAll('.DayPicker-Day:not(.DayPicker-Day--disabled)').forEach(day => {
        // Click
        day.addEventListener('click', (e) => {
            e.stopPropagation();
            const ts = parseInt(day.dataset.timestamp);
            if(!ts) return;

            if(!calendarState.tempCheckIn || (calendarState.tempCheckIn && calendarState.tempCheckOut)) {
                calendarState.tempCheckIn = ts; calendarState.tempCheckOut = null;
                hoverDate = null; // reset hover
            } else {
                if(ts < calendarState.tempCheckIn) calendarState.tempCheckIn = ts;
                else if(ts > calendarState.tempCheckIn) calendarState.tempCheckOut = ts;
            }
            updateDateDisplay('checkIn', new Date(calendarState.tempCheckIn));
            if(calendarState.tempCheckOut) updateDateDisplay('checkOut', new Date(calendarState.tempCheckOut));
            
            renderCalendar();
        });

        // Hover
        day.addEventListener('mouseenter', () => {
             const ts = parseInt(day.dataset.timestamp);
             if(ts) handleDateHover(ts);
        });
    });
}

function handleDateHover(timestamp) {
    if (calendarState.tempCheckIn && !calendarState.tempCheckOut) {
        hoverDate = timestamp;
        updateHoverStyles();
    }
}

function updateHoverStyles() {
    const days = document.querySelectorAll('.DayPicker-Day:not(.DayPicker-Day--disabled)');
    const start = calendarState.tempCheckIn;
    const currentHover = hoverDate;

    days.forEach(dayEl => {
        const dayTs = parseInt(dayEl.dataset.timestamp);
        if(!dayTs) return;

        // Reset dynamic classes
        dayEl.classList.remove('DayPicker-Day--inRange', 'DayPicker-Day--hasRange');
        
        // Re-apply static logic first (if we weren't re-rendering, but here we are manipulating DOM directly)
        // simpler approach: recalculate status
        
        const s = start;
        const e = calendarState.tempCheckOut || (currentHover && dayTs <= currentHover && dayTs > s ? currentHover : null);
        
        // CheckIn styling
        if(s && dayTs === s) {
             if(e) dayEl.classList.add('DayPicker-Day--hasRange'); // Connect start to range
        }
        
        // Range styling
        if(s && e && dayTs > s && dayTs < e) {
            dayEl.classList.add('DayPicker-Day--inRange');
        }
        
        // CheckOut styling (if it's the hover date)
        if(currentHover && dayTs === currentHover && dayTs > s) {
             // It's the end of the hover range, but it's not "selected" yet so it doesn't get --checkOut class
             // But it should look like one? Agoda usually highlights it.
             // For now, just filling the range is enough as per previous code.
             // If we want the hover target to look like checkout:
             dayEl.classList.add('DayPicker-Day--inRange'); // Just treat as part of range for visual continuity or end
             // Or add specific hover-end class if needed.
        }
    });
}

function updateDateDisplay(type, dateObj) {
    const displayId = type === 'checkIn' ? 'checkInDisplay' : 'checkOutDisplay';
    const dayId = type === 'checkIn' ? 'checkInDay' : 'checkOutDay';
    const elDisplay = document.getElementById(displayId);
    const elDay = document.getElementById(dayId);
    if(!elDisplay) return;

    if(!dateObj) {
        elDisplay.textContent = '날짜 선택';
        elDay.textContent = '-'; // or whatever default
        return;
    }
    
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth()+1).padStart(2,'0');
    const d = String(dateObj.getDate()).padStart(2,'0');
    const dayNames = ['일','월','화','수','목','금','토'];
    
    elDisplay.textContent = `${y}-${m}-${d}`;
    elDay.textContent = dayNames[dateObj.getDay()];
}

/* ========== Guest Selector ========== */
function initGuestSelector() {
    const guestField = document.getElementById('guestFieldLarge');
    const guestPopup = document.getElementById('guestPopupLarge');
    if(!guestField || !guestPopup) return;

    guestField.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups('guestPopupLarge');
        guestPopup.classList.toggle('active');
    });

    document.querySelectorAll('.counter-btn-new').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.dataset.target; // rooms, adults, children
            const span = document.getElementById(`${target}CountLarge`);
            let val = parseInt(span.textContent);
            
            if(btn.classList.contains('plus')) val++;
            else if(val > 0) val--; // simple logic
            
            // Min values constraint could be added here
            if(target === 'rooms' && val < 1) val = 1;
            if(target === 'adults' && val < 1) val = 1;

            span.textContent = val;
            updateGuestSummary();
        });
    });
}

function updateGuestSummary() {
    const rooms = document.getElementById('roomsCountLarge').textContent;
    const adults = document.getElementById('adultsCountLarge').textContent;
    const children = document.getElementById('childrenCountLarge').textContent;
    
    document.getElementById('guestSummary').textContent = `성인 ${adults}명, 아동 ${children}명`;
    document.getElementById('roomSummary').textContent = `객실 ${rooms}개`;
}

function closeAllPopups(exceptId) {
    const popups = ['destinationDropdown', 'calendarPopup', 'guestPopupLarge'];
    popups.forEach(id => {
        if(id !== exceptId) {
            const el = document.getElementById(id);
            if(el) el.classList.remove('active');
        }
    });
}

document.addEventListener('click', () => closeAllPopups());

// 3. 호텔 리스트 렌더링 함수
function renderHotels(data) {
    const container = document.getElementById('hotelListContainer');
    const resultCount = document.querySelector('.result-count strong');
    
    if(container) {
        container.innerHTML = ''; // 초기화
        
        if(resultCount) {
             resultCount.textContent = `${data.length}개`;
        }

        data.forEach(hotel => {
            // 숫자 콤마 포맷팅
            const finalPrice = hotel.priceFinal.toLocaleString();
            const originalPrice = hotel.priceOriginal.toLocaleString();
            
            // 할인율 계산
            const discountRate = Math.round(((hotel.priceOriginal - hotel.priceFinal) / hotel.priceOriginal) * 100);

            // 혜택 태그 생성 logic (Mock based)
            // Assuming freeCancel and breakfast properties might exist or we infer them for demo
            // Since data is mock, let's randomize or check badges
            const freeCancel = hotel.badges.includes("무료 취소") || hotel.badges.includes("나중에 결제") || Math.random() > 0.5;
            const breakfast = hotel.badges.includes("조식 포함") || hotel.badges.includes("조식 맛집") || Math.random() > 0.7;

            const html = `
                <div class="hotel-card">
                    <div class="card-img-wrap">
                        <img src="${hotel.image}" alt="${hotel.name}" class="card-img">
                        <i class="fa-solid fa-heart card-heart" onclick="toggleHeart(this)"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-info">
                            <div class="hotel-name">${hotel.name}</div>
                            <div class="hotel-stars">
                                ${'<i class="fa-solid fa-star"></i>'.repeat(hotel.stars)}
                            </div>
                            <div class="hotel-loc">
                                <i class="fa-solid fa-map-marker-alt"></i> ${hotel.location}
                            </div>
                            <div class="rating-box">
                                <span class="score">${hotel.score}</span>
                                <span class="review-text">우수함 (${hotel.reviews.toLocaleString()} 이용후기)</span>
                            </div>
                            
                            <!-- 혜택 태그 영역 (New) -->
                            <div class="benefit-row">
                                ${freeCancel ? `<span class="benefit-tag"><i class="fa-solid fa-check"></i> 무료 취소</span>` : ''}
                                ${breakfast ? `<span class="benefit-tag"><i class="fa-solid fa-utensils"></i> 조식 포함</span>` : ''}
                            </div>

                            <div class="hotel-badges">
                                ${hotel.badges.map(badge => `<span class="badge-text">#${badge}</span>`).join('')}
                            </div>
                        </div>

                        <!-- 가격 영역 (Updated) -->
                        <div class="card-price">
                            ${discountRate > 0 ? `<span class="discount-badge">${discountRate}% SAVE</span>` : ''}
                            
                            <div class="price-group" style="text-align: right;">
                                ${discountRate > 0 ? `<div class="price-original">₩${originalPrice}</div>` : ''}
                                <div class="price-final">₩${finalPrice}</div>
                            </div>
                            
                            <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 4px;">세금 및 봉사료 포함</div>
                            
                            <button class="btn-reserve" onclick="alert('${hotel.name} 예약 페이지로 이동합니다.')">예약하기</button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }
}

// 4. 이벤트 리스너 설정
function setupEventListeners() {
    // 가격 슬라이더 (Desktop)
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if(priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            const value = Number(e.target.value).toLocaleString();
            priceValue.textContent = `${value}원 이하`;
            // Simple client-side filtering example
            const filtered = hotelData.filter(h => h.priceFinal <= e.target.value);
            renderHotels(filtered);
        });
    }

    // Mobile Filter FAB & Modal
    const fab = document.querySelector('.mobile-filter-fab');
    const modal = document.getElementById('mobileFilterModal');
    const closeModal = document.querySelector('.close-modal');
    const applyBtn = document.querySelector('.btn-apply-filter');

    if(fab && modal) {
        fab.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock Body Scroll
        });

        const closeFunc = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if(closeModal) closeModal.addEventListener('click', closeFunc);
        if(applyBtn) applyBtn.addEventListener('click', closeFunc);
    }
    
    // Sort Buttons
    const sortButtons = document.querySelectorAll('.sort-options button');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sortButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mock Sorting
            let sortedData = [...hotelData];
            if(this.innerText.includes("최저가")) {
                sortedData.sort((a,b) => a.priceFinal - b.priceFinal);
            } else if(this.innerText.includes("평점")) {
                sortedData.sort((a,b) => b.score - a.score);
            }
            renderHotels(sortedData);
        });
    });
}

// 5. 찜하기(하트) 토글 - Global scope for onclick attribute
window.toggleHeart = function(element) {
    element.classList.toggle('active');
    // Animation effect could be added here
}
