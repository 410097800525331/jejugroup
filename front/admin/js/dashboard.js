(() => {
    'use strict';

    const SECTION_ID = 'dashboard';
    const SECTION_TITLE = '제주 그룹 관리자 대시보드';
    const SHELL_SCRIPT = '../js/admin_shell.js';
    const API_SCRIPT = '../js/api_client.js';
    const CHART_SCRIPT = 'https://cdn.jsdelivr.net/npm/chart.js';

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
        if (window.__ADMIN_DASHBOARD_RUNTIME_PROMISE__) {
            return window.__ADMIN_DASHBOARD_RUNTIME_PROMISE__;
        }

        window.__ADMIN_DASHBOARD_RUNTIME_PROMISE__ = Promise.all([
            loadScriptOnce(SHELL_SCRIPT),
            loadScriptOnce(API_SCRIPT)
        ]).then(() => window.AdminShell);

        return window.__ADMIN_DASHBOARD_RUNTIME_PROMISE__;
    };

    const ensureChartRuntime = () => {
        if (window.Chart) {
            return Promise.resolve(window.Chart);
        }

        if (!window.__ADMIN_CHART_RUNTIME_PROMISE__) {
            window.__ADMIN_CHART_RUNTIME_PROMISE__ = new Promise((resolve, reject) => {
                const existing = document.querySelector(`script[data-admin-runtime="${CHART_SCRIPT}"]`);
                if (existing) {
                    existing.addEventListener('load', () => resolve(window.Chart));
                    existing.addEventListener('error', reject);
                    return;
                }

                const script = document.createElement('script');
                script.src = CHART_SCRIPT;
                script.async = true;
                script.dataset.adminRuntime = CHART_SCRIPT;
                script.onload = () => resolve(window.Chart);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        return window.__ADMIN_CHART_RUNTIME_PROMISE__;
    };

    const escapeHtml = (value) => window.AdminShell?.utils?.escapeHtml?.(value) ?? String(value ?? '');

    let latestSectionState = null;
    let mountToken = 0;

    const mountDashboard = async ({ root, sectionState }) => {
        if (!root) {
            return () => {};
        }

        const currentMountToken = ++mountToken;
        let isMounted = true;
        const isActiveMount = () => isMounted && currentMountToken === mountToken;
        const cleanup = window.AdminShell.utils.cleanupBag();
        const shouldPreserveSectionState = Boolean(sectionState);
        await ensureChartRuntime();
        if (!isActiveMount()) {
            return () => {};
        }
        const kpiGrid = root.querySelector('#admin-kpi-grid');
        const chartCtx = root.querySelector('#admin-main-chart');
        const chartFilters = Array.from(root.querySelectorAll('.chart-filter-btn'));
        const domainFilters = Array.from(root.querySelectorAll('.segment-btn'));
        const recentActivityTable = root.querySelector('#admin-recent-activity');
        let activeDomain = sectionState?.domain || window.AdminStore?.getState?.().ui?.domain || 'all';
        let activeRange = sectionState?.range || chartFilters.find((button) => button.classList.contains('active'))?.dataset.range || 'day';
        const chartState = {
            instance: null,
            requestToken: 0
        };

        const syncSectionState = () => {
            latestSectionState = {
                domain: activeDomain,
                range: activeRange
            };
        };

        const renderKPICards = (kpiData) => {
            const icons = {
                todayReservations: '▣',
                revenue: '◧',
                cancelRate: '◔',
                activeUsers: '◐'
            };
            const labels = {
                todayReservations: '오늘 예약',
                revenue: '누적 매출',
                cancelRate: '취소율',
                activeUsers: '활성 사용자'
            };

            const formatValue = (value) => {
                if (typeof value === 'number') {
                    return value.toLocaleString('ko-KR');
                }
                return String(value ?? '-');
            };

            const computedKpi = {
                todayReservations: formatValue(kpiData.todayReservations),
                revenue: formatValue(kpiData.revenue),
                cancelRate: formatValue(kpiData.cancelRate),
                activeUsers: formatValue(kpiData.activeUsers)
            };

            return Object.entries(computedKpi).map(([key, value]) => `
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3 class="admin-card-title">${labels[key]}</h3>
                        <div class="admin-card-icon">${icons[key]}</div>
                    </div>
                    <h2 class="admin-card-value">${escapeHtml(value)}</h2>
                    <div class="admin-card-trend positive">
                        <span>현재 DB 기준</span>
                    </div>
                </div>
            `).join('');
        };

        const renderRecentActivityRows = (recentActivity) => {
            const rows = Array.isArray(recentActivity) ? recentActivity : [];
            if (!rows.length) {
                return `
                    <tr class="admin-empty-row">
                        <td colspan="4">최근 활동이 없습니다.</td>
                    </tr>
                `;
            }

            return rows.map((item) => {
                const type = String(item?.type ?? '').toUpperCase();
                const badgeClass = type === 'NOTICE' ? 'warning' : type === 'TICKET' ? 'success' : 'danger';
                return `
                    <tr>
                        <td><span class="admin-badge ${badgeClass}">${escapeHtml(type || '-')}</span></td>
                        <td>${escapeHtml(item?.desc ?? '-')}</td>
                        <td>${escapeHtml(item?.time ?? '-')}</td>
                        <td><span class="admin-badge ${badgeClass}">${escapeHtml(item?.status ?? '-')}</span></td>
                    </tr>
                `;
            }).join('');
        };

        const generateChartData = () => ({
            labels: [],
            dataRevenue: [],
            dataReservation: []
        });

        const syncDomainFilters = (activeDomain) => {
            domainFilters.forEach((button) => {
                button.classList.toggle('active', button.dataset.domain === activeDomain);
            });
        };

        const syncChartFilters = (range) => {
            activeRange = range;
            chartFilters.forEach((button) => {
                button.classList.toggle('active', button.dataset.range === activeRange);
            });
        };

        const updateChart = (range, theme, domain = 'all') => {
            if (!chartCtx || !window.Chart) {
                return;
            }

            const { labels, dataRevenue, dataReservation } = generateChartData(range, domain);
            const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
            const textColor = activeTheme === 'dark' ? 'hsl(220, 10%, 65%)' : 'hsl(220, 9%, 46%)';
            const gridColor = activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

            if (chartState.instance) {
                chartState.instance.destroy();
            }

            chartState.instance = new window.Chart(chartCtx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: '예약 추이 없음',
                            data: dataRevenue,
                            borderColor: 'hsl(28, 90%, 55%)',
                            backgroundColor: 'rgba(230, 126, 34, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: '트래픽 추이 없음',
                            data: dataReservation,
                            borderColor: 'hsl(140, 60%, 45%)',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: textColor }
                        }
                    }
                }
            });
        };

        const loadDashboardSeed = async (domain) => {
            if (!isActiveMount()) {
                return;
            }
            const requestToken = ++chartState.requestToken;
            const requestedDomain = domain || 'all';
            try {
                const seed = await window.AdminApiClient.fetchAdminPayload(`/api/admin/dashboard?domain=${encodeURIComponent(requestedDomain)}`);
                if (!isActiveMount() || requestToken !== chartState.requestToken) {
                    return;
                }
                if (window.AdminStore?.getState?.().ui?.domain !== requestedDomain) {
                    return;
                }
                if (seed && typeof window.AdminStore?.hydrateFromSeed === 'function') {
                    const hydratedSeed = shouldPreserveSectionState
                        ? {
                            ...seed,
                            ui: {
                                ...(seed.ui || {}),
                                domain: activeDomain,
                                range: activeRange
                            }
                        }
                        : seed;
                    window.AdminStore.hydrateFromSeed(hydratedSeed);
                }
            } catch (error) {
                if (!isActiveMount() || requestToken !== chartState.requestToken) {
                    return;
                }
                console.warn('[AdminDashboard] Live dashboard load failed:', error);
            }
        };

        const onDomainClick = (event) => {
            activeDomain = event.currentTarget.dataset.domain || 'all';
            domainFilters.forEach((button) => button.classList.remove('active'));
            event.currentTarget.classList.add('active');
            syncSectionState();
            window.AdminStore?.dispatch?.({ type: 'UI/SET_DOMAIN', payload: activeDomain });
            void loadDashboardSeed(activeDomain);
        };

        const onChartFilterClick = (event) => {
            activeRange = event.currentTarget.dataset.range || 'day';
            syncChartFilters(activeRange);
            syncSectionState();
            const currentTheme = window.AdminStore?.getState?.().ui?.theme || 'system';
            const currentDomain = window.AdminStore?.getState?.().ui?.domain || activeDomain || 'all';
            updateChart(activeRange, currentTheme, currentDomain);
        };

        domainFilters.forEach((button) => {
            button.addEventListener('click', onDomainClick);
            cleanup.add(() => button.removeEventListener('click', onDomainClick));
        });

        chartFilters.forEach((button) => {
            button.addEventListener('click', onChartFilterClick);
            cleanup.add(() => button.removeEventListener('click', onChartFilterClick));
        });

        const unsubscribe = window.AdminStore?.subscribe?.((nextState) => {
            if (!isActiveMount()) {
                return;
            }
            activeDomain = nextState.ui.domain;
            syncSectionState();
            if (kpiGrid) {
                kpiGrid.innerHTML = renderKPICards(nextState.kpi);
            }
            if (recentActivityTable) {
                recentActivityTable.innerHTML = renderRecentActivityRows(nextState.recentActivity);
            }
            syncDomainFilters(nextState.ui.domain);
            updateChart(activeRange, nextState.ui.theme, nextState.ui.domain);
        });

        cleanup.add(() => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });

        const initialState = window.AdminStore?.getState?.();
        if (initialState) {
            if (sectionState?.domain && initialState.ui.domain !== activeDomain) {
                window.AdminStore?.dispatch?.({ type: 'UI/SET_DOMAIN', payload: activeDomain });
            }
            if (kpiGrid) {
                kpiGrid.innerHTML = renderKPICards(initialState.kpi);
            }
            if (recentActivityTable) {
                recentActivityTable.innerHTML = renderRecentActivityRows(initialState.recentActivity);
            }
            syncDomainFilters(activeDomain);
            syncChartFilters(activeRange);
            syncSectionState();
            updateChart(activeRange, initialState.ui.theme, activeDomain);
            void loadDashboardSeed(activeDomain);
        }

        return () => {
            isMounted = false;
            if (mountToken === currentMountToken) {
                mountToken += 1;
            }
            cleanup.run();
            if (chartState.instance) {
                chartState.instance.destroy();
                chartState.instance = null;
            }
        };
    };

    const boot = async () => {
        const shell = await ensureRuntime();
        shell.registerSection(SECTION_ID, {
            pagePath: 'dashboard.html',
            scriptPath: SHELL_SCRIPT,
            title: SECTION_TITLE,
            getState: () => (latestSectionState ? { ...latestSectionState } : null),
            mount: mountDashboard
        });
        await shell.bootSection(SECTION_ID);
    };

    void boot();
})();
