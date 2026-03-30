export interface WorldCityDestinationResult {
  source: "world-city";
  region: string;
  label: string;
  countryLabel: string;
  englishLabel: string;
  detailUrl: string;
  displayLabel: string;
}

export interface WorldAirportDestinationResult {
  source: "world-airport";
  region: string;
  regionLabel: string;
  countryLabel: string;
  countryEnglishLabel: string;
  cityLabel: string;
  cityEnglishLabel: string;
  airportLabel: string;
  airportEnglishLabel: string;
  iata: string;
  icao: string;
  displayLabel: string;
}

export declare const normalizeSearchKey: (value: string | null | undefined) => string;
export declare const normalizeSlug: (value: string | null | undefined) => string;
export declare const searchWorldCityDestinations: (query: string) => WorldCityDestinationResult[];
export declare const buildWorldCitySuggestionColumns: (query: string) => {
  title: string;
  titleLang?: string;
  items: {
    value: string;
    image: string;
    alt: string;
    name: string;
    nameLang?: string;
    count: string;
    desc: string;
    descLang?: string;
  }[];
}[];
export declare const getDestinationSuggestionColumns: (
  query: string,
  hasTypedDestinationQuery: boolean,
  fallbackColumns: {
    title: string;
    titleLang?: string;
    items: {
      value: string;
      image: string;
      alt: string;
      name: string;
      nameLang?: string;
      count: string;
      desc: string;
      descLang?: string;
    }[];
  }[]
) => {
  title: string;
  titleLang?: string;
  items: {
    value: string;
    image: string;
    alt: string;
    name: string;
    nameLang?: string;
    count: string;
    desc: string;
    descLang?: string;
  }[];
}[];
export declare const resolveWorldCityDestination: (query: string) => WorldCityDestinationResult | null;
export declare const searchWorldAirportDestinations: (query: string) => WorldAirportDestinationResult[];

declare global {
  interface Window {
    __JEJUGROUP_DESTINATION_SEARCH__?: {
      normalizeSearchKey: typeof normalizeSearchKey;
      buildWorldCitySuggestionColumns: typeof buildWorldCitySuggestionColumns;
      getDestinationSuggestionColumns: typeof getDestinationSuggestionColumns;
      resolveWorldCityDestination: typeof resolveWorldCityDestination;
      searchWorldAirportDestinations: typeof searchWorldAirportDestinations;
      searchWorldCityDestinations: typeof searchWorldCityDestinations;
    };
  }
}

export {};
