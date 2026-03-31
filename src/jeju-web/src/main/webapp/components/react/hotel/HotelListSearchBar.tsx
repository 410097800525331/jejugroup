import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { HotelSearchWidgetCalendarPopup } from "./HotelSearchWidgetCalendarPopup";
import { HotelSearchWidgetDestinationDropdown } from "./HotelSearchWidgetDestinationDropdown";
import { HotelSearchWidgetGuestPopup } from "./HotelSearchWidgetGuestPopup";

export const HotelListSearchBar = () => {
  const {
    state,
    checkInLabel,
    checkOutLabel,
    guestSummary,
    setDestinationValue,
    openDestinationInput,
    toggleDestination,
    toggleGuest,
    toggleCalendar,
    submitSearch
  } = useHotelSearchWidget();

  return (
    <div className="search-form-new hotel-list-search-form" id="hotelListSearchForm">
      <div className="global-search-container">
        <div className="global-search-bar hotel-list-search-bar">
          <div
            className="search-item destination-item-new hotel-list-search-item"
            id="hotelListDestinationField"
            onClick={toggleDestination}
          >
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="search" />
            </div>
            <div className="item-content">
              <label className="item-label" htmlFor="hotelListDestinationInput">
                여행지
              </label>
              <input
                autoComplete="off"
                className="item-input"
                id="hotelListDestinationInput"
                placeholder="도시, 지역, 숙소명을 검색하세요"
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

          <div
            className="search-item date-item-new hotel-list-search-item"
            id="hotelListCheckInField"
            onClick={toggleCalendar}
          >
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="calendar" />
            </div>
            <div className="item-content">
              <label className="item-label">숙박 일정</label>
              <div className="date-display-text">
                <span id="hotelListCheckInDisplay">{checkInLabel}</span>
                <span className="date-separator"> - </span>
                <span id="hotelListCheckOutDisplay">{checkOutLabel}</span>
              </div>
            </div>
            <HotelSearchWidgetCalendarPopup />
          </div>

          <div className="search-divider"></div>

          <div
            className="search-item guest-item-new hotel-list-search-item"
            id="hotelListGuestField"
            onClick={toggleGuest}
          >
            <div className="item-icon">
              <HotelShellIcon className="search-field-icon" name="users" />
            </div>
            <div className="item-content">
              <label className="item-label">투숙 인원</label>
              <div className="guest-display-text">
                <span id="hotelListGuestSummary">{guestSummary}</span>
              </div>
            </div>
            <HotelSearchWidgetGuestPopup />
          </div>

          <div className="search-btn-wrapper">
            <button
              className="search-btn-pill hotel-list-search-submit"
              id="hotelListSearchBtn"
              onClick={submitSearch}
              type="button"
            >
              <HotelShellIcon className="search-btn-icon" name="search" />
              <span className="search-btn-text">검색</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
