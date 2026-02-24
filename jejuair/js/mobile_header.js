$(document).ready(function () {
  const Mheader = `
  <div class="inner">
    <div class="mobile_menu_layer">
    
      <div class="mobile_menu_header">
        <button class="mobile_close_btn">✕</button>
      </div>
    
      <div class="mobile_user_area">
        <a href="#">로그인</a>
        <a href="#">회원가입</a>
        <a href="#">마이페이지</a>
      </div>
    
      <div class="mobile_search">
        <input type="text" placeholder="검색어를 입력하세요">
      </div>
    
      <ul class="mobile_menu_list">
        <li>
          <button class="mobile_menu_btn">제주항공</button>
          <ul class="mobile_sub_menu">
            <li><a href="/sub/hero.html">회사소개</a></li>
            <li><a href="/sub/recruit.html">채용안내</a></li>
            <li><a href="/sub/ccm_hero.html">소비자중심경영</a></li>
          </ul>
        </li>
    
        <li>
          <button class="mobile_menu_btn">항공권 예매</button>
          <ul class="mobile_sub_menu">
            <li><a href="#">항공권 예매</a></li>
            <li><a href="#">예약 조회</a></li>
            <li><a href="#">운항 조회</a></li>
          </ul>
        </li>
    
        <li>
          <button class="mobile_menu_btn">탑승 수속</button>
          <ul class="mobile_sub_menu">
            <li><a href="/sub/processing.html">빠른 수속</a></li>
            <li><a href="/sub/mobile_pass.html">모바일 탑승권</a></li>
            <li><a href="/sub/oath.html">사전 서약서</a></li>
          </ul>
        </li>
      </ul>
    
      <div class="mobile_bottom_menu">
        <a href="#">고객센터</a>
        <a href="/sub/notic.html">공지사항</a>
        <a href="#">한국어</a>
      </div>
    
    </div>
  </div>

  `;

  $("#Mheader_wrap").append(Mheader);

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
