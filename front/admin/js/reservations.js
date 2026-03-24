(() => {
    'use strict';

    const SECTION_ID = 'reservations';
    const SECTION_TITLE = '예약 / 결제 / 환불 / 여행자 관리';
    const SHELL_SCRIPT = '../js/admin_shell.js';
    const API_SCRIPT = '../js/api_client.js';
    const CONFIG_SCRIPT = '../data/reservations-config.js';

    const loadScriptOnce = (src) => new Promise((resolve, reject) => {
        const runtimeSrc = new URL(src, window.location.href).href;
        const existing = document.querySelector(`script[data-admin-runtime="${runtimeSrc}"]`);
        if (existing) {
            resolve(existing);
            return;
        }

        const script = document.createElement('script');
        script.src = runtimeSrc;
        script.async = true;
        script.dataset.adminRuntime = runtimeSrc;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.head.appendChild(script);
    });

    const ensureRuntime = () => {
        if (window.__ADMIN_RESERVATIONS_RUNTIME_PROMISE__) {
            return window.__ADMIN_RESERVATIONS_RUNTIME_PROMISE__;
        }

        window.__ADMIN_RESERVATIONS_RUNTIME_PROMISE__ = Promise.all([
            loadScriptOnce(SHELL_SCRIPT),
            loadScriptOnce(API_SCRIPT)
        ]).then(() => import(CONFIG_SCRIPT));

        return window.__ADMIN_RESERVATIONS_RUNTIME_PROMISE__;
    };

    let latestSectionState = null;
    let mountToken = 0;

    const mountReservations = async ({ root, sectionState }) => {
        if (!root) {
            return () => {};
        }

        const currentMountToken = ++mountToken;
        let isMounted = true;
        const isActiveMount = () => isMounted && currentMountToken === mountToken;
        const cleanup = window.AdminShell.utils.cleanupBag();
        const tabButtons = Array.from(root.querySelectorAll('#admin-domain-filters .segment-btn'));
        const tableBody = root.querySelector('#reservations-table-body');
        const tableHeadRow = root.querySelector('.admin-table thead tr');
        const searchInput = root.querySelector('.admin-reservations-search-group input[type="text"]');
        const searchButton = root.querySelector('.admin-reservations-search-group .admin-btn-outline');
        const actionButtons = Array.from(root.querySelectorAll('.admin-reservations-quick-actions .admin-btn'));
        const domainFilterButtons = Array.from(root.querySelectorAll('#reservation-domain-filters .subfilter-btn'));

        const [configModule] = await Promise.all([ensureRuntime()]);
        if (!isActiveMount()) {
            return () => {};
        }
        const fallbackTabConfig = configModule.default ?? configModule.RESERVATIONS_TAB_CONFIG ?? configModule.tabConfig ?? {};
        let TAB_CONFIG = Object.freeze(fallbackTabConfig);
        let DEFAULT_TAB = configModule.DEFAULT_TAB ?? configModule.defaultTab ?? 'booking';
        const initialState = window.AdminStore?.getState?.();
        const initialDomain = initialState?.ui?.domain;
        let activeTab = sectionState?.activeTab && fallbackTabConfig[sectionState.activeTab]
            ? sectionState.activeTab
            : (!sectionState && initialDomain && fallbackTabConfig[initialDomain] ? initialDomain : DEFAULT_TAB);
        let searchKeyword = sectionState?.searchKeyword ?? '';
        let activeDomainKey = sectionState?.activeDomainKey ?? 'all';
        let hasUserSelectedTab = sectionState?.hasUserSelectedTab ?? false;

        const escapeHtml = (value) => window.AdminShell.utils.escapeHtml(value);

        const syncSectionState = () => {
            latestSectionState = {
                activeTab,
                searchKeyword,
                activeDomainKey,
                hasUserSelectedTab
            };
        };

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
                const domainMatch = activeDomainKey === 'all' || row.domainKey === activeDomainKey;
                const searchMatch = !keyword || String(row.searchText ?? '').toLowerCase().includes(keyword);
                return domainMatch && searchMatch;
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

            if (actionButtons.length >= 2) {
                actionButtons[0].textContent = config.secondaryAction || '조회';
                actionButtons[1].textContent = config.primaryAction || '등록';
            }
        };

        const syncDomainFilters = () => {
            domainFilterButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.domainKey === activeDomainKey);
            });
        };

        const setActiveTab = (tabKey) => {
            activeTab = TAB_CONFIG[tabKey] ? tabKey : DEFAULT_TAB;
            tabButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.domain === activeTab);
            });
            syncActionBar(activeTab);
            renderTableHead(activeTab);
            renderTableBody(activeTab);
            syncDomainFilters();
            syncSectionState();
        };

        const applyLiveTabConfig = (liveTabConfig) => {
            if (!isActiveMount() || !liveTabConfig || typeof liveTabConfig !== 'object') {
                return;
            }

            TAB_CONFIG = Object.freeze(liveTabConfig.tabs ?? TAB_CONFIG);
            DEFAULT_TAB = liveTabConfig.defaultTab ?? DEFAULT_TAB;
            if (!hasUserSelectedTab) {
                activeTab = TAB_CONFIG[activeTab] ? activeTab : DEFAULT_TAB;
            }
            setActiveTab(activeTab);
        };

        void window.AdminApiClient.fetchAdminPayloadInBackground('/api/admin/tables/reservations', {
            onSuccess: applyLiveTabConfig,
            onError: (error) => {
                if (!isActiveMount()) {
                    return;
                }
                console.warn('[AdminReservations] Live config load failed:', error);
            }
        });

        const onTabClick = (event) => {
            hasUserSelectedTab = true;
            searchKeyword = '';
            if (searchInput) {
                searchInput.value = '';
            }
            syncSectionState();
            window.AdminStore?.dispatch?.({ type: 'UI/SET_DOMAIN', payload: event.currentTarget.dataset.domain });
        };

        const onSearchInput = (event) => {
            searchKeyword = event.currentTarget.value;
            syncSectionState();
            renderTableBody(activeTab);
        };

        const onSearchButton = () => renderTableBody(activeTab);

        const onDomainFilterClick = (event) => {
            activeDomainKey = event.currentTarget.dataset.domainKey || 'all';
            syncSectionState();
            syncDomainFilters();
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

        domainFilterButtons.forEach((button) => {
            button.addEventListener('click', onDomainFilterClick);
            cleanup.add(() => button.removeEventListener('click', onDomainFilterClick));
        });

        const unsubscribe = window.AdminStore?.subscribe?.((nextState) => {
            if (!isActiveMount()) {
                return;
            }
            setActiveTab(hasUserSelectedTab ? nextState.ui.domain : activeTab);
        });
        cleanup.add(() => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });

        if (initialState) {
            if (sectionState?.activeTab && initialState.ui.domain !== activeTab) {
                window.AdminStore?.dispatch?.({ type: 'UI/SET_DOMAIN', payload: activeTab });
            }
        }

        setActiveTab(activeTab);
        if (searchInput) {
            searchInput.value = searchKeyword;
        }
        syncDomainFilters();
        syncSectionState();

        return () => {
            isMounted = false;
            if (mountToken === currentMountToken) {
                mountToken += 1;
            }
            cleanup.run();
        };
    };

    const boot = async () => {
        const shell = await ensureRuntime();
        shell.registerSection(SECTION_ID, {
            pagePath: 'reservations.html',
            scriptPath: SHELL_SCRIPT,
            title: SECTION_TITLE,
            getState: () => (latestSectionState ? { ...latestSectionState } : null),
            mount: mountReservations
        });
        await shell.bootSection(SECTION_ID);
    };

    void boot();
})();
