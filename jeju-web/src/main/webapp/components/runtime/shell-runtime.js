var Im = Object.defineProperty;
var Rm = (t, e, n) => e in t ? Im(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Tn = (t, e, n) => Rm(t, typeof e != "symbol" ? e + "" : e, n);
const ha = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let sc = !1;
const ac = () => {
  const t = document.querySelector(".header");
  if (t) {
    if (window.scrollY > 20) {
      t.classList.add("scrolled");
      return;
    }
    t.classList.remove("scrolled");
  }
}, Mm = () => {
  sc || (sc = !0, window.addEventListener("scroll", ac), ac());
}, Om = () => {
  document.querySelectorAll(".nav-item").forEach((e) => {
    if (e.dataset.megaHoverBound === "true")
      return;
    const n = e.querySelector(".mega-dropdown");
    n && (e.dataset.megaHoverBound = "true", e.addEventListener("mouseenter", () => {
      document.querySelectorAll(".mega-dropdown.active").forEach((r) => {
        r !== n && r.classList.remove("active");
      }), n.classList.add("active");
    }), e.addEventListener("mouseleave", () => {
      setTimeout(() => {
        e.matches(":hover") || n.classList.remove("active");
      }, 200);
    }));
  });
}, Dm = () => {
  document.querySelectorAll(".mega-menu-item").forEach((e) => {
    e.dataset.previewHoverBound !== "true" && (e.dataset.previewHoverBound = "true", e.addEventListener("mouseenter", () => {
      const n = e.closest(".mega-dropdown"), r = e.getAttribute("data-preview"), i = r ? document.getElementById(r) : null;
      if (!n || !i)
        return;
      n.querySelectorAll(".preview-image").forEach((a) => {
        a.classList.remove("active");
      }), i.classList.add("active");
      const s = n.querySelector(".preview-loader");
      s && (s.style.display = "none");
    }));
  });
}, zm = () => {
  document.querySelectorAll(".mega-dropdown").forEach((t) => {
    if (t.dataset.previewInit === "true")
      return;
    t.dataset.previewInit = "true";
    const e = t.querySelector(".preview-image");
    e && e.classList.add("active");
  });
}, Uo = () => {
  Mm(), Om(), Dm(), zm();
};
let lc = !1;
const oc = (t, e) => {
  const n = document.createElement("span");
  return n.className = e, n.setAttribute("aria-hidden", e.includes("clone") ? "true" : "false"), t.split("").forEach((r, i) => {
    const s = document.createElement("span");
    s.className = "stagger-char", s.textContent = r === " " ? " " : r, s.style.transitionDelay = `${i * 30}ms`, n.appendChild(s);
  }), n;
}, pa = () => {
  document.querySelectorAll(".nav-link").forEach((e) => {
    var l;
    if (e.querySelector(".stagger-wrapper"))
      return;
    const n = e.querySelector("span[data-lang]") || e.querySelector("span");
    if (!n)
      return;
    const r = ((l = n.textContent) == null ? void 0 : l.trim()) ?? "";
    if (!r)
      return;
    const i = document.createElement("span");
    i.className = "stagger-wrapper", i.appendChild(oc(r, "stagger-original")), i.appendChild(oc(r, "stagger-clone")), n.textContent = "", n.appendChild(i);
    let s = !1, a = !1;
    e.addEventListener("mouseenter", () => {
      if (a = !0, s)
        return;
      s = !0, e.classList.add("is-animating");
      const o = r.length * 30 + 300 + 50;
      setTimeout(() => {
        s = !1, a || e.classList.remove("is-animating");
      }, o);
    }), e.addEventListener("mouseleave", () => {
      a = !1, s || e.classList.remove("is-animating");
    });
  });
}, Fm = () => {
  lc || (lc = !0, document.addEventListener("mainHeaderLoaded", pa));
}, Hi = () => {
  var r;
  const t = new URL("../../", import.meta.url).href;
  if ((r = window.__JEJU_ROUTE_NAVIGATOR__) != null && r.appRoot)
    return new URL(window.__JEJU_ROUTE_NAVIGATOR__.appRoot, window.location.href).href;
  const e = document.currentScript;
  if (e != null && e.src)
    return new URL("../", e.src).href;
  const n = Array.from(document.getElementsByTagName("script"));
  for (const i of n) {
    const s = i.src || i.getAttribute("src");
    if (s && (s.includes("components/runtime/bootstrap.js") || s.includes("components/runtime/shell-runtime.js")))
      return new URL("../../", s).href;
  }
  return t;
}, Br = (t) => new URL(t, Hi()).href, Ho = "userSession", Bm = "jeju:session-updated";
let uc = !1, za = !1;
const sf = () => document.getElementById("header") || document.querySelector(".header"), cc = () => {
  const t = sf();
  if (t) {
    if (window.scrollY > 50) {
      t.classList.add("scrolled");
      return;
    }
    t.classList.remove("scrolled");
  }
}, Um = () => {
  uc || (uc = !0, window.addEventListener("scroll", cc), cc());
}, Hm = () => {
  document.querySelectorAll(".mega-menu-item").forEach((e) => {
    e.dataset.previewBound !== "true" && (e.dataset.previewBound = "true", e.addEventListener("mouseenter", () => {
      const n = e.dataset.preview, r = e.closest(".mega-dropdown");
      if (!n || !r)
        return;
      const i = r.querySelector(".mega-menu-preview");
      i && i.querySelectorAll(".preview-image").forEach((s) => {
        s.classList.toggle("active", s.id === n);
      });
    }));
  });
}, Vm = () => {
  const t = document.getElementById("mobileMenuBtn"), e = document.getElementById("mobileNav");
  !t || !e || t.dataset.mobileToggleBound !== "true" && (t.dataset.mobileToggleBound = "true", t.addEventListener("click", () => {
    e.classList.toggle("active");
  }));
}, $m = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), Wm = async (t) => {
  const e = t.querySelector("span");
  e ? e.textContent = "로그아웃" : t.textContent = "로그아웃";
  const n = t.querySelector("i");
  n && n.setAttribute("data-lucide", "log-out"), "href" in t && (t.href = "#"), t.removeAttribute("data-route"), t.dataset.logoutBound !== "true" && (t.dataset.logoutBound = "true", t.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      const s = await import(Br("core/auth/session_manager.js"));
      typeof s.logoutSession == "function" && await s.logoutSession();
    } catch {
      localStorage.removeItem(Ho);
    }
    window.location.reload();
  }));
}, Gm = (t) => {
  if (t.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const e = document.createElement("a");
  e.id = "indexAdminBtn", e.href = "#", e.className = "util-link route-link", e.setAttribute("data-route", "ADMIN.DASHBOARD"), e.style.color = "#FF5000", e.style.fontWeight = "700", e.textContent = "관리자 페이지";
  const n = document.createElement("span");
  n.className = "util-divider", n.textContent = "|", t.prepend(e, n);
}, Km = async () => {
  try {
    const e = await import(Br("core/auth/session_manager.js"));
    if (typeof e.resolveSession == "function")
      return await e.resolveSession();
  } catch {
  }
  try {
    const t = localStorage.getItem(Ho);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}, Ym = async () => {
  try {
    const e = await import(Br("core/auth/local_admin.js"));
    return typeof e.isLocalFrontEnvironment == "function" && e.isLocalFrontEnvironment();
  } catch {
    return !1;
  }
}, Qm = async () => {
  var s;
  const t = document.getElementById("headerAdminBtn"), e = $m(), n = document.getElementById("index-header-util"), [r, i] = await Promise.all([Km(), Ym()]);
  r && e && await Wm(e), i && t && (t.style.display = "flex"), i && n && Gm(n), (s = window.lucide) != null && s.createIcons && window.lucide.createIcons();
}, jl = () => {
  za || (za = !0, setTimeout(async () => {
    za = !1, await Qm();
  }, 0));
}, Vi = () => {
  sf() && (Um(), Hm(), Vm(), Uo(), pa(), jl());
}, qm = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    Vi();
  }), window.addEventListener("storage", (t) => {
    t.key === Ho && jl();
  }), window.addEventListener(Bm, () => {
    jl();
  });
};
var af = { exports: {} }, ma = {}, lf = { exports: {} }, B = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $i = Symbol.for("react.element"), Xm = Symbol.for("react.portal"), Jm = Symbol.for("react.fragment"), Zm = Symbol.for("react.strict_mode"), eg = Symbol.for("react.profiler"), tg = Symbol.for("react.provider"), ng = Symbol.for("react.context"), rg = Symbol.for("react.forward_ref"), ig = Symbol.for("react.suspense"), sg = Symbol.for("react.memo"), ag = Symbol.for("react.lazy"), dc = Symbol.iterator;
function lg(t) {
  return t === null || typeof t != "object" ? null : (t = dc && t[dc] || t["@@iterator"], typeof t == "function" ? t : null);
}
var of = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, uf = Object.assign, cf = {};
function Ur(t, e, n) {
  this.props = t, this.context = e, this.refs = cf, this.updater = n || of;
}
Ur.prototype.isReactComponent = {};
Ur.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
Ur.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function df() {
}
df.prototype = Ur.prototype;
function Vo(t, e, n) {
  this.props = t, this.context = e, this.refs = cf, this.updater = n || of;
}
var $o = Vo.prototype = new df();
$o.constructor = Vo;
uf($o, Ur.prototype);
$o.isPureReactComponent = !0;
var fc = Array.isArray, ff = Object.prototype.hasOwnProperty, Wo = { current: null }, hf = { key: !0, ref: !0, __self: !0, __source: !0 };
function pf(t, e, n) {
  var r, i = {}, s = null, a = null;
  if (e != null) for (r in e.ref !== void 0 && (a = e.ref), e.key !== void 0 && (s = "" + e.key), e) ff.call(e, r) && !hf.hasOwnProperty(r) && (i[r] = e[r]);
  var l = arguments.length - 2;
  if (l === 1) i.children = n;
  else if (1 < l) {
    for (var o = Array(l), u = 0; u < l; u++) o[u] = arguments[u + 2];
    i.children = o;
  }
  if (t && t.defaultProps) for (r in l = t.defaultProps, l) i[r] === void 0 && (i[r] = l[r]);
  return { $$typeof: $i, type: t, key: s, ref: a, props: i, _owner: Wo.current };
}
function og(t, e) {
  return { $$typeof: $i, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function Go(t) {
  return typeof t == "object" && t !== null && t.$$typeof === $i;
}
function ug(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(n) {
    return e[n];
  });
}
var hc = /\/+/g;
function Fa(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? ug("" + t.key) : e.toString(36);
}
function ys(t, e, n, r, i) {
  var s = typeof t;
  (s === "undefined" || s === "boolean") && (t = null);
  var a = !1;
  if (t === null) a = !0;
  else switch (s) {
    case "string":
    case "number":
      a = !0;
      break;
    case "object":
      switch (t.$$typeof) {
        case $i:
        case Xm:
          a = !0;
      }
  }
  if (a) return a = t, i = i(a), t = r === "" ? "." + Fa(a, 0) : r, fc(i) ? (n = "", t != null && (n = t.replace(hc, "$&/") + "/"), ys(i, e, n, "", function(u) {
    return u;
  })) : i != null && (Go(i) && (i = og(i, n + (!i.key || a && a.key === i.key ? "" : ("" + i.key).replace(hc, "$&/") + "/") + t)), e.push(i)), 1;
  if (a = 0, r = r === "" ? "." : r + ":", fc(t)) for (var l = 0; l < t.length; l++) {
    s = t[l];
    var o = r + Fa(s, l);
    a += ys(s, e, n, o, i);
  }
  else if (o = lg(t), typeof o == "function") for (t = o.call(t), l = 0; !(s = t.next()).done; ) s = s.value, o = r + Fa(s, l++), a += ys(s, e, n, o, i);
  else if (s === "object") throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return a;
}
function Ji(t, e, n) {
  if (t == null) return t;
  var r = [], i = 0;
  return ys(t, r, "", "", function(s) {
    return e.call(n, s, i++);
  }), r;
}
function cg(t) {
  if (t._status === -1) {
    var e = t._result;
    e = e(), e.then(function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = n);
    }, function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = n);
    }), t._status === -1 && (t._status = 0, t._result = e);
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var Me = { current: null }, _s = { transition: null }, dg = { ReactCurrentDispatcher: Me, ReactCurrentBatchConfig: _s, ReactCurrentOwner: Wo };
function mf() {
  throw Error("act(...) is not supported in production builds of React.");
}
B.Children = { map: Ji, forEach: function(t, e, n) {
  Ji(t, function() {
    e.apply(this, arguments);
  }, n);
}, count: function(t) {
  var e = 0;
  return Ji(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return Ji(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!Go(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
B.Component = Ur;
B.Fragment = Jm;
B.Profiler = eg;
B.PureComponent = Vo;
B.StrictMode = Zm;
B.Suspense = ig;
B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = dg;
B.act = mf;
B.cloneElement = function(t, e, n) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var r = uf({}, t.props), i = t.key, s = t.ref, a = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (s = e.ref, a = Wo.current), e.key !== void 0 && (i = "" + e.key), t.type && t.type.defaultProps) var l = t.type.defaultProps;
    for (o in e) ff.call(e, o) && !hf.hasOwnProperty(o) && (r[o] = e[o] === void 0 && l !== void 0 ? l[o] : e[o]);
  }
  var o = arguments.length - 2;
  if (o === 1) r.children = n;
  else if (1 < o) {
    l = Array(o);
    for (var u = 0; u < o; u++) l[u] = arguments[u + 2];
    r.children = l;
  }
  return { $$typeof: $i, type: t.type, key: i, ref: s, props: r, _owner: a };
};
B.createContext = function(t) {
  return t = { $$typeof: ng, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: tg, _context: t }, t.Consumer = t;
};
B.createElement = pf;
B.createFactory = function(t) {
  var e = pf.bind(null, t);
  return e.type = t, e;
};
B.createRef = function() {
  return { current: null };
};
B.forwardRef = function(t) {
  return { $$typeof: rg, render: t };
};
B.isValidElement = Go;
B.lazy = function(t) {
  return { $$typeof: ag, _payload: { _status: -1, _result: t }, _init: cg };
};
B.memo = function(t, e) {
  return { $$typeof: sg, type: t, compare: e === void 0 ? null : e };
};
B.startTransition = function(t) {
  var e = _s.transition;
  _s.transition = {};
  try {
    t();
  } finally {
    _s.transition = e;
  }
};
B.unstable_act = mf;
B.useCallback = function(t, e) {
  return Me.current.useCallback(t, e);
};
B.useContext = function(t) {
  return Me.current.useContext(t);
};
B.useDebugValue = function() {
};
B.useDeferredValue = function(t) {
  return Me.current.useDeferredValue(t);
};
B.useEffect = function(t, e) {
  return Me.current.useEffect(t, e);
};
B.useId = function() {
  return Me.current.useId();
};
B.useImperativeHandle = function(t, e, n) {
  return Me.current.useImperativeHandle(t, e, n);
};
B.useInsertionEffect = function(t, e) {
  return Me.current.useInsertionEffect(t, e);
};
B.useLayoutEffect = function(t, e) {
  return Me.current.useLayoutEffect(t, e);
};
B.useMemo = function(t, e) {
  return Me.current.useMemo(t, e);
};
B.useReducer = function(t, e, n) {
  return Me.current.useReducer(t, e, n);
};
B.useRef = function(t) {
  return Me.current.useRef(t);
};
B.useState = function(t) {
  return Me.current.useState(t);
};
B.useSyncExternalStore = function(t, e, n) {
  return Me.current.useSyncExternalStore(t, e, n);
};
B.useTransition = function() {
  return Me.current.useTransition();
};
B.version = "18.3.1";
lf.exports = B;
var P = lf.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fg = P, hg = Symbol.for("react.element"), pg = Symbol.for("react.fragment"), mg = Object.prototype.hasOwnProperty, gg = fg.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, vg = { key: !0, ref: !0, __self: !0, __source: !0 };
function gf(t, e, n) {
  var r, i = {}, s = null, a = null;
  n !== void 0 && (s = "" + n), e.key !== void 0 && (s = "" + e.key), e.ref !== void 0 && (a = e.ref);
  for (r in e) mg.call(e, r) && !vg.hasOwnProperty(r) && (i[r] = e[r]);
  if (t && t.defaultProps) for (r in e = t.defaultProps, e) i[r] === void 0 && (i[r] = e[r]);
  return { $$typeof: hg, type: t, key: s, ref: a, props: i, _owner: gg.current };
}
ma.Fragment = pg;
ma.jsx = gf;
ma.jsxs = gf;
af.exports = ma;
var d = af.exports, vf = { exports: {} }, st = {}, yf = { exports: {} }, _f = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(t) {
  function e(N, L) {
    var R = N.length;
    N.push(L);
    e: for (; 0 < R; ) {
      var D = R - 1 >>> 1, F = N[D];
      if (0 < i(F, L)) N[D] = L, N[R] = F, R = D;
      else break e;
    }
  }
  function n(N) {
    return N.length === 0 ? null : N[0];
  }
  function r(N) {
    if (N.length === 0) return null;
    var L = N[0], R = N.pop();
    if (R !== L) {
      N[0] = R;
      e: for (var D = 0, F = N.length, te = F >>> 1; D < te; ) {
        var z = 2 * (D + 1) - 1, oe = N[z], ve = z + 1, be = N[ve];
        if (0 > i(oe, R)) ve < F && 0 > i(be, oe) ? (N[D] = be, N[ve] = R, D = ve) : (N[D] = oe, N[z] = R, D = z);
        else if (ve < F && 0 > i(be, R)) N[D] = be, N[ve] = R, D = ve;
        else break e;
      }
    }
    return L;
  }
  function i(N, L) {
    var R = N.sortIndex - L.sortIndex;
    return R !== 0 ? R : N.id - L.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    t.unstable_now = function() {
      return s.now();
    };
  } else {
    var a = Date, l = a.now();
    t.unstable_now = function() {
      return a.now() - l;
    };
  }
  var o = [], u = [], c = 1, f = null, p = 3, y = !1, _ = !1, g = !1, x = typeof setTimeout == "function" ? setTimeout : null, m = typeof clearTimeout == "function" ? clearTimeout : null, h = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function v(N) {
    for (var L = n(u); L !== null; ) {
      if (L.callback === null) r(u);
      else if (L.startTime <= N) r(u), L.sortIndex = L.expirationTime, e(o, L);
      else break;
      L = n(u);
    }
  }
  function w(N) {
    if (g = !1, v(N), !_) if (n(o) !== null) _ = !0, A(S);
    else {
      var L = n(u);
      L !== null && M(w, L.startTime - N);
    }
  }
  function S(N, L) {
    _ = !1, g && (g = !1, m(C), C = -1), y = !0;
    var R = p;
    try {
      for (v(L), f = n(o); f !== null && (!(f.expirationTime > L) || N && !O()); ) {
        var D = f.callback;
        if (typeof D == "function") {
          f.callback = null, p = f.priorityLevel;
          var F = D(f.expirationTime <= L);
          L = t.unstable_now(), typeof F == "function" ? f.callback = F : f === n(o) && r(o), v(L);
        } else r(o);
        f = n(o);
      }
      if (f !== null) var te = !0;
      else {
        var z = n(u);
        z !== null && M(w, z.startTime - L), te = !1;
      }
      return te;
    } finally {
      f = null, p = R, y = !1;
    }
  }
  var E = !1, k = null, C = -1, T = 5, b = -1;
  function O() {
    return !(t.unstable_now() - b < T);
  }
  function U() {
    if (k !== null) {
      var N = t.unstable_now();
      b = N;
      var L = !0;
      try {
        L = k(!0, N);
      } finally {
        L ? H() : (E = !1, k = null);
      }
    } else E = !1;
  }
  var H;
  if (typeof h == "function") H = function() {
    h(U);
  };
  else if (typeof MessageChannel < "u") {
    var J = new MessageChannel(), W = J.port2;
    J.port1.onmessage = U, H = function() {
      W.postMessage(null);
    };
  } else H = function() {
    x(U, 0);
  };
  function A(N) {
    k = N, E || (E = !0, H());
  }
  function M(N, L) {
    C = x(function() {
      N(t.unstable_now());
    }, L);
  }
  t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function(N) {
    N.callback = null;
  }, t.unstable_continueExecution = function() {
    _ || y || (_ = !0, A(S));
  }, t.unstable_forceFrameRate = function(N) {
    0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : T = 0 < N ? Math.floor(1e3 / N) : 5;
  }, t.unstable_getCurrentPriorityLevel = function() {
    return p;
  }, t.unstable_getFirstCallbackNode = function() {
    return n(o);
  }, t.unstable_next = function(N) {
    switch (p) {
      case 1:
      case 2:
      case 3:
        var L = 3;
        break;
      default:
        L = p;
    }
    var R = p;
    p = L;
    try {
      return N();
    } finally {
      p = R;
    }
  }, t.unstable_pauseExecution = function() {
  }, t.unstable_requestPaint = function() {
  }, t.unstable_runWithPriority = function(N, L) {
    switch (N) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        N = 3;
    }
    var R = p;
    p = N;
    try {
      return L();
    } finally {
      p = R;
    }
  }, t.unstable_scheduleCallback = function(N, L, R) {
    var D = t.unstable_now();
    switch (typeof R == "object" && R !== null ? (R = R.delay, R = typeof R == "number" && 0 < R ? D + R : D) : R = D, N) {
      case 1:
        var F = -1;
        break;
      case 2:
        F = 250;
        break;
      case 5:
        F = 1073741823;
        break;
      case 4:
        F = 1e4;
        break;
      default:
        F = 5e3;
    }
    return F = R + F, N = { id: c++, callback: L, priorityLevel: N, startTime: R, expirationTime: F, sortIndex: -1 }, R > D ? (N.sortIndex = R, e(u, N), n(o) === null && N === n(u) && (g ? (m(C), C = -1) : g = !0, M(w, R - D))) : (N.sortIndex = F, e(o, N), _ || y || (_ = !0, A(S))), N;
  }, t.unstable_shouldYield = O, t.unstable_wrapCallback = function(N) {
    var L = p;
    return function() {
      var R = p;
      p = L;
      try {
        return N.apply(this, arguments);
      } finally {
        p = R;
      }
    };
  };
})(_f);
yf.exports = _f;
var yg = yf.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _g = P, nt = yg;
function j(t) {
  for (var e = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, n = 1; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var wf = /* @__PURE__ */ new Set(), yi = {};
function qn(t, e) {
  Nr(t, e), Nr(t + "Capture", e);
}
function Nr(t, e) {
  for (yi[t] = e, t = 0; t < e.length; t++) wf.add(e[t]);
}
var Ft = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Pl = Object.prototype.hasOwnProperty, wg = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, pc = {}, mc = {};
function Sg(t) {
  return Pl.call(mc, t) ? !0 : Pl.call(pc, t) ? !1 : wg.test(t) ? mc[t] = !0 : (pc[t] = !0, !1);
}
function xg(t, e, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof e) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (t = t.toLowerCase().slice(0, 5), t !== "data-" && t !== "aria-");
    default:
      return !1;
  }
}
function kg(t, e, n, r) {
  if (e === null || typeof e > "u" || xg(t, e, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !e;
    case 4:
      return e === !1;
    case 5:
      return isNaN(e);
    case 6:
      return isNaN(e) || 1 > e;
  }
  return !1;
}
function Oe(t, e, n, r, i, s, a) {
  this.acceptsBooleans = e === 2 || e === 3 || e === 4, this.attributeName = r, this.attributeNamespace = i, this.mustUseProperty = n, this.propertyName = t, this.type = e, this.sanitizeURL = s, this.removeEmptyString = a;
}
var Ee = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t) {
  Ee[t] = new Oe(t, 0, !1, t, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(t) {
  var e = t[0];
  Ee[e] = new Oe(e, 1, !1, t[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(t) {
  Ee[t] = new Oe(t, 2, !1, t.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(t) {
  Ee[t] = new Oe(t, 2, !1, t, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t) {
  Ee[t] = new Oe(t, 3, !1, t.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(t) {
  Ee[t] = new Oe(t, 3, !0, t, null, !1, !1);
});
["capture", "download"].forEach(function(t) {
  Ee[t] = new Oe(t, 4, !1, t, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(t) {
  Ee[t] = new Oe(t, 6, !1, t, null, !1, !1);
});
["rowSpan", "start"].forEach(function(t) {
  Ee[t] = new Oe(t, 5, !1, t.toLowerCase(), null, !1, !1);
});
var Ko = /[\-:]([a-z])/g;
function Yo(t) {
  return t[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t) {
  var e = t.replace(
    Ko,
    Yo
  );
  Ee[e] = new Oe(e, 1, !1, t, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t) {
  var e = t.replace(Ko, Yo);
  Ee[e] = new Oe(e, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(t) {
  var e = t.replace(Ko, Yo);
  Ee[e] = new Oe(e, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(t) {
  Ee[t] = new Oe(t, 1, !1, t.toLowerCase(), null, !1, !1);
});
Ee.xlinkHref = new Oe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(t) {
  Ee[t] = new Oe(t, 1, !1, t.toLowerCase(), null, !0, !0);
});
function Qo(t, e, n, r) {
  var i = Ee.hasOwnProperty(e) ? Ee[e] : null;
  (i !== null ? i.type !== 0 : r || !(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (kg(e, n, i, r) && (n = null), r || i === null ? Sg(e) && (n === null ? t.removeAttribute(e) : t.setAttribute(e, "" + n)) : i.mustUseProperty ? t[i.propertyName] = n === null ? i.type === 3 ? !1 : "" : n : (e = i.attributeName, r = i.attributeNamespace, n === null ? t.removeAttribute(e) : (i = i.type, n = i === 3 || i === 4 && n === !0 ? "" : "" + n, r ? t.setAttributeNS(r, e, n) : t.setAttribute(e, n))));
}
var Wt = _g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Zi = Symbol.for("react.element"), ir = Symbol.for("react.portal"), sr = Symbol.for("react.fragment"), qo = Symbol.for("react.strict_mode"), Al = Symbol.for("react.profiler"), Sf = Symbol.for("react.provider"), xf = Symbol.for("react.context"), Xo = Symbol.for("react.forward_ref"), bl = Symbol.for("react.suspense"), Ll = Symbol.for("react.suspense_list"), Jo = Symbol.for("react.memo"), Kt = Symbol.for("react.lazy"), kf = Symbol.for("react.offscreen"), gc = Symbol.iterator;
function Wr(t) {
  return t === null || typeof t != "object" ? null : (t = gc && t[gc] || t["@@iterator"], typeof t == "function" ? t : null);
}
var le = Object.assign, Ba;
function ei(t) {
  if (Ba === void 0) try {
    throw Error();
  } catch (n) {
    var e = n.stack.trim().match(/\n( *(at )?)/);
    Ba = e && e[1] || "";
  }
  return `
` + Ba + t;
}
var Ua = !1;
function Ha(t, e) {
  if (!t || Ua) return "";
  Ua = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (e) if (e = function() {
      throw Error();
    }, Object.defineProperty(e.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(e, []);
      } catch (u) {
        var r = u;
      }
      Reflect.construct(t, [], e);
    } else {
      try {
        e.call();
      } catch (u) {
        r = u;
      }
      t.call(e.prototype);
    }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      t();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (var i = u.stack.split(`
`), s = r.stack.split(`
`), a = i.length - 1, l = s.length - 1; 1 <= a && 0 <= l && i[a] !== s[l]; ) l--;
      for (; 1 <= a && 0 <= l; a--, l--) if (i[a] !== s[l]) {
        if (a !== 1 || l !== 1)
          do
            if (a--, l--, 0 > l || i[a] !== s[l]) {
              var o = `
` + i[a].replace(" at new ", " at ");
              return t.displayName && o.includes("<anonymous>") && (o = o.replace("<anonymous>", t.displayName)), o;
            }
          while (1 <= a && 0 <= l);
        break;
      }
    }
  } finally {
    Ua = !1, Error.prepareStackTrace = n;
  }
  return (t = t ? t.displayName || t.name : "") ? ei(t) : "";
}
function Eg(t) {
  switch (t.tag) {
    case 5:
      return ei(t.type);
    case 16:
      return ei("Lazy");
    case 13:
      return ei("Suspense");
    case 19:
      return ei("SuspenseList");
    case 0:
    case 2:
    case 15:
      return t = Ha(t.type, !1), t;
    case 11:
      return t = Ha(t.type.render, !1), t;
    case 1:
      return t = Ha(t.type, !0), t;
    default:
      return "";
  }
}
function Il(t) {
  if (t == null) return null;
  if (typeof t == "function") return t.displayName || t.name || null;
  if (typeof t == "string") return t;
  switch (t) {
    case sr:
      return "Fragment";
    case ir:
      return "Portal";
    case Al:
      return "Profiler";
    case qo:
      return "StrictMode";
    case bl:
      return "Suspense";
    case Ll:
      return "SuspenseList";
  }
  if (typeof t == "object") switch (t.$$typeof) {
    case xf:
      return (t.displayName || "Context") + ".Consumer";
    case Sf:
      return (t._context.displayName || "Context") + ".Provider";
    case Xo:
      var e = t.render;
      return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
    case Jo:
      return e = t.displayName || null, e !== null ? e : Il(t.type) || "Memo";
    case Kt:
      e = t._payload, t = t._init;
      try {
        return Il(t(e));
      } catch {
      }
  }
  return null;
}
function Cg(t) {
  var e = t.type;
  switch (t.tag) {
    case 24:
      return "Cache";
    case 9:
      return (e.displayName || "Context") + ".Consumer";
    case 10:
      return (e._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return t = e.render, t = t.displayName || t.name || "", e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return e;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Il(e);
    case 8:
      return e === qo ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof e == "function") return e.displayName || e.name || null;
      if (typeof e == "string") return e;
  }
  return null;
}
function gn(t) {
  switch (typeof t) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return t;
    case "object":
      return t;
    default:
      return "";
  }
}
function Ef(t) {
  var e = t.type;
  return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
}
function Tg(t) {
  var e = Ef(t) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e), r = "" + t[e];
  if (!t.hasOwnProperty(e) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var i = n.get, s = n.set;
    return Object.defineProperty(t, e, { configurable: !0, get: function() {
      return i.call(this);
    }, set: function(a) {
      r = "" + a, s.call(this, a);
    } }), Object.defineProperty(t, e, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(a) {
      r = "" + a;
    }, stopTracking: function() {
      t._valueTracker = null, delete t[e];
    } };
  }
}
function es(t) {
  t._valueTracker || (t._valueTracker = Tg(t));
}
function Cf(t) {
  if (!t) return !1;
  var e = t._valueTracker;
  if (!e) return !0;
  var n = e.getValue(), r = "";
  return t && (r = Ef(t) ? t.checked ? "true" : "false" : t.value), t = r, t !== n ? (e.setValue(t), !0) : !1;
}
function Is(t) {
  if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
  try {
    return t.activeElement || t.body;
  } catch {
    return t.body;
  }
}
function Rl(t, e) {
  var n = e.checked;
  return le({}, e, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? t._wrapperState.initialChecked });
}
function vc(t, e) {
  var n = e.defaultValue == null ? "" : e.defaultValue, r = e.checked != null ? e.checked : e.defaultChecked;
  n = gn(e.value != null ? e.value : n), t._wrapperState = { initialChecked: r, initialValue: n, controlled: e.type === "checkbox" || e.type === "radio" ? e.checked != null : e.value != null };
}
function Tf(t, e) {
  e = e.checked, e != null && Qo(t, "checked", e, !1);
}
function Ml(t, e) {
  Tf(t, e);
  var n = gn(e.value), r = e.type;
  if (n != null) r === "number" ? (n === 0 && t.value === "" || t.value != n) && (t.value = "" + n) : t.value !== "" + n && (t.value = "" + n);
  else if (r === "submit" || r === "reset") {
    t.removeAttribute("value");
    return;
  }
  e.hasOwnProperty("value") ? Ol(t, e.type, n) : e.hasOwnProperty("defaultValue") && Ol(t, e.type, gn(e.defaultValue)), e.checked == null && e.defaultChecked != null && (t.defaultChecked = !!e.defaultChecked);
}
function yc(t, e, n) {
  if (e.hasOwnProperty("value") || e.hasOwnProperty("defaultValue")) {
    var r = e.type;
    if (!(r !== "submit" && r !== "reset" || e.value !== void 0 && e.value !== null)) return;
    e = "" + t._wrapperState.initialValue, n || e === t.value || (t.value = e), t.defaultValue = e;
  }
  n = t.name, n !== "" && (t.name = ""), t.defaultChecked = !!t._wrapperState.initialChecked, n !== "" && (t.name = n);
}
function Ol(t, e, n) {
  (e !== "number" || Is(t.ownerDocument) !== t) && (n == null ? t.defaultValue = "" + t._wrapperState.initialValue : t.defaultValue !== "" + n && (t.defaultValue = "" + n));
}
var ti = Array.isArray;
function yr(t, e, n, r) {
  if (t = t.options, e) {
    e = {};
    for (var i = 0; i < n.length; i++) e["$" + n[i]] = !0;
    for (n = 0; n < t.length; n++) i = e.hasOwnProperty("$" + t[n].value), t[n].selected !== i && (t[n].selected = i), i && r && (t[n].defaultSelected = !0);
  } else {
    for (n = "" + gn(n), e = null, i = 0; i < t.length; i++) {
      if (t[i].value === n) {
        t[i].selected = !0, r && (t[i].defaultSelected = !0);
        return;
      }
      e !== null || t[i].disabled || (e = t[i]);
    }
    e !== null && (e.selected = !0);
  }
}
function Dl(t, e) {
  if (e.dangerouslySetInnerHTML != null) throw Error(j(91));
  return le({}, e, { value: void 0, defaultValue: void 0, children: "" + t._wrapperState.initialValue });
}
function _c(t, e) {
  var n = e.value;
  if (n == null) {
    if (n = e.children, e = e.defaultValue, n != null) {
      if (e != null) throw Error(j(92));
      if (ti(n)) {
        if (1 < n.length) throw Error(j(93));
        n = n[0];
      }
      e = n;
    }
    e == null && (e = ""), n = e;
  }
  t._wrapperState = { initialValue: gn(n) };
}
function Nf(t, e) {
  var n = gn(e.value), r = gn(e.defaultValue);
  n != null && (n = "" + n, n !== t.value && (t.value = n), e.defaultValue == null && t.defaultValue !== n && (t.defaultValue = n)), r != null && (t.defaultValue = "" + r);
}
function wc(t) {
  var e = t.textContent;
  e === t._wrapperState.initialValue && e !== "" && e !== null && (t.value = e);
}
function jf(t) {
  switch (t) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function zl(t, e) {
  return t == null || t === "http://www.w3.org/1999/xhtml" ? jf(e) : t === "http://www.w3.org/2000/svg" && e === "foreignObject" ? "http://www.w3.org/1999/xhtml" : t;
}
var ts, Pf = function(t) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(e, n, r, i) {
    MSApp.execUnsafeLocalFunction(function() {
      return t(e, n, r, i);
    });
  } : t;
}(function(t, e) {
  if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t) t.innerHTML = e;
  else {
    for (ts = ts || document.createElement("div"), ts.innerHTML = "<svg>" + e.valueOf().toString() + "</svg>", e = ts.firstChild; t.firstChild; ) t.removeChild(t.firstChild);
    for (; e.firstChild; ) t.appendChild(e.firstChild);
  }
});
function _i(t, e) {
  if (e) {
    var n = t.firstChild;
    if (n && n === t.lastChild && n.nodeType === 3) {
      n.nodeValue = e;
      return;
    }
  }
  t.textContent = e;
}
var ai = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, Ng = ["Webkit", "ms", "Moz", "O"];
Object.keys(ai).forEach(function(t) {
  Ng.forEach(function(e) {
    e = e + t.charAt(0).toUpperCase() + t.substring(1), ai[e] = ai[t];
  });
});
function Af(t, e, n) {
  return e == null || typeof e == "boolean" || e === "" ? "" : n || typeof e != "number" || e === 0 || ai.hasOwnProperty(t) && ai[t] ? ("" + e).trim() : e + "px";
}
function bf(t, e) {
  t = t.style;
  for (var n in e) if (e.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, i = Af(n, e[n], r);
    n === "float" && (n = "cssFloat"), r ? t.setProperty(n, i) : t[n] = i;
  }
}
var jg = le({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function Fl(t, e) {
  if (e) {
    if (jg[t] && (e.children != null || e.dangerouslySetInnerHTML != null)) throw Error(j(137, t));
    if (e.dangerouslySetInnerHTML != null) {
      if (e.children != null) throw Error(j(60));
      if (typeof e.dangerouslySetInnerHTML != "object" || !("__html" in e.dangerouslySetInnerHTML)) throw Error(j(61));
    }
    if (e.style != null && typeof e.style != "object") throw Error(j(62));
  }
}
function Bl(t, e) {
  if (t.indexOf("-") === -1) return typeof e.is == "string";
  switch (t) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Ul = null;
function Zo(t) {
  return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
}
var Hl = null, _r = null, wr = null;
function Sc(t) {
  if (t = Ki(t)) {
    if (typeof Hl != "function") throw Error(j(280));
    var e = t.stateNode;
    e && (e = wa(e), Hl(t.stateNode, t.type, e));
  }
}
function Lf(t) {
  _r ? wr ? wr.push(t) : wr = [t] : _r = t;
}
function If() {
  if (_r) {
    var t = _r, e = wr;
    if (wr = _r = null, Sc(t), e) for (t = 0; t < e.length; t++) Sc(e[t]);
  }
}
function Rf(t, e) {
  return t(e);
}
function Mf() {
}
var Va = !1;
function Of(t, e, n) {
  if (Va) return t(e, n);
  Va = !0;
  try {
    return Rf(t, e, n);
  } finally {
    Va = !1, (_r !== null || wr !== null) && (Mf(), If());
  }
}
function wi(t, e) {
  var n = t.stateNode;
  if (n === null) return null;
  var r = wa(n);
  if (r === null) return null;
  n = r[e];
  e: switch (e) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (t = t.type, r = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !r;
      break e;
    default:
      t = !1;
  }
  if (t) return null;
  if (n && typeof n != "function") throw Error(j(231, e, typeof n));
  return n;
}
var Vl = !1;
if (Ft) try {
  var Gr = {};
  Object.defineProperty(Gr, "passive", { get: function() {
    Vl = !0;
  } }), window.addEventListener("test", Gr, Gr), window.removeEventListener("test", Gr, Gr);
} catch {
  Vl = !1;
}
function Pg(t, e, n, r, i, s, a, l, o) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    e.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var li = !1, Rs = null, Ms = !1, $l = null, Ag = { onError: function(t) {
  li = !0, Rs = t;
} };
function bg(t, e, n, r, i, s, a, l, o) {
  li = !1, Rs = null, Pg.apply(Ag, arguments);
}
function Lg(t, e, n, r, i, s, a, l, o) {
  if (bg.apply(this, arguments), li) {
    if (li) {
      var u = Rs;
      li = !1, Rs = null;
    } else throw Error(j(198));
    Ms || (Ms = !0, $l = u);
  }
}
function Xn(t) {
  var e = t, n = t;
  if (t.alternate) for (; e.return; ) e = e.return;
  else {
    t = e;
    do
      e = t, e.flags & 4098 && (n = e.return), t = e.return;
    while (t);
  }
  return e.tag === 3 ? n : null;
}
function Df(t) {
  if (t.tag === 13) {
    var e = t.memoizedState;
    if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
  }
  return null;
}
function xc(t) {
  if (Xn(t) !== t) throw Error(j(188));
}
function Ig(t) {
  var e = t.alternate;
  if (!e) {
    if (e = Xn(t), e === null) throw Error(j(188));
    return e !== t ? null : t;
  }
  for (var n = t, r = e; ; ) {
    var i = n.return;
    if (i === null) break;
    var s = i.alternate;
    if (s === null) {
      if (r = i.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === s.child) {
      for (s = i.child; s; ) {
        if (s === n) return xc(i), t;
        if (s === r) return xc(i), e;
        s = s.sibling;
      }
      throw Error(j(188));
    }
    if (n.return !== r.return) n = i, r = s;
    else {
      for (var a = !1, l = i.child; l; ) {
        if (l === n) {
          a = !0, n = i, r = s;
          break;
        }
        if (l === r) {
          a = !0, r = i, n = s;
          break;
        }
        l = l.sibling;
      }
      if (!a) {
        for (l = s.child; l; ) {
          if (l === n) {
            a = !0, n = s, r = i;
            break;
          }
          if (l === r) {
            a = !0, r = s, n = i;
            break;
          }
          l = l.sibling;
        }
        if (!a) throw Error(j(189));
      }
    }
    if (n.alternate !== r) throw Error(j(190));
  }
  if (n.tag !== 3) throw Error(j(188));
  return n.stateNode.current === n ? t : e;
}
function zf(t) {
  return t = Ig(t), t !== null ? Ff(t) : null;
}
function Ff(t) {
  if (t.tag === 5 || t.tag === 6) return t;
  for (t = t.child; t !== null; ) {
    var e = Ff(t);
    if (e !== null) return e;
    t = t.sibling;
  }
  return null;
}
var Bf = nt.unstable_scheduleCallback, kc = nt.unstable_cancelCallback, Rg = nt.unstable_shouldYield, Mg = nt.unstable_requestPaint, fe = nt.unstable_now, Og = nt.unstable_getCurrentPriorityLevel, eu = nt.unstable_ImmediatePriority, Uf = nt.unstable_UserBlockingPriority, Os = nt.unstable_NormalPriority, Dg = nt.unstable_LowPriority, Hf = nt.unstable_IdlePriority, ga = null, Pt = null;
function zg(t) {
  if (Pt && typeof Pt.onCommitFiberRoot == "function") try {
    Pt.onCommitFiberRoot(ga, t, void 0, (t.current.flags & 128) === 128);
  } catch {
  }
}
var wt = Math.clz32 ? Math.clz32 : Ug, Fg = Math.log, Bg = Math.LN2;
function Ug(t) {
  return t >>>= 0, t === 0 ? 32 : 31 - (Fg(t) / Bg | 0) | 0;
}
var ns = 64, rs = 4194304;
function ni(t) {
  switch (t & -t) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return t & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return t;
  }
}
function Ds(t, e) {
  var n = t.pendingLanes;
  if (n === 0) return 0;
  var r = 0, i = t.suspendedLanes, s = t.pingedLanes, a = n & 268435455;
  if (a !== 0) {
    var l = a & ~i;
    l !== 0 ? r = ni(l) : (s &= a, s !== 0 && (r = ni(s)));
  } else a = n & ~i, a !== 0 ? r = ni(a) : s !== 0 && (r = ni(s));
  if (r === 0) return 0;
  if (e !== 0 && e !== r && !(e & i) && (i = r & -r, s = e & -e, i >= s || i === 16 && (s & 4194240) !== 0)) return e;
  if (r & 4 && (r |= n & 16), e = t.entangledLanes, e !== 0) for (t = t.entanglements, e &= r; 0 < e; ) n = 31 - wt(e), i = 1 << n, r |= t[n], e &= ~i;
  return r;
}
function Hg(t, e) {
  switch (t) {
    case 1:
    case 2:
    case 4:
      return e + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Vg(t, e) {
  for (var n = t.suspendedLanes, r = t.pingedLanes, i = t.expirationTimes, s = t.pendingLanes; 0 < s; ) {
    var a = 31 - wt(s), l = 1 << a, o = i[a];
    o === -1 ? (!(l & n) || l & r) && (i[a] = Hg(l, e)) : o <= e && (t.expiredLanes |= l), s &= ~l;
  }
}
function Wl(t) {
  return t = t.pendingLanes & -1073741825, t !== 0 ? t : t & 1073741824 ? 1073741824 : 0;
}
function Vf() {
  var t = ns;
  return ns <<= 1, !(ns & 4194240) && (ns = 64), t;
}
function $a(t) {
  for (var e = [], n = 0; 31 > n; n++) e.push(t);
  return e;
}
function Wi(t, e, n) {
  t.pendingLanes |= e, e !== 536870912 && (t.suspendedLanes = 0, t.pingedLanes = 0), t = t.eventTimes, e = 31 - wt(e), t[e] = n;
}
function $g(t, e) {
  var n = t.pendingLanes & ~e;
  t.pendingLanes = e, t.suspendedLanes = 0, t.pingedLanes = 0, t.expiredLanes &= e, t.mutableReadLanes &= e, t.entangledLanes &= e, e = t.entanglements;
  var r = t.eventTimes;
  for (t = t.expirationTimes; 0 < n; ) {
    var i = 31 - wt(n), s = 1 << i;
    e[i] = 0, r[i] = -1, t[i] = -1, n &= ~s;
  }
}
function tu(t, e) {
  var n = t.entangledLanes |= e;
  for (t = t.entanglements; n; ) {
    var r = 31 - wt(n), i = 1 << r;
    i & e | t[r] & e && (t[r] |= e), n &= ~i;
  }
}
var G = 0;
function $f(t) {
  return t &= -t, 1 < t ? 4 < t ? t & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Wf, nu, Gf, Kf, Yf, Gl = !1, is = [], an = null, ln = null, on = null, Si = /* @__PURE__ */ new Map(), xi = /* @__PURE__ */ new Map(), Xt = [], Wg = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Ec(t, e) {
  switch (t) {
    case "focusin":
    case "focusout":
      an = null;
      break;
    case "dragenter":
    case "dragleave":
      ln = null;
      break;
    case "mouseover":
    case "mouseout":
      on = null;
      break;
    case "pointerover":
    case "pointerout":
      Si.delete(e.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      xi.delete(e.pointerId);
  }
}
function Kr(t, e, n, r, i, s) {
  return t === null || t.nativeEvent !== s ? (t = { blockedOn: e, domEventName: n, eventSystemFlags: r, nativeEvent: s, targetContainers: [i] }, e !== null && (e = Ki(e), e !== null && nu(e)), t) : (t.eventSystemFlags |= r, e = t.targetContainers, i !== null && e.indexOf(i) === -1 && e.push(i), t);
}
function Gg(t, e, n, r, i) {
  switch (e) {
    case "focusin":
      return an = Kr(an, t, e, n, r, i), !0;
    case "dragenter":
      return ln = Kr(ln, t, e, n, r, i), !0;
    case "mouseover":
      return on = Kr(on, t, e, n, r, i), !0;
    case "pointerover":
      var s = i.pointerId;
      return Si.set(s, Kr(Si.get(s) || null, t, e, n, r, i)), !0;
    case "gotpointercapture":
      return s = i.pointerId, xi.set(s, Kr(xi.get(s) || null, t, e, n, r, i)), !0;
  }
  return !1;
}
function Qf(t) {
  var e = Rn(t.target);
  if (e !== null) {
    var n = Xn(e);
    if (n !== null) {
      if (e = n.tag, e === 13) {
        if (e = Df(n), e !== null) {
          t.blockedOn = e, Yf(t.priority, function() {
            Gf(n);
          });
          return;
        }
      } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  t.blockedOn = null;
}
function ws(t) {
  if (t.blockedOn !== null) return !1;
  for (var e = t.targetContainers; 0 < e.length; ) {
    var n = Kl(t.domEventName, t.eventSystemFlags, e[0], t.nativeEvent);
    if (n === null) {
      n = t.nativeEvent;
      var r = new n.constructor(n.type, n);
      Ul = r, n.target.dispatchEvent(r), Ul = null;
    } else return e = Ki(n), e !== null && nu(e), t.blockedOn = n, !1;
    e.shift();
  }
  return !0;
}
function Cc(t, e, n) {
  ws(t) && n.delete(e);
}
function Kg() {
  Gl = !1, an !== null && ws(an) && (an = null), ln !== null && ws(ln) && (ln = null), on !== null && ws(on) && (on = null), Si.forEach(Cc), xi.forEach(Cc);
}
function Yr(t, e) {
  t.blockedOn === e && (t.blockedOn = null, Gl || (Gl = !0, nt.unstable_scheduleCallback(nt.unstable_NormalPriority, Kg)));
}
function ki(t) {
  function e(i) {
    return Yr(i, t);
  }
  if (0 < is.length) {
    Yr(is[0], t);
    for (var n = 1; n < is.length; n++) {
      var r = is[n];
      r.blockedOn === t && (r.blockedOn = null);
    }
  }
  for (an !== null && Yr(an, t), ln !== null && Yr(ln, t), on !== null && Yr(on, t), Si.forEach(e), xi.forEach(e), n = 0; n < Xt.length; n++) r = Xt[n], r.blockedOn === t && (r.blockedOn = null);
  for (; 0 < Xt.length && (n = Xt[0], n.blockedOn === null); ) Qf(n), n.blockedOn === null && Xt.shift();
}
var Sr = Wt.ReactCurrentBatchConfig, zs = !0;
function Yg(t, e, n, r) {
  var i = G, s = Sr.transition;
  Sr.transition = null;
  try {
    G = 1, ru(t, e, n, r);
  } finally {
    G = i, Sr.transition = s;
  }
}
function Qg(t, e, n, r) {
  var i = G, s = Sr.transition;
  Sr.transition = null;
  try {
    G = 4, ru(t, e, n, r);
  } finally {
    G = i, Sr.transition = s;
  }
}
function ru(t, e, n, r) {
  if (zs) {
    var i = Kl(t, e, n, r);
    if (i === null) el(t, e, r, Fs, n), Ec(t, r);
    else if (Gg(i, t, e, n, r)) r.stopPropagation();
    else if (Ec(t, r), e & 4 && -1 < Wg.indexOf(t)) {
      for (; i !== null; ) {
        var s = Ki(i);
        if (s !== null && Wf(s), s = Kl(t, e, n, r), s === null && el(t, e, r, Fs, n), s === i) break;
        i = s;
      }
      i !== null && r.stopPropagation();
    } else el(t, e, r, null, n);
  }
}
var Fs = null;
function Kl(t, e, n, r) {
  if (Fs = null, t = Zo(r), t = Rn(t), t !== null) if (e = Xn(t), e === null) t = null;
  else if (n = e.tag, n === 13) {
    if (t = Df(e), t !== null) return t;
    t = null;
  } else if (n === 3) {
    if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
    t = null;
  } else e !== t && (t = null);
  return Fs = t, null;
}
function qf(t) {
  switch (t) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Og()) {
        case eu:
          return 1;
        case Uf:
          return 4;
        case Os:
        case Dg:
          return 16;
        case Hf:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Zt = null, iu = null, Ss = null;
function Xf() {
  if (Ss) return Ss;
  var t, e = iu, n = e.length, r, i = "value" in Zt ? Zt.value : Zt.textContent, s = i.length;
  for (t = 0; t < n && e[t] === i[t]; t++) ;
  var a = n - t;
  for (r = 1; r <= a && e[n - r] === i[s - r]; r++) ;
  return Ss = i.slice(t, 1 < r ? 1 - r : void 0);
}
function xs(t) {
  var e = t.keyCode;
  return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
}
function ss() {
  return !0;
}
function Tc() {
  return !1;
}
function at(t) {
  function e(n, r, i, s, a) {
    this._reactName = n, this._targetInst = i, this.type = r, this.nativeEvent = s, this.target = a, this.currentTarget = null;
    for (var l in t) t.hasOwnProperty(l) && (n = t[l], this[l] = n ? n(s) : s[l]);
    return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? ss : Tc, this.isPropagationStopped = Tc, this;
  }
  return le(e.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = ss);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = ss);
  }, persist: function() {
  }, isPersistent: ss }), e;
}
var Hr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(t) {
  return t.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, su = at(Hr), Gi = le({}, Hr, { view: 0, detail: 0 }), qg = at(Gi), Wa, Ga, Qr, va = le({}, Gi, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: au, button: 0, buttons: 0, relatedTarget: function(t) {
  return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
}, movementX: function(t) {
  return "movementX" in t ? t.movementX : (t !== Qr && (Qr && t.type === "mousemove" ? (Wa = t.screenX - Qr.screenX, Ga = t.screenY - Qr.screenY) : Ga = Wa = 0, Qr = t), Wa);
}, movementY: function(t) {
  return "movementY" in t ? t.movementY : Ga;
} }), Nc = at(va), Xg = le({}, va, { dataTransfer: 0 }), Jg = at(Xg), Zg = le({}, Gi, { relatedTarget: 0 }), Ka = at(Zg), ev = le({}, Hr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), tv = at(ev), nv = le({}, Hr, { clipboardData: function(t) {
  return "clipboardData" in t ? t.clipboardData : window.clipboardData;
} }), rv = at(nv), iv = le({}, Hr, { data: 0 }), jc = at(iv), sv = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, av = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, lv = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function ov(t) {
  var e = this.nativeEvent;
  return e.getModifierState ? e.getModifierState(t) : (t = lv[t]) ? !!e[t] : !1;
}
function au() {
  return ov;
}
var uv = le({}, Gi, { key: function(t) {
  if (t.key) {
    var e = sv[t.key] || t.key;
    if (e !== "Unidentified") return e;
  }
  return t.type === "keypress" ? (t = xs(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? av[t.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: au, charCode: function(t) {
  return t.type === "keypress" ? xs(t) : 0;
}, keyCode: function(t) {
  return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
}, which: function(t) {
  return t.type === "keypress" ? xs(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
} }), cv = at(uv), dv = le({}, va, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Pc = at(dv), fv = le({}, Gi, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: au }), hv = at(fv), pv = le({}, Hr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), mv = at(pv), gv = le({}, va, {
  deltaX: function(t) {
    return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
  },
  deltaY: function(t) {
    return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), vv = at(gv), yv = [9, 13, 27, 32], lu = Ft && "CompositionEvent" in window, oi = null;
Ft && "documentMode" in document && (oi = document.documentMode);
var _v = Ft && "TextEvent" in window && !oi, Jf = Ft && (!lu || oi && 8 < oi && 11 >= oi), Ac = " ", bc = !1;
function Zf(t, e) {
  switch (t) {
    case "keyup":
      return yv.indexOf(e.keyCode) !== -1;
    case "keydown":
      return e.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function eh(t) {
  return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
}
var ar = !1;
function wv(t, e) {
  switch (t) {
    case "compositionend":
      return eh(e);
    case "keypress":
      return e.which !== 32 ? null : (bc = !0, Ac);
    case "textInput":
      return t = e.data, t === Ac && bc ? null : t;
    default:
      return null;
  }
}
function Sv(t, e) {
  if (ar) return t === "compositionend" || !lu && Zf(t, e) ? (t = Xf(), Ss = iu = Zt = null, ar = !1, t) : null;
  switch (t) {
    case "paste":
      return null;
    case "keypress":
      if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
        if (e.char && 1 < e.char.length) return e.char;
        if (e.which) return String.fromCharCode(e.which);
      }
      return null;
    case "compositionend":
      return Jf && e.locale !== "ko" ? null : e.data;
    default:
      return null;
  }
}
var xv = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function Lc(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e === "input" ? !!xv[t.type] : e === "textarea";
}
function th(t, e, n, r) {
  Lf(r), e = Bs(e, "onChange"), 0 < e.length && (n = new su("onChange", "change", null, n, r), t.push({ event: n, listeners: e }));
}
var ui = null, Ei = null;
function kv(t) {
  fh(t, 0);
}
function ya(t) {
  var e = ur(t);
  if (Cf(e)) return t;
}
function Ev(t, e) {
  if (t === "change") return e;
}
var nh = !1;
if (Ft) {
  var Ya;
  if (Ft) {
    var Qa = "oninput" in document;
    if (!Qa) {
      var Ic = document.createElement("div");
      Ic.setAttribute("oninput", "return;"), Qa = typeof Ic.oninput == "function";
    }
    Ya = Qa;
  } else Ya = !1;
  nh = Ya && (!document.documentMode || 9 < document.documentMode);
}
function Rc() {
  ui && (ui.detachEvent("onpropertychange", rh), Ei = ui = null);
}
function rh(t) {
  if (t.propertyName === "value" && ya(Ei)) {
    var e = [];
    th(e, Ei, t, Zo(t)), Of(kv, e);
  }
}
function Cv(t, e, n) {
  t === "focusin" ? (Rc(), ui = e, Ei = n, ui.attachEvent("onpropertychange", rh)) : t === "focusout" && Rc();
}
function Tv(t) {
  if (t === "selectionchange" || t === "keyup" || t === "keydown") return ya(Ei);
}
function Nv(t, e) {
  if (t === "click") return ya(e);
}
function jv(t, e) {
  if (t === "input" || t === "change") return ya(e);
}
function Pv(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var xt = typeof Object.is == "function" ? Object.is : Pv;
function Ci(t, e) {
  if (xt(t, e)) return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
  var n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!Pl.call(e, i) || !xt(t[i], e[i])) return !1;
  }
  return !0;
}
function Mc(t) {
  for (; t && t.firstChild; ) t = t.firstChild;
  return t;
}
function Oc(t, e) {
  var n = Mc(t);
  t = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = t + n.textContent.length, t <= e && r >= e) return { node: n, offset: e - t };
      t = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Mc(n);
  }
}
function ih(t, e) {
  return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? ih(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
}
function sh() {
  for (var t = window, e = Is(); e instanceof t.HTMLIFrameElement; ) {
    try {
      var n = typeof e.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) t = e.contentWindow;
    else break;
    e = Is(t.document);
  }
  return e;
}
function ou(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
}
function Av(t) {
  var e = sh(), n = t.focusedElem, r = t.selectionRange;
  if (e !== n && n && n.ownerDocument && ih(n.ownerDocument.documentElement, n)) {
    if (r !== null && ou(n)) {
      if (e = r.start, t = r.end, t === void 0 && (t = e), "selectionStart" in n) n.selectionStart = e, n.selectionEnd = Math.min(t, n.value.length);
      else if (t = (e = n.ownerDocument || document) && e.defaultView || window, t.getSelection) {
        t = t.getSelection();
        var i = n.textContent.length, s = Math.min(r.start, i);
        r = r.end === void 0 ? s : Math.min(r.end, i), !t.extend && s > r && (i = r, r = s, s = i), i = Oc(n, s);
        var a = Oc(
          n,
          r
        );
        i && a && (t.rangeCount !== 1 || t.anchorNode !== i.node || t.anchorOffset !== i.offset || t.focusNode !== a.node || t.focusOffset !== a.offset) && (e = e.createRange(), e.setStart(i.node, i.offset), t.removeAllRanges(), s > r ? (t.addRange(e), t.extend(a.node, a.offset)) : (e.setEnd(a.node, a.offset), t.addRange(e)));
      }
    }
    for (e = [], t = n; t = t.parentNode; ) t.nodeType === 1 && e.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < e.length; n++) t = e[n], t.element.scrollLeft = t.left, t.element.scrollTop = t.top;
  }
}
var bv = Ft && "documentMode" in document && 11 >= document.documentMode, lr = null, Yl = null, ci = null, Ql = !1;
function Dc(t, e, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Ql || lr == null || lr !== Is(r) || (r = lr, "selectionStart" in r && ou(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), ci && Ci(ci, r) || (ci = r, r = Bs(Yl, "onSelect"), 0 < r.length && (e = new su("onSelect", "select", null, e, n), t.push({ event: e, listeners: r }), e.target = lr)));
}
function as(t, e) {
  var n = {};
  return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
}
var or = { animationend: as("Animation", "AnimationEnd"), animationiteration: as("Animation", "AnimationIteration"), animationstart: as("Animation", "AnimationStart"), transitionend: as("Transition", "TransitionEnd") }, qa = {}, ah = {};
Ft && (ah = document.createElement("div").style, "AnimationEvent" in window || (delete or.animationend.animation, delete or.animationiteration.animation, delete or.animationstart.animation), "TransitionEvent" in window || delete or.transitionend.transition);
function _a(t) {
  if (qa[t]) return qa[t];
  if (!or[t]) return t;
  var e = or[t], n;
  for (n in e) if (e.hasOwnProperty(n) && n in ah) return qa[t] = e[n];
  return t;
}
var lh = _a("animationend"), oh = _a("animationiteration"), uh = _a("animationstart"), ch = _a("transitionend"), dh = /* @__PURE__ */ new Map(), zc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Sn(t, e) {
  dh.set(t, e), qn(e, [t]);
}
for (var Xa = 0; Xa < zc.length; Xa++) {
  var Ja = zc[Xa], Lv = Ja.toLowerCase(), Iv = Ja[0].toUpperCase() + Ja.slice(1);
  Sn(Lv, "on" + Iv);
}
Sn(lh, "onAnimationEnd");
Sn(oh, "onAnimationIteration");
Sn(uh, "onAnimationStart");
Sn("dblclick", "onDoubleClick");
Sn("focusin", "onFocus");
Sn("focusout", "onBlur");
Sn(ch, "onTransitionEnd");
Nr("onMouseEnter", ["mouseout", "mouseover"]);
Nr("onMouseLeave", ["mouseout", "mouseover"]);
Nr("onPointerEnter", ["pointerout", "pointerover"]);
Nr("onPointerLeave", ["pointerout", "pointerover"]);
qn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
qn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
qn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
qn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
qn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
qn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var ri = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Rv = new Set("cancel close invalid load scroll toggle".split(" ").concat(ri));
function Fc(t, e, n) {
  var r = t.type || "unknown-event";
  t.currentTarget = n, Lg(r, e, void 0, t), t.currentTarget = null;
}
function fh(t, e) {
  e = (e & 4) !== 0;
  for (var n = 0; n < t.length; n++) {
    var r = t[n], i = r.event;
    r = r.listeners;
    e: {
      var s = void 0;
      if (e) for (var a = r.length - 1; 0 <= a; a--) {
        var l = r[a], o = l.instance, u = l.currentTarget;
        if (l = l.listener, o !== s && i.isPropagationStopped()) break e;
        Fc(i, l, u), s = o;
      }
      else for (a = 0; a < r.length; a++) {
        if (l = r[a], o = l.instance, u = l.currentTarget, l = l.listener, o !== s && i.isPropagationStopped()) break e;
        Fc(i, l, u), s = o;
      }
    }
  }
  if (Ms) throw t = $l, Ms = !1, $l = null, t;
}
function q(t, e) {
  var n = e[eo];
  n === void 0 && (n = e[eo] = /* @__PURE__ */ new Set());
  var r = t + "__bubble";
  n.has(r) || (hh(e, t, 2, !1), n.add(r));
}
function Za(t, e, n) {
  var r = 0;
  e && (r |= 4), hh(n, t, r, e);
}
var ls = "_reactListening" + Math.random().toString(36).slice(2);
function Ti(t) {
  if (!t[ls]) {
    t[ls] = !0, wf.forEach(function(n) {
      n !== "selectionchange" && (Rv.has(n) || Za(n, !1, t), Za(n, !0, t));
    });
    var e = t.nodeType === 9 ? t : t.ownerDocument;
    e === null || e[ls] || (e[ls] = !0, Za("selectionchange", !1, e));
  }
}
function hh(t, e, n, r) {
  switch (qf(e)) {
    case 1:
      var i = Yg;
      break;
    case 4:
      i = Qg;
      break;
    default:
      i = ru;
  }
  n = i.bind(null, e, n, t), i = void 0, !Vl || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (i = !0), r ? i !== void 0 ? t.addEventListener(e, n, { capture: !0, passive: i }) : t.addEventListener(e, n, !0) : i !== void 0 ? t.addEventListener(e, n, { passive: i }) : t.addEventListener(e, n, !1);
}
function el(t, e, n, r, i) {
  var s = r;
  if (!(e & 1) && !(e & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var a = r.tag;
    if (a === 3 || a === 4) {
      var l = r.stateNode.containerInfo;
      if (l === i || l.nodeType === 8 && l.parentNode === i) break;
      if (a === 4) for (a = r.return; a !== null; ) {
        var o = a.tag;
        if ((o === 3 || o === 4) && (o = a.stateNode.containerInfo, o === i || o.nodeType === 8 && o.parentNode === i)) return;
        a = a.return;
      }
      for (; l !== null; ) {
        if (a = Rn(l), a === null) return;
        if (o = a.tag, o === 5 || o === 6) {
          r = s = a;
          continue e;
        }
        l = l.parentNode;
      }
    }
    r = r.return;
  }
  Of(function() {
    var u = s, c = Zo(n), f = [];
    e: {
      var p = dh.get(t);
      if (p !== void 0) {
        var y = su, _ = t;
        switch (t) {
          case "keypress":
            if (xs(n) === 0) break e;
          case "keydown":
          case "keyup":
            y = cv;
            break;
          case "focusin":
            _ = "focus", y = Ka;
            break;
          case "focusout":
            _ = "blur", y = Ka;
            break;
          case "beforeblur":
          case "afterblur":
            y = Ka;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            y = Nc;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            y = Jg;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            y = hv;
            break;
          case lh:
          case oh:
          case uh:
            y = tv;
            break;
          case ch:
            y = mv;
            break;
          case "scroll":
            y = qg;
            break;
          case "wheel":
            y = vv;
            break;
          case "copy":
          case "cut":
          case "paste":
            y = rv;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            y = Pc;
        }
        var g = (e & 4) !== 0, x = !g && t === "scroll", m = g ? p !== null ? p + "Capture" : null : p;
        g = [];
        for (var h = u, v; h !== null; ) {
          v = h;
          var w = v.stateNode;
          if (v.tag === 5 && w !== null && (v = w, m !== null && (w = wi(h, m), w != null && g.push(Ni(h, w, v)))), x) break;
          h = h.return;
        }
        0 < g.length && (p = new y(p, _, null, n, c), f.push({ event: p, listeners: g }));
      }
    }
    if (!(e & 7)) {
      e: {
        if (p = t === "mouseover" || t === "pointerover", y = t === "mouseout" || t === "pointerout", p && n !== Ul && (_ = n.relatedTarget || n.fromElement) && (Rn(_) || _[Bt])) break e;
        if ((y || p) && (p = c.window === c ? c : (p = c.ownerDocument) ? p.defaultView || p.parentWindow : window, y ? (_ = n.relatedTarget || n.toElement, y = u, _ = _ ? Rn(_) : null, _ !== null && (x = Xn(_), _ !== x || _.tag !== 5 && _.tag !== 6) && (_ = null)) : (y = null, _ = u), y !== _)) {
          if (g = Nc, w = "onMouseLeave", m = "onMouseEnter", h = "mouse", (t === "pointerout" || t === "pointerover") && (g = Pc, w = "onPointerLeave", m = "onPointerEnter", h = "pointer"), x = y == null ? p : ur(y), v = _ == null ? p : ur(_), p = new g(w, h + "leave", y, n, c), p.target = x, p.relatedTarget = v, w = null, Rn(c) === u && (g = new g(m, h + "enter", _, n, c), g.target = v, g.relatedTarget = x, w = g), x = w, y && _) t: {
            for (g = y, m = _, h = 0, v = g; v; v = tr(v)) h++;
            for (v = 0, w = m; w; w = tr(w)) v++;
            for (; 0 < h - v; ) g = tr(g), h--;
            for (; 0 < v - h; ) m = tr(m), v--;
            for (; h--; ) {
              if (g === m || m !== null && g === m.alternate) break t;
              g = tr(g), m = tr(m);
            }
            g = null;
          }
          else g = null;
          y !== null && Bc(f, p, y, g, !1), _ !== null && x !== null && Bc(f, x, _, g, !0);
        }
      }
      e: {
        if (p = u ? ur(u) : window, y = p.nodeName && p.nodeName.toLowerCase(), y === "select" || y === "input" && p.type === "file") var S = Ev;
        else if (Lc(p)) if (nh) S = jv;
        else {
          S = Tv;
          var E = Cv;
        }
        else (y = p.nodeName) && y.toLowerCase() === "input" && (p.type === "checkbox" || p.type === "radio") && (S = Nv);
        if (S && (S = S(t, u))) {
          th(f, S, n, c);
          break e;
        }
        E && E(t, p, u), t === "focusout" && (E = p._wrapperState) && E.controlled && p.type === "number" && Ol(p, "number", p.value);
      }
      switch (E = u ? ur(u) : window, t) {
        case "focusin":
          (Lc(E) || E.contentEditable === "true") && (lr = E, Yl = u, ci = null);
          break;
        case "focusout":
          ci = Yl = lr = null;
          break;
        case "mousedown":
          Ql = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Ql = !1, Dc(f, n, c);
          break;
        case "selectionchange":
          if (bv) break;
        case "keydown":
        case "keyup":
          Dc(f, n, c);
      }
      var k;
      if (lu) e: {
        switch (t) {
          case "compositionstart":
            var C = "onCompositionStart";
            break e;
          case "compositionend":
            C = "onCompositionEnd";
            break e;
          case "compositionupdate":
            C = "onCompositionUpdate";
            break e;
        }
        C = void 0;
      }
      else ar ? Zf(t, n) && (C = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (C = "onCompositionStart");
      C && (Jf && n.locale !== "ko" && (ar || C !== "onCompositionStart" ? C === "onCompositionEnd" && ar && (k = Xf()) : (Zt = c, iu = "value" in Zt ? Zt.value : Zt.textContent, ar = !0)), E = Bs(u, C), 0 < E.length && (C = new jc(C, t, null, n, c), f.push({ event: C, listeners: E }), k ? C.data = k : (k = eh(n), k !== null && (C.data = k)))), (k = _v ? wv(t, n) : Sv(t, n)) && (u = Bs(u, "onBeforeInput"), 0 < u.length && (c = new jc("onBeforeInput", "beforeinput", null, n, c), f.push({ event: c, listeners: u }), c.data = k));
    }
    fh(f, e);
  });
}
function Ni(t, e, n) {
  return { instance: t, listener: e, currentTarget: n };
}
function Bs(t, e) {
  for (var n = e + "Capture", r = []; t !== null; ) {
    var i = t, s = i.stateNode;
    i.tag === 5 && s !== null && (i = s, s = wi(t, n), s != null && r.unshift(Ni(t, s, i)), s = wi(t, e), s != null && r.push(Ni(t, s, i))), t = t.return;
  }
  return r;
}
function tr(t) {
  if (t === null) return null;
  do
    t = t.return;
  while (t && t.tag !== 5);
  return t || null;
}
function Bc(t, e, n, r, i) {
  for (var s = e._reactName, a = []; n !== null && n !== r; ) {
    var l = n, o = l.alternate, u = l.stateNode;
    if (o !== null && o === r) break;
    l.tag === 5 && u !== null && (l = u, i ? (o = wi(n, s), o != null && a.unshift(Ni(n, o, l))) : i || (o = wi(n, s), o != null && a.push(Ni(n, o, l)))), n = n.return;
  }
  a.length !== 0 && t.push({ event: e, listeners: a });
}
var Mv = /\r\n?/g, Ov = /\u0000|\uFFFD/g;
function Uc(t) {
  return (typeof t == "string" ? t : "" + t).replace(Mv, `
`).replace(Ov, "");
}
function os(t, e, n) {
  if (e = Uc(e), Uc(t) !== e && n) throw Error(j(425));
}
function Us() {
}
var ql = null, Xl = null;
function Jl(t, e) {
  return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
}
var Zl = typeof setTimeout == "function" ? setTimeout : void 0, Dv = typeof clearTimeout == "function" ? clearTimeout : void 0, Hc = typeof Promise == "function" ? Promise : void 0, zv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Hc < "u" ? function(t) {
  return Hc.resolve(null).then(t).catch(Fv);
} : Zl;
function Fv(t) {
  setTimeout(function() {
    throw t;
  });
}
function tl(t, e) {
  var n = e, r = 0;
  do {
    var i = n.nextSibling;
    if (t.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$") {
      if (r === 0) {
        t.removeChild(i), ki(e);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = i;
  } while (n);
  ki(e);
}
function un(t) {
  for (; t != null; t = t.nextSibling) {
    var e = t.nodeType;
    if (e === 1 || e === 3) break;
    if (e === 8) {
      if (e = t.data, e === "$" || e === "$!" || e === "$?") break;
      if (e === "/$") return null;
    }
  }
  return t;
}
function Vc(t) {
  t = t.previousSibling;
  for (var e = 0; t; ) {
    if (t.nodeType === 8) {
      var n = t.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (e === 0) return t;
        e--;
      } else n === "/$" && e++;
    }
    t = t.previousSibling;
  }
  return null;
}
var Vr = Math.random().toString(36).slice(2), Tt = "__reactFiber$" + Vr, ji = "__reactProps$" + Vr, Bt = "__reactContainer$" + Vr, eo = "__reactEvents$" + Vr, Bv = "__reactListeners$" + Vr, Uv = "__reactHandles$" + Vr;
function Rn(t) {
  var e = t[Tt];
  if (e) return e;
  for (var n = t.parentNode; n; ) {
    if (e = n[Bt] || n[Tt]) {
      if (n = e.alternate, e.child !== null || n !== null && n.child !== null) for (t = Vc(t); t !== null; ) {
        if (n = t[Tt]) return n;
        t = Vc(t);
      }
      return e;
    }
    t = n, n = t.parentNode;
  }
  return null;
}
function Ki(t) {
  return t = t[Tt] || t[Bt], !t || t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3 ? null : t;
}
function ur(t) {
  if (t.tag === 5 || t.tag === 6) return t.stateNode;
  throw Error(j(33));
}
function wa(t) {
  return t[ji] || null;
}
var to = [], cr = -1;
function xn(t) {
  return { current: t };
}
function X(t) {
  0 > cr || (t.current = to[cr], to[cr] = null, cr--);
}
function Q(t, e) {
  cr++, to[cr] = t.current, t.current = e;
}
var vn = {}, Ae = xn(vn), Fe = xn(!1), Wn = vn;
function jr(t, e) {
  var n = t.type.contextTypes;
  if (!n) return vn;
  var r = t.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === e) return r.__reactInternalMemoizedMaskedChildContext;
  var i = {}, s;
  for (s in n) i[s] = e[s];
  return r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = e, t.__reactInternalMemoizedMaskedChildContext = i), i;
}
function Be(t) {
  return t = t.childContextTypes, t != null;
}
function Hs() {
  X(Fe), X(Ae);
}
function $c(t, e, n) {
  if (Ae.current !== vn) throw Error(j(168));
  Q(Ae, e), Q(Fe, n);
}
function ph(t, e, n) {
  var r = t.stateNode;
  if (e = e.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in e)) throw Error(j(108, Cg(t) || "Unknown", i));
  return le({}, n, r);
}
function Vs(t) {
  return t = (t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext || vn, Wn = Ae.current, Q(Ae, t), Q(Fe, Fe.current), !0;
}
function Wc(t, e, n) {
  var r = t.stateNode;
  if (!r) throw Error(j(169));
  n ? (t = ph(t, e, Wn), r.__reactInternalMemoizedMergedChildContext = t, X(Fe), X(Ae), Q(Ae, t)) : X(Fe), Q(Fe, n);
}
var Rt = null, Sa = !1, nl = !1;
function mh(t) {
  Rt === null ? Rt = [t] : Rt.push(t);
}
function Hv(t) {
  Sa = !0, mh(t);
}
function kn() {
  if (!nl && Rt !== null) {
    nl = !0;
    var t = 0, e = G;
    try {
      var n = Rt;
      for (G = 1; t < n.length; t++) {
        var r = n[t];
        do
          r = r(!0);
        while (r !== null);
      }
      Rt = null, Sa = !1;
    } catch (i) {
      throw Rt !== null && (Rt = Rt.slice(t + 1)), Bf(eu, kn), i;
    } finally {
      G = e, nl = !1;
    }
  }
  return null;
}
var dr = [], fr = 0, $s = null, Ws = 0, ot = [], ut = 0, Gn = null, Ot = 1, Dt = "";
function bn(t, e) {
  dr[fr++] = Ws, dr[fr++] = $s, $s = t, Ws = e;
}
function gh(t, e, n) {
  ot[ut++] = Ot, ot[ut++] = Dt, ot[ut++] = Gn, Gn = t;
  var r = Ot;
  t = Dt;
  var i = 32 - wt(r) - 1;
  r &= ~(1 << i), n += 1;
  var s = 32 - wt(e) + i;
  if (30 < s) {
    var a = i - i % 5;
    s = (r & (1 << a) - 1).toString(32), r >>= a, i -= a, Ot = 1 << 32 - wt(e) + i | n << i | r, Dt = s + t;
  } else Ot = 1 << s | n << i | r, Dt = t;
}
function uu(t) {
  t.return !== null && (bn(t, 1), gh(t, 1, 0));
}
function cu(t) {
  for (; t === $s; ) $s = dr[--fr], dr[fr] = null, Ws = dr[--fr], dr[fr] = null;
  for (; t === Gn; ) Gn = ot[--ut], ot[ut] = null, Dt = ot[--ut], ot[ut] = null, Ot = ot[--ut], ot[ut] = null;
}
var et = null, Xe = null, Z = !1, _t = null;
function vh(t, e) {
  var n = ct(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = e, n.return = t, e = t.deletions, e === null ? (t.deletions = [n], t.flags |= 16) : e.push(n);
}
function Gc(t, e) {
  switch (t.tag) {
    case 5:
      var n = t.type;
      return e = e.nodeType !== 1 || n.toLowerCase() !== e.nodeName.toLowerCase() ? null : e, e !== null ? (t.stateNode = e, et = t, Xe = un(e.firstChild), !0) : !1;
    case 6:
      return e = t.pendingProps === "" || e.nodeType !== 3 ? null : e, e !== null ? (t.stateNode = e, et = t, Xe = null, !0) : !1;
    case 13:
      return e = e.nodeType !== 8 ? null : e, e !== null ? (n = Gn !== null ? { id: Ot, overflow: Dt } : null, t.memoizedState = { dehydrated: e, treeContext: n, retryLane: 1073741824 }, n = ct(18, null, null, 0), n.stateNode = e, n.return = t, t.child = n, et = t, Xe = null, !0) : !1;
    default:
      return !1;
  }
}
function no(t) {
  return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
}
function ro(t) {
  if (Z) {
    var e = Xe;
    if (e) {
      var n = e;
      if (!Gc(t, e)) {
        if (no(t)) throw Error(j(418));
        e = un(n.nextSibling);
        var r = et;
        e && Gc(t, e) ? vh(r, n) : (t.flags = t.flags & -4097 | 2, Z = !1, et = t);
      }
    } else {
      if (no(t)) throw Error(j(418));
      t.flags = t.flags & -4097 | 2, Z = !1, et = t;
    }
  }
}
function Kc(t) {
  for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; ) t = t.return;
  et = t;
}
function us(t) {
  if (t !== et) return !1;
  if (!Z) return Kc(t), Z = !0, !1;
  var e;
  if ((e = t.tag !== 3) && !(e = t.tag !== 5) && (e = t.type, e = e !== "head" && e !== "body" && !Jl(t.type, t.memoizedProps)), e && (e = Xe)) {
    if (no(t)) throw yh(), Error(j(418));
    for (; e; ) vh(t, e), e = un(e.nextSibling);
  }
  if (Kc(t), t.tag === 13) {
    if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(j(317));
    e: {
      for (t = t.nextSibling, e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$") {
            if (e === 0) {
              Xe = un(t.nextSibling);
              break e;
            }
            e--;
          } else n !== "$" && n !== "$!" && n !== "$?" || e++;
        }
        t = t.nextSibling;
      }
      Xe = null;
    }
  } else Xe = et ? un(t.stateNode.nextSibling) : null;
  return !0;
}
function yh() {
  for (var t = Xe; t; ) t = un(t.nextSibling);
}
function Pr() {
  Xe = et = null, Z = !1;
}
function du(t) {
  _t === null ? _t = [t] : _t.push(t);
}
var Vv = Wt.ReactCurrentBatchConfig;
function qr(t, e, n) {
  if (t = n.ref, t !== null && typeof t != "function" && typeof t != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(j(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(j(147, t));
      var i = r, s = "" + t;
      return e !== null && e.ref !== null && typeof e.ref == "function" && e.ref._stringRef === s ? e.ref : (e = function(a) {
        var l = i.refs;
        a === null ? delete l[s] : l[s] = a;
      }, e._stringRef = s, e);
    }
    if (typeof t != "string") throw Error(j(284));
    if (!n._owner) throw Error(j(290, t));
  }
  return t;
}
function cs(t, e) {
  throw t = Object.prototype.toString.call(e), Error(j(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
}
function Yc(t) {
  var e = t._init;
  return e(t._payload);
}
function _h(t) {
  function e(m, h) {
    if (t) {
      var v = m.deletions;
      v === null ? (m.deletions = [h], m.flags |= 16) : v.push(h);
    }
  }
  function n(m, h) {
    if (!t) return null;
    for (; h !== null; ) e(m, h), h = h.sibling;
    return null;
  }
  function r(m, h) {
    for (m = /* @__PURE__ */ new Map(); h !== null; ) h.key !== null ? m.set(h.key, h) : m.set(h.index, h), h = h.sibling;
    return m;
  }
  function i(m, h) {
    return m = hn(m, h), m.index = 0, m.sibling = null, m;
  }
  function s(m, h, v) {
    return m.index = v, t ? (v = m.alternate, v !== null ? (v = v.index, v < h ? (m.flags |= 2, h) : v) : (m.flags |= 2, h)) : (m.flags |= 1048576, h);
  }
  function a(m) {
    return t && m.alternate === null && (m.flags |= 2), m;
  }
  function l(m, h, v, w) {
    return h === null || h.tag !== 6 ? (h = ul(v, m.mode, w), h.return = m, h) : (h = i(h, v), h.return = m, h);
  }
  function o(m, h, v, w) {
    var S = v.type;
    return S === sr ? c(m, h, v.props.children, w, v.key) : h !== null && (h.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Kt && Yc(S) === h.type) ? (w = i(h, v.props), w.ref = qr(m, h, v), w.return = m, w) : (w = Ps(v.type, v.key, v.props, null, m.mode, w), w.ref = qr(m, h, v), w.return = m, w);
  }
  function u(m, h, v, w) {
    return h === null || h.tag !== 4 || h.stateNode.containerInfo !== v.containerInfo || h.stateNode.implementation !== v.implementation ? (h = cl(v, m.mode, w), h.return = m, h) : (h = i(h, v.children || []), h.return = m, h);
  }
  function c(m, h, v, w, S) {
    return h === null || h.tag !== 7 ? (h = Bn(v, m.mode, w, S), h.return = m, h) : (h = i(h, v), h.return = m, h);
  }
  function f(m, h, v) {
    if (typeof h == "string" && h !== "" || typeof h == "number") return h = ul("" + h, m.mode, v), h.return = m, h;
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Zi:
          return v = Ps(h.type, h.key, h.props, null, m.mode, v), v.ref = qr(m, null, h), v.return = m, v;
        case ir:
          return h = cl(h, m.mode, v), h.return = m, h;
        case Kt:
          var w = h._init;
          return f(m, w(h._payload), v);
      }
      if (ti(h) || Wr(h)) return h = Bn(h, m.mode, v, null), h.return = m, h;
      cs(m, h);
    }
    return null;
  }
  function p(m, h, v, w) {
    var S = h !== null ? h.key : null;
    if (typeof v == "string" && v !== "" || typeof v == "number") return S !== null ? null : l(m, h, "" + v, w);
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case Zi:
          return v.key === S ? o(m, h, v, w) : null;
        case ir:
          return v.key === S ? u(m, h, v, w) : null;
        case Kt:
          return S = v._init, p(
            m,
            h,
            S(v._payload),
            w
          );
      }
      if (ti(v) || Wr(v)) return S !== null ? null : c(m, h, v, w, null);
      cs(m, v);
    }
    return null;
  }
  function y(m, h, v, w, S) {
    if (typeof w == "string" && w !== "" || typeof w == "number") return m = m.get(v) || null, l(h, m, "" + w, S);
    if (typeof w == "object" && w !== null) {
      switch (w.$$typeof) {
        case Zi:
          return m = m.get(w.key === null ? v : w.key) || null, o(h, m, w, S);
        case ir:
          return m = m.get(w.key === null ? v : w.key) || null, u(h, m, w, S);
        case Kt:
          var E = w._init;
          return y(m, h, v, E(w._payload), S);
      }
      if (ti(w) || Wr(w)) return m = m.get(v) || null, c(h, m, w, S, null);
      cs(h, w);
    }
    return null;
  }
  function _(m, h, v, w) {
    for (var S = null, E = null, k = h, C = h = 0, T = null; k !== null && C < v.length; C++) {
      k.index > C ? (T = k, k = null) : T = k.sibling;
      var b = p(m, k, v[C], w);
      if (b === null) {
        k === null && (k = T);
        break;
      }
      t && k && b.alternate === null && e(m, k), h = s(b, h, C), E === null ? S = b : E.sibling = b, E = b, k = T;
    }
    if (C === v.length) return n(m, k), Z && bn(m, C), S;
    if (k === null) {
      for (; C < v.length; C++) k = f(m, v[C], w), k !== null && (h = s(k, h, C), E === null ? S = k : E.sibling = k, E = k);
      return Z && bn(m, C), S;
    }
    for (k = r(m, k); C < v.length; C++) T = y(k, m, C, v[C], w), T !== null && (t && T.alternate !== null && k.delete(T.key === null ? C : T.key), h = s(T, h, C), E === null ? S = T : E.sibling = T, E = T);
    return t && k.forEach(function(O) {
      return e(m, O);
    }), Z && bn(m, C), S;
  }
  function g(m, h, v, w) {
    var S = Wr(v);
    if (typeof S != "function") throw Error(j(150));
    if (v = S.call(v), v == null) throw Error(j(151));
    for (var E = S = null, k = h, C = h = 0, T = null, b = v.next(); k !== null && !b.done; C++, b = v.next()) {
      k.index > C ? (T = k, k = null) : T = k.sibling;
      var O = p(m, k, b.value, w);
      if (O === null) {
        k === null && (k = T);
        break;
      }
      t && k && O.alternate === null && e(m, k), h = s(O, h, C), E === null ? S = O : E.sibling = O, E = O, k = T;
    }
    if (b.done) return n(
      m,
      k
    ), Z && bn(m, C), S;
    if (k === null) {
      for (; !b.done; C++, b = v.next()) b = f(m, b.value, w), b !== null && (h = s(b, h, C), E === null ? S = b : E.sibling = b, E = b);
      return Z && bn(m, C), S;
    }
    for (k = r(m, k); !b.done; C++, b = v.next()) b = y(k, m, C, b.value, w), b !== null && (t && b.alternate !== null && k.delete(b.key === null ? C : b.key), h = s(b, h, C), E === null ? S = b : E.sibling = b, E = b);
    return t && k.forEach(function(U) {
      return e(m, U);
    }), Z && bn(m, C), S;
  }
  function x(m, h, v, w) {
    if (typeof v == "object" && v !== null && v.type === sr && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case Zi:
          e: {
            for (var S = v.key, E = h; E !== null; ) {
              if (E.key === S) {
                if (S = v.type, S === sr) {
                  if (E.tag === 7) {
                    n(m, E.sibling), h = i(E, v.props.children), h.return = m, m = h;
                    break e;
                  }
                } else if (E.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Kt && Yc(S) === E.type) {
                  n(m, E.sibling), h = i(E, v.props), h.ref = qr(m, E, v), h.return = m, m = h;
                  break e;
                }
                n(m, E);
                break;
              } else e(m, E);
              E = E.sibling;
            }
            v.type === sr ? (h = Bn(v.props.children, m.mode, w, v.key), h.return = m, m = h) : (w = Ps(v.type, v.key, v.props, null, m.mode, w), w.ref = qr(m, h, v), w.return = m, m = w);
          }
          return a(m);
        case ir:
          e: {
            for (E = v.key; h !== null; ) {
              if (h.key === E) if (h.tag === 4 && h.stateNode.containerInfo === v.containerInfo && h.stateNode.implementation === v.implementation) {
                n(m, h.sibling), h = i(h, v.children || []), h.return = m, m = h;
                break e;
              } else {
                n(m, h);
                break;
              }
              else e(m, h);
              h = h.sibling;
            }
            h = cl(v, m.mode, w), h.return = m, m = h;
          }
          return a(m);
        case Kt:
          return E = v._init, x(m, h, E(v._payload), w);
      }
      if (ti(v)) return _(m, h, v, w);
      if (Wr(v)) return g(m, h, v, w);
      cs(m, v);
    }
    return typeof v == "string" && v !== "" || typeof v == "number" ? (v = "" + v, h !== null && h.tag === 6 ? (n(m, h.sibling), h = i(h, v), h.return = m, m = h) : (n(m, h), h = ul(v, m.mode, w), h.return = m, m = h), a(m)) : n(m, h);
  }
  return x;
}
var Ar = _h(!0), wh = _h(!1), Gs = xn(null), Ks = null, hr = null, fu = null;
function hu() {
  fu = hr = Ks = null;
}
function pu(t) {
  var e = Gs.current;
  X(Gs), t._currentValue = e;
}
function io(t, e, n) {
  for (; t !== null; ) {
    var r = t.alternate;
    if ((t.childLanes & e) !== e ? (t.childLanes |= e, r !== null && (r.childLanes |= e)) : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e), t === n) break;
    t = t.return;
  }
}
function xr(t, e) {
  Ks = t, fu = hr = null, t = t.dependencies, t !== null && t.firstContext !== null && (t.lanes & e && (ze = !0), t.firstContext = null);
}
function pt(t) {
  var e = t._currentValue;
  if (fu !== t) if (t = { context: t, memoizedValue: e, next: null }, hr === null) {
    if (Ks === null) throw Error(j(308));
    hr = t, Ks.dependencies = { lanes: 0, firstContext: t };
  } else hr = hr.next = t;
  return e;
}
var Mn = null;
function mu(t) {
  Mn === null ? Mn = [t] : Mn.push(t);
}
function Sh(t, e, n, r) {
  var i = e.interleaved;
  return i === null ? (n.next = n, mu(e)) : (n.next = i.next, i.next = n), e.interleaved = n, Ut(t, r);
}
function Ut(t, e) {
  t.lanes |= e;
  var n = t.alternate;
  for (n !== null && (n.lanes |= e), n = t, t = t.return; t !== null; ) t.childLanes |= e, n = t.alternate, n !== null && (n.childLanes |= e), n = t, t = t.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Yt = !1;
function gu(t) {
  t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function xh(t, e) {
  t = t.updateQueue, e.updateQueue === t && (e.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, effects: t.effects });
}
function zt(t, e) {
  return { eventTime: t, lane: e, tag: 0, payload: null, callback: null, next: null };
}
function cn(t, e, n) {
  var r = t.updateQueue;
  if (r === null) return null;
  if (r = r.shared, $ & 2) {
    var i = r.pending;
    return i === null ? e.next = e : (e.next = i.next, i.next = e), r.pending = e, Ut(t, n);
  }
  return i = r.interleaved, i === null ? (e.next = e, mu(r)) : (e.next = i.next, i.next = e), r.interleaved = e, Ut(t, n);
}
function ks(t, e, n) {
  if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194240) !== 0)) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, tu(t, n);
  }
}
function Qc(t, e) {
  var n = t.updateQueue, r = t.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var i = null, s = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var a = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        s === null ? i = s = a : s = s.next = a, n = n.next;
      } while (n !== null);
      s === null ? i = s = e : s = s.next = e;
    } else i = s = e;
    n = { baseState: r.baseState, firstBaseUpdate: i, lastBaseUpdate: s, shared: r.shared, effects: r.effects }, t.updateQueue = n;
    return;
  }
  t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
}
function Ys(t, e, n, r) {
  var i = t.updateQueue;
  Yt = !1;
  var s = i.firstBaseUpdate, a = i.lastBaseUpdate, l = i.shared.pending;
  if (l !== null) {
    i.shared.pending = null;
    var o = l, u = o.next;
    o.next = null, a === null ? s = u : a.next = u, a = o;
    var c = t.alternate;
    c !== null && (c = c.updateQueue, l = c.lastBaseUpdate, l !== a && (l === null ? c.firstBaseUpdate = u : l.next = u, c.lastBaseUpdate = o));
  }
  if (s !== null) {
    var f = i.baseState;
    a = 0, c = u = o = null, l = s;
    do {
      var p = l.lane, y = l.eventTime;
      if ((r & p) === p) {
        c !== null && (c = c.next = {
          eventTime: y,
          lane: 0,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null
        });
        e: {
          var _ = t, g = l;
          switch (p = e, y = n, g.tag) {
            case 1:
              if (_ = g.payload, typeof _ == "function") {
                f = _.call(y, f, p);
                break e;
              }
              f = _;
              break e;
            case 3:
              _.flags = _.flags & -65537 | 128;
            case 0:
              if (_ = g.payload, p = typeof _ == "function" ? _.call(y, f, p) : _, p == null) break e;
              f = le({}, f, p);
              break e;
            case 2:
              Yt = !0;
          }
        }
        l.callback !== null && l.lane !== 0 && (t.flags |= 64, p = i.effects, p === null ? i.effects = [l] : p.push(l));
      } else y = { eventTime: y, lane: p, tag: l.tag, payload: l.payload, callback: l.callback, next: null }, c === null ? (u = c = y, o = f) : c = c.next = y, a |= p;
      if (l = l.next, l === null) {
        if (l = i.shared.pending, l === null) break;
        p = l, l = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
      }
    } while (!0);
    if (c === null && (o = f), i.baseState = o, i.firstBaseUpdate = u, i.lastBaseUpdate = c, e = i.shared.interleaved, e !== null) {
      i = e;
      do
        a |= i.lane, i = i.next;
      while (i !== e);
    } else s === null && (i.shared.lanes = 0);
    Yn |= a, t.lanes = a, t.memoizedState = f;
  }
}
function qc(t, e, n) {
  if (t = e.effects, e.effects = null, t !== null) for (e = 0; e < t.length; e++) {
    var r = t[e], i = r.callback;
    if (i !== null) {
      if (r.callback = null, r = n, typeof i != "function") throw Error(j(191, i));
      i.call(r);
    }
  }
}
var Yi = {}, At = xn(Yi), Pi = xn(Yi), Ai = xn(Yi);
function On(t) {
  if (t === Yi) throw Error(j(174));
  return t;
}
function vu(t, e) {
  switch (Q(Ai, e), Q(Pi, t), Q(At, Yi), t = e.nodeType, t) {
    case 9:
    case 11:
      e = (e = e.documentElement) ? e.namespaceURI : zl(null, "");
      break;
    default:
      t = t === 8 ? e.parentNode : e, e = t.namespaceURI || null, t = t.tagName, e = zl(e, t);
  }
  X(At), Q(At, e);
}
function br() {
  X(At), X(Pi), X(Ai);
}
function kh(t) {
  On(Ai.current);
  var e = On(At.current), n = zl(e, t.type);
  e !== n && (Q(Pi, t), Q(At, n));
}
function yu(t) {
  Pi.current === t && (X(At), X(Pi));
}
var re = xn(0);
function Qs(t) {
  for (var e = t; e !== null; ) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return e;
    } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
      if (e.flags & 128) return e;
    } else if (e.child !== null) {
      e.child.return = e, e = e.child;
      continue;
    }
    if (e === t) break;
    for (; e.sibling === null; ) {
      if (e.return === null || e.return === t) return null;
      e = e.return;
    }
    e.sibling.return = e.return, e = e.sibling;
  }
  return null;
}
var rl = [];
function _u() {
  for (var t = 0; t < rl.length; t++) rl[t]._workInProgressVersionPrimary = null;
  rl.length = 0;
}
var Es = Wt.ReactCurrentDispatcher, il = Wt.ReactCurrentBatchConfig, Kn = 0, ae = null, me = null, ye = null, qs = !1, di = !1, bi = 0, $v = 0;
function Ce() {
  throw Error(j(321));
}
function wu(t, e) {
  if (e === null) return !1;
  for (var n = 0; n < e.length && n < t.length; n++) if (!xt(t[n], e[n])) return !1;
  return !0;
}
function Su(t, e, n, r, i, s) {
  if (Kn = s, ae = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, Es.current = t === null || t.memoizedState === null ? Yv : Qv, t = n(r, i), di) {
    s = 0;
    do {
      if (di = !1, bi = 0, 25 <= s) throw Error(j(301));
      s += 1, ye = me = null, e.updateQueue = null, Es.current = qv, t = n(r, i);
    } while (di);
  }
  if (Es.current = Xs, e = me !== null && me.next !== null, Kn = 0, ye = me = ae = null, qs = !1, e) throw Error(j(300));
  return t;
}
function xu() {
  var t = bi !== 0;
  return bi = 0, t;
}
function Et() {
  var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return ye === null ? ae.memoizedState = ye = t : ye = ye.next = t, ye;
}
function mt() {
  if (me === null) {
    var t = ae.alternate;
    t = t !== null ? t.memoizedState : null;
  } else t = me.next;
  var e = ye === null ? ae.memoizedState : ye.next;
  if (e !== null) ye = e, me = t;
  else {
    if (t === null) throw Error(j(310));
    me = t, t = { memoizedState: me.memoizedState, baseState: me.baseState, baseQueue: me.baseQueue, queue: me.queue, next: null }, ye === null ? ae.memoizedState = ye = t : ye = ye.next = t;
  }
  return ye;
}
function Li(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function sl(t) {
  var e = mt(), n = e.queue;
  if (n === null) throw Error(j(311));
  n.lastRenderedReducer = t;
  var r = me, i = r.baseQueue, s = n.pending;
  if (s !== null) {
    if (i !== null) {
      var a = i.next;
      i.next = s.next, s.next = a;
    }
    r.baseQueue = i = s, n.pending = null;
  }
  if (i !== null) {
    s = i.next, r = r.baseState;
    var l = a = null, o = null, u = s;
    do {
      var c = u.lane;
      if ((Kn & c) === c) o !== null && (o = o.next = { lane: 0, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }), r = u.hasEagerState ? u.eagerState : t(r, u.action);
      else {
        var f = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null
        };
        o === null ? (l = o = f, a = r) : o = o.next = f, ae.lanes |= c, Yn |= c;
      }
      u = u.next;
    } while (u !== null && u !== s);
    o === null ? a = r : o.next = l, xt(r, e.memoizedState) || (ze = !0), e.memoizedState = r, e.baseState = a, e.baseQueue = o, n.lastRenderedState = r;
  }
  if (t = n.interleaved, t !== null) {
    i = t;
    do
      s = i.lane, ae.lanes |= s, Yn |= s, i = i.next;
    while (i !== t);
  } else i === null && (n.lanes = 0);
  return [e.memoizedState, n.dispatch];
}
function al(t) {
  var e = mt(), n = e.queue;
  if (n === null) throw Error(j(311));
  n.lastRenderedReducer = t;
  var r = n.dispatch, i = n.pending, s = e.memoizedState;
  if (i !== null) {
    n.pending = null;
    var a = i = i.next;
    do
      s = t(s, a.action), a = a.next;
    while (a !== i);
    xt(s, e.memoizedState) || (ze = !0), e.memoizedState = s, e.baseQueue === null && (e.baseState = s), n.lastRenderedState = s;
  }
  return [s, r];
}
function Eh() {
}
function Ch(t, e) {
  var n = ae, r = mt(), i = e(), s = !xt(r.memoizedState, i);
  if (s && (r.memoizedState = i, ze = !0), r = r.queue, ku(jh.bind(null, n, r, t), [t]), r.getSnapshot !== e || s || ye !== null && ye.memoizedState.tag & 1) {
    if (n.flags |= 2048, Ii(9, Nh.bind(null, n, r, i, e), void 0, null), _e === null) throw Error(j(349));
    Kn & 30 || Th(n, e, i);
  }
  return i;
}
function Th(t, e, n) {
  t.flags |= 16384, t = { getSnapshot: e, value: n }, e = ae.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, ae.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
}
function Nh(t, e, n, r) {
  e.value = n, e.getSnapshot = r, Ph(e) && Ah(t);
}
function jh(t, e, n) {
  return n(function() {
    Ph(e) && Ah(t);
  });
}
function Ph(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !xt(t, n);
  } catch {
    return !0;
  }
}
function Ah(t) {
  var e = Ut(t, 1);
  e !== null && St(e, t, 1, -1);
}
function Xc(t) {
  var e = Et();
  return typeof t == "function" && (t = t()), e.memoizedState = e.baseState = t, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Li, lastRenderedState: t }, e.queue = t, t = t.dispatch = Kv.bind(null, ae, t), [e.memoizedState, t];
}
function Ii(t, e, n, r) {
  return t = { tag: t, create: e, destroy: n, deps: r, next: null }, e = ae.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, ae.updateQueue = e, e.lastEffect = t.next = t) : (n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (r = n.next, n.next = t, t.next = r, e.lastEffect = t)), t;
}
function bh() {
  return mt().memoizedState;
}
function Cs(t, e, n, r) {
  var i = Et();
  ae.flags |= t, i.memoizedState = Ii(1 | e, n, void 0, r === void 0 ? null : r);
}
function xa(t, e, n, r) {
  var i = mt();
  r = r === void 0 ? null : r;
  var s = void 0;
  if (me !== null) {
    var a = me.memoizedState;
    if (s = a.destroy, r !== null && wu(r, a.deps)) {
      i.memoizedState = Ii(e, n, s, r);
      return;
    }
  }
  ae.flags |= t, i.memoizedState = Ii(1 | e, n, s, r);
}
function Jc(t, e) {
  return Cs(8390656, 8, t, e);
}
function ku(t, e) {
  return xa(2048, 8, t, e);
}
function Lh(t, e) {
  return xa(4, 2, t, e);
}
function Ih(t, e) {
  return xa(4, 4, t, e);
}
function Rh(t, e) {
  if (typeof e == "function") return t = t(), e(t), function() {
    e(null);
  };
  if (e != null) return t = t(), e.current = t, function() {
    e.current = null;
  };
}
function Mh(t, e, n) {
  return n = n != null ? n.concat([t]) : null, xa(4, 4, Rh.bind(null, e, t), n);
}
function Eu() {
}
function Oh(t, e) {
  var n = mt();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && wu(e, r[1]) ? r[0] : (n.memoizedState = [t, e], t);
}
function Dh(t, e) {
  var n = mt();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && wu(e, r[1]) ? r[0] : (t = t(), n.memoizedState = [t, e], t);
}
function zh(t, e, n) {
  return Kn & 21 ? (xt(n, e) || (n = Vf(), ae.lanes |= n, Yn |= n, t.baseState = !0), e) : (t.baseState && (t.baseState = !1, ze = !0), t.memoizedState = n);
}
function Wv(t, e) {
  var n = G;
  G = n !== 0 && 4 > n ? n : 4, t(!0);
  var r = il.transition;
  il.transition = {};
  try {
    t(!1), e();
  } finally {
    G = n, il.transition = r;
  }
}
function Fh() {
  return mt().memoizedState;
}
function Gv(t, e, n) {
  var r = fn(t);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Bh(t)) Uh(e, n);
  else if (n = Sh(t, e, n, r), n !== null) {
    var i = Re();
    St(n, t, r, i), Hh(n, e, r);
  }
}
function Kv(t, e, n) {
  var r = fn(t), i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Bh(t)) Uh(e, i);
  else {
    var s = t.alternate;
    if (t.lanes === 0 && (s === null || s.lanes === 0) && (s = e.lastRenderedReducer, s !== null)) try {
      var a = e.lastRenderedState, l = s(a, n);
      if (i.hasEagerState = !0, i.eagerState = l, xt(l, a)) {
        var o = e.interleaved;
        o === null ? (i.next = i, mu(e)) : (i.next = o.next, o.next = i), e.interleaved = i;
        return;
      }
    } catch {
    } finally {
    }
    n = Sh(t, e, i, r), n !== null && (i = Re(), St(n, t, r, i), Hh(n, e, r));
  }
}
function Bh(t) {
  var e = t.alternate;
  return t === ae || e !== null && e === ae;
}
function Uh(t, e) {
  di = qs = !0;
  var n = t.pending;
  n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
}
function Hh(t, e, n) {
  if (n & 4194240) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, tu(t, n);
  }
}
var Xs = { readContext: pt, useCallback: Ce, useContext: Ce, useEffect: Ce, useImperativeHandle: Ce, useInsertionEffect: Ce, useLayoutEffect: Ce, useMemo: Ce, useReducer: Ce, useRef: Ce, useState: Ce, useDebugValue: Ce, useDeferredValue: Ce, useTransition: Ce, useMutableSource: Ce, useSyncExternalStore: Ce, useId: Ce, unstable_isNewReconciler: !1 }, Yv = { readContext: pt, useCallback: function(t, e) {
  return Et().memoizedState = [t, e === void 0 ? null : e], t;
}, useContext: pt, useEffect: Jc, useImperativeHandle: function(t, e, n) {
  return n = n != null ? n.concat([t]) : null, Cs(
    4194308,
    4,
    Rh.bind(null, e, t),
    n
  );
}, useLayoutEffect: function(t, e) {
  return Cs(4194308, 4, t, e);
}, useInsertionEffect: function(t, e) {
  return Cs(4, 2, t, e);
}, useMemo: function(t, e) {
  var n = Et();
  return e = e === void 0 ? null : e, t = t(), n.memoizedState = [t, e], t;
}, useReducer: function(t, e, n) {
  var r = Et();
  return e = n !== void 0 ? n(e) : e, r.memoizedState = r.baseState = e, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: e }, r.queue = t, t = t.dispatch = Gv.bind(null, ae, t), [r.memoizedState, t];
}, useRef: function(t) {
  var e = Et();
  return t = { current: t }, e.memoizedState = t;
}, useState: Xc, useDebugValue: Eu, useDeferredValue: function(t) {
  return Et().memoizedState = t;
}, useTransition: function() {
  var t = Xc(!1), e = t[0];
  return t = Wv.bind(null, t[1]), Et().memoizedState = t, [e, t];
}, useMutableSource: function() {
}, useSyncExternalStore: function(t, e, n) {
  var r = ae, i = Et();
  if (Z) {
    if (n === void 0) throw Error(j(407));
    n = n();
  } else {
    if (n = e(), _e === null) throw Error(j(349));
    Kn & 30 || Th(r, e, n);
  }
  i.memoizedState = n;
  var s = { value: n, getSnapshot: e };
  return i.queue = s, Jc(jh.bind(
    null,
    r,
    s,
    t
  ), [t]), r.flags |= 2048, Ii(9, Nh.bind(null, r, s, n, e), void 0, null), n;
}, useId: function() {
  var t = Et(), e = _e.identifierPrefix;
  if (Z) {
    var n = Dt, r = Ot;
    n = (r & ~(1 << 32 - wt(r) - 1)).toString(32) + n, e = ":" + e + "R" + n, n = bi++, 0 < n && (e += "H" + n.toString(32)), e += ":";
  } else n = $v++, e = ":" + e + "r" + n.toString(32) + ":";
  return t.memoizedState = e;
}, unstable_isNewReconciler: !1 }, Qv = {
  readContext: pt,
  useCallback: Oh,
  useContext: pt,
  useEffect: ku,
  useImperativeHandle: Mh,
  useInsertionEffect: Lh,
  useLayoutEffect: Ih,
  useMemo: Dh,
  useReducer: sl,
  useRef: bh,
  useState: function() {
    return sl(Li);
  },
  useDebugValue: Eu,
  useDeferredValue: function(t) {
    var e = mt();
    return zh(e, me.memoizedState, t);
  },
  useTransition: function() {
    var t = sl(Li)[0], e = mt().memoizedState;
    return [t, e];
  },
  useMutableSource: Eh,
  useSyncExternalStore: Ch,
  useId: Fh,
  unstable_isNewReconciler: !1
}, qv = { readContext: pt, useCallback: Oh, useContext: pt, useEffect: ku, useImperativeHandle: Mh, useInsertionEffect: Lh, useLayoutEffect: Ih, useMemo: Dh, useReducer: al, useRef: bh, useState: function() {
  return al(Li);
}, useDebugValue: Eu, useDeferredValue: function(t) {
  var e = mt();
  return me === null ? e.memoizedState = t : zh(e, me.memoizedState, t);
}, useTransition: function() {
  var t = al(Li)[0], e = mt().memoizedState;
  return [t, e];
}, useMutableSource: Eh, useSyncExternalStore: Ch, useId: Fh, unstable_isNewReconciler: !1 };
function vt(t, e) {
  if (t && t.defaultProps) {
    e = le({}, e), t = t.defaultProps;
    for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    return e;
  }
  return e;
}
function so(t, e, n, r) {
  e = t.memoizedState, n = n(r, e), n = n == null ? e : le({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
}
var ka = { isMounted: function(t) {
  return (t = t._reactInternals) ? Xn(t) === t : !1;
}, enqueueSetState: function(t, e, n) {
  t = t._reactInternals;
  var r = Re(), i = fn(t), s = zt(r, i);
  s.payload = e, n != null && (s.callback = n), e = cn(t, s, i), e !== null && (St(e, t, i, r), ks(e, t, i));
}, enqueueReplaceState: function(t, e, n) {
  t = t._reactInternals;
  var r = Re(), i = fn(t), s = zt(r, i);
  s.tag = 1, s.payload = e, n != null && (s.callback = n), e = cn(t, s, i), e !== null && (St(e, t, i, r), ks(e, t, i));
}, enqueueForceUpdate: function(t, e) {
  t = t._reactInternals;
  var n = Re(), r = fn(t), i = zt(n, r);
  i.tag = 2, e != null && (i.callback = e), e = cn(t, i, r), e !== null && (St(e, t, r, n), ks(e, t, r));
} };
function Zc(t, e, n, r, i, s, a) {
  return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(r, s, a) : e.prototype && e.prototype.isPureReactComponent ? !Ci(n, r) || !Ci(i, s) : !0;
}
function Vh(t, e, n) {
  var r = !1, i = vn, s = e.contextType;
  return typeof s == "object" && s !== null ? s = pt(s) : (i = Be(e) ? Wn : Ae.current, r = e.contextTypes, s = (r = r != null) ? jr(t, i) : vn), e = new e(n, s), t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null, e.updater = ka, t.stateNode = e, e._reactInternals = t, r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = i, t.__reactInternalMemoizedMaskedChildContext = s), e;
}
function ed(t, e, n, r) {
  t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, r), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, r), e.state !== t && ka.enqueueReplaceState(e, e.state, null);
}
function ao(t, e, n, r) {
  var i = t.stateNode;
  i.props = n, i.state = t.memoizedState, i.refs = {}, gu(t);
  var s = e.contextType;
  typeof s == "object" && s !== null ? i.context = pt(s) : (s = Be(e) ? Wn : Ae.current, i.context = jr(t, s)), i.state = t.memoizedState, s = e.getDerivedStateFromProps, typeof s == "function" && (so(t, e, s, n), i.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (e = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), e !== i.state && ka.enqueueReplaceState(i, i.state, null), Ys(t, n, i, r), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308);
}
function Lr(t, e) {
  try {
    var n = "", r = e;
    do
      n += Eg(r), r = r.return;
    while (r);
    var i = n;
  } catch (s) {
    i = `
Error generating stack: ` + s.message + `
` + s.stack;
  }
  return { value: t, source: e, stack: i, digest: null };
}
function ll(t, e, n) {
  return { value: t, source: null, stack: n ?? null, digest: e ?? null };
}
function lo(t, e) {
  try {
    console.error(e.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var Xv = typeof WeakMap == "function" ? WeakMap : Map;
function $h(t, e, n) {
  n = zt(-1, n), n.tag = 3, n.payload = { element: null };
  var r = e.value;
  return n.callback = function() {
    Zs || (Zs = !0, yo = r), lo(t, e);
  }, n;
}
function Wh(t, e, n) {
  n = zt(-1, n), n.tag = 3;
  var r = t.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = e.value;
    n.payload = function() {
      return r(i);
    }, n.callback = function() {
      lo(t, e);
    };
  }
  var s = t.stateNode;
  return s !== null && typeof s.componentDidCatch == "function" && (n.callback = function() {
    lo(t, e), typeof r != "function" && (dn === null ? dn = /* @__PURE__ */ new Set([this]) : dn.add(this));
    var a = e.stack;
    this.componentDidCatch(e.value, { componentStack: a !== null ? a : "" });
  }), n;
}
function td(t, e, n) {
  var r = t.pingCache;
  if (r === null) {
    r = t.pingCache = new Xv();
    var i = /* @__PURE__ */ new Set();
    r.set(e, i);
  } else i = r.get(e), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(e, i));
  i.has(n) || (i.add(n), t = d0.bind(null, t, e, n), e.then(t, t));
}
function nd(t) {
  do {
    var e;
    if ((e = t.tag === 13) && (e = t.memoizedState, e = e !== null ? e.dehydrated !== null : !0), e) return t;
    t = t.return;
  } while (t !== null);
  return null;
}
function rd(t, e, n, r, i) {
  return t.mode & 1 ? (t.flags |= 65536, t.lanes = i, t) : (t === e ? t.flags |= 65536 : (t.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (e = zt(-1, 1), e.tag = 2, cn(n, e, 1))), n.lanes |= 1), t);
}
var Jv = Wt.ReactCurrentOwner, ze = !1;
function Le(t, e, n, r) {
  e.child = t === null ? wh(e, null, n, r) : Ar(e, t.child, n, r);
}
function id(t, e, n, r, i) {
  n = n.render;
  var s = e.ref;
  return xr(e, i), r = Su(t, e, n, r, s, i), n = xu(), t !== null && !ze ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~i, Ht(t, e, i)) : (Z && n && uu(e), e.flags |= 1, Le(t, e, r, i), e.child);
}
function sd(t, e, n, r, i) {
  if (t === null) {
    var s = n.type;
    return typeof s == "function" && !Lu(s) && s.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (e.tag = 15, e.type = s, Gh(t, e, s, r, i)) : (t = Ps(n.type, null, r, e, e.mode, i), t.ref = e.ref, t.return = e, e.child = t);
  }
  if (s = t.child, !(t.lanes & i)) {
    var a = s.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Ci, n(a, r) && t.ref === e.ref) return Ht(t, e, i);
  }
  return e.flags |= 1, t = hn(s, r), t.ref = e.ref, t.return = e, e.child = t;
}
function Gh(t, e, n, r, i) {
  if (t !== null) {
    var s = t.memoizedProps;
    if (Ci(s, r) && t.ref === e.ref) if (ze = !1, e.pendingProps = r = s, (t.lanes & i) !== 0) t.flags & 131072 && (ze = !0);
    else return e.lanes = t.lanes, Ht(t, e, i);
  }
  return oo(t, e, n, r, i);
}
function Kh(t, e, n) {
  var r = e.pendingProps, i = r.children, s = t !== null ? t.memoizedState : null;
  if (r.mode === "hidden") if (!(e.mode & 1)) e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Q(mr, Ye), Ye |= n;
  else {
    if (!(n & 1073741824)) return t = s !== null ? s.baseLanes | n : n, e.lanes = e.childLanes = 1073741824, e.memoizedState = { baseLanes: t, cachePool: null, transitions: null }, e.updateQueue = null, Q(mr, Ye), Ye |= t, null;
    e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = s !== null ? s.baseLanes : n, Q(mr, Ye), Ye |= r;
  }
  else s !== null ? (r = s.baseLanes | n, e.memoizedState = null) : r = n, Q(mr, Ye), Ye |= r;
  return Le(t, e, i, n), e.child;
}
function Yh(t, e) {
  var n = e.ref;
  (t === null && n !== null || t !== null && t.ref !== n) && (e.flags |= 512, e.flags |= 2097152);
}
function oo(t, e, n, r, i) {
  var s = Be(n) ? Wn : Ae.current;
  return s = jr(e, s), xr(e, i), n = Su(t, e, n, r, s, i), r = xu(), t !== null && !ze ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~i, Ht(t, e, i)) : (Z && r && uu(e), e.flags |= 1, Le(t, e, n, i), e.child);
}
function ad(t, e, n, r, i) {
  if (Be(n)) {
    var s = !0;
    Vs(e);
  } else s = !1;
  if (xr(e, i), e.stateNode === null) Ts(t, e), Vh(e, n, r), ao(e, n, r, i), r = !0;
  else if (t === null) {
    var a = e.stateNode, l = e.memoizedProps;
    a.props = l;
    var o = a.context, u = n.contextType;
    typeof u == "object" && u !== null ? u = pt(u) : (u = Be(n) ? Wn : Ae.current, u = jr(e, u));
    var c = n.getDerivedStateFromProps, f = typeof c == "function" || typeof a.getSnapshotBeforeUpdate == "function";
    f || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (l !== r || o !== u) && ed(e, a, r, u), Yt = !1;
    var p = e.memoizedState;
    a.state = p, Ys(e, r, a, i), o = e.memoizedState, l !== r || p !== o || Fe.current || Yt ? (typeof c == "function" && (so(e, n, c, r), o = e.memoizedState), (l = Yt || Zc(e, n, l, r, p, o, u)) ? (f || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = r, e.memoizedState = o), a.props = r, a.state = o, a.context = u, r = l) : (typeof a.componentDidMount == "function" && (e.flags |= 4194308), r = !1);
  } else {
    a = e.stateNode, xh(t, e), l = e.memoizedProps, u = e.type === e.elementType ? l : vt(e.type, l), a.props = u, f = e.pendingProps, p = a.context, o = n.contextType, typeof o == "object" && o !== null ? o = pt(o) : (o = Be(n) ? Wn : Ae.current, o = jr(e, o));
    var y = n.getDerivedStateFromProps;
    (c = typeof y == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (l !== f || p !== o) && ed(e, a, r, o), Yt = !1, p = e.memoizedState, a.state = p, Ys(e, r, a, i);
    var _ = e.memoizedState;
    l !== f || p !== _ || Fe.current || Yt ? (typeof y == "function" && (so(e, n, y, r), _ = e.memoizedState), (u = Yt || Zc(e, n, u, r, p, _, o) || !1) ? (c || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, _, o), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, _, o)), typeof a.componentDidUpdate == "function" && (e.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || l === t.memoizedProps && p === t.memoizedState || (e.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && p === t.memoizedState || (e.flags |= 1024), e.memoizedProps = r, e.memoizedState = _), a.props = r, a.state = _, a.context = o, r = u) : (typeof a.componentDidUpdate != "function" || l === t.memoizedProps && p === t.memoizedState || (e.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && p === t.memoizedState || (e.flags |= 1024), r = !1);
  }
  return uo(t, e, n, r, s, i);
}
function uo(t, e, n, r, i, s) {
  Yh(t, e);
  var a = (e.flags & 128) !== 0;
  if (!r && !a) return i && Wc(e, n, !1), Ht(t, e, s);
  r = e.stateNode, Jv.current = e;
  var l = a && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return e.flags |= 1, t !== null && a ? (e.child = Ar(e, t.child, null, s), e.child = Ar(e, null, l, s)) : Le(t, e, l, s), e.memoizedState = r.state, i && Wc(e, n, !0), e.child;
}
function Qh(t) {
  var e = t.stateNode;
  e.pendingContext ? $c(t, e.pendingContext, e.pendingContext !== e.context) : e.context && $c(t, e.context, !1), vu(t, e.containerInfo);
}
function ld(t, e, n, r, i) {
  return Pr(), du(i), e.flags |= 256, Le(t, e, n, r), e.child;
}
var co = { dehydrated: null, treeContext: null, retryLane: 0 };
function fo(t) {
  return { baseLanes: t, cachePool: null, transitions: null };
}
function qh(t, e, n) {
  var r = e.pendingProps, i = re.current, s = !1, a = (e.flags & 128) !== 0, l;
  if ((l = a) || (l = t !== null && t.memoizedState === null ? !1 : (i & 2) !== 0), l ? (s = !0, e.flags &= -129) : (t === null || t.memoizedState !== null) && (i |= 1), Q(re, i & 1), t === null)
    return ro(e), t = e.memoizedState, t !== null && (t = t.dehydrated, t !== null) ? (e.mode & 1 ? t.data === "$!" ? e.lanes = 8 : e.lanes = 1073741824 : e.lanes = 1, null) : (a = r.children, t = r.fallback, s ? (r = e.mode, s = e.child, a = { mode: "hidden", children: a }, !(r & 1) && s !== null ? (s.childLanes = 0, s.pendingProps = a) : s = Ta(a, r, 0, null), t = Bn(t, r, n, null), s.return = e, t.return = e, s.sibling = t, e.child = s, e.child.memoizedState = fo(n), e.memoizedState = co, t) : Cu(e, a));
  if (i = t.memoizedState, i !== null && (l = i.dehydrated, l !== null)) return Zv(t, e, a, r, l, i, n);
  if (s) {
    s = r.fallback, a = e.mode, i = t.child, l = i.sibling;
    var o = { mode: "hidden", children: r.children };
    return !(a & 1) && e.child !== i ? (r = e.child, r.childLanes = 0, r.pendingProps = o, e.deletions = null) : (r = hn(i, o), r.subtreeFlags = i.subtreeFlags & 14680064), l !== null ? s = hn(l, s) : (s = Bn(s, a, n, null), s.flags |= 2), s.return = e, r.return = e, r.sibling = s, e.child = r, r = s, s = e.child, a = t.child.memoizedState, a = a === null ? fo(n) : { baseLanes: a.baseLanes | n, cachePool: null, transitions: a.transitions }, s.memoizedState = a, s.childLanes = t.childLanes & ~n, e.memoizedState = co, r;
  }
  return s = t.child, t = s.sibling, r = hn(s, { mode: "visible", children: r.children }), !(e.mode & 1) && (r.lanes = n), r.return = e, r.sibling = null, t !== null && (n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t)), e.child = r, e.memoizedState = null, r;
}
function Cu(t, e) {
  return e = Ta({ mode: "visible", children: e }, t.mode, 0, null), e.return = t, t.child = e;
}
function ds(t, e, n, r) {
  return r !== null && du(r), Ar(e, t.child, null, n), t = Cu(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t;
}
function Zv(t, e, n, r, i, s, a) {
  if (n)
    return e.flags & 256 ? (e.flags &= -257, r = ll(Error(j(422))), ds(t, e, a, r)) : e.memoizedState !== null ? (e.child = t.child, e.flags |= 128, null) : (s = r.fallback, i = e.mode, r = Ta({ mode: "visible", children: r.children }, i, 0, null), s = Bn(s, i, a, null), s.flags |= 2, r.return = e, s.return = e, r.sibling = s, e.child = r, e.mode & 1 && Ar(e, t.child, null, a), e.child.memoizedState = fo(a), e.memoizedState = co, s);
  if (!(e.mode & 1)) return ds(t, e, a, null);
  if (i.data === "$!") {
    if (r = i.nextSibling && i.nextSibling.dataset, r) var l = r.dgst;
    return r = l, s = Error(j(419)), r = ll(s, r, void 0), ds(t, e, a, r);
  }
  if (l = (a & t.childLanes) !== 0, ze || l) {
    if (r = _e, r !== null) {
      switch (a & -a) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      i = i & (r.suspendedLanes | a) ? 0 : i, i !== 0 && i !== s.retryLane && (s.retryLane = i, Ut(t, i), St(r, t, i, -1));
    }
    return bu(), r = ll(Error(j(421))), ds(t, e, a, r);
  }
  return i.data === "$?" ? (e.flags |= 128, e.child = t.child, e = f0.bind(null, t), i._reactRetry = e, null) : (t = s.treeContext, Xe = un(i.nextSibling), et = e, Z = !0, _t = null, t !== null && (ot[ut++] = Ot, ot[ut++] = Dt, ot[ut++] = Gn, Ot = t.id, Dt = t.overflow, Gn = e), e = Cu(e, r.children), e.flags |= 4096, e);
}
function od(t, e, n) {
  t.lanes |= e;
  var r = t.alternate;
  r !== null && (r.lanes |= e), io(t.return, e, n);
}
function ol(t, e, n, r, i) {
  var s = t.memoizedState;
  s === null ? t.memoizedState = { isBackwards: e, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: i } : (s.isBackwards = e, s.rendering = null, s.renderingStartTime = 0, s.last = r, s.tail = n, s.tailMode = i);
}
function Xh(t, e, n) {
  var r = e.pendingProps, i = r.revealOrder, s = r.tail;
  if (Le(t, e, r.children, n), r = re.current, r & 2) r = r & 1 | 2, e.flags |= 128;
  else {
    if (t !== null && t.flags & 128) e: for (t = e.child; t !== null; ) {
      if (t.tag === 13) t.memoizedState !== null && od(t, n, e);
      else if (t.tag === 19) od(t, n, e);
      else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break e;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) break e;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    r &= 1;
  }
  if (Q(re, r), !(e.mode & 1)) e.memoizedState = null;
  else switch (i) {
    case "forwards":
      for (n = e.child, i = null; n !== null; ) t = n.alternate, t !== null && Qs(t) === null && (i = n), n = n.sibling;
      n = i, n === null ? (i = e.child, e.child = null) : (i = n.sibling, n.sibling = null), ol(e, !1, i, n, s);
      break;
    case "backwards":
      for (n = null, i = e.child, e.child = null; i !== null; ) {
        if (t = i.alternate, t !== null && Qs(t) === null) {
          e.child = i;
          break;
        }
        t = i.sibling, i.sibling = n, n = i, i = t;
      }
      ol(e, !0, n, null, s);
      break;
    case "together":
      ol(e, !1, null, null, void 0);
      break;
    default:
      e.memoizedState = null;
  }
  return e.child;
}
function Ts(t, e) {
  !(e.mode & 1) && t !== null && (t.alternate = null, e.alternate = null, e.flags |= 2);
}
function Ht(t, e, n) {
  if (t !== null && (e.dependencies = t.dependencies), Yn |= e.lanes, !(n & e.childLanes)) return null;
  if (t !== null && e.child !== t.child) throw Error(j(153));
  if (e.child !== null) {
    for (t = e.child, n = hn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; ) t = t.sibling, n = n.sibling = hn(t, t.pendingProps), n.return = e;
    n.sibling = null;
  }
  return e.child;
}
function e0(t, e, n) {
  switch (e.tag) {
    case 3:
      Qh(e), Pr();
      break;
    case 5:
      kh(e);
      break;
    case 1:
      Be(e.type) && Vs(e);
      break;
    case 4:
      vu(e, e.stateNode.containerInfo);
      break;
    case 10:
      var r = e.type._context, i = e.memoizedProps.value;
      Q(Gs, r._currentValue), r._currentValue = i;
      break;
    case 13:
      if (r = e.memoizedState, r !== null)
        return r.dehydrated !== null ? (Q(re, re.current & 1), e.flags |= 128, null) : n & e.child.childLanes ? qh(t, e, n) : (Q(re, re.current & 1), t = Ht(t, e, n), t !== null ? t.sibling : null);
      Q(re, re.current & 1);
      break;
    case 19:
      if (r = (n & e.childLanes) !== 0, t.flags & 128) {
        if (r) return Xh(t, e, n);
        e.flags |= 128;
      }
      if (i = e.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Q(re, re.current), r) break;
      return null;
    case 22:
    case 23:
      return e.lanes = 0, Kh(t, e, n);
  }
  return Ht(t, e, n);
}
var Jh, ho, Zh, ep;
Jh = function(t, e) {
  for (var n = e.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) t.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === e) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
ho = function() {
};
Zh = function(t, e, n, r) {
  var i = t.memoizedProps;
  if (i !== r) {
    t = e.stateNode, On(At.current);
    var s = null;
    switch (n) {
      case "input":
        i = Rl(t, i), r = Rl(t, r), s = [];
        break;
      case "select":
        i = le({}, i, { value: void 0 }), r = le({}, r, { value: void 0 }), s = [];
        break;
      case "textarea":
        i = Dl(t, i), r = Dl(t, r), s = [];
        break;
      default:
        typeof i.onClick != "function" && typeof r.onClick == "function" && (t.onclick = Us);
    }
    Fl(n, r);
    var a;
    n = null;
    for (u in i) if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null) if (u === "style") {
      var l = i[u];
      for (a in l) l.hasOwnProperty(a) && (n || (n = {}), n[a] = "");
    } else u !== "dangerouslySetInnerHTML" && u !== "children" && u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (yi.hasOwnProperty(u) ? s || (s = []) : (s = s || []).push(u, null));
    for (u in r) {
      var o = r[u];
      if (l = i != null ? i[u] : void 0, r.hasOwnProperty(u) && o !== l && (o != null || l != null)) if (u === "style") if (l) {
        for (a in l) !l.hasOwnProperty(a) || o && o.hasOwnProperty(a) || (n || (n = {}), n[a] = "");
        for (a in o) o.hasOwnProperty(a) && l[a] !== o[a] && (n || (n = {}), n[a] = o[a]);
      } else n || (s || (s = []), s.push(
        u,
        n
      )), n = o;
      else u === "dangerouslySetInnerHTML" ? (o = o ? o.__html : void 0, l = l ? l.__html : void 0, o != null && l !== o && (s = s || []).push(u, o)) : u === "children" ? typeof o != "string" && typeof o != "number" || (s = s || []).push(u, "" + o) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && (yi.hasOwnProperty(u) ? (o != null && u === "onScroll" && q("scroll", t), s || l === o || (s = [])) : (s = s || []).push(u, o));
    }
    n && (s = s || []).push("style", n);
    var u = s;
    (e.updateQueue = u) && (e.flags |= 4);
  }
};
ep = function(t, e, n, r) {
  n !== r && (e.flags |= 4);
};
function Xr(t, e) {
  if (!Z) switch (t.tailMode) {
    case "hidden":
      e = t.tail;
      for (var n = null; e !== null; ) e.alternate !== null && (n = e), e = e.sibling;
      n === null ? t.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = t.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : r.sibling = null;
  }
}
function Te(t) {
  var e = t.alternate !== null && t.alternate.child === t.child, n = 0, r = 0;
  if (e) for (var i = t.child; i !== null; ) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 14680064, r |= i.flags & 14680064, i.return = t, i = i.sibling;
  else for (i = t.child; i !== null; ) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = t, i = i.sibling;
  return t.subtreeFlags |= r, t.childLanes = n, e;
}
function t0(t, e, n) {
  var r = e.pendingProps;
  switch (cu(e), e.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Te(e), null;
    case 1:
      return Be(e.type) && Hs(), Te(e), null;
    case 3:
      return r = e.stateNode, br(), X(Fe), X(Ae), _u(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (t === null || t.child === null) && (us(e) ? e.flags |= 4 : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, _t !== null && (So(_t), _t = null))), ho(t, e), Te(e), null;
    case 5:
      yu(e);
      var i = On(Ai.current);
      if (n = e.type, t !== null && e.stateNode != null) Zh(t, e, n, r, i), t.ref !== e.ref && (e.flags |= 512, e.flags |= 2097152);
      else {
        if (!r) {
          if (e.stateNode === null) throw Error(j(166));
          return Te(e), null;
        }
        if (t = On(At.current), us(e)) {
          r = e.stateNode, n = e.type;
          var s = e.memoizedProps;
          switch (r[Tt] = e, r[ji] = s, t = (e.mode & 1) !== 0, n) {
            case "dialog":
              q("cancel", r), q("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              q("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < ri.length; i++) q(ri[i], r);
              break;
            case "source":
              q("error", r);
              break;
            case "img":
            case "image":
            case "link":
              q(
                "error",
                r
              ), q("load", r);
              break;
            case "details":
              q("toggle", r);
              break;
            case "input":
              vc(r, s), q("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!s.multiple }, q("invalid", r);
              break;
            case "textarea":
              _c(r, s), q("invalid", r);
          }
          Fl(n, s), i = null;
          for (var a in s) if (s.hasOwnProperty(a)) {
            var l = s[a];
            a === "children" ? typeof l == "string" ? r.textContent !== l && (s.suppressHydrationWarning !== !0 && os(r.textContent, l, t), i = ["children", l]) : typeof l == "number" && r.textContent !== "" + l && (s.suppressHydrationWarning !== !0 && os(
              r.textContent,
              l,
              t
            ), i = ["children", "" + l]) : yi.hasOwnProperty(a) && l != null && a === "onScroll" && q("scroll", r);
          }
          switch (n) {
            case "input":
              es(r), yc(r, s, !0);
              break;
            case "textarea":
              es(r), wc(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (r.onclick = Us);
          }
          r = i, e.updateQueue = r, r !== null && (e.flags |= 4);
        } else {
          a = i.nodeType === 9 ? i : i.ownerDocument, t === "http://www.w3.org/1999/xhtml" && (t = jf(n)), t === "http://www.w3.org/1999/xhtml" ? n === "script" ? (t = a.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild)) : typeof r.is == "string" ? t = a.createElement(n, { is: r.is }) : (t = a.createElement(n), n === "select" && (a = t, r.multiple ? a.multiple = !0 : r.size && (a.size = r.size))) : t = a.createElementNS(t, n), t[Tt] = e, t[ji] = r, Jh(t, e, !1, !1), e.stateNode = t;
          e: {
            switch (a = Bl(n, r), n) {
              case "dialog":
                q("cancel", t), q("close", t), i = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                q("load", t), i = r;
                break;
              case "video":
              case "audio":
                for (i = 0; i < ri.length; i++) q(ri[i], t);
                i = r;
                break;
              case "source":
                q("error", t), i = r;
                break;
              case "img":
              case "image":
              case "link":
                q(
                  "error",
                  t
                ), q("load", t), i = r;
                break;
              case "details":
                q("toggle", t), i = r;
                break;
              case "input":
                vc(t, r), i = Rl(t, r), q("invalid", t);
                break;
              case "option":
                i = r;
                break;
              case "select":
                t._wrapperState = { wasMultiple: !!r.multiple }, i = le({}, r, { value: void 0 }), q("invalid", t);
                break;
              case "textarea":
                _c(t, r), i = Dl(t, r), q("invalid", t);
                break;
              default:
                i = r;
            }
            Fl(n, i), l = i;
            for (s in l) if (l.hasOwnProperty(s)) {
              var o = l[s];
              s === "style" ? bf(t, o) : s === "dangerouslySetInnerHTML" ? (o = o ? o.__html : void 0, o != null && Pf(t, o)) : s === "children" ? typeof o == "string" ? (n !== "textarea" || o !== "") && _i(t, o) : typeof o == "number" && _i(t, "" + o) : s !== "suppressContentEditableWarning" && s !== "suppressHydrationWarning" && s !== "autoFocus" && (yi.hasOwnProperty(s) ? o != null && s === "onScroll" && q("scroll", t) : o != null && Qo(t, s, o, a));
            }
            switch (n) {
              case "input":
                es(t), yc(t, r, !1);
                break;
              case "textarea":
                es(t), wc(t);
                break;
              case "option":
                r.value != null && t.setAttribute("value", "" + gn(r.value));
                break;
              case "select":
                t.multiple = !!r.multiple, s = r.value, s != null ? yr(t, !!r.multiple, s, !1) : r.defaultValue != null && yr(
                  t,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof i.onClick == "function" && (t.onclick = Us);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (e.flags |= 4);
        }
        e.ref !== null && (e.flags |= 512, e.flags |= 2097152);
      }
      return Te(e), null;
    case 6:
      if (t && e.stateNode != null) ep(t, e, t.memoizedProps, r);
      else {
        if (typeof r != "string" && e.stateNode === null) throw Error(j(166));
        if (n = On(Ai.current), On(At.current), us(e)) {
          if (r = e.stateNode, n = e.memoizedProps, r[Tt] = e, (s = r.nodeValue !== n) && (t = et, t !== null)) switch (t.tag) {
            case 3:
              os(r.nodeValue, n, (t.mode & 1) !== 0);
              break;
            case 5:
              t.memoizedProps.suppressHydrationWarning !== !0 && os(r.nodeValue, n, (t.mode & 1) !== 0);
          }
          s && (e.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Tt] = e, e.stateNode = r;
      }
      return Te(e), null;
    case 13:
      if (X(re), r = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
        if (Z && Xe !== null && e.mode & 1 && !(e.flags & 128)) yh(), Pr(), e.flags |= 98560, s = !1;
        else if (s = us(e), r !== null && r.dehydrated !== null) {
          if (t === null) {
            if (!s) throw Error(j(318));
            if (s = e.memoizedState, s = s !== null ? s.dehydrated : null, !s) throw Error(j(317));
            s[Tt] = e;
          } else Pr(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
          Te(e), s = !1;
        } else _t !== null && (So(_t), _t = null), s = !0;
        if (!s) return e.flags & 65536 ? e : null;
      }
      return e.flags & 128 ? (e.lanes = n, e) : (r = r !== null, r !== (t !== null && t.memoizedState !== null) && r && (e.child.flags |= 8192, e.mode & 1 && (t === null || re.current & 1 ? ge === 0 && (ge = 3) : bu())), e.updateQueue !== null && (e.flags |= 4), Te(e), null);
    case 4:
      return br(), ho(t, e), t === null && Ti(e.stateNode.containerInfo), Te(e), null;
    case 10:
      return pu(e.type._context), Te(e), null;
    case 17:
      return Be(e.type) && Hs(), Te(e), null;
    case 19:
      if (X(re), s = e.memoizedState, s === null) return Te(e), null;
      if (r = (e.flags & 128) !== 0, a = s.rendering, a === null) if (r) Xr(s, !1);
      else {
        if (ge !== 0 || t !== null && t.flags & 128) for (t = e.child; t !== null; ) {
          if (a = Qs(t), a !== null) {
            for (e.flags |= 128, Xr(s, !1), r = a.updateQueue, r !== null && (e.updateQueue = r, e.flags |= 4), e.subtreeFlags = 0, r = n, n = e.child; n !== null; ) s = n, t = r, s.flags &= 14680066, a = s.alternate, a === null ? (s.childLanes = 0, s.lanes = t, s.child = null, s.subtreeFlags = 0, s.memoizedProps = null, s.memoizedState = null, s.updateQueue = null, s.dependencies = null, s.stateNode = null) : (s.childLanes = a.childLanes, s.lanes = a.lanes, s.child = a.child, s.subtreeFlags = 0, s.deletions = null, s.memoizedProps = a.memoizedProps, s.memoizedState = a.memoizedState, s.updateQueue = a.updateQueue, s.type = a.type, t = a.dependencies, s.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), n = n.sibling;
            return Q(re, re.current & 1 | 2), e.child;
          }
          t = t.sibling;
        }
        s.tail !== null && fe() > Ir && (e.flags |= 128, r = !0, Xr(s, !1), e.lanes = 4194304);
      }
      else {
        if (!r) if (t = Qs(a), t !== null) {
          if (e.flags |= 128, r = !0, n = t.updateQueue, n !== null && (e.updateQueue = n, e.flags |= 4), Xr(s, !0), s.tail === null && s.tailMode === "hidden" && !a.alternate && !Z) return Te(e), null;
        } else 2 * fe() - s.renderingStartTime > Ir && n !== 1073741824 && (e.flags |= 128, r = !0, Xr(s, !1), e.lanes = 4194304);
        s.isBackwards ? (a.sibling = e.child, e.child = a) : (n = s.last, n !== null ? n.sibling = a : e.child = a, s.last = a);
      }
      return s.tail !== null ? (e = s.tail, s.rendering = e, s.tail = e.sibling, s.renderingStartTime = fe(), e.sibling = null, n = re.current, Q(re, r ? n & 1 | 2 : n & 1), e) : (Te(e), null);
    case 22:
    case 23:
      return Au(), r = e.memoizedState !== null, t !== null && t.memoizedState !== null !== r && (e.flags |= 8192), r && e.mode & 1 ? Ye & 1073741824 && (Te(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Te(e), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(j(156, e.tag));
}
function n0(t, e) {
  switch (cu(e), e.tag) {
    case 1:
      return Be(e.type) && Hs(), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 3:
      return br(), X(Fe), X(Ae), _u(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
    case 5:
      return yu(e), null;
    case 13:
      if (X(re), t = e.memoizedState, t !== null && t.dehydrated !== null) {
        if (e.alternate === null) throw Error(j(340));
        Pr();
      }
      return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 19:
      return X(re), null;
    case 4:
      return br(), null;
    case 10:
      return pu(e.type._context), null;
    case 22:
    case 23:
      return Au(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var fs = !1, Ne = !1, r0 = typeof WeakSet == "function" ? WeakSet : Set, I = null;
function pr(t, e) {
  var n = t.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    ue(t, e, r);
  }
  else n.current = null;
}
function po(t, e, n) {
  try {
    n();
  } catch (r) {
    ue(t, e, r);
  }
}
var ud = !1;
function i0(t, e) {
  if (ql = zs, t = sh(), ou(t)) {
    if ("selectionStart" in t) var n = { start: t.selectionStart, end: t.selectionEnd };
    else e: {
      n = (n = t.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var i = r.anchorOffset, s = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, s.nodeType;
        } catch {
          n = null;
          break e;
        }
        var a = 0, l = -1, o = -1, u = 0, c = 0, f = t, p = null;
        t: for (; ; ) {
          for (var y; f !== n || i !== 0 && f.nodeType !== 3 || (l = a + i), f !== s || r !== 0 && f.nodeType !== 3 || (o = a + r), f.nodeType === 3 && (a += f.nodeValue.length), (y = f.firstChild) !== null; )
            p = f, f = y;
          for (; ; ) {
            if (f === t) break t;
            if (p === n && ++u === i && (l = a), p === s && ++c === r && (o = a), (y = f.nextSibling) !== null) break;
            f = p, p = f.parentNode;
          }
          f = y;
        }
        n = l === -1 || o === -1 ? null : { start: l, end: o };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Xl = { focusedElem: t, selectionRange: n }, zs = !1, I = e; I !== null; ) if (e = I, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, I = t;
  else for (; I !== null; ) {
    e = I;
    try {
      var _ = e.alternate;
      if (e.flags & 1024) switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (_ !== null) {
            var g = _.memoizedProps, x = _.memoizedState, m = e.stateNode, h = m.getSnapshotBeforeUpdate(e.elementType === e.type ? g : vt(e.type, g), x);
            m.__reactInternalSnapshotBeforeUpdate = h;
          }
          break;
        case 3:
          var v = e.stateNode.containerInfo;
          v.nodeType === 1 ? v.textContent = "" : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(j(163));
      }
    } catch (w) {
      ue(e, e.return, w);
    }
    if (t = e.sibling, t !== null) {
      t.return = e.return, I = t;
      break;
    }
    I = e.return;
  }
  return _ = ud, ud = !1, _;
}
function fi(t, e, n) {
  var r = e.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var i = r = r.next;
    do {
      if ((i.tag & t) === t) {
        var s = i.destroy;
        i.destroy = void 0, s !== void 0 && po(e, n, s);
      }
      i = i.next;
    } while (i !== r);
  }
}
function Ea(t, e) {
  if (e = e.updateQueue, e = e !== null ? e.lastEffect : null, e !== null) {
    var n = e = e.next;
    do {
      if ((n.tag & t) === t) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== e);
  }
}
function mo(t) {
  var e = t.ref;
  if (e !== null) {
    var n = t.stateNode;
    switch (t.tag) {
      case 5:
        t = n;
        break;
      default:
        t = n;
    }
    typeof e == "function" ? e(t) : e.current = t;
  }
}
function tp(t) {
  var e = t.alternate;
  e !== null && (t.alternate = null, tp(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && (delete e[Tt], delete e[ji], delete e[eo], delete e[Bv], delete e[Uv])), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
}
function np(t) {
  return t.tag === 5 || t.tag === 3 || t.tag === 4;
}
function cd(t) {
  e: for (; ; ) {
    for (; t.sibling === null; ) {
      if (t.return === null || np(t.return)) return null;
      t = t.return;
    }
    for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
      if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
      t.child.return = t, t = t.child;
    }
    if (!(t.flags & 2)) return t.stateNode;
  }
}
function go(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.nodeType === 8 ? n.parentNode.insertBefore(t, e) : n.insertBefore(t, e) : (n.nodeType === 8 ? (e = n.parentNode, e.insertBefore(t, n)) : (e = n, e.appendChild(t)), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = Us));
  else if (r !== 4 && (t = t.child, t !== null)) for (go(t, e, n), t = t.sibling; t !== null; ) go(t, e, n), t = t.sibling;
}
function vo(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
  else if (r !== 4 && (t = t.child, t !== null)) for (vo(t, e, n), t = t.sibling; t !== null; ) vo(t, e, n), t = t.sibling;
}
var Se = null, yt = !1;
function Gt(t, e, n) {
  for (n = n.child; n !== null; ) rp(t, e, n), n = n.sibling;
}
function rp(t, e, n) {
  if (Pt && typeof Pt.onCommitFiberUnmount == "function") try {
    Pt.onCommitFiberUnmount(ga, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      Ne || pr(n, e);
    case 6:
      var r = Se, i = yt;
      Se = null, Gt(t, e, n), Se = r, yt = i, Se !== null && (yt ? (t = Se, n = n.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(n) : t.removeChild(n)) : Se.removeChild(n.stateNode));
      break;
    case 18:
      Se !== null && (yt ? (t = Se, n = n.stateNode, t.nodeType === 8 ? tl(t.parentNode, n) : t.nodeType === 1 && tl(t, n), ki(t)) : tl(Se, n.stateNode));
      break;
    case 4:
      r = Se, i = yt, Se = n.stateNode.containerInfo, yt = !0, Gt(t, e, n), Se = r, yt = i;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Ne && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        i = r = r.next;
        do {
          var s = i, a = s.destroy;
          s = s.tag, a !== void 0 && (s & 2 || s & 4) && po(n, e, a), i = i.next;
        } while (i !== r);
      }
      Gt(t, e, n);
      break;
    case 1:
      if (!Ne && (pr(n, e), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (l) {
        ue(n, e, l);
      }
      Gt(t, e, n);
      break;
    case 21:
      Gt(t, e, n);
      break;
    case 22:
      n.mode & 1 ? (Ne = (r = Ne) || n.memoizedState !== null, Gt(t, e, n), Ne = r) : Gt(t, e, n);
      break;
    default:
      Gt(t, e, n);
  }
}
function dd(t) {
  var e = t.updateQueue;
  if (e !== null) {
    t.updateQueue = null;
    var n = t.stateNode;
    n === null && (n = t.stateNode = new r0()), e.forEach(function(r) {
      var i = h0.bind(null, t, r);
      n.has(r) || (n.add(r), r.then(i, i));
    });
  }
}
function gt(t, e) {
  var n = e.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var i = n[r];
    try {
      var s = t, a = e, l = a;
      e: for (; l !== null; ) {
        switch (l.tag) {
          case 5:
            Se = l.stateNode, yt = !1;
            break e;
          case 3:
            Se = l.stateNode.containerInfo, yt = !0;
            break e;
          case 4:
            Se = l.stateNode.containerInfo, yt = !0;
            break e;
        }
        l = l.return;
      }
      if (Se === null) throw Error(j(160));
      rp(s, a, i), Se = null, yt = !1;
      var o = i.alternate;
      o !== null && (o.return = null), i.return = null;
    } catch (u) {
      ue(i, e, u);
    }
  }
  if (e.subtreeFlags & 12854) for (e = e.child; e !== null; ) ip(e, t), e = e.sibling;
}
function ip(t, e) {
  var n = t.alternate, r = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (gt(e, t), kt(t), r & 4) {
        try {
          fi(3, t, t.return), Ea(3, t);
        } catch (g) {
          ue(t, t.return, g);
        }
        try {
          fi(5, t, t.return);
        } catch (g) {
          ue(t, t.return, g);
        }
      }
      break;
    case 1:
      gt(e, t), kt(t), r & 512 && n !== null && pr(n, n.return);
      break;
    case 5:
      if (gt(e, t), kt(t), r & 512 && n !== null && pr(n, n.return), t.flags & 32) {
        var i = t.stateNode;
        try {
          _i(i, "");
        } catch (g) {
          ue(t, t.return, g);
        }
      }
      if (r & 4 && (i = t.stateNode, i != null)) {
        var s = t.memoizedProps, a = n !== null ? n.memoizedProps : s, l = t.type, o = t.updateQueue;
        if (t.updateQueue = null, o !== null) try {
          l === "input" && s.type === "radio" && s.name != null && Tf(i, s), Bl(l, a);
          var u = Bl(l, s);
          for (a = 0; a < o.length; a += 2) {
            var c = o[a], f = o[a + 1];
            c === "style" ? bf(i, f) : c === "dangerouslySetInnerHTML" ? Pf(i, f) : c === "children" ? _i(i, f) : Qo(i, c, f, u);
          }
          switch (l) {
            case "input":
              Ml(i, s);
              break;
            case "textarea":
              Nf(i, s);
              break;
            case "select":
              var p = i._wrapperState.wasMultiple;
              i._wrapperState.wasMultiple = !!s.multiple;
              var y = s.value;
              y != null ? yr(i, !!s.multiple, y, !1) : p !== !!s.multiple && (s.defaultValue != null ? yr(
                i,
                !!s.multiple,
                s.defaultValue,
                !0
              ) : yr(i, !!s.multiple, s.multiple ? [] : "", !1));
          }
          i[ji] = s;
        } catch (g) {
          ue(t, t.return, g);
        }
      }
      break;
    case 6:
      if (gt(e, t), kt(t), r & 4) {
        if (t.stateNode === null) throw Error(j(162));
        i = t.stateNode, s = t.memoizedProps;
        try {
          i.nodeValue = s;
        } catch (g) {
          ue(t, t.return, g);
        }
      }
      break;
    case 3:
      if (gt(e, t), kt(t), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        ki(e.containerInfo);
      } catch (g) {
        ue(t, t.return, g);
      }
      break;
    case 4:
      gt(e, t), kt(t);
      break;
    case 13:
      gt(e, t), kt(t), i = t.child, i.flags & 8192 && (s = i.memoizedState !== null, i.stateNode.isHidden = s, !s || i.alternate !== null && i.alternate.memoizedState !== null || (ju = fe())), r & 4 && dd(t);
      break;
    case 22:
      if (c = n !== null && n.memoizedState !== null, t.mode & 1 ? (Ne = (u = Ne) || c, gt(e, t), Ne = u) : gt(e, t), kt(t), r & 8192) {
        if (u = t.memoizedState !== null, (t.stateNode.isHidden = u) && !c && t.mode & 1) for (I = t, c = t.child; c !== null; ) {
          for (f = I = c; I !== null; ) {
            switch (p = I, y = p.child, p.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                fi(4, p, p.return);
                break;
              case 1:
                pr(p, p.return);
                var _ = p.stateNode;
                if (typeof _.componentWillUnmount == "function") {
                  r = p, n = p.return;
                  try {
                    e = r, _.props = e.memoizedProps, _.state = e.memoizedState, _.componentWillUnmount();
                  } catch (g) {
                    ue(r, n, g);
                  }
                }
                break;
              case 5:
                pr(p, p.return);
                break;
              case 22:
                if (p.memoizedState !== null) {
                  hd(f);
                  continue;
                }
            }
            y !== null ? (y.return = p, I = y) : hd(f);
          }
          c = c.sibling;
        }
        e: for (c = null, f = t; ; ) {
          if (f.tag === 5) {
            if (c === null) {
              c = f;
              try {
                i = f.stateNode, u ? (s = i.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none") : (l = f.stateNode, o = f.memoizedProps.style, a = o != null && o.hasOwnProperty("display") ? o.display : null, l.style.display = Af("display", a));
              } catch (g) {
                ue(t, t.return, g);
              }
            }
          } else if (f.tag === 6) {
            if (c === null) try {
              f.stateNode.nodeValue = u ? "" : f.memoizedProps;
            } catch (g) {
              ue(t, t.return, g);
            }
          } else if ((f.tag !== 22 && f.tag !== 23 || f.memoizedState === null || f === t) && f.child !== null) {
            f.child.return = f, f = f.child;
            continue;
          }
          if (f === t) break e;
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === t) break e;
            c === f && (c = null), f = f.return;
          }
          c === f && (c = null), f.sibling.return = f.return, f = f.sibling;
        }
      }
      break;
    case 19:
      gt(e, t), kt(t), r & 4 && dd(t);
      break;
    case 21:
      break;
    default:
      gt(
        e,
        t
      ), kt(t);
  }
}
function kt(t) {
  var e = t.flags;
  if (e & 2) {
    try {
      e: {
        for (var n = t.return; n !== null; ) {
          if (np(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(j(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          r.flags & 32 && (_i(i, ""), r.flags &= -33);
          var s = cd(t);
          vo(t, s, i);
          break;
        case 3:
        case 4:
          var a = r.stateNode.containerInfo, l = cd(t);
          go(t, l, a);
          break;
        default:
          throw Error(j(161));
      }
    } catch (o) {
      ue(t, t.return, o);
    }
    t.flags &= -3;
  }
  e & 4096 && (t.flags &= -4097);
}
function s0(t, e, n) {
  I = t, sp(t);
}
function sp(t, e, n) {
  for (var r = (t.mode & 1) !== 0; I !== null; ) {
    var i = I, s = i.child;
    if (i.tag === 22 && r) {
      var a = i.memoizedState !== null || fs;
      if (!a) {
        var l = i.alternate, o = l !== null && l.memoizedState !== null || Ne;
        l = fs;
        var u = Ne;
        if (fs = a, (Ne = o) && !u) for (I = i; I !== null; ) a = I, o = a.child, a.tag === 22 && a.memoizedState !== null ? pd(i) : o !== null ? (o.return = a, I = o) : pd(i);
        for (; s !== null; ) I = s, sp(s), s = s.sibling;
        I = i, fs = l, Ne = u;
      }
      fd(t);
    } else i.subtreeFlags & 8772 && s !== null ? (s.return = i, I = s) : fd(t);
  }
}
function fd(t) {
  for (; I !== null; ) {
    var e = I;
    if (e.flags & 8772) {
      var n = e.alternate;
      try {
        if (e.flags & 8772) switch (e.tag) {
          case 0:
          case 11:
          case 15:
            Ne || Ea(5, e);
            break;
          case 1:
            var r = e.stateNode;
            if (e.flags & 4 && !Ne) if (n === null) r.componentDidMount();
            else {
              var i = e.elementType === e.type ? n.memoizedProps : vt(e.type, n.memoizedProps);
              r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var s = e.updateQueue;
            s !== null && qc(e, s, r);
            break;
          case 3:
            var a = e.updateQueue;
            if (a !== null) {
              if (n = null, e.child !== null) switch (e.child.tag) {
                case 5:
                  n = e.child.stateNode;
                  break;
                case 1:
                  n = e.child.stateNode;
              }
              qc(e, a, n);
            }
            break;
          case 5:
            var l = e.stateNode;
            if (n === null && e.flags & 4) {
              n = l;
              var o = e.memoizedProps;
              switch (e.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o.autoFocus && n.focus();
                  break;
                case "img":
                  o.src && (n.src = o.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (e.memoizedState === null) {
              var u = e.alternate;
              if (u !== null) {
                var c = u.memoizedState;
                if (c !== null) {
                  var f = c.dehydrated;
                  f !== null && ki(f);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(j(163));
        }
        Ne || e.flags & 512 && mo(e);
      } catch (p) {
        ue(e, e.return, p);
      }
    }
    if (e === t) {
      I = null;
      break;
    }
    if (n = e.sibling, n !== null) {
      n.return = e.return, I = n;
      break;
    }
    I = e.return;
  }
}
function hd(t) {
  for (; I !== null; ) {
    var e = I;
    if (e === t) {
      I = null;
      break;
    }
    var n = e.sibling;
    if (n !== null) {
      n.return = e.return, I = n;
      break;
    }
    I = e.return;
  }
}
function pd(t) {
  for (; I !== null; ) {
    var e = I;
    try {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          var n = e.return;
          try {
            Ea(4, e);
          } catch (o) {
            ue(e, n, o);
          }
          break;
        case 1:
          var r = e.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = e.return;
            try {
              r.componentDidMount();
            } catch (o) {
              ue(e, i, o);
            }
          }
          var s = e.return;
          try {
            mo(e);
          } catch (o) {
            ue(e, s, o);
          }
          break;
        case 5:
          var a = e.return;
          try {
            mo(e);
          } catch (o) {
            ue(e, a, o);
          }
      }
    } catch (o) {
      ue(e, e.return, o);
    }
    if (e === t) {
      I = null;
      break;
    }
    var l = e.sibling;
    if (l !== null) {
      l.return = e.return, I = l;
      break;
    }
    I = e.return;
  }
}
var a0 = Math.ceil, Js = Wt.ReactCurrentDispatcher, Tu = Wt.ReactCurrentOwner, ht = Wt.ReactCurrentBatchConfig, $ = 0, _e = null, pe = null, xe = 0, Ye = 0, mr = xn(0), ge = 0, Ri = null, Yn = 0, Ca = 0, Nu = 0, hi = null, De = null, ju = 0, Ir = 1 / 0, Lt = null, Zs = !1, yo = null, dn = null, hs = !1, en = null, ea = 0, pi = 0, _o = null, Ns = -1, js = 0;
function Re() {
  return $ & 6 ? fe() : Ns !== -1 ? Ns : Ns = fe();
}
function fn(t) {
  return t.mode & 1 ? $ & 2 && xe !== 0 ? xe & -xe : Vv.transition !== null ? (js === 0 && (js = Vf()), js) : (t = G, t !== 0 || (t = window.event, t = t === void 0 ? 16 : qf(t.type)), t) : 1;
}
function St(t, e, n, r) {
  if (50 < pi) throw pi = 0, _o = null, Error(j(185));
  Wi(t, n, r), (!($ & 2) || t !== _e) && (t === _e && (!($ & 2) && (Ca |= n), ge === 4 && Jt(t, xe)), Ue(t, r), n === 1 && $ === 0 && !(e.mode & 1) && (Ir = fe() + 500, Sa && kn()));
}
function Ue(t, e) {
  var n = t.callbackNode;
  Vg(t, e);
  var r = Ds(t, t === _e ? xe : 0);
  if (r === 0) n !== null && kc(n), t.callbackNode = null, t.callbackPriority = 0;
  else if (e = r & -r, t.callbackPriority !== e) {
    if (n != null && kc(n), e === 1) t.tag === 0 ? Hv(md.bind(null, t)) : mh(md.bind(null, t)), zv(function() {
      !($ & 6) && kn();
    }), n = null;
    else {
      switch ($f(r)) {
        case 1:
          n = eu;
          break;
        case 4:
          n = Uf;
          break;
        case 16:
          n = Os;
          break;
        case 536870912:
          n = Hf;
          break;
        default:
          n = Os;
      }
      n = hp(n, ap.bind(null, t));
    }
    t.callbackPriority = e, t.callbackNode = n;
  }
}
function ap(t, e) {
  if (Ns = -1, js = 0, $ & 6) throw Error(j(327));
  var n = t.callbackNode;
  if (kr() && t.callbackNode !== n) return null;
  var r = Ds(t, t === _e ? xe : 0);
  if (r === 0) return null;
  if (r & 30 || r & t.expiredLanes || e) e = ta(t, r);
  else {
    e = r;
    var i = $;
    $ |= 2;
    var s = op();
    (_e !== t || xe !== e) && (Lt = null, Ir = fe() + 500, Fn(t, e));
    do
      try {
        u0();
        break;
      } catch (l) {
        lp(t, l);
      }
    while (!0);
    hu(), Js.current = s, $ = i, pe !== null ? e = 0 : (_e = null, xe = 0, e = ge);
  }
  if (e !== 0) {
    if (e === 2 && (i = Wl(t), i !== 0 && (r = i, e = wo(t, i))), e === 1) throw n = Ri, Fn(t, 0), Jt(t, r), Ue(t, fe()), n;
    if (e === 6) Jt(t, r);
    else {
      if (i = t.current.alternate, !(r & 30) && !l0(i) && (e = ta(t, r), e === 2 && (s = Wl(t), s !== 0 && (r = s, e = wo(t, s))), e === 1)) throw n = Ri, Fn(t, 0), Jt(t, r), Ue(t, fe()), n;
      switch (t.finishedWork = i, t.finishedLanes = r, e) {
        case 0:
        case 1:
          throw Error(j(345));
        case 2:
          Ln(t, De, Lt);
          break;
        case 3:
          if (Jt(t, r), (r & 130023424) === r && (e = ju + 500 - fe(), 10 < e)) {
            if (Ds(t, 0) !== 0) break;
            if (i = t.suspendedLanes, (i & r) !== r) {
              Re(), t.pingedLanes |= t.suspendedLanes & i;
              break;
            }
            t.timeoutHandle = Zl(Ln.bind(null, t, De, Lt), e);
            break;
          }
          Ln(t, De, Lt);
          break;
        case 4:
          if (Jt(t, r), (r & 4194240) === r) break;
          for (e = t.eventTimes, i = -1; 0 < r; ) {
            var a = 31 - wt(r);
            s = 1 << a, a = e[a], a > i && (i = a), r &= ~s;
          }
          if (r = i, r = fe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * a0(r / 1960)) - r, 10 < r) {
            t.timeoutHandle = Zl(Ln.bind(null, t, De, Lt), r);
            break;
          }
          Ln(t, De, Lt);
          break;
        case 5:
          Ln(t, De, Lt);
          break;
        default:
          throw Error(j(329));
      }
    }
  }
  return Ue(t, fe()), t.callbackNode === n ? ap.bind(null, t) : null;
}
function wo(t, e) {
  var n = hi;
  return t.current.memoizedState.isDehydrated && (Fn(t, e).flags |= 256), t = ta(t, e), t !== 2 && (e = De, De = n, e !== null && So(e)), t;
}
function So(t) {
  De === null ? De = t : De.push.apply(De, t);
}
function l0(t) {
  for (var e = t; ; ) {
    if (e.flags & 16384) {
      var n = e.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var i = n[r], s = i.getSnapshot;
        i = i.value;
        try {
          if (!xt(s(), i)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = e.child, e.subtreeFlags & 16384 && n !== null) n.return = e, e = n;
    else {
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return !0;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
  }
  return !0;
}
function Jt(t, e) {
  for (e &= ~Nu, e &= ~Ca, t.suspendedLanes |= e, t.pingedLanes &= ~e, t = t.expirationTimes; 0 < e; ) {
    var n = 31 - wt(e), r = 1 << n;
    t[n] = -1, e &= ~r;
  }
}
function md(t) {
  if ($ & 6) throw Error(j(327));
  kr();
  var e = Ds(t, 0);
  if (!(e & 1)) return Ue(t, fe()), null;
  var n = ta(t, e);
  if (t.tag !== 0 && n === 2) {
    var r = Wl(t);
    r !== 0 && (e = r, n = wo(t, r));
  }
  if (n === 1) throw n = Ri, Fn(t, 0), Jt(t, e), Ue(t, fe()), n;
  if (n === 6) throw Error(j(345));
  return t.finishedWork = t.current.alternate, t.finishedLanes = e, Ln(t, De, Lt), Ue(t, fe()), null;
}
function Pu(t, e) {
  var n = $;
  $ |= 1;
  try {
    return t(e);
  } finally {
    $ = n, $ === 0 && (Ir = fe() + 500, Sa && kn());
  }
}
function Qn(t) {
  en !== null && en.tag === 0 && !($ & 6) && kr();
  var e = $;
  $ |= 1;
  var n = ht.transition, r = G;
  try {
    if (ht.transition = null, G = 1, t) return t();
  } finally {
    G = r, ht.transition = n, $ = e, !($ & 6) && kn();
  }
}
function Au() {
  Ye = mr.current, X(mr);
}
function Fn(t, e) {
  t.finishedWork = null, t.finishedLanes = 0;
  var n = t.timeoutHandle;
  if (n !== -1 && (t.timeoutHandle = -1, Dv(n)), pe !== null) for (n = pe.return; n !== null; ) {
    var r = n;
    switch (cu(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Hs();
        break;
      case 3:
        br(), X(Fe), X(Ae), _u();
        break;
      case 5:
        yu(r);
        break;
      case 4:
        br();
        break;
      case 13:
        X(re);
        break;
      case 19:
        X(re);
        break;
      case 10:
        pu(r.type._context);
        break;
      case 22:
      case 23:
        Au();
    }
    n = n.return;
  }
  if (_e = t, pe = t = hn(t.current, null), xe = Ye = e, ge = 0, Ri = null, Nu = Ca = Yn = 0, De = hi = null, Mn !== null) {
    for (e = 0; e < Mn.length; e++) if (n = Mn[e], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var i = r.next, s = n.pending;
      if (s !== null) {
        var a = s.next;
        s.next = i, r.next = a;
      }
      n.pending = r;
    }
    Mn = null;
  }
  return t;
}
function lp(t, e) {
  do {
    var n = pe;
    try {
      if (hu(), Es.current = Xs, qs) {
        for (var r = ae.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), r = r.next;
        }
        qs = !1;
      }
      if (Kn = 0, ye = me = ae = null, di = !1, bi = 0, Tu.current = null, n === null || n.return === null) {
        ge = 1, Ri = e, pe = null;
        break;
      }
      e: {
        var s = t, a = n.return, l = n, o = e;
        if (e = xe, l.flags |= 32768, o !== null && typeof o == "object" && typeof o.then == "function") {
          var u = o, c = l, f = c.tag;
          if (!(c.mode & 1) && (f === 0 || f === 11 || f === 15)) {
            var p = c.alternate;
            p ? (c.updateQueue = p.updateQueue, c.memoizedState = p.memoizedState, c.lanes = p.lanes) : (c.updateQueue = null, c.memoizedState = null);
          }
          var y = nd(a);
          if (y !== null) {
            y.flags &= -257, rd(y, a, l, s, e), y.mode & 1 && td(s, u, e), e = y, o = u;
            var _ = e.updateQueue;
            if (_ === null) {
              var g = /* @__PURE__ */ new Set();
              g.add(o), e.updateQueue = g;
            } else _.add(o);
            break e;
          } else {
            if (!(e & 1)) {
              td(s, u, e), bu();
              break e;
            }
            o = Error(j(426));
          }
        } else if (Z && l.mode & 1) {
          var x = nd(a);
          if (x !== null) {
            !(x.flags & 65536) && (x.flags |= 256), rd(x, a, l, s, e), du(Lr(o, l));
            break e;
          }
        }
        s = o = Lr(o, l), ge !== 4 && (ge = 2), hi === null ? hi = [s] : hi.push(s), s = a;
        do {
          switch (s.tag) {
            case 3:
              s.flags |= 65536, e &= -e, s.lanes |= e;
              var m = $h(s, o, e);
              Qc(s, m);
              break e;
            case 1:
              l = o;
              var h = s.type, v = s.stateNode;
              if (!(s.flags & 128) && (typeof h.getDerivedStateFromError == "function" || v !== null && typeof v.componentDidCatch == "function" && (dn === null || !dn.has(v)))) {
                s.flags |= 65536, e &= -e, s.lanes |= e;
                var w = Wh(s, l, e);
                Qc(s, w);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      cp(n);
    } catch (S) {
      e = S, pe === n && n !== null && (pe = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function op() {
  var t = Js.current;
  return Js.current = Xs, t === null ? Xs : t;
}
function bu() {
  (ge === 0 || ge === 3 || ge === 2) && (ge = 4), _e === null || !(Yn & 268435455) && !(Ca & 268435455) || Jt(_e, xe);
}
function ta(t, e) {
  var n = $;
  $ |= 2;
  var r = op();
  (_e !== t || xe !== e) && (Lt = null, Fn(t, e));
  do
    try {
      o0();
      break;
    } catch (i) {
      lp(t, i);
    }
  while (!0);
  if (hu(), $ = n, Js.current = r, pe !== null) throw Error(j(261));
  return _e = null, xe = 0, ge;
}
function o0() {
  for (; pe !== null; ) up(pe);
}
function u0() {
  for (; pe !== null && !Rg(); ) up(pe);
}
function up(t) {
  var e = fp(t.alternate, t, Ye);
  t.memoizedProps = t.pendingProps, e === null ? cp(t) : pe = e, Tu.current = null;
}
function cp(t) {
  var e = t;
  do {
    var n = e.alternate;
    if (t = e.return, e.flags & 32768) {
      if (n = n0(n, e), n !== null) {
        n.flags &= 32767, pe = n;
        return;
      }
      if (t !== null) t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null;
      else {
        ge = 6, pe = null;
        return;
      }
    } else if (n = t0(n, e, Ye), n !== null) {
      pe = n;
      return;
    }
    if (e = e.sibling, e !== null) {
      pe = e;
      return;
    }
    pe = e = t;
  } while (e !== null);
  ge === 0 && (ge = 5);
}
function Ln(t, e, n) {
  var r = G, i = ht.transition;
  try {
    ht.transition = null, G = 1, c0(t, e, n, r);
  } finally {
    ht.transition = i, G = r;
  }
  return null;
}
function c0(t, e, n, r) {
  do
    kr();
  while (en !== null);
  if ($ & 6) throw Error(j(327));
  n = t.finishedWork;
  var i = t.finishedLanes;
  if (n === null) return null;
  if (t.finishedWork = null, t.finishedLanes = 0, n === t.current) throw Error(j(177));
  t.callbackNode = null, t.callbackPriority = 0;
  var s = n.lanes | n.childLanes;
  if ($g(t, s), t === _e && (pe = _e = null, xe = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || hs || (hs = !0, hp(Os, function() {
    return kr(), null;
  })), s = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || s) {
    s = ht.transition, ht.transition = null;
    var a = G;
    G = 1;
    var l = $;
    $ |= 4, Tu.current = null, i0(t, n), ip(n, t), Av(Xl), zs = !!ql, Xl = ql = null, t.current = n, s0(n), Mg(), $ = l, G = a, ht.transition = s;
  } else t.current = n;
  if (hs && (hs = !1, en = t, ea = i), s = t.pendingLanes, s === 0 && (dn = null), zg(n.stateNode), Ue(t, fe()), e !== null) for (r = t.onRecoverableError, n = 0; n < e.length; n++) i = e[n], r(i.value, { componentStack: i.stack, digest: i.digest });
  if (Zs) throw Zs = !1, t = yo, yo = null, t;
  return ea & 1 && t.tag !== 0 && kr(), s = t.pendingLanes, s & 1 ? t === _o ? pi++ : (pi = 0, _o = t) : pi = 0, kn(), null;
}
function kr() {
  if (en !== null) {
    var t = $f(ea), e = ht.transition, n = G;
    try {
      if (ht.transition = null, G = 16 > t ? 16 : t, en === null) var r = !1;
      else {
        if (t = en, en = null, ea = 0, $ & 6) throw Error(j(331));
        var i = $;
        for ($ |= 4, I = t.current; I !== null; ) {
          var s = I, a = s.child;
          if (I.flags & 16) {
            var l = s.deletions;
            if (l !== null) {
              for (var o = 0; o < l.length; o++) {
                var u = l[o];
                for (I = u; I !== null; ) {
                  var c = I;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      fi(8, c, s);
                  }
                  var f = c.child;
                  if (f !== null) f.return = c, I = f;
                  else for (; I !== null; ) {
                    c = I;
                    var p = c.sibling, y = c.return;
                    if (tp(c), c === u) {
                      I = null;
                      break;
                    }
                    if (p !== null) {
                      p.return = y, I = p;
                      break;
                    }
                    I = y;
                  }
                }
              }
              var _ = s.alternate;
              if (_ !== null) {
                var g = _.child;
                if (g !== null) {
                  _.child = null;
                  do {
                    var x = g.sibling;
                    g.sibling = null, g = x;
                  } while (g !== null);
                }
              }
              I = s;
            }
          }
          if (s.subtreeFlags & 2064 && a !== null) a.return = s, I = a;
          else e: for (; I !== null; ) {
            if (s = I, s.flags & 2048) switch (s.tag) {
              case 0:
              case 11:
              case 15:
                fi(9, s, s.return);
            }
            var m = s.sibling;
            if (m !== null) {
              m.return = s.return, I = m;
              break e;
            }
            I = s.return;
          }
        }
        var h = t.current;
        for (I = h; I !== null; ) {
          a = I;
          var v = a.child;
          if (a.subtreeFlags & 2064 && v !== null) v.return = a, I = v;
          else e: for (a = h; I !== null; ) {
            if (l = I, l.flags & 2048) try {
              switch (l.tag) {
                case 0:
                case 11:
                case 15:
                  Ea(9, l);
              }
            } catch (S) {
              ue(l, l.return, S);
            }
            if (l === a) {
              I = null;
              break e;
            }
            var w = l.sibling;
            if (w !== null) {
              w.return = l.return, I = w;
              break e;
            }
            I = l.return;
          }
        }
        if ($ = i, kn(), Pt && typeof Pt.onPostCommitFiberRoot == "function") try {
          Pt.onPostCommitFiberRoot(ga, t);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      G = n, ht.transition = e;
    }
  }
  return !1;
}
function gd(t, e, n) {
  e = Lr(n, e), e = $h(t, e, 1), t = cn(t, e, 1), e = Re(), t !== null && (Wi(t, 1, e), Ue(t, e));
}
function ue(t, e, n) {
  if (t.tag === 3) gd(t, t, n);
  else for (; e !== null; ) {
    if (e.tag === 3) {
      gd(e, t, n);
      break;
    } else if (e.tag === 1) {
      var r = e.stateNode;
      if (typeof e.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (dn === null || !dn.has(r))) {
        t = Lr(n, t), t = Wh(e, t, 1), e = cn(e, t, 1), t = Re(), e !== null && (Wi(e, 1, t), Ue(e, t));
        break;
      }
    }
    e = e.return;
  }
}
function d0(t, e, n) {
  var r = t.pingCache;
  r !== null && r.delete(e), e = Re(), t.pingedLanes |= t.suspendedLanes & n, _e === t && (xe & n) === n && (ge === 4 || ge === 3 && (xe & 130023424) === xe && 500 > fe() - ju ? Fn(t, 0) : Nu |= n), Ue(t, e);
}
function dp(t, e) {
  e === 0 && (t.mode & 1 ? (e = rs, rs <<= 1, !(rs & 130023424) && (rs = 4194304)) : e = 1);
  var n = Re();
  t = Ut(t, e), t !== null && (Wi(t, e, n), Ue(t, n));
}
function f0(t) {
  var e = t.memoizedState, n = 0;
  e !== null && (n = e.retryLane), dp(t, n);
}
function h0(t, e) {
  var n = 0;
  switch (t.tag) {
    case 13:
      var r = t.stateNode, i = t.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = t.stateNode;
      break;
    default:
      throw Error(j(314));
  }
  r !== null && r.delete(e), dp(t, n);
}
var fp;
fp = function(t, e, n) {
  if (t !== null) if (t.memoizedProps !== e.pendingProps || Fe.current) ze = !0;
  else {
    if (!(t.lanes & n) && !(e.flags & 128)) return ze = !1, e0(t, e, n);
    ze = !!(t.flags & 131072);
  }
  else ze = !1, Z && e.flags & 1048576 && gh(e, Ws, e.index);
  switch (e.lanes = 0, e.tag) {
    case 2:
      var r = e.type;
      Ts(t, e), t = e.pendingProps;
      var i = jr(e, Ae.current);
      xr(e, n), i = Su(null, e, r, t, i, n);
      var s = xu();
      return e.flags |= 1, typeof i == "object" && i !== null && typeof i.render == "function" && i.$$typeof === void 0 ? (e.tag = 1, e.memoizedState = null, e.updateQueue = null, Be(r) ? (s = !0, Vs(e)) : s = !1, e.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, gu(e), i.updater = ka, e.stateNode = i, i._reactInternals = e, ao(e, r, t, n), e = uo(null, e, r, !0, s, n)) : (e.tag = 0, Z && s && uu(e), Le(null, e, i, n), e = e.child), e;
    case 16:
      r = e.elementType;
      e: {
        switch (Ts(t, e), t = e.pendingProps, i = r._init, r = i(r._payload), e.type = r, i = e.tag = m0(r), t = vt(r, t), i) {
          case 0:
            e = oo(null, e, r, t, n);
            break e;
          case 1:
            e = ad(null, e, r, t, n);
            break e;
          case 11:
            e = id(null, e, r, t, n);
            break e;
          case 14:
            e = sd(null, e, r, vt(r.type, t), n);
            break e;
        }
        throw Error(j(
          306,
          r,
          ""
        ));
      }
      return e;
    case 0:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : vt(r, i), oo(t, e, r, i, n);
    case 1:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : vt(r, i), ad(t, e, r, i, n);
    case 3:
      e: {
        if (Qh(e), t === null) throw Error(j(387));
        r = e.pendingProps, s = e.memoizedState, i = s.element, xh(t, e), Ys(e, r, null, n);
        var a = e.memoizedState;
        if (r = a.element, s.isDehydrated) if (s = { element: r, isDehydrated: !1, cache: a.cache, pendingSuspenseBoundaries: a.pendingSuspenseBoundaries, transitions: a.transitions }, e.updateQueue.baseState = s, e.memoizedState = s, e.flags & 256) {
          i = Lr(Error(j(423)), e), e = ld(t, e, r, n, i);
          break e;
        } else if (r !== i) {
          i = Lr(Error(j(424)), e), e = ld(t, e, r, n, i);
          break e;
        } else for (Xe = un(e.stateNode.containerInfo.firstChild), et = e, Z = !0, _t = null, n = wh(e, null, r, n), e.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (Pr(), r === i) {
            e = Ht(t, e, n);
            break e;
          }
          Le(t, e, r, n);
        }
        e = e.child;
      }
      return e;
    case 5:
      return kh(e), t === null && ro(e), r = e.type, i = e.pendingProps, s = t !== null ? t.memoizedProps : null, a = i.children, Jl(r, i) ? a = null : s !== null && Jl(r, s) && (e.flags |= 32), Yh(t, e), Le(t, e, a, n), e.child;
    case 6:
      return t === null && ro(e), null;
    case 13:
      return qh(t, e, n);
    case 4:
      return vu(e, e.stateNode.containerInfo), r = e.pendingProps, t === null ? e.child = Ar(e, null, r, n) : Le(t, e, r, n), e.child;
    case 11:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : vt(r, i), id(t, e, r, i, n);
    case 7:
      return Le(t, e, e.pendingProps, n), e.child;
    case 8:
      return Le(t, e, e.pendingProps.children, n), e.child;
    case 12:
      return Le(t, e, e.pendingProps.children, n), e.child;
    case 10:
      e: {
        if (r = e.type._context, i = e.pendingProps, s = e.memoizedProps, a = i.value, Q(Gs, r._currentValue), r._currentValue = a, s !== null) if (xt(s.value, a)) {
          if (s.children === i.children && !Fe.current) {
            e = Ht(t, e, n);
            break e;
          }
        } else for (s = e.child, s !== null && (s.return = e); s !== null; ) {
          var l = s.dependencies;
          if (l !== null) {
            a = s.child;
            for (var o = l.firstContext; o !== null; ) {
              if (o.context === r) {
                if (s.tag === 1) {
                  o = zt(-1, n & -n), o.tag = 2;
                  var u = s.updateQueue;
                  if (u !== null) {
                    u = u.shared;
                    var c = u.pending;
                    c === null ? o.next = o : (o.next = c.next, c.next = o), u.pending = o;
                  }
                }
                s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), io(
                  s.return,
                  n,
                  e
                ), l.lanes |= n;
                break;
              }
              o = o.next;
            }
          } else if (s.tag === 10) a = s.type === e.type ? null : s.child;
          else if (s.tag === 18) {
            if (a = s.return, a === null) throw Error(j(341));
            a.lanes |= n, l = a.alternate, l !== null && (l.lanes |= n), io(a, n, e), a = s.sibling;
          } else a = s.child;
          if (a !== null) a.return = s;
          else for (a = s; a !== null; ) {
            if (a === e) {
              a = null;
              break;
            }
            if (s = a.sibling, s !== null) {
              s.return = a.return, a = s;
              break;
            }
            a = a.return;
          }
          s = a;
        }
        Le(t, e, i.children, n), e = e.child;
      }
      return e;
    case 9:
      return i = e.type, r = e.pendingProps.children, xr(e, n), i = pt(i), r = r(i), e.flags |= 1, Le(t, e, r, n), e.child;
    case 14:
      return r = e.type, i = vt(r, e.pendingProps), i = vt(r.type, i), sd(t, e, r, i, n);
    case 15:
      return Gh(t, e, e.type, e.pendingProps, n);
    case 17:
      return r = e.type, i = e.pendingProps, i = e.elementType === r ? i : vt(r, i), Ts(t, e), e.tag = 1, Be(r) ? (t = !0, Vs(e)) : t = !1, xr(e, n), Vh(e, r, i), ao(e, r, i, n), uo(null, e, r, !0, t, n);
    case 19:
      return Xh(t, e, n);
    case 22:
      return Kh(t, e, n);
  }
  throw Error(j(156, e.tag));
};
function hp(t, e) {
  return Bf(t, e);
}
function p0(t, e, n, r) {
  this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function ct(t, e, n, r) {
  return new p0(t, e, n, r);
}
function Lu(t) {
  return t = t.prototype, !(!t || !t.isReactComponent);
}
function m0(t) {
  if (typeof t == "function") return Lu(t) ? 1 : 0;
  if (t != null) {
    if (t = t.$$typeof, t === Xo) return 11;
    if (t === Jo) return 14;
  }
  return 2;
}
function hn(t, e) {
  var n = t.alternate;
  return n === null ? (n = ct(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 14680064, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n;
}
function Ps(t, e, n, r, i, s) {
  var a = 2;
  if (r = t, typeof t == "function") Lu(t) && (a = 1);
  else if (typeof t == "string") a = 5;
  else e: switch (t) {
    case sr:
      return Bn(n.children, i, s, e);
    case qo:
      a = 8, i |= 8;
      break;
    case Al:
      return t = ct(12, n, e, i | 2), t.elementType = Al, t.lanes = s, t;
    case bl:
      return t = ct(13, n, e, i), t.elementType = bl, t.lanes = s, t;
    case Ll:
      return t = ct(19, n, e, i), t.elementType = Ll, t.lanes = s, t;
    case kf:
      return Ta(n, i, s, e);
    default:
      if (typeof t == "object" && t !== null) switch (t.$$typeof) {
        case Sf:
          a = 10;
          break e;
        case xf:
          a = 9;
          break e;
        case Xo:
          a = 11;
          break e;
        case Jo:
          a = 14;
          break e;
        case Kt:
          a = 16, r = null;
          break e;
      }
      throw Error(j(130, t == null ? t : typeof t, ""));
  }
  return e = ct(a, n, e, i), e.elementType = t, e.type = r, e.lanes = s, e;
}
function Bn(t, e, n, r) {
  return t = ct(7, t, r, e), t.lanes = n, t;
}
function Ta(t, e, n, r) {
  return t = ct(22, t, r, e), t.elementType = kf, t.lanes = n, t.stateNode = { isHidden: !1 }, t;
}
function ul(t, e, n) {
  return t = ct(6, t, null, e), t.lanes = n, t;
}
function cl(t, e, n) {
  return e = ct(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, e;
}
function g0(t, e, n, r, i) {
  this.tag = e, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = $a(0), this.expirationTimes = $a(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $a(0), this.identifierPrefix = r, this.onRecoverableError = i, this.mutableSourceEagerHydrationData = null;
}
function Iu(t, e, n, r, i, s, a, l, o) {
  return t = new g0(t, e, n, l, o), e === 1 ? (e = 1, s === !0 && (e |= 8)) : e = 0, s = ct(3, null, null, e), t.current = s, s.stateNode = t, s.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, gu(s), t;
}
function v0(t, e, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: ir, key: r == null ? null : "" + r, children: t, containerInfo: e, implementation: n };
}
function pp(t) {
  if (!t) return vn;
  t = t._reactInternals;
  e: {
    if (Xn(t) !== t || t.tag !== 1) throw Error(j(170));
    var e = t;
    do {
      switch (e.tag) {
        case 3:
          e = e.stateNode.context;
          break e;
        case 1:
          if (Be(e.type)) {
            e = e.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      e = e.return;
    } while (e !== null);
    throw Error(j(171));
  }
  if (t.tag === 1) {
    var n = t.type;
    if (Be(n)) return ph(t, n, e);
  }
  return e;
}
function mp(t, e, n, r, i, s, a, l, o) {
  return t = Iu(n, r, !0, t, i, s, a, l, o), t.context = pp(null), n = t.current, r = Re(), i = fn(n), s = zt(r, i), s.callback = e ?? null, cn(n, s, i), t.current.lanes = i, Wi(t, i, r), Ue(t, r), t;
}
function Na(t, e, n, r) {
  var i = e.current, s = Re(), a = fn(i);
  return n = pp(n), e.context === null ? e.context = n : e.pendingContext = n, e = zt(s, a), e.payload = { element: t }, r = r === void 0 ? null : r, r !== null && (e.callback = r), t = cn(i, e, a), t !== null && (St(t, i, a, s), ks(t, i, a)), a;
}
function na(t) {
  if (t = t.current, !t.child) return null;
  switch (t.child.tag) {
    case 5:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
function vd(t, e) {
  if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
    var n = t.retryLane;
    t.retryLane = n !== 0 && n < e ? n : e;
  }
}
function Ru(t, e) {
  vd(t, e), (t = t.alternate) && vd(t, e);
}
function y0() {
  return null;
}
var gp = typeof reportError == "function" ? reportError : function(t) {
  console.error(t);
};
function Mu(t) {
  this._internalRoot = t;
}
ja.prototype.render = Mu.prototype.render = function(t) {
  var e = this._internalRoot;
  if (e === null) throw Error(j(409));
  Na(t, e, null, null);
};
ja.prototype.unmount = Mu.prototype.unmount = function() {
  var t = this._internalRoot;
  if (t !== null) {
    this._internalRoot = null;
    var e = t.containerInfo;
    Qn(function() {
      Na(null, t, null, null);
    }), e[Bt] = null;
  }
};
function ja(t) {
  this._internalRoot = t;
}
ja.prototype.unstable_scheduleHydration = function(t) {
  if (t) {
    var e = Kf();
    t = { blockedOn: null, target: t, priority: e };
    for (var n = 0; n < Xt.length && e !== 0 && e < Xt[n].priority; n++) ;
    Xt.splice(n, 0, t), n === 0 && Qf(t);
  }
};
function Ou(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
}
function Pa(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11 && (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "));
}
function yd() {
}
function _0(t, e, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var u = na(a);
        s.call(u);
      };
    }
    var a = mp(e, r, t, 0, null, !1, !1, "", yd);
    return t._reactRootContainer = a, t[Bt] = a.current, Ti(t.nodeType === 8 ? t.parentNode : t), Qn(), a;
  }
  for (; i = t.lastChild; ) t.removeChild(i);
  if (typeof r == "function") {
    var l = r;
    r = function() {
      var u = na(o);
      l.call(u);
    };
  }
  var o = Iu(t, 0, !1, null, null, !1, !1, "", yd);
  return t._reactRootContainer = o, t[Bt] = o.current, Ti(t.nodeType === 8 ? t.parentNode : t), Qn(function() {
    Na(e, o, n, r);
  }), o;
}
function Aa(t, e, n, r, i) {
  var s = n._reactRootContainer;
  if (s) {
    var a = s;
    if (typeof i == "function") {
      var l = i;
      i = function() {
        var o = na(a);
        l.call(o);
      };
    }
    Na(e, a, t, i);
  } else a = _0(n, e, t, i, r);
  return na(a);
}
Wf = function(t) {
  switch (t.tag) {
    case 3:
      var e = t.stateNode;
      if (e.current.memoizedState.isDehydrated) {
        var n = ni(e.pendingLanes);
        n !== 0 && (tu(e, n | 1), Ue(e, fe()), !($ & 6) && (Ir = fe() + 500, kn()));
      }
      break;
    case 13:
      Qn(function() {
        var r = Ut(t, 1);
        if (r !== null) {
          var i = Re();
          St(r, t, 1, i);
        }
      }), Ru(t, 1);
  }
};
nu = function(t) {
  if (t.tag === 13) {
    var e = Ut(t, 134217728);
    if (e !== null) {
      var n = Re();
      St(e, t, 134217728, n);
    }
    Ru(t, 134217728);
  }
};
Gf = function(t) {
  if (t.tag === 13) {
    var e = fn(t), n = Ut(t, e);
    if (n !== null) {
      var r = Re();
      St(n, t, e, r);
    }
    Ru(t, e);
  }
};
Kf = function() {
  return G;
};
Yf = function(t, e) {
  var n = G;
  try {
    return G = t, e();
  } finally {
    G = n;
  }
};
Hl = function(t, e, n) {
  switch (e) {
    case "input":
      if (Ml(t, n), e = n.name, n.type === "radio" && e != null) {
        for (n = t; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + e) + '][type="radio"]'), e = 0; e < n.length; e++) {
          var r = n[e];
          if (r !== t && r.form === t.form) {
            var i = wa(r);
            if (!i) throw Error(j(90));
            Cf(r), Ml(r, i);
          }
        }
      }
      break;
    case "textarea":
      Nf(t, n);
      break;
    case "select":
      e = n.value, e != null && yr(t, !!n.multiple, e, !1);
  }
};
Rf = Pu;
Mf = Qn;
var w0 = { usingClientEntryPoint: !1, Events: [Ki, ur, wa, Lf, If, Pu] }, Jr = { findFiberByHostInstance: Rn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, S0 = { bundleType: Jr.bundleType, version: Jr.version, rendererPackageName: Jr.rendererPackageName, rendererConfig: Jr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Wt.ReactCurrentDispatcher, findHostInstanceByFiber: function(t) {
  return t = zf(t), t === null ? null : t.stateNode;
}, findFiberByHostInstance: Jr.findFiberByHostInstance || y0, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var ps = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!ps.isDisabled && ps.supportsFiber) try {
    ga = ps.inject(S0), Pt = ps;
  } catch {
  }
}
st.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = w0;
st.createPortal = function(t, e) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Ou(e)) throw Error(j(200));
  return v0(t, e, null, n);
};
st.createRoot = function(t, e) {
  if (!Ou(t)) throw Error(j(299));
  var n = !1, r = "", i = gp;
  return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (r = e.identifierPrefix), e.onRecoverableError !== void 0 && (i = e.onRecoverableError)), e = Iu(t, 1, !1, null, null, n, !1, r, i), t[Bt] = e.current, Ti(t.nodeType === 8 ? t.parentNode : t), new Mu(e);
};
st.findDOMNode = function(t) {
  if (t == null) return null;
  if (t.nodeType === 1) return t;
  var e = t._reactInternals;
  if (e === void 0)
    throw typeof t.render == "function" ? Error(j(188)) : (t = Object.keys(t).join(","), Error(j(268, t)));
  return t = zf(e), t = t === null ? null : t.stateNode, t;
};
st.flushSync = function(t) {
  return Qn(t);
};
st.hydrate = function(t, e, n) {
  if (!Pa(e)) throw Error(j(200));
  return Aa(null, t, e, !0, n);
};
st.hydrateRoot = function(t, e, n) {
  if (!Ou(t)) throw Error(j(405));
  var r = n != null && n.hydratedSources || null, i = !1, s = "", a = gp;
  if (n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (s = n.identifierPrefix), n.onRecoverableError !== void 0 && (a = n.onRecoverableError)), e = mp(e, null, t, 1, n ?? null, i, !1, s, a), t[Bt] = e.current, Ti(t), r) for (t = 0; t < r.length; t++) n = r[t], i = n._getVersion, i = i(n._source), e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [n, i] : e.mutableSourceEagerHydrationData.push(
    n,
    i
  );
  return new ja(e);
};
st.render = function(t, e, n) {
  if (!Pa(e)) throw Error(j(200));
  return Aa(null, t, e, !1, n);
};
st.unmountComponentAtNode = function(t) {
  if (!Pa(t)) throw Error(j(40));
  return t._reactRootContainer ? (Qn(function() {
    Aa(null, null, t, !1, function() {
      t._reactRootContainer = null, t[Bt] = null;
    });
  }), !0) : !1;
};
st.unstable_batchedUpdates = Pu;
st.unstable_renderSubtreeIntoContainer = function(t, e, n, r) {
  if (!Pa(n)) throw Error(j(200));
  if (t == null || t._reactInternals === void 0) throw Error(j(38));
  return Aa(t, e, n, !1, r);
};
st.version = "18.3.1-next-f1338f8080-20240426";
function vp() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(vp);
    } catch (t) {
      console.error(t);
    }
}
vp(), vf.exports = st;
var x0 = vf.exports, $r, _d = x0;
$r = _d.createRoot, _d.hydrateRoot;
const k0 = ({ item: t }) => /* @__PURE__ */ d.jsxs("li", { className: "nav-item", children: [
  /* @__PURE__ */ d.jsxs("a", { href: "#", className: "nav-link route-link", "data-route": t.route, children: [
    /* @__PURE__ */ d.jsx("i", { "data-lucide": t.icon, className: "nav-icon" }),
    /* @__PURE__ */ d.jsx("span", { "data-lang": t.dataLang, children: t.label })
  ] }),
  /* @__PURE__ */ d.jsxs("div", { className: "mega-dropdown", children: [
    /* @__PURE__ */ d.jsx("div", { className: "mega-menu-list-container", children: t.menuItems.map((e) => /* @__PURE__ */ d.jsxs(
      "a",
      {
        href: "#",
        className: "mega-menu-item route-link",
        "data-route": e.route,
        "data-preview": e.previewId,
        children: [
          /* @__PURE__ */ d.jsx("i", { "data-lucide": e.icon, className: "mega-menu-icon" }),
          /* @__PURE__ */ d.jsx("span", { children: e.label }),
          e.isNew ? /* @__PURE__ */ d.jsx("span", { className: "badge-new", children: "NEW" }) : null
        ]
      },
      `${e.route}-${e.previewId}`
    )) }),
    /* @__PURE__ */ d.jsxs("div", { className: "mega-menu-preview", children: [
      /* @__PURE__ */ d.jsx("div", { className: "preview-loader", children: /* @__PURE__ */ d.jsx("i", { className: "fas fa-spinner fa-spin" }) }),
      t.previews.map((e, n) => /* @__PURE__ */ d.jsx(
        "img",
        {
          id: e.id,
          src: e.src,
          alt: e.alt,
          className: `preview-image ${n === 0 ? "active" : ""}`
        },
        e.id
      ))
    ] })
  ] })
] }), E0 = [
  {
    route: "SERVICES.STAY.MAIN",
    icon: "building-2",
    dataLang: "navAccommodations",
    label: "숙소 예약",
    menuItems: [
      { route: "SERVICES.STAY.MAIN", previewId: "preview-hotel", icon: "hotel", label: "호텔 & 리조트" },
      { route: "SERVICES.STAY.LIFE", previewId: "preview-month", icon: "calendar", label: "한달살기", isNew: !0 },
      { route: "SERVICES.STAY.PRIVATE", previewId: "preview-private", icon: "home", label: "프라이빗 스테이" }
    ],
    previews: [
      {
        id: "preview-hotel",
        src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        alt: "Hotel"
      },
      {
        id: "preview-month",
        src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        alt: "Month Stay"
      },
      {
        id: "preview-private",
        src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80",
        alt: "Private Stay"
      }
    ]
  },
  {
    route: "SERVICES.TRAVEL.ACTIVITIES",
    icon: "plane",
    dataLang: "navTravel",
    label: "여행 상품",
    menuItems: [
      { route: "SERVICES.TRAVEL.ACTIVITIES", previewId: "preview-activity", icon: "compass", label: "액티비티" },
      { route: "SERVICES.TRAVEL.ESIM", previewId: "preview-esim", icon: "smartphone", label: "eSIM / 유심" }
    ],
    previews: [
      {
        id: "preview-activity",
        src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80",
        alt: "Activity"
      },
      {
        id: "preview-esim",
        src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        alt: "eSIM"
      }
    ]
  },
  {
    route: "SERVICES.DEALS.MAIN",
    icon: "percent",
    dataLang: "navDeals",
    label: "혜택 & 특가",
    menuItems: [
      { route: "SERVICES.DEALS.MAIN", previewId: "preview-promo", icon: "gift", label: "이번 달 프로모션" },
      { route: "SERVICES.DEALS.MEMBER", previewId: "preview-member", icon: "users", label: "회원 전용 혜택" },
      { route: "SERVICES.DEALS.PARTNER", previewId: "preview-partner", icon: "credit-card", label: "제휴 카드 할인" }
    ],
    previews: [
      {
        id: "preview-promo",
        src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
        alt: "Promo"
      },
      {
        id: "preview-member",
        src: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=600&q=80",
        alt: "Member"
      },
      {
        id: "preview-partner",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
        alt: "Partner"
      }
    ]
  },
  {
    route: "SERVICES.TRAVEL.GUIDE",
    icon: "book-open",
    dataLang: "navGuide",
    label: "여행 정보",
    menuItems: [
      { route: "SERVICES.TRAVEL.GUIDE", previewId: "preview-guide", icon: "map", label: "여행 가이드북" },
      { route: "SERVICES.TRAVEL.TIPS", previewId: "preview-tips", icon: "lightbulb", label: "여행 팁" },
      { route: "SERVICES.TRAVEL.CHECKLIST", previewId: "preview-checklist", icon: "check-circle", label: "여행 체크리스트" }
    ],
    previews: [
      {
        id: "preview-guide",
        src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
        alt: "Guide"
      },
      {
        id: "preview-tips",
        src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=80",
        alt: "Tips"
      },
      {
        id: "preview-checklist",
        src: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
        alt: "Checklist"
      }
    ]
  }
], C0 = [
  { route: "SERVICES.STAY.MAIN", dataLang: "mobileNavHotel", label: "숙소 예약", active: !0 },
  { route: "SERVICES.STAY.LIFE", dataLang: "mobileNavLife", label: "한달살기" },
  { route: "SERVICES.TRAVEL.ACTIVITIES", dataLang: "mobileNavActivity", label: "액티비티" },
  { route: "SERVICES.TRAVEL.ESIM", dataLang: "mobileNavEsim", label: "eSIM" },
  { route: "SERVICES.TRAVEL.GUIDE", dataLang: "mobileNavGuide", label: "여행 가이드" },
  { route: "SERVICES.TRAVEL.TIPS", dataLang: "mobileNavTips", label: "여행 일정 팁" },
  { action: "OPEN_RESERVATION_DRAWER", dataLang: "navResCheck", label: "예약 확인" },
  { route: "AUTH.LOGIN", routeParams: '{"shell":"main"}', dataLang: "navLogin", label: "로그인" }
], T0 = ({ basePath: t }) => /* @__PURE__ */ d.jsxs("header", { className: "header hotel-header", id: "header", children: [
  /* @__PURE__ */ d.jsxs("div", { className: "header-container", children: [
    /* @__PURE__ */ d.jsx("a", { href: "#", className: "logo route-link", "data-route": "SERVICES.STAY.MAIN", children: /* @__PURE__ */ d.jsx("img", { src: `${t}jejustay/images/logo_jejuhotel.png`, alt: "JEJU STAY", className: "logo-img" }) }),
    /* @__PURE__ */ d.jsx("nav", { className: "main-nav", children: /* @__PURE__ */ d.jsx("ul", { className: "nav-list", children: E0.map((e) => /* @__PURE__ */ d.jsx(k0, { item: e }, `${e.route}-${e.dataLang}`)) }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "header-utils", children: [
      /* @__PURE__ */ d.jsxs(
        "a",
        {
          href: "#",
          className: "util-link admin-link route-link",
          "data-route": "ADMIN.DASHBOARD",
          id: "headerAdminBtn",
          style: { display: "none" },
          children: [
            /* @__PURE__ */ d.jsx("i", { "data-lucide": "shield-check", className: "util-icon" }),
            /* @__PURE__ */ d.jsx("span", { children: "관리자 페이지" })
          ]
        }
      ),
      /* @__PURE__ */ d.jsxs("a", { href: "#", className: "util-link route-link", "data-action": "OPEN_RESERVATION_DRAWER", children: [
        /* @__PURE__ */ d.jsx("i", { "data-lucide": "clipboard-list", className: "util-icon" }),
        /* @__PURE__ */ d.jsx("span", { "data-lang": "navResCheck", children: "예약 확인" })
      ] }),
      /* @__PURE__ */ d.jsxs(
        "a",
        {
          href: "#",
          className: "util-link login-btn route-link",
          "data-route": "AUTH.LOGIN",
          "data-route-params": '{"shell":"main"}',
          id: "headerLoginBtn",
          children: [
            /* @__PURE__ */ d.jsx("i", { "data-lucide": "user", className: "util-icon" }),
            /* @__PURE__ */ d.jsx("span", { "data-lang": "navLogin", children: "로그인" })
          ]
        }
      ),
      /* @__PURE__ */ d.jsxs("a", { href: "#", className: "util-link route-link", "data-route": "CS.CUSTOMER_CENTER", children: [
        /* @__PURE__ */ d.jsx("i", { "data-lucide": "headphones", className: "util-icon" }),
        /* @__PURE__ */ d.jsx("span", { "data-lang": "navCs", children: "고객센터" })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx("button", { className: "mobile-menu-btn", id: "mobileMenuBtn", "aria-label": "메뉴 열기", children: /* @__PURE__ */ d.jsx("i", { "data-lucide": "menu" }) })
  ] }),
  /* @__PURE__ */ d.jsx("div", { className: "mobile-nav", id: "mobileNav", children: /* @__PURE__ */ d.jsx("ul", { className: "mobile-nav-list", children: C0.map((e) => /* @__PURE__ */ d.jsx("li", { children: /* @__PURE__ */ d.jsx(
    "a",
    {
      href: "#",
      className: `mobile-nav-link route-link${e.active ? " active" : ""}`,
      "data-route": e.route,
      "data-route-params": e.routeParams,
      "data-action": e.action,
      "data-lang": e.dataLang,
      children: e.label
    }
  ) }, `${e.route ?? e.action ?? e.dataLang}-${e.dataLang}`)) }) })
] }), yp = () => /* @__PURE__ */ d.jsxs("footer", { className: "footer section", id: "section-footer", children: [
  /* @__PURE__ */ d.jsxs("div", { className: "footer-content", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "footer-info", children: [
      /* @__PURE__ */ d.jsx("p", { children: /* @__PURE__ */ d.jsx("strong", { "data-lang": "footerCompany", children: "(주) 제주 그룹" }) }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerCEO", children: "대표이사 김대표" }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerBizNum", children: "사업자등록번호 616-81-50527" }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerSaleNum", children: "통신판매신고 제주 2006-125" }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerHosting", children: "호스팅 사업자 AWS" }),
      /* @__PURE__ */ d.jsx("br", {}),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerAddr", children: "주소: 제주특별자치도 제주시 첨단로 64 (연동, 건설공제회관 3층)" }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerCs", children: "고객센터: 1599-1500 (09:00 ~ 19:00)" }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerCsEmail", children: "고객 문의: jejugroup.help@jejugroup.net" }),
      /* @__PURE__ */ d.jsx("p", { "data-lang": "footerPartnerEmail", children: "제휴 문의: partnership@jejugroup.net" })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "footer-social", children: [
      /* @__PURE__ */ d.jsx("a", { href: "#", className: "social-icon", "aria-label": "YouTube", children: /* @__PURE__ */ d.jsx("i", { className: "fab fa-youtube" }) }),
      /* @__PURE__ */ d.jsx("a", { href: "#", className: "social-icon", "aria-label": "Instagram", children: /* @__PURE__ */ d.jsx("i", { className: "fab fa-instagram" }) }),
      /* @__PURE__ */ d.jsx("a", { href: "#", className: "social-icon", "aria-label": "TikTok", children: /* @__PURE__ */ d.jsx("i", { className: "fab fa-tiktok" }) }),
      /* @__PURE__ */ d.jsx("a", { href: "#", className: "social-icon", "aria-label": "Facebook", children: /* @__PURE__ */ d.jsx("i", { className: "fab fa-facebook" }) })
    ] })
  ] }),
  /* @__PURE__ */ d.jsx("div", { className: "footer-copyright", children: /* @__PURE__ */ d.jsx("p", { "data-lang": "footerCopyright", children: "Copyright © Jeju Group. All Rights Reserved." }) })
] }), N0 = ({ basePath: t }) => /* @__PURE__ */ d.jsxs("header", { className: "header main-header", id: "header", children: [
  /* @__PURE__ */ d.jsxs("div", { className: "header-util", id: "index-header-util", children: [
    /* @__PURE__ */ d.jsx(
      "a",
      {
        href: "#",
        className: "util-link route-link",
        "data-route": "AUTH.LOGIN",
        "data-route-params": '{"shell":"main"}',
        "data-lang": "login",
        id: "indexLoginBtn",
        children: "로그인"
      }
    ),
    /* @__PURE__ */ d.jsx("span", { className: "util-divider", children: "|" }),
    /* @__PURE__ */ d.jsx(
      "a",
      {
        href: "#",
        className: "util-link route-link",
        "data-route": "AUTH.SIGNUP",
        "data-route-params": '{"shell":"main"}',
        "data-lang": "signup",
        children: "회원가입"
      }
    ),
    /* @__PURE__ */ d.jsx("span", { className: "util-divider", children: "|" }),
    /* @__PURE__ */ d.jsx("a", { href: "#", className: "util-link route-link", "data-action": "OPEN_RESERVATION_DRAWER", "data-lang": "reservationCheck", children: "예약 확인" }),
    /* @__PURE__ */ d.jsx("span", { className: "util-divider", children: "|" }),
    /* @__PURE__ */ d.jsx("a", { href: "#", className: "util-link route-link", "data-route": "CS.CUSTOMER_CENTER", "data-lang": "customerCenter", children: "고객센터" })
  ] }),
  /* @__PURE__ */ d.jsxs("div", { className: "header-inner", children: [
    /* @__PURE__ */ d.jsx("div", { className: "logo", children: /* @__PURE__ */ d.jsx("a", { href: "#", className: "logo-link route-link", "data-route": "HOME", children: /* @__PURE__ */ d.jsx("img", { src: `${t}jejustay/images/logo_jejuGP_wide.png`, alt: "제주그룹" }) }) }),
    /* @__PURE__ */ d.jsx("nav", { className: "gnb", id: "gnb", children: /* @__PURE__ */ d.jsxs("ul", { className: "gnb-list", children: [
      /* @__PURE__ */ d.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ d.jsx("a", { href: "#section-2", className: "gnb-link", "data-lang": "navAir", children: "제주항공" }) }),
      /* @__PURE__ */ d.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ d.jsx("a", { href: "#section-3", className: "gnb-link", "data-lang": "navHotel", children: "제주 스테이" }) }),
      /* @__PURE__ */ d.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ d.jsx("a", { href: "#section-4", className: "gnb-link", "data-lang": "navRentCar", children: "제주 렌트카" }) }),
      /* @__PURE__ */ d.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ d.jsx("a", { href: "#section-5", className: "gnb-link", "data-lang": "navMembership", children: "멤버십" }) })
    ] }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "header-right-controls", children: [
      /* @__PURE__ */ d.jsx("button", { className: "lang-toggle", children: "English" }),
      /* @__PURE__ */ d.jsx("div", { id: "weather-widget", className: "weather-widget", children: /* @__PURE__ */ d.jsx("button", { className: "weather-header-btn", id: "weather-open-btn", children: /* @__PURE__ */ d.jsx("i", { className: "fa-solid fa-spinner fa-spin" }) }) })
    ] })
  ] })
] }), wd = /* @__PURE__ */ new Map(), j0 = (t) => {
  requestAnimationFrame(() => {
    Promise.resolve(t == null ? void 0 : t()).catch((e) => {
      console.error("[ShellRuntime] onLoaded failed", e);
    });
  });
}, ra = (t, e, n) => {
  const r = document.getElementById(t);
  if (!r)
    return;
  const i = wd.get(t);
  i && i.unmount();
  const s = $r(r);
  wd.set(t, s), s.render(e), j0(n);
}, ia = (t) => {
  document.dispatchEvent(new Event(t));
}, sa = () => {
  const t = window.lucide;
  t != null && t.createIcons && t.createIcons();
}, _p = async () => {
  const t = Hi();
  ra("main-header-placeholder", /* @__PURE__ */ d.jsx(N0, { basePath: t }), async () => {
    Vi(), sa(), ia("mainHeaderLoaded");
  }), ra("main-footer-placeholder", /* @__PURE__ */ d.jsx(yp, {}), async () => {
    ha(), sa(), ia("mainFooterLoaded");
  });
}, wp = async () => {
  const t = Hi();
  ra("hotel-header-placeholder", /* @__PURE__ */ d.jsx(T0, { basePath: t }), async () => {
    Vi(), sa(), ia("mainHeaderLoaded");
  }), ra("hotel-footer-placeholder", /* @__PURE__ */ d.jsx(yp, {}), async () => {
    ha(), sa(), ia("mainFooterLoaded");
  });
}, Sd = (t, e = "shell-runtime") => {
  var n;
  if ((n = window.__JEJU_ROUTE_NAVIGATOR__) != null && n.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(t, e);
    return;
  }
  window.location.assign(t);
}, P0 = () => {
  var t;
  return (t = window.__JEJU_ROUTE_NAVIGATOR__) != null && t.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", Hi()).href;
}, A0 = (t) => {
  const e = t.getAttribute("data-route-params");
  if (!e)
    return {};
  try {
    const n = JSON.parse(e);
    return n && typeof n == "object" && !Array.isArray(n) ? n : {};
  } catch {
    return {};
  }
}, b0 = async (t) => {
  const e = t.getAttribute("data-route");
  if (e)
    try {
      const i = (await import(Br("core/utils/path_resolver.js"))).resolveRoute(e, A0(t));
      Sd(i, "shell-runtime-fallback");
    } catch {
      Sd(P0(), "shell-runtime-fallback-home");
    }
};
let xd = !1;
const L0 = async () => {
  if (!xd) {
    xd = !0;
    try {
      (await import(Br("core/utils/router_binder.js"))).initRouterBinder();
      return;
    } catch (t) {
      console.warn("[ShellRuntime] router binder load failed", t);
    }
    document.body.addEventListener("click", async (t) => {
      var n;
      const e = (n = t.target) == null ? void 0 : n.closest("[data-route]");
      e && (t.preventDefault(), await b0(e));
    });
  }
}, I0 = () => /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
  /* @__PURE__ */ d.jsx("div", { className: "res-drawer-backdrop", id: "resDrawerBackdrop" }),
  /* @__PURE__ */ d.jsxs("div", { className: "res-drawer-panel", id: "resDrawerPanel", children: [
    /* @__PURE__ */ d.jsx("button", { className: "res-drawer-close", id: "resDrawerClose", children: /* @__PURE__ */ d.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ d.jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "res-drawer-visual", children: [
      /* @__PURE__ */ d.jsx("h2", { className: "res-drawer-title", "data-lang": "resCheckTitle", children: "비회원 예약 조회" }),
      /* @__PURE__ */ d.jsx("p", { className: "res-drawer-desc", "data-lang": "resCheckDesc", children: "예약 번호와 이메일 정보를 입력해서 내역을 확인해줘" })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "res-drawer-body", children: [
      /* @__PURE__ */ d.jsxs("form", { className: "res-drawer-form", id: "resDrawerForm", children: [
        /* @__PURE__ */ d.jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ d.jsx(
            "input",
            {
              type: "text",
              id: "drawerResNum",
              placeholder: "예약 번호 입력",
              "data-lang-placeholder": "resNumPlaceholder",
              required: !0
            }
          ),
          /* @__PURE__ */ d.jsx("div", { className: "input-focus-bg" })
        ] }),
        /* @__PURE__ */ d.jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ d.jsx(
            "input",
            {
              type: "email",
              id: "drawerEmail",
              placeholder: "가입한 이메일 입력",
              "data-lang-placeholder": "resEmailPlaceholder",
              required: !0
            }
          ),
          /* @__PURE__ */ d.jsx("div", { className: "input-focus-bg" })
        ] }),
        /* @__PURE__ */ d.jsx("button", { type: "submit", className: "res-drawer-btn", "data-lang": "checkButton", children: "조회하기" })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "res-drawer-footer", children: [
        /* @__PURE__ */ d.jsx("span", { "data-lang": "isMember", children: "회원이신가요" }),
        /* @__PURE__ */ d.jsx("a", { href: "#", className: "route-link", "data-route": "AUTH.LOGIN", "data-lang": "loginCheckLink", children: "로그인하고 관리하기" })
      ] })
    ] })
  ] })
] });
class R0 {
  constructor() {
    Tn(this, "isInitialized", !1);
    Tn(this, "isOpen", !1);
    Tn(this, "root", null);
    Tn(this, "backdrop", null);
    Tn(this, "panel", null);
    Tn(this, "closeButton", null);
  }
  async ensureMarkup() {
    if (this.isInitialized)
      return;
    const e = new URL("components/react/ui/reservationDrawer/drawer.css", Br("./")).href;
    if (!Array.from(document.querySelectorAll("link")).some((i) => i.href === e)) {
      const i = document.createElement("link");
      i.rel = "stylesheet", i.href = e, document.head.appendChild(i);
    }
    let r = document.getElementById("reservation-drawer-container");
    r || (r = document.createElement("div"), r.id = "reservation-drawer-container", document.body.appendChild(r)), this.root || (this.root = $r(r)), this.root.render(P.createElement(I0)), await new Promise((i) => {
      requestAnimationFrame(() => i());
    }), this.backdrop = document.getElementById("resDrawerBackdrop"), this.panel = document.getElementById("resDrawerPanel"), this.closeButton = document.getElementById("resDrawerClose"), this.bindEvents(), this.isInitialized = !0;
  }
  bindEvents() {
    if (!this.backdrop || !this.panel || !this.closeButton)
      return;
    this.closeButton.addEventListener("click", () => this.close()), this.backdrop.addEventListener("click", () => this.close()), window.addEventListener("popstate", (n) => {
      const r = n.state;
      this.isOpen && (r == null ? void 0 : r.modal) !== "reservation" && this.close(!0);
    }), document.addEventListener("keydown", (n) => {
      n.key === "Escape" && this.isOpen && this.close();
    });
    const e = document.getElementById("resDrawerForm");
    e && e.addEventListener("submit", (n) => {
      n.preventDefault(), alert("예약 API 연동 전 임시 폼 상태");
    }), this.panel.addEventListener("click", (n) => {
      var i;
      ((i = n.target) == null ? void 0 : i.closest("[data-route]")) && this.close();
    });
  }
  async open() {
    await this.ensureMarkup(), !(this.isOpen || !this.backdrop || !this.panel) && (this.isOpen = !0, history.pushState({ modal: "reservation" }, "", "#reservation"), this.backdrop.offsetHeight, requestAnimationFrame(() => {
      var e, n;
      (e = this.backdrop) == null || e.classList.add("active"), (n = this.panel) == null || n.classList.add("active");
    }), document.body.style.overflow = "hidden");
  }
  close(e = !1) {
    var n, r, i;
    this.isOpen && (this.isOpen = !1, (n = this.backdrop) == null || n.classList.remove("active"), (r = this.panel) == null || r.classList.remove("active"), document.body.style.overflow = "", !e && ((i = history.state) == null ? void 0 : i.modal) === "reservation" && history.back());
  }
}
const ba = new R0(), M0 = (t) => {
  const e = t ?? {};
  return {
    checkIn: e.checkIn ?? null,
    checkOut: e.checkOut ?? null,
    tempCheckIn: e.tempCheckIn ?? null,
    tempCheckOut: e.tempCheckOut ?? null
  };
}, Sp = (t) => {
  const e = {
    fieldId: "checkInField",
    popupId: "calendarPopup",
    monthsContainerId: "calendarMonths",
    dayPickerContainerId: "dayPickerContainer",
    prevButtonId: "prevMonth",
    nextButtonId: "nextMonth",
    clearButtonId: "btn-clear",
    confirmButtonId: "btn-confirm",
    tabCalendarId: "tab-calendar",
    tabFlexibleId: "tab-flexible",
    panelCalendarId: "panel-calendar",
    panelFlexibleId: "panel-flexible",
    flexibleOptionSelector: ".Flexible-Option",
    weekStartsOn: "monday",
    weekdayLabels: null,
    monthLabelFormatter: null,
    dayLabelFormatter: null,
    monthsToRender: 2,
    showHoverRange: !0,
    enableTabs: !0,
    enableFlexibleOptions: !0,
    toggleMode: "toggle",
    cancelOnToggleClose: !1,
    toggleFieldActiveClass: !1,
    openingClass: "",
    openingClassDurationMs: 0,
    closeAllPopups: null,
    onOpen: null,
    onClose: null,
    onCancel: null,
    onClear: null,
    onTempChange: null,
    onBeforeConfirm: null,
    onConfirm: null,
    state: null,
    initialMonth: null,
    ...t ?? {}
  }, n = M0(e.state);
  let r = e.initialMonth ? new Date(e.initialMonth) : /* @__PURE__ */ new Date(), i = null, s = !1, a = null, l = null;
  const o = () => l || (l = {
    field: document.getElementById(e.fieldId),
    popup: document.getElementById(e.popupId),
    monthsContainer: document.getElementById(e.monthsContainerId),
    dayPickerContainer: document.getElementById(e.dayPickerContainerId),
    prevButton: document.getElementById(e.prevButtonId),
    nextButton: document.getElementById(e.nextButtonId),
    clearButton: document.getElementById(e.clearButtonId),
    confirmButton: document.getElementById(e.confirmButtonId),
    tabCalendar: document.getElementById(e.tabCalendarId),
    tabFlexible: document.getElementById(e.tabFlexibleId),
    panelCalendar: document.getElementById(e.panelCalendarId),
    panelFlexible: document.getElementById(e.panelFlexibleId)
  }, l), u = (A) => {
    A == null || A.stopPropagation();
  }, c = (A, M) => {
    typeof A == "function" && A(n, W, M);
  }, f = () => Array.isArray(e.weekdayLabels) && e.weekdayLabels.length === 7 ? e.weekdayLabels : e.weekStartsOn === "sunday" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], p = (A) => {
    const M = new Date(A);
    return M.setHours(0, 0, 0, 0), M.getTime();
  }, y = (A) => e.weekStartsOn === "monday" ? A === 0 ? 6 : A - 1 : A, _ = () => n.tempCheckIn || n.checkIn, g = () => n.tempCheckOut || n.checkOut, x = (A) => typeof e.monthLabelFormatter == "function" ? e.monthLabelFormatter(A, n, W) : `${A.getFullYear()}-${String(A.getMonth() + 1).padStart(2, "0")}`, m = (A, M) => typeof e.dayLabelFormatter == "function" ? e.dayLabelFormatter(A, M, n, W) : String(A), h = (A) => {
    const M = A.getFullYear(), N = A.getMonth(), L = new Date(M, N, 1).getDay(), R = y(L), D = new Date(M, N + 1, 0).getDate(), F = p(/* @__PURE__ */ new Date()), te = _(), z = g();
    let oe = "";
    for (let ve = 0; ve < R; ve += 1)
      oe += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    for (let ve = 1; ve <= D; ve += 1) {
      const be = new Date(M, N, ve).getTime(), Cn = ["DayPicker-Day"];
      be < F && Cn.push("DayPicker-Day--disabled"), be === F && Cn.push("DayPicker-Day--today"), te && be === te && Cn.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange"), z && be === z && Cn.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange"), te && z && be > te && be < z && Cn.push("DayPicker-Day--inRange"), e.showHoverRange && te && !z && i && be > te && be <= i && Cn.push("DayPicker-Day--hoverRange"), oe += `<div class="${Cn.join(" ")}" data-timestamp="${be}" data-day="${ve}">${m(ve, be)}</div>`;
    }
    return oe;
  }, v = () => {
    const { popup: A } = o();
    A && A.querySelectorAll(".DayPicker-Day").forEach((M) => {
      if (M.classList.remove("DayPicker-Day--hoverRange"), !e.showHoverRange)
        return;
      const N = Number.parseInt(M.dataset.timestamp ?? "", 10);
      Number.isFinite(N) && n.tempCheckIn && !n.tempCheckOut && i && N > n.tempCheckIn && N <= i && M.classList.add("DayPicker-Day--hoverRange");
    });
  }, w = (A) => {
    !n.tempCheckIn || n.tempCheckIn && n.tempCheckOut ? (n.tempCheckIn = A, n.tempCheckOut = null, i = null) : A < n.tempCheckIn ? (n.tempCheckIn = A, i = null) : A > n.tempCheckIn && (n.tempCheckOut = A, i = null), c(e.onTempChange ?? null), O();
  }, S = () => {
    const { popup: A, dayPickerContainer: M } = o();
    A && (A.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)").forEach((N) => {
      N.addEventListener("click", (L) => {
        u(L);
        const R = Number.parseInt(N.dataset.timestamp ?? "", 10);
        Number.isFinite(R) && w(R);
      }), e.showHoverRange && N.addEventListener("mouseenter", () => {
        const L = Number.parseInt(N.dataset.timestamp ?? "", 10);
        Number.isFinite(L) && n.tempCheckIn && !n.tempCheckOut && L > n.tempCheckIn && (i = L, v());
      });
    }), M && e.showHoverRange && (M.onmouseleave = () => {
      i && (i = null, v());
    }));
  }, E = (A) => {
    const { tabCalendar: M, tabFlexible: N, panelCalendar: L, panelFlexible: R } = o();
    [M, N].forEach((D) => {
      D && (D.classList.remove("active"), D.setAttribute("aria-selected", "false"));
    }), [L, R].forEach((D) => {
      D && (D.classList.remove("active"), D.style.display = "none");
    }), A && (A.classList.add("active"), A.setAttribute("aria-selected", "true"), A === M && L && (L.classList.add("active"), L.style.display = "block"), A === N && R && (R.classList.add("active"), R.style.display = "block"));
  }, k = () => {
    const { field: A, popup: M } = o();
    !A || !M || (typeof e.closeAllPopups == "function" && e.closeAllPopups(e.popupId), n.tempCheckIn = n.checkIn, n.tempCheckOut = n.checkOut, i = null, M.classList.add("active"), e.toggleFieldActiveClass && A.classList.add("active"), e.openingClass && (M.classList.add(e.openingClass), a && window.clearTimeout(a), e.openingClassDurationMs > 0 && (a = window.setTimeout(() => {
      M.classList.remove(e.openingClass);
    }, e.openingClassDurationMs))), c(e.onTempChange ?? null), O(), c(e.onOpen ?? null));
  }, C = (A) => {
    const { field: M, popup: N } = o();
    N && (N.classList.remove("active"), e.openingClass && N.classList.remove(e.openingClass), e.toggleFieldActiveClass && M && M.classList.remove("active"), c(e.onClose ?? null, A));
  }, T = (A) => {
    n.tempCheckIn = null, n.tempCheckOut = null, i = null, c(e.onTempChange ?? null), c(e.onCancel ?? null, A);
  }, b = (A) => {
    if (u(A), !(typeof e.onBeforeConfirm == "function" && e.onBeforeConfirm(n, W) === !1)) {
      if (n.checkIn = n.tempCheckIn, n.checkOut = n.tempCheckOut, c(e.onConfirm ?? null), typeof e.closeAllPopups == "function") {
        e.closeAllPopups();
        const { field: M } = o();
        e.toggleFieldActiveClass && M && M.classList.remove("active");
        return;
      }
      C({ reason: "confirm" });
    }
  }, O = () => {
    const { monthsContainer: A } = o();
    if (!A)
      return;
    A.innerHTML = "";
    const M = f();
    for (let N = 0; N < e.monthsToRender; N += 1) {
      const L = new Date(r.getFullYear(), r.getMonth() + N, 1), R = document.createElement("div");
      R.className = "DayPicker-Month";
      const D = document.createElement("div");
      D.className = "DayPicker-Caption", D.textContent = x(L), R.appendChild(D);
      const F = document.createElement("div");
      F.className = "DayPicker-Weekdays", M.forEach((z) => {
        const oe = document.createElement("div");
        oe.className = "DayPicker-Weekday", oe.textContent = z, F.appendChild(oe);
      }), R.appendChild(F);
      const te = document.createElement("div");
      te.className = "DayPicker-Body", te.innerHTML = h(L), R.appendChild(te), A.appendChild(R);
    }
    S();
  }, W = {
    init: () => {
      if (s)
        return W;
      const { field: A, popup: M, prevButton: N, nextButton: L, clearButton: R, confirmButton: D, tabCalendar: F, tabFlexible: te } = o();
      return !A || !M || (A.addEventListener("click", (z) => {
        if (u(z), !M.classList.contains("active")) {
          k();
          return;
        }
        e.toggleMode === "toggle" && (e.cancelOnToggleClose && T({ reason: "toggle" }), C({ reason: "toggle" }));
      }), M.addEventListener("click", u), N == null || N.addEventListener("click", (z) => {
        u(z), r.setMonth(r.getMonth() - 1), O();
      }), L == null || L.addEventListener("click", (z) => {
        u(z), r.setMonth(r.getMonth() + 1), O();
      }), R == null || R.addEventListener("click", (z) => {
        u(z), n.checkIn = null, n.checkOut = null, n.tempCheckIn = null, n.tempCheckOut = null, i = null, c(e.onTempChange ?? null), O(), c(e.onClear ?? null);
      }), D == null || D.addEventListener("click", b), e.enableTabs && (F == null || F.addEventListener("click", (z) => {
        u(z), E(F);
      }), te == null || te.addEventListener("click", (z) => {
        u(z), E(te);
      })), e.enableFlexibleOptions && M.querySelectorAll(e.flexibleOptionSelector).forEach((z) => {
        z.addEventListener("click", (oe) => {
          u(oe), M.querySelectorAll(e.flexibleOptionSelector).forEach((ve) => {
            ve.classList.remove("active");
          }), z.classList.add("active");
        });
      }), s = !0), W;
    },
    renderCalendar: O,
    openCalendar: k,
    closeCalendar: C,
    cancelSelection: T,
    getState: () => n,
    getMonth: () => new Date(r),
    setMonth: (A) => {
      r = new Date(A), O();
    }
  };
  return W;
}, O0 = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (t) => Sp(t)
  };
};
let kd = !1, Ed = !1;
const D0 = () => {
  Ed || (Ed = !0, document.body.addEventListener("click", async (t) => {
    var n;
    (n = t.target) != null && n.closest('[data-action="OPEN_RESERVATION_DRAWER"]') && (t.preventDefault(), await ba.open());
  }));
}, Ke = () => {
  kd || (kd = !0, window.initHeader = () => Vi(), window.initFooter = () => ha(), window.initMegaMenu = () => Uo(), window.initStaggerNav = () => pa(), O0(), qm(), Fm(), D0(), L0());
}, Hw = (t) => (Ke(), Sp(t)), z0 = ({ children: t, className: e = "" }) => /* @__PURE__ */ d.jsx("div", { className: ["user_box", "inner2", "login-card", e].filter(Boolean).join(" "), children: t }), F0 = (t) => t === "success" ? "success" : t === "warning" ? "warning" : t === "error" ? "error" : "", Qi = ({ className: t = "", id: e, message: n, tone: r = "idle" }) => {
  if (!n)
    return null;
  const s = ["input-feedback", F0(r), t].filter(Boolean).join(" ");
  return /* @__PURE__ */ d.jsx("p", { className: s, id: e, children: n });
}, Qt = ({
  autoComplete: t,
  className: e,
  disabled: n,
  feedback: r,
  feedbackTone: i = "idle",
  id: s,
  inputMode: a,
  label: l,
  maxLength: o,
  onChange: u,
  placeholder: c,
  readOnly: f,
  rightSlot: p,
  type: y = "text",
  value: _
}) => {
  const g = /* @__PURE__ */ d.jsx(
    "input",
    {
      autoComplete: t,
      disabled: n,
      id: s,
      inputMode: a,
      maxLength: o,
      onChange: u,
      placeholder: c,
      readOnly: f,
      type: y,
      value: _
    }
  );
  return /* @__PURE__ */ d.jsxs("div", { className: ["input_group", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ d.jsx("label", { htmlFor: s, children: l }),
    p ? /* @__PURE__ */ d.jsxs("div", { className: "input-with-button", children: [
      g,
      p
    ] }) : g,
    r ? /* @__PURE__ */ d.jsx(Qi, { message: r, tone: i }) : null
  ] });
}, B0 = (t) => ({
  completeSignup: (e) => {
    t({
      payload: { completedName: e },
      type: "COMPLETE_SIGNUP"
    });
  },
  patchLogin: (e) => {
    t({
      payload: e,
      type: "PATCH_LOGIN"
    });
  },
  patchPassAuth: (e) => {
    t({
      payload: e,
      type: "PATCH_PASS_AUTH"
    });
  },
  patchSignupAccount: (e) => {
    t({
      payload: e,
      type: "PATCH_SIGNUP_ACCOUNT"
    });
  },
  patchSignupIdentity: (e) => {
    t({
      payload: e,
      type: "PATCH_SIGNUP_IDENTITY"
    });
  },
  patchSignupTerms: (e) => {
    t({
      payload: e,
      type: "PATCH_SIGNUP_TERMS"
    });
  },
  resetError: (e) => {
    t({
      payload: e,
      type: "RESET_ERROR"
    });
  },
  setError: (e, n) => {
    t({
      payload: { message: n, scope: e },
      type: "SET_ERROR"
    });
  },
  setPassAuthStep: (e) => {
    t({
      payload: e,
      type: "SET_PASS_AUTH_STEP"
    });
  },
  setSignupStep: (e) => {
    t({
      payload: e,
      type: "SET_SIGNUP_STEP"
    });
  },
  setStatus: (e) => {
    t({
      payload: e,
      type: "SET_STATUS"
    });
  }
}), dl = () => ({
  message: "",
  tone: "idle"
}), U0 = () => ({
  authMethod: "",
  birthDate: "",
  gender: "",
  isVerified: !1,
  name: "",
  phone: "",
  provider: "",
  rrnBackFirstDigit: "",
  telecom: ""
}), H0 = (t = "") => ({
  errors: {
    global: "",
    login: "",
    passAuth: "",
    signup: ""
  },
  login: {
    loginId: t,
    password: "",
    rememberId: t.length > 0,
    submitting: !1
  },
  passAuth: {
    authMethod: "",
    birthSix: "",
    name: "",
    phone: "",
    recaptchaSiteKey: "",
    recaptchaStatus: "idle",
    recaptchaToken: "",
    rrnDigit: "",
    step: 1,
    submitting: !1,
    telecom: ""
  },
  signup: {
    account: {
      email: "",
      idCheckedValue: "",
      idFeedback: dl(),
      idCheckStatus: "idle",
      password: "",
      passwordConfirm: "",
      passwordConfirmFeedback: dl(),
      passwordFeedback: dl(),
      passwordStrength: "hidden",
      submitting: !1,
      userId: ""
    },
    completedName: "",
    identity: U0(),
    step: 1,
    terms: {
      marketing: !1,
      privacy: !1,
      service: !1
    }
  },
  status: "idle"
}), V0 = (t, e) => {
  switch (e.type) {
    case "SET_STATUS":
      return {
        ...t,
        status: e.payload
      };
    case "SET_ERROR":
      return {
        ...t,
        errors: {
          ...t.errors,
          [e.payload.scope]: e.payload.message
        }
      };
    case "RESET_ERROR":
      return {
        ...t,
        errors: {
          ...t.errors,
          [e.payload]: ""
        }
      };
    case "PATCH_LOGIN":
      return {
        ...t,
        login: {
          ...t.login,
          ...e.payload
        }
      };
    case "SET_SIGNUP_STEP":
      return {
        ...t,
        signup: {
          ...t.signup,
          step: e.payload
        }
      };
    case "PATCH_SIGNUP_TERMS":
      return {
        ...t,
        signup: {
          ...t.signup,
          terms: {
            ...t.signup.terms,
            ...e.payload
          }
        }
      };
    case "PATCH_SIGNUP_ACCOUNT":
      return {
        ...t,
        signup: {
          ...t.signup,
          account: {
            ...t.signup.account,
            ...e.payload
          }
        }
      };
    case "PATCH_SIGNUP_IDENTITY":
      return {
        ...t,
        signup: {
          ...t.signup,
          identity: {
            ...t.signup.identity,
            ...e.payload
          }
        }
      };
    case "COMPLETE_SIGNUP":
      return {
        ...t,
        signup: {
          ...t.signup,
          completedName: e.payload.completedName,
          step: 4
        }
      };
    case "PATCH_PASS_AUTH":
      return {
        ...t,
        passAuth: {
          ...t.passAuth,
          ...e.payload
        }
      };
    case "SET_PASS_AUTH_STEP":
      return {
        ...t,
        passAuth: {
          ...t.passAuth,
          step: e.payload
        }
      };
    default:
      return t;
  }
}, xp = P.createContext(null), kp = P.createContext(null), Du = ({ children: t, savedLoginId: e = "" }) => {
  const [n, r] = P.useReducer(V0, e, H0), i = P.useMemo(() => B0(r), [r]);
  return /* @__PURE__ */ d.jsx(xp.Provider, { value: n, children: /* @__PURE__ */ d.jsx(kp.Provider, { value: i, children: t }) });
}, Jn = () => {
  const t = P.useContext(xp);
  if (!t)
    throw new Error("useAuthState must be used within AuthProvider");
  return t;
}, qi = () => {
  const t = P.useContext(kp);
  if (!t)
    throw new Error("useAuthActions must be used within AuthProvider");
  return t;
}, $0 = async () => {
  const t = import("./sanitizer-BhJOIjXj.js"), e = import("./session_manager-BXQi3rte.js"), n = import("./api_config-D3oe4uhY.js");
  return Promise.all([t, e, n]);
}, W0 = async (t, e) => {
  const [{ sanitizeHTML: n, validateParam: r }, { saveSession: i }, { API_BASE_URL: s }] = await $0();
  if (!r(t) || !r(e))
    throw new Error("잘못된 입력 형식이 포함된 상태");
  const a = new URLSearchParams();
  a.append("id", n(t)), a.append("pw", n(e));
  const l = await fetch(`${s}/api/auth/login`, {
    body: a,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  if (!l.ok) {
    let u = "로그인에 실패한 상태";
    try {
      const c = await l.json();
      u = typeof c.message == "string" && c.message ? c.message : u;
    } catch {
    }
    throw new Error(u);
  }
  const o = await l.json();
  return i(o.user);
}, G0 = async (t) => {
  var c;
  const e = import("./routes-a0eotWQr.js"), n = import("./path_resolver-BRc60ifO.js"), r = import("./local_admin-CBhQtCZ0.js"), [{ ROUTES: i }, { resolveRoute: s }, { isLocalFrontEnvironment: a }] = await Promise.all([
    e,
    n,
    r
  ]), o = new URLSearchParams(window.location.search).get("redirect");
  if (o && !o.startsWith("javascript:") && !o.startsWith("data:")) {
    window.location.replace(o);
    return;
  }
  const u = a() && typeof t.role == "string" && t.role.includes("ADMIN") ? "ADMIN.DASHBOARD" : "HOME";
  try {
    const f = s(u);
    if ((c = window.__JEJU_ROUTE_NAVIGATOR__) != null && c.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(f, "login-success");
      return;
    }
    window.location.replace(f);
  } catch {
    window.location.replace(u === "ADMIN.DASHBOARD" ? i.ADMIN.DASHBOARD : i.HOME);
  }
}, xo = "jeju:login-id", K0 = () => {
  try {
    return localStorage.getItem(xo) ?? "";
  } catch {
    return "";
  }
}, Y0 = () => {
  const { errors: t, login: e } = Jn(), n = qi(), r = P.useMemo(() => e.submitting || e.loginId.trim().length === 0 || e.password.trim().length === 0, [e.loginId, e.password, e.submitting]);
  P.useEffect(() => {
    try {
      if (e.rememberId && e.loginId.trim()) {
        localStorage.setItem(xo, e.loginId.trim());
        return;
      }
      localStorage.removeItem(xo);
    } catch {
    }
  }, [e.loginId, e.rememberId]);
  const i = P.useCallback(
    (o) => {
      n.patchLogin({ loginId: o.target.value }), n.resetError("login");
    },
    [n]
  ), s = P.useCallback(
    (o) => {
      n.patchLogin({ password: o.target.value }), n.resetError("login");
    },
    [n]
  ), a = P.useCallback(
    (o) => {
      n.patchLogin({ rememberId: o.target.checked });
    },
    [n]
  ), l = P.useCallback(
    async (o) => {
      o.preventDefault();
      const u = e.loginId.trim(), c = e.password.trim();
      try {
        n.patchLogin({ submitting: !0 }), n.resetError("login"), n.setStatus("submitting");
        const f = await W0(u, c);
        n.setStatus("success"), await G0(f);
      } catch (f) {
        n.setStatus("error"), n.setError("login", f instanceof Error ? f.message : "로그인 처리 실패 상태");
      } finally {
        n.patchLogin({ submitting: !1 });
      }
    },
    [n, e.loginId, e.password]
  );
  return {
    errorMessage: t.login,
    handleIdChange: i,
    handlePasswordChange: s,
    handleRememberChange: a,
    handleSubmit: l,
    isDisabled: r,
    login: e
  };
}, Q0 = () => {
  const { errorMessage: t, handleIdChange: e, handlePasswordChange: n, handleRememberChange: r, handleSubmit: i, isDisabled: s, login: a } = Y0();
  return /* @__PURE__ */ d.jsxs(z0, { children: [
    /* @__PURE__ */ d.jsxs("div", { className: "login-header", children: [
      /* @__PURE__ */ d.jsx("h1", { className: "login-title", children: "로그인" }),
      /* @__PURE__ */ d.jsx("p", { className: "login-desc", children: "포인트 적립에서 운임 할인까지 회원 전용 혜택을 받아보는 구간" })
    ] }),
    /* @__PURE__ */ d.jsxs("form", { className: "login-form", id: "user_form", onSubmit: i, children: [
      /* @__PURE__ */ d.jsx(
        Qt,
        {
          autoComplete: "username",
          id: "id",
          label: "이메일/아이디",
          onChange: e,
          placeholder: "아이디 또는 이메일 입력",
          value: a.loginId
        }
      ),
      /* @__PURE__ */ d.jsx(
        Qt,
        {
          autoComplete: "current-password",
          id: "pw",
          label: "비밀번호",
          onChange: n,
          placeholder: "비밀번호 입력",
          type: "password",
          value: a.password
        }
      ),
      /* @__PURE__ */ d.jsx("div", { className: "error-wrapper", id: "login-error-wrapper", style: { display: t ? "block" : "none" }, children: /* @__PURE__ */ d.jsx("p", { className: "error-msg", children: t }) }),
      /* @__PURE__ */ d.jsxs("div", { className: "login_options", children: [
        /* @__PURE__ */ d.jsxs("label", { className: "remember-me", children: [
          /* @__PURE__ */ d.jsx("input", { checked: a.rememberId, id: "saveId", onChange: r, type: "checkbox" }),
          /* @__PURE__ */ d.jsx("span", { children: "아이디 저장" })
        ] }),
        /* @__PURE__ */ d.jsxs("div", { className: "nav-links", children: [
          /* @__PURE__ */ d.jsx("a", { href: "#", children: "아이디/비밀번호 찾기" }),
          /* @__PURE__ */ d.jsx("span", { className: "divider", children: "|" }),
          /* @__PURE__ */ d.jsx("a", { className: "route-link", "data-route": "AUTH.SIGNUP", href: "#", children: "회원가입" })
        ] })
      ] }),
      /* @__PURE__ */ d.jsx("button", { className: "login-btn btn", "data-state": a.submitting ? "loading" : "idle", disabled: s, type: "submit", children: a.submitting ? "로그인 중" : "로그인" })
    ] })
  ] });
}, q0 = () => {
  const t = P.useMemo(() => K0(), []);
  return /* @__PURE__ */ d.jsx(Du, { savedLoginId: t, children: /* @__PURE__ */ d.jsx(Q0, {}) });
}, Ep = ({ accent: t = "orange", currentStep: e, description: n, steps: r, title: i }) => {
  const s = P.useMemo(() => r.length <= 1 ? "0%" : `${(e - 1) / (r.length - 1) * 100}%`, [e, r.length]);
  return /* @__PURE__ */ d.jsxs("header", { className: `step-header ${t === "red" ? "step-header-pass" : ""}`, children: [
    /* @__PURE__ */ d.jsxs("div", { className: "step-header-text", children: [
      /* @__PURE__ */ d.jsx("h1", { className: "step-title", children: i }),
      n ? /* @__PURE__ */ d.jsx("p", { className: "step-desc", children: n }) : null
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "step-indicator", "data-accent": t, children: [
      /* @__PURE__ */ d.jsx("div", { className: "progress-bg" }),
      /* @__PURE__ */ d.jsx("div", { className: "progress-bar", style: { width: s } }),
      /* @__PURE__ */ d.jsx("div", { className: "step-circles", children: r.map((a, l) => {
        const o = l + 1, u = o === e ? "active" : o < e ? "completed" : "";
        return /* @__PURE__ */ d.jsx(
          "div",
          {
            "aria-label": `${o}단계 ${a.label}`,
            className: `step-circle ${u}`.trim(),
            children: o === e && a.iconClassName ? /* @__PURE__ */ d.jsx("i", { className: a.iconClassName }) : null
          },
          a.label
        );
      }) })
    ] })
  ] });
}, X0 = Object.freeze([
  { iconClassName: "fa-solid fa-signal", label: "통신사" },
  { label: "인증수단" },
  { label: "이름" },
  { label: "입력" },
  { label: "확인" }
]), J0 = Object.freeze([
  { label: "SKT", value: "SKT" },
  { label: "KT", value: "KT" },
  { label: "LG U+", value: "LG U+" },
  { isMuted: !0, label: `SKT
알뜰폰`, value: "SKT 알뜰폰" },
  { isMuted: !0, label: `KT
알뜰폰`, value: "KT 알뜰폰" },
  { isMuted: !0, label: `LG U+
알뜰폰`, value: "LG U+ 알뜰폰" }
]), Z0 = [
  {
    description: "더 빠르고 간편하게 인증 가능 상태",
    title: "PASS 인증",
    value: "PASS"
  },
  {
    description: "SMS 인증번호로 본인확인 진행 상태",
    title: "문자(SMS) 인증",
    value: "SMS"
  }
], Cd = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", ey = (t) => new Promise((e) => window.setTimeout(e, t)), ty = async () => {
  try {
    const { API_BASE_URL: t } = await import("./api_config-D3oe4uhY.js"), e = await fetch(`${t}/api/auth/verify`), n = await e.json().catch(() => ({}));
    return !e.ok || typeof n.siteKey != "string" || !n.siteKey.trim() ? Cd : n.siteKey;
  } catch {
    return Cd;
  }
}, ny = async (t) => {
  try {
    const { API_BASE_URL: e } = await import("./api_config-D3oe4uhY.js"), n = await fetch(`${e}/api/auth/verify`, {
      body: new URLSearchParams({
        action: "verifyRecaptcha",
        token: t
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }), r = await n.json().catch(() => ({}));
    return !n.ok || r.success === !1 ? {
      message: typeof r.message == "string" && r.message ? r.message : "보안문자 검증 실패 상태",
      success: !1
    } : {
      message: typeof r.message == "string" && r.message ? r.message : "보안문자 검증 완료 상태",
      success: !0
    };
  } catch {
    return {
      message: "보안문자 검증 응답 지연으로 임시 통과 처리 상태",
      success: !0
    };
  }
}, ry = async () => {
  await ey(3e3);
}, iy = () => {
  const { passAuth: t } = Jn(), e = qi();
  return P.useEffect(() => {
    let n = !0;
    return t.recaptchaSiteKey ? void 0 : ((async () => {
      const i = await ty();
      n && e.patchPassAuth({ recaptchaSiteKey: i });
    })(), () => {
      n = !1;
    });
  }, [e, t.recaptchaSiteKey]), null;
}, Cp = "JEJU_PASS_AUTH_SUCCESS", sy = () => {
  const n = window.screenX + Math.max(0, (window.outerWidth - 430) / 2), r = window.screenY + Math.max(0, (window.outerHeight - 800) / 2), i = new URL("pass_auth.html", window.location.href).toString();
  return window.open(
    i,
    "PASS_Auth_Popup",
    `width=430,height=800,left=${Math.round(n)},top=${Math.round(r)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
  );
}, ay = (t) => ({
  payload: t,
  source: "jeju-pass-auth",
  type: Cp
}), ly = (t) => {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return e.type === Cp && e.source === "jeju-pass-auth" && !!e.payload;
}, oy = (t) => !window.opener || window.opener.closed ? !1 : (window.opener.postMessage(ay(t), window.location.origin), !0), ko = (t) => t.replace(/\D/g, ""), Eo = (t) => {
  const e = ko(t).slice(0, 11);
  return e.length < 4 ? e : e.length < 8 ? `${e.slice(0, 3)}-${e.slice(3)}` : e.length === 10 ? `${e.slice(0, 3)}-${e.slice(3, 6)}-${e.slice(6)}` : `${e.slice(0, 3)}-${e.slice(3, 7)}-${e.slice(7)}`;
}, Tp = (t) => /^\d{6}$/.test(t), uy = (t) => /^[1-8]$/.test(t), cy = (t) => Tp(t) ? `${t.slice(0, 2)}-${t.slice(2, 4)}-${t.slice(4, 6)}` : "", dy = (t) => t === "1" || t === "3" || t === "5" || t === "7" ? "M" : t === "2" || t === "4" || t === "6" || t === "8" ? "F" : "", La = () => {
  const { errors: t, passAuth: e } = Jn(), n = qi(), r = P.useRef(null), i = P.useRef(null), s = P.useRef(null), a = P.useRef(null), l = P.useMemo(() => Tp(e.birthSix), [e.birthSix]), o = P.useMemo(() => uy(e.rrnDigit), [e.rrnDigit]), u = P.useMemo(() => ko(e.phone).length === 11, [e.phone]), c = l && o, f = c && u, p = f && e.recaptchaStatus === "success" && !e.submitting, y = P.useMemo(() => e.step === 1 ? "이용 중인 통신사를 선택해 주세요" : e.step === 2 ? "인증 방법을 선택해 주세요" : e.step === 3 ? "이름을 입력해 주세요" : c ? f ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", [e.step, c, f]), _ = P.useCallback(() => {
    var k;
    s.current !== null && ((k = window.grecaptcha) != null && k.reset) && window.grecaptcha.reset(s.current), n.patchPassAuth({
      recaptchaStatus: "idle",
      recaptchaToken: ""
    }), n.resetError("passAuth");
  }, [n]);
  P.useEffect(() => {
    if (!f || !e.recaptchaSiteKey || s.current !== null)
      return;
    let k = 0, C = 0, T = !0;
    const b = () => {
      var O;
      return !T || !a.current || !((O = window.grecaptcha) != null && O.render) ? !1 : (s.current = window.grecaptcha.render(a.current, {
        callback: async (U) => {
          var J;
          n.patchPassAuth({
            recaptchaStatus: "loading",
            recaptchaToken: U
          }), n.setStatus("verifying");
          const H = await ny(U);
          if (H.success) {
            n.patchPassAuth({ recaptchaStatus: "success" }), n.resetError("passAuth"), n.setStatus("verified");
            return;
          }
          n.patchPassAuth({
            recaptchaStatus: "error",
            recaptchaToken: ""
          }), n.setError("passAuth", H.message), n.setStatus("error"), s.current !== null && ((J = window.grecaptcha) != null && J.reset) && window.grecaptcha.reset(s.current);
        },
        sitekey: e.recaptchaSiteKey
      }), !0);
    };
    return b() || (k = window.setInterval(() => {
      b() && window.clearInterval(k);
    }, 200), C = window.setTimeout(() => {
      window.clearInterval(k);
    }, 4e3)), () => {
      T = !1, k && window.clearInterval(k), C && window.clearTimeout(C);
    };
  }, [n, e.recaptchaSiteKey, f]);
  const g = P.useCallback(
    (k) => {
      n.patchPassAuth({ telecom: k }), n.setPassAuthStep(2), n.resetError("passAuth");
    },
    [n]
  ), x = P.useCallback(
    (k) => {
      n.patchPassAuth({ authMethod: k }), n.setPassAuthStep(3), n.resetError("passAuth");
    },
    [n]
  ), m = P.useCallback(
    (k) => {
      n.patchPassAuth({ name: k.target.value }), n.resetError("passAuth");
    },
    [n]
  ), h = P.useCallback(() => {
    if (!e.name.trim()) {
      n.setError("passAuth", "이름 입력 필요 상태");
      return;
    }
    n.setPassAuthStep(4), n.resetError("passAuth");
  }, [n, e.name]), v = P.useCallback(
    (k) => {
      const C = ko(k.target.value).slice(0, 6);
      n.patchPassAuth({ birthSix: C }), C.length === 6 && window.setTimeout(() => {
        var T;
        return (T = r.current) == null ? void 0 : T.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && _();
    },
    [n, e.recaptchaStatus, e.recaptchaToken, _]
  ), w = P.useCallback(
    (k) => {
      const C = k.target.value.replace(/[^1-8]/g, "").slice(0, 1);
      n.patchPassAuth({ rrnDigit: C }), C.length === 1 && window.setTimeout(() => {
        var T;
        return (T = i.current) == null ? void 0 : T.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && _();
    },
    [n, e.recaptchaStatus, e.recaptchaToken, _]
  ), S = P.useCallback(
    (k) => {
      n.patchPassAuth({ phone: Eo(k.target.value) }), (e.recaptchaToken || e.recaptchaStatus === "success") && _();
    },
    [n, e.recaptchaStatus, e.recaptchaToken, _]
  ), E = P.useCallback(async () => {
    if (!p) {
      n.setError("passAuth", "입력값 또는 보안문자 확인 필요 상태");
      return;
    }
    const k = {
      authMethod: e.authMethod,
      birthDate: cy(e.birthSix),
      gender: dy(e.rrnDigit),
      name: e.name.trim(),
      phone: e.phone.trim(),
      provider: "PASS",
      rrnBackFirstDigit: e.rrnDigit,
      telecom: e.telecom
    };
    if (n.setPassAuthStep(5), n.patchPassAuth({ submitting: !0 }), n.resetError("passAuth"), n.setStatus("submitting"), await ry(), !oy(k)) {
      n.patchPassAuth({ submitting: !1 }), n.setPassAuthStep(4), n.setStatus("error"), n.setError("passAuth", "회원가입 창 연결 실패 상태");
      return;
    }
    n.setStatus("success"), window.close();
  }, [n, p, e.authMethod, e.birthSix, e.name, e.phone, e.rrnDigit, e.telecom]);
  return {
    canSubmit: p,
    errorMessage: t.passAuth,
    handleBirthChange: v,
    handleNameChange: m,
    handlePhoneChange: S,
    handleRrnChange: w,
    handleSelectMethod: x,
    handleSelectTelecom: g,
    handleSubmit: E,
    goToIdentityStep: h,
    passAuth: e,
    phoneInputRef: i,
    recaptchaHostRef: a,
    rrnDigitInputRef: r,
    shouldShowPhoneField: c,
    shouldShowRecaptcha: f,
    stepTitle: y
  };
}, fy = () => {
  const {
    canSubmit: t,
    errorMessage: e,
    handleBirthChange: n,
    handlePhoneChange: r,
    handleRrnChange: i,
    handleSubmit: s,
    passAuth: a,
    phoneInputRef: l,
    recaptchaHostRef: o,
    rrnDigitInputRef: u,
    shouldShowPhoneField: c,
    shouldShowRecaptcha: f
  } = La();
  return /* @__PURE__ */ d.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ d.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ d.jsx("input", { className: "readonly", id: "passNameDisplay", readOnly: !0, type: "text", value: a.name }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "pass-reg-group", children: [
      /* @__PURE__ */ d.jsx("input", { id: "passRegNum1", maxLength: 6, onChange: n, placeholder: "생년월일 6자리", type: "text", value: a.birthSix }),
      /* @__PURE__ */ d.jsx("span", { className: "dash", children: "-" }),
      /* @__PURE__ */ d.jsx("input", { id: "passRegNum2", maxLength: 1, onChange: i, ref: u, type: "text", value: a.rrnDigit }),
      /* @__PURE__ */ d.jsx("span", { className: "dots", children: "●●●●●●" })
    ] }),
    c ? /* @__PURE__ */ d.jsx("div", { className: "pass-input-group phone-input-group visible", id: "phoneInputGroup", children: /* @__PURE__ */ d.jsx(
      "input",
      {
        id: "passPhoneInput",
        maxLength: 13,
        onChange: r,
        placeholder: "휴대폰 번호",
        ref: l,
        type: "text",
        value: a.phone
      }
    ) }) : null,
    f ? /* @__PURE__ */ d.jsx("div", { className: "captcha-wrapper visible", id: "captchaWrapper", children: /* @__PURE__ */ d.jsx("div", { id: "recaptchaContainer", ref: o }) }) : null,
    a.recaptchaStatus === "success" ? /* @__PURE__ */ d.jsx("div", { className: "pass-inline-meta success", children: "보안문자 확인 완료 상태" }) : null,
    /* @__PURE__ */ d.jsx(Qi, { message: e, tone: "error" }),
    /* @__PURE__ */ d.jsx("button", { className: "pass-next-btn", disabled: !t, id: "btnPassSubmitAuth", onClick: () => void s(), type: "button", children: "확인" })
  ] });
}, hy = () => {
  const { handleSelectMethod: t } = La();
  return /* @__PURE__ */ d.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ d.jsx("div", { className: "authmethod-list", children: Z0.map((e) => /* @__PURE__ */ d.jsx("button", { className: "authmethod-btn", onClick: () => t(e.value), type: "button", children: /* @__PURE__ */ d.jsxs("div", { className: "method-info", children: [
    /* @__PURE__ */ d.jsx("strong", { children: e.title }),
    /* @__PURE__ */ d.jsx("span", { children: e.description })
  ] }) }, e.value)) }) });
}, py = () => {
  const { errorMessage: t, goToIdentityStep: e, handleNameChange: n, passAuth: r } = La();
  return /* @__PURE__ */ d.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ d.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ d.jsx("input", { id: "passNameInput", onChange: n, placeholder: "이름", type: "text", value: r.name }) }),
    /* @__PURE__ */ d.jsx(Qi, { message: t, tone: "error" }),
    /* @__PURE__ */ d.jsx("button", { className: "pass-next-btn", onClick: e, type: "button", children: "다음" })
  ] });
}, my = () => {
  const { handleSelectTelecom: t } = La();
  return /* @__PURE__ */ d.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ d.jsx("div", { className: "telecom-grid", children: J0.map((e) => /* @__PURE__ */ d.jsx(
    "button",
    {
      className: `telecom-btn ${e.isMuted ? "mvno" : ""}`.trim(),
      onClick: () => t(e.value),
      type: "button",
      children: e.label.split(`
`).map((n) => /* @__PURE__ */ d.jsx("span", { children: n }, n))
    },
    e.value
  )) }) });
}, gy = () => /* @__PURE__ */ d.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ d.jsxs("div", { className: "pass-confirm-ui", children: [
  /* @__PURE__ */ d.jsx("div", { className: "pass-loader pass-loader-lg" }),
  /* @__PURE__ */ d.jsx("div", { className: "pass-title-center", children: /* @__PURE__ */ d.jsx("strong", { children: "인증 진행 중 상태" }) }),
  /* @__PURE__ */ d.jsx("div", { className: "pass-subtitle", children: "잠시만 기다리면 회원가입 창으로 결과 전달 예정 상태" })
] }) }), vy = (t, e, n) => t === 1 ? "이용 중인 통신사를 선택해 주세요" : t === 2 ? "인증 방법을 선택해 주세요" : t === 3 ? "이름을 입력해 주세요" : e ? n ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", yy = () => {
  const { passAuth: t } = Jn(), e = t.birthSix.length === 6 && /^[1-8]$/.test(t.rrnDigit), n = e && t.phone.replace(/\D/g, "").length === 11;
  return /* @__PURE__ */ d.jsxs("div", { className: "pass-modal-content", children: [
    /* @__PURE__ */ d.jsx(iy, {}),
    /* @__PURE__ */ d.jsxs("div", { className: "pass-header", children: [
      /* @__PURE__ */ d.jsx("div", { className: "pass-logo-red", children: "PASS" }),
      /* @__PURE__ */ d.jsxs("div", { className: "pass-header-text", children: [
        "인증부터 본인확인까지",
        /* @__PURE__ */ d.jsx("br", {}),
        "일상으로 PASS"
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(
      Ep,
      {
        accent: "red",
        currentStep: t.step,
        steps: X0,
        title: vy(t.step, e, n)
      }
    ),
    t.step === 1 ? /* @__PURE__ */ d.jsx(my, {}) : null,
    t.step === 2 ? /* @__PURE__ */ d.jsx(hy, {}) : null,
    t.step === 3 ? /* @__PURE__ */ d.jsx(py, {}) : null,
    t.step === 4 ? /* @__PURE__ */ d.jsx(fy, {}) : null,
    t.step === 5 ? /* @__PURE__ */ d.jsx(gy, {}) : null,
    /* @__PURE__ */ d.jsxs("div", { className: "pass-footer", children: [
      "이용약관 ",
      /* @__PURE__ */ d.jsx("strong", { children: "개인정보처리방침" }),
      /* @__PURE__ */ d.jsx("br", {}),
      "VeriSign 256-bit SSL 암호화 적용 상태"
    ] })
  ] });
}, _y = () => /* @__PURE__ */ d.jsx(Du, { children: /* @__PURE__ */ d.jsx(yy, {}) }), wy = Object.freeze([
  { iconClassName: "fa-solid fa-plane", label: "약관동의" },
  { label: "본인인증" },
  { label: "정보입력" },
  { label: "가입완료" }
]), Sy = [
  {
    description: "",
    key: "service",
    label: "[필수] 이용약관 동의",
    required: !0
  },
  {
    description: "",
    key: "privacy",
    label: "[필수] 개인정보 수집 및 이용 동의",
    required: !0
  },
  {
    description: "* 마케팅 정보 수신에 동의하면 특가 및 이벤트 정보를 받을 수 있고 미동의여도 서비스 이용은 가능한 상태",
    key: "marketing",
    label: "[선택] 마케팅 정보 수신 동의",
    required: !1
  }
], Np = async () => {
  const t = import("./sanitizer-BhJOIjXj.js"), e = import("./api_config-D3oe4uhY.js");
  return Promise.all([t, e]);
}, xy = async (t) => {
  const [{ sanitizeHTML: e }, { API_BASE_URL: n }] = await Np(), r = await fetch(`${n}/api/auth/verify`, {
    body: new URLSearchParams({
      action: "checkId",
      id: e(t.trim())
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), i = await r.json().catch(() => ({}));
  return !r.ok || i.success === !1 ? {
    available: !1,
    message: typeof i.message == "string" && i.message ? i.message : "이미 사용 중인 아이디 상태"
  } : {
    available: !0,
    message: typeof i.message == "string" && i.message ? i.message : "사용 가능한 아이디 상태"
  };
}, ky = async (t) => {
  const [{ sanitizeHTML: e }, { API_BASE_URL: n }] = await Np(), r = new URLSearchParams();
  Object.entries(t).forEach(([a, l]) => {
    r.append(a, e(l));
  });
  const i = await fetch(`${n}/api/auth/signup`, {
    body: r,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), s = await i.json().catch(() => ({}));
  if (!i.ok || s.success === !1) {
    const a = typeof s.message == "string" && s.message ? s.message : `회원가입 처리 실패 상태 (${i.status})`;
    throw new Error(a);
  }
  return s;
}, fl = Object.freeze({
  KAKAO_JS_KEY: "",
  NAVER_CLIENT_ID: ""
});
let Nn = null;
const Ey = (t) => {
  const e = t && typeof t == "object" ? t.social ?? {} : {};
  return {
    KAKAO_JS_KEY: String(e.kakaoJsKey ?? "").trim(),
    NAVER_CLIENT_ID: String(e.naverClientId ?? "").trim()
  };
}, jp = async () => {
  if (Nn)
    return { ...Nn };
  try {
    const { API_BASE_URL: t } = await import("./api_config-D3oe4uhY.js"), e = await fetch(`${t}/api/public/config`, {
      credentials: "same-origin",
      method: "GET"
    });
    if (!e.ok)
      return Nn = { ...fl }, { ...Nn };
    const n = await e.json().catch(() => ({}));
    Nn = {
      ...fl,
      ...Ey(n)
    };
  } catch {
    Nn = { ...fl };
  }
  return { ...Nn };
}, Cy = async () => {
  if (typeof Kakao > "u")
    return { message: "카카오 SDK 로드 실패 상태", ok: !1 };
  const t = await jp();
  return t.KAKAO_JS_KEY ? (Kakao.isInitialized() || Kakao.init(t.KAKAO_JS_KEY), { message: "", ok: !0 }) : { message: "카카오 JavaScript 키 누락 상태", ok: !1 };
}, Ty = () => new URL(window.location.pathname, window.location.origin).href, Ny = async (t) => {
  if (t === "kakao") {
    const n = await Cy();
    return n.ok ? new Promise((r) => {
      Kakao.Auth.login({
        fail: () => {
          r({
            message: "카카오 로그인 연동 실패 상태",
            success: !1
          });
        },
        success: () => {
          Kakao.API.request({
            fail: () => {
              r({
                message: "카카오 사용자 정보 조회 실패 상태",
                success: !1
              });
            },
            success: (i) => {
              var a;
              const s = i.kakao_account ?? {};
              r({
                data: {
                  gender: s.gender === "male" ? "M" : "F",
                  name: s.name || ((a = i.properties) == null ? void 0 : a.nickname) || "회원",
                  phone: Eo(s.phone_number || "01000000000"),
                  provider: "KAKAO"
                },
                success: !0
              });
            },
            url: "/v2/user/me"
          });
        }
      });
    }) : {
      message: n.message,
      success: !1
    };
  }
  const e = await jp();
  return typeof naver > "u" || typeof naver.LoginWithNaverId > "u" ? {
    message: "네이버 SDK 로드 실패 상태",
    success: !1
  } : e.NAVER_CLIENT_ID ? new Promise((n) => {
    const r = "naverIdLogin";
    let i = document.getElementById(r);
    i || (i = document.createElement("div"), i.id = r, i.style.display = "none", document.body.appendChild(i));
    try {
      const s = new naver.LoginWithNaverId({
        callbackUrl: Ty(),
        clientId: e.NAVER_CLIENT_ID,
        isPopup: !0,
        loginButton: { color: "green", height: 60, type: 3 }
      });
      s.init(), s.getLoginStatus((a) => {
        if (a) {
          n({
            data: {
              gender: s.user.getGender() === "M" ? "M" : "F",
              name: s.user.getName() || "회원",
              phone: Eo(s.user.getMobile() || "01000000000"),
              provider: "NAVER"
            },
            success: !0
          });
          return;
        }
        s.authorize(), n({
          pending: !0,
          success: !1
        });
      });
    } catch {
      n({
        message: "네이버 로그인 초기화 실패 상태",
        success: !1
      });
    }
  }) : {
    message: "네이버 Client ID 누락 상태",
    success: !1
  };
}, jy = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]{8,}$/, Py = /[!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]/, Ay = (t) => t ? jy.test(t) ? Py.test(t) ? {
  feedback: {
    message: "사용 가능한 안전한 비밀번호 상태",
    tone: "success"
  },
  isValid: !0,
  strength: "strong"
} : {
  feedback: {
    message: "사용 가능한 비밀번호 상태",
    tone: "warning"
  },
  isValid: !0,
  strength: "medium"
} : {
  feedback: {
    message: "영문과 숫자를 포함한 8자 이상 필요함",
    tone: "error"
  },
  isValid: !1,
  strength: "weak"
} : {
  feedback: {
    message: "",
    tone: "idle"
  },
  isValid: !1,
  strength: "hidden"
}, by = (t, e) => e ? t === e ? {
  feedback: {
    message: "비밀번호가 일치하는 상태",
    tone: "success"
  },
  isMatch: !0
} : {
  feedback: {
    message: "비밀번호가 일치하지 않는 상태",
    tone: "error"
  },
  isMatch: !1
} : {
  feedback: {
    message: "",
    tone: "idle"
  },
  isMatch: !1
}, Td = /^[A-Za-z0-9]{4,20}$/, Nd = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, zu = () => {
  const { errors: t, signup: e } = Jn(), n = qi(), r = P.useMemo(() => e.terms.service && e.terms.privacy, [e.terms.privacy, e.terms.service]), i = P.useMemo(() => e.terms.service && e.terms.privacy && e.terms.marketing, [e.terms.marketing, e.terms.privacy, e.terms.service]), s = P.useMemo(() => {
    const h = e.identity.isVerified && e.identity.provider === "PASS" && !!e.identity.birthDate && !!e.identity.rrnBackFirstDigit, v = e.account.idCheckStatus === "success" && e.account.idCheckedValue === e.account.userId.trim(), w = e.account.passwordStrength === "medium" || e.account.passwordStrength === "strong", S = e.account.passwordConfirmFeedback.tone === "success", E = Nd.test(e.account.email.trim());
    return h && v && w && S && E && !e.account.submitting;
  }, [
    e.account.email,
    e.account.idCheckStatus,
    e.account.idCheckedValue,
    e.account.passwordConfirmFeedback.tone,
    e.account.passwordStrength,
    e.account.submitting,
    e.account.userId,
    e.identity.birthDate,
    e.identity.isVerified,
    e.identity.provider,
    e.identity.rrnBackFirstDigit
  ]), a = P.useCallback(
    (h, v) => {
      const w = Ay(h), S = by(h, v);
      n.patchSignupAccount({
        password: h,
        passwordConfirm: v,
        passwordConfirmFeedback: S.feedback,
        passwordFeedback: w.feedback,
        passwordStrength: w.strength
      });
    },
    [n]
  ), l = P.useCallback(
    (h) => {
      n.patchSignupTerms({
        marketing: h.target.checked,
        privacy: h.target.checked,
        service: h.target.checked
      });
    },
    [n]
  ), o = P.useCallback(
    (h) => (v) => {
      n.patchSignupTerms({ [h]: v.target.checked });
    },
    [n]
  ), u = P.useCallback(() => {
    r && (n.setSignupStep(2), n.resetError("signup"));
  }, [n, r]), c = P.useCallback(() => {
    if (!sy()) {
      n.setError("signup", "팝업 차단 해제 필요 상태"), n.setStatus("error");
      return;
    }
    n.setStatus("verifying"), n.setError("signup", "PASS 인증 완료 후 자동 이동 예정 상태");
  }, [n]), f = P.useCallback(
    async (h) => {
      n.setStatus("verifying"), n.resetError("signup");
      const v = await Ny(h);
      if (v.success && v.data) {
        n.patchSignupIdentity({
          gender: v.data.gender,
          isVerified: !0,
          name: v.data.name,
          phone: v.data.phone,
          provider: v.data.provider
        }), n.completeSignup(v.data.name || "회원"), n.setStatus("success");
        return;
      }
      if (v.pending) {
        n.setError("signup", "소셜 인증 팝업 진행 중 상태");
        return;
      }
      n.setStatus("error"), n.setError("signup", v.message || "소셜 인증 실패 상태");
    },
    [n]
  ), p = P.useCallback(
    (h) => {
      n.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "",
          tone: "idle"
        },
        idCheckStatus: "idle",
        userId: h.target.value
      }), n.resetError("signup");
    },
    [n]
  ), y = P.useCallback(
    (h) => {
      n.patchSignupAccount({ email: h.target.value }), n.resetError("signup");
    },
    [n]
  ), _ = P.useCallback(
    (h) => {
      a(h.target.value, e.account.passwordConfirm), n.resetError("signup");
    },
    [n, e.account.passwordConfirm, a]
  ), g = P.useCallback(
    (h) => {
      a(e.account.password, h.target.value), n.resetError("signup");
    },
    [n, e.account.password, a]
  ), x = P.useCallback(async () => {
    const h = e.account.userId.trim();
    if (!Td.test(h)) {
      n.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "영문과 숫자 4자 이상 20자 이하 필요 상태",
          tone: "error"
        },
        idCheckStatus: "error"
      });
      return;
    }
    n.patchSignupAccount({
      idFeedback: {
        message: "확인 중 상태",
        tone: "info"
      },
      idCheckStatus: "loading"
    });
    const v = await xy(h);
    n.patchSignupAccount({
      idCheckedValue: v.available ? h : "",
      idFeedback: {
        message: v.message,
        tone: v.available ? "success" : "error"
      },
      idCheckStatus: v.available ? "success" : "error"
    });
  }, [n, e.account.userId]), m = P.useCallback(
    async (h) => {
      if (h.preventDefault(), !e.identity.isVerified || e.identity.provider !== "PASS") {
        n.setError("signup", "PASS 인증 완료 후 가입 진행 가능 상태");
        return;
      }
      if (!Td.test(e.account.userId.trim())) {
        n.setError("signup", "아이디 형식 재확인 필요 상태");
        return;
      }
      if (!Nd.test(e.account.email.trim())) {
        n.setError("signup", "이메일 형식 재확인 필요 상태");
        return;
      }
      if (!s) {
        n.setError("signup", "입력값 점검 필요 상태");
        return;
      }
      try {
        n.patchSignupAccount({ submitting: !0 }), n.resetError("signup"), n.setStatus("submitting"), await ky({
          birthDate: e.identity.birthDate,
          email: e.account.email.trim(),
          gender: e.identity.gender,
          id: e.account.userId.trim(),
          name: e.identity.name.trim(),
          phone: e.identity.phone.trim(),
          provider: e.identity.provider || "PASS",
          pw: e.account.password.trim(),
          rrnBackFirstDigit: e.identity.rrnBackFirstDigit
        }), n.completeSignup(e.identity.name || "회원"), n.setStatus("success");
      } catch (v) {
        n.setStatus("error"), n.setError("signup", v instanceof Error ? v.message : "회원가입 처리 실패 상태");
      } finally {
        n.patchSignupAccount({ submitting: !1 });
      }
    },
    [n, s, e.account.email, e.account.password, e.account.userId, e.identity]
  );
  return {
    allTermsChecked: i,
    canSubmit: s,
    errorMessage: t.signup,
    goToVerificationStep: u,
    handleCheckId: x,
    handleEmailChange: y,
    handleOpenPassAuth: c,
    handlePasswordChange: _,
    handlePasswordConfirmChange: g,
    handleSocialSignup: f,
    handleSubmit: m,
    handleToggleAllTerms: l,
    handleToggleTerm: o,
    handleUserIdChange: p,
    requiredTermsChecked: r,
    signup: e
  };
}, Ly = (t) => t === "loading" ? "확인 중" : t === "success" ? "확인 완료" : "중복확인", Iy = () => {
  const {
    canSubmit: t,
    errorMessage: e,
    handleCheckId: n,
    handleEmailChange: r,
    handlePasswordChange: i,
    handlePasswordConfirmChange: s,
    handleSubmit: a,
    handleUserIdChange: l,
    signup: o
  } = zu();
  return /* @__PURE__ */ d.jsxs("form", { className: "step-panel active", onSubmit: a, children: [
    /* @__PURE__ */ d.jsx(
      Qt,
      {
        id: "userName",
        label: "이름",
        onChange: () => {
        },
        placeholder: "",
        readOnly: !0,
        value: o.identity.name
      }
    ),
    /* @__PURE__ */ d.jsx(
      Qt,
      {
        id: "verifiedPhone",
        label: "휴대전화번호",
        onChange: () => {
        },
        placeholder: "",
        readOnly: !0,
        value: o.identity.phone
      }
    ),
    /* @__PURE__ */ d.jsx(
      Qt,
      {
        feedback: o.account.idFeedback.message,
        feedbackTone: o.account.idFeedback.tone,
        id: "userId",
        label: "아이디",
        onChange: l,
        placeholder: "영문과 숫자 4~20자",
        rightSlot: /* @__PURE__ */ d.jsx("button", { className: "btn-secondary btn-verify", disabled: o.account.idCheckStatus === "loading", onClick: () => void n(), type: "button", children: Ly(o.account.idCheckStatus) }),
        value: o.account.userId
      }
    ),
    /* @__PURE__ */ d.jsx(
      Qt,
      {
        feedback: o.account.passwordFeedback.message,
        feedbackTone: o.account.passwordFeedback.tone,
        id: "password",
        label: "비밀번호",
        onChange: i,
        placeholder: "영문과 숫자 조합 8자 이상",
        type: "password",
        value: o.account.password
      }
    ),
    o.account.passwordStrength !== "hidden" ? /* @__PURE__ */ d.jsxs("div", { className: `password-strength-container strength-${o.account.passwordStrength}`, children: [
      /* @__PURE__ */ d.jsxs("div", { className: "password-strength-meter", children: [
        /* @__PURE__ */ d.jsx("div", { className: "meter-bar", id: "meterBar1" }),
        /* @__PURE__ */ d.jsx("div", { className: "meter-bar", id: "meterBar2" }),
        /* @__PURE__ */ d.jsx("div", { className: "meter-bar", id: "meterBar3" })
      ] }),
      /* @__PURE__ */ d.jsx("span", { className: "strength-text", id: "strengthText", children: o.account.passwordStrength === "strong" ? "안전" : o.account.passwordStrength === "medium" ? "보통" : "불가" })
    ] }) : null,
    /* @__PURE__ */ d.jsx(
      Qt,
      {
        feedback: o.account.passwordConfirmFeedback.message,
        feedbackTone: o.account.passwordConfirmFeedback.tone,
        id: "passwordConfirm",
        label: "비밀번호 확인",
        onChange: s,
        placeholder: "비밀번호 다시 입력",
        type: "password",
        value: o.account.passwordConfirm
      }
    ),
    /* @__PURE__ */ d.jsx(
      Qt,
      {
        id: "userEmail",
        label: "이메일",
        onChange: r,
        placeholder: "example@email.com",
        type: "email",
        value: o.account.email
      }
    ),
    o.identity.telecom ? /* @__PURE__ */ d.jsxs("div", { className: "auth-summary-chip", children: [
      "PASS 인증 완료",
      /* @__PURE__ */ d.jsx("span", { children: o.identity.telecom })
    ] }) : null,
    /* @__PURE__ */ d.jsx(Qi, { className: "signup-submit-feedback", message: e, tone: "error" }),
    /* @__PURE__ */ d.jsx("div", { className: "form-actions", children: /* @__PURE__ */ d.jsx("button", { className: "btn-primary", disabled: !t, id: "btnSignupSubmit", type: "submit", children: o.account.submitting ? "가입 처리 중" : "가입 완료" }) })
  ] });
}, Ry = () => {
  const t = qi();
  return P.useEffect(() => {
    const e = (n) => {
      n.origin !== window.location.origin || !ly(n.data) || (t.patchSignupIdentity({
        authMethod: n.data.payload.authMethod,
        birthDate: n.data.payload.birthDate,
        gender: n.data.payload.gender,
        isVerified: !0,
        name: n.data.payload.name,
        phone: n.data.payload.phone,
        provider: n.data.payload.provider,
        rrnBackFirstDigit: n.data.payload.rrnBackFirstDigit,
        telecom: n.data.payload.telecom
      }), t.setSignupStep(3), t.resetError("signup"), t.setStatus("verified"));
    };
    return window.addEventListener("message", e), () => {
      window.removeEventListener("message", e);
    };
  }, [t]), null;
}, My = () => {
  const { signup: t } = Jn();
  return /* @__PURE__ */ d.jsx("div", { className: "step-panel active", children: /* @__PURE__ */ d.jsxs("div", { className: "success-content", children: [
    /* @__PURE__ */ d.jsx("i", { className: "fa-solid fa-circle-check success-icon" }),
    /* @__PURE__ */ d.jsxs("h2", { className: "success-title", children: [
      t.completedName || "회원",
      " 가입 완료 상태"
    ] }),
    /* @__PURE__ */ d.jsx("p", { className: "success-desc", children: "제주그룹 계정 생성이 완료된 상태" }),
    /* @__PURE__ */ d.jsx("div", { className: "form-actions", children: /* @__PURE__ */ d.jsx("a", { className: "btn-primary route-link", "data-route": "AUTH.LOGIN", href: "#", children: "로그인 페이지로 이동" }) })
  ] }) });
}, Oy = () => {
  const { allTermsChecked: t, goToVerificationStep: e, handleToggleAllTerms: n, handleToggleTerm: r, requiredTermsChecked: i, signup: s } = zu();
  return /* @__PURE__ */ d.jsxs("div", { className: "step-panel active", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "agree_box flat-agree-box", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "check-all-wrapper", children: [
        /* @__PURE__ */ d.jsxs("label", { className: "custom-chk check-all", children: [
          /* @__PURE__ */ d.jsx("input", { checked: t, className: "hidden-chk", id: "termAll", onChange: n, type: "checkbox" }),
          /* @__PURE__ */ d.jsx("span", { className: "chk-mark" }),
          /* @__PURE__ */ d.jsx("span", { children: "전체 동의" })
        ] }),
        /* @__PURE__ */ d.jsxs("div", { className: "agree-desc", children: [
          "전체동의에는 필수와 선택 동의가 포함되고 개별 선택도 가능한 상태",
          /* @__PURE__ */ d.jsx("br", {}),
          "선택 항목과 무관하게 정상 서비스 이용은 가능한 상태"
        ] })
      ] }),
      Sy.map((a) => /* @__PURE__ */ d.jsxs("div", { children: [
        /* @__PURE__ */ d.jsxs("label", { className: `custom-chk ${a.required ? "" : "opt-chk"}`.trim(), children: [
          /* @__PURE__ */ d.jsx(
            "input",
            {
              checked: s.terms[a.key],
              className: "hidden-chk",
              onChange: r(a.key),
              type: "checkbox"
            }
          ),
          /* @__PURE__ */ d.jsx("span", { className: "chk-mark" }),
          a.label,
          /* @__PURE__ */ d.jsx("i", { className: "fa-solid fa-chevron-right arrow-right" })
        ] }),
        a.description ? /* @__PURE__ */ d.jsx("div", { className: "opt-desc", children: a.description }) : null
      ] }, a.key))
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "form-actions flat-actions", children: /* @__PURE__ */ d.jsx("button", { className: "btn-flat", disabled: !i, onClick: e, type: "button", children: "다음" }) })
  ] });
}, Dy = () => {
  const { errorMessage: t, handleOpenPassAuth: e, handleSocialSignup: n } = zu();
  return /* @__PURE__ */ d.jsxs("div", { className: "step-panel active", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "auth-methods", children: [
      /* @__PURE__ */ d.jsxs("button", { className: "auth-btn kakao", onClick: () => void n("kakao"), type: "button", children: [
        /* @__PURE__ */ d.jsx("i", { className: "fa-solid fa-comment" }),
        "카카오로 간편 가입"
      ] }),
      /* @__PURE__ */ d.jsxs("button", { className: "auth-btn naver", onClick: () => void n("naver"), type: "button", children: [
        /* @__PURE__ */ d.jsx("i", { className: "fa-solid fa-n", style: { fontWeight: 900 } }),
        "네이버로 간편 가입"
      ] }),
      /* @__PURE__ */ d.jsxs("button", { className: "auth-btn pass", onClick: e, type: "button", children: [
        /* @__PURE__ */ d.jsx("div", { className: "pass-logo-text", children: "PASS" }),
        "휴대전화 본인 인증"
      ] })
    ] }),
    /* @__PURE__ */ d.jsx("p", { className: "auth-method-note", children: "실가입 데이터 연동은 PASS 경로 기준 상태" }),
    /* @__PURE__ */ d.jsx(Qi, { className: "auth-feedback", message: t, tone: t.includes("완료") ? "info" : "error" })
  ] });
}, zy = (t) => t === 1 ? "약관동의" : t === 2 ? "본인인증" : t === 3 ? "정보입력" : "가입완료", Fy = () => {
  const { signup: t } = Jn();
  return /* @__PURE__ */ d.jsxs("section", { className: "signup-container", children: [
    /* @__PURE__ */ d.jsx(Ry, {}),
    /* @__PURE__ */ d.jsx(Ep, { currentStep: t.step, steps: wy, title: zy(t.step) }),
    /* @__PURE__ */ d.jsxs("div", { className: "user_form", children: [
      t.step === 1 ? /* @__PURE__ */ d.jsx(Oy, {}) : null,
      t.step === 2 ? /* @__PURE__ */ d.jsx(Dy, {}) : null,
      t.step === 3 ? /* @__PURE__ */ d.jsx(Iy, {}) : null,
      t.step === 4 ? /* @__PURE__ */ d.jsx(My, {}) : null
    ] })
  ] });
}, By = () => /* @__PURE__ */ d.jsx(Du, { children: /* @__PURE__ */ d.jsx(Fy, {}) }), jd = /* @__PURE__ */ new Map(), Ia = (t, e) => {
  const n = document.getElementById(t);
  if (!n)
    return;
  const r = jd.get(t);
  r && r.unmount();
  const i = $r(n);
  jd.set(t, i), i.render(e);
}, Uy = () => {
  Ia("jeju-login-app", /* @__PURE__ */ d.jsx(q0, {}));
}, Hy = () => {
  Ia("jeju-pass-auth-app", /* @__PURE__ */ d.jsx(_y, {}));
}, hl = {
  email: "minji.hong@jejugroup.example",
  memberships: ["Jeju Air 리프레시", "Jeju Stay 프레스티지"],
  name: "홍민지"
}, Pd = [
  { label: "보유 포인트", tone: "wallet", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "wallet", value: "12장" },
  { label: "예정된 항공 일정", tone: "air", value: "2건" },
  { label: "예정된 숙소 일정", tone: "stay", value: "1건" }
], Vy = [
  {
    amount: "324,000원",
    date: "2026.11.20 09:10",
    id: "air-icn-nrt",
    status: "출발 예정",
    tags: ["모바일 탑승권", "위탁 수하물 15kg"],
    title: "ICN → NRT 제주항공 7C1102",
    type: "air"
  },
  {
    amount: "124,000원",
    date: "2026.10.15 08:30",
    id: "air-gmp-cju",
    status: "출발 예정",
    tags: ["성인 1, 소아 1", "사전 수하물"],
    title: "GMP → CJU 제주항공 7C113",
    type: "air"
  },
  {
    amount: "480,000원",
    date: "2026.10.15 ~ 10.17",
    id: "stay-jeju-ocean",
    status: "체크인 예정",
    tags: ["조식 포함", "수영장", "얼리 체크인"],
    title: "Jeju Ocean Suite",
    type: "stay"
  },
  {
    amount: "135,000원",
    date: "2026.10.15 09:30",
    id: "rent-ioniq",
    status: "인수 예정",
    tags: ["완전 자차", "공항 픽업", "전기차"],
    title: "IONIQ 6 Long Range",
    type: "rent"
  }
], $y = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], Wy = () => ({
  bookings: [...Vy],
  filter: "all"
}), Gy = (t, e) => {
  switch (e.type) {
    case "HYDRATE_BOOKINGS":
      return { ...t, bookings: [...e.payload] };
    case "SET_FILTER":
      return { ...t, filter: e.payload };
    default:
      return t;
  }
}, Pp = P.createContext(null), Ky = ({ children: t }) => {
  const [e, n] = P.useReducer(Gy, void 0, Wy), r = P.useMemo(
    () => ({
      dispatch: n,
      state: e
    }),
    [e]
  );
  return /* @__PURE__ */ d.jsx(Pp.Provider, { value: r, children: t });
}, Yy = () => {
  const t = P.useContext(Pp);
  if (!t)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return t;
}, pl = ({ children: t, className: e = "" }) => {
  const n = ["bento-box", "soft-radius", e].filter(Boolean).join(" ");
  return /* @__PURE__ */ d.jsx("div", { className: n, children: t });
}, Qy = {
  air: "brand-air",
  rent: "brand-rent",
  stay: "brand-stay",
  wallet: ""
}, qy = ({ tone: t, value: e }) => {
  const n = Qy[t];
  return /* @__PURE__ */ d.jsx("span", { className: `pill-shape ${n}`.trim(), children: e });
}, Xy = ["all", "air", "stay", "rent"], Jy = () => {
  const { dispatch: t, state: e } = Yy(), n = P.useMemo(() => e.filter === "all" ? e.bookings : e.bookings.filter((i) => i.type === e.filter), [e.bookings, e.filter]), r = P.useCallback(
    (i) => {
      t({ type: "SET_FILTER", payload: i });
    },
    [t]
  );
  return /* @__PURE__ */ d.jsxs("div", { className: "meta-dashboard-layout", children: [
    /* @__PURE__ */ d.jsxs("section", { className: "meta-section layer-hero bento-grid", children: [
      /* @__PURE__ */ d.jsxs(pl, { className: "hero-glass-container", children: [
        /* @__PURE__ */ d.jsx("div", { className: "profile-avatar-wrap", children: /* @__PURE__ */ d.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: "https://api.dicebear.com/7.x/notionists/svg?seed=minji-black&backgroundColor=242424"
          }
        ) }),
        /* @__PURE__ */ d.jsxs("div", { className: "profile-core-wrap", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "profile-info", children: [
            /* @__PURE__ */ d.jsxs("h1", { className: "profile-name", children: [
              /* @__PURE__ */ d.jsx("strong", { className: "highlight", children: hl.name }),
              " 님"
            ] }),
            /* @__PURE__ */ d.jsx("p", { className: "profile-email", children: hl.email }),
            /* @__PURE__ */ d.jsx("div", { className: "membership-list", children: hl.memberships.map((i) => /* @__PURE__ */ d.jsxs("div", { className: "mem-badge soft-radius", children: [
              /* @__PURE__ */ d.jsx("span", { children: "멤버십" }),
              /* @__PURE__ */ d.jsx("strong", { children: i })
            ] }, i)) })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "quick-actions-bar", children: [
            /* @__PURE__ */ d.jsx("a", { className: "quick-btn pill-shape", href: "#", children: "예약 관리" }),
            /* @__PURE__ */ d.jsx("a", { className: "quick-btn pill-shape", href: "#", children: "쿠폰 보기" }),
            /* @__PURE__ */ d.jsx("a", { className: "quick-btn pill-shape", href: "#", children: "프로필 수정" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs(pl, { className: "wallet-box meta-glass-theme", children: [
        /* @__PURE__ */ d.jsxs("div", { className: "wallet-head", children: [
          /* @__PURE__ */ d.jsx("span", { className: "eyebrow", children: "My Wallet" }),
          /* @__PURE__ */ d.jsx("h3", { children: "보유 자산" })
        ] }),
        /* @__PURE__ */ d.jsxs("div", { className: "wallet-body", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "asset-main", children: [
            /* @__PURE__ */ d.jsx("span", { className: "val", children: "26,600" }),
            " ",
            /* @__PURE__ */ d.jsx("span", { className: "unit", children: "P" }),
            /* @__PURE__ */ d.jsx("p", { className: "expiring pill-shape", children: "이달 말 소멸 예정 1,200P" })
          ] }),
          /* @__PURE__ */ d.jsx("div", { className: "asset-grid", children: Pd.slice(0, 2).map((i) => /* @__PURE__ */ d.jsxs("div", { className: "asset-sub", children: [
            /* @__PURE__ */ d.jsx("span", { children: i.label }),
            /* @__PURE__ */ d.jsx("strong", { children: i.value })
          ] }, i.label)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("section", { className: "meta-section layer-full-management", children: [
      /* @__PURE__ */ d.jsx("header", { className: "section-header flex-header", children: /* @__PURE__ */ d.jsxs("div", { children: [
        /* @__PURE__ */ d.jsx("h2", { className: "section-title", children: "통합 예약 관리" }),
        /* @__PURE__ */ d.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 일정을 한 번에 정리하는 뷰" })
      ] }) }),
      /* @__PURE__ */ d.jsx("div", { className: "quick-actions-bar", style: { paddingTop: 0 }, children: Xy.map((i) => /* @__PURE__ */ d.jsx(
        "button",
        {
          className: "quick-btn pill-shape",
          onClick: () => r(i),
          type: "button",
          children: i === "all" ? "전체" : i === "air" ? "항공" : i === "stay" ? "숙박" : "렌터카"
        },
        i
      )) }),
      /* @__PURE__ */ d.jsx("div", { className: "management-categorized-wrap", children: /* @__PURE__ */ d.jsxs("div", { className: "service-category-block", children: [
        /* @__PURE__ */ d.jsx("h3", { className: "category-title", children: "현재 예약" }),
        /* @__PURE__ */ d.jsx("ul", { className: "full-width-trip-list", children: n.map((i) => /* @__PURE__ */ d.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": i.type, children: [
          /* @__PURE__ */ d.jsxs("div", { className: "trip-core-info", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "trip-head-flex", children: [
              /* @__PURE__ */ d.jsx(qy, { tone: i.type, value: i.status }),
              /* @__PURE__ */ d.jsx("div", { className: "trip-tags", children: i.tags.map((s) => /* @__PURE__ */ d.jsx("span", { className: "meta-tag pill-shape", children: s }, s)) })
            ] }),
            /* @__PURE__ */ d.jsx("h3", { className: "trip-title", children: i.title }),
            /* @__PURE__ */ d.jsxs("div", { className: "trip-meta-grid", children: [
              /* @__PURE__ */ d.jsx("div", { className: "meta-item", children: /* @__PURE__ */ d.jsx("span", { children: i.date }) }),
              /* @__PURE__ */ d.jsx("div", { className: "meta-item", children: /* @__PURE__ */ d.jsx("strong", { children: i.amount }) })
            ] })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "trip-inline-actions", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "action-group", children: [
              /* @__PURE__ */ d.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "상세 보기" }),
              /* @__PURE__ */ d.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "일정 변경" })
            ] }),
            /* @__PURE__ */ d.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "취소 요청" })
          ] })
        ] }, i.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ d.jsxs("section", { className: "meta-section layer-engagement", children: [
      /* @__PURE__ */ d.jsx("header", { className: "section-header", children: /* @__PURE__ */ d.jsx("h2", { className: "section-title", children: "자주 쓰는 바로가기" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "bento-grid support-grid", children: Pd.map((i) => /* @__PURE__ */ d.jsxs(pl, { children: [
        /* @__PURE__ */ d.jsx("strong", { children: i.label }),
        /* @__PURE__ */ d.jsx("p", { children: i.value })
      ] }, i.label)) })
    ] }),
    /* @__PURE__ */ d.jsxs("section", { className: "meta-section layer-support", children: [
      /* @__PURE__ */ d.jsx("header", { className: "section-header", children: /* @__PURE__ */ d.jsx("h2", { className: "section-title", children: "고객 지원" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "bento-grid support-grid", children: $y.map((i) => /* @__PURE__ */ d.jsx("a", { className: "support-item bento-item", href: i.href, children: /* @__PURE__ */ d.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ d.jsx("strong", { children: i.label }),
        i.count !== null ? /* @__PURE__ */ d.jsx("span", { className: "sp-badge", children: i.count }) : null
      ] }) }, i.id)) })
    ] })
  ] });
}, Zy = () => /* @__PURE__ */ d.jsx(Ky, { children: /* @__PURE__ */ d.jsx(Jy, {}) }), e_ = () => {
  Ia("mypage-dashboard-root", /* @__PURE__ */ d.jsx(Zy, {}));
}, Ad = [
  { href: "pages/cs/customerService.html", label: "고객센터" },
  { href: "pages/cs/notic.html", label: "공지사항" }
], t_ = [
  { href: "../pages/auth/login.html?shell=air", label: "로그인" },
  { href: "../pages/auth/signup.html?shell=air", label: "회원가입" }
], n_ = [
  { href: "pages/about/about.html", label: "제주항공" },
  { href: "pages/booking/Availability.html", label: "항공권 예매" },
  { href: "#", label: "탑승 수속" },
  { href: "#", label: "여행 준비" },
  { href: "#", label: "여행 편의" },
  { href: "#", label: "이벤트/제휴" }
], bd = [
  {
    links: [
      { href: "pages/about/about.html", label: "회사소개" },
      { href: "pages/about/career.html", label: "채용안내" },
      { href: "pages/about/ccm.html", label: "소비자중심경영" }
    ],
    title: "제주항공"
  },
  {
    links: [
      { href: "pages/booking/Availability.html", label: "항공권 예매" },
      { href: "pages/booking/viewOnOffReservationList.html", label: "비회원 예약조회" },
      { href: "pages/booking/route.html", label: "인기 노선" },
      { href: "pages/pet/petPass.html", label: "펫 멤버십 / 펫 패스" },
      { href: "pages/pet/petService.html", label: "반려동물 운송 서비스" }
    ],
    title: "예매 안내"
  },
  {
    links: [
      { href: "pages/boarding/fastProcedure.html", label: "빠른 수속" },
      { href: "pages/boarding/viewCheckin.html", label: "모바일 탑승권" },
      { href: "pages/boarding/eDocument.html", label: "사전 서약서" }
    ],
    title: "탑승 수속 안내"
  },
  {
    links: [
      { href: "pages/baggage/preorderedBaggage.html", label: "사전 수하물" },
      { href: "pages/baggage/cabinBaggage.html", label: "기내 수하물" },
      { href: "pages/baggage/transportLimitation.html", label: "운송제한 물품" },
      { href: "pages/baggage/liability.html", label: "수하물 분실 및 배상" }
    ],
    title: "수하물 안내"
  },
  {
    links: [
      { href: "pages/jmembers/jmembersSightseeing.html", label: "관광" },
      { href: "pages/jmembers/jmembersAirplane.html", label: "공항 편의" },
      { href: "pages/jmembers/jmembersGolf.html", label: "골프 멤버십" },
      { href: "pages/jmembers/jmembersInsurance.html", label: "금융/여행자 보험" }
    ],
    title: "J 멤버스"
  },
  {
    links: [
      { href: "pages/event/event.html", label: "이벤트" },
      { href: "https://jejurentcar.netlify.app/", label: "렌터카", target: "_blank" },
      {
        href: "https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html",
        label: "호텔/숙소",
        target: "_blank"
      }
    ],
    title: "이벤트/제휴"
  }
], ml = (t) => {
  const e = t.target ? ` target="${t.target}" rel="noreferrer"` : "";
  return `<a href="${t.href}"${e}>${t.label}</a>`;
}, Fu = (t) => {
  const e = t.target ? ` target="${t.target}" rel="noreferrer"` : "";
  return `<li><a href="${t.href}"${e}>${t.label}</a></li>`;
}, r_ = (t) => `
    <div class="sub_menu">
      <h4>${t.title}</h4>
      <ul class="sub_menu">
        ${t.links.map(Fu).join("")}
      </ul>
    </div>
  `, i_ = (t) => `
    <li>
      <button class="mobile_menu_btn" type="button">${t.title}</button>
      <ul class="mobile_sub_menu">
        ${t.links.map(Fu).join("")}
      </ul>
    </li>
  `, s_ = () => `
    <div class="inner">
      <div class="top_bar_container">
        <div class="top_bar_left">
          ${Ad.map(ml).join("")}
        </div>
        <div class="top_bar_right">
          ${t_.map(ml).join("")}
          <div class="language_selector">
            <a href="#">한국어</a>
          </div>
        </div>
      </div>

      <nav class="main_nav">
        <div class="main_nav_container">
          <h1 class="logo">
            <a href="index.html"><img src="assets/img/logo.png" alt="제주항공 로고"></a>
          </h1>
          <button class="hamburger_btn" aria-label="menu" type="button">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="nav_menu_wrap">
            <ul class="nav_menu">
              ${n_.map(Fu).join("")}
            </ul>
            <div class="sub_menu_wrap">
              <div class="sub_menu_container">
                ${bd.map(r_).join("")}
              </div>
            </div>
          </div>

          <div class="nav_icons">
            <a href="#" class="btn_search" title="search">
              <img src="assets/img/ico-search.png" alt="search">
            </a>
            <a href="../pages/mypage/dashboard.html?shell=air" title="my page">
              <img src="assets/img/ico-my-page.png" alt="my page">
            </a>
          </div>

          <div class="header_search">
            <input type="text" placeholder="검색어를 입력하세요">
            <button type="button">검색</button>
          </div>
        </div>
      </nav>
    </div>

    <div class="mobile_menu_layer">
      <div class="mobile_menu_header">
        <button class="mobile_close_btn" type="button">✕</button>
      </div>
      <div class="mobile_user_area">
        <a href="../pages/auth/login.html?shell=air">로그인</a>
        <a href="../pages/auth/signup.html?shell=air">회원가입</a>
        <a href="../pages/mypage/dashboard.html?shell=air">마이페이지</a>
      </div>
      <div class="mobile_search">
        <input type="text" placeholder="검색어를 입력하세요">
      </div>
      <ul class="mobile_menu_list">
        ${bd.map(i_).join("")}
      </ul>
      <div class="mobile_bottom_menu">
        ${Ad.map(ml).join("")}
        <a href="#">한국어</a>
      </div>
    </div>

    <button id="topBtn" title="맨 위로" type="button">↑</button>
  `, a_ = (t) => {
  const e = t.querySelector(".mobile_menu_layer");
  e && (e.classList.remove("active"), document.body.style.overflow = "");
}, l_ = (t) => {
  const e = t.querySelector(".mobile_menu_layer");
  e && (e.classList.add("active"), document.body.style.overflow = "hidden");
}, o_ = (t) => {
  const e = t.querySelector(".header_search");
  e && e.classList.toggle("is_active");
}, u_ = (t) => {
  var r;
  const e = t.nextElementSibling;
  if (!e)
    return;
  (((r = t.closest(".mobile_menu_list")) == null ? void 0 : r.querySelectorAll(".mobile_sub_menu")) ?? []).forEach((i) => {
    i !== e && (i.style.display = "none");
  }), e.style.display = e.style.display === "block" ? "none" : "block";
}, c_ = (t) => {
  const e = t.querySelector("#topBtn");
  if (!e)
    return;
  const n = () => {
    e.style.display = window.scrollY > 300 ? "block" : "none";
  };
  n(), window.addEventListener("scroll", n), e.addEventListener("click", () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0
    });
  });
}, d_ = (t) => {
  const e = t.querySelector(".main_nav");
  if (!e)
    return;
  const n = () => {
    e.classList.toggle("fixed", window.scrollY > 60);
  };
  n(), window.addEventListener("scroll", n);
}, f_ = (t) => {
  t.addEventListener("click", (e) => {
    const n = e.target;
    if (!n)
      return;
    if (n.closest(".btn_search")) {
      e.preventDefault(), o_(t);
      return;
    }
    if (n.closest(".hamburger_btn")) {
      l_(t);
      return;
    }
    if (n.closest(".mobile_close_btn")) {
      a_(t);
      return;
    }
    const i = n.closest(".mobile_menu_btn");
    i && u_(i);
  }), d_(t), c_(t);
}, h_ = (t) => {
  t.innerHTML = s_(), f_(t);
}, p_ = [
  {
    links: [
      { href: "pages/about/about.html", label: "회사소개" },
      { href: "pages/about/career.html", label: "채용안내" },
      { href: "pages/about/ccm.html", label: "소비자중심경영" },
      { href: "pages/cs/notic.html", label: "공지사항" }
    ],
    title: "제주항공"
  },
  {
    links: [
      { href: "#", label: "이용약관" },
      { href: "#", label: "운송약관 및 기타" },
      { href: "#", label: "개인정보처리방침" },
      { href: "#", label: "국내선 여행사 우대" },
      { href: "#", label: "국제선 여행사 우대" }
    ],
    title: "약관 및 안내"
  },
  {
    links: [
      { href: "#", label: "사전서약서" },
      { href: "#", label: "항공위험물안내" },
      { href: "#", label: "항공안전투자공시" },
      { href: "#", label: "항공교통이용자 서비스 계획" },
      { href: "#", label: "항공교통이용자 피해구제 계획" }
    ],
    title: "기타안내"
  },
  {
    links: [
      { href: "pages/event/event.html", label: "이벤트" },
      { href: "https://jejurentcar.netlify.app/", label: "렌터카", target: "_blank" },
      {
        href: "https://jejuteam.netlify.app/jejustay/pages/hotel/jejuhotel.html",
        label: "호텔/숙소",
        target: "_blank"
      }
    ],
    title: "이벤트/제휴"
  }
], m_ = [
  {
    alt: "유튜브",
    href: "https://www.youtube.com/@jejuair_official",
    imageSrc: "assets/img/20250804165831645.png"
  },
  {
    alt: "인스타그램",
    href: "https://www.instagram.com/jejuair_official/",
    imageSrc: "assets/img/20250804165841751.png"
  },
  {
    alt: "페이스북",
    href: "https://www.facebook.com/funjejuair/",
    imageSrc: "assets/img/20250804165859889.png"
  },
  {
    alt: "틱톡",
    href: "https://www.tiktok.com/@jejuair_official",
    imageSrc: "assets/img/20250804165850759.png"
  }
], g_ = (t) => {
  const e = t.target ? ` target="${t.target}" rel="noreferrer"` : "";
  return `<li><a href="${t.href}"${e}>${t.label}</a></li>`;
}, v_ = (t) => `
    <div class="footer_link">
      <h4>${t.title}</h4>
      <ul>
        ${t.links.map(g_).join("")}
      </ul>
    </div>
  `, y_ = (t) => `<a href="${t.href}" target="_blank" rel="noreferrer"><img src="${t.imageSrc}" alt="${t.alt}"></a>`, __ = () => `
    <div class="inner">
      <div class="footer_top">
        ${p_.map(v_).join("")}
      </div>
      <div class="footer_bottom">
        <div class="company_info">
          <h3>(주)제주항공</h3>
          <div class="company_details">
            <p>대표이사 : 김이배&nbsp;&nbsp;&nbsp;&nbsp;사업자등록번호 : 616-81-50527&nbsp;&nbsp;&nbsp;&nbsp;통신판매업신고 : 제주 2006-125호&nbsp;&nbsp;&nbsp;&nbsp;호스팅 사업자 : AWS</p>
            <p>주소 : 제주특별자치도 제주시 신대로 64 (연동, 건설프레하임 3층)&nbsp;&nbsp;&nbsp;&nbsp;고객센터 : 1599-1500 (09:00 ~ 19:00)</p>
            <p>고객 문의 : jejuair.help@jejuair.net&nbsp;&nbsp;&nbsp;&nbsp;제휴 문의 : partnership@jejuair.net</p>
          </div>
          <div class="copyright">Copyright © Jeju Air. All Rights Reserved.</div>
        </div>
        <div class="link_container">
          <div class="sns_link">
            ${m_.map(y_).join("")}
          </div>
          <div class="qr_link">
            <h4>앱을 다운로드하고<br>앱전용 혜택을<br>받아보세요!</h4>
            <img src="assets/img/icon-app-down-qr.png" alt="qr">
          </div>
        </div>
      </div>
    </div>
  `, w_ = (t) => {
  t.addEventListener("click", (e) => {
    var r, i;
    if (window.innerWidth > 1024)
      return;
    const n = (r = e.target) == null ? void 0 : r.closest(".footer_link h4");
    n && ((i = n.parentElement) == null || i.classList.toggle("open"));
  });
}, S_ = (t) => {
  t.innerHTML = __(), w_(t);
}, x_ = (t) => {
  let e = document.getElementById("jeju-page-shell-base");
  e || (e = document.createElement("base"), e.id = "jeju-page-shell-base", document.head.prepend(e)), e.href = t("jejuair/"), document.body.classList.add("jejuair-main-content");
}, k_ = () => {
  const t = document.getElementById("jeju-page-shell-base");
  t && t.remove(), document.body.classList.remove("jejuair-main-content");
}, E_ = async (t, e) => {
  e.loadStyle("jejuair/css/main.css"), t.headerHost.innerHTML = '<header id="header_wrap"></header>', t.footerHost.innerHTML = '<footer id="footer_wrap"></footer>';
  const n = t.headerHost.querySelector("#header_wrap"), r = t.footerHost.querySelector("#footer_wrap");
  n && h_(n), r && S_(r);
}, C_ = "shell", Ap = "jeju:mypage-shell", Ld = /* @__PURE__ */ new Set(["main", "stay", "air"]), T_ = "/pages/auth/", N_ = ["jeju-page-shell-header", "mypage-shell-header"], j_ = ["jeju-page-shell-footer", "mypage-shell-footer"];
let Id = null;
const P_ = () => N_.map((t) => document.getElementById(t)).find(Boolean) ?? null, A_ = () => j_.map((t) => document.getElementById(t)).find(Boolean) ?? null, Ra = () => ({
  footerHost: A_(),
  headerHost: P_()
}), bp = (t) => new URL(t, Hi()).href, b_ = () => window.location.pathname.toLowerCase().includes(T_), ms = (t) => t === "stay" && b_() ? "main" : t, L_ = (t) => {
  const e = /^[a-z]+:/i.test(t) ? t : bp(t);
  if (Array.from(document.styleSheets).some((i) => i.href === e))
    return;
  const r = document.createElement("link");
  r.rel = "stylesheet", r.href = e, document.head.appendChild(r);
}, I_ = (t) => {
  if (t === "air") {
    x_(bp);
    return;
  }
  k_();
}, R_ = () => {
  if (!document.referrer)
    return null;
  try {
    const e = new URL(document.referrer).pathname.toLowerCase();
    if (e.includes("/jejuair/"))
      return "air";
    if (e.includes("/jejustay/"))
      return "stay";
    if (e.endsWith("/index.html") || e === "/" || e.includes("/front/index.html"))
      return "main";
  } catch {
    return null;
  }
  return null;
}, M_ = () => {
  const e = new URLSearchParams(window.location.search).get(C_);
  if (e && Ld.has(e))
    return ms(e);
  const n = R_();
  if (n)
    return ms(n);
  const r = window.sessionStorage.getItem(Ap);
  return r && Ld.has(r) ? ms(r) : ms("main");
}, O_ = (t) => {
  window.sessionStorage.setItem(Ap, t), document.body.dataset.mypageShell = t;
}, Rd = () => {
  document.dispatchEvent(new Event("mainHeaderLoaded")), document.dispatchEvent(new Event("mainFooterLoaded"));
}, D_ = async () => {
  const { footerHost: t, headerHost: e } = Ra();
  !e || !t || (e.innerHTML = '<div id="main-header-placeholder"></div>', t.innerHTML = '<div id="main-footer-placeholder"></div>', await _p());
}, z_ = async () => {
  const { footerHost: t, headerHost: e } = Ra();
  !e || !t || (e.innerHTML = '<div id="hotel-header-placeholder"></div>', t.innerHTML = '<div id="hotel-footer-placeholder"></div>', await wp());
}, F_ = async () => {
  const { footerHost: t, headerHost: e } = Ra();
  !e || !t || await E_(
    {
      footerHost: t,
      headerHost: e
    },
    {
      loadStyle: L_
    }
  );
}, B_ = async () => {
  const { footerHost: t, headerHost: e } = Ra();
  if (!e || !t)
    return "main";
  const n = M_();
  return O_(n), I_(n), Ke(), Id === n && e.childElementCount > 0 && t.childElementCount > 0 ? (Rd(), n) : (n === "air" ? (await F_(), await new Promise((r) => window.setTimeout(r, 40))) : n === "stay" ? await z_() : await D_(), Id = n, Rd(), n);
}, U_ = () => {
  Ia("jeju-signup-app", /* @__PURE__ */ d.jsx(By, {}));
};
function It(t) {
  if (t === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t;
}
function Lp(t, e) {
  t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
}
/*!
 * GSAP 3.14.2
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var tt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Rr = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, Bu, ke, ee, dt = 1e8, Y = 1 / dt, Co = Math.PI * 2, H_ = Co / 4, V_ = 0, Ip = Math.sqrt, $_ = Math.cos, W_ = Math.sin, we = function(e) {
  return typeof e == "string";
}, ce = function(e) {
  return typeof e == "function";
}, Vt = function(e) {
  return typeof e == "number";
}, Uu = function(e) {
  return typeof e > "u";
}, bt = function(e) {
  return typeof e == "object";
}, He = function(e) {
  return e !== !1;
}, Hu = function() {
  return typeof window < "u";
}, gs = function(e) {
  return ce(e) || we(e);
}, Rp = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Pe = Array.isArray, G_ = /random\([^)]+\)/g, K_ = /,\s*/g, Md = /(?:-?\.?\d|\.)+/gi, Mp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, gr = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, gl = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Op = /[+-]=-?[.\d]+/, Y_ = /[^,'"\[\]\s]+/gi, Q_ = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, ie, Ct, To, Vu, rt = {}, aa = {}, Dp, zp = function(e) {
  return (aa = Mr(e, rt)) && Ge;
}, $u = function(e, n) {
  return console.warn("Invalid property", e, "set to", n, "Missing plugin? gsap.registerPlugin()");
}, Mi = function(e, n) {
  return !n && console.warn(e);
}, Fp = function(e, n) {
  return e && (rt[e] = n) && aa && (aa[e] = n) || rt;
}, Oi = function() {
  return 0;
}, q_ = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, As = {
  suppressEvents: !0,
  kill: !1
}, X_ = {
  suppressEvents: !0
}, Wu = {}, pn = [], No = {}, Bp, Qe = {}, vl = {}, Od = 30, bs = [], Gu = "", Ku = function(e) {
  var n = e[0], r, i;
  if (bt(n) || ce(n) || (e = [e]), !(r = (n._gsap || {}).harness)) {
    for (i = bs.length; i-- && !bs[i].targetTest(n); )
      ;
    r = bs[i];
  }
  for (i = e.length; i--; )
    e[i] && (e[i]._gsap || (e[i]._gsap = new cm(e[i], r))) || e.splice(i, 1);
  return e;
}, Un = function(e) {
  return e._gsap || Ku(ft(e))[0]._gsap;
}, Up = function(e, n, r) {
  return (r = e[n]) && ce(r) ? e[n]() : Uu(r) && e.getAttribute && e.getAttribute(n) || r;
}, Ve = function(e, n) {
  return (e = e.split(",")).forEach(n) || e;
}, de = function(e) {
  return Math.round(e * 1e5) / 1e5 || 0;
}, ne = function(e) {
  return Math.round(e * 1e7) / 1e7 || 0;
}, Er = function(e, n) {
  var r = n.charAt(0), i = parseFloat(n.substr(2));
  return e = parseFloat(e), r === "+" ? e + i : r === "-" ? e - i : r === "*" ? e * i : e / i;
}, J_ = function(e, n) {
  for (var r = n.length, i = 0; e.indexOf(n[i]) < 0 && ++i < r; )
    ;
  return i < r;
}, la = function() {
  var e = pn.length, n = pn.slice(0), r, i;
  for (No = {}, pn.length = 0, r = 0; r < e; r++)
    i = n[r], i && i._lazy && (i.render(i._lazy[0], i._lazy[1], !0)._lazy = 0);
}, Yu = function(e) {
  return !!(e._initted || e._startAt || e.add);
}, Hp = function(e, n, r, i) {
  pn.length && !ke && la(), e.render(n, r, !!(ke && n < 0 && Yu(e))), pn.length && !ke && la();
}, Vp = function(e) {
  var n = parseFloat(e);
  return (n || n === 0) && (e + "").match(Y_).length < 2 ? n : we(e) ? e.trim() : e;
}, $p = function(e) {
  return e;
}, it = function(e, n) {
  for (var r in n)
    r in e || (e[r] = n[r]);
  return e;
}, Z_ = function(e) {
  return function(n, r) {
    for (var i in r)
      i in n || i === "duration" && e || i === "ease" || (n[i] = r[i]);
  };
}, Mr = function(e, n) {
  for (var r in n)
    e[r] = n[r];
  return e;
}, Dd = function t(e, n) {
  for (var r in n)
    r !== "__proto__" && r !== "constructor" && r !== "prototype" && (e[r] = bt(n[r]) ? t(e[r] || (e[r] = {}), n[r]) : n[r]);
  return e;
}, oa = function(e, n) {
  var r = {}, i;
  for (i in e)
    i in n || (r[i] = e[i]);
  return r;
}, mi = function(e) {
  var n = e.parent || ie, r = e.keyframes ? Z_(Pe(e.keyframes)) : it;
  if (He(e.inherit))
    for (; n; )
      r(e, n.vars.defaults), n = n.parent || n._dp;
  return e;
}, e1 = function(e, n) {
  for (var r = e.length, i = r === n.length; i && r-- && e[r] === n[r]; )
    ;
  return r < 0;
}, Wp = function(e, n, r, i, s) {
  var a = e[i], l;
  if (s)
    for (l = n[s]; a && a[s] > l; )
      a = a._prev;
  return a ? (n._next = a._next, a._next = n) : (n._next = e[r], e[r] = n), n._next ? n._next._prev = n : e[i] = n, n._prev = a, n.parent = n._dp = e, n;
}, Ma = function(e, n, r, i) {
  r === void 0 && (r = "_first"), i === void 0 && (i = "_last");
  var s = n._prev, a = n._next;
  s ? s._next = a : e[r] === n && (e[r] = a), a ? a._prev = s : e[i] === n && (e[i] = s), n._next = n._prev = n.parent = null;
}, yn = function(e, n) {
  e.parent && (!n || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
}, Hn = function(e, n) {
  if (e && (!n || n._end > e._dur || n._start < 0))
    for (var r = e; r; )
      r._dirty = 1, r = r.parent;
  return e;
}, t1 = function(e) {
  for (var n = e.parent; n && n.parent; )
    n._dirty = 1, n.totalDuration(), n = n.parent;
  return e;
}, jo = function(e, n, r, i) {
  return e._startAt && (ke ? e._startAt.revert(As) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(n, !0, i));
}, n1 = function t(e) {
  return !e || e._ts && t(e.parent);
}, zd = function(e) {
  return e._repeat ? Or(e._tTime, e = e.duration() + e._rDelay) * e : 0;
}, Or = function(e, n) {
  var r = Math.floor(e = ne(e / n));
  return e && r === e ? r - 1 : r;
}, ua = function(e, n) {
  return (e - n._start) * n._ts + (n._ts >= 0 ? 0 : n._dirty ? n.totalDuration() : n._tDur);
}, Oa = function(e) {
  return e._end = ne(e._start + (e._tDur / Math.abs(e._ts || e._rts || Y) || 0));
}, Da = function(e, n) {
  var r = e._dp;
  return r && r.smoothChildTiming && e._ts && (e._start = ne(r._time - (e._ts > 0 ? n / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - n) / -e._ts)), Oa(e), r._dirty || Hn(r, e)), e;
}, Gp = function(e, n) {
  var r;
  if ((n._time || !n._dur && n._initted || n._start < e._time && (n._dur || !n.add)) && (r = ua(e.rawTime(), n), (!n._dur || Xi(0, n.totalDuration(), r) - n._tTime > Y) && n.render(r, !0)), Hn(e, n)._dp && e._initted && e._time >= e._dur && e._ts) {
    if (e._dur < e.duration())
      for (r = e; r._dp; )
        r.rawTime() >= 0 && r.totalTime(r._tTime), r = r._dp;
    e._zTime = -Y;
  }
}, Nt = function(e, n, r, i) {
  return n.parent && yn(n), n._start = ne((Vt(r) ? r : r || e !== ie ? lt(e, r, n) : e._time) + n._delay), n._end = ne(n._start + (n.totalDuration() / Math.abs(n.timeScale()) || 0)), Wp(e, n, "_first", "_last", e._sort ? "_start" : 0), Po(n) || (e._recent = n), i || Gp(e, n), e._ts < 0 && Da(e, e._tTime), e;
}, Kp = function(e, n) {
  return (rt.ScrollTrigger || $u("scrollTrigger", n)) && rt.ScrollTrigger.create(n, e);
}, Yp = function(e, n, r, i, s) {
  if (qu(e, n, s), !e._initted)
    return 1;
  if (!r && e._pt && !ke && (e._dur && e.vars.lazy !== !1 || !e._dur && e.vars.lazy) && Bp !== qe.frame)
    return pn.push(e), e._lazy = [s, i], 1;
}, r1 = function t(e) {
  var n = e.parent;
  return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || t(n));
}, Po = function(e) {
  var n = e.data;
  return n === "isFromStart" || n === "isStart";
}, i1 = function(e, n, r, i) {
  var s = e.ratio, a = n < 0 || !n && (!e._start && r1(e) && !(!e._initted && Po(e)) || (e._ts < 0 || e._dp._ts < 0) && !Po(e)) ? 0 : 1, l = e._rDelay, o = 0, u, c, f;
  if (l && e._repeat && (o = Xi(0, e._tDur, n), c = Or(o, l), e._yoyo && c & 1 && (a = 1 - a), c !== Or(e._tTime, l) && (s = 1 - a, e.vars.repeatRefresh && e._initted && e.invalidate())), a !== s || ke || i || e._zTime === Y || !n && e._zTime) {
    if (!e._initted && Yp(e, n, i, r, o))
      return;
    for (f = e._zTime, e._zTime = n || (r ? Y : 0), r || (r = n && !f), e.ratio = a, e._from && (a = 1 - a), e._time = 0, e._tTime = o, u = e._pt; u; )
      u.r(a, u.d), u = u._next;
    n < 0 && jo(e, n, r, !0), e._onUpdate && !r && Je(e, "onUpdate"), o && e._repeat && !r && e.parent && Je(e, "onRepeat"), (n >= e._tDur || n < 0) && e.ratio === a && (a && yn(e, 1), !r && !ke && (Je(e, a ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()));
  } else e._zTime || (e._zTime = n);
}, s1 = function(e, n, r) {
  var i;
  if (r > n)
    for (i = e._first; i && i._start <= r; ) {
      if (i.data === "isPause" && i._start > n)
        return i;
      i = i._next;
    }
  else
    for (i = e._last; i && i._start >= r; ) {
      if (i.data === "isPause" && i._start < n)
        return i;
      i = i._prev;
    }
}, Dr = function(e, n, r, i) {
  var s = e._repeat, a = ne(n) || 0, l = e._tTime / e._tDur;
  return l && !i && (e._time *= a / e._dur), e._dur = a, e._tDur = s ? s < 0 ? 1e10 : ne(a * (s + 1) + e._rDelay * s) : a, l > 0 && !i && Da(e, e._tTime = e._tDur * l), e.parent && Oa(e), r || Hn(e.parent, e), e;
}, Fd = function(e) {
  return e instanceof Ie ? Hn(e) : Dr(e, e._dur);
}, a1 = {
  _start: 0,
  endTime: Oi,
  totalDuration: Oi
}, lt = function t(e, n, r) {
  var i = e.labels, s = e._recent || a1, a = e.duration() >= dt ? s.endTime(!1) : e._dur, l, o, u;
  return we(n) && (isNaN(n) || n in i) ? (o = n.charAt(0), u = n.substr(-1) === "%", l = n.indexOf("="), o === "<" || o === ">" ? (l >= 0 && (n = n.replace(/=/, "")), (o === "<" ? s._start : s.endTime(s._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (u ? (l < 0 ? s : r).totalDuration() / 100 : 1)) : l < 0 ? (n in i || (i[n] = a), i[n]) : (o = parseFloat(n.charAt(l - 1) + n.substr(l + 1)), u && r && (o = o / 100 * (Pe(r) ? r[0] : r).totalDuration()), l > 1 ? t(e, n.substr(0, l - 1), r) + o : a + o)) : n == null ? a : +n;
}, gi = function(e, n, r) {
  var i = Vt(n[1]), s = (i ? 2 : 1) + (e < 2 ? 0 : 1), a = n[s], l, o;
  if (i && (a.duration = n[1]), a.parent = r, e) {
    for (l = a, o = r; o && !("immediateRender" in l); )
      l = o.vars.defaults || {}, o = He(o.vars.inherit) && o.parent;
    a.immediateRender = He(l.immediateRender), e < 2 ? a.runBackwards = 1 : a.startAt = n[s - 1];
  }
  return new he(n[0], a, n[s + 1]);
}, En = function(e, n) {
  return e || e === 0 ? n(e) : n;
}, Xi = function(e, n, r) {
  return r < e ? e : r > n ? n : r;
}, je = function(e, n) {
  return !we(e) || !(n = Q_.exec(e)) ? "" : n[1];
}, l1 = function(e, n, r) {
  return En(r, function(i) {
    return Xi(e, n, i);
  });
}, Ao = [].slice, Qp = function(e, n) {
  return e && bt(e) && "length" in e && (!n && !e.length || e.length - 1 in e && bt(e[0])) && !e.nodeType && e !== Ct;
}, o1 = function(e, n, r) {
  return r === void 0 && (r = []), e.forEach(function(i) {
    var s;
    return we(i) && !n || Qp(i, 1) ? (s = r).push.apply(s, ft(i)) : r.push(i);
  }) || r;
}, ft = function(e, n, r) {
  return ee && !n && ee.selector ? ee.selector(e) : we(e) && !r && (To || !zr()) ? Ao.call((n || Vu).querySelectorAll(e), 0) : Pe(e) ? o1(e, r) : Qp(e) ? Ao.call(e, 0) : e ? [e] : [];
}, bo = function(e) {
  return e = ft(e)[0] || Mi("Invalid scope") || {}, function(n) {
    var r = e.current || e.nativeElement || e;
    return ft(n, r.querySelectorAll ? r : r === e ? Mi("Invalid scope") || Vu.createElement("div") : e);
  };
}, qp = function(e) {
  return e.sort(function() {
    return 0.5 - Math.random();
  });
}, Xp = function(e) {
  if (ce(e))
    return e;
  var n = bt(e) ? e : {
    each: e
  }, r = Vn(n.ease), i = n.from || 0, s = parseFloat(n.base) || 0, a = {}, l = i > 0 && i < 1, o = isNaN(i) || l, u = n.axis, c = i, f = i;
  return we(i) ? c = f = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[i] || 0 : !l && o && (c = i[0], f = i[1]), function(p, y, _) {
    var g = (_ || n).length, x = a[g], m, h, v, w, S, E, k, C, T;
    if (!x) {
      if (T = n.grid === "auto" ? 0 : (n.grid || [1, dt])[1], !T) {
        for (k = -dt; k < (k = _[T++].getBoundingClientRect().left) && T < g; )
          ;
        T < g && T--;
      }
      for (x = a[g] = [], m = o ? Math.min(T, g) * c - 0.5 : i % T, h = T === dt ? 0 : o ? g * f / T - 0.5 : i / T | 0, k = 0, C = dt, E = 0; E < g; E++)
        v = E % T - m, w = h - (E / T | 0), x[E] = S = u ? Math.abs(u === "y" ? w : v) : Ip(v * v + w * w), S > k && (k = S), S < C && (C = S);
      i === "random" && qp(x), x.max = k - C, x.min = C, x.v = g = (parseFloat(n.amount) || parseFloat(n.each) * (T > g ? g - 1 : u ? u === "y" ? g / T : T : Math.max(T, g / T)) || 0) * (i === "edges" ? -1 : 1), x.b = g < 0 ? s - g : s, x.u = je(n.amount || n.each) || 0, r = r && g < 0 ? lm(r) : r;
    }
    return g = (x[p] - x.min) / x.max || 0, ne(x.b + (r ? r(g) : g) * x.v) + x.u;
  };
}, Lo = function(e) {
  var n = Math.pow(10, ((e + "").split(".")[1] || "").length);
  return function(r) {
    var i = ne(Math.round(parseFloat(r) / e) * e * n);
    return (i - i % 1) / n + (Vt(r) ? 0 : je(r));
  };
}, Jp = function(e, n) {
  var r = Pe(e), i, s;
  return !r && bt(e) && (i = r = e.radius || dt, e.values ? (e = ft(e.values), (s = !Vt(e[0])) && (i *= i)) : e = Lo(e.increment)), En(n, r ? ce(e) ? function(a) {
    return s = e(a), Math.abs(s - a) <= i ? s : a;
  } : function(a) {
    for (var l = parseFloat(s ? a.x : a), o = parseFloat(s ? a.y : 0), u = dt, c = 0, f = e.length, p, y; f--; )
      s ? (p = e[f].x - l, y = e[f].y - o, p = p * p + y * y) : p = Math.abs(e[f] - l), p < u && (u = p, c = f);
    return c = !i || u <= i ? e[c] : a, s || c === a || Vt(a) ? c : c + je(a);
  } : Lo(e));
}, Zp = function(e, n, r, i) {
  return En(Pe(e) ? !n : r === !0 ? !!(r = 0) : !i, function() {
    return Pe(e) ? e[~~(Math.random() * e.length)] : (r = r || 1e-5) && (i = r < 1 ? Math.pow(10, (r + "").length - 2) : 1) && Math.floor(Math.round((e - r / 2 + Math.random() * (n - e + r * 0.99)) / r) * r * i) / i;
  });
}, u1 = function() {
  for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
    n[r] = arguments[r];
  return function(i) {
    return n.reduce(function(s, a) {
      return a(s);
    }, i);
  };
}, c1 = function(e, n) {
  return function(r) {
    return e(parseFloat(r)) + (n || je(r));
  };
}, d1 = function(e, n, r) {
  return tm(e, n, 0, 1, r);
}, em = function(e, n, r) {
  return En(r, function(i) {
    return e[~~n(i)];
  });
}, f1 = function t(e, n, r) {
  var i = n - e;
  return Pe(e) ? em(e, t(0, e.length), n) : En(r, function(s) {
    return (i + (s - e) % i) % i + e;
  });
}, h1 = function t(e, n, r) {
  var i = n - e, s = i * 2;
  return Pe(e) ? em(e, t(0, e.length - 1), n) : En(r, function(a) {
    return a = (s + (a - e) % s) % s || 0, e + (a > i ? s - a : a);
  });
}, Di = function(e) {
  return e.replace(G_, function(n) {
    var r = n.indexOf("[") + 1, i = n.substring(r || 7, r ? n.indexOf("]") : n.length - 1).split(K_);
    return Zp(r ? i : +i[0], r ? 0 : +i[1], +i[2] || 1e-5);
  });
}, tm = function(e, n, r, i, s) {
  var a = n - e, l = i - r;
  return En(s, function(o) {
    return r + ((o - e) / a * l || 0);
  });
}, p1 = function t(e, n, r, i) {
  var s = isNaN(e + n) ? 0 : function(y) {
    return (1 - y) * e + y * n;
  };
  if (!s) {
    var a = we(e), l = {}, o, u, c, f, p;
    if (r === !0 && (i = 1) && (r = null), a)
      e = {
        p: e
      }, n = {
        p: n
      };
    else if (Pe(e) && !Pe(n)) {
      for (c = [], f = e.length, p = f - 2, u = 1; u < f; u++)
        c.push(t(e[u - 1], e[u]));
      f--, s = function(_) {
        _ *= f;
        var g = Math.min(p, ~~_);
        return c[g](_ - g);
      }, r = n;
    } else i || (e = Mr(Pe(e) ? [] : {}, e));
    if (!c) {
      for (o in n)
        Qu.call(l, e, o, "get", n[o]);
      s = function(_) {
        return Zu(_, l) || (a ? e.p : e);
      };
    }
  }
  return En(r, s);
}, Bd = function(e, n, r) {
  var i = e.labels, s = dt, a, l, o;
  for (a in i)
    l = i[a] - n, l < 0 == !!r && l && s > (l = Math.abs(l)) && (o = a, s = l);
  return o;
}, Je = function(e, n, r) {
  var i = e.vars, s = i[n], a = ee, l = e._ctx, o, u, c;
  if (s)
    return o = i[n + "Params"], u = i.callbackScope || e, r && pn.length && la(), l && (ee = l), c = o ? s.apply(u, o) : s.call(u), ee = a, c;
}, ii = function(e) {
  return yn(e), e.scrollTrigger && e.scrollTrigger.kill(!!ke), e.progress() < 1 && Je(e, "onInterrupt"), e;
}, vr, nm = [], rm = function(e) {
  if (e)
    if (e = !e.name && e.default || e, Hu() || e.headless) {
      var n = e.name, r = ce(e), i = n && !r && e.init ? function() {
        this._props = [];
      } : e, s = {
        init: Oi,
        render: Zu,
        add: Qu,
        kill: A1,
        modifier: P1,
        rawVars: 0
      }, a = {
        targetTest: 0,
        get: 0,
        getSetter: Ju,
        aliases: {},
        register: 0
      };
      if (zr(), e !== i) {
        if (Qe[n])
          return;
        it(i, it(oa(e, s), a)), Mr(i.prototype, Mr(s, oa(e, a))), Qe[i.prop = n] = i, e.targetTest && (bs.push(i), Wu[n] = 1), n = (n === "css" ? "CSS" : n.charAt(0).toUpperCase() + n.substr(1)) + "Plugin";
      }
      Fp(n, i), e.register && e.register(Ge, i, $e);
    } else
      nm.push(e);
}, K = 255, si = {
  aqua: [0, K, K],
  lime: [0, K, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, K],
  navy: [0, 0, 128],
  white: [K, K, K],
  olive: [128, 128, 0],
  yellow: [K, K, 0],
  orange: [K, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [K, 0, 0],
  pink: [K, 192, 203],
  cyan: [0, K, K],
  transparent: [K, K, K, 0]
}, yl = function(e, n, r) {
  return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? n + (r - n) * e * 6 : e < 0.5 ? r : e * 3 < 2 ? n + (r - n) * (2 / 3 - e) * 6 : n) * K + 0.5 | 0;
}, im = function(e, n, r) {
  var i = e ? Vt(e) ? [e >> 16, e >> 8 & K, e & K] : 0 : si.black, s, a, l, o, u, c, f, p, y, _;
  if (!i) {
    if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), si[e])
      i = si[e];
    else if (e.charAt(0) === "#") {
      if (e.length < 6 && (s = e.charAt(1), a = e.charAt(2), l = e.charAt(3), e = "#" + s + s + a + a + l + l + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9)
        return i = parseInt(e.substr(1, 6), 16), [i >> 16, i >> 8 & K, i & K, parseInt(e.substr(7), 16) / 255];
      e = parseInt(e.substr(1), 16), i = [e >> 16, e >> 8 & K, e & K];
    } else if (e.substr(0, 3) === "hsl") {
      if (i = _ = e.match(Md), !n)
        o = +i[0] % 360 / 360, u = +i[1] / 100, c = +i[2] / 100, a = c <= 0.5 ? c * (u + 1) : c + u - c * u, s = c * 2 - a, i.length > 3 && (i[3] *= 1), i[0] = yl(o + 1 / 3, s, a), i[1] = yl(o, s, a), i[2] = yl(o - 1 / 3, s, a);
      else if (~e.indexOf("="))
        return i = e.match(Mp), r && i.length < 4 && (i[3] = 1), i;
    } else
      i = e.match(Md) || si.transparent;
    i = i.map(Number);
  }
  return n && !_ && (s = i[0] / K, a = i[1] / K, l = i[2] / K, f = Math.max(s, a, l), p = Math.min(s, a, l), c = (f + p) / 2, f === p ? o = u = 0 : (y = f - p, u = c > 0.5 ? y / (2 - f - p) : y / (f + p), o = f === s ? (a - l) / y + (a < l ? 6 : 0) : f === a ? (l - s) / y + 2 : (s - a) / y + 4, o *= 60), i[0] = ~~(o + 0.5), i[1] = ~~(u * 100 + 0.5), i[2] = ~~(c * 100 + 0.5)), r && i.length < 4 && (i[3] = 1), i;
}, sm = function(e) {
  var n = [], r = [], i = -1;
  return e.split(mn).forEach(function(s) {
    var a = s.match(gr) || [];
    n.push.apply(n, a), r.push(i += a.length + 1);
  }), n.c = r, n;
}, Ud = function(e, n, r) {
  var i = "", s = (e + i).match(mn), a = n ? "hsla(" : "rgba(", l = 0, o, u, c, f;
  if (!s)
    return e;
  if (s = s.map(function(p) {
    return (p = im(p, n, 1)) && a + (n ? p[0] + "," + p[1] + "%," + p[2] + "%," + p[3] : p.join(",")) + ")";
  }), r && (c = sm(e), o = r.c, o.join(i) !== c.c.join(i)))
    for (u = e.replace(mn, "1").split(gr), f = u.length - 1; l < f; l++)
      i += u[l] + (~o.indexOf(l) ? s.shift() || a + "0,0,0,0)" : (c.length ? c : s.length ? s : r).shift());
  if (!u)
    for (u = e.split(mn), f = u.length - 1; l < f; l++)
      i += u[l] + s[l];
  return i + u[f];
}, mn = function() {
  var t = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", e;
  for (e in si)
    t += "|" + e + "\\b";
  return new RegExp(t + ")", "gi");
}(), m1 = /hsl[a]?\(/, am = function(e) {
  var n = e.join(" "), r;
  if (mn.lastIndex = 0, mn.test(n))
    return r = m1.test(n), e[1] = Ud(e[1], r), e[0] = Ud(e[0], r, sm(e[1])), !0;
}, zi, qe = function() {
  var t = Date.now, e = 500, n = 33, r = t(), i = r, s = 1e3 / 240, a = s, l = [], o, u, c, f, p, y, _ = function g(x) {
    var m = t() - i, h = x === !0, v, w, S, E;
    if ((m > e || m < 0) && (r += m - n), i += m, S = i - r, v = S - a, (v > 0 || h) && (E = ++f.frame, p = S - f.time * 1e3, f.time = S = S / 1e3, a += v + (v >= s ? 4 : s - v), w = 1), h || (o = u(g)), w)
      for (y = 0; y < l.length; y++)
        l[y](S, p, E, x);
  };
  return f = {
    time: 0,
    frame: 0,
    tick: function() {
      _(!0);
    },
    deltaRatio: function(x) {
      return p / (1e3 / (x || 60));
    },
    wake: function() {
      Dp && (!To && Hu() && (Ct = To = window, Vu = Ct.document || {}, rt.gsap = Ge, (Ct.gsapVersions || (Ct.gsapVersions = [])).push(Ge.version), zp(aa || Ct.GreenSockGlobals || !Ct.gsap && Ct || {}), nm.forEach(rm)), c = typeof requestAnimationFrame < "u" && requestAnimationFrame, o && f.sleep(), u = c || function(x) {
        return setTimeout(x, a - f.time * 1e3 + 1 | 0);
      }, zi = 1, _(2));
    },
    sleep: function() {
      (c ? cancelAnimationFrame : clearTimeout)(o), zi = 0, u = Oi;
    },
    lagSmoothing: function(x, m) {
      e = x || 1 / 0, n = Math.min(m || 33, e);
    },
    fps: function(x) {
      s = 1e3 / (x || 240), a = f.time * 1e3 + s;
    },
    add: function(x, m, h) {
      var v = m ? function(w, S, E, k) {
        x(w, S, E, k), f.remove(v);
      } : x;
      return f.remove(x), l[h ? "unshift" : "push"](v), zr(), v;
    },
    remove: function(x, m) {
      ~(m = l.indexOf(x)) && l.splice(m, 1) && y >= m && y--;
    },
    _listeners: l
  }, f;
}(), zr = function() {
  return !zi && qe.wake();
}, V = {}, g1 = /^[\d.\-M][\d.\-,\s]/, v1 = /["']/g, y1 = function(e) {
  for (var n = {}, r = e.substr(1, e.length - 3).split(":"), i = r[0], s = 1, a = r.length, l, o, u; s < a; s++)
    o = r[s], l = s !== a - 1 ? o.lastIndexOf(",") : o.length, u = o.substr(0, l), n[i] = isNaN(u) ? u.replace(v1, "").trim() : +u, i = o.substr(l + 1).trim();
  return n;
}, _1 = function(e) {
  var n = e.indexOf("(") + 1, r = e.indexOf(")"), i = e.indexOf("(", n);
  return e.substring(n, ~i && i < r ? e.indexOf(")", r + 1) : r);
}, w1 = function(e) {
  var n = (e + "").split("("), r = V[n[0]];
  return r && n.length > 1 && r.config ? r.config.apply(null, ~e.indexOf("{") ? [y1(n[1])] : _1(e).split(",").map(Vp)) : V._CE && g1.test(e) ? V._CE("", e) : r;
}, lm = function(e) {
  return function(n) {
    return 1 - e(1 - n);
  };
}, om = function t(e, n) {
  for (var r = e._first, i; r; )
    r instanceof Ie ? t(r, n) : r.vars.yoyoEase && (!r._yoyo || !r._repeat) && r._yoyo !== n && (r.timeline ? t(r.timeline, n) : (i = r._ease, r._ease = r._yEase, r._yEase = i, r._yoyo = n)), r = r._next;
}, Vn = function(e, n) {
  return e && (ce(e) ? e : V[e] || w1(e)) || n;
}, Zn = function(e, n, r, i) {
  r === void 0 && (r = function(o) {
    return 1 - n(1 - o);
  }), i === void 0 && (i = function(o) {
    return o < 0.5 ? n(o * 2) / 2 : 1 - n((1 - o) * 2) / 2;
  });
  var s = {
    easeIn: n,
    easeOut: r,
    easeInOut: i
  }, a;
  return Ve(e, function(l) {
    V[l] = rt[l] = s, V[a = l.toLowerCase()] = r;
    for (var o in s)
      V[a + (o === "easeIn" ? ".in" : o === "easeOut" ? ".out" : ".inOut")] = V[l + "." + o] = s[o];
  }), s;
}, um = function(e) {
  return function(n) {
    return n < 0.5 ? (1 - e(1 - n * 2)) / 2 : 0.5 + e((n - 0.5) * 2) / 2;
  };
}, _l = function t(e, n, r) {
  var i = n >= 1 ? n : 1, s = (r || (e ? 0.3 : 0.45)) / (n < 1 ? n : 1), a = s / Co * (Math.asin(1 / i) || 0), l = function(c) {
    return c === 1 ? 1 : i * Math.pow(2, -10 * c) * W_((c - a) * s) + 1;
  }, o = e === "out" ? l : e === "in" ? function(u) {
    return 1 - l(1 - u);
  } : um(l);
  return s = Co / s, o.config = function(u, c) {
    return t(e, u, c);
  }, o;
}, wl = function t(e, n) {
  n === void 0 && (n = 1.70158);
  var r = function(a) {
    return a ? --a * a * ((n + 1) * a + n) + 1 : 0;
  }, i = e === "out" ? r : e === "in" ? function(s) {
    return 1 - r(1 - s);
  } : um(r);
  return i.config = function(s) {
    return t(e, s);
  }, i;
};
Ve("Linear,Quad,Cubic,Quart,Quint,Strong", function(t, e) {
  var n = e < 5 ? e + 1 : e;
  Zn(t + ",Power" + (n - 1), e ? function(r) {
    return Math.pow(r, n);
  } : function(r) {
    return r;
  }, function(r) {
    return 1 - Math.pow(1 - r, n);
  }, function(r) {
    return r < 0.5 ? Math.pow(r * 2, n) / 2 : 1 - Math.pow((1 - r) * 2, n) / 2;
  });
});
V.Linear.easeNone = V.none = V.Linear.easeIn;
Zn("Elastic", _l("in"), _l("out"), _l());
(function(t, e) {
  var n = 1 / e, r = 2 * n, i = 2.5 * n, s = function(l) {
    return l < n ? t * l * l : l < r ? t * Math.pow(l - 1.5 / e, 2) + 0.75 : l < i ? t * (l -= 2.25 / e) * l + 0.9375 : t * Math.pow(l - 2.625 / e, 2) + 0.984375;
  };
  Zn("Bounce", function(a) {
    return 1 - s(1 - a);
  }, s);
})(7.5625, 2.75);
Zn("Expo", function(t) {
  return Math.pow(2, 10 * (t - 1)) * t + t * t * t * t * t * t * (1 - t);
});
Zn("Circ", function(t) {
  return -(Ip(1 - t * t) - 1);
});
Zn("Sine", function(t) {
  return t === 1 ? 1 : -$_(t * H_) + 1;
});
Zn("Back", wl("in"), wl("out"), wl());
V.SteppedEase = V.steps = rt.SteppedEase = {
  config: function(e, n) {
    e === void 0 && (e = 1);
    var r = 1 / e, i = e + (n ? 0 : 1), s = n ? 1 : 0, a = 1 - Y;
    return function(l) {
      return ((i * Xi(0, a, l) | 0) + s) * r;
    };
  }
};
Rr.ease = V["quad.out"];
Ve("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(t) {
  return Gu += t + "," + t + "Params,";
});
var cm = function(e, n) {
  this.id = V_++, e._gsap = this, this.target = e, this.harness = n, this.get = n ? n.get : Up, this.set = n ? n.getSetter : Ju;
}, Fi = /* @__PURE__ */ function() {
  function t(n) {
    this.vars = n, this._delay = +n.delay || 0, (this._repeat = n.repeat === 1 / 0 ? -2 : n.repeat || 0) && (this._rDelay = n.repeatDelay || 0, this._yoyo = !!n.yoyo || !!n.yoyoEase), this._ts = 1, Dr(this, +n.duration, 1, 1), this.data = n.data, ee && (this._ctx = ee, ee.data.push(this)), zi || qe.wake();
  }
  var e = t.prototype;
  return e.delay = function(r) {
    return r || r === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + r - this._delay), this._delay = r, this) : this._delay;
  }, e.duration = function(r) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? r + (r + this._rDelay) * this._repeat : r) : this.totalDuration() && this._dur;
  }, e.totalDuration = function(r) {
    return arguments.length ? (this._dirty = 0, Dr(this, this._repeat < 0 ? r : (r - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, e.totalTime = function(r, i) {
    if (zr(), !arguments.length)
      return this._tTime;
    var s = this._dp;
    if (s && s.smoothChildTiming && this._ts) {
      for (Da(this, r), !s._dp || s.parent || Gp(s, this); s && s.parent; )
        s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0), s = s.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && r < this._tDur || this._ts < 0 && r > 0 || !this._tDur && !r) && Nt(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== r || !this._dur && !i || this._initted && Math.abs(this._zTime) === Y || !this._initted && this._dur && r || !r && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = r), Hp(this, r, i)), this;
  }, e.time = function(r, i) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), r + zd(this)) % (this._dur + this._rDelay) || (r ? this._dur : 0), i) : this._time;
  }, e.totalProgress = function(r, i) {
    return arguments.length ? this.totalTime(this.totalDuration() * r, i) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, e.progress = function(r, i) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - r : r) + zd(this), i) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, e.iteration = function(r, i) {
    var s = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (r - 1) * s, i) : this._repeat ? Or(this._tTime, s) + 1 : 1;
  }, e.timeScale = function(r, i) {
    if (!arguments.length)
      return this._rts === -Y ? 0 : this._rts;
    if (this._rts === r)
      return this;
    var s = this.parent && this._ts ? ua(this.parent._time, this) : this._tTime;
    return this._rts = +r || 0, this._ts = this._ps || r === -Y ? 0 : this._rts, this.totalTime(Xi(-Math.abs(this._delay), this.totalDuration(), s), i !== !1), Oa(this), t1(this);
  }, e.paused = function(r) {
    return arguments.length ? (this._ps !== r && (this._ps = r, r ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (zr(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== Y && (this._tTime -= Y)))), this) : this._ps;
  }, e.startTime = function(r) {
    if (arguments.length) {
      this._start = ne(r);
      var i = this.parent || this._dp;
      return i && (i._sort || !this.parent) && Nt(i, this, this._start - this._delay), this;
    }
    return this._start;
  }, e.endTime = function(r) {
    return this._start + (He(r) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, e.rawTime = function(r) {
    var i = this.parent || this._dp;
    return i ? r && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? ua(i.rawTime(r), this) : this._tTime : this._tTime;
  }, e.revert = function(r) {
    r === void 0 && (r = X_);
    var i = ke;
    return ke = r, Yu(this) && (this.timeline && this.timeline.revert(r), this.totalTime(-0.01, r.suppressEvents)), this.data !== "nested" && r.kill !== !1 && this.kill(), ke = i, this;
  }, e.globalTime = function(r) {
    for (var i = this, s = arguments.length ? r : i.rawTime(); i; )
      s = i._start + s / (Math.abs(i._ts) || 1), i = i._dp;
    return !this.parent && this._sat ? this._sat.globalTime(r) : s;
  }, e.repeat = function(r) {
    return arguments.length ? (this._repeat = r === 1 / 0 ? -2 : r, Fd(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, e.repeatDelay = function(r) {
    if (arguments.length) {
      var i = this._time;
      return this._rDelay = r, Fd(this), i ? this.time(i) : this;
    }
    return this._rDelay;
  }, e.yoyo = function(r) {
    return arguments.length ? (this._yoyo = r, this) : this._yoyo;
  }, e.seek = function(r, i) {
    return this.totalTime(lt(this, r), He(i));
  }, e.restart = function(r, i) {
    return this.play().totalTime(r ? -this._delay : 0, He(i)), this._dur || (this._zTime = -Y), this;
  }, e.play = function(r, i) {
    return r != null && this.seek(r, i), this.reversed(!1).paused(!1);
  }, e.reverse = function(r, i) {
    return r != null && this.seek(r || this.totalDuration(), i), this.reversed(!0).paused(!1);
  }, e.pause = function(r, i) {
    return r != null && this.seek(r, i), this.paused(!0);
  }, e.resume = function() {
    return this.paused(!1);
  }, e.reversed = function(r) {
    return arguments.length ? (!!r !== this.reversed() && this.timeScale(-this._rts || (r ? -Y : 0)), this) : this._rts < 0;
  }, e.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -Y, this;
  }, e.isActive = function() {
    var r = this.parent || this._dp, i = this._start, s;
    return !!(!r || this._ts && this._initted && r.isActive() && (s = r.rawTime(!0)) >= i && s < this.endTime(!0) - Y);
  }, e.eventCallback = function(r, i, s) {
    var a = this.vars;
    return arguments.length > 1 ? (i ? (a[r] = i, s && (a[r + "Params"] = s), r === "onUpdate" && (this._onUpdate = i)) : delete a[r], this) : a[r];
  }, e.then = function(r) {
    var i = this, s = i._prom;
    return new Promise(function(a) {
      var l = ce(r) ? r : $p, o = function() {
        var c = i.then;
        i.then = null, s && s(), ce(l) && (l = l(i)) && (l.then || l === i) && (i.then = c), a(l), i.then = c;
      };
      i._initted && i.totalProgress() === 1 && i._ts >= 0 || !i._tTime && i._ts < 0 ? o() : i._prom = o;
    });
  }, e.kill = function() {
    ii(this);
  }, t;
}();
it(Fi.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -Y,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var Ie = /* @__PURE__ */ function(t) {
  Lp(e, t);
  function e(r, i) {
    var s;
    return r === void 0 && (r = {}), s = t.call(this, r) || this, s.labels = {}, s.smoothChildTiming = !!r.smoothChildTiming, s.autoRemoveChildren = !!r.autoRemoveChildren, s._sort = He(r.sortChildren), ie && Nt(r.parent || ie, It(s), i), r.reversed && s.reverse(), r.paused && s.paused(!0), r.scrollTrigger && Kp(It(s), r.scrollTrigger), s;
  }
  var n = e.prototype;
  return n.to = function(i, s, a) {
    return gi(0, arguments, this), this;
  }, n.from = function(i, s, a) {
    return gi(1, arguments, this), this;
  }, n.fromTo = function(i, s, a, l) {
    return gi(2, arguments, this), this;
  }, n.set = function(i, s, a) {
    return s.duration = 0, s.parent = this, mi(s).repeatDelay || (s.repeat = 0), s.immediateRender = !!s.immediateRender, new he(i, s, lt(this, a), 1), this;
  }, n.call = function(i, s, a) {
    return Nt(this, he.delayedCall(0, i, s), a);
  }, n.staggerTo = function(i, s, a, l, o, u, c) {
    return a.duration = s, a.stagger = a.stagger || l, a.onComplete = u, a.onCompleteParams = c, a.parent = this, new he(i, a, lt(this, o)), this;
  }, n.staggerFrom = function(i, s, a, l, o, u, c) {
    return a.runBackwards = 1, mi(a).immediateRender = He(a.immediateRender), this.staggerTo(i, s, a, l, o, u, c);
  }, n.staggerFromTo = function(i, s, a, l, o, u, c, f) {
    return l.startAt = a, mi(l).immediateRender = He(l.immediateRender), this.staggerTo(i, s, l, o, u, c, f);
  }, n.render = function(i, s, a) {
    var l = this._time, o = this._dirty ? this.totalDuration() : this._tDur, u = this._dur, c = i <= 0 ? 0 : ne(i), f = this._zTime < 0 != i < 0 && (this._initted || !u), p, y, _, g, x, m, h, v, w, S, E, k;
    if (this !== ie && c > o && i >= 0 && (c = o), c !== this._tTime || a || f) {
      if (l !== this._time && u && (c += this._time - l, i += this._time - l), p = c, w = this._start, v = this._ts, m = !v, f && (u || (l = this._zTime), (i || !s) && (this._zTime = i)), this._repeat) {
        if (E = this._yoyo, x = u + this._rDelay, this._repeat < -1 && i < 0)
          return this.totalTime(x * 100 + i, s, a);
        if (p = ne(c % x), c === o ? (g = this._repeat, p = u) : (S = ne(c / x), g = ~~S, g && g === S && (p = u, g--), p > u && (p = u)), S = Or(this._tTime, x), !l && this._tTime && S !== g && this._tTime - S * x - this._dur <= 0 && (S = g), E && g & 1 && (p = u - p, k = 1), g !== S && !this._lock) {
          var C = E && S & 1, T = C === (E && g & 1);
          if (g < S && (C = !C), l = C ? 0 : c % u ? u : c, this._lock = 1, this.render(l || (k ? 0 : ne(g * x)), s, !u)._lock = 0, this._tTime = c, !s && this.parent && Je(this, "onRepeat"), this.vars.repeatRefresh && !k && (this.invalidate()._lock = 1, S = g), l && l !== this._time || m !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (u = this._dur, o = this._tDur, T && (this._lock = 2, l = C ? u : -1e-4, this.render(l, !0), this.vars.repeatRefresh && !k && this.invalidate()), this._lock = 0, !this._ts && !m)
            return this;
          om(this, k);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (h = s1(this, ne(l), ne(p)), h && (c -= p - (p = h._start))), this._tTime = c, this._time = p, this._act = !v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = i, l = 0), !l && c && u && !s && !S && (Je(this, "onStart"), this._tTime !== c))
        return this;
      if (p >= l && i >= 0)
        for (y = this._first; y; ) {
          if (_ = y._next, (y._act || p >= y._start) && y._ts && h !== y) {
            if (y.parent !== this)
              return this.render(i, s, a);
            if (y.render(y._ts > 0 ? (p - y._start) * y._ts : (y._dirty ? y.totalDuration() : y._tDur) + (p - y._start) * y._ts, s, a), p !== this._time || !this._ts && !m) {
              h = 0, _ && (c += this._zTime = -Y);
              break;
            }
          }
          y = _;
        }
      else {
        y = this._last;
        for (var b = i < 0 ? i : p; y; ) {
          if (_ = y._prev, (y._act || b <= y._end) && y._ts && h !== y) {
            if (y.parent !== this)
              return this.render(i, s, a);
            if (y.render(y._ts > 0 ? (b - y._start) * y._ts : (y._dirty ? y.totalDuration() : y._tDur) + (b - y._start) * y._ts, s, a || ke && Yu(y)), p !== this._time || !this._ts && !m) {
              h = 0, _ && (c += this._zTime = b ? -Y : Y);
              break;
            }
          }
          y = _;
        }
      }
      if (h && !s && (this.pause(), h.render(p >= l ? 0 : -Y)._zTime = p >= l ? 1 : -1, this._ts))
        return this._start = w, Oa(this), this.render(i, s, a);
      this._onUpdate && !s && Je(this, "onUpdate", !0), (c === o && this._tTime >= this.totalDuration() || !c && l) && (w === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((i || !u) && (c === o && this._ts > 0 || !c && this._ts < 0) && yn(this, 1), !s && !(i < 0 && !l) && (c || l || !o) && (Je(this, c === o && i >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < o && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, n.add = function(i, s) {
    var a = this;
    if (Vt(s) || (s = lt(this, s, i)), !(i instanceof Fi)) {
      if (Pe(i))
        return i.forEach(function(l) {
          return a.add(l, s);
        }), this;
      if (we(i))
        return this.addLabel(i, s);
      if (ce(i))
        i = he.delayedCall(0, i);
      else
        return this;
    }
    return this !== i ? Nt(this, i, s) : this;
  }, n.getChildren = function(i, s, a, l) {
    i === void 0 && (i = !0), s === void 0 && (s = !0), a === void 0 && (a = !0), l === void 0 && (l = -dt);
    for (var o = [], u = this._first; u; )
      u._start >= l && (u instanceof he ? s && o.push(u) : (a && o.push(u), i && o.push.apply(o, u.getChildren(!0, s, a)))), u = u._next;
    return o;
  }, n.getById = function(i) {
    for (var s = this.getChildren(1, 1, 1), a = s.length; a--; )
      if (s[a].vars.id === i)
        return s[a];
  }, n.remove = function(i) {
    return we(i) ? this.removeLabel(i) : ce(i) ? this.killTweensOf(i) : (i.parent === this && Ma(this, i), i === this._recent && (this._recent = this._last), Hn(this));
  }, n.totalTime = function(i, s) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = ne(qe.time - (this._ts > 0 ? i / this._ts : (this.totalDuration() - i) / -this._ts))), t.prototype.totalTime.call(this, i, s), this._forcing = 0, this) : this._tTime;
  }, n.addLabel = function(i, s) {
    return this.labels[i] = lt(this, s), this;
  }, n.removeLabel = function(i) {
    return delete this.labels[i], this;
  }, n.addPause = function(i, s, a) {
    var l = he.delayedCall(0, s || Oi, a);
    return l.data = "isPause", this._hasPause = 1, Nt(this, l, lt(this, i));
  }, n.removePause = function(i) {
    var s = this._first;
    for (i = lt(this, i); s; )
      s._start === i && s.data === "isPause" && yn(s), s = s._next;
  }, n.killTweensOf = function(i, s, a) {
    for (var l = this.getTweensOf(i, a), o = l.length; o--; )
      tn !== l[o] && l[o].kill(i, s);
    return this;
  }, n.getTweensOf = function(i, s) {
    for (var a = [], l = ft(i), o = this._first, u = Vt(s), c; o; )
      o instanceof he ? J_(o._targets, l) && (u ? (!tn || o._initted && o._ts) && o.globalTime(0) <= s && o.globalTime(o.totalDuration()) > s : !s || o.isActive()) && a.push(o) : (c = o.getTweensOf(l, s)).length && a.push.apply(a, c), o = o._next;
    return a;
  }, n.tweenTo = function(i, s) {
    s = s || {};
    var a = this, l = lt(a, i), o = s, u = o.startAt, c = o.onStart, f = o.onStartParams, p = o.immediateRender, y, _ = he.to(a, it({
      ease: s.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: l,
      overwrite: "auto",
      duration: s.duration || Math.abs((l - (u && "time" in u ? u.time : a._time)) / a.timeScale()) || Y,
      onStart: function() {
        if (a.pause(), !y) {
          var x = s.duration || Math.abs((l - (u && "time" in u ? u.time : a._time)) / a.timeScale());
          _._dur !== x && Dr(_, x, 0, 1).render(_._time, !0, !0), y = 1;
        }
        c && c.apply(_, f || []);
      }
    }, s));
    return p ? _.render(0) : _;
  }, n.tweenFromTo = function(i, s, a) {
    return this.tweenTo(s, it({
      startAt: {
        time: lt(this, i)
      }
    }, a));
  }, n.recent = function() {
    return this._recent;
  }, n.nextLabel = function(i) {
    return i === void 0 && (i = this._time), Bd(this, lt(this, i));
  }, n.previousLabel = function(i) {
    return i === void 0 && (i = this._time), Bd(this, lt(this, i), 1);
  }, n.currentLabel = function(i) {
    return arguments.length ? this.seek(i, !0) : this.previousLabel(this._time + Y);
  }, n.shiftChildren = function(i, s, a) {
    a === void 0 && (a = 0);
    var l = this._first, o = this.labels, u;
    for (i = ne(i); l; )
      l._start >= a && (l._start += i, l._end += i), l = l._next;
    if (s)
      for (u in o)
        o[u] >= a && (o[u] += i);
    return Hn(this);
  }, n.invalidate = function(i) {
    var s = this._first;
    for (this._lock = 0; s; )
      s.invalidate(i), s = s._next;
    return t.prototype.invalidate.call(this, i);
  }, n.clear = function(i) {
    i === void 0 && (i = !0);
    for (var s = this._first, a; s; )
      a = s._next, this.remove(s), s = a;
    return this._dp && (this._time = this._tTime = this._pTime = 0), i && (this.labels = {}), Hn(this);
  }, n.totalDuration = function(i) {
    var s = 0, a = this, l = a._last, o = dt, u, c, f;
    if (arguments.length)
      return a.timeScale((a._repeat < 0 ? a.duration() : a.totalDuration()) / (a.reversed() ? -i : i));
    if (a._dirty) {
      for (f = a.parent; l; )
        u = l._prev, l._dirty && l.totalDuration(), c = l._start, c > o && a._sort && l._ts && !a._lock ? (a._lock = 1, Nt(a, l, c - l._delay, 1)._lock = 0) : o = c, c < 0 && l._ts && (s -= c, (!f && !a._dp || f && f.smoothChildTiming) && (a._start += ne(c / a._ts), a._time -= c, a._tTime -= c), a.shiftChildren(-c, !1, -1 / 0), o = 0), l._end > s && l._ts && (s = l._end), l = u;
      Dr(a, a === ie && a._time > s ? a._time : s, 1, 1), a._dirty = 0;
    }
    return a._tDur;
  }, e.updateRoot = function(i) {
    if (ie._ts && (Hp(ie, ua(i, ie)), Bp = qe.frame), qe.frame >= Od) {
      Od += tt.autoSleep || 120;
      var s = ie._first;
      if ((!s || !s._ts) && tt.autoSleep && qe._listeners.length < 2) {
        for (; s && !s._ts; )
          s = s._next;
        s || qe.sleep();
      }
    }
  }, e;
}(Fi);
it(Ie.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var S1 = function(e, n, r, i, s, a, l) {
  var o = new $e(this._pt, e, n, 0, 1, gm, null, s), u = 0, c = 0, f, p, y, _, g, x, m, h;
  for (o.b = r, o.e = i, r += "", i += "", (m = ~i.indexOf("random(")) && (i = Di(i)), a && (h = [r, i], a(h, e, n), r = h[0], i = h[1]), p = r.match(gl) || []; f = gl.exec(i); )
    _ = f[0], g = i.substring(u, f.index), y ? y = (y + 1) % 5 : g.substr(-5) === "rgba(" && (y = 1), _ !== p[c++] && (x = parseFloat(p[c - 1]) || 0, o._pt = {
      _next: o._pt,
      p: g || c === 1 ? g : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: x,
      c: _.charAt(1) === "=" ? Er(x, _) - x : parseFloat(_) - x,
      m: y && y < 4 ? Math.round : 0
    }, u = gl.lastIndex);
  return o.c = u < i.length ? i.substring(u, i.length) : "", o.fp = l, (Op.test(i) || m) && (o.e = 0), this._pt = o, o;
}, Qu = function(e, n, r, i, s, a, l, o, u, c) {
  ce(i) && (i = i(s || 0, e, a));
  var f = e[n], p = r !== "get" ? r : ce(f) ? u ? e[n.indexOf("set") || !ce(e["get" + n.substr(3)]) ? n : "get" + n.substr(3)](u) : e[n]() : f, y = ce(f) ? u ? T1 : pm : Xu, _;
  if (we(i) && (~i.indexOf("random(") && (i = Di(i)), i.charAt(1) === "=" && (_ = Er(p, i) + (je(p) || 0), (_ || _ === 0) && (i = _))), !c || p !== i || Io)
    return !isNaN(p * i) && i !== "" ? (_ = new $e(this._pt, e, n, +p || 0, i - (p || 0), typeof f == "boolean" ? j1 : mm, 0, y), u && (_.fp = u), l && _.modifier(l, this, e), this._pt = _) : (!f && !(n in e) && $u(n, i), S1.call(this, e, n, p, i, y, o || tt.stringFilter, u));
}, x1 = function(e, n, r, i, s) {
  if (ce(e) && (e = vi(e, s, n, r, i)), !bt(e) || e.style && e.nodeType || Pe(e) || Rp(e))
    return we(e) ? vi(e, s, n, r, i) : e;
  var a = {}, l;
  for (l in e)
    a[l] = vi(e[l], s, n, r, i);
  return a;
}, dm = function(e, n, r, i, s, a) {
  var l, o, u, c;
  if (Qe[e] && (l = new Qe[e]()).init(s, l.rawVars ? n[e] : x1(n[e], i, s, a, r), r, i, a) !== !1 && (r._pt = o = new $e(r._pt, s, e, 0, 1, l.render, l, 0, l.priority), r !== vr))
    for (u = r._ptLookup[r._targets.indexOf(s)], c = l._props.length; c--; )
      u[l._props[c]] = o;
  return l;
}, tn, Io, qu = function t(e, n, r) {
  var i = e.vars, s = i.ease, a = i.startAt, l = i.immediateRender, o = i.lazy, u = i.onUpdate, c = i.runBackwards, f = i.yoyoEase, p = i.keyframes, y = i.autoRevert, _ = e._dur, g = e._startAt, x = e._targets, m = e.parent, h = m && m.data === "nested" ? m.vars.targets : x, v = e._overwrite === "auto" && !Bu, w = e.timeline, S, E, k, C, T, b, O, U, H, J, W, A, M;
  if (w && (!p || !s) && (s = "none"), e._ease = Vn(s, Rr.ease), e._yEase = f ? lm(Vn(f === !0 ? s : f, Rr.ease)) : 0, f && e._yoyo && !e._repeat && (f = e._yEase, e._yEase = e._ease, e._ease = f), e._from = !w && !!i.runBackwards, !w || p && !i.stagger) {
    if (U = x[0] ? Un(x[0]).harness : 0, A = U && i[U.prop], S = oa(i, Wu), g && (g._zTime < 0 && g.progress(1), n < 0 && c && l && !y ? g.render(-1, !0) : g.revert(c && _ ? As : q_), g._lazy = 0), a) {
      if (yn(e._startAt = he.set(x, it({
        data: "isStart",
        overwrite: !1,
        parent: m,
        immediateRender: !0,
        lazy: !g && He(o),
        startAt: null,
        delay: 0,
        onUpdate: u && function() {
          return Je(e, "onUpdate");
        },
        stagger: 0
      }, a))), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (ke || !l && !y) && e._startAt.revert(As), l && _ && n <= 0 && r <= 0) {
        n && (e._zTime = n);
        return;
      }
    } else if (c && _ && !g) {
      if (n && (l = !1), k = it({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: l && !g && He(o),
        immediateRender: l,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: m
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, S), A && (k[U.prop] = A), yn(e._startAt = he.set(x, k)), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (ke ? e._startAt.revert(As) : e._startAt.render(-1, !0)), e._zTime = n, !l)
        t(e._startAt, Y, Y);
      else if (!n)
        return;
    }
    for (e._pt = e._ptCache = 0, o = _ && He(o) || o && !_, E = 0; E < x.length; E++) {
      if (T = x[E], O = T._gsap || Ku(x)[E]._gsap, e._ptLookup[E] = J = {}, No[O.id] && pn.length && la(), W = h === x ? E : h.indexOf(T), U && (H = new U()).init(T, A || S, e, W, h) !== !1 && (e._pt = C = new $e(e._pt, T, H.name, 0, 1, H.render, H, 0, H.priority), H._props.forEach(function(N) {
        J[N] = C;
      }), H.priority && (b = 1)), !U || A)
        for (k in S)
          Qe[k] && (H = dm(k, S, e, W, T, h)) ? H.priority && (b = 1) : J[k] = C = Qu.call(e, T, k, "get", S[k], W, h, 0, i.stringFilter);
      e._op && e._op[E] && e.kill(T, e._op[E]), v && e._pt && (tn = e, ie.killTweensOf(T, J, e.globalTime(n)), M = !e.parent, tn = 0), e._pt && o && (No[O.id] = 1);
    }
    b && vm(e), e._onInit && e._onInit(e);
  }
  e._onUpdate = u, e._initted = (!e._op || e._pt) && !M, p && n <= 0 && w.render(dt, !0, !0);
}, k1 = function(e, n, r, i, s, a, l, o) {
  var u = (e._pt && e._ptCache || (e._ptCache = {}))[n], c, f, p, y;
  if (!u)
    for (u = e._ptCache[n] = [], p = e._ptLookup, y = e._targets.length; y--; ) {
      if (c = p[y][n], c && c.d && c.d._pt)
        for (c = c.d._pt; c && c.p !== n && c.fp !== n; )
          c = c._next;
      if (!c)
        return Io = 1, e.vars[n] = "+=0", qu(e, l), Io = 0, o ? Mi(n + " not eligible for reset") : 1;
      u.push(c);
    }
  for (y = u.length; y--; )
    f = u[y], c = f._pt || f, c.s = (i || i === 0) && !s ? i : c.s + (i || 0) + a * c.c, c.c = r - c.s, f.e && (f.e = de(r) + je(f.e)), f.b && (f.b = c.s + je(f.b));
}, E1 = function(e, n) {
  var r = e[0] ? Un(e[0]).harness : 0, i = r && r.aliases, s, a, l, o;
  if (!i)
    return n;
  s = Mr({}, n);
  for (a in i)
    if (a in s)
      for (o = i[a].split(","), l = o.length; l--; )
        s[o[l]] = s[a];
  return s;
}, C1 = function(e, n, r, i) {
  var s = n.ease || i || "power1.inOut", a, l;
  if (Pe(n))
    l = r[e] || (r[e] = []), n.forEach(function(o, u) {
      return l.push({
        t: u / (n.length - 1) * 100,
        v: o,
        e: s
      });
    });
  else
    for (a in n)
      l = r[a] || (r[a] = []), a === "ease" || l.push({
        t: parseFloat(e),
        v: n[a],
        e: s
      });
}, vi = function(e, n, r, i, s) {
  return ce(e) ? e.call(n, r, i, s) : we(e) && ~e.indexOf("random(") ? Di(e) : e;
}, fm = Gu + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", hm = {};
Ve(fm + ",id,stagger,delay,duration,paused,scrollTrigger", function(t) {
  return hm[t] = 1;
});
var he = /* @__PURE__ */ function(t) {
  Lp(e, t);
  function e(r, i, s, a) {
    var l;
    typeof i == "number" && (s.duration = i, i = s, s = null), l = t.call(this, a ? i : mi(i)) || this;
    var o = l.vars, u = o.duration, c = o.delay, f = o.immediateRender, p = o.stagger, y = o.overwrite, _ = o.keyframes, g = o.defaults, x = o.scrollTrigger, m = o.yoyoEase, h = i.parent || ie, v = (Pe(r) || Rp(r) ? Vt(r[0]) : "length" in i) ? [r] : ft(r), w, S, E, k, C, T, b, O;
    if (l._targets = v.length ? Ku(v) : Mi("GSAP target " + r + " not found. https://gsap.com", !tt.nullTargetWarn) || [], l._ptLookup = [], l._overwrite = y, _ || p || gs(u) || gs(c)) {
      if (i = l.vars, w = l.timeline = new Ie({
        data: "nested",
        defaults: g || {},
        targets: h && h.data === "nested" ? h.vars.targets : v
      }), w.kill(), w.parent = w._dp = It(l), w._start = 0, p || gs(u) || gs(c)) {
        if (k = v.length, b = p && Xp(p), bt(p))
          for (C in p)
            ~fm.indexOf(C) && (O || (O = {}), O[C] = p[C]);
        for (S = 0; S < k; S++)
          E = oa(i, hm), E.stagger = 0, m && (E.yoyoEase = m), O && Mr(E, O), T = v[S], E.duration = +vi(u, It(l), S, T, v), E.delay = (+vi(c, It(l), S, T, v) || 0) - l._delay, !p && k === 1 && E.delay && (l._delay = c = E.delay, l._start += c, E.delay = 0), w.to(T, E, b ? b(S, T, v) : 0), w._ease = V.none;
        w.duration() ? u = c = 0 : l.timeline = 0;
      } else if (_) {
        mi(it(w.vars.defaults, {
          ease: "none"
        })), w._ease = Vn(_.ease || i.ease || "none");
        var U = 0, H, J, W;
        if (Pe(_))
          _.forEach(function(A) {
            return w.to(v, A, ">");
          }), w.duration();
        else {
          E = {};
          for (C in _)
            C === "ease" || C === "easeEach" || C1(C, _[C], E, _.easeEach);
          for (C in E)
            for (H = E[C].sort(function(A, M) {
              return A.t - M.t;
            }), U = 0, S = 0; S < H.length; S++)
              J = H[S], W = {
                ease: J.e,
                duration: (J.t - (S ? H[S - 1].t : 0)) / 100 * u
              }, W[C] = J.v, w.to(v, W, U), U += W.duration;
          w.duration() < u && w.to({}, {
            duration: u - w.duration()
          });
        }
      }
      u || l.duration(u = w.duration());
    } else
      l.timeline = 0;
    return y === !0 && !Bu && (tn = It(l), ie.killTweensOf(v), tn = 0), Nt(h, It(l), s), i.reversed && l.reverse(), i.paused && l.paused(!0), (f || !u && !_ && l._start === ne(h._time) && He(f) && n1(It(l)) && h.data !== "nested") && (l._tTime = -Y, l.render(Math.max(0, -c) || 0)), x && Kp(It(l), x), l;
  }
  var n = e.prototype;
  return n.render = function(i, s, a) {
    var l = this._time, o = this._tDur, u = this._dur, c = i < 0, f = i > o - Y && !c ? o : i < Y ? 0 : i, p, y, _, g, x, m, h, v, w;
    if (!u)
      i1(this, i, s, a);
    else if (f !== this._tTime || !i || a || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== c || this._lazy) {
      if (p = f, v = this.timeline, this._repeat) {
        if (g = u + this._rDelay, this._repeat < -1 && c)
          return this.totalTime(g * 100 + i, s, a);
        if (p = ne(f % g), f === o ? (_ = this._repeat, p = u) : (x = ne(f / g), _ = ~~x, _ && _ === x ? (p = u, _--) : p > u && (p = u)), m = this._yoyo && _ & 1, m && (w = this._yEase, p = u - p), x = Or(this._tTime, g), p === l && !a && this._initted && _ === x)
          return this._tTime = f, this;
        _ !== x && (v && this._yEase && om(v, m), this.vars.repeatRefresh && !m && !this._lock && p !== g && this._initted && (this._lock = a = 1, this.render(ne(g * _), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Yp(this, c ? i : p, a, s, f))
          return this._tTime = 0, this;
        if (l !== this._time && !(a && this.vars.repeatRefresh && _ !== x))
          return this;
        if (u !== this._dur)
          return this.render(i, s, a);
      }
      if (this._tTime = f, this._time = p, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = h = (w || this._ease)(p / u), this._from && (this.ratio = h = 1 - h), !l && f && !s && !x && (Je(this, "onStart"), this._tTime !== f))
        return this;
      for (y = this._pt; y; )
        y.r(h, y.d), y = y._next;
      v && v.render(i < 0 ? i : v._dur * v._ease(p / this._dur), s, a) || this._startAt && (this._zTime = i), this._onUpdate && !s && (c && jo(this, i, s, a), Je(this, "onUpdate")), this._repeat && _ !== x && this.vars.onRepeat && !s && this.parent && Je(this, "onRepeat"), (f === this._tDur || !f) && this._tTime === f && (c && !this._onUpdate && jo(this, i, !0, !0), (i || !u) && (f === this._tDur && this._ts > 0 || !f && this._ts < 0) && yn(this, 1), !s && !(c && !l) && (f || l || m) && (Je(this, f === o ? "onComplete" : "onReverseComplete", !0), this._prom && !(f < o && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, n.targets = function() {
    return this._targets;
  }, n.invalidate = function(i) {
    return (!i || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(i), t.prototype.invalidate.call(this, i);
  }, n.resetTo = function(i, s, a, l, o) {
    zi || qe.wake(), this._ts || this.play();
    var u = Math.min(this._dur, (this._dp._time - this._start) * this._ts), c;
    return this._initted || qu(this, u), c = this._ease(u / this._dur), k1(this, i, s, a, l, c, u, o) ? this.resetTo(i, s, a, l, 1) : (Da(this, 0), this.parent || Wp(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, n.kill = function(i, s) {
    if (s === void 0 && (s = "all"), !i && (!s || s === "all"))
      return this._lazy = this._pt = 0, this.parent ? ii(this) : this.scrollTrigger && this.scrollTrigger.kill(!!ke), this;
    if (this.timeline) {
      var a = this.timeline.totalDuration();
      return this.timeline.killTweensOf(i, s, tn && tn.vars.overwrite !== !0)._first || ii(this), this.parent && a !== this.timeline.totalDuration() && Dr(this, this._dur * this.timeline._tDur / a, 0, 1), this;
    }
    var l = this._targets, o = i ? ft(i) : l, u = this._ptLookup, c = this._pt, f, p, y, _, g, x, m;
    if ((!s || s === "all") && e1(l, o))
      return s === "all" && (this._pt = 0), ii(this);
    for (f = this._op = this._op || [], s !== "all" && (we(s) && (g = {}, Ve(s, function(h) {
      return g[h] = 1;
    }), s = g), s = E1(l, s)), m = l.length; m--; )
      if (~o.indexOf(l[m])) {
        p = u[m], s === "all" ? (f[m] = s, _ = p, y = {}) : (y = f[m] = f[m] || {}, _ = s);
        for (g in _)
          x = p && p[g], x && ((!("kill" in x.d) || x.d.kill(g) === !0) && Ma(this, x, "_pt"), delete p[g]), y !== "all" && (y[g] = 1);
      }
    return this._initted && !this._pt && c && ii(this), this;
  }, e.to = function(i, s) {
    return new e(i, s, arguments[2]);
  }, e.from = function(i, s) {
    return gi(1, arguments);
  }, e.delayedCall = function(i, s, a, l) {
    return new e(s, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: i,
      onComplete: s,
      onReverseComplete: s,
      onCompleteParams: a,
      onReverseCompleteParams: a,
      callbackScope: l
    });
  }, e.fromTo = function(i, s, a) {
    return gi(2, arguments);
  }, e.set = function(i, s) {
    return s.duration = 0, s.repeatDelay || (s.repeat = 0), new e(i, s);
  }, e.killTweensOf = function(i, s, a) {
    return ie.killTweensOf(i, s, a);
  }, e;
}(Fi);
it(he.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
Ve("staggerTo,staggerFrom,staggerFromTo", function(t) {
  he[t] = function() {
    var e = new Ie(), n = Ao.call(arguments, 0);
    return n.splice(t === "staggerFromTo" ? 5 : 4, 0, 0), e[t].apply(e, n);
  };
});
var Xu = function(e, n, r) {
  return e[n] = r;
}, pm = function(e, n, r) {
  return e[n](r);
}, T1 = function(e, n, r, i) {
  return e[n](i.fp, r);
}, N1 = function(e, n, r) {
  return e.setAttribute(n, r);
}, Ju = function(e, n) {
  return ce(e[n]) ? pm : Uu(e[n]) && e.setAttribute ? N1 : Xu;
}, mm = function(e, n) {
  return n.set(n.t, n.p, Math.round((n.s + n.c * e) * 1e6) / 1e6, n);
}, j1 = function(e, n) {
  return n.set(n.t, n.p, !!(n.s + n.c * e), n);
}, gm = function(e, n) {
  var r = n._pt, i = "";
  if (!e && n.b)
    i = n.b;
  else if (e === 1 && n.e)
    i = n.e;
  else {
    for (; r; )
      i = r.p + (r.m ? r.m(r.s + r.c * e) : Math.round((r.s + r.c * e) * 1e4) / 1e4) + i, r = r._next;
    i += n.c;
  }
  n.set(n.t, n.p, i, n);
}, Zu = function(e, n) {
  for (var r = n._pt; r; )
    r.r(e, r.d), r = r._next;
}, P1 = function(e, n, r, i) {
  for (var s = this._pt, a; s; )
    a = s._next, s.p === i && s.modifier(e, n, r), s = a;
}, A1 = function(e) {
  for (var n = this._pt, r, i; n; )
    i = n._next, n.p === e && !n.op || n.op === e ? Ma(this, n, "_pt") : n.dep || (r = 1), n = i;
  return !r;
}, b1 = function(e, n, r, i) {
  i.mSet(e, n, i.m.call(i.tween, r, i.mt), i);
}, vm = function(e) {
  for (var n = e._pt, r, i, s, a; n; ) {
    for (r = n._next, i = s; i && i.pr > n.pr; )
      i = i._next;
    (n._prev = i ? i._prev : a) ? n._prev._next = n : s = n, (n._next = i) ? i._prev = n : a = n, n = r;
  }
  e._pt = s;
}, $e = /* @__PURE__ */ function() {
  function t(n, r, i, s, a, l, o, u, c) {
    this.t = r, this.s = s, this.c = a, this.p = i, this.r = l || mm, this.d = o || this, this.set = u || Xu, this.pr = c || 0, this._next = n, n && (n._prev = this);
  }
  var e = t.prototype;
  return e.modifier = function(r, i, s) {
    this.mSet = this.mSet || this.set, this.set = b1, this.m = r, this.mt = s, this.tween = i;
  }, t;
}();
Ve(Gu + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(t) {
  return Wu[t] = 1;
});
rt.TweenMax = rt.TweenLite = he;
rt.TimelineLite = rt.TimelineMax = Ie;
ie = new Ie({
  sortChildren: !1,
  defaults: Rr,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
tt.stringFilter = am;
var $n = [], Ls = {}, L1 = [], Hd = 0, I1 = 0, Sl = function(e) {
  return (Ls[e] || L1).map(function(n) {
    return n();
  });
}, Ro = function() {
  var e = Date.now(), n = [];
  e - Hd > 2 && (Sl("matchMediaInit"), $n.forEach(function(r) {
    var i = r.queries, s = r.conditions, a, l, o, u;
    for (l in i)
      a = Ct.matchMedia(i[l]).matches, a && (o = 1), a !== s[l] && (s[l] = a, u = 1);
    u && (r.revert(), o && n.push(r));
  }), Sl("matchMediaRevert"), n.forEach(function(r) {
    return r.onMatch(r, function(i) {
      return r.add(null, i);
    });
  }), Hd = e, Sl("matchMedia"));
}, ym = /* @__PURE__ */ function() {
  function t(n, r) {
    this.selector = r && bo(r), this.data = [], this._r = [], this.isReverted = !1, this.id = I1++, n && this.add(n);
  }
  var e = t.prototype;
  return e.add = function(r, i, s) {
    ce(r) && (s = i, i = r, r = ce);
    var a = this, l = function() {
      var u = ee, c = a.selector, f;
      return u && u !== a && u.data.push(a), s && (a.selector = bo(s)), ee = a, f = i.apply(a, arguments), ce(f) && a._r.push(f), ee = u, a.selector = c, a.isReverted = !1, f;
    };
    return a.last = l, r === ce ? l(a, function(o) {
      return a.add(null, o);
    }) : r ? a[r] = l : l;
  }, e.ignore = function(r) {
    var i = ee;
    ee = null, r(this), ee = i;
  }, e.getTweens = function() {
    var r = [];
    return this.data.forEach(function(i) {
      return i instanceof t ? r.push.apply(r, i.getTweens()) : i instanceof he && !(i.parent && i.parent.data === "nested") && r.push(i);
    }), r;
  }, e.clear = function() {
    this._r.length = this.data.length = 0;
  }, e.kill = function(r, i) {
    var s = this;
    if (r ? function() {
      for (var l = s.getTweens(), o = s.data.length, u; o--; )
        u = s.data[o], u.data === "isFlip" && (u.revert(), u.getChildren(!0, !0, !1).forEach(function(c) {
          return l.splice(l.indexOf(c), 1);
        }));
      for (l.map(function(c) {
        return {
          g: c._dur || c._delay || c._sat && !c._sat.vars.immediateRender ? c.globalTime(0) : -1 / 0,
          t: c
        };
      }).sort(function(c, f) {
        return f.g - c.g || -1 / 0;
      }).forEach(function(c) {
        return c.t.revert(r);
      }), o = s.data.length; o--; )
        u = s.data[o], u instanceof Ie ? u.data !== "nested" && (u.scrollTrigger && u.scrollTrigger.revert(), u.kill()) : !(u instanceof he) && u.revert && u.revert(r);
      s._r.forEach(function(c) {
        return c(r, s);
      }), s.isReverted = !0;
    }() : this.data.forEach(function(l) {
      return l.kill && l.kill();
    }), this.clear(), i)
      for (var a = $n.length; a--; )
        $n[a].id === this.id && $n.splice(a, 1);
  }, e.revert = function(r) {
    this.kill(r || {});
  }, t;
}(), R1 = /* @__PURE__ */ function() {
  function t(n) {
    this.contexts = [], this.scope = n, ee && ee.data.push(this);
  }
  var e = t.prototype;
  return e.add = function(r, i, s) {
    bt(r) || (r = {
      matches: r
    });
    var a = new ym(0, s || this.scope), l = a.conditions = {}, o, u, c;
    ee && !a.selector && (a.selector = ee.selector), this.contexts.push(a), i = a.add("onMatch", i), a.queries = r;
    for (u in r)
      u === "all" ? c = 1 : (o = Ct.matchMedia(r[u]), o && ($n.indexOf(a) < 0 && $n.push(a), (l[u] = o.matches) && (c = 1), o.addListener ? o.addListener(Ro) : o.addEventListener("change", Ro)));
    return c && i(a, function(f) {
      return a.add(null, f);
    }), this;
  }, e.revert = function(r) {
    this.kill(r || {});
  }, e.kill = function(r) {
    this.contexts.forEach(function(i) {
      return i.kill(r, !0);
    });
  }, t;
}(), ca = {
  registerPlugin: function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    n.forEach(function(i) {
      return rm(i);
    });
  },
  timeline: function(e) {
    return new Ie(e);
  },
  getTweensOf: function(e, n) {
    return ie.getTweensOf(e, n);
  },
  getProperty: function(e, n, r, i) {
    we(e) && (e = ft(e)[0]);
    var s = Un(e || {}).get, a = r ? $p : Vp;
    return r === "native" && (r = ""), e && (n ? a((Qe[n] && Qe[n].get || s)(e, n, r, i)) : function(l, o, u) {
      return a((Qe[l] && Qe[l].get || s)(e, l, o, u));
    });
  },
  quickSetter: function(e, n, r) {
    if (e = ft(e), e.length > 1) {
      var i = e.map(function(c) {
        return Ge.quickSetter(c, n, r);
      }), s = i.length;
      return function(c) {
        for (var f = s; f--; )
          i[f](c);
      };
    }
    e = e[0] || {};
    var a = Qe[n], l = Un(e), o = l.harness && (l.harness.aliases || {})[n] || n, u = a ? function(c) {
      var f = new a();
      vr._pt = 0, f.init(e, r ? c + r : c, vr, 0, [e]), f.render(1, f), vr._pt && Zu(1, vr);
    } : l.set(e, o);
    return a ? u : function(c) {
      return u(e, o, r ? c + r : c, l, 1);
    };
  },
  quickTo: function(e, n, r) {
    var i, s = Ge.to(e, it((i = {}, i[n] = "+=0.1", i.paused = !0, i.stagger = 0, i), r || {})), a = function(o, u, c) {
      return s.resetTo(n, o, u, c);
    };
    return a.tween = s, a;
  },
  isTweening: function(e) {
    return ie.getTweensOf(e, !0).length > 0;
  },
  defaults: function(e) {
    return e && e.ease && (e.ease = Vn(e.ease, Rr.ease)), Dd(Rr, e || {});
  },
  config: function(e) {
    return Dd(tt, e || {});
  },
  registerEffect: function(e) {
    var n = e.name, r = e.effect, i = e.plugins, s = e.defaults, a = e.extendTimeline;
    (i || "").split(",").forEach(function(l) {
      return l && !Qe[l] && !rt[l] && Mi(n + " effect requires " + l + " plugin.");
    }), vl[n] = function(l, o, u) {
      return r(ft(l), it(o || {}, s), u);
    }, a && (Ie.prototype[n] = function(l, o, u) {
      return this.add(vl[n](l, bt(o) ? o : (u = o) && {}, this), u);
    });
  },
  registerEase: function(e, n) {
    V[e] = Vn(n);
  },
  parseEase: function(e, n) {
    return arguments.length ? Vn(e, n) : V;
  },
  getById: function(e) {
    return ie.getById(e);
  },
  exportRoot: function(e, n) {
    e === void 0 && (e = {});
    var r = new Ie(e), i, s;
    for (r.smoothChildTiming = He(e.smoothChildTiming), ie.remove(r), r._dp = 0, r._time = r._tTime = ie._time, i = ie._first; i; )
      s = i._next, (n || !(!i._dur && i instanceof he && i.vars.onComplete === i._targets[0])) && Nt(r, i, i._start - i._delay), i = s;
    return Nt(ie, r, 0), r;
  },
  context: function(e, n) {
    return e ? new ym(e, n) : ee;
  },
  matchMedia: function(e) {
    return new R1(e);
  },
  matchMediaRefresh: function() {
    return $n.forEach(function(e) {
      var n = e.conditions, r, i;
      for (i in n)
        n[i] && (n[i] = !1, r = 1);
      r && e.revert();
    }) || Ro();
  },
  addEventListener: function(e, n) {
    var r = Ls[e] || (Ls[e] = []);
    ~r.indexOf(n) || r.push(n);
  },
  removeEventListener: function(e, n) {
    var r = Ls[e], i = r && r.indexOf(n);
    i >= 0 && r.splice(i, 1);
  },
  utils: {
    wrap: f1,
    wrapYoyo: h1,
    distribute: Xp,
    random: Zp,
    snap: Jp,
    normalize: d1,
    getUnit: je,
    clamp: l1,
    splitColor: im,
    toArray: ft,
    selector: bo,
    mapRange: tm,
    pipe: u1,
    unitize: c1,
    interpolate: p1,
    shuffle: qp
  },
  install: zp,
  effects: vl,
  ticker: qe,
  updateRoot: Ie.updateRoot,
  plugins: Qe,
  globalTimeline: ie,
  core: {
    PropTween: $e,
    globals: Fp,
    Tween: he,
    Timeline: Ie,
    Animation: Fi,
    getCache: Un,
    _removeLinkedListItem: Ma,
    reverting: function() {
      return ke;
    },
    context: function(e) {
      return e && ee && (ee.data.push(e), e._ctx = ee), ee;
    },
    suppressOverwrites: function(e) {
      return Bu = e;
    }
  }
};
Ve("to,from,fromTo,delayedCall,set,killTweensOf", function(t) {
  return ca[t] = he[t];
});
qe.add(Ie.updateRoot);
vr = ca.to({}, {
  duration: 0
});
var M1 = function(e, n) {
  for (var r = e._pt; r && r.p !== n && r.op !== n && r.fp !== n; )
    r = r._next;
  return r;
}, O1 = function(e, n) {
  var r = e._targets, i, s, a;
  for (i in n)
    for (s = r.length; s--; )
      a = e._ptLookup[s][i], a && (a = a.d) && (a._pt && (a = M1(a, i)), a && a.modifier && a.modifier(n[i], e, r[s], i));
}, xl = function(e, n) {
  return {
    name: e,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(i, s, a) {
      a._onInit = function(l) {
        var o, u;
        if (we(s) && (o = {}, Ve(s, function(c) {
          return o[c] = 1;
        }), s = o), n) {
          o = {};
          for (u in s)
            o[u] = n(s[u]);
          s = o;
        }
        O1(l, s);
      };
    }
  };
}, Ge = ca.registerPlugin({
  name: "attr",
  init: function(e, n, r, i, s) {
    var a, l, o;
    this.tween = r;
    for (a in n)
      o = e.getAttribute(a) || "", l = this.add(e, "setAttribute", (o || 0) + "", n[a], i, s, 0, 0, a), l.op = a, l.b = o, this._props.push(a);
  },
  render: function(e, n) {
    for (var r = n._pt; r; )
      ke ? r.set(r.t, r.p, r.b, r) : r.r(e, r.d), r = r._next;
  }
}, {
  name: "endArray",
  headless: 1,
  init: function(e, n) {
    for (var r = n.length; r--; )
      this.add(e, r, e[r] || 0, n[r], 0, 0, 0, 0, 0, 1);
  }
}, xl("roundProps", Lo), xl("modifiers"), xl("snap", Jp)) || ca;
he.version = Ie.version = Ge.version = "3.14.2";
Dp = 1;
Hu() && zr();
V.Power0;
V.Power1;
V.Power2;
V.Power3;
V.Power4;
V.Linear;
V.Quad;
V.Cubic;
V.Quart;
V.Quint;
V.Strong;
V.Elastic;
V.Back;
V.SteppedEase;
V.Bounce;
V.Sine;
V.Expo;
V.Circ;
/*!
 * CSSPlugin 3.14.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var Vd, nn, Cr, ec, Dn, $d, tc, D1 = function() {
  return typeof window < "u";
}, $t = {}, In = 180 / Math.PI, Tr = Math.PI / 180, nr = Math.atan2, Wd = 1e8, nc = /([A-Z])/g, z1 = /(left|right|width|margin|padding|x)/i, F1 = /[\s,\(]\S/, jt = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, Mo = function(e, n) {
  return n.set(n.t, n.p, Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u, n);
}, B1 = function(e, n) {
  return n.set(n.t, n.p, e === 1 ? n.e : Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u, n);
}, U1 = function(e, n) {
  return n.set(n.t, n.p, e ? Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u : n.b, n);
}, H1 = function(e, n) {
  return n.set(n.t, n.p, e === 1 ? n.e : e ? Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u : n.b, n);
}, V1 = function(e, n) {
  var r = n.s + n.c * e;
  n.set(n.t, n.p, ~~(r + (r < 0 ? -0.5 : 0.5)) + n.u, n);
}, _m = function(e, n) {
  return n.set(n.t, n.p, e ? n.e : n.b, n);
}, wm = function(e, n) {
  return n.set(n.t, n.p, e !== 1 ? n.b : n.e, n);
}, $1 = function(e, n, r) {
  return e.style[n] = r;
}, W1 = function(e, n, r) {
  return e.style.setProperty(n, r);
}, G1 = function(e, n, r) {
  return e._gsap[n] = r;
}, K1 = function(e, n, r) {
  return e._gsap.scaleX = e._gsap.scaleY = r;
}, Y1 = function(e, n, r, i, s) {
  var a = e._gsap;
  a.scaleX = a.scaleY = r, a.renderTransform(s, a);
}, Q1 = function(e, n, r, i, s) {
  var a = e._gsap;
  a[n] = r, a.renderTransform(s, a);
}, se = "transform", We = se + "Origin", q1 = function t(e, n) {
  var r = this, i = this.target, s = i.style, a = i._gsap;
  if (e in $t && s) {
    if (this.tfm = this.tfm || {}, e !== "transform")
      e = jt[e] || e, ~e.indexOf(",") ? e.split(",").forEach(function(l) {
        return r.tfm[l] = Mt(i, l);
      }) : this.tfm[e] = a.x ? a[e] : Mt(i, e), e === We && (this.tfm.zOrigin = a.zOrigin);
    else
      return jt.transform.split(",").forEach(function(l) {
        return t.call(r, l, n);
      });
    if (this.props.indexOf(se) >= 0)
      return;
    a.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(We, n, "")), e = se;
  }
  (s || n) && this.props.push(e, n, s[e]);
}, Sm = function(e) {
  e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
}, X1 = function() {
  var e = this.props, n = this.target, r = n.style, i = n._gsap, s, a;
  for (s = 0; s < e.length; s += 3)
    e[s + 1] ? e[s + 1] === 2 ? n[e[s]](e[s + 2]) : n[e[s]] = e[s + 2] : e[s + 2] ? r[e[s]] = e[s + 2] : r.removeProperty(e[s].substr(0, 2) === "--" ? e[s] : e[s].replace(nc, "-$1").toLowerCase());
  if (this.tfm) {
    for (a in this.tfm)
      i[a] = this.tfm[a];
    i.svg && (i.renderTransform(), n.setAttribute("data-svg-origin", this.svgo || "")), s = tc(), (!s || !s.isStart) && !r[se] && (Sm(r), i.zOrigin && r[We] && (r[We] += " " + i.zOrigin + "px", i.zOrigin = 0, i.renderTransform()), i.uncache = 1);
  }
}, xm = function(e, n) {
  var r = {
    target: e,
    props: [],
    revert: X1,
    save: q1
  };
  return e._gsap || Ge.core.getCache(e), n && e.style && e.nodeType && n.split(",").forEach(function(i) {
    return r.save(i);
  }), r;
}, km, Oo = function(e, n) {
  var r = nn.createElementNS ? nn.createElementNS((n || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : nn.createElement(e);
  return r && r.style ? r : nn.createElement(e);
}, Ze = function t(e, n, r) {
  var i = getComputedStyle(e);
  return i[n] || i.getPropertyValue(n.replace(nc, "-$1").toLowerCase()) || i.getPropertyValue(n) || !r && t(e, Fr(n) || n, 1) || "";
}, Gd = "O,Moz,ms,Ms,Webkit".split(","), Fr = function(e, n, r) {
  var i = n || Dn, s = i.style, a = 5;
  if (e in s && !r)
    return e;
  for (e = e.charAt(0).toUpperCase() + e.substr(1); a-- && !(Gd[a] + e in s); )
    ;
  return a < 0 ? null : (a === 3 ? "ms" : a >= 0 ? Gd[a] : "") + e;
}, Do = function() {
  D1() && window.document && (Vd = window, nn = Vd.document, Cr = nn.documentElement, Dn = Oo("div") || {
    style: {}
  }, Oo("div"), se = Fr(se), We = se + "Origin", Dn.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", km = !!Fr("perspective"), tc = Ge.core.reverting, ec = 1);
}, Kd = function(e) {
  var n = e.ownerSVGElement, r = Oo("svg", n && n.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = e.cloneNode(!0), s;
  i.style.display = "block", r.appendChild(i), Cr.appendChild(r);
  try {
    s = i.getBBox();
  } catch {
  }
  return r.removeChild(i), Cr.removeChild(r), s;
}, Yd = function(e, n) {
  for (var r = n.length; r--; )
    if (e.hasAttribute(n[r]))
      return e.getAttribute(n[r]);
}, Em = function(e) {
  var n, r;
  try {
    n = e.getBBox();
  } catch {
    n = Kd(e), r = 1;
  }
  return n && (n.width || n.height) || r || (n = Kd(e)), n && !n.width && !n.x && !n.y ? {
    x: +Yd(e, ["x", "cx", "x1"]) || 0,
    y: +Yd(e, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : n;
}, Cm = function(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && Em(e));
}, _n = function(e, n) {
  if (n) {
    var r = e.style, i;
    n in $t && n !== We && (n = se), r.removeProperty ? (i = n.substr(0, 2), (i === "ms" || n.substr(0, 6) === "webkit") && (n = "-" + n), r.removeProperty(i === "--" ? n : n.replace(nc, "-$1").toLowerCase())) : r.removeAttribute(n);
  }
}, rn = function(e, n, r, i, s, a) {
  var l = new $e(e._pt, n, r, 0, 1, a ? wm : _m);
  return e._pt = l, l.b = i, l.e = s, e._props.push(r), l;
}, Qd = {
  deg: 1,
  rad: 1,
  turn: 1
}, J1 = {
  grid: 1,
  flex: 1
}, wn = function t(e, n, r, i) {
  var s = parseFloat(r) || 0, a = (r + "").trim().substr((s + "").length) || "px", l = Dn.style, o = z1.test(n), u = e.tagName.toLowerCase() === "svg", c = (u ? "client" : "offset") + (o ? "Width" : "Height"), f = 100, p = i === "px", y = i === "%", _, g, x, m;
  if (i === a || !s || Qd[i] || Qd[a])
    return s;
  if (a !== "px" && !p && (s = t(e, n, r, "px")), m = e.getCTM && Cm(e), (y || a === "%") && ($t[n] || ~n.indexOf("adius")))
    return _ = m ? e.getBBox()[o ? "width" : "height"] : e[c], de(y ? s / _ * f : s / 100 * _);
  if (l[o ? "width" : "height"] = f + (p ? a : i), g = i !== "rem" && ~n.indexOf("adius") || i === "em" && e.appendChild && !u ? e : e.parentNode, m && (g = (e.ownerSVGElement || {}).parentNode), (!g || g === nn || !g.appendChild) && (g = nn.body), x = g._gsap, x && y && x.width && o && x.time === qe.time && !x.uncache)
    return de(s / x.width * f);
  if (y && (n === "height" || n === "width")) {
    var h = e.style[n];
    e.style[n] = f + i, _ = e[c], h ? e.style[n] = h : _n(e, n);
  } else
    (y || a === "%") && !J1[Ze(g, "display")] && (l.position = Ze(e, "position")), g === e && (l.position = "static"), g.appendChild(Dn), _ = Dn[c], g.removeChild(Dn), l.position = "absolute";
  return o && y && (x = Un(g), x.time = qe.time, x.width = g[c]), de(p ? _ * s / f : _ && s ? f / _ * s : 0);
}, Mt = function(e, n, r, i) {
  var s;
  return ec || Do(), n in jt && n !== "transform" && (n = jt[n], ~n.indexOf(",") && (n = n.split(",")[0])), $t[n] && n !== "transform" ? (s = Ui(e, i), s = n !== "transformOrigin" ? s[n] : s.svg ? s.origin : fa(Ze(e, We)) + " " + s.zOrigin + "px") : (s = e.style[n], (!s || s === "auto" || i || ~(s + "").indexOf("calc(")) && (s = da[n] && da[n](e, n, r) || Ze(e, n) || Up(e, n) || (n === "opacity" ? 1 : 0))), r && !~(s + "").trim().indexOf(" ") ? wn(e, n, s, r) + r : s;
}, Z1 = function(e, n, r, i) {
  if (!r || r === "none") {
    var s = Fr(n, e, 1), a = s && Ze(e, s, 1);
    a && a !== r ? (n = s, r = a) : n === "borderColor" && (r = Ze(e, "borderTopColor"));
  }
  var l = new $e(this._pt, e.style, n, 0, 1, gm), o = 0, u = 0, c, f, p, y, _, g, x, m, h, v, w, S;
  if (l.b = r, l.e = i, r += "", i += "", i.substring(0, 6) === "var(--" && (i = Ze(e, i.substring(4, i.indexOf(")")))), i === "auto" && (g = e.style[n], e.style[n] = i, i = Ze(e, n) || i, g ? e.style[n] = g : _n(e, n)), c = [r, i], am(c), r = c[0], i = c[1], p = r.match(gr) || [], S = i.match(gr) || [], S.length) {
    for (; f = gr.exec(i); )
      x = f[0], h = i.substring(o, f.index), _ ? _ = (_ + 1) % 5 : (h.substr(-5) === "rgba(" || h.substr(-5) === "hsla(") && (_ = 1), x !== (g = p[u++] || "") && (y = parseFloat(g) || 0, w = g.substr((y + "").length), x.charAt(1) === "=" && (x = Er(y, x) + w), m = parseFloat(x), v = x.substr((m + "").length), o = gr.lastIndex - v.length, v || (v = v || tt.units[n] || w, o === i.length && (i += v, l.e += v)), w !== v && (y = wn(e, n, g, v) || 0), l._pt = {
        _next: l._pt,
        p: h || u === 1 ? h : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: y,
        c: m - y,
        m: _ && _ < 4 || n === "zIndex" ? Math.round : 0
      });
    l.c = o < i.length ? i.substring(o, i.length) : "";
  } else
    l.r = n === "display" && i === "none" ? wm : _m;
  return Op.test(i) && (l.e = 0), this._pt = l, l;
}, qd = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, ew = function(e) {
  var n = e.split(" "), r = n[0], i = n[1] || "50%";
  return (r === "top" || r === "bottom" || i === "left" || i === "right") && (e = r, r = i, i = e), n[0] = qd[r] || r, n[1] = qd[i] || i, n.join(" ");
}, tw = function(e, n) {
  if (n.tween && n.tween._time === n.tween._dur) {
    var r = n.t, i = r.style, s = n.u, a = r._gsap, l, o, u;
    if (s === "all" || s === !0)
      i.cssText = "", o = 1;
    else
      for (s = s.split(","), u = s.length; --u > -1; )
        l = s[u], $t[l] && (o = 1, l = l === "transformOrigin" ? We : se), _n(r, l);
    o && (_n(r, se), a && (a.svg && r.removeAttribute("transform"), i.scale = i.rotate = i.translate = "none", Ui(r, 1), a.uncache = 1, Sm(i)));
  }
}, da = {
  clearProps: function(e, n, r, i, s) {
    if (s.data !== "isFromStart") {
      var a = e._pt = new $e(e._pt, n, r, 0, 0, tw);
      return a.u = i, a.pr = -10, a.tween = s, e._props.push(r), 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, Bi = [1, 0, 0, 1, 0, 0], Tm = {}, Nm = function(e) {
  return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
}, Xd = function(e) {
  var n = Ze(e, se);
  return Nm(n) ? Bi : n.substr(7).match(Mp).map(de);
}, rc = function(e, n) {
  var r = e._gsap || Un(e), i = e.style, s = Xd(e), a, l, o, u;
  return r.svg && e.getAttribute("transform") ? (o = e.transform.baseVal.consolidate().matrix, s = [o.a, o.b, o.c, o.d, o.e, o.f], s.join(",") === "1,0,0,1,0,0" ? Bi : s) : (s === Bi && !e.offsetParent && e !== Cr && !r.svg && (o = i.display, i.display = "block", a = e.parentNode, (!a || !e.offsetParent && !e.getBoundingClientRect().width) && (u = 1, l = e.nextElementSibling, Cr.appendChild(e)), s = Xd(e), o ? i.display = o : _n(e, "display"), u && (l ? a.insertBefore(e, l) : a ? a.appendChild(e) : Cr.removeChild(e))), n && s.length > 6 ? [s[0], s[1], s[4], s[5], s[12], s[13]] : s);
}, zo = function(e, n, r, i, s, a) {
  var l = e._gsap, o = s || rc(e, !0), u = l.xOrigin || 0, c = l.yOrigin || 0, f = l.xOffset || 0, p = l.yOffset || 0, y = o[0], _ = o[1], g = o[2], x = o[3], m = o[4], h = o[5], v = n.split(" "), w = parseFloat(v[0]) || 0, S = parseFloat(v[1]) || 0, E, k, C, T;
  r ? o !== Bi && (k = y * x - _ * g) && (C = w * (x / k) + S * (-g / k) + (g * h - x * m) / k, T = w * (-_ / k) + S * (y / k) - (y * h - _ * m) / k, w = C, S = T) : (E = Em(e), w = E.x + (~v[0].indexOf("%") ? w / 100 * E.width : w), S = E.y + (~(v[1] || v[0]).indexOf("%") ? S / 100 * E.height : S)), i || i !== !1 && l.smooth ? (m = w - u, h = S - c, l.xOffset = f + (m * y + h * g) - m, l.yOffset = p + (m * _ + h * x) - h) : l.xOffset = l.yOffset = 0, l.xOrigin = w, l.yOrigin = S, l.smooth = !!i, l.origin = n, l.originIsAbsolute = !!r, e.style[We] = "0px 0px", a && (rn(a, l, "xOrigin", u, w), rn(a, l, "yOrigin", c, S), rn(a, l, "xOffset", f, l.xOffset), rn(a, l, "yOffset", p, l.yOffset)), e.setAttribute("data-svg-origin", w + " " + S);
}, Ui = function(e, n) {
  var r = e._gsap || new cm(e);
  if ("x" in r && !n && !r.uncache)
    return r;
  var i = e.style, s = r.scaleX < 0, a = "px", l = "deg", o = getComputedStyle(e), u = Ze(e, We) || "0", c, f, p, y, _, g, x, m, h, v, w, S, E, k, C, T, b, O, U, H, J, W, A, M, N, L, R, D, F, te, z, oe;
  return c = f = p = g = x = m = h = v = w = 0, y = _ = 1, r.svg = !!(e.getCTM && Cm(e)), o.translate && ((o.translate !== "none" || o.scale !== "none" || o.rotate !== "none") && (i[se] = (o.translate !== "none" ? "translate3d(" + (o.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (o.rotate !== "none" ? "rotate(" + o.rotate + ") " : "") + (o.scale !== "none" ? "scale(" + o.scale.split(" ").join(",") + ") " : "") + (o[se] !== "none" ? o[se] : "")), i.scale = i.rotate = i.translate = "none"), k = rc(e, r.svg), r.svg && (r.uncache ? (N = e.getBBox(), u = r.xOrigin - N.x + "px " + (r.yOrigin - N.y) + "px", M = "") : M = !n && e.getAttribute("data-svg-origin"), zo(e, M || u, !!M || r.originIsAbsolute, r.smooth !== !1, k)), S = r.xOrigin || 0, E = r.yOrigin || 0, k !== Bi && (O = k[0], U = k[1], H = k[2], J = k[3], c = W = k[4], f = A = k[5], k.length === 6 ? (y = Math.sqrt(O * O + U * U), _ = Math.sqrt(J * J + H * H), g = O || U ? nr(U, O) * In : 0, h = H || J ? nr(H, J) * In + g : 0, h && (_ *= Math.abs(Math.cos(h * Tr))), r.svg && (c -= S - (S * O + E * H), f -= E - (S * U + E * J))) : (oe = k[6], te = k[7], R = k[8], D = k[9], F = k[10], z = k[11], c = k[12], f = k[13], p = k[14], C = nr(oe, F), x = C * In, C && (T = Math.cos(-C), b = Math.sin(-C), M = W * T + R * b, N = A * T + D * b, L = oe * T + F * b, R = W * -b + R * T, D = A * -b + D * T, F = oe * -b + F * T, z = te * -b + z * T, W = M, A = N, oe = L), C = nr(-H, F), m = C * In, C && (T = Math.cos(-C), b = Math.sin(-C), M = O * T - R * b, N = U * T - D * b, L = H * T - F * b, z = J * b + z * T, O = M, U = N, H = L), C = nr(U, O), g = C * In, C && (T = Math.cos(C), b = Math.sin(C), M = O * T + U * b, N = W * T + A * b, U = U * T - O * b, A = A * T - W * b, O = M, W = N), x && Math.abs(x) + Math.abs(g) > 359.9 && (x = g = 0, m = 180 - m), y = de(Math.sqrt(O * O + U * U + H * H)), _ = de(Math.sqrt(A * A + oe * oe)), C = nr(W, A), h = Math.abs(C) > 2e-4 ? C * In : 0, w = z ? 1 / (z < 0 ? -z : z) : 0), r.svg && (M = e.getAttribute("transform"), r.forceCSS = e.setAttribute("transform", "") || !Nm(Ze(e, se)), M && e.setAttribute("transform", M))), Math.abs(h) > 90 && Math.abs(h) < 270 && (s ? (y *= -1, h += g <= 0 ? 180 : -180, g += g <= 0 ? 180 : -180) : (_ *= -1, h += h <= 0 ? 180 : -180)), n = n || r.uncache, r.x = c - ((r.xPercent = c && (!n && r.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? e.offsetWidth * r.xPercent / 100 : 0) + a, r.y = f - ((r.yPercent = f && (!n && r.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-f) ? -50 : 0))) ? e.offsetHeight * r.yPercent / 100 : 0) + a, r.z = p + a, r.scaleX = de(y), r.scaleY = de(_), r.rotation = de(g) + l, r.rotationX = de(x) + l, r.rotationY = de(m) + l, r.skewX = h + l, r.skewY = v + l, r.transformPerspective = w + a, (r.zOrigin = parseFloat(u.split(" ")[2]) || !n && r.zOrigin || 0) && (i[We] = fa(u)), r.xOffset = r.yOffset = 0, r.force3D = tt.force3D, r.renderTransform = r.svg ? rw : km ? jm : nw, r.uncache = 0, r;
}, fa = function(e) {
  return (e = e.split(" "))[0] + " " + e[1];
}, kl = function(e, n, r) {
  var i = je(n);
  return de(parseFloat(n) + parseFloat(wn(e, "x", r + "px", i))) + i;
}, nw = function(e, n) {
  n.z = "0px", n.rotationY = n.rotationX = "0deg", n.force3D = 0, jm(e, n);
}, jn = "0deg", Zr = "0px", Pn = ") ", jm = function(e, n) {
  var r = n || this, i = r.xPercent, s = r.yPercent, a = r.x, l = r.y, o = r.z, u = r.rotation, c = r.rotationY, f = r.rotationX, p = r.skewX, y = r.skewY, _ = r.scaleX, g = r.scaleY, x = r.transformPerspective, m = r.force3D, h = r.target, v = r.zOrigin, w = "", S = m === "auto" && e && e !== 1 || m === !0;
  if (v && (f !== jn || c !== jn)) {
    var E = parseFloat(c) * Tr, k = Math.sin(E), C = Math.cos(E), T;
    E = parseFloat(f) * Tr, T = Math.cos(E), a = kl(h, a, k * T * -v), l = kl(h, l, -Math.sin(E) * -v), o = kl(h, o, C * T * -v + v);
  }
  x !== Zr && (w += "perspective(" + x + Pn), (i || s) && (w += "translate(" + i + "%, " + s + "%) "), (S || a !== Zr || l !== Zr || o !== Zr) && (w += o !== Zr || S ? "translate3d(" + a + ", " + l + ", " + o + ") " : "translate(" + a + ", " + l + Pn), u !== jn && (w += "rotate(" + u + Pn), c !== jn && (w += "rotateY(" + c + Pn), f !== jn && (w += "rotateX(" + f + Pn), (p !== jn || y !== jn) && (w += "skew(" + p + ", " + y + Pn), (_ !== 1 || g !== 1) && (w += "scale(" + _ + ", " + g + Pn), h.style[se] = w || "translate(0, 0)";
}, rw = function(e, n) {
  var r = n || this, i = r.xPercent, s = r.yPercent, a = r.x, l = r.y, o = r.rotation, u = r.skewX, c = r.skewY, f = r.scaleX, p = r.scaleY, y = r.target, _ = r.xOrigin, g = r.yOrigin, x = r.xOffset, m = r.yOffset, h = r.forceCSS, v = parseFloat(a), w = parseFloat(l), S, E, k, C, T;
  o = parseFloat(o), u = parseFloat(u), c = parseFloat(c), c && (c = parseFloat(c), u += c, o += c), o || u ? (o *= Tr, u *= Tr, S = Math.cos(o) * f, E = Math.sin(o) * f, k = Math.sin(o - u) * -p, C = Math.cos(o - u) * p, u && (c *= Tr, T = Math.tan(u - c), T = Math.sqrt(1 + T * T), k *= T, C *= T, c && (T = Math.tan(c), T = Math.sqrt(1 + T * T), S *= T, E *= T)), S = de(S), E = de(E), k = de(k), C = de(C)) : (S = f, C = p, E = k = 0), (v && !~(a + "").indexOf("px") || w && !~(l + "").indexOf("px")) && (v = wn(y, "x", a, "px"), w = wn(y, "y", l, "px")), (_ || g || x || m) && (v = de(v + _ - (_ * S + g * k) + x), w = de(w + g - (_ * E + g * C) + m)), (i || s) && (T = y.getBBox(), v = de(v + i / 100 * T.width), w = de(w + s / 100 * T.height)), T = "matrix(" + S + "," + E + "," + k + "," + C + "," + v + "," + w + ")", y.setAttribute("transform", T), h && (y.style[se] = T);
}, iw = function(e, n, r, i, s) {
  var a = 360, l = we(s), o = parseFloat(s) * (l && ~s.indexOf("rad") ? In : 1), u = o - i, c = i + u + "deg", f, p;
  return l && (f = s.split("_")[1], f === "short" && (u %= a, u !== u % (a / 2) && (u += u < 0 ? a : -a)), f === "cw" && u < 0 ? u = (u + a * Wd) % a - ~~(u / a) * a : f === "ccw" && u > 0 && (u = (u - a * Wd) % a - ~~(u / a) * a)), e._pt = p = new $e(e._pt, n, r, i, u, B1), p.e = c, p.u = "deg", e._props.push(r), p;
}, Jd = function(e, n) {
  for (var r in n)
    e[r] = n[r];
  return e;
}, sw = function(e, n, r) {
  var i = Jd({}, r._gsap), s = "perspective,force3D,transformOrigin,svgOrigin", a = r.style, l, o, u, c, f, p, y, _;
  i.svg ? (u = r.getAttribute("transform"), r.setAttribute("transform", ""), a[se] = n, l = Ui(r, 1), _n(r, se), r.setAttribute("transform", u)) : (u = getComputedStyle(r)[se], a[se] = n, l = Ui(r, 1), a[se] = u);
  for (o in $t)
    u = i[o], c = l[o], u !== c && s.indexOf(o) < 0 && (y = je(u), _ = je(c), f = y !== _ ? wn(r, o, u, _) : parseFloat(u), p = parseFloat(c), e._pt = new $e(e._pt, l, o, f, p - f, Mo), e._pt.u = _ || 0, e._props.push(o));
  Jd(l, i);
};
Ve("padding,margin,Width,Radius", function(t, e) {
  var n = "Top", r = "Right", i = "Bottom", s = "Left", a = (e < 3 ? [n, r, i, s] : [n + s, n + r, i + r, i + s]).map(function(l) {
    return e < 2 ? t + l : "border" + l + t;
  });
  da[e > 1 ? "border" + t : t] = function(l, o, u, c, f) {
    var p, y;
    if (arguments.length < 4)
      return p = a.map(function(_) {
        return Mt(l, _, u);
      }), y = p.join(" "), y.split(p[0]).length === 5 ? p[0] : y;
    p = (c + "").split(" "), y = {}, a.forEach(function(_, g) {
      return y[_] = p[g] = p[g] || p[(g - 1) / 2 | 0];
    }), l.init(o, y, f);
  };
});
var Pm = {
  name: "css",
  register: Do,
  targetTest: function(e) {
    return e.style && e.nodeType;
  },
  init: function(e, n, r, i, s) {
    var a = this._props, l = e.style, o = r.vars.startAt, u, c, f, p, y, _, g, x, m, h, v, w, S, E, k, C, T;
    ec || Do(), this.styles = this.styles || xm(e), C = this.styles.props, this.tween = r;
    for (g in n)
      if (g !== "autoRound" && (c = n[g], !(Qe[g] && dm(g, n, r, i, e, s)))) {
        if (y = typeof c, _ = da[g], y === "function" && (c = c.call(r, i, e, s), y = typeof c), y === "string" && ~c.indexOf("random(") && (c = Di(c)), _)
          _(this, e, g, c, r) && (k = 1);
        else if (g.substr(0, 2) === "--")
          u = (getComputedStyle(e).getPropertyValue(g) + "").trim(), c += "", mn.lastIndex = 0, mn.test(u) || (x = je(u), m = je(c), m ? x !== m && (u = wn(e, g, u, m) + m) : x && (c += x)), this.add(l, "setProperty", u, c, i, s, 0, 0, g), a.push(g), C.push(g, 0, l[g]);
        else if (y !== "undefined") {
          if (o && g in o ? (u = typeof o[g] == "function" ? o[g].call(r, i, e, s) : o[g], we(u) && ~u.indexOf("random(") && (u = Di(u)), je(u + "") || u === "auto" || (u += tt.units[g] || je(Mt(e, g)) || ""), (u + "").charAt(1) === "=" && (u = Mt(e, g))) : u = Mt(e, g), p = parseFloat(u), h = y === "string" && c.charAt(1) === "=" && c.substr(0, 2), h && (c = c.substr(2)), f = parseFloat(c), g in jt && (g === "autoAlpha" && (p === 1 && Mt(e, "visibility") === "hidden" && f && (p = 0), C.push("visibility", 0, l.visibility), rn(this, l, "visibility", p ? "inherit" : "hidden", f ? "inherit" : "hidden", !f)), g !== "scale" && g !== "transform" && (g = jt[g], ~g.indexOf(",") && (g = g.split(",")[0]))), v = g in $t, v) {
            if (this.styles.save(g), T = c, y === "string" && c.substring(0, 6) === "var(--") {
              if (c = Ze(e, c.substring(4, c.indexOf(")"))), c.substring(0, 5) === "calc(") {
                var b = e.style.perspective;
                e.style.perspective = c, c = Ze(e, "perspective"), b ? e.style.perspective = b : _n(e, "perspective");
              }
              f = parseFloat(c);
            }
            if (w || (S = e._gsap, S.renderTransform && !n.parseTransform || Ui(e, n.parseTransform), E = n.smoothOrigin !== !1 && S.smooth, w = this._pt = new $e(this._pt, l, se, 0, 1, S.renderTransform, S, 0, -1), w.dep = 1), g === "scale")
              this._pt = new $e(this._pt, S, "scaleY", S.scaleY, (h ? Er(S.scaleY, h + f) : f) - S.scaleY || 0, Mo), this._pt.u = 0, a.push("scaleY", g), g += "X";
            else if (g === "transformOrigin") {
              C.push(We, 0, l[We]), c = ew(c), S.svg ? zo(e, c, 0, E, 0, this) : (m = parseFloat(c.split(" ")[2]) || 0, m !== S.zOrigin && rn(this, S, "zOrigin", S.zOrigin, m), rn(this, l, g, fa(u), fa(c)));
              continue;
            } else if (g === "svgOrigin") {
              zo(e, c, 1, E, 0, this);
              continue;
            } else if (g in Tm) {
              iw(this, S, g, p, h ? Er(p, h + c) : c);
              continue;
            } else if (g === "smoothOrigin") {
              rn(this, S, "smooth", S.smooth, c);
              continue;
            } else if (g === "force3D") {
              S[g] = c;
              continue;
            } else if (g === "transform") {
              sw(this, c, e);
              continue;
            }
          } else g in l || (g = Fr(g) || g);
          if (v || (f || f === 0) && (p || p === 0) && !F1.test(c) && g in l)
            x = (u + "").substr((p + "").length), f || (f = 0), m = je(c) || (g in tt.units ? tt.units[g] : x), x !== m && (p = wn(e, g, u, m)), this._pt = new $e(this._pt, v ? S : l, g, p, (h ? Er(p, h + f) : f) - p, !v && (m === "px" || g === "zIndex") && n.autoRound !== !1 ? V1 : Mo), this._pt.u = m || 0, v && T !== c ? (this._pt.b = u, this._pt.e = T, this._pt.r = H1) : x !== m && m !== "%" && (this._pt.b = u, this._pt.r = U1);
          else if (g in l)
            Z1.call(this, e, g, u, h ? h + c : c);
          else if (g in e)
            this.add(e, g, u || e[g], h ? h + c : c, i, s);
          else if (g !== "parseTransform") {
            $u(g, c);
            continue;
          }
          v || (g in l ? C.push(g, 0, l[g]) : typeof e[g] == "function" ? C.push(g, 2, e[g]()) : C.push(g, 1, u || e[g])), a.push(g);
        }
      }
    k && vm(this);
  },
  render: function(e, n) {
    if (n.tween._time || !tc())
      for (var r = n._pt; r; )
        r.r(e, r.d), r = r._next;
    else
      n.styles.revert();
  },
  get: Mt,
  aliases: jt,
  getSetter: function(e, n, r) {
    var i = jt[n];
    return i && i.indexOf(",") < 0 && (n = i), n in $t && n !== We && (e._gsap.x || Mt(e, "x")) ? r && $d === r ? n === "scale" ? K1 : G1 : ($d = r || {}) && (n === "scale" ? Y1 : Q1) : e.style && !Uu(e.style[n]) ? $1 : ~n.indexOf("-") ? W1 : Ju(e, n);
  },
  core: {
    _removeProperty: _n,
    _getMatrix: rc
  }
};
Ge.utils.checkPrefix = Fr;
Ge.core.getStyleSaver = xm;
(function(t, e, n, r) {
  var i = Ve(t + "," + e + "," + n, function(s) {
    $t[s] = 1;
  });
  Ve(e, function(s) {
    tt.units[s] = "deg", Tm[s] = 1;
  }), jt[i[13]] = t + "," + e, Ve(r, function(s) {
    var a = s.split(":");
    jt[a[1]] = i[a[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Ve("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(t) {
  tt.units[t] = "px";
});
Ge.registerPlugin(Pm);
var qt = Ge.registerPlugin(Pm) || Ge;
qt.core.Tween;
/*!
 * @gsap/react 2.1.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
let Zd = typeof document < "u" ? P.useLayoutEffect : P.useEffect, ef = (t) => t && !Array.isArray(t) && typeof t == "object", vs = [], aw = {}, Am = qt;
const ic = (t, e = vs) => {
  let n = aw;
  ef(t) ? (n = t, t = null, e = "dependencies" in n ? n.dependencies : vs) : ef(e) && (n = e, e = "dependencies" in n ? n.dependencies : vs), t && typeof t != "function" && console.warn("First parameter must be a function or config object");
  const { scope: r, revertOnUpdate: i } = n, s = P.useRef(!1), a = P.useRef(Am.context(() => {
  }, r)), l = P.useRef((u) => a.current.add(null, u)), o = e && e.length && !i;
  return o && Zd(() => (s.current = !0, () => a.current.revert()), vs), Zd(() => {
    if (t && a.current.add(t, r), !o || !s.current)
      return () => a.current.revert();
  }, e), { context: a.current, contextSafe: l.current };
};
ic.register = (t) => {
  Am = t;
};
ic.headless = !0;
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lw = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), bm = (...t) => t.filter((e, n, r) => !!e && e.trim() !== "" && r.indexOf(e) === n).join(" ").trim();
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ow = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uw = P.forwardRef(
  ({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: r,
    className: i = "",
    children: s,
    iconNode: a,
    ...l
  }, o) => P.createElement(
    "svg",
    {
      ref: o,
      ...ow,
      width: e,
      height: e,
      stroke: t,
      strokeWidth: r ? Number(n) * 24 / Number(e) : n,
      className: bm("lucide", i),
      ...l
    },
    [
      ...a.map(([u, c]) => P.createElement(u, c)),
      ...Array.isArray(s) ? s : [s]
    ]
  )
);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const er = (t, e) => {
  const n = P.forwardRef(
    ({ className: r, ...i }, s) => P.createElement(uw, {
      ref: s,
      iconNode: e,
      className: bm(`lucide-${lw(t)}`, r),
      ...i
    })
  );
  return n.displayName = `${t}`, n;
};
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cw = er("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dw = er("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fw = er("HeartOff", [
  ["line", { x1: "2", y1: "2", x2: "22", y2: "22", key: "1w4vcy" }],
  [
    "path",
    { d: "M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35", key: "3mpagl" }
  ],
  [
    "path",
    {
      d: "M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17",
      key: "1gh3v3"
    }
  ]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hw = er("Heart", [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pw = er("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mw = er("MessageCircle", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gw = er("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]), rr = P.forwardRef(
  ({ id: t, className: e, label: n, icon: r, badgeCount: i, onClick: s, onMouseEnter: a, onMouseLeave: l }, o) => /* @__PURE__ */ d.jsxs(
    "div",
    {
      id: t,
      ref: o,
      className: `fab-card ${e}`,
      onClick: s,
      onMouseEnter: a,
      onMouseLeave: l,
      children: [
        /* @__PURE__ */ d.jsx(r, { className: "card-icon" }),
        /* @__PURE__ */ d.jsx("span", { className: "card-label", children: n }),
        i !== void 0 && i > 0 && /* @__PURE__ */ d.jsx("span", { className: "fab-badge", children: i })
      ]
    }
  )
);
rr.displayName = "ActionCard";
function vw({ isOpen: t, wishlist: e, onClose: n, onRemove: r }) {
  return /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    /* @__PURE__ */ d.jsx(
      "div",
      {
        className: `modal-overlay ${t ? "active" : ""}`,
        onClick: n
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: `wishlist-window ${t ? "is-active" : ""}`, children: [
      /* @__PURE__ */ d.jsxs("div", { className: "wishlist-header", children: [
        /* @__PURE__ */ d.jsx("h3", { children: "MY STAY PICK" }),
        /* @__PURE__ */ d.jsx("button", { className: "close-wishlist", onClick: n, children: "×" })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "wishlist-content", children: e.length === 0 ? /* @__PURE__ */ d.jsxs("div", { className: "wishlist-empty", children: [
        /* @__PURE__ */ d.jsx(fw, { size: 48, className: "text-slate-300 mb-4" }),
        /* @__PURE__ */ d.jsx("p", { children: "저장된 숙소가 없습니다." }),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: "btn-explore",
            onClick: n,
            children: "숙소 둘러보기"
          }
        )
      ] }) : e.map((i) => /* @__PURE__ */ d.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ d.jsx("img", { src: i.image, alt: i.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ d.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ d.jsx("span", { className: "wishlist-location", children: i.location }),
            /* @__PURE__ */ d.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => r(i.id),
                children: /* @__PURE__ */ d.jsx(gw, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ d.jsx("h4", { className: "wishlist-title", children: i.name }),
          /* @__PURE__ */ d.jsx("div", { className: "wishlist-price", children: i.price })
        ] })
      ] }, i.id)) })
    ] })
  ] });
}
function yw({ onClick: t, isOpen: e }) {
  return /* @__PURE__ */ d.jsxs("div", { className: "card-holder", onClick: t, children: [
    /* @__PURE__ */ d.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ d.jsx("div", { className: "fab-body" })
  ] });
}
function _w() {
  const t = P.useRef(null), [e, n] = P.useState(!1), [r, i] = P.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [s, a] = P.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [l, o] = P.useState(!1), [u, c] = P.useState(!1);
  P.useEffect(() => {
    const x = (m) => i(m.detail);
    return document.addEventListener("fabWishlistUpdated", x), () => document.removeEventListener("fabWishlistUpdated", x);
  }, []);
  const { contextSafe: f } = ic({ scope: t }), p = f(() => {
    if (u) return;
    c(!0), setTimeout(() => c(!1), 1600);
    const x = qt.timeline(), m = ".fab-card", h = ".card-holder";
    e ? (qt.set(m, { pointerEvents: "none" }), x.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(m, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), qt.to(h, { y: 0, opacity: 1, duration: 0.3 })) : (qt.set(m, { opacity: 1, pointerEvents: "auto", display: "flex" }), x.fromTo(
      m,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), qt.to(h, { y: 5, opacity: 0.9, duration: 0.3 })), n(!e);
  }), y = f((x, m) => {
    e && qt.to(x, {
      y: m ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), _ = () => {
    const x = s === "KRW" ? "USD" : "KRW";
    a(x), localStorage.setItem("jeju_fab_currency", x), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: x }));
  }, g = (x) => {
    const m = r.filter((h) => h.id !== x);
    i(m), localStorage.setItem("jeju_wishlist", JSON.stringify(m)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: m }));
  };
  return /* @__PURE__ */ d.jsxs("div", { ref: t, className: "original-fab-system", children: [
    /* @__PURE__ */ d.jsx(
      vw,
      {
        isOpen: l,
        wishlist: r,
        onClose: () => o(!1),
        onRemove: g
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ d.jsx(yw, { onClick: p, isOpen: e }),
      /* @__PURE__ */ d.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ d.jsx(
          rr,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: pw,
            onClick: () => window.location.href = "/",
            onMouseEnter: () => y(".card-0", !0),
            onMouseLeave: () => y(".card-0", !1)
          }
        ),
        /* @__PURE__ */ d.jsx(
          rr,
          {
            id: "fabTop",
            className: "card-1",
            label: "TOP",
            icon: cw,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            onMouseEnter: () => y(".card-1", !0),
            onMouseLeave: () => y(".card-1", !1)
          }
        ),
        /* @__PURE__ */ d.jsx(
          rr,
          {
            id: "fabCurrency",
            className: "card-2",
            label: s === "KRW" ? "KOR" : "ENG",
            icon: dw,
            onClick: _,
            onMouseEnter: () => y(".card-2", !0),
            onMouseLeave: () => y(".card-2", !1)
          }
        ),
        /* @__PURE__ */ d.jsx(
          rr,
          {
            id: "fabWishlist",
            className: "card-3",
            label: "PICK",
            icon: hw,
            badgeCount: r.length,
            onClick: () => o(!0),
            onMouseEnter: () => y(".card-3", !0),
            onMouseLeave: () => y(".card-3", !1)
          }
        ),
        /* @__PURE__ */ d.jsx(
          rr,
          {
            id: "fabChatbot",
            className: "card-4",
            label: "CHAT",
            icon: mw,
            onMouseEnter: () => y(".card-4", !0),
            onMouseLeave: () => y(".card-4", !1)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsx("style", { children: `
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
        .wishlist-window.is-active { display: flex; top: 50% !important; left: 50% !important; width: 400px !important; height: 500px !important; transform: translate(-50%, -50%) !important; border-radius: 20px; }
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
const ww = () => {
  try {
    const t = localStorage.getItem("jeju_wishlist") ?? "[]", e = JSON.parse(t);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}, Sw = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", xw = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", kw = () => ({
  currency: Sw(),
  language: xw(),
  wishlist: ww(),
  drawerOpen: !1,
  chatbotOpen: !1,
  weatherOpen: !1
}), El = (t, e) => typeof e == "boolean" ? e : !t, Ew = (t, e) => {
  switch (e.type) {
    case "SET_CURRENCY":
      return { ...t, currency: e.payload };
    case "SET_LANGUAGE":
      return { ...t, language: e.payload };
    case "SET_WISHLIST":
      return { ...t, wishlist: [...e.payload] };
    case "TOGGLE_DRAWER":
      return { ...t, drawerOpen: El(t.drawerOpen, e.payload) };
    case "TOGGLE_CHATBOT":
      return { ...t, chatbotOpen: El(t.chatbotOpen, e.payload) };
    case "TOGGLE_WEATHER":
      return { ...t, weatherOpen: El(t.weatherOpen, e.payload) };
    default:
      return t;
  }
}, Cw = P.createContext(null), Tw = ({ children: t }) => {
  const [e, n] = P.useReducer(Ew, void 0, kw), r = P.useMemo(
    () => ({
      state: e,
      dispatch: n
    }),
    [e]
  );
  return /* @__PURE__ */ d.jsx(Cw.Provider, { value: r, children: t });
};
let Cl = null;
const Nw = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", jw = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", Pw = () => {
  try {
    const t = localStorage.getItem("jeju_wishlist") ?? "[]", e = JSON.parse(t);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}, Tl = (t, e, n) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: t })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: n }));
}, Aw = () => {
  if (window.FABState)
    return;
  const t = {
    currency: Nw(),
    language: jw(),
    wishlist: Pw(),
    setCurrencyAndLang: (e, n) => {
      t.currency = e, t.language = n, localStorage.setItem("jeju_fab_currency", e), localStorage.setItem("jeju_fab_lang", n), Tl(e, n, t.wishlist);
    },
    addToWishlist: (e) => {
      const n = [...t.wishlist], r = Number(e.id), i = n.findIndex((s) => Number(s.id) === r);
      i === -1 ? n.push(e) : n.splice(i, 1), t.wishlist = n, localStorage.setItem("jeju_wishlist", JSON.stringify(n)), Tl(t.currency, t.language, n);
    },
    removeFromWishlist: (e) => {
      const n = t.wishlist.filter((r) => Number(r.id) !== e);
      t.wishlist = n, localStorage.setItem("jeju_wishlist", JSON.stringify(n)), Tl(t.currency, t.language, n);
    },
    isInWishlist: (e) => t.wishlist.some((n) => Number(n.id) === e)
  };
  window.FABState = t, document.addEventListener("fabCurrencyChanged", (e) => {
    const n = e;
    t.currency = n.detail === "USD" ? "USD" : "KRW";
  }), document.addEventListener("fabLanguageChanged", (e) => {
    const n = e;
    t.language = n.detail === "en" ? "en" : "ko";
  }), document.addEventListener("fabWishlistUpdated", (e) => {
    const n = e;
    t.wishlist = Array.isArray(n.detail) ? [...n.detail] : [];
  });
}, bw = () => {
  const t = "jeju-fab-root";
  let e = document.getElementById(t);
  e || (e = document.createElement("div"), e.id = t, document.body.appendChild(e)), Cl || (Cl = $r(e)), Cl.render(
    /* @__PURE__ */ d.jsx(Tw, { children: /* @__PURE__ */ d.jsx(_w, {}) })
  ), Aw();
}, Lw = (t) => t === "en" ? "Hello, I am your Jeju Group assistant" : "안녕 나는 제주그룹 안내 도우미", Iw = ({ isOpen: t, onOpen: e, onClose: n, language: r, onLanguageChange: i }) => {
  const [s, a] = P.useState([]), [l, o] = P.useState(""), [u, c] = P.useState(!1), f = P.useRef(null);
  P.useEffect(() => {
    const m = {
      id: Date.now(),
      type: "bot",
      content: Lw(r),
      timestamp: /* @__PURE__ */ new Date()
    };
    a([m]);
  }, []), P.useEffect(() => {
    const m = (h) => {
      const v = h;
      (v.detail === "ko" || v.detail === "en") && i(v.detail);
    };
    return document.addEventListener("fabLanguageChanged", m), () => {
      document.removeEventListener("fabLanguageChanged", m);
    };
  }, [i]), P.useEffect(() => {
    f.current && (f.current.scrollTop = f.current.scrollHeight);
  }, [s, t]);
  const p = P.useCallback((m, h) => {
    a((v) => [
      ...v,
      {
        id: Date.now() + v.length + 1,
        type: m,
        content: h,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), y = P.useMemo(
    () => s.map((m) => ({ role: m.type === "user" ? "user" : "assistant", content: m.content })),
    [s]
  ), _ = P.useCallback(async () => {
    var h, v, w;
    const m = l.trim();
    if (!(!m || u)) {
      p("user", m), o(""), c(!0);
      try {
        const S = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: r === "en" ? "You are Jeju Group assistant" : "너는 제주그룹 안내 도우미"
              },
              ...y,
              {
                role: "user",
                content: m
              }
            ]
          })
        });
        if (!S.ok)
          throw new Error(`Chat API failed: ${S.status}`);
        const E = await S.json(), k = ((w = (v = (h = E == null ? void 0 : E.choices) == null ? void 0 : h[0]) == null ? void 0 : v.message) == null ? void 0 : w.content) ?? "응답 처리 실패";
        p("bot", String(k));
      } catch (S) {
        p("bot", `오류 상태: ${S.message}`);
      } finally {
        c(!1);
      }
    }
  }, [p, y, l, r, u]), g = (m) => {
    m.preventDefault(), _().catch(() => {
    });
  }, x = (m) => {
    m.key === "Enter" && (m.preventDefault(), _().catch(() => {
    }));
  };
  return /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: `chatbot-toggle-btn ${t ? "hidden" : ""}`,
        "aria-label": r === "en" ? "Open chatbot" : "챗봇 열기",
        onClick: e,
        children: /* @__PURE__ */ d.jsx("i", { "data-lucide": "message-circle" })
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: `chatbot-container ${t ? "active" : ""}`, children: [
      /* @__PURE__ */ d.jsxs("div", { className: "chatbot-header", children: [
        /* @__PURE__ */ d.jsx("h3", { children: r === "en" ? "Jeju Chatbot" : "제주 챗봇" }),
        /* @__PURE__ */ d.jsx("button", { className: "chatbot-close-btn", onClick: n, children: "닫기" })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "chatbot-messages", ref: f, children: [
        s.map((m) => /* @__PURE__ */ d.jsxs("div", { className: `message ${m.type}`, children: [
          /* @__PURE__ */ d.jsx("div", { className: "message-bubble", children: m.content }),
          /* @__PURE__ */ d.jsx("div", { className: "message-time", children: m.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
        ] }, m.id)),
        u ? /* @__PURE__ */ d.jsx("div", { className: "message bot", children: /* @__PURE__ */ d.jsxs("div", { className: "typing-indicator", children: [
          /* @__PURE__ */ d.jsx("div", { className: "typing-dot" }),
          /* @__PURE__ */ d.jsx("div", { className: "typing-dot" }),
          /* @__PURE__ */ d.jsx("div", { className: "typing-dot" })
        ] }) }) : null
      ] }),
      /* @__PURE__ */ d.jsxs("form", { className: "chatbot-input-area", onSubmit: g, children: [
        /* @__PURE__ */ d.jsx(
          "input",
          {
            value: l,
            onChange: (m) => o(m.target.value),
            onKeyDown: x,
            placeholder: r === "en" ? "Type a message" : "메시지 입력"
          }
        ),
        /* @__PURE__ */ d.jsx("button", { type: "submit", disabled: u, children: r === "en" ? "Send" : "전송" })
      ] })
    ] })
  ] });
};
let Fo = null, An = null, zn = !1, Bo = localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
const sn = () => {
  Fo && Fo.render(
    /* @__PURE__ */ d.jsx(
      Iw,
      {
        isOpen: zn,
        onOpen: () => {
          zn = !0, sn();
        },
        onClose: () => {
          zn = !1, sn();
        },
        language: Bo,
        onLanguageChange: (t) => {
          Bo = t, localStorage.setItem("jeju_fab_lang", t), sn();
        }
      }
    )
  );
}, Rw = () => {
  An || (An = document.getElementById("jeju-chatbot-root"), An || (An = document.createElement("div"), An.id = "jeju-chatbot-root", document.body.appendChild(An)), Fo = $r(An), sn());
}, Mw = () => {
  Rw(), window.hotelChatbot = {
    openChatbot: () => {
      zn = !0, sn();
    },
    closeChatbot: () => {
      zn = !1, sn();
    },
    toggleChatbot: () => {
      zn = !zn, sn();
    },
    updateLanguage: (t) => {
      Bo = t, localStorage.setItem("jeju_fab_lang", t), sn();
    }
  };
};
let tf = !1;
const Ow = 37.5665, Dw = 126.978, Lm = (t, e = "small") => {
  const n = {
    "01": ["fa-sun", "#ffbd00"],
    "02": ["fa-cloud-sun", "#ffbd00"],
    "03": ["fa-cloud", "#cbd5e1"],
    "04": ["fa-cloud", "#94a3b8"],
    "09": ["fa-cloud-showers-heavy", "#60a5fa"],
    10: ["fa-cloud-rain", "#60a5fa"],
    11: ["fa-bolt", "#fde047"],
    13: ["fa-snowflake", "#99f6e4"],
    50: ["fa-smog", "#94a3b8"]
  }, r = t.slice(0, 2), [i, s] = n[r] ?? ["fa-cloud", "#cbd5e1"];
  return e === "large" ? `<i class="fa-solid ${i} weather-detail-icon-fa" style="color:${s};"></i>` : `<i class="fa-solid ${i}" style="color:${s};margin-right:4px;"></i>`;
}, zw = async (t, e) => {
  const n = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=current&lat=${t}&lon=${e}`);
  if (!n.ok)
    throw new Error(`weather fetch failed: ${n.status}`);
  return n.json();
}, nf = async (t, e) => {
  const n = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=pollution&lat=${t}&lon=${e}`);
  if (!n.ok)
    throw new Error(`pollution fetch failed: ${n.status}`);
  return n.json();
}, Fw = async () => new Promise((t, e) => {
  if (!navigator.geolocation) {
    e(new Error("geolocation unavailable"));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (n) => {
      t({
        lat: n.coords.latitude,
        lon: n.coords.longitude
      });
    },
    (n) => e(n)
  );
}), rf = (t, e) => {
  var i, s;
  const n = Math.round(e.main.temp), r = ((s = (i = e.weather) == null ? void 0 : i[0]) == null ? void 0 : s.icon) ?? "03d";
  t.innerHTML = `${Lm(r, "small")}<span>${n}°</span>`;
}, Nl = (t, e, n) => {
  var o, u, c, f, p, y, _, g, x, m, h;
  const r = ((c = (u = (o = n == null ? void 0 : n.list) == null ? void 0 : o[0]) == null ? void 0 : u.main) == null ? void 0 : c.aqi) ?? 1, i = {
    1: ["좋음", "good"],
    2: ["보통", "fair"],
    3: ["나쁨", "poor"],
    4: ["매우나쁨", "very-poor"],
    5: ["매우나쁨", "very-poor"]
  }, [s, a] = i[r] ?? ["정보없음", ""], l = Lm(((p = (f = e.weather) == null ? void 0 : f[0]) == null ? void 0 : p.icon) ?? "03d", "large");
  t.innerHTML = `
    <div class="weather-detail-main">
      <p class="weather-detail-city">${e.name ?? "도시"}</p>
      <div class="weather-detail-info">
        ${l}
        <h2 class="weather-detail-temp">${Math.round(((y = e.main) == null ? void 0 : y.temp) ?? 0)}°</h2>
        <p class="weather-detail-desc">${((g = (_ = e.weather) == null ? void 0 : _[0]) == null ? void 0 : g.description) ?? ""}</p>
      </div>
    </div>
    <div class="weather-detail-grid">
      <div class="weather-detail-item">
        <span class="item-label">체감온도</span>
        <span class="item-value">${Math.round(((x = e.main) == null ? void 0 : x.feels_like) ?? 0)}°</span>
      </div>
      <div class="weather-detail-item weather-detail-dust ${a}">
        <span class="item-label">미세먼지</span>
        <span class="item-value">${s}</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">습도</span>
        <span class="item-value">${((m = e.main) == null ? void 0 : m.humidity) ?? 0}%</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">풍속</span>
        <span class="item-value">${((h = e.wind) == null ? void 0 : h.speed) ?? 0}m/s</span>
      </div>
    </div>
  `;
}, Bw = () => {
  if (tf)
    return;
  const t = document.getElementById("weather-open-btn"), e = document.getElementById("weather-overlay"), n = document.getElementById("weather-close-btn"), r = document.getElementById("weather-detail-container"), i = document.getElementById("weather-search-input"), s = document.getElementById("weather-search-btn");
  if (!t || !e || !n || !r)
    return;
  let a = null, l = null;
  const o = async (f, p) => {
    const [y, _] = await Promise.all([zw(f, p), nf(f, p)]);
    a = y, l = _, rf(t, y), e.classList.contains("active") && Nl(r, y, _);
  };
  t.addEventListener("click", () => {
    e.classList.add("active"), a && l && Nl(r, a, l);
  }), n.addEventListener("click", () => {
    e.classList.remove("active");
  }), e.addEventListener("click", (f) => {
    f.target === e && e.classList.remove("active");
  });
  const u = async () => {
    const f = i == null ? void 0 : i.value.trim();
    if (f)
      try {
        const p = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=search&q=${encodeURIComponent(f)}`);
        if (!p.ok)
          throw new Error(`city weather failed: ${p.status}`);
        const y = await p.json(), _ = await nf(y.coord.lat, y.coord.lon);
        a = y, l = _, rf(t, y), Nl(r, y, _);
      } catch (p) {
        r.innerHTML = `<div class="weather-loading-large"><p>조회 실패: ${p.message}</p></div>`;
      }
  };
  s == null || s.addEventListener("click", () => {
    u().catch(() => {
    });
  }), i == null || i.addEventListener("keydown", (f) => {
    f.key === "Enter" && (f.preventDefault(), u().catch(() => {
    }));
  }), (async () => {
    try {
      const f = await Fw();
      await o(f.lat, f.lon);
    } catch {
      await o(Ow, Dw);
    }
  })().catch(() => {
  }), tf = !0;
}, Vw = async () => {
  Ke(), await _p();
}, $w = async () => {
  Ke(), await wp();
}, Ww = async () => (Ke(), B_()), Gw = () => {
  Ke(), Vi();
}, Kw = () => {
  Ke(), ha();
}, Yw = () => {
  Ke(), Uo();
}, Qw = () => {
  Ke(), pa();
}, qw = async () => {
  Ke(), await ba.open();
}, Xw = () => {
  Ke(), ba.close();
}, Jw = () => {
  Ke(), bw();
}, Zw = () => {
  Ke(), Mw();
}, eS = () => {
  Ke(), Bw();
}, tS = () => {
  Uy();
}, nS = () => {
  U_();
}, rS = () => {
  Hy();
}, iS = () => {
  e_();
}, sS = ba;
export {
  Xw as closeReservationDrawer,
  Hw as createRangeCalendarRuntime,
  Kw as ensureFooterBehavior,
  Gw as ensureHeaderBehavior,
  Yw as ensureMegaMenuBehavior,
  Qw as ensureStaggerNavBehavior,
  Ke as installLegacyGlobals,
  tS as mountAuthLoginRuntime,
  rS as mountAuthPassRuntime,
  nS as mountAuthSignupRuntime,
  $w as mountHotelShellRuntime,
  Vw as mountMainShellRuntime,
  iS as mountMyPageRuntime,
  Ww as mountPageShellBridgeRuntime,
  qw as openReservationDrawer,
  sS as runtimeReservationDrawer,
  Zw as setupLegacyChatbotRuntime,
  Jw as setupLegacyFabRuntime,
  eS as setupWeatherWidgetRuntime
};
