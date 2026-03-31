interface AirFooterLinkItem {
  label: string;
  href?: string;
  routeKey?: string;
  target?: "_blank";
}

interface AirFooterSection {
  links: AirFooterLinkItem[];
  title: string;
}

interface AirFooterSocialItem {
  alt: string;
  href: string;
  imageSrc: string;
}

const FOOTER_SECTIONS: AirFooterSection[] = [
  {
    title: "제주항공",
    links: [
      { label: "회사소개", routeKey: "SERVICES.AIR.ABOUT.COMPANY" },
      { label: "채용안내", routeKey: "SERVICES.AIR.ABOUT.CAREER" },
      { label: "소비자중심경영", routeKey: "SERVICES.AIR.ABOUT.CCM" },
      { label: "공지사항", routeKey: "SERVICES.AIR.CS.NOTICE" },
    ],
  },
  {
    title: "규정 및 안내",
    links: [
      { href: "#", label: "이용약관" },
      { href: "#", label: "운송약관 및 기타" },
      { href: "#", label: "개인정보처리방침" },
      { href: "#", label: "국내선 여객운임 안내" },
      { href: "#", label: "국제선 여객운임 안내" },
    ],
  },
  {
    title: "기타 안내",
    links: [
      { href: "#", label: "사전서약서" },
      { href: "#", label: "항공위험물안내" },
      { href: "#", label: "항공안전자고공시" },
      { href: "#", label: "항공교통이용자 서비스 계획" },
      { href: "#", label: "항공교통이용자 피해구제 계획" },
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

const SOCIAL_LINKS: AirFooterSocialItem[] = [
  {
    alt: "유튜브",
    href: "https://www.youtube.com/@jejuair_official",
    imageSrc: "assets/img/20250804165831645.png",
  },
  {
    alt: "인스타그램",
    href: "https://www.instagram.com/jejuair_official/",
    imageSrc: "assets/img/20250804165841751.png",
  },
  {
    alt: "페이스북",
    href: "https://www.facebook.com/funjejuair/",
    imageSrc: "assets/img/20250804165859889.png",
  },
  {
    alt: "틱톡",
    href: "https://www.tiktok.com/@jejuair_official",
    imageSrc: "assets/img/20250804165850759.png",
  },
];

const createLinkMarkup = (item: AirFooterLinkItem) => {
  if (item.routeKey) {
    return `<li><a href="#" class="route-link" data-route="${item.routeKey}">${item.label}</a></li>`;
  }

  const target = item.target ? ` target="${item.target}" rel="noreferrer"` : "";
  return `<li><a href="${item.href ?? "#"}"${target}>${item.label}</a></li>`;
};

const createSectionMarkup = (section: AirFooterSection) => {
  return `
    <div class="footer_link">
      <h4>${section.title}</h4>
      <ul>
        ${section.links.map(createLinkMarkup).join("")}
      </ul>
    </div>
  `;
};

const createSocialMarkup = (item: AirFooterSocialItem) => {
  return `<a href="${item.href}" target="_blank" rel="noreferrer"><img src="${item.imageSrc}" alt="${item.alt}"></a>`;
};

const createAirFooterMarkup = () => {
  return `
    <div class="inner">
      <div class="footer_top">
        ${FOOTER_SECTIONS.map(createSectionMarkup).join("")}
      </div>
      <div class="footer_bottom">
        <div class="company_info">
          <h3>(주) 제주항공</h3>
          <div class="company_details">
            <p>대표이사 : 김이배&nbsp;&nbsp;&nbsp;&nbsp;사업자등록번호 : 616-81-50527&nbsp;&nbsp;&nbsp;&nbsp;통신판매신고 : 제주 2006-125&nbsp;&nbsp;&nbsp;&nbsp;호스팅 사업자 : AWS</p>
            <p>주소 : 제주특별자치도 제주시 신대로 64 (연동, 건설회관빌딩 3층)&nbsp;&nbsp;&nbsp;&nbsp;고객센터 : 1599-1500 (09:00 ~ 19:00)</p>
            <p>고객 문의 : jejuair.help@jejuair.net&nbsp;&nbsp;&nbsp;&nbsp;제휴 문의 : partnership@jejuair.net</p>
          </div>
          <div class="copyright">Copyright Jeju Air. All Rights Reserved.</div>
        </div>
        <div class="link_container">
          <div class="sns_link">
            ${SOCIAL_LINKS.map(createSocialMarkup).join("")}
          </div>
          <div class="qr_link">
            <h4>앱을 다운로드하고<br>앱 전용 혜택도<br>받아보세요</h4>
            <img src="assets/img/icon-app-down-qr.png" alt="qr">
          </div>
        </div>
      </div>
    </div>
  `;
};

const bindFooterAccordion = (host: HTMLElement) => {
  host.addEventListener("click", (event) => {
    if (window.innerWidth > 1024) {
      return;
    }

    const title = (event.target as HTMLElement | null)?.closest(".footer_link h4");
    if (!title) {
      return;
    }

    title.parentElement?.classList.toggle("open");
  });
};

export const mountAirFooter = (host: HTMLElement) => {
  host.innerHTML = createAirFooterMarkup();
  bindFooterAccordion(host);
};
