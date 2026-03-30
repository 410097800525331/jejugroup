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
    const faqModalBackdrop = document.getElementById('cms-faq-modal');
    const faqModalCloseBtn = document.getElementById('cms-faq-modal-close');
    const faqModalCancelBtn = document.getElementById('cms-faq-modal-cancel');
    const faqModalSubmitBtn = document.getElementById('cms-faq-modal-submit');
    const faqModalForm = document.getElementById('cms-faq-form');
    const faqModalServiceSelect = document.getElementById('cms-faq-service-type');
    const faqModalCategoryInput = document.getElementById('cms-faq-category');
    const faqModalQuestionInput = document.getElementById('cms-faq-question');
    const faqModalAnswerInput = document.getElementById('cms-faq-answer');
    const faqModalSortOrderInput = document.getElementById('cms-faq-sort-order');
    const faqModalActiveSelect = document.getElementById('cms-faq-active');
    const faqModalEyebrow = faqModalBackdrop?.querySelector('.admin-modal-eyebrow');
    const faqModalTitle = faqModalBackdrop?.querySelector('.admin-modal-title');
    const faqModalDescription = faqModalBackdrop?.querySelector('.admin-modal-description');
    const faqModal = faqModalBackdrop?.querySelector('.admin-modal');
    const bannerModalBackdrop = document.getElementById('cms-banner-modal');
    const bannerModalCloseBtn = document.getElementById('cms-banner-modal-close');
    const bannerModalCancelBtn = document.getElementById('cms-banner-modal-cancel');
    const bannerModalSubmitBtn = document.getElementById('cms-banner-modal-submit');
    const bannerModalForm = document.getElementById('cms-banner-form');
    const bannerModalSiteSelect = document.getElementById('cms-banner-site');
    const bannerModalFamilySelect = document.getElementById('cms-banner-family');
    const bannerModalSlotKeyInput = document.getElementById('cms-banner-slot-key');
    const bannerModalEyebrowInput = document.getElementById('cms-banner-eyebrow');
    const bannerModalTitleInput = document.getElementById('cms-banner-title');
    const bannerModalBodyInput = document.getElementById('cms-banner-body');
    const bannerModalCtaLabelInput = document.getElementById('cms-banner-cta-label');
    const bannerModalCtaHrefInput = document.getElementById('cms-banner-cta-href');
    const bannerModalImageUrlInput = document.getElementById('cms-banner-image-url');
    const bannerModalAltTextInput = document.getElementById('cms-banner-alt-text');
    const bannerModalSortOrderInput = document.getElementById('cms-banner-sort-order');
    const bannerModalActiveSelect = document.getElementById('cms-banner-active');
    const bannerModalEyebrow = bannerModalBackdrop?.querySelector('.admin-modal-eyebrow');
    const bannerModalTitle = bannerModalBackdrop?.querySelector('.admin-modal-title');
    const bannerModalDescription = bannerModalBackdrop?.querySelector('.admin-modal-description');
    const bannerModal = bannerModalBackdrop?.querySelector('.admin-modal');
    const bannerFieldGroups = bannerModalBackdrop ? Array.from(bannerModalBackdrop.querySelectorAll('[data-banner-field-group]')) : [];
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
    let faqModalMode = 'create';
    let lastFaqModalTrigger = null;
    let lastFaqModalFocus = null;
    let editingFaqId = null;
    let editingFaqRecord = null;
    let faqRecordCache = new Map();
    let isFaqSaving = false;
    let isFaqActionPending = false;
    let bannerModalMode = 'create';
    let lastBannerModalTrigger = null;
    let lastBannerModalFocus = null;
    let editingBannerId = null;
    let editingBannerRecord = null;
    let bannerRecordCache = new Map();
    let bannerBaseRows = [];
    let bannerRuntimeRows = [];
    let isBannerSaving = false;
    let isBannerActionPending = false;

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

    const normalizeFaqServiceType = (value) => normalizeNoticeServiceType(value);

    const formatFaqServiceSelectValue = (value) => formatNoticeServiceSelectValue(value);

    const formatFaqServiceLabel = (value) => formatNoticeServiceLabel(value);

    const normalizeFaqStatusKey = (active) => (active === false ? 'inactive' : 'active');

    const getFaqExposureLabel = (active) => (active ? '노출 중' : '비노출');

    const getFaqExposureTitle = (active) => (active ? 'FAQ 비노출로 전환' : 'FAQ 노출로 전환');

    const getFaqModalCopy = (mode) => (mode === 'edit' ? {
        eyebrow: 'FAQ 수정',
        title: 'FAQ 수정',
        description: '기존 FAQ 값을 그대로 불러와서 수정한 뒤 바로 저장합니다.',
        submit: '수정'
    } : {
        eyebrow: 'FAQ 등록',
        title: '새 FAQ 작성',
        description: '서비스 분류, 카테고리, 질문, 답변, 정렬 순서, 노출 상태를 함께 저장합니다.',
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

    const normalizeFaqRecord = (faq) => {
        if (!faq || typeof faq !== 'object') return null;
        const id = faq.id ?? faq.faqId ?? faq.faq_id ?? faq.faqID;
        if (id === undefined || id === null || String(id).trim() === '') return null;

        const sortOrderValue = faq.sortOrder ?? faq.sort_order ?? faq.order ?? faq.rank ?? '';
        const sortOrder = String(sortOrderValue).trim();

        return {
            id: String(id).trim(),
            serviceType: normalizeFaqServiceType(faq.serviceType ?? faq.service),
            category: String(faq.category || faq.faqCategory || '').trim(),
            question: String(faq.question || faq.title || '').trim(),
            answer: String(faq.answer || faq.content || '').trim(),
            sortOrder,
            active: faq.active !== false,
            createdAt: faq.createdAt || '',
            updatedAt: faq.updatedAt || ''
        };
    };

    const normalizeAdminFaqRow = (row) => {
        if (!row || typeof row !== 'object') return null;

        const cells = Array.isArray(row.cells) ? row.cells : [];
        const id = row.faqId ?? row.id ?? cells[0];
        if (id === undefined || id === null || String(id).trim() === '') return null;

        const serviceTypeText = String(cells[1] ?? row.serviceType ?? row.service ?? '').trim();
        const categoryText = String(cells[2] ?? row.category ?? row.faqCategory ?? '').trim();
        const question = String(cells[3] ?? row.question ?? row.title ?? '').trim();
        const sortOrderText = String(cells[4] ?? row.sortOrder ?? row.sort_order ?? row.order ?? '').trim();
        const statusText = String(cells[5] ?? row.statusKey ?? '').trim();
        const statusKey = row.statusKey || normalizeFaqStatusKey(row.active !== false);

        return {
            id: String(id).trim(),
            serviceType: normalizeFaqServiceType(row.serviceType ?? row.service ?? serviceTypeText),
            category: String(row.category ?? row.faqCategory ?? categoryText).trim(),
            question,
            answer: String(row.answer || row.content || '').trim(),
            sortOrder: String(row.sortOrder ?? row.sort_order ?? row.order ?? sortOrderText).trim(),
            active: statusKey !== 'inactive',
            createdAt: String(row.createdAt || '').trim(),
            updatedAt: String(row.updatedAt || '').trim(),
            statusKey,
            searchText: String(row.searchText || `${id} ${serviceTypeText} ${categoryText} ${question}`.trim()).trim(),
            statusText
        };
    };

    const mergeFaqRecord = (summaryRecord, cachedRecord) => {
        if (!summaryRecord && !cachedRecord) return null;
        if (!summaryRecord) return cachedRecord;
        if (!cachedRecord) return summaryRecord;

        return {
            ...summaryRecord,
            id: summaryRecord.id || cachedRecord.id,
            serviceType: summaryRecord.serviceType || cachedRecord.serviceType,
            category: pickNonEmptyText(summaryRecord.category, cachedRecord.category),
            question: pickNonEmptyText(summaryRecord.question, cachedRecord.question),
            answer: pickNonEmptyText(summaryRecord.answer, cachedRecord.answer),
            sortOrder: pickNonEmptyText(summaryRecord.sortOrder, cachedRecord.sortOrder),
            active: typeof summaryRecord.active === 'boolean' ? summaryRecord.active : cachedRecord.active,
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

    const extractFaqList = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];

        const directCandidates = ['faqs', 'items', 'data', 'faqList', 'faq_list'];
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

    const extractAdminFaqRows = (payload) => {
        if (!payload || typeof payload !== 'object') return [];

        const tabs = payload.tabs || payload.data?.tabs;
        if (Array.isArray(tabs?.faqs?.rows)) {
            return tabs.faqs.rows;
        }

        if (Array.isArray(payload.rows)) return payload.rows;
        if (Array.isArray(payload.data?.rows)) return payload.data.rows;
        return [];
    };

    const extractFaqItem = (payload) => {
        if (!payload || typeof payload !== 'object') return null;
        const container = payload.faq || payload.data || payload.item || payload.result || payload.payload || payload;
        return container && typeof container === 'object' && !Array.isArray(container) ? container : null;
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

    const buildFaqRow = (faq) => {
        const record = normalizeFaqRecord(faq);
        if (!record) return null;

        const serviceType = formatFaqServiceLabel(record.serviceType);
        const sortOrderText = record.sortOrder === '' || record.sortOrder === null || record.sortOrder === undefined
            ? '-'
            : String(record.sortOrder);
        const statusKey = normalizeFaqStatusKey(record.active);
        const exposureLabel = getFaqExposureLabel(record.active);
        const exposureTitle = getFaqExposureTitle(record.active);
        const statusToneClass = record.active ? 'cms-faq-status-toggle--active' : 'cms-faq-status-toggle--inactive';

        return {
            faqId: record.id,
            faqRecord: record,
            statusKey,
            searchText: `${record.id} ${serviceType} ${record.category} ${record.question}`.trim(),
            cells: [
                escapeHtml(record.id),
                escapeHtml(serviceType),
                escapeHtml(record.category),
                escapeHtml(record.question),
                escapeHtml(sortOrderText),
                `<button type="button" class="cms-faq-status-toggle ${statusToneClass}" data-faq-action="toggle-active" data-faq-id="${escapeHtml(record.id)}" aria-label="${escapeHtml(exposureTitle)}" title="${escapeHtml(exposureTitle)}">${escapeHtml(exposureLabel)}</button>`,
                `<div class="cms-faq-row-actions">
                    <button type="button" class="admin-btn admin-btn-outline" data-faq-action="edit" data-faq-id="${escapeHtml(record.id)}" aria-label="FAQ 수정" title="FAQ 수정">수정</button>
                    <button type="button" class="admin-btn admin-btn-outline admin-btn-danger" data-faq-action="delete" data-faq-id="${escapeHtml(record.id)}" aria-label="FAQ 삭제" title="FAQ 삭제">삭제</button>
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

    const getFilteredBannerRows = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        return getTabConfig('banner').rows.filter((row) => {
            const statusMatch = activeStatus === 'all' || row.statusKey === activeStatus;
            const searchMatch = !keyword || row.searchText.includes(keyword);
            return statusMatch && searchMatch;
        });
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

    const setFaqSavingState = (next) => {
        isFaqSaving = next;
        if (faqModalSubmitBtn) {
            faqModalSubmitBtn.disabled = next;
            faqModalSubmitBtn.textContent = next ? '저장 중...' : getFaqModalSubmitLabel();
        }
        if (faqModalCloseBtn) faqModalCloseBtn.disabled = next;
        if (faqModalCancelBtn) faqModalCancelBtn.disabled = next;
    };

    const loadFaqRows = async () => {
        const adminSurfaceResult = await requestNoticeJson('/api/admin/tables/cms');
        let publicFaqResult = { response: null, parsed: null };
        try {
            publicFaqResult = await requestNoticeJson('/api/customer-center/faqs');
        } catch (error) {
            console.warn('[AdminCms] FAQ cache load skipped:', error);
        }

        if (!adminSurfaceResult.response.ok) {
            const message = adminSurfaceResult.parsed && typeof adminSurfaceResult.parsed === 'object' && !Array.isArray(adminSurfaceResult.parsed)
                ? adminSurfaceResult.parsed.message || adminSurfaceResult.parsed.error
                : null;
            throw new Error(message || 'FAQ 목록을 불러오지 못했습니다.');
        }

        const mergedCache = new Map(faqRecordCache);
        extractFaqList(publicFaqResult.parsed)
            .map(normalizeFaqRecord)
            .filter(Boolean)
            .forEach((record) => {
                const normalized = normalizeFaqRecord(record);
                if (normalized) {
                    mergedCache.set(normalized.id, normalized);
                }
            });
        faqRecordCache = mergedCache;

        const faqRows = extractAdminFaqRows(adminSurfaceResult.parsed)
            .map(normalizeAdminFaqRow)
            .filter(Boolean)
            .map((row) => {
                const mergedRecord = mergeFaqRecord(row, faqRecordCache.get(row.id));
                if (!mergedRecord) return null;
                const normalized = normalizeFaqRecord(mergedRecord);
                return buildFaqRow(normalized || mergedRecord);
            })
            .filter(Boolean);

        TAB_CONFIG.faqs.rows = faqRows;
        if (activeTab === 'faqs') {
            renderTableBody(activeTab);
        }

        return faqRows;
    };

    const persistFaq = async (payload) => {
        const isEdit = faqModalMode === 'edit' && editingFaqId !== null && editingFaqId !== '';
        const url = isEdit
            ? `/api/customer-center/faqs/${encodeURIComponent(String(editingFaqId))}`
            : '/api/customer-center/faqs';
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
            throw new Error(message || 'FAQ 저장에 실패했습니다.');
        }

        return extractFaqItem(parsed);
    };

    const sendFaqMutation = async (faqId, method, payload = null) => {
        const url = `/api/customer-center/faqs/${encodeURIComponent(String(faqId))}`;
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
            throw new Error(message || 'FAQ 처리에 실패했습니다.');
        }

        return extractFaqItem(parsed);
    };

    const getFaqRowById = (faqId) => TAB_CONFIG.faqs.rows.find((row) => String(row.faqId) === String(faqId)) || null;

    const refreshFaqRows = async () => {
        await loadFaqRows();
    };

    const setFaqActionPendingState = (next) => {
        isFaqActionPending = next;
    };

    const toggleFaqActive = async (faqId) => {
        if (isFaqActionPending) return;
        const faqRow = getFaqRowById(faqId);
        if (!faqRow?.faqRecord) return;

        const nextActive = !faqRow.faqRecord.active;
        setFaqActionPendingState(true);
        try {
            const nextRecord = mergeFaqRecord(
                { ...faqRow.faqRecord, active: nextActive },
                faqRecordCache.get(String(faqId))
            );
            await sendFaqMutation(faqId, 'PUT', { active: nextActive });
            if (nextRecord) {
                faqRecordCache.set(String(faqId), nextRecord);
            }
            await refreshFaqRows();
        } catch (error) {
            console.error('[AdminCms] FAQ active toggle failed:', error);
        } finally {
            setFaqActionPendingState(false);
        }
    };

    const deleteFaq = async (faqId) => {
        if (isFaqActionPending) return;
        const faqRow = getFaqRowById(faqId);
        if (!faqRow?.faqRecord) return;

        if (!window.confirm('이 FAQ를 삭제할까? 삭제하면 복구할 수 없어.')) return;

        setFaqActionPendingState(true);
        try {
            await sendFaqMutation(faqId, 'DELETE');
            faqRecordCache.delete(String(faqId));
            await refreshFaqRows();
        } catch (error) {
            console.error('[AdminCms] FAQ delete failed:', error);
            alert(error instanceof Error ? error.message : 'FAQ 삭제에 실패했습니다.');
        } finally {
            setFaqActionPendingState(false);
        }
    };

    const normalizeBannerServiceType = (value) => {
        switch ((value || '').trim().toLowerCase()) {
            case 'air':
            case 'jeju-air':
                return 'air';
            case 'stay':
            case 'jeju-stay':
                return 'stay';
            default:
                return 'integrated';
        }
    };

    const normalizeBannerFamily = (value) => {
        switch ((value || '').trim()) {
            case 'inline_cta_banner_family':
            case 'hero_image_set':
            case 'promo_card_family':
                return value.trim();
            default:
                return 'promo_card_family';
        }
    };

    const normalizeBannerStatusKey = (value, active) => {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized === 'active' || normalized === 'inactive' || normalized === 'draft') {
            return normalized;
        }
        return active === false ? 'inactive' : 'active';
    };

    const formatBannerServiceLabel = (value) => {
        switch (normalizeBannerServiceType(value)) {
            case 'air':
                return '항공';
            case 'stay':
                return '숙박';
            default:
                return '통합';
        }
    };

    const formatBannerFamilyLabel = (value) => normalizeBannerFamily(value);

    const formatBannerStatusLabel = (value, active) => {
        switch (normalizeBannerStatusKey(value, active)) {
            case 'draft':
                return '임시';
            case 'inactive':
                return '비노출';
            case 'active':
            default:
                return '노출 중';
        }
    };

    const getBannerModalSubmitLabel = () => (bannerModalMode === 'edit' ? '저장' : '등록');

    const getBannerModalCopy = (mode) => (mode === 'edit' ? {
        eyebrow: '배너 수정',
        title: '배너 수정',
        description: '세션 로컬 상태에 있는 배너 값을 불러와서 바로 수정한다.',
        submit: '저장'
    } : {
        eyebrow: '배너 등록',
        title: '새 배너 작성',
        description: '배너는 세션 로컬 상태로만 저장된다. family에 따라 텍스트 영역과 이미지 영역이 전환된다.',
        submit: '등록'
    });

    const getBannerFieldMode = (family) => (normalizeBannerFamily(family) === 'hero_image_set' ? 'image' : 'text');

    const extractAdminBannerRows = (payload) => {
        if (!payload || typeof payload !== 'object') return [];
        const tabs = payload.tabs || payload.data?.tabs;
        if (Array.isArray(tabs?.banner?.rows)) return tabs.banner.rows;
        if (Array.isArray(payload.rows)) return payload.rows;
        if (Array.isArray(payload.data?.rows)) return payload.data.rows;
        return [];
    };

    const normalizeBannerStatusLabel = (value) => {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) return 'active';
        if (normalized.includes('draft') || normalized.includes('임시')) return 'draft';
        if (normalized.includes('inactive') || normalized.includes('비노출') || normalized.includes('숨김')) return 'inactive';
        return 'active';
    };

    const normalizeBannerServiceLabel = (value) => {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized.includes('air') || normalized.includes('항공')) return 'air';
        if (normalized.includes('stay') || normalized.includes('숙박')) return 'stay';
        return 'integrated';
    };

    const parseBannerFamilySlot = (value) => {
        const normalized = String(value || '').trim();
        if (!normalized) return { family: 'promo_card_family', slotKey: '' };

        const pieces = normalized
            .split(/\s*[\/|>\n]\s*/g)
            .map((part) => part.trim())
            .filter(Boolean);

        if (pieces.length >= 2) {
            return { family: normalizeBannerFamily(pieces[0]), slotKey: pieces[1] };
        }

        const familyMatch = cmsConfig.tabs.banner.familyOptions?.some((option) => option.value === normalized);
        if (familyMatch) {
            return { family: normalized, slotKey: '' };
        }

        return { family: 'promo_card_family', slotKey: normalized };
    };

    const parseBannerStatusFromCell = (value) => {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized.includes('draft') || normalized.includes('임시')) return 'draft';
        if (normalized.includes('inactive') || normalized.includes('비노출') || normalized.includes('숨김')) return 'inactive';
        if (normalized.includes('active') || normalized.includes('노출')) return 'active';
        return '';
    };

    const normalizeAdminBannerRow = (row) => {
        if (!row || typeof row !== 'object') return null;

        const cells = Array.isArray(row.cells) ? row.cells : [];
        const id = row.bannerId ?? row.id ?? cells[0];
        if (id === undefined || id === null || String(id).trim() === '') return null;

        const siteLabel = String(cells[1] ?? row.site ?? row.service ?? row.serviceType ?? '').trim();
        const familySlotLabel = String(cells[2] ?? row.familySlot ?? row.family ?? row.slotKey ?? '').trim();
        const contentText = String(cells[3] ?? row.content ?? row.body ?? row.title ?? '').trim();
        const imageText = String(cells[4] ?? row.imageUrl ?? row.image_url ?? '').trim();
        const sortText = String(cells[5] ?? row.sortOrder ?? row.sort_order ?? '').trim();
        const statusText = String(cells[6] ?? row.statusKey ?? row.status ?? '').trim();

        const { family, slotKey } = parseBannerFamilySlot(familySlotLabel);
        const resolvedSlotKey = String(row.slotKey ?? slotKey ?? id).trim() || String(id).trim();
        const resolvedSite = normalizeBannerServiceLabel(row.site ?? row.service ?? row.serviceType ?? siteLabel);
        const resolvedStatus = normalizeBannerStatusKey(
            row.statusKey ?? row.status ?? parseBannerStatusFromCell(statusText),
            row.active !== false
        );
        const parsedSortOrder = Number(row.sortOrder ?? row.sort_order ?? sortText);
        const sortOrder = Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0;
        const ctaLabel = String(row.ctaLabel ?? row.cta_label ?? '').trim();
        const ctaHref = String(row.ctaHref ?? row.cta_href ?? '').trim();

        const contentParts = contentText
            .split(/\s*[|•·]\s*|\s{2,}/g)
            .map((part) => part.trim())
            .filter(Boolean);
        const fallbackTitle = String(row.title ?? contentParts[0] ?? resolvedSlotKey).trim();
        const fallbackBody = String(row.body ?? contentParts.slice(1).join(' ') ?? contentText).trim();

        return normalizeBannerRecord({
            id: resolvedSlotKey,
            site: resolvedSite,
            family,
            slotKey: resolvedSlotKey,
            eyebrow: String(row.eyebrow ?? row.badge ?? '').trim(),
            title: fallbackTitle,
            body: fallbackBody,
            ctaLabel,
            ctaHref,
            imageUrl: imageText,
            altText: String(row.altText ?? row.alt_text ?? '').trim(),
            sortOrder,
            active: resolvedStatus !== 'inactive',
            statusKey: resolvedStatus,
            createdAt: row.createdAt || '',
            updatedAt: row.updatedAt || ''
        });
    };

    const normalizeBannerRecord = (banner) => {
        if (!banner || typeof banner !== 'object') return null;
        const slotKey = String(banner.slotKey ?? banner.slot_key ?? banner.id ?? banner.bannerId ?? '').trim();
        if (!slotKey) return null;

        const imageUrl = String(banner.imageUrl ?? banner.image_url ?? '').trim();
        const active = banner.active !== false;
        const statusKey = normalizeBannerStatusKey(banner.statusKey ?? banner.status_key, active);

        return {
            id: slotKey,
            site: normalizeBannerServiceType(banner.site ?? banner.service ?? banner.serviceType),
            family: normalizeBannerFamily(banner.family),
            slotKey,
            eyebrow: String(banner.eyebrow || '').trim(),
            title: String(banner.title || '').trim(),
            body: String(banner.body || banner.content || '').trim(),
            ctaLabel: String(banner.ctaLabel ?? banner.cta_label ?? banner.actionText ?? '').trim(),
            ctaHref: String(banner.ctaHref ?? banner.cta_href ?? '').trim(),
            imageUrl,
            altText: String(banner.altText ?? banner.alt_text ?? '').trim(),
            sortOrder: Number.isFinite(Number(banner.sortOrder ?? banner.sort_order)) ? Number(banner.sortOrder ?? banner.sort_order) : 0,
            active,
            statusKey,
            createdAt: banner.createdAt || '',
            updatedAt: banner.updatedAt || ''
        };
    };

    const cloneBannerRecord = (record) => {
        const normalized = normalizeBannerRecord(record);
        return normalized ? { ...normalized } : null;
    };

    const buildBannerRow = (banner) => {
        const record = normalizeBannerRecord(banner);
        if (!record) return null;

        const statusKey = normalizeBannerStatusKey(record.statusKey, record.active);
        const statusLabel = formatBannerStatusLabel(statusKey, record.active);
        const statusToneClass = statusKey === 'active'
            ? 'cms-banner-status-toggle--active'
            : 'cms-banner-status-toggle--inactive';
        const contentParts = [];
        if (record.eyebrow) contentParts.push(record.eyebrow);
        if (record.title) contentParts.push(record.title);
        if (record.body) contentParts.push(record.body);
        if (record.ctaLabel) contentParts.push(record.ctaLabel);
        const contentPreview = contentParts.length > 0 ? contentParts.join(' | ') : '-';

        return {
            bannerId: record.id,
            bannerRecord: record,
            statusKey,
            sortOrder: record.sortOrder,
            searchText: `${record.id} ${record.site} ${record.family} ${record.slotKey} ${record.eyebrow} ${record.title} ${record.body} ${record.ctaLabel} ${record.ctaHref} ${record.imageUrl} ${record.altText}`.trim().toLowerCase(),
            cells: [
                escapeHtml(record.id),
                escapeHtml(formatBannerServiceLabel(record.site)),
                `<div>${escapeHtml(record.family)}<br>${escapeHtml(record.slotKey)}</div>`,
                escapeHtml(contentPreview),
                record.imageUrl ? escapeHtml(record.imageUrl) : '-',
                escapeHtml(String(record.sortOrder)),
                `<button type="button" class="cms-banner-status-toggle ${statusToneClass}" data-banner-action="toggle-active" data-banner-id="${escapeHtml(record.id)}" aria-label="${escapeHtml(statusLabel)}" title="${escapeHtml(statusLabel)}">${escapeHtml(statusLabel)}</button>`,
                `<div class="cms-banner-row-actions">
                    <button type="button" class="admin-btn admin-btn-outline" data-banner-action="edit" data-banner-id="${escapeHtml(record.id)}" aria-label="배너 수정" title="배너 수정">수정</button>
                    <button type="button" class="admin-btn admin-btn-outline admin-btn-danger" data-banner-action="delete" data-banner-id="${escapeHtml(record.id)}" aria-label="배너 삭제" title="배너 삭제">삭제</button>
                </div>`
            ]
        };
    };

    const syncBannerFieldMode = () => {
        if (!bannerModalFamilySelect) return;
        const mode = getBannerFieldMode(bannerModalFamilySelect.value);
        bannerFieldGroups.forEach((field) => {
            const group = field.dataset.bannerFieldGroup;
            const visible = group === mode;
            field.hidden = !visible;
            const control = field.querySelector('input, textarea');
            if (control) {
                control.required = visible && ((mode === 'image' && (control.id === 'cms-banner-image-url' || control.id === 'cms-banner-alt-text'))
                    || (mode === 'text' && (control.id === 'cms-banner-title')));
            }
        });
    };

    const setBannerSavingState = (next) => {
        isBannerSaving = next;
        if (bannerModalSubmitBtn) {
            bannerModalSubmitBtn.disabled = next;
            bannerModalSubmitBtn.textContent = next ? '저장 중...' : getBannerModalSubmitLabel();
        }
        if (bannerModalCloseBtn) bannerModalCloseBtn.disabled = next;
        if (bannerModalCancelBtn) bannerModalCancelBtn.disabled = next;
    };

    const setBannerActionPendingState = (next) => {
        isBannerActionPending = next;
    };

    const setBannerModalState = (isOpen) => {
        if (!bannerModalBackdrop) return;
        bannerModalBackdrop.hidden = !isOpen;
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

    const getBannerModalFocusableElements = () => {
        if (!bannerModal) return [];
        return Array.from(bannerModal.querySelectorAll([
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(','))).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null);
    };

    const closeBannerModal = (force = false) => {
        if (isBannerSaving && !force) return;
        setBannerModalState(false);
        if (lastBannerModalTrigger && typeof lastBannerModalTrigger.focus === 'function') {
            lastBannerModalTrigger.focus();
        }
        lastBannerModalTrigger = null;
        lastBannerModalFocus = null;
        bannerModalMode = 'create';
        editingBannerId = null;
        editingBannerRecord = null;
    };

    const setBannerModalMode = (mode, banner = null) => {
        bannerModalMode = mode === 'edit' ? 'edit' : 'create';
        editingBannerRecord = banner ? normalizeBannerRecord(banner) : null;
        editingBannerId = editingBannerRecord?.id ?? null;

        const copy = getBannerModalCopy(bannerModalMode);
        if (bannerModalEyebrow) bannerModalEyebrow.textContent = copy.eyebrow;
        if (bannerModalTitle) bannerModalTitle.textContent = copy.title;
        if (bannerModalDescription) bannerModalDescription.textContent = copy.description;
        if (bannerModalSubmitBtn) bannerModalSubmitBtn.textContent = copy.submit;

        if (!bannerModalForm) return;

        bannerModalForm.reset();
        if (bannerModalSiteSelect) bannerModalSiteSelect.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.site : 'integrated';
        if (bannerModalFamilySelect) bannerModalFamilySelect.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.family : 'promo_card_family';
        if (bannerModalSlotKeyInput) bannerModalSlotKeyInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.slotKey : '';
        if (bannerModalEyebrowInput) bannerModalEyebrowInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.eyebrow : '';
        if (bannerModalTitleInput) bannerModalTitleInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.title : '';
        if (bannerModalBodyInput) bannerModalBodyInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.body : '';
        if (bannerModalCtaLabelInput) bannerModalCtaLabelInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.ctaLabel : '';
        if (bannerModalCtaHrefInput) bannerModalCtaHrefInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.ctaHref : '';
        if (bannerModalImageUrlInput) bannerModalImageUrlInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.imageUrl : '';
        if (bannerModalAltTextInput) bannerModalAltTextInput.value = bannerModalMode === 'edit' && editingBannerRecord ? editingBannerRecord.altText : '';
        if (bannerModalSortOrderInput) bannerModalSortOrderInput.value = bannerModalMode === 'edit' && editingBannerRecord ? String(editingBannerRecord.sortOrder) : '';
        if (bannerModalActiveSelect) bannerModalActiveSelect.value = bannerModalMode === 'edit' && editingBannerRecord ? String(editingBannerRecord.active) : 'true';
        syncBannerFieldMode();
    };

    const openBannerModal = (mode = 'create', banner = null) => {
        if (activeTab !== 'banner' || !bannerModalBackdrop) return;
        lastBannerModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setBannerModalMode(mode, banner);
        setBannerModalState(true);
        window.requestAnimationFrame(() => {
            const focusableElements = getBannerModalFocusableElements();
            const focusTarget = bannerModalSlotKeyInput || focusableElements[0] || bannerModal;
            lastBannerModalFocus = focusTarget instanceof HTMLElement ? focusTarget : null;
            focusTarget?.focus();
        });
    };

    const commitBannerRuntimeRows = (records) => {
        const normalizedRecords = records
            .map(cloneBannerRecord)
            .filter(Boolean)
            .sort((left, right) => (left.sortOrder - right.sortOrder) || left.slotKey.localeCompare(right.slotKey));
        bannerRuntimeRows = normalizedRecords.map(cloneBannerRecord).filter(Boolean);
        bannerRecordCache = new Map(normalizedRecords.map((record) => [record.id, record]));
        const bannerRows = normalizedRecords.map(buildBannerRow).filter(Boolean);
        TAB_CONFIG.banner.rows = bannerRows;
        if (activeTab === 'banner') {
            renderTableBody(activeTab);
        }
        return bannerRows;
    };

    const loadBannerRows = async () => {
        let adminSurfaceResult = null;
        try {
            adminSurfaceResult = await requestNoticeJson('/api/admin/tables/cms');
        } catch (error) {
            console.warn('[AdminCms] Banner list load skipped:', error);
        }

        const adminRows = adminSurfaceResult?.response?.ok
            ? extractAdminBannerRows(adminSurfaceResult.parsed)
                .map(normalizeAdminBannerRow)
                .filter(Boolean)
            : [];

        if (adminRows.length > 0) {
            bannerBaseRows = adminRows.map(cloneBannerRecord).filter(Boolean);
        } else {
            bannerBaseRows = Array.isArray(cmsConfig.tabs.banner.fallbackRows)
                ? cmsConfig.tabs.banner.fallbackRows.map(normalizeBannerRecord).filter(Boolean)
                : [];
        }

        bannerRuntimeRows = bannerBaseRows.map(cloneBannerRecord).filter(Boolean);
        return commitBannerRuntimeRows(bannerRuntimeRows);
    };

    const getBannerRowById = (bannerId) => bannerRuntimeRows.find((row) => String(row.id) === String(bannerId)) || null;

    const submitBannerModal = async () => {
        if (!bannerModalForm || isBannerSaving) return;

        const site = normalizeBannerServiceType(bannerModalSiteSelect?.value);
        const family = normalizeBannerFamily(bannerModalFamilySelect?.value);
        const slotKey = bannerModalSlotKeyInput?.value?.trim() || '';
        const eyebrow = bannerModalEyebrowInput?.value?.trim() || '';
        const title = bannerModalTitleInput?.value?.trim() || '';
        const body = bannerModalBodyInput?.value?.trim() || '';
        const ctaLabel = bannerModalCtaLabelInput?.value?.trim() || '';
        const ctaHref = bannerModalCtaHrefInput?.value?.trim() || '';
        const imageUrl = bannerModalImageUrlInput?.value?.trim() || '';
        const altText = bannerModalAltTextInput?.value?.trim() || '';
        const sortOrderText = bannerModalSortOrderInput?.value?.trim() || '0';
        const active = bannerModalActiveSelect?.value === 'false' ? false : true;

        if (!slotKey) {
            alert('슬롯 키를 입력해.');
            bannerModalSlotKeyInput?.focus();
            return;
        }

        if (!Number.isFinite(Number(sortOrderText))) {
            alert('정렬 순서는 숫자로 입력해.');
            bannerModalSortOrderInput?.focus();
            return;
        }

        if (getBannerFieldMode(family) === 'image' && !imageUrl) {
            alert('hero_image_set은 이미지 URL이 필요해.');
            bannerModalImageUrlInput?.focus();
            return;
        }

        if (getBannerFieldMode(family) === 'text' && !title) {
            alert('배너 제목을 입력해.');
            bannerModalTitleInput?.focus();
            return;
        }

        const nextRecord = normalizeBannerRecord({
            id: slotKey,
            site,
            family,
            slotKey,
            eyebrow,
            title,
            body,
            ctaLabel,
            ctaHref,
            imageUrl,
            altText,
            sortOrder: Number(sortOrderText),
            active
        });

        if (!nextRecord) {
            alert('배너 저장에 실패했어.');
            return;
        }

        setBannerSavingState(true);
        try {
            const nextRows = bannerRuntimeRows.filter((record) => String(record.id) !== String(editingBannerId || slotKey));
            nextRows.push(nextRecord);
            commitBannerRuntimeRows(nextRows);
            closeBannerModal(true);
            alert('배너 저장이 완료됐다.');
        } catch (error) {
            console.error('[AdminCms] Banner save failed:', error);
            alert(error instanceof Error ? error.message : '배너 저장에 실패했다.');
        } finally {
            setBannerSavingState(false);
        }
    };

    const toggleBannerActive = async (bannerId) => {
        if (isBannerActionPending) return;
        const bannerRow = getBannerRowById(bannerId);
        if (!bannerRow?.bannerRecord) return;

        setBannerActionPendingState(true);
        try {
            const nextRecord = {
                ...bannerRow.bannerRecord,
                active: !bannerRow.bannerRecord.active,
                statusKey: bannerRow.bannerRecord.active ? 'inactive' : 'active'
            };
            const nextRows = bannerRuntimeRows.map((record) => (String(record.id) === String(bannerId) ? nextRecord : record));
            commitBannerRuntimeRows(nextRows);
        } catch (error) {
            console.error('[AdminCms] Banner active toggle failed:', error);
        } finally {
            setBannerActionPendingState(false);
        }
    };

    const deleteBanner = async (bannerId) => {
        if (isBannerActionPending) return;
        const bannerRow = getBannerRowById(bannerId);
        if (!bannerRow?.bannerRecord) return;

        if (!window.confirm('이 배너를 삭제할까? 세션 안에서만 지워진다.')) return;

        setBannerActionPendingState(true);
        try {
            const nextRows = bannerRuntimeRows.filter((record) => String(record.id) !== String(bannerId));
            commitBannerRuntimeRows(nextRows);
            if (editingBannerId && String(editingBannerId) === String(bannerId)) {
                closeBannerModal(true);
            }
        } catch (error) {
            console.error('[AdminCms] Banner delete failed:', error);
            alert(error instanceof Error ? error.message : '배너 삭제에 실패했다.');
        } finally {
            setBannerActionPendingState(false);
        }
    };

    const normalizeBannerBatchOrder = async () => {
        if (bannerRuntimeRows.length === 0) return;

        const nextRows = [...bannerRuntimeRows]
            .sort((left, right) => (left.sortOrder - right.sortOrder) || left.slotKey.localeCompare(right.slotKey))
            .map((record, index) => ({
                ...record,
                sortOrder: (index + 1) * 10
            }));
        commitBannerRuntimeRows(nextRows);
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

    const getFaqModalSubmitLabel = () => (faqModalMode === 'edit' ? '수정' : '등록');

    const getFaqModalFocusableElements = () => {
        if (!faqModal) return [];
        return Array.from(faqModal.querySelectorAll([
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(','))).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null);
    };

    const setFaqModalState = (isOpen) => {
        if (!faqModalBackdrop) return;
        faqModalBackdrop.hidden = !isOpen;
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

    const closeFaqModal = (force = false) => {
        if (isFaqSaving && !force) return;
        setFaqModalState(false);
        if (lastFaqModalTrigger && typeof lastFaqModalTrigger.focus === 'function') {
            lastFaqModalTrigger.focus();
        }
        lastFaqModalTrigger = null;
        lastFaqModalFocus = null;
        faqModalMode = 'create';
        editingFaqId = null;
        editingFaqRecord = null;
    };

    const setFaqModalMode = (mode, faq = null) => {
        faqModalMode = mode === 'edit' ? 'edit' : 'create';
        editingFaqRecord = faq ? normalizeFaqRecord(faq) : null;
        editingFaqId = editingFaqRecord?.id ?? null;

        const copy = getFaqModalCopy(faqModalMode);
        if (faqModalEyebrow) faqModalEyebrow.textContent = copy.eyebrow;
        if (faqModalTitle) faqModalTitle.textContent = copy.title;
        if (faqModalDescription) faqModalDescription.textContent = copy.description;
        if (faqModalSubmitBtn) faqModalSubmitBtn.textContent = copy.submit;

        if (!faqModalForm) return;

        faqModalForm.reset();
        if (faqModalServiceSelect) faqModalServiceSelect.value = faqModalMode === 'edit' && editingFaqRecord ? formatFaqServiceSelectValue(editingFaqRecord.serviceType) : 'integrated';
        if (faqModalCategoryInput) faqModalCategoryInput.value = faqModalMode === 'edit' && editingFaqRecord ? editingFaqRecord.category : '';
        if (faqModalQuestionInput) faqModalQuestionInput.value = faqModalMode === 'edit' && editingFaqRecord ? editingFaqRecord.question : '';
        if (faqModalAnswerInput) faqModalAnswerInput.value = faqModalMode === 'edit' && editingFaqRecord ? editingFaqRecord.answer : '';
        if (faqModalSortOrderInput) faqModalSortOrderInput.value = faqModalMode === 'edit' && editingFaqRecord ? editingFaqRecord.sortOrder : '';
        if (faqModalActiveSelect) faqModalActiveSelect.value = faqModalMode === 'edit' && editingFaqRecord ? String(editingFaqRecord.active) : 'true';
    };

    const openFaqModal = (mode = 'create', faq = null) => {
        if (activeTab !== 'faqs' || !faqModalBackdrop) return;
        lastFaqModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setFaqModalMode(mode, faq);
        setFaqModalState(true);
        window.requestAnimationFrame(() => {
            const focusableElements = getFaqModalFocusableElements();
            const focusTarget = faqModalQuestionInput || focusableElements[0] || faqModal;
            lastFaqModalFocus = focusTarget instanceof HTMLElement ? focusTarget : null;
            focusTarget?.focus();
        });
    };

    const submitFaqModal = async () => {
        if (!faqModalForm || isFaqSaving) return;

        const serviceType = normalizeFaqServiceType(faqModalServiceSelect?.value);
        const category = faqModalCategoryInput?.value?.trim() || '';
        const question = faqModalQuestionInput?.value?.trim() || '';
        const answer = faqModalAnswerInput?.value?.trim() || '';
        const sortOrderText = faqModalSortOrderInput?.value?.trim() || '0';
        const active = faqModalActiveSelect?.value === 'false' ? false : true;

        if (!category) {
            alert('카테고리를 입력해.');
            faqModalCategoryInput?.focus();
            return;
        }

        if (!question) {
            alert('질문을 입력해.');
            faqModalQuestionInput?.focus();
            return;
        }

        if (!answer) {
            alert('답변을 입력해.');
            faqModalAnswerInput?.focus();
            return;
        }

        if (!Number.isFinite(Number(sortOrderText))) {
            alert('정렬 순서는 숫자로 입력해.');
            faqModalSortOrderInput?.focus();
            return;
        }

        const payload = {
            serviceType,
            category,
            question,
            answer,
            sortOrder: Number(sortOrderText),
            active
        };

        setFaqSavingState(true);
        try {
            const savedFaq = await persistFaq(payload);
            if (savedFaq && typeof savedFaq === 'object' && !Array.isArray(savedFaq)) {
                editingFaqRecord = normalizeFaqRecord({ ...(editingFaqRecord || {}), ...savedFaq }) || editingFaqRecord;
            }

            await loadFaqRows();

            closeFaqModal(true);
            alert('FAQ 저장이 완료됐다.');
        } catch (error) {
            console.error('[AdminCms] FAQ save failed:', error);
            alert(error instanceof Error ? error.message : 'FAQ 저장에 실패했습니다.');
        } finally {
            setFaqSavingState(false);
        }
    };

    const renderTableHead = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableHeadRow) return;
        tableHeadRow.innerHTML = config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    };

    const renderTableBody = (tabKey) => {
        const config = getTabConfig(tabKey);
        if (!tableBody) return;

        const rows = tabKey === 'banner' ? getFilteredBannerRows() : getFilteredNoticeRows(tabKey);

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
        if (faqModalBackdrop && !faqModalBackdrop.hidden) {
            closeFaqModal();
        }
        if (bannerModalBackdrop && !bannerModalBackdrop.hidden) {
            closeBannerModal();
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
                return;
            }
            if (actionButton.dataset.cmsAction === 'primary' && activeTab === 'faqs') {
                openFaqModal('create');
                return;
            }
            if (actionButton.dataset.cmsAction === 'primary' && activeTab === 'banner') {
                openBannerModal('create');
                return;
            }
            if (actionButton.dataset.cmsAction === 'secondary' && activeTab === 'banner') {
                void normalizeBannerBatchOrder();
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

    if (faqModalBackdrop) {
        faqModalBackdrop.addEventListener('click', (event) => {
            if (event.target === faqModalBackdrop) closeFaqModal();
        });
    }

    [faqModalCloseBtn, faqModalCancelBtn].forEach((button) => {
        if (!button) return;
        button.addEventListener('click', closeFaqModal);
    });

    if (faqModalSubmitBtn) {
        faqModalSubmitBtn.addEventListener('click', () => faqModalForm?.requestSubmit());
    }

    if (faqModalForm) {
        faqModalForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await submitFaqModal();
        });
    }

    if (bannerModalBackdrop) {
        bannerModalBackdrop.addEventListener('click', (event) => {
            if (event.target === bannerModalBackdrop) closeBannerModal();
        });
    }

    [bannerModalCloseBtn, bannerModalCancelBtn].forEach((button) => {
        if (!button) return;
        button.addEventListener('click', closeBannerModal);
    });

    if (bannerModalSubmitBtn) {
        bannerModalSubmitBtn.addEventListener('click', () => bannerModalForm?.requestSubmit());
    }

    if (bannerModalForm) {
        bannerModalForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await submitBannerModal();
        });
    }

    if (bannerModalFamilySelect) {
        bannerModalFamilySelect.addEventListener('change', () => {
            syncBannerFieldMode();
        });
    }

    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            if (activeTab === 'notices') {
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
                return;
            }

            if (activeTab === 'banner') {
                const actionButton = event.target.closest('[data-banner-action]');
                if (!actionButton) return;

                const { bannerAction, bannerId } = actionButton.dataset;
                const bannerRow = getBannerRowById(bannerId);
                if (!bannerRow?.bannerRecord) return;

                if (bannerAction === 'edit') {
                    openBannerModal('edit', bannerRow.bannerRecord);
                    return;
                }

                if (bannerAction === 'toggle-active') {
                    void toggleBannerActive(bannerId);
                    return;
                }

                if (bannerAction === 'delete') {
                    void deleteBanner(bannerId);
                }
                return;
            }

            if (activeTab !== 'faqs') return;
            const actionButton = event.target.closest('[data-faq-action]');
            if (!actionButton) return;

            const { faqAction, faqId } = actionButton.dataset;
            const faqRow = getFaqRowById(faqId);
            if (!faqRow?.faqRecord) return;

            if (faqAction === 'edit') {
                openFaqModal('edit', mergeFaqRecord(
                    faqRow.faqRecord,
                    faqRecordCache.get(String(faqId))
                ) || faqRow.faqRecord);
                return;
            }

            if (faqAction === 'toggle-active') {
                void toggleFaqActive(faqId);
                return;
            }

            if (faqAction === 'delete') {
                void deleteFaq(faqId);
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
        const noticeModalOpen = Boolean(noticeModalBackdrop && !noticeModalBackdrop.hidden);
        const faqModalOpen = Boolean(faqModalBackdrop && !faqModalBackdrop.hidden);
        const bannerModalOpen = Boolean(bannerModalBackdrop && !bannerModalBackdrop.hidden);
        if (!noticeModalOpen && !faqModalOpen && !bannerModalOpen) return;

        if (event.key === 'Escape') {
            if (noticeModalOpen) {
                closeNoticeModal();
                return;
            }
            if (bannerModalOpen) {
                closeBannerModal();
                return;
            }
            if (faqModalOpen) {
                closeFaqModal();
                return;
            }
        }

        if (event.key !== 'Tab') return;

        const focusableElements = noticeModalOpen
            ? getNoticeModalFocusableElements()
            : bannerModalOpen
                ? getBannerModalFocusableElements()
                : getFaqModalFocusableElements();
        const activeElement = document.activeElement;
        const fallbackFocusTarget = noticeModalOpen
            ? (lastNoticeModalFocus || noticeModal)
            : bannerModalOpen
                ? (lastBannerModalFocus || bannerModal)
            : (lastFaqModalFocus || faqModal);

        if (focusableElements.length === 0) {
            event.preventDefault();
            fallbackFocusTarget?.focus();
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
    void loadFaqRows().catch((error) => {
        console.error('[AdminCms] FAQ list load failed:', error);
    });
    void loadBannerRows().catch((error) => {
        console.error('[AdminCms] Banner list load failed:', error);
    });
    window.addEventListener('resize', () => syncSidebarUI(AdminStore.getState().ui.sidebarOpen));
});
