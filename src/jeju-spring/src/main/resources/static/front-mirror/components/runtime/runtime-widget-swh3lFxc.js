import { c as P, j as A } from "./react-vendor-BoSfm_Te.js";
import { C as W } from "./feature-ui-VuIONmRp.js";
let E = null, f = null, h = !1;
const b = () => typeof window > "u" ? null : window.frontI18n ?? null, w = (e) => e === "en" || e === "ko" ? e : null, D = () => {
  try {
    return localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}, S = () => {
  var t, a;
  const e = b();
  return w(((t = e == null ? void 0 : e.getCurrentLang) == null ? void 0 : t.call(e)) ?? ((a = e == null ? void 0 : e.resolveCurrentLang) == null ? void 0 : a.call(e))) ?? D();
}, O = (e) => {
  try {
    localStorage.setItem("jeju_lang", e), localStorage.setItem("front.lang", e), localStorage.setItem("jeju_fab_lang", e);
  } catch {
  }
}, R = (e) => {
  typeof document > "u" || (document.dispatchEvent(new CustomEvent("languageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("front:i18n-change", { detail: { lang: e, source: "chatbot:fallback" } })));
}, q = (e) => {
  const n = b();
  if (n != null && n.subscribeLanguageChange)
    return n.subscribeLanguageChange((a) => {
      const o = w(a.lang);
      o && e(o);
    });
  if (typeof document > "u")
    return () => {
    };
  const t = (a) => {
    const s = a.detail, l = w(
      typeof s == "string" ? s : typeof s == "object" && s ? s.lang ?? s.currentLang ?? s.value : null
    );
    l && e(l);
  };
  return document.addEventListener("languageChanged", t), document.addEventListener("fabLanguageChanged", t), document.addEventListener("front:i18n-change", t), () => {
    document.removeEventListener("languageChanged", t), document.removeEventListener("fabLanguageChanged", t), document.removeEventListener("front:i18n-change", t);
  };
}, F = (e, n) => {
  const t = w(e) ?? "ko", a = b();
  return a != null && a.setCurrentLang ? a.setCurrentLang(t, { source: n }) ?? t : (O(t), R(t), t);
};
let g = S(), B = null;
const d = () => {
  E && E.render(
    /* @__PURE__ */ A.jsx(
      W,
      {
        isOpen: h,
        onClose: () => {
          h = !1, d();
        },
        language: g,
        onLanguageChange: (e) => {
          g !== e && (g = e, d());
        }
      }
    )
  );
}, U = () => {
  f || (f = document.getElementById("jeju-chatbot-root"), f || (f = document.createElement("div"), f.id = "jeju-chatbot-root", document.body.appendChild(f)), E = P(f), d());
}, V = () => {
  g = S(), U(), B || (B = q((e) => {
    g !== e && (g = e, d());
  })), d(), window.hotelChatbot = {
    openChatbot: () => {
      h = !0, d();
    },
    closeChatbot: () => {
      h = !1, d();
    },
    toggleChatbot: () => {
      h = !h, d();
    },
    updateLanguage: (e) => {
      g !== e && (g = F(e, "chatbot:updateLanguage"), d());
    }
  };
};
let H = !1;
const z = 37.5665, N = 126.978, C = "/api/weather", x = (e, n = "small") => {
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
  }, a = e.slice(0, 2), [o, s] = t[a] ?? ["fa-cloud", "#cbd5e1"];
  return n === "large" ? `<i class="fa-solid ${o} weather-detail-icon-fa" style="color:${s};"></i>` : `<i class="fa-solid ${o}" style="color:${s};margin-right:4px;"></i>`;
}, $ = async (e, n) => {
  const t = await e.text();
  if (!t.trim())
    return n;
  try {
    const a = JSON.parse(t), o = typeof a == "string" ? a : (a == null ? void 0 : a.message) ?? (a == null ? void 0 : a.error) ?? (a == null ? void 0 : a.detail) ?? (a == null ? void 0 : a.msg);
    if (typeof o == "string" && o.trim())
      return o.trim();
  } catch {
  }
  return t.trim();
}, G = async (e, n) => {
  const t = await fetch(`${C}?type=current&lat=${e}&lon=${n}`);
  if (!t.ok)
    throw new Error(await $(t, `weather fetch failed: ${t.status}`));
  return t.json();
}, T = async (e, n) => {
  const t = await fetch(`${C}?type=pollution&lat=${e}&lon=${n}`);
  if (!t.ok)
    throw new Error(await $(t, `pollution fetch failed: ${t.status}`));
  return t.json();
}, J = async () => new Promise((e, n) => {
  if (!navigator.geolocation) {
    n(new Error("geolocation unavailable"));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (t) => {
      e({
        lat: t.coords.latitude,
        lon: t.coords.longitude
      });
    },
    (t) => n(t)
  );
}), M = (e, n) => {
  var o, s;
  const t = Math.round(n.main.temp), a = ((s = (o = n.weather) == null ? void 0 : o[0]) == null ? void 0 : s.icon) ?? "03d";
  e.innerHTML = `${x(a, "small")}<span>${t}°</span>`;
}, y = (e, n, t) => {
  var p, v, L, r, c, i, u, k, j, I, _;
  const a = ((L = (v = (p = t == null ? void 0 : t.list) == null ? void 0 : p[0]) == null ? void 0 : v.main) == null ? void 0 : L.aqi) ?? 1, o = {
    1: ["좋음", "good"],
    2: ["보통", "fair"],
    3: ["나쁨", "poor"],
    4: ["매우나쁨", "very-poor"],
    5: ["매우나쁨", "very-poor"]
  }, [s, l] = o[a] ?? ["정보없음", ""], m = x(((c = (r = n.weather) == null ? void 0 : r[0]) == null ? void 0 : c.icon) ?? "03d", "large");
  e.innerHTML = `
    <div class="weather-detail-main">
      <p class="weather-detail-city">${n.name ?? "도시"}</p>
      <div class="weather-detail-info">
        ${m}
        <h2 class="weather-detail-temp">${Math.round(((i = n.main) == null ? void 0 : i.temp) ?? 0)}°</h2>
        <p class="weather-detail-desc">${((k = (u = n.weather) == null ? void 0 : u[0]) == null ? void 0 : k.description) ?? ""}</p>
      </div>
    </div>
    <div class="weather-detail-grid">
      <div class="weather-detail-item">
        <span class="item-label">체감온도</span>
        <span class="item-value">${Math.round(((j = n.main) == null ? void 0 : j.feels_like) ?? 0)}°</span>
      </div>
      <div class="weather-detail-item weather-detail-dust ${l}">
        <span class="item-label">미세먼지</span>
        <span class="item-value">${s}</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">습도</span>
        <span class="item-value">${((I = n.main) == null ? void 0 : I.humidity) ?? 0}%</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">풍속</span>
        <span class="item-value">${((_ = n.wind) == null ? void 0 : _.speed) ?? 0}m/s</span>
      </div>
    </div>
  `;
}, X = () => {
  if (H)
    return;
  const e = document.getElementById("weather-open-btn"), n = document.getElementById("weather-overlay"), t = document.getElementById("weather-close-btn"), a = document.getElementById("weather-detail-container"), o = document.getElementById("weather-search-input"), s = document.getElementById("weather-search-btn");
  if (!e || !n || !t || !a)
    return;
  let l = null, m = null;
  const p = async (r, c) => {
    const [i, u] = await Promise.all([G(r, c), T(r, c)]);
    l = i, m = u, M(e, i), n.classList.contains("active") && y(a, i, u);
  };
  e.addEventListener("click", () => {
    n.classList.add("active"), l && m && y(a, l, m);
  }), t.addEventListener("click", () => {
    n.classList.remove("active");
  }), n.addEventListener("click", (r) => {
    r.target === n && n.classList.remove("active");
  });
  const v = async () => {
    const r = o == null ? void 0 : o.value.trim();
    if (r)
      try {
        const c = await fetch(`${C}?type=search&q=${encodeURIComponent(r)}`);
        if (!c.ok)
          throw new Error(await $(c, `city weather failed: ${c.status}`));
        const i = await c.json(), u = await T(i.coord.lat, i.coord.lon);
        l = i, m = u, M(e, i), y(a, i, u);
      } catch (c) {
        a.innerHTML = `<div class="weather-loading-large"><p>조회 실패: ${c.message}</p></div>`;
      }
  };
  s == null || s.addEventListener("click", () => {
    v().catch(() => {
    });
  }), o == null || o.addEventListener("keydown", (r) => {
    r.key === "Enter" && (r.preventDefault(), v().catch(() => {
    }));
  }), (async () => {
    try {
      const r = await J();
      await p(r.lat, r.lon);
    } catch {
      await p(z, N);
    }
  })().catch(() => {
  }), H = !0;
};
export {
  X as a,
  V as s
};
