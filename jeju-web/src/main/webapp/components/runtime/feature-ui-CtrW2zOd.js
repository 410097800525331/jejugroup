import { j as e, a as i, u as M } from "./react-vendor-BoSfm_Te.js";
import { g as v } from "./gsap-vendor-CK8bqKiF.js";
import { u as T, T as W, i as L, A as R, v as F, j as z, w as I } from "./icon-vendor-Dpra3II6.js";
const G = () => /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
  /* @__PURE__ */ e.jsx("div", { className: "res-drawer-backdrop", id: "resDrawerBackdrop" }),
  /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-panel", id: "resDrawerPanel", children: [
    /* @__PURE__ */ e.jsx("button", { className: "res-drawer-close", id: "resDrawerClose", children: /* @__PURE__ */ e.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ e.jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-visual", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "res-drawer-title", "data-lang": "resCheckTitle", children: "비회원 예약 조회" }),
      /* @__PURE__ */ e.jsx("p", { className: "res-drawer-desc", "data-lang": "resCheckDesc", children: "예약 번호와 이메일 정보를 입력해서 내역을 확인해줘" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-body", children: [
      /* @__PURE__ */ e.jsxs("form", { className: "res-drawer-form", id: "resDrawerForm", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "text",
              id: "drawerResNum",
              placeholder: "예약 번호 입력",
              "data-lang-placeholder": "resNumPlaceholder",
              required: !0
            }
          ),
          /* @__PURE__ */ e.jsx("div", { className: "input-focus-bg" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "email",
              id: "drawerEmail",
              placeholder: "가입한 이메일 입력",
              "data-lang-placeholder": "resEmailPlaceholder",
              required: !0
            }
          ),
          /* @__PURE__ */ e.jsx("div", { className: "input-focus-bg" })
        ] }),
        /* @__PURE__ */ e.jsx("button", { type: "submit", className: "res-drawer-btn", "data-lang": "checkButton", children: "조회하기" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "res-drawer-footer", children: [
        /* @__PURE__ */ e.jsx("span", { "data-lang": "isMember", children: "회원이신가요" }),
        /* @__PURE__ */ e.jsx("a", { href: "#", className: "route-link", "data-route": "AUTH.LOGIN", "data-lang": "loginCheckLink", children: "로그인하고 관리하기" })
      ] })
    ] })
  ] })
] }), S = (s) => {
  s.dataset.wishlistResetTimer && (window.clearTimeout(Number(s.dataset.wishlistResetTimer)), delete s.dataset.wishlistResetTimer), s.classList.remove("is-pressing", "is-releasing");
}, A = (s, r) => {
  S(s), s.classList.add("is-pressing"), typeof s.animate == "function" && s.animate(
    r ? [
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
      duration: r ? 620 : 360,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const n = s.querySelector(".wishlist-btn__surface");
  n && typeof n.animate == "function" && n.animate(
    r ? [
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
      duration: r ? 500 : 320,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const c = s.querySelectorAll(".wishlist-btn__burst");
  r && c.length > 0 && c.forEach((d, l) => {
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
  const a = s.querySelector(".wishlist-btn__icon");
  a && typeof a.animate == "function" && a.animate(
    r ? [
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
      duration: r ? 480 : 300,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  ), s.dataset.wishlistResetTimer = String(
    window.setTimeout(() => {
      s.classList.remove("is-pressing"), s.classList.add("is-releasing"), window.setTimeout(() => {
        S(s);
      }, 180);
    }, r ? 240 : 160)
  );
}, K = ({ active: s, ariaLabel: r, className: n = "", onToggle: c }) => {
  const a = i.useRef(null), d = n.trim() ? `wishlist-btn ${n}` : "wishlist-btn";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      "aria-label": r,
      "aria-pressed": s,
      className: `${d}${s ? " active" : ""}`,
      onClick: (l) => {
        l.preventDefault(), l.stopPropagation();
        const u = !s;
        a.current && A(a.current, u), c(u);
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
}, N = i.forwardRef(
  ({ id: s, className: r, label: n, icon: c, badgeCount: a, onClick: d, onMouseEnter: l, onMouseLeave: u }, f) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      id: s,
      ref: f,
      className: `fab-card ${r}`,
      onClick: d,
      onMouseEnter: l,
      onMouseLeave: u,
      children: [
        /* @__PURE__ */ e.jsx(c, { className: "card-icon" }),
        /* @__PURE__ */ e.jsx("span", { className: "card-label", children: n }),
        a !== void 0 && a > 0 && /* @__PURE__ */ e.jsx("span", { className: "fab-badge", children: a })
      ]
    }
  )
);
N.displayName = "ActionCard";
function P({ isOpen: s, wishlist: r, onClose: n, onRemove: c }) {
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
      /* @__PURE__ */ e.jsx("div", { className: "wishlist-content", children: r.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "wishlist-empty", children: [
        /* @__PURE__ */ e.jsx(T, { size: 48, className: "text-slate-300 mb-4" }),
        /* @__PURE__ */ e.jsx("p", { children: "저장된 숙소가 없습니다." }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "btn-explore",
            onClick: n,
            children: "숙소 둘러보기"
          }
        )
      ] }) : r.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ e.jsx("img", { src: a.image, alt: a.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ e.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ e.jsx("span", { className: "wishlist-location", children: a.location }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => c(a.id),
                children: /* @__PURE__ */ e.jsx(W, { size: 14 })
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
function D({ onClick: s, isOpen: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "card-holder", onClick: s, children: [
    /* @__PURE__ */ e.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ e.jsx("div", { className: "fab-body" })
  ] });
}
const _ = (s) => String(s);
function J() {
  const s = i.useRef(null), [r, n] = i.useState(!1), [c, a] = i.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [d, l] = i.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [u, f] = i.useState(!1), [g, m] = i.useState(!1);
  i.useEffect(() => {
    const o = (x) => a(x.detail);
    return document.addEventListener("fabWishlistUpdated", o), () => document.removeEventListener("fabWishlistUpdated", o);
  }, []);
  const { contextSafe: j } = M({ scope: s }), w = j(() => {
    if (g) return;
    m(!0), setTimeout(() => m(!1), 1600);
    const o = v.timeline(), x = ".fab-card", t = ".card-holder";
    r ? (v.set(x, { pointerEvents: "none" }), o.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(x, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), v.to(t, { y: 0, opacity: 1, duration: 0.3 })) : (v.set(x, { opacity: 1, pointerEvents: "auto", display: "flex" }), o.fromTo(
      x,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), v.to(t, { y: 5, opacity: 0.9, duration: 0.3 })), n(!r);
  }), h = j((o, x) => {
    r && v.to(o, {
      y: x ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), y = () => {
    const o = d === "KRW" ? "USD" : "KRW";
    l(o), localStorage.setItem("jeju_fab_currency", o), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: o }));
  }, C = () => {
    var o;
    (o = window.hotelChatbot) == null || o.openChatbot(), r && w();
  }, k = (o) => {
    const x = _(o), t = c.filter((p) => _(p.id) !== x);
    a(t), localStorage.setItem("jeju_wishlist", JSON.stringify(t)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: t }));
  };
  return /* @__PURE__ */ e.jsxs("div", { ref: s, className: "original-fab-system", children: [
    /* @__PURE__ */ e.jsx(
      P,
      {
        isOpen: u,
        wishlist: c,
        onClose: () => f(!1),
        onRemove: k
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ e.jsx(D, { onClick: w, isOpen: r }),
      /* @__PURE__ */ e.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: L,
            onClick: () => window.location.href = "/",
            onMouseEnter: () => h(".card-0", !0),
            onMouseLeave: () => h(".card-0", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabTop",
            className: "card-1",
            label: "TOP",
            icon: R,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            onMouseEnter: () => h(".card-1", !0),
            onMouseLeave: () => h(".card-1", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabCurrency",
            className: "card-2",
            label: d === "KRW" ? "KOR" : "ENG",
            icon: F,
            onClick: y,
            onMouseEnter: () => h(".card-2", !0),
            onMouseLeave: () => h(".card-2", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabWishlist",
            className: "card-3",
            label: "PICK",
            icon: z,
            badgeCount: c.length,
            onClick: () => f(!0),
            onMouseEnter: () => h(".card-3", !0),
            onMouseLeave: () => h(".card-3", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabChatbot",
            className: "card-4",
            label: "CHAT",
            icon: I,
            onClick: C,
            onMouseEnter: () => h(".card-4", !0),
            onMouseLeave: () => h(".card-4", !1)
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
const O = (s) => s === "en" ? "Welcome to Jeju Group. How can I assist you today?" : `안녕하세요. 제주그룹 도우미입니다.
여행의 모든 고민을 무엇이든 말씀해 주세요. 😊`, $ = (s) => {
  var a, d, l, u, f, g;
  const r = (l = (d = (a = s.choices) == null ? void 0 : a[0]) == null ? void 0 : d.message) == null ? void 0 : l.content;
  return typeof r == "string" && r.trim() ? r.trim() : (((g = (f = (u = s.candidates) == null ? void 0 : u[0]) == null ? void 0 : f.content) == null ? void 0 : g.parts) ?? []).map((m) => typeof (m == null ? void 0 : m.text) == "string" ? m.text : "").filter((m) => !!m).join(`
`).trim() || null;
}, U = ({ isOpen: s, onClose: r, language: n, onLanguageChange: c }) => {
  const [a, d] = i.useState([]), [l, u] = i.useState(""), [f, g] = i.useState(!1), [m, j] = i.useState("checking"), w = i.useRef(null), h = i.useCallback(async () => {
    try {
      const t = new AbortController(), p = setTimeout(() => t.abort(), 6e3), b = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
        method: "GET",
        cache: "no-cache",
        signal: t.signal
      });
      clearTimeout(p), b.ok ? j("online") : j("error");
    } catch {
      j("offline");
    }
  }, []);
  i.useEffect(() => {
    h().catch(() => {
    });
    const t = setInterval(() => {
      h().catch(() => {
      });
    }, 6e4);
    return () => clearInterval(t);
  }, [h]), i.useEffect(() => {
    const t = {
      id: Date.now(),
      type: "bot",
      content: O(n),
      timestamp: /* @__PURE__ */ new Date()
    };
    d([t]);
  }, []), i.useEffect(() => {
    const t = (p) => {
      const b = p;
      (b.detail === "ko" || b.detail === "en") && c(b.detail);
    };
    return document.addEventListener("fabLanguageChanged", t), () => {
      document.removeEventListener("fabLanguageChanged", t);
    };
  }, [c]), i.useEffect(() => {
    w.current && (w.current.scrollTop = w.current.scrollHeight);
  }, [a, s]);
  const y = i.useCallback((t, p) => {
    d((b) => [
      ...b,
      {
        id: Date.now() + b.length + 1,
        type: t,
        content: p,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), C = i.useMemo(
    () => a.map((t) => ({ role: t.type === "user" ? "user" : "assistant", content: t.content })),
    [a]
  ), k = i.useCallback(async () => {
    const t = l.trim();
    if (!(!t || f)) {
      y("user", t), u(""), g(!0);
      try {
        const p = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
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
        if (!p.ok)
          throw new Error(`Chat API failed: ${p.status}`);
        const b = await p.json(), E = $(b) ?? "응답 처리 실패";
        y("bot", String(E));
      } catch (p) {
        y("bot", `오류 상태: ${p.message}`);
      } finally {
        g(!1);
      }
    }
  }, [y, C, l, n, f]), o = (t) => {
    t.preventDefault(), k().catch(() => {
    });
  }, x = (t) => {
    t.key === "Enter" && (t.preventDefault(), k().catch(() => {
    }));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `chatbot-container ${s ? "active" : ""}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header-info", children: [
        /* @__PURE__ */ e.jsx("div", { className: `chatbot-status-dot ${m}`, title: `API Server: ${m}` }),
        /* @__PURE__ */ e.jsx("h3", { className: "chatbot-header-title", children: n === "en" ? "Jeju Group Assistant" : "제주그룹 도우미" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-close-btn", onClick: r, "aria-label": "Close", children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ e.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-messages", ref: w, children: [
      a.map((t) => /* @__PURE__ */ e.jsx("div", { className: `message ${t.type}`, children: /* @__PURE__ */ e.jsxs("div", { className: "message-content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "message-bubble", children: t.content }),
        /* @__PURE__ */ e.jsx("div", { className: "message-time", children: t.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
      ] }) }, t.id)),
      f ? /* @__PURE__ */ e.jsx("div", { className: "message bot", children: /* @__PURE__ */ e.jsx("div", { className: "message-content", children: /* @__PURE__ */ e.jsxs("div", { className: "typing-indicator", children: [
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {})
      ] }) }) }) : null
    ] }),
    /* @__PURE__ */ e.jsx("form", { className: "chatbot-input-area", onSubmit: o, children: /* @__PURE__ */ e.jsxs("div", { className: "chatbot-input-wrapper", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          className: "chatbot-input",
          value: l,
          onChange: (t) => u(t.target.value),
          onKeyDown: x,
          placeholder: n === "en" ? "Type your message..." : "무엇이든 물어보세요"
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-send-btn", type: "submit", disabled: f || !l.trim(), children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
        /* @__PURE__ */ e.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
      ] }) })
    ] }) })
  ] });
};
export {
  U as C,
  J as F,
  G as R,
  K as W
};
