import { HotelMegaMenuItem } from "@front-components/layout/HotelMegaMenuItem";
import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { HOTEL_MOBILE_NAV_ITEMS, HOTEL_NAV_ITEMS } from "@front-components/layout/hotelHeaderData";

interface HotelHeaderTemplateProps {
  basePath: string;
}

export const HotelHeaderTemplate = ({ basePath }: HotelHeaderTemplateProps) => {
  return (
    <header className="header hotel-shell-header" id="header">
      <div className="hotel-shell-header-container">
        <a href="#" className="hotel-shell-logo route-link" data-route="SERVICES.STAY.MAIN">
          <img src={`${basePath}jejustay/images/logo_jejuhotel.png`} alt="JEJU STAY" className="hotel-shell-logo-img" />
        </a>

        <nav className="hotel-shell-main-nav">
          <ul className="hotel-shell-nav-list">
            {HOTEL_NAV_ITEMS.map((item) => (
              <HotelMegaMenuItem key={`${item.route}-${item.dataLang}`} item={item} />
            ))}
          </ul>
        </nav>

        <div className="hotel-shell-header-utils">
          <a
            href="#"
            className="hotel-shell-util-link admin-link route-link"
            data-route="ADMIN.DASHBOARD"
            id="headerAdminBtn"
            style={{ display: "none" }}
          >
            <HotelShellIcon name="shield-check" className="hotel-shell-util-icon" />
            <span>관리자 페이지</span>
          </a>

          <a href="#" className="hotel-shell-util-link route-link" data-action="OPEN_RESERVATION_DRAWER">
            <HotelShellIcon name="clipboard-list" className="hotel-shell-util-icon" />
            <span data-lang="navResCheck">예약 확인</span>
          </a>

          <a
            href="#"
            className="hotel-shell-util-link route-link"
            data-route="AUTH.LOGIN"
            data-route-params='{"shell":"main"}'
            id="headerLoginBtn"
          >
            <HotelShellIcon name="user" className="hotel-shell-util-icon" />
            <span data-lang="navLogin">로그인</span>
          </a>

          <a href="#" className="hotel-shell-util-link route-link" data-route="CS.CUSTOMER_CENTER">
            <HotelShellIcon name="headphones" className="hotel-shell-util-icon" />
            <span data-lang="navCs">고객센터</span>
          </a>
        </div>

        <button className="hotel-shell-mobile-menu-btn" id="mobileMenuBtn" aria-label="메뉴 열기">
          <HotelShellIcon name="menu" className="hotel-shell-util-icon" />
        </button>
      </div>

      <div className="hotel-shell-mobile-nav" id="mobileNav">
        <ul className="hotel-shell-mobile-nav-list">
          {HOTEL_MOBILE_NAV_ITEMS.map((item) => (
            <li key={`${item.route ?? item.action ?? item.dataLang}-${item.dataLang}`}>
              <a
                href="#"
                className={`hotel-shell-mobile-nav-link route-link${item.active ? " active" : ""}`}
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
