export const ReservationDrawerMarkup = () => {
  return (
    <>
      <div className="res-drawer-backdrop" id="resDrawerBackdrop" />
      <div className="res-drawer-panel" id="resDrawerPanel">
        <button className="res-drawer-close" id="resDrawerClose">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="res-drawer-visual">
          <h2 className="res-drawer-title" data-lang="resCheckTitle">
            비회원 예약 조회
          </h2>
          <p className="res-drawer-desc" data-lang="resCheckDesc">
            예약 번호와 이메일 정보를 입력해서 내역을 확인해줘
          </p>
        </div>

        <div className="res-drawer-body">
          <form className="res-drawer-form" id="resDrawerForm">
            <div className="input-group">
              <input
                type="text"
                id="drawerResNum"
                placeholder="예약 번호 입력"
                data-lang-placeholder="resNumPlaceholder"
                required
              />
              <div className="input-focus-bg" />
            </div>

            <div className="input-group">
              <input
                type="email"
                id="drawerEmail"
                placeholder="가입한 이메일 입력"
                data-lang-placeholder="resEmailPlaceholder"
                required
              />
              <div className="input-focus-bg" />
            </div>

            <button type="submit" className="res-drawer-btn" data-lang="checkButton">
              조회하기
            </button>
          </form>

          <div className="res-drawer-footer">
            <span data-lang="isMember">회원이신가요</span>
            <a href="#" className="route-link" data-route="AUTH.LOGIN" data-lang="loginCheckLink">
              로그인하고 관리하기
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
