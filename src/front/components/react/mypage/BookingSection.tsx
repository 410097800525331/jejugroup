import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDashboardState } from "./state";
import { StatusPill } from "./StatusPill";
import type { BookingType } from "./types";
// @ts-ignore JS config module
import { API_BASE_URL } from "../../../core/modules/config/api_config.module.js";

declare global {
  interface Window {
    lucide?: {
      createIcons: () => void;
    };
  }
}

const FILTERS: Array<"all" | BookingType> = ["all", "air", "stay", "rent", "voucher"];
const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  air: "항공",
  rent: "렌터카",
  stay: "숙박",
  voucher: "바우처",
};

const ROUTE_SEPARATOR_PATTERN = /\s*(?:→|->|–|—|~| to )\s*/i;
const PAYMENT_FALLBACK_KEYWORDS = ["결제", "카드", "현금", "페이", "포인트", "마일리지", "계좌", "무통장"];
const AIRLINE_NAME_PATTERNS = [/제주항공/, /대한항공/, /진에어/, /티웨이/, /에어부산/, /에어서울/, /이스타/, /아시아나/, /Jeju Air/i];
const JEJU_ORANGE = "#ff5c00";

const BOOKING_CANCEL_ENDPOINT = (bookingId: string) =>
  `${API_BASE_URL}/api/booking/${encodeURIComponent(bookingId)}/cancel`;

type BookingActionTone = "loading" | "success" | "error" | "info";

interface BookingActionNotice {
  bookingId: string;
  message: string;
  tone: BookingActionTone;
}

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const pickFirstMatch = (values: string[], patterns: RegExp[]) =>
  values.find((value) => patterns.some((pattern) => pattern.test(value)));
const extractBackendMessage = (payload: unknown, fallbackMessage: string) => {
  if (isRecord(payload)) {
    const message = payload.message ?? payload.error;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return fallbackMessage;
};

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

const extractAirlineName = (value: string, tags: string[]) => {
  const explicit = pickFirstMatch([value, ...tags], AIRLINE_NAME_PATTERNS);
  if (explicit) {
    return explicit.replace(/\b[A-Z]{2,3}\d{2,4}\b/g, "").trim() || explicit.trim();
  }

  return "항공사 정보 확인";
};

const splitBookingDateTime = (value: string) => {
  const normalized = trimText(value).replace(/\s+/g, " ");
  if (!normalized) {
    return { date: "일정 확인 필요", time: "시간 확인 필요" };
  }

  const match = normalized.match(/^(.+?)(\d{1,2}:\d{2}(?:\s?[A-Z]{2,4})?)$/);
  if (match) {
    return {
      date: trimText(match[1]).replace(/\s+$/, ""),
      time: trimText(match[2]),
    };
  }

  return {
    date: normalized,
    time: "시간 확인 필요",
  };
};

const splitStayRange = (value: string) => {
  const normalized = trimText(value).replace(/\s+/g, " ");
  if (!normalized) {
    return { checkIn: "체크인 확인 필요", checkOut: "체크아웃 확인 필요" };
  }

  const match = normalized.match(/^(.+?)\s*[~-]\s*(.+)$/);
  if (match) {
    return {
      checkIn: trimText(match[1]),
      checkOut: trimText(match[2]),
    };
  }

  return {
    checkIn: normalized,
    checkOut: "체크아웃 확인 필요",
  };
};

const extractStayRoomLabel = (booking: BookingLike) => {
  const prioritizedTag = booking.tags.find((tag) => /뷰|스위트|룸|객실|침대|베드/i.test(tag));
  if (prioritizedTag) {
    return prioritizedTag;
  }

  const title = trimText(booking.title);
  if (title) {
    return title;
  }

  return "객실 정보 확인";
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
    : `${flightLabel || "항공 예약"}의 노선은 카드 제목 기준으로 확인해 주세요.`;

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
  const note = `${title} 숙박 일정은 카드의 날짜와 기간 기준으로 확인하시면 됩니다.`;

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
  const note = `${title} 예약은 인수일과 이용시간 기준으로 확인해 주세요.`;

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
  const note = `${title}는 예약일과 사용정보 기준으로 확인하시면 됩니다.`;

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
  const { dispatch, refreshDashboard, state } = useDashboardState();
  const bookings = state.bookings ?? [];
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<BookingActionNotice | null>(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeBookingId]);

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

  const handleBookingChange = useCallback((bookingId: string) => {
    setActionNotice({
      bookingId,
      message: "예약 변경은 아직 이 화면에서 바로 처리되지 않습니다. 고객센터로 문의해 주세요.",
      tone: "info",
    });
  }, []);

  const handleBookingCancel = useCallback(
    async (booking: BookingLike) => {
      setPendingBookingId(booking.id);
      setActionNotice({
        bookingId: booking.id,
        message: "예약 취소를 처리하는 중입니다. 잠시만 기다려 주세요.",
        tone: "loading",
      });

      try {
        const response = await fetch(BOOKING_CANCEL_ENDPOINT(booking.id), {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          method: "POST",
        });
        const payload = await response.json().catch(() => null);

        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }

        if (!response.ok || (isRecord(payload) && payload.success === false)) {
        throw new Error(extractBackendMessage(payload, "예약 취소에 실패했습니다."));
        }

        setActionNotice({
          bookingId: booking.id,
          message: extractBackendMessage(payload, "예약 취소가 완료되었습니다."),
          tone: "success",
        });

        const refreshed = await refreshDashboard();
        if (!refreshed) {
          window.location.reload();
        }

        if (activeBookingId === booking.id) {
          setActiveBookingId(null);
        }
      } catch (error) {
        setActionNotice({
          bookingId: booking.id,
          message: error instanceof Error && error.message.trim() ? error.message : "예약 취소에 실패했습니다.",
          tone: "error",
        });
      } finally {
        setPendingBookingId(null);
      }
    },
    [activeBookingId, refreshDashboard],
  );

  const handleVoucherOpen = useCallback(
    (voucherUrl?: string) => {
      if (!voucherUrl) {
        setActionNotice({
          bookingId: "",
          message: "바우처 링크가 아직 연결되지 않았습니다.",
          tone: "info",
        });
        return;
      }

      window.open(voucherUrl, "_blank", "noopener,noreferrer");
    },
    [],
  );

  const handleReceiptActionNotice = useCallback((message: string) => {
    setActionNotice({
      bookingId: activeBookingId ?? "",
      message,
      tone: "info",
    });
  }, [activeBookingId]);

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

      {actionNotice ? (
        <div
          aria-live="polite"
          className="booking-action-notice soft-radius"
          role={actionNotice.tone === "error" ? "alert" : "status"}
          style={{
            background:
              actionNotice.tone === "error"
                ? "#fff1f0"
                : actionNotice.tone === "success"
                  ? "#eefaf3"
                  : actionNotice.tone === "loading"
                    ? "#f4f7fb"
                    : "#f5f9ff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            color:
              actionNotice.tone === "error"
                ? "#b42318"
                : actionNotice.tone === "success"
                  ? "#067647"
                  : actionNotice.tone === "loading"
                    ? "#344054"
                    : "#1d4ed8",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "16px",
            padding: "14px 16px",
          }}
        >
          {actionNotice.message}
        </div>
      ) : null}

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
                    <button className="inline-btn primary pill-shape" type="button" onClick={() => handleVoucherOpen(booking.voucherUrl)}>
                      <i data-lucide="download" className="lucide-download" />
                      e-티켓 / 바우처
                    </button>
                  ) : (
                    <button className="inline-btn outline pill-shape" type="button" onClick={() => handleOpenReceipt(booking.id)}>
                      예약 확인
                    </button>
                  )}
                  <button className="inline-btn outline pill-shape" type="button" onClick={() => handleBookingChange(booking.id)}>
                    예약 변경
                  </button>
                </div>
                <button className="inline-btn danger pill-shape" disabled={pendingBookingId === booking.id} type="button" onClick={() => void handleBookingCancel(booking)}>
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
        activeBooking.type === "air" ? (
          <div
            className="meta-modal-overlay booking-receipt-overlay active"
            onClick={handleCloseReceipt}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-receipt-title"
            style={{
              alignItems: "flex-start",
              backdropFilter: "blur(10px)",
              background: "rgba(26, 28, 28, 0.2)",
              padding: "calc(80px + 10px) 16px 16px",
            }}
          >
            {((activeBooking, activeReceipt) => {
              const route = resolveRoute(activeBooking!.title);
              const flightCode = extractFlightCode(activeBooking.title, activeBooking.tags) || "편명 확인 필요";
              const airlineName = extractAirlineName(activeBooking!.title, activeBooking!.tags);
              const departureInfo = splitBookingDateTime(activeBooking!.date);
              const paymentMethod = resolvePaymentMethod(activeBooking!.paymentMethod, activeBooking!.tags);
              const paymentDetail = activeBooking.paymentMethod?.includes("카드") ? "등록 카드 기준 결제" : paymentMethod;

              return (
                <div
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    background: "#ffffff",
                    borderRadius: "28px",
                    boxShadow: "0 24px 80px rgba(26, 28, 28, 0.18)",
                    color: "#1a1c1c",
                    maxWidth: "448px",
                    overflow: "hidden",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                      inset: 0,
                      opacity: 0.02,
                      pointerEvents: "none",
                      position: "absolute",
                    }}
                  />

                  <button
                    aria-label="닫기"
                    onClick={handleCloseReceipt}
                    style={{
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      color: "#8f7065",
                      cursor: "pointer",
                      display: "flex",
                      height: "44px",
                      justifyContent: "center",
                      position: "absolute",
                      right: "14px",
                      top: "14px",
                      width: "44px",
                      zIndex: 1,
                    }}
                    type="button"
                  >
                    <i data-lucide="x" aria-hidden="true" />
                  </button>

                  <div
                    style={{
                      borderBottom: "1px dashed rgba(143, 112, 101, 0.3)",
                      padding: "40px 28px 24px",
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        background: "rgba(255, 92, 0, 0.1)",
                        borderRadius: "999px",
                        color: "#a73a00",
                        display: "flex",
                        height: "64px",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        width: "64px",
                      }}
                    >
                      <i data-lucide="ticket" style={{ height: "30px", width: "30px" }} />
                    </div>
                    <h3
                      id="booking-receipt-title"
                      style={{
                        fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans KR\", sans-serif",
                        fontSize: "30px",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        margin: 0,
                      }}
                    >
                      예약 내역 확인
                    </h3>
                    <p
                      style={{
                        color: "#5f5e5e",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: "8px 0 0",
                        textTransform: "uppercase",
                      }}
                    >
                      {activeReceipt.reservationNo}
                    </p>
                  </div>

                  <div style={{ padding: "28px", position: "relative" }}>
                    <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "28px" }}>
                      <div style={{ textAlign: "left" }}>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>출발지</span>
                        <div style={{ fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans KR\", sans-serif", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.08em" }}>{route?.departure || "출발지"}</div>
                        <div style={{ color: "#5f5e5e", fontSize: "12px", marginTop: "4px" }}>{route?.departure || activeReceipt.summaryValue}</div>
                      </div>

                      <div style={{ flex: "1 1 auto", padding: "0 16px" }}>
                        <div style={{ background: "rgba(143, 112, 101, 0.35)", height: "1px", position: "relative", width: "100%" }}>
                          <i
                            data-lucide="plane"
                            style={{
                              background: "#ffffff",
                              color: "#a73a00",
                              height: "20px",
                              left: "50%",
                              padding: "0 8px",
                              position: "absolute",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "20px",
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>도착지</span>
                        <div style={{ fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans KR\", sans-serif", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.08em" }}>{route?.destination || "도착지"}</div>
                        <div style={{ color: "#5f5e5e", fontSize: "12px", marginTop: "4px" }}>{route?.destination || "도착 정보 확인"}</div>
                      </div>
                    </div>

                    <div
                      style={{
                        columnGap: "24px",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        paddingTop: "12px",
                        rowGap: "24px",
                      }}
                    >
                      <div>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>출발일</span>
                        <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{departureInfo.date}</p>
                        <p style={{ color: "#5f5e5e", fontSize: "14px", margin: "4px 0 0" }}>{departureInfo.time}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>항공사 / 편명</span>
                        <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{airlineName}</p>
                        <p style={{ color: "#5f5e5e", fontSize: "14px", margin: "4px 0 0" }}>{flightCode}</p>
                      </div>
                      <div>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>결제수단</span>
                        <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{paymentMethod}</p>
                        <p style={{ color: "#5f5e5e", fontSize: "14px", margin: "4px 0 0" }}>{paymentDetail}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }}>상태</span>
                        <p style={{ color: "#a73a00", fontSize: "14px", fontWeight: 800, margin: 0 }}>{activeBooking.status || "확인됨"}</p>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px dashed rgba(143, 112, 101, 0.45)", marginTop: "28px", paddingTop: "24px" }}>
                      <div style={{ alignItems: "baseline", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#5f5e5e", fontSize: "15px", fontWeight: 700 }}>총 결제금액</span>
                        <span style={{ fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans KR\", sans-serif", fontSize: "30px", fontWeight: 800, letterSpacing: "-0.04em" }}>{activeBooking.amount || "금액 확인 필요"}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      alignItems: "center",
                      background: "#f3f3f3",
                      display: "flex",
                      gap: "12px",
                      padding: "20px 24px 24px",
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => handleReceiptActionNotice("항공 영수증 PDF 다운로드는 아직 연결되지 않았습니다. UI만 먼저 연결해 두었습니다.")}
                      style={{
                        background: "#a73a00",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 12px 28px rgba(167, 58, 0, 0.2)",
                        color: "#ffffff",
                        cursor: "pointer",
                        flex: "1 1 auto",
                        fontSize: "14px",
                        fontWeight: 800,
                        padding: "14px 16px",
                      }}
                      type="button"
                    >
                      PDF 영수증 다운로드
                    </button>
                    <button
                      aria-label="영수증 공유"
                      onClick={() => handleReceiptActionNotice("항공 영수증 공유 기능은 아직 연결되지 않았습니다. UI만 먼저 연결해 두었습니다.")}
                      style={{
                        alignItems: "center",
                        background: "rgba(255, 92, 0, 0.12)",
                        border: "none",
                        borderRadius: "12px",
                        color: JEJU_ORANGE,
                        cursor: "pointer",
                        display: "flex",
                        height: "48px",
                        justifyContent: "center",
                        width: "48px",
                      }}
                      type="button"
                    >
                      <i data-lucide="share-2" style={{ height: "18px", width: "18px" }} />
                    </button>
                  </div>
                </div>
              );
            })(activeBooking!, activeReceipt!)}
          </div>
        ) : activeBooking.type === "stay" ? (
          <div
            className="meta-modal-overlay booking-receipt-overlay active"
            onClick={handleCloseReceipt}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-receipt-title"
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(26, 28, 28, 0.4)",
              padding: "16px",
            }}
          >
            {(() => {
              const stayRange = splitStayRange(activeBooking.date);
              const roomLabel = extractStayRoomLabel(activeBooking);
              const paymentMethod = resolvePaymentMethod(activeBooking.paymentMethod, activeBooking.tags);
              const nightlySummary = activeBooking.duration
                ? `${activeBooking.duration} / ${activeBooking.amount || "금액 확인 필요"}`
                : activeBooking.amount || "금액 확인 필요";
              const serviceAndTax = "세금 및 서비스 포함";

              return (
                <div
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    boxShadow: "0 12px 40px rgba(26, 28, 28, 0.15)",
                    maxWidth: "500px",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "24px 26px 12px", textAlign: "center" }}>
                    <div
                      style={{
                        alignItems: "center",
                        background: "#dcfce7",
                        borderRadius: "999px",
                        color: "#166534",
                        display: "inline-flex",
                        fontSize: "12px",
                        fontWeight: 900,
                        gap: "8px",
                        letterSpacing: "0.12em",
                        marginBottom: "18px",
                        padding: "7px 14px",
                        textTransform: "uppercase",
                      }}
                    >
                      <i data-lucide="check-circle-2" style={{ height: "14px", width: "14px" }} />
                      확인됨
                    </div>
                    <h3
                      id="booking-receipt-title"
                      style={{
                        fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans KR\", sans-serif",
                        fontSize: "34px",
                        fontWeight: 900,
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        margin: 0,
                      }}
                    >
                      예약을 확인했습니다
                    </h3>
                    <p style={{ color: "#5f5e5e", fontSize: "14px", fontWeight: 600, margin: "8px 0 0" }}>
                      제주 숙박 예약이 정상적으로 확인되었습니다.
                    </p>
                  </div>

                  <div style={{ padding: "0 26px 24px" }}>
                    <div
                      style={{
                        borderTop: "2px solid #f3f3f3",
                        columnGap: "14px",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        paddingTop: "16px",
                        rowGap: "14px",
                      }}
                    >
                      <div style={{ gridColumn: "1 / -1" }}>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>숙소명</span>
                        <p style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", margin: "5px 0 0" }}>{trimText(activeBooking.title) || "숙소 정보 확인"}</p>
                        <p style={{ color: "#5b4137", fontSize: "14px", fontWeight: 500, margin: "3px 0 0" }}>{roomLabel}</p>
                      </div>
                      <div>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>체크인</span>
                        <p style={{ fontSize: "16px", fontWeight: 800, margin: "5px 0 0" }}>{stayRange.checkIn}</p>
                      </div>
                      <div>
                        <span style={{ color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>체크아웃</span>
                        <p style={{ fontSize: "16px", fontWeight: 800, margin: "5px 0 0" }}>{stayRange.checkOut}</p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f3f3f3",
                        borderRadius: "16px",
                        marginTop: "22px",
                        padding: "18px 18px 20px",
                      }}
                    >
                      <div style={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
                        <div>
                          <span style={{ color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>예약번호</span>
                          <p style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 800, margin: "5px 0 0" }}>{activeReceipt.reservationNo}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>결제수단</span>
                          <p style={{ fontSize: "13px", fontWeight: 800, margin: "5px 0 0" }}>{paymentMethod}</p>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid rgba(143, 112, 101, 0.3)", paddingTop: "14px" }}>
                        <div style={{ alignItems: "center", color: "#5f5e5e", display: "flex", fontSize: "13px", fontWeight: 600, justifyContent: "space-between", marginBottom: "10px" }}>
                          <span>{nightlySummary}</span>
                          <span>{activeBooking.amount || "금액 확인 필요"}</span>
                        </div>
                        <div style={{ alignItems: "center", color: "#5f5e5e", display: "flex", fontSize: "13px", fontWeight: 600, justifyContent: "space-between", marginBottom: "14px" }}>
                          <span>세금 및 서비스료</span>
                          <span>{serviceAndTax}</span>
                        </div>
                        <div style={{ alignItems: "baseline", display: "flex", justifyContent: "space-between", paddingTop: "6px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }}>총 결제금액</span>
                          <span style={{ color: JEJU_ORANGE, fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans KR\", sans-serif", fontSize: "30px", fontWeight: 900, letterSpacing: "-0.05em" }}>{activeBooking.amount || "금액 확인 필요"}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
                      <button
                        onClick={() => handleReceiptActionNotice("호텔 영수증 PDF 다운로드는 아직 연결되지 않았습니다. UI만 먼저 연결해 두었습니다.")}
                        style={{
                          background: JEJU_ORANGE,
                          border: "none",
                          borderRadius: "14px",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: 800,
                          padding: "14px",
                          transition: "transform 120ms ease",
                        }}
                        type="button"
                      >
                        PDF 영수증 다운로드
                      </button>
                      <button
                        onClick={handleCloseReceipt}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderRadius: "14px",
                          color: JEJU_ORANGE,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 800,
                          padding: "10px",
                        }}
                        type="button"
                      >
                        닫기
                      </button>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(90deg, ${JEJU_ORANGE} 0%, #ff7a2f 55%, #fdba74 100%)`,
                      height: "6px",
                    }}
                  />
                </div>
              );
            })()}
          </div>
        ) : (
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
        )
      ) : null}
    </section>
  );
};
