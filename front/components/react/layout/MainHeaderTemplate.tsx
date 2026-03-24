import { resolveRoute } from "@front-core-utils/path_resolver.js";

interface MainHeaderTemplateProps {
  basePath: string;
}

export const MainHeaderTemplate = ({ basePath }: MainHeaderTemplateProps) => {
  const resolveRouteHref = (routeKey: string, params?: Record<string, string>) => {
    try {
      return resolveRoute(routeKey, params ?? {});
    } catch (_error) {
      return "#";
    }
  };

  const resolveHomeSectionHref = (hash = "") => {
    const homeHref = resolveRouteHref("HOME");
    return homeHref === "#" ? "#" : `${homeHref}${hash}`;
  };

  return (
    <header className="header main-header" id="header">
      <div className="header-util" id="index-header-util">
        <a
          href={resolveRouteHref("AUTH.LOGIN", { shell: "main" })}
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
          href={resolveRouteHref("AUTH.SIGNUP", { shell: "main" })}
          className="util-link route-link"
          data-route="AUTH.SIGNUP"
          data-route-params='{"shell":"main"}'
          data-lang="signup"
        >
          회원가입
        </a>
        <span className="util-divider">|</span>
        <a
          href="#"
          className="util-link route-link"
          data-action="OPEN_RESERVATION_DRAWER"
          data-lang="reservationCheck"
          id="indexReservationCheckBtn"
        >
          예약 확인
        </a>
        <span className="util-divider">|</span>
        <a
          href={resolveRouteHref("CS.CUSTOMER_CENTER")}
          className="util-link route-link"
          data-route="CS.CUSTOMER_CENTER"
          data-lang="customerCenter"
        >
          고객센터
        </a>
      </div>

      <div className="header-inner">
        <div className="logo">
          <a href={resolveHomeSectionHref()} className="logo-link route-link" data-route="HOME">
            <img className="logo-img" src={`${basePath}jejustay/images/logo_jejuGP_wide.png`} alt="제주그룹" />
          </a>
        </div>

        <nav className="gnb" id="gnb">
          <ul className="gnb-list">
            <li className="gnb-item">
              <a href={resolveHomeSectionHref("#section-2")} className="gnb-link" data-lang="navAir">
                제주항공
              </a>
            </li>
            <li className="gnb-item">
              <a href={resolveHomeSectionHref("#section-3")} className="gnb-link" data-lang="navHotel">
                제주 스테이
              </a>
            </li>
            <li className="gnb-item">
              <a href={resolveHomeSectionHref("#section-4")} className="gnb-link" data-lang="navRentCar">
                제주 렌트카
              </a>
            </li>
            <li className="gnb-item">
              <a href={resolveHomeSectionHref("#section-5")} className="gnb-link" data-lang="navMembership">
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
          <a
            href={resolveRouteHref("MYPAGE.DASHBOARD", { shell: "main" })}
            className="weather-header-btn mypage-cta route-link"
            data-route="MYPAGE.DASHBOARD"
            data-route-params='{"shell":"main"}'
            aria-label="마이페이지"
          >
            <span className="mypage-cta-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path
                  d="M4 11.5 12 4l8 7.5v7.5a1 1 0 0 1-1 1h-4.5v-5.2H9.5V20H5a1 1 0 0 1-1-1z"
                  fill="currentColor"
                />
                <path
                  d="M11 20v-4.2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};
