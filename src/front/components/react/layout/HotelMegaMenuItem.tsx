import { HotelNavItem } from "@front-components/layout/hotelHeaderData";
import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";

interface HotelMegaMenuItemProps {
  item: HotelNavItem;
}

export const HotelMegaMenuItem = ({ item }: HotelMegaMenuItemProps) => {
  return (
    <li className="hotel-shell-nav-item">
      <a href="#" className="hotel-shell-nav-link route-link" data-route={item.route}>
        <span className="hotel-shell-nav-icon-roll stagger-wrapper" aria-hidden="true">
          <span className="hotel-shell-nav-icon-layer stagger-original">
            <HotelShellIcon name={item.icon} className="hotel-shell-nav-icon" />
          </span>
          <span className="hotel-shell-nav-icon-layer stagger-clone">
            <HotelShellIcon name={item.icon} className="hotel-shell-nav-icon" />
          </span>
        </span>
        <span data-lang={item.dataLang}>{item.label}</span>
      </a>

      <div className="hotel-shell-mega-dropdown">
        <div className="hotel-shell-mega-menu-list-container">
          {item.menuItems.map((menuItem) => (
            <a
              key={`${menuItem.route}-${menuItem.previewId}`}
              href="#"
              className="hotel-shell-mega-menu-item route-link"
              data-route={menuItem.route}
              data-preview={menuItem.previewId}
            >
              <HotelShellIcon name={menuItem.icon} className="hotel-shell-mega-menu-icon" />
              <span>{menuItem.label}</span>
              {menuItem.isNew ? <span className="hotel-shell-badge-new">NEW</span> : null}
            </a>
          ))}
        </div>

        <div className="hotel-shell-mega-menu-preview">
          <div className="hotel-shell-preview-loader">
            <i className="fas fa-spinner fa-spin" />
          </div>
          {item.previews.map((preview, index) => (
            <img
              key={preview.id}
              id={preview.id}
              src={preview.src}
              alt={preview.alt}
              className={`hotel-shell-preview-image ${index === 0 ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </li>
  );
};
