const DEALS_ROOT_SELECTOR = "#hotel-monthly-deals-root";
const MONTHLY_DEALS_ENDPOINTS = [
  "/api/stay/monthly-hotel-deals",
  "/api/stay/hotel-monthly-deals",
  "/api/stay/monthly-deals"
];
const MONTHLY_DEALS_TIMEOUT_MS = 8000;
const DEFAULT_LOADING_COUNT = 4;

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23F7F7F7'/%3E%3Cstop offset='100%25' stop-color='%23E8EBEF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='400' fill='url(%23a)'/%3E%3Cpath d='M108 286l86-88 72 70 48-40 110 108H108z' fill='%23D7DCE2'/%3E%3Ccircle cx='215' cy='166' r='30' fill='%23C8CDD5'/%3E%3C/svg%3E";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttribute = (value) => escapeHtml(value);

const isPlainObject = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));

const collapseText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const parseNumeric = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[^0-9.-]/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value) => {
  const numeric = parseNumeric(value);
  if (numeric === null) {
    return collapseText(value);
  }

  return new Intl.NumberFormat("ko-KR").format(numeric);
};

const formatCurrency = (value) => {
  const numeric = parseNumeric(value);
  if (numeric === null) {
    return collapseText(value);
  }

  return `₩${new Intl.NumberFormat("ko-KR").format(numeric)}`;
};

const formatScore = (value) => {
  const numeric = parseNumeric(value);
  if (numeric === null) {
    return collapseText(value);
  }

  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
};

const formatDiscount = (originalValue, currentValue) => {
  const original = parseNumeric(originalValue);
  const current = parseNumeric(currentValue);

  if (!original || original <= 0 || current === null || current <= 0 || current >= original) {
    return "특가";
  }

  return `${Math.max(1, Math.round(((original - current) / original) * 100))}% 할인`;
};

const sanitizeImageUrl = (value) => {
  const url = collapseText(value);
  if (!url) {
    return PLACEHOLDER_IMAGE;
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
    return url;
  }

  return PLACEHOLDER_IMAGE;
};

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(/[,\|·\/]/)
      .map((item) => collapseText(item))
      .filter(Boolean);
  }

  return [];
};

const toLabelArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return collapseText(item);
        }

        if (isPlainObject(item)) {
          return collapseText(firstDefined(item.name, item.label, item.title, item.code));
        }

        return "";
      })
      .filter(Boolean);
  }

  return toArray(value);
};

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const readTitle = (item) =>
  collapseText(firstDefined(item.title, item.name, item.hotelName, item.propertyName, item.displayName, item.label));

const readLocation = (item) =>
  collapseText(
    firstDefined(
      item.location,
      item.summaryText,
      item.address,
      item.area,
      item.region,
      item.regionName,
      item.locationText,
      item.subTitle
    )
  );

const readImageUrl = (item) =>
  sanitizeImageUrl(
    firstDefined(
      item.imageUrl,
      item.heroImagePath,
      item.image,
      item.imagePath,
      item.thumbnailUrl,
      item.photoUrl,
      item.coverImageUrl
    )
  );

const readBadge = (item) =>
  collapseText(firstDefined(item.badge, item.badgeText, item.badgeLabel, item.label, item.highlight, item.promotionLabel)) || "JJ 추천";

const readBadgeClass = (item, badgeText) => {
  const candidate = collapseText(firstDefined(item.badgeClass, item.badgeVariant, item.badgeStyle));
  if (candidate) {
    return candidate;
  }

  const normalizedBadge = badgeText.toLowerCase();
  if (normalizedBadge.includes("최저") || normalizedBadge.includes("가성비") || normalizedBadge.includes("best")) {
    return "best-value";
  }

  return "jj-pick";
};

const readAmenities = (item) =>
  toLabelArray(firstDefined(item.amenities, item.benefits, item.features, item.highlights, item.amenityLabels, item.tags));

const readStarCount = (item) => {
  const explicitCount = parseNumeric(firstDefined(item.starCount, item.starRating, item.ratingStars));
  if (explicitCount !== null) {
    return Math.max(0, Math.min(5, Math.round(explicitCount)));
  }

  const starText = collapseText(firstDefined(item.stars, item.starText));
  if (starText) {
    const starMatches = starText.match(/[★☆]/g);
    if (starMatches) {
      return Math.max(0, Math.min(5, starMatches.length));
    }
  }

  return 5;
};

const readRating = (item) =>
  formatScore(firstDefined(item.reviewScore, item.score, item.rating, item.reviewRating));

const readReviewLabel = (item) =>
  collapseText(firstDefined(item.reviewLabel, item.reviewText, item.reviewTitle, item.reviewStatus)) || "최고";

const readReviewCount = (item) =>
  formatNumber(firstDefined(item.reviewCount, item.reviews, item.reviewTotal, item.ratingCount)) || "0";

const readOriginalPrice = (item) =>
  firstDefined(item.originalPrice, item.beforePrice, item.listPrice, item.basePrice, item.oldPrice, item.priceBeforeDiscount);

const readCurrentPrice = (item) =>
  firstDefined(item.currentPrice, item.discountPrice, item.salePrice, item.finalPrice, item.newPrice, item.price);

const readPriceLabel = (item) =>
  collapseText(firstDefined(item.priceLabel, item.nightLabel, item.rateLabel)) || "1박 요금";

const readWishlistId = (item) =>
  collapseText(
    firstDefined(item.wishlistId, item.id, item.propertyCode, item.hotelId, item.lodgingId, item.slug, readTitle(item))
  );

const unwrapPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isPlainObject(payload)) {
    return [];
  }

  const directCollections = [
    payload.items,
    payload.monthlyDeals,
    payload.hotels,
    payload.deals,
    payload.data
  ];

  for (const collection of directCollections) {
    if (Array.isArray(collection)) {
      return collection;
    }
  }

  if (isPlainObject(payload.data)) {
    const nested = unwrapPayload(payload.data);
    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

const normalizeDeal = (item) => {
  const title = readTitle(item);
  if (!title) {
    return null;
  }

  const originalPrice = readOriginalPrice(item);
  const currentPrice = readCurrentPrice(item);
  const badgeText = readBadge(item);

  return {
    id: readWishlistId(item),
    title,
    location: readLocation(item),
    imageUrl: readImageUrl(item),
    badgeText,
    badgeClass: readBadgeClass(item, badgeText),
    starCount: readStarCount(item),
    reviewScore: readRating(item),
    reviewLabel: readReviewLabel(item),
    reviewCount: readReviewCount(item),
    amenities: readAmenities(item).slice(0, 3),
    originalPrice,
    currentPrice,
    discountText: collapseText(firstDefined(item.discountText, item.discountLabel, item.offerText)) || formatDiscount(originalPrice, currentPrice),
    priceLabel: readPriceLabel(item),
    taxText: collapseText(firstDefined(item.taxText, item.priceTaxText, item.priceTaxLabel)) || "세금 포함"
  };
};

const normalizeDeals = (payload) => unwrapPayload(payload).map(normalizeDeal).filter(Boolean);

const renderStars = (count) => {
  const filled = Math.max(0, Math.min(5, count));
  return Array.from({ length: 5 }, (_, index) => {
    const className = index < filled ? "star-icon filled" : "star-icon";
    return `<i data-lucide="star" class="${className}"></i>`;
  }).join("");
};

const renderAmenity = (label) => {
  const normalized = collapseText(label);
  if (!normalized) {
    return "";
  }

  const iconMap = [
    [/wifi|와이파이|인터넷/i, "wifi"],
    [/pool|수영장|풀/i, "waves"],
    [/breakfast|조식/i, "utensils"],
    [/spa|스파/i, "sparkles"],
    [/fitness|피트니스|헬스/i, "dumbbell"],
    [/shuttle|셔틀/i, "ship"],
    [/parking|주차/i, "car"],
    [/beach|비치|해변|오션/i, "waves"],
    [/restaurant|다이닝|식사/i, "utensils"]
  ];

  const match = iconMap.find(([pattern]) => pattern.test(normalized));
  const iconMarkup = match ? `<i data-lucide="${match[1]}"></i> ` : "";
  return `<span class="amenity">${iconMarkup}<span>${escapeHtml(normalized)}</span></span>`;
};

const buildWishlistPlaceholder = (deal) => {
  const label = "위시리스트 추가";
  return [
    `<span data-jeju-wishlist-button`,
    ` data-aria-label="${escapeAttribute(label)}"`,
    ` data-wishlist-id="${escapeAttribute(deal.id)}"`,
    ` data-wishlist-name="${escapeAttribute(deal.title)}"`,
    deal.location ? ` data-wishlist-location="${escapeAttribute(deal.location)}"` : "",
    ` data-wishlist-image="${escapeAttribute(deal.imageUrl)}"`,
    ` data-wishlist-price="${escapeAttribute(formatCurrency(deal.currentPrice))}"`,
    `></span>`
  ].join("");
};

const buildDealCard = (deal) => {
  const amenitiesMarkup = deal.amenities.length > 0
    ? `<div class="hotel-amenities">${deal.amenities.map(renderAmenity).join("")}</div>`
    : "";
  const imageAlt = deal.title;
  const originalPriceDisplay = formatCurrency(deal.originalPrice);
  const currentPriceDisplay = formatCurrency(deal.currentPrice);

  return `
    <article class="hotel-card" data-monthly-deal-id="${escapeAttribute(deal.id)}">
      <div class="hotel-image-wrap">
        <img src="${escapeAttribute(deal.imageUrl)}" alt="${escapeAttribute(imageAlt)}" class="hotel-image" loading="lazy" decoding="async">
        ${buildWishlistPlaceholder(deal)}
      </div>
      <div class="hotel-info">
        <div class="hotel-header">
          <span class="hotel-tag ${escapeAttribute(deal.badgeClass)}">${escapeHtml(deal.badgeText)}</span>
          <div class="hotel-rating">${renderStars(deal.starCount)}</div>
        </div>
        <h3 class="hotel-name">${escapeHtml(deal.title)}</h3>
        <p class="hotel-location">
          <i data-lucide="map-pin"></i>
          <span>${escapeHtml(deal.location || "특가 숙소")}</span>
        </p>
        ${amenitiesMarkup}
        <div class="hotel-review">
          <span class="review-score">${escapeHtml(deal.reviewScore)}</span>
          <span class="review-text"><span>${escapeHtml(deal.reviewLabel)}</span> · ${escapeHtml(deal.reviewCount)}<span>개</span></span>
        </div>
      </div>
      <div class="hotel-price">
        <div class="price-info">
          <span class="price-label">${escapeHtml(deal.priceLabel)}</span>
          <span class="price-discount">${escapeHtml(deal.discountText)}</span>
        </div>
        <div class="price-original"><span data-price-krw="${escapeAttribute(deal.originalPrice ?? "")}">${escapeHtml(originalPriceDisplay)}</span></div>
        <div class="price-final"><span data-price-krw="${escapeAttribute(deal.currentPrice ?? "")}">${escapeHtml(currentPriceDisplay)}</span></div>
        <span class="price-tax">${escapeHtml(deal.taxText)}</span>
      </div>
    </article>
  `;
};

const renderSkeletonCard = () => `
  <article class="hotel-card hotel-card--skeleton" aria-hidden="true">
    <div class="hotel-image-wrap">
      <div class="hotel-skeleton hotel-skeleton--image"></div>
    </div>
    <div class="hotel-info">
      <div class="hotel-header">
        <div class="hotel-skeleton hotel-skeleton--badge"></div>
        <div class="hotel-skeleton hotel-skeleton--rating"></div>
      </div>
      <div class="hotel-skeleton hotel-skeleton--title"></div>
      <div class="hotel-skeleton hotel-skeleton--line"></div>
      <div class="hotel-skeleton hotel-skeleton--line hotel-skeleton--line-short"></div>
      <div class="hotel-skeleton hotel-skeleton--line hotel-skeleton--line-shorter"></div>
    </div>
    <div class="hotel-price">
      <div class="hotel-skeleton hotel-skeleton--line hotel-skeleton--line-short"></div>
      <div class="hotel-skeleton hotel-skeleton--price"></div>
      <div class="hotel-skeleton hotel-skeleton--price hotel-skeleton--price-small"></div>
    </div>
  </article>
`;

const renderStateMarkup = (kind, message, detail) => `
  <div class="hotel-deals-state hotel-deals-state--${escapeAttribute(kind)}">
    <p class="hotel-deals-state__eyebrow">이달의 특가 호텔</p>
    <h3 class="hotel-deals-state__title">${escapeHtml(message)}</h3>
    <p class="hotel-deals-state__desc">${escapeHtml(detail)}</p>
    <button type="button" class="more-btn cta-pill cta-bounce-target" data-monthly-deals-retry>다시 불러오기</button>
  </div>
`;

const setRootState = (root, state) => {
  root.dataset.hotelDealsState = state;
  root.setAttribute("aria-busy", state === "loading" ? "true" : "false");
};

const renderLoading = (root) => {
  setRootState(root, "loading");
  root.innerHTML = Array.from({ length: DEFAULT_LOADING_COUNT }, () => renderSkeletonCard()).join("");
};

const renderEmpty = (root) => {
  setRootState(root, "empty");
  root.innerHTML = renderStateMarkup(
    "empty",
    "불러올 이달의 특가 호텔이 없어요",
    "잠시 후 다시 확인하거나 검색 결과에서 다른 숙소를 찾아보세요."
  );
};

const renderError = (root) => {
  setRootState(root, "error");
  root.innerHTML = renderStateMarkup(
    "error",
    "이달의 특가 호텔을 불러오지 못했어요",
    "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
  );

  root.querySelector("[data-monthly-deals-retry]")?.addEventListener("click", () => {
    void loadMonthlyHotelDeals({ forceReload: true });
  });
};

const renderDeals = (root, deals) => {
  setRootState(root, "ready");
  root.innerHTML = deals.map(buildDealCard).join("");

  window.lucide?.createIcons?.();
  window.JejuWishlistButton?.init({ root });
};

const requestJson = async (url, signal) => {
  const response = await fetch(url, {
    signal,
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("응답 형식이 JSON이 아닙니다.");
  }

  return response.json();
};

const fetchMonthlyHotelDeals = async () => {
  let lastError = null;

  for (const endpoint of MONTHLY_DEALS_ENDPOINTS) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), MONTHLY_DEALS_TIMEOUT_MS);

    try {
      const payload = await requestJson(endpoint, controller.signal);
      return { endpoint, payload };
    } catch (error) {
      lastError = error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error("이달의 특가 호텔 API를 찾지 못했습니다.");
};

let inFlightRequest = null;

export const loadMonthlyHotelDeals = async ({ forceReload = false } = {}) => {
  const root = document.querySelector(DEALS_ROOT_SELECTOR);
  if (!root) {
    return;
  }

  if (inFlightRequest && !forceReload) {
    return inFlightRequest;
  }

  renderLoading(root);

  inFlightRequest = (async () => {
    try {
      const { payload } = await fetchMonthlyHotelDeals();
      const deals = normalizeDeals(payload);

      if (deals.length === 0) {
        renderEmpty(root);
        return;
      }

      renderDeals(root, deals);
    } catch (error) {
      console.error("[HotelMonthlyDeals] load failed", error);
      renderError(root);
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
};

export const initMonthlyHotelDeals = () => {
  void loadMonthlyHotelDeals();
};
