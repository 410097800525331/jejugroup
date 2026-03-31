/**
 * @file dashboard.js
 * @description Admin dashboard renderer and event bindings
 */

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const [{ default: dashboardData }, routeModule, apiConfigModule] = await Promise.all([
        import('../data/dashboard-data.js'),
        import('../../core/utils/path_resolver.js'),
        import('../../core/config/api_config.js')
    ]);

    const resolveRoute = routeModule.resolveRoute;
    const { API_BASE_URL } = apiConfigModule;
    const redirectByRoute = (routeKey, mode = 'replace') => {
        const targetUrl = resolveRoute(routeKey);

        if (mode === 'assign') {
            window.location.assign(targetUrl);
            return;
        }

        window.location.replace(targetUrl);
    };

    const DASHBOARD_API_PATH = '/api/admin/dashboard';
    const DASHBOARD_REFRESH_INTERVAL_MS = 30 * 1000;
    const DASHBOARD_DOMAIN_BY_UI_DOMAIN = {
        flight: 'air',
        hotel: 'stay',
        rentcar: 'rent'
    };

    let dashboardPayloadRequestPromise = null;
    let dashboardPayloadQueuedDomain = null;
    let dashboardPayloadLastDomain = null;
    let dashboardRefreshIntervalId = null;

    const normalizeDashboardDomain = (domain) => {
        const normalizedDomain = String(domain ?? '').trim().toLowerCase();
        return normalizedDomain || dashboardData.defaultDomain || 'all';
    };

    const buildDashboardApiUrl = (domain) => {
        const uiDomain = normalizeDashboardDomain(domain);
        const apiDomain = DASHBOARD_DOMAIN_BY_UI_DOMAIN[uiDomain] ?? uiDomain;
        return `${API_BASE_URL}${DASHBOARD_API_PATH}?domain=${encodeURIComponent(apiDomain)}`;
    };

    const hydrateDashboardPayload = (payload) => {
        if (!payload || typeof payload !== 'object') {
            return;
        }

        window.AdminDashboardHydrate?.(payload);
    };

    const stopDashboardAutoRefresh = () => {
        if (dashboardRefreshIntervalId === null) {
            return;
        }

        window.clearInterval(dashboardRefreshIntervalId);
        dashboardRefreshIntervalId = null;
    };

    const requestActiveDashboardDomain = () => {
        const activeDomain = normalizeDashboardDomain(AdminStore.getState()?.ui?.domain);
        return requestDashboardPayload(activeDomain);
    };

    const startDashboardAutoRefresh = () => {
        stopDashboardAutoRefresh();

        dashboardRefreshIntervalId = window.setInterval(() => {
            if (document.visibilityState === 'hidden') {
                return;
            }

            void requestActiveDashboardDomain();
        }, DASHBOARD_REFRESH_INTERVAL_MS);
    };

    const requestDashboardPayload = (domain) => {
        dashboardPayloadQueuedDomain = normalizeDashboardDomain(domain);

        if (dashboardPayloadRequestPromise) {
            return dashboardPayloadRequestPromise;
        }

        dashboardPayloadRequestPromise = (async () => {
            while (dashboardPayloadQueuedDomain) {
                const requestedDomain = dashboardPayloadQueuedDomain;
                dashboardPayloadQueuedDomain = null;
                dashboardPayloadLastDomain = requestedDomain;

                try {
                    const response = await fetch(buildDashboardApiUrl(requestedDomain), {
                        credentials: 'include',
                        headers: {
                            Accept: 'application/json'
                        },
                        method: 'GET'
                    });

                    if (response.status === 401) {
                        stopDashboardAutoRefresh();
                        return null;
                    }

                    if (!response.ok) {
                        throw new Error(`Admin dashboard payload failed: ${response.status}`);
                    }

                    const payload = await response.json();
                    if (!payload?.success) {
                        throw new Error(payload?.message || 'Admin dashboard payload was not successful');
                    }

                    hydrateDashboardPayload(payload.data ?? null);
                } catch (error) {
                    console.warn('[AdminDashboard] Payload refresh failed:', error);
                }
            }

            return null;
        })().finally(() => {
            dashboardPayloadRequestPromise = null;

            if (dashboardPayloadQueuedDomain && dashboardPayloadQueuedDomain !== dashboardPayloadLastDomain) {
                void requestDashboardPayload(dashboardPayloadQueuedDomain);
            }
        });

        return dashboardPayloadRequestPromise;
    };

    const session = await window.AdminAuth?.waitForAdminSession?.();

    if (!session || !session.role) {
        redirectByRoute('HOME');
        return;
    }

    const sidebarMenuContainer = document.getElementById('admin-sidebar-menu');
    const userRoleEl = document.getElementById('admin-user-role');
    const userNameEl = document.getElementById('admin-user-name');
    const kpiGrid = document.getElementById('admin-kpi-grid');
    const sidebarToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const layout = document.querySelector('.admin-layout');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const profileContainer = document.getElementById('admin-profile-container');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const chartCtx = document.getElementById('admin-main-chart');
    const chartWrapper = document.querySelector('.admin-chart-wrapper');
    const chartFilters = Array.from(document.querySelectorAll('.chart-filter-btn'));
    const domainFilters = Array.from(document.querySelectorAll('.segment-btn'));
    const themeBtns = Array.from(document.querySelectorAll('.theme-btn'));
    const tableHeadCells = Array.from(document.querySelectorAll('.admin-table thead th'));
    const recentActivityBody = document.getElementById('admin-recent-activity');
    const pageTitleEl = document.querySelector('.admin-page-title');
    const chartTitleEl = document.querySelector('.admin-chart-title');
    const reportButtonEl = document.querySelector('.admin-btn-primary');

    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => {
        switch (character) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '\'':
                return '&#39;';
            default:
                return character;
        }
    });

    const formatNumber = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return String(value ?? '0');
        }

        return numericValue.toLocaleString('ko-KR');
    };

    const normalizeMetricValue = (key, value) => {
        if (value === null || value === undefined || value === '') {
            return key === 'cancelRate' ? '0%' : '0';
        }

        if (key === 'cancelRate') {
            if (typeof value === 'number') {
                return `${value.toFixed(1)}%`;
            }

            const textValue = String(value).trim();
            return textValue.endsWith('%') ? textValue : `${textValue}%`;
        }

        return formatNumber(value);
    };

    const getActiveDashboardPayload = () => window.AdminDashboardPayload ?? window.AdminDashboardData?.payload ?? {};

    const getDomainSnapshot = (domain, baseState = AdminStore.getState()) => {
        const payload = getActiveDashboardPayload();
        const domainPayload = payload.domainSnapshots?.[domain]
            ?? payload.domains?.[domain]
            ?? payload[domain]
            ?? {};

        return {
            kpi: domainPayload.kpi ?? payload.kpi ?? baseState.kpi,
            recentActivity: domainPayload.recentActivity ?? payload.recentActivity ?? baseState.recentActivity ?? [],
            chartSeriesByRange: domainPayload.chartSeriesByRange
                ?? domainPayload.chartSeries
                ?? payload.chartSeriesByRange
                ?? payload.chartSeries
                ?? {}
        };
    };

    const getRangeMeta = (range) => dashboardData.chartRanges.find((entry) => entry.range === range)
        ?? dashboardData.chartRanges[0]
        ?? { range: 'day', labels: [] };

    const createShiftedMonth = (baseDate, monthOffset) => {
        const shiftedDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        shiftedDate.setMonth(shiftedDate.getMonth() + monthOffset);
        return shiftedDate;
    };

    const formatMonthLabel = (date) => `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;

    const formatQuarterLabel = (date) => {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `${date.getFullYear()} Q${quarter}`;
    };

    const buildTrailingRangeLabels = (range) => {
        const today = new Date();

        if (range === 'halfYear') {
            return Array.from({ length: 6 }, (_, index) => formatMonthLabel(createShiftedMonth(today, index - 5)));
        }

        if (range === '1year') {
            return Array.from({ length: 12 }, (_, index) => formatMonthLabel(createShiftedMonth(today, index - 11)));
        }

        if (range === '2year') {
            const currentQuarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
            const currentQuarterStart = new Date(today.getFullYear(), currentQuarterStartMonth, 1);

            return Array.from({ length: 8 }, (_, index) => {
                const shiftedQuarter = new Date(currentQuarterStart);
                shiftedQuarter.setMonth(currentQuarterStart.getMonth() + ((index - 7) * 3));
                return formatQuarterLabel(shiftedQuarter);
            });
        }

        return null;
    };

    const setStaticLabels = () => {
        if (pageTitleEl && dashboardData.pageTitle) {
            pageTitleEl.textContent = dashboardData.pageTitle;
        }

        if (chartTitleEl && dashboardData.chartTitle) {
            chartTitleEl.textContent = dashboardData.chartTitle;
        }

        if (reportButtonEl && dashboardData.reportButtonLabel) {
            reportButtonEl.textContent = dashboardData.reportButtonLabel;
        }

        tableHeadCells.forEach((cell, index) => {
            const label = dashboardData.recentActivity.columns[index];
            if (label) {
                cell.textContent = label;
            }
        });

        domainFilters.forEach((button) => {
            const meta = dashboardData.domainFilters.find((entry) => entry.key === button.dataset.domain);
            if (meta) {
                button.textContent = meta.label;
            }
        });

        chartFilters.forEach((button) => {
            const meta = dashboardData.chartRanges.find((entry) => entry.range === button.dataset.range);
            if (meta) {
                button.textContent = meta.label;
            }
        });
    };

    const syncDomainButtons = (activeDomain) => {
        domainFilters.forEach((button) => {
            button.classList.toggle('active', button.dataset.domain === activeDomain);
        });
    };

    const syncChartButtons = (activeRange) => {
        chartFilters.forEach((button) => {
            button.classList.toggle('active', button.dataset.range === activeRange);
        });
    };

    const syncThemeDOM = (theme) => {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;

        document.body.setAttribute('data-theme', activeTheme);

        themeBtns.forEach((button) => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });
    };

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${escapeHtml(menu.path)}" class="admin-menu-item ${menu.id === 'dashboard' ? 'active' : ''}" data-id="${escapeHtml(menu.id)}">
                <span class="admin-menu-icon">${escapeHtml(menu.icon)}</span>
                <span>${escapeHtml(menu.label)}</span>
            </a>
        `).join('');
    };

    const renderKPICards = (kpiData) => {
        const metricKeys = ['todayReservations', 'revenue', 'cancelRate', 'activeUsers'];

        return metricKeys.map((key) => {
            const metricLabel = dashboardData.kpi.labels[key] ?? key;
            const metricIcon = dashboardData.kpi.icons[key] ?? '';
            const trendMeta = dashboardData.kpi.trend[key] ?? { tone: 'neutral', text: '전일 대비 0.0%' };
            const metricValue = normalizeMetricValue(key, kpiData?.[key]);

            return `
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3 class="admin-card-title">${escapeHtml(metricLabel)}</h3>
                        <div class="admin-card-icon">${escapeHtml(metricIcon)}</div>
                    </div>
                    <h2 class="admin-card-value">${escapeHtml(metricValue)}</h2>
                    <div class="admin-card-trend ${escapeHtml(trendMeta.tone)}">
                        <span>${escapeHtml(trendMeta.text)}</span>
                    </div>
                </div>
            `;
        }).join('');
    };

    const getActivityMeta = (activity) => {
        const typeKey = String(activity?.type ?? activity?.category ?? 'default').toLowerCase();
        return dashboardData.recentActivity.badges[typeKey] ?? dashboardData.recentActivity.badges.default;
    };

    const getActivityStatus = (activity, fallbackTone) => {
        const statusTone = String(activity?.statusTone ?? activity?.tone ?? activity?.statusClass ?? fallbackTone ?? 'neutral').toLowerCase();
        const safeTone = ['success', 'danger', 'warning', 'info', 'neutral'].includes(statusTone) ? statusTone : 'neutral';
        const statusLabel = activity?.statusLabel
            ?? dashboardData.recentActivity.statusLabels[safeTone]
            ?? String(activity?.status ?? '').trim()
            ?? '';

        return { tone: safeTone, label: statusLabel || dashboardData.recentActivity.statusLabels[safeTone] };
    };

    const renderRecentActivity = (rows) => {
        if (!recentActivityBody) {
            return;
        }

        const activityRows = Array.isArray(rows) ? rows : [];

        if (!activityRows.length) {
            recentActivityBody.innerHTML = `
                <tr class="admin-empty-row">
                    <td colspan="4">
                        <div class="admin-empty-state" style="display:flex; flex-direction:column; gap:4px; align-items:center; justify-content:center; min-height:120px; text-align:center; color:var(--admin-text-secondary);">
                            <strong>${escapeHtml(dashboardData.recentActivity.emptyTitle)}</strong>
                            <span>${escapeHtml(dashboardData.recentActivity.emptyMessage)}</span>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        recentActivityBody.innerHTML = activityRows.map((activity) => {
            const badgeMeta = getActivityMeta(activity);
            const statusMeta = getActivityStatus(activity, badgeMeta.className);
            const description = activity?.description ?? activity?.content ?? activity?.title ?? activity?.message ?? '-';
            const occurredAt = activity?.occurredAt ?? activity?.time ?? activity?.createdAt ?? activity?.timestamp ?? '-';

            return `
                <tr>
                    <td><span class="admin-badge ${escapeHtml(badgeMeta.className)}">${escapeHtml(badgeMeta.label)}</span></td>
                    <td>${escapeHtml(description)}</td>
                    <td>${escapeHtml(occurredAt)}</td>
                    <td><span class="admin-badge ${escapeHtml(statusMeta.tone)}">${escapeHtml(statusMeta.label)}</span></td>
                </tr>
            `;
        }).join('');
    };

    const ensureChartEmptyStateElement = () => {
        if (!chartWrapper) {
            return null;
        }

        let emptyStateElement = chartWrapper.querySelector('.admin-chart-empty-state');
        if (!emptyStateElement) {
            emptyStateElement = document.createElement('div');
            emptyStateElement.className = 'admin-chart-empty-state';
            emptyStateElement.style.cssText = 'position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:24px; text-align:center; pointer-events:none; color:var(--admin-text-secondary); z-index:1;';
            chartWrapper.appendChild(emptyStateElement);
        }

        return emptyStateElement;
    };

    const syncChartEmptyState = (isEmpty) => {
        const emptyStateElement = ensureChartEmptyStateElement();
        if (!emptyStateElement) {
            return;
        }

        if (isEmpty) {
            emptyStateElement.innerHTML = `
                <strong>${escapeHtml(dashboardData.chartCopy.emptyStateTitle)}</strong>
                <span>${escapeHtml(dashboardData.chartCopy.emptyStateMessage)}</span>
            `;
            emptyStateElement.hidden = false;
            return;
        }

        emptyStateElement.hidden = true;
    };

    const buildChartSeries = (range, seriesByRange) => {
        const rangeMeta = getRangeMeta(range);
        const labels = buildTrailingRangeLabels(range)
            ?? (Array.isArray(rangeMeta.labels) ? rangeMeta.labels : []);
        const sourceSeries = seriesByRange?.[range] ?? {};

        const normalizeSeries = (values) => {
            const safeValues = Array.isArray(values) ? values : [];

            if (!labels.length) {
                return safeValues.map((value) => Number(value) || 0);
            }

            return labels.map((_, index) => Number(safeValues[index]) || 0);
        };

        const revenue = normalizeSeries(sourceSeries.revenue ?? sourceSeries.dataRevenue ?? sourceSeries.sales);
        const reservation = normalizeSeries(sourceSeries.reservation ?? sourceSeries.dataReservation ?? sourceSeries.count);
        const hasSeriesData = [...revenue, ...reservation].some((value) => value !== 0);

        return {
            labels,
            revenue,
            reservation,
            hasSeriesData
        };
    };

    let mainChartInstance = null;
    let currentRange = chartFilters.find((button) => button.classList.contains('active'))?.dataset.range
        ?? dashboardData.chartRanges[0]?.range
        ?? 'day';

    const renderChart = () => {
        if (!chartCtx) {
            return;
        }

        const currentState = AdminStore.getState();
        const snapshot = getDomainSnapshot(currentState.ui.domain, currentState);
        const { labels, revenue, reservation, hasSeriesData } = buildChartSeries(currentRange, snapshot.chartSeriesByRange);
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = currentState.ui.theme === 'system' ? (isSystemDark ? 'dark' : 'light') : currentState.ui.theme;
        const textColor = activeTheme === 'dark' ? 'hsl(220, 10%, 65%)' : 'hsl(220, 9%, 46%)';
        const gridColor = activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        if (mainChartInstance) {
            mainChartInstance.destroy();
        }

        mainChartInstance = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: dashboardData.chartSeriesLabels.revenue,
                        data: revenue,
                        borderColor: 'hsl(28, 90%, 55%)',
                        backgroundColor: 'rgba(230, 126, 34, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: dashboardData.chartSeriesLabels.reservation,
                        data: reservation,
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
                        ticks: { color: textColor },
                        suggestedMin: 0
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: textColor },
                        suggestedMin: 0
                    }
                }
            }
        });

        syncChartEmptyState(!hasSeriesData);
    };

    const renderDashboard = () => {
        const currentState = AdminStore.getState();
        const snapshot = getDomainSnapshot(currentState.ui.domain, currentState);

        syncSidebarUI(currentState.ui.sidebarOpen);
        syncThemeDOM(currentState.ui.theme);
        syncDomainButtons(currentState.ui.domain);
        syncChartButtons(currentRange);

        if (userNameEl) {
            userNameEl.textContent = session.name || '관리자';
        }

        if (userRoleEl) {
            userRoleEl.textContent = session.role;
        }

        if (sidebarMenuContainer) {
            sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);
        }

        if (kpiGrid) {
            kpiGrid.innerHTML = renderKPICards(snapshot.kpi);
        }

        renderRecentActivity(snapshot.recentActivity);
        renderChart();
    };

    setStaticLabels();
    renderDashboard();
    window.AdminDashboardHydrate = (payload) => {
        window.AdminDashboardPayload = payload && typeof payload === 'object' ? payload : {};
        renderDashboard();
    };

    let lastRequestedDashboardDomain = normalizeDashboardDomain(AdminStore.getState().ui.domain);
    void requestDashboardPayload(lastRequestedDashboardDomain);
    startDashboardAutoRefresh();

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') {
            return;
        }

        void requestActiveDashboardDomain();
    });

    window.addEventListener('beforeunload', stopDashboardAutoRefresh);
    window.addEventListener('pagehide', stopDashboardAutoRefresh);

    domainFilters.forEach((button) => {
        button.addEventListener('click', (event) => {
            const domain = event.currentTarget.dataset.domain;

            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: domain });
        });
    });

    chartFilters.forEach((button) => {
        button.addEventListener('click', (event) => {
            currentRange = event.currentTarget.dataset.range || currentRange;
            syncChartButtons(currentRange);
            renderChart();
        });
    });

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            AdminStore.dispatch({ type: 'UI/TOGGLE_SIDEBAR' });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const { logoutSession } = await import('../../core/auth/session_manager.js');
                await logoutSession();
            } catch (error) {
                localStorage.removeItem('userSession');
            }

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

    themeBtns.forEach((button) => {
        button.addEventListener('click', (event) => {
            const selectedTheme = event.currentTarget.dataset.theme;
            localStorage.setItem('adminTheme', selectedTheme);
            AdminStore.dispatch({ type: 'UI/SET_THEME', payload: selectedTheme });
        });
    });

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (AdminStore.getState().ui.theme === 'system') {
                renderDashboard();
            }
        });
    }

    AdminStore.subscribe((nextState) => {
        syncSidebarUI(nextState.ui.sidebarOpen);
        syncThemeDOM(nextState.ui.theme);
        syncDomainButtons(nextState.ui.domain);
        syncChartButtons(currentRange);

        const nextDomain = normalizeDashboardDomain(nextState.ui.domain);
        if (nextDomain !== lastRequestedDashboardDomain) {
            lastRequestedDashboardDomain = nextDomain;
            void requestDashboardPayload(nextDomain);
        }

        if (kpiGrid) {
            const snapshot = getDomainSnapshot(nextState.ui.domain, nextState);
            kpiGrid.innerHTML = renderKPICards(snapshot.kpi);
        }

        renderRecentActivity(getDomainSnapshot(nextState.ui.domain, nextState).recentActivity);
        renderChart();
    });

    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
