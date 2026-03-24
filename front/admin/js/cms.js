(() => {
    'use strict';

    const SECTION_ID = 'cms';
    const SECTION_TITLE = 'CMS 관리';
    const SHELL_SCRIPT = '../js/admin_shell.js';
    const API_SCRIPT = '../js/api_client.js';
    const CONFIG_SCRIPT = '../data/cms-config.js';

    const loadScriptOnce = (src) => new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-admin-runtime="${src}"]`);
        if (existing) {
            resolve(existing);
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.dataset.adminRuntime = src;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.head.appendChild(script);
    });

    const ensureRuntime = () => {
        if (window.__ADMIN_CMS_RUNTIME_PROMISE__) {
            return window.__ADMIN_CMS_RUNTIME_PROMISE__;
        }

        window.__ADMIN_CMS_RUNTIME_PROMISE__ = Promise.all([
            loadScriptOnce(SHELL_SCRIPT),
            loadScriptOnce(API_SCRIPT)
        ]).then(() => import(CONFIG_SCRIPT));

        return window.__ADMIN_CMS_RUNTIME_PROMISE__;
    };

    const mountCms = async ({ root }) => {
        if (!root) {
            return () => {};
        }

        const cleanup = window.AdminShell.utils.cleanupBag();
        const tabButtons = Array.from(root.querySelectorAll('.segment-btn'));
        const tableBody = root.querySelector('#cms-table-body');
        const tableHeadRow = root.querySelector('.admin-table thead tr');
        const searchInput = root.querySelector('.admin-table-actions input[type="text"]');
        const statusFilter = root.querySelector('#cms-status-filter');
        const searchButton = root.querySelector('#cms-search-btn');
        const secondaryActionButton = root.querySelector('#cms-secondary-action-btn');
        const primaryActionButton = root.querySelector('#cms-primary-action-btn');

        const [configModule] = await Promise.all([ensureRuntime()]);
        const fallbackTabConfig = configModule.default ?? configModule.CMS_TAB_CONFIG ?? configModule.tabConfig ?? {};
        let TAB_CONFIG = Object.freeze(fallbackTabConfig);
        let DEFAULT_TAB = configModule.DEFAULT_TAB ?? configModule.defaultTab ?? 'notices';
        let activeTab = DEFAULT_TAB;
        let searchKeyword = '';
        let activeStatus = 'all';
        let hasUserSelectedTab = false;

        const escapeHtml = (value) => window.AdminShell.utils.escapeHtml(value);

        const renderTableHead = (tabKey) => {
            const config = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];
            if (!tableHeadRow || !config) {
                return;
            }
            tableHeadRow.innerHTML = config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
        };

        const renderTableBody = (tabKey) => {
            const config = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];
            if (!tableBody || !config) {
                return;
            }

            const keyword = searchKeyword.trim().toLowerCase();
            const rows = (config.rows || []).filter((row) => {
                const statusMatch = activeStatus === 'all' || row.statusKey === activeStatus;
                const searchMatch = !keyword || String(row.searchText ?? '').toLowerCase().includes(keyword);
                return statusMatch && searchMatch;
            });

            if (!rows.length) {
                tableBody.innerHTML = `<tr><td colspan="${config.columns.length}" style="text-align:center; padding: 40px;">${escapeHtml(config.emptyMessage ?? '데이터가 없습니다.')}</td></tr>`;
                return;
            }

            tableBody.innerHTML = rows.map((row) => `
                <tr>
                    ${(row.cells || []).map((cell) => `<td>${escapeHtml(cell ?? '')}</td>`).join('')}
                </tr>
            `).join('');
        };

        const syncActionBar = (tabKey) => {
            const config = TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];
            if (!config) {
                return;
            }

            if (searchInput) {
                searchInput.placeholder = config.searchPlaceholder;
            }

            if (searchButton) {
                searchButton.textContent = '검색';
            }

            if (secondaryActionButton) {
                secondaryActionButton.textContent = config.secondaryAction || '정리';
            }

            if (primaryActionButton) {
                primaryActionButton.textContent = config.primaryAction || '등록';
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

        const applyLiveTabConfig = (liveTabConfig) => {
            if (!liveTabConfig || typeof liveTabConfig !== 'object') {
                return;
            }

            TAB_CONFIG = Object.freeze(liveTabConfig.tabs ?? TAB_CONFIG);
            DEFAULT_TAB = liveTabConfig.defaultTab ?? DEFAULT_TAB;
            if (!hasUserSelectedTab) {
                activeTab = DEFAULT_TAB;
            }
            setActiveTab(activeTab);
        };

        void window.AdminApiClient.fetchAdminPayloadInBackground('/api/admin/tables/cms', {
            onSuccess: applyLiveTabConfig,
            onError: (error) => {
                console.warn('[AdminCms] Live config load failed:', error);
            }
        });

        const onTabClick = (event) => {
            hasUserSelectedTab = true;
            searchKeyword = '';
            activeStatus = 'all';
            if (searchInput) {
                searchInput.value = '';
            }
            if (statusFilter) {
                statusFilter.value = 'all';
            }
            window.AdminStore?.dispatch?.({ type: 'UI/SET_DOMAIN', payload: event.currentTarget.dataset.domain });
        };

        const onSearchInput = (event) => {
            searchKeyword = event.currentTarget.value;
            renderTableBody(activeTab);
        };

        const onSearchButton = () => renderTableBody(activeTab);

        const onStatusChange = (event) => {
            activeStatus = event.currentTarget.value || 'all';
            renderTableBody(activeTab);
        };

        tabButtons.forEach((button) => {
            button.addEventListener('click', onTabClick);
            cleanup.add(() => button.removeEventListener('click', onTabClick));
        });

        if (searchInput) {
            searchInput.addEventListener('input', onSearchInput);
            cleanup.add(() => searchInput.removeEventListener('input', onSearchInput));
        }

        if (searchButton) {
            searchButton.addEventListener('click', onSearchButton);
            cleanup.add(() => searchButton.removeEventListener('click', onSearchButton));
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', onStatusChange);
            cleanup.add(() => statusFilter.removeEventListener('change', onStatusChange));
        }

        const unsubscribe = window.AdminStore?.subscribe?.((nextState) => {
            setActiveTab(hasUserSelectedTab ? nextState.ui.domain : activeTab);
        });
        cleanup.add(() => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });

        const initialState = window.AdminStore?.getState?.();
        if (initialState) {
            setActiveTab(TAB_CONFIG[initialState.ui.domain] ? initialState.ui.domain : DEFAULT_TAB);
        } else {
            setActiveTab(DEFAULT_TAB);
        }

        return () => cleanup.run();
    };

    const boot = async () => {
        const shell = await ensureRuntime();
        shell.registerSection(SECTION_ID, {
            pagePath: 'cms.html',
            scriptPath: SHELL_SCRIPT,
            title: SECTION_TITLE,
            mount: mountCms
        });
        await shell.bootSection(SECTION_ID);
    };

    void boot();
})();
