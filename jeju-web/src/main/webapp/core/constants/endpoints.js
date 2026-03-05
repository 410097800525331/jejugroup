import { deepFreeze } from '../utils/object_util.js';

/**
 * 백엔드 서버와의 API 데이터 통신 전용 엔드포인트 (Single Source of Truth)
 * 브라우저 라우터와는 독립적으로 관리되며 환경 변수 주입 시나리오와 연계됩니다.
 */
export const ENDPOINTS = deepFreeze({
  // Backend Base API URL (로컬/Dev/Prod 환경분할 시 process.env 대응 필요)
  BASE_URL: 'http://localhost:8080/api', // 차후 백엔드 도메인으로 치환
  
  AUTH: {
    LOGIN: '/auth/login',         // JWT 토큰 발급
    SIGNUP: '/member/signup',     // 회원가입
    LOGOUT: '/auth/logout',
    DUPLICATE_CHECK: '/member/userid-check'
  },
  USER: {
    PROFILE: '/member/me',
    UPDATE: '/member/update',
    WITHDRAW: '/member/withdraw'
  },
  RESERVATION: {
    LIST: '/reservations',
    DETAIL: '/reservations/', // ID Append 용
    CANCEL: '/reservations/cancel'
  }
});
