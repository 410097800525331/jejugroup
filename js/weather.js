
// OpenWeatherMap API 설정
// TODO: 실제 배포시 백엔드 프록시로 교체 필수. 현재는 정적 호스팅 환경이라 불가피 노출.
const API_KEY = '1e63233c6a2916873dd354eaaf829b1e'; // 사용자 요청으로 하드코딩 (원칙 위배되지만 요구사항 준수)

// 기본 위치: 서울 시청
const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.9780;

// 엘리먼트 캐싱
const widget = document.getElementById('weather-widget');

/*
 * 날씨 데이터 로직 시작
 * 위치 수집 -> API 호출 -> UI 렌더링
 * "서울 기준" fallback 철저 구현
 */

async function initWeather() {
    if (!widget) return;

    try {
        const position = await getGeoLocation();
        const { lat, lon } = position;
        
        // 날씨 & 미세먼지 병렬 호출 (속도 최적화)
        const [weatherData, pollutionData] = await Promise.all([
            fetchWeatherData(lat, lon),
            fetchPollutionData(lat, lon)
        ]);

        renderWidget(weatherData, pollutionData);

    } catch (error) {
        console.error('Weather Error:', error);
        // 에러 발생시 서울 기준으로 재시도 (사용자 경험 우선)
        fallbackToSeoul(); 
    }
}

// 위치 정보 가져오기 (Promise 래핑)
function getGeoLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                () => {
                    // 거부하거나 에러나면 바로 reject -> 서울 fallback
                    reject(new Error('Permission denied or error'));
                }
            );
        }
    });
}

// 서울 기준 Fallback
async function fallbackToSeoul() {
    try {
        const [weatherData, pollutionData] = await Promise.all([
            fetchWeatherData(DEFAULT_LAT, DEFAULT_LON),
            fetchPollutionData(DEFAULT_LAT, DEFAULT_LON)
        ]);
        renderWidget(weatherData, pollutionData);
    } catch (e) {
        let msg = '날씨 정보 없음';
        if (e.message === 'Invalid API Key') msg = 'API 키 오류';
        widget.innerHTML = `<span style="font-size:12px; color: #f2f2f2;">${msg}</span>`;
    }
}

// OpenWeatherMap Current Weather 호출
async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
    const res = await fetch(url);
    if (res.status === 401) throw new Error('Invalid API Key');
    if (!res.ok) throw new Error('Weather API Failed');
    return await res.json();
}

// OpenWeatherMap Air Pollution 호출
async function fetchPollutionData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const res = await fetch(url);
    if (res.status === 401) throw new Error('Invalid API Key');
    if (!res.ok) throw new Error('Pollution API Failed');
    return await res.json();
}

// UI 렌더링
function renderWidget(weather, pollution) {
    if (!weather || !pollution) return;

    const temp = Math.round(weather.main.temp);
    const iconCode = weather.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // 미세먼지 등급 (1:Good, 2:Fair, 3:Moderate, 4:Poor, 5:Very Poor)
    const aqi = pollution.list[0].main.aqi; 
    let dustText = '';
    let dustClass = '';

    // 한국 기준 대략적 매핑 (PM10/2.5 수치 정밀 변환보단 AQI 인덱스로 직관적 표현)
    switch(aqi) {
        case 1: dustText = '좋음'; dustClass = 'good'; break;
        case 2: dustText = '보통'; dustClass = 'fair'; break;
        case 3: dustText = '나쁨'; dustClass = 'poor'; break;
        case 4: 
        case 5: dustText = '매우나쁨'; dustClass = 'very-poor'; break;
        default: dustText = '-';
    }

    // HTML 주입
    // .mypage-btn 처럼 보이게 스타일링 클래스 활용
    // 기존 버튼 스타일을 유지하면서 내용만 교체
    const html = `
        <div class="weather-content">
            <img src="${iconUrl}" alt="${weather.weather[0].description}" class="weather-icon">
            <span class="weather-temp">${temp}°</span>
            <div class="weather-dust ${dustClass}">
                <span class="dust-label">미세</span>
                <span class="dust-value">${dustText}</span>
            </div>
        </div>
    `;

    widget.innerHTML = html;
    widget.classList.add('loaded'); // 애니메이션 트리거
}

// 실행
document.addEventListener('DOMContentLoaded', initWeather);
