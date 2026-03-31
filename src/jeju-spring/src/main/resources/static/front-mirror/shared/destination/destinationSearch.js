import destinationCatalogs from "./generated/destination-catalogs.json";

const CITY_CATALOG = Array.isArray(destinationCatalogs?.cityCatalog) ? destinationCatalogs.cityCatalog : [];
const AIRPORT_CATALOG = Array.isArray(destinationCatalogs?.airportCatalog) ? destinationCatalogs.airportCatalog : [];

const normalizeSearchKey = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "");

const normalizeSlug = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

const scoreTextMatch = (queryKey, candidateKey, exactScore, prefixScore, partialScore) => {
  if (!queryKey || !candidateKey) {
    return 0;
  }

  if (candidateKey === queryKey) {
    return exactScore;
  }

  if (candidateKey.startsWith(queryKey) || queryKey.startsWith(candidateKey)) {
    return prefixScore;
  }

  if (candidateKey.includes(queryKey) || queryKey.includes(candidateKey)) {
    return partialScore;
  }

  return 0;
};

const compareByScore = (left, right) => {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return left.index - right.index;
};

const buildSuggestionColumns = (title, suggestions, toItem) => {
  if (suggestions.length === 0) {
    return [];
  }

  return [
    {
      title,
      items: suggestions.map(toItem)
    }
  ];
};

const toCityResult = (city) => {
  const label = city.label?.trim() || "";
  const countryLabel = city.countryLabel?.trim() || "";
  const englishLabel = city.englishLabel?.trim() || "";

  return {
    source: "world-city",
    region: city.region,
    label,
    countryLabel,
    englishLabel,
    detailUrl: city.detailUrl ?? "",
    displayLabel: countryLabel ? `${label} (${countryLabel})` : label
  };
};

const toAirportResult = (airport) => {
  const cityLabel = airport.cityLabel?.trim() || "";
  const airportLabel = airport.airportLabel?.trim() || "";
  const iata = airport.iata?.trim() || "";

  return {
    source: "world-airport",
    region: airport.region,
    regionLabel: airport.regionLabel?.trim() || "",
    countryLabel: airport.countryLabel?.trim() || "",
    countryEnglishLabel: airport.countryEnglishLabel?.trim() || "",
    cityLabel,
    cityEnglishLabel: airport.cityEnglishLabel?.trim() || "",
    airportLabel,
    airportEnglishLabel: airport.airportEnglishLabel?.trim() || "",
    iata,
    icao: airport.icao?.trim() || "",
    displayLabel: `${cityLabel || airport.cityEnglishLabel || airport.airportEnglishLabel} · ${airportLabel}${iata ? ` (${iata})` : ""}`
  };
};

const scoreCity = (city, queryKey) => {
  const keys = [
    normalizeSearchKey(city.label),
    normalizeSearchKey(city.englishLabel),
    normalizeSearchKey(city.countryLabel),
  ];

  return Math.max(
    scoreTextMatch(queryKey, keys[0], 120, 80, 40),
    scoreTextMatch(queryKey, keys[1], 110, 75, 35),
    scoreTextMatch(queryKey, keys[2], 50, 30, 15)
  );
};

const scoreAirport = (airport, queryKey) => {
  const exactIata = normalizeSearchKey(airport.iata);
  const exactIcao = normalizeSearchKey(airport.icao);
  const airportLabelKey = normalizeSearchKey(airport.airportLabel);
  const airportEnglishKey = normalizeSearchKey(airport.airportEnglishLabel);
  const cityLabelKey = normalizeSearchKey(airport.cityLabel);
  const cityEnglishKey = normalizeSearchKey(airport.cityEnglishLabel);
  const countryLabelKey = normalizeSearchKey(airport.countryLabel);
  const countryEnglishKey = normalizeSearchKey(airport.countryEnglishLabel);

  return Math.max(
    scoreTextMatch(queryKey, exactIata, 220, 0, 0),
    scoreTextMatch(queryKey, exactIcao, 200, 0, 0),
    scoreTextMatch(queryKey, airportLabelKey, 180, 120, 60),
    scoreTextMatch(queryKey, airportEnglishKey, 160, 110, 55),
    scoreTextMatch(queryKey, cityLabelKey, 150, 100, 50),
    scoreTextMatch(queryKey, cityEnglishKey, 140, 95, 45),
    scoreTextMatch(queryKey, countryLabelKey, 60, 40, 20),
    scoreTextMatch(queryKey, countryEnglishKey, 50, 35, 15)
  );
};

export const searchWorldCityDestinations = (query) => {
  const queryKey = normalizeSearchKey(query);
  if (!queryKey) {
    return [];
  }

  return CITY_CATALOG.map((city, index) => ({
    city,
    index,
    score: scoreCity(city, queryKey)
  }))
    .filter((candidate) => candidate.score > 0)
    .sort(compareByScore)
    .slice(0, 8)
    .map((candidate) => toCityResult(candidate.city));
};

export const buildWorldCitySuggestionColumns = (query) => {
  const citySuggestions = searchWorldCityDestinations(query);
  if (citySuggestions.length > 0) {
    return buildSuggestionColumns("추천 도시", citySuggestions, (city) => ({
      value: city.label,
      image: "",
      alt: city.label,
      name: city.label,
      count: city.countryLabel,
      desc: city.englishLabel
    }));
  }

  const airportSuggestions = searchWorldAirportDestinations(query);
  return buildSuggestionColumns("추천 도시", airportSuggestions, (airport) => ({
    value: airport.cityLabel || airport.airportLabel,
    image: "",
    alt: airport.cityLabel || airport.airportLabel,
    name: airport.cityLabel || airport.airportLabel,
    count: airport.countryLabel,
    desc: airport.airportLabel
  }));
};

export const getDestinationSuggestionColumns = (query, hasTypedDestinationQuery, fallbackColumns) => {
  if (!hasTypedDestinationQuery || !String(query ?? "").trim()) {
    return fallbackColumns;
  }

  const columns = buildWorldCitySuggestionColumns(query);
  return columns.length > 0 ? columns : fallbackColumns;
};

export const resolveWorldCityDestination = (query) => {
  return searchWorldCityDestinations(query)[0] ?? null;
};

export function searchWorldAirportDestinations(query) {
  const queryKey = normalizeSearchKey(query);
  if (!queryKey) {
    return [];
  }

  const seen = new Set();

  return AIRPORT_CATALOG.map((airport, index) => ({
    airport,
    index,
    score: scoreAirport(airport, queryKey)
  }))
    .filter((candidate) => candidate.score > 0)
    .sort(compareByScore)
    .map((candidate) => candidate.airport)
    .filter((airport) => {
      const key = `${airport.iata}::${airport.icao}`;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, 8)
    .map((airport) => toAirportResult(airport));
}

if (typeof window !== "undefined") {
  window.__JEJUGROUP_DESTINATION_SEARCH__ = {
    normalizeSearchKey,
    buildWorldCitySuggestionColumns,
    getDestinationSuggestionColumns,
    resolveWorldCityDestination,
    searchWorldAirportDestinations,
    searchWorldCityDestinations
  };
}

export { normalizeSearchKey, normalizeSlug };
