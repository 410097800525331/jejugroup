export interface SearchTabItem {
  tab: string;
  icon: string;
  dataLang?: string;
  label: string;
}

export interface SearchDestinationEntry {
  value: string;
  image: string;
  alt: string;
  name: string;
  nameLang?: string;
  count: string;
  desc: string;
  descLang?: string;
}

export interface SearchDestinationColumn {
  title: string;
  titleLang?: string;
  items: SearchDestinationEntry[];
}

export interface SearchFlexibleOption {
  value: string;
  dataLang?: string;
  label: string;
}

export interface SearchOptionItem {
  value: string;
  dataLang?: string;
  label: string;
}

export type SearchCalendarTab = "calendar" | "flexible";
export type SearchWeekStartsOn = "monday" | "sunday";

export interface SearchRangeDatePickerState {
  isOpen: boolean;
  activeTab: SearchCalendarTab;
  visibleMonth: number;
  hoverDate: number | null;
  checkIn: number | null;
  checkOut: number | null;
  tempCheckIn: number | null;
  tempCheckOut: number | null;
  flexibleValue: string | null;
}

export interface SearchRangeDayCell {
  key: string;
  label: string;
  ariaLabel: string;
  timestamp: number | null;
  day: number | null;
  isOutside: boolean;
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isCheckIn: boolean;
  isCheckOut: boolean;
  isInRange: boolean;
  isHoverRange: boolean;
  isHoverEnd: boolean;
  hasRange: boolean;
}

export interface SearchRangeMonthView {
  key: string;
  label: string;
  weekdays: string[];
  days: SearchRangeDayCell[];
}

export interface SearchGuestRow {
  key: string;
  title: string;
  titleLang?: string;
  description?: string | null;
  descriptionLang?: string;
  defaultValue?: string;
}
