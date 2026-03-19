// header.js
// 레거시 제주항공 페이지에서도 routes.js 기반 라우팅을 공용으로 쓰기 위한 브리지
const jejuAirHeaderScriptUrl = document.currentScript?.src || new URL("header.js", window.location.href).href;
let jejuAirRouteBridgePromise = null;
// 일반 스크립트에서 Vite import 변환을 피하려고 런타임 import를 우회한다
const loadJejuAirModule = (moduleUrl) => Function("url", "return import(url);")(moduleUrl);

const getJejuAirRouteBridge = async () => {
  if (!jejuAirRouteBridgePromise) {
    jejuAirRouteBridgePromise = Promise.all([
      loadJejuAirModule(new URL("../../core/utils/path_resolver.js", jejuAirHeaderScriptUrl).href),
      loadJejuAirModule(new URL("../../core/utils/router_binder.js", jejuAirHeaderScriptUrl).href),
    ]).then(([resolverModule, binderModule]) => {
      binderModule.initRouterBinder();

      return {
        navigate: (routeKey, params = {}, options = {}) => {
          const targetUrl = resolverModule.resolveRoute(routeKey, params);

          if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
            window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, "jejuair-header", options);
            return targetUrl;
          }

          if (options.mode === "replace") {
            window.location.replace(targetUrl);
            return targetUrl;
          }

          window.location.assign(targetUrl);
          return targetUrl;
        },
        resolve: resolverModule.resolveRoute,
      };
    });
  }

  return jejuAirRouteBridgePromise;
};

if (!window.jejuAirRoute) {
  window.jejuAirRoute = {
    navigate: async (routeKey, params = {}, options = {}) => {
      const bridge = await getJejuAirRouteBridge();
      return bridge.navigate(routeKey, params, options);
    },
    resolve: async (routeKey, params = {}) => {
      const bridge = await getJejuAirRouteBridge();
      return bridge.resolve(routeKey, params);
    },
  };
}
$(document).ready(function () {
  const header = `
  <div class="inner">
    <!-- top bar -->
    <div class="top_bar_container">
      <div class="top_bar_left">
        <a href="#" class="route-link" data-route="CS.CUSTOMER_CENTER">고객센터</a>
        <a href="#" class="route-link" data-route="CS.INQUIRY">문의하기</a>
      </div>
      <div class="top_bar_right">
        <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.LOGIN">로그인</a>
        <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.SIGNUP">회원가입</a>
        <div class="language_selector">
          <a href="#">한국어</a>
        </div>
      </div>
    </div>

    <!-- gnb -->
    <nav class="main_nav">
      <div class="main_nav_container">
        <h1 class="logo"><a href="#" class="route-link" data-route="SERVICES.AIR.MAIN"><img src="assets/img/logo.png" alt="제주항공 로고"></a></h1>
        <button class="hamburger_btn" aria-label="menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav_menu_wrap">
          <ul class="nav_menu">
            <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.COMPANY">제주항공</a></li>
            <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.AVAILABILITY">항공권 예매</a></li>
            <li><a href="#">탑승 수속</a></li>
            <li><a href="#">여행 준비</a></li>
            <li><a href="#">여행 편의</a></li>
            <li><a href="#">이벤트/제휴</a></li>
          </ul>
          <!-- sub -->
          <div class="sub_menu_wrap">
            <div class="sub_menu_container">
              <div class="sub_menu">
                  <h4>제주항공</h4>
                  <ul class="sub_menu">
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.COMPANY">회사소개</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.CAREER">채용안내</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.CCM">소비자중심경영</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>예매 안내</h4>
                  <ul class="sub_menu">
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.AVAILABILITY">항공권 예매</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.GUEST_RESERVATION">비회원 예약조회</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.ROUTE">인기 노선</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.PET.PASS">펫 멤버십 / 펫 패스</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.PET.SERVICE">반려동물 운송 서비스</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>탑승 수속 안내</h4>
                  <ul class="sub_menu">
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOARDING.FAST_PROCEDURE">빠른 수속</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOARDING.MOBILE_CHECKIN">모바일 탑승권</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOARDING.E_DOCUMENT">사전 서약서</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>수하물 안내</h4>
                  <ul class="sub_menu">
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.PREORDERED">사전 수하물</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.CABIN">기내 수하물</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.LIMITATION">운송제한 물품</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.LIABILITY">수하물 분실 및 배상</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>J 멤버스</h4>
                  <ul class="sub_menu">
                  <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.SIGHTSEEING">관광</a></li>
                  <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.AIRPLANE">공항 편의</a></li>
                  <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.GOLF">골프 멤버십</a></li>
                  <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.INSURANCE">금융/여행자 보험</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>이벤트/제휴</h4>
                  <ul class="sub_menu">
                    <li><a href="#" class="route-link" data-route="SERVICES.AIR.EVENT">이벤트</a></li>
                    <li><a href="https://jejurentcar.netlify.app/" target="_blank">렌터카</a></li>
                    <li><a href="#" class="route-link" data-route="SERVICES.STAY.MAIN">제주 스테이</a></li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        <div class="nav_icons">
  <a href="#" class="btn_search" title="search">
    <img src="assets/img/ico-search.png" alt="search">
  </a>
  <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.MYPAGE" title="my page">
    <img src="assets/img/icon-login.png" alt="my page">
  </a>
</div>

<!-- 검색 영역 -->
<div class="header_search">
  <input type="text" placeholder="검색어를 입력하세요">
  <button type="button">검색</button>
</div>
      </div>
    </nav>
  </div>

  <!-- mobile menu layer -->
  <div class="mobile_menu_layer">
    <div class="mobile_menu_header">
      <button class="mobile_close_btn">✕</button>
    </div>
    <div class="mobile_user_area">
      <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.LOGIN">로그인</a>
      <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.SIGNUP">회원가입</a>
      <a href="../pages/mypage/dashboard.html?shell=air">마이페이지</a>
    </div>
    <div class="mobile_search">
      <input type="text" placeholder="검색어를 입력하세요">
    </div>
    <ul class="mobile_menu_list">
      <li>
        <button class="mobile_menu_btn">제주항공</button>
        <ul class="mobile_sub_menu">
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.COMPANY">회사소개</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.CAREER">채용안내</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.ABOUT.CCM">소비자중심경영</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">항공권 예매</button>
        <ul class="mobile_sub_menu">
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.AVAILABILITY">항공권 예매</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.GUEST_RESERVATION">비회원 예약조회</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.ROUTE">인기 노선</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.PET.PASS">펫 멤버십 / 펫 패스</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.PET.SERVICE">반려동물 운송 서비스</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">탑승 수속</button>
        <ul class="mobile_sub_menu">
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOARDING.FAST_PROCEDURE">빠른 수속</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOARDING.MOBILE_CHECKIN">모바일 탑승권</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOARDING.E_DOCUMENT">사전 서약서</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">여행 준비</button>
        <ul class="mobile_sub_menu">
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.PREORDERED">사전 수하물</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.CABIN">기내 수하물</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.LIMITATION">운송제한 물품</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.BAGGAGE.LIABILITY">수하물 분실 및 배상</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">J 멤버스</button>
        <ul class="mobile_sub_menu">
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.SIGHTSEEING">관광</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.AIRPLANE">공항 편의</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.GOLF">골프 멤버십</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.JMEMBERS.INSURANCE">금융/여행자 보험</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">이벤트/제휴</button>
        <ul class="mobile_sub_menu">
          <li><a href="#" class="route-link" data-route="SERVICES.AIR.EVENT">이벤트</a></li>
          <li><a href="https://jejurentcar.netlify.app/" target="_blank">렌터카</a></li>
          <li><a href="#" class="route-link" data-route="SERVICES.STAY.MAIN">제주 스테이</a></li>
        </ul>
      </li>
    </ul>
    <div class="mobile_bottom_menu">
      <a href="#" class="route-link" data-route="CS.CUSTOMER_CENTER">고객센터</a>
      <a href="#" class="route-link" data-route="CS.INQUIRY">문의하기</a>
      <a href="#">한국어</a>
    </div>
  </div>
  
    <button id="topBtn" title="맨 위로">↑</button>
  `;

  $("#header_wrap").append(header);
  void getJejuAirRouteBridge();

  // 검색
  const searchBtn = document.querySelector('.btn_search');
  const searchBox = document.querySelector('.header_search');

  searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    searchBox.classList.toggle('is_active');
  });

  // 탑 버튼 요소 선택
  const topBtn = document.getElementById("topBtn");

  // 스크롤 이벤트: 300px 이상 내려가면 버튼 보이기
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  });

  // 클릭 시 부드럽게 맨 위로 이동
  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });


  // 햄버거 열기/닫기
  $(document).on("click", ".hamburger_btn", function () {
    $(".mobile_menu_layer").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $(document).on("click", ".mobile_close_btn", function () {
    $(".mobile_menu_layer").removeClass("active");
    $("body").css("overflow", "");
  });

  // 모바일 메뉴 아코디언
  $(document).on("click", ".mobile_menu_btn", function () {
    const sub = $(this).next(".mobile_sub_menu");
    $(".mobile_sub_menu").not(sub).slideUp(200);
    sub.slideToggle(200);
  });

  // PC 메뉴 fixed
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 60) {
      $(".main_nav").addClass("fixed");
    } else {
      $(".main_nav").removeClass("fixed");
    }
  });
});
