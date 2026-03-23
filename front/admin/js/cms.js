/**
 * @file cms.js
 * @description CMS / banner / visibility rule management view logic.
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
                console.error('[AdminCms] Route resolution failed:', error);
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
    const tableBody = document.getElementById('cms-table-body');
    const tableHeadRow = document.querySelector('.admin-table thead tr');
    const searchInput = document.querySelector('.admin-table-actions input[type="text"]');
    const statusFilter = document.getElementById('cms-status-filter');
    const searchButton = document.getElementById('cms-search-btn');
    const secondaryActionButton = document.getElementById('cms-secondary-action-btn');
    const primaryActionButton = document.getElementById('cms-primary-action-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });

    const TAB_CONFIG = Object.freeze({
        notices: Object.freeze({
            searchPlaceholder: '공지 제목 또는 코드 검색...',
            primaryAction: '공지 등록',
            secondaryAction: '게시 정리',
            emptyMessage: '공지사항 데이터가 없다.',
            columns: Object.freeze(['공지 ID', '도메인', '유형', '제목', '게시 / 예약일', '노출 상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'NTC-001 항공 시스템 점검 2026-03-19 active',
                    statusKey: 'active',
                    cells: [
                        '<strong>NTC-001</strong>',
                        '<span class="admin-badge neutral">항공</span>',
                        '<span class="admin-badge neutral">공지</span>',
                        '시스템 점검 안내',
                        '2026-03-19',
                        '<span class="admin-badge success">노출 중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">편집</button>'
                    ]
                },
                {
                    searchText: 'NTC-002 호텔 결제 정책 변경 2026-03-20 draft',
                    statusKey: 'draft',
                    cells: [
                        '<strong>NTC-002</strong>',
                        '<span class="admin-badge neutral">호텔</span>',
                        '<span class="admin-badge neutral">정책</span>',
                        '결제 정책 변경 공지',
                        '2026-03-20',
                        '<span class="admin-badge warning">예약됨</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">편집</button>'
                    ]
                }
            ])
        }),
        faqs: Object.freeze({
            searchPlaceholder: 'FAQ 질문 또는 코드 검색...',
            primaryAction: 'FAQ 등록',
            secondaryAction: '정렬 점검',
            emptyMessage: 'FAQ 데이터가 없다.',
            columns: Object.freeze(['FAQ ID', '도메인', '카테고리', '질문', '기준일', '노출 상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'FAQ-101 항공 수하물 2026-03-18 active',
                    statusKey: 'active',
                    cells: [
                        '<strong>FAQ-101</strong>',
                        '<span class="admin-badge neutral">항공</span>',
                        '<span class="admin-badge neutral">수하물</span>',
                        '위탁 수하물 규정은 어떻게 되나요?',
                        '2026-03-18',
                        '<span class="admin-badge success">노출 중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">편집</button>'
                    ]
                },
                {
                    searchText: 'FAQ-102 렌터카 환불 2026-03-20 draft',
                    statusKey: 'draft',
                    cells: [
                        '<strong>FAQ-102</strong>',
                        '<span class="admin-badge neutral">렌터카</span>',
                        '<span class="admin-badge neutral">환불</span>',
                        '렌터카 예약 취소는 언제까지 가능한가요?',
                        '2026-03-20',
                        '<span class="admin-badge warning">예약됨</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">편집</button>'
                    ]
                }
            ])
        }),
        banner: Object.freeze({
            searchPlaceholder: '배너 제목, 사이트, 위치 검색...',
            primaryAction: '위치/노출 설정',
            secondaryAction: '배포 정리',
            emptyMessage: '배너 데이터가 없다.',
            columns: Object.freeze(['배너 ID', '사이트 / 서비스', '위치 / 슬롯', '노출 규칙 / 조건', '제목', '노출 기간', '노출 상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'BNR-101 메인 hero 사이트 전체 top-1 로그인 전 주 1회 변경 여름 시즌 특가 2026-03-18 active',
                    statusKey: 'active',
                    cells: [
                        '<strong>BNR-101</strong>',
                        '<span class="admin-badge neutral">메인 / 전체</span>',
                        '<span class="admin-badge neutral">Hero / top-1</span>',
                        '메인 노출, 로그인 전 사용자, 주 1회 변경',
                        '여름 시즌 특가 배너',
                        '2026-03-18 ~ 2026-04-18',
                        '<span class="admin-badge success">노출 중</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">위치/조건 편집</button>'
                    ]
                },
                {
                    searchText: 'BNR-102 제주스테이 호텔 detail-bottom 객실 상세 진입 노출 공항 픽업 2026-03-21 inactive',
                    statusKey: 'inactive',
                    cells: [
                        '<strong>BNR-102</strong>',
                        '<span class="admin-badge neutral">제주스테이 / 호텔</span>',
                        '<span class="admin-badge neutral">Promo / detail-bottom</span>',
                        '호텔 상세 페이지, 객실 상세 진입 시 노출',
                        '공항 픽업 프로모션',
                        '2026-03-21 ~ 2026-04-21',
                        '<span class="admin-badge danger">비노출</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">위치/조건 편집</button>'
                    ]
                }
            ])
        })
    });

    const DEFAULT_TAB = 'notices';
    let activeTab = DEFAULT_TAB;
    let searchKeyword = '';
    let activeStatus = 'all';

    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'cms' ? 'active' : ''}" data-id="${menu.id}">
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
            const statusMatch = activeStatus === 'all' || row.statusKey === activeStatus;
            const searchMatch = !keyword || row.searchText.toLowerCase().includes(keyword);
            return statusMatch && searchMatch;
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

        if (secondaryActionButton) {
            secondaryActionButton.textContent = config.secondaryAction;
        }

        if (primaryActionButton) {
            primaryActionButton.textContent = config.primaryAction;
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
            searchKeyword = '';
            activeStatus = 'all';
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = 'all';
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

    if (statusFilter) {
        statusFilter.addEventListener('change', (event) => {
            activeStatus = event.currentTarget.value;
            renderTableBody(activeTab);
        });
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
