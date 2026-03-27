import { c as T, j as x } from "./react-vendor-BoSfm_Te.js";
import { C as D } from "./feature-ui-DAUngKpP.js";
let b = null, h = null, m = !1;
const E = () => typeof window > "u" ? null : window.frontI18n ?? null, w = (e) => e === "en" || e === "ko" ? e : null, P = () => {
  try {
    return localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}, M = () => {
  var t, n;
  const e = E();
  return w(((t = e == null ? void 0 : e.getCurrentLang) == null ? void 0 : t.call(e)) ?? ((n = e == null ? void 0 : e.resolveCurrentLang) == null ? void 0 : n.call(e))) ?? P();
}, q = (e) => {
  try {
    localStorage.setItem("jeju_lang", e), localStorage.setItem("front.lang", e), localStorage.setItem("jeju_fab_lang", e);
  } catch {
  }
}, F = (e) => {
  typeof document > "u" || (document.dispatchEvent(new CustomEvent("languageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("front:i18n-change", { detail: { lang: e, source: "chatbot:fallback" } })));
}, O = (e) => {
  const a = E();
  if (a != null && a.subscribeLanguageChange)
    return a.subscribeLanguageChange((n) => {
      const s = w(n.lang);
      s && e(s);
    });
  if (typeof document > "u")
    return () => {
    };
  const t = (n) => {
    const o = n.detail, l = w(
      typeof o == "string" ? o : typeof o == "object" && o ? o.lang ?? o.currentLang ?? o.value : null
    );
    l && e(l);
  };
  return document.addEventListener("languageChanged", t), document.addEventListener("fabLanguageChanged", t), document.addEventListener("front:i18n-change", t), () => {
    document.removeEventListener("languageChanged", t), document.removeEventListener("fabLanguageChanged", t), document.removeEventListener("front:i18n-change", t);
  };
}, R = (e, a) => {
  const t = w(e) ?? "ko", n = E();
  return n != null && n.setCurrentLang ? n.setCurrentLang(t, { source: a }) ?? t : (q(t), F(t), t);
};
let g = M(), I = null;
const d = () => {
  b && b.render(
    /* @__PURE__ */ x.jsx(
      D,
      {
        isOpen: m,
        onClose: () => {
          m = !1, d();
        },
        language: g,
        onLanguageChange: (e) => {
          g !== e && (g = e, d());
        }
      }
    )
  );
}, W = () => {
  h || (h = document.getElementById("jeju-chatbot-root"), h || (h = document.createElement("div"), h.id = "jeju-chatbot-root", document.body.appendChild(h)), b = T(h), d());
}, K = () => {
  g = M(), W(), I || (I = O((e) => {
    g !== e && (g = e, d());
  })), d(), window.hotelChatbot = {
    openChatbot: () => {
      m = !0, d();
    },
    closeChatbot: () => {
      m = !1, d();
    },
    toggleChatbot: () => {
      m = !m, d();
    },
    updateLanguage: (e) => {
      g !== e && (g = R(e, "chatbot:updateLanguage"), d());
    }
  };
};
let B = !1;
const A = 37.5665, U = 126.978, S = (e, a = "small") => {
  const t = {
    "01": ["fa-sun", "#ffbd00"],
    "02": ["fa-cloud-sun", "#ffbd00"],
    "03": ["fa-cloud", "#cbd5e1"],
    "04": ["fa-cloud", "#94a3b8"],
    "09": ["fa-cloud-showers-heavy", "#60a5fa"],
    10: ["fa-cloud-rain", "#60a5fa"],
    11: ["fa-bolt", "#fde047"],
    13: ["fa-snowflake", "#99f6e4"],
    50: ["fa-smog", "#94a3b8"]
  }, n = e.slice(0, 2), [s, o] = t[n] ?? ["fa-cloud", "#cbd5e1"];
  return a === "large" ? `<i class="fa-solid ${s} weather-detail-icon-fa" style="color:${o};"></i>` : `<i class="fa-solid ${s}" style="color:${o};margin-right:4px;"></i>`;
}, z = async (e, a) => {
  const t = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=current&lat=${e}&lon=${a}`);
  if (!t.ok)
    throw new Error(`weather fetch failed: ${t.status}`);
  return t.json();
}, _ = async (e, a) => {
  const t = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=pollution&lat=${e}&lon=${a}`);
  if (!t.ok)
    throw new Error(`pollution fetch failed: ${t.status}`);
  return t.json();
}, G = async () => new Promise((e, a) => {
  if (!navigator.geolocation) {
    a(new Error("geolocation unavailable"));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (t) => {
      e({
        lat: t.coords.latitude,
        lon: t.coords.longitude
      });
    },
    (t) => a(t)
  );
}), H = (e, a) => {
  var s, o;
  const t = Math.round(a.main.temp), n = ((o = (s = a.weather) == null ? void 0 : s[0]) == null ? void 0 : o.icon) ?? "03d";
  e.innerHTML = `${S(n, "small")}<span>${t}°</span>`;
}, y = (e, a, t) => {
  var p, v, L, r, i, c, u, C, $, j, k;
  const n = ((L = (v = (p = t == null ? void 0 : t.list) == null ? void 0 : p[0]) == null ? void 0 : v.main) == null ? void 0 : L.aqi) ?? 1, s = {
    1: ["좋음", "good"],
    2: ["보통", "fair"],
    3: ["나쁨", "poor"],
    4: ["매우나쁨", "very-poor"],
    5: ["매우나쁨", "very-poor"]
  }, [o, l] = s[n] ?? ["정보없음", ""], f = S(((i = (r = a.weather) == null ? void 0 : r[0]) == null ? void 0 : i.icon) ?? "03d", "large");
  e.innerHTML = `
    <div class="weather-detail-main">
      <p class="weather-detail-city">${a.name ?? "도시"}</p>
      <div class="weather-detail-info">
        ${f}
        <h2 class="weather-detail-temp">${Math.round(((c = a.main) == null ? void 0 : c.temp) ?? 0)}°</h2>
        <p class="weather-detail-desc">${((C = (u = a.weather) == null ? void 0 : u[0]) == null ? void 0 : C.description) ?? ""}</p>
      </div>
    </div>
    <div class="weather-detail-grid">
      <div class="weather-detail-item">
        <span class="item-label">체감온도</span>
        <span class="item-value">${Math.round((($ = a.main) == null ? void 0 : $.feels_like) ?? 0)}°</span>
      </div>
      <div class="weather-detail-item weather-detail-dust ${l}">
        <span class="item-label">미세먼지</span>
        <span class="item-value">${o}</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">습도</span>
        <span class="item-value">${((j = a.main) == null ? void 0 : j.humidity) ?? 0}%</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">풍속</span>
        <span class="item-value">${((k = a.wind) == null ? void 0 : k.speed) ?? 0}m/s</span>
      </div>
    </div>
  `;
}, Q = () => {
  if (B)
    return;
  const e = document.getElementById("weather-open-btn"), a = document.getElementById("weather-overlay"), t = document.getElementById("weather-close-btn"), n = document.getElementById("weather-detail-container"), s = document.getElementById("weather-search-input"), o = document.getElementById("weather-search-btn");
  if (!e || !a || !t || !n)
    return;
  let l = null, f = null;
  const p = async (r, i) => {
    const [c, u] = await Promise.all([z(r, i), _(r, i)]);
    l = c, f = u, H(e, c), a.classList.contains("active") && y(n, c, u);
  };
  e.addEventListener("click", () => {
    a.classList.add("active"), l && f && y(n, l, f);
  }), t.addEventListener("click", () => {
    a.classList.remove("active");
  }), a.addEventListener("click", (r) => {
    r.target === a && a.classList.remove("active");
  });
  const v = async () => {
    const r = s == null ? void 0 : s.value.trim();
    if (r)
      try {
        const i = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=search&q=${encodeURIComponent(r)}`);
        if (!i.ok)
          throw new Error(`city weather failed: ${i.status}`);
        const c = await i.json(), u = await _(c.coord.lat, c.coord.lon);
        l = c, f = u, H(e, c), y(n, c, u);
      } catch (i) {
        n.innerHTML = `<div class="weather-loading-large"><p>조회 실패: ${i.message}</p></div>`;
      }
  };
  o == null || o.addEventListener("click", () => {
    v().catch(() => {
    });
  }), s == null || s.addEventListener("keydown", (r) => {
    r.key === "Enter" && (r.preventDefault(), v().catch(() => {
    }));
  }), (async () => {
    try {
      const r = await G();
      await p(r.lat, r.lon);
    } catch {
      await p(A, U);
    }
  })().catch(() => {
  }), B = !0;
};
export {
  Q as a,
  K as s
};
