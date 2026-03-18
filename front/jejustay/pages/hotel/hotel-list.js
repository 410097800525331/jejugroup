/**
 * HOTEL-LIST.JS
 * Description: Interactive logic for the hotel list page
 * Author: Ray (Cynical Genius Developer)
 * Code Style: Zero Monolith - Atomic & Modular
 */

document.addEventListener('DOMContentLoaded', () => {
    // Lucide 아이콘 초기화
    if (window.lucide) {
        window.lucide.createIcons();
    }

    initStickySearch();
    initInitialData(); // Load initial batch to match sidebar height
    initInfiniteScroll();
    initFilters();
});

/**
 * 초기 데이터 로딩 (사이드바 길이 매칭용)
 * 페이지 로드 시 즉시 실행되어 리스트를 채움
 */
function initInitialData() {
    const hotelList = document.getElementById('hotelList');
    if (!hotelList) return;

    // 10개의 추가 더미 데이터 생성
    const initialHotels = [
        {
            name: '리리가 로얄 호텔',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
            badge: '베스트셀러',
            rating: 9.1,
            reviewText: 'Exceptional',
            location: '히로시마 평화공원 도보 3분',
            price: '₩150,000',
            oldPrice: '₩210,000',
            tags: ['대욕장', '조식 맛집']
        },
        {
            name: 'ANA 크라운 플라자',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
            badge: '특가',
            rating: 8.5,
            reviewText: 'Excellent',
            location: '나카 워드 중심가',
            price: '₩120,000',
            oldPrice: '₩180,000',
            tags: ['피트니스', '비즈니스']
        },
        {
            name: '칸데오 호텔 히로시마',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
            badge: '스파 포함',
            rating: 8.9,
            reviewText: 'Excellent',
            location: '핫초보리 역 인근',
            price: '₩175,000',
            oldPrice: '₩250,000',
            tags: ['루프탑 스파', '사우나']
        },
        {
            name: 'The Knot Hiroshima',
            image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80',
            badge: '디자인 호텔',
            rating: 9.3,
            reviewText: 'Exceptional',
            location: '평화대로 위치',
            price: '₩140,000',
            oldPrice: '₩190,000',
            tags: ['루프탑 바', '모던 인테리어']
        },
        {
            name: '워싱턴 호텔',
            image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80',
            badge: '가성비 갑',
            rating: 8.2,
            reviewText: 'Very Good',
            location: '히로시마 역세권',
            price: '₩95,000',
            oldPrice: '₩130,000',
            tags: ['깔끔함', '교통 편리']
        },
        {
            name: '쉐라톤 그랜드 히로시마',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
            badge: '럭셔리',
            rating: 9.6,
            reviewText: 'Exceptional',
            location: '히로시마역 직결',
            price: '₩280,000',
            oldPrice: '₩350,000',
            tags: ['수영장', '클럽 라운지']
        },
        {
            name: '호텔 그란비아',
            image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80',
            badge: '스테디셀러',
            rating: 8.7,
            reviewText: 'Excellent',
            location: '신칸센 구치 도보 1분',
            price: '₩160,000',
            oldPrice: '₩220,000',
            tags: ['넓은 객실', '뷰 맛집']
        },
        {
            name: 'KIRO 히로시마',
            image: 'https://images.unsplash.com/photo-1590490360182-c87295ec4232?w=600&q=80',
            badge: '부티크',
            rating: 9.4,
            reviewText: 'Exceptional',
            location: '미카와초',
            price: '₩110,000',
            oldPrice: '₩150,000',
            tags: ['재생 건축', '힙플레이스']
        },
        {
            name: '인터게이트 히로시마',
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
            badge: '라운지 무료',
            rating: 9.0,
            reviewText: 'Exceptional',
            location: '시내 중심',
            price: '₩130,000',
            oldPrice: '₩170,000',
            tags: ['해피아워', '대욕장']
        },
        {
            name: '도미인 히로시마',
            image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80',
            badge: '온천 보유',
            rating: 8.8,
            reviewText: 'Excellent',
            location: '나카마치',
            price: '₩105,000',
            oldPrice: '₩140,000',
            tags: ['야식 라멘', '천연 온천']
        }
    ];

    initialHotels.forEach(hotel => {
        const card = createHotelCard(hotel);
        hotelList.appendChild(card);
    });

    // 아이콘 리로드
    if (window.lucide) window.lucide.createIcons();
}

/**
 * 스티키 검색바 로직
 * 스크롤 시 검색바 상단 고정 및 축소 애니메이션 제어
 */
function initStickySearch() {
    const stickySearch = document.getElementById('stickySearch');
    if (!stickySearch) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            stickySearch.classList.add('scrolled');
        } else {
            stickySearch.classList.remove('scrolled');
        }
    });
}

/**
 * 인피니트 스크롤 + 더보기 버튼 로직 (Hybrid)
 * 사이드바 길이보다 리스트가 짧을 때는 자동 로드
 * 리스트가 길어지면 "더보기" 버튼 노출
 */
function initInfiniteScroll() {
    const hotelList = document.getElementById('hotelList');
    const sidebar = document.querySelector('.filter-sidebar');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!hotelList || !sidebar || !loadMoreContainer || !loadMoreBtn) return;

    let isLoading = false;
    let isAutoLoadActive = true;

    // 초기 상태 체크 (이미 리스트가 길면 버튼 모드로 시작)
    checkScrollMode();

    // 1. 스크롤 이벤트 (자동 로드)
    window.addEventListener('scroll', () => {
        if (!isAutoLoadActive || isLoading) return;

        // 바닥 근처 도달 시 로드 (여유분 300px)
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
            loadMoreHotels();
        }
    });

    // 2. 더보기 버튼 클릭 (수동 로드)
    loadMoreBtn.addEventListener('click', () => {
        if (isLoading) return;
        loadMoreHotels();
    });

    function checkScrollMode() {
        // 리스트 높이가 사이드바 높이보다 커지면 자동 로드 중단하고 버튼 노출
        // (여유분 100px 정도 둠)
        if (hotelList.offsetHeight > sidebar.offsetHeight + 100) {
            isAutoLoadActive = false;
            loadMoreContainer.style.display = 'block';
        } else {
            isAutoLoadActive = true;
            loadMoreContainer.style.display = 'none';
        }
    }

    function loadMoreHotels() {
        isLoading = true;
        
        // 버튼 로딩 상태 표시
        const originalBtnText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
        loadMoreBtn.disabled = true;

        // 로딩 시뮬레이션 (0.5초)
        setTimeout(() => {
            const mockHotels = generateMockHotels(); // Mock Data 생성 분리

            mockHotels.forEach(hotel => {
                const card = createHotelCard(hotel);
                hotelList.appendChild(card);
            });

            if (window.lucide) window.lucide.createIcons();
            
            // 로드 후 높이 체크하여 모드 전환 판단
            checkScrollMode();
            
            isLoading = false;
            loadMoreBtn.innerHTML = originalBtnText;
            loadMoreBtn.disabled = false;
        }, 500);
    }
}

function generateMockHotels() {
    return [
        {
            name: '그랜드 하얏트 히로시마',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
            badge: '베스트셀러',
            rating: 9.5,
            reviewText: 'Exceptional',
            location: '히로시마역 도보 5분',
            price: '₩210,000',
            oldPrice: '₩280,000',
            tags: ['스파', '수영장']
        },
        {
            name: '세토우치 리트리트',
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
            badge: '친환경',
            rating: 8.9,
            reviewText: 'Great',
            location: '세토 내해 전망대',
            price: '₩340,000',
            oldPrice: '₩410,000',
            tags: ['오션뷰', '프라이빗']
        },
        {
            name: '호텔 비스타 히로시마',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
            badge: '추천',
            rating: 8.4,
            reviewText: 'Very Good',
            location: '나카마치 도보 3분',
            price: '₩85,000',
            oldPrice: '₩120,000',
            tags: ['가성비', '깔끔함']
        }
    ];
}

/**
 * 호텔 카드 DOM 생성 (JS Templating)
 */
function createHotelCard(hotel) {
    const article = document.createElement('article');
    article.className = 'hotel-card-premium';
    
    // tags 배열 처리 안전하게
    const tagsHtml = (hotel.tags || ['무료 Wi-Fi', '금연 객실']).map(tag => `<span class="tag-item">${tag}</span>`).join('');

    article.innerHTML = `
        <div class="hotel-card-image">
            <img src="${hotel.image}" alt="${hotel.name}">
            <span class="badge-overlay">${hotel.badge}</span>
            <button class="wishlist-btn-premium"><i data-lucide="heart"></i></button>
        </div>
        <div class="hotel-card-content">
            <div class="hotel-card-header">
                <div class="hotel-title-group">
                    <h3>${hotel.name}</h3>
                    <div class="hotel-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                <div class="review-badge">
                    <span class="score">${hotel.rating}</span>
                    <span>${hotel.reviewText}</span>
                </div>
            </div>
            <div class="hotel-location-text">
                <i data-lucide="map-pin" style="width: 14px; display: inline; vertical-align: middle;"></i>
                ${hotel.location}
            </div>
            <div class="hotel-tags">
                ${tagsHtml}
            </div>
            <div class="hotel-price-zone">
                <div class="price-original">${hotel.oldPrice}</div>
                <div class="price-current">${hotel.price}</div>
                <div class="price-unit">1박당 / 세금 포함</div>
            </div>
        </div>
    `;
    
    return article;
}

/**
 * 필터 사이드바 인터랙션
 * 체크박스 클릭 시 리스트 갱신 (시뮬레이션)
 */
function initFilters() {
    const filters = document.querySelectorAll('.filter-checkbox input');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            console.log('필터 변경됨 - 리스트 리로드 시뮬레이션');
            // 실제 서비스에서는 여기서 API 호출 또는 리스트 필터링 수행
            const hotelList = document.getElementById('hotelList');
            hotelList.style.opacity = '0.5';
            setTimeout(() => {
                hotelList.style.opacity = '1';
            }, 300);
        });
    });
}
