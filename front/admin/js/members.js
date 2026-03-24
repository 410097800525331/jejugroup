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

    const membersDataModule = await import('../data/members-config.js');
    const TAB_CONFIG = Object.freeze(membersDataModule.default ?? membersDataModule.MEMBERS_TAB_CONFIG ?? membersDataModule.tabConfig ?? {});
    const DEFAULT_TAB = membersDataModule.DEFAULT_TAB ?? membersDataModule.defaultTab ?? 'member';

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
