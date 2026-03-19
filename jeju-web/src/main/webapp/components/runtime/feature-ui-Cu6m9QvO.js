import { j as e, a, u as S } from "./react-vendor-BoSfm_Te.js";
import { g as y } from "./gsap-vendor-CK8bqKiF.js";
import { u as M, T as F, i as T, A as W, v as L, j as I, w as A } from "./icon-vendor-Dpra3II6.js";
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
] }), N = a.forwardRef(
  ({ id: r, className: o, label: n, icon: h, badgeCount: s, onClick: f, onMouseEnter: u, onMouseLeave: b }, d) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      id: r,
      ref: d,
      className: `fab-card ${o}`,
      onClick: f,
      onMouseEnter: u,
      onMouseLeave: b,
      children: [
        /* @__PURE__ */ e.jsx(h, { className: "card-icon" }),
        /* @__PURE__ */ e.jsx("span", { className: "card-label", children: n }),
        s !== void 0 && s > 0 && /* @__PURE__ */ e.jsx("span", { className: "fab-badge", children: s })
      ]
    }
  )
);
N.displayName = "ActionCard";
function R({ isOpen: r, wishlist: o, onClose: n, onRemove: h }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: `modal-overlay ${r ? "active" : ""}`,
        onClick: n
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: `wishlist-window ${r ? "is-active" : ""}`, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "wishlist-header", children: [
        /* @__PURE__ */ e.jsx("h3", { children: "MY STAY PICK" }),
        /* @__PURE__ */ e.jsx("button", { className: "close-wishlist", onClick: n, children: "×" })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "wishlist-content", children: o.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "wishlist-empty", children: [
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
      ] }) : o.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ e.jsx("img", { src: s.image, alt: s.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ e.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ e.jsx("span", { className: "wishlist-location", children: s.location }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => h(s.id),
                children: /* @__PURE__ */ e.jsx(F, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx("h4", { className: "wishlist-title", children: s.name }),
          /* @__PURE__ */ e.jsx("div", { className: "wishlist-price", children: s.price })
        ] })
      ] }, s.id)) })
    ] })
  ] });
}
function z({ onClick: r, isOpen: o }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "card-holder", onClick: r, children: [
    /* @__PURE__ */ e.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ e.jsx("div", { className: "fab-body" })
  ] });
}
function $() {
  const r = a.useRef(null), [o, n] = a.useState(!1), [h, s] = a.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [f, u] = a.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [b, d] = a.useState(!1), [g, p] = a.useState(!1);
  a.useEffect(() => {
    const i = (l) => s(l.detail);
    return document.addEventListener("fabWishlistUpdated", i), () => document.removeEventListener("fabWishlistUpdated", i);
  }, []);
  const { contextSafe: j } = S({ scope: r }), w = j(() => {
    if (g) return;
    p(!0), setTimeout(() => p(!1), 1600);
    const i = y.timeline(), l = ".fab-card", t = ".card-holder";
    o ? (y.set(l, { pointerEvents: "none" }), i.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(l, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), y.to(t, { y: 0, opacity: 1, duration: 0.3 })) : (y.set(l, { opacity: 1, pointerEvents: "auto", display: "flex" }), i.fromTo(
      l,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), y.to(t, { y: 5, opacity: 0.9, duration: 0.3 })), n(!o);
  }), c = j((i, l) => {
    o && y.to(i, {
      y: l ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), v = () => {
    const i = f === "KRW" ? "USD" : "KRW";
    u(i), localStorage.setItem("jeju_fab_currency", i), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: i }));
  }, k = () => {
    var i;
    (i = window.hotelChatbot) == null || i.openChatbot(), o && w();
  }, C = (i) => {
    const l = h.filter((t) => t.id !== i);
    s(l), localStorage.setItem("jeju_wishlist", JSON.stringify(l)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: l }));
  };
  return /* @__PURE__ */ e.jsxs("div", { ref: r, className: "original-fab-system", children: [
    /* @__PURE__ */ e.jsx(
      R,
      {
        isOpen: b,
        wishlist: h,
        onClose: () => d(!1),
        onRemove: C
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ e.jsx(z, { onClick: w, isOpen: o }),
      /* @__PURE__ */ e.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: T,
            onClick: () => window.location.href = "/",
            onMouseEnter: () => c(".card-0", !0),
            onMouseLeave: () => c(".card-0", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabTop",
            className: "card-1",
            label: "TOP",
            icon: W,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            onMouseEnter: () => c(".card-1", !0),
            onMouseLeave: () => c(".card-1", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabCurrency",
            className: "card-2",
            label: f === "KRW" ? "KOR" : "ENG",
            icon: L,
            onClick: v,
            onMouseEnter: () => c(".card-2", !0),
            onMouseLeave: () => c(".card-2", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabWishlist",
            className: "card-3",
            label: "PICK",
            icon: I,
            badgeCount: h.length,
            onClick: () => d(!0),
            onMouseEnter: () => c(".card-3", !0),
            onMouseLeave: () => c(".card-3", !1)
          }
        ),
        /* @__PURE__ */ e.jsx(
          N,
          {
            id: "fabChatbot",
            className: "card-4",
            label: "CHAT",
            icon: A,
            onClick: k,
            onMouseEnter: () => c(".card-4", !0),
            onMouseLeave: () => c(".card-4", !1)
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
const O = (r) => r === "en" ? "Welcome to Jeju Group. How can I assist you today?" : `안녕하세요. 제주그룹 도우미입니다.
여행의 모든 고민을 무엇이든 말씀해 주세요. 😊`, P = (r) => {
  var s, f, u, b, d, g;
  const o = (u = (f = (s = r.choices) == null ? void 0 : s[0]) == null ? void 0 : f.message) == null ? void 0 : u.content;
  return typeof o == "string" && o.trim() ? o.trim() : (((g = (d = (b = r.candidates) == null ? void 0 : b[0]) == null ? void 0 : d.content) == null ? void 0 : g.parts) ?? []).map((p) => typeof (p == null ? void 0 : p.text) == "string" ? p.text : "").filter((p) => !!p).join(`
`).trim() || null;
}, J = ({ isOpen: r, onClose: o, language: n, onLanguageChange: h }) => {
  const [s, f] = a.useState([]), [u, b] = a.useState(""), [d, g] = a.useState(!1), [p, j] = a.useState("checking"), w = a.useRef(null), c = a.useCallback(async () => {
    try {
      const t = new AbortController(), x = setTimeout(() => t.abort(), 6e3), m = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
        method: "GET",
        cache: "no-cache",
        signal: t.signal
      });
      clearTimeout(x), m.ok ? j("online") : j("error");
    } catch {
      j("offline");
    }
  }, []);
  a.useEffect(() => {
    c().catch(() => {
    });
    const t = setInterval(() => {
      c().catch(() => {
      });
    }, 6e4);
    return () => clearInterval(t);
  }, [c]), a.useEffect(() => {
    const t = {
      id: Date.now(),
      type: "bot",
      content: O(n),
      timestamp: /* @__PURE__ */ new Date()
    };
    f([t]);
  }, []), a.useEffect(() => {
    const t = (x) => {
      const m = x;
      (m.detail === "ko" || m.detail === "en") && h(m.detail);
    };
    return document.addEventListener("fabLanguageChanged", t), () => {
      document.removeEventListener("fabLanguageChanged", t);
    };
  }, [h]), a.useEffect(() => {
    w.current && (w.current.scrollTop = w.current.scrollHeight);
  }, [s, r]);
  const v = a.useCallback((t, x) => {
    f((m) => [
      ...m,
      {
        id: Date.now() + m.length + 1,
        type: t,
        content: x,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), k = a.useMemo(
    () => s.map((t) => ({ role: t.type === "user" ? "user" : "assistant", content: t.content })),
    [s]
  ), C = a.useCallback(async () => {
    const t = u.trim();
    if (!(!t || d)) {
      v("user", t), b(""), g(!0);
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
              ...k,
              {
                role: "user",
                content: t
              }
            ]
          })
        });
        if (!x.ok)
          throw new Error(`Chat API failed: ${x.status}`);
        const m = await x.json(), E = P(m) ?? "응답 처리 실패";
        v("bot", String(E));
      } catch (x) {
        v("bot", `오류 상태: ${x.message}`);
      } finally {
        g(!1);
      }
    }
  }, [v, k, u, n, d]), i = (t) => {
    t.preventDefault(), C().catch(() => {
    });
  }, l = (t) => {
    t.key === "Enter" && (t.preventDefault(), C().catch(() => {
    }));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `chatbot-container ${r ? "active" : ""}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "chatbot-header-info", children: [
        /* @__PURE__ */ e.jsx("div", { className: `chatbot-status-dot ${p}`, title: `API Server: ${p}` }),
        /* @__PURE__ */ e.jsx("h3", { className: "chatbot-header-title", children: n === "en" ? "Jeju Group Assistant" : "제주그룹 도우미" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-close-btn", onClick: o, "aria-label": "Close", children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ e.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "chatbot-messages", ref: w, children: [
      s.map((t) => /* @__PURE__ */ e.jsx("div", { className: `message ${t.type}`, children: /* @__PURE__ */ e.jsxs("div", { className: "message-content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "message-bubble", children: t.content }),
        /* @__PURE__ */ e.jsx("div", { className: "message-time", children: t.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
      ] }) }, t.id)),
      d ? /* @__PURE__ */ e.jsx("div", { className: "message bot", children: /* @__PURE__ */ e.jsx("div", { className: "message-content", children: /* @__PURE__ */ e.jsxs("div", { className: "typing-indicator", children: [
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {}),
        /* @__PURE__ */ e.jsx("span", {})
      ] }) }) }) : null
    ] }),
    /* @__PURE__ */ e.jsx("form", { className: "chatbot-input-area", onSubmit: i, children: /* @__PURE__ */ e.jsxs("div", { className: "chatbot-input-wrapper", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          className: "chatbot-input",
          value: u,
          onChange: (t) => b(t.target.value),
          onKeyDown: l,
          placeholder: n === "en" ? "Type your message..." : "무엇이든 물어보세요"
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "chatbot-send-btn", type: "submit", disabled: d || !u.trim(), children: /* @__PURE__ */ e.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ e.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
        /* @__PURE__ */ e.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
      ] }) })
    ] }) })
  ] });
};
export {
  J as C,
  $ as F,
  K as R
};
