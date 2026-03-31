import { c as y, j as o } from "./react-vendor-BoSfm_Te.js";
import { L as A, P as v, S as _ } from "./feature-auth-DaI1gc8m.js";
import "./legacy-core-C4kaoWaO.js";
import { M as j } from "./feature-mypage-BYpktxFh.js";
import { i as C, a as w, b as L, c as M, d as k, e as T, f as H, m as d, g as K, h as V, j as B } from "./runtime-layout-DHpRrzxW.js";
import { c as O, i as N, r as G } from "./runtime-ui-DtDVY2Bb.js";
import { T as $ } from "./feature-travel-c3JZIw7d.js";
import { H as P, a as U, b as x } from "./feature-hotel-Bgdi1GLl.js";
import { L as D } from "./feature-life-DUpdQrqi.js";
let p = !1, m = !1;
const F = () => {
  m || (m = !0, document.body.addEventListener("click", async (e) => {
    var a;
    (a = e.target) != null && a.closest('[data-action="OPEN_RESERVATION_DRAWER"]') && (e.preventDefault(), await G.open());
  }));
}, f = () => {
  p || (p = !0, window.initHeader = () => C(), window.initFooter = () => w(), window.initMegaMenu = () => L(), window.initStaggerNav = () => M(), N(), k(), T(), F(), H());
}, Be = (e) => (f(), O(e)), b = /* @__PURE__ */ new Map(), s = (e, t) => {
  const a = document.getElementById(e);
  if (!a)
    return;
  const r = b.get(e);
  r && r.unmount();
  const n = y(a);
  b.set(e, n), n.render(t);
}, Oe = () => {
  s("jeju-login-app", /* @__PURE__ */ o.jsx(A, {}));
}, Ne = () => {
  s("jeju-pass-auth-app", /* @__PURE__ */ o.jsx(v, {}));
}, Ge = () => {
  s("mypage-dashboard-root", /* @__PURE__ */ o.jsx(j, {}));
}, E = [
  { label: "고객센터", routeKey: "SERVICES.AIR.CS.CUSTOMER_SERVICE" },
  { label: "공지사항", routeKey: "SERVICES.AIR.CS.NOTICE" }
], Y = [
  { label: "로그인", routeKey: "SERVICES.AIR.AUTH.LOGIN" },
  { label: "회원가입", routeKey: "SERVICES.AIR.AUTH.SIGNUP" }
], q = [
  { label: "제주항공", routeKey: "SERVICES.AIR.ABOUT.COMPANY" },
  { label: "항공권 예매", routeKey: "SERVICES.AIR.BOOKING.AVAILABILITY" },
  { label: "탑승 수속", routeKey: "SERVICES.AIR.BOARDING.FAST_PROCEDURE" },
  { label: "여행 준비", routeKey: "SERVICES.AIR.BAGGAGE.PREORDERED" },
  { label: "여행 편의", routeKey: "SERVICES.AIR.JMEMBERS.AIRPLANE" },
  { label: "이벤트/혜택", routeKey: "SERVICES.AIR.EVENT" }
], S = [
  {
    title: "제주항공",
    links: [
      { label: "회사소개", routeKey: "SERVICES.AIR.ABOUT.COMPANY" },
      { label: "채용안내", routeKey: "SERVICES.AIR.ABOUT.CAREER" },
      { label: "소비자중심경영", routeKey: "SERVICES.AIR.ABOUT.CCM" }
    ]
  },
  {
    title: "예매 안내",
    links: [
      { label: "항공권 예매", routeKey: "SERVICES.AIR.BOOKING.AVAILABILITY" },
      { label: "비회원 예약조회", routeKey: "SERVICES.AIR.BOOKING.GUEST_RESERVATION" },
      { label: "인기 노선", routeKey: "SERVICES.AIR.BOOKING.ROUTE" },
      { label: "펫 멤버십 / 펫 패스", routeKey: "SERVICES.AIR.PET.PASS" },
      { label: "반려동물 운송 서비스", routeKey: "SERVICES.AIR.PET.SERVICE" }
    ]
  },
  {
    title: "탑승 수속 안내",
    links: [
      { label: "빠른 수속", routeKey: "SERVICES.AIR.BOARDING.FAST_PROCEDURE" },
      { label: "모바일 탑승권", routeKey: "SERVICES.AIR.BOARDING.MOBILE_CHECKIN" },
      { label: "사전 서약서", routeKey: "SERVICES.AIR.BOARDING.E_DOCUMENT" }
    ]
  },
  {
    title: "수하물 안내",
    links: [
      { label: "사전 수하물", routeKey: "SERVICES.AIR.BAGGAGE.PREORDERED" },
      { label: "기내 수하물", routeKey: "SERVICES.AIR.BAGGAGE.CABIN" },
      { label: "운송제한 물품", routeKey: "SERVICES.AIR.BAGGAGE.LIMITATION" },
      { label: "수하물 분실 및 배상", routeKey: "SERVICES.AIR.BAGGAGE.LIABILITY" }
    ]
  },
  {
    title: "J 멤버십",
    links: [
      { label: "관광", routeKey: "SERVICES.AIR.JMEMBERS.SIGHTSEEING" },
      { label: "공항 편의", routeKey: "SERVICES.AIR.JMEMBERS.AIRPLANE" },
      { label: "골프 멤버십", routeKey: "SERVICES.AIR.JMEMBERS.GOLF" },
      { label: "금융/여행자 보험", routeKey: "SERVICES.AIR.JMEMBERS.INSURANCE" }
    ]
  },
  {
    title: "이벤트/혜택",
    links: [
      { label: "이벤트", routeKey: "SERVICES.AIR.EVENT" },
      { href: "https://jejurentcar.netlify.app/", label: "렌터카", target: "_blank" },
      {
        href: "https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html",
        label: "호텔/숙소",
        target: "_blank"
      }
    ]
  }
], c = (e) => {
  if (e.routeKey)
    return `<a href="#" class="route-link" data-route="${e.routeKey}">${e.label}</a>`;
  const t = e.target ? ` target="${e.target}" rel="noreferrer"` : "";
  return `<a href="${e.href ?? "#"}"${t}>${e.label}</a>`;
}, u = (e) => {
  if (e.routeKey)
    return `<li><a href="#" class="route-link" data-route="${e.routeKey}">${e.label}</a></li>`;
  const t = e.target ? ` target="${e.target}" rel="noreferrer"` : "";
  return `<li><a href="${e.href ?? "#"}"${t}>${e.label}</a></li>`;
}, W = (e) => `
    <div class="sub_menu">
      <h4>${e.title}</h4>
      <ul class="sub_menu">
        ${e.links.map(u).join("")}
      </ul>
    </div>
  `, J = (e) => `
    <li>
      <button class="mobile_menu_btn" type="button">${e.title}</button>
      <ul class="mobile_sub_menu">
        ${e.links.map(u).join("")}
      </ul>
    </li>
  `, z = () => `
    <div class="inner">
      <div class="top_bar_container">
        <div class="top_bar_left">
          ${E.map(c).join("")}
        </div>
        <div class="top_bar_right">
          ${Y.map(c).join("")}
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
              ${q.map(u).join("")}
            </ul>
            <div class="sub_menu_wrap">
              <div class="sub_menu_container">
                ${S.map(W).join("")}
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
        ${S.map(J).join("")}
      </ul>
      <div class="mobile_bottom_menu">
        ${E.map(c).join("")}
        <a href="#">언어</a>
      </div>
    </div>

    <button id="topBtn" title="맨 위로" type="button">TOP</button>
  `, Q = (e) => {
  const t = e.querySelector(".mobile_menu_layer");
  t && (t.classList.remove("active"), document.body.style.overflow = "");
}, X = (e) => {
  const t = e.querySelector(".mobile_menu_layer");
  t && (t.classList.add("active"), document.body.style.overflow = "hidden");
}, Z = (e) => {
  const t = e.querySelector(".header_search");
  t && t.classList.toggle("is_active");
}, ee = (e) => {
  var r;
  const t = e.nextElementSibling;
  if (!t)
    return;
  (((r = e.closest(".mobile_menu_list")) == null ? void 0 : r.querySelectorAll(".mobile_sub_menu")) ?? []).forEach((n) => {
    n !== t && (n.style.display = "none");
  }), t.style.display = t.style.display === "block" ? "none" : "block";
}, te = (e) => {
  const t = e.querySelector("#topBtn");
  if (!t)
    return;
  const a = () => {
    t.style.display = window.scrollY > 300 ? "block" : "none";
  };
  a(), window.addEventListener("scroll", a), t.addEventListener("click", () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0
    });
  });
}, ae = (e) => {
  const t = e.querySelector(".main_nav");
  if (!t)
    return;
  const a = () => {
    t.classList.toggle("fixed", window.scrollY > 60);
  };
  a(), window.addEventListener("scroll", a);
}, re = (e) => {
  e.addEventListener("click", (t) => {
    const a = t.target;
    if (!a)
      return;
    if (a.closest(".btn_search")) {
      t.preventDefault(), Z(e);
      return;
    }
    if (a.closest(".hamburger_btn")) {
      X(e);
      return;
    }
    if (a.closest(".mobile_close_btn")) {
      Q(e);
      return;
    }
    const n = a.closest(".mobile_menu_btn");
    n && ee(n);
  }), ae(e), te(e);
}, ne = (e) => {
  e.innerHTML = z(), re(e);
}, oe = [
  {
    title: "제주항공",
    links: [
      { label: "회사소개", routeKey: "SERVICES.AIR.ABOUT.COMPANY" },
      { label: "채용안내", routeKey: "SERVICES.AIR.ABOUT.CAREER" },
      { label: "소비자중심경영", routeKey: "SERVICES.AIR.ABOUT.CCM" },
      { label: "공지사항", routeKey: "SERVICES.AIR.CS.NOTICE" }
    ]
  },
  {
    title: "규정 및 안내",
    links: [
      { href: "#", label: "이용약관" },
      { href: "#", label: "운송약관 및 기타" },
      { href: "#", label: "개인정보처리방침" },
      { href: "#", label: "국내선 여객운임 안내" },
      { href: "#", label: "국제선 여객운임 안내" }
    ]
  },
  {
    title: "기타 안내",
    links: [
      { href: "#", label: "사전서약서" },
      { href: "#", label: "항공위험물안내" },
      { href: "#", label: "항공안전자고공시" },
      { href: "#", label: "항공교통이용자 서비스 계획" },
      { href: "#", label: "항공교통이용자 피해구제 계획" }
    ]
  },
  {
    title: "이벤트/혜택",
    links: [
      { label: "이벤트", routeKey: "SERVICES.AIR.EVENT" },
      { href: "https://jejurentcar.netlify.app/", label: "렌터카", target: "_blank" },
      {
        href: "https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html",
        label: "호텔/숙소",
        target: "_blank"
      }
    ]
  }
], se = [
  {
    alt: "유튜브",
    href: "https://www.youtube.com/@jejuair_official",
    imageSrc: "assets/img/20250804165831645.png"
  },
  {
    alt: "인스타그램",
    href: "https://www.instagram.com/jejuair_official/",
    imageSrc: "assets/img/20250804165841751.png"
  },
  {
    alt: "페이스북",
    href: "https://www.facebook.com/funjejuair/",
    imageSrc: "assets/img/20250804165859889.png"
  },
  {
    alt: "틱톡",
    href: "https://www.tiktok.com/@jejuair_official",
    imageSrc: "assets/img/20250804165850759.png"
  }
], le = (e) => {
  if (e.routeKey)
    return `<li><a href="#" class="route-link" data-route="${e.routeKey}">${e.label}</a></li>`;
  const t = e.target ? ` target="${e.target}" rel="noreferrer"` : "";
  return `<li><a href="${e.href ?? "#"}"${t}>${e.label}</a></li>`;
}, ie = (e) => `
    <div class="footer_link">
      <h4>${e.title}</h4>
      <ul>
        ${e.links.map(le).join("")}
      </ul>
    </div>
  `, ce = (e) => `<a href="${e.href}" target="_blank" rel="noreferrer"><img src="${e.imageSrc}" alt="${e.alt}"></a>`, ue = () => `
    <div class="inner">
      <div class="footer_top">
        ${oe.map(ie).join("")}
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
            ${se.map(ce).join("")}
          </div>
          <div class="qr_link">
            <h4>앱을 다운로드하고<br>앱 전용 혜택도<br>받아보세요</h4>
            <img src="assets/img/icon-app-down-qr.png" alt="qr">
          </div>
        </div>
      </div>
    </div>
  `, de = (e) => {
  e.addEventListener("click", (t) => {
    var r, n;
    if (window.innerWidth > 1024)
      return;
    const a = (r = t.target) == null ? void 0 : r.closest(".footer_link h4");
    a && ((n = a.parentElement) == null || n.classList.toggle("open"));
  });
}, pe = (e) => {
  e.innerHTML = ue(), de(e);
}, me = (e) => {
  let t = document.getElementById("jeju-page-shell-base");
  t || (t = document.createElement("base"), t.id = "jeju-page-shell-base", document.head.prepend(t)), t.href = e("jejuair/"), document.body.classList.add("jejuair-main-content");
}, be = () => {
  const e = document.getElementById("jeju-page-shell-base");
  e && e.remove(), document.body.classList.remove("jejuair-main-content");
}, Ee = async (e, t) => {
  t.loadStyle("jejuair/css/main.css"), e.headerHost.innerHTML = '<header id="header_wrap"></header>', e.footerHost.innerHTML = '<footer id="footer_wrap"></footer>';
  const a = e.headerHost.querySelector("#header_wrap"), r = e.footerHost.querySelector("#footer_wrap");
  a && ne(a), r && pe(r);
}, Se = "shell", g = "jeju:mypage-shell", h = /* @__PURE__ */ new Set(["main", "stay", "air"]);
let R = null;
const he = () => document.getElementById("jeju-page-shell-header"), Re = () => document.getElementById("jeju-page-shell-footer"), i = () => ({
  footerHost: Re(),
  headerHost: he()
}), I = (e) => new URL(e, B()).href, l = (e) => e, fe = (e) => {
  const t = /^[a-z]+:/i.test(e) ? e : I(e);
  if (Array.from(document.styleSheets).some((n) => n.href === t))
    return;
  const r = document.createElement("link");
  r.rel = "stylesheet", r.href = t, document.head.appendChild(r);
}, ge = (e) => {
  if (e === "air") {
    me(I);
    return;
  }
  be();
}, Ie = () => {
  if (!document.referrer)
    return null;
  try {
    const t = new URL(document.referrer).pathname.toLowerCase();
    if (t.includes("/jejuair/"))
      return "air";
    if (t.includes("/jejustay/"))
      return "stay";
    if (t.endsWith("/index.html") || t === "/" || t.includes("/front/index.html"))
      return "main";
  } catch {
    return null;
  }
  return null;
}, ye = () => {
  const t = new URLSearchParams(window.location.search).get(Se);
  if (t && h.has(t))
    return l(t);
  const a = Ie();
  if (a)
    return l(a);
  const r = window.sessionStorage.getItem(g);
  return r && h.has(r) ? l(r) : l("main");
}, Ae = (e) => {
  window.sessionStorage.setItem(g, e), document.body.dataset.mypageShell = e;
}, ve = async () => {
  const { footerHost: e, headerHost: t } = i();
  !t || !e || (t.innerHTML = '<div id="main-header-placeholder"></div>', e.innerHTML = '<div id="main-footer-placeholder"></div>', await V());
}, _e = async () => {
  const { footerHost: e, headerHost: t } = i();
  !t || !e || (t.innerHTML = '<div id="hotel-header-placeholder"></div>', e.innerHTML = '<div id="hotel-footer-placeholder"></div>', await K());
}, je = async () => {
  const { footerHost: e, headerHost: t } = i();
  !t || !e || await Ee(
    {
      footerHost: e,
      headerHost: t
    },
    {
      loadStyle: fe
    }
  );
}, $e = async () => {
  const { footerHost: e, headerHost: t } = i();
  if (!t || !e)
    return "main";
  const a = ye();
  return Ae(a), ge(a), f(), R === a && t.childElementCount > 0 && e.childElementCount > 0 ? (d("page-shell"), a) : (a === "air" ? (await je(), await new Promise((r) => window.setTimeout(r, 40))) : a === "stay" ? await _e() : await ve(), R = a, d("page-shell"), a);
}, Pe = () => {
  s("jeju-signup-app", /* @__PURE__ */ o.jsx(_, {}));
}, Ue = async () => {
  s("jeju-travel-checklist-app", /* @__PURE__ */ o.jsx($, {}));
}, xe = async () => {
  s("hotel-search-widget-root", /* @__PURE__ */ o.jsx(P, {}));
}, De = async () => {
  s("hotel-list-search-widget-root", /* @__PURE__ */ o.jsx(U, {}));
}, Fe = async () => {
  s("hotel-list-page-root", /* @__PURE__ */ o.jsx(x, {}));
}, Ye = async () => {
  s("life-search-widget-root", /* @__PURE__ */ o.jsx(D, {}));
};
export {
  Ne as a,
  Pe as b,
  Fe as c,
  De as d,
  xe as e,
  Ye as f,
  Ge as g,
  $e as h,
  f as i,
  Ue as j,
  Be as k,
  Oe as m
};
