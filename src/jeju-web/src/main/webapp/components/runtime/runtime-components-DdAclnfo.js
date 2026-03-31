import { a as s, j as p } from "./react-vendor-BoSfm_Te.js";
const l = () => typeof window > "u" ? null : window.frontI18n ?? null, g = (e) => e === "en" || e === "ko" ? e : null, i = () => {
  try {
    return localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}, d = () => {
  var a, t;
  const e = l();
  return g(((a = e == null ? void 0 : e.getCurrentLang) == null ? void 0 : a.call(e)) ?? ((t = e == null ? void 0 : e.resolveCurrentLang) == null ? void 0 : t.call(e))) ?? i();
}, L = (e) => {
  const n = l();
  if (n != null && n.subscribeLanguageChange)
    return n.subscribeLanguageChange((t) => {
      const o = g(t.lang);
      o && e(o);
    });
  if (typeof document > "u")
    return () => {
    };
  const a = (t) => {
    const r = t.detail, u = g(
      typeof r == "string" ? r : typeof r == "object" && r ? r.lang ?? r.currentLang ?? r.value : null
    );
    u && e(u);
  };
  return document.addEventListener("languageChanged", a), document.addEventListener("fabLanguageChanged", a), document.addEventListener("front:i18n-change", a), () => {
    document.removeEventListener("languageChanged", a), document.removeEventListener("fabLanguageChanged", a), document.removeEventListener("front:i18n-change", a);
  };
}, f = () => {
  try {
    const e = localStorage.getItem("jeju_wishlist") ?? "[]", n = JSON.parse(e);
    return Array.isArray(n) ? n : [];
  } catch {
    return [];
  }
}, h = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", E = () => d(), y = () => ({
  currency: h(),
  language: E(),
  wishlist: f(),
  drawerOpen: !1,
  chatbotOpen: !1,
  weatherOpen: !1
}), c = (e, n) => typeof n == "boolean" ? n : !e, m = (e, n) => {
  switch (n.type) {
    case "SET_CURRENCY":
      return { ...e, currency: n.payload };
    case "SET_LANGUAGE":
      return { ...e, language: n.payload };
    case "SET_WISHLIST":
      return { ...e, wishlist: [...n.payload] };
    case "TOGGLE_DRAWER":
      return { ...e, drawerOpen: c(e.drawerOpen, n.payload) };
    case "TOGGLE_CHATBOT":
      return { ...e, chatbotOpen: c(e.chatbotOpen, n.payload) };
    case "TOGGLE_WEATHER":
      return { ...e, weatherOpen: c(e.weatherOpen, n.payload) };
    default:
      return e;
  }
}, w = s.createContext(null), v = ({ children: e }) => {
  const [n, a] = s.useReducer(m, void 0, y);
  s.useEffect(() => {
    const o = L((u) => {
      u !== n.language && a({ type: "SET_LANGUAGE", payload: u });
    }), r = d();
    return r !== n.language && a({ type: "SET_LANGUAGE", payload: r }), o;
  }, [a, n.language]);
  const t = s.useMemo(
    () => ({
      state: n,
      dispatch: a
    }),
    [n]
  );
  return /* @__PURE__ */ p.jsx(w.Provider, { value: t, children: e });
};
export {
  v as S
};
