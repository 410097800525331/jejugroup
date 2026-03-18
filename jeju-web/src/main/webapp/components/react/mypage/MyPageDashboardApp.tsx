import { useCallback, useMemo } from "react";
import { BOOKINGS, PROFILE, STATS, SUPPORT_ITEMS } from "@front-components/mypage/data";
import { SectionCard } from "@front-components/mypage/SectionCard";
import { DashboardProvider, useDashboardState } from "@front-components/mypage/state";
import { StatusPill } from "@front-components/mypage/StatusPill";
import type { BookingType } from "@front-components/mypage/types";

const FILTERS: Array<"all" | BookingType> = ["all", "air", "stay", "rent"];

const DashboardContent = () => {
  const { dispatch, state } = useDashboardState();

  const filteredBookings = useMemo(() => {
    if (state.filter === "all") {
      return state.bookings;
    }

    return state.bookings.filter((booking) => booking.type === state.filter);
  }, [state.bookings, state.filter]);

  const handleFilter = useCallback(
    (filter: "all" | BookingType) => {
      dispatch({ type: "SET_FILTER", payload: filter });
    },
    [dispatch],
  );

  return (
    <div className="meta-dashboard-layout">
      <section className="meta-section layer-hero bento-grid">
        <SectionCard className="hero-glass-container">
          <div className="profile-avatar-wrap">
            <img
              alt="profile"
              className="profile-avatar"
              src="https://api.dicebear.com/7.x/notionists/svg?seed=minji-black&backgroundColor=242424"
            />
          </div>
          <div className="profile-core-wrap">
            <div className="profile-info">
              <h1 className="profile-name">
                <strong className="highlight">{PROFILE.name}</strong> 님
              </h1>
              <p className="profile-email">{PROFILE.email}</p>
              <div className="membership-list">
                {PROFILE.memberships.map((membership) => (
                  <div className="mem-badge soft-radius" key={membership}>
                    <span>멤버십</span>
                    <strong>{membership}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="quick-actions-bar">
              <a className="quick-btn pill-shape" href="#">
                예약 관리
              </a>
              <a className="quick-btn pill-shape" href="#">
                쿠폰 보기
              </a>
              <a className="quick-btn pill-shape" href="#">
                프로필 수정
              </a>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="wallet-box meta-glass-theme">
          <div className="wallet-head">
            <span className="eyebrow">My Wallet</span>
            <h3>보유 자산</h3>
          </div>
          <div className="wallet-body">
            <div className="asset-main">
              <span className="val">26,600</span> <span className="unit">P</span>
              <p className="expiring pill-shape">이달 말 소멸 예정 1,200P</p>
            </div>
            <div className="asset-grid">
              {STATS.slice(0, 2).map((stat) => (
                <div className="asset-sub" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="meta-section layer-full-management">
        <header className="section-header flex-header">
          <div>
            <h2 className="section-title">통합 예약 관리</h2>
            <p className="section-subtitle">항공, 숙박, 렌터카 일정을 한 번에 정리하는 뷰</p>
          </div>
        </header>

        <div className="quick-actions-bar" style={{ paddingTop: 0 }}>
          {FILTERS.map((filter) => (
            <button
              className="quick-btn pill-shape"
              key={filter}
              onClick={() => handleFilter(filter)}
              type="button"
            >
              {filter === "all" ? "전체" : filter === "air" ? "항공" : filter === "stay" ? "숙박" : "렌터카"}
            </button>
          ))}
        </div>

        <div className="management-categorized-wrap">
          <div className="service-category-block">
            <h3 className="category-title">현재 예약</h3>
            <ul className="full-width-trip-list">
              {filteredBookings.map((booking) => (
                <li className="inline-trip-card soft-radius" data-type={booking.type} key={booking.id}>
                  <div className="trip-core-info">
                    <div className="trip-head-flex">
                      <StatusPill tone={booking.type} value={booking.status} />
                      <div className="trip-tags">
                        {booking.tags.map((tag) => (
                          <span className="meta-tag pill-shape" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="trip-title">{booking.title}</h3>
                    <div className="trip-meta-grid">
                      <div className="meta-item">
                        <span>{booking.date}</span>
                      </div>
                      <div className="meta-item">
                        <strong>{booking.amount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="trip-inline-actions">
                    <div className="action-group">
                      <button className="inline-btn outline pill-shape" type="button">
                        상세 보기
                      </button>
                      <button className="inline-btn outline pill-shape" type="button">
                        일정 변경
                      </button>
                    </div>
                    <button className="inline-btn danger pill-shape" type="button">
                      취소 요청
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="meta-section layer-engagement">
        <header className="section-header">
          <h2 className="section-title">자주 쓰는 바로가기</h2>
        </header>

        <div className="bento-grid support-grid">
          {STATS.map((stat) => (
            <SectionCard key={stat.label}>
              <strong>{stat.label}</strong>
              <p>{stat.value}</p>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="meta-section layer-support">
        <header className="section-header">
          <h2 className="section-title">고객 지원</h2>
        </header>

        <div className="bento-grid support-grid">
          {SUPPORT_ITEMS.map((item) => (
            <a className="support-item bento-item" href={item.href} key={item.id}>
              <div className="sp-text">
                <strong>{item.label}</strong>
                {item.count !== null ? <span className="sp-badge">{item.count}</span> : null}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export const MyPageDashboardApp = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};
