import React, { useState, useEffect } from "react";
import type { ItineraryActivity, ItineraryCompanion, ItineraryItem } from "./types";
import { ITINERARY as INITIAL_ITINERARY } from "./data";
import { SectionCard } from "./SectionCard";
import { CompanionModal } from "./CompanionModal";

export const ItinerarySection = () => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(INITIAL_ITINERARY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [isExpanded, itinerary, activeDayId]);

  const handleOpenModal = (dayId: string) => {
    setActiveDayId(dayId);
    setIsModalOpen(true);
  };

  const handleSaveCompanions = (newCompanions: ItineraryCompanion[]) => {
    if (!activeDayId) return;
    setItinerary(itinerary.map(item => 
      item.id === activeDayId ? { ...item, companions: newCompanions } : item
    ));
  };

  const handleToggleActivity = (dayId: string, activityId: string) => {
    setItinerary(itinerary.map(item => {
      if (item.id === dayId) {
        return {
          ...item,
          activities: item.activities.map(act => 
            act.id === activityId ? { ...act, checked: !act.checked } : act
          )
        };
      }
      return item;
    }));
  };

  const displayedItinerary = isExpanded ? itinerary : itinerary.slice(0, 2);
  const currentDay = itinerary.find(i => i.id === activeDayId);


  return (
    <section className="meta-section layer-itinerary">
      <header className="section-header">
        <h2 className="section-title">나의 여행지 일정</h2>
        <p className="section-subtitle">동행자와 함께하는 상세 활동 계획</p>
      </header>


      <div className={`itinerary-timeline-wrap ${isExpanded ? 'is-expanded' : ''}`}>
        {displayedItinerary.map((day: ItineraryItem) => (

          <div className="itinerary-day-block" key={day.id}>
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
                  onClick={() => handleOpenModal(day.id)}
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
        ))}

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

      {isModalOpen && currentDay && (
        <CompanionModal
          initialCompanions={currentDay.companions}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCompanions}
        />
      )}
    </section>
  );
};

