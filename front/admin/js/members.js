/**
 * @file members.js
 * @description Member / CS Management View logic. Domains are synced with Store.
 */

 document.addEventListener('DOMContentLoaded', () => {
    'use strict';

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
    const tableBody = document.getElementById('members-table-body');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // MOCK DATA FACTORY
    const MOCK_CS_RECORDS = Object.freeze([
        { user: '오해원', id: 'haewon@nmixx.com', domain: 'hotel', tier: 'VIP', summary: '수영장 이용 시간 관련 문의', date: '2026-02-20', status: 'WAITING' },
        { user: '안유진', id: 'yujin@ive.com', domain: 'flight', tier: 'REGULAR', summary: '비행기 수하물 규정 안내 요청', date: '2026-02-19', status: 'DONE' },
        { user: '장원영', id: 'wonyoung@ive.com', domain: 'hotel', tier: 'VVIP', summary: '스위트룸 업그레이드 가능 여부', date: '2026-02-19', status: 'WAITING' },
        { user: '김채원', id: 'chaewon@lesserafim.com', domain: 'rentcar', tier: 'REGULAR', summary: '렌터카 반납 지연 시 요금표', date: '2026-02-18', status: 'DONE' },
        { user: '카리나', id: 'karina@aespa.com', domain: 'flight', tier: 'VIP', summary: '좌석 변경 오류 컴플레인', date: '2026-02-18', status: 'WAITING' },
        { user: '설윤', id: 'sullyoon@nmixx.com', domain: 'general', tier: 'REGULAR', summary: '사이트 계정 연동 오류', date: '2026-02-17', status: 'DONE' }
    ]);

    // RENDER LOGIC
    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map(menu => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'members' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'WAITING': return '<span class="admin-badge warning">답변 대기</span>';
            case 'DONE': return '<span class="admin-badge success">처리 완료</span>';
            default: return '<span class="admin-badge neutral">-</span>';
        }
    };

    const getTierBadge = (tier) => {
        switch(tier) {
            case 'VVIP': return '<span class="admin-badge" style="background:linear-gradient(135deg, #111, #444); color:gold; border:1px solid gold;">VVIP</span>';
            case 'VIP': return '<span class="admin-badge info" style="background:rgba(85,239,196,0.1); color:#00b894; border:1px solid #00b894;">VIP</span>';
            default: return '<span class="admin-badge neutral">일반</span>';
        }
    };

    const getDomainBadge = (domain) => {
        switch(domain) {
            case 'hotel': return '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">스테이</span>';
            case 'flight': return '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">에어</span>';
            case 'rentcar': return '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>';
            case 'general': return '<span class="admin-badge neutral">공통</span>';
            default: return '';
        }
    };

    const renderTable = (domain) => {
        const filtered = domain === 'all' 
            ? MOCK_CS_RECORDS 
            : MOCK_CS_RECORDS.filter(item => item.domain === domain);
        
        if (filtered.length === 0) {
            return `<tr><td colspan="7" style="text-align:center; padding: 40px;">해당 분류의 CS 접수 내역이 없습니다.</td></tr>`;
        }

        return filtered.map(item => `
            <tr>
                <td><strong>${item.user}</strong><br><small style="color:var(--admin-text-secondary);">${item.id}</small></td>
                <td>${getDomainBadge(item.domain)}</td>
                <td>${getTierBadge(item.tier)}</td>
                <td>${item.summary}</td>
                <td style="color:var(--admin-text-secondary);">${item.date}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <button class="admin-btn admin-btn-primary" style="padding: 4px 8px; font-size: 0.75rem;">답변 달기</button>
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
            window.location.replace('/index.html');
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
