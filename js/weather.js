
// OpenWeatherMap API 설정 (RayPersona: 보안을 위해 Netlify Function 프록시 사용)
// const API_KEY = '...'; // 더 이상 프론트엔드에 키를 두지 않음

// 기본 위치: 서울
const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.9780;

// DOM 캐싱
const openBtn = document.getElementById('weather-open-btn');
const overlay = document.getElementById('weather-overlay');
const closeBtn = document.getElementById('weather-close-btn');
const detailContainer = document.getElementById('weather-detail-container');
const searchInput = document.getElementById('weather-search-input');
const searchBtn = document.getElementById('weather-search-btn');
const suggestionsList = document.getElementById('weather-suggestions');

// 날씨 상태 저장 (전역)
let currentWeatherData = null;
let currentPollutionData = null;

/*
 * 날씨 앱 코어 로직
 */
async function initWeather() {
    try {
        const coords = await getGeoLocation();
        await updateWeatherData(coords.lat, coords.lon);
    } catch (error) {
        console.warn('Geolocation failed, falling back to Seoul:', error.message);
        await updateWeatherData(DEFAULT_LAT, DEFAULT_LON);
    }
}

async function updateWeatherData(lat, lon) {
    try {
        const [weather, pollution] = await Promise.all([
            fetchWeatherData(lat, lon),
            fetchPollutionData(lat, lon)
        ]);
        
        currentWeatherData = weather;
        currentPollutionData = pollution;
        
        renderHeaderButton(weather);
        if (overlay.classList.contains('active')) renderOverlay();
    } catch (error) {
        handleWeatherError(error);
    }
}

// 도시 이름으로 검색 (Korean Support & Mapping)
async function searchCityWeather(cityQuery) {
    if (!cityQuery) return;
    
    // CITY_DATA에서 매핑된 도시 찾기 (한글 검색 대응)
    const mappedCity = CITY_DATA.find(c => c.ko === cityQuery || c.en.toLowerCase() === cityQuery.toLowerCase());
    const searchTerm = mappedCity ? mappedCity.en : cityQuery;

    // 로딩 상태 표시
    detailContainer.innerHTML = `
        <div class="weather-loading-large">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>'${cityQuery}' 날씨 검색 중...</p>
        </div>
    `;
    suggestionsList.classList.remove('active');

    try {
        const weatherRes = await fetch(`/.netlify/functions/weather?type=search&q=${encodeURIComponent(searchTerm)}`);
        if (weatherRes.status === 404) throw new Error('CITY_NOT_FOUND');
        if (!weatherRes.ok) throw new Error('SEARCH_FAILED');
        
        const weather = await weatherRes.json();
        const pollution = await fetchPollutionData(weather.coord.lat, weather.coord.lon);
        
        currentWeatherData = weather;
        currentPollutionData = pollution;
        
        renderOverlay();
    } catch (error) {
        let msg = '날씨를 불러올 수 없습니다.';
        if (error.message === 'CITY_NOT_FOUND') msg = `'${cityQuery}' 도시를 찾을 수 없습니다.`;
        
        detailContainer.innerHTML = `
            <div class="weather-loading-large">
                <i class="fa-solid fa-circle-exclamation" style="color: #ea580c;"></i>
                <p class="weather-error-msg"></p>
            </div>
        `;
        // RayPersona: XSS 방지를 위한 textContent 사용
        detailContainer.querySelector('.weather-error-msg').textContent = msg;
    }
}

// 연관 검색어 표시 (Autocomplete)
function showSuggestions(query) {
    currentFocus = -1; // 리셋
    if (!query) {
        suggestionsList.classList.remove('active');
        return;
    }

    const filtered = CITY_DATA.filter(c => 
        c.ko.includes(query) || 
        c.en.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // 최대 5개 노출

    if (filtered.length === 0) {
        suggestionsList.classList.remove('active');
        return;
    }

    suggestionsList.innerHTML = filtered.map(c => `
        <li class="suggestion-item" data-ko="${c.ko}" data-en="${c.en}">
            <span>${c.ko} (${c.en})</span>
            <span class="country-tag">${c.country}</span>
        </li>
    `).join('');

    suggestionsList.classList.add('active');
}

// 위치 정보 비동기 래핑
function getGeoLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject(new Error('지원 안 함'));
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            err => reject(err)
        );
    });
}

// API 호출부 (이제 넷리파이 함수로 프록시 쏴줌)
async function fetchWeatherData(lat, lon) {
    const res = await fetch(`/.netlify/functions/weather?type=current&lat=${lat}&lon=${lon}`);
    if (res.status === 401) throw new Error('API_KEY_INVALID');
    return await res.json();
}

async function fetchPollutionData(lat, lon) {
    const res = await fetch(`/.netlify/functions/weather?type=pollution&lat=${lat}&lon=${lon}`);
    return await res.json();
}

// 날씨 아이콘 매핑 (RayPersona: OWM 기본 아이콘이 '볼링공' 같아서 FA로 교체)
function getWeatherIconHTML(iconCode, size = 'small') {
    const iconMap = {
        '01d': ['fa-sun', '#ffbd00'],
        '01n': ['fa-moon', '#f5f3ce'],
        '02d': ['fa-cloud-sun', '#ffbd00'],
        '02n': ['fa-cloud-moon', '#f5f3ce'],
        '03d': ['fa-cloud', '#cbd5e1'],
        '03n': ['fa-cloud', '#cbd5e1'],
        '04d': ['fa-cloud', '#94a3b8'],
        '04n': ['fa-cloud', '#94a3b8'],
        '09d': ['fa-cloud-showers-heavy', '#60a5fa'],
        '09n': ['fa-cloud-showers-heavy', '#60a5fa'],
        '10d': ['fa-cloud-sun-rain', '#60a5fa'],
        '10n': ['fa-cloud-moon-rain', '#60a5fa'],
        '11d': ['fa-bolt', '#fde047'],
        '11n': ['fa-bolt', '#fde047'],
        '13d': ['fa-snowflake', '#99f6e4'],
        '13n': ['fa-snowflake', '#99f6e4'],
        '50d': ['fa-smog', '#94a3b8'],
        '50n': ['fa-smog', '#94a3b8'],
    };

    const [iconClass, color] = iconMap[iconCode.substring(0, 3)] || ['fa-sun', '#ffbd00'];
    
    if (size === 'large') {
        return `<i class="fa-solid ${iconClass} weather-detail-icon-fa" style="color: ${color};"></i>`;
    }
    return `<i class="fa-solid ${iconClass}" style="color: ${color}; margin-right: 4px;"></i>`;
}

// 헤더 버튼 렌더링
function renderHeaderButton(weather) {
    if (!openBtn) return;
    const temp = Math.round(weather.main.temp);
    const iconCode = weather.weather[0].icon;
    openBtn.innerHTML = `
        ${getWeatherIconHTML(iconCode, 'small')}
        <span>${temp}°</span>
    `;
}

// 날씨 ID에 따른 이펙트 클래스 매핑
function getWeatherEffectClass(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return 'weather-effect-thunder';
    if (weatherId >= 300 && weatherId < 600) return 'weather-effect-rain';
    if (weatherId >= 600 && weatherId < 700) return 'weather-effect-snow';
    if (weatherId >= 700 && weatherId < 800) return 'weather-effect-clouds'; // Atmosphere (fog, etc) -> clouds
    if (weatherId > 800) return 'weather-effect-clouds'; // 801-804
    return 'weather-effect-clear'; // 800
}

// 오버레이 상세 내용 렌더링
function renderOverlay() {
    if (!currentWeatherData || !currentPollutionData) return;

    const w = currentWeatherData;
    const p = currentPollutionData;
    const aqi = p.list[0].main.aqi;
    
    // 미세먼지 매핑
    const dustMap = { 1: ['좋음', 'good'], 2: ['보통', 'fair'], 3: ['나쁨', 'poor'], 4: ['매우나쁨', 'very-poor'], 5: ['매우나쁨', 'very-poor'] };
    const [dustText, dustClass] = dustMap[aqi] || ['데이터 없음', ''];

    // 날씨 이펙트 클래스 가져오기
    const effectClass = getWeatherEffectClass(w.weather[0].id);
    const iconHTML = getWeatherIconHTML(w.weather[0].icon, 'large');

    detailContainer.innerHTML = `
        <div class="weather-bg-effect ${effectClass}"></div>
        <div class="weather-detail-main">
            <p class="weather-detail-city">${w.name}</p>
            <div class="weather-detail-info">
                ${iconHTML}
                <h2 class="weather-detail-temp">${Math.round(w.main.temp)}°</h2>
                <p class="weather-detail-desc">${w.weather[0].description}</p>
            </div>
        </div>
        <div class="weather-detail-grid">
            <div class="weather-detail-item">
                <span class="item-label">체감 온도</span>
                <span class="item-value">${Math.round(w.main.feels_like)}°</span>
            </div>
            <div class="weather-detail-item weather-detail-dust ${dustClass}">
                <span class="item-label">미세먼지</span>
                <span class="item-value">${dustText}</span>
            </div>
            <div class="weather-detail-item">
                <span class="item-label">습도</span>
                <span class="item-value">${w.main.humidity}%</span>
            </div>
            <div class="weather-detail-item">
                <span class="item-label">풍속</span>
                <span class="item-value">${w.wind.speed}m/s</span>
            </div>
        </div>
    `;
}

// 이벤트 리스너
if (openBtn) openBtn.onclick = () => {
    overlay.classList.add('active');
    renderOverlay();
};

if (closeBtn) closeBtn.onclick = () => overlay.classList.remove('active');

if (searchBtn) searchBtn.onclick = () => searchCityWeather(searchInput.value.trim());

// 검색창 키보드 네비게이션 변수
let currentFocus = -1;

if (searchInput) {
    searchInput.oninput = (e) => {
        showSuggestions(e.target.value.trim());
    };
    
    searchInput.onkeydown = (e) => {
        const items = suggestionsList.getElementsByTagName('li');
        if (e.key === 'ArrowDown') {
            currentFocus++;
            addActive(items);
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            addActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            } else {
                searchCityWeather(searchInput.value.trim());
            }
        }
    };
}

function addActive(items) {
    if (!items) return;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (items.length - 1);
    items[currentFocus].classList.add('autocomplete-active');
    
    // 스크롤 자동 이동
    items[currentFocus].scrollIntoView({ block: 'nearest' });
}

function removeActive(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('autocomplete-active');
    }
}

// 추천 아이템 클릭 시
suggestionsList.onclick = (e) => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
        const cityKo = item.getAttribute('data-ko');
        searchInput.value = cityKo;
        searchCityWeather(cityKo);
    }
};

window.addEventListener('click', e => { 
    if (e.target === overlay) {
        overlay.classList.remove('active');
        suggestionsList.classList.remove('active');
    }
    // 검색창 밖 클릭 시 추천 목록 닫기
    if (!e.target.closest('.weather-search-bar')) {
        suggestionsList.classList.remove('active');
    }
});

window.addEventListener('keydown', e => { 
    if (e.key === 'Escape') {
        overlay.classList.remove('active');
        suggestionsList.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', initWeather);
