interface AirHeaderMenuLink {
  href: string;
  label: string;
  target?: "_blank";
}

interface AirHeaderMenuGroup {
  links: AirHeaderMenuLink[];
  title: string;
}

const TOP_BAR_LINKS: AirHeaderMenuLink[] = [
  { href: "pages/cs/customerService.html", label: "고객센터" },
  { href: "pages/cs/notic.html", label: "공지사항" },
];

const USER_LINKS: AirHeaderMenuLink[] = [
  { href: "../pages/auth/login.html?shell=air", label: "로그인" },
  { href: "../pages/auth/signup.html?shell=air", label: "회원가입" },
];

const PRIMARY_MENU: AirHeaderMenuLink[] = [
  { href: "pages/about/about.html", label: "제주항공" },
  { href: "pages/booking/Availability.html", label: "항공권 예매" },
  { href: "#", label: "탑승 수속" },
  { href: "#", label: "여행 준비" },
  { href: "#", label: "여행 편의" },
  { href: "#", label: "이벤트/제휴" },
];

const MENU_GROUPS: AirHeaderMenuGroup[] = [
  {
    links: [
      { href: "pages/about/about.html", label: "회사소개" },
      { href: "pages/about/career.html", label: "채용안내" },
      { href: "pages/about/ccm.html", label: "소비자중심경영" },
    ],
    title: "제주항공",
  },
  {
    links: [
      { href: "pages/booking/Availability.html", label: "항공권 예매" },
      { href: "pages/booking/viewOnOffReservationList.html", label: "비회원 예약조회" },
      { href: "pages/booking/route.html", label: "인기 노선" },
      { href: "pages/pet/petPass.html", label: "펫 멤버십 / 펫 패스" },
      { href: "pages/pet/petService.html", label: "반려동물 운송 서비스" },
    ],
    title: "예매 안내",
  },
  {
    links: [
      { href: "pages/boarding/fastProcedure.html", label: "빠른 수속" },
      { href: "pages/boarding/viewCheckin.html", label: "모바일 탑승권" },
      { href: "pages/boarding/eDocument.html", label: "사전 서약서" },
    ],
    title: "탑승 수속 안내",
  },
  {
    links: [
      { href: "pages/baggage/preorderedBaggage.html", label: "사전 수하물" },
      { href: "pages/baggage/cabinBaggage.html", label: "기내 수하물" },
      { href: "pages/baggage/transportLimitation.html", label: "운송제한 물품" },
      { href: "pages/baggage/liability.html", label: "수하물 분실 및 배상" },
    ],
    title: "수하물 안내",
  },
  {
    links: [
      { href: "pages/jmembers/jmembersSightseeing.html", label: "관광" },
      { href: "pages/jmembers/jmembersAirplane.html", label: "공항 편의" },
      { href: "pages/jmembers/jmembersGolf.html", label: "골프 멤버십" },
      { href: "pages/jmembers/jmembersInsurance.html", label: "금융/여행자 보험" },
    ],
    title: "J 멤버스",
  },
  {
    links: [
      { href: "pages/event/event.html", label: "이벤트" },
      { href: "https://jejurentcar.netlify.app/", label: "렌터카", target: "_blank" },
      {
        href: "https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html",
        label: "호텔/숙소",
        target: "_blank",
      },
    ],
    title: "이벤트/제휴",
  },
];

const createLinkMarkup = (item: AirHeaderMenuLink) => {
  const target = item.target ? ` target="${item.target}" rel="noreferrer"` : "";
  return `<a href="${item.href}"${target}>${item.label}</a>`;
};

const createMenuLinkMarkup = (item: AirHeaderMenuLink) => {
  const target = item.target ? ` target="${item.target}" rel="noreferrer"` : "";
  return `<li><a href="${item.href}"${target}>${item.label}</a></li>`;
};

const createMenuGroupMarkup = (group: AirHeaderMenuGroup) => {
  return `
    <div class="sub_menu">
      <h4>${group.title}</h4>
      <ul class="sub_menu">
        ${group.links.map(createMenuLinkMarkup).join("")}
      </ul>
    </div>
  `;
};

const createMobileMenuGroupMarkup = (group: AirHeaderMenuGroup) => {
  return `
    <li>
      <button class="mobile_menu_btn" type="button">${group.title}</button>
      <ul class="mobile_sub_menu">
        ${group.links.map(createMenuLinkMarkup).join("")}
      </ul>
    </li>
  `;
};

const createAirHeaderMarkup = () => {
  return `
    <div class="inner">
      <div class="top_bar_container">
        <div class="top_bar_left">
          ${TOP_BAR_LINKS.map(createLinkMarkup).join("")}
        </div>
        <div class="top_bar_right">
          ${USER_LINKS.map(createLinkMarkup).join("")}
          <div class="language_selector">
            <a href="#">한국어</a>
          </div>
        </div>
      </div>

      <nav class="main_nav">
        <div class="main_nav_container">
          <h1 class="logo">
            <a href="index.html"><img src="assets/img/logo.png" alt="제주항공 로고"></a>
          </h1>
          <button class="hamburger_btn" aria-label="menu" type="button">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="nav_menu_wrap">
            <ul class="nav_menu">
              ${PRIMARY_MENU.map(createMenuLinkMarkup).join("")}
            </ul>
            <div class="sub_menu_wrap">
              <div class="sub_menu_container">
                ${MENU_GROUPS.map(createMenuGroupMarkup).join("")}
              </div>
            </div>
          </div>

          <div class="nav_icons">
            <a href="#" class="btn_search" title="search">
              <img src="assets/img/ico-search.png" alt="search">
            </a>
            <a href="../pages/mypage/dashboard.html?shell=air" title="my page">
              <img src="assets/img/ico-my-page.png" alt="my page">
            </a>
          </div>

          <div class="header_search">
            <input type="text" placeholder="검색어를 입력하세요">
            <button type="button">검색</button>
          </div>
        </div>
      </nav>
    </div>

    <div class="mobile_menu_layer">
      <div class="mobile_menu_header">
        <button class="mobile_close_btn" type="button">✕</button>
      </div>
      <div class="mobile_user_area">
        <a href="../pages/auth/login.html?shell=air">로그인</a>
        <a href="../pages/auth/signup.html?shell=air">회원가입</a>
        <a href="../pages/mypage/dashboard.html?shell=air">마이페이지</a>
      </div>
      <div class="mobile_search">
        <input type="text" placeholder="검색어를 입력하세요">
      </div>
      <ul class="mobile_menu_list">
        ${MENU_GROUPS.map(createMobileMenuGroupMarkup).join("")}
      </ul>
      <div class="mobile_bottom_menu">
        ${TOP_BAR_LINKS.map(createLinkMarkup).join("")}
        <a href="#">한국어</a>
      </div>
    </div>

    <button id="topBtn" title="맨 위로" type="button">↑</button>
  `;
};

const closeMobileLayer = (host: HTMLElement) => {
  const mobileLayer = host.querySelector<HTMLElement>(".mobile_menu_layer");
  if (!mobileLayer) {
    return;
  }

  mobileLayer.classList.remove("active");
  document.body.style.overflow = "";
};

const openMobileLayer = (host: HTMLElement) => {
  const mobileLayer = host.querySelector<HTMLElement>(".mobile_menu_layer");
  if (!mobileLayer) {
    return;
  }

  mobileLayer.classList.add("active");
  document.body.style.overflow = "hidden";
};

const toggleSearchLayer = (host: HTMLElement) => {
  const searchLayer = host.querySelector<HTMLElement>(".header_search");
  if (!searchLayer) {
    return;
  }

  searchLayer.classList.toggle("is_active");
};

const toggleMobileSubMenu = (button: HTMLElement) => {
  const nextSubMenu = button.nextElementSibling as HTMLElement | null;
  if (!nextSubMenu) {
    return;
  }

  const siblings = button.closest(".mobile_menu_list")?.querySelectorAll<HTMLElement>(".mobile_sub_menu") ?? [];
  siblings.forEach((menu) => {
    if (menu !== nextSubMenu) {
      menu.style.display = "none";
    }
  });

  nextSubMenu.style.display = nextSubMenu.style.display === "block" ? "none" : "block";
};

const bindTopButton = (host: HTMLElement) => {
  const topButton = host.querySelector<HTMLElement>("#topBtn");
  if (!topButton) {
    return;
  }

  const syncVisibility = () => {
    topButton.style.display = window.scrollY > 300 ? "block" : "none";
  };

  syncVisibility();
  window.addEventListener("scroll", syncVisibility);

  topButton.addEventListener("click", () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  });
};

const bindFixedNavigation = (host: HTMLElement) => {
  const navigation = host.querySelector<HTMLElement>(".main_nav");
  if (!navigation) {
    return;
  }

  const syncFixedState = () => {
    navigation.classList.toggle("fixed", window.scrollY > 60);
  };

  syncFixedState();
  window.addEventListener("scroll", syncFixedState);
};

const bindHeaderInteractions = (host: HTMLElement) => {
  host.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const searchButton = target.closest(".btn_search");
    if (searchButton) {
      event.preventDefault();
      toggleSearchLayer(host);
      return;
    }

    if (target.closest(".hamburger_btn")) {
      openMobileLayer(host);
      return;
    }

    if (target.closest(".mobile_close_btn")) {
      closeMobileLayer(host);
      return;
    }

    const mobileMenuButton = target.closest(".mobile_menu_btn") as HTMLElement | null;
    if (mobileMenuButton) {
      toggleMobileSubMenu(mobileMenuButton);
    }
  });

  bindFixedNavigation(host);
  bindTopButton(host);
};

export const mountAirHeader = (host: HTMLElement) => {
  host.innerHTML = createAirHeaderMarkup();
  bindHeaderInteractions(host);
};
