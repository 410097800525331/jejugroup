import { useCallback, useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { PROFILE, STATS, resolveAvatarUrl } from "./data";
import { CompanionInviteModal } from "./CompanionInviteModal";
import { SectionCard } from "./SectionCard";
import { useDashboardState } from "./state";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { API_BASE_URL } from "../../../core/modules/config/api_config.module.js";
import type { CompanionInviteAlertEntrypointProps, StatItem, UserProfile } from "./types";

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

type InviteRecord = {
  direction?: string;
  status?: string;
};

const INVITE_LIST_ENDPOINT = "/api/mypage/companion-invites";

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const toText = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

const buildInviteListUrl = () => {
  const baseUrl = API_BASE_URL?.trim();
  const path = INVITE_LIST_ENDPOINT.startsWith("/") ? INVITE_LIST_ENDPOINT : `/${INVITE_LIST_ENDPOINT}`;
  const url = baseUrl ? new URL(path, baseUrl) : new URL(path, window.location.origin);

  return baseUrl ? url.toString() : `${url.pathname}${url.search}`;
};

const collectInviteEntries = (payload: unknown): InviteRecord[] => {
  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [payload.invites, payload.items, payload.results, payload.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord).map((item) => ({
        direction: toText(item.direction),
        status: toText(item.status ?? item.effectiveStatus),
      }));
    }
  }

  return [];
};

const normalizeInviteState = (value: unknown): string | undefined => {
  const normalized = toText(value)?.toLowerCase().replace(/[\s-]+/g, "_");
  if (!normalized) {
    return undefined;
  }

  if (normalized === "received") {
    return "received";
  }

  return normalized;
};

export const SummarySection = ({
  onOpenCompanionInvites,
  pendingInviteCount: pendingInviteCountProp,
}: CompanionInviteAlertEntrypointProps = {}) => {
  const { state } = useDashboardState() as { state: DashboardStateSlice };
  const profile = state.profile ?? PROFILE;
  const stats = state.stats?.length ? state.stats : STATS;
  const membershipLabel = profile.memberships?.[0] ?? PROFILE.memberships[0];
  const membershipDisplaySource = profile.tier ?? membershipLabel;
  const membershipTone = getMembershipTone(membershipDisplaySource);
  const membershipDisplayLabel = formatMembershipLabel(membershipDisplaySource);
  const profileDisplayName = profile.nickname?.trim() || profile.name.trim();
  const [fetchedPendingInviteCount, setFetchedPendingInviteCount] = useState<number>(0);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const inviteCount = pendingInviteCountProp ?? fetchedPendingInviteCount;
  const hasPendingInvites = inviteCount > 0;
  const avatarUrl =
    resolveAvatarUrl(profile.avatarUrl) ??
    `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}&backgroundColor=f8f9fa`;

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const loadPendingInviteCount = useCallback(async () => {
    if (typeof pendingInviteCountProp === "number") {
      setFetchedPendingInviteCount(0);
      return;
    }

    try {
      const response = await fetch(buildInviteListUrl(), {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        setFetchedPendingInviteCount(0);
        return;
      }

      const payload = await response.json().catch(() => null);
      const pendingCount = collectInviteEntries(payload).filter((invite) => {
        const status = normalizeInviteState(invite.status);
        const direction = normalizeInviteState(invite.direction);
        return status === "pending" && direction === "received";
      }).length;

      setFetchedPendingInviteCount(pendingCount);
    } catch {
      setFetchedPendingInviteCount(0);
    }
  }, [pendingInviteCountProp]);

  useEffect(() => {
    let active = true;
    void loadPendingInviteCount().finally(() => {
      if (!active && typeof pendingInviteCountProp !== "number") {
        setFetchedPendingInviteCount(0);
      }
    });

    return () => {
      active = false;
    };
  }, [loadPendingInviteCount, pendingInviteCountProp]);

  const handleOpenCompanionInvites = () => {
    if (onOpenCompanionInvites) {
      onOpenCompanionInvites();
    }

    setIsInviteModalOpen(true);
  };

  const handleInviteCardKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenCompanionInvites();
    }
  };

  const summaryCards = useMemo(() => stats, [stats]);

  return (
    <section className="meta-section layer-hero dashboard-summary-grid">
      <SectionCard className="hero-glass-container profile-main-card">
        <div className="profile-layout-flex">
          <div className="profile-left-area">
            <div className="profile-avatar-wrap">
              <img
                alt="profile"
                className="profile-avatar"
                src={avatarUrl}
              />
              <div className={`membership-grade-chip soft-radius ${membershipTone}`}>
                <span>{membershipDisplayLabel}</span>
              </div>
            </div>
          </div>
          <div className="profile-right-area">
            <div className="profile-info">
              <h1 className="profile-name">
                <strong className="highlight">{profileDisplayName}</strong> 님 어서오세요!
              </h1>
              <p className="profile-welcome-msg">{profile.bio?.trim() ?? ""}</p>
              
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
        {summaryCards.map((stat) => {
          if (stat.tone === "air") {
            return (
              <div
                aria-label={`동행자 초대 알림${hasPendingInvites ? `, 대기 ${inviteCount}건` : ""}`}
                className={`bento-box soft-radius stat-card meta-glass-theme tone-air`}
                key={stat.label}
                onClick={handleOpenCompanionInvites}
                onKeyDown={handleInviteCardKeyDown}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                <div className="stat-icon-box" style={{ position: "relative" }}>
                  <i data-lucide="bell" className="lucide-bell" />
                  {hasPendingInvites ? (
                    <span
                      aria-label={`대기 중인 초대 ${inviteCount}건`}
                      style={{
                        alignItems: "center",
                        background: "#ff5000",
                        borderRadius: "999px",
                        color: "#fff",
                        display: "inline-flex",
                        fontSize: "11px",
                        fontWeight: 800,
                        height: "20px",
                        justifyContent: "center",
                        minWidth: "20px",
                        padding: "0 6px",
                        position: "absolute",
                        right: "-8px",
                        top: "-8px",
                        boxShadow: "0 8px 16px rgba(255, 80, 0, 0.24)",
                      }}
                    >
                      {inviteCount > 99 ? "99+" : inviteCount}
                    </span>
                  ) : null}
                </div>

                <div className="stat-content">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className="stat-label">동행자 초대 알림</span>
                    {hasPendingInvites ? (
                      <span
                        className="pill-shape"
                        style={{
                          background: "rgba(255, 80, 0, 0.1)",
                          border: "1px solid rgba(255, 80, 0, 0.22)",
                          color: "#ff5000",
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "4px 10px",
                        }}
                      >
                        {inviteCount}건 대기
                      </span>
                    ) : (
                      <span
                        className="pill-shape"
                        style={{
                          background: "rgba(148, 163, 184, 0.12)",
                          border: "1px solid rgba(148, 163, 184, 0.18)",
                          color: "#667085",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                        }}
                      >
                        대기 없음
                      </span>
                    )}
                  </div>
                  <strong className="stat-value">{hasPendingInvites ? `새 초대 ${inviteCount}건` : "새 초대 없음"}</strong>
                </div>
              </div>
            );
          }

          return (
            <SectionCard className={`stat-card meta-glass-theme tone-${stat.tone}`} key={stat.label}>
              <div className="stat-icon-box">
                <i data-lucide={getStatIconName(stat.tone)} className={`lucide-${getStatIconName(stat.tone)}`} />
              </div>

            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </div>
          </SectionCard>
          );
        })}
      </div>

      <CompanionInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onRefreshPendingCount={loadPendingInviteCount}
      />
    </section>
  );
};
