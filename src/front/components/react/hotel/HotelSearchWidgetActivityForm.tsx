import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";

export const HotelSearchFormActivity = () => {
  const { state } = useHotelSearchWidget();

  return (
    <div className={`search-form-new${state.activeTab === "activity" ? "" : " hidden"}`} id="searchFormActivity">
      <div className="global-search-container">
        <div className="global-search-bar">
          <div className="search-item destination-item-new" id="destinationFieldActivity">
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="search" />
            </div>
            <div className="item-content">
              <label className="item-label">떠나고 싶은 곳</label>
              <input
                autoComplete="off"
                className="item-input"
                id="destinationInputActivity"
                placeholder="액티비티, 체험 명 검색"
                type="text"
              />
            </div>
          </div>

          <div className="search-btn-wrapper">
            <button className="search-btn-pill" id="searchBtnActivity">
              <HotelShellIcon className="search-btn-icon" name="search" />
              <span className="search-btn-text">검색</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
