import { SearchCalendarPopup } from "@front-components/search/SearchCalendarPopup";
import { useLifeSearchWidget } from "./LifeSearchWidgetContext";
import { LIFE_FLEXIBLE_OPTIONS } from "./lifeSearchWidgetData";

const CALENDAR_WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

const formatCalendarMonthLabel = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

export const LifeSearchWidgetCalendarPopup = () => {
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
    confirmCalendar,
    calendarWarning
  } = useLifeSearchWidget();

  return (
    <SearchCalendarPopup
      calendar={state.calendar}
      clearButtonId="btn-clear"
      confirmButtonId="btn-confirm"
      flexibleOptions={LIFE_FLEXIBLE_OPTIONS}
      footerStartContent={
        calendarWarning ? (
          <span className="warning-text" data-warning="long-stay">
            {calendarWarning}
          </span>
        ) : null
      }
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
      weekStartsOn="monday"
      weekdayLabels={CALENDAR_WEEKDAY_LABELS}
    />
  );
};
