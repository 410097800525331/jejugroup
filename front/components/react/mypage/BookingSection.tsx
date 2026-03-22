import { useCallback, useEffect, useMemo } from "react";
import { useDashboardState } from "./state";
import { StatusPill } from "./StatusPill";
import type { BookingType } from "./types";

const FILTERS: Array<"all" | BookingType> = ["all", "air", "stay", "rent", "voucher"];

export const BookingSection = () => {
  const { dispatch, state } = useDashboardState();
  const bookings = state.bookings ?? [];

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [bookings, state.filter]);

  const filteredBookings = useMemo(() => {
    if (state.filter === "all") {
      return bookings;
    }

    return bookings.filter((booking) => booking.type === state.filter);
  }, [bookings, state.filter]);

  const handleFilter = useCallback(
    (filter: "all" | BookingType) => {
      dispatch({ type: "SET_FILTER", payload: filter });
    },
    [dispatch],
  );

  return (
    <section className="meta-section layer-full-management">
      <header className="section-header flex-header">
        <div className="title-group">
          <h2 className="section-title">나의 예약 현황</h2>
          <p className="section-subtitle">항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요.</p>
        </div>
        <div className="booking-filters flex-gap">
          {FILTERS.map((filter) => (
            <button
              className={`filter-chip pill-shape ${state.filter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => handleFilter(filter)}
              type="button"
            >
              {filter === "all" ? "전체" : filter === "air" ? "항공" : filter === "stay" ? "숙박" : filter === "rent" ? "렌터카" : "바우처"}
            </button>
          ))}
        </div>
      </header>

      <ul className="full-width-trip-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <li className="inline-trip-card soft-radius" data-type={booking.type} key={booking.id}>
              <div className="trip-core-info">
                <div className="trip-head-flex">
                  <StatusPill tone={booking.type} value={booking.status} />
                  <div className="trip-tags">
                    {booking.tags.map((tag: string) => (
                      <span className="meta-tag pill-shape" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="trip-title">{booking.title}</h3>
                <div className="trip-meta-grid">
                  <div className="meta-item">
                    <i data-lucide="calendar" className="lucide-calendar" />
                    <span>{booking.date}</span>
                    {booking.duration ? <strong className="duration-label">({booking.duration})</strong> : null}
                  </div>
                  <div className="meta-item">
                    <i data-lucide="wallet" className="lucide-wallet" />
                    <strong>{booking.amount}</strong>
                    {booking.paymentMethod ? (
                      <span className="method-label"> / {booking.paymentMethod}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="trip-inline-actions">
                <div className="action-group">
                  {booking.voucherUrl ? (
                    <button className="inline-btn primary pill-shape" type="button">
                      <i data-lucide="download" className="lucide-download" />
                      e-티켓 / 바우처
                    </button>
                  ) : (
                    <button className="inline-btn outline pill-shape" type="button">
                      결제 진행하기
                    </button>
                  )}
                  <button className="inline-btn outline pill-shape" type="button">
                    예약 변경
                  </button>
                </div>
                <button className="inline-btn danger pill-shape" type="button">
                  예약 취소
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="empty-state-placeholder soft-radius">
            <i data-lucide="alert-circle" className="lucide-alert-circle" />
            <p>선택하신 카테고리에 해당하는 예약 내역이 없습니다.</p>
          </div>
        )}
      </ul>
    </section>
  );
};
