/*
 * JEJU STAY - 라이프 (장기 체류) 인터랙티브 자바스크립트
 * hotel.js 기반, 장기 체류 로직을 위해 확장됨
 */

document.addEventListener('DOMContentLoaded', function() {
    // 아이콘 초기화
    if (window.lucide) {
        lucide.createIcons();
    }

    initWishlistButtons();
    initScrollAnimations();
    initSearchLogic();
    void initSharedPremiumAnimations();
    
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

async function initSharedPremiumAnimations() {
    try {
        const { initPremiumAnimations } = await import("../hotel/modules/interactions/premiumAnimations.js");
        initPremiumAnimations();
    } catch (error) {
        console.error("[LongStayPage] premium animation init failed", error);
    }
}

/* ========== 공통 기능 (hotel.js와 동일) ========== */
function initWishlistButtons() {
    window.JejuWishlistButton?.init({
        selector: '#hotelList .wishlist-btn',
        onToggle: ({ id, nextActive }) => {
            const hotelId = Number.parseInt(id, 10);
            const hotel = longStayHotels.find((item) => item.id === hotelId);

            if (!hotel || !window.FABState) {
                return nextActive;
            }

            const nights = 30;
            const standardTotal = hotel.priceDaily * nights;
            const finalTotal = Math.round(standardTotal * (1 - hotel.discountRate));
            const item = {
                id: hotel.id,
                name: hotel.name,
                location: hotel.location,
                image: hotel.image,
                price: `₩${finalTotal.toLocaleString()}`
            };

            window.FABState.addToWishlist(item);
            return window.FABState.isInWishlist(hotel.id);
        },
        isActive: ({ id }) => {
            const hotelId = Number.parseInt(id, 10);
            return window.FABState ? window.FABState.isInWishlist(hotelId) : false;
        }
    });
}

function handleHotelCardClick(event, hotelId) {
    const clickTarget = event?.target;
    if (clickTarget instanceof Element && clickTarget.closest('.wishlist-btn')) {
        return;
    }

    updateInfraUI(hotelId);
}

function renderWishlistButtonMarkup({ hotelId, hotelName, isActive }) {
    if (window.JejuWishlistButton) {
        return window.JejuWishlistButton.renderMarkup({
            active: isActive,
            ariaLabel: `${hotelName} 찜하기`,
            attributes: {
                'data-id': hotelId
            }
        });
    }

    return `<button class="wishlist-btn${isActive ? ' active' : ''}" type="button" aria-label="${hotelName} 찜하기" data-id="${hotelId}"></button>`;
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
    document.addEventListener('fabLanguageChanged', () => {
        renderLongStayHotels();
    });
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
            <article class="hotel-card-horizontal" data-amenity="${hotel.amenities.join(',')}" onclick="handleHotelCardClick(event, ${hotel.id})">
                <div class="card-image-wrap">
                    <img src="${hotel.image}" alt="${name}">
                    ${renderWishlistButtonMarkup({
                        hotelId: hotel.id,
                        hotelName: name,
                        isActive: isInWishlist
                    })}
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
    window.JejuWishlistButton?.sync({
        selector: '#hotelList .wishlist-btn',
        isActive: ({ id }) => {
            const hotelId = Number.parseInt(id, 10);
            return wishlist.some((item) => item.id === hotelId);
        }
    });
});

// v2.0 Search Logic
const LONG_STAY_SEARCH_SUBMIT_EVENT = 'jeju:life-search-submit';

const REQUIRED_OPTION_AMENITY_MAP = {
    'kitchen': ['kitchen'],
    'washer': ['washer'],
    'full-kitchen': ['kitchen'],
    'washer-dryer': ['washer'],
    'desk': ['desk'],
    'parking': ['parking']
};

function filterLongStayHotels(filters = {}) {
    const destination = (filters.destination || '').trim();
    const requiredOptions = Array.isArray(filters.requiredOptions) ? filters.requiredOptions : [];

    return longStayHotels.filter((hotel) => {
        const matchesDestination = !destination || hotel.name.includes(destination) || hotel.location.includes(destination);

        if (!matchesDestination) {
            return false;
        }

        if (requiredOptions.length === 0) {
            return true;
        }

        return requiredOptions.every((requiredOption) => {
            const amenityKeys = REQUIRED_OPTION_AMENITY_MAP[requiredOption] || [requiredOption];
            return amenityKeys.some((amenityKey) => hotel.amenities.includes(amenityKey));
        });
    });
}

function initSearchLogic() {
    document.addEventListener(LONG_STAY_SEARCH_SUBMIT_EVENT, (event) => {
        const filters = event.detail || {};
        const filteredHotels = filterLongStayHotels(filters);
        renderLongStayHotels(filteredHotels);

        if (filteredHotels.length > 0) {
            updateInfraUI(filteredHotels[0].id);
        }
    });
}

// Ensure it runs after DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Run Init Logic
    renderLongStayHotels();
    
    // Initial Infra Load (Data for first hotel)
    if(longStayHotels.length > 0) updateInfraUI(longStayHotels[0].id);
});
