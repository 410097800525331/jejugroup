/**
 * @file dashboard.js
 * @description Dashboard Rendering Engine & Event Bindings
 * Uses pure functions for component generation
 */

 document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Initial State Load
    const state = AdminStore.getState();
    const session = window.AdminSession;

    // Security: Guard fallback just in case
    if (!session || !session.role) {
        window.location.replace('/index.html');
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
    
    // Store Chart Instance Globally 
    let mainChartInstance = null;

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
            todayReservations: '📝',
            revenue: '💰',
            cancelRate: '📉',
            activeUsers: '🟢'
        };
        const labels = {
            todayReservations: '오늘의 예약',
            revenue: '금일 매출',
            cancelRate: '취소율',
            activeUsers: '현재 접속자'
        };

        // 다형성 부여: 화면에 보이는 수치를 도메인 상태에 따라 스케일 조절 (모의 데이터 연산)
        let multiplier = 1;
        if(domain === 'flight') multiplier = 0.4;
        else if(domain === 'hotel') multiplier = 0.45;
        else if(domain === 'rentcar') multiplier = 0.15;

        const formatNumber = (num, isMoney) => {
            return isMoney ? `₩${Math.round(num).toLocaleString('ko-KR')}` : Math.round(num).toLocaleString('ko-KR');
        };

        const computedKpi = {
            todayReservations: formatNumber(kpiData.todayReservations * multiplier, false),
            revenue: formatNumber(12450000 * multiplier, true), 
            cancelRate: domain === 'all' ? kpiData.cancelRate : (parseFloat(kpiData.cancelRate) * (Math.random() * (1.2 - 0.8) + 0.8)).toFixed(1) + '%',
            activeUsers: formatNumber(kpiData.activeUsers * multiplier, false)
        };
        
        return Object.entries(computedKpi).map(([key, value]) => `
            <div class="admin-card">
                <div class="admin-card-header">
                    <h3 class="admin-card-title">${labels[key]}</h3>
                    <div class="admin-card-icon">${icons[key]}</div>
                </div>
                <h2 class="admin-card-value">${value}</h2>
                <div class="admin-card-trend ${key === 'cancelRate' ? 'negative' : 'positive'}">
                    <span>${key === 'cancelRate' ? '▲' : '▼'} 전일 대비 1.2%</span>
                </div>
            </div>
        `).join('');
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
        });
    });

    // Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            AdminStore.dispatch({ type: 'UI/TOGGLE_SIDEBAR' });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
             // Security Protocol: Destroy session and rotate out
            localStorage.removeItem('userSession');
            window.location.replace('/index.html');
        });
    }

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
        if (sidebar && layout) {
            if (window.innerWidth > 1024) {
                // PC: layout class toggle
                if (newState.ui.sidebarOpen) {
                    layout.classList.remove('sidebar-collapsed');
                } else {
                    layout.classList.add('sidebar-collapsed');
                }
            } else {
                // Mobile: sidebar transform class toggle
                if (newState.ui.sidebarOpen) {
                    sidebar.classList.add('open');
                } else {
                    sidebar.classList.remove('open');
                }
            }
        }

        // Handle Domain Reactive Update (Re-render KPIs and Chart)
        if (kpiGrid) {
            kpiGrid.innerHTML = renderKPICards(newState.kpi, newState.ui.domain);
        }
        
        const activeFilterBtn = document.querySelector('.chart-filter-btn.active');
        const currentRange = activeFilterBtn ? activeFilterBtn.dataset.range : 'day';
        initOrUpdateChart(currentRange, newState.ui.theme, newState.ui.domain);
    });

    // 6. Chart Logic Implementation
    
    // Pure function for Mock Data Generation based on domain weight
    const generateChartData = (range, domain) => {
        let labels = [];
        let dataRevenue = [];
        let dataReservation = [];
        let count = 0;

        switch(range) {
            case 'hour':
                labels = Array.from({length: 24}, (_, i) => `${i}:00`);
                count = 24;
                break;
            case 'day':
                labels = Array.from({length: 7}, (_, i) => `D-${6-i}`);
                count = 7;
                break;
            case 'week':
                labels = Array.from({length: 8}, (_, i) => `${i+1}주차`);
                count = 8;
                break;
            case 'month':
                labels = Array.from({length: 12}, (_, i) => `${i+1}월`);
                count = 12;
                break;
            case 'halfYear':
                labels = ['1-6월', '7-12월', '최근1-6', '최근7-12'];
                count = 4;
                break;
            case '1year':
                labels = Array.from({length: 12}, (_, i) => `25년 ${i+1}월`);
                count = 12;
                break;
            case '2year':
                labels = ['24년 1Q', '24년 2Q', '24년 3Q', '24년 4Q', '25년 1Q', '25년 2Q', '25년 3Q', '25년 4Q'];
                count = 8;
                break;
            case '5year':
                labels = ['2022', '2023', '2024', '2025', '2026'];
                count = 5;
                break;
            default:
                labels = ['데이터 없음'];
                count = 1;
        }

        // Base randomness modifier based on domain (Scaled down for "만원" unit)
        let baseRevMin = 100, baseRevMax = 500;
        let baseResMin = 50, baseResMax = 500;

        if (domain === 'flight') {
            baseRevMin = 40; baseRevMax = 200; baseResMin = 20; baseResMax = 200;
        } else if (domain === 'hotel') {
            baseRevMin = 45; baseRevMax = 225; baseResMin = 22; baseResMax = 225;
        } else if (domain === 'rentcar') {
            baseRevMin = 15; baseRevMax = 75; baseResMin = 8; baseResMax = 75;
        }

        // Generate Random Fake Data Based on Count and Domain Weight
        for(let i = 0; i < count; i++) {
            let revFormat = (Math.random() * (baseRevMax - baseRevMin) + baseRevMin).toFixed(1);
            dataRevenue.push(parseFloat(revFormat));
            dataReservation.push(Math.floor(Math.random() * (baseResMax - baseResMin + 1) + baseResMin));
        }

        return { labels, dataRevenue, dataReservation };
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
                        label: '매출액 (단위: 만원)',
                        data: dataRevenue,
                        borderColor: 'hsl(28, 90%, 55%)', // Accent
                        backgroundColor: 'rgba(230, 126, 34, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: '예약 건수 (건)',
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
    updateThemeDOM(state.ui.theme);
    if (kpiGrid) kpiGrid.innerHTML = renderKPICards(state.kpi, state.ui.domain);
    initOrUpdateChart('day', state.ui.theme, state.ui.domain);
});
