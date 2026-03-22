import { useEffect, useState } from "react";
import { PROFILE, STATS } from "./data";
import { SectionCard } from "./SectionCard";
import { useDashboardState } from "./state";
import type { UserProfile } from "./types";

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
type DashboardDispatch = (action: { type: string; payload?: unknown }) => void;

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

export const AccountBenefitSection = () => {
  const { dispatch, state } = useDashboardState() as {
    dispatch: DashboardDispatch;
    state: DashboardStateSlice;
  };
  const dashboardProfile = state.profile ?? PROFILE;
  const dashboardStats = state.stats?.length ? state.stats : STATS;
  const [profile, setProfile] = useState<EditableProfile>(() => createEditableProfile(dashboardProfile));
  const [draftProfile, setDraftProfile] = useState<EditableProfile>(() => createEditableProfile(dashboardProfile));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const profileBadgeInitial = (draftProfile.name.trim().charAt(0) || PROFILE.name.trim().charAt(0) || "J").toUpperCase();

  useEffect(() => {
    if (isEditModalOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [isEditModalOpen]);

  useEffect(() => {
    const nextProfile = createEditableProfile(dashboardProfile);

    if (!isEditModalOpen) {
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
    }
  }, [dashboardProfile, isEditModalOpen]);

  const openEditModal = () => {
    setDraftProfile(profile);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setDraftProfile(profile);
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = () => {
    const nextProfile = normalizeProfile(draftProfile);
    if (!isEditableProfileValid(nextProfile)) {
      return;
    }

    setProfile(nextProfile);
    setDraftProfile(nextProfile);
    dispatch({ type: "PATCH_PROFILE", payload: nextProfile });
    setIsEditModalOpen(false);
  };

  const isSaveDisabled = !isEditableProfileValid(draftProfile);

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

          {dashboardProfile.passport ? (
            <SectionCard className="passport-info-box meta-glass-theme">
              <div className="box-head">
                <h3>패스포트 정보</h3>
              </div>
              <div className="box-body">
                <div className="passport-visual soft-radius">
                  <i className="lucide-passport" />
                  <div className="pass-meta">
                    <span className="pass-num">{dashboardProfile.passport.number}</span>
                    <span className="pass-country">{dashboardProfile.passport.issuingCountry}</span>
                  </div>
                </div>
                <div className="info-row">
                  <span className="label">여권 만료일</span>
                  <strong className="value">{dashboardProfile.passport.expiryDate}</strong>
                </div>
              </div>
            </SectionCard>
          ) : null}

          <SectionCard className="benefit-history-box meta-glass-theme full-width-bento">
            <div className="box-head">
              <h3>나의 포인트 & 쿠폰 내역</h3>
            </div>
            <div className="benefit-tiles">
              {dashboardStats.slice(0, 2).map((stat) => (
                <div className={`benefit-tile tone-${stat.tone} soft-radius`} key={stat.label}>
                  <span className="benefit-label">{stat.label}</span>
                  <strong className="benefit-value">{stat.value}</strong>
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
          <div className="meta-modal-content soft-radius meta-glass-theme" onClick={(event) => event.stopPropagation()}>
            <header className="modal-header">
              <div className="header-title-wrap">
                <h3>개인정보 수정</h3>
              </div>
              <button className="close-btn" type="button" aria-label="개인정보 수정 닫기" onClick={closeEditModal}>
                ×
              </button>
            </header>

            <p className="modal-desc">마이페이지에 보이는 이름, 이메일, 휴대전화만 바로 수정할 수 있다.</p>

            <div className="profile-link-preview soft-radius">
              <div className="companion-avatar soft-radius is-linked" aria-hidden="true">
                {profileBadgeInitial}
                <i data-lucide="link" className="lucide-link linked-indicator" />
              </div>
              <div className="profile-link-copy">
                <strong>연동 프로필 배지</strong>
                <span>동행자 UI와 같은 아바타·링크 배지를 재사용</span>
              </div>
            </div>

            <div className="box-body">
              <div className="info-row">
                <span className="label">이름</span>
                <div style={{ flex: "0 1 280px", width: "100%" }}>
                  <input
                    className="id-input"
                    type="text"
                    value={draftProfile.name}
                    onChange={(event) => setDraftProfile((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>
              </div>
              <div className="info-row">
                <span className="label">이메일</span>
                <div style={{ flex: "0 1 280px", width: "100%" }}>
                  <input
                    className="id-input"
                    type="email"
                    value={draftProfile.email}
                    onChange={(event) => setDraftProfile((current) => ({ ...current, email: event.target.value }))}
                  />
                </div>
              </div>
              <div className="info-row">
                <span className="label">휴대전화</span>
                <div style={{ flex: "0 1 280px", width: "100%" }}>
                  <input
                    className="id-input"
                    type="tel"
                    value={draftProfile.phone}
                    onChange={(event) => setDraftProfile((current) => ({ ...current, phone: event.target.value }))}
                  />
                </div>
              </div>
            </div>

            <footer className="modal-footer">
              <button className="cancel-btn pill-shape" type="button" onClick={closeEditModal}>
                취소
              </button>
              <button className="save-btn pill-shape" type="button" onClick={handleSaveProfile} disabled={isSaveDisabled}>
                저장
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
};
