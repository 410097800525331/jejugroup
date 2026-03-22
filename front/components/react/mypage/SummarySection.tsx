import { useEffect } from "react";
import { PROFILE, STATS } from "./data";
import { SectionCard } from "./SectionCard";
import { useDashboardState } from "./state";
import type { StatItem, UserProfile } from "./types";

declare global {
  interface Window {
    lucide?: {
      createIcons: () => void;
    };
  }
}

type DashboardStateSlice = {
  profile?: UserProfile;
  stats?: StatItem[];
};

const getMembershipTone = (membership?: string) => {
  const normalized = membership?.toLowerCase() ?? "";

  if (normalized.includes("diamond")) {
    return "diamond";
  }

  if (normalized.includes("platinum")) {
    return "platinum";
  }

  if (normalized.includes("silver")) {
    return "silver";
  }

  if (normalized.includes("gold")) {
    return "gold";
  }

  return "neutral";
};

export const SummarySection = () => {
  const { state } = useDashboardState() as { state: DashboardStateSlice };
  const profile = state.profile ?? PROFILE;
  const stats = state.stats?.length ? state.stats : STATS;
  const membershipLabel = profile.memberships?.[0] ?? PROFILE.memberships[0];
  const membershipTone = getMembershipTone(membershipLabel);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <section className="meta-section layer-hero dashboard-summary-grid">
      <SectionCard className="hero-glass-container profile-main-card">
        <div className="profile-layout-flex">
          <div className="profile-left-area">
            <div className="profile-avatar-wrap">
              <img
                alt="profile"
                className="profile-avatar"
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}&backgroundColor=f8f9fa`}
              />
              <div className={`membership-grade-chip soft-radius ${membershipTone}`}>
                <span>{membershipLabel}</span>
              </div>
            </div>
          </div>
          <div className="profile-right-area">
            <div className="profile-info">
              <h1 className="profile-name">
                <strong className="highlight">{profile.name}</strong> 님 어서오세요!
              </h1>
              <p className="profile-welcome-msg">제주에서 보냈던 소중한 시간들을 다시 이어보세요.</p>
              
              <div className="profile-quick-nav">
                <button className="nav-btn pill-shape" onClick={() => document.querySelector('.layer-full-management')?.scrollIntoView({ behavior: 'smooth' })}>
                  <i data-lucide="calendar-check" className="lucide-calendar-check" /> 예약 현황
                </button>
                <button className="nav-btn pill-shape" onClick={() => document.querySelector('.layer-itinerary')?.scrollIntoView({ behavior: 'smooth' })}>
                  <i data-lucide="map" className="lucide-map" /> 여행 일정
                </button>
                <button className="nav-btn pill-shape" onClick={() => document.querySelector('.layer-account-benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                  <i data-lucide="user-cog" className="lucide-user-cog" /> 정보 및 혜택
                </button>
              </div>

            </div>
          </div>
        </div>
      </SectionCard>


      <div className="summary-stats-column">
        {stats.map((stat) => (
          <SectionCard className={`stat-card meta-glass-theme tone-${stat.tone}`} key={stat.label}>
            <div className="stat-icon-box">
              {stat.tone === "point" && <i data-lucide="coins" className="lucide-coins" />}
              {stat.tone === "coupon" && <i data-lucide="ticket-percent" className="lucide-ticket-percent" />}
              {stat.tone === "air" && <i data-lucide="briefcase-business" className="lucide-briefcase-business" />}
            </div>


            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </div>
          </SectionCard>

        ))}
      </div>
    </section>
  );
};
