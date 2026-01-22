// 1. Mock Data (실제 백엔드 API 연동 전 사용할 가짜 데이터)
const hotelData = [
    {
        id: 1,
        name: "그랜드 조선 제주 (Grand Josun Jeju)",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        stars: 5,
        location: "서귀포시, 중문 관광단지",
        score: 9.2,
        reviews: 3420,
        badges: ["제주 그룹 단독 특가", "수영장 포함"],
        priceOriginal: 450000,
        priceFinal: 385000,
        isSoldOut: false
    },
    {
        id: 2,
        name: "신라 스테이 제주 (Shilla Stay Jeju)",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        stars: 4,
        location: "제주시, 연동 (공항 10분)",
        score: 8.5,
        reviews: 5102,
        badges: ["도심 위치", "무료 주차"],
        priceOriginal: 180000,
        priceFinal: 145200,
        isSoldOut: false
    },
    {
        id: 3,
        name: "제주 오션 뷰 펜션",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        stars: 3,
        location: "애월읍, 해안도로 인근",
        score: 9.0,
        reviews: 850,
        badges: ["오션뷰", "바비큐 가능"],
        priceOriginal: 120000,
        priceFinal: 98000,
        isSoldOut: false
    }
];

// 2. 검색어 파싱 (URL 파라미터 등)
const urlParams = new URLSearchParams(window.location.search);
const destination = urlParams.get('dest') || '제주도';
document.getElementById('destinationInput').value = destination + ", 전체";

// 3. 호텔 리스트 렌더링 함수
function renderHotels(data) {
    const container = document.getElementById('hotelListContainer');
    container.innerHTML = ''; // 초기화

    data.forEach(hotel => {
        // 숫자 콤마 포맷팅
        const finalPrice = hotel.priceFinal.toLocaleString();
        const originalPrice = hotel.priceOriginal.toLocaleString();
        
        // 할인율 계산
        const discountRate = Math.round(((hotel.priceOriginal - hotel.priceFinal) / hotel.priceOriginal) * 100);

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
                            <i class="fa-solid fa-map-marker-alt"></i> ${hotel.location} - 지도 보기
                        </div>
                        <div class="rating-box">
                            <span class="score">${hotel.score}</span>
                            <span class="review-text">우수함 (${hotel.reviews.toLocaleString()} 이용후기)</span>
                        </div>
                        <div class="hotel-badges">
                            ${hotel.badges.map(badge => `<span>${badge}</span>`).join('')}
                        </div>
                    </div>
                    <div class="card-price">
                        ${discountRate > 0 ? `<div class="discount-badge" style="background:#d32f2f; color:white; padding:2px 5px; font-size:11px; display:inline-block; margin-bottom:5px;">${discountRate}% 할인</div>` : ''}
                        <div class="price-original">₩${originalPrice}</div>
                        <div class="price-final">₩${finalPrice}</div>
                        <div class="tax-info">세금 및 수수료 포함</div>
                        <button class="btn-reserve" onclick="alert('${hotel.name} 예약 페이지로 이동합니다.')">예약하기</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// 4. 가격 슬라이더 이벤트
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

priceRange.addEventListener('input', (e) => {
    const value = Number(e.target.value).toLocaleString();
    priceValue.textContent = `${value}원 이하`;
    // 여기서 실제로는 filterHotels() 같은 함수를 호출하여 리스트를 다시 렌더링합니다.
});

// 5. 찜하기(하트) 토글
function toggleHeart(element) {
    element.classList.toggle('active');
    if(element.classList.contains('active')) {
        element.style.color = '#ff4757';
    } else {
        element.style.color = 'white';
    }
}

// 초기 실행
renderHotels(hotelData);