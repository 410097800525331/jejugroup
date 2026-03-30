import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { getDestinationSuggestionColumns } from "../../../shared/destination/destinationSearch.js";
import { DESTINATION_COLUMNS } from "@front-components/hotel/searchWidgetData";
import { SearchDestinationDropdown } from "@front-components/search/SearchDestinationDropdown";
import { LifeSearchWidgetProvider, useLifeSearchWidget } from "./LifeSearchWidgetContext";
import { LifeSearchWidgetCalendarPopup } from "./LifeSearchWidgetCalendarPopup";
import { LifeSearchWidgetGuestPopup } from "./LifeSearchWidgetGuestPopup";
import { LifeSearchWidgetOptionsPopup } from "./LifeSearchWidgetOptionsPopup";

const LifeSearchWidgetContent = () => {
  const {
    state,
    guestSummary,
    requiredOptionsSummary,
    checkInLabel,
    checkOutLabel,
    searchButtonTitle,
    ensureDestinationOpen,
    setDestinationValue,
    openDestinationInput,
    toggleDestination,
    selectDestination,
    stopPropagation,
    toggleGuest,
    toggleOptions,
    toggleCalendar,
    submitSearch
  } = useLifeSearchWidget();
  const destinationColumns = getDestinationSuggestionColumns(
    state.destinationValue,
    state.hasTypedDestinationQuery,
    DESTINATION_COLUMNS
  );

  return (
    <div className="search-widget-large long-stay-search-widget">
      <div className="search-widget-v2">
        <div className="global-search-bar-v2" id="mnSearchForm">
          <div className={`search-item-v2${state.isDestinationOpen ? " active" : ""}`} id="destinationFieldLarge" onClick={toggleDestination}>
            <div className="item-icon-v2">
              <HotelShellIcon className="life-search-icon" name="map-pin" />
            </div>
            <div className="item-content-v2">
              <label className="item-label-v2" data-lang="lifeDestLabel">
                여행지
              </label>
              <input
                autoComplete="off"
                className="item-input-v2"
                data-lang-placeholder="lifeDestPlaceholder"
                id="destinationInput"
                placeholder="어디로 떠날까요?"
                type="text"
                value={state.destinationValue}
                onFocus={ensureDestinationOpen}
                onChange={(event) => {
                  setDestinationValue(event.target.value);
                }}
                onClick={openDestinationInput}
              />
            </div>
            <SearchDestinationDropdown
              columns={destinationColumns}
              dropdownId="destinationDropdown"
              isOpen={state.isDestinationOpen}
              onInteract={stopPropagation}
              onSelect={selectDestination}
            />
          </div>

          <div className="v2-divider"></div>

          <div className={`search-item-v2${state.calendar.isOpen ? " active" : ""}`} id="checkInField" onClick={toggleCalendar}>
            <div className="item-icon-v2">
              <HotelShellIcon className="life-search-icon" name="calendar" />
            </div>
            <div className="item-content-v2">
              <label className="item-label-v2" data-lang="lifeScheduleLabel">
                일정
              </label>
              <div className="display-text-v2">
                <span data-lang="dateSelect" id="checkInDisplay">
                  {checkInLabel}
                </span>
                <span> - </span>
                <span data-lang="dateSelect" id="checkOutDisplay">
                  {checkOutLabel}
                </span>
              </div>
            </div>
            <LifeSearchWidgetCalendarPopup />
          </div>

          <div className="v2-divider"></div>

          <div className={`search-item-v2${state.isGuestOpen ? " active" : ""}`} id="guestFieldLarge" onClick={toggleGuest}>
            <div className="item-icon-v2">
              <HotelShellIcon className="life-search-icon" name="users" />
            </div>
            <div className="item-content-v2">
              <label className="item-label-v2" data-lang="lifeGuestLabel">
                여행자
              </label>
              <div className="display-text-v2" id="guestSummary">
                {guestSummary}
              </div>
            </div>
            <LifeSearchWidgetGuestPopup />
          </div>

          <div className="v2-divider"></div>

          <div className={`search-item-v2${state.isOptionsOpen ? " active" : ""}`} id="optionsFieldLarge" onClick={toggleOptions}>
            <div className="item-icon-v2">
              <HotelShellIcon className="life-search-icon" name="sliders-horizontal" />
            </div>
            <div className="item-content-v2">
              <label className="item-label-v2" data-lang="lifeOptionsLabel">
                필수 옵션
              </label>
              <div className="display-text-v2" id="optionsSummary">
                {requiredOptionsSummary}
              </div>
            </div>
            <LifeSearchWidgetOptionsPopup />
          </div>

          <div className="search-btn-wrapper-v2">
            <button className="search-btn-v2" id="searchBtn" onClick={submitSearch} title={searchButtonTitle} type="button">
              <HotelShellIcon className="life-search-button-icon" name="search" />
              <span data-lang="btnSearch">검색하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LifeSearchWidget = () => {
  return (
    <LifeSearchWidgetProvider>
      <LifeSearchWidgetContent />
    </LifeSearchWidgetProvider>
  );
};
