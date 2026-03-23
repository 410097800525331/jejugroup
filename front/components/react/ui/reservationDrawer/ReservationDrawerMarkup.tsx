export const ReservationDrawerMarkup = () => {
  return (
    <>
      <div className="res-drawer-backdrop" id="resDrawerBackdrop" />
      <div className="res-drawer-panel" id="resDrawerPanel">
        <button className="res-drawer-close" id="resDrawerClose" aria-label="닫기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="res-drawer-visual">
          <h2 className="res-drawer-title" data-lang="resCheckTitle">
            비회원 <span>예약조회</span>
          </h2>
          <p className="res-drawer-desc" data-lang="resCheckDesc">
            예약 번호와 예약 시 입력하신 이메일을 입력하시면<br/>빠르게 예약 내역을 확인해 드립니다.
          </p>
        </div>

        <div className="res-drawer-body">
          <form className="res-drawer-form" id="resDrawerForm">
            <div className="input-group">
              <label htmlFor="drawerResNum">예약 번호</label>
              <input
                type="text"
                id="drawerResNum"
                placeholder="영문, 숫자 포함 8자리"
                data-lang-placeholder="resNumPlaceholder"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="drawerEmail">예약 이메일</label>
              <input
                type="email"
                id="drawerEmail"
                placeholder="example@jejugroup.com"
                data-lang-placeholder="resEmailPlaceholder"
                required
              />
            </div>

            <button type="submit" className="res-drawer-btn" data-lang="checkButton">
              조회하기
            </button>
          </form>

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
