import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDashboardState } from "./state";
import { StatusPill } from "./StatusPill";
import type { BookingType } from "./types";

const FILTERS: Array<"all" | BookingType> = ["all", "air", "stay", "rent", "voucher"];
const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  air: "항공",
  rent: "렌터카",
  stay: "숙박",
  voucher: "바우처",
};

const ROUTE_SEPARATOR_PATTERN = /\s*(?:→|->|–|—|~| to )\s*/i;
const PAYMENT_FALLBACK_KEYWORDS = ["결제", "카드", "현금", "페이", "포인트", "마일리지", "계좌", "무통장"];

interface BookingReceiptRoute {
  departure: string;
  destination: string;
}

interface BookingReceiptField {
  full?: boolean;
  label: string;
  value: string;
}

interface BookingReceiptDetails {
  reservationNo: string;
  subtitle: string;
  summaryLabel: string;
  summaryValue: string;
  note: string;
  fields: BookingReceiptField[];
}

const trimText = (value: string | undefined | null) => value?.trim() ?? "";
const joinWithSeparator = (values: Array<string | undefined>, separator = " · ") =>
  values.map((value) => trimText(value)).filter(Boolean).join(separator);

const pickFirstMatch = (values: string[], patterns: RegExp[]) =>
  values.find((value) => patterns.some((pattern) => pattern.test(value)));

const resolveRoute = (title: string): BookingReceiptRoute | null => {
  const normalizedTitle = trimText(title).replace(/\s+/g, " ");
  if (!normalizedTitle) {
    return null;
  }

  const separatorMatch = normalizedTitle.match(ROUTE_SEPARATOR_PATTERN);
  if (separatorMatch) {
    const [left, right] = normalizedTitle.split(ROUTE_SEPARATOR_PATTERN, 2);
    const departure = trimText(left);
    const destination = trimText(right).split(/\s+/)[0] ?? "";

    if (departure && destination) {
      return { departure, destination };
    }
  }

  const routeTokens = normalizedTitle.match(/\b[A-Z]{2,4}\b/g);
  if (routeTokens && routeTokens.length >= 2) {
    return {
      departure: routeTokens[0],
      destination: routeTokens[1],
    };
  }

  return null;
};

const extractFlightCode = (value: string, tags: string[]) => {
  const normalizedValue = trimText(value);
  const codeMatch = normalizedValue.match(/\b(?:[A-Z]{2,3}\d{2,4}|\d{1,3}[A-Z]\d{2,4})\b/);
  if (codeMatch) {
    return codeMatch[0];
  }

  const tagMatch = pickFirstMatch(tags, [/\b(?:[A-Z]{2,3}\d{2,4}|\d{1,3}[A-Z]\d{2,4})\b/]);
  return tagMatch ?? "";
};

const extractDisplayName = (title: string, tags: string[]) => {
  const normalizedTitle = trimText(title);
  const tagMatch = pickFirstMatch(tags, [/제주항공/, /대한항공/, /진에어/, /티웨이/, /에어부산/, /에어서울/, /이스타/, /항공/]);

  if (tagMatch) {
    return tagMatch;
  }

  const code = extractFlightCode(normalizedTitle, tags);
  if (code) {
    return code;
  }

  return normalizedTitle;
};

const resolvePaymentMethod = (paymentMethod: string | undefined, tags: string[]) => {
  const explicitPaymentMethod = trimText(paymentMethod);
  if (explicitPaymentMethod) {
    return explicitPaymentMethod;
  }

  const fallbackTag = tags.find((tag) => PAYMENT_FALLBACK_KEYWORDS.some((keyword) => tag.includes(keyword)));
  return fallbackTag || "예약 카드 기준 결제수단 확인";
};

const buildAirReceiptDetails = (booking: BookingLike): BookingReceiptDetails => {
  const route = resolveRoute(booking.title);
  const flightLabel = extractDisplayName(booking.title, booking.tags);
  const summaryValue = route ? `${route.departure} → ${route.destination}` : flightLabel || "항공 예약";
  const note = route
    ? `${route.departure} 출발 ${route.destination} 도착 항공권이다.`
    : `${flightLabel || "항공 예약"}의 노선은 카드 제목 기준으로 확인해라.`;

  return {
    fields: [
      { label: "예약번호", value: trimText(booking.id) || "예약번호 확인 필요" },
      { label: "출발일", value: trimText(booking.date) || "출발일 확인 필요" },
      { label: "출발지", value: route?.departure || "예약 카드 기준 출발지 확인" },
      { label: "목적지", value: route?.destination || "예약 카드 기준 목적지 확인" },
      { label: "편명/항공사", value: flightLabel || "예약 카드 기준 항공편 확인", full: true },
      { label: "결제금액", value: trimText(booking.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: resolvePaymentMethod(booking.paymentMethod, booking.tags) },
    ],
    note,
    reservationNo: trimText(booking.id) || "예약번호 확인 필요",
    subtitle: flightLabel ? `항공 예약 · ${flightLabel}` : "항공 예약",
    summaryLabel: "노선",
    summaryValue,
  };
};

const buildStayReceiptDetails = (booking: BookingLike): BookingReceiptDetails => {
  const title = trimText(booking.title) || "숙소 예약";
  const stayPeriod = trimText(booking.duration) || joinWithSeparator([booking.date, booking.duration], " / ") || "숙박 일정 확인";
  const note = `${title} 숙박 일정은 카드의 날짜와 기간 기준으로 확인하면 된다.`;

  return {
    fields: [
      { label: "예약번호", value: trimText(booking.id) || "예약번호 확인 필요" },
      { label: "체크인일", value: trimText(booking.date) || "체크인일 확인 필요" },
      { label: "숙소명", value: title },
      { label: "숙박일정", value: stayPeriod },
      { label: "포함혜택", value: joinWithSeparator(booking.tags) || "카드 태그 기준 혜택 확인", full: true },
      { label: "결제금액", value: trimText(booking.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: resolvePaymentMethod(booking.paymentMethod, booking.tags) },
    ],
    note,
    reservationNo: trimText(booking.id) || "예약번호 확인 필요",
    subtitle: `숙소 예약 · ${title}`,
    summaryLabel: "숙소명",
    summaryValue: title,
  };
};

const buildRentReceiptDetails = (booking: BookingLike): BookingReceiptDetails => {
  const title = trimText(booking.title) || "렌터카 예약";
  const usageTime = trimText(booking.duration) || "이용시간 확인";
  const note = `${title} 예약은 인수일과 이용시간 기준으로 확인해라.`;

  return {
    fields: [
      { label: "예약번호", value: trimText(booking.id) || "예약번호 확인 필요" },
      { label: "인수일", value: trimText(booking.date) || "인수일 확인 필요" },
      { label: "차량 또는 업체", value: title },
      { label: "이용시간", value: usageTime },
      { label: "포함옵션", value: joinWithSeparator(booking.tags) || "카드 태그 기준 옵션 확인", full: true },
      { label: "결제금액", value: trimText(booking.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: resolvePaymentMethod(booking.paymentMethod, booking.tags) },
    ],
    note,
    reservationNo: trimText(booking.id) || "예약번호 확인 필요",
    subtitle: `렌터카 예약 · ${title}`,
    summaryLabel: "차량/업체",
    summaryValue: title,
  };
};

const buildVoucherReceiptDetails = (booking: BookingLike): BookingReceiptDetails => {
  const title = trimText(booking.title) || "바우처 예약";
  const usageInfo = joinWithSeparator(booking.tags) || "바우처 사용 안내 확인";
  const note = `${title}는 예약일과 사용정보 기준으로 확인하면 된다.`;

  return {
    fields: [
      { label: "예약번호", value: trimText(booking.id) || "예약번호 확인 필요" },
      { label: "이용일", value: trimText(booking.date) || "이용일 확인 필요" },
      { label: "상품", value: title },
      { label: "사용정보", value: usageInfo },
      { label: "결제금액", value: trimText(booking.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: resolvePaymentMethod(booking.paymentMethod, booking.tags) },
    ],
    note,
    reservationNo: trimText(booking.id) || "예약번호 확인 필요",
    subtitle: `바우처 예약 · ${title}`,
    summaryLabel: "상품",
    summaryValue: title,
  };
};

type BookingLike = {
  amount: string;
  date: string;
  duration?: string;
  id: string;
  paymentMethod?: string;
  tags: string[];
  title: string;
  type: BookingType;
};

const buildReceiptDetails = (booking: BookingLike): BookingReceiptDetails => {
  switch (booking.type) {
    case "air":
      return buildAirReceiptDetails(booking);
    case "stay":
      return buildStayReceiptDetails(booking);
    case "rent":
      return buildRentReceiptDetails(booking);
    case "voucher":
    default:
      return buildVoucherReceiptDetails(booking);
  }
};

export const BookingSection = () => {
  const { dispatch, state } = useDashboardState();
  const bookings = state.bookings ?? [];
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [bookings, state.filter]);

  useEffect(() => {
    if (!activeBookingId) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveBookingId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBookingId]);

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

  const activeBooking = useMemo(
    () => bookings.find((booking) => booking.id === activeBookingId) ?? null,
    [activeBookingId, bookings],
  );

  const activeReceipt = useMemo(() => {
    if (!activeBooking) {
      return null;
    }

    return buildReceiptDetails(activeBooking);
  }, [activeBooking]);

  const handleOpenReceipt = useCallback((bookingId: string) => {
    setActiveBookingId(bookingId);
  }, []);

  const handleCloseReceipt = useCallback(() => {
    setActiveBookingId(null);
  }, []);

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
                    <button className="inline-btn outline pill-shape" type="button" onClick={() => handleOpenReceipt(booking.id)}>
                      예약 확인
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

      {activeReceipt && activeBooking ? (
        <div
          className="meta-modal-overlay booking-receipt-overlay active"
          onClick={handleCloseReceipt}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-receipt-title"
        >
          <div className="booking-receipt-modal" onClick={(event) => event.stopPropagation()}>
            <header className="booking-receipt-header">
              <div className="booking-receipt-header-copy">
                <span className="booking-receipt-kicker">{BOOKING_TYPE_LABELS[activeBooking.type]} 예약</span>
                <h3 className="booking-receipt-title">예약 확인</h3>
                <p className="booking-receipt-subtitle">{activeReceipt.subtitle}</p>
              </div>
              <button className="booking-receipt-close" type="button" onClick={handleCloseReceipt} aria-label="닫기">
                <i data-lucide="x" aria-hidden="true" />
              </button>
            </header>

            <div className="booking-receipt-body">
              <section className="booking-receipt-summary">
                <div className="booking-receipt-item">
                  <span className="booking-receipt-label">예약번호</span>
                  <strong className="booking-receipt-value">{activeReceipt.reservationNo}</strong>
                </div>
                <div className="booking-receipt-item">
                  <span className="booking-receipt-label">{activeReceipt.summaryLabel}</span>
                  <strong className="booking-receipt-value">{activeReceipt.summaryValue}</strong>
                </div>
                <p className="booking-receipt-note">{activeReceipt.note}</p>
              </section>

              <dl className="booking-receipt-grid">
                {activeReceipt.fields.map((field) => (
                  <div className={`booking-receipt-item${field.full ? " full" : ""}`} key={field.label}>
                    <dt className="booking-receipt-label">{field.label}</dt>
                    <dd className="booking-receipt-value">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <footer className="booking-receipt-actions">
              <button className="inline-btn outline pill-shape" type="button" onClick={handleCloseReceipt}>
                닫기
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  );
};
