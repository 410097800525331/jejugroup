/**
 * @file dashboard.js
 * @description Dashboard Rendering Engine & Event Bindings
 * Uses pure functions for component generation
 */

 document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const apiClientPromise = import('./api_client.js');
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
                console.error('[AdminDashboard] Route resolution failed:', error);
                const fallback = window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl || new URL('index.html', window.location.href).href;
                if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(fallback, 'admin-route-fallback');
                    return;
                }
                window.location.replace(fallback);
            });
    };

    // 1. Initial State Load
    const state = AdminStore.getState();
    const session = await window.AdminAuth?.waitForAdminSession?.();

    // Security: Guard fallback just in case
    if (!session || !session.role) {
        redirectByRoute('HOME');
        return;
    }

    // 2. DOM Elements
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
    const chartFilters = document.querySelectorAll('.chart-filter-btn');
    const domainFilters = document.querySelectorAll('.segment-btn');
    const recentActivityTable = document.getElementById('admin-recent-activity');
    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });
    
    // Store Chart Instance Globally 
    let mainChartInstance = null;

    const loadDashboardSeed = async (domain) => {
        try {
            const { fetchAdminPayload } = await apiClientPromise;
            const seed = await fetchAdminPayload(`/api/admin/dashboard?domain=${encodeURIComponent(domain || 'all')}`);
            if (seed && typeof AdminStore.hydrateFromSeed === 'function') {
                AdminStore.hydrateFromSeed(seed);
            }
        } catch (error) {
            console.warn('[AdminDashboard] Live dashboard load failed:', error);
        }
    };

    // 3. Render Functions (Pure functions returning HTML strings)
    
    const renderSidebarMenus = (role, currentPath) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map(menu => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'dashboard' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const renderKPICards = (kpiData, domain) => {
        const icons = {
            todayReservations: '👥',
            revenue: '📨',
            cancelRate: '📢',
            activeUsers: '❓'
        };
        const labels = {
            todayReservations: '회원 수',
            revenue: '문의 수',
            cancelRate: '공지 수',
            activeUsers: 'FAQ 수'
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
                <h2 class="admin-card-value">${value}</h2>
                <div class="admin-card-trend positive">
                    <span>현재 DB 기준</span>
                </div>
            </div>
        `).join('');
    };

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

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
            const badgeClass =
                type === 'NOTICE' ? 'warning' :
                type === 'TICKET' ? 'success' :
                'danger';
            const typeLabel = escapeHtml(type || '-');
            const desc = escapeHtml(item?.desc ?? '-');
            const time = escapeHtml(item?.time ?? '-');
            const status = escapeHtml(item?.status ?? '-');

            return `
                <tr>
                    <td><span class="admin-badge ${badgeClass}">${typeLabel}</span></td>
                    <td>${desc}</td>
                    <td>${time}</td>
                    <td><span class="admin-badge ${badgeClass}">${status}</span></td>
                </tr>
            `;
        }).join('');
    };

    const syncDashboardDomainFilters = (activeDomain) => {
        domainFilters.forEach((button) => {
            button.classList.toggle('active', button.dataset.domain === activeDomain);
        });
    };

    // 4. Mount & Bind
    
    // Mount User Info
    if (userNameEl) userNameEl.textContent = session.name || '관리자';
    if (userRoleEl) userRoleEl.textContent = session.role;

    // Mount Menus (RBAC applied)
    if (sidebarMenuContainer) {
        sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role, window.location.pathname);
    }

    // Bind UI Events (Moved up before first store init)
    
    // Domain Filter Button Click Listener
    domainFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const domain = e.currentTarget.dataset.domain;
            
            // Visual Sync
            domainFilters.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: domain });
            loadDashboardSeed(domain);
        });
    });

    // Sidebar Toggle
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

    await loadDashboardSeed(state.ui.domain);

    // Dropdown Toggle Logic
    if (profileTrigger && profileContainer) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileContainer.classList.toggle('active');
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target)) {
                profileContainer.classList.remove('active');
            }
        });
    }

    // Language Toggle logic (Mockup)
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Immutability visual sync only
            langBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            // Optional: Dispatch to store or update localstorage
        });
    });

    // 5. Store Subscription for UI Updates
    AdminStore.subscribe((newState) => {
        // Handle Sidebar Toggle Reactively
        syncSidebarUI(newState.ui.sidebarOpen);

        // Handle Domain Reactive Update (Re-render KPIs, Activity, and Chart)
        syncDashboardDomainFilters(newState.ui.domain);
        if (kpiGrid) {
            kpiGrid.innerHTML = renderKPICards(newState.kpi, newState.ui.domain);
        }

        if (recentActivityTable) {
            recentActivityTable.innerHTML = renderRecentActivityRows(newState.recentActivity);
        }
        
        const activeFilterBtn = document.querySelector('.chart-filter-btn.active');
        const currentRange = activeFilterBtn ? activeFilterBtn.dataset.range : 'day';
        
        // Ensure theme UI reacts to store state changes instantly
        if (typeof updateThemeDOM === 'function') {
            updateThemeDOM(newState.ui.theme);
        } else {
             initOrUpdateChart(currentRange, newState.ui.theme, newState.ui.domain);
        }
    });

    // 6. Chart Logic Implementation
    
    // Zero-state chart rendering: keep the chart shell alive without fake business data
    const generateChartData = () => {
        return {
            labels: [],
            dataRevenue: [],
            dataReservation: []
        };
    };

    const initOrUpdateChart = (range, theme, domain = 'all') => {
        if (!chartCtx) return;

        const { labels, dataRevenue, dataReservation } = generateChartData(range, domain);
        
        // Compute colors based on active theme
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
        
        const textColor = activeTheme === 'dark' ? 'hsl(220, 10%, 65%)' : 'hsl(220, 9%, 46%)';
        const gridColor = activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        
        if (mainChartInstance) {
            mainChartInstance.destroy();
        }

        mainChartInstance = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '히스토리 스냅샷 없음',
                        data: dataRevenue,
                        borderColor: 'hsl(28, 90%, 55%)', // Accent
                        backgroundColor: 'rgba(230, 126, 34, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: '실데이터 추이 미구성',
                        data: dataReservation,
                        borderColor: 'hsl(140, 60%, 45%)', // Success
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
                    intersect: false,
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
                        grid: { drawOnChartArea: false }, // Only draw grid lines for one axis to keep it clean
                        ticks: { color: textColor }
                    }
                }
            }
        });
    };

    // Filter Button Click Listener
    chartFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const range = e.currentTarget.dataset.range;
            
            // UI Toggle
            chartFilters.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Dispatch to internal method using current theme & domain
            initOrUpdateChart(range, AdminStore.getState().ui.theme, AdminStore.getState().ui.domain);
        });
    });

    // 7. Theme Logic Implementation
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    // Pure function for computing actual DOM theme
    const updateThemeDOM = (theme) => {
        // Evaluate system theme on the fly
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // If theme is 'system', compute fallback string. Otherwise use explicit theme.
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
        
        // Update DOM safely
        document.body.setAttribute('data-theme', activeTheme);
        
        // Immutability principle: Do not modify state directly inside UI updaters,
        // but updating local DOM element active classes is required for View layer.
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const activeFilterBtn = document.querySelector('.chart-filter-btn.active');
        const currentRange = activeFilterBtn ? activeFilterBtn.dataset.range : 'day';
        const currentDomain = AdminStore.getState().ui.domain;
        initOrUpdateChart(currentRange, theme, currentDomain);
    };

    // Listen to System level theme transitions
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const currentThemeStore = AdminStore.getState().ui.theme;
            if (currentThemeStore === 'system') {
                updateThemeDOM('system');
            }
        });
    }

    // Bind Button Clicks to Store Dispatch
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedTheme = e.currentTarget.dataset.theme;
            localStorage.setItem('adminTheme', selectedTheme); // Side-effect: Persist
            AdminStore.dispatch({ type: 'UI/SET_THEME', payload: selectedTheme });
        });
    });

    // Initial Visual Sync (Trigger First Render manually)
    syncSidebarUI(state.ui.sidebarOpen);
    updateThemeDOM(state.ui.theme);
    const finalState = AdminStore.getState();
    syncDashboardDomainFilters(finalState.ui.domain);
    if (kpiGrid) kpiGrid.innerHTML = renderKPICards(finalState.kpi, finalState.ui.domain);
    if (recentActivityTable) recentActivityTable.innerHTML = renderRecentActivityRows(finalState.recentActivity);
    initOrUpdateChart('day', finalState.ui.theme, finalState.ui.domain);
    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
