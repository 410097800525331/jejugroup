/**
 * @file lodging.js
 * @description Product/Inventory Management View logic. Domains are synced with Store.
 */

 document.addEventListener('DOMContentLoaded', () => {
    'use strict';

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
    const tableBody = document.getElementById('inventory-table-body');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // MOCK DATA FACTORY
    const MOCK_INVENTORY = Object.freeze([
        { id: 'INV-H01', domain: 'hotel', title: '신라호텔 제주 - 스탠다드 트윈', price: 350000, stock: 12, status: 'OPEN' },
        { id: 'INV-H02', domain: 'hotel', title: '파르나스 호텔 제주 - 풀빌라', price: 1200000, stock: 0, status: 'SOLD_OUT' },
        { id: 'INV-F01', domain: 'flight', title: '제주항공 7C141 (GMP-CJU)', price: 45000, stock: 45, status: 'OPEN' },
        { id: 'INV-R01', domain: 'rentcar', title: '스타렌터카 - 아이오닉 5 롱레인지', price: 95000, stock: 3, status: 'WARNING' },
        { id: 'INV-F02', domain: 'flight', title: '대한항공 KE1231 (CJU-GMP)', price: 85000, stock: 2, status: 'WARNING' },
        { id: 'INV-R02', domain: 'rentcar', title: '무지개렌터카 - 카니발 9인승', price: 155000, stock: 1, status: 'WARNING' }
    ]);

    // RENDER LOGIC
    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map(menu => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'lodging' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'OPEN': return '<span class="admin-badge success">판매중</span>';
            case 'WARNING': return '<span class="admin-badge warning">품절 임박</span>';
            case 'SOLD_OUT': return '<span class="admin-badge danger">판매 완료 (품절)</span>';
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
            ? MOCK_INVENTORY 
            : MOCK_INVENTORY.filter(item => item.domain === domain);
        
        if (filtered.length === 0) {
            return `<tr><td colspan="7" style="text-align:center; padding: 40px;">해당 분류의 재고 데이터가 없습니다.</td></tr>`;
        }

        return filtered.map(item => `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>${getDomainBadge(item.domain)}</td>
                <td>${item.title}</td>
                <td>₩${item.price.toLocaleString('ko-KR')}</td>
                <td style="font-weight:bold; color: ${item.stock < 5 ? 'var(--admin-danger)' : 'var(--admin-text-primary)'}">${item.stock} 개</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">재고 수정</button>
                    <button class="admin-btn" style="padding: 4px 8px; font-size: 0.75rem; background:var(--admin-surface-hover); color:var(--admin-text-primary); border:1px solid var(--admin-border);">상세</button>
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
            window.location.replace('../../index.html');
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

        if (tableBody) {
            tableBody.innerHTML = renderTable(newState.ui.domain);
        }
    });

    // INIT
    const initialState = AdminStore.getState();
    updateThemeDOM(initialState.ui.theme);
    if (tableBody) tableBody.innerHTML = renderTable(initialState.ui.domain);
});
