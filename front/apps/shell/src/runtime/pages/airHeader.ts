interface AirHeaderMenuLink {
  label: string;
  href?: string;
  routeKey?: string;
  target?: "_blank";
}

interface AirHeaderMenuGroup {
  links: AirHeaderMenuLink[];
  title: string;
}

const TOP_BAR_LINKS: AirHeaderMenuLink[] = [
  { label: "고객센터", routeKey: "SERVICES.AIR.CS.CUSTOMER_SERVICE" },
  { label: "공지사항", routeKey: "SERVICES.AIR.CS.NOTICE" },
];

const USER_LINKS: AirHeaderMenuLink[] = [
  { label: "로그인", routeKey: "SERVICES.AIR.AUTH.LOGIN" },
  { label: "회원가입", routeKey: "SERVICES.AIR.AUTH.SIGNUP" },
];

const PRIMARY_MENU: AirHeaderMenuLink[] = [
  { label: "제주항공", routeKey: "SERVICES.AIR.ABOUT.COMPANY" },
  { label: "항공권 예매", routeKey: "SERVICES.AIR.BOOKING.AVAILABILITY" },
  { label: "탑승 수속", routeKey: "SERVICES.AIR.BOARDING.FAST_PROCEDURE" },
  { label: "여행 준비", routeKey: "SERVICES.AIR.BAGGAGE.PREORDERED" },
  { label: "여행 편의", routeKey: "SERVICES.AIR.JMEMBERS.AIRPLANE" },
  { label: "이벤트/혜택", routeKey: "SERVICES.AIR.EVENT" },
];

const MENU_GROUPS: AirHeaderMenuGroup[] = [
  {
    title: "제주항공",
    links: [
      { label: "회사소개", routeKey: "SERVICES.AIR.ABOUT.COMPANY" },
      { label: "채용안내", routeKey: "SERVICES.AIR.ABOUT.CAREER" },
      { label: "소비자중심경영", routeKey: "SERVICES.AIR.ABOUT.CCM" },
    ],
  },
  {
    title: "예매 안내",
    links: [
      { label: "항공권 예매", routeKey: "SERVICES.AIR.BOOKING.AVAILABILITY" },
      { label: "비회원 예약조회", routeKey: "SERVICES.AIR.BOOKING.GUEST_RESERVATION" },
      { label: "인기 노선", routeKey: "SERVICES.AIR.BOOKING.ROUTE" },
      { label: "펫 멤버십 / 펫 패스", routeKey: "SERVICES.AIR.PET.PASS" },
      { label: "반려동물 운송 서비스", routeKey: "SERVICES.AIR.PET.SERVICE" },
    ],
  },
  {
    title: "탑승 수속 안내",
    links: [
      { label: "빠른 수속", routeKey: "SERVICES.AIR.BOARDING.FAST_PROCEDURE" },
      { label: "모바일 탑승권", routeKey: "SERVICES.AIR.BOARDING.MOBILE_CHECKIN" },
      { label: "사전 서약서", routeKey: "SERVICES.AIR.BOARDING.E_DOCUMENT" },
    ],
  },
  {
    title: "수하물 안내",
    links: [
      { label: "사전 수하물", routeKey: "SERVICES.AIR.BAGGAGE.PREORDERED" },
      { label: "기내 수하물", routeKey: "SERVICES.AIR.BAGGAGE.CABIN" },
      { label: "운송제한 물품", routeKey: "SERVICES.AIR.BAGGAGE.LIMITATION" },
      { label: "수하물 분실 및 배상", routeKey: "SERVICES.AIR.BAGGAGE.LIABILITY" },
    ],
  },
  {
    title: "J 멤버십",
    links: [
      { label: "관광", routeKey: "SERVICES.AIR.JMEMBERS.SIGHTSEEING" },
      { label: "공항 편의", routeKey: "SERVICES.AIR.JMEMBERS.AIRPLANE" },
      { label: "골프 멤버십", routeKey: "SERVICES.AIR.JMEMBERS.GOLF" },
      { label: "금융/여행자 보험", routeKey: "SERVICES.AIR.JMEMBERS.INSURANCE" },
    ],
  },
  {
    title: "이벤트/혜택",
    links: [
      { label: "이벤트", routeKey: "SERVICES.AIR.EVENT" },
      { href: "https://jejurentcar.netlify.app/", label: "렌터카", target: "_blank" },
      {
        href: "https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html",
        label: "호텔/숙소",
        target: "_blank",
      },
    ],
  },
];

const createLinkMarkup = (item: AirHeaderMenuLink) => {
  if (item.routeKey) {
    return `<a href="#" class="route-link" data-route="${item.routeKey}">${item.label}</a>`;
  }

  const target = item.target ? ` target="${item.target}" rel="noreferrer"` : "";
  return `<a href="${item.href ?? "#"}"${target}>${item.label}</a>`;
};

const createMenuLinkMarkup = (item: AirHeaderMenuLink) => {
  if (item.routeKey) {
    return `<li><a href="#" class="route-link" data-route="${item.routeKey}">${item.label}</a></li>`;
  }

  const target = item.target ? ` target="${item.target}" rel="noreferrer"` : "";
  return `<li><a href="${item.href ?? "#"}"${target}>${item.label}</a></li>`;
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
            <a href="#">언어</a>
          </div>
        </div>
      </div>

      <nav class="main_nav">
        <div class="main_nav_container">
          <h1 class="logo">
            <a href="#" class="route-link" data-route="SERVICES.AIR.MAIN"><img src="assets/img/logo.png" alt="제주항공 로고"></a>
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
            <a href="#" class="route-link" data-route="SERVICES.AIR.AUTH.MYPAGE" title="my page">
              <img src="assets/img/ico-my-page.png" alt="my page">
            </a>
          </div>

          <div class="header_search">
            <input type="text" placeholder="검색어를 입력해 주세요">
            <button type="button">검색</button>
          </div>
        </div>
      </nav>
    </div>

    <div class="mobile_menu_layer">
      <div class="mobile_menu_header">
        <button class="mobile_close_btn" type="button">닫기</button>
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
        ${MENU_GROUPS.map(createMobileMenuGroupMarkup).join("")}
      </ul>
      <div class="mobile_bottom_menu">
        ${TOP_BAR_LINKS.map(createLinkMarkup).join("")}
        <a href="#">언어</a>
      </div>
    </div>

    <button id="topBtn" title="맨 위로" type="button">TOP</button>
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
