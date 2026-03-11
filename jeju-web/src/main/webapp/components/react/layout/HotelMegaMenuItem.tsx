import { HotelNavItem } from "@front-components/layout/hotelHeaderData";

interface HotelMegaMenuItemProps {
  item: HotelNavItem;
}

export const HotelMegaMenuItem = ({ item }: HotelMegaMenuItemProps) => {
  return (
    <li className="nav-item">
      <a href="#" className="nav-link route-link" data-route={item.route}>
        <i data-lucide={item.icon} className="nav-icon" />
        <span data-lang={item.dataLang}>{item.label}</span>
      </a>

      <div className="mega-dropdown">
        <div className="mega-menu-list-container">
          {item.menuItems.map((menuItem) => (
            <a
              key={`${menuItem.route}-${menuItem.previewId}`}
              href="#"
              className="mega-menu-item route-link"
              data-route={menuItem.route}
              data-preview={menuItem.previewId}
            >
              <i data-lucide={menuItem.icon} className="mega-menu-icon" />
              <span>{menuItem.label}</span>
              {menuItem.isNew ? <span className="badge-new">NEW</span> : null}
            </a>
          ))}
        </div>

        <div className="mega-menu-preview">
          <div className="preview-loader">
            <i className="fas fa-spinner fa-spin" />
          </div>
          {item.previews.map((preview, index) => (
            <img
              key={preview.id}
              id={preview.id}
              src={preview.src}
              alt={preview.alt}
              className={`preview-image ${index === 0 ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </li>
  );
};
