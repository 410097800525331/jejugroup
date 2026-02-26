import { setVerificationSuccessAction, setUsernameCheckAction } from './signup_state.js';

/**
 * Mock API integration for Zero Monolith Architecture.
 * Simulates checking with the backend API.
 */

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const checkIdAvailability = async (userId) => {
  await delay(400); // Network latency mock
  // Basic mock rule: ID is taken if it starts with 'admin'
  const isAvailable = !userId.toLowerCase().startsWith('admin');
  setUsernameCheckAction(userId, isAvailable);
  return isAvailable;
};

// Mock PASS Auth window popup mechanism
export const triggerPassAuth = async () => {
  return new Promise((resolve) => {
    const mockWindow = window.open('', '_blank', 'width=500,height=600');
    if (mockWindow) {
      mockWindow.document.write(`
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>PASS 인증 시뮬레이션</h2>
          <p>사용자 인증 진행중...</p>
        </div>
      `);
      setTimeout(() => {
        mockWindow.close();
        const data = {
          success: true,
          data: {
            method: 'PASS',
            name: '제주투어',
            phone: '010-1234-5678',
            gender: 'M'
          }
        };
        setVerificationSuccessAction(data.data);
        resolve(data);
      }, 1500);
    } else {
      alert("팝업 차단을 해제해주세요.");
      resolve({ success: false });
    }
  });
};

// --- Social API Configuration (Insert your keys here) ---
const SOCIAL_CONFIG = {
  KAKAO_JS_KEY: 'YOUR_KAKAO_JS_KEY', // 카카오 개발자 센터에서 발급받은 JS 키
  NAVER_CLIENT_ID: 'YOUR_NAVER_CLIENT_ID',
  REDIRECT_URI: window.location.origin + '/jejustay/pages/auth/signup.html'
};

// Initialize SDKs
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
  if (SOCIAL_CONFIG.KAKAO_JS_KEY !== 'YOUR_KAKAO_JS_KEY') {
    Kakao.init(SOCIAL_CONFIG.KAKAO_JS_KEY);
  }
}

export const triggerSocialAuth = async (provider) => {
  if (provider === 'kakao') {
    return new Promise((resolve) => {
      if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
        alert('카카오 SDK가 초기화되지 않았습니다. API 키를 확인해주세요.');
        return resolve({ success: false });
      }

      Kakao.Auth.login({
        success: function(authObj) {
          Kakao.API.request({
            url: '/v2/user/me',
            success: function(res) {
              const data = {
                method: 'KAKAO',
                // 주의: 이름, 전화번호 등은 카카오 비즈 앱 설정 및 검수가 완료되어야 가져올 수 있음
                name: res.kakao_account.name || res.properties.nickname, 
                phone: res.kakao_account.phone_number || '010-0000-0000',
                gender: res.kakao_account.gender === 'male' ? 'M' : 'F'
              };
              setVerificationSuccessAction(data);
              resolve({ success: true, data });
            },
            fail: function(error) {
              console.error(error);
              resolve({ success: false });
            }
          });
        },
        fail: function(err) {
          console.error(err);
          resolve({ success: false });
        }
      });
    });
  }

  if (provider === 'naver') {
    return new Promise((resolve) => {
      // 네이버는 별도 팝업이나 리다이렉트 방식 사용 (SDK v2 기준)
      const naverLogin = new naver.LoginWithNaverId({
        clientId: SOCIAL_CONFIG.NAVER_CLIENT_ID,
        callbackUrl: SOCIAL_CONFIG.REDIRECT_URI,
        isPopup: true,
        loginButton: { color: "green", type: 3, height: 60 }
      });
      
      naverLogin.init();
      
      // 실제 호출 (이미 로그인된 세션이 있을 경우 정보를 긁어옴)
      naverLogin.getLoginStatus(function (status) {
        if (status) {
          const data = {
            method: 'NAVER',
            name: naverLogin.user.getName(),
            phone: naverLogin.user.getMobile(),
            gender: naverLogin.user.getGender() === 'M' ? 'M' : 'F'
          };
          setVerificationSuccessAction(data);
          resolve({ success: true, data });
        } else {
          // 팝업 실행
          naverLogin.authorize();
          // 네이버는 콜백 페이지에서 처리해야 하므로 여기서는 일단 팝업 실행까지만 감
          // 실제로는 리다이렉트 후 다시 getLoginStatus를 호출하는 로직이 필요함
        }
      });
    });
  }

  // PASS는 기존 Mock 유지
  if (provider === 'pass') return triggerPassAuth();
  
  return { success: false };
};

// Daum Postcode integration wrap
export const initDaumPostcode = (callback) => {
  if (typeof daum !== 'undefined' && daum.Postcode) {
    new daum.Postcode({
      oncomplete: function(data) {
        callback(data);
      }
    }).open();
  } else {
    console.error("Daum API not loaded");
    alert("도로명 주소 API를 불러올 수 없습니다. 인터넷 연결을 확인해주세요.");
  }
};

// Final API submission
export const submitSignup = async (state) => {
  console.log("Submitting immutable state exactly:", state);
  await delay(1000);
  // Real implementation would send to Java Backend via fetch()
  // Ensure we do stringification for logs
  return { success: true, message: "OK" };
};
