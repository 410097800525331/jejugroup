/**
 * @file reservations.js
 * @description Reservation / payment / refund / traveler management view logic.
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
                console.error('[AdminReservations] Route resolution failed:', error);
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
    const tabButtons = document.querySelectorAll('#admin-domain-filters .segment-btn');
    const tableBody = document.getElementById('reservations-table-body');
    const tableHeadRow = document.querySelector('.admin-table thead tr');
    const searchInput = document.querySelector('.admin-reservations-search-group input[type="text"]');
    const searchButton = document.querySelector('.admin-reservations-search-group .admin-btn-outline');
    const actionButtons = document.querySelectorAll('.admin-reservations-quick-actions .admin-btn');
    const domainFilterButtons = document.querySelectorAll('#reservation-domain-filters .subfilter-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });
    let activeDomainKey = 'all';

    const TAB_CONFIG = Object.freeze({
        booking: Object.freeze({
            searchPlaceholder: '예약번호 또는 고객명 검색...',
            primaryAction: '수기 등록',
            secondaryAction: '환불 일괄 처리',
            emptyMessage: '예약 데이터가 없다.',
            columns: Object.freeze(['번호', '도메인', '예약 / 결제 정보', '고객 / 연락처', '금액', '일시', '상태', '관리']),
            rows: Object.freeze([
                {
                    domainKey: 'hotel',
                    searchText: 'REV-001 호텔 신라호텔 김태형 850000 2026-03-18 확정',
                    cells: [
                        '<strong>REV-001</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">호텔</span>',
                        '신라호텔 제주 2박',
                        '김태형<br><small style="color:var(--admin-text-secondary);">010-1234-5678</small>',
                        '₩850,000',
                        '2026-03-18 09:20',
                        '<span class="admin-badge success">결제완료</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'flight',
                    searchText: 'REV-002 항공권 제주항공 박지민 45000 2026-03-19 대기',
                    cells: [
                        '<strong>REV-002</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">항공권</span>',
                        '제주항공 GMP-CJU 편도',
                        '박지민<br><small style="color:var(--admin-text-secondary);">010-9876-5432</small>',
                        '₩45,000',
                        '2026-03-19 11:05',
                        '<span class="admin-badge warning">결제대기</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'rentcar',
                    searchText: 'REV-003 렌터카 스타렌터카 이도현 125000 2026-03-20 확정',
                    cells: [
                        '<strong>REV-003</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>',
                        '스타렌터카 제네시스 G80',
                        '이도현<br><small style="color:var(--admin-text-secondary);">010-1111-2222</small>',
                        '₩125,000',
                        '2026-03-20 08:50',
                        '<span class="admin-badge success">결제완료</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'voucher',
                    searchText: 'REV-004 바우처 카약 체험 정수빈 29000 2026-03-20 대기',
                    cells: [
                        '<strong>REV-004</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(200, 70%, 55%); border-color:hsl(200, 70%, 55%);">바우처</span>',
                        '제주 해안 카약 체험',
                        '정수빈<br><small style="color:var(--admin-text-secondary);">010-2222-3333</small>',
                        '₩29,000',
                        '2026-03-20 10:15',
                        '<span class="admin-badge warning">결제대기</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                }
            ])
        }),
        payment: Object.freeze({
            searchPlaceholder: '결제번호 또는 주문자 검색...',
            primaryAction: '수동 승인',
            secondaryAction: '정산 내보내기',
            emptyMessage: '결제 데이터가 없다.',
            columns: Object.freeze(['번호', '도메인', '결제 수단 / 주문', '고객 / 연락처', '승인 금액', '승인 시각', '상태', '관리']),
            rows: Object.freeze([
                {
                    domainKey: 'hotel',
                    searchText: 'PAY-101 호텔 카드 김태형 850000 2026-03-18 승인',
                    cells: [
                        '<strong>PAY-101</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">호텔</span>',
                        '카드 결제 / 신라호텔 제주',
                        '김태형<br><small style="color:var(--admin-text-secondary);">010-1234-5678</small>',
                        '₩850,000',
                        '2026-03-18 09:21',
                        '<span class="admin-badge success">승인</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'rentcar',
                    searchText: 'PAY-102 렌터카 간편결제 이도현 125000 2026-03-18 실패',
                    cells: [
                        '<strong>PAY-102</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>',
                        '간편결제 / 스타렌터카 제네시스 G80',
                        '이도현<br><small style="color:var(--admin-text-secondary);">010-1111-2222</small>',
                        '₩125,000',
                        '2026-03-18 12:44',
                        '<span class="admin-badge danger">실패</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'flight',
                    searchText: 'PAY-103 항공권 간편결제 박지민 45000 2026-03-19 승인',
                    cells: [
                        '<strong>PAY-103</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">항공권</span>',
                        '간편결제 / 제주항공 GMP-CJU',
                        '박지민<br><small style="color:var(--admin-text-secondary);">010-9876-5432</small>',
                        '₩45,000',
                        '2026-03-19 11:06',
                        '<span class="admin-badge success">승인</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'voucher',
                    searchText: 'PAY-104 바우처 카드 정수빈 29000 2026-03-20 승인',
                    cells: [
                        '<strong>PAY-104</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(200, 70%, 55%); border-color:hsl(200, 70%, 55%);">바우처</span>',
                        '카드 결제 / 제주 해안 카약 체험',
                        '정수빈<br><small style="color:var(--admin-text-secondary);">010-2222-3333</small>',
                        '₩29,000',
                        '2026-03-20 10:16',
                        '<span class="admin-badge success">승인</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                }
            ])
        }),
        refund: Object.freeze({
            searchPlaceholder: '환불번호 또는 사유 검색...',
            primaryAction: '환불 승인',
            secondaryAction: '일괄 환불',
            emptyMessage: '환불 데이터가 없다.',
            columns: Object.freeze(['번호', '도메인', '원예약 / 사유', '고객 / 연락처', '환불액', '처리 시각', '상태', '관리']),
            rows: Object.freeze([
                {
                    domainKey: 'flight',
                    searchText: 'RFD-201 항공권 일정변경 박지민 45000 2026-03-19 처리중',
                    cells: [
                        '<strong>RFD-201</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">항공권</span>',
                        'REV-002 / 일정 변경 요청',
                        '박지민<br><small style="color:var(--admin-text-secondary);">010-9876-5432</small>',
                        '₩45,000',
                        '2026-03-19 13:10',
                        '<span class="admin-badge warning">처리중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'hotel',
                    searchText: 'RFD-202 호텔 노쇼 전정국 1200000 2026-03-18 완료',
                    cells: [
                        '<strong>RFD-202</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">호텔</span>',
                        'REV-004 / 노쇼 규정 적용',
                        '전정국<br><small style="color:var(--admin-text-secondary);">010-3333-4444</small>',
                        '₩1,200,000',
                        '2026-03-18 18:02',
                        '<span class="admin-badge success">완료</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'voucher',
                    searchText: 'RFD-203 바우처 정수빈 29000 2026-03-20 요청',
                    cells: [
                        '<strong>RFD-203</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(200, 70%, 55%); border-color:hsl(200, 70%, 55%);">바우처</span>',
                        'REV-004 / 체험 일정 변경',
                        '정수빈<br><small style="color:var(--admin-text-secondary);">010-2222-3333</small>',
                        '₩29,000',
                        '2026-03-20 10:40',
                        '<span class="admin-badge warning">요청</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'rentcar',
                    searchText: 'RFD-204 렌터카 이도현 125000 2026-03-20 승인',
                    cells: [
                        '<strong>RFD-204</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>',
                        'REV-003 / 픽업 시간 변경',
                        '이도현<br><small style="color:var(--admin-text-secondary);">010-1111-2222</small>',
                        '₩125,000',
                        '2026-03-20 09:10',
                        '<span class="admin-badge success">완료</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                }
            ])
        }),
        traveler: Object.freeze({
            searchPlaceholder: '탑승객 또는 이용자 검색...',
            primaryAction: '명단 동기화',
            secondaryAction: '이용자 확인',
            emptyMessage: '탑승객/이용자 데이터가 없다.',
            columns: Object.freeze(['번호', '도메인', '예약 / 이용 상품', '이용자', '체크인 / 탑승', '상태', '관리']),
            rows: Object.freeze([
                {
                    domainKey: 'hotel',
                    searchText: 'TRV-301 호텔 김태형 2026-03-18 체크인완료',
                    cells: [
                        '<strong>TRV-301</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">호텔</span>',
                        '신라호텔 제주 2박',
                        '김태형 / 2명',
                        '2026-03-18 체크인',
                        '<span class="admin-badge success">이용중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'flight',
                    searchText: 'TRV-302 항공권 박지민 2026-03-19 탑승예정',
                    cells: [
                        '<strong>TRV-302</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">항공권</span>',
                        '제주항공 GMP-CJU 편도',
                        '박지민 / 1명',
                        '2026-03-19 탑승',
                        '<span class="admin-badge warning">탑승 예정</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'voucher',
                    searchText: 'TRV-303 바우처 정수빈 2026-03-20 이용중',
                    cells: [
                        '<strong>TRV-303</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(200, 70%, 55%); border-color:hsl(200, 70%, 55%);">바우처</span>',
                        '제주 해안 카약 체험',
                        '정수빈 / 2명',
                        '2026-03-20 이용',
                        '<span class="admin-badge success">이용중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                },
                {
                    domainKey: 'rentcar',
                    searchText: 'TRV-304 렌터카 이도현 2026-03-20 대여중',
                    cells: [
                        '<strong>TRV-304</strong>',
                        '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>',
                        '스타렌터카 제네시스 G80',
                        '이도현 / 1명',
                        '2026-03-20 대여',
                        '<span class="admin-badge success">이용중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>'
                    ]
                }
            ])
        })
    });

    const DEFAULT_TAB = 'booking';
    let activeTab = DEFAULT_TAB;
    let searchKeyword = '';

    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'reservations' ? 'active' : ''}" data-id="${menu.id}">
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
            const domainMatch = activeDomainKey === 'all' || row.domainKey === activeDomainKey;
            const searchMatch = !keyword || row.searchText.toLowerCase().includes(keyword);
            return domainMatch && searchMatch;
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

        if (searchButton) {
            searchButton.textContent = '검색';
        }

        if (actionButtons.length >= 2) {
            actionButtons[0].textContent = config.secondaryAction;
            actionButtons[1].textContent = config.primaryAction;
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

    const syncDomainFilters = () => {
        domainFilterButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.domainKey === activeDomainKey);
        });
    };

    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    tabButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            searchKeyword = '';
            if (searchInput) searchInput.value = '';
            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: event.currentTarget.dataset.domain });
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

    domainFilterButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            activeDomainKey = event.currentTarget.dataset.domainKey || 'all';
            syncDomainFilters();
            renderTableBody(activeTab);
        });
    });

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
    syncDomainFilters();
    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
