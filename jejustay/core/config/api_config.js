// core/config/api_config.js

const REMOTE_API_BASE_URL = 'https://jejugroup.alwaysdata.net';
const LOCAL_API_BASE_URL = 'http://localhost:8080';

const getApiBaseUrl = () => {
    // Default to remote API even on localhost so DB stays always-on server side.
    const params = new URLSearchParams(window.location.search);
    const apiTarget = params.get('api');
    if (apiTarget === 'local') {
        return LOCAL_API_BASE_URL;
    }
    return REMOTE_API_BASE_URL;
};

export const API_BASE_URL = getApiBaseUrl();
