const a = "https://jejugroup.alwaysdata.net", o = "http://localhost:9090/jeju-web", e = /* @__PURE__ */ new Set(["localhost", "127.0.0.1"]), n = () => {
  const t = new URLSearchParams(window.location.search).get("api");
  return t === "local" ? o : t === "remote" ? a : e.has(window.location.hostname) && window.location.port !== "9090" ? o : "";
}, s = n();
export {
  s as API_BASE_URL
};
