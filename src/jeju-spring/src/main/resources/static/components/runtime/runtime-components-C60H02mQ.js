import { a as t, j as s } from "./react-vendor-BoSfm_Te.js";
const c = () => {
  try {
    const e = localStorage.getItem("jeju_wishlist") ?? "[]", r = JSON.parse(e);
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}, l = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", u = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", p = () => ({
  currency: l(),
  language: u(),
  wishlist: c(),
  drawerOpen: !1,
  chatbotOpen: !1,
  weatherOpen: !1
}), a = (e, r) => typeof r == "boolean" ? r : !e, S = (e, r) => {
  switch (r.type) {
    case "SET_CURRENCY":
      return { ...e, currency: r.payload };
    case "SET_LANGUAGE":
      return { ...e, language: r.payload };
    case "SET_WISHLIST":
      return { ...e, wishlist: [...r.payload] };
    case "TOGGLE_DRAWER":
      return { ...e, drawerOpen: a(e.drawerOpen, r.payload) };
    case "TOGGLE_CHATBOT":
      return { ...e, chatbotOpen: a(e.chatbotOpen, r.payload) };
    case "TOGGLE_WEATHER":
      return { ...e, weatherOpen: a(e.weatherOpen, r.payload) };
    default:
      return e;
  }
}, d = t.createContext(null), w = ({ children: e }) => {
  const [r, n] = t.useReducer(S, void 0, p), o = t.useMemo(
    () => ({
      state: r,
      dispatch: n
    }),
    [r]
  );
  return /* @__PURE__ */ s.jsx(d.Provider, { value: o, children: e });
};
export {
  w as S
};
