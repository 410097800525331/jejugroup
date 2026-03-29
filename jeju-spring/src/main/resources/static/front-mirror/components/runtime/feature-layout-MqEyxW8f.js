import { j as e, a as g } from "./react-vendor-BoSfm_Te.js";
import { U as E, a as b, S, b as I, c as k, P as R, d as x, e as A, M as w, f as C, g as L, L as y, h as T, H as M, i as v, j as V, k as H, G as P, C as O, l as _, m as D, n as G, o as U, p as $, q as B, B as N, r as q, s as Y, t as F } from "./icon-vendor-Dpra3II6.js";
import { r as W } from "./legacy-core-CYHwlLlr.js";
const J = {
  "book-open": q,
  "building-2": N,
  calendar: B,
  "chevron-left": $,
  "chevron-right": U,
  "check-circle": G,
  "clipboard-list": D,
  compass: _,
  "credit-card": O,
  gift: P,
  headphones: H,
  heart: V,
  home: v,
  hotel: M,
  lightbulb: T,
  "log-out": y,
  map: L,
  menu: C,
  minus: w,
  percent: A,
  plane: x,
  plus: R,
  search: k,
  "shield-check": I,
  smartphone: S,
  user: b,
  users: E
}, i = ({ name: l, className: a }) => {
  const s = J[l] ?? Y;
  return /* @__PURE__ */ e.jsx(s, { className: a, strokeWidth: 1.9, "aria-hidden": "true", focusable: "false" });
}, z = ({ item: l }) => /* @__PURE__ */ e.jsxs("li", { className: "hotel-shell-nav-item", children: [
  /* @__PURE__ */ e.jsxs("a", { href: "#", className: "hotel-shell-nav-link route-link", "data-route": l.route, children: [
    /* @__PURE__ */ e.jsxs("span", { className: "hotel-shell-nav-icon-roll stagger-wrapper", "aria-hidden": "true", children: [
      /* @__PURE__ */ e.jsx("span", { className: "hotel-shell-nav-icon-layer stagger-original", children: /* @__PURE__ */ e.jsx(i, { name: l.icon, className: "hotel-shell-nav-icon" }) }),
      /* @__PURE__ */ e.jsx("span", { className: "hotel-shell-nav-icon-layer stagger-clone", children: /* @__PURE__ */ e.jsx(i, { name: l.icon, className: "hotel-shell-nav-icon" }) })
    ] }),
    /* @__PURE__ */ e.jsx("span", { "data-lang": l.dataLang, children: l.label })
  ] }),
  /* @__PURE__ */ e.jsxs("div", { className: "hotel-shell-mega-dropdown", children: [
    /* @__PURE__ */ e.jsx("div", { className: "hotel-shell-mega-menu-list-container", children: l.menuItems.map((a) => /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: "#",
        className: "hotel-shell-mega-menu-item route-link",
        "data-route": a.route,
        "data-preview": a.previewId,
        children: [
          /* @__PURE__ */ e.jsx(i, { name: a.icon, className: "hotel-shell-mega-menu-icon" }),
          /* @__PURE__ */ e.jsx("span", { children: a.label }),
          a.isNew ? /* @__PURE__ */ e.jsx("span", { className: "hotel-shell-badge-new", children: "NEW" }) : null
        ]
      },
      `${a.route}-${a.previewId}`
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "hotel-shell-mega-menu-preview", children: [
      /* @__PURE__ */ e.jsx("div", { className: "hotel-shell-preview-loader", children: /* @__PURE__ */ e.jsx("i", { className: "fas fa-spinner fa-spin" }) }),
      l.previews.map((a, s) => /* @__PURE__ */ e.jsx(
        "img",
        {
          id: a.id,
          src: a.src,
          alt: a.alt,
          className: `hotel-shell-preview-image ${s === 0 ? "active" : ""}`
        },
        a.id
      ))
    ] })
  ] })
] }), K = [
  {
    route: "SERVICES.STAY.MAIN",
    icon: "building-2",
    dataLang: "navAccommodations",
    label: "숙소 예약",
    menuItems: [
      { route: "SERVICES.STAY.MAIN", previewId: "preview-hotel", icon: "hotel", label: "호텔 & 리조트" },
      { route: "SERVICES.STAY.LIFE", previewId: "preview-month", icon: "calendar", label: "한달살기", isNew: !0 },
      { route: "SERVICES.STAY.PRIVATE", previewId: "preview-private", icon: "home", label: "프라이빗 스테이" }
    ],
    previews: [
      {
        id: "preview-hotel",
        src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        alt: "Hotel"
      },
      {
        id: "preview-month",
        src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        alt: "Month Stay"
      },
      {
        id: "preview-private",
        src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80",
        alt: "Private Stay"
      }
    ]
  },
  {
    route: "SERVICES.TRAVEL.ACTIVITIES",
    icon: "plane",
    dataLang: "navTravel",
    label: "여행 상품",
    menuItems: [
      { route: "SERVICES.TRAVEL.ACTIVITIES", previewId: "preview-activity", icon: "compass", label: "액티비티" },
      { route: "SERVICES.TRAVEL.ESIM", previewId: "preview-esim", icon: "smartphone", label: "eSIM / 유심" }
    ],
    previews: [
      {
        id: "preview-activity",
        src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80",
        alt: "Activity"
      },
      {
        id: "preview-esim",
        src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        alt: "eSIM"
      }
    ]
  },
  {
    route: "SERVICES.DEALS.MAIN",
    icon: "percent",
    dataLang: "navDeals",
    label: "혜택 & 특가",
    menuItems: [
      { route: "SERVICES.DEALS.MAIN", previewId: "preview-promo", icon: "gift", label: "이번 달 프로모션" },
      { route: "SERVICES.DEALS.MEMBER", previewId: "preview-member", icon: "users", label: "회원 전용 혜택" },
      { route: "SERVICES.DEALS.PARTNER", previewId: "preview-partner", icon: "credit-card", label: "제휴 카드 할인" }
    ],
    previews: [
      {
        id: "preview-promo",
        src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
        alt: "Promo"
      },
      {
        id: "preview-member",
        src: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=600&q=80",
        alt: "Member"
      },
      {
        id: "preview-partner",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
        alt: "Partner"
      }
    ]
  },
  {
    route: "SERVICES.TRAVEL.GUIDE",
    icon: "book-open",
    dataLang: "navGuide",
    label: "여행 정보",
    menuItems: [
      { route: "SERVICES.TRAVEL.GUIDE", previewId: "preview-guide", icon: "map", label: "여행 가이드북" },
      { route: "SERVICES.TRAVEL.TIPS", previewId: "preview-tips", icon: "lightbulb", label: "여행 팁" },
      { route: "SERVICES.TRAVEL.CHECKLIST", previewId: "preview-checklist", icon: "check-circle", label: "여행 체크리스트" }
    ],
    previews: [
      {
        id: "preview-guide",
        src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
        alt: "Guide"
      },
      {
        id: "preview-tips",
        src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=80",
        alt: "Tips"
      },
      {
        id: "preview-checklist",
        src: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
        alt: "Checklist"
      }
    ]
  }
], Q = [
  { route: "SERVICES.STAY.MAIN", dataLang: "mobileNavHotel", label: "숙소 예약", active: !0 },
  { route: "SERVICES.STAY.LIFE", dataLang: "mobileNavLife", label: "한달살기" },
  { route: "SERVICES.TRAVEL.ACTIVITIES", dataLang: "mobileNavActivity", label: "액티비티" },
  { route: "SERVICES.TRAVEL.ESIM", dataLang: "mobileNavEsim", label: "eSIM" },
  { route: "SERVICES.TRAVEL.GUIDE", dataLang: "mobileNavGuide", label: "여행 가이드" },
  { route: "SERVICES.TRAVEL.TIPS", dataLang: "mobileNavTips", label: "여행 일정 팁" },
  { action: "OPEN_RESERVATION_DRAWER", dataLang: "navResCheck", label: "예약 확인" },
  { route: "AUTH.LOGIN", routeParams: '{"shell":"stay"}', dataLang: "navLogin", label: "로그인" }
], ne = ({ basePath: l }) => /* @__PURE__ */ e.jsxs("header", { className: "header hotel-shell-header", id: "header", children: [
  /* @__PURE__ */ e.jsxs("div", { className: "hotel-shell-header-container", children: [
    /* @__PURE__ */ e.jsx("a", { href: "#", className: "hotel-shell-logo route-link", "data-route": "SERVICES.STAY.MAIN", children: /* @__PURE__ */ e.jsx("img", { src: `${l}jejustay/images/logo_jejuhotel.png`, alt: "JEJU STAY", className: "hotel-shell-logo-img" }) }),
    /* @__PURE__ */ e.jsx("nav", { className: "hotel-shell-main-nav", children: /* @__PURE__ */ e.jsx("ul", { className: "hotel-shell-nav-list", children: K.map((a) => /* @__PURE__ */ e.jsx(z, { item: a }, `${a.route}-${a.dataLang}`)) }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "hotel-shell-header-utils", children: [
      /* @__PURE__ */ e.jsxs(
        "a",
        {
          href: "#",
          className: "hotel-shell-util-link admin-link route-link",
          "data-route": "ADMIN.DASHBOARD",
          id: "headerAdminBtn",
          style: { display: "none" },
          children: [
            /* @__PURE__ */ e.jsx(i, { name: "shield-check", className: "hotel-shell-util-icon" }),
            /* @__PURE__ */ e.jsx("span", { children: "관리자 페이지" })
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "a",
        {
          href: "#",
          className: "hotel-shell-util-link route-link",
          "data-action": "OPEN_RESERVATION_DRAWER",
          id: "headerAuthActionBtn",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "hotel-shell-util-icon", "aria-hidden": "true", children: [
              /* @__PURE__ */ e.jsx("span", { "data-auth-icon": "guest", children: /* @__PURE__ */ e.jsx(i, { name: "clipboard-list", className: "hotel-shell-util-icon" }) }),
              /* @__PURE__ */ e.jsx("span", { "data-auth-icon": "member", hidden: !0, children: /* @__PURE__ */ e.jsx(i, { name: "user", className: "hotel-shell-util-icon" }) }),
              /* @__PURE__ */ e.jsx("span", { "data-auth-icon": "admin", hidden: !0, children: /* @__PURE__ */ e.jsx(i, { name: "shield-check", className: "hotel-shell-util-icon" }) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                "data-auth-label": !0,
                "data-auth-label-ko": "비회원 예약확인",
                "data-auth-label-en": "Guest Reservation Check",
                "data-auth-member-label-ko": "마이페이지",
                "data-auth-member-label-en": "My Page",
                "data-auth-admin-label-ko": "관리자 페이지",
                "data-auth-admin-label-en": "Admin Page",
                children: "비회원 예약확인"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "a",
        {
          href: "#",
          className: "hotel-shell-util-link route-link",
          "data-route": "AUTH.LOGIN",
          "data-route-params": '{"shell":"stay"}',
          id: "headerLoginBtn",
          children: [
            /* @__PURE__ */ e.jsx(i, { name: "user", className: "hotel-shell-util-icon" }),
            /* @__PURE__ */ e.jsx("span", { "data-lang": "navLogin", children: "로그인" })
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs("a", { href: "#", className: "hotel-shell-util-link route-link", "data-route": "CS.CUSTOMER_CENTER", children: [
        /* @__PURE__ */ e.jsx(i, { name: "headphones", className: "hotel-shell-util-icon" }),
        /* @__PURE__ */ e.jsx("span", { "data-lang": "navCs", children: "고객센터" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("button", { className: "hotel-shell-mobile-menu-btn", id: "mobileMenuBtn", "aria-label": "메뉴 열기", children: /* @__PURE__ */ e.jsx(i, { name: "menu", className: "hotel-shell-util-icon" }) })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "hotel-shell-mobile-nav", id: "mobileNav", children: /* @__PURE__ */ e.jsx("ul", { className: "hotel-shell-mobile-nav-list", children: Q.map((a) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx(
    "a",
    {
      href: "#",
      className: `hotel-shell-mobile-nav-link route-link${a.active ? " active" : ""}`,
      "data-route": a.route,
      "data-route-params": a.routeParams,
      "data-action": a.action,
      "data-lang": a.dataLang,
      children: a.label
    }
  ) }, `${a.route ?? a.action ?? a.dataLang}-${a.dataLang}`)) }) })
] }), X = [
  {
    href: "/index.html",
    icon: v,
    key: "main",
    title: "제주그룹 메인"
  },
  {
    href: "/jejuair/index.html",
    icon: x,
    key: "air",
    title: "제주에어"
  },
  {
    href: "/jejustay/pages/hotel/jejuhotel.html",
    icon: N,
    key: "stay",
    title: "제주스테이"
  },
  {
    href: "https://jejurentcar.netlify.app/",
    icon: F,
    key: "rentcar",
    rel: "noreferrer",
    target: "_blank",
    title: "제주렌터카"
  }
], Z = (l) => l * Math.PI / 180, ee = (l, a, s, n, r) => {
  const h = a > 1 ? (r - n) / (a - 1) : 0, c = n + h * l, o = Z(c), m = Math.cos(o) * s, p = Math.sin(o) * s;
  return {
    "--tx": `${m.toFixed(2)}px`,
    "--ty": `${p.toFixed(2)}px`,
    transitionDelay: `${(l * 0.03).toFixed(2)}s`
  };
};
function ae({
  items: l,
  label: a = "Family Sites",
  originX: s = "right",
  radiusPx: n = 98,
  startAngle: r,
  endAngle: h
}) {
  const [c, o] = g.useState(!1), m = g.useRef(null), p = r ?? 180, f = h ?? 270;
  return g.useEffect(() => {
    const t = (d) => {
      const j = m.current;
      !j || j.contains(d.target) || o(!1);
    }, u = (d) => {
      d.key === "Escape" && o(!1);
    };
    return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", u), () => {
      document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", u);
    };
  }, []), /* @__PURE__ */ e.jsxs("div", { className: `family-radial-shell family-radial-shell--${s}`, children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: `family-radial-menu family-radial-menu--${s} ${c ? "active" : ""}`,
        ref: m,
        children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: `family-radial-btn ${c ? "active" : ""}`,
              onClick: () => o((t) => !t),
              "aria-label": a,
              "aria-expanded": c,
              "aria-haspopup": "menu",
              title: a,
              children: /* @__PURE__ */ e.jsx("span", { className: "family-radial-btn__glyph", "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ e.jsx("div", { className: "family-radial-items", children: l.map((t, u) => {
            const d = t.icon;
            return /* @__PURE__ */ e.jsx(
              "a",
              {
                className: "family-radial-item",
                href: t.href,
                onClick: () => o(!1),
                rel: t.rel,
                style: ee(u, l.length, n, p, f),
                target: t.target,
                title: t.title,
                children: /* @__PURE__ */ e.jsx(d, { size: 18, strokeWidth: 2.2 })
              },
              t.key
            );
          }) })
        ]
      }
    ),
    a ? /* @__PURE__ */ e.jsx("p", { className: "family-radial-label", children: a }) : null
  ] });
}
function le(l) {
  return /* @__PURE__ */ e.jsx(ae, { items: X, originX: "center", radiusPx: 98, ...l });
}
const re = () => /* @__PURE__ */ e.jsxs("footer", { className: "footer section shell-footer", id: "section-footer", children: [
  /* @__PURE__ */ e.jsxs("div", { className: "footer-content", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "footer-info", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "footer-info-group footer-info-group--company", children: [
        /* @__PURE__ */ e.jsx("p", { children: /* @__PURE__ */ e.jsx("strong", { "data-lang": "footerCompany", children: "(주) 제주 그룹" }) }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerCEO", children: "대표이사 김대표" }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerBizNum", children: "사업자등록번호 616-81-50527" }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerSaleNum", children: "통신판매신고 제주 2006-125" }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerHosting", children: "호스팅 사업자 AWS" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "footer-info-group footer-info-group--contact", children: [
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerAddr", children: "주소: 제주특별자치도 제주시 첨단로 64 (연동, 건설공제회관 3층)" }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerCs", children: "고객센터: 1599-1500 (09:00 ~ 19:00)" }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerCsEmail", children: "고객 문의: jejugroup.help@jejugroup.net" }),
        /* @__PURE__ */ e.jsx("p", { "data-lang": "footerPartnerEmail", children: "제휴 문의: partnership@jejugroup.net" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "footer-right-group", children: [
      /* @__PURE__ */ e.jsx(le, {}),
      /* @__PURE__ */ e.jsxs("div", { className: "footer-social", children: [
        /* @__PURE__ */ e.jsx("a", { href: "#", className: "social-icon", "aria-label": "YouTube", children: /* @__PURE__ */ e.jsx("i", { className: "fab fa-youtube" }) }),
        /* @__PURE__ */ e.jsx("a", { href: "#", className: "social-icon", "aria-label": "Instagram", children: /* @__PURE__ */ e.jsx("i", { className: "fab fa-instagram" }) }),
        /* @__PURE__ */ e.jsx("a", { href: "#", className: "social-icon", "aria-label": "TikTok", children: /* @__PURE__ */ e.jsx("i", { className: "fab fa-tiktok" }) }),
        /* @__PURE__ */ e.jsx("a", { href: "#", className: "social-icon", "aria-label": "Facebook", children: /* @__PURE__ */ e.jsx("i", { className: "fab fa-facebook" }) })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "footer-copyright", children: /* @__PURE__ */ e.jsx("p", { "data-lang": "footerCopyright", children: "Copyright © Jeju Group. All Rights Reserved." }) })
] }), oe = ({ basePath: l }) => {
  const a = (n, r) => {
    try {
      return W(n, r ?? {});
    } catch {
      return "#";
    }
  }, s = (n = "") => {
    const r = a("HOME");
    return r === "#" ? "#" : `${r}${n}`;
  };
  return /* @__PURE__ */ e.jsxs("header", { className: "header main-header", id: "header", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "header-util", id: "index-header-util", children: [
      /* @__PURE__ */ e.jsx(
        "a",
        {
          href: a("AUTH.LOGIN", { shell: "main" }),
          className: "util-link route-link",
          "data-route": "AUTH.LOGIN",
          "data-route-params": '{"shell":"main"}',
          "data-lang": "login",
          id: "indexLoginBtn",
          children: "로그인"
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "util-divider", children: "|" }),
      /* @__PURE__ */ e.jsx(
        "a",
        {
          href: a("AUTH.SIGNUP", { shell: "main" }),
          className: "util-link route-link",
          "data-route": "AUTH.SIGNUP",
          "data-route-params": '{"shell":"main"}',
          "data-lang": "signup",
          children: "회원가입"
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "util-divider", children: "|" }),
      /* @__PURE__ */ e.jsx(
        "a",
        {
          href: "#",
          className: "util-link route-link",
          "data-action": "OPEN_RESERVATION_DRAWER",
          "data-lang": "reservationCheck",
          id: "indexReservationCheckBtn",
          children: "예약 확인"
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "util-divider", children: "|" }),
      /* @__PURE__ */ e.jsx(
        "a",
        {
          href: a("CS.CUSTOMER_CENTER"),
          className: "util-link route-link",
          "data-route": "CS.CUSTOMER_CENTER",
          "data-lang": "customerCenter",
          children: "고객센터"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "header-inner", children: [
      /* @__PURE__ */ e.jsx("div", { className: "logo", children: /* @__PURE__ */ e.jsx("a", { href: s(), className: "logo-link route-link", "data-route": "HOME", children: /* @__PURE__ */ e.jsx("img", { className: "logo-img", src: `${l}jejustay/images/logo_jejuGP_wide.png`, alt: "제주그룹" }) }) }),
      /* @__PURE__ */ e.jsx("nav", { className: "gnb", id: "gnb", children: /* @__PURE__ */ e.jsxs("ul", { className: "gnb-list", children: [
        /* @__PURE__ */ e.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ e.jsx("a", { href: s("#section-2"), className: "gnb-link", "data-lang": "navAir", children: "제주항공" }) }),
        /* @__PURE__ */ e.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ e.jsx("a", { href: s("#section-3"), className: "gnb-link", "data-lang": "navHotel", children: "제주 스테이" }) }),
        /* @__PURE__ */ e.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ e.jsx("a", { href: s("#section-4"), className: "gnb-link", "data-lang": "navRentCar", children: "제주 렌트카" }) }),
        /* @__PURE__ */ e.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ e.jsx("a", { href: s("#section-5"), className: "gnb-link", "data-lang": "navMembership", children: "멤버십" }) })
      ] }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "header-right-controls", children: [
        /* @__PURE__ */ e.jsx("button", { className: "lang-toggle", children: "English" }),
        /* @__PURE__ */ e.jsx("div", { id: "weather-widget", className: "weather-widget", children: /* @__PURE__ */ e.jsx("button", { className: "weather-header-btn", id: "weather-open-btn", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-spinner fa-spin" }) }) }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            href: a("MYPAGE.DASHBOARD", { shell: "main" }),
            className: "header-utility-btn mypage-cta route-link",
            "data-auth-entry": "mypage",
            "data-route": "MYPAGE.DASHBOARD",
            "data-route-params": '{"shell":"main"}',
            "data-auth-label-ko": "마이페이지",
            "data-auth-label-en": "My Page",
            "data-auth-admin-label-ko": "관리자 페이지",
            "data-auth-admin-label-en": "Admin Page",
            "aria-label": "마이페이지",
            children: /* @__PURE__ */ e.jsxs("span", { className: "mypage-cta-icon", "aria-hidden": "true", children: [
              /* @__PURE__ */ e.jsx("span", { "data-auth-icon": "member", children: /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true", children: [
                /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    d: "M4 11.5 12 4l8 7.5v7.5a1 1 0 0 1-1 1h-4.5v-5.2H9.5V20H5a1 1 0 0 1-1-1z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    d: "M11 20v-4.2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V20",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.6",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              ] }) }),
              /* @__PURE__ */ e.jsx("span", { "data-auth-icon": "admin", hidden: !0, children: /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true", children: [
                /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    d: "M12 3.75 5.5 6.5v5.05c0 4.05 2.7 7.76 6.5 8.7 3.8-.94 6.5-4.65 6.5-8.7V6.5z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    d: "m9.8 12.25 1.55 1.55 3.4-3.4",
                    fill: "none",
                    stroke: "#fff",
                    strokeWidth: "1.7",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              ] }) })
            ] })
          }
        )
      ] })
    ] })
  ] });
};
export {
  ne as H,
  oe as M,
  re as a,
  i as b
};
