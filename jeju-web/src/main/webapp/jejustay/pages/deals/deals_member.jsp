<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원 전용 혜택 | JEJU STAY</title>
    <meta name="description" content="JEJU STAY 회원만을 위한 특별한 혜택. 등급별 포인트 적립부터 회원 전용 특가까지 만나보세요.">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
        rel="stylesheet">

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../hotel/hotel.css">
    <link rel="stylesheet" href="./deals.css">
    <link rel="stylesheet" href="../../../components/react/layout/header.css">
    <link rel="stylesheet" href="../../../components/react/layout/footer.css">
    <link rel="stylesheet" href="../../../components/react/ui/FAB/fab.css">
    <link rel="stylesheet" href="../../../components/react/widget/chatbot-style.css">

    <style>
        /* Member Specific Styles */
        .member-hero {
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: #fff;
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .member-hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 120, 0, 0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        .tier-section {
            padding: 80px 0;
            background: #f9fafb;
        }

        .tier-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }

        .tier-card {
            background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 30%, #e2e8f0 50%, #f3f4f6 70%, #ffffff 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255, 255, 255, 0.9);
            transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 0.4s ease;
            position: relative;
            overflow: hidden;
            border: 1px solid #cbd5e1;
        }

        .tier-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.08);
        }

        .tier-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
        }

        .tier-icon {
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .tier-name {
            font-size: 1.5rem;
            font-weight: 800;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
        }

        .tier-benefits {
            list-style: none;
            padding: 0;
            margin: 0;
            position: relative;
            z-index: 1;
        }

        .tier-benefits li {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #4b5563;
        }

        .tier-benefits i {
            color: #ff7800;
        }

        .tier-card-price {
            font-size: 1.25rem;
            font-weight: 800;
            color: #111827;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .popular-badge {
            font-size: 0.8125rem;
            font-weight: 800;
            letter-spacing: 0.04em;
            color: #b45309;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 4px 10px;
            border-radius: 999px;
            margin-left: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border: 1px solid #fcd34d;
        }

        /* Gold Tier */
        .tier-card.gold {
            background: linear-gradient(135deg, #fffbeb 0%, #fef08a 30%, #eab308 50%, #fef08a 70%, #fffbeb 100%);
            border: 1px solid #ca8a04;
            box-shadow: 0 14px 40px rgba(234, 179, 8, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.9);
        }

        .tier-card.gold .tier-icon {
            background: rgba(255, 255, 255, 0.7);
            color: #ca8a04;
            border: 1px solid #fef08a;
        }

        /* Platinum Tier */
        .tier-card.platinum {
            background: linear-gradient(135deg, #3f3f46 0%, #52525b 30%, #18181b 50%, #52525b 70%, #3f3f46 100%);
            border: 1px solid #09090b;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.1);
            color: #f4f4f5;
        }

        .tier-card.platinum .tier-icon {
            background: rgba(39, 39, 42, 0.8);
            color: #f4f4f5;
            border: 1px solid #52525b;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .tier-card.platinum .tier-name {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .tier-card.platinum .tier-card-price,
        .tier-card.platinum .tier-benefits li {
            color: #e4e4e7;
        }

        .exclusive-deals {
            padding: 80px 0;
        }

        .benefit-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: center;
            margin-bottom: 60px;
        }

        .benefit-image {
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .benefit-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .benefit-row:hover .benefit-image img {
            transform: scale(1.05);
        }

        .benefit-content h3 {
            font-size: 2rem;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .benefit-content p {
            font-size: 1.1rem;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .cta-btn {
            display: inline-block;
            background: #ff7800;
            color: #fff;
            padding: 15px 35px;
            border-radius: 50px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(255, 120, 0, 0.2);
        }

        .cta-btn:hover {
            background: #e66a00;
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .benefit-row {
                grid-template-columns: 1fr;
                gap: 30px;
            }

            .benefit-row:nth-child(even) .benefit-image {
                order: -1;
            }
        }
    </style>
</head>

<body class="deals-member-page">
    <!-- ========== Header Placeholder ========== -->
    <div id="hotel-header-placeholder"></div>

    <main>
        <!-- Hero Section -->
        <section class="member-hero">
            <div class="container hero-content">
                <h1 style="font-size: 3.5rem; margin-bottom: 20px; font-weight: 800;">JEJU UNIVERSE</h1>
                <p style="font-size: 1.5rem; opacity: 0.9;">끊임없는 혜택의 우주, 오직 회원님만을 위해 준비했습니다.</p>
            </div>
        </section>

        <!-- Tier Section -->
        <section class="tier-section">
            <div class="container text-center">
                <h2 class="section-title">회원 등급별 특별 혜택</h2>
                <p class="section-subtitle">여행을 즐길수록 커지는 무한한 혜택을 확인하세요.</p>

                <div class="tier-grid">
                    <!-- Silver -->
                    <div class="tier-card">
                        <div class="tier-header">
                            <div class="tier-icon"><i data-lucide="award"></i></div>
                            <span class="tier-name">SILVER</span>
                        </div>
                        <p class="tier-card-price">월 29,900원</p>
                        <ul class="tier-benefits">
                            <li><i data-lucide="check-circle"></i> 항공권 5% 할인</li>
                            <li><i data-lucide="check-circle"></i> 호텔 예약 10% 할인</li>
                            <li><i data-lucide="check-circle"></i> 렌트카 기본료 할인</li>
                            <li><i data-lucide="check-circle"></i> 우선 고객 지원</li>
                        </ul>
                    </div>

                    <!-- Gold -->
                    <div class="tier-card gold">
                        <div class="tier-header">
                            <div class="tier-icon"><i data-lucide="award"></i></div>
                            <span class="tier-name">GOLD</span>
                        </div>
                        <p class="tier-card-price" style="display: flex; align-items: center;">
                            월 49,900원
                            <span class="popular-badge">인기</span>
                        </p>
                        <ul class="tier-benefits">
                            <li><i data-lucide="check-circle"></i> 항공권 10% 할인</li>
                            <li><i data-lucide="check-circle"></i> 호텔 예약 15% 할인</li>
                            <li><i data-lucide="check-circle"></i> 렌트카 기본료 20% 할인</li>
                            <li><i data-lucide="check-circle"></i> 무료 공항 라운지</li>
                            <li><i data-lucide="check-circle"></i> 우선 예약 서비스</li>
                        </ul>
                    </div>

                    <!-- Platinum -->
                    <div class="tier-card platinum">
                        <div class="tier-header">
                            <div class="tier-icon"><i data-lucide="gem"></i></div>
                            <span class="tier-name">PLATINUM</span>
                        </div>
                        <p class="tier-card-price">월 79,900원</p>
                        <ul class="tier-benefits">
                            <li><i data-lucide="check-circle"></i> 항공권 15% 할인</li>
                            <li><i data-lucide="check-circle"></i> 호텔 예약 20% 할인</li>
                            <li><i data-lucide="check-circle"></i> 렌트카 기본료 30% 할인</li>
                            <li><i data-lucide="check-circle"></i> VIP 라운지 이용</li>
                            <li><i data-lucide="check-circle"></i> 전담 컨시어지 서비스</li>
                            <li><i data-lucide="check-circle"></i> 무료 취소 정책</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Exclusive Benefits -->
        <section class="exclusive-deals">
            <div class="container">
                <div class="benefit-row">
                    <div class="benefit-image">
                        <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
                            alt="Private Sale">
                    </div>
                    <div class="benefit-content">
                        <h3>Private Member Sale</h3>
                        <p>일반인에게는 공개되지 않는 특별한 가격. 전 세계 인기 호텔과 리조트를 최대 70% 할인된 가격으로 만나보세요. 오직 로그인한 회원님께만 보입니다.</p>
                        <a href="#" class="cta-btn route-link" data-route="SERVICES.STAY.MAIN">더 많은 특가 보기</a>
                    </div>
                </div>

                <div class="benefit-row">
                    <div class="benefit-content" style="text-align: right;">
                        <h3>Cashback & Points</h3>
                        <p>숙박 완료 후 현금처럼 사용 가능한 리프레시 포인트가 적립됩니다. 다음 여행에서 바로 사용하거나, 제주항공 항공권 구매 시에도 활용할 수 있습니다.</p>
                        <a href="#" class="cta-btn">포인트 확인하기</a>
                    </div>
                    <div class="benefit-image">
                        <img src="https://images.unsplash.com/photo-1601597111158-2fcee29e42d6?w=800&q=80"
                            alt="Point Benefit">
                    </div>
                </div>

                <div class="benefit-row">
                    <div class="benefit-image">
                        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
                            alt="VIP Experience">
                    </div>
                    <div class="benefit-content">
                        <h3>VIP Experience</h3>
                        <p>단순한 숙박을 넘어선 특별한 경험. 등급에 따라 제공되는 공항 픽업 서비, 스파 이용권, 그리고 현지 어트랙션 우선 입장 혜택으로 더욱 완벽한 여행을 완성하세요.
                        </p>
                        <a href="#" class="cta-btn route-link" data-route="SERVICES.STAY.MAIN">여행가이드 보기</a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- ========== Footer Placeholder ========== -->
    <div id="hotel-footer-placeholder"></div>

    <!-- Scripts -->
    <script src="../../../core/constants/lang_data.js"></script>
    <script type="module" src="../../../components/runtime/bootstrap.js"></script>
</body>

</html>