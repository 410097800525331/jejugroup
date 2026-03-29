/**
 * @file cms.js
 * @description CMS / banner / visibility rule management view logic.
 */

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const { default: cmsConfig } = await import('../data/cms-config.js');
    const routeResolverPromise = import('../../core/utils/path_resolver.js');
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
                console.error('[AdminCms] Route resolution failed:', error);
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
    const tableBody = document.getElementById('cms-table-body');
    const tableHeadRow = document.querySelector('.admin-table thead tr');
    const searchInput = document.querySelector('.admin-table-actions input[type="text"]');
    const statusFilter = document.getElementById('cms-status-filter');
    const searchButton = document.getElementById('cms-search-btn');
    const actionButtonsContainer = document.getElementById('cms-action-buttons');
    const noticeModalBackdrop = document.getElementById('cms-notice-modal');
    const noticeModalCloseBtn = document.getElementById('cms-notice-modal-close');
    const noticeModalCancelBtn = document.getElementById('cms-notice-modal-cancel');
    const noticeModalSubmitBtn = document.getElementById('cms-notice-modal-submit');
    const noticeModalForm = document.getElementById('cms-notice-form');
    const noticeModalServiceSelect = document.getElementById('cms-notice-service-category');
    const noticeModalTypeSelect = document.getElementById('cms-notice-type');
    const noticeModalTitleInput = document.getElementById('cms-notice-title');
    const noticeModalContentInput = document.getElementById('cms-notice-content');
    const noticeTypeFilter = document.getElementById('cms-notice-type-filter');
    const noticePaginationContainer = document.getElementById('cms-notice-pagination');
    const noticeModalEyebrow = noticeModalBackdrop?.querySelector('.admin-modal-eyebrow');
    const noticeModalTitle = noticeModalBackdrop?.querySelector('.admin-modal-title');
    const noticeModalDescription = noticeModalBackdrop?.querySelector('.admin-modal-description');
    const noticeModal = noticeModalBackdrop?.querySelector('.admin-modal');
    const adminLayoutRoot = document.querySelector('.admin-layout');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileContainer = document.getElementById('admin-profile-container');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const syncSidebarUI = (isOpen) => window.AdminSidebarUI?.applySidebarUI({ layout, sidebar, isOpen });
    const TAB_CONFIG = cmsConfig.tabs;
    const DEFAULT_TAB = cmsConfig.defaultTab;
    const NOTICE_PAGE_SIZE = Number(cmsConfig.tabs?.notices?.pageSize ?? 8) || 8;
    let activeTab = DEFAULT_TAB;
    let searchKeyword = '';
    let activeStatus = 'all';
    let activeNoticeType = 'all';
    let activeNoticePage = 1;
    let noticeModalMode = 'create';
    let lastNoticeModalTrigger = null;
    let lastNoticeModalFocus = null;
    let editingNoticeId = null;
    let editingNoticeRecord = null;
    let noticeRecordCache = new Map();
    let preservedNoticeId = null;
    let isNoticeSaving = false;
    let isNoticeActionPending = false;

    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const normalizeNoticeServiceType = (value) => {
        switch ((value || '').trim().toLowerCase()) {
            case 'air':
            case 'jeju-air':
                return 'jeju-air';
            case 'stay':
            case 'jeju-stay':
                return 'jeju-stay';
            case 'rentcar':
            case 'jeju-rental':
                return 'jeju-rental';
            case 'integrated':
            case 'common':
            default:
                return 'common';
        }
    };

    const normalizeNoticeType = (value) => ((value || '').trim().toLowerCase() === 'event' ? 'event' : 'notice');

    const formatNoticeServiceSelectValue = (value) => {
        switch (normalizeNoticeServiceType(value)) {
            case 'jeju-air':
                return 'air';
            case 'jeju-stay':
                return 'stay';
            case 'jeju-rental':
                return 'rentcar';
            case 'common':
            default:
                return 'integrated';
        }
    };

    const normalizeNoticeFilterType = (value) => {
        switch ((value || '').trim().toLowerCase()) {
            case 'notice':
            case 'event':
                return value.trim().toLowerCase();
            default:
                return 'all';
        }
    };

    const formatNoticeServiceLabel = (value) => {
        switch (normalizeNoticeServiceType(value)) {
            case 'jeju-air':
                return '제주에어';
            case 'jeju-stay':
                return '제주스테이';
            case 'jeju-rental':
                return '제주렌터카';
            case 'common':
            default:
                return '통합';
        }
    };

    const formatNoticeTypeLabel = (value) => (normalizeNoticeType(value) === 'event' ? 'event' : 'notice');

    const requestNoticeJson = async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                ...(options.headers || {})
            }
        });

        const raw = await response.text();
        let parsed = null;
        if (raw) {
            try {
                parsed = JSON.parse(raw);
            } catch {
                parsed = raw;
            }
        }

        return { response, parsed };
    };

    const getNoticeModalSubmitLabel = () => (noticeModalMode === 'edit' ? '수정' : '등록');

    const getNoticeModalCopy = (mode) => (mode === 'edit' ? {
        eyebrow: '공지사항 수정',
        title: '공지 수정',
        description: '기존 공지 내용을 수정한 뒤 바로 저장합니다.',
        submit: '수정'
    } : {
        eyebrow: '공지사항 등록',
        title: '새 공지 작성',
        description: '서비스 분류와 공지 유형을 포함해 새 공지를 바로 저장합니다.',
        submit: '등록'
    });

    const normalizeNoticeRecord = (notice) => {
        if (!notice || typeof notice !== 'object') return null;
        const id = notice.id ?? notice.noticeId ?? notice.notice_id ?? notice.noticeID;
        if (id === undefined || id === null || String(id).trim() === '') return null;

        const publishedAt = notice.publishedAt || notice.createdAt || notice.updatedAt || '';

        return {
            id: String(id).trim(),
            serviceType: normalizeNoticeServiceType(notice.serviceType ?? notice.service),
            noticeType: normalizeNoticeType(notice.noticeType ?? notice.type),
            title: String(notice.title || '').trim(),
            excerpt: String(notice.excerpt || '').trim(),
            content: String(notice.content || '').trim(),
            active: notice.active !== false,
            pinned: notice.pinned === true,
            publishedAt,
            createdAt: notice.createdAt || '',
            updatedAt: notice.updatedAt || ''
        };
    };

    const normalizeAdminNoticeRow = (row) => {
        if (!row || typeof row !== 'object') return null;

        const cells = Array.isArray(row.cells) ? row.cells : [];
        const id = row.noticeId ?? row.id ?? cells[0];
        if (id === undefined || id === null || String(id).trim() === '') return null;

        const serviceTypeText = String(cells[1] ?? row.serviceType ?? row.service ?? '').trim();
        const noticeTypeText = String(cells[2] ?? row.noticeType ?? row.type ?? '').trim();
        const title = String(cells[3] ?? row.title ?? '').trim();
        const publishedAt = String(cells[4] ?? row.publishedAt ?? row.createdAt ?? row.updatedAt ?? '').trim();
        const statusKey = row.statusKey || resolveNoticeStatusKey(row.active !== false, publishedAt);

        return {
            id: String(id).trim(),
            serviceType: normalizeNoticeServiceType(row.serviceType ?? row.service ?? serviceTypeText),
            noticeType: normalizeNoticeType(row.noticeType ?? row.type ?? noticeTypeText),
            title,
            excerpt: String(row.excerpt || '').trim(),
            content: String(row.content || '').trim(),
            active: statusKey !== 'inactive',
            pinned: row.pinned === true,
            publishedAt,
            createdAt: String(row.createdAt || '').trim(),
            updatedAt: String(row.updatedAt || '').trim(),
            statusKey,
            searchText: String(row.searchText || `${id} ${serviceTypeText} ${noticeTypeText} ${title}`.trim()).trim()
        };
    };

    const cacheNoticeRecord = (record) => {
        return normalizeNoticeRecord(record);
    };

    const pickNonEmptyText = (primary, fallback) => {
        const normalizedPrimary = String(primary ?? '').trim();
        if (normalizedPrimary) return normalizedPrimary;
        const normalizedFallback = String(fallback ?? '').trim();
        return normalizedFallback;
    };

    const mergeNoticeRecord = (summaryRecord, cachedRecord) => {
        if (!summaryRecord && !cachedRecord) return null;
        if (!summaryRecord) return cachedRecord;
        if (!cachedRecord) return summaryRecord;

        return {
            ...summaryRecord,
            id: summaryRecord.id || cachedRecord.id,
            serviceType: summaryRecord.serviceType || cachedRecord.serviceType,
            noticeType: summaryRecord.noticeType || cachedRecord.noticeType,
            title: pickNonEmptyText(summaryRecord.title, cachedRecord.title),
            excerpt: pickNonEmptyText(summaryRecord.excerpt, cachedRecord.excerpt),
            content: pickNonEmptyText(summaryRecord.content, cachedRecord.content),
            active: typeof summaryRecord.active === 'boolean' ? summaryRecord.active : cachedRecord.active,
            pinned: typeof summaryRecord.pinned === 'boolean' ? summaryRecord.pinned : cachedRecord.pinned,
            publishedAt: summaryRecord.publishedAt || cachedRecord.publishedAt,
            createdAt: summaryRecord.createdAt || cachedRecord.createdAt,
            updatedAt: summaryRecord.updatedAt || cachedRecord.updatedAt,
            searchText: pickNonEmptyText(summaryRecord.searchText, cachedRecord.searchText)
        };
    };

    const extractNoticeList = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];

        const directCandidates = ['notices', 'items', 'data', 'noticeList', 'notice_list'];
        for (const key of directCandidates) {
            if (Array.isArray(payload[key])) return payload[key];
        }

        if (payload.data && typeof payload.data === 'object') {
            for (const key of directCandidates) {
                if (Array.isArray(payload.data[key])) return payload.data[key];
            }
        }

        return [];
    };

    const extractAdminNoticeRows = (payload) => {
        if (!payload || typeof payload !== 'object') return [];

        const tabs = payload.tabs || payload.data?.tabs;
        if (Array.isArray(tabs?.notices?.rows)) {
            return tabs.notices.rows;
        }

        if (Array.isArray(payload.rows)) return payload.rows;
        if (Array.isArray(payload.data?.rows)) return payload.data.rows;
        return [];
    };

    const formatDateText = (value) => {
        if (!value) return '';
        const normalized = String(value).includes(' ') && !String(value).includes('T') ? String(value).replace(' ', 'T') : String(value);
        const date = new Date(normalized);
        if (Number.isNaN(date.getTime())) {
            return String(value);
        }
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date).replace(/\.\s/g, '.').replace(/\.$/, '');
    };

    const deriveExcerpt = (content) => {
        const normalized = String(content || '').trim().replace(/\s+/g, ' ');
        if (!normalized) return '';
        return normalized.length > 120 ? `${normalized.slice(0, 117)}...` : normalized;
    };

    const resolveNoticeStatusKey = (active, publishedAt) => {
        if (active === false) return 'inactive';
        if (!publishedAt) return 'draft';
        return 'active';
    };

    const getNoticeExposureLabel = (active) => (active ? '노출 중' : '비노출');

    const getNoticeExposureTitle = (active) => (active ? '공지 비노출로 전환' : '공지 노출로 전환');

    const extractNoticeItem = (payload) => {
        if (!payload || typeof payload !== 'object') return null;
        const container = payload.notice || payload.data || payload.item || payload.result || payload.payload || payload;
        return container && typeof container === 'object' && !Array.isArray(container) ? container : null;
    };

    const buildNoticeRow = (notice) => {
        const record = normalizeNoticeRecord(notice);
        if (!record) return null;

        const serviceType = formatNoticeServiceLabel(record.serviceType);
        const noticeType = formatNoticeTypeLabel(record.noticeType);
        const statusKey = resolveNoticeStatusKey(record.active, record.publishedAt);
        const exposureLabel = getNoticeExposureLabel(record.active);
        const exposureTitle = getNoticeExposureTitle(record.active);
        const statusToneClass = record.active ? 'cms-notice-status-toggle--active' : 'cms-notice-status-toggle--inactive';
        return {
            noticeId: record.id,
            noticeType: record.noticeType,
            noticeRecord: record,
            statusKey,
            searchText: `${record.id} ${serviceType} ${noticeType} ${record.title}`.trim(),
            cells: [
                escapeHtml(record.id),
                escapeHtml(serviceType),
                escapeHtml(noticeType),
                escapeHtml(record.title),
                escapeHtml(formatDateText(record.publishedAt)),
                `<button type="button" class="cms-notice-status-toggle ${statusToneClass}" data-notice-action="toggle-active" data-notice-id="${escapeHtml(record.id)}" aria-label="${escapeHtml(exposureTitle)}" title="${escapeHtml(exposureTitle)}">${escapeHtml(exposureLabel)}</button>`,
                `<div class="cms-notice-row-actions">
                    <button type="button" class="admin-btn admin-btn-outline" data-notice-action="edit" data-notice-id="${escapeHtml(record.id)}" aria-label="공지 수정" title="공지 수정">수정</button>
                    <button type="button" class="admin-btn admin-btn-outline admin-btn-danger" data-notice-action="delete" data-notice-id="${escapeHtml(record.id)}" aria-label="공지 삭제" title="공지 삭제">삭제</button>
                </div>`
            ]
        };
    };

    const setNoticeSavingState = (next) => {
        isNoticeSaving = next;
        if (noticeModalSubmitBtn) {
            noticeModalSubmitBtn.disabled = next;
            noticeModalSubmitBtn.textContent = next ? '저장 중...' : getNoticeModalSubmitLabel();
        }
        if (noticeModalCloseBtn) noticeModalCloseBtn.disabled = next;
        if (noticeModalCancelBtn) noticeModalCancelBtn.disabled = next;
    };

    const loadNoticeRows = async () => {
        const adminSurfaceResult = await requestNoticeJson('/api/admin/tables/cms');
        let publicNoticeResult = { response: null, parsed: null };
        try {
            publicNoticeResult = await requestNoticeJson('/api/customer-center/notices');
        } catch (error) {
            console.warn('[AdminCms] Notice cache load skipped:', error);
        }

        if (!adminSurfaceResult.response.ok) {
            const message = adminSurfaceResult.parsed && typeof adminSurfaceResult.parsed === 'object' && !Array.isArray(adminSurfaceResult.parsed)
                ? adminSurfaceResult.parsed.message || adminSurfaceResult.parsed.error
                : null;
            throw new Error(message || '공지 목록을 불러오지 못했습니다.');
        }

        const mergedCache = new Map(noticeRecordCache);
        extractNoticeList(publicNoticeResult.parsed)
            .map(normalizeNoticeRecord)
            .filter(Boolean)
            .forEach((record) => {
                const normalized = cacheNoticeRecord(record);
                if (normalized) {
                    mergedCache.set(normalized.id, normalized);
                }
            });
        noticeRecordCache = mergedCache;

        const noticeRows = extractAdminNoticeRows(adminSurfaceResult.parsed)
            .map(normalizeAdminNoticeRow)
            .filter(Boolean)
            .map((row) => {
                const mergedRecord = mergeNoticeRecord(row, noticeRecordCache.get(row.id));
                if (!mergedRecord) return null;
                const normalized = cacheNoticeRecord(mergedRecord);
                return buildNoticeRow(normalized || mergedRecord);
            })
            .filter(Boolean);

        TAB_CONFIG.notices.rows = noticeRows;
        if (activeTab === 'notices') {
            renderTableBody(activeTab);
        }

        return noticeRows;
    };

    const persistNotice = async (payload) => {
        const isEdit = noticeModalMode === 'edit' && editingNoticeId !== null && editingNoticeId !== '';
        const url = isEdit
            ? `/api/customer-center/notices/${encodeURIComponent(String(editingNoticeId))}`
            : '/api/customer-center/notices';
        const method = isEdit ? 'PUT' : 'POST';
        const { response, parsed } = await requestNoticeJson(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed.message || parsed.error
                : null;
            throw new Error(message || '공지 저장에 실패했습니다.');
        }

        return extractNoticeItem(parsed);
    };

    const getFilteredNoticeRows = (tabKey) => {
        const keyword = searchKeyword.trim().toLowerCase();
        const rows = getTabConfig(tabKey).rows.filter((row) => {
            const statusMatch = activeStatus === 'all'
                || row.statusKey === activeStatus
                || (tabKey === 'notices' && preservedNoticeId && String(row.noticeId) === String(preservedNoticeId));
            const noticeTypeMatch = tabKey !== 'notices' || activeNoticeType === 'all' || row.noticeType === activeNoticeType;
            const searchMatch = !keyword || row.searchText.toLowerCase().includes(keyword);
            return statusMatch && noticeTypeMatch && searchMatch;
        });

        return rows;
    };

    const getNoticeTotalPages = (filteredRows) => Math.max(1, Math.ceil(filteredRows.length / NOTICE_PAGE_SIZE));

    const renderNoticePagination = (filteredRows) => {
        if (!noticePaginationContainer) return;

        const totalPages = getNoticeTotalPages(filteredRows);
        if (filteredRows.length === 0) {
            noticePaginationContainer.hidden = true;
            noticePaginationContainer.innerHTML = '';
            return;
        }

        if (activeNoticePage > totalPages) {
            activeNoticePage = totalPages;
        }

        noticePaginationContainer.hidden = false;
        noticePaginationContainer.innerHTML = [
            '<div class="cms-notice-pagination-controls">',
            `<button type="button" class="admin-btn admin-btn-outline" data-notice-page-action="prev" ${activeNoticePage <= 1 ? 'disabled' : ''} aria-label="이전 공지 페이지">&lt;</button>`,
            `<button type="button" class="admin-btn admin-btn-primary" data-notice-page="${activeNoticePage}" aria-current="page">${escapeHtml(String(activeNoticePage))}</button>`,
            `<button type="button" class="admin-btn admin-btn-outline" data-notice-page-action="next" ${activeNoticePage >= totalPages ? 'disabled' : ''} aria-label="다음 공지 페이지">&gt;</button>`,
            '</div>',
            `<span class="admin-pagination-info">${escapeHtml(`${activeNoticePage}/${totalPages}`)}</span>`
        ].join('');
    };

    const resetNoticePagination = () => {
        activeNoticePage = 1;
    };

    const setNoticeModalMode = (mode, notice = null) => {
        noticeModalMode = mode === 'edit' ? 'edit' : 'create';
        editingNoticeRecord = notice ? normalizeNoticeRecord(notice) : null;
        editingNoticeId = editingNoticeRecord?.id ?? null;

        const copy = getNoticeModalCopy(noticeModalMode);
        if (noticeModalEyebrow) noticeModalEyebrow.textContent = copy.eyebrow;
        if (noticeModalTitle) noticeModalTitle.textContent = copy.title;
        if (noticeModalDescription) noticeModalDescription.textContent = copy.description;
        if (noticeModalSubmitBtn) noticeModalSubmitBtn.textContent = copy.submit;

        if (!noticeModalForm) return;

        noticeModalForm.reset();
        if (noticeModalServiceSelect) noticeModalServiceSelect.value = noticeModalMode === 'edit' && editingNoticeRecord ? formatNoticeServiceSelectValue(editingNoticeRecord.serviceType) : 'integrated';
        if (noticeModalTypeSelect) noticeModalTypeSelect.value = noticeModalMode === 'edit' && editingNoticeRecord ? editingNoticeRecord.noticeType : 'notice';
        if (noticeModalTitleInput) noticeModalTitleInput.value = noticeModalMode === 'edit' && editingNoticeRecord ? editingNoticeRecord.title : '';
        if (noticeModalContentInput) noticeModalContentInput.value = noticeModalMode === 'edit' && editingNoticeRecord ? (editingNoticeRecord.content || editingNoticeRecord.excerpt || '') : '';
    };

    const submitNoticeModal = async () => {
        if (!noticeModalForm || isNoticeSaving) return;

        const serviceType = normalizeNoticeServiceType(noticeModalServiceSelect?.value);
        const noticeType = normalizeNoticeType(noticeModalTypeSelect?.value);
        const title = noticeModalTitleInput?.value?.trim() || '';
        const content = noticeModalContentInput?.value?.trim() || '';

        if (!title) {
            alert('공지 제목을 입력해.');
            noticeModalTitleInput?.focus();
            return;
        }

        if (!content) {
            alert('공지 내용을 입력해.');
            noticeModalContentInput?.focus();
            return;
        }

        const payload = {
            serviceType,
            noticeType,
            title,
            excerpt: deriveExcerpt(content),
            content,
            ...(typeof editingNoticeRecord?.active === 'boolean' ? { active: editingNoticeRecord.active } : {}),
            ...(typeof editingNoticeRecord?.pinned === 'boolean' ? { pinned: editingNoticeRecord.pinned } : {}),
            ...(editingNoticeRecord?.publishedAt ? { publishedAt: editingNoticeRecord.publishedAt } : {})
        };

        setNoticeSavingState(true);
        try {
            const savedNotice = await persistNotice(payload);
            if (savedNotice && typeof savedNotice === 'object' && !Array.isArray(savedNotice)) {
                editingNoticeRecord = normalizeNoticeRecord({ ...(editingNoticeRecord || {}), ...savedNotice }) || editingNoticeRecord;
            }

            await loadNoticeRows();

            closeNoticeModal(true);
            alert('공지 저장 완료.');
        } catch (error) {
            console.error('[AdminCms] Notice save failed:', error);
            alert(error instanceof Error ? error.message : '공지 저장에 실패했습니다.');
        } finally {
            setNoticeSavingState(false);
        }
    };

    const sendNoticeMutation = async (noticeId, method, payload = null) => {
        const url = `/api/customer-center/notices/${encodeURIComponent(String(noticeId))}`;
        const options = {
            method,
            ...(payload ? {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            } : {})
        };
        const { response, parsed } = await requestNoticeJson(url, options);

        if (!response.ok) {
            const message = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed.message || parsed.error
                : null;
            throw new Error(message || '공지 처리에 실패했습니다.');
        }

        return extractNoticeItem(parsed);
    };

    const getNoticeRowById = (noticeId) => TAB_CONFIG.notices.rows.find((row) => String(row.noticeId) === String(noticeId)) || null;

    const refreshNoticeRows = async () => {
        await loadNoticeRows();
    };

    const setNoticeActionPendingState = (next) => {
        isNoticeActionPending = next;
    };

    const toggleNoticeActive = async (noticeId) => {
        if (isNoticeActionPending) return;
        const noticeRow = getNoticeRowById(noticeId);
        if (!noticeRow?.noticeRecord) return;

        const nextActive = !noticeRow.noticeRecord.active;
        setNoticeActionPendingState(true);
        try {
            const nextRecord = mergeNoticeRecord(
                { ...noticeRow.noticeRecord, active: nextActive },
                noticeRecordCache.get(String(noticeId))
            );
            await sendNoticeMutation(noticeId, 'PUT', { active: nextActive });
            if (nextRecord) {
                noticeRecordCache.set(String(noticeId), nextRecord);
            }
            preservedNoticeId = String(noticeId);
            await refreshNoticeRows();
        } catch (error) {
            console.error('[AdminCms] Notice active toggle failed:', error);
        } finally {
            setNoticeActionPendingState(false);
        }
    };

    const deleteNotice = async (noticeId) => {
        if (isNoticeActionPending) return;
        const noticeRow = getNoticeRowById(noticeId);
        if (!noticeRow?.noticeRecord) return;

        if (!window.confirm('이 공지를 삭제할까? 삭제하면 복구할 수 없어.')) return;

        setNoticeActionPendingState(true);
        try {
            await sendNoticeMutation(noticeId, 'DELETE');
            noticeRecordCache.delete(String(noticeId));
            if (preservedNoticeId === String(noticeId)) {
                preservedNoticeId = null;
            }
            await refreshNoticeRows();
        } catch (error) {
            console.error('[AdminCms] Notice delete failed:', error);
            alert(error instanceof Error ? error.message : '공지 삭제에 실패했습니다.');
        } finally {
            setNoticeActionPendingState(false);
        }
    };

    const renderSidebarMenus = (role) => {
        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        return accessibleMenus.map((menu) => `
            <a href="${menu.path}" class="admin-menu-item ${menu.id === 'cms' ? 'active' : ''}" data-id="${menu.id}">
                <span class="admin-menu-icon">${menu.icon}</span>
                <span>${menu.label}</span>
            </a>
        `).join('');
    };

    const getTabConfig = (tabKey) => TAB_CONFIG[tabKey] ?? TAB_CONFIG[DEFAULT_TAB];

    const getNoticeModalFocusableElements = () => {
        if (!noticeModal) return [];
        return Array.from(noticeModal.querySelectorAll([
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(','))).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null);
    };

    const setNoticeModalState = (isOpen) => {
        if (!noticeModalBackdrop) return;
        noticeModalBackdrop.hidden = !isOpen;
        document.body.classList.toggle('admin-modal-open', isOpen);
        if (adminLayoutRoot) {
            if ('inert' in adminLayoutRoot) {
                adminLayoutRoot.inert = isOpen;
            } else if (isOpen) {
                adminLayoutRoot.setAttribute('aria-hidden', 'true');
            } else {
                adminLayoutRoot.removeAttribute('aria-hidden');
            }
        }
    };

    const closeNoticeModal = (force = false) => {
        if (isNoticeSaving && !force) return;
        setNoticeModalState(false);
        if (lastNoticeModalTrigger && typeof lastNoticeModalTrigger.focus === 'function') {
            lastNoticeModalTrigger.focus();
        }
        lastNoticeModalTrigger = null;
        lastNoticeModalFocus = null;
        noticeModalMode = 'create';
        editingNoticeId = null;
        editingNoticeRecord = null;
    };

    const openNoticeModal = (mode = 'create', notice = null) => {
        if (activeTab !== 'notices' || !noticeModalBackdrop) return;
        lastNoticeModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setNoticeModalMode(mode, notice);
        setNoticeModalState(true);
        window.requestAnimationFrame(() => {
            const focusableElements = getNoticeModalFocusableElements();
            const focusTarget = noticeModalTitleInput || focusableElements[0] || noticeModal;
            lastNoticeModalFocus = focusTarget instanceof HTMLElement ? focusTarget : null;
            focusTarget?.focus();
        });
    };

    const renderTableHead = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableHeadRow) return;
        tableHeadRow.innerHTML = config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    };

    const renderTableBody = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableBody) return;

        const rows = getFilteredNoticeRows(tabKey);

        if (rows.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${config.columns.length}" style="text-align:center; padding: 40px;">${escapeHtml(config.emptyMessage)}</td></tr>`;
            if (tabKey === 'notices') {
                renderNoticePagination([]);
            }
            return;
        }

        if (tabKey === 'notices') {
            const totalPages = getNoticeTotalPages(rows);
            if (activeNoticePage > totalPages) {
                activeNoticePage = totalPages;
            }
            const startIndex = (activeNoticePage - 1) * NOTICE_PAGE_SIZE;
            const pageRows = rows.slice(startIndex, startIndex + NOTICE_PAGE_SIZE);
            renderNoticePagination(rows);

            tableBody.innerHTML = pageRows.map((row) => `
                <tr>
                    ${row.cells.map((cell) => `<td>${cell}</td>`).join('')}
                </tr>
            `).join('');
            return;
        }

        if (noticePaginationContainer) {
            noticePaginationContainer.hidden = true;
            noticePaginationContainer.innerHTML = '';
        }

        tableBody.innerHTML = rows.map((row) => `
            <tr>
                ${row.cells.map((cell) => `<td>${cell}</td>`).join('')}
            </tr>
        `).join('');
    };

    const syncStatusFilterOptions = () => {
        if (!statusFilter) return;
        const optionList = Array.from(statusFilter.options);
        optionList.forEach((option) => {
            const optionMeta = cmsConfig.statusOptions.find((item) => item.value === option.value);
            if (optionMeta) {
                option.textContent = optionMeta.label;
            }
        });
    };

    const syncNoticeTypeFilterOptions = () => {
        if (!noticeTypeFilter) return;
        const optionList = Array.from(noticeTypeFilter.options);
        optionList.forEach((option) => {
            const optionMeta = cmsConfig.tabs.notices.typeFilterOptions?.find((item) => item.value === option.value);
            if (optionMeta) {
                option.textContent = optionMeta.label;
            }
        });
    };

    const syncActionBar = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (searchInput) {
            searchInput.placeholder = config.searchPlaceholder;
        }

        if (searchButton) {
            searchButton.textContent = cmsConfig.searchButtonLabel;
        }

        if (actionButtonsContainer) {
            const secondaryAction = typeof config.secondaryAction === 'string' ? config.secondaryAction.trim() : '';
            actionButtonsContainer.innerHTML = secondaryAction ? `
                <button class="admin-btn admin-btn-outline" type="button" data-cms-action="secondary">${escapeHtml(secondaryAction)}</button>
                <button class="admin-btn admin-btn-primary" type="button" id="cms-primary-action-btn" data-cms-action="primary">${escapeHtml(config.primaryAction)}</button>
            ` : `
                <button class="admin-btn admin-btn-primary" type="button" id="cms-primary-action-btn" data-cms-action="primary">${escapeHtml(config.primaryAction)}</button>
            `;
        }

        if (noticeTypeFilter) {
            noticeTypeFilter.hidden = tabKey !== 'notices';
            noticeTypeFilter.disabled = tabKey !== 'notices';
        }
    };

    const setActiveTab = (tabKey) => {
        activeTab = TAB_CONFIG[tabKey] ? tabKey : DEFAULT_TAB;
        if (activeTab !== 'notices') {
            activeNoticePage = 1;
            preservedNoticeId = null;
        }
        if (noticeModalBackdrop && !noticeModalBackdrop.hidden) {
            closeNoticeModal();
        }
        tabButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.domain === activeTab);
        });
        syncActionBar(activeTab);
        renderTableHead(activeTab);
        renderTableBody(activeTab);
    };

    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role;
    if (sidebarMenuContainer) sidebarMenuContainer.innerHTML = renderSidebarMenus(session.role);
    syncStatusFilterOptions();
    syncNoticeTypeFilterOptions();
    if (noticeTypeFilter) {
        noticeTypeFilter.value = 'all';
    }

    tabButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            searchKeyword = '';
            activeStatus = 'all';
            activeNoticeType = 'all';
            resetNoticePagination();
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = 'all';
            if (noticeTypeFilter) noticeTypeFilter.value = 'all';
            AdminStore.dispatch({ type: 'UI/SET_DOMAIN', payload: event.currentTarget.dataset.domain });
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            searchKeyword = event.currentTarget.value;
            preservedNoticeId = null;
            if (activeTab === 'notices') {
                resetNoticePagination();
            }
            renderTableBody(activeTab);
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            preservedNoticeId = null;
            if (activeTab === 'notices') {
                resetNoticePagination();
            }
            renderTableBody(activeTab);
        });
    }

    if (actionButtonsContainer) {
        actionButtonsContainer.addEventListener('click', (event) => {
            const actionButton = event.target.closest('[data-cms-action]');
            if (!actionButton) return;
            if (actionButton.dataset.cmsAction === 'primary' && activeTab === 'notices') {
                openNoticeModal('create');
            }
        });
    }

    if (noticeModalBackdrop) {
        noticeModalBackdrop.addEventListener('click', (event) => {
            if (event.target === noticeModalBackdrop) closeNoticeModal();
        });
    }

    [noticeModalCloseBtn, noticeModalCancelBtn].forEach((button) => {
        if (!button) return;
        button.addEventListener('click', closeNoticeModal);
    });

    if (noticeModalSubmitBtn) {
        noticeModalSubmitBtn.addEventListener('click', () => noticeModalForm?.requestSubmit());
    }

    if (noticeModalForm) {
        noticeModalForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await submitNoticeModal();
        });
    }

    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            if (activeTab !== 'notices') return;
            const actionButton = event.target.closest('[data-notice-action]');
            if (!actionButton) return;

            const { noticeAction, noticeId } = actionButton.dataset;
            const noticeRow = getNoticeRowById(noticeId);
            if (!noticeRow?.noticeRecord) return;

            if (noticeAction === 'edit') {
                openNoticeModal('edit', mergeNoticeRecord(
                    noticeRow.noticeRecord,
                    noticeRecordCache.get(String(noticeId))
                ) || noticeRow.noticeRecord);
                return;
            }

            if (noticeAction === 'toggle-active') {
                void toggleNoticeActive(noticeId);
                return;
            }

            if (noticeAction === 'delete') {
                void deleteNotice(noticeId);
            }
        });
    }

    if (noticePaginationContainer) {
        noticePaginationContainer.addEventListener('click', (event) => {
            const pageButton = event.target.closest('[data-notice-page], [data-notice-page-action]');
            if (!pageButton || noticePaginationContainer.hidden) return;
            const filteredRows = getFilteredNoticeRows('notices');
            const totalPages = getNoticeTotalPages(filteredRows);

            if (pageButton.dataset.noticePage) {
                const nextPage = Number(pageButton.dataset.noticePage);
                if (Number.isFinite(nextPage) && nextPage >= 1 && nextPage <= totalPages) {
                    activeNoticePage = nextPage;
                    renderTableBody('notices');
                }
                return;
            }

            const action = pageButton.dataset.noticePageAction;
            if (action === 'prev' && activeNoticePage > 1) {
                activeNoticePage -= 1;
                renderTableBody('notices');
                return;
            }

            if (action === 'next' && activeNoticePage < totalPages) {
                activeNoticePage += 1;
                renderTableBody('notices');
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (!noticeModalBackdrop || noticeModalBackdrop.hidden) return;

        if (event.key === 'Escape') {
            closeNoticeModal();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getNoticeModalFocusableElements();
        const activeElement = document.activeElement;
        if (focusableElements.length === 0) {
            event.preventDefault();
            (lastNoticeModalFocus || noticeModal)?.focus();
            return;
        }

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
            return;
        }

        if (!event.shiftKey && activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    });

    if (statusFilter) {
        statusFilter.addEventListener('change', (event) => {
            activeStatus = event.currentTarget.value;
            preservedNoticeId = null;
            if (activeTab === 'notices') {
                resetNoticePagination();
            }
            renderTableBody(activeTab);
        });
    }

    if (noticeTypeFilter) {
        noticeTypeFilter.addEventListener('change', (event) => {
            activeNoticeType = normalizeNoticeFilterType(event.currentTarget.value);
            event.currentTarget.value = activeNoticeType;
            preservedNoticeId = null;
            if (activeTab === 'notices') {
                resetNoticePagination();
            }
            renderTableBody(activeTab);
        });
    }

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

    const updateThemeDOM = (theme) => {
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;
        document.body.setAttribute('data-theme', activeTheme);
        themeBtns.forEach((btn) => {
            if (btn.dataset.theme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    };

    AdminStore.subscribe((newState) => {
        syncSidebarUI(newState.ui.sidebarOpen);
        updateThemeDOM(newState.ui.theme);
        setActiveTab(newState.ui.domain);
    });

    const initialState = AdminStore.getState();
    syncSidebarUI(initialState.ui.sidebarOpen);
    updateThemeDOM(initialState.ui.theme);
    setActiveTab(TAB_CONFIG[initialState.ui.domain] ? initialState.ui.domain : DEFAULT_TAB);
    void loadNoticeRows().catch((error) => {
        console.error('[AdminCms] Notice list load failed:', error);
    });
    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
