function a(t) {
  if (typeof t != "string")
    return t;
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return t.replace(/[&<>"']/g, (n) => e[n]);
}
function r(t) {
  return /[<>'";\(\)={}]/.test(t) ? (console.warn("Security Warning: Invalid parameter detected"), !1) : !0;
}
export {
  a as sanitizeHTML,
  r as validateParam
};
