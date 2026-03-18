interface MainHeaderTemplateProps {
  basePath: string;
}

export const MainHeaderTemplate = ({ basePath }: MainHeaderTemplateProps) => {
  return (
    <header className="header main-header" id="header">
      <div className="header-util" id="index-header-util">
        <a
          href="#"
          className="util-link route-link"
          data-route="AUTH.LOGIN"
          data-route-params='{"shell":"main"}'
          data-lang="login"
          id="indexLoginBtn"
        >
          로그인
        </a>
        <span className="util-divider">|</span>
        <a
          href="#"
          className="util-link route-link"
          data-route="AUTH.SIGNUP"
          data-route-params='{"shell":"main"}'
          data-lang="signup"
        >
          회원가입
        </a>
        <span className="util-divider">|</span>
        <a href="#" className="util-link route-link" data-action="OPEN_RESERVATION_DRAWER" data-lang="reservationCheck">
          예약 확인
        </a>
        <span className="util-divider">|</span>
        <a href="#" className="util-link route-link" data-route="CS.CUSTOMER_CENTER" data-lang="customerCenter">
          고객센터
        </a>
      </div>

      <div className="header-inner">
        <div className="logo">
          <a href="#" className="logo-link route-link" data-route="HOME">
            <img src={`${basePath}jejustay/images/logo_jejuGP_wide.png`} alt="제주그룹" />
          </a>
        </div>

        <nav className="gnb" id="gnb">
          <ul className="gnb-list">
            <li className="gnb-item">
              <a href="#section-2" className="gnb-link" data-lang="navAir">
                제주항공
              </a>
            </li>
            <li className="gnb-item">
              <a href="#section-3" className="gnb-link" data-lang="navHotel">
                제주 스테이
              </a>
            </li>
            <li className="gnb-item">
              <a href="#section-4" className="gnb-link" data-lang="navRentCar">
                제주 렌트카
              </a>
            </li>
            <li className="gnb-item">
              <a href="#section-5" className="gnb-link" data-lang="navMembership">
                멤버십
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-right-controls">
          <button className="lang-toggle">English</button>
          <div id="weather-widget" className="weather-widget">
            <button className="weather-header-btn" id="weather-open-btn">
              <i className="fa-solid fa-spinner fa-spin" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
