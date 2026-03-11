import { HotelMegaMenuItem } from "@front-components/layout/HotelMegaMenuItem";
import { HOTEL_MOBILE_NAV_ITEMS, HOTEL_NAV_ITEMS } from "@front-components/layout/hotelHeaderData";

interface HotelHeaderTemplateProps {
  basePath: string;
}

export const HotelHeaderTemplate = ({ basePath }: HotelHeaderTemplateProps) => {
  return (
    <header className="header hotel-header" id="header">
      <div className="header-container">
        <a href="#" className="logo route-link" data-route="SERVICES.STAY.MAIN">
          <img src={`${basePath}jejustay/images/logo_jejuhotel.png`} alt="JEJU STAY" className="logo-img" />
        </a>

        <nav className="main-nav">
          <ul className="nav-list">
            {HOTEL_NAV_ITEMS.map((item) => (
              <HotelMegaMenuItem key={`${item.route}-${item.dataLang}`} item={item} />
            ))}
          </ul>
        </nav>

        <div className="header-utils">
          <a
            href="#"
            className="util-link admin-link route-link"
            data-route="ADMIN.DASHBOARD"
            id="headerAdminBtn"
            style={{ display: "none" }}
          >
            <i data-lucide="shield-check" className="util-icon" />
            <span>관리자 페이지</span>
          </a>

          <a href="#" className="util-link route-link" data-action="OPEN_RESERVATION_DRAWER">
            <i data-lucide="clipboard-list" className="util-icon" />
            <span data-lang="navResCheck">예약 확인</span>
          </a>

          <a
            href="#"
            className="util-link login-btn route-link"
            data-route="AUTH.LOGIN"
            data-route-params='{"shell":"main"}'
            id="headerLoginBtn"
          >
            <i data-lucide="user" className="util-icon" />
            <span data-lang="navLogin">로그인</span>
          </a>

          <a href="#" className="util-link route-link" data-route="CS.CUSTOMER_CENTER">
            <i data-lucide="headphones" className="util-icon" />
            <span data-lang="navCs">고객센터</span>
          </a>
        </div>

        <button className="mobile-menu-btn" id="mobileMenuBtn" aria-label="메뉴 열기">
          <i data-lucide="menu" />
        </button>
      </div>

      <div className="mobile-nav" id="mobileNav">
        <ul className="mobile-nav-list">
          {HOTEL_MOBILE_NAV_ITEMS.map((item) => (
            <li key={`${item.route ?? item.action ?? item.dataLang}-${item.dataLang}`}>
              <a
                href="#"
                className={`mobile-nav-link route-link${item.active ? " active" : ""}`}
                data-route={item.route}
                data-route-params={item.routeParams}
                data-action={item.action}
                data-lang={item.dataLang}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};
