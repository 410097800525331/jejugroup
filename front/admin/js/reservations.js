/**
 * @file reservations.js
 * @description Reservation Management View logic. Domains are synced with Store.
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
                console.error('[AdminReservations] Route resolution failed:', error);
                window.location.replace(window.location.origin + '/');
            });
    };

    const session = window.AdminSession;
    if (!session || !session.role) return;

    // DOM Elements
    const sidebarMenuContainer = document.getElementById('admin-sidebar-menu');
    const userRoleEl = document.getElementById('admin-user-role');
    const userNameEl = document.getElementById('admin-user-name');
    const sidebarToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const layout = document.querySelector('.admin-layout');
    const domainFilters = document.querySelectorAll('.segment-btn');
    const tableBody = document.getElementById('reservations-table-body');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // MOCK DATA FACTORY (Immutability enforced via creating new arrays)
    const MOCK_RESERVATIONS = Object.freeze([
        { id: 'REV-001', domain: 'hotel', title: '신라호텔 제주 2박', name: '김태형', phone: '010-1234-5678', price: 850000, date: '2026-02-20', status: 'CONFIRMED' },
        { id: 'REV-002', domain: 'flight', title: '제주항공 GMP-CJU 편도', name: '박지민', phone: '010-9876-5432', price: 45000, date: '2026-02-19', status: 'PENDING' },
        { id: 'REV-003', domain: 'rentcar', title: '스타렌터카 제네시스 G80', name: '이도현', phone: '010-1111-2222', price: 125000, date: '2026-02-18', status: 'CANCELED' },
        { id: 'REV-004', domain: 'hotel', title: '롯데호텔 제주 풀빌라', name: '전정국', phone: '010-3333-4444', price: 1200000, date: '2026-02-18', status: 'CONFIRMED' },
        { id: 'REV-005', domain: 'flight', title: '대한항공 GMP-CJU 왕복', name: '최연준', phone: '010-5555-6666', price: 155000, date: '2026-02-17', status: 'CONFIRMED' }
    ]);

    // RENDER LOGIC (Pure pure functions)
    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map(menu => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'reservations' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'CONFIRMED': return '<span class="admin-badge success">결제완료</span>';
            case 'PENDING': return '<span class="admin-badge warning">결제대기</span>';
            case 'CANCELED': return '<span class="admin-badge danger">환불/취소</span>';
            default: return '<span class="admin-badge neutral">-</span>';
        }
    };

    const getDomainBadge = (domain) => {
        switch(domain) {
            case 'hotel': return '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">스테이</span>';
            case 'flight': return '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">에어</span>';
            case 'rentcar': return '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>';
            default: return '';
        }
    };

    const renderTable = (domain) => {
        const filtered = domain === 'all' 
            ? MOCK_RESERVATIONS 
            : MOCK_RESERVATIONS.filter(item => item.domain === domain);
        
        if (filtered.length === 0) {
            return `<tr><td colspan="8" style="text-align:center; padding: 40px;">해당 부문의 예약 내역이 없습니다.</td></tr>`;
        }

        return filtered.map(item => `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>${getDomainBadge(item.domain)}</td>
                <td>${item.title}</td>
                <td>${item.name} <br> <small style="color:var(--admin-text-secondary);">${item.phone}</small></td>
                <td>₩${item.price.toLocaleString('ko-KR')}</td>
                <td style="color:var(--admin-text-secondary);">${item.date}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">상세</button>
                    ${item.status !== 'CANCELED' ? `<button class="admin-btn" style="padding: 4px 8px; font-size: 0.75rem; background:var(--admin-danger); color:white; border:none;">취소</button>` : ''}
                </td>
            </tr>
        `).join('');
    };

    // MOUNT & BIND
    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    // EVENT LISTENERS
    domainFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const domain = e.currentTarget.dataset.domain;
            domainFilters.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: domain });
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

    // SUBSCRIPTION
    AdminStore.subscribe((newState) => {
        // Layout Sync
        if (sidebar && layout) {
            if (window.innerWidth > 1024) {
                if (newState.ui.sidebarOpen) layout.classList.remove('sidebar-collapsed');
                else layout.classList.add('sidebar-collapsed');
            } else {
                if (newState.ui.sidebarOpen) sidebar.classList.add('open');
                else sidebar.classList.remove('open');
            }
        }
        
        // Theme Sync
        updateThemeDOM(newState.ui.theme);

        // Domain Table Sync
        if (tableBody) {
            tableBody.innerHTML = renderTable(newState.ui.domain);
        }
    });

    // INIT
    const initialState = AdminStore.getState();
    updateThemeDOM(initialState.ui.theme);
    if (tableBody) tableBody.innerHTML = renderTable(initialState.ui.domain);
});
