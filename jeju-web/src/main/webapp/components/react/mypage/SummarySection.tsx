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

const resolveCanonicalMembershipTier = (membership?: string) => {
  const normalized = membership?.trim().toLowerCase() ?? "";

  if (normalized.includes("diamond") || normalized.includes("다이아")) {
    return "diamond";
  }

  if (normalized.includes("platinum") || normalized.includes("플래티넘")) {
    return "platinum";
  }

  if (normalized.includes("silver") || normalized.includes("실버")) {
    return "silver";
  }

  if (normalized.includes("gold") || normalized.includes("골드")) {
    return "gold";
  }

  return null;
};

const getMembershipTone = (membership?: string) => {
  return resolveCanonicalMembershipTier(membership) ?? "neutral";
};

const formatMembershipLabel = (membership?: string) => {
  switch (resolveCanonicalMembershipTier(membership)) {
    case "diamond":
      return "DIAMOND";
    case "platinum":
      return "PLATINUM";
    case "gold":
      return "GOLD";
    case "silver":
      return "SILVER";
    default:
      return membership?.trim().toUpperCase() || "MEMBER";
  }
};

const getStatIconName = (tone: StatItem["tone"]) => {
  switch (tone) {
    case "point":
      return "coins";
    case "coupon":
      return "ticket-percent";
    case "air":
      return "briefcase-business";
    case "wallet":
      return "wallet";
    case "stay":
      return "hotel";
    case "rent":
      return "car-front";
    case "voucher":
      return "ticket";
    default:
      return "circle";
  }
};

const scrollToSectionTitle = (sectionSelector: string) => {
  const section = document.querySelector<HTMLElement>(sectionSelector);
  if (!section) {
    return;
  }

  const targetHeading = section.querySelector<HTMLElement>(".section-title") ?? section;
  const shellHeader =
    document.querySelector<HTMLElement>("#jeju-page-shell-header .header") ??
    document.querySelector<HTMLElement>(".header");
  const headerOffset = shellHeader?.getBoundingClientRect().height ?? 72;
  const top = window.scrollY + targetHeading.getBoundingClientRect().top - headerOffset - 24;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
};

export const SummarySection = () => {
  const { state } = useDashboardState() as { state: DashboardStateSlice };
  const profile = state.profile ?? PROFILE;
  const stats = state.stats?.length ? state.stats : STATS;
  const membershipLabel = profile.memberships?.[0] ?? PROFILE.memberships[0];
  const membershipDisplaySource = profile.tier ?? membershipLabel;
  const membershipTone = getMembershipTone(membershipDisplaySource);
  const membershipDisplayLabel = formatMembershipLabel(membershipDisplaySource);

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
                <span>{membershipDisplayLabel}</span>
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
                <button className="nav-btn pill-shape" type="button" onClick={() => scrollToSectionTitle(".layer-full-management")}>
                  <i data-lucide="calendar-check" className="lucide-calendar-check" /> 예약 현황
                </button>
                <button className="nav-btn pill-shape" type="button" onClick={() => scrollToSectionTitle(".layer-itinerary")}>
                  <i data-lucide="map" className="lucide-map" /> 여행 일정
                </button>
                <button className="nav-btn pill-shape" type="button" onClick={() => scrollToSectionTitle(".layer-account-benefits")}>
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
              <i data-lucide={getStatIconName(stat.tone)} className={`lucide-${getStatIconName(stat.tone)}`} />
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
