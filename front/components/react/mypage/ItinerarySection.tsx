import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ItineraryActivity, ItineraryCompanion, ItineraryItem, TravelEventStatus } from "./types";
import { SectionCard } from "./SectionCard";
import { CompanionManageModal } from "./CompanionManageModal";
import { resolveAvatarUrl } from "./data";
import { useDashboardState } from "./state";
import { patchAccountDashboardMock } from "./mockAccountDashboardStore";

const getActivityStatusMeta = (status?: TravelEventStatus) => {
  switch (status) {
    case "used":
      return {
        icon: "check-check",
        label: "이용 완료",
        style: undefined,
      };
    case "cancelled":
      return {
        icon: "circle-x",
        label: "취소됨",
        style: {
          background: "rgba(239, 68, 68, 0.08)",
          borderColor: "rgba(239, 68, 68, 0.18)",
        },
      };
    case "missed":
      return {
        icon: "circle-x",
        label: "미사용",
        style: {
          background: "rgba(239, 68, 68, 0.08)",
          borderColor: "rgba(239, 68, 68, 0.18)",
        },
      };
    default:
      return {
        icon: "clock-3",
        label: "이용 예정",
        style: undefined,
      };
  }
};

const ItineraryCompanionAvatar = ({ companion }: { companion: ItineraryCompanion }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarUrl = resolveAvatarUrl(companion.avatarUrl);
  const showImage = Boolean(avatarUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  return (
    <div
      className={`companion-avatar soft-radius ${companion.isMember ? "is-linked" : ""}`}
      title={companion.name + (companion.isMember ? " (연동됨)" : "")}
    >
      {showImage ? (
        <img
          alt=""
          src={avatarUrl}
          onError={() => setImageFailed(true)}
          style={{
            borderRadius: "inherit",
            height: "100%",
            inset: 0,
            objectFit: "cover",
            pointerEvents: "none",
            position: "absolute",
            width: "100%",
          }}
        />
      ) : (
        <span style={{ position: "relative", zIndex: 1 }}>{companion.name.charAt(0)}</span>
      )}
      {companion.isMember && <i data-lucide="link" className="lucide-link linked-indicator" />}
    </div>
  );
};

export const ItinerarySection = () => {
  const { dispatch, state } = useDashboardState();
  const itinerary = state.itinerary ?? [];
  const displayItinerary =
    itinerary.length > 0
      ? itinerary
      : [
          {
            activities: [],
            companions: [],
            date: "일정 미정",
            googleMapUrl: "",
            id: "empty-itinerary",
            time: "시간 미정",
            title: "여행 일정 준비 중",
          },
        ];
  const linkedCompanions = state.linkedCompanions ?? [];
  const profile = state.profile;
  const [isExpanded, setIsExpanded] = useState(false);
  const [manageModalDayId, setManageModalDayId] = useState<string | null>(null);
  const dayBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [dayBlockHeights, setDayBlockHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [isExpanded, itinerary, linkedCompanions]);

  useLayoutEffect(() => {
    const nextHeights = displayItinerary.reduce<Record<string, number>>((acc, day) => {
      acc[day.id] = dayBlockRefs.current[day.id]?.scrollHeight ?? 0;
      return acc;
    }, {});

    setDayBlockHeights((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(nextHeights);

      if (prevKeys.length === nextKeys.length && nextKeys.every((key) => prev[key] === nextHeights[key])) {
        return prev;
      }

      return nextHeights;
    });
  }, [displayItinerary, isExpanded]);

  const handleSaveCompanions = (newCompanions: ItineraryCompanion[]) => {
    dispatch({ type: "SET_LINKED_COMPANIONS", payload: newCompanions });
    patchAccountDashboardMock(
      {
        id: profile.id,
        profile: {
          email: profile.email,
          id: profile.id,
          name: profile.name,
        },
      },
      {
        linkedCompanions: newCompanions,
      },
    );
    setManageModalDayId(null);
  };

  return (
    <section className="meta-section layer-itinerary">
      <header className="section-header">
        <h2 className="section-title">나의 여행지 일정</h2>
        <p className="section-subtitle">동행자와 함께하는 상세 활동 계획</p>
      </header>

      <div className={`itinerary-timeline-wrap ${isExpanded ? "is-expanded" : ""}`}>
        {displayItinerary.map((day: ItineraryItem, index) => {
          const shouldAlwaysShow = index < 2;
          const isVisible = shouldAlwaysShow || isExpanded;
          const measuredHeight = dayBlockHeights[day.id] ?? 720;
          const isEmptyDay = day.id === "empty-itinerary";
          const displayCompanions = linkedCompanions.length > 0 ? linkedCompanions : day.companions;
          const visibleCompanions = displayCompanions.slice(0, 4);
          const hiddenCompanionCount = displayCompanions.length > 4 ? displayCompanions.length - 4 : 0;
          const companionCountLabel = hiddenCompanionCount > 0 ? `외 ${hiddenCompanionCount}명` : `총 ${displayCompanions.length}명`;

          return (
            <div
              className="itinerary-day-block"
              key={day.id}
              ref={(node) => {
                dayBlockRefs.current[day.id] = node;
              }}
              aria-hidden={!isVisible}
              style={
                shouldAlwaysShow
                  ? undefined
                  : {
                      overflow: "hidden",
                      maxHeight: isVisible ? `${measuredHeight}px` : "0px",
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(-18px)",
                      marginBottom: isVisible ? "40px" : "0px",
                      pointerEvents: isVisible ? "auto" : "none",
                      transition:
                        "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }
              }
            >
              <div className="day-side-info">
                <span className="day-date">{day.date}</span>
                <span className="day-time">{day.time}</span>
                <div className="companions-card-wrap soft-radius">
                  <div className="comp-head">
                    <i data-lucide="users" className="lucide-users" />
                    <span className="small-label">함께하는 동행자</span>
                  </div>
                  <div className="avatar-stack">
                    {visibleCompanions.map((comp: ItineraryCompanion) => (
                      <ItineraryCompanionAvatar companion={comp} key={comp.id} />
                    ))}
                    <span className="comp-count-label">{companionCountLabel}</span>
                  </div>
                  <button className="link-action-btn pill-shape" type="button" onClick={() => setManageModalDayId(day.id)}>
                    <i data-lucide="user-plus" className="lucide-user-plus" />
                    동행자 연동/관리
                  </button>
                </div>
              </div>

              <SectionCard className="itinerary-content-card meta-glass-theme">
                <div className="iti-header flex-header">
                  <h3 className="iti-title">{day.title}</h3>
                  {day.googleMapUrl ? (
                    <a className="map-link-btn pill-shape" href={day.googleMapUrl} rel="noopener noreferrer" target="_blank">
                      <i data-lucide="map-pin" className="lucide-map-pin" />
                      구글 맵 보기
                    </a>
                  ) : (
                    <span className="map-link-btn pill-shape is-disabled" aria-disabled="true">
                      <i data-lucide="map-pin" className="lucide-map-pin" />
                      구글 맵 준비 중
                    </span>
                  )}
                </div>

                <div className="activity-checklist-wrap">
                  <p className="small-label">활동(Activity) 체크리스트</p>
                  <ul className={`checklist-list ${day.activities.length === 0 ? "is-empty" : ""}`}>
                    {day.activities.map((activity: ItineraryActivity) => {
                      const statusMeta = getActivityStatusMeta(activity.status);
                      const isUsed = activity.status === "used";
                      const isFailed = activity.status === "cancelled" || activity.status === "missed";

                      return (
                        <li
                          className={`checklist-item ${isUsed ? "checked" : ""} soft-radius`}
                          key={activity.id}
                          style={statusMeta.style}
                        >
                          <div className="checkbox-control" style={{ alignItems: "flex-start" }}>
                            <i
                              data-lucide={statusMeta.icon}
                              style={{
                                color: isUsed ? "var(--brand-rent)" : isFailed ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                              <span className="check-text">{activity.label}</span>
                              <span
                                style={{
                                  color: isFailed ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                }}
                              >
                                {(activity.ownerName ?? "본인") + " · " + statusMeta.label}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {isEmptyDay ? <p className="checklist-empty-caption">등록된 활동이 아직 없다.</p> : null}
                </div>
              </SectionCard>
            </div>
          );
        })}

        {itinerary.length > 2 && (
          <div className={`timeline-gradient-overlay ${isExpanded ? "active" : ""}`}>
            <button className="expand-cta-btn pill-shape" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <>
                  전체 일정 접기 <i className="lucide-chevron-up" />
                </>
              ) : (
                <>
                  남은 {itinerary.length - 2}개의 일정 더 보기 <i className="lucide-chevron-down" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {manageModalDayId && (
        <CompanionManageModal
          isOpen={!!manageModalDayId}
          onClose={() => setManageModalDayId(null)}
          initialCompanions={linkedCompanions}
          onSave={handleSaveCompanions}
        />
      )}
    </section>
  );
};
