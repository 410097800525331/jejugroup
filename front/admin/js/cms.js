/**
 * @file cms.js
 * @description CMS Management View logic. Domains are synced with Store.
 */

 document.addEventListener('DOMContentLoaded', () => {
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
                window.location.replace(window.location.origin + '/');
            });
    };

    const session = window.AdminSession;
    if (!session || !session.role) return;

    // DOM
    const sidebarMenuContainer = document.getElementById('admin-sidebar-menu');
    const userRoleEl = document.getElementById('admin-user-role');
    const userNameEl = document.getElementById('admin-user-name');
    const sidebarToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const layout = document.querySelector('.admin-layout');
    const domainFilters = document.querySelectorAll('.segment-btn');
    const tableBody = document.getElementById('cms-table-body');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // MOCK DATA FACTORY
    const MOCK_CMS_RECORDS = Object.freeze([
        { id: 'CON-001', domain: 'hotel', type: 'BANNER', title: '여름 시즌 풀빌라 얼리버드 특가 한정판', date: '2026-02-19', status: 'ACTIVE' },
        { id: 'CON-002', domain: 'flight', type: 'NOTICE', title: '[공지] 악기류 기내 반입 규정 변동 안내', date: '2026-02-15', status: 'ACTIVE' },
        { id: 'CON-003', domain: 'rentcar', type: 'EVENT', title: '렌터카 전기차 대여 시 충전 무료 이벤트', date: '2026-02-10', status: 'INACTIVE' },
        { id: 'CON-004', domain: 'all', type: 'POPUP', title: '시스템 정기 임시 점검 안내', date: '2026-03-01', status: 'DRAFT' },
        { id: 'CON-005', domain: 'hotel', type: 'NOTICE', title: '어메니티 규제 법안에 따른 칫솔 미제공 안내', date: '2026-01-20', status: 'ACTIVE' }
    ]);

    // RENDER LOGIC
    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map(menu => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'cms' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'ACTIVE': return '<span class="admin-badge success">노출 중 (ON)</span>';
            case 'INACTIVE': return '<span class="admin-badge danger">비노출 (OFF)</span>';
            case 'DRAFT': return '<span class="admin-badge warning">예약됨 / 임시저장</span>';
            default: return '<span class="admin-badge neutral">-</span>';
        }
    };

    const getTypeBadge = (type) => {
        switch(type) {
            case 'BANNER': return '<span class="admin-badge info" style="border: 1px solid var(--admin-glass-border);">메인 배너</span>';
            case 'NOTICE': return '<span class="admin-badge neutral" style="border: 1px solid var(--admin-glass-border);">공지사항</span>';
            case 'EVENT': return '<span class="admin-badge" style="background:rgba(230, 126, 34, 0.2); color:hsl(28, 90%, 55%); border: 1px solid var(--admin-glass-border);">이벤트</span>';
            case 'POPUP': return '<span class="admin-badge danger" style="border: 1px solid var(--admin-danger);">팝업</span>';
            default: return '<span class="admin-badge neutral">-</span>';
        }
    };

    const getDomainBadge = (domain) => {
        switch(domain) {
            case 'hotel': return '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">스테이 별도 노출</span>';
            case 'flight': return '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">에어 별도 노출</span>';
            case 'rentcar': return '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카 별도 노출</span>';
            case 'all': return '<span class="admin-badge info" style="background:rgba(0,184,148,0.1); color:#00b894; border:1px solid #00b894;">메인 전역 노출</span>';
            default: return '';
        }
    };

    const renderTable = (domain) => {
        const filtered = domain === 'all' 
            ? MOCK_CMS_RECORDS 
            : MOCK_CMS_RECORDS.filter(item => item.domain === domain || item.domain === 'all'); // Global items always visible
        
        if (filtered.length === 0) {
            return `<tr><td colspan="7" style="text-align:center; padding: 40px;">해당 분류의 콘텐츠 내역이 없습니다.</td></tr>`;
        }

        return filtered.map(item => `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>${getDomainBadge(item.domain)}</td>
                <td>${getTypeBadge(item.type)}</td>
                <td>${item.title}</td>
                <td style="color:var(--admin-text-secondary);">${item.date}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">에디터 호출</button>
                    <button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem; color:var(--admin-danger); border-color:var(--admin-danger);">삭제</button>
                </td>
            </tr>
        `).join('');
    };

    // MOUNT & BIND
    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    domainFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const domain = e.currentTarget.dataset.domain;
            domainFilters.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: domain });
        });
    });

    if (sidebarToggle) sidebarToggle.addEventListener('click', () => AdminStore.dispatch({ type: 'UI/TOGGLE_SIDEBAR' }));

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userSession');
            redirectByRoute('HOME');
        });
    }

    if (profileTrigger && profileContainer) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileContainer.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target)) profileContainer.classList.remove('active');
        });
    }

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            langBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedTheme = e.currentTarget.dataset.theme;
            localStorage.setItem('adminTheme', selectedTheme);
            AdminStore.dispatch({ type: 'UI/SET_THEME', payload: selectedTheme });
        });
    });

    const updateThemeDOM = (theme) => {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
        document.body.setAttribute('data-theme', activeTheme);
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    };

    AdminStore.subscribe((newState) => {
        if (sidebar && layout) {
            if (window.innerWidth > 1024) {
                if (newState.ui.sidebarOpen) layout.classList.remove('sidebar-collapsed');
                else layout.classList.add('sidebar-collapsed');
            } else {
                if (newState.ui.sidebarOpen) sidebar.classList.add('open');
                else sidebar.classList.remove('open');
            }
        }
        
        updateThemeDOM(newState.ui.theme);

        if (tableBody) tableBody.innerHTML = renderTable(newState.ui.domain);
    });

    const initialState = AdminStore.getState();
    updateThemeDOM(initialState.ui.theme);
    if (tableBody) tableBody.innerHTML = renderTable(initialState.ui.domain);
});
