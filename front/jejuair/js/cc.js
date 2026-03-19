const ccScriptUrl = document.currentScript?.src || new URL("cc.js", window.location.href).href;
// 일반 스크립트에서 Vite import 변환을 피하려고 런타임 import를 우회한다
const loadCcModule = (moduleUrl) => Function("url", "return import(url);")(moduleUrl);

const ensureCcRouteBinder = async () => {
  const binderModule = await loadCcModule(new URL("../../core/utils/router_binder.js", ccScriptUrl).href);
  binderModule.initRouterBinder();
};

$(document).ready(function () {
  const Mheader = `
  <div class="inner">
    <div class="mobile_menu_layer">
      <div class="mobile_menu_header">
        <button class="mobile_close_btn">닫기</button>
      </div>

      <div class="mobile_user_area">
        <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.LOGIN">로그인</a>
        <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.SIGNUP">회원가입</a>
        <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.MYPAGE">마이페이지</a>
      </div>

      <div class="mobile_search">
        <input type="text" placeholder="검색어를 입력해 주세요">
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
            <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.GUEST_RESERVATION">예약 조회</a></li>
            <li><a href="#" class="route-link" data-route="SERVICES.AIR.BOOKING.ROUTE">인기 노선</a></li>
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
      </ul>

      <div class="mobile_bottom_menu">
        <a href="#" class="route-link" data-route="CS.CUSTOMER_CENTER">고객센터</a>
        <a href="#" class="route-link" data-route="CS.INQUIRY">문의하기</a>
        <a href="#">언어</a>
      </div>
    </div>
  </div>
  `;

  $("#Mheader_wrap").append(Mheader);
  void ensureCcRouteBinder();

  $(document).on("click", ".hamburger_btn", function () {
    $(".mobile_menu_layer").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $(document).on("click", ".mobile_close_btn", function () {
    $(".mobile_menu_layer").removeClass("active");
    $("body").css("overflow", "");
  });

  $(document).on("click", ".mobile_menu_btn", function () {
    const sub = $(this).next(".mobile_sub_menu");
    $(".mobile_sub_menu").not(sub).slideUp(200);
    sub.slideToggle(200);
  });
});
