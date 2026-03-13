import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { HotelSearchWidgetCalendarPopup } from "./HotelSearchWidgetCalendarPopup";
import { HotelSearchWidgetDestinationDropdown } from "./HotelSearchWidgetDestinationDropdown";
import { HotelSearchWidgetGuestPopup } from "./HotelSearchWidgetGuestPopup";

export const HotelSearchFormHotel = () => {
  const {
    state,
    checkInLabel,
    checkOutLabel,
    guestSummary,
    setDestinationValue,
    openDestinationInput,
    toggleDestination,
    toggleGuest,
    toggleCalendar
  } = useHotelSearchWidget();

  return (
    <div className={`search-form-new${state.activeTab === "activity" ? " hidden" : ""}`} id="searchFormHotel">
      <div className="global-search-container">
        <div className="global-search-bar">
          <div className="search-item destination-item-new" id="destinationFieldLarge" onClick={toggleDestination}>
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="search" />
            </div>
            <div className="item-content">
              <label className="item-label" data-lang="destLabel">
                여행지
              </label>
              <input
                autoComplete="off"
                className="item-input"
                data-lang-placeholder="destPlaceholder"
                id="destinationInput"
                placeholder="어디로 떠나시나요?"
                type="text"
                value={state.destinationValue}
                onChange={(event) => {
                  setDestinationValue(event.target.value);
                }}
                onClick={openDestinationInput}
              />
            </div>
            <HotelSearchWidgetDestinationDropdown />
          </div>

          <div className="search-divider"></div>

          <div className="search-item date-item-new" id="checkInField" onClick={toggleCalendar}>
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="calendar" />
            </div>
            <div className="item-content">
              <label className="item-label" data-lang="dateLabel">
                체크인 - 체크아웃
              </label>
              <div className="date-display-text">
                <span data-lang="dateSelect" id="checkInDisplay">{checkInLabel}</span>
                <span className="date-separator"> - </span>
                <span data-lang="dateSelect" id="checkOutDisplay">{checkOutLabel}</span>
              </div>
            </div>
            <HotelSearchWidgetCalendarPopup />
          </div>

          <div className="search-divider"></div>

          <div className="search-item guest-item-new" id="guestFieldLarge" onClick={toggleGuest}>
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="users" />
            </div>
            <div className="item-content">
              <label className="item-label" data-lang="guestLabel">
                여행자
              </label>
              <div className="guest-display-text">
                <span id="guestSummary">{guestSummary}</span>
              </div>
            </div>
            <HotelSearchWidgetGuestPopup />
          </div>

          <div className="search-btn-wrapper">
            <button className="search-btn-pill" id="searchBtn">
              <HotelShellIcon className="search-btn-icon" name="search" />
              <span className="search-btn-text" data-lang="searchBtn">
                검색
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
