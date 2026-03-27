import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent, type WheelEvent } from "react";
import { PROFILE, STATS, resolveAvatarUrl } from "./data";
import { SectionCard } from "./SectionCard";
import { useDashboardState } from "./state";
import type { UserProfile } from "./types";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { API_BASE_URL } from "../../../core/modules/config/api_config.module.js";

declare global {
  interface Window {
    lucide?: {
      createIcons: () => void;
    };
  }
}

type EditableProfile = Pick<UserProfile, "email" | "name" | "phone">;
type DashboardStateSlice = {
  profile?: UserProfile;
  stats?: typeof STATS;
};
type DashboardContextSlice = {
  refreshDashboard: () => Promise<boolean>;
  state: DashboardStateSlice;
};
type ModalView = "profile" | "avatar";
type AvatarTransform = {
  panX: number;
  panY: number;
  zoom: number;
};
type AvatarMetrics = {
  baseHeight: number;
  baseScale: number;
  baseWidth: number;
  circleDiameter: number;
  circleRadius: number;
  maxZoom: number;
  minZoom: number;
  stageHeight: number;
  stageWidth: number;
};
type AvatarDragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPanX: number;
  startPanY: number;
};

const AVATAR_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const AVATAR_RENDER_SIZE = 512;
const AVATAR_STAGE_INSET = 16;
const AVATAR_MAX_ZOOM = 6;
const AVATAR_PREVIEW_FRAME_STYLE = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute" as const,
};
const AVATAR_PREVIEW_IMAGE_STYLE = {
  display: "block",
  height: "100%",
  objectFit: "cover" as const,
  width: "100%",
};
const AVATAR_PREVIEW_INITIAL_STYLE = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%",
};
const createEditableProfile = (profile: UserProfile): EditableProfile => ({
  email: profile.email,
  name: profile.name,
  phone: profile.phone,
});

const normalizeProfile = (profile: EditableProfile): EditableProfile => ({
  email: profile.email.trim(),
  name: profile.name.trim(),
  phone: profile.phone.trim(),
});

const isEditableProfileValid = (profile: EditableProfile) =>
  profile.name.trim().length > 0 && profile.email.trim().includes("@") && profile.phone.trim().length > 0;

const toApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("이미지 데이터를 읽지 못했습니다."));
    };

    reader.onerror = () => reject(new Error("이미지 데이터를 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getAvatarMetrics = (image: HTMLImageElement, stageWidth: number, stageHeight: number): AvatarMetrics | null => {
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
    stageWidth: safeStageWidth,
  };
};

const clampAvatarTransform = (transform: AvatarTransform, metrics: AvatarMetrics): AvatarTransform => {
  const zoom = clampNumber(transform.zoom, metrics.minZoom, metrics.maxZoom);
  const imageWidth = metrics.baseWidth * zoom;
  const imageHeight = metrics.baseHeight * zoom;
  const maxPanX = Math.max(0, (imageWidth - metrics.circleDiameter) / 2);
  const maxPanY = Math.max(0, (imageHeight - metrics.circleDiameter) / 2);

  return {
    panX: clampNumber(transform.panX, -maxPanX, maxPanX),
    panY: clampNumber(transform.panY, -maxPanY, maxPanY),
    zoom,
  };
};

const getClampedAvatarTransform = (
  currentTransform: AvatarTransform,
  image: HTMLImageElement,
  stageWidth: number,
  stageHeight: number,
  nextTransform: AvatarTransform,
) => {
  const metrics = getAvatarMetrics(image, stageWidth, stageHeight);
  if (!metrics) {
    return currentTransform;
  }

  return clampAvatarTransform(nextTransform, metrics);
};

const renderAvatarPreviewBlob = (image: HTMLImageElement, metrics: AvatarMetrics, transform: AvatarTransform) =>
  new Promise<Blob>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(AVATAR_RENDER_SIZE * pixelRatio));
    canvas.height = Math.max(1, Math.round(AVATAR_RENDER_SIZE * pixelRatio));

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
    }

    context.scale(pixelRatio, pixelRatio);
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, AVATAR_RENDER_SIZE, AVATAR_RENDER_SIZE);
    const renderScale = AVATAR_RENDER_SIZE / Math.max(metrics.circleDiameter, 1);
    const imageWidth = metrics.baseWidth * transform.zoom;
    const imageHeight = metrics.baseHeight * transform.zoom;
    const imageLeft = (metrics.stageWidth / 2 + transform.panX - imageWidth / 2) - (metrics.stageWidth / 2 - metrics.circleRadius);
    const imageTop = (metrics.stageHeight / 2 + transform.panY - imageHeight / 2) - (metrics.stageHeight / 2 - metrics.circleRadius);

    context.save();
    context.beginPath();
    context.arc(
      AVATAR_RENDER_SIZE / 2,
      AVATAR_RENDER_SIZE / 2,
      AVATAR_RENDER_SIZE / 2,
      0,
      Math.PI * 2,
    );
    context.closePath();
    context.clip();

    context.drawImage(
      image,
      imageLeft * renderScale,
      imageTop * renderScale,
      imageWidth * renderScale,
      imageHeight * renderScale,
    );

    context.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
    }, "image/png");
  });

const extractAvatarUrl = (value: unknown): string | null => {
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
    data?.avatarUrl,
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

const getBenefitValueStyle = (tone: (typeof STATS)[number]["tone"]) =>
  tone === "point"
    ? {
        color: "#1f2937",
      }
    : undefined;

export const AccountBenefitSection = () => {
  const { refreshDashboard, state } = useDashboardState() as DashboardContextSlice;
  const dashboardProfile = state.profile ?? PROFILE;
  const dashboardStats = state.stats?.length ? state.stats : STATS;
  const passport = dashboardProfile.passport;
  const [profile, setProfile] = useState<EditableProfile>(() => createEditableProfile(dashboardProfile));
  const [draftProfile, setDraftProfile] = useState<EditableProfile>(() => createEditableProfile(dashboardProfile));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isApplyingAvatar, setIsApplyingAvatar] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarEditorSourceUrl, setAvatarEditorSourceUrl] = useState<string | null>(null);
  const [avatarTransform, setAvatarTransform] = useState<AvatarTransform>({ panX: 0, panY: 0, zoom: 1 });
  const [avatarStageSize, setAvatarStageSize] = useState({ height: 320, width: 320 });
  const [avatarImageReady, setAvatarImageReady] = useState(false);
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const avatarImageRef = useRef<HTMLImageElement | null>(null);
  const avatarStageRef = useRef<HTMLDivElement | null>(null);
  const avatarDragRef = useRef<AvatarDragState | null>(null);
  const avatarPreviewSourceUrl = resolveAvatarUrl(avatarPreviewUrl) ?? dashboardProfile.avatarUrl ?? null;
  const profileBadgeInitial = (draftProfile.name.trim().charAt(0) || PROFILE.name.trim().charAt(0) || "J").toUpperCase();

  useEffect(() => {
    if (isEditModalOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [avatarPreviewSourceUrl, isEditModalOpen, modalView]);

  useEffect(() => {
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

  useEffect(() => {
    const nextProfile = createEditableProfile(dashboardProfile);

    if (!isEditModalOpen) {
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
    }
  }, [dashboardProfile, isEditModalOpen]);

  useEffect(() => {
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
        width: Math.max(1, Math.round(rect.width)),
      });
    };

    updateStageSize();

    const observer = new ResizeObserver(updateStageSize);
    observer.observe(avatarStageRef.current);

    return () => observer.disconnect();
  }, [avatarEditorSourceUrl, isEditModalOpen, modalView]);

  useEffect(() => {
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
      setAvatarError("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
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

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("이미지 파일만 선택해 주세요.");
      return;
    }

    if (file.size > AVATAR_FILE_SIZE_LIMIT) {
      setAvatarError("프로필 사진은 5MB 이하로 선택해 주세요.");
      return;
    }

    try {
      const sourceUrl = await readFileAsDataUrl(file);
      setAvatarEditorSourceUrl(sourceUrl);
      setAvatarTransform({ panX: 0, panY: 0, zoom: 1 });
      setAvatarImageReady(false);
      setAvatarError(null);
    } catch {
      setAvatarError("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
    }
  };

  const updateAvatarTransform = (nextTransform: AvatarTransform) => {
    if (!avatarImageRef.current) {
      return;
    }

    setAvatarTransform((current) =>
      getClampedAvatarTransform(
        current,
        avatarImageRef.current as HTMLImageElement,
        avatarStageSize.width,
        avatarStageSize.height,
        nextTransform,
      ),
    );
  };

  const handleAvatarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
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
      startPanY: avatarTransform.panY,
    };
    setIsAvatarDragging(true);
  };

  const handleAvatarPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = avatarDragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId || !avatarImageReady || !avatarImageRef.current) {
      return;
    }

    const nextTransform = {
      panX: dragState.startPanX + (event.clientX - dragState.startClientX),
      panY: dragState.startPanY + (event.clientY - dragState.startClientY),
      zoom: avatarTransform.zoom,
    };

    updateAvatarTransform(nextTransform);
  };

  const handleAvatarPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
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

  const handleAvatarWheel = (event: WheelEvent<HTMLDivElement>) => {
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

      const zoomFactor = Math.exp(-event.deltaY * 0.0012);
      const nextZoom = clampNumber(current.zoom * zoomFactor, metrics.minZoom, metrics.maxZoom);
      const zoomRatio = nextZoom / Math.max(current.zoom, 0.0001);

      return clampAvatarTransform(
        {
          panX: current.panX * zoomRatio,
          panY: current.panY * zoomRatio,
          zoom: nextZoom,
        },
        metrics,
      );
    });
  };

  const handleApplyAvatar = async () => {
    if (!avatarEditorSourceUrl || !avatarImageReady || !avatarImageRef.current) {
      setAvatarError("먼저 이미지를 선택해 주세요.");
      return;
    }

    const metrics = getAvatarMetrics(avatarImageRef.current, avatarStageSize.width, avatarStageSize.height);
    if (!metrics) {
      setAvatarError("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
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
          Accept: "application/json",
        },
        method: "POST",
      });

      if (response.status === 401) {
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      }

      if (!response.ok) {
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
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
      setAvatarError(error instanceof Error ? error.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsApplyingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    const nextProfile = normalizeProfile(draftProfile);
    if (!isEditableProfileValid(nextProfile)) {
      setSaveError("이름, 이메일, 휴대전화 정보를 확인해 주세요.");
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
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (response.status === 401) {
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      }

      if (!response.ok) {
        throw new Error("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }

      const refreshed = await refreshDashboard();
      if (!refreshed) {
        throw new Error("저장은 완료되었지만 최신 정보를 다시 불러오지 못했습니다.");
      }

      setIsEditModalOpen(false);
      setModalView("profile");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled = isSaving || !isEditableProfileValid(draftProfile);
  const avatarMetrics = avatarEditorSourceUrl && avatarImageReady && avatarImageRef.current
    ? getAvatarMetrics(avatarImageRef.current, avatarStageSize.width, avatarStageSize.height)
    : null;
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
    position: "relative" as const,
    touchAction: "none",
    width: "min(100%, 320px)",
  };
  const avatarImageStyle = avatarMetrics
    ? {
        display: "block",
        height: `${avatarImageHeight}px`,
        left: `${avatarImageLeft}px`,
        maxHeight: "none",
        maxWidth: "none",
        objectFit: "contain" as const,
        pointerEvents: "none" as const,
        position: "absolute" as const,
        top: `${avatarImageTop}px`,
        userSelect: "none" as const,
        width: `${avatarImageWidth}px`,
      }
    : {
        display: "block",
        height: "auto",
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain" as const,
        width: "auto",
      };
  const avatarShadeStyle = avatarMetrics
    ? {
        background: "rgba(20, 24, 31, 0.14)",
        inset: 0,
        maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, avatarCircleRadius - 2)}px, black ${Math.max(0, avatarCircleRadius - 1)}px, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, avatarCircleRadius - 2)}px, black ${Math.max(0, avatarCircleRadius - 1)}px, black 100%)`,
        pointerEvents: "none" as const,
        position: "absolute" as const,
      }
    : null;
  const avatarGuideStyle = avatarMetrics
    ? {
        border: "2px dashed rgba(255, 255, 255, 0.94)",
        borderRadius: "50%",
        boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
        height: `${avatarCircleDiameter}px`,
        left: `calc(50% - ${avatarCircleRadius}px)`,
        pointerEvents: "none" as const,
        position: "absolute" as const,
        top: `calc(50% - ${avatarCircleRadius}px)`,
        width: `${avatarCircleDiameter}px`,
      }
    : null;

  return (
    <>
      <section className="meta-section layer-account-benefits">
        <header className="section-header">
          <h2 className="section-title">회원 정보 및 혜택</h2>
          <p className="section-subtitle">개인정보 보호와 맞춤형 혜택 관리</p>
        </header>

        <div className="account-grid bento-grid">
          <SectionCard className="account-info-box meta-glass-theme">
            <div className="box-head flex-header">
              <h3>기본 정보</h3>
              <button className="edit-btn pill-shape" type="button" onClick={openEditModal}>
                내 정보 수정
              </button>
            </div>
            <div className="box-body">
              <div className="info-row">
                <span className="label">이름</span>
                <strong className="value">{profile.name}</strong>
              </div>
              <div className="info-row">
                <span className="label">이메일</span>
                <strong className="value">{profile.email}</strong>
              </div>
              <div className="info-row">
                <span className="label">휴대전화</span>
                <strong className="value">{profile.phone}</strong>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="passport-info-box meta-glass-theme">
            <div className="box-head">
              <h3>패스포트 정보</h3>
            </div>
            <div className="box-body">
              <div
                className="passport-visual soft-radius"
                style={passport ? undefined : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" }}
              >
                <div className="pass-meta">
                  <span className="pass-num">{passport?.number ?? "미등록"}</span>
                  <span className="pass-country">
                    {passport?.issuingCountry ?? "해외 여행 전에 여권 정보를 등록해 주세요."}
                  </span>
                </div>
              </div>
              <div className="info-row">
                <span className="label">{passport ? "여권 만료일" : "등록 상태"}</span>
                <strong className="value">{passport?.expiryDate ?? "등록 필요"}</strong>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="benefit-history-box meta-glass-theme full-width-bento">
            <div className="box-head">
              <h3>나의 포인트 & 쿠폰 내역</h3>
            </div>
            <div className="benefit-tiles">
              {dashboardStats.slice(0, 2).map((stat) => (
                <div className={`benefit-tile tone-${stat.tone} soft-radius`} key={stat.label}>
                  <span className="benefit-label">{stat.label}</span>
                  <strong className="benefit-value" style={getBenefitValueStyle(stat.tone)}>
                    {stat.value}
                  </strong>
                  <button className="history-link" type="button">
                    상세 내역 확인
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>

      {isEditModalOpen ? (
        <div className="meta-modal-overlay" onClick={closeEditModal}>
          <div
            className="meta-modal-content soft-radius meta-glass-theme"
            onClick={(event) => event.stopPropagation()}
            style={{ padding: "36px" }}
          >
            {modalView === "profile" ? (
              <>
                <header className="modal-header">
                  <div className="header-title-wrap">
                    <h3>개인정보 수정</h3>
                  </div>
                </header>

                <div
                  className="profile-link-preview soft-radius"
                  role="button"
                  tabIndex={0}
                  onClick={openAvatarEditor}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openAvatarEditor();
                    }
                  }}
                >
                  <div className="companion-avatar soft-radius is-linked" aria-hidden="true" style={{ position: "relative" }}>
                    <span style={AVATAR_PREVIEW_FRAME_STYLE}>
                      {avatarPreviewSourceUrl ? (
                        <img alt="" className="profile-link-preview-image" src={avatarPreviewSourceUrl} style={AVATAR_PREVIEW_IMAGE_STYLE} />
                      ) : (
                        <span style={AVATAR_PREVIEW_INITIAL_STYLE}>{profileBadgeInitial}</span>
                      )}
                    </span>
                    <i data-lucide="link" className="lucide-link linked-indicator" />
                  </div>
                  <div className="profile-link-copy">
                    <strong>공용 프로필 미리보기</strong>
                    <span>눌러서 이미지 변경</span>
                  </div>
                </div>

                <div
                  className="box-body"
                  style={{ display: "flex", flexDirection: "column", gap: "18px", padding: 0, width: "100%" }}
                >
                  <div
                    className="info-row"
                    style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }}
                  >
                    <span className="label" style={{ fontSize: "15px" }}>이름</span>
                    <div style={{ width: "100%" }}>
                      <input
                        className="id-input"
                        type="text"
                        value={draftProfile.name}
                        onChange={(event) => setDraftProfile((current) => ({ ...current, name: event.target.value }))}
                        style={{ width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }}
                      />
                    </div>
                  </div>
                  <div
                    className="info-row"
                    style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }}
                  >
                    <span className="label" style={{ fontSize: "15px" }}>이메일</span>
                    <div style={{ width: "100%" }}>
                      <input
                        className="id-input"
                        type="email"
                        value={draftProfile.email}
                        onChange={(event) => setDraftProfile((current) => ({ ...current, email: event.target.value }))}
                        style={{ width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }}
                      />
                    </div>
                  </div>
                  <div
                    className="info-row"
                    style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }}
                  >
                    <span className="label" style={{ fontSize: "15px" }}>휴대전화</span>
                    <div style={{ width: "100%" }}>
                      <input
                        className="id-input"
                        type="tel"
                        value={draftProfile.phone}
                        onChange={(event) => setDraftProfile((current) => ({ ...current, phone: event.target.value }))}
                        style={{ width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }}
                      />
                    </div>
                  </div>
                </div>

                {saveError ? (
                  <div className="error-message" role="status" aria-live="polite" style={{ color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
                    {saveError}
                  </div>
                ) : null}

                {isSaving ? (
                  <div aria-live="polite" role="status" style={{ color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
                    저장 중...
                  </div>
                ) : null}

                <footer className="modal-footer" style={{ marginTop: "34px", gap: "14px" }}>
                  <button className="cancel-btn pill-shape" type="button" onClick={closeEditModal} style={{ padding: "18px 0", fontSize: "15px" }}>
                    취소
                  </button>
                  <button
                    className="save-btn pill-shape"
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaveDisabled}
                    style={{ padding: "18px 0", fontSize: "15px" }}
                  >
                    저장
                  </button>
                </footer>
              </>
            ) : (
              <>
                <header className="modal-header">
                  <div className="header-title-wrap">
                    <h3>프로필 사진 편집</h3>
                  </div>
                </header>

                <input ref={avatarInputRef} accept="image/*" hidden type="file" onChange={handleAvatarFileChange} />

                <div className="profile-avatar-editor soft-radius">
                  <div className="profile-avatar-editor-preview">
                    <div
                      ref={avatarStageRef}
                      onPointerCancel={handleAvatarPointerUp}
                      onPointerDown={handleAvatarPointerDown}
                      onPointerMove={handleAvatarPointerMove}
                      onPointerUp={handleAvatarPointerUp}
                      onWheel={handleAvatarWheel}
                      style={{
                        ...avatarStageStyle,
                        cursor: avatarEditorSourceUrl ? (isAvatarDragging ? "grabbing" : "grab") : "default",
                      }}
                    >
                      {avatarEditorSourceUrl ? (
                        <>
                          <img
                            ref={avatarImageRef}
                            alt="프로필 사진 편집 미리보기"
                            draggable={false}
                            src={avatarEditorSourceUrl}
                            style={avatarImageStyle}
                            onLoad={handleAvatarImageLoad}
                          />
                          {avatarShadeStyle ? <div style={avatarShadeStyle} /> : null}
                          {avatarGuideStyle ? <div style={avatarGuideStyle} /> : null}
                        </>
                      ) : (
                        <button
                          className="profile-avatar-editor-empty"
                          type="button"
                          onClick={openAvatarFilePicker}
                        >
                          사진 선택
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {avatarEditorSourceUrl ? (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "-4px" }}>
                    <button
                      type="button"
                      onClick={openAvatarFilePicker}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#6b7280",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "6px 10px",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      다른 사진 선택
                    </button>
                  </div>
                ) : null}

                {avatarError ? (
                  <div className="error-message" role="status" aria-live="polite" style={{ color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
                    {avatarError}
                  </div>
                ) : null}

                <footer className="modal-footer" style={{ marginTop: "10px", gap: "14px" }}>
                  <button
                    className="cancel-btn pill-shape"
                    type="button"
                    onClick={() => {
                      setModalView("profile");
                      setAvatarError(null);
                    }}
                    style={{ padding: "18px 0", fontSize: "15px" }}
                  >
                    이전
                  </button>
                  <button
                    className="save-btn pill-shape"
                    type="button"
                    onClick={handleApplyAvatar}
                    disabled={!avatarEditorSourceUrl || !avatarImageReady || isApplyingAvatar}
                    style={{ padding: "18px 0", fontSize: "15px" }}
                  >
                    {isApplyingAvatar ? "적용 중..." : "적용"}
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
