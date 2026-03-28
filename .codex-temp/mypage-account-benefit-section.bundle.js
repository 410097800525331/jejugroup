// front/components/react/mypage/AccountBenefitSection.tsx
import { useEffect as useEffect2, useRef, useState as useState2 } from "react";

// front/core/modules/config/api_config.module.js
var REMOTE_API_BASE_URL = "https://jejugroup.alwaysdata.net";
var LOCAL_API_BASE_URL = "http://localhost:9090/jeju-web";
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1"]);
var getApiBaseUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const apiTarget = params.get("api");
  if (apiTarget === "local") {
    return LOCAL_API_BASE_URL;
  }
  if (apiTarget === "remote") {
    return REMOTE_API_BASE_URL;
  }
  if (!LOCAL_HOSTS.has(window.location.hostname)) {
    return "";
  }
  if (window.location.port === "8080") {
    return "";
  }
  return window.location.port !== "9090" ? LOCAL_API_BASE_URL : "";
};
var API_BASE_URL = getApiBaseUrl();

// front/components/react/mypage/data.ts
var ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
var FALLBACK_PROFILE = {
  email: "minji.hong@jejugroup.example",
  id: "hong_minji",
  memberships: ["GOLD"],
  name: "\uD64D\uBBFC\uC9C0",
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678"
  },
  phone: "010-1234-5678",
  tier: "GOLD"
};
var FALLBACK_STATS = [
  { label: "\uBCF4\uC720 \uD3EC\uC778\uD2B8", tone: "point", value: "0P" },
  { label: "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uCFE0\uD3F0", tone: "coupon", value: "0\uC7A5" },
  { label: "\uB2E4\uAC00\uC624\uB294 \uC5EC\uD589", tone: "air", value: "0\uAC74" }
];
var FALLBACK_BOOKINGS = [
  {
    amount: "324,000\uC6D0",
    date: "2026.11.20 09:10",
    duration: "2\uC2DC\uAC04 30\uBD84",
    id: "air-icn-nrt",
    paymentMethod: "\uC2E0\uC6A9\uCE74\uB4DC (\uD604\uB300)",
    status: "\uACB0\uC81C \uC644\uB8CC",
    tags: ["\uBAA8\uBC14\uC77C \uD0D1\uC2B9\uAD8C", "\uC704\uD0C1 \uC218\uD558\uBB3C 15kg"],
    title: "ICN \u2192 NRT \uC81C\uC8FC\uD56D\uACF5 7C1102",
    type: "air",
    voucherUrl: "#"
  },
  {
    amount: "480,000\uC6D0",
    date: "2026.10.15 ~ 10.17",
    duration: "2\uBC15 3\uC77C",
    id: "stay-jeju-ocean",
    paymentMethod: "\uB124\uC774\uBC84\uD398\uC774",
    status: "\uC608\uC57D \uC644\uB8CC",
    tags: ["\uC870\uC2DD \uD3EC\uD568", "\uC218\uC601\uC7A5", "\uC5BC\uB9AC \uCCB4\uD06C\uC778"],
    title: "Jeju Ocean Suite Hotel",
    type: "stay",
    voucherUrl: "#"
  },
  {
    amount: "135,000\uC6D0",
    date: "2026.10.15 09:30",
    duration: "48\uC2DC\uAC04",
    id: "rent-ioniq",
    paymentMethod: "\uD3EC\uC778\uD2B8 \uC804\uC561\uACB0\uC81C",
    status: "\uACB0\uC218 \uB300\uAE30",
    tags: ["\uC644\uC804 \uC790\uCC28", "\uACF5\uD56D \uD53D\uC5C5", "\uC804\uAE30\uCC28"],
    title: "IONIQ 6 Long Range (\uC81C\uC8FC\uB80C\uD130\uCE74)",
    type: "rent"
  },
  {
    amount: "25,000\uC6D0",
    date: "2026.10.15",
    id: "vouch-usim",
    paymentMethod: "\uCE74\uCE74\uC624\uD398\uC774",
    status: "\uBC1C\uAD8C \uC644\uB8CC",
    tags: ["\uC775\uC77C \uC218\uB839", "\uC778\uCC9C\uACF5\uD56D T1", "5GB \uB370\uC774\uD130"],
    title: "\uC77C\uBCF8 4G \uC720\uC2EC (\uB9E4\uC77C 1GB/5\uC77C)",
    type: "voucher",
    voucherUrl: "#"
  },
  {
    amount: "89,000\uC6D0",
    date: "2026.10.16 14:00",
    id: "vouch-act-scuba",
    paymentMethod: "\uC2E0\uC6A9\uCE74\uB4DC (\uC0BC\uC131)",
    status: "\uC608\uC57D \uC644\uB8CC",
    tags: ["\uC7A5\uBE44 \uD3EC\uD568", "\uAC15\uC0AC \uB3D9\uD589", "\uC218\uC911 \uC0AC\uC9C4"],
    title: "\uC11C\uADC0\uD3EC \uBB38\uC12C \uC2A4\uCFE0\uBC84\uB2E4\uC774\uBE59 \uCCB4\uD5D8",
    type: "voucher",
    voucherUrl: "#"
  }
];
var FALLBACK_LINKED_COMPANIONS = [];
var FALLBACK_TRAVEL_EVENTS = [];
var resolveAvatarUrl = (value) => {
  const text = toText(value);
  if (!text) {
    return void 0;
  }
  if (text.startsWith("data:") || text.startsWith("blob:") || text.startsWith("//") || ABSOLUTE_URL_PATTERN.test(text)) {
    return text;
  }
  return `${API_BASE_URL}${text}`;
};
function buildItineraryFromTravelEvents({
  currentAccountId,
  linkedCompanions,
  travelEvents
}) {
  const linkedCompanionMap = new Map(linkedCompanions.map((companion) => [companion.id, companion]));
  const allowedOwnerIds = /* @__PURE__ */ new Set([
    ...currentAccountId ? [currentAccountId] : [],
    ...linkedCompanions.map((companion) => companion.id)
  ]);
  const grouped = /* @__PURE__ */ new Map();
  for (const event of travelEvents) {
    if (allowedOwnerIds.size > 0 && !allowedOwnerIds.has(event.ownerId)) {
      continue;
    }
    const existing = grouped.get(event.dayId);
    const nextActivity = {
      checked: event.status === "used",
      id: event.id,
      label: event.activityLabel,
      ownerId: event.ownerId,
      ownerName: event.ownerName,
      status: event.status,
      type: event.type
    };
    if (existing) {
      existing.activities.push(nextActivity);
      if (event.ownerId !== currentAccountId && linkedCompanionMap.has(event.ownerId)) {
        const companion = linkedCompanionMap.get(event.ownerId);
        if (companion && !existing.companions.some((item) => item.id === companion.id)) {
          existing.companions.push({ ...companion });
        }
      }
      continue;
    }
    grouped.set(event.dayId, {
      activities: [nextActivity],
      companions: event.ownerId !== currentAccountId && linkedCompanionMap.has(event.ownerId) ? [{ ...linkedCompanionMap.get(event.ownerId) }] : [],
      date: event.date,
      googleMapUrl: event.googleMapUrl,
      id: event.dayId,
      sortKey: `${event.date} ${event.time}`,
      time: event.time,
      title: event.title
    });
  }
  return Array.from(grouped.values()).sort((left, right) => left.sortKey.localeCompare(right.sortKey)).map(({ sortKey: _sortKey, ...item }) => item);
}
var PROFILE = cloneProfile(FALLBACK_PROFILE);
var STATS = cloneStats(FALLBACK_STATS);
var BOOKINGS = cloneBookings(FALLBACK_BOOKINGS);
var LINKED_COMPANIONS = cloneCompanions(FALLBACK_LINKED_COMPANIONS);
var TRAVEL_EVENTS = cloneTravelEvents(FALLBACK_TRAVEL_EVENTS);
var ITINERARY = buildItineraryFromTravelEvents({
  currentAccountId: FALLBACK_PROFILE.id ?? "",
  linkedCompanions: LINKED_COMPANIONS,
  travelEvents: TRAVEL_EVENTS
});
function cloneProfile(profile) {
  return {
    avatarUrl: profile.avatarUrl,
    ...profile,
    memberships: [...profile.memberships],
    passport: profile.passport ? { ...profile.passport } : void 0
  };
}
function cloneStats(stats) {
  return stats.map((stat) => ({ ...stat }));
}
function cloneBookings(bookings) {
  return bookings.map((booking) => ({
    ...booking,
    tags: [...booking.tags]
  }));
}
function cloneCompanions(companions) {
  return companions.map((companion) => ({ ...companion }));
}
function cloneTravelEvents(events) {
  return events.map((event) => ({ ...event }));
}
var toText = (value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : void 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return void 0;
};

// front/components/react/mypage/SectionCard.tsx
var SectionCard = ({ children, className = "" }) => {
  const classes = ["bento-box", "soft-radius", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ React.createElement("div", { className: classes }, children);
};

// front/components/react/mypage/state.tsx
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { applyDashboardSnapshot, createDashboardFallbackSnapshot, normalizeDashboardSnapshot } from "@front-components/mypage/data";
var DashboardContext = createContext(null);
var useDashboardState = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardState must be used within DashboardProvider");
  }
  return context;
};

// front/components/react/mypage/AccountBenefitSection.tsx
var AVATAR_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
var AVATAR_RENDER_SIZE = 512;
var AVATAR_STAGE_INSET = 16;
var AVATAR_MAX_ZOOM = 6;
var BIO_MAX_LENGTH = 20;
var AVATAR_PREVIEW_FRAME_STYLE = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
};
var AVATAR_PREVIEW_IMAGE_STYLE = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
};
var AVATAR_PREVIEW_INITIAL_STYLE = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
};
var clampBioText = (value) => Array.from((value ?? "").trim()).slice(0, BIO_MAX_LENGTH).join("");
var createEditableProfile = (profile) => ({
  bio: profile.bio ?? "",
  email: profile.email,
  name: profile.name,
  phone: profile.phone
});
var normalizeProfile = (profile) => ({
  bio: clampBioText(profile.bio),
  email: profile.email.trim(),
  name: profile.name.trim(),
  phone: profile.phone.trim()
});
var isEditableProfileValid = (profile) => profile.name.trim().length > 0 && profile.email.trim().includes("@") && profile.phone.trim().length > 0;
var toApiUrl = (path) => `${API_BASE_URL}${path}`;
var isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      resolve(reader.result);
      return;
    }
    reject(new Error("\uC774\uBBF8\uC9C0 \uB370\uC774\uD130\uB97C \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4."));
  };
  reader.onerror = () => reject(new Error("\uC774\uBBF8\uC9C0 \uB370\uC774\uD130\uB97C \uC77D\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4."));
  reader.readAsDataURL(file);
});
var clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));
var getAvatarMetrics = (image, stageWidth, stageHeight) => {
  if (!image.naturalWidth || !image.naturalHeight) {
    return null;
  }
  const safeStageWidth = Math.max(1, Math.round(stageWidth || 320));
  const safeStageHeight = Math.max(1, Math.round(stageHeight || 320));
  const circleDiameter = Math.max(0, Math.min(safeStageWidth, safeStageHeight) - AVATAR_STAGE_INSET * 2);
  const circleRadius = circleDiameter / 2;
  const baseScale = Math.min(safeStageWidth / image.naturalWidth, safeStageHeight / image.naturalHeight);
  const baseWidth = image.naturalWidth * baseScale;
  const baseHeight = image.naturalHeight * baseScale;
  const minZoom = Math.max(circleDiameter / Math.max(baseWidth, 1), circleDiameter / Math.max(baseHeight, 1), 1);
  return {
    baseHeight,
    baseScale,
    baseWidth,
    circleDiameter,
    circleRadius,
    maxZoom: AVATAR_MAX_ZOOM,
    minZoom,
    stageHeight: safeStageHeight,
    stageWidth: safeStageWidth
  };
};
var clampAvatarTransform = (transform, metrics) => {
  const zoom = clampNumber(transform.zoom, metrics.minZoom, metrics.maxZoom);
  const imageWidth = metrics.baseWidth * zoom;
  const imageHeight = metrics.baseHeight * zoom;
  const maxPanX = Math.max(0, (imageWidth - metrics.circleDiameter) / 2);
  const maxPanY = Math.max(0, (imageHeight - metrics.circleDiameter) / 2);
  return {
    panX: clampNumber(transform.panX, -maxPanX, maxPanX),
    panY: clampNumber(transform.panY, -maxPanY, maxPanY),
    zoom
  };
};
var getClampedAvatarTransform = (currentTransform, image, stageWidth, stageHeight, nextTransform) => {
  const metrics = getAvatarMetrics(image, stageWidth, stageHeight);
  if (!metrics) {
    return currentTransform;
  }
  return clampAvatarTransform(nextTransform, metrics);
};
var renderAvatarPreviewBlob = (image, metrics, transform) => new Promise((resolve, reject) => {
  const canvas = document.createElement("canvas");
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(AVATAR_RENDER_SIZE * pixelRatio));
  canvas.height = Math.max(1, Math.round(AVATAR_RENDER_SIZE * pixelRatio));
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("\uD504\uB85C\uD544 \uC0AC\uC9C4 \uD3B8\uC9D1\uC6A9 \uCE94\uBC84\uC2A4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  }
  context.scale(pixelRatio, pixelRatio);
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, AVATAR_RENDER_SIZE, AVATAR_RENDER_SIZE);
  const renderScale = AVATAR_RENDER_SIZE / Math.max(metrics.circleDiameter, 1);
  const imageWidth = metrics.baseWidth * transform.zoom;
  const imageHeight = metrics.baseHeight * transform.zoom;
  const imageLeft = metrics.stageWidth / 2 + transform.panX - imageWidth / 2 - (metrics.stageWidth / 2 - metrics.circleRadius);
  const imageTop = metrics.stageHeight / 2 + transform.panY - imageHeight / 2 - (metrics.stageHeight / 2 - metrics.circleRadius);
  context.save();
  context.beginPath();
  context.arc(
    AVATAR_RENDER_SIZE / 2,
    AVATAR_RENDER_SIZE / 2,
    AVATAR_RENDER_SIZE / 2,
    0,
    Math.PI * 2
  );
  context.closePath();
  context.clip();
  context.drawImage(
    image,
    imageLeft * renderScale,
    imageTop * renderScale,
    imageWidth * renderScale,
    imageHeight * renderScale
  );
  context.restore();
  canvas.toBlob((blob) => {
    if (blob) {
      resolve(blob);
      return;
    }
    reject(new Error("\uD504\uB85C\uD544 \uC0AC\uC9C4 \uD3B8\uC9D1\uC6A9 \uC774\uBBF8\uC9C0\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4."));
  }, "image/png");
});
var extractAvatarUrl = (value) => {
  if (!isRecord(value)) {
    return null;
  }
  const profile = isRecord(value.profile) ? value.profile : null;
  const dashboard = isRecord(value.dashboard) ? value.dashboard : null;
  const dashboardProfile = dashboard && isRecord(dashboard.profile) ? dashboard.profile : null;
  const data = isRecord(value.data) ? value.data : null;
  const candidates = [
    value.avatarUrl,
    profile?.avatarUrl,
    dashboard?.avatarUrl,
    dashboardProfile?.avatarUrl,
    data?.avatarUrl
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return null;
};
var getBenefitValueStyle = (tone) => tone === "point" ? {
  color: "#1f2937"
} : void 0;
var AccountBenefitSection = () => {
  const { refreshDashboard, state } = useDashboardState();
  const dashboardProfile = state.profile ?? PROFILE;
  const dashboardStats = state.stats?.length ? state.stats : STATS;
  const passport = dashboardProfile.passport;
  const [profile, setProfile] = useState2(() => createEditableProfile(dashboardProfile));
  const [draftProfile, setDraftProfile] = useState2(() => createEditableProfile(dashboardProfile));
  const [isEditModalOpen, setIsEditModalOpen] = useState2(false);
  const [modalView, setModalView] = useState2("profile");
  const [isSaving, setIsSaving] = useState2(false);
  const [saveError, setSaveError] = useState2(null);
  const [avatarError, setAvatarError] = useState2(null);
  const [isApplyingAvatar, setIsApplyingAvatar] = useState2(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState2(null);
  const [avatarEditorSourceUrl, setAvatarEditorSourceUrl] = useState2(null);
  const [avatarTransform, setAvatarTransform] = useState2({ panX: 0, panY: 0, zoom: 1 });
  const [avatarStageSize, setAvatarStageSize] = useState2({ height: 320, width: 320 });
  const [avatarImageReady, setAvatarImageReady] = useState2(false);
  const [isAvatarDragging, setIsAvatarDragging] = useState2(false);
  const avatarInputRef = useRef(null);
  const avatarImageRef = useRef(null);
  const avatarStageRef = useRef(null);
  const avatarDragRef = useRef(null);
  const avatarPreviewSourceUrl = resolveAvatarUrl(avatarPreviewUrl) ?? dashboardProfile.avatarUrl ?? null;
  const profileBadgeInitial = (draftProfile.name.trim().charAt(0) || PROFILE.name.trim().charAt(0) || "J").toUpperCase();
  const profileBioText = clampBioText(draftProfile.bio) || clampBioText(profile.bio);
  useEffect2(() => {
    if (isEditModalOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [avatarPreviewSourceUrl, isEditModalOpen, modalView]);
  useEffect2(() => {
    if (!isEditModalOpen) {
      return;
    }
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isEditModalOpen]);
  useEffect2(() => {
    const nextProfile = createEditableProfile(dashboardProfile);
    if (!isEditModalOpen) {
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
    }
  }, [dashboardProfile, isEditModalOpen]);
  useEffect2(() => {
    if (!isEditModalOpen || modalView !== "avatar" || !avatarStageRef.current) {
      return;
    }
    const updateStageSize = () => {
      const rect = avatarStageRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      setAvatarStageSize({
        height: Math.max(1, Math.round(rect.height)),
        width: Math.max(1, Math.round(rect.width))
      });
    };
    updateStageSize();
    const observer = new ResizeObserver(updateStageSize);
    observer.observe(avatarStageRef.current);
    return () => observer.disconnect();
  }, [avatarEditorSourceUrl, isEditModalOpen, modalView]);
  useEffect2(() => {
    if (!avatarEditorSourceUrl || !avatarImageReady || !avatarImageRef.current) {
      return;
    }
    const metrics = getAvatarMetrics(avatarImageRef.current, avatarStageSize.width, avatarStageSize.height);
    if (!metrics) {
      return;
    }
    setAvatarTransform((current) => clampAvatarTransform(current, metrics));
  }, [avatarImageReady, avatarEditorSourceUrl, avatarStageSize.height, avatarStageSize.width]);
  const handleAvatarImageLoad = () => {
    const image = avatarImageRef.current;
    if (!image) {
      return;
    }
    const metrics = getAvatarMetrics(image, avatarStageSize.width, avatarStageSize.height);
    if (!metrics) {
      setAvatarError("\uC774\uBBF8\uC9C0 \uD06C\uAE30\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    setAvatarImageReady(true);
    setAvatarTransform(clampAvatarTransform({ panX: 0, panY: 0, zoom: metrics.minZoom }, metrics));
    setAvatarError(null);
  };
  const resetAvatarEditor = () => {
    setAvatarEditorSourceUrl(null);
    setAvatarTransform({ panX: 0, panY: 0, zoom: 1 });
    setAvatarImageReady(false);
    setAvatarError(null);
    setIsApplyingAvatar(false);
    setIsAvatarDragging(false);
    avatarDragRef.current = null;
  };
  const openEditModal = () => {
    setDraftProfile(profile);
    setSaveError(null);
    setModalView("profile");
    setAvatarPreviewUrl((current) => resolveAvatarUrl(current) ?? dashboardProfile.avatarUrl ?? null);
    resetAvatarEditor();
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setDraftProfile(profile);
    setSaveError(null);
    setModalView("profile");
    resetAvatarEditor();
    setIsEditModalOpen(false);
  };
  const openAvatarEditor = () => {
    setModalView("avatar");
    resetAvatarEditor();
  };
  const openAvatarFilePicker = () => {
    avatarInputRef.current?.click();
  };
  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAvatarError("\uC774\uBBF8\uC9C0 \uD30C\uC77C\uB9CC \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    if (file.size > AVATAR_FILE_SIZE_LIMIT) {
      setAvatarError("\uD504\uB85C\uD544 \uC0AC\uC9C4\uC740 5MB \uC774\uD558\uB85C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    try {
      const sourceUrl = await readFileAsDataUrl(file);
      setAvatarEditorSourceUrl(sourceUrl);
      setAvatarTransform({ panX: 0, panY: 0, zoom: 1 });
      setAvatarImageReady(false);
      setAvatarError(null);
    } catch {
      setAvatarError("\uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
    }
  };
  const updateAvatarTransform = (nextTransform) => {
    if (!avatarImageRef.current) {
      return;
    }
    setAvatarTransform(
      (current) => getClampedAvatarTransform(
        current,
        avatarImageRef.current,
        avatarStageSize.width,
        avatarStageSize.height,
        nextTransform
      )
    );
  };
  const handleAvatarPointerDown = (event) => {
    if (!avatarEditorSourceUrl || !avatarImageReady || !avatarImageRef.current) {
      return;
    }
    const metrics = getAvatarMetrics(avatarImageRef.current, avatarStageSize.width, avatarStageSize.height);
    if (!metrics) {
      return;
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    avatarDragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPanX: avatarTransform.panX,
      startPanY: avatarTransform.panY
    };
    setIsAvatarDragging(true);
  };
  const handleAvatarPointerMove = (event) => {
    const dragState = avatarDragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId || !avatarImageReady || !avatarImageRef.current) {
      return;
    }
    const nextTransform = {
      panX: dragState.startPanX + (event.clientX - dragState.startClientX),
      panY: dragState.startPanY + (event.clientY - dragState.startClientY),
      zoom: avatarTransform.zoom
    };
    updateAvatarTransform(nextTransform);
  };
  const handleAvatarPointerUp = (event) => {
    const dragState = avatarDragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }
    avatarDragRef.current = null;
    setIsAvatarDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const handleAvatarWheel = (event) => {
    if (!avatarEditorSourceUrl || !avatarImageReady || !avatarImageRef.current) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setAvatarTransform((current) => {
      const image = avatarImageRef.current;
      if (!image) {
        return current;
      }
      const metrics = getAvatarMetrics(image, avatarStageSize.width, avatarStageSize.height);
      if (!metrics) {
        return current;
      }
      const zoomFactor = Math.exp(-event.deltaY * 12e-4);
      const nextZoom = clampNumber(current.zoom * zoomFactor, metrics.minZoom, metrics.maxZoom);
      const zoomRatio = nextZoom / Math.max(current.zoom, 1e-4);
      return clampAvatarTransform(
        {
          panX: current.panX * zoomRatio,
          panY: current.panY * zoomRatio,
          zoom: nextZoom
        },
        metrics
      );
    });
  };
  const handleApplyAvatar = async () => {
    if (!avatarEditorSourceUrl || !avatarImageReady || !avatarImageRef.current) {
      setAvatarError("\uBA3C\uC800 \uC774\uBBF8\uC9C0\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    const metrics = getAvatarMetrics(avatarImageRef.current, avatarStageSize.width, avatarStageSize.height);
    if (!metrics) {
      setAvatarError("\uC774\uBBF8\uC9C0 \uC815\uBCF4\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    setIsApplyingAvatar(true);
    setAvatarError(null);
    try {
      const avatarBlob = await renderAvatarPreviewBlob(avatarImageRef.current, metrics, avatarTransform);
      const avatarFile = new File([avatarBlob], "avatar.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await fetch(toApiUrl("/api/mypage/avatar"), {
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (response.status === 401) {
        throw new Error("\uB85C\uADF8\uC778 \uC815\uBCF4\uAC00 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
      }
      if (!response.ok) {
        throw new Error("\uD504\uB85C\uD544 \uC0AC\uC9C4 \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
      }
      const responsePayload = await response.json().catch(() => null);
      const responseAvatarUrl = resolveAvatarUrl(extractAvatarUrl(responsePayload));
      if (responseAvatarUrl) {
        setAvatarPreviewUrl(responseAvatarUrl);
      }
      const refreshed = await refreshDashboard();
      if (!responseAvatarUrl && refreshed) {
        setAvatarPreviewUrl(null);
      }
      setModalView("profile");
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "\uD504\uB85C\uD544 \uC0AC\uC9C4 \uC801\uC6A9\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
    } finally {
      setIsApplyingAvatar(false);
    }
  };
  const handleSaveProfile = async () => {
    const nextProfile = normalizeProfile(draftProfile);
    if (!isEditableProfileValid(nextProfile)) {
      setSaveError("\uC774\uB984, \uC774\uBA54\uC77C, \uD734\uB300\uC804\uD654 \uC815\uBCF4\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(toApiUrl("/api/mypage/profile"), {
        body: JSON.stringify(nextProfile),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (response.status === 401) {
        throw new Error("\uB85C\uADF8\uC778 \uC815\uBCF4\uAC00 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.");
      }
      if (!response.ok) {
        throw new Error("\uD504\uB85C\uD544 \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
      }
      const refreshed = await refreshDashboard();
      if (!refreshed) {
        throw new Error("\uC800\uC7A5\uC740 \uC644\uB8CC\uB418\uC5C8\uC9C0\uB9CC \uCD5C\uC2E0 \uC815\uBCF4\uB97C \uB2E4\uC2DC \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
      }
      setIsEditModalOpen(false);
      setModalView("profile");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "\uD504\uB85C\uD544 \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
    } finally {
      setIsSaving(false);
    }
  };
  const isSaveDisabled = isSaving || !isEditableProfileValid(draftProfile);
  const avatarMetrics = avatarEditorSourceUrl && avatarImageReady && avatarImageRef.current ? getAvatarMetrics(avatarImageRef.current, avatarStageSize.width, avatarStageSize.height) : null;
  const avatarImageWidth = avatarMetrics ? avatarMetrics.baseWidth * avatarTransform.zoom : 0;
  const avatarImageHeight = avatarMetrics ? avatarMetrics.baseHeight * avatarTransform.zoom : 0;
  const avatarImageLeft = avatarMetrics ? avatarMetrics.stageWidth / 2 + avatarTransform.panX - avatarImageWidth / 2 : 0;
  const avatarImageTop = avatarMetrics ? avatarMetrics.stageHeight / 2 + avatarTransform.panY - avatarImageHeight / 2 : 0;
  const avatarCircleDiameter = avatarMetrics?.circleDiameter ?? 0;
  const avatarCircleRadius = avatarMetrics?.circleRadius ?? 0;
  const avatarStageStyle = {
    alignItems: "center",
    aspectRatio: "1 / 1",
    background: "#eef2f7",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "32px",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.4)",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    touchAction: "none",
    width: "min(100%, 320px)"
  };
  const avatarImageStyle = avatarMetrics ? {
    display: "block",
    height: `${avatarImageHeight}px`,
    left: `${avatarImageLeft}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${avatarImageTop}px`,
    userSelect: "none",
    width: `${avatarImageWidth}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  };
  const avatarShadeStyle = avatarMetrics ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, avatarCircleRadius - 2)}px, black ${Math.max(0, avatarCircleRadius - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, avatarCircleRadius - 2)}px, black ${Math.max(0, avatarCircleRadius - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null;
  const avatarGuideStyle = avatarMetrics ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${avatarCircleDiameter}px`,
    left: `calc(50% - ${avatarCircleRadius}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${avatarCircleRadius}px)`,
    width: `${avatarCircleDiameter}px`
  } : null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "meta-section layer-account-benefits" }, /* @__PURE__ */ React.createElement("header", { className: "section-header" }, /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "\uD68C\uC6D0 \uC815\uBCF4 \uBC0F \uD61C\uD0DD"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638\uC640 \uB9DE\uCDA4\uD615 \uD61C\uD0DD \uAD00\uB9AC")), /* @__PURE__ */ React.createElement("div", { className: "account-grid bento-grid" }, /* @__PURE__ */ React.createElement(SectionCard, { className: "account-info-box meta-glass-theme" }, /* @__PURE__ */ React.createElement("div", { className: "box-head flex-header" }, /* @__PURE__ */ React.createElement("h3", null, "\uAE30\uBCF8 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("button", { className: "edit-btn pill-shape", type: "button", onClick: openEditModal }, "\uB0B4 \uC815\uBCF4 \uC218\uC815")), /* @__PURE__ */ React.createElement("div", { className: "box-body" }, /* @__PURE__ */ React.createElement("div", { className: "info-row" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("strong", { className: "value" }, profile.name)), /* @__PURE__ */ React.createElement("div", { className: "info-row" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("strong", { className: "value" }, profile.email)), /* @__PURE__ */ React.createElement("div", { className: "info-row" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, "\uD734\uB300\uC804\uD654"), /* @__PURE__ */ React.createElement("strong", { className: "value" }, profile.phone)))), /* @__PURE__ */ React.createElement(SectionCard, { className: "passport-info-box meta-glass-theme" }, /* @__PURE__ */ React.createElement("div", { className: "box-head" }, /* @__PURE__ */ React.createElement("h3", null, "\uD328\uC2A4\uD3EC\uD2B8 \uC815\uBCF4")), /* @__PURE__ */ React.createElement("div", { className: "box-body" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "passport-visual soft-radius",
      style: passport ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "pass-meta" }, /* @__PURE__ */ React.createElement("span", { className: "pass-num" }, passport?.number ?? "\uBBF8\uB4F1\uB85D"), /* @__PURE__ */ React.createElement("span", { className: "pass-country" }, passport?.issuingCountry ?? "\uD574\uC678 \uC5EC\uD589 \uC804\uC5D0 \uC5EC\uAD8C \uC815\uBCF4\uB97C \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694."))
  ), /* @__PURE__ */ React.createElement("div", { className: "info-row" }, /* @__PURE__ */ React.createElement("span", { className: "label" }, passport ? "\uC5EC\uAD8C \uB9CC\uB8CC\uC77C" : "\uB4F1\uB85D \uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("strong", { className: "value" }, passport?.expiryDate ?? "\uB4F1\uB85D \uD544\uC694")))), /* @__PURE__ */ React.createElement(SectionCard, { className: "benefit-history-box meta-glass-theme full-width-bento" }, /* @__PURE__ */ React.createElement("div", { className: "box-head" }, /* @__PURE__ */ React.createElement("h3", null, "\uB098\uC758 \uD3EC\uC778\uD2B8 & \uCFE0\uD3F0 \uB0B4\uC5ED")), /* @__PURE__ */ React.createElement("div", { className: "benefit-tiles" }, dashboardStats.slice(0, 2).map((stat) => /* @__PURE__ */ React.createElement("div", { className: `benefit-tile tone-${stat.tone} soft-radius`, key: stat.label }, /* @__PURE__ */ React.createElement("span", { className: "benefit-label" }, stat.label), /* @__PURE__ */ React.createElement("strong", { className: "benefit-value", style: getBenefitValueStyle(stat.tone) }, stat.value), /* @__PURE__ */ React.createElement("button", { className: "history-link", type: "button" }, "\uC0C1\uC138 \uB0B4\uC5ED \uD655\uC778"))))))), isEditModalOpen ? /* @__PURE__ */ React.createElement("div", { className: "meta-modal-overlay", onClick: closeEditModal }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta-modal-content soft-radius meta-glass-theme",
      onClick: (event) => event.stopPropagation(),
      style: { padding: "36px" }
    },
    modalView === "profile" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", { className: "modal-header" }, /* @__PURE__ */ React.createElement("div", { className: "header-title-wrap" }, /* @__PURE__ */ React.createElement("h3", null, "\uAC1C\uC778\uC815\uBCF4 \uC218\uC815"))), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "profile-link-preview soft-radius",
        role: "button",
        tabIndex: 0,
        onClick: openAvatarEditor,
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openAvatarEditor();
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" } }, /* @__PURE__ */ React.createElement("span", { style: AVATAR_PREVIEW_FRAME_STYLE }, avatarPreviewSourceUrl ? /* @__PURE__ */ React.createElement("img", { alt: "", className: "profile-link-preview-image", src: avatarPreviewSourceUrl, style: AVATAR_PREVIEW_IMAGE_STYLE }) : /* @__PURE__ */ React.createElement("span", { style: AVATAR_PREVIEW_INITIAL_STYLE }, profileBadgeInitial)), /* @__PURE__ */ React.createElement("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })),
      /* @__PURE__ */ React.createElement("div", { className: "profile-link-copy" }, /* @__PURE__ */ React.createElement("strong", null, "\uACF5\uC6A9 \uD504\uB85C\uD544 \uBBF8\uB9AC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("span", null, profileBioText))
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "box-body",
        style: { display: "flex", flexDirection: "column", gap: "18px", padding: 0, width: "100%" }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "info-row",
          style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }
        },
        /* @__PURE__ */ React.createElement("span", { className: "label", style: { fontSize: "15px" } }, "\uD55C \uC904 \uC18C\uAC1C"),
        /* @__PURE__ */ React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ React.createElement(
          "input",
          {
            className: "id-input",
            maxLength: BIO_MAX_LENGTH,
            type: "text",
            value: draftProfile.bio,
            onChange: (event) => setDraftProfile((current) => ({
              ...current,
              bio: clampBioText(event.target.value)
            })),
            placeholder: "\uD55C \uC904 \uC18C\uAC1C\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694",
            style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
          }
        ))
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "info-row",
          style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }
        },
        /* @__PURE__ */ React.createElement("span", { className: "label", style: { fontSize: "15px" } }, "\uC774\uB984"),
        /* @__PURE__ */ React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ React.createElement(
          "input",
          {
            className: "id-input",
            type: "text",
            value: draftProfile.name,
            onChange: (event) => setDraftProfile((current) => ({ ...current, name: event.target.value })),
            style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
          }
        ))
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "info-row",
          style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }
        },
        /* @__PURE__ */ React.createElement("span", { className: "label", style: { fontSize: "15px" } }, "\uC774\uBA54\uC77C"),
        /* @__PURE__ */ React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ React.createElement(
          "input",
          {
            className: "id-input",
            type: "email",
            value: draftProfile.email,
            onChange: (event) => setDraftProfile((current) => ({ ...current, email: event.target.value })),
            style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
          }
        ))
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "info-row",
          style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }
        },
        /* @__PURE__ */ React.createElement("span", { className: "label", style: { fontSize: "15px" } }, "\uD734\uB300\uC804\uD654"),
        /* @__PURE__ */ React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ React.createElement(
          "input",
          {
            className: "id-input",
            type: "tel",
            value: draftProfile.phone,
            onChange: (event) => setDraftProfile((current) => ({ ...current, phone: event.target.value })),
            style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
          }
        ))
      )
    ), saveError ? /* @__PURE__ */ React.createElement("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" } }, saveError) : null, isSaving ? /* @__PURE__ */ React.createElement("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" } }, "\uC800\uC7A5 \uC911...") : null, /* @__PURE__ */ React.createElement("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" } }, /* @__PURE__ */ React.createElement("button", { className: "cancel-btn pill-shape", type: "button", onClick: closeEditModal, style: { padding: "18px 0", fontSize: "15px" } }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "save-btn pill-shape",
        type: "button",
        onClick: handleSaveProfile,
        disabled: isSaveDisabled,
        style: { padding: "18px 0", fontSize: "15px" }
      },
      "\uC800\uC7A5"
    ))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", { className: "modal-header" }, /* @__PURE__ */ React.createElement("div", { className: "header-title-wrap" }, /* @__PURE__ */ React.createElement("h3", null, "\uD504\uB85C\uD544 \uC0AC\uC9C4 \uD3B8\uC9D1"))), /* @__PURE__ */ React.createElement("input", { ref: avatarInputRef, accept: "image/*", hidden: true, type: "file", onChange: handleAvatarFileChange }), /* @__PURE__ */ React.createElement("div", { className: "profile-avatar-editor soft-radius" }, /* @__PURE__ */ React.createElement("div", { className: "profile-avatar-editor-preview" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: avatarStageRef,
        onPointerCancel: handleAvatarPointerUp,
        onPointerDown: handleAvatarPointerDown,
        onPointerMove: handleAvatarPointerMove,
        onPointerUp: handleAvatarPointerUp,
        onWheel: handleAvatarWheel,
        style: {
          ...avatarStageStyle,
          cursor: avatarEditorSourceUrl ? isAvatarDragging ? "grabbing" : "grab" : "default"
        }
      },
      avatarEditorSourceUrl ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        "img",
        {
          ref: avatarImageRef,
          alt: "\uD504\uB85C\uD544 \uC0AC\uC9C4 \uD3B8\uC9D1 \uBBF8\uB9AC\uBCF4\uAE30",
          draggable: false,
          src: avatarEditorSourceUrl,
          style: avatarImageStyle,
          onLoad: handleAvatarImageLoad
        }
      ), avatarShadeStyle ? /* @__PURE__ */ React.createElement("div", { style: avatarShadeStyle }) : null, avatarGuideStyle ? /* @__PURE__ */ React.createElement("div", { style: avatarGuideStyle }) : null) : /* @__PURE__ */ React.createElement(
        "button",
        {
          className: "profile-avatar-editor-empty",
          type: "button",
          onClick: openAvatarFilePicker
        },
        "\uC0AC\uC9C4 \uC120\uD0DD"
      )
    ))), avatarEditorSourceUrl ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: openAvatarFilePicker,
        style: {
          background: "transparent",
          border: "none",
          color: "#6b7280",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 700,
          padding: "6px 10px",
          textDecoration: "underline",
          textUnderlineOffset: "3px"
        }
      },
      "\uB2E4\uB978 \uC0AC\uC9C4 \uC120\uD0DD"
    )) : null, avatarError ? /* @__PURE__ */ React.createElement("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" } }, avatarError) : null, /* @__PURE__ */ React.createElement("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "cancel-btn pill-shape",
        type: "button",
        onClick: () => {
          setModalView("profile");
          setAvatarError(null);
        },
        style: { padding: "18px 0", fontSize: "15px" }
      },
      "\uC774\uC804"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "save-btn pill-shape",
        type: "button",
        onClick: handleApplyAvatar,
        disabled: !avatarEditorSourceUrl || !avatarImageReady || isApplyingAvatar,
        style: { padding: "18px 0", fontSize: "15px" }
      },
      isApplyingAvatar ? "\uC801\uC6A9 \uC911..." : "\uC801\uC6A9"
    )))
  )) : null);
};
export {
  AccountBenefitSection
};
