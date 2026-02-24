// core/config/api_config.js

const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    
    // 로컬 환경 (Live Server 등)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080/jeju-web'; // Eclipse Context Path 추가
    }
    
    // 실섭 배포 환경 (Netlify -> Alwaysdata 호출)
    return 'https://jejugroup.alwaysdata.net';
};

export const API_BASE_URL = getApiBaseUrl();
