/**
 * @file members.js
 * @description Member / Membership / Permission management view logic.
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
                console.error('[AdminMembers] Route resolution failed:', error);
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
    const tableBody = document.getElementById('members-table-body');
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
        member: Object.freeze({
            searchPlaceholder: '회원명 또는 ID 검색...',
            primaryAction: '멤버십 등록',
            secondaryAction: '권한 점검',
            emptyMessage: '회원 데이터가 없다.',
            columns: Object.freeze(['대상', '도메인', '세부 정보', '기준 일시', '상태 / 등급', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'M-1001 김하늘 일반 회원 2026-03-18 활성',
                    cells: [
                        '<strong>M-1001 김하늘</strong><br><small style="color:var(--admin-text-secondary);">sky@jeju.example</small>',
                        '<span class="admin-badge neutral">회원</span>',
                        '가입 경로: 항공 / 최근 접속: PC',
                        '2026-03-18',
                        '<span class="admin-badge success">활성</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                },
                {
                    searchText: 'M-1002 한서준 vip 회원 2026-03-16 정지',
                    cells: [
                        '<strong>M-1002 한서준</strong><br><small style="color:var(--admin-text-secondary);">seojun@jeju.example</small>',
                        '<span class="admin-badge neutral">회원</span>',
                        '가입 경로: 숙박 / 최근 접속: Mobile',
                        '2026-03-16',
                        '<span class="admin-badge danger">정지</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                }
            ])
        }),
        membership: Object.freeze({
            searchPlaceholder: '멤버십명 또는 회원명 검색...',
            primaryAction: '멤버십 생성',
            secondaryAction: '갱신 점검',
            emptyMessage: '멤버십 데이터가 없다.',
            columns: Object.freeze(['대상', '도메인', '세부 정보', '갱신 일시', '상태 / 등급', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'GOLD-01 골드 멤버십 김하늘 2026-04-01 활성',
                    cells: [
                        '<strong>GOLD-01</strong><br><small style="color:var(--admin-text-secondary);">김하늘</small>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">멤버십</span>',
                        '골드 멤버십 / 공항 라운지',
                        '2026-04-01',
                        '<span class="admin-badge success">활성</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                },
                {
                    searchText: 'PLAT-02 플래티넘 멤버십 한서준 2026-03-28 예약',
                    cells: [
                        '<strong>PLAT-02</strong><br><small style="color:var(--admin-text-secondary);">한서준</small>',
                        '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">멤버십</span>',
                        '플래티넘 멤버십 / 우선 응대',
                        '2026-03-28',
                        '<span class="admin-badge warning">예약</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                }
            ])
        }),
        permissions: Object.freeze({
            searchPlaceholder: '권한 역할 또는 승인자 검색...',
            primaryAction: '권한 생성',
            secondaryAction: '권한 점검',
            emptyMessage: '권한 데이터가 없다.',
            columns: Object.freeze(['대상', '도메인', '세부 정보', '기준 일시', '상태 / 등급', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'ADMIN-ROOT 슈퍼 관리자 전체 도메인 2026-03-20 승인',
                    cells: [
                        '<strong>ADMIN-ROOT</strong><br><small style="color:var(--admin-text-secondary);">슈퍼 관리자</small>',
                        '<span class="admin-badge neutral">권한</span>',
                        '허용 도메인: 전체 / 승인자: 운영팀',
                        '2026-03-20',
                        '<span class="admin-badge success">승인</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                },
                {
                    searchText: 'ADMIN-FLIGHT 항공 운영 flight hotel 2026-03-21 검토',
                    cells: [
                        '<strong>ADMIN-FLIGHT</strong><br><small style="color:var(--admin-text-secondary);">항공 운영</small>',
                        '<span class="admin-badge neutral">권한</span>',
                        '허용 도메인: flight, hotel / 승인자: CS Lead',
                        '2026-03-21',
                        '<span class="admin-badge warning">검토</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                }
            ])
        }),
        inquiries: Object.freeze({
            searchPlaceholder: '문의번호 또는 문의자 검색...',
            primaryAction: '문의 상태 관리',
            secondaryAction: 'SLA 재점검',
            emptyMessage: '문의사항 데이터가 없다.',
            columns: Object.freeze(['문의 ID', '도메인', '문의 요약', '접수 일시', '처리 상태', '관리']),
            rows: Object.freeze([
                {
                    searchText: 'QNA-301 결제 문의 예약 김하늘 2026-03-18 대기',
                    cells: [
                        '<strong>QNA-301</strong><br><small style="color:var(--admin-text-secondary);">김하늘</small>',
                        '<span class="admin-badge neutral">예약</span>',
                        '결제 승인 지연 문의 / 담당: CS Team A',
                        '2026-03-18',
                        '<span class="admin-badge warning">답변 대기</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                },
                {
                    searchText: 'QNA-302 수하물 규정 항공 박지민 2026-03-12 완료',
                    cells: [
                        '<strong>QNA-302</strong><br><small style="color:var(--admin-text-secondary);">박지민</small>',
                        '<span class="admin-badge neutral">항공</span>',
                        '수하물 규정 안내 요청 / 담당: CS Team B',
                        '2026-03-12',
                        '<span class="admin-badge success">처리 완료</span>',
                        '<button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">보기</button>'
                    ]
                }
            ])
        })
    });

    const DEFAULT_TAB = 'member';
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
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'members' ? 'active' : ''}" data-id="${menu.id}">
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
        const rows = config.rows.filter((row) => !keyword || row.searchText.toLowerCase().includes(keyword));

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
