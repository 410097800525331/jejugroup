<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>숙소/상품 관리 - 제주여행 관리자</title>

    <script src="../js/auth_guard.js"></script>

    <link rel="stylesheet" href="../css/theme.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/components.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>

<body class="admin-mode">
    <button class="admin-sidebar-toggle" id="admin-sidebar-toggle" aria-label="메뉴 토글">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:24px; height:24px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    </button>

    <div class="admin-layout">

        <aside class="admin-sidebar" id="admin-sidebar">
            <div class="admin-sidebar-logo">
                <span>Jeju</span> Admin
            </div>
            <nav class="admin-menu" id="admin-sidebar-menu">
            </nav>
        </aside>

        <header class="admin-header">
            <div class="admin-header-right-group">
                <!-- Return to Portals (Micro-Navigation) -->
                <nav class="admin-portal-nav" aria-label="Portal Navigation">
                    <a href="#" class="portal-btn route-link" data-route="HOME" title="메인 랜딩으로">
                        <i data-lucide="home" style="width:16px; height:16px;"></i>
                        <span class="portal-btn-copy">
                            <span class="portal-btn-label">메인</span>
                            <span class="portal-btn-hint">사이트 이동</span>
                        </span>
                    </a>
                    <a href="#" class="portal-btn route-link" data-route="SERVICES.AIR.MAIN" title="제주에어로">
                        <i data-lucide="plane" style="width:16px; height:16px;"></i>
                        <span class="portal-btn-copy">
                            <span class="portal-btn-label">에어</span>
                            <span class="portal-btn-hint">사이트 이동</span>
                        </span>
                    </a>
                    <a href="#" class="portal-btn route-link" data-route="SERVICES.STAY.MAIN" title="제주스테이로">
                        <i data-lucide="building" style="width:16px; height:16px;"></i>
                        <span class="portal-btn-copy">
                            <span class="portal-btn-label">스테이</span>
                            <span class="portal-btn-hint">사이트 이동</span>
                        </span>
                    </a>
                </nav>
                <div class="admin-profile-container" id="admin-profile-container">
                    <div class="admin-user-profile" id="admin-profile-trigger">
                        <div class="admin-user-info">
                            <span class="admin-user-name" id="admin-user-name">Loading...</span>
                            <span class="admin-user-role" id="admin-user-role">-</span>
                        </div>
                        <div class="admin-avatar">AD</div>
                        <i data-lucide="chevron-down" class="admin-dropdown-icon"
                            style="width:16px; margin-left:8px; color:var(--admin-text-secondary);"></i>
                    </div>

                    <div class="admin-dropdown-menu" id="admin-dropdown-menu">
                        <div class="dropdown-header">
                            <strong data-lang="adminSettings">환경 설정</strong>
                        </div>

                        <div class="dropdown-section">
                            <span class="dropdown-section-title">테마 모드</span>
                            <div class="admin-theme-toggle" id="admin-theme-toggle">
                                <button class="theme-btn active" data-theme="system" title="시스템 테마">💻</button>
                                <button class="theme-btn" data-theme="dark" title="다크 모드">🌙</button>
                                <button class="theme-btn" data-theme="light" title="라이트 모드">☀️</button>
                            </div>
                        </div>

                        <div class="dropdown-section">
                            <span class="dropdown-section-title">언어 설정</span>
                            <div class="admin-lang-toggle">
                                <button class="lang-btn active" data-lang-val="ko">KOR</button>
                                <button class="lang-btn" data-lang-val="en">ENG</button>
                            </div>
                        </div>

                        <div class="dropdown-divider"></div>

                        <ul class="dropdown-menu-list">
                            <li>
                                <a href="#" class="dropdown-item">
                                    <span
                                        style="font-size:1.1rem; width:20px; display:inline-block; text-align:center;">👥</span>
                                    <span>관리자 명단 보기</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="dropdown-item">
                                    <span
                                        style="font-size:1.1rem; width:20px; display:inline-block; text-align:center;">⚙️</span>
                                    <span>내 프로필 설정</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="dropdown-item">
                                    <span
                                        style="font-size:1.1rem; width:20px; display:inline-block; text-align:center;">🔒</span>
                                    <span>보안 로그 (Audit)</span>
                                </a>
                            </li>
                        </ul>

                        <div class="dropdown-divider"></div>

                        <button class="dropdown-item danger-item" id="admin-logout-btn">
                            <span
                                style="font-size:1.1rem; width:20px; display:inline-block; text-align:center;">🚪</span>
                            <span>로그아웃</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="admin-main">
            <div class="admin-page-header">
                <h1 class="admin-page-title">재고 및 상품 관리</h1>
                <div style="display: flex; gap: var(--admin-space-md); align-items: center;">
                    <div class="admin-segment-control" id="admin-domain-filters">
                        <button class="segment-btn active" data-domain="all">전체 (통합)</button>
                        <button class="segment-btn" data-domain="flight">항공편 상세</button>
                        <button class="segment-btn" data-domain="hotel">숙박 상세</button>
                        <button class="segment-btn" data-domain="rentcar">렌터카 상세</button>
                    </div>
                </div>
            </div>

            <div class="admin-table-actions"
                style="margin-bottom: var(--admin-space-lg); display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:8px;">
                    <input type="text" placeholder="상품명 또는 코드 검색..."
                        style="padding: 8px 12px; border-radius:6px; border:1px solid var(--admin-border); background:var(--admin-surface); color:var(--admin-text-primary); outline:none;">
                    <button class="admin-btn admin-btn-outline">검색</button>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="admin-btn admin-btn-outline">재고 일괄 수정</button>
                    <button class="admin-btn admin-btn-primary">신규 상품 등록</button>
                </div>
            </div>

            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>상품 코드</th>
                            <th>분류</th>
                            <th>상품명 (옵션)</th>
                            <th>단가 (기준 요금)</th>
                            <th>잔여 재고/좌석</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody id="inventory-table-body">
                    </tbody>
                </table>
            </div>

            <div style="display:flex; justify-content:center; margin-top:20px; gap:8px;">
                <button class="admin-btn admin-btn-outline" disabled>&lt;</button>
                <button class="admin-btn admin-btn-primary">1</button>
                <button class="admin-btn admin-btn-outline">&gt;</button>
            </div>

            <section class="admin-card hotel-offer-admin-section">
                <div class="admin-card-header hotel-offer-section-header">
                    <div>
                        <h2 class="hotel-offer-section-title">호텔 리스트 혜택/가격 노출 관리</h2>
                        <p class="hotel-offer-section-copy">
                            호텔 카드 이미지 위 혜택 문구와 카드 가격을 여기서 수정한다.
                            저장값은 현재 관리자 브라우저에 보관되고 호텔 리스트에서 바로 반영된다.
                        </p>
                    </div>
                    <span class="admin-badge neutral">호텔 리스트 연동</span>
                </div>

                <div class="hotel-offer-toolbar">
                    <input class="hotel-offer-search-input" id="hotel-offer-search-input" type="search"
                        placeholder="호텔명 또는 호텔 ID 검색">
                    <button class="admin-btn admin-btn-outline" id="hotel-offer-reset-all-btn" type="button">전체 초기화</button>
                </div>

                <div class="hotel-offer-admin-grid">
                    <div class="admin-table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>호텔 ID</th>
                                    <th>호텔명</th>
                                    <th>혜택 문구</th>
                                    <th>정상가</th>
                                    <th>판매가</th>
                                    <th>상태</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody id="hotel-offer-table-body">
                                <tr>
                                    <td colspan="7" style="text-align:center; padding: 40px;">호텔 리스트 오퍼 데이터를 불러오는 중...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <aside class="hotel-offer-editor-card">
                        <div class="hotel-offer-editor-head">
                            <h3 class="hotel-offer-editor-title">선택한 호텔 수정</h3>
                            <p class="hotel-offer-editor-copy" id="hotel-offer-editor-copy">왼쪽 목록에서 수정할 호텔을 골라라.</p>
                        </div>

                        <form class="hotel-offer-form" id="hotel-offer-form">
                            <label class="hotel-offer-field">
                                <span>호텔명</span>
                                <input id="hotel-offer-title" readonly type="text">
                            </label>

                            <label class="hotel-offer-field">
                                <span>혜택 문구</span>
                                <input id="hotel-offer-badge" maxlength="40" placeholder="예: 무료 업그레이드" type="text">
                            </label>

                            <label class="hotel-offer-field">
                                <span>정상가</span>
                                <input id="hotel-offer-original-price" inputmode="numeric" min="0" placeholder="250000" step="1000"
                                    type="number">
                            </label>

                            <label class="hotel-offer-field">
                                <span>판매가</span>
                                <input id="hotel-offer-current-price" inputmode="numeric" min="0" placeholder="189000" step="1000"
                                    type="number">
                            </label>

                            <div class="hotel-offer-preview" id="hotel-offer-preview">
                                아직 선택된 호텔이 없다.
                            </div>

                            <div class="hotel-offer-form-actions">
                                <button class="admin-btn admin-btn-primary" type="submit">저장</button>
                                <button class="admin-btn admin-btn-outline" id="hotel-offer-reset-btn" type="button">선택 초기화</button>
                            </div>
                        </form>
                    </aside>
                </div>
            </section>
        </main>
    </div>

    <!-- Scripts -->
    <script src="../js/rbac_config.js"></script>
    <script src="../js/sidebar_ui.js"></script>
    <script src="../js/store.js"></script>
    <script src="../js/portal_nav.js"></script>
    <script src="../js/lodging.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) lucide.createIcons();
        });
    </script>
</body>

</html>
