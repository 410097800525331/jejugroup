/**
 * @file lodging.js
 * @description Product management view logic.
 */

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const redirectByRoute = (routeKey, mode = 'replace') => {
        routeResolverPromise
            .then(({ resolveRoute }) => {
                const targetUrl = resolveRoute(routeKey);
                if (mode === 'assign') {
                    window.location.assign(targetUrl);
                    return;
                }
                window.location.replace(targetUrl);
            })
            .catch((error) => {
                console.error('[AdminLodging] Route resolution failed:', error);
                const fallback = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('index.html', window.location.href).href;
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(fallback, 'admin-route-fallback');
                    return;
                }
                window.location.replace(fallback);
            });
    };

    const session = await window.AdminAuth?.waitForAdminSession?.();
    if (!session || !session.role) return;

    const sidebarMenuContainer = document.getElementById('admin-sidebar-menu');
    const userRoleEl = document.getElementById('admin-user-role');
    const userNameEl = document.getElementById('admin-user-name');
    const sidebarToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const layout = document.querySelector('.admin-layout');
    const tabButtons = document.querySelectorAll('.segment-btn');
    const tableBody = document.getElementById('lodging-table-body');
    const tableHeadRow = document.querySelector('.admin-table thead tr');
    const searchInput = document.querySelector('.admin-table-actions input[type="text"]');
    const searchButton = document.querySelector('.admin-table-actions .admin-btn-outline');
    const actionButtons = document.querySelectorAll('.admin-table-actions .admin-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });

    const TAB_CONFIG = Object.freeze({
        stay: Object.freeze({
            searchPlaceholder: '호텔명 또는 코드 검색...',
            primaryAction: '호텔 등록',
            secondaryAction: '재고 동기화',
            emptyMessage: '호텔 상품이 없다.',
            columns: Object.freeze(['상품 코드', '도메인', '상품명 / 옵션', '재고 / 수량', '기준가', '상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'PRD-H01 신라호텔 제주 디럭스 트윈 객실 12 350000 판매중',
                    cells: [
                        '<strong>PRD-H01</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">호텔</span>',
                        '신라호텔 제주 - 디럭스 트윈',
                        '12 객실',
                        '₩350,000',
                        '<span class="admin-badge success">판매중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                },
                {
                    searchText: 'PRD-H02 파르나스 호텔 제주 스위트 풀빌라 객실 0 1200000 품절',
                    cells: [
                        '<strong>PRD-H02</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">호텔</span>',
                        '파르나스 호텔 제주 - 스위트 풀빌라',
                        '0 객실',
                        '₩1,200,000',
                        '<span class="admin-badge danger">품절</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                }
            ])
        }),
        flight: Object.freeze({
            searchPlaceholder: '항공편명 또는 좌석 코드 검색...',
            primaryAction: '좌석 정책',
            secondaryAction: '재고 동기화',
            emptyMessage: '항공 상품이 없다.',
            columns: Object.freeze(['상품 코드', '도메인', '노선 / 편명', '좌석', '기준가', '상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'FLT-F01 김포 제주 7C141 좌석 45 45000 판매중',
                    cells: [
                        '<strong>FLT-F01</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">항공</span>',
                        '제주항공 7C141 (GMP-CJU)',
                        '45 석',
                        '₩45,000',
                        '<span class="admin-badge success">판매중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                },
                {
                    searchText: 'FLT-F02 제주 김포 KE1231 좌석 2 85000 재고부족',
                    cells: [
                        '<strong>FLT-F02</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">항공</span>',
                        '대한항공 KE1231 (CJU-GMP)',
                        '2 석',
                        '₩85,000',
                        '<span class="admin-badge warning">재고 부족</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                }
            ])
        }),
        rentcar: Object.freeze({
            searchPlaceholder: '차종 또는 차량 코드 검색...',
            primaryAction: '배차 정책',
            secondaryAction: '재고 동기화',
            emptyMessage: '렌터카 상품이 없다.',
            columns: Object.freeze(['상품 코드', '도메인', '차종 / 옵션', '보유 대수', '기준가', '상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'CAR-R01 아이오닉 5 롱레인지 3 95000 재고부족',
                    cells: [
                        '<strong>CAR-R01</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>',
                        '스타렌터카 - 아이오닉 5 롱레인지',
                        '3 대',
                        '₩95,000',
                        '<span class="admin-badge warning">재고 부족</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                },
                {
                    searchText: 'CAR-R02 카니발 9인승 1 155000 품절임박',
                    cells: [
                        '<strong>CAR-R02</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>',
                        '무지개렌터카 - 카니발 9인승',
                        '1 대',
                        '₩155,000',
                        '<span class="admin-badge warning">품절 임박</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                }
            ])
        }),
        voucher: Object.freeze({
            searchPlaceholder: '바우처명 또는 코드 검색...',
            primaryAction: '상품 등록',
            secondaryAction: '바우처 동기화',
            emptyMessage: '바우처 상품이 없다.',
            columns: Object.freeze(['상품 코드', '도메인', '바우처 / 옵션', '잔여 수량', '판매가', '상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'PRD-A01 카약 체험 18 29000 판매중',
                    cells: [
                        '<strong>PRD-A01</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(200, 70%, 55%); border-color:hsl(200, 70%, 55%);">바우처</span>',
                        '제주 해안 카약 체험',
                        '18 건',
                        '₩29,000',
                        '<span class="admin-badge success">판매중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                },
                {
                    searchText: 'PRD-A02 패러세일링 2 79000 노출대기',
                    cells: [
                        '<strong>PRD-A02</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(200, 70%, 55%); border-color:hsl(200, 70%, 55%);">바우처</span>',
                        '오션 패러세일링',
                        '2 건',
                        '₩79,000',
                        '<span class="admin-badge warning">노출 대기</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                }
            ])
        }),
special: Object.freeze({
            searchPlaceholder: '특가명 또는 쿠폰 코드 검색...',
            primaryAction: '특가 생성',
            secondaryAction: '혜택 정책',
            emptyMessage: '특가 / 쿠폰 데이터가 없다.',
            columns: Object.freeze(['상품 코드', '도메인', '특가 / 쿠폰', '발행 수량', '금액', '상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'PRD-P01 공항 라운지 240 15000 판매중',
                    cells: [
                        '<strong>PRD-P01</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(32, 85%, 55%); border-color:hsl(32, 85%, 55%);">특가</span>',
                        '공항 라운지 이용권 특가',
                        '240 장',
                        '₩15,000',
                        '<span class="admin-badge success">판매중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                },
                {
                    searchText: 'PRD-P02 렌터카 충전권 0 30000 품절',
                    cells: [
                        '<strong>PRD-P02</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(32, 85%, 55%); border-color:hsl(32, 85%, 55%);">특가</span>',
                        '전기차 충전권 쿠폰',
                        '0 장',
                        '₩30,000',
                        '<span class="admin-badge danger">품절</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                }
            ])
        }),
        usim: Object.freeze({
            searchPlaceholder: '유심명 또는 코드 검색...',
            primaryAction: '재고 등록',
            secondaryAction: '유심 정책',
            emptyMessage: '유심 상품이 없다.',
            columns: Object.freeze(['상품 코드', '도메인', '유심 / 기간', '재고', '판매가', '상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'PRD-S01 eSIM 5일 66 12000 판매중',
                    cells: [
                        '<strong>PRD-S01</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 60%, 58%); border-color:hsl(210, 60%, 58%);">유심</span>',
                        '제주 eSIM 5일',
                        '66 개',
                        '₩12,000',
                        '<span class="admin-badge success">판매중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                },
                {
                    searchText: 'PRD-S02 데이터 10GB 5 18000 재고부족',
                    cells: [
                        '<strong>PRD-S02</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 60%, 58%); border-color:hsl(210, 60%, 58%);">유심</span>',
                        '제주 데이터 유심 10GB / 7일',
                        '5 개',
                        '₩18,000',
                        '<span class="admin-badge warning">재고 부족</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">수정</button>'
                    ]
                }
            ])
        })
    });

    const DEFAULT_TAB = 'stay';
    const currencyFormatter = new Intl.NumberFormat('ko-KR');
    let activeTab = DEFAULT_TAB;
    let searchKeyword = '';

    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const formatCurrency = (value) => `₩${currencyFormatter.format(value)}`;

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'lodging' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const renderTableHead = (tabKey) => {
        const config = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];
        if (!tableHeadRow) return;

        tableHeadRow.innerHTML = config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    };

    const renderTableBody = (tabKey) => {
        const config = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];
        if (!tableBody) return;

        const keyword = searchKeyword.trim().toLowerCase();
        const rows = config.rows.filter((row) => {
            if (!keyword) return true;
            return row.searchText.toLowerCase().includes(keyword);
        });

        if (rows.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${config.columns.length}" style="text-align:center; padding: 40px;">${escapeHtml(config.emptyMessage)}</td></tr>`;
            return;
        }

        tableBody.innerHTML = rows.map((row) => `
            <tr>
                ${row.cells.map((cell) => `<td>${cell}</td>`).join('')}
            </tr>
        `).join('');
    };

    const syncActionBar = (tabKey) => {
        const config = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];
        if (searchInput) {
            searchInput.placeholder = config.searchPlaceholder;
        }

        if (actionButtons.length >= 3) {
            actionButtons[0].textContent = '검색';
            actionButtons[1].textContent = config.secondaryAction;
            actionButtons[2].textContent = config.primaryAction;
        }
    };

    const setActiveTab = (tabKey) => {
        activeTab = TAB_CONFIG[tabKey] ? tabKey : DEFAULT_TAB;
        tabButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.domain === activeTab);
        });
        syncActionBar(activeTab);
        renderTableHead(activeTab);
        renderTableBody(activeTab);
    };

    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    tabButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const tabKey = event.currentTarget.dataset.domain;
            searchKeyword = '';
            if (searchInput) {
                searchInput.value = '';
            }
            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: tabKey });
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            searchKeyword = event.currentTarget.value;
            renderTableBody(activeTab);
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => renderTableBody(activeTab));
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            AdminStore.dispatch({ type: 'UI/TOGGLE_SIDEBAR' });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userSession');
            redirectByRoute('HOME');
        });
    }

    if (profileTrigger && profileContainer) {
        profileTrigger.addEventListener('click', (event) => {
            event.stopPropagation();
            profileContainer.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!profileContainer.contains(event.target)) profileContainer.classList.remove('active');
        });
    }

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            langBtns.forEach((item) => item.classList.remove('active'));
            event.currentTarget.classList.add('active');
        });
    });

    themeBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const selectedTheme = event.currentTarget.dataset.theme;
            localStorage.setItem('adminTheme', selectedTheme);
            AdminStore.dispatch({ type: 'UI/SET_THEME', payload: selectedTheme });
        });
    });

    const updateThemeDOM = (theme) => {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
        document.body.setAttribute('data-theme', activeTheme);
        themeBtns.forEach((btn) => {
            if (btn.dataset.theme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    };

    AdminStore.subscribe((newState) => {
        syncSidebarUI(newState.ui.sidebarOpen);
        updateThemeDOM(newState.ui.theme);
        setActiveTab(newState.ui.domain);
    });

    const initialState = AdminStore.getState();
    syncSidebarUI(initialState.ui.sidebarOpen);
    updateThemeDOM(initialState.ui.theme);
    setActiveTab(TAB_CONFIG[initialState.ui.domain] ? initialState.ui.domain : DEFAULT_TAB);
    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
