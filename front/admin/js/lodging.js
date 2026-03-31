/**
 * @file lodging.js
 * @description Product management view logic.
 */

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const { default: lodgingConfig } = await import('../data/lodging-config.js');
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

    const TAB_CONFIG = lodgingConfig.tabs ?? {};
    const DEFAULT_TAB = TAB_CONFIG[lodgingConfig.defaultTab] ? lodgingConfig.defaultTab : (tabButtons[0]?.dataset.domain ?? 'stay');
    const NO_RESULTS_MESSAGE = '검색 결과가 없습니다.';

    let surfaceConfig = {
        defaultTab: DEFAULT_TAB,
        tabs: TAB_CONFIG
    };
    let activeTab = DEFAULT_TAB;
    let searchKeyword = '';
    let isLoadingSurface = true;

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

    const getRowCells = (row) => {
        if (Array.isArray(row)) {
            return row;
        }

        if (!row || typeof row !== 'object') {
            return [row];
        }

        if (Array.isArray(row.cells)) return row.cells;
        if (Array.isArray(row.values)) return row.values;
        if (Array.isArray(row.columns)) return row.columns;
        if (Array.isArray(row.items)) return row.items;
        if (Array.isArray(row.row)) return row.row;

        return [
            row.code,
            row.domain,
            row.name,
            row.title,
            row.option,
            row.inventory,
            row.stock,
            row.price,
            row.status,
            row.imagePath
        ].filter((item) => item != null && item !== '');
    };

    const normalizeRow = (row) => {
        if (row == null) {
            return null;
        }

        const rawCells = getRowCells(row);
        const cells = rawCells.map((cell) => escapeHtml(extractText(cell)));
        const searchText = extractText(row?.searchText) || rawCells.map(extractText).join(' ');

        return {
            ...((row && typeof row === 'object') ? row : {}),
            cells,
            searchText: searchText.trim().toLowerCase()
        };
    };

    const getTabRowSource = (tabPayload) => {
        if (Array.isArray(tabPayload)) {
            return tabPayload;
        }

        if (!tabPayload || typeof tabPayload !== 'object') {
            return [];
        }

        const candidateRows = [
            tabPayload.rows,
            tabPayload.items,
            tabPayload.data,
            tabPayload.list,
            tabPayload.records
        ];

        for (const candidate of candidateRows) {
            if (Array.isArray(candidate)) {
                return candidate;
            }
        }

        return [];
    };

    const normalizeTabConfig = (tabKey, tabPayload = {}) => {
        const fallback = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB] ?? {};
        const payloadObject = tabPayload && typeof tabPayload === 'object' && !Array.isArray(tabPayload) ? tabPayload : {};
        const payloadRows = getTabRowSource(tabPayload).map(normalizeRow).filter(Boolean);
        const columns = Array.isArray(payloadObject.columns) && payloadObject.columns.length
            ? payloadObject.columns.map((column) => extractText(column))
            : Array.isArray(fallback.columns) ? fallback.columns : [];

        return {
            ...fallback,
            ...payloadObject,
            columns,
            rows: payloadRows,
            searchPlaceholder: extractText(payloadObject.searchPlaceholder) || fallback.searchPlaceholder || '',
            primaryAction: extractText(payloadObject.primaryAction) || fallback.primaryAction || '',
            secondaryAction: extractText(payloadObject.secondaryAction) || fallback.secondaryAction || '',
            emptyMessage: extractText(payloadObject.emptyMessage) || fallback.emptyMessage || lodgingConfig.errorMessage
        };
    };

    const normalizeSurfaceConfig = (payload = {}) => {
        const payloadTabs = payload.tabs && typeof payload.tabs === 'object' ? payload.tabs : payload;
        const knownTabKeys = new Set([
            ...Array.from(tabButtons, (button) => button.dataset.domain),
            ...Object.keys(TAB_CONFIG)
        ]);
        const orderedTabKeys = [
            ...knownTabKeys,
            ...Object.keys(payloadTabs ?? {})
        ].filter((tabKey, index, list) => {
            if (!tabKey || list.indexOf(tabKey) !== index) {
                return false;
            }

            if (knownTabKeys.has(tabKey)) {
                return true;
            }

            const payloadTab = payloadTabs?.[tabKey];
            return payloadTab && typeof payloadTab === 'object' && !Array.isArray(payloadTab);
        });

        const tabs = {};
        orderedTabKeys.forEach((tabKey) => {
            const tabPayload = payloadTabs && typeof payloadTabs === 'object' ? payloadTabs[tabKey] : undefined;
            tabs[tabKey] = normalizeTabConfig(tabKey, tabPayload ?? {});
        });

        const nextDefaultTab = tabs[payload.defaultTab] ? payload.defaultTab : DEFAULT_TAB;
        return {
            defaultTab: nextDefaultTab,
            tabs
        };
    };

    const getTabConfig = (tabKey) => surfaceConfig.tabs[tabKey] ?? surfaceConfig.tabs[surfaceConfig.defaultTab] ?? TAB_CONFIG[DEFAULT_TAB];

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG?.getAccessibleMenus?.(role) ?? [];
        return accessibleMenus.map((menu) => `
            <a href="${escapeHtml(menu.path)}" class="admin-menu-item ${menu.id === 'lodging' ? 'active' : ''}" data-id="${escapeHtml(menu.id)}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${escapeHtml(menu.label)}</span>
            </a>
        `).join('');
    };

    const renderTableHead = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableHeadRow) return;
        tableHeadRow.innerHTML = (config.columns ?? []).map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    };

    const renderTableBody = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableBody) return;

        const keyword = searchKeyword.trim().toLowerCase();
        const rows = (config.rows ?? []).filter((row) => !keyword || row.searchText.includes(keyword));
        const colspan = Math.max((config.columns ?? []).length, 1);

        if (isLoadingSurface && rows.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding: 40px;">${escapeHtml(lodgingConfig.loadingMessage)}</td></tr>`;
            return;
        }

        if (rows.length === 0) {
            const emptyMessage = keyword ? NO_RESULTS_MESSAGE : (config.emptyMessage || lodgingConfig.errorMessage);
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
            searchInput.placeholder = config.searchPlaceholder || '';
        }

        if (actionButtons.length >= 3) {
            actionButtons[0].textContent = lodgingConfig.searchButtonLabel;
            actionButtons[1].textContent = config.secondaryAction || '';
            actionButtons[2].textContent = config.primaryAction || '';
        }

        if (searchButton) {
            searchButton.textContent = lodgingConfig.searchButtonLabel;
        }
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

    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (window.AdminStore?.dispatch) {
                window.AdminStore.dispatch({ type: 'UI/TOGGLE_SIDEBAR' });
            }
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
            if (!profileContainer.contains(event.target)) {
                profileContainer.classList.remove('active');
            }
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
            if (window.AdminStore?.dispatch) {
                window.AdminStore.dispatch({ type: 'UI/SET_THEME', payload: selectedTheme });
            }
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
        syncSidebarUI(newState.ui?.sidebarOpen);
        updateThemeDOM(newState.ui?.theme);
        setActiveTab(newState.ui?.domain);
    });
    if (typeof unsubscribe === 'function') {
        // 상태 구독 해제는 페이지 수명 종료 시 정리됨.
        window.addEventListener('beforeunload', unsubscribe, { once: true });
    }

    const initialState = window.AdminStore?.getState?.() ?? { ui: {} };
    syncSidebarUI(initialState.ui?.sidebarOpen);
    updateThemeDOM(initialState.ui?.theme);
    setActiveTab(TAB_CONFIG[initialState.ui?.domain] ? initialState.ui.domain : DEFAULT_TAB);

    tabButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            searchKeyword = '';
            if (searchInput) {
                searchInput.value = '';
            }

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

    window.addEventListener('resize', () => {
        syncSidebarUI(window.AdminStore?.getState?.()?.ui?.sidebarOpen);
    });

    const loadLodgingSurface = async () => {
        isLoadingSurface = true;
        renderTableHead(activeTab);
        renderTableBody(activeTab);

        try {
            const adminApiClient = await ensureAdminApiClient();
            if (!adminApiClient?.fetchAdminPayload) {
                throw new Error('Admin API client is unavailable');
            }

            const payload = await adminApiClient.fetchAdminPayload(lodgingConfig.surfaceEndpoint);
            if (!payload || typeof payload !== 'object') {
                throw new Error('Admin lodging payload was empty');
            }

            surfaceConfig = normalizeSurfaceConfig(payload);
        } catch (error) {
            console.warn('[AdminLodging] Failed to hydrate lodging surface:', error);
            surfaceConfig = normalizeSurfaceConfig({
                defaultTab: DEFAULT_TAB,
                tabs: TAB_CONFIG
            });
        } finally {
            isLoadingSurface = false;
            setActiveTab(activeTab);
        }
    };

    await loadLodgingSurface();
});
