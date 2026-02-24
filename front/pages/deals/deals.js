// Mock Data
// Mock Data
const COUPONS = [
    { type: '할인', amount: '30,000', unit: '원', title: '일본 여행 전용', desc: '도쿄/오사카/후쿠오카 호텔 할인', code: 'JAPANGO30' },
    { type: '할인', amount: '8', unit: '%', title: '전 세계 호텔 쿠폰', desc: '최대 10만원 할인 (등급 무관)', code: 'GLOBAL8' },
    { type: '할인', amount: '5,000', unit: '엔', title: '돈키호테 할인', desc: '일본 전 지점 사용 가능 (면세 중복)', code: 'DONKI5000' },
    { type: '무료', amount: 'FREE', unit: '', title: '해외 여행자 보험', desc: '제주항공 항공권 구매 고객 대상', code: 'SAFE_TRIP' }
];

const DEALS = [
    {
        id: 1,
        category: 'hotel',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
        badge: '마감 임박',
        title: '신주쿠 프린스 호텔 (Shinjuku Prince)',
        location: '도쿄, 신주쿠',
        rating: 4.5,
        reviews: 3420,
        oldPrice: 280000,
        newPrice: 159000
    },
    {
        id: 2,
        category: 'hotel',
        image: 'https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?w=500&q=80',
        badge: '특가',
        title: '호텔 한큐 레스파이어 오사카',
        location: '오사카, 우메다',
        rating: 4.8,
        reviews: 5100,
        oldPrice: 220000,
        newPrice: 135000
    },
    {
        id: 3,
        category: 'activity',
        image: 'https://images.unsplash.com/photo-1718965908210-a795ff8c9358?w=500&h=500&q=80&fit=crop&crop=focalpoint&fp-y=0.61',
        badge: '인기',
        title: '유니버설 스튜디오 재팬 입장권',
        location: '오사카',
        rating: 4.9,
        reviews: 28900,
        oldPrice: 95000,
        newPrice: 82000
    },
    {
        id: 4,
        category: 'rentacar',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&q=80',
        badge: '공항 픽업',
        title: '후쿠오카 공항 렌터카 (도요타 야리스)',
        location: '후쿠오카, 하카타',
        rating: 4.7,
        reviews: 830,
        oldPrice: 85000,
        newPrice: 42000
    },
    {
        id: 5,
        category: 'hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
        badge: '럭셔리 딜',
        title: '더 스탠다드, 방콕 마하나콘',
        location: '방콕, 실롬',
        rating: 4.9,
        reviews: 1200,
        oldPrice: 450000,
        newPrice: 299000
    },
    {
        id: 6,
        category: 'pension',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
        badge: '료칸 체험',
        title: '유후인 료칸 무소엔 (개인노천탕)',
        location: '유후인',
        rating: 4.8,
        reviews: 940,
        oldPrice: 420000,
        newPrice: 350000
    },
    {
        id: 7,
        category: 'activity',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80',
        badge: '최저가 보장',
        title: '도쿄 시부야 스카이 전망대',
        location: '도쿄, 시부야',
        rating: 4.7,
        reviews: 15600,
        oldPrice: 25000,
        newPrice: 21000
    },
    {
        id: 8,
        category: 'hotel',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&q=80',
        badge: '얼리버드',
        title: '푸라마 리조트 다낭',
        location: '베트남, 다낭',
        rating: 4.6,
        reviews: 2100,
        oldPrice: 280000,
        newPrice: 179000
    },
    { id: 9, category: 'hotel', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80', badge: '강력 추천', title: '호텔 인디고 방콕 와이어리스 로드', location: '방콕', rating: 4.7, reviews: 1560, oldPrice: 220000, newPrice: 145000 },
    { id: 10, category: 'rentacar', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', badge: '소형차 특가', title: '오키나와 렌터카 (혼다 피트)', location: '오키나와', rating: 4.8, reviews: 920, oldPrice: 90000, newPrice: 55000 },
    { id: 12, category: 'pension', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80', badge: '풀빌라', title: '발리 스미냑 프라이빗 풀빌라', location: '인도네시아, 발리', rating: 4.9, reviews: 450, oldPrice: 450000, newPrice: 280000 },
    { id: 13, category: 'hotel', image: 'https://lh3.googleusercontent.com/p/AF1QipN3DmDaDnxNEbJ8e0btW2OXHskV76AWwZjj_rUf=w500-q80-k-no', badge: '시내 중심', title: 'JR 규슈 호텔 블라썸 하카타', location: '후쿠오카', rating: 4.7, reviews: 3100, oldPrice: 180000, newPrice: 110000 },
    { id: 14, category: 'hotel', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80', badge: '조식 포함', title: '소테츠 프레사 인 도쿄 롯폰기', location: '도쿄', rating: 4.4, reviews: 1850, oldPrice: 150000, newPrice: 89000 },
    { id: 15, category: 'activity', image: 'https://images.unsplash.com/photo-1545562083-c583d9941ac2?w=500&q=80', badge: '필수 코스', title: '파리 에펠탑 패스트트랙 입장권', location: '프랑스, 파리', rating: 4.8, reviews: 12400, oldPrice: 45000, newPrice: 38000 },
    { id: 16, category: 'rentacar', image: 'https://images.unsplash.com/photo-1550136513-548af4445338?w=500&q=80', badge: '전기차', title: '제주 아이오닉5 롱레인지', location: '제주도', rating: 4.9, reviews: 560, oldPrice: 120000, newPrice: 48000 },
    { id: 17, category: 'hotel', image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=500&q=80', badge: '특가', title: '호텔 리솔 트리니티 삿포로', location: '삿포로', rating: 4.7, reviews: 2200, oldPrice: 190000, newPrice: 125000 },
    { id: 18, category: 'pension', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500&q=80', badge: '감성 숙소', title: '교토 전통 마치야 스테이', location: '교토', rating: 4.9, reviews: 320, oldPrice: 350000, newPrice: 280000 },
    { id: 19, category: 'activity', image: 'https://images.unsplash.com/photo-1528659578137-b4528a402512?w=500&q=80', badge: '야경 명소', title: '홍콩 피크트램 스카이패스', location: '홍콩', rating: 4.6, reviews: 8900, oldPrice: 22000, newPrice: 15000 },
    { id: 20, category: 'hotel', image: 'https://images.unsplash.com/photo-1572148884483-794c9b6c6963?w=800&q=80&fit=crop&crop=focalpoint&fp-y=0.8', badge: '럭셔리', title: '마리나 베이 샌즈', location: '싱가포르', rating: 4.9, reviews: 45000, oldPrice: 890000, newPrice: 650000 }
];

document.addEventListener('DOMContentLoaded', () => {
    initCoupons();
    initDeals();
    initStickyNav();
    initTimer();
    initEventHandlers();
    initMobileMenu();
});

/* ========== Coupons ========== */
function initCoupons() {
    const grid = document.getElementById('couponGrid');
    if (!grid) return;

    grid.innerHTML = COUPONS.map(coupon => `
        <div class="coupon-card">
            <div class="coupon-left">
                <div class="amount">${coupon.amount}<span class="unit">${coupon.unit}</span></div>
                <div class="type">${coupon.type}</div>
            </div>
            <div class="coupon-right">
                <div class="coupon-title">${coupon.title}</div>
                <div class="coupon-desc">${coupon.desc}</div>
                <div class="coupon-action">
                    <span class="coupon-code">${coupon.code}</span>
                    <button class="btn-copy" onclick="copyToClipboard('${coupon.code}')">
                        <i data-lucide="copy"></i> 복사
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Refresh icons
    if(window.lucide) window.lucide.createIcons();
}

window.copyToClipboard = (text) => {
    if (!navigator.clipboard) {
        alert('이 브라우저에서는 클립보드 복사를 지원하지 않습니다: ' + text);
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        alert('쿠폰 코드가 복사되었습니다: ' + text);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

/* ========== Deals ========== */
let currentCategory = 'all';
let currentSort = 'recommend';
let displayedDealsCount = 8;
const itemsPerLoad = 8;

function initDeals() {
    renderDeals();
    
    // Check initial load button state
    updateLoadMoreButton();
}

function renderDeals(append = false) {
    const grid = document.getElementById('dealGrid');
    if (!grid) return;

    // Filter
    let filtered = DEALS.filter(deal => {
        if (currentCategory === 'all') return true;
        return deal.category === currentCategory;
    });

    // Sort
    if (currentSort === 'price_asc') {
        filtered.sort((a, b) => a.newPrice - b.newPrice);
    } else if (currentSort === 'discount_desc') {
        filtered.sort((a, b) => {
            const discountA = (a.oldPrice - a.newPrice) / a.oldPrice;
            const discountB = (b.oldPrice - b.newPrice) / b.oldPrice;
            return discountB - discountA;
        });
    }
    // 'recommend' does nothing (default order)

    // Slice for pagination
    const itemsToShow = filtered.slice(0, displayedDealsCount);

    // Render HTML
    const html = itemsToShow.map(deal => {
        const discountRate = Math.round(((deal.oldPrice - deal.newPrice) / deal.oldPrice) * 100);
        
        return `
        <div class="deal-card">
            <div class="deal-image-wrapper">
                <span class="deal-badge">${deal.badge}</span>
                <img src="${deal.image}" alt="${deal.title}" class="deal-image">
            </div>
            <div class="deal-content">
                <span class="deal-cat">${getCategoryName(deal.category)}</span>
                <h3 class="deal-title">${deal.title}</h3>
                <div class="deal-meta">
                    <span><i data-lucide="map-pin"></i> ${deal.location}</span>
                    <span><i data-lucide="star" style="fill: #facc15; color: #facc15;"></i> ${deal.rating} (${deal.reviews})</span>
                </div>
                <div class="deal-price-row">
                    <div class="price-left">
                        <span class="discount-rate">${discountRate}%</span>
                        <span class="original-price">${deal.oldPrice.toLocaleString()}원</span>
                    </div>
                    <span class="final-price">${deal.newPrice.toLocaleString()}<span>원~</span></span>
                </div>
                <a href="#" class="deal-btn">지금 예약하기</a>
            </div>
        </div>
    `}).join('');

    grid.innerHTML = html;

    if(window.lucide) window.lucide.createIcons();
    
    // Update Load More Button visibility
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (!loadMoreContainer) return;

    // Calculate total items after filter
    let filteredTotal = DEALS.filter(deal => {
        if (currentCategory === 'all') return true;
        return deal.category === currentCategory;
    }).length;

    if (displayedDealsCount >= filteredTotal) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'flex';
    }
}

function getCategoryName(cat) {
    const map = {
        'hotel': '호텔/리조트',
        'pension': '펜션/풀빌라',
        'rentacar': '렌터카',
        'activity': '액티비티'
    };
    return map[cat] || cat;
}

/* ========== Interactions ========== */
function initEventHandlers() {
    // Category Tabs
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class
            tab.classList.add('active');
            
            // Update filter
            currentCategory = tab.dataset.category;
            displayedDealsCount = itemsPerLoad; // Reset pagination logic
            renderDeals();
        });
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderDeals();
        });
    }

    // Load More Button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreDeals();
        });
    }
}

function loadMoreDeals() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;

    // Show Loading
    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate Network Request
    setTimeout(() => {
        displayedDealsCount += itemsPerLoad;
        renderDeals(true);
        
        // Hide Loading
        btn.classList.remove('loading');
        btn.disabled = false;
        
    }, 800); // 800ms delay
}

function initStickyNav() {
    /* Sticky behavior disabled by user request
    const nav = document.getElementById('stickyCatNav');
    const header = document.querySelector('header');
    
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > header.offsetHeight + 400) { // Approx after Hero
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    */
}

function initTimer() {
    const timerEl = document.getElementById('masterTimer');
    if (!timerEl) return;

    // Set end time to midnight of next day
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);

    function update() {
        const current = new Date();
        const diff = end - current;

        if (diff <= 0) {
            timerEl.textContent = "00:00:00"; // Should refresh or reset
            return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    setInterval(update, 1000);
    update();
}

function pad(n) {
    return n < 10 ? '0' + n : n;
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
