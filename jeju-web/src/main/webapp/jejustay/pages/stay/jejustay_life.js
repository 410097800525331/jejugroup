/*
 * JEJU STAY - 라이프 (장기 체류) 인터랙티브 자바스크립트
 * hotel.js 기반, 장기 체류 로직을 위해 확장됨
 */

// 전역 변수
let calendarState = {
    checkIn: null,  // 확정된 체크인 (Timestamp)
    checkOut: null, // 확정된 체크아웃 (Timestamp)
    tempCheckIn: null,  // 팝업 내 임시 체크인
    tempCheckOut: null  // 팝업 내 임시 체크아웃
};
let calendarController = null;

// 상수
const MIN_STAY_DAYS = 14;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function() {
    // 아이콘 초기화
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
    initGuestSelector(); // [New] Guest Selector
    initOptionsPopup(); // [New] Options Selector
    initMobileSearch();
    
    // 팝업 외부 클릭 시 모든 팝업을 닫는 글로벌 클릭 리스너
    // (트리거/팝업의 stopPropagation에 의존함)
    document.addEventListener('click', () => {
        closeAllPopups();
    });
    
    // GSAP 애니메이션
    initStandardsAnimation();
});

/* ========== GSAP Animations ========== */
/* ========== GSAP Animations ========== */
function initStandardsAnimation() {
    // GSAP 사용 가능 여부 확인
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 기준 섹션 카드 스태거(Stagger) 효과
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
                start: 'top 85%', // 뷰포트 히트
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            clearProps: "all" // 애니메이션 후 CSS 호버가 작동하도록 보장
        });
    } else {
        console.warn('GSAP를 찾을 수 없습니다. IntersectionObserver로 대체합니다.');
        // GSAP가 없는 환경을 위한 대체 로직
        const cards = document.querySelectorAll('.standard-card-wrapper');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 부분적인 타임아웃 또는 CSS 트랜지션 지연을 사용한 간단한 스태거 시뮬레이션
                    setTimeout(() => {
                         entry.target.style.opacity = '1';
                         entry.target.style.transform = 'translateY(0)';
                         entry.target.style.transition = 'all 0.8s ease-out';
                    }, index * 200); // 0.2초 스태거
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(c => {
              // 대체 로직을 위한 초기 상태 설정
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
                // 표시용 가격 계산
                const NIGHTS = 30;
                const standardTotal = hotel.priceDaily * NIGHTS;
                const finalTotal = Math.round(standardTotal * (1 - hotel.discountRate));
                const priceStr = `₩${finalTotal.toLocaleString()}`; 
                
                // 아이템 객체 구성
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
    
    // 글로벌 언어 변경 리스너
    document.addEventListener('fabLanguageChanged', (e) => {
        // 1. 캘린더 다시 렌더링 (월 이름 등)
        renderCalendar();
        
        // 2. 호텔 리스트 다시 렌더링 (현지화된 데이터)
        renderLongStayHotels();
        
        // 3. 편의시설 필터 요약 업데이트 재실행하여 텍스트 갱신
        const amenityField = document.getElementById('amenityField');
        if (amenityField && typeof amenityField.updateSummary === 'function') {
            amenityField.updateSummary();
        }
        
        // 4. 선택된 경우 요약 날짜 업데이트
        updateDateDisplay('checkIn', calendarState.tempCheckIn ? new Date(calendarState.tempCheckIn) : calendarState.checkIn ? new Date(calendarState.checkIn) : null);
        updateDateDisplay('checkOut', calendarState.tempCheckOut ? new Date(calendarState.tempCheckOut) : calendarState.checkOut ? new Date(calendarState.checkOut) : null);

        // 5. 경고 메시지가 있는 경우 업데이트
        if (document.getElementById('stayWarning').style.display === 'block') {
             // 유효성 검사 로직을 다시 실행하거나 오래된 텍스트를 피하기 위해 숨김 처리?
             updateWarning(document.getElementById('stayWarning').textContent); // 로직이 허용되면 업데이트 트리거, 아니면 리셋
        }
        
        // 6. 패키지 요금이 적용된 경우 검색 버튼 텍스트 업데이트
        checkPackageRate();
    });
}

function initDestinationDropdown() {
    const destField = document.getElementById('destinationFieldLarge');
    const destInput = document.getElementById('destinationInput');
    const destDropdown = document.getElementById('destinationDropdown');
    
    if (destField && destDropdown) {
        // 드롭다운 토글
        destField.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = destDropdown.classList.contains('active');
            closeAllPopups('destinationDropdown'); // 다른 팝업 닫기
            
            if (!isActive) {
                destDropdown.classList.add('active');
                destField.classList.add('active');
            }
        });

        // 아이템 클릭 핸들링
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

// 모든 팝업을 닫는 헬퍼 함수
function closeAllPopups(exceptId = null) {
    const popups = {
        'destinationDropdown': document.getElementById('destinationDropdown'),
        'calendarPopup': document.getElementById('calendarPopup'),
        'guestPopupLarge': document.getElementById('guestPopupLarge'),
        'optionsPopupLarge': document.getElementById('optionsPopupLarge')
    };
    
    for (const [id, el] of Object.entries(popups)) {
        if (id !== exceptId && el) {
            el.classList.remove('active');
            
            // 필요한 경우 부모 필드에서 활성 상태 제거
             if (id === 'guestPopupLarge') document.getElementById('guestFieldLarge')?.classList.remove('active');
             if (id === 'calendarPopup') document.getElementById('checkInField')?.classList.remove('active');
             if (id === 'destinationDropdown') document.getElementById('destinationFieldLarge')?.classList.remove('active');
             if (id === 'optionsPopupLarge') document.getElementById('optionsFieldLarge')?.classList.remove('active');
        }
    }
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
            guestField.classList.add('active');
        } else {
            guestPopup.classList.remove('active');
            guestField.classList.remove('active');
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
    
    // 1. 게스트 요약 (성인 + 아동, 객실) -> Hotel 페이지 포맷과 일관성 유지
    const guestSummaryEl = document.getElementById('guestSummary');
    if (guestSummaryEl) {
        let guestText = `성인 ${adults}명`;
        if (children > 0) guestText += `, 아동 ${children}명`;
        guestText += `, 객실 ${rooms}개`;
        guestSummaryEl.textContent = guestText;
    }
}


/* ========== [New] Options Selector ========== */
function initOptionsPopup() {
    const optionsField = document.getElementById('optionsFieldLarge');
    const optionsPopup = document.getElementById('optionsPopupLarge');
    const optionsSummary = document.getElementById('optionsSummary');

    if (optionsField && optionsPopup) {
        optionsField.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = optionsPopup.classList.contains('active');
            closeAllPopups('optionsPopupLarge');
            
            if (!isActive) {
                optionsPopup.classList.add('active');
                optionsField.classList.add('active');
            } else {
                optionsPopup.classList.remove('active');
                optionsField.classList.remove('active');
            }
        });

        optionsPopup.addEventListener('click', (e) => e.stopPropagation());

        // 체크박스 로직
        const checkboxes = optionsPopup.querySelectorAll('.option-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updateOptionsSummary();
            });
        });

        function updateOptionsSummary() {
            const checked = Array.from(optionsPopup.querySelectorAll('.option-checkbox:checked')).map(cb => cb.value);
            if (checked.length === 0) {
                optionsSummary.textContent = "선택사항 없음";
                optionsSummary.style.color = "#777"; // Increased contrast from #999
            } else {
                if(checked.length > 2) {
                     optionsSummary.textContent = `${checked[0]}, ${checked[1]} 외 ${checked.length - 2}`;
                } else {
                     optionsSummary.textContent = checked.join(', ');
                }
                optionsSummary.style.color = "#222"; // Use solid dark color for active state
            }
        }
    }
}


/* ========== Mobile Search Interaction ========== */
function initMobileSearch() {
    const summaryView = document.getElementById('mobileSearchSummary');
    const searchWidget = document.querySelector('.search-widget-v2');
    
    if (summaryView && searchWidget) {
        summaryView.addEventListener('click', () => {
            searchWidget.classList.toggle('expanded');
        });
    }
}



/* ========== 장기 체류 캘린더 로직 (장기 체류 유효성 검사가 포함된 hotel.js에서 이식됨) ========== */
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
        cancelOnToggleClose: true,
        toggleFieldActiveClass: true,
        closeAllPopups: (exceptId) => closeAllPopups(exceptId),
        onTempChange: () => updateResults(),
        onCancel: () => {
            updateDateDisplay('checkIn', calendarState.checkIn ? new Date(calendarState.checkIn) : null);
            updateDateDisplay('checkOut', calendarState.checkOut ? new Date(calendarState.checkOut) : null);
        },
        onClear: () => updateWarning(null),
        onBeforeConfirm: (state) => {
            // 유효성 검사: 선택 안 함 상태에서 확인 누르면 초기화 허용
            if (!state.tempCheckIn && !state.tempCheckOut) {
                return true;
            }

            // 유효성 검사: 하나만 선택된 경우
            if (!state.tempCheckIn || !state.tempCheckOut) {
                alert('체크인과 체크아웃 날짜를 모두 선택해주세요.');
                return false;
            }

            // 유효성 검사: 최소 체류 기간 확인
            const days = (state.tempCheckOut - state.tempCheckIn) / ONE_DAY_MS;
            if (days < MIN_STAY_DAYS) {
                alert(`장기 체류 서비스는 최소 ${MIN_STAY_DAYS}박부터 예약 가능합니다.`);
                return false;
            }

            return true;
        },
        onConfirm: () => {
            updateDateDisplay('checkIn', calendarState.checkIn ? new Date(calendarState.checkIn) : null);
            updateDateDisplay('checkOut', calendarState.checkOut ? new Date(calendarState.checkOut) : null);
            checkPackageRate();
        }
    }).init();

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



/* ========== 상태 관리 (v2.0) ========== */
const AppState = {
    destination: localStorage.getItem('jeju_destination') || '',
    
    setDestination(dest) {
        this.destination = dest;
        localStorage.setItem('jeju_destination', dest);
    }
};

/* ========== 한 달 살기 데이터 및 렌더링 로직 (v2.0) ========== */

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
