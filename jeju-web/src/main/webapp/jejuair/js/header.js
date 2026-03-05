// header.js
$(document).ready(function () {
  const header = `
  <div class="inner">
    <!-- top bar -->
    <div class="top_bar_container">
      <div class="top_bar_left">
        <a href="pages/cs/customerService.html">고객센터</a>
        <a href="pages/cs/notic.html">공지사항</a>
      </div>
      <div class="top_bar_right">
        <a href="pages/auth/login.html">로그인</a>
        <a href="pages/auth/join.html">회원가입</a>
        <div class="language_selector">
          <a href="#">한국어</a>
        </div>
      </div>
    </div>

    <!-- gnb -->
    <nav class="main_nav">
      <div class="main_nav_container">
        <h1 class="logo"><a href="../index.html"><img src="assets/img/logo.png" alt="제주항공 로고"></a></h1>
        <button class="hamburger_btn" aria-label="menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav_menu_wrap">
          <ul class="nav_menu">
            <li><a href="pages/about/about.html">제주항공</a></li>
            <li><a href="pages/booking/Availability.html">항공권 예매</a></li>
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
                    <li><a href="pages/about/about.html">회사소개</a></li>
                    <li><a href="pages/about/career.html">채용안내</a></li>
                    <li><a href="pages/about/ccm.html">소비자중심경영</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>예매 안내</h4>
                  <ul class="sub_menu">
                    <li><a href="pages/booking/Availability.html">항공권 예매</a></li>
                    <li><a href="pages/booking/viewOnOffReservationList.html">비회원 예약조회</a></li>
                    <li><a href="pages/booking/route.html">인기 노선</a></li>
                    <li><a href="pages/pet/petPass.html">펫 멤버십 / 펫 패스</a></li>
                    <li><a href="pages/pet/petService.html">반려동물 운송 서비스</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>탑승 수속 안내</h4>
                  <ul class="sub_menu">
                    <li><a href="pages/boarding/fastProcedure.html">빠른 수속</a></li>
                    <li><a href="pages/boarding/viewCheckin.html">모바일 탑승권</a></li>
                    <li><a href="pages/boarding/eDocument.html">사전 서약서</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>수하물 안내</h4>
                  <ul class="sub_menu">
                    <li><a href="pages/baggage/preorderedBaggage.html">사전 수하물</a></li>
                    <li><a href="pages/baggage/cabinBaggage.html">기내 수하물</a></li>
                    <li><a href="pages/baggage/transportLimitation.html">운송제한 물품</a></li>
                    <li><a href="pages/baggage/liability.html">수하물 분실 및 배상</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>J 멤버스</h4>
                  <ul class="sub_menu">
                  <li><a href="pages/jmembers/jmembersSightseeing.html">관광</a></li>
                  <li><a href="pages/jmembers/jmembersAirplane.html">공항 편의</a></li>
                  <li><a href="pages/jmembers/jmembersGolf.html">골프 멤버십</a></li>
                  <li><a href="pages/jmembers/jmembersInsurance.html">금융/여행자 보험</a></li>
                  </ul>
                </div>
                <div class="sub_menu">
                  <h4>이벤트/제휴</h4>
                  <ul class="sub_menu">
                    <li><a href="pages/event/event.html">이벤트</a></li>
                    <li><a href="https://jejurentcar.netlify.app/" target="_blank">렌터카</a></li>
                    <li><a href="https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html" target="_blank">호텔/숙소</a></li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        <div class="nav_icons">
  <a href="#" class="btn_search" title="search">
    <img src="assets/img/ico-search.png" alt="search">
  </a>
  <a href="pages/auth/my_page.html" title="my page">
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
      <a href="pages/auth/login.html">로그인</a>
      <a href="pages/auth/join.html">회원가입</a>
      <a href="pages/auth/my_page.html">마이페이지</a>
    </div>
    <div class="mobile_search">
      <input type="text" placeholder="검색어를 입력하세요">
    </div>
    <ul class="mobile_menu_list">
      <li>
        <button class="mobile_menu_btn">제주항공</button>
        <ul class="mobile_sub_menu">
          <li><a href="pages/about/about.html">회사소개</a></li>
          <li><a href="pages/about/career.html">채용안내</a></li>
          <li><a href="pages/about/ccm.html">소비자중심경영</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">항공권 예매</button>
        <ul class="mobile_sub_menu">
          <li><a href="pages/booking/Availability.html">항공권 예매</a></li>
          <li><a href="pages/booking/viewOnOffReservationList.html">비회원 예약조회</a></li>
          <li><a href="pages/booking/route.html">인기 노선</a></li>
          <li><a href="pages/pet/petPass.html">펫 멤버십 / 펫 패스</a></li>
          <li><a href="pages/pet/petService.html">반려동물 운송 서비스</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">탑승 수속</button>
        <ul class="mobile_sub_menu">
          <li><a href="pages/boarding/fastProcedure.html">빠른 수속</a></li>
          <li><a href="pages/boarding/viewCheckin.html">모바일 탑승권</a></li>
          <li><a href="pages/boarding/eDocument.html">사전 서약서</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">여행 준비</button>
        <ul class="mobile_sub_menu">
          <li><a href="pages/baggage/preorderedBaggage.html">사전 수하물</a></li>
          <li><a href="pages/baggage/cabinBaggage.html">기내 수하물</a></li>
          <li><a href="pages/baggage/transportLimitation.html">운송제한 물품</a></li>
          <li><a href="pages/baggage/liability.html">수하물 분실 및 배상</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">J 멤버스</button>
        <ul class="mobile_sub_menu">
          <li><a href="pages/jmembers/jmembersSightseeing.html">관광</a></li>
          <li><a href="pages/jmembers/jmembersAirplane.html">공항 편의</a></li>
          <li><a href="pages/jmembers/jmembersGolf.html">골프 멤버십</a></li>
          <li><a href="pages/jmembers/jmembersInsurance.html">금융/여행자 보험</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile_menu_btn">이벤트/제휴</button>
        <ul class="mobile_sub_menu">
          <li><a href="pages/event/event.html">이벤트</a></li>
          <li><a href="https://jejurentcar.netlify.app/" target="_blank">렌터카</a></li>
          <li><a href="https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html" target="_blank">호텔/숙소</a></li>
        </ul>
      </li>
    </ul>
    <div class="mobile_bottom_menu">
      <a href="pages/cs/customerService.html">고객센터</a>
      <a href="pages/cs/notic.html">공지사항</a>
      <a href="#">한국어</a>
    </div>
  </div>
  
    <button id="topBtn" title="맨 위로">↑</button>
  `;

  $("#header_wrap").append(header);

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
