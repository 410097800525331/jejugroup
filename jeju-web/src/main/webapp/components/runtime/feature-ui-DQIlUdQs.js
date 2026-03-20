import { j as e, a as r, u as T } from "./react-vendor-BoSfm_Te.js";
import { g as y } from "./gsap-vendor-CK8bqKiF.js";
import { u as W, T as L, i as R, A as F, v as I, j as z, w as A } from "./icon-vendor-Dpra3II6.js";
const K = () => /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
] }), S = (t) => {
  t.dataset.wishlistResetTimer && (window.clearTimeout(Number(t.dataset.wishlistResetTimer)), delete t.dataset.wishlistResetTimer), t.classList.remove("is-pressing", "is-releasing");
}, P = (t, i) => {
  S(t), t.classList.add("is-pressing");
  const n = t.querySelector(".wishlist-btn__surface");
  n && typeof n.animate == "function" && n.animate(
    i ? [
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
      duration: i ? 500 : 320,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  );
  const c = t.querySelector(".wishlist-btn__icon");
  c && typeof c.animate == "function" && c.animate(
    i ? [
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
      duration: i ? 480 : 300,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  ), t.dataset.wishlistResetTimer = String(
    window.setTimeout(() => {
      t.classList.remove("is-pressing"), t.classList.add("is-releasing"), window.setTimeout(() => {
        S(t);
      }, 180);
    }, i ? 240 : 160)
  );
}, J = ({ active: t, ariaLabel: i, className: n = "", onToggle: c }) => {
  const a = r.useRef(null), h = n.trim() ? `wishlist-btn ${n}` : "wishlist-btn";
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      "aria-label": i,
      "aria-pressed": t,
      className: `${h}${t ? " active" : ""}`,
      onClick: (l) => {
        l.preventDefault(), l.stopPropagation();
        const u = !t;
        a.current && P(a.current, u), c(u);
      },
      ref: a,
      type: "button",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "wishlist-btn__surface" }),
        /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", className: "wishlist-btn__icon", children: /* @__PURE__ */ e.jsx("svg", { fill: "none", role: "presentation", viewBox: "0 0 24 24", children: /* @__PURE__ */ e.jsx("path", { d: "M12 21s-6.716-4.351-9.193-8.223C.828 9.74 1.3 5.524 4.56 3.66c2.168-1.24 4.964-.906 6.94.818 1.976-1.724 4.772-2.058 6.94-.818 3.26 1.864 3.733 6.08 1.753 9.117C18.716 16.649 12 21 12 21Z" }) }) })
      ]
    }
  );
}, N = r.forwardRef(
  ({ id: t, className: i, label: n, icon: c, badgeCount: a, onClick: h, onMouseEnter: l, onMouseLeave: u }, x) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      id: t,
      ref: x,
      className: `fab-card ${i}`,
      onClick: h,
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
function D({ isOpen: t, wishlist: i, onClose: n, onRemove: c }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: `modal-overlay ${t ? "active" : ""}`,
        onClick: n
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: `wishlist-window ${t ? "is-active" : ""}`, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "wishlist-header", children: [
        /* @__PURE__ */ e.jsx("h3", { children: "MY STAY PICK" }),
        /* @__PURE__ */ e.jsx("button", { className: "close-wishlist", onClick: n, children: "×" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "wishlist-content", children: i.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "wishlist-empty", children: [
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
      ] }) : i.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ e.jsx("img", { src: a.image, alt: a.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ e.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ e.jsx("span", { className: "wishlist-location", children: a.location }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => c(a.id),
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
function O({ onClick: t, isOpen: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "card-holder", onClick: t, children: [
    /* @__PURE__ */ e.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ e.jsx("div", { className: "fab-body" })
  ] });
}
const E = (t) => String(t);
function U() {
  const t = r.useRef(null), [i, n] = r.useState(!1), [c, a] = r.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [h, l] = r.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [u, x] = r.useState(!1), [g, f] = r.useState(!1);
  r.useEffect(() => {
    const o = (m) => a(m.detail);
    return document.addEventListener("fabWishlistUpdated", o), () => document.removeEventListener("fabWishlistUpdated", o);
  }, []);
  const { contextSafe: j } = T({ scope: t }), w = j(() => {
    if (g) return;
    f(!0), setTimeout(() => f(!1), 1600);
    const o = y.timeline(), m = ".fab-card", s = ".card-holder";
    i ? (y.set(m, { pointerEvents: "none" }), o.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(m, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), y.to(s, { y: 0, opacity: 1, duration: 0.3 })) : (y.set(m, { opacity: 1, pointerEvents: "auto", display: "flex" }), o.fromTo(
      m,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), y.to(s, { y: 5, opacity: 0.9, duration: 0.3 })), n(!i);
  }), d = j((o, m) => {
    i && y.to(o, {
      y: m ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), v = () => {
    const o = h === "KRW" ? "USD" : "KRW";
    l(o), localStorage.setItem("jeju_fab_currency", o), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: o }));
  }, C = () => {
    var o;
    (o = window.hotelChatbot) == null || o.openChatbot(), i && w();
  }, k = (o) => {
    const m = E(o), s = c.filter((p) => E(p.id) !== m);
    a(s), localStorage.setItem("jeju_wishlist", JSON.stringify(s)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: s }));
  };
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "original-fab-system", children: [
    /* @__PURE__ */ e.jsx(
      D,
      {
        isOpen: u,
        wishlist: c,
        onClose: () => x(!1),
        onRemove: k
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ e.jsx(O, { onClick: w, isOpen: i }),
      /* @__PURE__ */ e.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: R,
            onClick: () => window.location.href = "/",
            onMouseEnter: () => d(".card-0", !0),
            onMouseLeave: () => d(".card-0", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabTop",
            className: "card-1",
            label: "TOP",
            icon: F,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            onMouseEnter: () => d(".card-1", !0),
            onMouseLeave: () => d(".card-1", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabCurrency",
            className: "card-2",
            label: h === "KRW" ? "KOR" : "ENG",
            icon: I,
            onClick: v,
            onMouseEnter: () => d(".card-2", !0),
            onMouseLeave: () => d(".card-2", !1)
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
            onClick: () => x(!0),
            onMouseEnter: () => d(".card-3", !0),
            onMouseLeave: () => d(".card-3", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabChatbot",
            className: "card-4",
            label: "CHAT",
            icon: A,
            onClick: C,
            onMouseEnter: () => d(".card-4", !0),
            onMouseLeave: () => d(".card-4", !1)
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
const _ = (t) => t === "en" ? "Welcome to Jeju Group. How can I assist you today?" : `안녕하세요. 제주그룹 도우미입니다.
여행의 모든 고민을 무엇이든 말씀해 주세요. 😊`, $ = (t) => {
  var a, h, l, u, x, g;
  const i = (l = (h = (a = t.choices) == null ? void 0 : a[0]) == null ? void 0 : h.message) == null ? void 0 : l.content;
  return typeof i == "string" && i.trim() ? i.trim() : (((g = (x = (u = t.candidates) == null ? void 0 : u[0]) == null ? void 0 : x.content) == null ? void 0 : g.parts) ?? []).map((f) => typeof (f == null ? void 0 : f.text) == "string" ? f.text : "").filter((f) => !!f).join(`
`).trim() || null;
}, q = ({ isOpen: t, onClose: i, language: n, onLanguageChange: c }) => {
  const [a, h] = r.useState([]), [l, u] = r.useState(""), [x, g] = r.useState(!1), [f, j] = r.useState("checking"), w = r.useRef(null), d = r.useCallback(async () => {
    try {
      const s = new AbortController(), p = setTimeout(() => s.abort(), 6e3), b = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
        method: "GET",
        cache: "no-cache",
        signal: s.signal
      });
      clearTimeout(p), b.ok ? j("online") : j("error");
    } catch {
      j("offline");
    }
  }, []);
  r.useEffect(() => {
    d().catch(() => {
    });
    const s = setInterval(() => {
      d().catch(() => {
      });
    }, 6e4);
    return () => clearInterval(s);
  }, [d]), r.useEffect(() => {
    const s = {
      id: Date.now(),
      type: "bot",
      content: _(n),
      timestamp: /* @__PURE__ */ new Date()
    };
    h([s]);
  }, []), r.useEffect(() => {
    const s = (p) => {
      const b = p;
      (b.detail === "ko" || b.detail === "en") && c(b.detail);
    };
    return document.addEventListener("fabLanguageChanged", s), () => {
      document.removeEventListener("fabLanguageChanged", s);
    };
  }, [c]), r.useEffect(() => {
    w.current && (w.current.scrollTop = w.current.scrollHeight);
  }, [a, t]);
  const v = r.useCallback((s, p) => {
    h((b) => [
      ...b,
      {
        id: Date.now() + b.length + 1,
        type: s,
        content: p,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), C = r.useMemo(
    () => a.map((s) => ({ role: s.type === "user" ? "user" : "assistant", content: s.content })),
    [a]
  ), k = r.useCallback(async () => {
    const s = l.trim();
    if (!(!s || x)) {
      v("user", s), u(""), g(!0);
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
                content: s
              }
            ]
          })
        });
        if (!p.ok)
          throw new Error(`Chat API failed: ${p.status}`);
        const b = await p.json(), M = $(b) ?? "응답 처리 실패";
        v("bot", String(M));
      } catch (p) {
        v("bot", `오류 상태: ${p.message}`);
      } finally {
        g(!1);
      }
    }
  }, [v, C, l, n, x]), o = (s) => {
    s.preventDefault(), k().catch(() => {
    });
  }, m = (s) => {
    s.key === "Enter" && (s.preventDefault(), k().catch(() => {
    }));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `chatbot-container ${t ? "active" : ""}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header-info", children: [
        /* @__PURE__ */ e.jsx("div", { className: `chatbot-status-dot ${f}`, title: `API Server: ${f}` }),
        /* @__PURE__ */ e.jsx("h3", { className: "chatbot-header-title", children: n === "en" ? "Jeju Group Assistant" : "제주그룹 도우미" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-close-btn", onClick: i, "aria-label": "Close", children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ e.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-messages", ref: w, children: [
      a.map((s) => /* @__PURE__ */ e.jsx("div", { className: `message ${s.type}`, children: /* @__PURE__ */ e.jsxs("div", { className: "message-content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "message-bubble", children: s.content }),
        /* @__PURE__ */ e.jsx("div", { className: "message-time", children: s.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
      ] }) }, s.id)),
      x ? /* @__PURE__ */ e.jsx("div", { className: "message bot", children: /* @__PURE__ */ e.jsx("div", { className: "message-content", children: /* @__PURE__ */ e.jsxs("div", { className: "typing-indicator", children: [
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
          onChange: (s) => u(s.target.value),
          onKeyDown: m,
          placeholder: n === "en" ? "Type your message..." : "무엇이든 물어보세요"
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-send-btn", type: "submit", disabled: x || !l.trim(), children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
        /* @__PURE__ */ e.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
      ] }) })
    ] }) })
  ] });
};
export {
  q as C,
  U as F,
  K as R,
  J as W
};
