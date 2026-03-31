import { j as e, a as l, u as F } from "./react-vendor-BoSfm_Te.js";
import { g as y } from "./gsap-vendor-CK8bqKiF.js";
import { u as W, T as L, i as R, A, v as D, j as I, w as z } from "./icon-vendor-Dpra3II6.js";
const q = ({
  isOpen: s,
  status: t,
  message: n,
  result: i,
  submittedEmail: a,
  onSubmit: c,
  onClose: o,
  onReset: u
}) => {
  const f = (h) => {
    h.preventDefault();
    const x = h.currentTarget, g = new FormData(x), p = String(g.get("reservationNo") ?? "").trim(), v = String(g.get("reservationEmail") ?? "").trim();
    c({ reservationNo: p, email: v });
  }, j = t === "error" ? "res-drawer-status res-drawer-status-error" : t === "success" ? "res-drawer-status res-drawer-status-success" : "res-drawer-status";
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: `res-drawer-backdrop${s ? " active" : ""}`,
        id: "resDrawerBackdrop",
        "aria-hidden": "true",
        onClick: o
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
          const x = h.target;
          x != null && x.closest("[data-route]") && o();
        },
        children: [
          /* @__PURE__ */ e.jsx("button", { className: "res-drawer-close", id: "resDrawerClose", "aria-label": "닫기", onClick: o, type: "button", children: /* @__PURE__ */ e.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ e.jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) }),
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
            /* @__PURE__ */ e.jsxs("form", { className: "res-drawer-form", id: "resDrawerForm", onSubmit: f, children: [
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
              /* @__PURE__ */ e.jsx("button", { type: "submit", className: "res-drawer-btn", "data-lang": "checkButton", disabled: t === "loading", "aria-busy": t === "loading", children: t === "loading" ? "조회 중..." : "조회하기" }),
              /* @__PURE__ */ e.jsx("p", { className: j, "aria-live": "polite", children: n || "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다." })
            ] }),
            t === "success" && i ? /* @__PURE__ */ e.jsxs("section", { className: "res-drawer-result", "aria-live": "polite", children: [
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
                  /* @__PURE__ */ e.jsx("strong", { children: i.lastName || i.firstName ? `${i.lastName ?? ""} ${i.firstName ?? ""}`.trim() : a })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: "조회 이메일" }),
                  /* @__PURE__ */ e.jsx("strong", { children: a })
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
}, P = (s, t) => {
  S(s), s.classList.add("is-pressing"), typeof s.animate == "function" && s.animate(
    t ? [
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
      duration: t ? 620 : 360,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const n = s.querySelector(".wishlist-btn__surface");
  n && typeof n.animate == "function" && n.animate(
    t ? [
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
      duration: t ? 500 : 320,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const i = s.querySelectorAll(".wishlist-btn__burst");
  t && i.length > 0 && i.forEach((c, o) => {
    typeof c.animate == "function" && c.animate(
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
        delay: o * 18,
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both"
      }
    );
  });
  const a = s.querySelector(".wishlist-btn__icon");
  a && typeof a.animate == "function" && a.animate(
    t ? [
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
      duration: t ? 480 : 300,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  ), s.dataset.wishlistResetTimer = String(
    window.setTimeout(() => {
      s.classList.remove("is-pressing"), s.classList.add("is-releasing"), window.setTimeout(() => {
        S(s);
      }, 180);
    }, t ? 240 : 160)
  );
}, Z = ({ active: s, ariaLabel: t, className: n = "", onToggle: i }) => {
  const a = l.useRef(null), c = n.trim() ? `wishlist-btn ${n}` : "wishlist-btn";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      "aria-label": t,
      "aria-pressed": s,
      className: `${c}${s ? " active" : ""}`,
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation();
        const u = !s;
        a.current && P(a.current, u), i(u);
      },
      ref: a,
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
}, N = l.forwardRef(
  ({ id: s, className: t, label: n, icon: i, badgeCount: a, onClick: c, onMouseEnter: o, onMouseLeave: u }, f) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      id: s,
      ref: f,
      className: `fab-card ${t}`,
      onClick: c,
      onMouseEnter: o,
      onMouseLeave: u,
      children: [
        /* @__PURE__ */ e.jsx(i, { className: "card-icon" }),
        /* @__PURE__ */ e.jsx("span", { className: "card-label", children: n }),
        a !== void 0 && a > 0 && /* @__PURE__ */ e.jsx("span", { className: "fab-badge", children: a })
      ]
    }
  )
);
N.displayName = "ActionCard";
function $({ isOpen: s, wishlist: t, onClose: n, onRemove: i }) {
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
      /* @__PURE__ */ e.jsx("div", { className: "wishlist-content", children: t.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "wishlist-empty", children: [
        /* @__PURE__ */ e.jsx(W, { size: 48, className: "text-slate-300 mb-4" }),
        /* @__PURE__ */ e.jsx("p", { children: "저장된 숙소가 없습니다." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "btn-explore",
            onClick: n,
            children: "숙소 둘러보기"
          }
        )
      ] }) : t.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ e.jsx("img", { src: a.image, alt: a.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ e.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ e.jsx("span", { className: "wishlist-location", children: a.location }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => i(a.id),
                children: /* @__PURE__ */ e.jsx(L, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx("h4", { className: "wishlist-title", children: a.name }),
          /* @__PURE__ */ e.jsx("div", { className: "wishlist-price", children: a.price })
        ] })
      ] }, a.id)) })
    ] })
  ] });
}
function O({ onClick: s, isOpen: t }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "card-holder", onClick: s, children: [
    /* @__PURE__ */ e.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ e.jsx("div", { className: "fab-body" })
  ] });
}
const _ = (s) => String(s);
function Q() {
  const s = l.useRef(null), [t, n] = l.useState(!1), [i, a] = l.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [c, o] = l.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [u, f] = l.useState(!1), [j, h] = l.useState(!1);
  l.useEffect(() => {
    const d = (b) => a(b.detail);
    return document.addEventListener("fabWishlistUpdated", d), () => document.removeEventListener("fabWishlistUpdated", d);
  }, []);
  const { contextSafe: x } = F({ scope: s }), g = x(() => {
    if (j) return;
    h(!0), setTimeout(() => h(!1), 1600);
    const d = y.timeline(), b = ".fab-card", r = ".card-holder";
    t ? (y.set(b, { pointerEvents: "none" }), d.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(b, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), y.to(r, { y: 0, opacity: 1, duration: 0.3 })) : (y.set(b, { opacity: 1, pointerEvents: "auto", display: "flex" }), d.fromTo(
      b,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), y.to(r, { y: 5, opacity: 0.9, duration: 0.3 })), n(!t);
  }), p = x((d, b) => {
    t && y.to(d, {
      y: b ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), v = () => {
    const d = c === "KRW" ? "USD" : "KRW";
    o(d), localStorage.setItem("jeju_fab_currency", d), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: d }));
  }, C = () => {
    var d;
    (d = window.hotelChatbot) == null || d.openChatbot(), t && g();
  }, k = (d) => {
    const b = _(d), r = i.filter((m) => _(m.id) !== b);
    a(r), localStorage.setItem("jeju_wishlist", JSON.stringify(r)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: r }));
  };
  return /* @__PURE__ */ e.jsxs("div", { ref: s, className: "original-fab-system", children: [
    /* @__PURE__ */ e.jsx(
      $,
      {
        isOpen: u,
        wishlist: i,
        onClose: () => f(!1),
        onRemove: k
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ e.jsx(O, { onClick: g, isOpen: t }),
      /* @__PURE__ */ e.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: R,
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
            icon: A,
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
            label: c === "KRW" ? "KOR" : "ENG",
            icon: D,
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
            icon: I,
            badgeCount: i.length,
            onClick: () => f(!0),
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
const E = "/api/chat", H = (s) => s === "en" ? "Welcome to Jeju Group. How can I assist you today?" : `안녕하세요. 제주그룹 도우미입니다.
여행의 모든 고민을 무엇이든 말씀해 주세요. 😊`, B = (s) => {
  if (typeof s == "string")
    return s.trim() || null;
  if (typeof s != "object" || s === null)
    return null;
  const t = s, n = [t.message, t.detail, t.errorMessage, t.reason];
  for (const a of n)
    if (typeof a == "string" && a.trim())
      return a.trim();
  const i = t.error;
  if (typeof i == "string" && i.trim())
    return i.trim();
  if (typeof i == "object" && i !== null) {
    const a = i, c = [a.message, a.detail, a.errorMessage, a.reason];
    for (const o of c)
      if (typeof o == "string" && o.trim())
        return o.trim();
  }
  return null;
}, Y = async (s) => {
  try {
    const t = await s.json();
    return B(t);
  } catch {
    return null;
  }
}, G = (s) => {
  var a, c, o, u, f, j;
  const t = (o = (c = (a = s.choices) == null ? void 0 : a[0]) == null ? void 0 : c.message) == null ? void 0 : o.content;
  return typeof t == "string" && t.trim() ? t.trim() : (((j = (f = (u = s.candidates) == null ? void 0 : u[0]) == null ? void 0 : f.content) == null ? void 0 : j.parts) ?? []).map((h) => typeof (h == null ? void 0 : h.text) == "string" ? h.text : "").filter((h) => !!h).join(`
`).trim() || null;
}, V = ({ isOpen: s, onClose: t, language: n, onLanguageChange: i }) => {
  const [a, c] = l.useState([]), [o, u] = l.useState(""), [f, j] = l.useState(!1), [h, x] = l.useState("checking"), g = l.useRef(null), p = l.useCallback(async () => {
    try {
      const r = new AbortController(), m = setTimeout(() => r.abort(), 6e3), w = await fetch(E, {
        method: "GET",
        cache: "no-cache",
        signal: r.signal
      });
      clearTimeout(m), w.ok ? x("online") : x("error");
    } catch {
      x("offline");
    }
  }, []);
  l.useEffect(() => {
    p().catch(() => {
    });
    const r = setInterval(() => {
      p().catch(() => {
      });
    }, 6e4);
    return () => clearInterval(r);
  }, [p]), l.useEffect(() => {
    const r = {
      id: Date.now(),
      type: "bot",
      content: H(n),
      timestamp: /* @__PURE__ */ new Date()
    };
    c([r]);
  }, []), l.useEffect(() => {
    const r = (m) => {
      const w = m;
      (w.detail === "ko" || w.detail === "en") && i(w.detail);
    };
    return document.addEventListener("fabLanguageChanged", r), () => {
      document.removeEventListener("fabLanguageChanged", r);
    };
  }, [i]), l.useEffect(() => {
    g.current && (g.current.scrollTop = g.current.scrollHeight);
  }, [a, s]);
  const v = l.useCallback((r, m) => {
    c((w) => [
      ...w,
      {
        id: Date.now() + w.length + 1,
        type: r,
        content: m,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), C = l.useMemo(
    () => a.map((r) => ({ role: r.type === "user" ? "user" : "assistant", content: r.content })),
    [a]
  ), k = l.useCallback(async () => {
    const r = o.trim();
    if (!(!r || f)) {
      v("user", r), u(""), j(!0);
      try {
        const m = await fetch(E, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: n === "en" ? "You are Jeju Group Assistant" : "당신은 제주그룹 안내 도우미입니다."
              },
              ...C,
              {
                role: "user",
                content: r
              }
            ]
          })
        });
        if (!m.ok) {
          const T = await Y(m) ?? `Chat API failed: ${m.status}`;
          throw new Error(T);
        }
        const w = await m.json(), M = G(w) ?? "응답 처리 실패";
        v("bot", String(M));
      } catch (m) {
        v("bot", `오류가 발생했습니다: ${m.message}`);
      } finally {
        j(!1);
      }
    }
  }, [v, C, o, n, f]), d = (r) => {
    r.preventDefault(), k().catch(() => {
    });
  }, b = (r) => {
    r.key === "Enter" && (r.preventDefault(), k().catch(() => {
    }));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `chatbot-container ${s ? "active" : ""}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header-info", children: [
        /* @__PURE__ */ e.jsx("div", { className: `chatbot-status-dot ${h}`, title: `API Server: ${h}` }),
        /* @__PURE__ */ e.jsx("h3", { className: "chatbot-header-title", children: n === "en" ? "Jeju Group Assistant" : "제주그룹 도우미" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-close-btn", onClick: t, "aria-label": "Close", children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ e.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-messages", ref: g, children: [
      a.map((r) => /* @__PURE__ */ e.jsx("div", { className: `message ${r.type}`, children: /* @__PURE__ */ e.jsxs("div", { className: "message-content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "message-bubble", children: r.content }),
        /* @__PURE__ */ e.jsx("div", { className: "message-time", children: r.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
      ] }) }, r.id)),
      f ? /* @__PURE__ */ e.jsx("div", { className: "message bot", children: /* @__PURE__ */ e.jsx("div", { className: "message-content", children: /* @__PURE__ */ e.jsxs("div", { className: "typing-indicator", children: [
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {})
      ] }) }) }) : null
    ] }),
    /* @__PURE__ */ e.jsx("form", { className: "chatbot-input-area", onSubmit: d, children: /* @__PURE__ */ e.jsxs("div", { className: "chatbot-input-wrapper", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          className: "chatbot-input",
          value: o,
          onChange: (r) => u(r.target.value),
          onKeyDown: b,
          placeholder: n === "en" ? "Type your message..." : "무엇이든 물어보세요"
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-send-btn", type: "submit", disabled: f || !o.trim(), children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
        /* @__PURE__ */ e.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
      ] }) })
    ] }) })
  ] });
};
export {
  V as C,
  Q as F,
  q as R,
  Z as W
};
