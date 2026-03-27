import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { PROFILE, STATS } from "./data";
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

const AVATAR_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const AVATAR_MIN_ZOOM = 1;
const AVATAR_MAX_ZOOM = 2.4;
const AVATAR_POSITION_LIMIT = 140;
const AVATAR_RENDER_SIZE = 512;

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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("이미지 데이터를 읽지 못했다"));
    };

    reader.onerror = () => reject(new Error("이미지 데이터를 읽지 못했다"));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했다"));
    image.src = src;
  });

const renderEditedAvatar = async ({
  offsetX,
  offsetY,
  sourceUrl,
  zoom,
}: {
  offsetX: number;
  offsetY: number;
  sourceUrl: string;
  zoom: number;
}) => {
  const image = await loadImage(sourceUrl);
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_RENDER_SIZE;
  canvas.height = AVATAR_RENDER_SIZE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했다");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, AVATAR_RENDER_SIZE, AVATAR_RENDER_SIZE);

  const coverScale = Math.max(AVATAR_RENDER_SIZE / image.width, AVATAR_RENDER_SIZE / image.height);
  const scale = coverScale * zoom;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = (AVATAR_RENDER_SIZE - drawWidth) / 2 + offsetX;
  const drawY = (AVATAR_RENDER_SIZE - drawHeight) / 2 + offsetY;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  return canvas.toDataURL("image/png");
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
  const [avatarEditorZoom, setAvatarEditorZoom] = useState(AVATAR_MIN_ZOOM);
  const [avatarEditorOffsetX, setAvatarEditorOffsetX] = useState(0);
  const [avatarEditorOffsetY, setAvatarEditorOffsetY] = useState(0);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const profileBadgeInitial = (draftProfile.name.trim().charAt(0) || PROFILE.name.trim().charAt(0) || "J").toUpperCase();

  useEffect(() => {
    if (isEditModalOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [avatarPreviewUrl, isEditModalOpen, modalView]);

  useEffect(() => {
    const nextProfile = createEditableProfile(dashboardProfile);

    if (!isEditModalOpen) {
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
    }
  }, [dashboardProfile, isEditModalOpen]);

  const resetAvatarEditor = () => {
    setAvatarEditorSourceUrl(avatarPreviewUrl);
    setAvatarEditorZoom(AVATAR_MIN_ZOOM);
    setAvatarEditorOffsetX(0);
    setAvatarEditorOffsetY(0);
    setAvatarError(null);
    setIsApplyingAvatar(false);
  };

  const openEditModal = () => {
    setDraftProfile(profile);
    setSaveError(null);
    setModalView("profile");
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

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("이미지 파일만 넣어라");
      return;
    }

    if (file.size > AVATAR_FILE_SIZE_LIMIT) {
      setAvatarError("프로필 사진은 5MB 이하로 맞춰라");
      return;
    }

    try {
      const sourceUrl = await readFileAsDataUrl(file);
      setAvatarEditorSourceUrl(sourceUrl);
      setAvatarEditorZoom(AVATAR_MIN_ZOOM);
      setAvatarEditorOffsetX(0);
      setAvatarEditorOffsetY(0);
      setAvatarError(null);
    } catch {
      setAvatarError("이미지를 읽지 못했다. 다른 파일로 다시 해라");
    }
  };

  const handleApplyAvatar = async () => {
    if (!avatarEditorSourceUrl) {
      setAvatarError("먼저 이미지를 골라라");
      return;
    }

    setIsApplyingAvatar(true);
    setAvatarError(null);

    try {
      const nextAvatarUrl = await renderEditedAvatar({
        offsetX: avatarEditorOffsetX,
        offsetY: avatarEditorOffsetY,
        sourceUrl: avatarEditorSourceUrl,
        zoom: avatarEditorZoom,
      });

      setAvatarPreviewUrl(nextAvatarUrl);
      setModalView("profile");
    } catch {
      setAvatarError("프로필 사진 적용에 실패했다");
    } finally {
      setIsApplyingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    const nextProfile = normalizeProfile(draftProfile);
    if (!isEditableProfileValid(nextProfile)) {
      setSaveError("이름, 이메일, 전화번호를 확인해라");
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
        throw new Error("로그인이 만료됐다. 다시 로그인해라");
      }

      if (!response.ok) {
        throw new Error("프로필 저장에 실패했다. 잠시 후 다시 시도해라");
      }

      const refreshed = await refreshDashboard();
      if (!refreshed) {
        throw new Error("저장은 됐지만 최신 정보를 다시 불러오지 못했다");
      }

      setIsEditModalOpen(false);
      setModalView("profile");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "프로필 저장에 실패했다. 잠시 후 다시 시도해라");
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled = isSaving || !isEditableProfileValid(draftProfile);

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
                    {passport?.issuingCountry ?? "해외 여행 전에 여권 정보를 등록해라"}
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
                  <div className="companion-avatar soft-radius is-linked" aria-hidden="true">
                    {avatarPreviewUrl ? <img alt="" className="profile-link-preview-image" src={avatarPreviewUrl} /> : profileBadgeInitial}
                    <i data-lucide="link" className="lucide-link linked-indicator" />
                  </div>
                  <div className="profile-link-copy">
                    <strong>연동 프로필 배지</strong>
                    <span>동행자 UI와 같은 아바타·링크 배지를 재사용</span>
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
                    <div className="profile-avatar-editor-stage">
                      {avatarEditorSourceUrl ? (
                        <img
                          alt="프로필 사진 미리보기"
                          className="profile-avatar-editor-image"
                          src={avatarEditorSourceUrl}
                          style={{
                            transform: `translate(${avatarEditorOffsetX}px, ${avatarEditorOffsetY}px) scale(${avatarEditorZoom})`,
                          }}
                        />
                      ) : (
                        <div className="profile-avatar-editor-empty">
                          이미지를 업로드해라
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="profile-avatar-editor-controls">
                    <button className="add-btn pill-shape" type="button" onClick={() => avatarInputRef.current?.click()}>
                      이미지 업로드
                    </button>

                    <label className="profile-avatar-editor-field">
                      <span>크기 조절</span>
                      <input
                        max={AVATAR_MAX_ZOOM}
                        min={AVATAR_MIN_ZOOM}
                        step={0.01}
                        type="range"
                        value={avatarEditorZoom}
                        disabled={!avatarEditorSourceUrl}
                        onChange={(event) => setAvatarEditorZoom(Number(event.target.value))}
                      />
                    </label>

                    <label className="profile-avatar-editor-field">
                      <span>가로 위치</span>
                      <input
                        max={AVATAR_POSITION_LIMIT}
                        min={-AVATAR_POSITION_LIMIT}
                        step={1}
                        type="range"
                        value={avatarEditorOffsetX}
                        disabled={!avatarEditorSourceUrl}
                        onChange={(event) =>
                          setAvatarEditorOffsetX(clamp(Number(event.target.value), -AVATAR_POSITION_LIMIT, AVATAR_POSITION_LIMIT))
                        }
                      />
                    </label>

                    <label className="profile-avatar-editor-field">
                      <span>세로 위치</span>
                      <input
                        max={AVATAR_POSITION_LIMIT}
                        min={-AVATAR_POSITION_LIMIT}
                        step={1}
                        type="range"
                        value={avatarEditorOffsetY}
                        disabled={!avatarEditorSourceUrl}
                        onChange={(event) =>
                          setAvatarEditorOffsetY(clamp(Number(event.target.value), -AVATAR_POSITION_LIMIT, AVATAR_POSITION_LIMIT))
                        }
                      />
                    </label>
                  </div>
                </div>

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
                    disabled={!avatarEditorSourceUrl || isApplyingAvatar}
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
