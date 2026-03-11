const o = "LOCAL_FRONT_ADMIN", n = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]), e = () => window.location.protocol === "file:" || n.has(window.location.hostname), t = () => Object.freeze({
  id: "local-admin",
  name: "로컬 관리자",
  email: "admin@local.jejugroup",
  role: "ADMIN",
  roles: ["ADMIN", "SUPER_ADMIN"],
  authSource: o,
  isLocalAdmin: !0
});
export {
  t as buildLocalFrontAdminSession,
  e as isLocalFrontEnvironment
};
