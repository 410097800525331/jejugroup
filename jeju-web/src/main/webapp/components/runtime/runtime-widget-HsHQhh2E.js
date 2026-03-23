import { c as _, j as H } from "./react-vendor-BoSfm_Te.js";
import { C as M } from "./feature-ui-CtrW2zOd.js";
let y = null, d = null, m = !1, b = localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
const u = () => {
  y && y.render(
    /* @__PURE__ */ H.jsx(
      M,
      {
        isOpen: m,
        onClose: () => {
          m = !1, u();
        },
        language: b,
        onLanguageChange: (a) => {
          b = a, localStorage.setItem("jeju_fab_lang", a), u();
        }
      }
    )
  );
}, T = () => {
  d || (d = document.getElementById("jeju-chatbot-root"), d || (d = document.createElement("div"), d.id = "jeju-chatbot-root", document.body.appendChild(d)), y = _(d), u());
}, W = () => {
  T(), window.hotelChatbot = {
    openChatbot: () => {
      m = !0, u();
    },
    closeChatbot: () => {
      m = !1, u();
    },
    toggleChatbot: () => {
      m = !m, u();
    },
    updateLanguage: (a) => {
      b = a, localStorage.setItem("jeju_fab_lang", a), u();
    }
  };
};
let C = !1;
const D = 37.5665, P = 126.978, I = (a, e = "small") => {
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
  }, l = a.slice(0, 2), [n, i] = t[l] ?? ["fa-cloud", "#cbd5e1"];
  return e === "large" ? `<i class="fa-solid ${n} weather-detail-icon-fa" style="color:${i};"></i>` : `<i class="fa-solid ${n}" style="color:${i};margin-right:4px;"></i>`;
}, q = async (a, e) => {
  const t = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=current&lat=${a}&lon=${e}`);
  if (!t.ok)
    throw new Error(`weather fetch failed: ${t.status}`);
  return t.json();
}, k = async (a, e) => {
  const t = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=pollution&lat=${a}&lon=${e}`);
  if (!t.ok)
    throw new Error(`pollution fetch failed: ${t.status}`);
  return t.json();
}, x = async () => new Promise((a, e) => {
  if (!navigator.geolocation) {
    e(new Error("geolocation unavailable"));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (t) => {
      a({
        lat: t.coords.latitude,
        lon: t.coords.longitude
      });
    },
    (t) => e(t)
  );
}), B = (a, e) => {
  var n, i;
  const t = Math.round(e.main.temp), l = ((i = (n = e.weather) == null ? void 0 : n[0]) == null ? void 0 : i.icon) ?? "03d";
  a.innerHTML = `${I(l, "small")}<span>${t}°</span>`;
}, v = (a, e, t) => {
  var f, w, g, o, r, s, c, $, j, E, L;
  const l = ((g = (w = (f = t == null ? void 0 : t.list) == null ? void 0 : f[0]) == null ? void 0 : w.main) == null ? void 0 : g.aqi) ?? 1, n = {
    1: ["좋음", "good"],
    2: ["보통", "fair"],
    3: ["나쁨", "poor"],
    4: ["매우나쁨", "very-poor"],
    5: ["매우나쁨", "very-poor"]
  }, [i, h] = n[l] ?? ["정보없음", ""], p = I(((r = (o = e.weather) == null ? void 0 : o[0]) == null ? void 0 : r.icon) ?? "03d", "large");
  a.innerHTML = `
    <div class="weather-detail-main">
      <p class="weather-detail-city">${e.name ?? "도시"}</p>
      <div class="weather-detail-info">
        ${p}
        <h2 class="weather-detail-temp">${Math.round(((s = e.main) == null ? void 0 : s.temp) ?? 0)}°</h2>
        <p class="weather-detail-desc">${(($ = (c = e.weather) == null ? void 0 : c[0]) == null ? void 0 : $.description) ?? ""}</p>
      </div>
    </div>
    <div class="weather-detail-grid">
      <div class="weather-detail-item">
        <span class="item-label">체감온도</span>
        <span class="item-value">${Math.round(((j = e.main) == null ? void 0 : j.feels_like) ?? 0)}°</span>
      </div>
      <div class="weather-detail-item weather-detail-dust ${h}">
        <span class="item-label">미세먼지</span>
        <span class="item-value">${i}</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">습도</span>
        <span class="item-value">${((E = e.main) == null ? void 0 : E.humidity) ?? 0}%</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">풍속</span>
        <span class="item-value">${((L = e.wind) == null ? void 0 : L.speed) ?? 0}m/s</span>
      </div>
    </div>
  `;
}, A = () => {
  if (C)
    return;
  const a = document.getElementById("weather-open-btn"), e = document.getElementById("weather-overlay"), t = document.getElementById("weather-close-btn"), l = document.getElementById("weather-detail-container"), n = document.getElementById("weather-search-input"), i = document.getElementById("weather-search-btn");
  if (!a || !e || !t || !l)
    return;
  let h = null, p = null;
  const f = async (o, r) => {
    const [s, c] = await Promise.all([q(o, r), k(o, r)]);
    h = s, p = c, B(a, s), e.classList.contains("active") && v(l, s, c);
  };
  a.addEventListener("click", () => {
    e.classList.add("active"), h && p && v(l, h, p);
  }), t.addEventListener("click", () => {
    e.classList.remove("active");
  }), e.addEventListener("click", (o) => {
    o.target === e && e.classList.remove("active");
  });
  const w = async () => {
    const o = n == null ? void 0 : n.value.trim();
    if (o)
      try {
        const r = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=search&q=${encodeURIComponent(o)}`);
        if (!r.ok)
          throw new Error(`city weather failed: ${r.status}`);
        const s = await r.json(), c = await k(s.coord.lat, s.coord.lon);
        h = s, p = c, B(a, s), v(l, s, c);
      } catch (r) {
        l.innerHTML = `<div class="weather-loading-large"><p>조회 실패: ${r.message}</p></div>`;
      }
  };
  i == null || i.addEventListener("click", () => {
    w().catch(() => {
    });
  }), n == null || n.addEventListener("keydown", (o) => {
    o.key === "Enter" && (o.preventDefault(), w().catch(() => {
    }));
  }), (async () => {
    try {
      const o = await x();
      await f(o.lat, o.lon);
    } catch {
      await f(D, P);
    }
  })().catch(() => {
  }), C = !0;
};
export {
  A as a,
  W as s
};
