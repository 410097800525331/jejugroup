import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import type { SearchGuestRow } from "./types";

interface SearchGuestPopupProps {
  popupId: string;
  isOpen: boolean;
  rows: SearchGuestRow[];
  values: Record<string, number>;
  onAdjust: (key: string, delta: number, event: React.MouseEvent<HTMLButtonElement>) => void;
  onInteract: (event: React.MouseEvent<HTMLElement>) => void;
}

export const SearchGuestPopup = ({ popupId, isOpen, rows, values, onAdjust, onInteract }: SearchGuestPopupProps) => {
  return (
    <div className={`guest-popup-new${isOpen ? " active" : ""}`} id={popupId} onClick={onInteract}>
      {rows.map((row) => (
        <div className="guest-row-new" key={row.key}>
          <div className="guest-info-new">
            <span className="guest-type-new" data-lang={row.titleLang}>
              {row.title}
            </span>
            {row.description ? (
              <span className="guest-desc-new" data-lang={row.descriptionLang}>
                {row.description}
              </span>
            ) : null}
          </div>
          <div className="guest-counter-new">
            <button
              className="counter-btn-new minus"
              data-target={row.key}
              onClick={(event) => {
                onAdjust(row.key, -1, event);
              }}
              type="button"
            >
              <HotelShellIcon className="counter-icon" name="minus" />
            </button>
            <span className="counter-value-new" id={`${row.key}CountLarge`}>
              {values[row.key] ?? Number(row.defaultValue ?? "0")}
            </span>
            <button
              className="counter-btn-new plus"
              data-target={row.key}
              onClick={(event) => {
                onAdjust(row.key, 1, event);
              }}
              type="button"
            >
              <HotelShellIcon className="counter-icon" name="plus" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
