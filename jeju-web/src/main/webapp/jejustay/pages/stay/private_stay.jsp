<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JEJU STAY | 프라이빗 감성 숙소</title>
    <meta name="description" content="제주스테이 프라이빗. 오직 나만을 위한 프리미엄 감성 숙소, 풀빌라, 독채 펜션을 예약하세요.">

    <!-- Fonts: FlightSans is loaded via CSS @font-face, Noto Sans KR as fallback -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@300;400;600&display=swap"
        rel="stylesheet">

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../hotel/hotel.css">
    <link rel="stylesheet" href="./private_stay.css">
    <link rel="stylesheet" href="../../../components/react/layout/header.css">
    <link rel="stylesheet" href="../../../components/react/layout/footer.css">
    <link rel="stylesheet" href="../../../components/react/ui/FAB/fab.css">
    <link rel="stylesheet" href="../../../components/react/widget/chatbot-style.css">
</head>

<body class="private-stay-page">
    <!-- ========== Header Placeholder ========== -->
    <div id="hotel-header-placeholder"></div>

    <main>
        <!-- ========== 섹션 2: 히어로 & 검색 위젯 ========== -->
        <section class="hero">
            <div class="hero-background">
                <!-- 감성 숙소 이미지 (Pool Villa / Nature) -->
                <img src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2500&auto=format&fit=crop"
                    alt="Private Wellness Stay" class="hero-image">
                <div class="hero-overlay"></div>
            </div>

            <div class="hero-content">
                <p class="hero-subtitle-top" data-lang="heroSubtitlePrivate">온전히 나를 마주하는 시간, 프리미엄 프라이빗 스테이</p>

                <div id="hotel-search-widget-root"></div>
            </div>
        </section>

        <!-- ========== 섹션 3: 큐레이션 (Premium Benefits) ========== -->
        <section class="promo-section">
            <div class="container">
                <div class="promo-grid">
                    <div class="promo-card promo-main promo-main-private">
                        <div class="promo-icon promo-icon-private">
                            <i data-lucide="crown"></i>
                        </div>
                        <div class="promo-content">
                            <span class="promo-badge promo-badge-private">PREMIUM CHECK-IN</span>
                            <h3 class="promo-title">프라이빗 스테이 예약 시<br><strong class="private-highlight">얼리 체크인 & 웰컴
                                    키트</strong> 제공</h3>
                            <p class="promo-desc promo-desc-soft">제주 유니버스 회원을 위한 특별한 시작</p>
                            <a href="#" class="promo-link cta-link cta-bounce-target"><span>혜택 확인하기</span> <i
                                    data-lucide="arrow-right"></i></a>
                        </div>
                    </div>
                    <div class="promo-card promo-sub promo-sub-neutral">
                        <div class="promo-icon promo-icon-neutral">
                            <i data-lucide="camera"></i>
                        </div>
                        <div class="promo-content">
                            <span class="promo-badge promo-badge-neutral">SNAP PHOTO</span>
                            <h3 class="promo-title promo-title-dark">인생샷 포인트<br>스냅 촬영 할인</h3>
                            <a href="#" class="promo-link cta-link cta-bounce-target"><span>작가 보기</span> <i
                                    data-lucide="arrow-right"></i></a>
                        </div>
                    </div>
                    <div class="promo-card promo-sub promo-sub-neutral">
                        <div class="promo-icon promo-icon-neutral">
                            <i data-lucide="wine"></i>
                        </div>
                        <div class="promo-content">
                            <span class="promo-badge promo-badge-neutral">DINING</span>
                            <h3 class="promo-title promo-title-dark">인룸 다이닝<br>와인 & 플래터</h3>
                            <a href="#" class="promo-link cta-link cta-bounce-target"><span>메뉴 보기</span> <i
                                    data-lucide="arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== 섹션 4: 추천 여행지 (Private Spots) ========== -->
        <section class="destinations-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">감성이 머무는 곳</h2>
                    <p class="section-subtitle">일상의 소음이 사라진, 오직 당신만을 위한 숨겨진 스테이</p>
                </div>

                <div class="destinations-grid">
                    <a href="#" class="destination-card large">
                        <img src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80" alt="숲속 독채"
                            class="destination-image">
                        <div class="destination-overlay"></div>
                        <div class="destination-content">
                            <span class="destination-badge">인기</span>
                            <h3 class="destination-name">숲속의 요새</h3>
                            <p class="destination-hotels">프라이빗 캐빈 모음</p>
                        </div>
                    </a>
                    <a href="#" class="destination-card">
                        <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80"
                            alt="바다 앞 풀빌라" class="destination-image">
                        <div class="destination-overlay"></div>
                        <div class="destination-content">
                            <h3 class="destination-name">오션뷰 풀빌라</h3>
                            <p class="destination-hotels">인피니티 풀 완비</p>
                        </div>
                    </a>
                    <a href="#" class="destination-card">
                        <img src="../../images/hanok.png" alt="한옥 스테이"
                            class="destination-image">
                        <div class="destination-overlay"></div>
                        <div class="destination-content">
                            <h3 class="destination-name">모던 한옥</h3>
                            <p class="destination-hotels">전통과 현대의 조화</p>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <!-- ========== 섹션 5: 프리미엄 큐레이션 (Listings) ========== -->
        <section class="deals-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">이달의 큐레이션</h2>
                    <p class="section-subtitle">건축가의 철학이 담긴 공간을 소개합니다</p>
                </div>

                <div class="hotel-list">
                    <!-- 숙소 카드 1 -->
                    <article class="hotel-card">
                        <div class="hotel-image-wrap">
                            <img src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&q=80"
                                alt="제주 서귀포, 스테이 무드" class="hotel-image">
                            <span data-jeju-wishlist-button data-aria-label="위시리스트 추가"></span>
                        </div>
                        <div class="hotel-info">
                            <div class="hotel-header">
                                <span class="hotel-tag jj-pick">Premium</span>
                                <div class="hotel-rating">
                                    <span class="hotel-rating-note">독채</span>
                                </div>
                            </div>
                            <h3 class="hotel-name">제주 서귀포, 스테이 무드</h3>
                            <p class="hotel-location">
                                <i data-lucide="map-pin"></i> 제주 안덕면 · 산방산 뷰
                            </p>
                            <div class="hotel-amenities">
                                <span class="amenity"><i data-lucide="coffee"></i> <span>핸드드립</span></span>
                                <span class="amenity"><i data-lucide="music"></i> <span>LP 플레이어</span></span>
                                <span class="amenity"><i data-lucide="bath"></i> <span>자쿠지</span></span>
                            </div>
                            <div class="hotel-review">
                                <span class="review-score">9.8</span>
                                <span class="review-text">완벽함 · 128개 후기</span>
                            </div>
                        </div>
                        <div class="hotel-price">
                            <div class="price-info">
                                <span class="price-label">1박 요금</span>
                            </div>
                            <div class="price-original"><span>₩450,000</span></div>
                            <div class="price-final"><span>₩380,000</span></div>
                            <span class="price-tax">세금 포함</span>
                        </div>
                    </article>

                    <!-- 숙소 카드 2 -->
                    <article class="hotel-card">
                        <div class="hotel-image-wrap">
                            <img src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&q=80"
                                alt="가평, 포레스트 하우스" class="hotel-image">
                            <span data-jeju-wishlist-button data-aria-label="위시리스트 추가"></span>
                        </div>
                        <div class="hotel-info">
                            <div class="hotel-header">
                                <span class="hotel-tag jj-pick">Design Award</span>
                                <div class="hotel-rating">
                                    <span class="hotel-rating-note">풀빌라</span>
                                </div>
                            </div>
                            <h3 class="hotel-name">가평, 포레스트 하우스</h3>
                            <p class="hotel-location">
                                <i data-lucide="map-pin"></i> 경기 가평군 · 프라이빗 온수풀
                            </p>
                            <div class="hotel-amenities">
                                <span class="amenity"><i data-lucide="waves"></i> <span>개별 수영장</span></span>
                                <span class="amenity"><i data-lucide="flame"></i> <span>불멍 존</span></span>
                                <span class="amenity"><i data-lucide="bed-double"></i> <span>킹 사이즈</span></span>
                            </div>
                            <div class="hotel-review">
                                <span class="review-score">9.5</span>
                                <span class="review-text">훌륭함 · 84개 후기</span>
                            </div>
                        </div>
                        <div class="hotel-price">
                            <div class="price-info">
                                <span class="price-label">1박 요금</span>
                            </div>
                            <div class="price-original"><span>₩620,000</span></div>
                            <div class="price-final"><span>₩550,000</span></div>
                            <span class="price-tax">세금 포함</span>
                        </div>
                    </article>

                    <!-- 숙소 카드 3 -->
                    <article class="hotel-card">
                        <div class="hotel-image-wrap">
                            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80"
                                alt="교토, 마치야 스테이" class="hotel-image">
                            <span data-jeju-wishlist-button data-aria-label="위시리스트 추가"></span>
                        </div>
                        <div class="hotel-info">
                            <div class="hotel-header">
                                <span class="hotel-tag jj-pick">Historic</span>
                                <div class="hotel-rating">
                                    <span class="hotel-rating-note">전통 가옥</span>
                                </div>
                            </div>
                            <h3 class="hotel-name">교토, 히노키 마치야</h3>
                            <p class="hotel-location">
                                <i data-lucide="map-pin"></i> 일본 교토 · 기온 거리
                            </p>
                            <div class="hotel-amenities">
                                <span class="amenity"><i data-lucide="bath"></i> <span>히노키탕</span></span>
                                <span class="amenity"><i data-lucide="trees"></i> <span>중정 정원</span></span>
                                <span class="amenity"><i data-lucide="utensils"></i> <span>가이세키</span></span>
                            </div>
                            <div class="hotel-review">
                                <span class="review-score">9.9</span>
                                <span class="review-text">최고 · 210개 후기</span>
                            </div>
                        </div>
                        <div class="hotel-price">
                            <div class="price-info">
                                <span class="price-label">1박 요금</span>
                            </div>
                            <div class="price-original"><span>₩850,000</span></div>
                            <div class="price-final"><span>₩720,000</span></div>
                            <span class="price-tax">세금 포함</span>
                        </div>
                    </article>
                </div>

                <div class="more-hotels-container">
                    <a href="#" class="btn-more-hotels cta-pill cta-bounce-target">
                        <span>더 많은 감성 숙소 보기</span>
                        <i data-lucide="chevron-right"></i>
                    </a>
                </div>
            </div>
        </section>
    </main>

    <!-- ========== Footer Placeholder ========== -->
    <div id="hotel-footer-placeholder"></div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="../../../core/constants/lang_data.js"></script>
    <script src="../../shared/wishlist-button.js"></script>
    <script src="./private_stay.js"></script>
    <script type="module" src="../../../components/runtime/bootstrap.js"></script>
</body>

</html>
