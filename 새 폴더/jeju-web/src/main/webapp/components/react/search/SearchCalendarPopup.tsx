import { useMemo } from "react";
import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { buildRangeDatePickerMonths } from "./rangeDatePicker";
import type {
  SearchCalendarTab,
  SearchFlexibleOption,
  SearchRangeDatePickerState,
  SearchWeekStartsOn
} from "./types";

interface SearchCalendarPopupProps {
  popupId: string;
  monthsContainerId: string;
  panelCalendarId: string;
  panelFlexibleId: string;
  prevButtonId: string;
  nextButtonId: string;
  clearButtonId: string;
  confirmButtonId: string;
  tabCalendarId: string;
  tabFlexibleId: string;
  flexibleOptions: SearchFlexibleOption[];
  calendar: SearchRangeDatePickerState;
  onInteract: (event: React.MouseEvent<HTMLElement>) => void;
  onClear: () => void;
  onConfirm: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onTabChange: (tab: SearchCalendarTab) => void;
  onFlexibleOptionSelect: (value: string) => void;
  onDateSelect: (timestamp: number) => void;
  onDateHover: (timestamp: number) => void;
  onDateHoverLeave: () => void;
  dialogLabel?: string;
  weekStartsOn?: SearchWeekStartsOn;
  weekdayLabels?: string[] | null;
  monthLabelFormatter?: ((date: Date) => string) | null;
  monthsToRender?: number;
  footerStartContent?: React.ReactNode;
}

export const SearchCalendarPopup = ({
  popupId,
  monthsContainerId,
  panelCalendarId,
  panelFlexibleId,
  prevButtonId,
  nextButtonId,
  clearButtonId,
  confirmButtonId,
  tabCalendarId,
  tabFlexibleId,
  flexibleOptions,
  calendar,
  onInteract,
  onClear,
  onConfirm,
  onPreviousMonth,
  onNextMonth,
  onTabChange,
  onFlexibleOptionSelect,
  onDateSelect,
  onDateHover,
  onDateHoverLeave,
  dialogLabel = "체크인 날짜 선택 달력",
  weekStartsOn = "sunday",
  weekdayLabels = null,
  monthLabelFormatter = null,
  monthsToRender = 2,
  footerStartContent = null
}: SearchCalendarPopupProps) => {
  const isCalendarTab = calendar.activeTab === "calendar";
  const monthViews = useMemo(() => {
    return buildRangeDatePickerMonths({
      visibleMonth: calendar.visibleMonth,
      checkIn: calendar.tempCheckIn,
      checkOut: calendar.tempCheckOut,
      hoverDate: calendar.hoverDate,
      monthsToRender,
      weekStartsOn,
      weekdayLabels,
      monthLabelFormatter
    });
  }, [
    calendar.hoverDate,
    calendar.tempCheckIn,
    calendar.tempCheckOut,
    calendar.visibleMonth,
    monthLabelFormatter,
    monthsToRender,
    weekStartsOn,
    weekdayLabels
  ]);

  return (
    <div
      aria-label={dialogLabel}
      aria-modal="true"
      className={`Popup RangePicker RangePicker--checkIn RangePicker--with-dayuse${calendar.isOpen ? " active" : ""}`}
      id={popupId}
      onClick={onInteract}
      role="dialog"
    >
      <div className="Popup__content Popup__content_Occupancy">
        <span className="ScreenReaderOnly">
          엔터 키를 눌러 캘린더를 여세요. 방향키를 사용해 체크인 및 체크아웃 날짜를 탐색할 수 있습니다.
        </span>
        <div className="RangePicker-Header">
          <div className="RangePicker-NavPrev">
            <button
              aria-label="이전 달"
              className="NavBtn NavBtn--prev"
              id={prevButtonId}
              onClick={onPreviousMonth}
              type="button"
            >
              <HotelShellIcon className="calendar-nav-icon" name="chevron-left" />
            </button>
          </div>
          <div className="RangePicker-Tabs" role="tablist">
            <div className="RangePicker-Tab Item">
              <button
                aria-selected={isCalendarTab}
                className={`TabBtn${isCalendarTab ? " active" : ""}`}
                data-lang="calTitle"
                id={tabCalendarId}
                onClick={() => {
                  onTabChange("calendar");
                }}
                role="tab"
                type="button"
              >
                캘린더
              </button>
              <div className="TabIndicator"></div>
            </div>
            <div className="RangePicker-Tab Item">
              <button
                aria-selected={!isCalendarTab}
                className={`TabBtn${!isCalendarTab ? " active" : ""}`}
                data-lang="calFlexible"
                id={tabFlexibleId}
                onClick={() => {
                  onTabChange("flexible");
                }}
                role="tab"
                type="button"
              >
                날짜 미정
              </button>
            </div>
          </div>
          <div className="RangePicker-NavNext">
            <button
              aria-label="다음 달"
              className="NavBtn NavBtn--next"
              id={nextButtonId}
              onClick={onNextMonth}
              type="button"
            >
              <HotelShellIcon className="calendar-nav-icon" name="chevron-right" />
            </button>
          </div>
        </div>

        <div className={`RangePicker-Panel${isCalendarTab ? " active" : ""}`} id={panelCalendarId} role="tabpanel">
          <div className="DayPicker" id="dayPickerContainer" onMouseLeave={onDateHoverLeave}>
            <div className="DayPicker-wrapper">
              <div className="DayPicker-Months" id={monthsContainerId}>
                {monthViews.map((monthView) => (
                  <div className="DayPicker-Month" key={monthView.key}>
                    <div className="DayPicker-Caption">{monthView.label}</div>
                    <div className="DayPicker-Weekdays">
                      {monthView.weekdays.map((weekday) => (
                        <div className="DayPicker-Weekday" key={`${monthView.key}-${weekday}`}>
                          {weekday}
                        </div>
                      ))}
                    </div>
                    <div className="DayPicker-Body">
                      {monthView.days.map((day) => {
                        const classNames = ["DayPicker-Day"];

                        if (day.isOutside) {
                          classNames.push("DayPicker-Day--outside");
                        }
                        if (day.isDisabled) {
                          classNames.push("DayPicker-Day--disabled");
                        }
                        if (day.isToday) {
                          classNames.push("DayPicker-Day--today");
                        }
                        if (day.isSelected) {
                          classNames.push("DayPicker-Day--selected");
                        }
                        if (day.isCheckIn) {
                          classNames.push("DayPicker-Day--checkIn");
                        }
                        if (day.isCheckOut) {
                          classNames.push("DayPicker-Day--checkOut");
                        }
                        if (day.isInRange) {
                          classNames.push("DayPicker-Day--inRange");
                        }
                        if (day.isHoverRange) {
                          classNames.push("DayPicker-Day--hoverRange");
                        }
                        if (day.isHoverEnd) {
                          classNames.push("DayPicker-Day--hoverEnd");
                        }
                        if (day.hasRange) {
                          classNames.push("DayPicker-Day--hasRange");
                        }

                        if (day.isOutside || day.timestamp === null) {
                          return <div aria-hidden="true" className={classNames.join(" ")} key={day.key}></div>;
                        }

                        return (
                          <button
                            aria-label={day.ariaLabel}
                            className={classNames.join(" ")}
                            data-day={day.day ?? undefined}
                            data-timestamp={day.timestamp}
                            disabled={day.isDisabled}
                            key={day.key}
                            onClick={() => {
                              onDateSelect(day.timestamp as number);
                            }}
                            onMouseEnter={() => {
                              onDateHover(day.timestamp as number);
                            }}
                            type="button"
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="RangePicker-Footer">
            {footerStartContent ? <div className="RangePicker-FooterMeta">{footerStartContent}</div> : null}
            <div className="RangePicker-FooterActions">
              <button className="ActionBtn ActionBtn--clear" id={clearButtonId} onClick={onClear} type="button">
                <span data-lang="btnReset">선택 해제</span>
              </button>
              <button className="ActionBtn ActionBtn--confirm" id={confirmButtonId} onClick={onConfirm} type="button">
                <span data-lang="btnConfirm">확인</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`RangePicker-Panel${!isCalendarTab ? " active" : ""}`} id={panelFlexibleId} role="tabpanel">
          <div className="Flexible-Content">
            <h3 data-lang="calFlexTitle">투숙 기간은 얼마나 되시나요?</h3>
            <div className="Flexible-Options">
              {flexibleOptions.map((option) => (
                <button
                  className={`Flexible-Option${calendar.flexibleValue === option.value ? " active" : ""}`}
                  data-lang={option.dataLang}
                  data-val={option.value}
                  key={option.value}
                  onClick={() => {
                    onFlexibleOptionSelect(option.value);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
