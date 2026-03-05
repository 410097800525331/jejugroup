// core/config/api_config.js

/**
 * Meta-Design API Configuration
 * 프런트엔드와 백엔드가 같은 서버(WAR)에 배포되는 경우,
 * 도메인 없이 상대 경로를 사용하는 것이 가장 안전함.
 */

const REMOTE_API_BASE_URL = 'https://jejugroup.alwaysdata.net';
const LOCAL_API_BASE_URL = 'http://localhost:8080/jeju-web'; // 로컬 톰캣 컨텍스트 경로 확인 필요
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

const getApiBaseUrl = () => {
    // 1. URL 파라미터로 강제 지정 (?api=local 등)
    const params = new URLSearchParams(window.location.search);
    const apiTarget = params.get('api');
    if (apiTarget === 'local') return LOCAL_API_BASE_URL;
    if (apiTarget === 'remote') return REMOTE_API_BASE_URL;

    // 2. 현재 도메인 확인
    const currentHost = window.location.hostname;
    
    // AlwaysData 서버 환경이거나 이미 백엔드와 합쳐져서 실행 중인 경우
    // 상대 경로를 사용하기 위해 빈 문자열 반환
    if (!LOCAL_HOSTS.has(currentHost)) {
        return ''; 
    }

    // 3. 로컬에서 프런트엔드만 따로 띄웠을 때 (예: Live Server 5500포트 등)
    // 이 경우에만 로컬 톰캣 주소를 명시적으로 붙여줌
    return window.location.port !== '8080' ? LOCAL_API_BASE_URL : '';
};

export const API_BASE_URL = getApiBaseUrl();
