let weatherInitialized = false;

const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.978;

const getWeatherIconHtml = (iconCode: string, size: "small" | "large" = "small") => {
  const iconMap: Record<string, [string, string]> = {
    "01": ["fa-sun", "#ffbd00"],
    "02": ["fa-cloud-sun", "#ffbd00"],
    "03": ["fa-cloud", "#cbd5e1"],
    "04": ["fa-cloud", "#94a3b8"],
    "09": ["fa-cloud-showers-heavy", "#60a5fa"],
    "10": ["fa-cloud-rain", "#60a5fa"],
    "11": ["fa-bolt", "#fde047"],
    "13": ["fa-snowflake", "#99f6e4"],
    "50": ["fa-smog", "#94a3b8"]
  };

  const key = iconCode.slice(0, 2);
  const [iconClass, color] = iconMap[key] ?? ["fa-cloud", "#cbd5e1"];

  if (size === "large") {
    return `<i class="fa-solid ${iconClass} weather-detail-icon-fa" style="color:${color};"></i>`;
  }

  return `<i class="fa-solid ${iconClass}" style="color:${color};margin-right:4px;"></i>`;
};

const fetchWeather = async (lat: number, lon: number) => {
  const response = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=current&lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error(`weather fetch failed: ${response.status}`);
  }

  return response.json();
};

const fetchPollution = async (lat: number, lon: number) => {
  const response = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=pollution&lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error(`pollution fetch failed: ${response.status}`);
  }

  return response.json();
};

const getGeoLocation = async (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => reject(error)
    );
  });
};

const renderHeaderButton = (openButton: HTMLElement, weather: any) => {
  const temp = Math.round(weather.main.temp);
  const iconCode = weather.weather?.[0]?.icon ?? "03d";
  openButton.innerHTML = `${getWeatherIconHtml(iconCode, "small")}<span>${temp}°</span>`;
};

const renderOverlay = (detailContainer: HTMLElement, weather: any, pollution: any) => {
  const aqi = pollution?.list?.[0]?.main?.aqi ?? 1;
  const dustMap: Record<number, [string, string]> = {
    1: ["좋음", "good"],
    2: ["보통", "fair"],
    3: ["나쁨", "poor"],
    4: ["매우나쁨", "very-poor"],
    5: ["매우나쁨", "very-poor"]
  };
  const [dustText, dustClass] = dustMap[aqi] ?? ["정보없음", ""];

  const iconHtml = getWeatherIconHtml(weather.weather?.[0]?.icon ?? "03d", "large");

  detailContainer.innerHTML = `
    <div class="weather-detail-main">
      <p class="weather-detail-city">${weather.name ?? "도시"}</p>
      <div class="weather-detail-info">
        ${iconHtml}
        <h2 class="weather-detail-temp">${Math.round(weather.main?.temp ?? 0)}°</h2>
        <p class="weather-detail-desc">${weather.weather?.[0]?.description ?? ""}</p>
      </div>
    </div>
    <div class="weather-detail-grid">
      <div class="weather-detail-item">
        <span class="item-label">체감온도</span>
        <span class="item-value">${Math.round(weather.main?.feels_like ?? 0)}°</span>
      </div>
      <div class="weather-detail-item weather-detail-dust ${dustClass}">
        <span class="item-label">미세먼지</span>
        <span class="item-value">${dustText}</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">습도</span>
        <span class="item-value">${weather.main?.humidity ?? 0}%</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">풍속</span>
        <span class="item-value">${weather.wind?.speed ?? 0}m/s</span>
      </div>
    </div>
  `;
};

export const setupWeatherWidget = () => {
  if (weatherInitialized) {
    return;
  }

  const openButton = document.getElementById("weather-open-btn");
  const overlay = document.getElementById("weather-overlay");
  const closeButton = document.getElementById("weather-close-btn");
  const detailContainer = document.getElementById("weather-detail-container");
  const searchInput = document.getElementById("weather-search-input") as HTMLInputElement | null;
  const searchButton = document.getElementById("weather-search-btn");

  if (!openButton || !overlay || !closeButton || !detailContainer) {
    return;
  }

  let weatherData: any = null;
  let pollutionData: any = null;

  const refresh = async (lat: number, lon: number) => {
    const [weather, pollution] = await Promise.all([fetchWeather(lat, lon), fetchPollution(lat, lon)]);
    weatherData = weather;
    pollutionData = pollution;
    renderHeaderButton(openButton, weather);
    if (overlay.classList.contains("active")) {
      renderOverlay(detailContainer, weather, pollution);
    }
  };

  openButton.addEventListener("click", () => {
    overlay.classList.add("active");
    if (weatherData && pollutionData) {
      renderOverlay(detailContainer, weatherData, pollutionData);
    }
  });

  closeButton.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.classList.remove("active");
    }
  });

  const searchByCity = async () => {
    const query = searchInput?.value.trim();
    if (!query) {
      return;
    }

    try {
      const response = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=search&q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`city weather failed: ${response.status}`);
      }

      const weather = await response.json();
      const pollution = await fetchPollution(weather.coord.lat, weather.coord.lon);
      weatherData = weather;
      pollutionData = pollution;
      renderHeaderButton(openButton, weather);
      renderOverlay(detailContainer, weather, pollution);
    } catch (error) {
      detailContainer.innerHTML = `<div class="weather-loading-large"><p>조회 실패: ${(error as Error).message}</p></div>`;
    }
  };

  searchButton?.addEventListener("click", () => {
    searchByCity().catch(() => {});
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchByCity().catch(() => {});
    }
  });

  const boot = async () => {
    try {
      const coordinates = await getGeoLocation();
      await refresh(coordinates.lat, coordinates.lon);
    } catch (_error) {
      await refresh(DEFAULT_LAT, DEFAULT_LON);
    }
  };

  boot().catch(() => {});
  weatherInitialized = true;
};
