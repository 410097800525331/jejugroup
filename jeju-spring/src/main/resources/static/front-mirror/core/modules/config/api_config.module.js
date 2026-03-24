/**
 * 프런트와 백엔드가 같은 서버에 배포되면 상대 경로 우선
 * 로컬 프런트만 따로 띄우면 로컬 백엔드 주소 사용
 */

const REMOTE_API_BASE_URL = "https://jejugroup.alwaysdata.net";
const LOCAL_API_BASE_URL = "http://localhost:9090/jeju-web";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const getApiBaseUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const apiTarget = params.get("api");

  if (apiTarget === "local") {
    return LOCAL_API_BASE_URL;
  }

  if (apiTarget === "remote") {
    return REMOTE_API_BASE_URL;
  }

  if (!LOCAL_HOSTS.has(window.location.hostname)) {
    return "";
  }

  return window.location.port !== "9090" ? LOCAL_API_BASE_URL : "";
};

export const API_BASE_URL = getApiBaseUrl();
