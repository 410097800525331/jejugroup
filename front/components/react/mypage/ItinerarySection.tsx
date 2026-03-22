import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ItineraryActivity, ItineraryCompanion, ItineraryItem } from "./types";
import { SectionCard } from "./SectionCard";
import { CompanionManageModal } from "./CompanionManageModal";
import { useDashboardState } from "./state";

export const ItinerarySection = () => {
  const { dispatch, state } = useDashboardState();
  const itinerary = state.itinerary ?? [];
  const [isExpanded, setIsExpanded] = useState(false);
  const [manageModalDayId, setManageModalDayId] = useState<string | null>(null);
  const dayBlockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [dayBlockHeights, setDayBlockHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [isExpanded, itinerary]);

  useLayoutEffect(() => {
    const nextHeights = itinerary.reduce<Record<string, number>>((acc, day) => {
      acc[day.id] = dayBlockRefs.current[day.id]?.scrollHeight ?? 0;
      return acc;
    }, {});

    setDayBlockHeights((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(nextHeights);

      if (
        prevKeys.length === nextKeys.length &&
        nextKeys.every((key) => prev[key] === nextHeights[key])
      ) {
        return prev;
      }

      return nextHeights;
    });
  }, [itinerary, isExpanded]);

  const handleToggleActivity = (dayId: string, activityId: string) => {
    dispatch({
      type: "SET_ITINERARY",
      payload: itinerary.map((item) => {
        if (item.id === dayId) {
          return {
            ...item,
            activities: item.activities.map((act) =>
              act.id === activityId ? { ...act, checked: !act.checked } : act,
            ),
          };
        }

        return item;
      }),
    });
  };

  const handleSaveCompanions = (dayId: string, newCompanions: ItineraryCompanion[]) => {
    dispatch({
      type: "SET_ITINERARY",
      payload: itinerary.map((item) => {
        if (item.id === dayId) {
          return { ...item, companions: newCompanions };
        }

        return item;
      }),
    });
    setManageModalDayId(null);
  };

  return (
    <section className="meta-section layer-itinerary">
      <header className="section-header">
        <h2 className="section-title">나의 여행지 일정</h2>
        <p className="section-subtitle">동행자와 함께하는 상세 활동 계획</p>
      </header>


      <div className={`itinerary-timeline-wrap ${isExpanded ? 'is-expanded' : ''}`}>
        {itinerary.map((day: ItineraryItem, index) => {
          const shouldAlwaysShow = index < 2;
          const isVisible = shouldAlwaysShow || isExpanded;
          const measuredHeight = dayBlockHeights[day.id] ?? 720;

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
                  {day.companions.map((comp: ItineraryCompanion) => (
                    <div
                      className={`companion-avatar soft-radius ${comp.isMember ? "is-linked" : ""}`}
                      key={comp.id}
                      title={comp.name + (comp.isMember ? " (연동됨)" : "")}
                    >
                      {comp.name.charAt(0)}
                      {comp.isMember && <i data-lucide="link" className="lucide-link linked-indicator" />}
                    </div>
                  ))}
                  <span className="comp-count-label">총 {day.companions.length}명</span>
                </div>
                <button
                  className="link-action-btn pill-shape"
                  type="button"
                  onClick={() => setManageModalDayId(day.id)}
                >
                  <i data-lucide="user-plus" className="lucide-user-plus" />
                  동행자 연동/관리
                </button>
              </div>
            </div>

            <SectionCard className="itinerary-content-card meta-glass-theme">
              <div className="iti-header flex-header">
                <h3 className="iti-title">{day.title}</h3>
                <a
                  className="map-link-btn pill-shape"
                  href={day.googleMapUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i data-lucide="map-pin" className="lucide-map-pin" />
                  구글 맵 보기
                </a>
              </div>

              <div className="activity-checklist-wrap">
                <p className="small-label">활동(Activity) 체크리스트</p>
                <ul className="checklist-list">
                  {day.activities.map((activity: { checked: boolean; id: string; label: string }) => (
                    <li className={`checklist-item ${activity.checked ? "checked" : ""} soft-radius`} key={activity.id}>
                      <label className="checkbox-control">
                        <input 
                          type="checkbox" 
                          checked={activity.checked} 
                          onChange={() => handleToggleActivity(day.id, activity.id)}
                        />
                        <span className="check-text">{activity.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>
          </div>
        );
        })}

        {itinerary.length > 2 && (
          <div className={`timeline-gradient-overlay ${isExpanded ? 'active' : ''}`}>
            <button className="expand-cta-btn pill-shape" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <>전체 일정 접기 <i className="lucide-chevron-up" /></>
              ) : (
                <>남은 {itinerary.length - 2}개의 일정 더 보기 <i className="lucide-chevron-down" /></>
              )}
            </button>
          </div>
        )}
      </div>

      {manageModalDayId && (
        <CompanionManageModal
          isOpen={!!manageModalDayId}
          onClose={() => setManageModalDayId(null)}
          initialCompanions={itinerary.find(d => d.id === manageModalDayId)?.companions || []}
          onSave={(newCompanions) => handleSaveCompanions(manageModalDayId, newCompanions)}
        />
      )}
    </section>
  );
};
