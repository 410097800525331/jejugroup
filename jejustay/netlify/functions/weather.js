// RayPersona: Node.js 18+ 에서는 native fetch를 지원하므로 별도 패키지 설치 없이 글로벌 fetch 사용
// const fetch = require('node-fetch'); 

exports.handler = async (event, context) => {
  // API 키는 환경변수에서 가져옴 (RayPersona: 보안은 국룰)
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SERVER_CONFIG_ERROR: API Key is missing' })
    };
  }

  const { type, lat, lon, q } = event.queryStringParameters;
  let url = '';

  try {
    if (type === 'current') {
      // 현재 날씨 (좌표 기반)
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
    } else if (type === 'pollution') {
      // 대기 오염 (좌표 기반)
      url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    } else if (type === 'search') {
      // 도시 이름 검색
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric&lang=kr`;
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'INVALID_TYPE' }) };
    }

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // CORS 허용
      }
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'PROXY_FETCH_FAILED' })
    };
  }
};
