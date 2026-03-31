import type {
  SearchRangeDatePickerState,
  SearchRangeMonthView,
  SearchWeekStartsOn
} from "./types";

interface BuildRangeDatePickerMonthsOptions {
  visibleMonth: number;
  checkIn: number | null;
  checkOut: number | null;
  hoverDate: number | null;
  monthsToRender?: number;
  weekStartsOn?: SearchWeekStartsOn;
  weekdayLabels?: string[] | null;
  monthLabelFormatter?: ((date: Date) => string) | null;
  today?: number;
}

interface NextRangeSelectionOptions {
  tempCheckIn: number | null;
  tempCheckOut: number | null;
}

const DEFAULT_WEEKDAY_LABELS: Record<SearchWeekStartsOn, string[]> = {
  monday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  sunday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
};

export const normalizeDayTimestamp = (value: Date | number) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const getMonthStartTimestamp = (value: Date | number) => {
  const date = new Date(value);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const shiftVisibleMonth = (visibleMonth: number, offset: number) => {
  const date = new Date(visibleMonth);
  date.setMonth(date.getMonth() + offset, 1);
  return getMonthStartTimestamp(date);
};

export const createRangeDatePickerState = (
  overrides: Partial<SearchRangeDatePickerState> = {}
): SearchRangeDatePickerState => {
  const visibleMonthBase = overrides.checkIn ?? overrides.tempCheckIn ?? overrides.visibleMonth ?? Date.now();
  const resolvedVisibleMonth = getMonthStartTimestamp(overrides.visibleMonth ?? visibleMonthBase);
  const defaultState: SearchRangeDatePickerState = {
    isOpen: false,
    activeTab: "calendar",
    visibleMonth: resolvedVisibleMonth,
    hoverDate: null,
    checkIn: null,
    checkOut: null,
    tempCheckIn: null,
    tempCheckOut: null,
    flexibleValue: null
  };

  return {
    ...defaultState,
    ...overrides,
    visibleMonth: resolvedVisibleMonth
  };
};

export const getDefaultWeekdayLabels = (weekStartsOn: SearchWeekStartsOn = "sunday") => {
  return DEFAULT_WEEKDAY_LABELS[weekStartsOn];
};

export const getNextRangeSelection = ({ tempCheckIn, tempCheckOut }: NextRangeSelectionOptions, timestamp: number) => {
  const normalizedTimestamp = normalizeDayTimestamp(timestamp);

  if (!tempCheckIn || tempCheckOut) {
    return {
      tempCheckIn: normalizedTimestamp,
      tempCheckOut: null,
      hoverDate: null
    };
  }

  if (normalizedTimestamp < tempCheckIn) {
    return {
      tempCheckIn: normalizedTimestamp,
      tempCheckOut: null,
      hoverDate: null
    };
  }

  if (normalizedTimestamp > tempCheckIn) {
    return {
      tempCheckIn,
      tempCheckOut: normalizedTimestamp,
      hoverDate: null
    };
  }

  return {
    tempCheckIn,
    tempCheckOut,
    hoverDate: null
  };
};

const getMonthOffset = (dayIndex: number, weekStartsOn: SearchWeekStartsOn) => {
  return weekStartsOn === "monday" ? (dayIndex === 0 ? 6 : dayIndex - 1) : dayIndex;
};

const formatMonthLabel = (date: Date, monthLabelFormatter?: ((date: Date) => string) | null) => {
  if (typeof monthLabelFormatter === "function") {
    return monthLabelFormatter(date);
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const createDayAriaLabel = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const buildRangeDatePickerMonths = ({
  visibleMonth,
  checkIn,
  checkOut,
  hoverDate,
  monthsToRender = 2,
  weekStartsOn = "sunday",
  weekdayLabels = null,
  monthLabelFormatter = null,
  today = normalizeDayTimestamp(Date.now())
}: BuildRangeDatePickerMonthsOptions): SearchRangeMonthView[] => {
  const normalizedToday = normalizeDayTimestamp(today);
  const previewEnd = checkIn && !checkOut && hoverDate && hoverDate > checkIn ? hoverDate : null;
  const labels = Array.isArray(weekdayLabels) && weekdayLabels.length === 7 ? weekdayLabels : getDefaultWeekdayLabels(weekStartsOn);

  return Array.from({ length: monthsToRender }, (_, offset) => {
    const monthDate = new Date(visibleMonth);
    monthDate.setMonth(monthDate.getMonth() + offset, 1);

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = getMonthOffset(firstDay, weekStartsOn);
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let index = 0; index < startOffset; index += 1) {
      days.push({
        key: `${year}-${month + 1}-outside-${index}`,
        label: "",
        ariaLabel: "",
        timestamp: null,
        day: null,
        isOutside: true,
        isDisabled: true,
        isToday: false,
        isSelected: false,
        isCheckIn: false,
        isCheckOut: false,
        isInRange: false,
        isHoverRange: false,
        isHoverEnd: false,
        hasRange: false
      });
    }

    for (let day = 1; day <= lastDate; day += 1) {
      const currentDate = new Date(year, month, day);
      const timestamp = normalizeDayTimestamp(currentDate);
      const isCheckIn = checkIn === timestamp;
      const isCheckOut = checkOut === timestamp;
      const isHoverEnd = previewEnd === timestamp;
      const hasRange = (isCheckIn && Boolean(checkOut || previewEnd)) || (isCheckOut && Boolean(checkIn));

      days.push({
        key: `${year}-${month + 1}-${day}`,
        label: String(day),
        ariaLabel: createDayAriaLabel(currentDate),
        timestamp,
        day,
        isOutside: false,
        isDisabled: timestamp < normalizedToday,
        isToday: timestamp === normalizedToday,
        isSelected: isCheckIn || isCheckOut,
        isCheckIn,
        isCheckOut,
        isInRange: Boolean(checkIn && checkOut && timestamp > checkIn && timestamp < checkOut),
        isHoverRange: Boolean(previewEnd && checkIn && timestamp > checkIn && timestamp < previewEnd),
        isHoverEnd,
        hasRange
      });
    }

    return {
      key: `${year}-${month + 1}`,
      label: formatMonthLabel(monthDate, monthLabelFormatter),
      weekdays: labels,
      days
    };
  });
};
