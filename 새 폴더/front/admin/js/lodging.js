/**
 * @file lodging.js
 * @description Product/Inventory Management View logic. Domains are synced with Store.
 */

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const routeResolverPromise = import('../../core/utils/path_resolver.js');
    const HOTEL_LIST_OFFER_STORAGE_KEY = 'jejuHotelListOfferOverridesV1';
    const HOTEL_LIST_OFFER_CATALOG_URL = '../data/hotel-list-offer-catalog.json';
    const currencyFormatter = new Intl.NumberFormat('ko-KR');

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
    const domainFilters = document.querySelectorAll('.segment-btn');
    const tableBody = document.getElementById('inventory-table-body');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const hotelOfferTableBody = document.getElementById('hotel-offer-table-body');
    const hotelOfferSearchInput = document.getElementById('hotel-offer-search-input');
    const hotelOfferResetAllBtn = document.getElementById('hotel-offer-reset-all-btn');
    const hotelOfferForm = document.getElementById('hotel-offer-form');
    const hotelOfferEditorCopy = document.getElementById('hotel-offer-editor-copy');
    const hotelOfferTitleInput = document.getElementById('hotel-offer-title');
    const hotelOfferBadgeInput = document.getElementById('hotel-offer-badge');
    const hotelOfferOriginalPriceInput = document.getElementById('hotel-offer-original-price');
    const hotelOfferCurrentPriceInput = document.getElementById('hotel-offer-current-price');
    const hotelOfferResetBtn = document.getElementById('hotel-offer-reset-btn');
    const hotelOfferPreview = document.getElementById('hotel-offer-preview');
    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });

    const MOCK_INVENTORY = Object.freeze([
        { id: 'INV-H01', domain: 'hotel', title: '신라호텔 제주 - 스탠다드 트윈', price: 350000, stock: 12, status: 'OPEN' },
        { id: 'INV-H02', domain: 'hotel', title: '파르나스 호텔 제주 - 풀빌라', price: 1200000, stock: 0, status: 'SOLD_OUT' },
        { id: 'INV-F01', domain: 'flight', title: '제주항공 7C141 (GMP-CJU)', price: 45000, stock: 45, status: 'OPEN' },
        { id: 'INV-R01', domain: 'rentcar', title: '스타렌터카 - 아이오닉 5 롱레인지', price: 95000, stock: 3, status: 'WARNING' },
        { id: 'INV-F02', domain: 'flight', title: '대한항공 KE1231 (CJU-GMP)', price: 85000, stock: 2, status: 'WARNING' },
        { id: 'INV-R02', domain: 'rentcar', title: '무지개렌터카 - 카니발 9인승', price: 155000, stock: 1, status: 'WARNING' }
    ]);

    let hotelOfferCatalog = [];
    let hotelOfferOverrides = readHotelOfferOverrides();
    let hotelOfferSearchKeyword = '';
    let selectedHotelOfferId = null;

    function readHotelOfferOverrides() {
        try {
            const rawValue = window.localStorage.getItem(HOTEL_LIST_OFFER_STORAGE_KEY);
            if (!rawValue) {
                return {};
            }

            const parsed = JSON.parse(rawValue);
            if (!parsed || typeof parsed !== 'object') {
                return {};
            }

            return Object.entries(parsed).reduce((accumulator, [hotelId, value]) => {
                if (!value || typeof value !== 'object') {
                    return accumulator;
                }

                const nextOverride = {};

                if (Object.prototype.hasOwnProperty.call(value, 'badge') && typeof value.badge === 'string') {
                    nextOverride.badge = value.badge;
                }

                const originalPrice = sanitizePriceValue(value.originalPrice);
                if (originalPrice !== null) {
                    nextOverride.originalPrice = originalPrice;
                }

                const currentPrice = sanitizePriceValue(value.currentPrice);
                if (currentPrice !== null) {
                    nextOverride.currentPrice = currentPrice;
                }

                if (Object.keys(nextOverride).length > 0) {
                    accumulator[hotelId] = nextOverride;
                }

                return accumulator;
            }, {});
        } catch (error) {
            console.error('[AdminLodging] Failed to parse hotel offer overrides:', error);
            return {};
        }
    }

    function persistHotelOfferOverrides(nextOverrides) {
        hotelOfferOverrides = nextOverrides;

        if (Object.keys(nextOverrides).length === 0) {
            window.localStorage.removeItem(HOTEL_LIST_OFFER_STORAGE_KEY);
            return;
        }

        window.localStorage.setItem(HOTEL_LIST_OFFER_STORAGE_KEY, JSON.stringify(nextOverrides));
    }

    function sanitizePriceValue(value) {
        const normalized = String(value ?? '').replace(/[^0-9]/g, '');
        if (!normalized) {
            return null;
        }

        const parsed = Number.parseInt(normalized, 10);
        if (Number.isNaN(parsed) || parsed < 0) {
            return null;
        }

        return parsed;
    }

    function formatWon(value) {
        if (!Number.isFinite(value)) {
            return '-';
        }

        return `₩${currencyFormatter.format(Math.round(value))}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function getHotelOfferById(hotelId) {
        return hotelOfferCatalog.find((hotel) => hotel.id === hotelId) ?? null;
    }

    function getEffectiveHotelOffer(hotel) {
        const override = hotelOfferOverrides[hotel.id] ?? {};
        const hasBadgeOverride = Object.prototype.hasOwnProperty.call(override, 'badge');
        const hasPriceOverride =
            typeof override.originalPrice === 'number' ||
            typeof override.currentPrice === 'number' ||
            hasBadgeOverride;

        return {
            ...hotel,
            badge: hasBadgeOverride ? override.badge : hotel.badge,
            originalPrice: typeof override.originalPrice === 'number' ? override.originalPrice : hotel.originalPrice,
            currentPrice: typeof override.currentPrice === 'number' ? override.currentPrice : hotel.currentPrice,
            isCustomized: hasPriceOverride
        };
    }

    function renderSidebarMenus(role) {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'lodging' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    }

    function getStatusBadge(status) {
        switch (status) {
            case 'OPEN':
                return '<span class="admin-badge success">판매중</span>';
            case 'WARNING':
                return '<span class="admin-badge warning">품절 임박</span>';
            case 'SOLD_OUT':
                return '<span class="admin-badge danger">판매 완료 (품절)</span>';
            default:
                return '<span class="admin-badge neutral">-</span>';
        }
    }

    function getDomainBadge(domain) {
        switch (domain) {
            case 'hotel':
                return '<span class="admin-badge neutral" style="color:hsl(28, 90%, 55%); border-color:hsl(28, 90%, 55%);">스테이</span>';
            case 'flight':
                return '<span class="admin-badge neutral" style="color:hsl(210, 80%, 60%); border-color:hsl(210, 80%, 60%);">에어</span>';
            case 'rentcar':
                return '<span class="admin-badge neutral" style="color:hsl(140, 60%, 45%); border-color:hsl(140, 60%, 45%);">렌터카</span>';
            default:
                return '';
        }
    }

    function renderInventoryTable(domain) {
        const filtered = domain === 'all'
            ? MOCK_INVENTORY
            : MOCK_INVENTORY.filter((item) => item.domain === domain);

        if (filtered.length === 0) {
            return '<tr><td colspan="7" style="text-align:center; padding: 40px;">해당 분류의 재고 데이터가 없습니다.</td></tr>';
        }

        return filtered.map((item) => `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>${getDomainBadge(item.domain)}</td>
                <td>${item.title}</td>
                <td>${formatWon(item.price)}</td>
                <td style="font-weight:bold; color: ${item.stock < 5 ? 'var(--admin-danger)' : 'var(--admin-text-primary)'}">${item.stock} 개</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <button class="admin-btn admin-btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">재고 수정</button>
                    <button class="admin-btn" style="padding: 4px 8px; font-size: 0.75rem; background:var(--admin-surface-hover); color:var(--admin-text-primary); border:1px solid var(--admin-border);">상세</button>
                </td>
            </tr>
        `).join('');
    }

    function renderHotelOfferTable() {
        if (!hotelOfferTableBody) {
            return;
        }

        if (hotelOfferCatalog.length === 0) {
            hotelOfferTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 40px;">호텔 리스트 오퍼 데이터를 불러오지 못했다.</td></tr>';
            return;
        }

        const query = hotelOfferSearchKeyword.trim().toLowerCase();
        const filteredCatalog = hotelOfferCatalog
            .map(getEffectiveHotelOffer)
            .filter((hotel) => {
                if (!query) {
                    return true;
                }

                const searchable = `${hotel.id} ${hotel.title} ${hotel.badge ?? ''}`.toLowerCase();
                return searchable.includes(query);
            });

        if (filteredCatalog.length === 0) {
            hotelOfferTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 40px;">검색 조건에 맞는 호텔이 없다.</td></tr>';
            return;
        }

        hotelOfferTableBody.innerHTML = filteredCatalog.map((hotel) => `
            <tr class="${selectedHotelOfferId === hotel.id ? 'hotel-offer-row-active' : ''}">
                <td><strong>${escapeHtml(hotel.id)}</strong></td>
                <td>${escapeHtml(hotel.title)}</td>
                <td>${hotel.badge ? escapeHtml(hotel.badge) : '<span class="admin-badge neutral">숨김</span>'}</td>
                <td>${formatWon(hotel.originalPrice)}</td>
                <td>${formatWon(hotel.currentPrice)}</td>
                <td>
                    <span class="hotel-offer-status${hotel.isCustomized ? ' hotel-offer-status--custom' : ''}">
                        ${hotel.isCustomized ? '커스텀 적용' : '기본값'}
                    </span>
                </td>
                <td>
                    <button class="admin-btn admin-btn-outline" data-action="edit-offer" data-hotel-id="${escapeHtml(hotel.id)}" type="button">
                        수정
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updateHotelOfferPreview() {
        if (!hotelOfferPreview) {
            return;
        }

        if (!selectedHotelOfferId) {
            hotelOfferPreview.textContent = '아직 선택된 호텔이 없다.';
            return;
        }

        const selectedHotel = getHotelOfferById(selectedHotelOfferId);
        if (!selectedHotel) {
            hotelOfferPreview.textContent = '선택한 호텔 데이터를 찾을 수 없다.';
            return;
        }

        const badge = hotelOfferBadgeInput?.value ?? selectedHotel.badge;
        const originalPrice = sanitizePriceValue(hotelOfferOriginalPriceInput?.value) ?? selectedHotel.originalPrice;
        const currentPrice = sanitizePriceValue(hotelOfferCurrentPriceInput?.value) ?? selectedHotel.currentPrice;

        hotelOfferPreview.innerHTML = `
            <strong>${escapeHtml(selectedHotel.title)}</strong><br>
            배지: ${badge.trim() ? escapeHtml(badge.trim()) : '숨김'}<br>
            정상가: ${formatWon(originalPrice)}<br>
            판매가: ${formatWon(currentPrice)}
        `;
    }

    function hydrateHotelOfferEditor(hotelId) {
        const selectedHotel = getHotelOfferById(hotelId);
        if (!selectedHotel) {
            return;
        }

        const effectiveHotel = getEffectiveHotelOffer(selectedHotel);
        selectedHotelOfferId = hotelId;

        if (hotelOfferTitleInput) {
            hotelOfferTitleInput.value = effectiveHotel.title;
        }

        if (hotelOfferBadgeInput) {
            hotelOfferBadgeInput.value = effectiveHotel.badge ?? '';
        }

        if (hotelOfferOriginalPriceInput) {
            hotelOfferOriginalPriceInput.value = String(effectiveHotel.originalPrice);
        }

        if (hotelOfferCurrentPriceInput) {
            hotelOfferCurrentPriceInput.value = String(effectiveHotel.currentPrice);
        }

        if (hotelOfferEditorCopy) {
            hotelOfferEditorCopy.textContent = `${effectiveHotel.id} 항목을 수정 중이다. 저장하면 호텔 리스트 카드에 바로 반영된다.`;
        }

        renderHotelOfferTable();
        updateHotelOfferPreview();
    }

    function clearHotelOfferEditor(copy = '왼쪽 목록에서 수정할 호텔을 골라라.') {
        selectedHotelOfferId = null;

        if (hotelOfferTitleInput) {
            hotelOfferTitleInput.value = '';
        }

        if (hotelOfferBadgeInput) {
            hotelOfferBadgeInput.value = '';
        }

        if (hotelOfferOriginalPriceInput) {
            hotelOfferOriginalPriceInput.value = '';
        }

        if (hotelOfferCurrentPriceInput) {
            hotelOfferCurrentPriceInput.value = '';
        }

        if (hotelOfferEditorCopy) {
            hotelOfferEditorCopy.textContent = copy;
        }

        if (hotelOfferPreview) {
            hotelOfferPreview.textContent = '아직 선택된 호텔이 없다.';
        }

        renderHotelOfferTable();
    }

    function handleHotelOfferSubmit(event) {
        event.preventDefault();

        if (!selectedHotelOfferId) {
            if (hotelOfferEditorCopy) {
                hotelOfferEditorCopy.textContent = '저장할 호텔을 먼저 선택해라.';
            }
            return;
        }

        const selectedHotel = getHotelOfferById(selectedHotelOfferId);
        if (!selectedHotel) {
            if (hotelOfferEditorCopy) {
                hotelOfferEditorCopy.textContent = '선택한 호텔 원본 데이터를 찾지 못했다.';
            }
            return;
        }

        const nextBadge = (hotelOfferBadgeInput?.value ?? '').trim();
        const nextOriginalPrice = sanitizePriceValue(hotelOfferOriginalPriceInput?.value);
        const nextCurrentPrice = sanitizePriceValue(hotelOfferCurrentPriceInput?.value);

        if (nextOriginalPrice === null || nextCurrentPrice === null) {
            if (hotelOfferEditorCopy) {
                hotelOfferEditorCopy.textContent = '가격은 숫자로 넣어야 한다.';
            }
            updateHotelOfferPreview();
            return;
        }

        if (nextCurrentPrice > nextOriginalPrice) {
            if (hotelOfferEditorCopy) {
                hotelOfferEditorCopy.textContent = '판매가는 정상가보다 클 수 없다.';
            }
            updateHotelOfferPreview();
            return;
        }

        const nextOverride = {};

        if (nextBadge !== selectedHotel.badge) {
            nextOverride.badge = nextBadge;
        }

        if (nextOriginalPrice !== selectedHotel.originalPrice) {
            nextOverride.originalPrice = nextOriginalPrice;
        }

        if (nextCurrentPrice !== selectedHotel.currentPrice) {
            nextOverride.currentPrice = nextCurrentPrice;
        }

        const nextOverrides = { ...hotelOfferOverrides };
        if (Object.keys(nextOverride).length === 0) {
            delete nextOverrides[selectedHotelOfferId];
        } else {
            nextOverrides[selectedHotelOfferId] = nextOverride;
        }

        persistHotelOfferOverrides(nextOverrides);
        hydrateHotelOfferEditor(selectedHotelOfferId);

        if (hotelOfferEditorCopy) {
            hotelOfferEditorCopy.textContent = `${selectedHotel.title} 노출 값 저장 완료. 호텔 리스트 새로고침하면 바로 확인된다.`;
        }
    }

    function resetSelectedHotelOffer() {
        if (!selectedHotelOfferId) {
            if (hotelOfferEditorCopy) {
                hotelOfferEditorCopy.textContent = '초기화할 호텔을 먼저 선택해라.';
            }
            return;
        }

        const selectedHotel = getHotelOfferById(selectedHotelOfferId);
        const nextOverrides = { ...hotelOfferOverrides };
        delete nextOverrides[selectedHotelOfferId];
        persistHotelOfferOverrides(nextOverrides);

        if (selectedHotel) {
            hydrateHotelOfferEditor(selectedHotelOfferId);
            if (hotelOfferEditorCopy) {
                hotelOfferEditorCopy.textContent = `${selectedHotel.title} 항목을 기본값으로 되돌렸다.`;
            }
        } else {
            clearHotelOfferEditor();
        }
    }

    function resetAllHotelOffers() {
        if (hotelOfferCatalog.length === 0) {
            return;
        }

        const shouldReset = window.confirm('호텔 리스트 혜택 문구와 가격 오버라이드를 전부 기본값으로 되돌릴까?');
        if (!shouldReset) {
            return;
        }

        persistHotelOfferOverrides({});
        clearHotelOfferEditor('전체 오버라이드를 초기화했다. 다시 호텔을 선택해서 수정하면 된다.');
    }

    async function loadHotelOfferCatalog() {
        if (!hotelOfferTableBody) {
            return;
        }

        try {
            const response = await fetch(HOTEL_LIST_OFFER_CATALOG_URL, {
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`hotel offer catalog fetch failed: ${response.status}`);
            }

            const parsed = await response.json();
            hotelOfferCatalog = Array.isArray(parsed) ? parsed : [];
            renderHotelOfferTable();
        } catch (error) {
            console.error('[AdminLodging] Failed to load hotel offer catalog:', error);
            hotelOfferCatalog = [];
            renderHotelOfferTable();
        }
    }

    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);

    domainFilters.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const domain = event.currentTarget.dataset.domain;
            domainFilters.forEach((item) => item.classList.remove('active'));
            event.currentTarget.classList.add('active');
            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: domain });
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
            AdminStore.dispatch({ type: 'UI/SET_THEME', payload: selectedTheme });
        });
    });

    if (hotelOfferSearchInput) {
        hotelOfferSearchInput.addEventListener('input', (event) => {
            hotelOfferSearchKeyword = event.currentTarget.value;
            renderHotelOfferTable();
        });
    }

    if (hotelOfferTableBody) {
        hotelOfferTableBody.addEventListener('click', (event) => {
            const actionButton = event.target.closest('[data-action="edit-offer"]');
            if (!actionButton) {
                return;
            }

            const hotelId = actionButton.dataset.hotelId;
            if (!hotelId) {
                return;
            }

            hydrateHotelOfferEditor(hotelId);
        });
    }

    if (hotelOfferForm) {
        hotelOfferForm.addEventListener('submit', handleHotelOfferSubmit);
    }

    if (hotelOfferResetBtn) {
        hotelOfferResetBtn.addEventListener('click', resetSelectedHotelOffer);
    }

    if (hotelOfferResetAllBtn) {
        hotelOfferResetAllBtn.addEventListener('click', resetAllHotelOffers);
    }

    [hotelOfferBadgeInput, hotelOfferOriginalPriceInput, hotelOfferCurrentPriceInput].forEach((input) => {
        if (!input) {
            return;
        }

        input.addEventListener('input', () => {
            updateHotelOfferPreview();
        });
    });

    function updateThemeDOM(theme) {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
        document.body.setAttribute('data-theme', activeTheme);
        themeBtns.forEach((btn) => {
            if (btn.dataset.theme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    AdminStore.subscribe((newState) => {
        syncSidebarUI(newState.ui.sidebarOpen);
        updateThemeDOM(newState.ui.theme);

        if (tableBody) {
            tableBody.innerHTML = renderInventoryTable(newState.ui.domain);
        }
    });

    const initialState = AdminStore.getState();
    syncSidebarUI(initialState.ui.sidebarOpen);
    updateThemeDOM(initialState.ui.theme);
    if (tableBody) tableBody.innerHTML = renderInventoryTable(initialState.ui.domain);
    clearHotelOfferEditor();
    await loadHotelOfferCatalog();
    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
