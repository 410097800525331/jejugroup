const fs = require('node:fs/promises');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'front', 'shared', 'destination', 'generated');
const outputFile = path.join(outputDir, 'destination-catalogs.json');
const browserOutputFile = path.join(outputDir, 'destination-airport-search.browser.js');

const CITY_DATA_URL =
  'https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000001601866&fileDetailSn=1&insertDataPrcus=N';
const AIRPORT_DATA_URL =
  'https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000003603602&fileDetailSn=1&insertDataPrcus=N';

const normalizeKey = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '');

const normalizeSlug = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        const next = text[i + 1];
        if (next === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(value);
      value = '';
      continue;
    }

    if (char === '\r') {
      continue;
    }

    if (char === '\n') {
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((cell) => String(cell).trim().length > 0));
};

const decodeCsv = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download CSV: ${url} (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return new TextDecoder('euc-kr').decode(buffer);
};

const buildRowObject = (headers, values) => {
  const result = {};
  headers.forEach((header, index) => {
    result[header] = String(values[index] ?? '').trim();
  });
  return result;
};

const getFirst = (...values) => values.find((value) => String(value ?? '').trim().length > 0) ?? '';

const airportTextFixes = {
  BEL: { airportLabel: '발 데 칸즈 공항' },
  CQF: {
    cityLabel: '칼레 / 됭케르크',
    airportLabel: '칼레 됭케르크 공항',
  },
  KQT: { cityLabel: '쿠르곤테파' },
  MIG: {
    cityLabel: '몐양',
    airportLabel: '몐양 난자오 공항',
  },
  QGY: { airportEnglishLabel: 'Győr-Pér Airport' },
};

const repairAirportRecord = (record) => {
  const fixes = airportTextFixes[record.iata];
  if (!fixes) {
    return record;
  }

  const repairedRecord = { ...record, ...fixes };
  repairedRecord.searchText = normalizeKey(
    [
      repairedRecord.airportEnglishLabel,
      repairedRecord.airportLabel,
      repairedRecord.iata,
      repairedRecord.icao,
      repairedRecord.regionLabel,
      repairedRecord.countryLabel,
      repairedRecord.countryEnglishLabel,
      repairedRecord.cityLabel,
      repairedRecord.cityEnglishLabel,
    ]
      .filter(Boolean)
      .join(' ')
  );

  return repairedRecord;
};

const buildCityCatalog = (rows) => {
  return rows
    .map((row) => {
      const cityLabel = getFirst(row['도시명'], row['도시']);
      const englishLabel = getFirst(row['영문표기'], row['영문명'], row['영문 도시명']);
      const countryLabel = getFirst(row['나라'], row['국가']);
      const detailUrl = getFirst(row['상세페이지 링크'], row['상세페이지링크']);

      if (!cityLabel || !englishLabel || !countryLabel) {
        return null;
      }

      return {
        region: normalizeSlug(englishLabel || cityLabel),
        label: cityLabel,
        countryLabel,
        englishLabel,
        detailUrl,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.label.localeCompare(right.label, 'ko'))
    .reduce((accumulator, entry) => {
      const key = `${entry.label}__${entry.countryLabel}`;
      if (!accumulator.seen.has(key)) {
        accumulator.seen.add(key);
        accumulator.items.push(entry);
      }
      return accumulator;
    }, { seen: new Set(), items: [] }).items;
};

const buildAirportCatalog = (rows) => {
  return rows
    .map((row) => {
      const airportEnglishLabel = getFirst(row['영문공항명'], row['영문명']);
      const airportLabel = getFirst(row['한글공항'], row['한글공항명'], row['한글명']);
      const iata = getFirst(row['공항코드1(IATA)'], row['IATA코드']);
      const icao = getFirst(row['공항코드2(ICAO)'], row['ICAO코드']);
      const regionLabel = getFirst(row['지역'], row['권역']);
      const countryEnglishLabel = getFirst(row['영문국가명'], row['국가명(영문)'], row['국가']);
      const countryLabel = getFirst(row['한글국가명'], row['국가명(한글)'], row['한글국가']);
      const cityEnglishLabel = getFirst(row['영문도시명'], row['도시명(영문)']);
      const cityLabel = getFirst(row['한글도시명'], row['도시명(한글)']);

      if (!airportEnglishLabel || !airportLabel || !iata || !icao) {
        return null;
      }

      const airportRecord = {
        region: normalizeSlug(cityEnglishLabel || airportEnglishLabel),
        regionLabel,
        countryLabel,
        countryEnglishLabel,
        cityLabel,
        cityEnglishLabel,
        airportLabel,
        airportEnglishLabel,
        iata,
        icao,
      };

      airportRecord.searchText = normalizeKey(
        [
          airportEnglishLabel,
          airportLabel,
          iata,
          icao,
          regionLabel,
          countryLabel,
          countryEnglishLabel,
          cityLabel,
          cityEnglishLabel,
        ]
          .filter(Boolean)
          .join(' ')
      );

      return repairAirportRecord(airportRecord);
    })
    .filter(Boolean);
};

const buildAirportBrowserBundle = (airportCatalog) => {
  const serializedAirportCatalog = JSON.stringify(airportCatalog, null, 2);
  return `;(function () {
  const AIRPORT_CATALOG = ${serializedAirportCatalog};

  const normalizeSearchKey = (value) =>
    String(value ?? '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[^a-z0-9\\uAC00-\\uD7A3]+/g, '');

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

  const toAirportResult = (airport) => {
    const cityLabel = airport.cityLabel?.trim() || '';
    const airportLabel = airport.airportLabel?.trim() || '';
    const iata = airport.iata?.trim() || '';

    return {
      source: 'world-airport',
      region: airport.region,
      regionLabel: airport.regionLabel?.trim() || '',
      countryLabel: airport.countryLabel?.trim() || '',
      countryEnglishLabel: airport.countryEnglishLabel?.trim() || '',
      cityLabel,
      cityEnglishLabel: airport.cityEnglishLabel?.trim() || '',
      airportLabel,
      airportEnglishLabel: airport.airportEnglishLabel?.trim() || '',
      iata,
      icao: airport.icao?.trim() || '',
      displayLabel: (cityLabel || airport.cityEnglishLabel || airport.airportEnglishLabel) + ' · ' + airportLabel + (iata ? ' (' + iata + ')' : '')
    };
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

  const searchWorldAirportDestinations = (query) => {
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
        const key = airport.iata + '::' + airport.icao;
        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .slice(0, 8)
      .map((airport) => toAirportResult(airport));
  };

  const api = {
    normalizeSearchKey,
    searchWorldAirportDestinations
  };

  if (typeof window !== 'undefined') {
    window.__JEJUGROUP_DESTINATION_SEARCH__ = Object.assign(
      window.__JEJUGROUP_DESTINATION_SEARCH__ || {},
      api
    );
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.__JEJUGROUP_DESTINATION_SEARCH__ = Object.assign(
      globalThis.__JEJUGROUP_DESTINATION_SEARCH__ || {},
      api
    );
  }
})();\n`;
};

const main = async () => {
  const [cityCsv, airportCsv] = await Promise.all([
    decodeCsv(CITY_DATA_URL),
    decodeCsv(AIRPORT_DATA_URL),
  ]);

  const cityRows = parseCsv(cityCsv);
  const airportRows = parseCsv(airportCsv);

  const cityHeaders = cityRows.shift();
  const airportHeaders = airportRows.shift();

  if (!cityHeaders?.length) {
    throw new Error('City CSV headers are missing.');
  }

  if (!airportHeaders?.length) {
    throw new Error('Airport CSV headers are missing.');
  }

  const cityCatalog = buildCityCatalog(cityRows.map((values) => buildRowObject(cityHeaders, values)));
  const airportCatalog = buildAirportCatalog(airportRows.map((values) => buildRowObject(airportHeaders, values)));

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    outputFile,
    `${JSON.stringify({ cityCatalog, airportCatalog }, null, 2)}\n`,
    'utf8'
  );

  await fs.writeFile(browserOutputFile, buildAirportBrowserBundle(airportCatalog), 'utf8');

  console.log(
    `[generate-destination-catalogs] wrote ${cityCatalog.length} cities and ${airportCatalog.length} airports to ${outputFile} and ${browserOutputFile}`
  );
};

main().catch((error) => {
  console.error('[generate-destination-catalogs] failed:', error);
  process.exit(1);
});
