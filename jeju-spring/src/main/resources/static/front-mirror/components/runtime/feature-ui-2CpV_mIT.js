import { j as e, a as o, u as T } from "./react-vendor-BoSfm_Te.js";
import { g as y } from "./gsap-vendor-CK8bqKiF.js";
import { u as M, T as F, i as W, A as L, v as R, j as D, w as z } from "./icon-vendor-Dpra3II6.js";
const G = ({
  isOpen: s,
  status: a,
  message: n,
  result: i,
  submittedEmail: r,
  onSubmit: d,
  onClose: l,
  onReset: u
}) => {
  const m = (h) => {
    h.preventDefault();
    const f = h.currentTarget, g = new FormData(f), p = String(g.get("reservationNo") ?? "").trim(), v = String(g.get("reservationEmail") ?? "").trim();
    d({ reservationNo: p, email: v });
  }, j = a === "error" ? "res-drawer-status res-drawer-status-error" : a === "success" ? "res-drawer-status res-drawer-status-success" : "res-drawer-status";
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: `res-drawer-backdrop${s ? " active" : ""}`,
        id: "resDrawerBackdrop",
        "aria-hidden": "true",
        onClick: l
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: `res-drawer-panel${s ? " active" : ""}`,
        id: "resDrawerPanel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "resDrawerTitle",
        onClick: (h) => {
          const f = h.target;
          f != null && f.closest("[data-route]") && l();
        },
        children: [
          /* @__PURE__ */ e.jsx("button", { className: "res-drawer-close", id: "resDrawerClose", "aria-label": "닫기", onClick: l, type: "button", children: /* @__PURE__ */ e.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ e.jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-visual", children: [
            /* @__PURE__ */ e.jsxs("h2", { className: "res-drawer-title", id: "resDrawerTitle", "data-lang": "resCheckTitle", children: [
              "비회원 ",
              /* @__PURE__ */ e.jsx("span", { children: "예약조회" })
            ] }),
            /* @__PURE__ */ e.jsxs("p", { className: "res-drawer-desc", "data-lang": "resCheckDesc", children: [
              "예약 번호와 예약 시 입력하신 이메일을 입력하시면",
              /* @__PURE__ */ e.jsx("br", {}),
              "빠르게 예약 내역을 확인해 드립니다."
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-body", children: [
            /* @__PURE__ */ e.jsxs("form", { className: "res-drawer-form", id: "resDrawerForm", onSubmit: m, children: [
              /* @__PURE__ */ e.jsxs("div", { className: "input-group", children: [
                /* @__PURE__ */ e.jsx("label", { htmlFor: "drawerResNum", children: "예약 번호" }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    id: "drawerResNum",
                    name: "reservationNo",
                    placeholder: "예: JS95276847",
                    "data-lang-placeholder": "resNumPlaceholder",
                    autoComplete: "off",
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "input-group", children: [
                /* @__PURE__ */ e.jsx("label", { htmlFor: "drawerEmail", children: "예약 이메일" }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "email",
                    id: "drawerEmail",
                    name: "reservationEmail",
                    placeholder: "example@jejugroup.com",
                    "data-lang-placeholder": "resEmailPlaceholder",
                    autoComplete: "email",
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsx("button", { type: "submit", className: "res-drawer-btn", "data-lang": "checkButton", disabled: a === "loading", "aria-busy": a === "loading", children: a === "loading" ? "조회 중..." : "조회하기" }),
              /* @__PURE__ */ e.jsx("p", { className: j, "aria-live": "polite", children: n || "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다." })
            ] }),
            a === "success" && i ? /* @__PURE__ */ e.jsxs("section", { className: "res-drawer-result", "aria-live": "polite", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-result-head", children: [
                /* @__PURE__ */ e.jsx("span", { className: "res-drawer-result-badge", children: "조회 완료" }),
                /* @__PURE__ */ e.jsx("button", { className: "res-drawer-result-reset", type: "button", onClick: u, children: "다시 조회" })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-result-summary", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "예약 번호" }),
                  /* @__PURE__ */ e.jsx("strong", { children: i.bookingNo || i.reservationNo || "확인 필요" })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "예약 구분" }),
                  /* @__PURE__ */ e.jsx("strong", { children: i.memberBooking === !0 ? "회원 예약" : i.memberBooking === !1 ? "비회원 예약" : "확인 필요" })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "여행지" }),
                  /* @__PURE__ */ e.jsx("strong", { children: i.destination || "확인 필요" })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "여행일" }),
                  /* @__PURE__ */ e.jsx("strong", { children: i.travelDate || "확인 필요" })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "금액" }),
                  /* @__PURE__ */ e.jsx("strong", { children: i.amount || "확인 필요" })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "예약자" }),
                  /* @__PURE__ */ e.jsx("strong", { children: i.lastName || i.firstName ? `${i.lastName ?? ""} ${i.firstName ?? ""}`.trim() : r })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "조회 이메일" }),
                  /* @__PURE__ */ e.jsx("strong", { children: r })
                ] })
              ] })
            ] }) : null,
            /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-footer", children: [
              /* @__PURE__ */ e.jsx("span", { "data-lang": "isMember", children: "이미 제주그룹 회원이신가요?" }),
              /* @__PURE__ */ e.jsx("a", { href: "#", className: "route-link", "data-route": "AUTH.LOGIN", "data-lang": "loginCheckLink", children: "로그인하고 관리하기" })
            ] })
          ] })
        ]
      }
    )
  ] });
}, S = (s) => {
  s.dataset.wishlistResetTimer && (window.clearTimeout(Number(s.dataset.wishlistResetTimer)), delete s.dataset.wishlistResetTimer), s.classList.remove("is-pressing", "is-releasing");
}, I = (s, a) => {
  S(s), s.classList.add("is-pressing"), typeof s.animate == "function" && s.animate(
    a ? [
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(0) scale(0.94)", offset: 0.2 },
      { transform: "translateY(-2px) scale(1.08)", offset: 0.56 },
      { transform: "translateY(0) scale(1)" }
    ] : [
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(0) scale(0.92)", offset: 0.26 },
      { transform: "translateY(0) scale(1.02)", offset: 0.58 },
      { transform: "translateY(0) scale(1)" }
    ],
    {
      duration: a ? 620 : 360,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const n = s.querySelector(".wishlist-btn__surface");
  n && typeof n.animate == "function" && n.animate(
    a ? [
      { transform: "scale(1)" },
      { transform: "scale(0.88)", offset: 0.2 },
      { transform: "scale(1.04)", offset: 0.68 },
      { transform: "scale(1)" }
    ] : [
      { transform: "scale(1)" },
      { transform: "scale(0.9)", offset: 0.28 },
      { transform: "scale(1)" }
    ],
    {
      duration: a ? 500 : 320,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const i = s.querySelectorAll(".wishlist-btn__burst");
  a && i.length > 0 && i.forEach((d, l) => {
    typeof d.animate == "function" && d.animate(
      [
        { opacity: 0, transform: "translate(-50%, -50%) scale(0.2)" },
        {
          opacity: 0.95,
          transform: "translate(calc(-50% + (var(--burst-x) * 0.52)), calc(-50% + (var(--burst-y) * 0.52))) scale(1)",
          offset: 0.24
        },
        {
          opacity: 0,
          transform: "translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(0.72)"
        }
      ],
      {
        delay: l * 18,
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both"
      }
    );
  });
  const r = s.querySelector(".wishlist-btn__icon");
  r && typeof r.animate == "function" && r.animate(
    a ? [
      { transform: "scale(1)" },
      { transform: "scale(0.78)", offset: 0.2 },
      { transform: "scale(1.06)", offset: 0.64 },
      { transform: "scale(1)" }
    ] : [
      { transform: "scale(1)" },
      { transform: "scale(0.88)", offset: 0.3 },
      { transform: "scale(1)" }
    ],
    {
      duration: a ? 480 : 300,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  ), s.dataset.wishlistResetTimer = String(
    window.setTimeout(() => {
      s.classList.remove("is-pressing"), s.classList.add("is-releasing"), window.setTimeout(() => {
        S(s);
      }, 180);
    }, a ? 240 : 160)
  );
}, J = ({ active: s, ariaLabel: a, className: n = "", onToggle: i }) => {
  const r = o.useRef(null), d = n.trim() ? `wishlist-btn ${n}` : "wishlist-btn";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      "aria-label": a,
      "aria-pressed": s,
      className: `${d}${s ? " active" : ""}`,
      onClick: (l) => {
        l.preventDefault(), l.stopPropagation();
        const u = !s;
        r.current && I(r.current, u), i(u);
      },
      ref: r,
      type: "button",
      children: [
        /* @__PURE__ */ e.jsxs("span", { "aria-hidden": "true", className: "wishlist-btn__burst-layer", children: [
          /* @__PURE__ */ e.jsx("span", { className: "wishlist-btn__burst wishlist-btn__burst--1" }),
          /* @__PURE__ */ e.jsx("span", { className: "wishlist-btn__burst wishlist-btn__burst--2" }),
          /* @__PURE__ */ e.jsx("span", { className: "wishlist-btn__burst wishlist-btn__burst--3" }),
          /* @__PURE__ */ e.jsx("span", { className: "wishlist-btn__burst wishlist-btn__burst--4" })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "wishlist-btn__surface" }),
        /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", className: "wishlist-btn__icon", children: /* @__PURE__ */ e.jsx("svg", { fill: "none", role: "presentation", viewBox: "0 0 24 24", children: /* @__PURE__ */ e.jsx("path", { d: "M12 21s-6.716-4.351-9.193-8.223C.828 9.74 1.3 5.524 4.56 3.66c2.168-1.24 4.964-.906 6.94.818 1.976-1.724 4.772-2.058 6.94-.818 3.26 1.864 3.733 6.08 1.753 9.117C18.716 16.649 12 21 12 21Z" }) }) })
      ]
    }
  );
}, N = o.forwardRef(
  ({ id: s, className: a, label: n, icon: i, badgeCount: r, onClick: d, onMouseEnter: l, onMouseLeave: u }, m) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      id: s,
      ref: m,
      className: `fab-card ${a}`,
      onClick: d,
      onMouseEnter: l,
      onMouseLeave: u,
      children: [
        /* @__PURE__ */ e.jsx(i, { className: "card-icon" }),
        /* @__PURE__ */ e.jsx("span", { className: "card-label", children: n }),
        r !== void 0 && r > 0 && /* @__PURE__ */ e.jsx("span", { className: "fab-badge", children: r })
      ]
    }
  )
);
N.displayName = "ActionCard";
function A({ isOpen: s, wishlist: a, onClose: n, onRemove: i }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: `modal-overlay ${s ? "active" : ""}`,
        onClick: n
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: `wishlist-window ${s ? "is-active" : ""}`, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "wishlist-header", children: [
        /* @__PURE__ */ e.jsx("h3", { children: "MY STAY PICK" }),
        /* @__PURE__ */ e.jsx("button", { className: "close-wishlist", onClick: n, children: "×" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "wishlist-content", children: a.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "wishlist-empty", children: [
        /* @__PURE__ */ e.jsx(M, { size: 48, className: "text-slate-300 mb-4" }),
        /* @__PURE__ */ e.jsx("p", { children: "저장된 숙소가 없습니다." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "btn-explore",
            onClick: n,
            children: "숙소 둘러보기"
          }
        )
      ] }) : a.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ e.jsx("img", { src: r.image, alt: r.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ e.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ e.jsx("span", { className: "wishlist-location", children: r.location }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => i(r.id),
                children: /* @__PURE__ */ e.jsx(F, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx("h4", { className: "wishlist-title", children: r.name }),
          /* @__PURE__ */ e.jsx("div", { className: "wishlist-price", children: r.price })
        ] })
      ] }, r.id)) })
    ] })
  ] });
}
function P({ onClick: s, isOpen: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "card-holder", onClick: s, children: [
    /* @__PURE__ */ e.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ e.jsx("div", { className: "fab-body" })
  ] });
}
const E = (s) => String(s);
function K() {
  const s = o.useRef(null), [a, n] = o.useState(!1), [i, r] = o.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [d, l] = o.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [u, m] = o.useState(!1), [j, h] = o.useState(!1);
  o.useEffect(() => {
    const c = (b) => r(b.detail);
    return document.addEventListener("fabWishlistUpdated", c), () => document.removeEventListener("fabWishlistUpdated", c);
  }, []);
  const { contextSafe: f } = T({ scope: s }), g = f(() => {
    if (j) return;
    h(!0), setTimeout(() => h(!1), 1600);
    const c = y.timeline(), b = ".fab-card", t = ".card-holder";
    a ? (y.set(b, { pointerEvents: "none" }), c.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(b, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), y.to(t, { y: 0, opacity: 1, duration: 0.3 })) : (y.set(b, { opacity: 1, pointerEvents: "auto", display: "flex" }), c.fromTo(
      b,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), y.to(t, { y: 5, opacity: 0.9, duration: 0.3 })), n(!a);
  }), p = f((c, b) => {
    a && y.to(c, {
      y: b ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), v = () => {
    const c = d === "KRW" ? "USD" : "KRW";
    l(c), localStorage.setItem("jeju_fab_currency", c), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: c }));
  }, C = () => {
    var c;
    (c = window.hotelChatbot) == null || c.openChatbot(), a && g();
  }, k = (c) => {
    const b = E(c), t = i.filter((x) => E(x.id) !== b);
    r(t), localStorage.setItem("jeju_wishlist", JSON.stringify(t)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: t }));
  };
  return /* @__PURE__ */ e.jsxs("div", { ref: s, className: "original-fab-system", children: [
    /* @__PURE__ */ e.jsx(
      A,
      {
        isOpen: u,
        wishlist: i,
        onClose: () => m(!1),
        onRemove: k
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ e.jsx(P, { onClick: g, isOpen: a }),
      /* @__PURE__ */ e.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: W,
            onClick: () => window.location.href = "/",
            onMouseEnter: () => p(".card-0", !0),
            onMouseLeave: () => p(".card-0", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabTop",
            className: "card-1",
            label: "TOP",
            icon: L,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            onMouseEnter: () => p(".card-1", !0),
            onMouseLeave: () => p(".card-1", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabCurrency",
            className: "card-2",
            label: d === "KRW" ? "KOR" : "ENG",
            icon: R,
            onClick: v,
            onMouseEnter: () => p(".card-2", !0),
            onMouseLeave: () => p(".card-2", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabWishlist",
            className: "card-3",
            label: "PICK",
            icon: D,
            badgeCount: i.length,
            onClick: () => m(!0),
            onMouseEnter: () => p(".card-3", !0),
            onMouseLeave: () => p(".card-3", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabChatbot",
            className: "card-4",
            label: "CHAT",
            icon: z,
            onClick: C,
            onMouseEnter: () => p(".card-4", !0),
            onMouseLeave: () => p(".card-4", !1)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("style", { children: `
        /* 원본 CSS 로직 그대로 유지 */
        .fab-wrapper { position: fixed; bottom: 40px; right: 40px; z-index: 9999; }
        .card-holder { position: absolute; bottom: 0; right: 0; width: 60px; height: 80px; z-index: 10001; cursor: pointer; }
        .fab-peek { position: absolute; top: -12px; left: 5px; width: 50px; height: 30px; background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%); border-radius: 8px 8px 0 0; border: 1px solid rgba(0,0,0,0.06); }
        .fab-peek::before { content: ''; position: absolute; top: 12px; left: 6px; width: 12px; height: 9px; border-radius: 2px; background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px), linear-gradient(135deg, #e6c13b 0%, #f0d575 50%, #c49f18 100%); }
        .fab-body { position: absolute; bottom: 0; width: 60px; height: 80px; background-color: #FF5000; border-radius: 8px; z-index: 1; outline: 1.5px dashed rgba(255,255,255,0.9); outline-offset: -4px; border-top: 2px solid #E05000; box-shadow: 0 4px 0 rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.15); }
        .fab-body::after { content: 'JEJU GROUP'; white-space: pre; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; text-transform: uppercase; font-weight: 800; text-align: center; line-height: 1.2; color: #FFFFFF; }
        .fab-cards-container { position: absolute; bottom: 0; right: 0; width: 65px; height: 95px; z-index: 10000; pointer-events: none; clip-path: inset(-200% -200% 0 -600%); }
        .fab-card { position: absolute; bottom: 0; left: 0; width: 65px; height: 95px; background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%); border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; opacity: 0; pointer-events: none; border: 1px solid rgba(0,0,0,0.06); }
        .fab-card::before { content: ''; position: absolute; top: 10px; left: 8px; width: 12px; height: 9px; border-radius: 2px; background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px), linear-gradient(135deg, #e6c13b 0%, #f0d575 50%, #c49f18 100%); }
        .fab-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: #FF5C00; }
        .card-icon { width: 20px; height: 20px; color: #333; margin-bottom: 3px; stroke-width: 2.5px; }
        .card-label { font-size: 10.5px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 1.2px; }
        .fab-badge { position: absolute; top: 6px; right: 6px; background: #FF5C00; color: white; font-size: 9px; font-weight: bold; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .wishlist-window { position: fixed; z-index: 10002; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px); border-radius: 10px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); display: none; flex-direction: column; transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        .original-fab-system .wishlist-window.is-active { display: flex; top: 50%; left: 50%; width: 400px; height: 500px; transform: translate(-50%, -50%); border-radius: 20px; }
        .wishlist-header { background: #FF5C00; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 20px 20px 0 0; }
        .wishlist-header h3 { margin: 0; font-size: 18px; font-weight: 900; }
        .wishlist-content { padding: 20px; flex: 1; overflow-y: auto; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 10001; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .wishlist-item-card { display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; background: #fff; border-radius: 8px; margin-bottom: 10px; }
        .wishlist-thumb { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; }
        .wishlist-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .wishlist-title { margin: 0 0 4px 0; font-size: 14px; font-weight: 800; }
        .wishlist-price { font-size: 14px; font-weight: 900; color: #FF5C00; }
      ` })
  ] });
}
const $ = (s) => s === "en" ? "Welcome to Jeju Group. How can I assist you today?" : `안녕하세요. 제주그룹 도우미입니다.
여행의 모든 고민을 무엇이든 말씀해 주세요. 😊`, O = (s) => {
  var r, d, l, u, m, j;
  const a = (l = (d = (r = s.choices) == null ? void 0 : r[0]) == null ? void 0 : d.message) == null ? void 0 : l.content;
  return typeof a == "string" && a.trim() ? a.trim() : (((j = (m = (u = s.candidates) == null ? void 0 : u[0]) == null ? void 0 : m.content) == null ? void 0 : j.parts) ?? []).map((h) => typeof (h == null ? void 0 : h.text) == "string" ? h.text : "").filter((h) => !!h).join(`
`).trim() || null;
}, U = ({ isOpen: s, onClose: a, language: n, onLanguageChange: i }) => {
  const [r, d] = o.useState([]), [l, u] = o.useState(""), [m, j] = o.useState(!1), [h, f] = o.useState("checking"), g = o.useRef(null), p = o.useCallback(async () => {
    try {
      const t = new AbortController(), x = setTimeout(() => t.abort(), 6e3), w = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
        method: "GET",
        cache: "no-cache",
        signal: t.signal
      });
      clearTimeout(x), w.ok ? f("online") : f("error");
    } catch {
      f("offline");
    }
  }, []);
  o.useEffect(() => {
    p().catch(() => {
    });
    const t = setInterval(() => {
      p().catch(() => {
      });
    }, 6e4);
    return () => clearInterval(t);
  }, [p]), o.useEffect(() => {
    const t = {
      id: Date.now(),
      type: "bot",
      content: $(n),
      timestamp: /* @__PURE__ */ new Date()
    };
    d([t]);
  }, []), o.useEffect(() => {
    const t = (x) => {
      const w = x;
      (w.detail === "ko" || w.detail === "en") && i(w.detail);
    };
    return document.addEventListener("fabLanguageChanged", t), () => {
      document.removeEventListener("fabLanguageChanged", t);
    };
  }, [i]), o.useEffect(() => {
    g.current && (g.current.scrollTop = g.current.scrollHeight);
  }, [r, s]);
  const v = o.useCallback((t, x) => {
    d((w) => [
      ...w,
      {
        id: Date.now() + w.length + 1,
        type: t,
        content: x,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), C = o.useMemo(
    () => r.map((t) => ({ role: t.type === "user" ? "user" : "assistant", content: t.content })),
    [r]
  ), k = o.useCallback(async () => {
    const t = l.trim();
    if (!(!t || m)) {
      v("user", t), u(""), j(!0);
      try {
        const x = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: n === "en" ? "You are Jeju Group Assistant" : "너는 제주그룹 안내 도우미다."
              },
              ...C,
              {
                role: "user",
                content: t
              }
            ]
          })
        });
        if (!x.ok)
          throw new Error(`Chat API failed: ${x.status}`);
        const w = await x.json(), _ = O(w) ?? "응답 처리 실패";
        v("bot", String(_));
      } catch (x) {
        v("bot", `오류 상태: ${x.message}`);
      } finally {
        j(!1);
      }
    }
  }, [v, C, l, n, m]), c = (t) => {
    t.preventDefault(), k().catch(() => {
    });
  }, b = (t) => {
    t.key === "Enter" && (t.preventDefault(), k().catch(() => {
    }));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `chatbot-container ${s ? "active" : ""}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header-info", children: [
        /* @__PURE__ */ e.jsx("div", { className: `chatbot-status-dot ${h}`, title: `API Server: ${h}` }),
        /* @__PURE__ */ e.jsx("h3", { className: "chatbot-header-title", children: n === "en" ? "Jeju Group Assistant" : "제주그룹 도우미" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-close-btn", onClick: a, "aria-label": "Close", children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ e.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-messages", ref: g, children: [
      r.map((t) => /* @__PURE__ */ e.jsx("div", { className: `message ${t.type}`, children: /* @__PURE__ */ e.jsxs("div", { className: "message-content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "message-bubble", children: t.content }),
        /* @__PURE__ */ e.jsx("div", { className: "message-time", children: t.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
      ] }) }, t.id)),
      m ? /* @__PURE__ */ e.jsx("div", { className: "message bot", children: /* @__PURE__ */ e.jsx("div", { className: "message-content", children: /* @__PURE__ */ e.jsxs("div", { className: "typing-indicator", children: [
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {})
      ] }) }) }) : null
    ] }),
    /* @__PURE__ */ e.jsx("form", { className: "chatbot-input-area", onSubmit: c, children: /* @__PURE__ */ e.jsxs("div", { className: "chatbot-input-wrapper", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          className: "chatbot-input",
          value: l,
          onChange: (t) => u(t.target.value),
          onKeyDown: b,
          placeholder: n === "en" ? "Type your message..." : "무엇이든 물어보세요"
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-send-btn", type: "submit", disabled: m || !l.trim(), children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
        /* @__PURE__ */ e.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
      ] }) })
    ] }) })
  ] });
};
export {
  U as C,
  K as F,
  G as R,
  J as W
};
