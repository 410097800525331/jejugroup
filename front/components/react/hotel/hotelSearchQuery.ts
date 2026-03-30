import {
  findHotelDestinationByKeyword,
  findHotelDestinationByRegion,
  resolveHotelDestination
} from "./hotelDestinationCatalog";

type GuestState = {
  adults: number;
  children: number;
  rooms: number;
};

type CalendarState = {
  checkIn: number | null;
  checkOut: number | null;
};

export interface HotelSearchInitialState {
  destinationValue?: string;
  hasTypedDestinationQuery?: boolean;
  guest?: Partial<GuestState>;
  calendar?: Partial<CalendarState>;
}

const parseDateParam = (value: string | null) => {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const timestamp = new Date(year, month, day).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const formatDateParam = (timestamp: number | null) => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseCountParam = (value: string | null, fallback: number, min: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(min, parsed);
};

const readShellParam = (search: string) => {
  const shell = new URLSearchParams(search).get("shell");
  if (shell === "main" || shell === "stay" || shell === "air") {
    return shell;
  }

  return null;
};

export const getHotelSearchInitialStateFromUrl = (search: string): HotelSearchInitialState => {
  const params = new URLSearchParams(search);
  const keyword = params.get("keyword");
  const region = params.get("region");
  const keywordDestination = findHotelDestinationByKeyword(keyword);
  const resolvedDestination = findHotelDestinationByRegion(region) ?? resolveHotelDestination(region, keyword).destination;
  const destinationValue =
    keywordDestination?.label || keyword?.trim() || resolvedDestination?.label || "";

  return {
    destinationValue,
    hasTypedDestinationQuery: Boolean(keyword?.trim()),
    guest: {
      adults: parseCountParam(params.get("adults"), 1, 1),
      children: parseCountParam(params.get("children"), 0, 0),
      rooms: parseCountParam(params.get("rooms"), 1, 1)
    },
    calendar: {
      checkIn: parseDateParam(params.get("checkIn")),
      checkOut: parseDateParam(params.get("checkOut"))
    }
  };
};

export const buildHotelListRouteParams = (
  input: {
    destinationValue: string;
    guest: GuestState;
    calendar: CalendarState;
    resolvedDestination?: {
      countryLabel: string;
      label: string;
      region: string;
    } | null;
  },
  currentSearch = ""
) => {
  const params: Record<string, string | number | string[]> = {};
  const currentParams = new URLSearchParams(currentSearch);
  const shell = readShellParam(currentSearch);
  const destinationValue = input.destinationValue.trim();
  const resolvedDestination = destinationValue ? resolveHotelDestination(null, destinationValue).destination : null;
  const checkIn = formatDateParam(input.calendar.checkIn);
  const checkOut = formatDateParam(input.calendar.checkOut);

  if (shell) {
    params.shell = shell;
  }

  if (destinationValue) {
    params.keyword = destinationValue;
  }

  if (input.resolvedDestination) {
    params.region = input.resolvedDestination.region;
  } else if (resolvedDestination) {
    params.region = resolvedDestination.region;
  }

  if (checkIn) {
    params.checkIn = checkIn;
  }

  if (checkOut) {
    params.checkOut = checkOut;
  }

  params.adults = Math.max(1, input.guest.adults);
  params.children = Math.max(0, input.guest.children);
  params.rooms = Math.max(1, input.guest.rooms);

  const filterValues = currentParams.getAll("filter").filter((value) => value.trim() !== "");
  if (filterValues.length > 0) {
    params.filter = filterValues;
  }

  return params;
};
