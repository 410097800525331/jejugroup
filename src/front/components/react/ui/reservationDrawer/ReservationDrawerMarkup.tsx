import type { FormEvent } from "react";

type ReservationDrawerStatus = "idle" | "loading" | "success" | "error";

export interface ReservationDrawerLookupResult {
  bookingNo?: string;
  reservationNo?: string;
  destination?: string;
  travelDate?: string;
  amount?: string;
  memberBooking?: boolean;
  lastName?: string;
  firstName?: string;
  email?: string;
}

export interface ReservationDrawerMarkupProps {
  isOpen: boolean;
  status: ReservationDrawerStatus;
  message: string;
  result: ReservationDrawerLookupResult | null;
  submittedEmail: string;
  onSubmit: (payload: { reservationNo: string; email: string }) => void | Promise<void>;
  onClose: () => void;
  onReset: () => void;
}

export const ReservationDrawerMarkup = ({
  isOpen,
  status,
  message,
  result,
  submittedEmail,
  onSubmit,
  onClose,
  onReset,
}: ReservationDrawerMarkupProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const reservationNo = String(formData.get("reservationNo") ?? "").trim();
    const email = String(formData.get("reservationEmail") ?? "").trim();

    onSubmit({ reservationNo, email });
  };

  const statusClassName =
    status === "error"
      ? "res-drawer-status res-drawer-status-error"
      : status === "success"
        ? "res-drawer-status res-drawer-status-success"
        : "res-drawer-status";

  return (
    <>
      <div
        className={`res-drawer-backdrop${isOpen ? " active" : ""}`}
        id="resDrawerBackdrop"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`res-drawer-panel${isOpen ? " active" : ""}`}
        id="resDrawerPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resDrawerTitle"
        onClick={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest("[data-route]")) {
            onClose();
          }
        }}
      >
        <button className="res-drawer-close" id="resDrawerClose" aria-label="닫기" onClick={onClose} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="res-drawer-visual">
          <h2 className="res-drawer-title" id="resDrawerTitle" data-lang="resCheckTitle">
            비회원 <span>예약조회</span>
          </h2>
          <p className="res-drawer-desc" data-lang="resCheckDesc">
            예약 번호와 예약 시 입력하신 이메일을 입력하시면<br />
            빠르게 예약 내역을 확인해 드립니다.
          </p>
        </div>

        <div className="res-drawer-body">
          <form className="res-drawer-form" id="resDrawerForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="drawerResNum">예약 번호</label>
              <input
                type="text"
                id="drawerResNum"
                name="reservationNo"
                placeholder="예: JS95276847"
                data-lang-placeholder="resNumPlaceholder"
                autoComplete="off"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="drawerEmail">예약 이메일</label>
              <input
                type="email"
                id="drawerEmail"
                name="reservationEmail"
                placeholder="example@jejugroup.com"
                data-lang-placeholder="resEmailPlaceholder"
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="res-drawer-btn" data-lang="checkButton" disabled={status === "loading"} aria-busy={status === "loading"}>
              {status === "loading" ? "조회 중..." : "조회하기"}
            </button>

            <p className={statusClassName} aria-live="polite">
              {message || "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다."}
            </p>
          </form>

          {status === "success" && result ? (
            <section className="res-drawer-result" aria-live="polite">
              <div className="res-drawer-result-head">
                <span className="res-drawer-result-badge">조회 완료</span>
                <button className="res-drawer-result-reset" type="button" onClick={onReset}>
                  다시 조회
                </button>
              </div>

              <div className="res-drawer-result-summary">
                <div>
                  <span>예약 번호</span>
                  <strong>{result.bookingNo || result.reservationNo || "확인 필요"}</strong>
                </div>
                <div>
                  <span>예약 구분</span>
                  <strong>
                    {result.memberBooking === true ? "회원 예약" : result.memberBooking === false ? "비회원 예약" : "확인 필요"}
                  </strong>
                </div>
                <div>
                  <span>여행지</span>
                  <strong>{result.destination || "확인 필요"}</strong>
                </div>
                <div>
                  <span>여행일</span>
                  <strong>{result.travelDate || "확인 필요"}</strong>
                </div>
                <div>
                  <span>금액</span>
                  <strong>{result.amount || "확인 필요"}</strong>
                </div>
                <div>
                  <span>예약자</span>
                  <strong>
                    {result.lastName || result.firstName
                      ? `${result.lastName ?? ""} ${result.firstName ?? ""}`.trim()
                      : submittedEmail}
                  </strong>
                </div>
                <div>
                  <span>조회 이메일</span>
                  <strong>{submittedEmail}</strong>
                </div>
              </div>
            </section>
          ) : null}

          <div className="res-drawer-footer">
            <span data-lang="isMember">이미 제주그룹 회원이신가요?</span>
            <a href="#" className="route-link" data-route="AUTH.LOGIN" data-lang="loginCheckLink">
              로그인하고 관리하기
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
