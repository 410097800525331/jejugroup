/**
 * @file reservations.js
 * @description Reservation / payment / refund / traveler management view logic.
 */

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const { default: reservationsConfig } = await import('../data/reservations-config.js');
    const routeResolverPromise = import('../../core/utils/path_resolver.js');

    const ensureAdminApiClient = async () => {
        if (window.AdminApiClient?.fetchAdminPayload) {
            return window.AdminApiClient;
        }

        await import('../js/api_client.js');
        return window.AdminApiClient;
    };

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
    const TAB_CONFIG = reservationsConfig.tabs ?? {};
    const DEFAULT_TAB = TAB_CONFIG[reservationsConfig.defaultTab]
        ? reservationsConfig.defaultTab
        : (tabButtons[0]?.dataset.domain ?? 'booking');
    const NO_RESULTS_MESSAGE = '검색 결과가 없습니다.';
    let surfaceConfig = {
        defaultTab: DEFAULT_TAB,
        tabs: TAB_CONFIG
    };
    let activeDomainKey = 'all';
    let activeTab = DEFAULT_TAB;
    let searchKeyword = '';
    let surfaceState = 'loading';

    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const extractText = (value) => {
        if (value == null) {
            return '';
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }

        if (Array.isArray(value)) {
            return value.map(extractText).filter(Boolean).join(' ');
        }

        if (typeof value === 'object') {
            return extractText(
                value.formatted
                ?? value.display
                ?? value.text
                ?? value.label
                ?? value.value
                ?? value.title
                ?? value.name
                ?? value.code
                ?? value.status
                ?? value.path
                ?? value.src
                ?? value.url
                ?? value.href
                ?? value.amount
                ?? ''
            );
        }

        return '';
    };

    const normalizeRow = (row) => {
        if (!row || typeof row !== 'object') {
            return null;
        }

        const rawCells = Array.isArray(row.cells) ? row.cells : [];
        const cells = rawCells.map((cell) => escapeHtml(extractText(cell)));
        const searchText = extractText(row.searchText) || rawCells.map(extractText).join(' ');

        return {
            ...row,
            cells,
            domainKey: extractText(row.domainKey).trim().toLowerCase(),
            searchText: searchText.trim().toLowerCase()
        };
    };

    const normalizeTabConfig = (tabKey, tabPayload = {}) => {
        const fallback = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB] ?? {};
        const payloadObject = tabPayload && typeof tabPayload === 'object' && !Array.isArray(tabPayload) ? tabPayload : {};
        const payloadRows = Array.isArray(payloadObject.rows)
            ? payloadObject.rows.map(normalizeRow).filter(Boolean)
            : [];
        const columns = Array.isArray(payloadObject.columns) && payloadObject.columns.length
            ? payloadObject.columns.map((column) => extractText(column))
            : (Array.isArray(fallback.columns) ? fallback.columns : []);

        return {
            ...fallback,
            ...payloadObject,
            columns,
            rows: payloadRows,
            searchPlaceholder: extractText(payloadObject.searchPlaceholder) || fallback.searchPlaceholder || '',
            primaryAction: extractText(payloadObject.primaryAction) || fallback.primaryAction || '',
            secondaryAction: extractText(payloadObject.secondaryAction) || fallback.secondaryAction || '',
            emptyMessage: extractText(payloadObject.emptyMessage) || fallback.emptyMessage || reservationsConfig.errorMessage
        };
    };

    const normalizeSurfaceConfig = (payload = {}) => {
        const payloadTabs = payload.tabs && typeof payload.tabs === 'object' ? payload.tabs : {};
        const orderedTabKeys = [
            ...Array.from(tabButtons, (button) => button.dataset.domain),
            ...Object.keys(TAB_CONFIG)
        ].filter((tabKey, index, list) => tabKey && list.indexOf(tabKey) === index);

        const tabs = {};
        orderedTabKeys.forEach((tabKey) => {
            const bookingOnlyPayload = tabKey === 'booking' ? payloadTabs.booking : {};
            tabs[tabKey] = normalizeTabConfig(tabKey, bookingOnlyPayload);
        });

        return {
            defaultTab: tabs.booking ? 'booking' : DEFAULT_TAB,
            tabs
        };
    };

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'reservations' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const getTabConfig = (tabKey) => surfaceConfig.tabs[tabKey] ?? surfaceConfig.tabs[surfaceConfig.defaultTab] ?? TAB_CONFIG[DEFAULT_TAB];

    const renderTableHead = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableHeadRow) return;
        tableHeadRow.innerHTML = config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    };

    const renderTableBody = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableBody) return;

        const keyword = searchKeyword.trim().toLowerCase();
        const rows = (config.rows ?? []).filter((row) => {
            const domainMatch = activeDomainKey === 'all'
                || !row.domainKey
                || row.domainKey === activeDomainKey;
            const searchMatch = !keyword || row.searchText.toLowerCase().includes(keyword);
            return domainMatch && searchMatch;
        });
        const colspan = Math.max(config.columns.length, 1);
        const emptyMessage = tabKey === 'booking' && surfaceState === 'loading'
            ? reservationsConfig.loadingMessage
            : tabKey === 'booking' && surfaceState === 'error'
                ? reservationsConfig.errorMessage
                : keyword
                    ? NO_RESULTS_MESSAGE
                    : config.emptyMessage;

        if (rows.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding: 40px;">${escapeHtml(emptyMessage)}</td></tr>`;
            return;
        }

        tableBody.innerHTML = rows.map((row) => `
            <tr>
                ${row.cells.map((cell) => `<td>${cell}</td>`).join('')}
            </tr>
        `).join('');
    };

    const syncActionBar = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (searchInput) {
            searchInput.placeholder = config.searchPlaceholder;
        }

        if (searchButton) {
            searchButton.textContent = reservationsConfig.searchButtonLabel;
        }

        if (actionButtons.length >= 2) {
            actionButtons[0].textContent = config.secondaryAction;
            actionButtons[1].textContent = config.primaryAction;
        }
    };

    const syncDomainFilters = () => {
        domainFilterButtons.forEach((button) => {
            const filterMeta = reservationsConfig.domainFilters.find((item) => item.key === button.dataset.domainKey);
            if (filterMeta) {
                button.textContent = filterMeta.label;
            }
            button.classList.toggle('active', button.dataset.domainKey === activeDomainKey);
        });
    };

    const setActiveTab = (tabKey) => {
        activeTab = surfaceConfig.tabs[tabKey] ? tabKey : surfaceConfig.defaultTab;
        tabButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.domain === activeTab);
        });
        syncActionBar(activeTab);
        renderTableHead(activeTab);
        renderTableBody(activeTab);
    };

    const setDomain = (tabKey) => {
        if (window.AdminStore?.dispatch) {
            window.AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: tabKey });
            return;
        }

        setActiveTab(tabKey);
    };

    const loadReservationsSurface = async () => {
        surfaceState = 'loading';
        renderTableHead(activeTab);
        renderTableBody(activeTab);

        try {
            const adminApiClient = await ensureAdminApiClient();
            if (!adminApiClient?.fetchAdminPayload) {
                throw new Error('Admin API client is unavailable');
            }

            const payload = await adminApiClient.fetchAdminPayload(reservationsConfig.surfaceEndpoint);
            if (!payload || typeof payload !== 'object') {
                throw new Error('Admin reservations payload was empty');
            }

            surfaceConfig = normalizeSurfaceConfig(payload);
            surfaceState = 'ready';
        } catch (error) {
            console.warn('[AdminReservations] Failed to hydrate booking tab from admin surface:', error);
            surfaceConfig = normalizeSurfaceConfig({
                defaultTab: DEFAULT_TAB,
                tabs: TAB_CONFIG
            });
            surfaceState = 'error';
        } finally {
            setActiveTab(activeTab);
        }
    };

    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    tabButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            searchKeyword = '';
            if (searchInput) searchInput.value = '';
            setDomain(event.currentTarget.dataset.domain);
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
            window.AdminStore?.dispatch?.({ type: 'UI/SET_THEME', payload: selectedTheme });
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

    const unsubscribe = window.AdminStore?.subscribe?.((newState) => {
        syncSidebarUI(newState.ui.sidebarOpen);
        updateThemeDOM(newState.ui.theme);
        setActiveTab(newState.ui.domain);
    });
    if (typeof unsubscribe === 'function') {
        window.addEventListener('beforeunload', unsubscribe, { once: true });
    }

    const initialState = window.AdminStore?.getState?.() ?? { ui: {} };
    syncSidebarUI(initialState.ui.sidebarOpen);
    updateThemeDOM(initialState.ui.theme);
    setActiveTab(TAB_CONFIG[initialState.ui.domain] ? initialState.ui.domain : DEFAULT_TAB);
    syncDomainFilters();
    await loadReservationsSurface();
    window.addEventListener('resize', () => syncSidebarUI(window.AdminStore?.getState?.()?.ui?.sidebarOpen));
});
