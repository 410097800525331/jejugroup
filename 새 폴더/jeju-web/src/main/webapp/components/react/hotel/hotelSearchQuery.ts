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
  guest?: Partial<GuestState>;
  calendar?: Partial<CalendarState>;
}

interface HotelDestinationEntry {
  aliases: string[];
  label: string;
  region: string;
}

const HOTEL_DESTINATION_CATALOG: HotelDestinationEntry[] = [
  { region: "hiroshima", label: "히로시마", aliases: ["히로시마", "hiroshima"] },
  { region: "jeju", label: "제주", aliases: ["제주", "제주도", "jeju"] },
  { region: "seoul", label: "서울", aliases: ["서울", "seoul"] },
  { region: "incheon", label: "인천", aliases: ["인천", "incheon"] },
  { region: "busan", label: "부산", aliases: ["부산", "busan"] },
  { region: "sokcho", label: "속초", aliases: ["속초", "sokcho"] },
  { region: "osaka", label: "오사카", aliases: ["오사카", "osaka"] },
  { region: "tokyo", label: "도쿄", aliases: ["도쿄", "동경", "tokyo"] },
  { region: "fukuoka", label: "후쿠오카", aliases: ["후쿠오카", "fukuoka"] },
  { region: "bangkok", label: "방콕", aliases: ["방콕", "bangkok"] },
  { region: "danang", label: "다낭", aliases: ["다낭", "danang", "da nang"] },
  { region: "singapore", label: "싱가포르", aliases: ["싱가포르", "싱가폴", "singapore"] }
];

const normalizeDestinationKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "");

const findDestinationByKeyword = (keyword: string) => {
  const normalizedKeyword = normalizeDestinationKey(keyword);
  if (!normalizedKeyword) {
    return null;
  }

  return (
    HOTEL_DESTINATION_CATALOG.find((entry) =>
      entry.aliases.some((alias) => normalizeDestinationKey(alias) === normalizedKeyword)
    ) ?? null
  );
};

const findDestinationByRegion = (region: string | null) => {
  if (!region) {
    return null;
  }

  const normalizedRegion = normalizeDestinationKey(region);
  return HOTEL_DESTINATION_CATALOG.find((entry) => entry.region === normalizedRegion) ?? null;
};

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
  const resolvedDestination = findDestinationByRegion(region);
  const destinationValue = keyword?.trim() || resolvedDestination?.label || "";

  return {
    destinationValue,
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
  },
  currentSearch = ""
) => {
  const params: Record<string, string | number | string[]> = {};
  const currentParams = new URLSearchParams(currentSearch);
  const shell = readShellParam(currentSearch);
  const destinationValue = input.destinationValue.trim();
  const resolvedDestination = destinationValue ? findDestinationByKeyword(destinationValue) : null;
  const checkIn = formatDateParam(input.calendar.checkIn);
  const checkOut = formatDateParam(input.calendar.checkOut);

  if (shell) {
    params.shell = shell;
  }

  if (destinationValue) {
    params.keyword = destinationValue;
  }

  if (resolvedDestination) {
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
