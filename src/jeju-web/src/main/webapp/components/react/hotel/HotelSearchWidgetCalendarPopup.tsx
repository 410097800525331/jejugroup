import { SearchCalendarPopup } from "@front-components/search/SearchCalendarPopup";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { FLEXIBLE_OPTIONS } from "./searchWidgetData";

const CALENDAR_WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const formatCalendarMonthLabel = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

export const HotelSearchWidgetCalendarPopup = () => {
  const {
    state,
    stopPropagation,
    showPreviousMonth,
    showNextMonth,
    setCalendarTab,
    selectFlexibleOption,
    selectCalendarDate,
    setCalendarHoverDate,
    clearCalendarHoverDate,
    clearCalendar,
    confirmCalendar
  } = useHotelSearchWidget();

  return (
    <SearchCalendarPopup
      calendar={state.calendar}
      clearButtonId="btn-clear"
      confirmButtonId="btn-confirm"
      flexibleOptions={FLEXIBLE_OPTIONS}
      monthLabelFormatter={formatCalendarMonthLabel}
      monthsContainerId="calendarMonths"
      nextButtonId="nextMonth"
      onClear={clearCalendar}
      onConfirm={confirmCalendar}
      onDateHover={setCalendarHoverDate}
      onDateHoverLeave={clearCalendarHoverDate}
      onDateSelect={selectCalendarDate}
      onFlexibleOptionSelect={selectFlexibleOption}
      onInteract={stopPropagation}
      onNextMonth={showNextMonth}
      onPreviousMonth={showPreviousMonth}
      onTabChange={setCalendarTab}
      panelCalendarId="panel-calendar"
      panelFlexibleId="panel-flexible"
      popupId="calendarPopup"
      prevButtonId="prevMonth"
      tabCalendarId="tab-calendar"
      tabFlexibleId="tab-flexible"
      weekStartsOn="sunday"
      weekdayLabels={CALENDAR_WEEKDAY_LABELS}
    />
  );
};
