/**
 * @file members.js
 * @description Member / Membership / Permission management view logic.
 */

(() => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const membersConfigPromise = import('../data/members-config.js');

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
                console.error('[AdminMembers] Route resolution failed:', error);
                const fallback = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('index.html', window.location.href).href;
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(fallback, 'admin-route-fallback');
                    return;
                }
                window.location.replace(fallback);
            });
    };

    const createCleanupBag = () => {
        const callbacks = [];
        return {
            add(callback) {
                if (typeof callback === 'function') {
                    callbacks.push(callback);
                }
            },
            run() {
                while (callbacks.length) {
                    const callback = callbacks.pop();
                    try {
                        callback();
                    } catch (error) {
                        console.warn('[AdminMembers] Cleanup failed:', error);
                    }
                }
            }
        };
    };

    const createMembersPage = async ({ root = document, enableSharedChrome = false } = {}) => {
        const scope = root && typeof root.querySelector === 'function' ? root : document;
        const session = await window.AdminAuth?.waitForAdminSession?.();
        if (!session || !session.role) {
            return () => {};
        }

        const { default: membersConfig } = await membersConfigPromise;
        const cleanup = createCleanupBag();
        const tabOrder = Array.from(scope.querySelectorAll('.segment-btn'))
            .map((button) => button.dataset.domain)
            .filter(Boolean);
        const fallbackTabs = membersConfig.tabs ?? {};
        const defaultTab = fallbackTabs[membersConfig.defaultTab] ? membersConfig.defaultTab : (tabOrder[0] ?? 'member');

        const sharedScope = document;
        const sidebarMenuContainer = enableSharedChrome ? sharedScope.getElementById('admin-sidebar-menu') : null;
        const userRoleEl = enableSharedChrome ? sharedScope.getElementById('admin-user-role') : null;
        const userNameEl = enableSharedChrome ? sharedScope.getElementById('admin-user-name') : null;
        const sidebarToggle = enableSharedChrome ? sharedScope.getElementById('admin-sidebar-toggle') : null;
        const sidebar = enableSharedChrome ? sharedScope.getElementById('admin-sidebar') : null;
        const layout = enableSharedChrome ? sharedScope.querySelector('.admin-layout') : null;
        const themeBtns = enableSharedChrome ? sharedScope.querySelectorAll('.theme-btn') : [];
        const profileTrigger = enableSharedChrome ? sharedScope.getElementById('admin-profile-trigger') : null;
        const profileContainer = enableSharedChrome ? sharedScope.getElementById('admin-profile-container') : null;
        const logoutBtn = enableSharedChrome ? sharedScope.getElementById('admin-logout-btn') : null;
        const tabButtons = scope.querySelectorAll('.segment-btn');
        const tableBody = scope.getElementById('members-table-body');
        const tableHeadRow = scope.querySelector('.admin-table thead tr');
        const searchInput = scope.querySelector('.admin-table-actions input[type="text"]');
        const searchButton = scope.querySelector('.admin-table-actions .admin-btn-outline');
        const actionButtons = scope.querySelectorAll('.admin-table-actions .admin-btn');
        const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });

        let surfaceConfig = {
            defaultTab,
            tabs: fallbackTabs
        };
        let activeTab = defaultTab;
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
                return extractText(value.text ?? value.label ?? value.value ?? value.title ?? value.name ?? '');
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
                searchText: searchText.trim().toLowerCase()
            };
        };

        const normalizeTabConfig = (tabKey, tabPayload = {}) => {
            const fallback = fallbackTabs[tabKey] ?? fallbackTabs[defaultTab] ?? {};
            const payloadRows = Array.isArray(tabPayload.rows) ? tabPayload.rows.map(normalizeRow).filter(Boolean) : [];
            const columns = Array.isArray(tabPayload.columns) && tabPayload.columns.length
                ? tabPayload.columns.map((column) => extractText(column))
                : (Array.isArray(fallback.columns) ? fallback.columns : []);

            return {
                ...fallback,
                ...tabPayload,
                columns,
                rows: payloadRows,
                searchPlaceholder: extractText(tabPayload.searchPlaceholder) || fallback.searchPlaceholder || '',
                primaryAction: extractText(tabPayload.primaryAction) || fallback.primaryAction || '',
                secondaryAction: extractText(tabPayload.secondaryAction) || fallback.secondaryAction || '',
                emptyMessage: extractText(tabPayload.emptyMessage) || fallback.emptyMessage || membersConfig.errorMessage
            };
        };

        const normalizeSurfaceConfig = (payload = {}) => {
            const payloadTabs = payload.tabs && typeof payload.tabs === 'object' ? payload.tabs : {};
            const orderedTabKeys = [
                ...tabOrder,
                ...Object.keys(fallbackTabs),
                ...Object.keys(payloadTabs)
            ].filter((tabKey, index, list) => tabKey && list.indexOf(tabKey) === index);

            const tabs = {};
            orderedTabKeys.forEach((tabKey) => {
                tabs[tabKey] = normalizeTabConfig(tabKey, payloadTabs[tabKey]);
            });

            const nextDefaultTab = tabs[payload.defaultTab] ? payload.defaultTab : defaultTab;
            return {
                defaultTab: nextDefaultTab,
                tabs
            };
        };

        const getTabConfig = (tabKey) => surfaceConfig.tabs[tabKey] ?? surfaceConfig.tabs[surfaceConfig.defaultTab] ?? fallbackTabs[defaultTab];

        const renderSidebarMenus = (role) => {
            if (!enableSharedChrome) {
                return '';
            }

            const accessibleMenus = window.RBAC_CONFIG?.getAccessibleMenus?.(role) ?? [];
            return accessibleMenus.map((menu) => `
                <a href="${escapeHtml(menu.path)}" class="admin-menu-item ${menu.id === 'members' ? 'active' : ''}" data-id="${escapeHtml(menu.id)}">
                    <span class="admin-menu-icon">${menu.icon}</span>
                    <span>${escapeHtml(menu.label)}</span>
                </a>
            `).join('');
        };

        const renderTableHead = (tabKey) => {
            const config = getTabConfig(tabKey);
            if (!tableHeadRow) return;
            tableHeadRow.innerHTML = config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
        };

        const renderTableBody = (tabKey) => {
            const config = getTabConfig(tabKey);
            if (!tableBody) return;

            const keyword = searchKeyword.trim().toLowerCase();
            const rows = (config.rows ?? []).filter((row) => !keyword || row.searchText.includes(keyword));

            const emptyMessage = surfaceState === 'loading'
                ? membersConfig.loadingMessage
                : surfaceState === 'error'
                    ? membersConfig.errorMessage
                    : keyword
                        ? '검색 결과가 없습니다.'
                        : config.emptyMessage;

            if (rows.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="${config.columns.length}" style="text-align:center; padding: 40px;">${escapeHtml(emptyMessage)}</td></tr>`;
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

            if (actionButtons.length >= 3) {
                actionButtons[0].textContent = membersConfig.searchButtonLabel;
                actionButtons[1].textContent = config.secondaryAction;
                actionButtons[2].textContent = config.primaryAction;
            }

            if (searchButton) {
                searchButton.textContent = membersConfig.searchButtonLabel;
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

        const loadMembersSurface = async () => {
            surfaceState = 'loading';
            renderTableHead(activeTab);
            renderTableBody(activeTab);

            try {
                const adminApiClient = await ensureAdminApiClient();
                if (!adminApiClient?.fetchAdminPayload) {
                    throw new Error('Admin API client is unavailable');
                }

                const payload = await adminApiClient.fetchAdminPayload(membersConfig.surfaceEndpoint);
                if (!payload || typeof payload !== 'object') {
                    throw new Error('Admin members payload was empty');
                }

                surfaceConfig = normalizeSurfaceConfig(payload);
                surfaceState = 'ready';
                setActiveTab(activeTab);
            } catch (error) {
                console.warn('[AdminMembers] Failed to hydrate members surface:', error);
                surfaceConfig = normalizeSurfaceConfig({
                    defaultTab,
                    tabs: fallbackTabs
                });
                surfaceState = 'error';
                setActiveTab(activeTab);
            }
        };

        if (enableSharedChrome) {
            if (userNameEl) userNameEl.textContent = session.name;
            if (userRoleEl) userRoleEl.textContent = session.role;
            if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

            if (sidebarToggle) {
                const onSidebarToggle = () => {
                    window.AdminStore?.dispatch?.({ type: 'UI/TOGGLE_SIDEBAR' });
                };
                sidebarToggle.addEventListener('click', onSidebarToggle);
                cleanup.add(() => sidebarToggle.removeEventListener('click', onSidebarToggle));
            }

            if (logoutBtn) {
                const onLogout = () => {
                    localStorage.removeItem('userSession');
                    redirectByRoute('HOME');
                };
                logoutBtn.addEventListener('click', onLogout);
                cleanup.add(() => logoutBtn.removeEventListener('click', onLogout));
            }

            if (profileTrigger && profileContainer) {
                const onTrigger = (event) => {
                    event.stopPropagation();
                    profileContainer.classList.toggle('active');
                };
                const onDocumentClick = (event) => {
                    if (!profileContainer.contains(event.target)) {
                        profileContainer.classList.remove('active');
                    }
                };
                profileTrigger.addEventListener('click', onTrigger);
                document.addEventListener('click', onDocumentClick);
                cleanup.add(() => profileTrigger.removeEventListener('click', onTrigger));
                cleanup.add(() => document.removeEventListener('click', onDocumentClick));
            }

            const langBtns = sharedScope.querySelectorAll('.lang-btn');
            langBtns.forEach((btn) => {
                const onLangClick = (event) => {
                    langBtns.forEach((item) => item.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                };
                btn.addEventListener('click', onLangClick);
                cleanup.add(() => btn.removeEventListener('click', onLangClick));
            });

            themeBtns.forEach((btn) => {
                const onThemeClick = (event) => {
                    const selectedTheme = event.currentTarget.dataset.theme;
                    localStorage.setItem('adminTheme', selectedTheme);
                    window.AdminStore?.dispatch?.({ type: 'UI/SET_THEME', payload: selectedTheme });
                };
                btn.addEventListener('click', onThemeClick);
                cleanup.add(() => btn.removeEventListener('click', onThemeClick));
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
                cleanup.add(unsubscribe);
            }

            const initialState = window.AdminStore?.getState?.() ?? { ui: {} };
            syncSidebarUI(initialState.ui.sidebarOpen);
            updateThemeDOM(initialState.ui.theme);
            window.addEventListener('resize', () => syncSidebarUI(window.AdminStore?.getState?.()?.ui?.sidebarOpen));
        }

        tabButtons.forEach((button) => {
            const onTabClick = (event) => {
                searchKeyword = '';
                if (searchInput) searchInput.value = '';
                const nextTab = event.currentTarget.dataset.domain;
                if (enableSharedChrome) {
                    window.AdminStore?.dispatch?.({ type: 'UI/SET_DOMAIN', payload: nextTab });
                    return;
                }
                setActiveTab(nextTab);
            };
            button.addEventListener('click', onTabClick);
            cleanup.add(() => button.removeEventListener('click', onTabClick));
        });

        if (searchInput) {
            const onSearchInput = (event) => {
                searchKeyword = event.currentTarget.value;
                renderTableBody(activeTab);
            };
            searchInput.addEventListener('input', onSearchInput);
            cleanup.add(() => searchInput.removeEventListener('input', onSearchInput));
        }

        if (searchButton) {
            const onSearchClick = () => renderTableBody(activeTab);
            searchButton.addEventListener('click', onSearchClick);
            cleanup.add(() => searchButton.removeEventListener('click', onSearchClick));
        }

        setActiveTab(defaultTab);
        await loadMembersSurface();

        return cleanup.run;
    };

    const bootDirectMembersPage = () => {
        void createMembersPage({ root: document, enableSharedChrome: true }).catch((error) => {
            console.warn('[AdminMembers] Direct page boot failed:', error);
        });
    };

    const registerShellSection = () => {
        if (!window.AdminShell?.registerSection) {
            return;
        }

        window.AdminShell.registerSection('members', {
            mount: async ({ root }) => createMembersPage({ root, enableSharedChrome: false })
        });
    };

    registerShellSection();

    if (!window.AdminShell?.registerSection) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootDirectMembersPage, { once: true });
        } else {
            bootDirectMembersPage();
        }
    }
})();
