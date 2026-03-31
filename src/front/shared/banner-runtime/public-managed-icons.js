const PUBLIC_MANAGED_BANNER_ENDPOINT = "/api/banners/managed";
const MANAGED_SLOT_SELECTOR = "[data-banner-slot]";
const MANAGED_ICON_FIELD_SELECTOR = '[data-banner-field="icon"]';
const MANAGED_CTA_SELECTOR = '[data-banner-field="cta"]';
const ICON_KEY_PATTERN = /^[a-z][a-z0-9-]*$/i;
const MANAGED_ICON_MARKER_ATTR = "data-managed-banner-icon";

let initPromise = null;

const toTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");

const isSlotLikeKey = (key) => /[_-]/.test(key);

const isValidIconKey = (iconKey) => {
  return ICON_KEY_PATTERN.test(iconKey);
};

const normalizeIconKey = (value) => {
  const iconKey = toTrimmedString(value).toLowerCase();
  return isValidIconKey(iconKey) ? iconKey : "";
};

const createManagedBannerRecord = (value) => {
  const slotKey = toTrimmedString(
    value?.slotKey ?? value?.slot_key ?? value?.bannerSlot ?? value?.banner_slot ?? value?.slot ?? value?.key
  );
  if (!slotKey) {
    return null;
  }

  return {
    slotKey,
    eyebrow: toTrimmedString(value?.eyebrow),
    title: toTrimmedString(value?.title),
    body: toTrimmedString(value?.body ?? value?.content),
    ctaLabel: toTrimmedString(value?.ctaLabel ?? value?.cta_label),
    ctaHref: toTrimmedString(value?.ctaHref ?? value?.cta_href ?? value?.linkUrl ?? value?.link_url),
    imageUrl: toTrimmedString(value?.imageUrl ?? value?.image_url),
    altText: toTrimmedString(value?.altText ?? value?.alt_text),
    iconKey: normalizeIconKey(
      value?.iconKey ?? value?.icon_key ?? value?.icon ?? value?.iconName ?? value?.icon_name ?? value?.lucideIcon ?? value?.lucide_icon
    ),
    active: value?.active !== false,
  };
};

const assignManagedBannerRecord = (bannerMap, record) => {
  const normalizedSlotKey = toTrimmedString(record?.slotKey);
  if (!normalizedSlotKey) {
    return;
  }

  bannerMap[normalizedSlotKey] = {
    ...(bannerMap[normalizedSlotKey] ?? {}),
    ...record,
    slotKey: normalizedSlotKey,
  };
};

const normalizeManagedBannerPayload = (payload) => {
  const bannerMap = {};

  const visit = (value) => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (typeof value !== "object") {
      return;
    }

    const record = createManagedBannerRecord(value);
    if (record) {
      assignManagedBannerRecord(bannerMap, record);
      return;
    }

    const nestedCollections = [
      value.data,
      value.items,
      value.banners,
      value.slots,
      value.managedBanners,
      value.managed_banners,
      value.results,
    ];

    nestedCollections.forEach((nestedValue) => {
      if (nestedValue) {
        visit(nestedValue);
      }
    });

    const entries = Object.entries(value);
    entries.forEach(([entryKey, entryValue]) => {
      if (typeof entryValue !== "string" || !isSlotLikeKey(entryKey)) {
        return;
      }

      assignManagedBannerRecord(bannerMap, {
        slotKey: entryKey,
        iconKey: entryValue,
      });
    });
  };

  visit(payload);
  return bannerMap;
};

const waitForDomReady = () => {
  if (document.readyState !== "loading") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", resolve, { once: true });
  });
};

const renderLucideIcons = (attempt = 0) => {
  const lucide = window.lucide;
  if (lucide?.createIcons) {
    lucide.createIcons();
    return;
  }

  if (attempt >= 30) {
    return;
  }

  window.setTimeout(() => {
    renderLucideIcons(attempt + 1);
  }, 100);
};

const replaceIconMarkup = (iconField, iconKey) => {
  if (iconField.getAttribute(MANAGED_ICON_MARKER_ATTR) === iconKey) {
    return false;
  }

  iconField.setAttribute(MANAGED_ICON_MARKER_ATTR, iconKey);
  iconField.innerHTML = `<i data-lucide="${iconKey}" ${MANAGED_ICON_MARKER_ATTR}="${iconKey}"></i>`;
  return true;
};

const setManagedFieldText = (slot, fieldName, value) => {
  const normalizedValue = toTrimmedString(value);
  if (!normalizedValue) {
    return;
  }

  const field = slot.querySelector(`[data-banner-field="${fieldName}"]`);
  if (!field) {
    return;
  }

  if (toTrimmedString(field.textContent) === normalizedValue) {
    return;
  }

  field.textContent = normalizedValue;
};

const applyManagedCta = (slot, record) => {
  const cta = slot.querySelector(MANAGED_CTA_SELECTOR);
  if (!cta) {
    return;
  }

  if (cta.tagName === "A") {
    cta.setAttribute("href", record.ctaHref || "#");
  }
};

const applyManagedBannerContent = (bannerMap) => {
  let updatedIconCount = 0;

  document.querySelectorAll(MANAGED_SLOT_SELECTOR).forEach((slot) => {
    const slotKey = toTrimmedString(slot.getAttribute("data-banner-slot"));
    if (!slotKey) {
      return;
    }

    const record = bannerMap[slotKey];
    if (!record || record.active === false) {
      return;
    }

    setManagedFieldText(slot, "eyebrow", record.eyebrow);
    setManagedFieldText(slot, "title", record.title);
    setManagedFieldText(slot, "body", record.body);
    setManagedFieldText(slot, "cta_label", record.ctaLabel);
    applyManagedCta(slot, record);

    const iconField = slot.querySelector(MANAGED_ICON_FIELD_SELECTOR);
    if (iconField && record.iconKey && replaceIconMarkup(iconField, record.iconKey)) {
      updatedIconCount += 1;
    }
  });

  if (updatedIconCount > 0) {
    renderLucideIcons();
  }
};

const fetchManagedBanners = async () => {
  const response = await fetch(PUBLIC_MANAGED_BANNER_ENDPOINT, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Managed banner fetch failed: ${response.status}`);
  }

  const payload = await response.json();
  return normalizeManagedBannerPayload(payload);
};

export const initPublicManagedBannerIcons = async () => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    await waitForDomReady();

    let bannerMap = {};
    try {
      bannerMap = await fetchManagedBanners();
    } catch (error) {
      console.error("[BannerRuntime] managed banner fetch failed", error);
      return;
    }

    if (Object.keys(bannerMap).length === 0) {
      return;
    }

    applyManagedBannerContent(bannerMap);
  })().catch((error) => {
    console.error("[BannerRuntime] managed icon init failed", error);
  });

  return initPromise;
};
