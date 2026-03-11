globalThis.process = globalThis.process || { env: { NODE_ENV: "production" } };
var process = globalThis.process;
var AM = Object.defineProperty;
var zM = (g, l, s) => l in g ? AM(g, l, { enumerable: !0, configurable: !0, writable: !0, value: s }) : g[l] = s;
var nf = (g, l, s) => zM(g, typeof l != "symbol" ? l + "" : l, s);
let Jx = !1;
const Zx = () => {
  const g = document.querySelector(".header");
  if (g) {
    if (window.scrollY > 20) {
      g.classList.add("scrolled");
      return;
    }
    g.classList.remove("scrolled");
  }
}, UM = () => {
  Jx || (Jx = !0, window.addEventListener("scroll", Zx), Zx());
}, jM = () => {
  document.querySelectorAll(".nav-item").forEach((l) => {
    if (l.dataset.megaHoverBound === "true")
      return;
    const s = l.querySelector(".mega-dropdown");
    s && (l.dataset.megaHoverBound = "true", l.addEventListener("mouseenter", () => {
      document.querySelectorAll(".mega-dropdown.active").forEach((f) => {
        f !== s && f.classList.remove("active");
      }), s.classList.add("active");
    }), l.addEventListener("mouseleave", () => {
      setTimeout(() => {
        l.matches(":hover") || s.classList.remove("active");
      }, 200);
    }));
  });
}, PM = () => {
  document.querySelectorAll(".mega-menu-item").forEach((l) => {
    l.dataset.previewHoverBound !== "true" && (l.dataset.previewHoverBound = "true", l.addEventListener("mouseenter", () => {
      const s = l.closest(".mega-dropdown"), f = l.getAttribute("data-preview"), p = f ? document.getElementById(f) : null;
      if (!s || !p)
        return;
      s.querySelectorAll(".preview-image").forEach((h) => {
        h.classList.remove("active");
      }), p.classList.add("active");
      const y = s.querySelector(".preview-loader");
      y && (y.style.display = "none");
    }));
  });
}, FM = () => {
  document.querySelectorAll(".mega-dropdown").forEach((g) => {
    if (g.dataset.previewInit === "true")
      return;
    g.dataset.previewInit = "true";
    const l = g.querySelector(".preview-image");
    l && l.classList.add("active");
  });
}, KE = () => {
  UM(), jM(), PM(), FM();
};
let eT = !1;
const tT = (g, l) => {
  const s = document.createElement("span");
  return s.className = l, s.setAttribute("aria-hidden", l.includes("clone") ? "true" : "false"), g.split("").forEach((f, p) => {
    const y = document.createElement("span");
    y.className = "stagger-char", y.textContent = f === " " ? " " : f, y.style.transitionDelay = `${p * 30}ms`, s.appendChild(y);
  }), s;
}, Gg = () => {
  document.querySelectorAll(".nav-link").forEach((l) => {
    var E;
    if (l.querySelector(".stagger-wrapper"))
      return;
    const s = l.querySelector("span[data-lang]") || l.querySelector("span");
    if (!s)
      return;
    const f = ((E = s.textContent) == null ? void 0 : E.trim()) ?? "";
    if (!f)
      return;
    const p = document.createElement("span");
    p.className = "stagger-wrapper", p.appendChild(tT(f, "stagger-original")), p.appendChild(tT(f, "stagger-clone")), s.textContent = "", s.appendChild(p);
    let y = !1, h = !1;
    l.addEventListener("mouseenter", () => {
      if (h = !0, y)
        return;
      y = !0, l.classList.add("is-animating");
      const x = f.length * 30 + 300 + 50;
      setTimeout(() => {
        y = !1, h || l.classList.remove("is-animating");
      }, x);
    }), l.addEventListener("mouseleave", () => {
      h = !1, y || l.classList.remove("is-animating");
    });
  });
}, HM = () => {
  eT || (eT = !0, document.addEventListener("mainHeaderLoaded", Gg));
}, qg = () => {
  var f;
  const g = new URL("../../", import.meta.url).href;
  if ((f = window.__JEJU_ROUTE_NAVIGATOR__) != null && f.appRoot)
    return new URL(window.__JEJU_ROUTE_NAVIGATOR__.appRoot, window.location.href).href;
  const l = document.currentScript;
  if (l != null && l.src)
    return new URL("../", l.src).href;
  const s = Array.from(document.getElementsByTagName("script"));
  for (const p of s) {
    const y = p.src || p.getAttribute("src");
    if (y && (y.includes("components/runtime/bootstrap.js") || y.includes("components/runtime/shell-runtime.js")))
      return new URL("../../", y).href;
  }
  return g;
}, vp = (g) => new URL(g, qg()).href, JE = "userSession", IM = "jeju:session-updated";
let nT = !1, mE = !1;
const VT = () => document.getElementById("header") || document.querySelector(".header"), rT = () => {
  const g = VT();
  if (g) {
    if (window.scrollY > 50) {
      g.classList.add("scrolled");
      return;
    }
    g.classList.remove("scrolled");
  }
}, VM = () => {
  nT || (nT = !0, window.addEventListener("scroll", rT), rT());
}, BM = () => {
  document.querySelectorAll(".mega-menu-item").forEach((l) => {
    l.dataset.previewBound !== "true" && (l.dataset.previewBound = "true", l.addEventListener("mouseenter", () => {
      const s = l.dataset.preview, f = l.closest(".mega-dropdown");
      if (!s || !f)
        return;
      const p = f.querySelector(".mega-menu-preview");
      p && p.querySelectorAll(".preview-image").forEach((y) => {
        y.classList.toggle("active", y.id === s);
      });
    }));
  });
}, YM = () => {
  const g = document.getElementById("mobileMenuBtn"), l = document.getElementById("mobileNav");
  !g || !l || g.dataset.mobileToggleBound !== "true" && (g.dataset.mobileToggleBound = "true", g.addEventListener("click", () => {
    l.classList.toggle("active");
  }));
}, $M = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), WM = async (g) => {
  const l = g.querySelector("span");
  l ? l.textContent = "로그아웃" : g.textContent = "로그아웃";
  const s = g.querySelector("i");
  s && s.setAttribute("data-lucide", "log-out"), "href" in g && (g.href = "#"), g.removeAttribute("data-route"), g.dataset.logoutBound !== "true" && (g.dataset.logoutBound = "true", g.addEventListener("click", async (f) => {
    f.preventDefault(), f.stopPropagation();
    try {
      const y = await import(vp("core/auth/session_manager.js"));
      typeof y.logoutSession == "function" && await y.logoutSession();
    } catch {
      localStorage.removeItem(JE);
    }
    window.location.reload();
  }));
}, GM = (g) => {
  if (g.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const l = document.createElement("a");
  l.id = "indexAdminBtn", l.href = "#", l.className = "util-link route-link", l.setAttribute("data-route", "ADMIN.DASHBOARD"), l.style.color = "#FF5000", l.style.fontWeight = "700", l.textContent = "관리자 페이지";
  const s = document.createElement("span");
  s.className = "util-divider", s.textContent = "|", g.prepend(l, s);
}, qM = async () => {
  try {
    const l = await import(vp("core/auth/session_manager.js"));
    if (typeof l.resolveSession == "function")
      return await l.resolveSession();
  } catch {
  }
  try {
    const g = localStorage.getItem(JE);
    return g ? JSON.parse(g) : null;
  } catch {
    return null;
  }
}, QM = async () => {
  try {
    const l = await import(vp("core/auth/local_admin.js"));
    return typeof l.isLocalFrontEnvironment == "function" && l.isLocalFrontEnvironment();
  } catch {
    return !1;
  }
}, XM = async () => {
  var y;
  const g = document.getElementById("headerAdminBtn"), l = $M(), s = document.getElementById("index-header-util"), [f, p] = await Promise.all([qM(), QM()]);
  f && l && await WM(l), p && g && (g.style.display = "flex"), p && s && GM(s), (y = window.lucide) != null && y.createIcons && window.lucide.createIcons();
}, LE = () => {
  mE || (mE = !0, setTimeout(async () => {
    mE = !1, await XM();
  }, 0));
}, jv = () => {
  VT() && (VM(), BM(), YM(), KE(), Gg(), LE());
}, KM = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    jv();
  }), window.addEventListener("storage", (g) => {
    g.key === JE && LE();
  }), window.addEventListener(IM, () => {
    LE();
  });
}, aT = (g, l = "shell-runtime") => {
  var s;
  if ((s = window.__JEJU_ROUTE_NAVIGATOR__) != null && s.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(g, l);
    return;
  }
  window.location.assign(g);
}, JM = () => {
  var g;
  return (g = window.__JEJU_ROUTE_NAVIGATOR__) != null && g.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", qg()).href;
}, ZM = (g) => {
  const l = g.getAttribute("data-route-params");
  if (!l)
    return {};
  try {
    const s = JSON.parse(l);
    return s && typeof s == "object" && !Array.isArray(s) ? s : {};
  } catch {
    return {};
  }
}, eN = async (g) => {
  const l = g.getAttribute("data-route");
  if (l)
    try {
      const p = (await import(vp("core/utils/path_resolver.js"))).resolveRoute(l, ZM(g));
      aT(p, "shell-runtime-fallback");
    } catch {
      aT(JM(), "shell-runtime-fallback-home");
    }
};
let iT = !1;
const tN = async () => {
  if (!iT) {
    iT = !0;
    try {
      (await import(vp("core/utils/router_binder.js"))).initRouterBinder();
      return;
    } catch (g) {
      console.warn("[ShellRuntime] router binder load failed", g);
    }
    document.body.addEventListener("click", async (g) => {
      var s;
      const l = (s = g.target) == null ? void 0 : s.closest("[data-route]");
      l && (g.preventDefault(), await eN(l));
    });
  }
};
var ME = { exports: {} }, Ev = {}, NE = { exports: {} }, Dt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lT;
function nN() {
  if (lT) return Dt;
  lT = 1;
  var g = Symbol.for("react.element"), l = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), y = Symbol.for("react.provider"), h = Symbol.for("react.context"), E = Symbol.for("react.forward_ref"), x = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), O = Symbol.iterator;
  function A(P) {
    return P === null || typeof P != "object" ? null : (P = O && P[O] || P["@@iterator"], typeof P == "function" ? P : null);
  }
  var L = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, V = Object.assign, N = {};
  function B(P, re, Pe) {
    this.props = P, this.context = re, this.refs = N, this.updater = Pe || L;
  }
  B.prototype.isReactComponent = {}, B.prototype.setState = function(P, re) {
    if (typeof P != "object" && typeof P != "function" && P != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, P, re, "setState");
  }, B.prototype.forceUpdate = function(P) {
    this.updater.enqueueForceUpdate(this, P, "forceUpdate");
  };
  function Q() {
  }
  Q.prototype = B.prototype;
  function ee(P, re, Pe) {
    this.props = P, this.context = re, this.refs = N, this.updater = Pe || L;
  }
  var ne = ee.prototype = new Q();
  ne.constructor = ee, V(ne, B.prototype), ne.isPureReactComponent = !0;
  var se = Array.isArray, W = Object.prototype.hasOwnProperty, de = { current: null }, ue = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ee(P, re, Pe) {
    var be, qe = {}, it = null, rt = null;
    if (re != null) for (be in re.ref !== void 0 && (rt = re.ref), re.key !== void 0 && (it = "" + re.key), re) W.call(re, be) && !ue.hasOwnProperty(be) && (qe[be] = re[be]);
    var ct = arguments.length - 2;
    if (ct === 1) qe.children = Pe;
    else if (1 < ct) {
      for (var wt = Array(ct), qt = 0; qt < ct; qt++) wt[qt] = arguments[qt + 2];
      qe.children = wt;
    }
    if (P && P.defaultProps) for (be in ct = P.defaultProps, ct) qe[be] === void 0 && (qe[be] = ct[be]);
    return { $$typeof: g, type: P, key: it, ref: rt, props: qe, _owner: de.current };
  }
  function fe(P, re) {
    return { $$typeof: g, type: P.type, key: re, ref: P.ref, props: P.props, _owner: P._owner };
  }
  function Ye(P) {
    return typeof P == "object" && P !== null && P.$$typeof === g;
  }
  function Ke(P) {
    var re = { "=": "=0", ":": "=2" };
    return "$" + P.replace(/[=:]/g, function(Pe) {
      return re[Pe];
    });
  }
  var We = /\/+/g;
  function Re(P, re) {
    return typeof P == "object" && P !== null && P.key != null ? Ke("" + P.key) : re.toString(36);
  }
  function ut(P, re, Pe, be, qe) {
    var it = typeof P;
    (it === "undefined" || it === "boolean") && (P = null);
    var rt = !1;
    if (P === null) rt = !0;
    else switch (it) {
      case "string":
      case "number":
        rt = !0;
        break;
      case "object":
        switch (P.$$typeof) {
          case g:
          case l:
            rt = !0;
        }
    }
    if (rt) return rt = P, qe = qe(rt), P = be === "" ? "." + Re(rt, 0) : be, se(qe) ? (Pe = "", P != null && (Pe = P.replace(We, "$&/") + "/"), ut(qe, re, Pe, "", function(qt) {
      return qt;
    })) : qe != null && (Ye(qe) && (qe = fe(qe, Pe + (!qe.key || rt && rt.key === qe.key ? "" : ("" + qe.key).replace(We, "$&/") + "/") + P)), re.push(qe)), 1;
    if (rt = 0, be = be === "" ? "." : be + ":", se(P)) for (var ct = 0; ct < P.length; ct++) {
      it = P[ct];
      var wt = be + Re(it, ct);
      rt += ut(it, re, Pe, wt, qe);
    }
    else if (wt = A(P), typeof wt == "function") for (P = wt.call(P), ct = 0; !(it = P.next()).done; ) it = it.value, wt = be + Re(it, ct++), rt += ut(it, re, Pe, wt, qe);
    else if (it === "object") throw re = String(P), Error("Objects are not valid as a React child (found: " + (re === "[object Object]" ? "object with keys {" + Object.keys(P).join(", ") + "}" : re) + "). If you meant to render a collection of children, use an array instead.");
    return rt;
  }
  function Ge(P, re, Pe) {
    if (P == null) return P;
    var be = [], qe = 0;
    return ut(P, be, "", "", function(it) {
      return re.call(Pe, it, qe++);
    }), be;
  }
  function he(P) {
    if (P._status === -1) {
      var re = P._result;
      re = re(), re.then(function(Pe) {
        (P._status === 0 || P._status === -1) && (P._status = 1, P._result = Pe);
      }, function(Pe) {
        (P._status === 0 || P._status === -1) && (P._status = 2, P._result = Pe);
      }), P._status === -1 && (P._status = 0, P._result = re);
    }
    if (P._status === 1) return P._result.default;
    throw P._result;
  }
  var ce = { current: null }, ie = { transition: null }, Te = { ReactCurrentDispatcher: ce, ReactCurrentBatchConfig: ie, ReactCurrentOwner: de };
  function ye() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Dt.Children = { map: Ge, forEach: function(P, re, Pe) {
    Ge(P, function() {
      re.apply(this, arguments);
    }, Pe);
  }, count: function(P) {
    var re = 0;
    return Ge(P, function() {
      re++;
    }), re;
  }, toArray: function(P) {
    return Ge(P, function(re) {
      return re;
    }) || [];
  }, only: function(P) {
    if (!Ye(P)) throw Error("React.Children.only expected to receive a single React element child.");
    return P;
  } }, Dt.Component = B, Dt.Fragment = s, Dt.Profiler = p, Dt.PureComponent = ee, Dt.StrictMode = f, Dt.Suspense = x, Dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Te, Dt.act = ye, Dt.cloneElement = function(P, re, Pe) {
    if (P == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + P + ".");
    var be = V({}, P.props), qe = P.key, it = P.ref, rt = P._owner;
    if (re != null) {
      if (re.ref !== void 0 && (it = re.ref, rt = de.current), re.key !== void 0 && (qe = "" + re.key), P.type && P.type.defaultProps) var ct = P.type.defaultProps;
      for (wt in re) W.call(re, wt) && !ue.hasOwnProperty(wt) && (be[wt] = re[wt] === void 0 && ct !== void 0 ? ct[wt] : re[wt]);
    }
    var wt = arguments.length - 2;
    if (wt === 1) be.children = Pe;
    else if (1 < wt) {
      ct = Array(wt);
      for (var qt = 0; qt < wt; qt++) ct[qt] = arguments[qt + 2];
      be.children = ct;
    }
    return { $$typeof: g, type: P.type, key: qe, ref: it, props: be, _owner: rt };
  }, Dt.createContext = function(P) {
    return P = { $$typeof: h, _currentValue: P, _currentValue2: P, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, P.Provider = { $$typeof: y, _context: P }, P.Consumer = P;
  }, Dt.createElement = Ee, Dt.createFactory = function(P) {
    var re = Ee.bind(null, P);
    return re.type = P, re;
  }, Dt.createRef = function() {
    return { current: null };
  }, Dt.forwardRef = function(P) {
    return { $$typeof: E, render: P };
  }, Dt.isValidElement = Ye, Dt.lazy = function(P) {
    return { $$typeof: R, _payload: { _status: -1, _result: P }, _init: he };
  }, Dt.memo = function(P, re) {
    return { $$typeof: T, type: P, compare: re === void 0 ? null : re };
  }, Dt.startTransition = function(P) {
    var re = ie.transition;
    ie.transition = {};
    try {
      P();
    } finally {
      ie.transition = re;
    }
  }, Dt.unstable_act = ye, Dt.useCallback = function(P, re) {
    return ce.current.useCallback(P, re);
  }, Dt.useContext = function(P) {
    return ce.current.useContext(P);
  }, Dt.useDebugValue = function() {
  }, Dt.useDeferredValue = function(P) {
    return ce.current.useDeferredValue(P);
  }, Dt.useEffect = function(P, re) {
    return ce.current.useEffect(P, re);
  }, Dt.useId = function() {
    return ce.current.useId();
  }, Dt.useImperativeHandle = function(P, re, Pe) {
    return ce.current.useImperativeHandle(P, re, Pe);
  }, Dt.useInsertionEffect = function(P, re) {
    return ce.current.useInsertionEffect(P, re);
  }, Dt.useLayoutEffect = function(P, re) {
    return ce.current.useLayoutEffect(P, re);
  }, Dt.useMemo = function(P, re) {
    return ce.current.useMemo(P, re);
  }, Dt.useReducer = function(P, re, Pe) {
    return ce.current.useReducer(P, re, Pe);
  }, Dt.useRef = function(P) {
    return ce.current.useRef(P);
  }, Dt.useState = function(P) {
    return ce.current.useState(P);
  }, Dt.useSyncExternalStore = function(P, re, Pe) {
    return ce.current.useSyncExternalStore(P, re, Pe);
  }, Dt.useTransition = function() {
    return ce.current.useTransition();
  }, Dt.version = "18.3.1", Dt;
}
var xv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
xv.exports;
var oT;
function rN() {
  return oT || (oT = 1, function(g, l) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var s = "18.3.1", f = Symbol.for("react.element"), p = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), h = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), x = Symbol.for("react.provider"), T = Symbol.for("react.context"), R = Symbol.for("react.forward_ref"), O = Symbol.for("react.suspense"), A = Symbol.for("react.suspense_list"), L = Symbol.for("react.memo"), V = Symbol.for("react.lazy"), N = Symbol.for("react.offscreen"), B = Symbol.iterator, Q = "@@iterator";
      function ee(w) {
        if (w === null || typeof w != "object")
          return null;
        var z = B && w[B] || w[Q];
        return typeof z == "function" ? z : null;
      }
      var ne = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, se = {
        transition: null
      }, W = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, de = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ue = {}, Ee = null;
      function fe(w) {
        Ee = w;
      }
      ue.setExtraStackFrame = function(w) {
        Ee = w;
      }, ue.getCurrentStack = null, ue.getStackAddendum = function() {
        var w = "";
        Ee && (w += Ee);
        var z = ue.getCurrentStack;
        return z && (w += z() || ""), w;
      };
      var Ye = !1, Ke = !1, We = !1, Re = !1, ut = !1, Ge = {
        ReactCurrentDispatcher: ne,
        ReactCurrentBatchConfig: se,
        ReactCurrentOwner: de
      };
      Ge.ReactDebugCurrentFrame = ue, Ge.ReactCurrentActQueue = W;
      function he(w) {
        {
          for (var z = arguments.length, J = new Array(z > 1 ? z - 1 : 0), ae = 1; ae < z; ae++)
            J[ae - 1] = arguments[ae];
          ie("warn", w, J);
        }
      }
      function ce(w) {
        {
          for (var z = arguments.length, J = new Array(z > 1 ? z - 1 : 0), ae = 1; ae < z; ae++)
            J[ae - 1] = arguments[ae];
          ie("error", w, J);
        }
      }
      function ie(w, z, J) {
        {
          var ae = Ge.ReactDebugCurrentFrame, xe = ae.getStackAddendum();
          xe !== "" && (z += "%s", J = J.concat([xe]));
          var tt = J.map(function(Oe) {
            return String(Oe);
          });
          tt.unshift("Warning: " + z), Function.prototype.apply.call(console[w], console, tt);
        }
      }
      var Te = {};
      function ye(w, z) {
        {
          var J = w.constructor, ae = J && (J.displayName || J.name) || "ReactClass", xe = ae + "." + z;
          if (Te[xe])
            return;
          ce("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", z, ae), Te[xe] = !0;
        }
      }
      var P = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(w) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(w, z, J) {
          ye(w, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(w, z, J, ae) {
          ye(w, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(w, z, J, ae) {
          ye(w, "setState");
        }
      }, re = Object.assign, Pe = {};
      Object.freeze(Pe);
      function be(w, z, J) {
        this.props = w, this.context = z, this.refs = Pe, this.updater = J || P;
      }
      be.prototype.isReactComponent = {}, be.prototype.setState = function(w, z) {
        if (typeof w != "object" && typeof w != "function" && w != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, w, z, "setState");
      }, be.prototype.forceUpdate = function(w) {
        this.updater.enqueueForceUpdate(this, w, "forceUpdate");
      };
      {
        var qe = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, it = function(w, z) {
          Object.defineProperty(be.prototype, w, {
            get: function() {
              he("%s(...) is deprecated in plain JavaScript React classes. %s", z[0], z[1]);
            }
          });
        };
        for (var rt in qe)
          qe.hasOwnProperty(rt) && it(rt, qe[rt]);
      }
      function ct() {
      }
      ct.prototype = be.prototype;
      function wt(w, z, J) {
        this.props = w, this.context = z, this.refs = Pe, this.updater = J || P;
      }
      var qt = wt.prototype = new ct();
      qt.constructor = wt, re(qt, be.prototype), qt.isPureReactComponent = !0;
      function Pn() {
        var w = {
          current: null
        };
        return Object.seal(w), w;
      }
      var jr = Array.isArray;
      function bn(w) {
        return jr(w);
      }
      function pr(w) {
        {
          var z = typeof Symbol == "function" && Symbol.toStringTag, J = z && w[Symbol.toStringTag] || w.constructor.name || "Object";
          return J;
        }
      }
      function Xn(w) {
        try {
          return Kn(w), !1;
        } catch {
          return !0;
        }
      }
      function Kn(w) {
        return "" + w;
      }
      function ra(w) {
        if (Xn(w))
          return ce("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", pr(w)), Kn(w);
      }
      function ji(w, z, J) {
        var ae = w.displayName;
        if (ae)
          return ae;
        var xe = z.displayName || z.name || "";
        return xe !== "" ? J + "(" + xe + ")" : J;
      }
      function wa(w) {
        return w.displayName || "Context";
      }
      function ir(w) {
        if (w == null)
          return null;
        if (typeof w.tag == "number" && ce("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof w == "function")
          return w.displayName || w.name || null;
        if (typeof w == "string")
          return w;
        switch (w) {
          case y:
            return "Fragment";
          case p:
            return "Portal";
          case E:
            return "Profiler";
          case h:
            return "StrictMode";
          case O:
            return "Suspense";
          case A:
            return "SuspenseList";
        }
        if (typeof w == "object")
          switch (w.$$typeof) {
            case T:
              var z = w;
              return wa(z) + ".Consumer";
            case x:
              var J = w;
              return wa(J._context) + ".Provider";
            case R:
              return ji(w, w.render, "ForwardRef");
            case L:
              var ae = w.displayName || null;
              return ae !== null ? ae : ir(w.type) || "Memo";
            case V: {
              var xe = w, tt = xe._payload, Oe = xe._init;
              try {
                return ir(Oe(tt));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Rn = Object.prototype.hasOwnProperty, Jn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Dr, fi, Fn;
      Fn = {};
      function Or(w) {
        if (Rn.call(w, "ref")) {
          var z = Object.getOwnPropertyDescriptor(w, "ref").get;
          if (z && z.isReactWarning)
            return !1;
        }
        return w.ref !== void 0;
      }
      function xa(w) {
        if (Rn.call(w, "key")) {
          var z = Object.getOwnPropertyDescriptor(w, "key").get;
          if (z && z.isReactWarning)
            return !1;
        }
        return w.key !== void 0;
      }
      function di(w, z) {
        var J = function() {
          Dr || (Dr = !0, ce("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", z));
        };
        J.isReactWarning = !0, Object.defineProperty(w, "key", {
          get: J,
          configurable: !0
        });
      }
      function Pi(w, z) {
        var J = function() {
          fi || (fi = !0, ce("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", z));
        };
        J.isReactWarning = !0, Object.defineProperty(w, "ref", {
          get: J,
          configurable: !0
        });
      }
      function ke(w) {
        if (typeof w.ref == "string" && de.current && w.__self && de.current.stateNode !== w.__self) {
          var z = ir(de.current.type);
          Fn[z] || (ce('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', z, w.ref), Fn[z] = !0);
        }
      }
      var Qe = function(w, z, J, ae, xe, tt, Oe) {
        var lt = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: f,
          // Built-in properties that belong on the element
          type: w,
          key: z,
          ref: J,
          props: Oe,
          // Record the component responsible for creating this element.
          _owner: tt
        };
        return lt._store = {}, Object.defineProperty(lt._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(lt, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ae
        }), Object.defineProperty(lt, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: xe
        }), Object.freeze && (Object.freeze(lt.props), Object.freeze(lt)), lt;
      };
      function Et(w, z, J) {
        var ae, xe = {}, tt = null, Oe = null, lt = null, Rt = null;
        if (z != null) {
          Or(z) && (Oe = z.ref, ke(z)), xa(z) && (ra(z.key), tt = "" + z.key), lt = z.__self === void 0 ? null : z.__self, Rt = z.__source === void 0 ? null : z.__source;
          for (ae in z)
            Rn.call(z, ae) && !Jn.hasOwnProperty(ae) && (xe[ae] = z[ae]);
        }
        var zt = arguments.length - 2;
        if (zt === 1)
          xe.children = J;
        else if (zt > 1) {
          for (var un = Array(zt), Jt = 0; Jt < zt; Jt++)
            un[Jt] = arguments[Jt + 2];
          Object.freeze && Object.freeze(un), xe.children = un;
        }
        if (w && w.defaultProps) {
          var Ct = w.defaultProps;
          for (ae in Ct)
            xe[ae] === void 0 && (xe[ae] = Ct[ae]);
        }
        if (tt || Oe) {
          var Zt = typeof w == "function" ? w.displayName || w.name || "Unknown" : w;
          tt && di(xe, Zt), Oe && Pi(xe, Zt);
        }
        return Qe(w, tt, Oe, lt, Rt, de.current, xe);
      }
      function $t(w, z) {
        var J = Qe(w.type, z, w.ref, w._self, w._source, w._owner, w.props);
        return J;
      }
      function an(w, z, J) {
        if (w == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + w + ".");
        var ae, xe = re({}, w.props), tt = w.key, Oe = w.ref, lt = w._self, Rt = w._source, zt = w._owner;
        if (z != null) {
          Or(z) && (Oe = z.ref, zt = de.current), xa(z) && (ra(z.key), tt = "" + z.key);
          var un;
          w.type && w.type.defaultProps && (un = w.type.defaultProps);
          for (ae in z)
            Rn.call(z, ae) && !Jn.hasOwnProperty(ae) && (z[ae] === void 0 && un !== void 0 ? xe[ae] = un[ae] : xe[ae] = z[ae]);
        }
        var Jt = arguments.length - 2;
        if (Jt === 1)
          xe.children = J;
        else if (Jt > 1) {
          for (var Ct = Array(Jt), Zt = 0; Zt < Jt; Zt++)
            Ct[Zt] = arguments[Zt + 2];
          xe.children = Ct;
        }
        return Qe(w.type, tt, Oe, lt, Rt, zt, xe);
      }
      function gn(w) {
        return typeof w == "object" && w !== null && w.$$typeof === f;
      }
      var cn = ".", lr = ":";
      function ln(w) {
        var z = /[=:]/g, J = {
          "=": "=0",
          ":": "=2"
        }, ae = w.replace(z, function(xe) {
          return J[xe];
        });
        return "$" + ae;
      }
      var Qt = !1, Xt = /\/+/g;
      function Ta(w) {
        return w.replace(Xt, "$&/");
      }
      function Lr(w, z) {
        return typeof w == "object" && w !== null && w.key != null ? (ra(w.key), ln("" + w.key)) : z.toString(36);
      }
      function Fa(w, z, J, ae, xe) {
        var tt = typeof w;
        (tt === "undefined" || tt === "boolean") && (w = null);
        var Oe = !1;
        if (w === null)
          Oe = !0;
        else
          switch (tt) {
            case "string":
            case "number":
              Oe = !0;
              break;
            case "object":
              switch (w.$$typeof) {
                case f:
                case p:
                  Oe = !0;
              }
          }
        if (Oe) {
          var lt = w, Rt = xe(lt), zt = ae === "" ? cn + Lr(lt, 0) : ae;
          if (bn(Rt)) {
            var un = "";
            zt != null && (un = Ta(zt) + "/"), Fa(Rt, z, un, "", function(_p) {
              return _p;
            });
          } else Rt != null && (gn(Rt) && (Rt.key && (!lt || lt.key !== Rt.key) && ra(Rt.key), Rt = $t(
            Rt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            J + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Rt.key && (!lt || lt.key !== Rt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              Ta("" + Rt.key) + "/"
            ) : "") + zt
          )), z.push(Rt));
          return 1;
        }
        var Jt, Ct, Zt = 0, _n = ae === "" ? cn : ae + lr;
        if (bn(w))
          for (var Zl = 0; Zl < w.length; Zl++)
            Jt = w[Zl], Ct = _n + Lr(Jt, Zl), Zt += Fa(Jt, z, J, Ct, xe);
        else {
          var $s = ee(w);
          if (typeof $s == "function") {
            var _l = w;
            $s === _l.entries && (Qt || he("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Qt = !0);
            for (var Ws = $s.call(_l), Yo, gp = 0; !(Yo = Ws.next()).done; )
              Jt = Yo.value, Ct = _n + Lr(Jt, gp++), Zt += Fa(Jt, z, J, Ct, xe);
          } else if (tt === "object") {
            var gf = String(w);
            throw new Error("Objects are not valid as a React child (found: " + (gf === "[object Object]" ? "object with keys {" + Object.keys(w).join(", ") + "}" : gf) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Zt;
      }
      function ml(w, z, J) {
        if (w == null)
          return w;
        var ae = [], xe = 0;
        return Fa(w, ae, "", "", function(tt) {
          return z.call(J, tt, xe++);
        }), ae;
      }
      function zo(w) {
        var z = 0;
        return ml(w, function() {
          z++;
        }), z;
      }
      function Uo(w, z, J) {
        ml(w, function() {
          z.apply(this, arguments);
        }, J);
      }
      function Yl(w) {
        return ml(w, function(z) {
          return z;
        }) || [];
      }
      function $l(w) {
        if (!gn(w))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return w;
      }
      function jo(w) {
        var z = {
          $$typeof: T,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: w,
          _currentValue2: w,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        z.Provider = {
          $$typeof: x,
          _context: z
        };
        var J = !1, ae = !1, xe = !1;
        {
          var tt = {
            $$typeof: T,
            _context: z
          };
          Object.defineProperties(tt, {
            Provider: {
              get: function() {
                return ae || (ae = !0, ce("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), z.Provider;
              },
              set: function(Oe) {
                z.Provider = Oe;
              }
            },
            _currentValue: {
              get: function() {
                return z._currentValue;
              },
              set: function(Oe) {
                z._currentValue = Oe;
              }
            },
            _currentValue2: {
              get: function() {
                return z._currentValue2;
              },
              set: function(Oe) {
                z._currentValue2 = Oe;
              }
            },
            _threadCount: {
              get: function() {
                return z._threadCount;
              },
              set: function(Oe) {
                z._threadCount = Oe;
              }
            },
            Consumer: {
              get: function() {
                return J || (J = !0, ce("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), z.Consumer;
              }
            },
            displayName: {
              get: function() {
                return z.displayName;
              },
              set: function(Oe) {
                xe || (he("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", Oe), xe = !0);
              }
            }
          }), z.Consumer = tt;
        }
        return z._currentRenderer = null, z._currentRenderer2 = null, z;
      }
      var Pr = -1, Fr = 0, hr = 1, Fi = 2;
      function pi(w) {
        if (w._status === Pr) {
          var z = w._result, J = z();
          if (J.then(function(tt) {
            if (w._status === Fr || w._status === Pr) {
              var Oe = w;
              Oe._status = hr, Oe._result = tt;
            }
          }, function(tt) {
            if (w._status === Fr || w._status === Pr) {
              var Oe = w;
              Oe._status = Fi, Oe._result = tt;
            }
          }), w._status === Pr) {
            var ae = w;
            ae._status = Fr, ae._result = J;
          }
        }
        if (w._status === hr) {
          var xe = w._result;
          return xe === void 0 && ce(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, xe), "default" in xe || ce(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, xe), xe.default;
        } else
          throw w._result;
      }
      function Hi(w) {
        var z = {
          // We use these fields to store the result.
          _status: Pr,
          _result: w
        }, J = {
          $$typeof: V,
          _payload: z,
          _init: pi
        };
        {
          var ae, xe;
          Object.defineProperties(J, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return ae;
              },
              set: function(tt) {
                ce("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ae = tt, Object.defineProperty(J, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return xe;
              },
              set: function(tt) {
                ce("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), xe = tt, Object.defineProperty(J, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return J;
      }
      function Ii(w) {
        w != null && w.$$typeof === L ? ce("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof w != "function" ? ce("forwardRef requires a render function but was given %s.", w === null ? "null" : typeof w) : w.length !== 0 && w.length !== 2 && ce("forwardRef render functions accept exactly two parameters: props and ref. %s", w.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), w != null && (w.defaultProps != null || w.propTypes != null) && ce("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var z = {
          $$typeof: R,
          render: w
        };
        {
          var J;
          Object.defineProperty(z, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return J;
            },
            set: function(ae) {
              J = ae, !w.name && !w.displayName && (w.displayName = ae);
            }
          });
        }
        return z;
      }
      var U;
      U = Symbol.for("react.module.reference");
      function ve(w) {
        return !!(typeof w == "string" || typeof w == "function" || w === y || w === E || ut || w === h || w === O || w === A || Re || w === N || Ye || Ke || We || typeof w == "object" && w !== null && (w.$$typeof === V || w.$$typeof === L || w.$$typeof === x || w.$$typeof === T || w.$$typeof === R || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        w.$$typeof === U || w.getModuleId !== void 0));
      }
      function Le(w, z) {
        ve(w) || ce("memo: The first argument must be a component. Instead received: %s", w === null ? "null" : typeof w);
        var J = {
          $$typeof: L,
          type: w,
          compare: z === void 0 ? null : z
        };
        {
          var ae;
          Object.defineProperty(J, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ae;
            },
            set: function(xe) {
              ae = xe, !w.name && !w.displayName && (w.displayName = xe);
            }
          });
        }
        return J;
      }
      function He() {
        var w = ne.current;
        return w === null && ce(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), w;
      }
      function yt(w) {
        var z = He();
        if (w._context !== void 0) {
          var J = w._context;
          J.Consumer === w ? ce("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : J.Provider === w && ce("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return z.useContext(w);
      }
      function ht(w) {
        var z = He();
        return z.useState(w);
      }
      function bt(w, z, J) {
        var ae = He();
        return ae.useReducer(w, z, J);
      }
      function xt(w) {
        var z = He();
        return z.useRef(w);
      }
      function kn(w, z) {
        var J = He();
        return J.useEffect(w, z);
      }
      function on(w, z) {
        var J = He();
        return J.useInsertionEffect(w, z);
      }
      function fn(w, z) {
        var J = He();
        return J.useLayoutEffect(w, z);
      }
      function vr(w, z) {
        var J = He();
        return J.useCallback(w, z);
      }
      function hi(w, z) {
        var J = He();
        return J.useMemo(w, z);
      }
      function vi(w, z, J) {
        var ae = He();
        return ae.useImperativeHandle(w, z, J);
      }
      function gt(w, z) {
        {
          var J = He();
          return J.useDebugValue(w, z);
        }
      }
      function St() {
        var w = He();
        return w.useTransition();
      }
      function mi(w) {
        var z = He();
        return z.useDeferredValue(w);
      }
      function Po() {
        var w = He();
        return w.useId();
      }
      function Fo(w, z, J) {
        var ae = He();
        return ae.useSyncExternalStore(w, z, J);
      }
      var Wl = 0, Nu, Gl, aa, Is, Hr, mf, yf;
      function Au() {
      }
      Au.__reactDisabledLog = !0;
      function ql() {
        {
          if (Wl === 0) {
            Nu = console.log, Gl = console.info, aa = console.warn, Is = console.error, Hr = console.group, mf = console.groupCollapsed, yf = console.groupEnd;
            var w = {
              configurable: !0,
              enumerable: !0,
              value: Au,
              writable: !0
            };
            Object.defineProperties(console, {
              info: w,
              log: w,
              warn: w,
              error: w,
              group: w,
              groupCollapsed: w,
              groupEnd: w
            });
          }
          Wl++;
        }
      }
      function ba() {
        {
          if (Wl--, Wl === 0) {
            var w = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: re({}, w, {
                value: Nu
              }),
              info: re({}, w, {
                value: Gl
              }),
              warn: re({}, w, {
                value: aa
              }),
              error: re({}, w, {
                value: Is
              }),
              group: re({}, w, {
                value: Hr
              }),
              groupCollapsed: re({}, w, {
                value: mf
              }),
              groupEnd: re({}, w, {
                value: yf
              })
            });
          }
          Wl < 0 && ce("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var yi = Ge.ReactCurrentDispatcher, gi;
      function zu(w, z, J) {
        {
          if (gi === void 0)
            try {
              throw Error();
            } catch (xe) {
              var ae = xe.stack.trim().match(/\n( *(at )?)/);
              gi = ae && ae[1] || "";
            }
          return `
` + gi + w;
        }
      }
      var Ho = !1, Ql;
      {
        var Uu = typeof WeakMap == "function" ? WeakMap : Map;
        Ql = new Uu();
      }
      function ju(w, z) {
        if (!w || Ho)
          return "";
        {
          var J = Ql.get(w);
          if (J !== void 0)
            return J;
        }
        var ae;
        Ho = !0;
        var xe = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var tt;
        tt = yi.current, yi.current = null, ql();
        try {
          if (z) {
            var Oe = function() {
              throw Error();
            };
            if (Object.defineProperty(Oe.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Oe, []);
              } catch (_n) {
                ae = _n;
              }
              Reflect.construct(w, [], Oe);
            } else {
              try {
                Oe.call();
              } catch (_n) {
                ae = _n;
              }
              w.call(Oe.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (_n) {
              ae = _n;
            }
            w();
          }
        } catch (_n) {
          if (_n && ae && typeof _n.stack == "string") {
            for (var lt = _n.stack.split(`
`), Rt = ae.stack.split(`
`), zt = lt.length - 1, un = Rt.length - 1; zt >= 1 && un >= 0 && lt[zt] !== Rt[un]; )
              un--;
            for (; zt >= 1 && un >= 0; zt--, un--)
              if (lt[zt] !== Rt[un]) {
                if (zt !== 1 || un !== 1)
                  do
                    if (zt--, un--, un < 0 || lt[zt] !== Rt[un]) {
                      var Jt = `
` + lt[zt].replace(" at new ", " at ");
                      return w.displayName && Jt.includes("<anonymous>") && (Jt = Jt.replace("<anonymous>", w.displayName)), typeof w == "function" && Ql.set(w, Jt), Jt;
                    }
                  while (zt >= 1 && un >= 0);
                break;
              }
          }
        } finally {
          Ho = !1, yi.current = tt, ba(), Error.prepareStackTrace = xe;
        }
        var Ct = w ? w.displayName || w.name : "", Zt = Ct ? zu(Ct) : "";
        return typeof w == "function" && Ql.set(w, Zt), Zt;
      }
      function yl(w, z, J) {
        return ju(w, !1);
      }
      function mp(w) {
        var z = w.prototype;
        return !!(z && z.isReactComponent);
      }
      function gl(w, z, J) {
        if (w == null)
          return "";
        if (typeof w == "function")
          return ju(w, mp(w));
        if (typeof w == "string")
          return zu(w);
        switch (w) {
          case O:
            return zu("Suspense");
          case A:
            return zu("SuspenseList");
        }
        if (typeof w == "object")
          switch (w.$$typeof) {
            case R:
              return yl(w.render);
            case L:
              return gl(w.type, z, J);
            case V: {
              var ae = w, xe = ae._payload, tt = ae._init;
              try {
                return gl(tt(xe), z, J);
              } catch {
              }
            }
          }
        return "";
      }
      var Ft = {}, Pu = Ge.ReactDebugCurrentFrame;
      function At(w) {
        if (w) {
          var z = w._owner, J = gl(w.type, w._source, z ? z.type : null);
          Pu.setExtraStackFrame(J);
        } else
          Pu.setExtraStackFrame(null);
      }
      function Vs(w, z, J, ae, xe) {
        {
          var tt = Function.call.bind(Rn);
          for (var Oe in w)
            if (tt(w, Oe)) {
              var lt = void 0;
              try {
                if (typeof w[Oe] != "function") {
                  var Rt = Error((ae || "React class") + ": " + J + " type `" + Oe + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof w[Oe] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Rt.name = "Invariant Violation", Rt;
                }
                lt = w[Oe](z, Oe, ae, J, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (zt) {
                lt = zt;
              }
              lt && !(lt instanceof Error) && (At(xe), ce("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ae || "React class", J, Oe, typeof lt), At(null)), lt instanceof Error && !(lt.message in Ft) && (Ft[lt.message] = !0, At(xe), ce("Failed %s type: %s", J, lt.message), At(null));
            }
        }
      }
      function Vi(w) {
        if (w) {
          var z = w._owner, J = gl(w.type, w._source, z ? z.type : null);
          fe(J);
        } else
          fe(null);
      }
      var pt;
      pt = !1;
      function Fu() {
        if (de.current) {
          var w = ir(de.current.type);
          if (w)
            return `

Check the render method of \`` + w + "`.";
        }
        return "";
      }
      function mr(w) {
        if (w !== void 0) {
          var z = w.fileName.replace(/^.*[\\\/]/, ""), J = w.lineNumber;
          return `

Check your code at ` + z + ":" + J + ".";
        }
        return "";
      }
      function Bi(w) {
        return w != null ? mr(w.__source) : "";
      }
      var Ir = {};
      function Yi(w) {
        var z = Fu();
        if (!z) {
          var J = typeof w == "string" ? w : w.displayName || w.name;
          J && (z = `

Check the top-level render call using <` + J + ">.");
        }
        return z;
      }
      function dn(w, z) {
        if (!(!w._store || w._store.validated || w.key != null)) {
          w._store.validated = !0;
          var J = Yi(z);
          if (!Ir[J]) {
            Ir[J] = !0;
            var ae = "";
            w && w._owner && w._owner !== de.current && (ae = " It was passed a child from " + ir(w._owner.type) + "."), Vi(w), ce('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', J, ae), Vi(null);
          }
        }
      }
      function Kt(w, z) {
        if (typeof w == "object") {
          if (bn(w))
            for (var J = 0; J < w.length; J++) {
              var ae = w[J];
              gn(ae) && dn(ae, z);
            }
          else if (gn(w))
            w._store && (w._store.validated = !0);
          else if (w) {
            var xe = ee(w);
            if (typeof xe == "function" && xe !== w.entries)
              for (var tt = xe.call(w), Oe; !(Oe = tt.next()).done; )
                gn(Oe.value) && dn(Oe.value, z);
          }
        }
      }
      function Xl(w) {
        {
          var z = w.type;
          if (z == null || typeof z == "string")
            return;
          var J;
          if (typeof z == "function")
            J = z.propTypes;
          else if (typeof z == "object" && (z.$$typeof === R || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          z.$$typeof === L))
            J = z.propTypes;
          else
            return;
          if (J) {
            var ae = ir(z);
            Vs(J, w.props, "prop", ae, w);
          } else if (z.PropTypes !== void 0 && !pt) {
            pt = !0;
            var xe = ir(z);
            ce("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", xe || "Unknown");
          }
          typeof z.getDefaultProps == "function" && !z.getDefaultProps.isReactClassApproved && ce("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Zn(w) {
        {
          for (var z = Object.keys(w.props), J = 0; J < z.length; J++) {
            var ae = z[J];
            if (ae !== "children" && ae !== "key") {
              Vi(w), ce("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ae), Vi(null);
              break;
            }
          }
          w.ref !== null && (Vi(w), ce("Invalid attribute `ref` supplied to `React.Fragment`."), Vi(null));
        }
      }
      function Vr(w, z, J) {
        var ae = ve(w);
        if (!ae) {
          var xe = "";
          (w === void 0 || typeof w == "object" && w !== null && Object.keys(w).length === 0) && (xe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var tt = Bi(z);
          tt ? xe += tt : xe += Fu();
          var Oe;
          w === null ? Oe = "null" : bn(w) ? Oe = "array" : w !== void 0 && w.$$typeof === f ? (Oe = "<" + (ir(w.type) || "Unknown") + " />", xe = " Did you accidentally export a JSX literal instead of a component?") : Oe = typeof w, ce("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Oe, xe);
        }
        var lt = Et.apply(this, arguments);
        if (lt == null)
          return lt;
        if (ae)
          for (var Rt = 2; Rt < arguments.length; Rt++)
            Kt(arguments[Rt], w);
        return w === y ? Zn(lt) : Xl(lt), lt;
      }
      var Ha = !1;
      function Io(w) {
        var z = Vr.bind(null, w);
        return z.type = w, Ha || (Ha = !0, he("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(z, "type", {
          enumerable: !1,
          get: function() {
            return he("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: w
            }), w;
          }
        }), z;
      }
      function Bs(w, z, J) {
        for (var ae = an.apply(this, arguments), xe = 2; xe < arguments.length; xe++)
          Kt(arguments[xe], ae.type);
        return Xl(ae), ae;
      }
      function Ys(w, z) {
        var J = se.transition;
        se.transition = {};
        var ae = se.transition;
        se.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          w();
        } finally {
          if (se.transition = J, J === null && ae._updatedFibers) {
            var xe = ae._updatedFibers.size;
            xe > 10 && he("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), ae._updatedFibers.clear();
          }
        }
      }
      var Kl = !1, Vo = null;
      function yp(w) {
        if (Vo === null)
          try {
            var z = ("require" + Math.random()).slice(0, 7), J = g && g[z];
            Vo = J.call(g, "timers").setImmediate;
          } catch {
            Vo = function(xe) {
              Kl === !1 && (Kl = !0, typeof MessageChannel > "u" && ce("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var tt = new MessageChannel();
              tt.port1.onmessage = xe, tt.port2.postMessage(void 0);
            };
          }
        return Vo(w);
      }
      var Ia = 0, _i = !1;
      function $i(w) {
        {
          var z = Ia;
          Ia++, W.current === null && (W.current = []);
          var J = W.isBatchingLegacy, ae;
          try {
            if (W.isBatchingLegacy = !0, ae = w(), !J && W.didScheduleLegacyUpdate) {
              var xe = W.current;
              xe !== null && (W.didScheduleLegacyUpdate = !1, Jl(xe));
            }
          } catch (Ct) {
            throw Va(z), Ct;
          } finally {
            W.isBatchingLegacy = J;
          }
          if (ae !== null && typeof ae == "object" && typeof ae.then == "function") {
            var tt = ae, Oe = !1, lt = {
              then: function(Ct, Zt) {
                Oe = !0, tt.then(function(_n) {
                  Va(z), Ia === 0 ? Hu(_n, Ct, Zt) : Ct(_n);
                }, function(_n) {
                  Va(z), Zt(_n);
                });
              }
            };
            return !_i && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              Oe || (_i = !0, ce("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), lt;
          } else {
            var Rt = ae;
            if (Va(z), Ia === 0) {
              var zt = W.current;
              zt !== null && (Jl(zt), W.current = null);
              var un = {
                then: function(Ct, Zt) {
                  W.current === null ? (W.current = [], Hu(Rt, Ct, Zt)) : Ct(Rt);
                }
              };
              return un;
            } else {
              var Jt = {
                then: function(Ct, Zt) {
                  Ct(Rt);
                }
              };
              return Jt;
            }
          }
        }
      }
      function Va(w) {
        w !== Ia - 1 && ce("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Ia = w;
      }
      function Hu(w, z, J) {
        {
          var ae = W.current;
          if (ae !== null)
            try {
              Jl(ae), yp(function() {
                ae.length === 0 ? (W.current = null, z(w)) : Hu(w, z, J);
              });
            } catch (xe) {
              J(xe);
            }
          else
            z(w);
        }
      }
      var Iu = !1;
      function Jl(w) {
        if (!Iu) {
          Iu = !0;
          var z = 0;
          try {
            for (; z < w.length; z++) {
              var J = w[z];
              do
                J = J(!0);
              while (J !== null);
            }
            w.length = 0;
          } catch (ae) {
            throw w = w.slice(z + 1), ae;
          } finally {
            Iu = !1;
          }
        }
      }
      var Bo = Vr, Vu = Bs, Bu = Io, Si = {
        map: ml,
        forEach: Uo,
        count: zo,
        toArray: Yl,
        only: $l
      };
      l.Children = Si, l.Component = be, l.Fragment = y, l.Profiler = E, l.PureComponent = wt, l.StrictMode = h, l.Suspense = O, l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ge, l.act = $i, l.cloneElement = Vu, l.createContext = jo, l.createElement = Bo, l.createFactory = Bu, l.createRef = Pn, l.forwardRef = Ii, l.isValidElement = gn, l.lazy = Hi, l.memo = Le, l.startTransition = Ys, l.unstable_act = $i, l.useCallback = vr, l.useContext = yt, l.useDebugValue = gt, l.useDeferredValue = mi, l.useEffect = kn, l.useId = Po, l.useImperativeHandle = vi, l.useInsertionEffect = on, l.useLayoutEffect = fn, l.useMemo = hi, l.useReducer = bt, l.useRef = xt, l.useState = ht, l.useSyncExternalStore = Fo, l.useTransition = St, l.version = s, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(xv, xv.exports)), xv.exports;
}
process.env.NODE_ENV === "production" ? NE.exports = nN() : NE.exports = rN();
var Ut = NE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uT;
function aN() {
  if (uT) return Ev;
  uT = 1;
  var g = Ut, l = Symbol.for("react.element"), s = Symbol.for("react.fragment"), f = Object.prototype.hasOwnProperty, p = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, y = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(E, x, T) {
    var R, O = {}, A = null, L = null;
    T !== void 0 && (A = "" + T), x.key !== void 0 && (A = "" + x.key), x.ref !== void 0 && (L = x.ref);
    for (R in x) f.call(x, R) && !y.hasOwnProperty(R) && (O[R] = x[R]);
    if (E && E.defaultProps) for (R in x = E.defaultProps, x) O[R] === void 0 && (O[R] = x[R]);
    return { $$typeof: l, type: E, key: A, ref: L, props: O, _owner: p.current };
  }
  return Ev.Fragment = s, Ev.jsx = h, Ev.jsxs = h, Ev;
}
var Cv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sT;
function iN() {
  return sT || (sT = 1, process.env.NODE_ENV !== "production" && function() {
    var g = Ut, l = Symbol.for("react.element"), s = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), E = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), R = Symbol.for("react.suspense_list"), O = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), L = Symbol.for("react.offscreen"), V = Symbol.iterator, N = "@@iterator";
    function B(U) {
      if (U === null || typeof U != "object")
        return null;
      var ve = V && U[V] || U[N];
      return typeof ve == "function" ? ve : null;
    }
    var Q = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ee(U) {
      {
        for (var ve = arguments.length, Le = new Array(ve > 1 ? ve - 1 : 0), He = 1; He < ve; He++)
          Le[He - 1] = arguments[He];
        ne("error", U, Le);
      }
    }
    function ne(U, ve, Le) {
      {
        var He = Q.ReactDebugCurrentFrame, yt = He.getStackAddendum();
        yt !== "" && (ve += "%s", Le = Le.concat([yt]));
        var ht = Le.map(function(bt) {
          return String(bt);
        });
        ht.unshift("Warning: " + ve), Function.prototype.apply.call(console[U], console, ht);
      }
    }
    var se = !1, W = !1, de = !1, ue = !1, Ee = !1, fe;
    fe = Symbol.for("react.module.reference");
    function Ye(U) {
      return !!(typeof U == "string" || typeof U == "function" || U === f || U === y || Ee || U === p || U === T || U === R || ue || U === L || se || W || de || typeof U == "object" && U !== null && (U.$$typeof === A || U.$$typeof === O || U.$$typeof === h || U.$$typeof === E || U.$$typeof === x || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      U.$$typeof === fe || U.getModuleId !== void 0));
    }
    function Ke(U, ve, Le) {
      var He = U.displayName;
      if (He)
        return He;
      var yt = ve.displayName || ve.name || "";
      return yt !== "" ? Le + "(" + yt + ")" : Le;
    }
    function We(U) {
      return U.displayName || "Context";
    }
    function Re(U) {
      if (U == null)
        return null;
      if (typeof U.tag == "number" && ee("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof U == "function")
        return U.displayName || U.name || null;
      if (typeof U == "string")
        return U;
      switch (U) {
        case f:
          return "Fragment";
        case s:
          return "Portal";
        case y:
          return "Profiler";
        case p:
          return "StrictMode";
        case T:
          return "Suspense";
        case R:
          return "SuspenseList";
      }
      if (typeof U == "object")
        switch (U.$$typeof) {
          case E:
            var ve = U;
            return We(ve) + ".Consumer";
          case h:
            var Le = U;
            return We(Le._context) + ".Provider";
          case x:
            return Ke(U, U.render, "ForwardRef");
          case O:
            var He = U.displayName || null;
            return He !== null ? He : Re(U.type) || "Memo";
          case A: {
            var yt = U, ht = yt._payload, bt = yt._init;
            try {
              return Re(bt(ht));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var ut = Object.assign, Ge = 0, he, ce, ie, Te, ye, P, re;
    function Pe() {
    }
    Pe.__reactDisabledLog = !0;
    function be() {
      {
        if (Ge === 0) {
          he = console.log, ce = console.info, ie = console.warn, Te = console.error, ye = console.group, P = console.groupCollapsed, re = console.groupEnd;
          var U = {
            configurable: !0,
            enumerable: !0,
            value: Pe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: U,
            log: U,
            warn: U,
            error: U,
            group: U,
            groupCollapsed: U,
            groupEnd: U
          });
        }
        Ge++;
      }
    }
    function qe() {
      {
        if (Ge--, Ge === 0) {
          var U = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ut({}, U, {
              value: he
            }),
            info: ut({}, U, {
              value: ce
            }),
            warn: ut({}, U, {
              value: ie
            }),
            error: ut({}, U, {
              value: Te
            }),
            group: ut({}, U, {
              value: ye
            }),
            groupCollapsed: ut({}, U, {
              value: P
            }),
            groupEnd: ut({}, U, {
              value: re
            })
          });
        }
        Ge < 0 && ee("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var it = Q.ReactCurrentDispatcher, rt;
    function ct(U, ve, Le) {
      {
        if (rt === void 0)
          try {
            throw Error();
          } catch (yt) {
            var He = yt.stack.trim().match(/\n( *(at )?)/);
            rt = He && He[1] || "";
          }
        return `
` + rt + U;
      }
    }
    var wt = !1, qt;
    {
      var Pn = typeof WeakMap == "function" ? WeakMap : Map;
      qt = new Pn();
    }
    function jr(U, ve) {
      if (!U || wt)
        return "";
      {
        var Le = qt.get(U);
        if (Le !== void 0)
          return Le;
      }
      var He;
      wt = !0;
      var yt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ht;
      ht = it.current, it.current = null, be();
      try {
        if (ve) {
          var bt = function() {
            throw Error();
          };
          if (Object.defineProperty(bt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(bt, []);
            } catch (gt) {
              He = gt;
            }
            Reflect.construct(U, [], bt);
          } else {
            try {
              bt.call();
            } catch (gt) {
              He = gt;
            }
            U.call(bt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (gt) {
            He = gt;
          }
          U();
        }
      } catch (gt) {
        if (gt && He && typeof gt.stack == "string") {
          for (var xt = gt.stack.split(`
`), kn = He.stack.split(`
`), on = xt.length - 1, fn = kn.length - 1; on >= 1 && fn >= 0 && xt[on] !== kn[fn]; )
            fn--;
          for (; on >= 1 && fn >= 0; on--, fn--)
            if (xt[on] !== kn[fn]) {
              if (on !== 1 || fn !== 1)
                do
                  if (on--, fn--, fn < 0 || xt[on] !== kn[fn]) {
                    var vr = `
` + xt[on].replace(" at new ", " at ");
                    return U.displayName && vr.includes("<anonymous>") && (vr = vr.replace("<anonymous>", U.displayName)), typeof U == "function" && qt.set(U, vr), vr;
                  }
                while (on >= 1 && fn >= 0);
              break;
            }
        }
      } finally {
        wt = !1, it.current = ht, qe(), Error.prepareStackTrace = yt;
      }
      var hi = U ? U.displayName || U.name : "", vi = hi ? ct(hi) : "";
      return typeof U == "function" && qt.set(U, vi), vi;
    }
    function bn(U, ve, Le) {
      return jr(U, !1);
    }
    function pr(U) {
      var ve = U.prototype;
      return !!(ve && ve.isReactComponent);
    }
    function Xn(U, ve, Le) {
      if (U == null)
        return "";
      if (typeof U == "function")
        return jr(U, pr(U));
      if (typeof U == "string")
        return ct(U);
      switch (U) {
        case T:
          return ct("Suspense");
        case R:
          return ct("SuspenseList");
      }
      if (typeof U == "object")
        switch (U.$$typeof) {
          case x:
            return bn(U.render);
          case O:
            return Xn(U.type, ve, Le);
          case A: {
            var He = U, yt = He._payload, ht = He._init;
            try {
              return Xn(ht(yt), ve, Le);
            } catch {
            }
          }
        }
      return "";
    }
    var Kn = Object.prototype.hasOwnProperty, ra = {}, ji = Q.ReactDebugCurrentFrame;
    function wa(U) {
      if (U) {
        var ve = U._owner, Le = Xn(U.type, U._source, ve ? ve.type : null);
        ji.setExtraStackFrame(Le);
      } else
        ji.setExtraStackFrame(null);
    }
    function ir(U, ve, Le, He, yt) {
      {
        var ht = Function.call.bind(Kn);
        for (var bt in U)
          if (ht(U, bt)) {
            var xt = void 0;
            try {
              if (typeof U[bt] != "function") {
                var kn = Error((He || "React class") + ": " + Le + " type `" + bt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof U[bt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw kn.name = "Invariant Violation", kn;
              }
              xt = U[bt](ve, bt, He, Le, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (on) {
              xt = on;
            }
            xt && !(xt instanceof Error) && (wa(yt), ee("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", He || "React class", Le, bt, typeof xt), wa(null)), xt instanceof Error && !(xt.message in ra) && (ra[xt.message] = !0, wa(yt), ee("Failed %s type: %s", Le, xt.message), wa(null));
          }
      }
    }
    var Rn = Array.isArray;
    function Jn(U) {
      return Rn(U);
    }
    function Dr(U) {
      {
        var ve = typeof Symbol == "function" && Symbol.toStringTag, Le = ve && U[Symbol.toStringTag] || U.constructor.name || "Object";
        return Le;
      }
    }
    function fi(U) {
      try {
        return Fn(U), !1;
      } catch {
        return !0;
      }
    }
    function Fn(U) {
      return "" + U;
    }
    function Or(U) {
      if (fi(U))
        return ee("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Dr(U)), Fn(U);
    }
    var xa = Q.ReactCurrentOwner, di = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Pi, ke;
    function Qe(U) {
      if (Kn.call(U, "ref")) {
        var ve = Object.getOwnPropertyDescriptor(U, "ref").get;
        if (ve && ve.isReactWarning)
          return !1;
      }
      return U.ref !== void 0;
    }
    function Et(U) {
      if (Kn.call(U, "key")) {
        var ve = Object.getOwnPropertyDescriptor(U, "key").get;
        if (ve && ve.isReactWarning)
          return !1;
      }
      return U.key !== void 0;
    }
    function $t(U, ve) {
      typeof U.ref == "string" && xa.current;
    }
    function an(U, ve) {
      {
        var Le = function() {
          Pi || (Pi = !0, ee("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ve));
        };
        Le.isReactWarning = !0, Object.defineProperty(U, "key", {
          get: Le,
          configurable: !0
        });
      }
    }
    function gn(U, ve) {
      {
        var Le = function() {
          ke || (ke = !0, ee("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ve));
        };
        Le.isReactWarning = !0, Object.defineProperty(U, "ref", {
          get: Le,
          configurable: !0
        });
      }
    }
    var cn = function(U, ve, Le, He, yt, ht, bt) {
      var xt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: l,
        // Built-in properties that belong on the element
        type: U,
        key: ve,
        ref: Le,
        props: bt,
        // Record the component responsible for creating this element.
        _owner: ht
      };
      return xt._store = {}, Object.defineProperty(xt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(xt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: He
      }), Object.defineProperty(xt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: yt
      }), Object.freeze && (Object.freeze(xt.props), Object.freeze(xt)), xt;
    };
    function lr(U, ve, Le, He, yt) {
      {
        var ht, bt = {}, xt = null, kn = null;
        Le !== void 0 && (Or(Le), xt = "" + Le), Et(ve) && (Or(ve.key), xt = "" + ve.key), Qe(ve) && (kn = ve.ref, $t(ve, yt));
        for (ht in ve)
          Kn.call(ve, ht) && !di.hasOwnProperty(ht) && (bt[ht] = ve[ht]);
        if (U && U.defaultProps) {
          var on = U.defaultProps;
          for (ht in on)
            bt[ht] === void 0 && (bt[ht] = on[ht]);
        }
        if (xt || kn) {
          var fn = typeof U == "function" ? U.displayName || U.name || "Unknown" : U;
          xt && an(bt, fn), kn && gn(bt, fn);
        }
        return cn(U, xt, kn, yt, He, xa.current, bt);
      }
    }
    var ln = Q.ReactCurrentOwner, Qt = Q.ReactDebugCurrentFrame;
    function Xt(U) {
      if (U) {
        var ve = U._owner, Le = Xn(U.type, U._source, ve ? ve.type : null);
        Qt.setExtraStackFrame(Le);
      } else
        Qt.setExtraStackFrame(null);
    }
    var Ta;
    Ta = !1;
    function Lr(U) {
      return typeof U == "object" && U !== null && U.$$typeof === l;
    }
    function Fa() {
      {
        if (ln.current) {
          var U = Re(ln.current.type);
          if (U)
            return `

Check the render method of \`` + U + "`.";
        }
        return "";
      }
    }
    function ml(U) {
      return "";
    }
    var zo = {};
    function Uo(U) {
      {
        var ve = Fa();
        if (!ve) {
          var Le = typeof U == "string" ? U : U.displayName || U.name;
          Le && (ve = `

Check the top-level render call using <` + Le + ">.");
        }
        return ve;
      }
    }
    function Yl(U, ve) {
      {
        if (!U._store || U._store.validated || U.key != null)
          return;
        U._store.validated = !0;
        var Le = Uo(ve);
        if (zo[Le])
          return;
        zo[Le] = !0;
        var He = "";
        U && U._owner && U._owner !== ln.current && (He = " It was passed a child from " + Re(U._owner.type) + "."), Xt(U), ee('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Le, He), Xt(null);
      }
    }
    function $l(U, ve) {
      {
        if (typeof U != "object")
          return;
        if (Jn(U))
          for (var Le = 0; Le < U.length; Le++) {
            var He = U[Le];
            Lr(He) && Yl(He, ve);
          }
        else if (Lr(U))
          U._store && (U._store.validated = !0);
        else if (U) {
          var yt = B(U);
          if (typeof yt == "function" && yt !== U.entries)
            for (var ht = yt.call(U), bt; !(bt = ht.next()).done; )
              Lr(bt.value) && Yl(bt.value, ve);
        }
      }
    }
    function jo(U) {
      {
        var ve = U.type;
        if (ve == null || typeof ve == "string")
          return;
        var Le;
        if (typeof ve == "function")
          Le = ve.propTypes;
        else if (typeof ve == "object" && (ve.$$typeof === x || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ve.$$typeof === O))
          Le = ve.propTypes;
        else
          return;
        if (Le) {
          var He = Re(ve);
          ir(Le, U.props, "prop", He, U);
        } else if (ve.PropTypes !== void 0 && !Ta) {
          Ta = !0;
          var yt = Re(ve);
          ee("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", yt || "Unknown");
        }
        typeof ve.getDefaultProps == "function" && !ve.getDefaultProps.isReactClassApproved && ee("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Pr(U) {
      {
        for (var ve = Object.keys(U.props), Le = 0; Le < ve.length; Le++) {
          var He = ve[Le];
          if (He !== "children" && He !== "key") {
            Xt(U), ee("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", He), Xt(null);
            break;
          }
        }
        U.ref !== null && (Xt(U), ee("Invalid attribute `ref` supplied to `React.Fragment`."), Xt(null));
      }
    }
    var Fr = {};
    function hr(U, ve, Le, He, yt, ht) {
      {
        var bt = Ye(U);
        if (!bt) {
          var xt = "";
          (U === void 0 || typeof U == "object" && U !== null && Object.keys(U).length === 0) && (xt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var kn = ml();
          kn ? xt += kn : xt += Fa();
          var on;
          U === null ? on = "null" : Jn(U) ? on = "array" : U !== void 0 && U.$$typeof === l ? (on = "<" + (Re(U.type) || "Unknown") + " />", xt = " Did you accidentally export a JSX literal instead of a component?") : on = typeof U, ee("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", on, xt);
        }
        var fn = lr(U, ve, Le, yt, ht);
        if (fn == null)
          return fn;
        if (bt) {
          var vr = ve.children;
          if (vr !== void 0)
            if (He)
              if (Jn(vr)) {
                for (var hi = 0; hi < vr.length; hi++)
                  $l(vr[hi], U);
                Object.freeze && Object.freeze(vr);
              } else
                ee("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              $l(vr, U);
        }
        if (Kn.call(ve, "key")) {
          var vi = Re(U), gt = Object.keys(ve).filter(function(Po) {
            return Po !== "key";
          }), St = gt.length > 0 ? "{key: someKey, " + gt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Fr[vi + St]) {
            var mi = gt.length > 0 ? "{" + gt.join(": ..., ") + ": ...}" : "{}";
            ee(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, St, vi, mi, vi), Fr[vi + St] = !0;
          }
        }
        return U === f ? Pr(fn) : jo(fn), fn;
      }
    }
    function Fi(U, ve, Le) {
      return hr(U, ve, Le, !0);
    }
    function pi(U, ve, Le) {
      return hr(U, ve, Le, !1);
    }
    var Hi = pi, Ii = Fi;
    Cv.Fragment = f, Cv.jsx = Hi, Cv.jsxs = Ii;
  }()), Cv;
}
process.env.NODE_ENV === "production" ? ME.exports = aN() : ME.exports = iN();
var Y = ME.exports, AE = { exports: {} }, ai = {}, Og = { exports: {} }, yE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cT;
function lN() {
  return cT || (cT = 1, function(g) {
    function l(ie, Te) {
      var ye = ie.length;
      ie.push(Te);
      e: for (; 0 < ye; ) {
        var P = ye - 1 >>> 1, re = ie[P];
        if (0 < p(re, Te)) ie[P] = Te, ie[ye] = re, ye = P;
        else break e;
      }
    }
    function s(ie) {
      return ie.length === 0 ? null : ie[0];
    }
    function f(ie) {
      if (ie.length === 0) return null;
      var Te = ie[0], ye = ie.pop();
      if (ye !== Te) {
        ie[0] = ye;
        e: for (var P = 0, re = ie.length, Pe = re >>> 1; P < Pe; ) {
          var be = 2 * (P + 1) - 1, qe = ie[be], it = be + 1, rt = ie[it];
          if (0 > p(qe, ye)) it < re && 0 > p(rt, qe) ? (ie[P] = rt, ie[it] = ye, P = it) : (ie[P] = qe, ie[be] = ye, P = be);
          else if (it < re && 0 > p(rt, ye)) ie[P] = rt, ie[it] = ye, P = it;
          else break e;
        }
      }
      return Te;
    }
    function p(ie, Te) {
      var ye = ie.sortIndex - Te.sortIndex;
      return ye !== 0 ? ye : ie.id - Te.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var y = performance;
      g.unstable_now = function() {
        return y.now();
      };
    } else {
      var h = Date, E = h.now();
      g.unstable_now = function() {
        return h.now() - E;
      };
    }
    var x = [], T = [], R = 1, O = null, A = 3, L = !1, V = !1, N = !1, B = typeof setTimeout == "function" ? setTimeout : null, Q = typeof clearTimeout == "function" ? clearTimeout : null, ee = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ne(ie) {
      for (var Te = s(T); Te !== null; ) {
        if (Te.callback === null) f(T);
        else if (Te.startTime <= ie) f(T), Te.sortIndex = Te.expirationTime, l(x, Te);
        else break;
        Te = s(T);
      }
    }
    function se(ie) {
      if (N = !1, ne(ie), !V) if (s(x) !== null) V = !0, he(W);
      else {
        var Te = s(T);
        Te !== null && ce(se, Te.startTime - ie);
      }
    }
    function W(ie, Te) {
      V = !1, N && (N = !1, Q(Ee), Ee = -1), L = !0;
      var ye = A;
      try {
        for (ne(Te), O = s(x); O !== null && (!(O.expirationTime > Te) || ie && !Ke()); ) {
          var P = O.callback;
          if (typeof P == "function") {
            O.callback = null, A = O.priorityLevel;
            var re = P(O.expirationTime <= Te);
            Te = g.unstable_now(), typeof re == "function" ? O.callback = re : O === s(x) && f(x), ne(Te);
          } else f(x);
          O = s(x);
        }
        if (O !== null) var Pe = !0;
        else {
          var be = s(T);
          be !== null && ce(se, be.startTime - Te), Pe = !1;
        }
        return Pe;
      } finally {
        O = null, A = ye, L = !1;
      }
    }
    var de = !1, ue = null, Ee = -1, fe = 5, Ye = -1;
    function Ke() {
      return !(g.unstable_now() - Ye < fe);
    }
    function We() {
      if (ue !== null) {
        var ie = g.unstable_now();
        Ye = ie;
        var Te = !0;
        try {
          Te = ue(!0, ie);
        } finally {
          Te ? Re() : (de = !1, ue = null);
        }
      } else de = !1;
    }
    var Re;
    if (typeof ee == "function") Re = function() {
      ee(We);
    };
    else if (typeof MessageChannel < "u") {
      var ut = new MessageChannel(), Ge = ut.port2;
      ut.port1.onmessage = We, Re = function() {
        Ge.postMessage(null);
      };
    } else Re = function() {
      B(We, 0);
    };
    function he(ie) {
      ue = ie, de || (de = !0, Re());
    }
    function ce(ie, Te) {
      Ee = B(function() {
        ie(g.unstable_now());
      }, Te);
    }
    g.unstable_IdlePriority = 5, g.unstable_ImmediatePriority = 1, g.unstable_LowPriority = 4, g.unstable_NormalPriority = 3, g.unstable_Profiling = null, g.unstable_UserBlockingPriority = 2, g.unstable_cancelCallback = function(ie) {
      ie.callback = null;
    }, g.unstable_continueExecution = function() {
      V || L || (V = !0, he(W));
    }, g.unstable_forceFrameRate = function(ie) {
      0 > ie || 125 < ie ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : fe = 0 < ie ? Math.floor(1e3 / ie) : 5;
    }, g.unstable_getCurrentPriorityLevel = function() {
      return A;
    }, g.unstable_getFirstCallbackNode = function() {
      return s(x);
    }, g.unstable_next = function(ie) {
      switch (A) {
        case 1:
        case 2:
        case 3:
          var Te = 3;
          break;
        default:
          Te = A;
      }
      var ye = A;
      A = Te;
      try {
        return ie();
      } finally {
        A = ye;
      }
    }, g.unstable_pauseExecution = function() {
    }, g.unstable_requestPaint = function() {
    }, g.unstable_runWithPriority = function(ie, Te) {
      switch (ie) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          ie = 3;
      }
      var ye = A;
      A = ie;
      try {
        return Te();
      } finally {
        A = ye;
      }
    }, g.unstable_scheduleCallback = function(ie, Te, ye) {
      var P = g.unstable_now();
      switch (typeof ye == "object" && ye !== null ? (ye = ye.delay, ye = typeof ye == "number" && 0 < ye ? P + ye : P) : ye = P, ie) {
        case 1:
          var re = -1;
          break;
        case 2:
          re = 250;
          break;
        case 5:
          re = 1073741823;
          break;
        case 4:
          re = 1e4;
          break;
        default:
          re = 5e3;
      }
      return re = ye + re, ie = { id: R++, callback: Te, priorityLevel: ie, startTime: ye, expirationTime: re, sortIndex: -1 }, ye > P ? (ie.sortIndex = ye, l(T, ie), s(x) === null && ie === s(T) && (N ? (Q(Ee), Ee = -1) : N = !0, ce(se, ye - P))) : (ie.sortIndex = re, l(x, ie), V || L || (V = !0, he(W))), ie;
    }, g.unstable_shouldYield = Ke, g.unstable_wrapCallback = function(ie) {
      var Te = A;
      return function() {
        var ye = A;
        A = Te;
        try {
          return ie.apply(this, arguments);
        } finally {
          A = ye;
        }
      };
    };
  }(yE)), yE;
}
var gE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fT;
function oN() {
  return fT || (fT = 1, function(g) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var l = !1, s = 5;
      function f(ke, Qe) {
        var Et = ke.length;
        ke.push(Qe), h(ke, Qe, Et);
      }
      function p(ke) {
        return ke.length === 0 ? null : ke[0];
      }
      function y(ke) {
        if (ke.length === 0)
          return null;
        var Qe = ke[0], Et = ke.pop();
        return Et !== Qe && (ke[0] = Et, E(ke, Et, 0)), Qe;
      }
      function h(ke, Qe, Et) {
        for (var $t = Et; $t > 0; ) {
          var an = $t - 1 >>> 1, gn = ke[an];
          if (x(gn, Qe) > 0)
            ke[an] = Qe, ke[$t] = gn, $t = an;
          else
            return;
        }
      }
      function E(ke, Qe, Et) {
        for (var $t = Et, an = ke.length, gn = an >>> 1; $t < gn; ) {
          var cn = ($t + 1) * 2 - 1, lr = ke[cn], ln = cn + 1, Qt = ke[ln];
          if (x(lr, Qe) < 0)
            ln < an && x(Qt, lr) < 0 ? (ke[$t] = Qt, ke[ln] = Qe, $t = ln) : (ke[$t] = lr, ke[cn] = Qe, $t = cn);
          else if (ln < an && x(Qt, Qe) < 0)
            ke[$t] = Qt, ke[ln] = Qe, $t = ln;
          else
            return;
        }
      }
      function x(ke, Qe) {
        var Et = ke.sortIndex - Qe.sortIndex;
        return Et !== 0 ? Et : ke.id - Qe.id;
      }
      var T = 1, R = 2, O = 3, A = 4, L = 5;
      function V(ke, Qe) {
      }
      var N = typeof performance == "object" && typeof performance.now == "function";
      if (N) {
        var B = performance;
        g.unstable_now = function() {
          return B.now();
        };
      } else {
        var Q = Date, ee = Q.now();
        g.unstable_now = function() {
          return Q.now() - ee;
        };
      }
      var ne = 1073741823, se = -1, W = 250, de = 5e3, ue = 1e4, Ee = ne, fe = [], Ye = [], Ke = 1, We = null, Re = O, ut = !1, Ge = !1, he = !1, ce = typeof setTimeout == "function" ? setTimeout : null, ie = typeof clearTimeout == "function" ? clearTimeout : null, Te = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ye(ke) {
        for (var Qe = p(Ye); Qe !== null; ) {
          if (Qe.callback === null)
            y(Ye);
          else if (Qe.startTime <= ke)
            y(Ye), Qe.sortIndex = Qe.expirationTime, f(fe, Qe);
          else
            return;
          Qe = p(Ye);
        }
      }
      function P(ke) {
        if (he = !1, ye(ke), !Ge)
          if (p(fe) !== null)
            Ge = !0, Fn(re);
          else {
            var Qe = p(Ye);
            Qe !== null && Or(P, Qe.startTime - ke);
          }
      }
      function re(ke, Qe) {
        Ge = !1, he && (he = !1, xa()), ut = !0;
        var Et = Re;
        try {
          var $t;
          if (!l) return Pe(ke, Qe);
        } finally {
          We = null, Re = Et, ut = !1;
        }
      }
      function Pe(ke, Qe) {
        var Et = Qe;
        for (ye(Et), We = p(fe); We !== null && !(We.expirationTime > Et && (!ke || ji())); ) {
          var $t = We.callback;
          if (typeof $t == "function") {
            We.callback = null, Re = We.priorityLevel;
            var an = We.expirationTime <= Et, gn = $t(an);
            Et = g.unstable_now(), typeof gn == "function" ? We.callback = gn : We === p(fe) && y(fe), ye(Et);
          } else
            y(fe);
          We = p(fe);
        }
        if (We !== null)
          return !0;
        var cn = p(Ye);
        return cn !== null && Or(P, cn.startTime - Et), !1;
      }
      function be(ke, Qe) {
        switch (ke) {
          case T:
          case R:
          case O:
          case A:
          case L:
            break;
          default:
            ke = O;
        }
        var Et = Re;
        Re = ke;
        try {
          return Qe();
        } finally {
          Re = Et;
        }
      }
      function qe(ke) {
        var Qe;
        switch (Re) {
          case T:
          case R:
          case O:
            Qe = O;
            break;
          default:
            Qe = Re;
            break;
        }
        var Et = Re;
        Re = Qe;
        try {
          return ke();
        } finally {
          Re = Et;
        }
      }
      function it(ke) {
        var Qe = Re;
        return function() {
          var Et = Re;
          Re = Qe;
          try {
            return ke.apply(this, arguments);
          } finally {
            Re = Et;
          }
        };
      }
      function rt(ke, Qe, Et) {
        var $t = g.unstable_now(), an;
        if (typeof Et == "object" && Et !== null) {
          var gn = Et.delay;
          typeof gn == "number" && gn > 0 ? an = $t + gn : an = $t;
        } else
          an = $t;
        var cn;
        switch (ke) {
          case T:
            cn = se;
            break;
          case R:
            cn = W;
            break;
          case L:
            cn = Ee;
            break;
          case A:
            cn = ue;
            break;
          case O:
          default:
            cn = de;
            break;
        }
        var lr = an + cn, ln = {
          id: Ke++,
          callback: Qe,
          priorityLevel: ke,
          startTime: an,
          expirationTime: lr,
          sortIndex: -1
        };
        return an > $t ? (ln.sortIndex = an, f(Ye, ln), p(fe) === null && ln === p(Ye) && (he ? xa() : he = !0, Or(P, an - $t))) : (ln.sortIndex = lr, f(fe, ln), !Ge && !ut && (Ge = !0, Fn(re))), ln;
      }
      function ct() {
      }
      function wt() {
        !Ge && !ut && (Ge = !0, Fn(re));
      }
      function qt() {
        return p(fe);
      }
      function Pn(ke) {
        ke.callback = null;
      }
      function jr() {
        return Re;
      }
      var bn = !1, pr = null, Xn = -1, Kn = s, ra = -1;
      function ji() {
        var ke = g.unstable_now() - ra;
        return !(ke < Kn);
      }
      function wa() {
      }
      function ir(ke) {
        if (ke < 0 || ke > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ke > 0 ? Kn = Math.floor(1e3 / ke) : Kn = s;
      }
      var Rn = function() {
        if (pr !== null) {
          var ke = g.unstable_now();
          ra = ke;
          var Qe = !0, Et = !0;
          try {
            Et = pr(Qe, ke);
          } finally {
            Et ? Jn() : (bn = !1, pr = null);
          }
        } else
          bn = !1;
      }, Jn;
      if (typeof Te == "function")
        Jn = function() {
          Te(Rn);
        };
      else if (typeof MessageChannel < "u") {
        var Dr = new MessageChannel(), fi = Dr.port2;
        Dr.port1.onmessage = Rn, Jn = function() {
          fi.postMessage(null);
        };
      } else
        Jn = function() {
          ce(Rn, 0);
        };
      function Fn(ke) {
        pr = ke, bn || (bn = !0, Jn());
      }
      function Or(ke, Qe) {
        Xn = ce(function() {
          ke(g.unstable_now());
        }, Qe);
      }
      function xa() {
        ie(Xn), Xn = -1;
      }
      var di = wa, Pi = null;
      g.unstable_IdlePriority = L, g.unstable_ImmediatePriority = T, g.unstable_LowPriority = A, g.unstable_NormalPriority = O, g.unstable_Profiling = Pi, g.unstable_UserBlockingPriority = R, g.unstable_cancelCallback = Pn, g.unstable_continueExecution = wt, g.unstable_forceFrameRate = ir, g.unstable_getCurrentPriorityLevel = jr, g.unstable_getFirstCallbackNode = qt, g.unstable_next = qe, g.unstable_pauseExecution = ct, g.unstable_requestPaint = di, g.unstable_runWithPriority = be, g.unstable_scheduleCallback = rt, g.unstable_shouldYield = ji, g.unstable_wrapCallback = it, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(gE)), gE;
}
var dT;
function BT() {
  return dT || (dT = 1, process.env.NODE_ENV === "production" ? Og.exports = lN() : Og.exports = oN()), Og.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pT;
function uN() {
  if (pT) return ai;
  pT = 1;
  var g = Ut, l = BT();
  function s(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, o = 1; o < arguments.length; o++) r += "&args[]=" + encodeURIComponent(arguments[o]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var f = /* @__PURE__ */ new Set(), p = {};
  function y(n, r) {
    h(n, r), h(n + "Capture", r);
  }
  function h(n, r) {
    for (p[n] = r, n = 0; n < r.length; n++) f.add(r[n]);
  }
  var E = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), x = Object.prototype.hasOwnProperty, T = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, R = {}, O = {};
  function A(n) {
    return x.call(O, n) ? !0 : x.call(R, n) ? !1 : T.test(n) ? O[n] = !0 : (R[n] = !0, !1);
  }
  function L(n, r, o, c) {
    if (o !== null && o.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return c ? !1 : o !== null ? !o.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function V(n, r, o, c) {
    if (r === null || typeof r > "u" || L(n, r, o, c)) return !0;
    if (c) return !1;
    if (o !== null) switch (o.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function N(n, r, o, c, v, _, b) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = c, this.attributeNamespace = v, this.mustUseProperty = o, this.propertyName = n, this.type = r, this.sanitizeURL = _, this.removeEmptyString = b;
  }
  var B = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    B[n] = new N(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    B[r] = new N(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    B[n] = new N(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    B[n] = new N(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    B[n] = new N(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    B[n] = new N(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    B[n] = new N(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    B[n] = new N(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    B[n] = new N(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Q = /[\-:]([a-z])/g;
  function ee(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Q,
      ee
    );
    B[r] = new N(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Q, ee);
    B[r] = new N(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Q, ee);
    B[r] = new N(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    B[n] = new N(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), B.xlinkHref = new N("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    B[n] = new N(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ne(n, r, o, c) {
    var v = B.hasOwnProperty(r) ? B[r] : null;
    (v !== null ? v.type !== 0 : c || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (V(r, o, v, c) && (o = null), c || v === null ? A(r) && (o === null ? n.removeAttribute(r) : n.setAttribute(r, "" + o)) : v.mustUseProperty ? n[v.propertyName] = o === null ? v.type === 3 ? !1 : "" : o : (r = v.attributeName, c = v.attributeNamespace, o === null ? n.removeAttribute(r) : (v = v.type, o = v === 3 || v === 4 && o === !0 ? "" : "" + o, c ? n.setAttributeNS(c, r, o) : n.setAttribute(r, o))));
  }
  var se = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, W = Symbol.for("react.element"), de = Symbol.for("react.portal"), ue = Symbol.for("react.fragment"), Ee = Symbol.for("react.strict_mode"), fe = Symbol.for("react.profiler"), Ye = Symbol.for("react.provider"), Ke = Symbol.for("react.context"), We = Symbol.for("react.forward_ref"), Re = Symbol.for("react.suspense"), ut = Symbol.for("react.suspense_list"), Ge = Symbol.for("react.memo"), he = Symbol.for("react.lazy"), ce = Symbol.for("react.offscreen"), ie = Symbol.iterator;
  function Te(n) {
    return n === null || typeof n != "object" ? null : (n = ie && n[ie] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ye = Object.assign, P;
  function re(n) {
    if (P === void 0) try {
      throw Error();
    } catch (o) {
      var r = o.stack.trim().match(/\n( *(at )?)/);
      P = r && r[1] || "";
    }
    return `
` + P + n;
  }
  var Pe = !1;
  function be(n, r) {
    if (!n || Pe) return "";
    Pe = !0;
    var o = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (Z) {
          var c = Z;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (Z) {
          c = Z;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (Z) {
          c = Z;
        }
        n();
      }
    } catch (Z) {
      if (Z && c && typeof Z.stack == "string") {
        for (var v = Z.stack.split(`
`), _ = c.stack.split(`
`), b = v.length - 1, M = _.length - 1; 1 <= b && 0 <= M && v[b] !== _[M]; ) M--;
        for (; 1 <= b && 0 <= M; b--, M--) if (v[b] !== _[M]) {
          if (b !== 1 || M !== 1)
            do
              if (b--, M--, 0 > M || v[b] !== _[M]) {
                var j = `
` + v[b].replace(" at new ", " at ");
                return n.displayName && j.includes("<anonymous>") && (j = j.replace("<anonymous>", n.displayName)), j;
              }
            while (1 <= b && 0 <= M);
          break;
        }
      }
    } finally {
      Pe = !1, Error.prepareStackTrace = o;
    }
    return (n = n ? n.displayName || n.name : "") ? re(n) : "";
  }
  function qe(n) {
    switch (n.tag) {
      case 5:
        return re(n.type);
      case 16:
        return re("Lazy");
      case 13:
        return re("Suspense");
      case 19:
        return re("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = be(n.type, !1), n;
      case 11:
        return n = be(n.type.render, !1), n;
      case 1:
        return n = be(n.type, !0), n;
      default:
        return "";
    }
  }
  function it(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case ue:
        return "Fragment";
      case de:
        return "Portal";
      case fe:
        return "Profiler";
      case Ee:
        return "StrictMode";
      case Re:
        return "Suspense";
      case ut:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Ke:
        return (n.displayName || "Context") + ".Consumer";
      case Ye:
        return (n._context.displayName || "Context") + ".Provider";
      case We:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Ge:
        return r = n.displayName || null, r !== null ? r : it(n.type) || "Memo";
      case he:
        r = n._payload, n = n._init;
        try {
          return it(n(r));
        } catch {
        }
    }
    return null;
  }
  function rt(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return it(r);
      case 8:
        return r === Ee ? "StrictMode" : "Mode";
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
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function ct(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function wt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function qt(n) {
    var r = wt(n) ? "checked" : "value", o = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), c = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
      var v = o.get, _ = o.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return v.call(this);
      }, set: function(b) {
        c = "" + b, _.call(this, b);
      } }), Object.defineProperty(n, r, { enumerable: o.enumerable }), { getValue: function() {
        return c;
      }, setValue: function(b) {
        c = "" + b;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Pn(n) {
    n._valueTracker || (n._valueTracker = qt(n));
  }
  function jr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var o = r.getValue(), c = "";
    return n && (c = wt(n) ? n.checked ? "true" : "false" : n.value), n = c, n !== o ? (r.setValue(n), !0) : !1;
  }
  function bn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function pr(n, r) {
    var o = r.checked;
    return ye({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: o ?? n._wrapperState.initialChecked });
  }
  function Xn(n, r) {
    var o = r.defaultValue == null ? "" : r.defaultValue, c = r.checked != null ? r.checked : r.defaultChecked;
    o = ct(r.value != null ? r.value : o), n._wrapperState = { initialChecked: c, initialValue: o, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Kn(n, r) {
    r = r.checked, r != null && ne(n, "checked", r, !1);
  }
  function ra(n, r) {
    Kn(n, r);
    var o = ct(r.value), c = r.type;
    if (o != null) c === "number" ? (o === 0 && n.value === "" || n.value != o) && (n.value = "" + o) : n.value !== "" + o && (n.value = "" + o);
    else if (c === "submit" || c === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? wa(n, r.type, o) : r.hasOwnProperty("defaultValue") && wa(n, r.type, ct(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function ji(n, r, o) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var c = r.type;
      if (!(c !== "submit" && c !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, o || r === n.value || (n.value = r), n.defaultValue = r;
    }
    o = n.name, o !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, o !== "" && (n.name = o);
  }
  function wa(n, r, o) {
    (r !== "number" || bn(n.ownerDocument) !== n) && (o == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + o && (n.defaultValue = "" + o));
  }
  var ir = Array.isArray;
  function Rn(n, r, o, c) {
    if (n = n.options, r) {
      r = {};
      for (var v = 0; v < o.length; v++) r["$" + o[v]] = !0;
      for (o = 0; o < n.length; o++) v = r.hasOwnProperty("$" + n[o].value), n[o].selected !== v && (n[o].selected = v), v && c && (n[o].defaultSelected = !0);
    } else {
      for (o = "" + ct(o), r = null, v = 0; v < n.length; v++) {
        if (n[v].value === o) {
          n[v].selected = !0, c && (n[v].defaultSelected = !0);
          return;
        }
        r !== null || n[v].disabled || (r = n[v]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Jn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(s(91));
    return ye({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Dr(n, r) {
    var o = r.value;
    if (o == null) {
      if (o = r.children, r = r.defaultValue, o != null) {
        if (r != null) throw Error(s(92));
        if (ir(o)) {
          if (1 < o.length) throw Error(s(93));
          o = o[0];
        }
        r = o;
      }
      r == null && (r = ""), o = r;
    }
    n._wrapperState = { initialValue: ct(o) };
  }
  function fi(n, r) {
    var o = ct(r.value), c = ct(r.defaultValue);
    o != null && (o = "" + o, o !== n.value && (n.value = o), r.defaultValue == null && n.defaultValue !== o && (n.defaultValue = o)), c != null && (n.defaultValue = "" + c);
  }
  function Fn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Or(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function xa(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Or(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var di, Pi = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, o, c, v) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, o, c, v);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (di = di || document.createElement("div"), di.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = di.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function ke(n, r) {
    if (r) {
      var o = n.firstChild;
      if (o && o === n.lastChild && o.nodeType === 3) {
        o.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Qe = {
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
  }, Et = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Qe).forEach(function(n) {
    Et.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Qe[r] = Qe[n];
    });
  });
  function $t(n, r, o) {
    return r == null || typeof r == "boolean" || r === "" ? "" : o || typeof r != "number" || r === 0 || Qe.hasOwnProperty(n) && Qe[n] ? ("" + r).trim() : r + "px";
  }
  function an(n, r) {
    n = n.style;
    for (var o in r) if (r.hasOwnProperty(o)) {
      var c = o.indexOf("--") === 0, v = $t(o, r[o], c);
      o === "float" && (o = "cssFloat"), c ? n.setProperty(o, v) : n[o] = v;
    }
  }
  var gn = ye({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function cn(n, r) {
    if (r) {
      if (gn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(s(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(s(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(s(62));
    }
  }
  function lr(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
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
  var ln = null;
  function Qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Xt = null, Ta = null, Lr = null;
  function Fa(n) {
    if (n = Ze(n)) {
      if (typeof Xt != "function") throw Error(s(280));
      var r = n.stateNode;
      r && (r = Sn(r), Xt(n.stateNode, n.type, r));
    }
  }
  function ml(n) {
    Ta ? Lr ? Lr.push(n) : Lr = [n] : Ta = n;
  }
  function zo() {
    if (Ta) {
      var n = Ta, r = Lr;
      if (Lr = Ta = null, Fa(n), r) for (n = 0; n < r.length; n++) Fa(r[n]);
    }
  }
  function Uo(n, r) {
    return n(r);
  }
  function Yl() {
  }
  var $l = !1;
  function jo(n, r, o) {
    if ($l) return n(r, o);
    $l = !0;
    try {
      return Uo(n, r, o);
    } finally {
      $l = !1, (Ta !== null || Lr !== null) && (Yl(), zo());
    }
  }
  function Pr(n, r) {
    var o = n.stateNode;
    if (o === null) return null;
    var c = Sn(o);
    if (c === null) return null;
    o = c[r];
    e: switch (r) {
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
        (c = !c.disabled) || (n = n.type, c = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !c;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (o && typeof o != "function") throw Error(s(231, r, typeof o));
    return o;
  }
  var Fr = !1;
  if (E) try {
    var hr = {};
    Object.defineProperty(hr, "passive", { get: function() {
      Fr = !0;
    } }), window.addEventListener("test", hr, hr), window.removeEventListener("test", hr, hr);
  } catch {
    Fr = !1;
  }
  function Fi(n, r, o, c, v, _, b, M, j) {
    var Z = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(o, Z);
    } catch (_e) {
      this.onError(_e);
    }
  }
  var pi = !1, Hi = null, Ii = !1, U = null, ve = { onError: function(n) {
    pi = !0, Hi = n;
  } };
  function Le(n, r, o, c, v, _, b, M, j) {
    pi = !1, Hi = null, Fi.apply(ve, arguments);
  }
  function He(n, r, o, c, v, _, b, M, j) {
    if (Le.apply(this, arguments), pi) {
      if (pi) {
        var Z = Hi;
        pi = !1, Hi = null;
      } else throw Error(s(198));
      Ii || (Ii = !0, U = Z);
    }
  }
  function yt(n) {
    var r = n, o = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (o = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? o : null;
  }
  function ht(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function bt(n) {
    if (yt(n) !== n) throw Error(s(188));
  }
  function xt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = yt(n), r === null) throw Error(s(188));
      return r !== n ? null : n;
    }
    for (var o = n, c = r; ; ) {
      var v = o.return;
      if (v === null) break;
      var _ = v.alternate;
      if (_ === null) {
        if (c = v.return, c !== null) {
          o = c;
          continue;
        }
        break;
      }
      if (v.child === _.child) {
        for (_ = v.child; _; ) {
          if (_ === o) return bt(v), n;
          if (_ === c) return bt(v), r;
          _ = _.sibling;
        }
        throw Error(s(188));
      }
      if (o.return !== c.return) o = v, c = _;
      else {
        for (var b = !1, M = v.child; M; ) {
          if (M === o) {
            b = !0, o = v, c = _;
            break;
          }
          if (M === c) {
            b = !0, c = v, o = _;
            break;
          }
          M = M.sibling;
        }
        if (!b) {
          for (M = _.child; M; ) {
            if (M === o) {
              b = !0, o = _, c = v;
              break;
            }
            if (M === c) {
              b = !0, c = _, o = v;
              break;
            }
            M = M.sibling;
          }
          if (!b) throw Error(s(189));
        }
      }
      if (o.alternate !== c) throw Error(s(190));
    }
    if (o.tag !== 3) throw Error(s(188));
    return o.stateNode.current === o ? n : r;
  }
  function kn(n) {
    return n = xt(n), n !== null ? on(n) : null;
  }
  function on(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = on(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var fn = l.unstable_scheduleCallback, vr = l.unstable_cancelCallback, hi = l.unstable_shouldYield, vi = l.unstable_requestPaint, gt = l.unstable_now, St = l.unstable_getCurrentPriorityLevel, mi = l.unstable_ImmediatePriority, Po = l.unstable_UserBlockingPriority, Fo = l.unstable_NormalPriority, Wl = l.unstable_LowPriority, Nu = l.unstable_IdlePriority, Gl = null, aa = null;
  function Is(n) {
    if (aa && typeof aa.onCommitFiberRoot == "function") try {
      aa.onCommitFiberRoot(Gl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Hr = Math.clz32 ? Math.clz32 : Au, mf = Math.log, yf = Math.LN2;
  function Au(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (mf(n) / yf | 0) | 0;
  }
  var ql = 64, ba = 4194304;
  function yi(n) {
    switch (n & -n) {
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
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function gi(n, r) {
    var o = n.pendingLanes;
    if (o === 0) return 0;
    var c = 0, v = n.suspendedLanes, _ = n.pingedLanes, b = o & 268435455;
    if (b !== 0) {
      var M = b & ~v;
      M !== 0 ? c = yi(M) : (_ &= b, _ !== 0 && (c = yi(_)));
    } else b = o & ~v, b !== 0 ? c = yi(b) : _ !== 0 && (c = yi(_));
    if (c === 0) return 0;
    if (r !== 0 && r !== c && !(r & v) && (v = c & -c, _ = r & -r, v >= _ || v === 16 && (_ & 4194240) !== 0)) return r;
    if (c & 4 && (c |= o & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= c; 0 < r; ) o = 31 - Hr(r), v = 1 << o, c |= n[o], r &= ~v;
    return c;
  }
  function zu(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
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
        return r + 5e3;
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
  function Ho(n, r) {
    for (var o = n.suspendedLanes, c = n.pingedLanes, v = n.expirationTimes, _ = n.pendingLanes; 0 < _; ) {
      var b = 31 - Hr(_), M = 1 << b, j = v[b];
      j === -1 ? (!(M & o) || M & c) && (v[b] = zu(M, r)) : j <= r && (n.expiredLanes |= M), _ &= ~M;
    }
  }
  function Ql(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Uu() {
    var n = ql;
    return ql <<= 1, !(ql & 4194240) && (ql = 64), n;
  }
  function ju(n) {
    for (var r = [], o = 0; 31 > o; o++) r.push(n);
    return r;
  }
  function yl(n, r, o) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Hr(r), n[r] = o;
  }
  function mp(n, r) {
    var o = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var c = n.eventTimes;
    for (n = n.expirationTimes; 0 < o; ) {
      var v = 31 - Hr(o), _ = 1 << v;
      r[v] = 0, c[v] = -1, n[v] = -1, o &= ~_;
    }
  }
  function gl(n, r) {
    var o = n.entangledLanes |= r;
    for (n = n.entanglements; o; ) {
      var c = 31 - Hr(o), v = 1 << c;
      v & r | n[c] & r && (n[c] |= r), o &= ~v;
    }
  }
  var Ft = 0;
  function Pu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var At, Vs, Vi, pt, Fu, mr = !1, Bi = [], Ir = null, Yi = null, dn = null, Kt = /* @__PURE__ */ new Map(), Xl = /* @__PURE__ */ new Map(), Zn = [], Vr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ha(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Ir = null;
        break;
      case "dragenter":
      case "dragleave":
        Yi = null;
        break;
      case "mouseover":
      case "mouseout":
        dn = null;
        break;
      case "pointerover":
      case "pointerout":
        Kt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Xl.delete(r.pointerId);
    }
  }
  function Io(n, r, o, c, v, _) {
    return n === null || n.nativeEvent !== _ ? (n = { blockedOn: r, domEventName: o, eventSystemFlags: c, nativeEvent: _, targetContainers: [v] }, r !== null && (r = Ze(r), r !== null && Vs(r)), n) : (n.eventSystemFlags |= c, r = n.targetContainers, v !== null && r.indexOf(v) === -1 && r.push(v), n);
  }
  function Bs(n, r, o, c, v) {
    switch (r) {
      case "focusin":
        return Ir = Io(Ir, n, r, o, c, v), !0;
      case "dragenter":
        return Yi = Io(Yi, n, r, o, c, v), !0;
      case "mouseover":
        return dn = Io(dn, n, r, o, c, v), !0;
      case "pointerover":
        var _ = v.pointerId;
        return Kt.set(_, Io(Kt.get(_) || null, n, r, o, c, v)), !0;
      case "gotpointercapture":
        return _ = v.pointerId, Xl.set(_, Io(Xl.get(_) || null, n, r, o, c, v)), !0;
    }
    return !1;
  }
  function Ys(n) {
    var r = Xo(n.target);
    if (r !== null) {
      var o = yt(r);
      if (o !== null) {
        if (r = o.tag, r === 13) {
          if (r = ht(o), r !== null) {
            n.blockedOn = r, Fu(n.priority, function() {
              Vi(o);
            });
            return;
          }
        } else if (r === 3 && o.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = o.tag === 3 ? o.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function Kl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var o = Vu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (o === null) {
        o = n.nativeEvent;
        var c = new o.constructor(o.type, o);
        ln = c, o.target.dispatchEvent(c), ln = null;
      } else return r = Ze(o), r !== null && Vs(r), n.blockedOn = o, !1;
      r.shift();
    }
    return !0;
  }
  function Vo(n, r, o) {
    Kl(n) && o.delete(r);
  }
  function yp() {
    mr = !1, Ir !== null && Kl(Ir) && (Ir = null), Yi !== null && Kl(Yi) && (Yi = null), dn !== null && Kl(dn) && (dn = null), Kt.forEach(Vo), Xl.forEach(Vo);
  }
  function Ia(n, r) {
    n.blockedOn === r && (n.blockedOn = null, mr || (mr = !0, l.unstable_scheduleCallback(l.unstable_NormalPriority, yp)));
  }
  function _i(n) {
    function r(v) {
      return Ia(v, n);
    }
    if (0 < Bi.length) {
      Ia(Bi[0], n);
      for (var o = 1; o < Bi.length; o++) {
        var c = Bi[o];
        c.blockedOn === n && (c.blockedOn = null);
      }
    }
    for (Ir !== null && Ia(Ir, n), Yi !== null && Ia(Yi, n), dn !== null && Ia(dn, n), Kt.forEach(r), Xl.forEach(r), o = 0; o < Zn.length; o++) c = Zn[o], c.blockedOn === n && (c.blockedOn = null);
    for (; 0 < Zn.length && (o = Zn[0], o.blockedOn === null); ) Ys(o), o.blockedOn === null && Zn.shift();
  }
  var $i = se.ReactCurrentBatchConfig, Va = !0;
  function Hu(n, r, o, c) {
    var v = Ft, _ = $i.transition;
    $i.transition = null;
    try {
      Ft = 1, Jl(n, r, o, c);
    } finally {
      Ft = v, $i.transition = _;
    }
  }
  function Iu(n, r, o, c) {
    var v = Ft, _ = $i.transition;
    $i.transition = null;
    try {
      Ft = 4, Jl(n, r, o, c);
    } finally {
      Ft = v, $i.transition = _;
    }
  }
  function Jl(n, r, o, c) {
    if (Va) {
      var v = Vu(n, r, o, c);
      if (v === null) Df(n, r, c, Bo, o), Ha(n, c);
      else if (Bs(v, n, r, o, c)) c.stopPropagation();
      else if (Ha(n, c), r & 4 && -1 < Vr.indexOf(n)) {
        for (; v !== null; ) {
          var _ = Ze(v);
          if (_ !== null && At(_), _ = Vu(n, r, o, c), _ === null && Df(n, r, c, Bo, o), _ === v) break;
          v = _;
        }
        v !== null && c.stopPropagation();
      } else Df(n, r, c, null, o);
    }
  }
  var Bo = null;
  function Vu(n, r, o, c) {
    if (Bo = null, n = Qt(c), n = Xo(n), n !== null) if (r = yt(n), r === null) n = null;
    else if (o = r.tag, o === 13) {
      if (n = ht(r), n !== null) return n;
      n = null;
    } else if (o === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return Bo = n, null;
  }
  function Bu(n) {
    switch (n) {
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
        switch (St()) {
          case mi:
            return 1;
          case Po:
            return 4;
          case Fo:
          case Wl:
            return 16;
          case Nu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Si = null, w = null, z = null;
  function J() {
    if (z) return z;
    var n, r = w, o = r.length, c, v = "value" in Si ? Si.value : Si.textContent, _ = v.length;
    for (n = 0; n < o && r[n] === v[n]; n++) ;
    var b = o - n;
    for (c = 1; c <= b && r[o - c] === v[_ - c]; c++) ;
    return z = v.slice(n, 1 < c ? 1 - c : void 0);
  }
  function ae(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function xe() {
    return !0;
  }
  function tt() {
    return !1;
  }
  function Oe(n) {
    function r(o, c, v, _, b) {
      this._reactName = o, this._targetInst = v, this.type = c, this.nativeEvent = _, this.target = b, this.currentTarget = null;
      for (var M in n) n.hasOwnProperty(M) && (o = n[M], this[M] = o ? o(_) : _[M]);
      return this.isDefaultPrevented = (_.defaultPrevented != null ? _.defaultPrevented : _.returnValue === !1) ? xe : tt, this.isPropagationStopped = tt, this;
    }
    return ye(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var o = this.nativeEvent;
      o && (o.preventDefault ? o.preventDefault() : typeof o.returnValue != "unknown" && (o.returnValue = !1), this.isDefaultPrevented = xe);
    }, stopPropagation: function() {
      var o = this.nativeEvent;
      o && (o.stopPropagation ? o.stopPropagation() : typeof o.cancelBubble != "unknown" && (o.cancelBubble = !0), this.isPropagationStopped = xe);
    }, persist: function() {
    }, isPersistent: xe }), r;
  }
  var lt = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Rt = Oe(lt), zt = ye({}, lt, { view: 0, detail: 0 }), un = Oe(zt), Jt, Ct, Zt, _n = ye({}, zt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Cp, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Zt && (Zt && n.type === "mousemove" ? (Jt = n.screenX - Zt.screenX, Ct = n.screenY - Zt.screenY) : Ct = Jt = 0, Zt = n), Jt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Ct;
  } }), Zl = Oe(_n), $s = ye({}, _n, { dataTransfer: 0 }), _l = Oe($s), Ws = ye({}, zt, { relatedTarget: 0 }), Yo = Oe(Ws), gp = ye({}, lt, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), gf = Oe(gp), _p = ye({}, lt, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), Fv = Oe(_p), Sp = ye({}, lt, { data: 0 }), Ep = Oe(Sp), Hv = {
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
  }, Iv = {
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
  }, e0 = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Sl(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = e0[n]) ? !!r[n] : !1;
  }
  function Cp() {
    return Sl;
  }
  var wp = ye({}, zt, { key: function(n) {
    if (n.key) {
      var r = Hv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = ae(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Iv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Cp, charCode: function(n) {
    return n.type === "keypress" ? ae(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? ae(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), xp = Oe(wp), Tp = ye({}, _n, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Vv = Oe(Tp), _f = ye({}, zt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Cp }), Bv = Oe(_f), ia = ye({}, lt, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), El = Oe(ia), Hn = ye({}, _n, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Cl = Oe(Hn), bp = [9, 13, 27, 32], Yu = E && "CompositionEvent" in window, Gs = null;
  E && "documentMode" in document && (Gs = document.documentMode);
  var qs = E && "TextEvent" in window && !Gs, Yv = E && (!Yu || Gs && 8 < Gs && 11 >= Gs), $v = " ", Sf = !1;
  function Wv(n, r) {
    switch (n) {
      case "keyup":
        return bp.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Gv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var $u = !1;
  function qv(n, r) {
    switch (n) {
      case "compositionend":
        return Gv(r);
      case "keypress":
        return r.which !== 32 ? null : (Sf = !0, $v);
      case "textInput":
        return n = r.data, n === $v && Sf ? null : n;
      default:
        return null;
    }
  }
  function t0(n, r) {
    if ($u) return n === "compositionend" || !Yu && Wv(n, r) ? (n = J(), z = w = Si = null, $u = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return Yv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var n0 = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Qv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!n0[n.type] : r === "textarea";
  }
  function Rp(n, r, o, c) {
    ml(c), r = ec(r, "onChange"), 0 < r.length && (o = new Rt("onChange", "change", null, o, c), n.push({ event: o, listeners: r }));
  }
  var Wi = null, $o = null;
  function Xv(n) {
    qo(n, 0);
  }
  function Qs(n) {
    var r = Ci(n);
    if (jr(r)) return n;
  }
  function r0(n, r) {
    if (n === "change") return r;
  }
  var Kv = !1;
  if (E) {
    var kp;
    if (E) {
      var Dp = "oninput" in document;
      if (!Dp) {
        var Jv = document.createElement("div");
        Jv.setAttribute("oninput", "return;"), Dp = typeof Jv.oninput == "function";
      }
      kp = Dp;
    } else kp = !1;
    Kv = kp && (!document.documentMode || 9 < document.documentMode);
  }
  function Zv() {
    Wi && (Wi.detachEvent("onpropertychange", em), $o = Wi = null);
  }
  function em(n) {
    if (n.propertyName === "value" && Qs($o)) {
      var r = [];
      Rp(r, $o, n, Qt(n)), jo(Xv, r);
    }
  }
  function a0(n, r, o) {
    n === "focusin" ? (Zv(), Wi = r, $o = o, Wi.attachEvent("onpropertychange", em)) : n === "focusout" && Zv();
  }
  function tm(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Qs($o);
  }
  function i0(n, r) {
    if (n === "click") return Qs(r);
  }
  function nm(n, r) {
    if (n === "input" || n === "change") return Qs(r);
  }
  function l0(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var Ei = typeof Object.is == "function" ? Object.is : l0;
  function Xs(n, r) {
    if (Ei(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var o = Object.keys(n), c = Object.keys(r);
    if (o.length !== c.length) return !1;
    for (c = 0; c < o.length; c++) {
      var v = o[c];
      if (!x.call(r, v) || !Ei(n[v], r[v])) return !1;
    }
    return !0;
  }
  function rm(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function Ef(n, r) {
    var o = rm(n);
    n = 0;
    for (var c; o; ) {
      if (o.nodeType === 3) {
        if (c = n + o.textContent.length, n <= r && c >= r) return { node: o, offset: r - n };
        n = c;
      }
      e: {
        for (; o; ) {
          if (o.nextSibling) {
            o = o.nextSibling;
            break e;
          }
          o = o.parentNode;
        }
        o = void 0;
      }
      o = rm(o);
    }
  }
  function eo(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? eo(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function Ks() {
    for (var n = window, r = bn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var o = typeof r.contentWindow.location.href == "string";
      } catch {
        o = !1;
      }
      if (o) n = r.contentWindow;
      else break;
      r = bn(n.document);
    }
    return r;
  }
  function Cf(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function Wu(n) {
    var r = Ks(), o = n.focusedElem, c = n.selectionRange;
    if (r !== o && o && o.ownerDocument && eo(o.ownerDocument.documentElement, o)) {
      if (c !== null && Cf(o)) {
        if (r = c.start, n = c.end, n === void 0 && (n = r), "selectionStart" in o) o.selectionStart = r, o.selectionEnd = Math.min(n, o.value.length);
        else if (n = (r = o.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var v = o.textContent.length, _ = Math.min(c.start, v);
          c = c.end === void 0 ? _ : Math.min(c.end, v), !n.extend && _ > c && (v = c, c = _, _ = v), v = Ef(o, _);
          var b = Ef(
            o,
            c
          );
          v && b && (n.rangeCount !== 1 || n.anchorNode !== v.node || n.anchorOffset !== v.offset || n.focusNode !== b.node || n.focusOffset !== b.offset) && (r = r.createRange(), r.setStart(v.node, v.offset), n.removeAllRanges(), _ > c ? (n.addRange(r), n.extend(b.node, b.offset)) : (r.setEnd(b.node, b.offset), n.addRange(r)));
        }
      }
      for (r = [], n = o; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof o.focus == "function" && o.focus(), o = 0; o < r.length; o++) n = r[o], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var o0 = E && "documentMode" in document && 11 >= document.documentMode, Gu = null, Op = null, Js = null, Lp = !1;
  function Mp(n, r, o) {
    var c = o.window === o ? o.document : o.nodeType === 9 ? o : o.ownerDocument;
    Lp || Gu == null || Gu !== bn(c) || (c = Gu, "selectionStart" in c && Cf(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = { anchorNode: c.anchorNode, anchorOffset: c.anchorOffset, focusNode: c.focusNode, focusOffset: c.focusOffset }), Js && Xs(Js, c) || (Js = c, c = ec(Op, "onSelect"), 0 < c.length && (r = new Rt("onSelect", "select", null, r, o), n.push({ event: r, listeners: c }), r.target = Gu)));
  }
  function wf(n, r) {
    var o = {};
    return o[n.toLowerCase()] = r.toLowerCase(), o["Webkit" + n] = "webkit" + r, o["Moz" + n] = "moz" + r, o;
  }
  var Wo = { animationend: wf("Animation", "AnimationEnd"), animationiteration: wf("Animation", "AnimationIteration"), animationstart: wf("Animation", "AnimationStart"), transitionend: wf("Transition", "TransitionEnd") }, yr = {}, Np = {};
  E && (Np = document.createElement("div").style, "AnimationEvent" in window || (delete Wo.animationend.animation, delete Wo.animationiteration.animation, delete Wo.animationstart.animation), "TransitionEvent" in window || delete Wo.transitionend.transition);
  function xf(n) {
    if (yr[n]) return yr[n];
    if (!Wo[n]) return n;
    var r = Wo[n], o;
    for (o in r) if (r.hasOwnProperty(o) && o in Np) return yr[n] = r[o];
    return n;
  }
  var am = xf("animationend"), im = xf("animationiteration"), lm = xf("animationstart"), om = xf("transitionend"), Ap = /* @__PURE__ */ new Map(), Tf = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Ba(n, r) {
    Ap.set(n, r), y(r, [n]);
  }
  for (var zp = 0; zp < Tf.length; zp++) {
    var Go = Tf[zp], u0 = Go.toLowerCase(), s0 = Go[0].toUpperCase() + Go.slice(1);
    Ba(u0, "on" + s0);
  }
  Ba(am, "onAnimationEnd"), Ba(im, "onAnimationIteration"), Ba(lm, "onAnimationStart"), Ba("dblclick", "onDoubleClick"), Ba("focusin", "onFocus"), Ba("focusout", "onBlur"), Ba(om, "onTransitionEnd"), h("onMouseEnter", ["mouseout", "mouseover"]), h("onMouseLeave", ["mouseout", "mouseover"]), h("onPointerEnter", ["pointerout", "pointerover"]), h("onPointerLeave", ["pointerout", "pointerover"]), y("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), y("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), y("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), y("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), y("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), y("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Zs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Up = new Set("cancel close invalid load scroll toggle".split(" ").concat(Zs));
  function bf(n, r, o) {
    var c = n.type || "unknown-event";
    n.currentTarget = o, He(c, r, void 0, n), n.currentTarget = null;
  }
  function qo(n, r) {
    r = (r & 4) !== 0;
    for (var o = 0; o < n.length; o++) {
      var c = n[o], v = c.event;
      c = c.listeners;
      e: {
        var _ = void 0;
        if (r) for (var b = c.length - 1; 0 <= b; b--) {
          var M = c[b], j = M.instance, Z = M.currentTarget;
          if (M = M.listener, j !== _ && v.isPropagationStopped()) break e;
          bf(v, M, Z), _ = j;
        }
        else for (b = 0; b < c.length; b++) {
          if (M = c[b], j = M.instance, Z = M.currentTarget, M = M.listener, j !== _ && v.isPropagationStopped()) break e;
          bf(v, M, Z), _ = j;
        }
      }
    }
    if (Ii) throw n = U, Ii = !1, U = null, n;
  }
  function Wt(n, r) {
    var o = r[rc];
    o === void 0 && (o = r[rc] = /* @__PURE__ */ new Set());
    var c = n + "__bubble";
    o.has(c) || (um(r, n, 2, !1), o.add(c));
  }
  function Rf(n, r, o) {
    var c = 0;
    r && (c |= 4), um(o, n, c, r);
  }
  var kf = "_reactListening" + Math.random().toString(36).slice(2);
  function qu(n) {
    if (!n[kf]) {
      n[kf] = !0, f.forEach(function(o) {
        o !== "selectionchange" && (Up.has(o) || Rf(o, !1, n), Rf(o, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[kf] || (r[kf] = !0, Rf("selectionchange", !1, r));
    }
  }
  function um(n, r, o, c) {
    switch (Bu(r)) {
      case 1:
        var v = Hu;
        break;
      case 4:
        v = Iu;
        break;
      default:
        v = Jl;
    }
    o = v.bind(null, r, o, n), v = void 0, !Fr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (v = !0), c ? v !== void 0 ? n.addEventListener(r, o, { capture: !0, passive: v }) : n.addEventListener(r, o, !0) : v !== void 0 ? n.addEventListener(r, o, { passive: v }) : n.addEventListener(r, o, !1);
  }
  function Df(n, r, o, c, v) {
    var _ = c;
    if (!(r & 1) && !(r & 2) && c !== null) e: for (; ; ) {
      if (c === null) return;
      var b = c.tag;
      if (b === 3 || b === 4) {
        var M = c.stateNode.containerInfo;
        if (M === v || M.nodeType === 8 && M.parentNode === v) break;
        if (b === 4) for (b = c.return; b !== null; ) {
          var j = b.tag;
          if ((j === 3 || j === 4) && (j = b.stateNode.containerInfo, j === v || j.nodeType === 8 && j.parentNode === v)) return;
          b = b.return;
        }
        for (; M !== null; ) {
          if (b = Xo(M), b === null) return;
          if (j = b.tag, j === 5 || j === 6) {
            c = _ = b;
            continue e;
          }
          M = M.parentNode;
        }
      }
      c = c.return;
    }
    jo(function() {
      var Z = _, _e = Qt(o), Ce = [];
      e: {
        var ge = Ap.get(n);
        if (ge !== void 0) {
          var ze = Rt, Ie = n;
          switch (n) {
            case "keypress":
              if (ae(o) === 0) break e;
            case "keydown":
            case "keyup":
              ze = xp;
              break;
            case "focusin":
              Ie = "focus", ze = Yo;
              break;
            case "focusout":
              Ie = "blur", ze = Yo;
              break;
            case "beforeblur":
            case "afterblur":
              ze = Yo;
              break;
            case "click":
              if (o.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              ze = Zl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ze = _l;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ze = Bv;
              break;
            case am:
            case im:
            case lm:
              ze = gf;
              break;
            case om:
              ze = El;
              break;
            case "scroll":
              ze = un;
              break;
            case "wheel":
              ze = Cl;
              break;
            case "copy":
            case "cut":
            case "paste":
              ze = Fv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ze = Vv;
          }
          var $e = (r & 4) !== 0, Nn = !$e && n === "scroll", $ = $e ? ge !== null ? ge + "Capture" : null : ge;
          $e = [];
          for (var H = Z, X; H !== null; ) {
            X = H;
            var Se = X.stateNode;
            if (X.tag === 5 && Se !== null && (X = Se, $ !== null && (Se = Pr(H, $), Se != null && $e.push(Qu(H, Se, X)))), Nn) break;
            H = H.return;
          }
          0 < $e.length && (ge = new ze(ge, Ie, null, o, _e), Ce.push({ event: ge, listeners: $e }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ge = n === "mouseover" || n === "pointerover", ze = n === "mouseout" || n === "pointerout", ge && o !== ln && (Ie = o.relatedTarget || o.fromElement) && (Xo(Ie) || Ie[wl])) break e;
          if ((ze || ge) && (ge = _e.window === _e ? _e : (ge = _e.ownerDocument) ? ge.defaultView || ge.parentWindow : window, ze ? (Ie = o.relatedTarget || o.toElement, ze = Z, Ie = Ie ? Xo(Ie) : null, Ie !== null && (Nn = yt(Ie), Ie !== Nn || Ie.tag !== 5 && Ie.tag !== 6) && (Ie = null)) : (ze = null, Ie = Z), ze !== Ie)) {
            if ($e = Zl, Se = "onMouseLeave", $ = "onMouseEnter", H = "mouse", (n === "pointerout" || n === "pointerover") && ($e = Vv, Se = "onPointerLeave", $ = "onPointerEnter", H = "pointer"), Nn = ze == null ? ge : Ci(ze), X = Ie == null ? ge : Ci(Ie), ge = new $e(Se, H + "leave", ze, o, _e), ge.target = Nn, ge.relatedTarget = X, Se = null, Xo(_e) === Z && ($e = new $e($, H + "enter", Ie, o, _e), $e.target = X, $e.relatedTarget = Nn, Se = $e), Nn = Se, ze && Ie) t: {
              for ($e = ze, $ = Ie, H = 0, X = $e; X; X = to(X)) H++;
              for (X = 0, Se = $; Se; Se = to(Se)) X++;
              for (; 0 < H - X; ) $e = to($e), H--;
              for (; 0 < X - H; ) $ = to($), X--;
              for (; H--; ) {
                if ($e === $ || $ !== null && $e === $.alternate) break t;
                $e = to($e), $ = to($);
              }
              $e = null;
            }
            else $e = null;
            ze !== null && sm(Ce, ge, ze, $e, !1), Ie !== null && Nn !== null && sm(Ce, Nn, Ie, $e, !0);
          }
        }
        e: {
          if (ge = Z ? Ci(Z) : window, ze = ge.nodeName && ge.nodeName.toLowerCase(), ze === "select" || ze === "input" && ge.type === "file") var Ve = r0;
          else if (Qv(ge)) if (Kv) Ve = nm;
          else {
            Ve = tm;
            var at = a0;
          }
          else (ze = ge.nodeName) && ze.toLowerCase() === "input" && (ge.type === "checkbox" || ge.type === "radio") && (Ve = i0);
          if (Ve && (Ve = Ve(n, Z))) {
            Rp(Ce, Ve, o, _e);
            break e;
          }
          at && at(n, ge, Z), n === "focusout" && (at = ge._wrapperState) && at.controlled && ge.type === "number" && wa(ge, "number", ge.value);
        }
        switch (at = Z ? Ci(Z) : window, n) {
          case "focusin":
            (Qv(at) || at.contentEditable === "true") && (Gu = at, Op = Z, Js = null);
            break;
          case "focusout":
            Js = Op = Gu = null;
            break;
          case "mousedown":
            Lp = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Lp = !1, Mp(Ce, o, _e);
            break;
          case "selectionchange":
            if (o0) break;
          case "keydown":
          case "keyup":
            Mp(Ce, o, _e);
        }
        var ot;
        if (Yu) e: {
          switch (n) {
            case "compositionstart":
              var dt = "onCompositionStart";
              break e;
            case "compositionend":
              dt = "onCompositionEnd";
              break e;
            case "compositionupdate":
              dt = "onCompositionUpdate";
              break e;
          }
          dt = void 0;
        }
        else $u ? Wv(n, o) && (dt = "onCompositionEnd") : n === "keydown" && o.keyCode === 229 && (dt = "onCompositionStart");
        dt && (Yv && o.locale !== "ko" && ($u || dt !== "onCompositionStart" ? dt === "onCompositionEnd" && $u && (ot = J()) : (Si = _e, w = "value" in Si ? Si.value : Si.textContent, $u = !0)), at = ec(Z, dt), 0 < at.length && (dt = new Ep(dt, n, null, o, _e), Ce.push({ event: dt, listeners: at }), ot ? dt.data = ot : (ot = Gv(o), ot !== null && (dt.data = ot)))), (ot = qs ? qv(n, o) : t0(n, o)) && (Z = ec(Z, "onBeforeInput"), 0 < Z.length && (_e = new Ep("onBeforeInput", "beforeinput", null, o, _e), Ce.push({ event: _e, listeners: Z }), _e.data = ot));
      }
      qo(Ce, r);
    });
  }
  function Qu(n, r, o) {
    return { instance: n, listener: r, currentTarget: o };
  }
  function ec(n, r) {
    for (var o = r + "Capture", c = []; n !== null; ) {
      var v = n, _ = v.stateNode;
      v.tag === 5 && _ !== null && (v = _, _ = Pr(n, o), _ != null && c.unshift(Qu(n, _, v)), _ = Pr(n, r), _ != null && c.push(Qu(n, _, v))), n = n.return;
    }
    return c;
  }
  function to(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function sm(n, r, o, c, v) {
    for (var _ = r._reactName, b = []; o !== null && o !== c; ) {
      var M = o, j = M.alternate, Z = M.stateNode;
      if (j !== null && j === c) break;
      M.tag === 5 && Z !== null && (M = Z, v ? (j = Pr(o, _), j != null && b.unshift(Qu(o, j, M))) : v || (j = Pr(o, _), j != null && b.push(Qu(o, j, M)))), o = o.return;
    }
    b.length !== 0 && n.push({ event: r, listeners: b });
  }
  var cm = /\r\n?/g, c0 = /\u0000|\uFFFD/g;
  function fm(n) {
    return (typeof n == "string" ? n : "" + n).replace(cm, `
`).replace(c0, "");
  }
  function Of(n, r, o) {
    if (r = fm(r), fm(n) !== r && o) throw Error(s(425));
  }
  function no() {
  }
  var tc = null, Qo = null;
  function Lf(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Mf = typeof setTimeout == "function" ? setTimeout : void 0, jp = typeof clearTimeout == "function" ? clearTimeout : void 0, dm = typeof Promise == "function" ? Promise : void 0, Xu = typeof queueMicrotask == "function" ? queueMicrotask : typeof dm < "u" ? function(n) {
    return dm.resolve(null).then(n).catch(Nf);
  } : Mf;
  function Nf(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function Ku(n, r) {
    var o = r, c = 0;
    do {
      var v = o.nextSibling;
      if (n.removeChild(o), v && v.nodeType === 8) if (o = v.data, o === "/$") {
        if (c === 0) {
          n.removeChild(v), _i(r);
          return;
        }
        c--;
      } else o !== "$" && o !== "$?" && o !== "$!" || c++;
      o = v;
    } while (o);
    _i(r);
  }
  function Gi(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function pm(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var o = n.data;
        if (o === "$" || o === "$!" || o === "$?") {
          if (r === 0) return n;
          r--;
        } else o === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var ro = Math.random().toString(36).slice(2), qi = "__reactFiber$" + ro, nc = "__reactProps$" + ro, wl = "__reactContainer$" + ro, rc = "__reactEvents$" + ro, Ju = "__reactListeners$" + ro, f0 = "__reactHandles$" + ro;
  function Xo(n) {
    var r = n[qi];
    if (r) return r;
    for (var o = n.parentNode; o; ) {
      if (r = o[wl] || o[qi]) {
        if (o = r.alternate, r.child !== null || o !== null && o.child !== null) for (n = pm(n); n !== null; ) {
          if (o = n[qi]) return o;
          n = pm(n);
        }
        return r;
      }
      n = o, o = n.parentNode;
    }
    return null;
  }
  function Ze(n) {
    return n = n[qi] || n[wl], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function Ci(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(s(33));
  }
  function Sn(n) {
    return n[nc] || null;
  }
  var Ot = [], Ya = -1;
  function $a(n) {
    return { current: n };
  }
  function sn(n) {
    0 > Ya || (n.current = Ot[Ya], Ot[Ya] = null, Ya--);
  }
  function Je(n, r) {
    Ya++, Ot[Ya] = n.current, n.current = r;
  }
  var Mr = {}, xn = $a(Mr), er = $a(!1), la = Mr;
  function oa(n, r) {
    var o = n.type.contextTypes;
    if (!o) return Mr;
    var c = n.stateNode;
    if (c && c.__reactInternalMemoizedUnmaskedChildContext === r) return c.__reactInternalMemoizedMaskedChildContext;
    var v = {}, _;
    for (_ in o) v[_] = r[_];
    return c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = v), v;
  }
  function In(n) {
    return n = n.childContextTypes, n != null;
  }
  function Zu() {
    sn(er), sn(xn);
  }
  function hm(n, r, o) {
    if (xn.current !== Mr) throw Error(s(168));
    Je(xn, r), Je(er, o);
  }
  function ac(n, r, o) {
    var c = n.stateNode;
    if (r = r.childContextTypes, typeof c.getChildContext != "function") return o;
    c = c.getChildContext();
    for (var v in c) if (!(v in r)) throw Error(s(108, rt(n) || "Unknown", v));
    return ye({}, o, c);
  }
  function or(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Mr, la = xn.current, Je(xn, n), Je(er, er.current), !0;
  }
  function Af(n, r, o) {
    var c = n.stateNode;
    if (!c) throw Error(s(169));
    o ? (n = ac(n, r, la), c.__reactInternalMemoizedMergedChildContext = n, sn(er), sn(xn), Je(xn, n)) : sn(er), Je(er, o);
  }
  var Qi = null, es = !1, xl = !1;
  function zf(n) {
    Qi === null ? Qi = [n] : Qi.push(n);
  }
  function ao(n) {
    es = !0, zf(n);
  }
  function Xi() {
    if (!xl && Qi !== null) {
      xl = !0;
      var n = 0, r = Ft;
      try {
        var o = Qi;
        for (Ft = 1; n < o.length; n++) {
          var c = o[n];
          do
            c = c(!0);
          while (c !== null);
        }
        Qi = null, es = !1;
      } catch (v) {
        throw Qi !== null && (Qi = Qi.slice(n + 1)), fn(mi, Xi), v;
      } finally {
        Ft = r, xl = !1;
      }
    }
    return null;
  }
  var io = [], lo = 0, oo = null, Tl = 0, Vn = [], Wa = 0, Ra = null, Ki = 1, Ji = "";
  function Ko(n, r) {
    io[lo++] = Tl, io[lo++] = oo, oo = n, Tl = r;
  }
  function vm(n, r, o) {
    Vn[Wa++] = Ki, Vn[Wa++] = Ji, Vn[Wa++] = Ra, Ra = n;
    var c = Ki;
    n = Ji;
    var v = 32 - Hr(c) - 1;
    c &= ~(1 << v), o += 1;
    var _ = 32 - Hr(r) + v;
    if (30 < _) {
      var b = v - v % 5;
      _ = (c & (1 << b) - 1).toString(32), c >>= b, v -= b, Ki = 1 << 32 - Hr(r) + v | o << v | c, Ji = _ + n;
    } else Ki = 1 << _ | o << v | c, Ji = n;
  }
  function Uf(n) {
    n.return !== null && (Ko(n, 1), vm(n, 1, 0));
  }
  function jf(n) {
    for (; n === oo; ) oo = io[--lo], io[lo] = null, Tl = io[--lo], io[lo] = null;
    for (; n === Ra; ) Ra = Vn[--Wa], Vn[Wa] = null, Ji = Vn[--Wa], Vn[Wa] = null, Ki = Vn[--Wa], Vn[Wa] = null;
  }
  var ua = null, sa = null, mn = !1, Ga = null;
  function Pp(n, r) {
    var o = Ja(5, null, null, 0);
    o.elementType = "DELETED", o.stateNode = r, o.return = n, r = n.deletions, r === null ? (n.deletions = [o], n.flags |= 16) : r.push(o);
  }
  function mm(n, r) {
    switch (n.tag) {
      case 5:
        var o = n.type;
        return r = r.nodeType !== 1 || o.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ua = n, sa = Gi(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ua = n, sa = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (o = Ra !== null ? { id: Ki, overflow: Ji } : null, n.memoizedState = { dehydrated: r, treeContext: o, retryLane: 1073741824 }, o = Ja(18, null, null, 0), o.stateNode = r, o.return = n, n.child = o, ua = n, sa = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Fp(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Hp(n) {
    if (mn) {
      var r = sa;
      if (r) {
        var o = r;
        if (!mm(n, r)) {
          if (Fp(n)) throw Error(s(418));
          r = Gi(o.nextSibling);
          var c = ua;
          r && mm(n, r) ? Pp(c, o) : (n.flags = n.flags & -4097 | 2, mn = !1, ua = n);
        }
      } else {
        if (Fp(n)) throw Error(s(418));
        n.flags = n.flags & -4097 | 2, mn = !1, ua = n;
      }
    }
  }
  function tr(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    ua = n;
  }
  function Pf(n) {
    if (n !== ua) return !1;
    if (!mn) return tr(n), mn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Lf(n.type, n.memoizedProps)), r && (r = sa)) {
      if (Fp(n)) throw ic(), Error(s(418));
      for (; r; ) Pp(n, r), r = Gi(r.nextSibling);
    }
    if (tr(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(s(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var o = n.data;
            if (o === "/$") {
              if (r === 0) {
                sa = Gi(n.nextSibling);
                break e;
              }
              r--;
            } else o !== "$" && o !== "$!" && o !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        sa = null;
      }
    } else sa = ua ? Gi(n.stateNode.nextSibling) : null;
    return !0;
  }
  function ic() {
    for (var n = sa; n; ) n = Gi(n.nextSibling);
  }
  function uo() {
    sa = ua = null, mn = !1;
  }
  function bl(n) {
    Ga === null ? Ga = [n] : Ga.push(n);
  }
  var d0 = se.ReactCurrentBatchConfig;
  function Jo(n, r, o) {
    if (n = o.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (o._owner) {
        if (o = o._owner, o) {
          if (o.tag !== 1) throw Error(s(309));
          var c = o.stateNode;
        }
        if (!c) throw Error(s(147, n));
        var v = c, _ = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === _ ? r.ref : (r = function(b) {
          var M = v.refs;
          b === null ? delete M[_] : M[_] = b;
        }, r._stringRef = _, r);
      }
      if (typeof n != "string") throw Error(s(284));
      if (!o._owner) throw Error(s(290, n));
    }
    return n;
  }
  function Ff(n, r) {
    throw n = Object.prototype.toString.call(r), Error(s(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function ym(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Zo(n) {
    function r($, H) {
      if (n) {
        var X = $.deletions;
        X === null ? ($.deletions = [H], $.flags |= 16) : X.push(H);
      }
    }
    function o($, H) {
      if (!n) return null;
      for (; H !== null; ) r($, H), H = H.sibling;
      return null;
    }
    function c($, H) {
      for ($ = /* @__PURE__ */ new Map(); H !== null; ) H.key !== null ? $.set(H.key, H) : $.set(H.index, H), H = H.sibling;
      return $;
    }
    function v($, H) {
      return $ = yo($, H), $.index = 0, $.sibling = null, $;
    }
    function _($, H, X) {
      return $.index = X, n ? (X = $.alternate, X !== null ? (X = X.index, X < H ? ($.flags |= 2, H) : X) : ($.flags |= 2, H)) : ($.flags |= 1048576, H);
    }
    function b($) {
      return n && $.alternate === null && ($.flags |= 2), $;
    }
    function M($, H, X, Se) {
      return H === null || H.tag !== 6 ? (H = yh(X, $.mode, Se), H.return = $, H) : (H = v(H, X), H.return = $, H);
    }
    function j($, H, X, Se) {
      var Ve = X.type;
      return Ve === ue ? _e($, H, X.props.children, Se, X.key) : H !== null && (H.elementType === Ve || typeof Ve == "object" && Ve !== null && Ve.$$typeof === he && ym(Ve) === H.type) ? (Se = v(H, X.props), Se.ref = Jo($, H, X), Se.return = $, Se) : (Se = zc(X.type, X.key, X.props, null, $.mode, Se), Se.ref = Jo($, H, X), Se.return = $, Se);
    }
    function Z($, H, X, Se) {
      return H === null || H.tag !== 4 || H.stateNode.containerInfo !== X.containerInfo || H.stateNode.implementation !== X.implementation ? (H = gd(X, $.mode, Se), H.return = $, H) : (H = v(H, X.children || []), H.return = $, H);
    }
    function _e($, H, X, Se, Ve) {
      return H === null || H.tag !== 7 ? (H = Ml(X, $.mode, Se, Ve), H.return = $, H) : (H = v(H, X), H.return = $, H);
    }
    function Ce($, H, X) {
      if (typeof H == "string" && H !== "" || typeof H == "number") return H = yh("" + H, $.mode, X), H.return = $, H;
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case W:
            return X = zc(H.type, H.key, H.props, null, $.mode, X), X.ref = Jo($, null, H), X.return = $, X;
          case de:
            return H = gd(H, $.mode, X), H.return = $, H;
          case he:
            var Se = H._init;
            return Ce($, Se(H._payload), X);
        }
        if (ir(H) || Te(H)) return H = Ml(H, $.mode, X, null), H.return = $, H;
        Ff($, H);
      }
      return null;
    }
    function ge($, H, X, Se) {
      var Ve = H !== null ? H.key : null;
      if (typeof X == "string" && X !== "" || typeof X == "number") return Ve !== null ? null : M($, H, "" + X, Se);
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case W:
            return X.key === Ve ? j($, H, X, Se) : null;
          case de:
            return X.key === Ve ? Z($, H, X, Se) : null;
          case he:
            return Ve = X._init, ge(
              $,
              H,
              Ve(X._payload),
              Se
            );
        }
        if (ir(X) || Te(X)) return Ve !== null ? null : _e($, H, X, Se, null);
        Ff($, X);
      }
      return null;
    }
    function ze($, H, X, Se, Ve) {
      if (typeof Se == "string" && Se !== "" || typeof Se == "number") return $ = $.get(X) || null, M(H, $, "" + Se, Ve);
      if (typeof Se == "object" && Se !== null) {
        switch (Se.$$typeof) {
          case W:
            return $ = $.get(Se.key === null ? X : Se.key) || null, j(H, $, Se, Ve);
          case de:
            return $ = $.get(Se.key === null ? X : Se.key) || null, Z(H, $, Se, Ve);
          case he:
            var at = Se._init;
            return ze($, H, X, at(Se._payload), Ve);
        }
        if (ir(Se) || Te(Se)) return $ = $.get(X) || null, _e(H, $, Se, Ve, null);
        Ff(H, Se);
      }
      return null;
    }
    function Ie($, H, X, Se) {
      for (var Ve = null, at = null, ot = H, dt = H = 0, cr = null; ot !== null && dt < X.length; dt++) {
        ot.index > dt ? (cr = ot, ot = null) : cr = ot.sibling;
        var Vt = ge($, ot, X[dt], Se);
        if (Vt === null) {
          ot === null && (ot = cr);
          break;
        }
        n && ot && Vt.alternate === null && r($, ot), H = _(Vt, H, dt), at === null ? Ve = Vt : at.sibling = Vt, at = Vt, ot = cr;
      }
      if (dt === X.length) return o($, ot), mn && Ko($, dt), Ve;
      if (ot === null) {
        for (; dt < X.length; dt++) ot = Ce($, X[dt], Se), ot !== null && (H = _(ot, H, dt), at === null ? Ve = ot : at.sibling = ot, at = ot);
        return mn && Ko($, dt), Ve;
      }
      for (ot = c($, ot); dt < X.length; dt++) cr = ze(ot, $, dt, X[dt], Se), cr !== null && (n && cr.alternate !== null && ot.delete(cr.key === null ? dt : cr.key), H = _(cr, H, dt), at === null ? Ve = cr : at.sibling = cr, at = cr);
      return n && ot.forEach(function(So) {
        return r($, So);
      }), mn && Ko($, dt), Ve;
    }
    function $e($, H, X, Se) {
      var Ve = Te(X);
      if (typeof Ve != "function") throw Error(s(150));
      if (X = Ve.call(X), X == null) throw Error(s(151));
      for (var at = Ve = null, ot = H, dt = H = 0, cr = null, Vt = X.next(); ot !== null && !Vt.done; dt++, Vt = X.next()) {
        ot.index > dt ? (cr = ot, ot = null) : cr = ot.sibling;
        var So = ge($, ot, Vt.value, Se);
        if (So === null) {
          ot === null && (ot = cr);
          break;
        }
        n && ot && So.alternate === null && r($, ot), H = _(So, H, dt), at === null ? Ve = So : at.sibling = So, at = So, ot = cr;
      }
      if (Vt.done) return o(
        $,
        ot
      ), mn && Ko($, dt), Ve;
      if (ot === null) {
        for (; !Vt.done; dt++, Vt = X.next()) Vt = Ce($, Vt.value, Se), Vt !== null && (H = _(Vt, H, dt), at === null ? Ve = Vt : at.sibling = Vt, at = Vt);
        return mn && Ko($, dt), Ve;
      }
      for (ot = c($, ot); !Vt.done; dt++, Vt = X.next()) Vt = ze(ot, $, dt, Vt.value, Se), Vt !== null && (n && Vt.alternate !== null && ot.delete(Vt.key === null ? dt : Vt.key), H = _(Vt, H, dt), at === null ? Ve = Vt : at.sibling = Vt, at = Vt);
      return n && ot.forEach(function(Zm) {
        return r($, Zm);
      }), mn && Ko($, dt), Ve;
    }
    function Nn($, H, X, Se) {
      if (typeof X == "object" && X !== null && X.type === ue && X.key === null && (X = X.props.children), typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case W:
            e: {
              for (var Ve = X.key, at = H; at !== null; ) {
                if (at.key === Ve) {
                  if (Ve = X.type, Ve === ue) {
                    if (at.tag === 7) {
                      o($, at.sibling), H = v(at, X.props.children), H.return = $, $ = H;
                      break e;
                    }
                  } else if (at.elementType === Ve || typeof Ve == "object" && Ve !== null && Ve.$$typeof === he && ym(Ve) === at.type) {
                    o($, at.sibling), H = v(at, X.props), H.ref = Jo($, at, X), H.return = $, $ = H;
                    break e;
                  }
                  o($, at);
                  break;
                } else r($, at);
                at = at.sibling;
              }
              X.type === ue ? (H = Ml(X.props.children, $.mode, Se, X.key), H.return = $, $ = H) : (Se = zc(X.type, X.key, X.props, null, $.mode, Se), Se.ref = Jo($, H, X), Se.return = $, $ = Se);
            }
            return b($);
          case de:
            e: {
              for (at = X.key; H !== null; ) {
                if (H.key === at) if (H.tag === 4 && H.stateNode.containerInfo === X.containerInfo && H.stateNode.implementation === X.implementation) {
                  o($, H.sibling), H = v(H, X.children || []), H.return = $, $ = H;
                  break e;
                } else {
                  o($, H);
                  break;
                }
                else r($, H);
                H = H.sibling;
              }
              H = gd(X, $.mode, Se), H.return = $, $ = H;
            }
            return b($);
          case he:
            return at = X._init, Nn($, H, at(X._payload), Se);
        }
        if (ir(X)) return Ie($, H, X, Se);
        if (Te(X)) return $e($, H, X, Se);
        Ff($, X);
      }
      return typeof X == "string" && X !== "" || typeof X == "number" ? (X = "" + X, H !== null && H.tag === 6 ? (o($, H.sibling), H = v(H, X), H.return = $, $ = H) : (o($, H), H = yh(X, $.mode, Se), H.return = $, $ = H), b($)) : o($, H);
    }
    return Nn;
  }
  var Dn = Zo(!0), Me = Zo(!1), ka = $a(null), ca = null, ts = null, Ip = null;
  function Vp() {
    Ip = ts = ca = null;
  }
  function Bp(n) {
    var r = ka.current;
    sn(ka), n._currentValue = r;
  }
  function Yp(n, r, o) {
    for (; n !== null; ) {
      var c = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, c !== null && (c.childLanes |= r)) : c !== null && (c.childLanes & r) !== r && (c.childLanes |= r), n === o) break;
      n = n.return;
    }
  }
  function En(n, r) {
    ca = n, Ip = ts = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Yn = !0), n.firstContext = null);
  }
  function qa(n) {
    var r = n._currentValue;
    if (Ip !== n) if (n = { context: n, memoizedValue: r, next: null }, ts === null) {
      if (ca === null) throw Error(s(308));
      ts = n, ca.dependencies = { lanes: 0, firstContext: n };
    } else ts = ts.next = n;
    return r;
  }
  var eu = null;
  function $p(n) {
    eu === null ? eu = [n] : eu.push(n);
  }
  function Wp(n, r, o, c) {
    var v = r.interleaved;
    return v === null ? (o.next = o, $p(r)) : (o.next = v.next, v.next = o), r.interleaved = o, Da(n, c);
  }
  function Da(n, r) {
    n.lanes |= r;
    var o = n.alternate;
    for (o !== null && (o.lanes |= r), o = n, n = n.return; n !== null; ) n.childLanes |= r, o = n.alternate, o !== null && (o.childLanes |= r), o = n, n = n.return;
    return o.tag === 3 ? o.stateNode : null;
  }
  var Oa = !1;
  function Gp(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function gm(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Rl(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function so(n, r, o) {
    var c = n.updateQueue;
    if (c === null) return null;
    if (c = c.shared, Lt & 2) {
      var v = c.pending;
      return v === null ? r.next = r : (r.next = v.next, v.next = r), c.pending = r, Da(n, o);
    }
    return v = c.interleaved, v === null ? (r.next = r, $p(c)) : (r.next = v.next, v.next = r), c.interleaved = r, Da(n, o);
  }
  function Hf(n, r, o) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (o & 4194240) !== 0)) {
      var c = r.lanes;
      c &= n.pendingLanes, o |= c, r.lanes = o, gl(n, o);
    }
  }
  function _m(n, r) {
    var o = n.updateQueue, c = n.alternate;
    if (c !== null && (c = c.updateQueue, o === c)) {
      var v = null, _ = null;
      if (o = o.firstBaseUpdate, o !== null) {
        do {
          var b = { eventTime: o.eventTime, lane: o.lane, tag: o.tag, payload: o.payload, callback: o.callback, next: null };
          _ === null ? v = _ = b : _ = _.next = b, o = o.next;
        } while (o !== null);
        _ === null ? v = _ = r : _ = _.next = r;
      } else v = _ = r;
      o = { baseState: c.baseState, firstBaseUpdate: v, lastBaseUpdate: _, shared: c.shared, effects: c.effects }, n.updateQueue = o;
      return;
    }
    n = o.lastBaseUpdate, n === null ? o.firstBaseUpdate = r : n.next = r, o.lastBaseUpdate = r;
  }
  function lc(n, r, o, c) {
    var v = n.updateQueue;
    Oa = !1;
    var _ = v.firstBaseUpdate, b = v.lastBaseUpdate, M = v.shared.pending;
    if (M !== null) {
      v.shared.pending = null;
      var j = M, Z = j.next;
      j.next = null, b === null ? _ = Z : b.next = Z, b = j;
      var _e = n.alternate;
      _e !== null && (_e = _e.updateQueue, M = _e.lastBaseUpdate, M !== b && (M === null ? _e.firstBaseUpdate = Z : M.next = Z, _e.lastBaseUpdate = j));
    }
    if (_ !== null) {
      var Ce = v.baseState;
      b = 0, _e = Z = j = null, M = _;
      do {
        var ge = M.lane, ze = M.eventTime;
        if ((c & ge) === ge) {
          _e !== null && (_e = _e.next = {
            eventTime: ze,
            lane: 0,
            tag: M.tag,
            payload: M.payload,
            callback: M.callback,
            next: null
          });
          e: {
            var Ie = n, $e = M;
            switch (ge = r, ze = o, $e.tag) {
              case 1:
                if (Ie = $e.payload, typeof Ie == "function") {
                  Ce = Ie.call(ze, Ce, ge);
                  break e;
                }
                Ce = Ie;
                break e;
              case 3:
                Ie.flags = Ie.flags & -65537 | 128;
              case 0:
                if (Ie = $e.payload, ge = typeof Ie == "function" ? Ie.call(ze, Ce, ge) : Ie, ge == null) break e;
                Ce = ye({}, Ce, ge);
                break e;
              case 2:
                Oa = !0;
            }
          }
          M.callback !== null && M.lane !== 0 && (n.flags |= 64, ge = v.effects, ge === null ? v.effects = [M] : ge.push(M));
        } else ze = { eventTime: ze, lane: ge, tag: M.tag, payload: M.payload, callback: M.callback, next: null }, _e === null ? (Z = _e = ze, j = Ce) : _e = _e.next = ze, b |= ge;
        if (M = M.next, M === null) {
          if (M = v.shared.pending, M === null) break;
          ge = M, M = ge.next, ge.next = null, v.lastBaseUpdate = ge, v.shared.pending = null;
        }
      } while (!0);
      if (_e === null && (j = Ce), v.baseState = j, v.firstBaseUpdate = Z, v.lastBaseUpdate = _e, r = v.shared.interleaved, r !== null) {
        v = r;
        do
          b |= v.lane, v = v.next;
        while (v !== r);
      } else _ === null && (v.shared.lanes = 0);
      rl |= b, n.lanes = b, n.memoizedState = Ce;
    }
  }
  function qp(n, r, o) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var c = n[r], v = c.callback;
      if (v !== null) {
        if (c.callback = null, c = o, typeof v != "function") throw Error(s(191, v));
        v.call(c);
      }
    }
  }
  var oc = {}, Zi = $a(oc), uc = $a(oc), sc = $a(oc);
  function tu(n) {
    if (n === oc) throw Error(s(174));
    return n;
  }
  function Qp(n, r) {
    switch (Je(sc, r), Je(uc, n), Je(Zi, oc), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : xa(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = xa(r, n);
    }
    sn(Zi), Je(Zi, r);
  }
  function nu() {
    sn(Zi), sn(uc), sn(sc);
  }
  function Sm(n) {
    tu(sc.current);
    var r = tu(Zi.current), o = xa(r, n.type);
    r !== o && (Je(uc, n), Je(Zi, o));
  }
  function If(n) {
    uc.current === n && (sn(Zi), sn(uc));
  }
  var Cn = $a(0);
  function Vf(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var o = r.memoizedState;
        if (o !== null && (o = o.dehydrated, o === null || o.data === "$?" || o.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var cc = [];
  function et() {
    for (var n = 0; n < cc.length; n++) cc[n]._workInProgressVersionPrimary = null;
    cc.length = 0;
  }
  var Tt = se.ReactCurrentDispatcher, Ht = se.ReactCurrentBatchConfig, en = 0, It = null, Bn = null, ur = null, Bf = !1, fc = !1, ru = 0, me = 0;
  function jt() {
    throw Error(s(321));
  }
  function st(n, r) {
    if (r === null) return !1;
    for (var o = 0; o < r.length && o < n.length; o++) if (!Ei(n[o], r[o])) return !1;
    return !0;
  }
  function co(n, r, o, c, v, _) {
    if (en = _, It = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Tt.current = n === null || n.memoizedState === null ? ad : yc, n = o(c, v), fc) {
      _ = 0;
      do {
        if (fc = !1, ru = 0, 25 <= _) throw Error(s(301));
        _ += 1, ur = Bn = null, r.updateQueue = null, Tt.current = id, n = o(c, v);
      } while (fc);
    }
    if (Tt.current = uu, r = Bn !== null && Bn.next !== null, en = 0, ur = Bn = It = null, Bf = !1, r) throw Error(s(300));
    return n;
  }
  function wi() {
    var n = ru !== 0;
    return ru = 0, n;
  }
  function Nr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return ur === null ? It.memoizedState = ur = n : ur = ur.next = n, ur;
  }
  function On() {
    if (Bn === null) {
      var n = It.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Bn.next;
    var r = ur === null ? It.memoizedState : ur.next;
    if (r !== null) ur = r, Bn = n;
    else {
      if (n === null) throw Error(s(310));
      Bn = n, n = { memoizedState: Bn.memoizedState, baseState: Bn.baseState, baseQueue: Bn.baseQueue, queue: Bn.queue, next: null }, ur === null ? It.memoizedState = ur = n : ur = ur.next = n;
    }
    return ur;
  }
  function kl(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function fo(n) {
    var r = On(), o = r.queue;
    if (o === null) throw Error(s(311));
    o.lastRenderedReducer = n;
    var c = Bn, v = c.baseQueue, _ = o.pending;
    if (_ !== null) {
      if (v !== null) {
        var b = v.next;
        v.next = _.next, _.next = b;
      }
      c.baseQueue = v = _, o.pending = null;
    }
    if (v !== null) {
      _ = v.next, c = c.baseState;
      var M = b = null, j = null, Z = _;
      do {
        var _e = Z.lane;
        if ((en & _e) === _e) j !== null && (j = j.next = { lane: 0, action: Z.action, hasEagerState: Z.hasEagerState, eagerState: Z.eagerState, next: null }), c = Z.hasEagerState ? Z.eagerState : n(c, Z.action);
        else {
          var Ce = {
            lane: _e,
            action: Z.action,
            hasEagerState: Z.hasEagerState,
            eagerState: Z.eagerState,
            next: null
          };
          j === null ? (M = j = Ce, b = c) : j = j.next = Ce, It.lanes |= _e, rl |= _e;
        }
        Z = Z.next;
      } while (Z !== null && Z !== _);
      j === null ? b = c : j.next = M, Ei(c, r.memoizedState) || (Yn = !0), r.memoizedState = c, r.baseState = b, r.baseQueue = j, o.lastRenderedState = c;
    }
    if (n = o.interleaved, n !== null) {
      v = n;
      do
        _ = v.lane, It.lanes |= _, rl |= _, v = v.next;
      while (v !== n);
    } else v === null && (o.lanes = 0);
    return [r.memoizedState, o.dispatch];
  }
  function au(n) {
    var r = On(), o = r.queue;
    if (o === null) throw Error(s(311));
    o.lastRenderedReducer = n;
    var c = o.dispatch, v = o.pending, _ = r.memoizedState;
    if (v !== null) {
      o.pending = null;
      var b = v = v.next;
      do
        _ = n(_, b.action), b = b.next;
      while (b !== v);
      Ei(_, r.memoizedState) || (Yn = !0), r.memoizedState = _, r.baseQueue === null && (r.baseState = _), o.lastRenderedState = _;
    }
    return [_, c];
  }
  function Yf() {
  }
  function $f(n, r) {
    var o = It, c = On(), v = r(), _ = !Ei(c.memoizedState, v);
    if (_ && (c.memoizedState = v, Yn = !0), c = c.queue, dc(qf.bind(null, o, c, n), [n]), c.getSnapshot !== r || _ || ur !== null && ur.memoizedState.tag & 1) {
      if (o.flags |= 2048, iu(9, Gf.bind(null, o, c, v, r), void 0, null), nr === null) throw Error(s(349));
      en & 30 || Wf(o, r, v);
    }
    return v;
  }
  function Wf(n, r, o) {
    n.flags |= 16384, n = { getSnapshot: r, value: o }, r = It.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, It.updateQueue = r, r.stores = [n]) : (o = r.stores, o === null ? r.stores = [n] : o.push(n));
  }
  function Gf(n, r, o, c) {
    r.value = o, r.getSnapshot = c, Qf(r) && Xf(n);
  }
  function qf(n, r, o) {
    return o(function() {
      Qf(r) && Xf(n);
    });
  }
  function Qf(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var o = r();
      return !Ei(n, o);
    } catch {
      return !0;
    }
  }
  function Xf(n) {
    var r = Da(n, 1);
    r !== null && Wr(r, n, 1, -1);
  }
  function Kf(n) {
    var r = Nr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: kl, lastRenderedState: n }, r.queue = n, n = n.dispatch = ou.bind(null, It, n), [r.memoizedState, n];
  }
  function iu(n, r, o, c) {
    return n = { tag: n, create: r, destroy: o, deps: c, next: null }, r = It.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, It.updateQueue = r, r.lastEffect = n.next = n) : (o = r.lastEffect, o === null ? r.lastEffect = n.next = n : (c = o.next, o.next = n, n.next = c, r.lastEffect = n)), n;
  }
  function Jf() {
    return On().memoizedState;
  }
  function ns(n, r, o, c) {
    var v = Nr();
    It.flags |= n, v.memoizedState = iu(1 | r, o, void 0, c === void 0 ? null : c);
  }
  function rs(n, r, o, c) {
    var v = On();
    c = c === void 0 ? null : c;
    var _ = void 0;
    if (Bn !== null) {
      var b = Bn.memoizedState;
      if (_ = b.destroy, c !== null && st(c, b.deps)) {
        v.memoizedState = iu(r, o, _, c);
        return;
      }
    }
    It.flags |= n, v.memoizedState = iu(1 | r, o, _, c);
  }
  function Zf(n, r) {
    return ns(8390656, 8, n, r);
  }
  function dc(n, r) {
    return rs(2048, 8, n, r);
  }
  function ed(n, r) {
    return rs(4, 2, n, r);
  }
  function pc(n, r) {
    return rs(4, 4, n, r);
  }
  function lu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function td(n, r, o) {
    return o = o != null ? o.concat([n]) : null, rs(4, 4, lu.bind(null, r, n), o);
  }
  function hc() {
  }
  function nd(n, r) {
    var o = On();
    r = r === void 0 ? null : r;
    var c = o.memoizedState;
    return c !== null && r !== null && st(r, c[1]) ? c[0] : (o.memoizedState = [n, r], n);
  }
  function rd(n, r) {
    var o = On();
    r = r === void 0 ? null : r;
    var c = o.memoizedState;
    return c !== null && r !== null && st(r, c[1]) ? c[0] : (n = n(), o.memoizedState = [n, r], n);
  }
  function Xp(n, r, o) {
    return en & 21 ? (Ei(o, r) || (o = Uu(), It.lanes |= o, rl |= o, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Yn = !0), n.memoizedState = o);
  }
  function vc(n, r) {
    var o = Ft;
    Ft = o !== 0 && 4 > o ? o : 4, n(!0);
    var c = Ht.transition;
    Ht.transition = {};
    try {
      n(!1), r();
    } finally {
      Ft = o, Ht.transition = c;
    }
  }
  function Kp() {
    return On().memoizedState;
  }
  function mc(n, r, o) {
    var c = al(n);
    if (o = { lane: c, action: o, hasEagerState: !1, eagerState: null, next: null }, fa(n)) Em(r, o);
    else if (o = Wp(n, r, o, c), o !== null) {
      var v = Gn();
      Wr(o, n, c, v), rn(o, r, c);
    }
  }
  function ou(n, r, o) {
    var c = al(n), v = { lane: c, action: o, hasEagerState: !1, eagerState: null, next: null };
    if (fa(n)) Em(r, v);
    else {
      var _ = n.alternate;
      if (n.lanes === 0 && (_ === null || _.lanes === 0) && (_ = r.lastRenderedReducer, _ !== null)) try {
        var b = r.lastRenderedState, M = _(b, o);
        if (v.hasEagerState = !0, v.eagerState = M, Ei(M, b)) {
          var j = r.interleaved;
          j === null ? (v.next = v, $p(r)) : (v.next = j.next, j.next = v), r.interleaved = v;
          return;
        }
      } catch {
      } finally {
      }
      o = Wp(n, r, v, c), o !== null && (v = Gn(), Wr(o, n, c, v), rn(o, r, c));
    }
  }
  function fa(n) {
    var r = n.alternate;
    return n === It || r !== null && r === It;
  }
  function Em(n, r) {
    fc = Bf = !0;
    var o = n.pending;
    o === null ? r.next = r : (r.next = o.next, o.next = r), n.pending = r;
  }
  function rn(n, r, o) {
    if (o & 4194240) {
      var c = r.lanes;
      c &= n.pendingLanes, o |= c, r.lanes = o, gl(n, o);
    }
  }
  var uu = { readContext: qa, useCallback: jt, useContext: jt, useEffect: jt, useImperativeHandle: jt, useInsertionEffect: jt, useLayoutEffect: jt, useMemo: jt, useReducer: jt, useRef: jt, useState: jt, useDebugValue: jt, useDeferredValue: jt, useTransition: jt, useMutableSource: jt, useSyncExternalStore: jt, useId: jt, unstable_isNewReconciler: !1 }, ad = { readContext: qa, useCallback: function(n, r) {
    return Nr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: qa, useEffect: Zf, useImperativeHandle: function(n, r, o) {
    return o = o != null ? o.concat([n]) : null, ns(
      4194308,
      4,
      lu.bind(null, r, n),
      o
    );
  }, useLayoutEffect: function(n, r) {
    return ns(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return ns(4, 2, n, r);
  }, useMemo: function(n, r) {
    var o = Nr();
    return r = r === void 0 ? null : r, n = n(), o.memoizedState = [n, r], n;
  }, useReducer: function(n, r, o) {
    var c = Nr();
    return r = o !== void 0 ? o(r) : r, c.memoizedState = c.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, c.queue = n, n = n.dispatch = mc.bind(null, It, n), [c.memoizedState, n];
  }, useRef: function(n) {
    var r = Nr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Kf, useDebugValue: hc, useDeferredValue: function(n) {
    return Nr().memoizedState = n;
  }, useTransition: function() {
    var n = Kf(!1), r = n[0];
    return n = vc.bind(null, n[1]), Nr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, o) {
    var c = It, v = Nr();
    if (mn) {
      if (o === void 0) throw Error(s(407));
      o = o();
    } else {
      if (o = r(), nr === null) throw Error(s(349));
      en & 30 || Wf(c, r, o);
    }
    v.memoizedState = o;
    var _ = { value: o, getSnapshot: r };
    return v.queue = _, Zf(qf.bind(
      null,
      c,
      _,
      n
    ), [n]), c.flags |= 2048, iu(9, Gf.bind(null, c, _, o, r), void 0, null), o;
  }, useId: function() {
    var n = Nr(), r = nr.identifierPrefix;
    if (mn) {
      var o = Ji, c = Ki;
      o = (c & ~(1 << 32 - Hr(c) - 1)).toString(32) + o, r = ":" + r + "R" + o, o = ru++, 0 < o && (r += "H" + o.toString(32)), r += ":";
    } else o = me++, r = ":" + r + "r" + o.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, yc = {
    readContext: qa,
    useCallback: nd,
    useContext: qa,
    useEffect: dc,
    useImperativeHandle: td,
    useInsertionEffect: ed,
    useLayoutEffect: pc,
    useMemo: rd,
    useReducer: fo,
    useRef: Jf,
    useState: function() {
      return fo(kl);
    },
    useDebugValue: hc,
    useDeferredValue: function(n) {
      var r = On();
      return Xp(r, Bn.memoizedState, n);
    },
    useTransition: function() {
      var n = fo(kl)[0], r = On().memoizedState;
      return [n, r];
    },
    useMutableSource: Yf,
    useSyncExternalStore: $f,
    useId: Kp,
    unstable_isNewReconciler: !1
  }, id = { readContext: qa, useCallback: nd, useContext: qa, useEffect: dc, useImperativeHandle: td, useInsertionEffect: ed, useLayoutEffect: pc, useMemo: rd, useReducer: au, useRef: Jf, useState: function() {
    return au(kl);
  }, useDebugValue: hc, useDeferredValue: function(n) {
    var r = On();
    return Bn === null ? r.memoizedState = n : Xp(r, Bn.memoizedState, n);
  }, useTransition: function() {
    var n = au(kl)[0], r = On().memoizedState;
    return [n, r];
  }, useMutableSource: Yf, useSyncExternalStore: $f, useId: Kp, unstable_isNewReconciler: !1 };
  function xi(n, r) {
    if (n && n.defaultProps) {
      r = ye({}, r), n = n.defaultProps;
      for (var o in n) r[o] === void 0 && (r[o] = n[o]);
      return r;
    }
    return r;
  }
  function Jp(n, r, o, c) {
    r = n.memoizedState, o = o(c, r), o = o == null ? r : ye({}, r, o), n.memoizedState = o, n.lanes === 0 && (n.updateQueue.baseState = o);
  }
  var ld = { isMounted: function(n) {
    return (n = n._reactInternals) ? yt(n) === n : !1;
  }, enqueueSetState: function(n, r, o) {
    n = n._reactInternals;
    var c = Gn(), v = al(n), _ = Rl(c, v);
    _.payload = r, o != null && (_.callback = o), r = so(n, _, v), r !== null && (Wr(r, n, v, c), Hf(r, n, v));
  }, enqueueReplaceState: function(n, r, o) {
    n = n._reactInternals;
    var c = Gn(), v = al(n), _ = Rl(c, v);
    _.tag = 1, _.payload = r, o != null && (_.callback = o), r = so(n, _, v), r !== null && (Wr(r, n, v, c), Hf(r, n, v));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var o = Gn(), c = al(n), v = Rl(o, c);
    v.tag = 2, r != null && (v.callback = r), r = so(n, v, c), r !== null && (Wr(r, n, c, o), Hf(r, n, c));
  } };
  function Cm(n, r, o, c, v, _, b) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(c, _, b) : r.prototype && r.prototype.isPureReactComponent ? !Xs(o, c) || !Xs(v, _) : !0;
  }
  function od(n, r, o) {
    var c = !1, v = Mr, _ = r.contextType;
    return typeof _ == "object" && _ !== null ? _ = qa(_) : (v = In(r) ? la : xn.current, c = r.contextTypes, _ = (c = c != null) ? oa(n, v) : Mr), r = new r(o, _), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = ld, n.stateNode = r, r._reactInternals = n, c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = v, n.__reactInternalMemoizedMaskedChildContext = _), r;
  }
  function wm(n, r, o, c) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(o, c), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(o, c), r.state !== n && ld.enqueueReplaceState(r, r.state, null);
  }
  function gc(n, r, o, c) {
    var v = n.stateNode;
    v.props = o, v.state = n.memoizedState, v.refs = {}, Gp(n);
    var _ = r.contextType;
    typeof _ == "object" && _ !== null ? v.context = qa(_) : (_ = In(r) ? la : xn.current, v.context = oa(n, _)), v.state = n.memoizedState, _ = r.getDerivedStateFromProps, typeof _ == "function" && (Jp(n, r, _, o), v.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof v.getSnapshotBeforeUpdate == "function" || typeof v.UNSAFE_componentWillMount != "function" && typeof v.componentWillMount != "function" || (r = v.state, typeof v.componentWillMount == "function" && v.componentWillMount(), typeof v.UNSAFE_componentWillMount == "function" && v.UNSAFE_componentWillMount(), r !== v.state && ld.enqueueReplaceState(v, v.state, null), lc(n, o, v, c), v.state = n.memoizedState), typeof v.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function su(n, r) {
    try {
      var o = "", c = r;
      do
        o += qe(c), c = c.return;
      while (c);
      var v = o;
    } catch (_) {
      v = `
Error generating stack: ` + _.message + `
` + _.stack;
    }
    return { value: n, source: r, stack: v, digest: null };
  }
  function Zp(n, r, o) {
    return { value: n, source: null, stack: o ?? null, digest: r ?? null };
  }
  function eh(n, r) {
    try {
      console.error(r.value);
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  var ud = typeof WeakMap == "function" ? WeakMap : Map;
  function xm(n, r, o) {
    o = Rl(-1, o), o.tag = 3, o.payload = { element: null };
    var c = r.value;
    return o.callback = function() {
      ss || (ss = !0, du = c), eh(n, r);
    }, o;
  }
  function th(n, r, o) {
    o = Rl(-1, o), o.tag = 3;
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var v = r.value;
      o.payload = function() {
        return c(v);
      }, o.callback = function() {
        eh(n, r);
      };
    }
    var _ = n.stateNode;
    return _ !== null && typeof _.componentDidCatch == "function" && (o.callback = function() {
      eh(n, r), typeof c != "function" && (vo === null ? vo = /* @__PURE__ */ new Set([this]) : vo.add(this));
      var b = r.stack;
      this.componentDidCatch(r.value, { componentStack: b !== null ? b : "" });
    }), o;
  }
  function nh(n, r, o) {
    var c = n.pingCache;
    if (c === null) {
      c = n.pingCache = new ud();
      var v = /* @__PURE__ */ new Set();
      c.set(r, v);
    } else v = c.get(r), v === void 0 && (v = /* @__PURE__ */ new Set(), c.set(r, v));
    v.has(o) || (v.add(o), n = _0.bind(null, n, r, o), r.then(n, n));
  }
  function Tm(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function po(n, r, o, c, v) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = v, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, o.flags |= 131072, o.flags &= -52805, o.tag === 1 && (o.alternate === null ? o.tag = 17 : (r = Rl(-1, 1), r.tag = 2, so(o, r, 1))), o.lanes |= 1), n);
  }
  var _c = se.ReactCurrentOwner, Yn = !1;
  function gr(n, r, o, c) {
    r.child = n === null ? Me(r, null, o, c) : Dn(r, n.child, o, c);
  }
  function da(n, r, o, c, v) {
    o = o.render;
    var _ = r.ref;
    return En(r, v), c = co(n, r, o, c, _, v), o = wi(), n !== null && !Yn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~v, Xa(n, r, v)) : (mn && o && Uf(r), r.flags |= 1, gr(n, r, c, v), r.child);
  }
  function cu(n, r, o, c, v) {
    if (n === null) {
      var _ = o.type;
      return typeof _ == "function" && !mh(_) && _.defaultProps === void 0 && o.compare === null && o.defaultProps === void 0 ? (r.tag = 15, r.type = _, _t(n, r, _, c, v)) : (n = zc(o.type, null, c, r, r.mode, v), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (_ = n.child, !(n.lanes & v)) {
      var b = _.memoizedProps;
      if (o = o.compare, o = o !== null ? o : Xs, o(b, c) && n.ref === r.ref) return Xa(n, r, v);
    }
    return r.flags |= 1, n = yo(_, c), n.ref = r.ref, n.return = r, r.child = n;
  }
  function _t(n, r, o, c, v) {
    if (n !== null) {
      var _ = n.memoizedProps;
      if (Xs(_, c) && n.ref === r.ref) if (Yn = !1, r.pendingProps = c = _, (n.lanes & v) !== 0) n.flags & 131072 && (Yn = !0);
      else return r.lanes = n.lanes, Xa(n, r, v);
    }
    return bm(n, r, o, c, v);
  }
  function Sc(n, r, o) {
    var c = r.pendingProps, v = c.children, _ = n !== null ? n.memoizedState : null;
    if (c.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Je(ls, La), La |= o;
    else {
      if (!(o & 1073741824)) return n = _ !== null ? _.baseLanes | o : o, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Je(ls, La), La |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, c = _ !== null ? _.baseLanes : o, Je(ls, La), La |= c;
    }
    else _ !== null ? (c = _.baseLanes | o, r.memoizedState = null) : c = o, Je(ls, La), La |= c;
    return gr(n, r, v, o), r.child;
  }
  function rh(n, r) {
    var o = r.ref;
    (n === null && o !== null || n !== null && n.ref !== o) && (r.flags |= 512, r.flags |= 2097152);
  }
  function bm(n, r, o, c, v) {
    var _ = In(o) ? la : xn.current;
    return _ = oa(r, _), En(r, v), o = co(n, r, o, c, _, v), c = wi(), n !== null && !Yn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~v, Xa(n, r, v)) : (mn && c && Uf(r), r.flags |= 1, gr(n, r, o, v), r.child);
  }
  function Rm(n, r, o, c, v) {
    if (In(o)) {
      var _ = !0;
      or(r);
    } else _ = !1;
    if (En(r, v), r.stateNode === null) Qa(n, r), od(r, o, c), gc(r, o, c, v), c = !0;
    else if (n === null) {
      var b = r.stateNode, M = r.memoizedProps;
      b.props = M;
      var j = b.context, Z = o.contextType;
      typeof Z == "object" && Z !== null ? Z = qa(Z) : (Z = In(o) ? la : xn.current, Z = oa(r, Z));
      var _e = o.getDerivedStateFromProps, Ce = typeof _e == "function" || typeof b.getSnapshotBeforeUpdate == "function";
      Ce || typeof b.UNSAFE_componentWillReceiveProps != "function" && typeof b.componentWillReceiveProps != "function" || (M !== c || j !== Z) && wm(r, b, c, Z), Oa = !1;
      var ge = r.memoizedState;
      b.state = ge, lc(r, c, b, v), j = r.memoizedState, M !== c || ge !== j || er.current || Oa ? (typeof _e == "function" && (Jp(r, o, _e, c), j = r.memoizedState), (M = Oa || Cm(r, o, M, c, ge, j, Z)) ? (Ce || typeof b.UNSAFE_componentWillMount != "function" && typeof b.componentWillMount != "function" || (typeof b.componentWillMount == "function" && b.componentWillMount(), typeof b.UNSAFE_componentWillMount == "function" && b.UNSAFE_componentWillMount()), typeof b.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof b.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = c, r.memoizedState = j), b.props = c, b.state = j, b.context = Z, c = M) : (typeof b.componentDidMount == "function" && (r.flags |= 4194308), c = !1);
    } else {
      b = r.stateNode, gm(n, r), M = r.memoizedProps, Z = r.type === r.elementType ? M : xi(r.type, M), b.props = Z, Ce = r.pendingProps, ge = b.context, j = o.contextType, typeof j == "object" && j !== null ? j = qa(j) : (j = In(o) ? la : xn.current, j = oa(r, j));
      var ze = o.getDerivedStateFromProps;
      (_e = typeof ze == "function" || typeof b.getSnapshotBeforeUpdate == "function") || typeof b.UNSAFE_componentWillReceiveProps != "function" && typeof b.componentWillReceiveProps != "function" || (M !== Ce || ge !== j) && wm(r, b, c, j), Oa = !1, ge = r.memoizedState, b.state = ge, lc(r, c, b, v);
      var Ie = r.memoizedState;
      M !== Ce || ge !== Ie || er.current || Oa ? (typeof ze == "function" && (Jp(r, o, ze, c), Ie = r.memoizedState), (Z = Oa || Cm(r, o, Z, c, ge, Ie, j) || !1) ? (_e || typeof b.UNSAFE_componentWillUpdate != "function" && typeof b.componentWillUpdate != "function" || (typeof b.componentWillUpdate == "function" && b.componentWillUpdate(c, Ie, j), typeof b.UNSAFE_componentWillUpdate == "function" && b.UNSAFE_componentWillUpdate(c, Ie, j)), typeof b.componentDidUpdate == "function" && (r.flags |= 4), typeof b.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof b.componentDidUpdate != "function" || M === n.memoizedProps && ge === n.memoizedState || (r.flags |= 4), typeof b.getSnapshotBeforeUpdate != "function" || M === n.memoizedProps && ge === n.memoizedState || (r.flags |= 1024), r.memoizedProps = c, r.memoizedState = Ie), b.props = c, b.state = Ie, b.context = j, c = Z) : (typeof b.componentDidUpdate != "function" || M === n.memoizedProps && ge === n.memoizedState || (r.flags |= 4), typeof b.getSnapshotBeforeUpdate != "function" || M === n.memoizedProps && ge === n.memoizedState || (r.flags |= 1024), c = !1);
    }
    return Ec(n, r, o, c, _, v);
  }
  function Ec(n, r, o, c, v, _) {
    rh(n, r);
    var b = (r.flags & 128) !== 0;
    if (!c && !b) return v && Af(r, o, !1), Xa(n, r, _);
    c = r.stateNode, _c.current = r;
    var M = b && typeof o.getDerivedStateFromError != "function" ? null : c.render();
    return r.flags |= 1, n !== null && b ? (r.child = Dn(r, n.child, null, _), r.child = Dn(r, null, M, _)) : gr(n, r, M, _), r.memoizedState = c.state, v && Af(r, o, !0), r.child;
  }
  function as(n) {
    var r = n.stateNode;
    r.pendingContext ? hm(n, r.pendingContext, r.pendingContext !== r.context) : r.context && hm(n, r.context, !1), Qp(n, r.containerInfo);
  }
  function km(n, r, o, c, v) {
    return uo(), bl(v), r.flags |= 256, gr(n, r, o, c), r.child;
  }
  var sd = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ah(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function cd(n, r, o) {
    var c = r.pendingProps, v = Cn.current, _ = !1, b = (r.flags & 128) !== 0, M;
    if ((M = b) || (M = n !== null && n.memoizedState === null ? !1 : (v & 2) !== 0), M ? (_ = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (v |= 1), Je(Cn, v & 1), n === null)
      return Hp(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (b = c.children, n = c.fallback, _ ? (c = r.mode, _ = r.child, b = { mode: "hidden", children: b }, !(c & 1) && _ !== null ? (_.childLanes = 0, _.pendingProps = b) : _ = go(b, c, 0, null), n = Ml(n, c, o, null), _.return = r, n.return = r, _.sibling = n, r.child = _, r.child.memoizedState = ah(o), r.memoizedState = sd, n) : ih(r, b));
    if (v = n.memoizedState, v !== null && (M = v.dehydrated, M !== null)) return Dm(n, r, b, c, M, v, o);
    if (_) {
      _ = c.fallback, b = r.mode, v = n.child, M = v.sibling;
      var j = { mode: "hidden", children: c.children };
      return !(b & 1) && r.child !== v ? (c = r.child, c.childLanes = 0, c.pendingProps = j, r.deletions = null) : (c = yo(v, j), c.subtreeFlags = v.subtreeFlags & 14680064), M !== null ? _ = yo(M, _) : (_ = Ml(_, b, o, null), _.flags |= 2), _.return = r, c.return = r, c.sibling = _, r.child = c, c = _, _ = r.child, b = n.child.memoizedState, b = b === null ? ah(o) : { baseLanes: b.baseLanes | o, cachePool: null, transitions: b.transitions }, _.memoizedState = b, _.childLanes = n.childLanes & ~o, r.memoizedState = sd, c;
    }
    return _ = n.child, n = _.sibling, c = yo(_, { mode: "visible", children: c.children }), !(r.mode & 1) && (c.lanes = o), c.return = r, c.sibling = null, n !== null && (o = r.deletions, o === null ? (r.deletions = [n], r.flags |= 16) : o.push(n)), r.child = c, r.memoizedState = null, c;
  }
  function ih(n, r) {
    return r = go({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Cc(n, r, o, c) {
    return c !== null && bl(c), Dn(r, n.child, null, o), n = ih(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Dm(n, r, o, c, v, _, b) {
    if (o)
      return r.flags & 256 ? (r.flags &= -257, c = Zp(Error(s(422))), Cc(n, r, b, c)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (_ = c.fallback, v = r.mode, c = go({ mode: "visible", children: c.children }, v, 0, null), _ = Ml(_, v, b, null), _.flags |= 2, c.return = r, _.return = r, c.sibling = _, r.child = c, r.mode & 1 && Dn(r, n.child, null, b), r.child.memoizedState = ah(b), r.memoizedState = sd, _);
    if (!(r.mode & 1)) return Cc(n, r, b, null);
    if (v.data === "$!") {
      if (c = v.nextSibling && v.nextSibling.dataset, c) var M = c.dgst;
      return c = M, _ = Error(s(419)), c = Zp(_, c, void 0), Cc(n, r, b, c);
    }
    if (M = (b & n.childLanes) !== 0, Yn || M) {
      if (c = nr, c !== null) {
        switch (b & -b) {
          case 4:
            v = 2;
            break;
          case 16:
            v = 8;
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
            v = 32;
            break;
          case 536870912:
            v = 268435456;
            break;
          default:
            v = 0;
        }
        v = v & (c.suspendedLanes | b) ? 0 : v, v !== 0 && v !== _.retryLane && (_.retryLane = v, Da(n, v), Wr(c, n, v, -1));
      }
      return vh(), c = Zp(Error(s(421))), Cc(n, r, b, c);
    }
    return v.data === "$?" ? (r.flags |= 128, r.child = n.child, r = S0.bind(null, n), v._reactRetry = r, null) : (n = _.treeContext, sa = Gi(v.nextSibling), ua = r, mn = !0, Ga = null, n !== null && (Vn[Wa++] = Ki, Vn[Wa++] = Ji, Vn[Wa++] = Ra, Ki = n.id, Ji = n.overflow, Ra = r), r = ih(r, c.children), r.flags |= 4096, r);
  }
  function lh(n, r, o) {
    n.lanes |= r;
    var c = n.alternate;
    c !== null && (c.lanes |= r), Yp(n.return, r, o);
  }
  function Br(n, r, o, c, v) {
    var _ = n.memoizedState;
    _ === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: c, tail: o, tailMode: v } : (_.isBackwards = r, _.rendering = null, _.renderingStartTime = 0, _.last = c, _.tail = o, _.tailMode = v);
  }
  function el(n, r, o) {
    var c = r.pendingProps, v = c.revealOrder, _ = c.tail;
    if (gr(n, r, c.children, o), c = Cn.current, c & 2) c = c & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && lh(n, o, r);
        else if (n.tag === 19) lh(n, o, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      c &= 1;
    }
    if (Je(Cn, c), !(r.mode & 1)) r.memoizedState = null;
    else switch (v) {
      case "forwards":
        for (o = r.child, v = null; o !== null; ) n = o.alternate, n !== null && Vf(n) === null && (v = o), o = o.sibling;
        o = v, o === null ? (v = r.child, r.child = null) : (v = o.sibling, o.sibling = null), Br(r, !1, v, o, _);
        break;
      case "backwards":
        for (o = null, v = r.child, r.child = null; v !== null; ) {
          if (n = v.alternate, n !== null && Vf(n) === null) {
            r.child = v;
            break;
          }
          n = v.sibling, v.sibling = o, o = v, v = n;
        }
        Br(r, !0, o, null, _);
        break;
      case "together":
        Br(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Qa(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Xa(n, r, o) {
    if (n !== null && (r.dependencies = n.dependencies), rl |= r.lanes, !(o & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(s(153));
    if (r.child !== null) {
      for (n = r.child, o = yo(n, n.pendingProps), r.child = o, o.return = r; n.sibling !== null; ) n = n.sibling, o = o.sibling = yo(n, n.pendingProps), o.return = r;
      o.sibling = null;
    }
    return r.child;
  }
  function wc(n, r, o) {
    switch (r.tag) {
      case 3:
        as(r), uo();
        break;
      case 5:
        Sm(r);
        break;
      case 1:
        In(r.type) && or(r);
        break;
      case 4:
        Qp(r, r.stateNode.containerInfo);
        break;
      case 10:
        var c = r.type._context, v = r.memoizedProps.value;
        Je(ka, c._currentValue), c._currentValue = v;
        break;
      case 13:
        if (c = r.memoizedState, c !== null)
          return c.dehydrated !== null ? (Je(Cn, Cn.current & 1), r.flags |= 128, null) : o & r.child.childLanes ? cd(n, r, o) : (Je(Cn, Cn.current & 1), n = Xa(n, r, o), n !== null ? n.sibling : null);
        Je(Cn, Cn.current & 1);
        break;
      case 19:
        if (c = (o & r.childLanes) !== 0, n.flags & 128) {
          if (c) return el(n, r, o);
          r.flags |= 128;
        }
        if (v = r.memoizedState, v !== null && (v.rendering = null, v.tail = null, v.lastEffect = null), Je(Cn, Cn.current), c) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Sc(n, r, o);
    }
    return Xa(n, r, o);
  }
  var Ka, $n, Om, Lm;
  Ka = function(n, r) {
    for (var o = r.child; o !== null; ) {
      if (o.tag === 5 || o.tag === 6) n.appendChild(o.stateNode);
      else if (o.tag !== 4 && o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === r) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === r) return;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
  }, $n = function() {
  }, Om = function(n, r, o, c) {
    var v = n.memoizedProps;
    if (v !== c) {
      n = r.stateNode, tu(Zi.current);
      var _ = null;
      switch (o) {
        case "input":
          v = pr(n, v), c = pr(n, c), _ = [];
          break;
        case "select":
          v = ye({}, v, { value: void 0 }), c = ye({}, c, { value: void 0 }), _ = [];
          break;
        case "textarea":
          v = Jn(n, v), c = Jn(n, c), _ = [];
          break;
        default:
          typeof v.onClick != "function" && typeof c.onClick == "function" && (n.onclick = no);
      }
      cn(o, c);
      var b;
      o = null;
      for (Z in v) if (!c.hasOwnProperty(Z) && v.hasOwnProperty(Z) && v[Z] != null) if (Z === "style") {
        var M = v[Z];
        for (b in M) M.hasOwnProperty(b) && (o || (o = {}), o[b] = "");
      } else Z !== "dangerouslySetInnerHTML" && Z !== "children" && Z !== "suppressContentEditableWarning" && Z !== "suppressHydrationWarning" && Z !== "autoFocus" && (p.hasOwnProperty(Z) ? _ || (_ = []) : (_ = _ || []).push(Z, null));
      for (Z in c) {
        var j = c[Z];
        if (M = v != null ? v[Z] : void 0, c.hasOwnProperty(Z) && j !== M && (j != null || M != null)) if (Z === "style") if (M) {
          for (b in M) !M.hasOwnProperty(b) || j && j.hasOwnProperty(b) || (o || (o = {}), o[b] = "");
          for (b in j) j.hasOwnProperty(b) && M[b] !== j[b] && (o || (o = {}), o[b] = j[b]);
        } else o || (_ || (_ = []), _.push(
          Z,
          o
        )), o = j;
        else Z === "dangerouslySetInnerHTML" ? (j = j ? j.__html : void 0, M = M ? M.__html : void 0, j != null && M !== j && (_ = _ || []).push(Z, j)) : Z === "children" ? typeof j != "string" && typeof j != "number" || (_ = _ || []).push(Z, "" + j) : Z !== "suppressContentEditableWarning" && Z !== "suppressHydrationWarning" && (p.hasOwnProperty(Z) ? (j != null && Z === "onScroll" && Wt("scroll", n), _ || M === j || (_ = [])) : (_ = _ || []).push(Z, j));
      }
      o && (_ = _ || []).push("style", o);
      var Z = _;
      (r.updateQueue = Z) && (r.flags |= 4);
    }
  }, Lm = function(n, r, o, c) {
    o !== c && (r.flags |= 4);
  };
  function xc(n, r) {
    if (!mn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var o = null; r !== null; ) r.alternate !== null && (o = r), r = r.sibling;
        o === null ? n.tail = null : o.sibling = null;
        break;
      case "collapsed":
        o = n.tail;
        for (var c = null; o !== null; ) o.alternate !== null && (c = o), o = o.sibling;
        c === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : c.sibling = null;
    }
  }
  function sr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, o = 0, c = 0;
    if (r) for (var v = n.child; v !== null; ) o |= v.lanes | v.childLanes, c |= v.subtreeFlags & 14680064, c |= v.flags & 14680064, v.return = n, v = v.sibling;
    else for (v = n.child; v !== null; ) o |= v.lanes | v.childLanes, c |= v.subtreeFlags, c |= v.flags, v.return = n, v = v.sibling;
    return n.subtreeFlags |= c, n.childLanes = o, r;
  }
  function Mm(n, r, o) {
    var c = r.pendingProps;
    switch (jf(r), r.tag) {
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
        return sr(r), null;
      case 1:
        return In(r.type) && Zu(), sr(r), null;
      case 3:
        return c = r.stateNode, nu(), sn(er), sn(xn), et(), c.pendingContext && (c.context = c.pendingContext, c.pendingContext = null), (n === null || n.child === null) && (Pf(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ga !== null && (pu(Ga), Ga = null))), $n(n, r), sr(r), null;
      case 5:
        If(r);
        var v = tu(sc.current);
        if (o = r.type, n !== null && r.stateNode != null) Om(n, r, o, c, v), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!c) {
            if (r.stateNode === null) throw Error(s(166));
            return sr(r), null;
          }
          if (n = tu(Zi.current), Pf(r)) {
            c = r.stateNode, o = r.type;
            var _ = r.memoizedProps;
            switch (c[qi] = r, c[nc] = _, n = (r.mode & 1) !== 0, o) {
              case "dialog":
                Wt("cancel", c), Wt("close", c);
                break;
              case "iframe":
              case "object":
              case "embed":
                Wt("load", c);
                break;
              case "video":
              case "audio":
                for (v = 0; v < Zs.length; v++) Wt(Zs[v], c);
                break;
              case "source":
                Wt("error", c);
                break;
              case "img":
              case "image":
              case "link":
                Wt(
                  "error",
                  c
                ), Wt("load", c);
                break;
              case "details":
                Wt("toggle", c);
                break;
              case "input":
                Xn(c, _), Wt("invalid", c);
                break;
              case "select":
                c._wrapperState = { wasMultiple: !!_.multiple }, Wt("invalid", c);
                break;
              case "textarea":
                Dr(c, _), Wt("invalid", c);
            }
            cn(o, _), v = null;
            for (var b in _) if (_.hasOwnProperty(b)) {
              var M = _[b];
              b === "children" ? typeof M == "string" ? c.textContent !== M && (_.suppressHydrationWarning !== !0 && Of(c.textContent, M, n), v = ["children", M]) : typeof M == "number" && c.textContent !== "" + M && (_.suppressHydrationWarning !== !0 && Of(
                c.textContent,
                M,
                n
              ), v = ["children", "" + M]) : p.hasOwnProperty(b) && M != null && b === "onScroll" && Wt("scroll", c);
            }
            switch (o) {
              case "input":
                Pn(c), ji(c, _, !0);
                break;
              case "textarea":
                Pn(c), Fn(c);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof _.onClick == "function" && (c.onclick = no);
            }
            c = v, r.updateQueue = c, c !== null && (r.flags |= 4);
          } else {
            b = v.nodeType === 9 ? v : v.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Or(o)), n === "http://www.w3.org/1999/xhtml" ? o === "script" ? (n = b.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof c.is == "string" ? n = b.createElement(o, { is: c.is }) : (n = b.createElement(o), o === "select" && (b = n, c.multiple ? b.multiple = !0 : c.size && (b.size = c.size))) : n = b.createElementNS(n, o), n[qi] = r, n[nc] = c, Ka(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (b = lr(o, c), o) {
                case "dialog":
                  Wt("cancel", n), Wt("close", n), v = c;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Wt("load", n), v = c;
                  break;
                case "video":
                case "audio":
                  for (v = 0; v < Zs.length; v++) Wt(Zs[v], n);
                  v = c;
                  break;
                case "source":
                  Wt("error", n), v = c;
                  break;
                case "img":
                case "image":
                case "link":
                  Wt(
                    "error",
                    n
                  ), Wt("load", n), v = c;
                  break;
                case "details":
                  Wt("toggle", n), v = c;
                  break;
                case "input":
                  Xn(n, c), v = pr(n, c), Wt("invalid", n);
                  break;
                case "option":
                  v = c;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!c.multiple }, v = ye({}, c, { value: void 0 }), Wt("invalid", n);
                  break;
                case "textarea":
                  Dr(n, c), v = Jn(n, c), Wt("invalid", n);
                  break;
                default:
                  v = c;
              }
              cn(o, v), M = v;
              for (_ in M) if (M.hasOwnProperty(_)) {
                var j = M[_];
                _ === "style" ? an(n, j) : _ === "dangerouslySetInnerHTML" ? (j = j ? j.__html : void 0, j != null && Pi(n, j)) : _ === "children" ? typeof j == "string" ? (o !== "textarea" || j !== "") && ke(n, j) : typeof j == "number" && ke(n, "" + j) : _ !== "suppressContentEditableWarning" && _ !== "suppressHydrationWarning" && _ !== "autoFocus" && (p.hasOwnProperty(_) ? j != null && _ === "onScroll" && Wt("scroll", n) : j != null && ne(n, _, j, b));
              }
              switch (o) {
                case "input":
                  Pn(n), ji(n, c, !1);
                  break;
                case "textarea":
                  Pn(n), Fn(n);
                  break;
                case "option":
                  c.value != null && n.setAttribute("value", "" + ct(c.value));
                  break;
                case "select":
                  n.multiple = !!c.multiple, _ = c.value, _ != null ? Rn(n, !!c.multiple, _, !1) : c.defaultValue != null && Rn(
                    n,
                    !!c.multiple,
                    c.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof v.onClick == "function" && (n.onclick = no);
              }
              switch (o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  c = !!c.autoFocus;
                  break e;
                case "img":
                  c = !0;
                  break e;
                default:
                  c = !1;
              }
            }
            c && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return sr(r), null;
      case 6:
        if (n && r.stateNode != null) Lm(n, r, n.memoizedProps, c);
        else {
          if (typeof c != "string" && r.stateNode === null) throw Error(s(166));
          if (o = tu(sc.current), tu(Zi.current), Pf(r)) {
            if (c = r.stateNode, o = r.memoizedProps, c[qi] = r, (_ = c.nodeValue !== o) && (n = ua, n !== null)) switch (n.tag) {
              case 3:
                Of(c.nodeValue, o, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Of(c.nodeValue, o, (n.mode & 1) !== 0);
            }
            _ && (r.flags |= 4);
          } else c = (o.nodeType === 9 ? o : o.ownerDocument).createTextNode(c), c[qi] = r, r.stateNode = c;
        }
        return sr(r), null;
      case 13:
        if (sn(Cn), c = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (mn && sa !== null && r.mode & 1 && !(r.flags & 128)) ic(), uo(), r.flags |= 98560, _ = !1;
          else if (_ = Pf(r), c !== null && c.dehydrated !== null) {
            if (n === null) {
              if (!_) throw Error(s(318));
              if (_ = r.memoizedState, _ = _ !== null ? _.dehydrated : null, !_) throw Error(s(317));
              _[qi] = r;
            } else uo(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            sr(r), _ = !1;
          } else Ga !== null && (pu(Ga), Ga = null), _ = !0;
          if (!_) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = o, r) : (c = c !== null, c !== (n !== null && n.memoizedState !== null) && c && (r.child.flags |= 8192, r.mode & 1 && (n === null || Cn.current & 1 ? Mn === 0 && (Mn = 3) : vh())), r.updateQueue !== null && (r.flags |= 4), sr(r), null);
      case 4:
        return nu(), $n(n, r), n === null && qu(r.stateNode.containerInfo), sr(r), null;
      case 10:
        return Bp(r.type._context), sr(r), null;
      case 17:
        return In(r.type) && Zu(), sr(r), null;
      case 19:
        if (sn(Cn), _ = r.memoizedState, _ === null) return sr(r), null;
        if (c = (r.flags & 128) !== 0, b = _.rendering, b === null) if (c) xc(_, !1);
        else {
          if (Mn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (b = Vf(n), b !== null) {
              for (r.flags |= 128, xc(_, !1), c = b.updateQueue, c !== null && (r.updateQueue = c, r.flags |= 4), r.subtreeFlags = 0, c = o, o = r.child; o !== null; ) _ = o, n = c, _.flags &= 14680066, b = _.alternate, b === null ? (_.childLanes = 0, _.lanes = n, _.child = null, _.subtreeFlags = 0, _.memoizedProps = null, _.memoizedState = null, _.updateQueue = null, _.dependencies = null, _.stateNode = null) : (_.childLanes = b.childLanes, _.lanes = b.lanes, _.child = b.child, _.subtreeFlags = 0, _.deletions = null, _.memoizedProps = b.memoizedProps, _.memoizedState = b.memoizedState, _.updateQueue = b.updateQueue, _.type = b.type, n = b.dependencies, _.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), o = o.sibling;
              return Je(Cn, Cn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          _.tail !== null && gt() > us && (r.flags |= 128, c = !0, xc(_, !1), r.lanes = 4194304);
        }
        else {
          if (!c) if (n = Vf(b), n !== null) {
            if (r.flags |= 128, c = !0, o = n.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), xc(_, !0), _.tail === null && _.tailMode === "hidden" && !b.alternate && !mn) return sr(r), null;
          } else 2 * gt() - _.renderingStartTime > us && o !== 1073741824 && (r.flags |= 128, c = !0, xc(_, !1), r.lanes = 4194304);
          _.isBackwards ? (b.sibling = r.child, r.child = b) : (o = _.last, o !== null ? o.sibling = b : r.child = b, _.last = b);
        }
        return _.tail !== null ? (r = _.tail, _.rendering = r, _.tail = r.sibling, _.renderingStartTime = gt(), r.sibling = null, o = Cn.current, Je(Cn, c ? o & 1 | 2 : o & 1), r) : (sr(r), null);
      case 22:
      case 23:
        return hh(), c = r.memoizedState !== null, n !== null && n.memoizedState !== null !== c && (r.flags |= 8192), c && r.mode & 1 ? La & 1073741824 && (sr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : sr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, r.tag));
  }
  function fd(n, r) {
    switch (jf(r), r.tag) {
      case 1:
        return In(r.type) && Zu(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return nu(), sn(er), sn(xn), et(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return If(r), null;
      case 13:
        if (sn(Cn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(s(340));
          uo();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return sn(Cn), null;
      case 4:
        return nu(), null;
      case 10:
        return Bp(r.type._context), null;
      case 22:
      case 23:
        return hh(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Tc = !1, Ar = !1, p0 = typeof WeakSet == "function" ? WeakSet : Set, Fe = null;
  function is(n, r) {
    var o = n.ref;
    if (o !== null) if (typeof o == "function") try {
      o(null);
    } catch (c) {
      yn(n, r, c);
    }
    else o.current = null;
  }
  function dd(n, r, o) {
    try {
      o();
    } catch (c) {
      yn(n, r, c);
    }
  }
  var Nm = !1;
  function Am(n, r) {
    if (tc = Va, n = Ks(), Cf(n)) {
      if ("selectionStart" in n) var o = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        o = (o = n.ownerDocument) && o.defaultView || window;
        var c = o.getSelection && o.getSelection();
        if (c && c.rangeCount !== 0) {
          o = c.anchorNode;
          var v = c.anchorOffset, _ = c.focusNode;
          c = c.focusOffset;
          try {
            o.nodeType, _.nodeType;
          } catch {
            o = null;
            break e;
          }
          var b = 0, M = -1, j = -1, Z = 0, _e = 0, Ce = n, ge = null;
          t: for (; ; ) {
            for (var ze; Ce !== o || v !== 0 && Ce.nodeType !== 3 || (M = b + v), Ce !== _ || c !== 0 && Ce.nodeType !== 3 || (j = b + c), Ce.nodeType === 3 && (b += Ce.nodeValue.length), (ze = Ce.firstChild) !== null; )
              ge = Ce, Ce = ze;
            for (; ; ) {
              if (Ce === n) break t;
              if (ge === o && ++Z === v && (M = b), ge === _ && ++_e === c && (j = b), (ze = Ce.nextSibling) !== null) break;
              Ce = ge, ge = Ce.parentNode;
            }
            Ce = ze;
          }
          o = M === -1 || j === -1 ? null : { start: M, end: j };
        } else o = null;
      }
      o = o || { start: 0, end: 0 };
    } else o = null;
    for (Qo = { focusedElem: n, selectionRange: o }, Va = !1, Fe = r; Fe !== null; ) if (r = Fe, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Fe = n;
    else for (; Fe !== null; ) {
      r = Fe;
      try {
        var Ie = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ie !== null) {
              var $e = Ie.memoizedProps, Nn = Ie.memoizedState, $ = r.stateNode, H = $.getSnapshotBeforeUpdate(r.elementType === r.type ? $e : xi(r.type, $e), Nn);
              $.__reactInternalSnapshotBeforeUpdate = H;
            }
            break;
          case 3:
            var X = r.stateNode.containerInfo;
            X.nodeType === 1 ? X.textContent = "" : X.nodeType === 9 && X.documentElement && X.removeChild(X.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(s(163));
        }
      } catch (Se) {
        yn(r, r.return, Se);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Fe = n;
        break;
      }
      Fe = r.return;
    }
    return Ie = Nm, Nm = !1, Ie;
  }
  function bc(n, r, o) {
    var c = r.updateQueue;
    if (c = c !== null ? c.lastEffect : null, c !== null) {
      var v = c = c.next;
      do {
        if ((v.tag & n) === n) {
          var _ = v.destroy;
          v.destroy = void 0, _ !== void 0 && dd(r, o, _);
        }
        v = v.next;
      } while (v !== c);
    }
  }
  function Rc(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & n) === n) {
          var c = o.create;
          o.destroy = c();
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function oh(n) {
    var r = n.ref;
    if (r !== null) {
      var o = n.stateNode;
      switch (n.tag) {
        case 5:
          n = o;
          break;
        default:
          n = o;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function pd(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, pd(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[qi], delete r[nc], delete r[rc], delete r[Ju], delete r[f0])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function kc(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Dl(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || kc(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function tl(n, r, o) {
    var c = n.tag;
    if (c === 5 || c === 6) n = n.stateNode, r ? o.nodeType === 8 ? o.parentNode.insertBefore(n, r) : o.insertBefore(n, r) : (o.nodeType === 8 ? (r = o.parentNode, r.insertBefore(n, o)) : (r = o, r.appendChild(n)), o = o._reactRootContainer, o != null || r.onclick !== null || (r.onclick = no));
    else if (c !== 4 && (n = n.child, n !== null)) for (tl(n, r, o), n = n.sibling; n !== null; ) tl(n, r, o), n = n.sibling;
  }
  function nl(n, r, o) {
    var c = n.tag;
    if (c === 5 || c === 6) n = n.stateNode, r ? o.insertBefore(n, r) : o.appendChild(n);
    else if (c !== 4 && (n = n.child, n !== null)) for (nl(n, r, o), n = n.sibling; n !== null; ) nl(n, r, o), n = n.sibling;
  }
  var Ln = null, Yr = !1;
  function $r(n, r, o) {
    for (o = o.child; o !== null; ) zm(n, r, o), o = o.sibling;
  }
  function zm(n, r, o) {
    if (aa && typeof aa.onCommitFiberUnmount == "function") try {
      aa.onCommitFiberUnmount(Gl, o);
    } catch {
    }
    switch (o.tag) {
      case 5:
        Ar || is(o, r);
      case 6:
        var c = Ln, v = Yr;
        Ln = null, $r(n, r, o), Ln = c, Yr = v, Ln !== null && (Yr ? (n = Ln, o = o.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(o) : n.removeChild(o)) : Ln.removeChild(o.stateNode));
        break;
      case 18:
        Ln !== null && (Yr ? (n = Ln, o = o.stateNode, n.nodeType === 8 ? Ku(n.parentNode, o) : n.nodeType === 1 && Ku(n, o), _i(n)) : Ku(Ln, o.stateNode));
        break;
      case 4:
        c = Ln, v = Yr, Ln = o.stateNode.containerInfo, Yr = !0, $r(n, r, o), Ln = c, Yr = v;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Ar && (c = o.updateQueue, c !== null && (c = c.lastEffect, c !== null))) {
          v = c = c.next;
          do {
            var _ = v, b = _.destroy;
            _ = _.tag, b !== void 0 && (_ & 2 || _ & 4) && dd(o, r, b), v = v.next;
          } while (v !== c);
        }
        $r(n, r, o);
        break;
      case 1:
        if (!Ar && (is(o, r), c = o.stateNode, typeof c.componentWillUnmount == "function")) try {
          c.props = o.memoizedProps, c.state = o.memoizedState, c.componentWillUnmount();
        } catch (M) {
          yn(o, r, M);
        }
        $r(n, r, o);
        break;
      case 21:
        $r(n, r, o);
        break;
      case 22:
        o.mode & 1 ? (Ar = (c = Ar) || o.memoizedState !== null, $r(n, r, o), Ar = c) : $r(n, r, o);
        break;
      default:
        $r(n, r, o);
    }
  }
  function Um(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var o = n.stateNode;
      o === null && (o = n.stateNode = new p0()), r.forEach(function(c) {
        var v = $m.bind(null, n, c);
        o.has(c) || (o.add(c), c.then(v, v));
      });
    }
  }
  function Ti(n, r) {
    var o = r.deletions;
    if (o !== null) for (var c = 0; c < o.length; c++) {
      var v = o[c];
      try {
        var _ = n, b = r, M = b;
        e: for (; M !== null; ) {
          switch (M.tag) {
            case 5:
              Ln = M.stateNode, Yr = !1;
              break e;
            case 3:
              Ln = M.stateNode.containerInfo, Yr = !0;
              break e;
            case 4:
              Ln = M.stateNode.containerInfo, Yr = !0;
              break e;
          }
          M = M.return;
        }
        if (Ln === null) throw Error(s(160));
        zm(_, b, v), Ln = null, Yr = !1;
        var j = v.alternate;
        j !== null && (j.return = null), v.return = null;
      } catch (Z) {
        yn(v, r, Z);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) uh(r, n), r = r.sibling;
  }
  function uh(n, r) {
    var o = n.alternate, c = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Ti(r, n), pa(n), c & 4) {
          try {
            bc(3, n, n.return), Rc(3, n);
          } catch ($e) {
            yn(n, n.return, $e);
          }
          try {
            bc(5, n, n.return);
          } catch ($e) {
            yn(n, n.return, $e);
          }
        }
        break;
      case 1:
        Ti(r, n), pa(n), c & 512 && o !== null && is(o, o.return);
        break;
      case 5:
        if (Ti(r, n), pa(n), c & 512 && o !== null && is(o, o.return), n.flags & 32) {
          var v = n.stateNode;
          try {
            ke(v, "");
          } catch ($e) {
            yn(n, n.return, $e);
          }
        }
        if (c & 4 && (v = n.stateNode, v != null)) {
          var _ = n.memoizedProps, b = o !== null ? o.memoizedProps : _, M = n.type, j = n.updateQueue;
          if (n.updateQueue = null, j !== null) try {
            M === "input" && _.type === "radio" && _.name != null && Kn(v, _), lr(M, b);
            var Z = lr(M, _);
            for (b = 0; b < j.length; b += 2) {
              var _e = j[b], Ce = j[b + 1];
              _e === "style" ? an(v, Ce) : _e === "dangerouslySetInnerHTML" ? Pi(v, Ce) : _e === "children" ? ke(v, Ce) : ne(v, _e, Ce, Z);
            }
            switch (M) {
              case "input":
                ra(v, _);
                break;
              case "textarea":
                fi(v, _);
                break;
              case "select":
                var ge = v._wrapperState.wasMultiple;
                v._wrapperState.wasMultiple = !!_.multiple;
                var ze = _.value;
                ze != null ? Rn(v, !!_.multiple, ze, !1) : ge !== !!_.multiple && (_.defaultValue != null ? Rn(
                  v,
                  !!_.multiple,
                  _.defaultValue,
                  !0
                ) : Rn(v, !!_.multiple, _.multiple ? [] : "", !1));
            }
            v[nc] = _;
          } catch ($e) {
            yn(n, n.return, $e);
          }
        }
        break;
      case 6:
        if (Ti(r, n), pa(n), c & 4) {
          if (n.stateNode === null) throw Error(s(162));
          v = n.stateNode, _ = n.memoizedProps;
          try {
            v.nodeValue = _;
          } catch ($e) {
            yn(n, n.return, $e);
          }
        }
        break;
      case 3:
        if (Ti(r, n), pa(n), c & 4 && o !== null && o.memoizedState.isDehydrated) try {
          _i(r.containerInfo);
        } catch ($e) {
          yn(n, n.return, $e);
        }
        break;
      case 4:
        Ti(r, n), pa(n);
        break;
      case 13:
        Ti(r, n), pa(n), v = n.child, v.flags & 8192 && (_ = v.memoizedState !== null, v.stateNode.isHidden = _, !_ || v.alternate !== null && v.alternate.memoizedState !== null || (fh = gt())), c & 4 && Um(n);
        break;
      case 22:
        if (_e = o !== null && o.memoizedState !== null, n.mode & 1 ? (Ar = (Z = Ar) || _e, Ti(r, n), Ar = Z) : Ti(r, n), pa(n), c & 8192) {
          if (Z = n.memoizedState !== null, (n.stateNode.isHidden = Z) && !_e && n.mode & 1) for (Fe = n, _e = n.child; _e !== null; ) {
            for (Ce = Fe = _e; Fe !== null; ) {
              switch (ge = Fe, ze = ge.child, ge.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  bc(4, ge, ge.return);
                  break;
                case 1:
                  is(ge, ge.return);
                  var Ie = ge.stateNode;
                  if (typeof Ie.componentWillUnmount == "function") {
                    c = ge, o = ge.return;
                    try {
                      r = c, Ie.props = r.memoizedProps, Ie.state = r.memoizedState, Ie.componentWillUnmount();
                    } catch ($e) {
                      yn(c, o, $e);
                    }
                  }
                  break;
                case 5:
                  is(ge, ge.return);
                  break;
                case 22:
                  if (ge.memoizedState !== null) {
                    Dc(Ce);
                    continue;
                  }
              }
              ze !== null ? (ze.return = ge, Fe = ze) : Dc(Ce);
            }
            _e = _e.sibling;
          }
          e: for (_e = null, Ce = n; ; ) {
            if (Ce.tag === 5) {
              if (_e === null) {
                _e = Ce;
                try {
                  v = Ce.stateNode, Z ? (_ = v.style, typeof _.setProperty == "function" ? _.setProperty("display", "none", "important") : _.display = "none") : (M = Ce.stateNode, j = Ce.memoizedProps.style, b = j != null && j.hasOwnProperty("display") ? j.display : null, M.style.display = $t("display", b));
                } catch ($e) {
                  yn(n, n.return, $e);
                }
              }
            } else if (Ce.tag === 6) {
              if (_e === null) try {
                Ce.stateNode.nodeValue = Z ? "" : Ce.memoizedProps;
              } catch ($e) {
                yn(n, n.return, $e);
              }
            } else if ((Ce.tag !== 22 && Ce.tag !== 23 || Ce.memoizedState === null || Ce === n) && Ce.child !== null) {
              Ce.child.return = Ce, Ce = Ce.child;
              continue;
            }
            if (Ce === n) break e;
            for (; Ce.sibling === null; ) {
              if (Ce.return === null || Ce.return === n) break e;
              _e === Ce && (_e = null), Ce = Ce.return;
            }
            _e === Ce && (_e = null), Ce.sibling.return = Ce.return, Ce = Ce.sibling;
          }
        }
        break;
      case 19:
        Ti(r, n), pa(n), c & 4 && Um(n);
        break;
      case 21:
        break;
      default:
        Ti(
          r,
          n
        ), pa(n);
    }
  }
  function pa(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var o = n.return; o !== null; ) {
            if (kc(o)) {
              var c = o;
              break e;
            }
            o = o.return;
          }
          throw Error(s(160));
        }
        switch (c.tag) {
          case 5:
            var v = c.stateNode;
            c.flags & 32 && (ke(v, ""), c.flags &= -33);
            var _ = Dl(n);
            nl(n, _, v);
            break;
          case 3:
          case 4:
            var b = c.stateNode.containerInfo, M = Dl(n);
            tl(n, M, b);
            break;
          default:
            throw Error(s(161));
        }
      } catch (j) {
        yn(n, n.return, j);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function h0(n, r, o) {
    Fe = n, sh(n);
  }
  function sh(n, r, o) {
    for (var c = (n.mode & 1) !== 0; Fe !== null; ) {
      var v = Fe, _ = v.child;
      if (v.tag === 22 && c) {
        var b = v.memoizedState !== null || Tc;
        if (!b) {
          var M = v.alternate, j = M !== null && M.memoizedState !== null || Ar;
          M = Tc;
          var Z = Ar;
          if (Tc = b, (Ar = j) && !Z) for (Fe = v; Fe !== null; ) b = Fe, j = b.child, b.tag === 22 && b.memoizedState !== null ? ch(v) : j !== null ? (j.return = b, Fe = j) : ch(v);
          for (; _ !== null; ) Fe = _, sh(_), _ = _.sibling;
          Fe = v, Tc = M, Ar = Z;
        }
        jm(n);
      } else v.subtreeFlags & 8772 && _ !== null ? (_.return = v, Fe = _) : jm(n);
    }
  }
  function jm(n) {
    for (; Fe !== null; ) {
      var r = Fe;
      if (r.flags & 8772) {
        var o = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Ar || Rc(5, r);
              break;
            case 1:
              var c = r.stateNode;
              if (r.flags & 4 && !Ar) if (o === null) c.componentDidMount();
              else {
                var v = r.elementType === r.type ? o.memoizedProps : xi(r.type, o.memoizedProps);
                c.componentDidUpdate(v, o.memoizedState, c.__reactInternalSnapshotBeforeUpdate);
              }
              var _ = r.updateQueue;
              _ !== null && qp(r, _, c);
              break;
            case 3:
              var b = r.updateQueue;
              if (b !== null) {
                if (o = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    o = r.child.stateNode;
                    break;
                  case 1:
                    o = r.child.stateNode;
                }
                qp(r, b, o);
              }
              break;
            case 5:
              var M = r.stateNode;
              if (o === null && r.flags & 4) {
                o = M;
                var j = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    j.autoFocus && o.focus();
                    break;
                  case "img":
                    j.src && (o.src = j.src);
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
              if (r.memoizedState === null) {
                var Z = r.alternate;
                if (Z !== null) {
                  var _e = Z.memoizedState;
                  if (_e !== null) {
                    var Ce = _e.dehydrated;
                    Ce !== null && _i(Ce);
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
              throw Error(s(163));
          }
          Ar || r.flags & 512 && oh(r);
        } catch (ge) {
          yn(r, r.return, ge);
        }
      }
      if (r === n) {
        Fe = null;
        break;
      }
      if (o = r.sibling, o !== null) {
        o.return = r.return, Fe = o;
        break;
      }
      Fe = r.return;
    }
  }
  function Dc(n) {
    for (; Fe !== null; ) {
      var r = Fe;
      if (r === n) {
        Fe = null;
        break;
      }
      var o = r.sibling;
      if (o !== null) {
        o.return = r.return, Fe = o;
        break;
      }
      Fe = r.return;
    }
  }
  function ch(n) {
    for (; Fe !== null; ) {
      var r = Fe;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var o = r.return;
            try {
              Rc(4, r);
            } catch (j) {
              yn(r, o, j);
            }
            break;
          case 1:
            var c = r.stateNode;
            if (typeof c.componentDidMount == "function") {
              var v = r.return;
              try {
                c.componentDidMount();
              } catch (j) {
                yn(r, v, j);
              }
            }
            var _ = r.return;
            try {
              oh(r);
            } catch (j) {
              yn(r, _, j);
            }
            break;
          case 5:
            var b = r.return;
            try {
              oh(r);
            } catch (j) {
              yn(r, b, j);
            }
        }
      } catch (j) {
        yn(r, r.return, j);
      }
      if (r === n) {
        Fe = null;
        break;
      }
      var M = r.sibling;
      if (M !== null) {
        M.return = r.return, Fe = M;
        break;
      }
      Fe = r.return;
    }
  }
  var v0 = Math.ceil, ho = se.ReactCurrentDispatcher, fu = se.ReactCurrentOwner, _r = se.ReactCurrentBatchConfig, Lt = 0, nr = null, Wn = null, Sr = 0, La = 0, ls = $a(0), Mn = 0, Oc = null, rl = 0, os = 0, hd = 0, Lc = null, ha = null, fh = 0, us = 1 / 0, Ma = null, ss = !1, du = null, vo = null, vd = !1, Ol = null, Mc = 0, mo = 0, cs = null, Nc = -1, zr = 0;
  function Gn() {
    return Lt & 6 ? gt() : Nc !== -1 ? Nc : Nc = gt();
  }
  function al(n) {
    return n.mode & 1 ? Lt & 2 && Sr !== 0 ? Sr & -Sr : d0.transition !== null ? (zr === 0 && (zr = Uu()), zr) : (n = Ft, n !== 0 || (n = window.event, n = n === void 0 ? 16 : Bu(n.type)), n) : 1;
  }
  function Wr(n, r, o, c) {
    if (50 < mo) throw mo = 0, cs = null, Error(s(185));
    yl(n, o, c), (!(Lt & 2) || n !== nr) && (n === nr && (!(Lt & 2) && (os |= o), Mn === 4 && bi(n, Sr)), va(n, c), o === 1 && Lt === 0 && !(r.mode & 1) && (us = gt() + 500, es && Xi()));
  }
  function va(n, r) {
    var o = n.callbackNode;
    Ho(n, r);
    var c = gi(n, n === nr ? Sr : 0);
    if (c === 0) o !== null && vr(o), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = c & -c, n.callbackPriority !== r) {
      if (o != null && vr(o), r === 1) n.tag === 0 ? ao(dh.bind(null, n)) : zf(dh.bind(null, n)), Xu(function() {
        !(Lt & 6) && Xi();
      }), o = null;
      else {
        switch (Pu(c)) {
          case 1:
            o = mi;
            break;
          case 4:
            o = Po;
            break;
          case 16:
            o = Fo;
            break;
          case 536870912:
            o = Nu;
            break;
          default:
            o = Fo;
        }
        o = Gm(o, md.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = o;
    }
  }
  function md(n, r) {
    if (Nc = -1, zr = 0, Lt & 6) throw Error(s(327));
    var o = n.callbackNode;
    if (fs() && n.callbackNode !== o) return null;
    var c = gi(n, n === nr ? Sr : 0);
    if (c === 0) return null;
    if (c & 30 || c & n.expiredLanes || r) r = yd(n, c);
    else {
      r = c;
      var v = Lt;
      Lt |= 2;
      var _ = Fm();
      (nr !== n || Sr !== r) && (Ma = null, us = gt() + 500, Ll(n, r));
      do
        try {
          Hm();
          break;
        } catch (M) {
          Pm(n, M);
        }
      while (!0);
      Vp(), ho.current = _, Lt = v, Wn !== null ? r = 0 : (nr = null, Sr = 0, r = Mn);
    }
    if (r !== 0) {
      if (r === 2 && (v = Ql(n), v !== 0 && (c = v, r = Ac(n, v))), r === 1) throw o = Oc, Ll(n, 0), bi(n, c), va(n, gt()), o;
      if (r === 6) bi(n, c);
      else {
        if (v = n.current.alternate, !(c & 30) && !m0(v) && (r = yd(n, c), r === 2 && (_ = Ql(n), _ !== 0 && (c = _, r = Ac(n, _))), r === 1)) throw o = Oc, Ll(n, 0), bi(n, c), va(n, gt()), o;
        switch (n.finishedWork = v, n.finishedLanes = c, r) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            vu(n, ha, Ma);
            break;
          case 3:
            if (bi(n, c), (c & 130023424) === c && (r = fh + 500 - gt(), 10 < r)) {
              if (gi(n, 0) !== 0) break;
              if (v = n.suspendedLanes, (v & c) !== c) {
                Gn(), n.pingedLanes |= n.suspendedLanes & v;
                break;
              }
              n.timeoutHandle = Mf(vu.bind(null, n, ha, Ma), r);
              break;
            }
            vu(n, ha, Ma);
            break;
          case 4:
            if (bi(n, c), (c & 4194240) === c) break;
            for (r = n.eventTimes, v = -1; 0 < c; ) {
              var b = 31 - Hr(c);
              _ = 1 << b, b = r[b], b > v && (v = b), c &= ~_;
            }
            if (c = v, c = gt() - c, c = (120 > c ? 120 : 480 > c ? 480 : 1080 > c ? 1080 : 1920 > c ? 1920 : 3e3 > c ? 3e3 : 4320 > c ? 4320 : 1960 * v0(c / 1960)) - c, 10 < c) {
              n.timeoutHandle = Mf(vu.bind(null, n, ha, Ma), c);
              break;
            }
            vu(n, ha, Ma);
            break;
          case 5:
            vu(n, ha, Ma);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return va(n, gt()), n.callbackNode === o ? md.bind(null, n) : null;
  }
  function Ac(n, r) {
    var o = Lc;
    return n.current.memoizedState.isDehydrated && (Ll(n, r).flags |= 256), n = yd(n, r), n !== 2 && (r = ha, ha = o, r !== null && pu(r)), n;
  }
  function pu(n) {
    ha === null ? ha = n : ha.push.apply(ha, n);
  }
  function m0(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var o = r.updateQueue;
        if (o !== null && (o = o.stores, o !== null)) for (var c = 0; c < o.length; c++) {
          var v = o[c], _ = v.getSnapshot;
          v = v.value;
          try {
            if (!Ei(_(), v)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (o = r.child, r.subtreeFlags & 16384 && o !== null) o.return = r, r = o;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function bi(n, r) {
    for (r &= ~hd, r &= ~os, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var o = 31 - Hr(r), c = 1 << o;
      n[o] = -1, r &= ~c;
    }
  }
  function dh(n) {
    if (Lt & 6) throw Error(s(327));
    fs();
    var r = gi(n, 0);
    if (!(r & 1)) return va(n, gt()), null;
    var o = yd(n, r);
    if (n.tag !== 0 && o === 2) {
      var c = Ql(n);
      c !== 0 && (r = c, o = Ac(n, c));
    }
    if (o === 1) throw o = Oc, Ll(n, 0), bi(n, r), va(n, gt()), o;
    if (o === 6) throw Error(s(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, vu(n, ha, Ma), va(n, gt()), null;
  }
  function ph(n, r) {
    var o = Lt;
    Lt |= 1;
    try {
      return n(r);
    } finally {
      Lt = o, Lt === 0 && (us = gt() + 500, es && Xi());
    }
  }
  function hu(n) {
    Ol !== null && Ol.tag === 0 && !(Lt & 6) && fs();
    var r = Lt;
    Lt |= 1;
    var o = _r.transition, c = Ft;
    try {
      if (_r.transition = null, Ft = 1, n) return n();
    } finally {
      Ft = c, _r.transition = o, Lt = r, !(Lt & 6) && Xi();
    }
  }
  function hh() {
    La = ls.current, sn(ls);
  }
  function Ll(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var o = n.timeoutHandle;
    if (o !== -1 && (n.timeoutHandle = -1, jp(o)), Wn !== null) for (o = Wn.return; o !== null; ) {
      var c = o;
      switch (jf(c), c.tag) {
        case 1:
          c = c.type.childContextTypes, c != null && Zu();
          break;
        case 3:
          nu(), sn(er), sn(xn), et();
          break;
        case 5:
          If(c);
          break;
        case 4:
          nu();
          break;
        case 13:
          sn(Cn);
          break;
        case 19:
          sn(Cn);
          break;
        case 10:
          Bp(c.type._context);
          break;
        case 22:
        case 23:
          hh();
      }
      o = o.return;
    }
    if (nr = n, Wn = n = yo(n.current, null), Sr = La = r, Mn = 0, Oc = null, hd = os = rl = 0, ha = Lc = null, eu !== null) {
      for (r = 0; r < eu.length; r++) if (o = eu[r], c = o.interleaved, c !== null) {
        o.interleaved = null;
        var v = c.next, _ = o.pending;
        if (_ !== null) {
          var b = _.next;
          _.next = v, c.next = b;
        }
        o.pending = c;
      }
      eu = null;
    }
    return n;
  }
  function Pm(n, r) {
    do {
      var o = Wn;
      try {
        if (Vp(), Tt.current = uu, Bf) {
          for (var c = It.memoizedState; c !== null; ) {
            var v = c.queue;
            v !== null && (v.pending = null), c = c.next;
          }
          Bf = !1;
        }
        if (en = 0, ur = Bn = It = null, fc = !1, ru = 0, fu.current = null, o === null || o.return === null) {
          Mn = 1, Oc = r, Wn = null;
          break;
        }
        e: {
          var _ = n, b = o.return, M = o, j = r;
          if (r = Sr, M.flags |= 32768, j !== null && typeof j == "object" && typeof j.then == "function") {
            var Z = j, _e = M, Ce = _e.tag;
            if (!(_e.mode & 1) && (Ce === 0 || Ce === 11 || Ce === 15)) {
              var ge = _e.alternate;
              ge ? (_e.updateQueue = ge.updateQueue, _e.memoizedState = ge.memoizedState, _e.lanes = ge.lanes) : (_e.updateQueue = null, _e.memoizedState = null);
            }
            var ze = Tm(b);
            if (ze !== null) {
              ze.flags &= -257, po(ze, b, M, _, r), ze.mode & 1 && nh(_, Z, r), r = ze, j = Z;
              var Ie = r.updateQueue;
              if (Ie === null) {
                var $e = /* @__PURE__ */ new Set();
                $e.add(j), r.updateQueue = $e;
              } else Ie.add(j);
              break e;
            } else {
              if (!(r & 1)) {
                nh(_, Z, r), vh();
                break e;
              }
              j = Error(s(426));
            }
          } else if (mn && M.mode & 1) {
            var Nn = Tm(b);
            if (Nn !== null) {
              !(Nn.flags & 65536) && (Nn.flags |= 256), po(Nn, b, M, _, r), bl(su(j, M));
              break e;
            }
          }
          _ = j = su(j, M), Mn !== 4 && (Mn = 2), Lc === null ? Lc = [_] : Lc.push(_), _ = b;
          do {
            switch (_.tag) {
              case 3:
                _.flags |= 65536, r &= -r, _.lanes |= r;
                var $ = xm(_, j, r);
                _m(_, $);
                break e;
              case 1:
                M = j;
                var H = _.type, X = _.stateNode;
                if (!(_.flags & 128) && (typeof H.getDerivedStateFromError == "function" || X !== null && typeof X.componentDidCatch == "function" && (vo === null || !vo.has(X)))) {
                  _.flags |= 65536, r &= -r, _.lanes |= r;
                  var Se = th(_, M, r);
                  _m(_, Se);
                  break e;
                }
            }
            _ = _.return;
          } while (_ !== null);
        }
        Vm(o);
      } catch (Ve) {
        r = Ve, Wn === o && o !== null && (Wn = o = o.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Fm() {
    var n = ho.current;
    return ho.current = uu, n === null ? uu : n;
  }
  function vh() {
    (Mn === 0 || Mn === 3 || Mn === 2) && (Mn = 4), nr === null || !(rl & 268435455) && !(os & 268435455) || bi(nr, Sr);
  }
  function yd(n, r) {
    var o = Lt;
    Lt |= 2;
    var c = Fm();
    (nr !== n || Sr !== r) && (Ma = null, Ll(n, r));
    do
      try {
        y0();
        break;
      } catch (v) {
        Pm(n, v);
      }
    while (!0);
    if (Vp(), Lt = o, ho.current = c, Wn !== null) throw Error(s(261));
    return nr = null, Sr = 0, Mn;
  }
  function y0() {
    for (; Wn !== null; ) Im(Wn);
  }
  function Hm() {
    for (; Wn !== null && !hi(); ) Im(Wn);
  }
  function Im(n) {
    var r = Wm(n.alternate, n, La);
    n.memoizedProps = n.pendingProps, r === null ? Vm(n) : Wn = r, fu.current = null;
  }
  function Vm(n) {
    var r = n;
    do {
      var o = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (o = fd(o, r), o !== null) {
          o.flags &= 32767, Wn = o;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Mn = 6, Wn = null;
          return;
        }
      } else if (o = Mm(o, r, La), o !== null) {
        Wn = o;
        return;
      }
      if (r = r.sibling, r !== null) {
        Wn = r;
        return;
      }
      Wn = r = n;
    } while (r !== null);
    Mn === 0 && (Mn = 5);
  }
  function vu(n, r, o) {
    var c = Ft, v = _r.transition;
    try {
      _r.transition = null, Ft = 1, g0(n, r, o, c);
    } finally {
      _r.transition = v, Ft = c;
    }
    return null;
  }
  function g0(n, r, o, c) {
    do
      fs();
    while (Ol !== null);
    if (Lt & 6) throw Error(s(327));
    o = n.finishedWork;
    var v = n.finishedLanes;
    if (o === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, o === n.current) throw Error(s(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var _ = o.lanes | o.childLanes;
    if (mp(n, _), n === nr && (Wn = nr = null, Sr = 0), !(o.subtreeFlags & 2064) && !(o.flags & 2064) || vd || (vd = !0, Gm(Fo, function() {
      return fs(), null;
    })), _ = (o.flags & 15990) !== 0, o.subtreeFlags & 15990 || _) {
      _ = _r.transition, _r.transition = null;
      var b = Ft;
      Ft = 1;
      var M = Lt;
      Lt |= 4, fu.current = null, Am(n, o), uh(o, n), Wu(Qo), Va = !!tc, Qo = tc = null, n.current = o, h0(o), vi(), Lt = M, Ft = b, _r.transition = _;
    } else n.current = o;
    if (vd && (vd = !1, Ol = n, Mc = v), _ = n.pendingLanes, _ === 0 && (vo = null), Is(o.stateNode), va(n, gt()), r !== null) for (c = n.onRecoverableError, o = 0; o < r.length; o++) v = r[o], c(v.value, { componentStack: v.stack, digest: v.digest });
    if (ss) throw ss = !1, n = du, du = null, n;
    return Mc & 1 && n.tag !== 0 && fs(), _ = n.pendingLanes, _ & 1 ? n === cs ? mo++ : (mo = 0, cs = n) : mo = 0, Xi(), null;
  }
  function fs() {
    if (Ol !== null) {
      var n = Pu(Mc), r = _r.transition, o = Ft;
      try {
        if (_r.transition = null, Ft = 16 > n ? 16 : n, Ol === null) var c = !1;
        else {
          if (n = Ol, Ol = null, Mc = 0, Lt & 6) throw Error(s(331));
          var v = Lt;
          for (Lt |= 4, Fe = n.current; Fe !== null; ) {
            var _ = Fe, b = _.child;
            if (Fe.flags & 16) {
              var M = _.deletions;
              if (M !== null) {
                for (var j = 0; j < M.length; j++) {
                  var Z = M[j];
                  for (Fe = Z; Fe !== null; ) {
                    var _e = Fe;
                    switch (_e.tag) {
                      case 0:
                      case 11:
                      case 15:
                        bc(8, _e, _);
                    }
                    var Ce = _e.child;
                    if (Ce !== null) Ce.return = _e, Fe = Ce;
                    else for (; Fe !== null; ) {
                      _e = Fe;
                      var ge = _e.sibling, ze = _e.return;
                      if (pd(_e), _e === Z) {
                        Fe = null;
                        break;
                      }
                      if (ge !== null) {
                        ge.return = ze, Fe = ge;
                        break;
                      }
                      Fe = ze;
                    }
                  }
                }
                var Ie = _.alternate;
                if (Ie !== null) {
                  var $e = Ie.child;
                  if ($e !== null) {
                    Ie.child = null;
                    do {
                      var Nn = $e.sibling;
                      $e.sibling = null, $e = Nn;
                    } while ($e !== null);
                  }
                }
                Fe = _;
              }
            }
            if (_.subtreeFlags & 2064 && b !== null) b.return = _, Fe = b;
            else e: for (; Fe !== null; ) {
              if (_ = Fe, _.flags & 2048) switch (_.tag) {
                case 0:
                case 11:
                case 15:
                  bc(9, _, _.return);
              }
              var $ = _.sibling;
              if ($ !== null) {
                $.return = _.return, Fe = $;
                break e;
              }
              Fe = _.return;
            }
          }
          var H = n.current;
          for (Fe = H; Fe !== null; ) {
            b = Fe;
            var X = b.child;
            if (b.subtreeFlags & 2064 && X !== null) X.return = b, Fe = X;
            else e: for (b = H; Fe !== null; ) {
              if (M = Fe, M.flags & 2048) try {
                switch (M.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Rc(9, M);
                }
              } catch (Ve) {
                yn(M, M.return, Ve);
              }
              if (M === b) {
                Fe = null;
                break e;
              }
              var Se = M.sibling;
              if (Se !== null) {
                Se.return = M.return, Fe = Se;
                break e;
              }
              Fe = M.return;
            }
          }
          if (Lt = v, Xi(), aa && typeof aa.onPostCommitFiberRoot == "function") try {
            aa.onPostCommitFiberRoot(Gl, n);
          } catch {
          }
          c = !0;
        }
        return c;
      } finally {
        Ft = o, _r.transition = r;
      }
    }
    return !1;
  }
  function Bm(n, r, o) {
    r = su(o, r), r = xm(n, r, 1), n = so(n, r, 1), r = Gn(), n !== null && (yl(n, 1, r), va(n, r));
  }
  function yn(n, r, o) {
    if (n.tag === 3) Bm(n, n, o);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        Bm(r, n, o);
        break;
      } else if (r.tag === 1) {
        var c = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (vo === null || !vo.has(c))) {
          n = su(o, n), n = th(r, n, 1), r = so(r, n, 1), n = Gn(), r !== null && (yl(r, 1, n), va(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function _0(n, r, o) {
    var c = n.pingCache;
    c !== null && c.delete(r), r = Gn(), n.pingedLanes |= n.suspendedLanes & o, nr === n && (Sr & o) === o && (Mn === 4 || Mn === 3 && (Sr & 130023424) === Sr && 500 > gt() - fh ? Ll(n, 0) : hd |= o), va(n, r);
  }
  function Ym(n, r) {
    r === 0 && (n.mode & 1 ? (r = ba, ba <<= 1, !(ba & 130023424) && (ba = 4194304)) : r = 1);
    var o = Gn();
    n = Da(n, r), n !== null && (yl(n, r, o), va(n, o));
  }
  function S0(n) {
    var r = n.memoizedState, o = 0;
    r !== null && (o = r.retryLane), Ym(n, o);
  }
  function $m(n, r) {
    var o = 0;
    switch (n.tag) {
      case 13:
        var c = n.stateNode, v = n.memoizedState;
        v !== null && (o = v.retryLane);
        break;
      case 19:
        c = n.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    c !== null && c.delete(r), Ym(n, o);
  }
  var Wm;
  Wm = function(n, r, o) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || er.current) Yn = !0;
    else {
      if (!(n.lanes & o) && !(r.flags & 128)) return Yn = !1, wc(n, r, o);
      Yn = !!(n.flags & 131072);
    }
    else Yn = !1, mn && r.flags & 1048576 && vm(r, Tl, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var c = r.type;
        Qa(n, r), n = r.pendingProps;
        var v = oa(r, xn.current);
        En(r, o), v = co(null, r, c, n, v, o);
        var _ = wi();
        return r.flags |= 1, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, In(c) ? (_ = !0, or(r)) : _ = !1, r.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, Gp(r), v.updater = ld, r.stateNode = v, v._reactInternals = r, gc(r, c, n, o), r = Ec(null, r, c, !0, _, o)) : (r.tag = 0, mn && _ && Uf(r), gr(null, r, v, o), r = r.child), r;
      case 16:
        c = r.elementType;
        e: {
          switch (Qa(n, r), n = r.pendingProps, v = c._init, c = v(c._payload), r.type = c, v = r.tag = C0(c), n = xi(c, n), v) {
            case 0:
              r = bm(null, r, c, n, o);
              break e;
            case 1:
              r = Rm(null, r, c, n, o);
              break e;
            case 11:
              r = da(null, r, c, n, o);
              break e;
            case 14:
              r = cu(null, r, c, xi(c.type, n), o);
              break e;
          }
          throw Error(s(
            306,
            c,
            ""
          ));
        }
        return r;
      case 0:
        return c = r.type, v = r.pendingProps, v = r.elementType === c ? v : xi(c, v), bm(n, r, c, v, o);
      case 1:
        return c = r.type, v = r.pendingProps, v = r.elementType === c ? v : xi(c, v), Rm(n, r, c, v, o);
      case 3:
        e: {
          if (as(r), n === null) throw Error(s(387));
          c = r.pendingProps, _ = r.memoizedState, v = _.element, gm(n, r), lc(r, c, null, o);
          var b = r.memoizedState;
          if (c = b.element, _.isDehydrated) if (_ = { element: c, isDehydrated: !1, cache: b.cache, pendingSuspenseBoundaries: b.pendingSuspenseBoundaries, transitions: b.transitions }, r.updateQueue.baseState = _, r.memoizedState = _, r.flags & 256) {
            v = su(Error(s(423)), r), r = km(n, r, c, o, v);
            break e;
          } else if (c !== v) {
            v = su(Error(s(424)), r), r = km(n, r, c, o, v);
            break e;
          } else for (sa = Gi(r.stateNode.containerInfo.firstChild), ua = r, mn = !0, Ga = null, o = Me(r, null, c, o), r.child = o; o; ) o.flags = o.flags & -3 | 4096, o = o.sibling;
          else {
            if (uo(), c === v) {
              r = Xa(n, r, o);
              break e;
            }
            gr(n, r, c, o);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Sm(r), n === null && Hp(r), c = r.type, v = r.pendingProps, _ = n !== null ? n.memoizedProps : null, b = v.children, Lf(c, v) ? b = null : _ !== null && Lf(c, _) && (r.flags |= 32), rh(n, r), gr(n, r, b, o), r.child;
      case 6:
        return n === null && Hp(r), null;
      case 13:
        return cd(n, r, o);
      case 4:
        return Qp(r, r.stateNode.containerInfo), c = r.pendingProps, n === null ? r.child = Dn(r, null, c, o) : gr(n, r, c, o), r.child;
      case 11:
        return c = r.type, v = r.pendingProps, v = r.elementType === c ? v : xi(c, v), da(n, r, c, v, o);
      case 7:
        return gr(n, r, r.pendingProps, o), r.child;
      case 8:
        return gr(n, r, r.pendingProps.children, o), r.child;
      case 12:
        return gr(n, r, r.pendingProps.children, o), r.child;
      case 10:
        e: {
          if (c = r.type._context, v = r.pendingProps, _ = r.memoizedProps, b = v.value, Je(ka, c._currentValue), c._currentValue = b, _ !== null) if (Ei(_.value, b)) {
            if (_.children === v.children && !er.current) {
              r = Xa(n, r, o);
              break e;
            }
          } else for (_ = r.child, _ !== null && (_.return = r); _ !== null; ) {
            var M = _.dependencies;
            if (M !== null) {
              b = _.child;
              for (var j = M.firstContext; j !== null; ) {
                if (j.context === c) {
                  if (_.tag === 1) {
                    j = Rl(-1, o & -o), j.tag = 2;
                    var Z = _.updateQueue;
                    if (Z !== null) {
                      Z = Z.shared;
                      var _e = Z.pending;
                      _e === null ? j.next = j : (j.next = _e.next, _e.next = j), Z.pending = j;
                    }
                  }
                  _.lanes |= o, j = _.alternate, j !== null && (j.lanes |= o), Yp(
                    _.return,
                    o,
                    r
                  ), M.lanes |= o;
                  break;
                }
                j = j.next;
              }
            } else if (_.tag === 10) b = _.type === r.type ? null : _.child;
            else if (_.tag === 18) {
              if (b = _.return, b === null) throw Error(s(341));
              b.lanes |= o, M = b.alternate, M !== null && (M.lanes |= o), Yp(b, o, r), b = _.sibling;
            } else b = _.child;
            if (b !== null) b.return = _;
            else for (b = _; b !== null; ) {
              if (b === r) {
                b = null;
                break;
              }
              if (_ = b.sibling, _ !== null) {
                _.return = b.return, b = _;
                break;
              }
              b = b.return;
            }
            _ = b;
          }
          gr(n, r, v.children, o), r = r.child;
        }
        return r;
      case 9:
        return v = r.type, c = r.pendingProps.children, En(r, o), v = qa(v), c = c(v), r.flags |= 1, gr(n, r, c, o), r.child;
      case 14:
        return c = r.type, v = xi(c, r.pendingProps), v = xi(c.type, v), cu(n, r, c, v, o);
      case 15:
        return _t(n, r, r.type, r.pendingProps, o);
      case 17:
        return c = r.type, v = r.pendingProps, v = r.elementType === c ? v : xi(c, v), Qa(n, r), r.tag = 1, In(c) ? (n = !0, or(r)) : n = !1, En(r, o), od(r, c, v), gc(r, c, v, o), Ec(null, r, c, !0, n, o);
      case 19:
        return el(n, r, o);
      case 22:
        return Sc(n, r, o);
    }
    throw Error(s(156, r.tag));
  };
  function Gm(n, r) {
    return fn(n, r);
  }
  function E0(n, r, o, c) {
    this.tag = n, this.key = o, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ja(n, r, o, c) {
    return new E0(n, r, o, c);
  }
  function mh(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function C0(n) {
    if (typeof n == "function") return mh(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === We) return 11;
      if (n === Ge) return 14;
    }
    return 2;
  }
  function yo(n, r) {
    var o = n.alternate;
    return o === null ? (o = Ja(n.tag, r, n.key, n.mode), o.elementType = n.elementType, o.type = n.type, o.stateNode = n.stateNode, o.alternate = n, n.alternate = o) : (o.pendingProps = r, o.type = n.type, o.flags = 0, o.subtreeFlags = 0, o.deletions = null), o.flags = n.flags & 14680064, o.childLanes = n.childLanes, o.lanes = n.lanes, o.child = n.child, o.memoizedProps = n.memoizedProps, o.memoizedState = n.memoizedState, o.updateQueue = n.updateQueue, r = n.dependencies, o.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, o.sibling = n.sibling, o.index = n.index, o.ref = n.ref, o;
  }
  function zc(n, r, o, c, v, _) {
    var b = 2;
    if (c = n, typeof n == "function") mh(n) && (b = 1);
    else if (typeof n == "string") b = 5;
    else e: switch (n) {
      case ue:
        return Ml(o.children, v, _, r);
      case Ee:
        b = 8, v |= 8;
        break;
      case fe:
        return n = Ja(12, o, r, v | 2), n.elementType = fe, n.lanes = _, n;
      case Re:
        return n = Ja(13, o, r, v), n.elementType = Re, n.lanes = _, n;
      case ut:
        return n = Ja(19, o, r, v), n.elementType = ut, n.lanes = _, n;
      case ce:
        return go(o, v, _, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Ye:
            b = 10;
            break e;
          case Ke:
            b = 9;
            break e;
          case We:
            b = 11;
            break e;
          case Ge:
            b = 14;
            break e;
          case he:
            b = 16, c = null;
            break e;
        }
        throw Error(s(130, n == null ? n : typeof n, ""));
    }
    return r = Ja(b, o, r, v), r.elementType = n, r.type = c, r.lanes = _, r;
  }
  function Ml(n, r, o, c) {
    return n = Ja(7, n, c, r), n.lanes = o, n;
  }
  function go(n, r, o, c) {
    return n = Ja(22, n, c, r), n.elementType = ce, n.lanes = o, n.stateNode = { isHidden: !1 }, n;
  }
  function yh(n, r, o) {
    return n = Ja(6, n, null, r), n.lanes = o, n;
  }
  function gd(n, r, o) {
    return r = Ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = o, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function qm(n, r, o, c, v) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ju(0), this.expirationTimes = ju(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ju(0), this.identifierPrefix = c, this.onRecoverableError = v, this.mutableSourceEagerHydrationData = null;
  }
  function _d(n, r, o, c, v, _, b, M, j) {
    return n = new qm(n, r, o, M, j), r === 1 ? (r = 1, _ === !0 && (r |= 8)) : r = 0, _ = Ja(3, null, null, r), n.current = _, _.stateNode = n, _.memoizedState = { element: c, isDehydrated: o, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Gp(_), n;
  }
  function w0(n, r, o) {
    var c = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: de, key: c == null ? null : "" + c, children: n, containerInfo: r, implementation: o };
  }
  function gh(n) {
    if (!n) return Mr;
    n = n._reactInternals;
    e: {
      if (yt(n) !== n || n.tag !== 1) throw Error(s(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (In(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(s(171));
    }
    if (n.tag === 1) {
      var o = n.type;
      if (In(o)) return ac(n, o, r);
    }
    return r;
  }
  function Qm(n, r, o, c, v, _, b, M, j) {
    return n = _d(o, c, !0, n, v, _, b, M, j), n.context = gh(null), o = n.current, c = Gn(), v = al(o), _ = Rl(c, v), _.callback = r ?? null, so(o, _, v), n.current.lanes = v, yl(n, v, c), va(n, c), n;
  }
  function Sd(n, r, o, c) {
    var v = r.current, _ = Gn(), b = al(v);
    return o = gh(o), r.context === null ? r.context = o : r.pendingContext = o, r = Rl(_, b), r.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (r.callback = c), n = so(v, r, b), n !== null && (Wr(n, v, b, _), Hf(n, v, b)), b;
  }
  function Ed(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function _h(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var o = n.retryLane;
      n.retryLane = o !== 0 && o < r ? o : r;
    }
  }
  function Cd(n, r) {
    _h(n, r), (n = n.alternate) && _h(n, r);
  }
  function Xm() {
    return null;
  }
  var mu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Sh(n) {
    this._internalRoot = n;
  }
  wd.prototype.render = Sh.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(s(409));
    Sd(n, r, null, null);
  }, wd.prototype.unmount = Sh.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      hu(function() {
        Sd(null, n, null, null);
      }), r[wl] = null;
    }
  };
  function wd(n) {
    this._internalRoot = n;
  }
  wd.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = pt();
      n = { blockedOn: null, target: n, priority: r };
      for (var o = 0; o < Zn.length && r !== 0 && r < Zn[o].priority; o++) ;
      Zn.splice(o, 0, n), o === 0 && Ys(n);
    }
  };
  function Eh(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function xd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Km() {
  }
  function x0(n, r, o, c, v) {
    if (v) {
      if (typeof c == "function") {
        var _ = c;
        c = function() {
          var Z = Ed(b);
          _.call(Z);
        };
      }
      var b = Qm(r, c, n, 0, null, !1, !1, "", Km);
      return n._reactRootContainer = b, n[wl] = b.current, qu(n.nodeType === 8 ? n.parentNode : n), hu(), b;
    }
    for (; v = n.lastChild; ) n.removeChild(v);
    if (typeof c == "function") {
      var M = c;
      c = function() {
        var Z = Ed(j);
        M.call(Z);
      };
    }
    var j = _d(n, 0, !1, null, null, !1, !1, "", Km);
    return n._reactRootContainer = j, n[wl] = j.current, qu(n.nodeType === 8 ? n.parentNode : n), hu(function() {
      Sd(r, j, o, c);
    }), j;
  }
  function Uc(n, r, o, c, v) {
    var _ = o._reactRootContainer;
    if (_) {
      var b = _;
      if (typeof v == "function") {
        var M = v;
        v = function() {
          var j = Ed(b);
          M.call(j);
        };
      }
      Sd(r, b, n, v);
    } else b = x0(o, r, n, v, c);
    return Ed(b);
  }
  At = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var o = yi(r.pendingLanes);
          o !== 0 && (gl(r, o | 1), va(r, gt()), !(Lt & 6) && (us = gt() + 500, Xi()));
        }
        break;
      case 13:
        hu(function() {
          var c = Da(n, 1);
          if (c !== null) {
            var v = Gn();
            Wr(c, n, 1, v);
          }
        }), Cd(n, 1);
    }
  }, Vs = function(n) {
    if (n.tag === 13) {
      var r = Da(n, 134217728);
      if (r !== null) {
        var o = Gn();
        Wr(r, n, 134217728, o);
      }
      Cd(n, 134217728);
    }
  }, Vi = function(n) {
    if (n.tag === 13) {
      var r = al(n), o = Da(n, r);
      if (o !== null) {
        var c = Gn();
        Wr(o, n, r, c);
      }
      Cd(n, r);
    }
  }, pt = function() {
    return Ft;
  }, Fu = function(n, r) {
    var o = Ft;
    try {
      return Ft = n, r();
    } finally {
      Ft = o;
    }
  }, Xt = function(n, r, o) {
    switch (r) {
      case "input":
        if (ra(n, o), r = o.name, o.type === "radio" && r != null) {
          for (o = n; o.parentNode; ) o = o.parentNode;
          for (o = o.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < o.length; r++) {
            var c = o[r];
            if (c !== n && c.form === n.form) {
              var v = Sn(c);
              if (!v) throw Error(s(90));
              jr(c), ra(c, v);
            }
          }
        }
        break;
      case "textarea":
        fi(n, o);
        break;
      case "select":
        r = o.value, r != null && Rn(n, !!o.multiple, r, !1);
    }
  }, Uo = ph, Yl = hu;
  var T0 = { usingClientEntryPoint: !1, Events: [Ze, Ci, Sn, ml, zo, ph] }, jc = { findFiberByHostInstance: Xo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Jm = { bundleType: jc.bundleType, version: jc.version, rendererPackageName: jc.rendererPackageName, rendererConfig: jc.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: se.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = kn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: jc.findFiberByHostInstance || Xm, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var _o = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!_o.isDisabled && _o.supportsFiber) try {
      Gl = _o.inject(Jm), aa = _o;
    } catch {
    }
  }
  return ai.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T0, ai.createPortal = function(n, r) {
    var o = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Eh(r)) throw Error(s(200));
    return w0(n, r, null, o);
  }, ai.createRoot = function(n, r) {
    if (!Eh(n)) throw Error(s(299));
    var o = !1, c = "", v = mu;
    return r != null && (r.unstable_strictMode === !0 && (o = !0), r.identifierPrefix !== void 0 && (c = r.identifierPrefix), r.onRecoverableError !== void 0 && (v = r.onRecoverableError)), r = _d(n, 1, !1, null, null, o, !1, c, v), n[wl] = r.current, qu(n.nodeType === 8 ? n.parentNode : n), new Sh(r);
  }, ai.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(s(188)) : (n = Object.keys(n).join(","), Error(s(268, n)));
    return n = kn(r), n = n === null ? null : n.stateNode, n;
  }, ai.flushSync = function(n) {
    return hu(n);
  }, ai.hydrate = function(n, r, o) {
    if (!xd(r)) throw Error(s(200));
    return Uc(null, n, r, !0, o);
  }, ai.hydrateRoot = function(n, r, o) {
    if (!Eh(n)) throw Error(s(405));
    var c = o != null && o.hydratedSources || null, v = !1, _ = "", b = mu;
    if (o != null && (o.unstable_strictMode === !0 && (v = !0), o.identifierPrefix !== void 0 && (_ = o.identifierPrefix), o.onRecoverableError !== void 0 && (b = o.onRecoverableError)), r = Qm(r, null, n, 1, o ?? null, v, !1, _, b), n[wl] = r.current, qu(n), c) for (n = 0; n < c.length; n++) o = c[n], v = o._getVersion, v = v(o._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [o, v] : r.mutableSourceEagerHydrationData.push(
      o,
      v
    );
    return new wd(r);
  }, ai.render = function(n, r, o) {
    if (!xd(r)) throw Error(s(200));
    return Uc(null, n, r, !1, o);
  }, ai.unmountComponentAtNode = function(n) {
    if (!xd(n)) throw Error(s(40));
    return n._reactRootContainer ? (hu(function() {
      Uc(null, null, n, !1, function() {
        n._reactRootContainer = null, n[wl] = null;
      });
    }), !0) : !1;
  }, ai.unstable_batchedUpdates = ph, ai.unstable_renderSubtreeIntoContainer = function(n, r, o, c) {
    if (!xd(o)) throw Error(s(200));
    if (n == null || n._reactInternals === void 0) throw Error(s(38));
    return Uc(n, r, o, !1, c);
  }, ai.version = "18.3.1-next-f1338f8080-20240426", ai;
}
var ii = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hT;
function sN() {
  return hT || (hT = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var g = Ut, l = BT(), s = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, f = !1;
    function p(e) {
      f = e;
    }
    function y(e) {
      if (!f) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        E("warn", e, a);
      }
    }
    function h(e) {
      if (!f) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        E("error", e, a);
      }
    }
    function E(e, t, a) {
      {
        var i = s.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var d = a.map(function(m) {
          return String(m);
        });
        d.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, d);
      }
    }
    var x = 0, T = 1, R = 2, O = 3, A = 4, L = 5, V = 6, N = 7, B = 8, Q = 9, ee = 10, ne = 11, se = 12, W = 13, de = 14, ue = 15, Ee = 16, fe = 17, Ye = 18, Ke = 19, We = 21, Re = 22, ut = 23, Ge = 24, he = 25, ce = !0, ie = !1, Te = !1, ye = !1, P = !1, re = !0, Pe = !0, be = !0, qe = !0, it = /* @__PURE__ */ new Set(), rt = {}, ct = {};
    function wt(e, t) {
      qt(e, t), qt(e + "Capture", t);
    }
    function qt(e, t) {
      rt[e] && h("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), rt[e] = t;
      {
        var a = e.toLowerCase();
        ct[a] = e, e === "onDoubleClick" && (ct.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        it.add(t[i]);
    }
    var Pn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", jr = Object.prototype.hasOwnProperty;
    function bn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function pr(e) {
      try {
        return Xn(e), !1;
      } catch {
        return !0;
      }
    }
    function Xn(e) {
      return "" + e;
    }
    function Kn(e, t) {
      if (pr(e))
        return h("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Xn(e);
    }
    function ra(e) {
      if (pr(e))
        return h("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", bn(e)), Xn(e);
    }
    function ji(e, t) {
      if (pr(e))
        return h("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Xn(e);
    }
    function wa(e, t) {
      if (pr(e))
        return h("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Xn(e);
    }
    function ir(e) {
      if (pr(e))
        return h("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", bn(e)), Xn(e);
    }
    function Rn(e) {
      if (pr(e))
        return h("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", bn(e)), Xn(e);
    }
    var Jn = 0, Dr = 1, fi = 2, Fn = 3, Or = 4, xa = 5, di = 6, Pi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ke = Pi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Qe = new RegExp("^[" + Pi + "][" + ke + "]*$"), Et = {}, $t = {};
    function an(e) {
      return jr.call($t, e) ? !0 : jr.call(Et, e) ? !1 : Qe.test(e) ? ($t[e] = !0, !0) : (Et[e] = !0, h("Invalid attribute name: `%s`", e), !1);
    }
    function gn(e, t, a) {
      return t !== null ? t.type === Jn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function cn(e, t, a, i) {
      if (a !== null && a.type === Jn)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function lr(e, t, a, i) {
      if (t === null || typeof t > "u" || cn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Fn:
            return !t;
          case Or:
            return t === !1;
          case xa:
            return isNaN(t);
          case di:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function ln(e) {
      return Xt.hasOwnProperty(e) ? Xt[e] : null;
    }
    function Qt(e, t, a, i, u, d, m) {
      this.acceptsBooleans = t === fi || t === Fn || t === Or, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = d, this.removeEmptyString = m;
    }
    var Xt = {}, Ta = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    Ta.forEach(function(e) {
      Xt[e] = new Qt(
        e,
        Jn,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Xt[t] = new Qt(
        t,
        Dr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        fi,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        fi,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        Fn,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        Fn,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        Or,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        di,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        xa,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Lr = /[\-\:]([a-z])/g, Fa = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Lr, Fa);
      Xt[t] = new Qt(
        t,
        Dr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Lr, Fa);
      Xt[t] = new Qt(
        t,
        Dr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Lr, Fa);
      Xt[t] = new Qt(
        t,
        Dr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        Dr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var ml = "xlinkHref";
    Xt[ml] = new Qt(
      "xlinkHref",
      Dr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Xt[e] = new Qt(
        e,
        Dr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var zo = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, Uo = !1;
    function Yl(e) {
      !Uo && zo.test(e) && (Uo = !0, h("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function $l(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        Kn(a, t), i.sanitizeURL && Yl("" + a);
        var d = i.attributeName, m = null;
        if (i.type === Or) {
          if (e.hasAttribute(d)) {
            var S = e.getAttribute(d);
            return S === "" ? !0 : lr(t, a, i, !1) ? S : S === "" + a ? a : S;
          }
        } else if (e.hasAttribute(d)) {
          if (lr(t, a, i, !1))
            return e.getAttribute(d);
          if (i.type === Fn)
            return a;
          m = e.getAttribute(d);
        }
        return lr(t, a, i, !1) ? m === null ? a : m : m === "" + a ? a : m;
      }
    }
    function jo(e, t, a, i) {
      {
        if (!an(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return Kn(a, t), u === "" + a ? a : u;
      }
    }
    function Pr(e, t, a, i) {
      var u = ln(t);
      if (!gn(t, u, i)) {
        if (lr(t, a, u, i) && (a = null), i || u === null) {
          if (an(t)) {
            var d = t;
            a === null ? e.removeAttribute(d) : (Kn(a, t), e.setAttribute(d, "" + a));
          }
          return;
        }
        var m = u.mustUseProperty;
        if (m) {
          var S = u.propertyName;
          if (a === null) {
            var C = u.type;
            e[S] = C === Fn ? !1 : "";
          } else
            e[S] = a;
          return;
        }
        var k = u.attributeName, D = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(k);
        else {
          var I = u.type, F;
          I === Fn || I === Or && a === !0 ? F = "" : (Kn(a, k), F = "" + a, u.sanitizeURL && Yl(F.toString())), D ? e.setAttributeNS(D, k, F) : e.setAttribute(k, F);
        }
      }
    }
    var Fr = Symbol.for("react.element"), hr = Symbol.for("react.portal"), Fi = Symbol.for("react.fragment"), pi = Symbol.for("react.strict_mode"), Hi = Symbol.for("react.profiler"), Ii = Symbol.for("react.provider"), U = Symbol.for("react.context"), ve = Symbol.for("react.forward_ref"), Le = Symbol.for("react.suspense"), He = Symbol.for("react.suspense_list"), yt = Symbol.for("react.memo"), ht = Symbol.for("react.lazy"), bt = Symbol.for("react.scope"), xt = Symbol.for("react.debug_trace_mode"), kn = Symbol.for("react.offscreen"), on = Symbol.for("react.legacy_hidden"), fn = Symbol.for("react.cache"), vr = Symbol.for("react.tracing_marker"), hi = Symbol.iterator, vi = "@@iterator";
    function gt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = hi && e[hi] || e[vi];
      return typeof t == "function" ? t : null;
    }
    var St = Object.assign, mi = 0, Po, Fo, Wl, Nu, Gl, aa, Is;
    function Hr() {
    }
    Hr.__reactDisabledLog = !0;
    function mf() {
      {
        if (mi === 0) {
          Po = console.log, Fo = console.info, Wl = console.warn, Nu = console.error, Gl = console.group, aa = console.groupCollapsed, Is = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Hr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        mi++;
      }
    }
    function yf() {
      {
        if (mi--, mi === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: St({}, e, {
              value: Po
            }),
            info: St({}, e, {
              value: Fo
            }),
            warn: St({}, e, {
              value: Wl
            }),
            error: St({}, e, {
              value: Nu
            }),
            group: St({}, e, {
              value: Gl
            }),
            groupCollapsed: St({}, e, {
              value: aa
            }),
            groupEnd: St({}, e, {
              value: Is
            })
          });
        }
        mi < 0 && h("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Au = s.ReactCurrentDispatcher, ql;
    function ba(e, t, a) {
      {
        if (ql === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            ql = i && i[1] || "";
          }
        return `
` + ql + e;
      }
    }
    var yi = !1, gi;
    {
      var zu = typeof WeakMap == "function" ? WeakMap : Map;
      gi = new zu();
    }
    function Ho(e, t) {
      if (!e || yi)
        return "";
      {
        var a = gi.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      yi = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var d;
      d = Au.current, Au.current = null, mf();
      try {
        if (t) {
          var m = function() {
            throw Error();
          };
          if (Object.defineProperty(m.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(m, []);
            } catch (te) {
              i = te;
            }
            Reflect.construct(e, [], m);
          } else {
            try {
              m.call();
            } catch (te) {
              i = te;
            }
            e.call(m.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (te) {
            i = te;
          }
          e();
        }
      } catch (te) {
        if (te && i && typeof te.stack == "string") {
          for (var S = te.stack.split(`
`), C = i.stack.split(`
`), k = S.length - 1, D = C.length - 1; k >= 1 && D >= 0 && S[k] !== C[D]; )
            D--;
          for (; k >= 1 && D >= 0; k--, D--)
            if (S[k] !== C[D]) {
              if (k !== 1 || D !== 1)
                do
                  if (k--, D--, D < 0 || S[k] !== C[D]) {
                    var I = `
` + S[k].replace(" at new ", " at ");
                    return e.displayName && I.includes("<anonymous>") && (I = I.replace("<anonymous>", e.displayName)), typeof e == "function" && gi.set(e, I), I;
                  }
                while (k >= 1 && D >= 0);
              break;
            }
        }
      } finally {
        yi = !1, Au.current = d, yf(), Error.prepareStackTrace = u;
      }
      var F = e ? e.displayName || e.name : "", K = F ? ba(F) : "";
      return typeof e == "function" && gi.set(e, K), K;
    }
    function Ql(e, t, a) {
      return Ho(e, !0);
    }
    function Uu(e, t, a) {
      return Ho(e, !1);
    }
    function ju(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function yl(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Ho(e, ju(e));
      if (typeof e == "string")
        return ba(e);
      switch (e) {
        case Le:
          return ba("Suspense");
        case He:
          return ba("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ve:
            return Uu(e.render);
          case yt:
            return yl(e.type, t, a);
          case ht: {
            var i = e, u = i._payload, d = i._init;
            try {
              return yl(d(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function mp(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case L:
          return ba(e.type);
        case Ee:
          return ba("Lazy");
        case W:
          return ba("Suspense");
        case Ke:
          return ba("SuspenseList");
        case x:
        case R:
        case ue:
          return Uu(e.type);
        case ne:
          return Uu(e.type.render);
        case T:
          return Ql(e.type);
        default:
          return "";
      }
    }
    function gl(e) {
      try {
        var t = "", a = e;
        do
          t += mp(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ft(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Pu(e) {
      return e.displayName || "Context";
    }
    function At(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && h("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Fi:
          return "Fragment";
        case hr:
          return "Portal";
        case Hi:
          return "Profiler";
        case pi:
          return "StrictMode";
        case Le:
          return "Suspense";
        case He:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case U:
            var t = e;
            return Pu(t) + ".Consumer";
          case Ii:
            var a = e;
            return Pu(a._context) + ".Provider";
          case ve:
            return Ft(e, e.render, "ForwardRef");
          case yt:
            var i = e.displayName || null;
            return i !== null ? i : At(e.type) || "Memo";
          case ht: {
            var u = e, d = u._payload, m = u._init;
            try {
              return At(m(d));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Vs(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function Vi(e) {
      return e.displayName || "Context";
    }
    function pt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Ge:
          return "Cache";
        case Q:
          var i = a;
          return Vi(i) + ".Consumer";
        case ee:
          var u = a;
          return Vi(u._context) + ".Provider";
        case Ye:
          return "DehydratedFragment";
        case ne:
          return Vs(a, a.render, "ForwardRef");
        case N:
          return "Fragment";
        case L:
          return a;
        case A:
          return "Portal";
        case O:
          return "Root";
        case V:
          return "Text";
        case Ee:
          return At(a);
        case B:
          return a === pi ? "StrictMode" : "Mode";
        case Re:
          return "Offscreen";
        case se:
          return "Profiler";
        case We:
          return "Scope";
        case W:
          return "Suspense";
        case Ke:
          return "SuspenseList";
        case he:
          return "TracingMarker";
        case T:
        case x:
        case fe:
        case R:
        case de:
        case ue:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Fu = s.ReactDebugCurrentFrame, mr = null, Bi = !1;
    function Ir() {
      {
        if (mr === null)
          return null;
        var e = mr._debugOwner;
        if (e !== null && typeof e < "u")
          return pt(e);
      }
      return null;
    }
    function Yi() {
      return mr === null ? "" : gl(mr);
    }
    function dn() {
      Fu.getCurrentStack = null, mr = null, Bi = !1;
    }
    function Kt(e) {
      Fu.getCurrentStack = e === null ? null : Yi, mr = e, Bi = !1;
    }
    function Xl() {
      return mr;
    }
    function Zn(e) {
      Bi = e;
    }
    function Vr(e) {
      return "" + e;
    }
    function Ha(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Rn(e), e;
        default:
          return "";
      }
    }
    var Io = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Bs(e, t) {
      Io[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || h("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || h("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Ys(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Kl(e) {
      return e._valueTracker;
    }
    function Vo(e) {
      e._valueTracker = null;
    }
    function yp(e) {
      var t = "";
      return e && (Ys(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Ia(e) {
      var t = Ys(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Rn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, d = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(S) {
            Rn(S), i = "" + S, d.call(this, S);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var m = {
          getValue: function() {
            return i;
          },
          setValue: function(S) {
            Rn(S), i = "" + S;
          },
          stopTracking: function() {
            Vo(e), delete e[t];
          }
        };
        return m;
      }
    }
    function _i(e) {
      Kl(e) || (e._valueTracker = Ia(e));
    }
    function $i(e) {
      if (!e)
        return !1;
      var t = Kl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = yp(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Va(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Hu = !1, Iu = !1, Jl = !1, Bo = !1;
    function Vu(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function Bu(e, t) {
      var a = e, i = t.checked, u = St({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function Si(e, t) {
      Bs("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !Iu && (h("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ir() || "A component", t.type), Iu = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Hu && (h("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ir() || "A component", t.type), Hu = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Ha(t.value != null ? t.value : i),
        controlled: Vu(t)
      };
    }
    function w(e, t) {
      var a = e, i = t.checked;
      i != null && Pr(a, "checked", i, !1);
    }
    function z(e, t) {
      var a = e;
      {
        var i = Vu(t);
        !a._wrapperState.controlled && i && !Bo && (h("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Bo = !0), a._wrapperState.controlled && !i && !Jl && (h("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Jl = !0);
      }
      w(e, t);
      var u = Ha(t.value), d = t.type;
      if (u != null)
        d === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Vr(u)) : a.value !== Vr(u) && (a.value = Vr(u));
      else if (d === "submit" || d === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? tt(a, t.type, u) : t.hasOwnProperty("defaultValue") && tt(a, t.type, Ha(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function J(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, d = u === "submit" || u === "reset";
        if (d && (t.value === void 0 || t.value === null))
          return;
        var m = Vr(i._wrapperState.initialValue);
        a || m !== i.value && (i.value = m), i.defaultValue = m;
      }
      var S = i.name;
      S !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, S !== "" && (i.name = S);
    }
    function ae(e, t) {
      var a = e;
      z(a, t), xe(a, t);
    }
    function xe(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Kn(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), d = 0; d < u.length; d++) {
          var m = u[d];
          if (!(m === e || m.form !== e.form)) {
            var S = my(m);
            if (!S)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            $i(m), z(m, S);
          }
        }
      }
    }
    function tt(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Va(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Vr(e._wrapperState.initialValue) : e.defaultValue !== Vr(a) && (e.defaultValue = Vr(a)));
    }
    var Oe = !1, lt = !1, Rt = !1;
    function zt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? g.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || lt || (lt = !0, h("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Rt || (Rt = !0, h("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Oe && (h("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Oe = !0);
    }
    function un(e, t) {
      t.value != null && e.setAttribute("value", Vr(Ha(t.value)));
    }
    var Jt = Array.isArray;
    function Ct(e) {
      return Jt(e);
    }
    var Zt;
    Zt = !1;
    function _n() {
      var e = Ir();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Zl = ["value", "defaultValue"];
    function $s(e) {
      {
        Bs("select", e);
        for (var t = 0; t < Zl.length; t++) {
          var a = Zl[t];
          if (e[a] != null) {
            var i = Ct(e[a]);
            e.multiple && !i ? h("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, _n()) : !e.multiple && i && h("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, _n());
          }
        }
      }
    }
    function _l(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var d = a, m = {}, S = 0; S < d.length; S++)
          m["$" + d[S]] = !0;
        for (var C = 0; C < u.length; C++) {
          var k = m.hasOwnProperty("$" + u[C].value);
          u[C].selected !== k && (u[C].selected = k), k && i && (u[C].defaultSelected = !0);
        }
      } else {
        for (var D = Vr(Ha(a)), I = null, F = 0; F < u.length; F++) {
          if (u[F].value === D) {
            u[F].selected = !0, i && (u[F].defaultSelected = !0);
            return;
          }
          I === null && !u[F].disabled && (I = u[F]);
        }
        I !== null && (I.selected = !0);
      }
    }
    function Ws(e, t) {
      return St({}, t, {
        value: void 0
      });
    }
    function Yo(e, t) {
      var a = e;
      $s(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Zt && (h("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Zt = !0);
    }
    function gp(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? _l(a, !!t.multiple, i, !1) : t.defaultValue != null && _l(a, !!t.multiple, t.defaultValue, !0);
    }
    function gf(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? _l(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? _l(a, !!t.multiple, t.defaultValue, !0) : _l(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function _p(e, t) {
      var a = e, i = t.value;
      i != null && _l(a, !!t.multiple, i, !1);
    }
    var Fv = !1;
    function Sp(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = St({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Vr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Ep(e, t) {
      var a = e;
      Bs("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !Fv && (h("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ir() || "A component"), Fv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, d = t.defaultValue;
        if (u != null) {
          h("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (d != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Ct(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            d = u;
          }
        }
        d == null && (d = ""), i = d;
      }
      a._wrapperState = {
        initialValue: Ha(i)
      };
    }
    function Hv(e, t) {
      var a = e, i = Ha(t.value), u = Ha(t.defaultValue);
      if (i != null) {
        var d = Vr(i);
        d !== a.value && (a.value = d), t.defaultValue == null && a.defaultValue !== d && (a.defaultValue = d);
      }
      u != null && (a.defaultValue = Vr(u));
    }
    function Iv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function e0(e, t) {
      Hv(e, t);
    }
    var Sl = "http://www.w3.org/1999/xhtml", Cp = "http://www.w3.org/1998/Math/MathML", wp = "http://www.w3.org/2000/svg";
    function xp(e) {
      switch (e) {
        case "svg":
          return wp;
        case "math":
          return Cp;
        default:
          return Sl;
      }
    }
    function Tp(e, t) {
      return e == null || e === Sl ? xp(t) : e === wp && t === "foreignObject" ? Sl : e;
    }
    var Vv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, _f, Bv = Vv(function(e, t) {
      if (e.namespaceURI === wp && !("innerHTML" in e)) {
        _f = _f || document.createElement("div"), _f.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = _f.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), ia = 1, El = 3, Hn = 8, Cl = 9, bp = 11, Yu = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === El) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Gs = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, qs = {
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
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function Yv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var $v = ["Webkit", "ms", "Moz", "O"];
    Object.keys(qs).forEach(function(e) {
      $v.forEach(function(t) {
        qs[Yv(t, e)] = qs[e];
      });
    });
    function Sf(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(qs.hasOwnProperty(e) && qs[e]) ? t + "px" : (wa(t, e), ("" + t).trim());
    }
    var Wv = /([A-Z])/g, Gv = /^ms-/;
    function $u(e) {
      return e.replace(Wv, "-$1").toLowerCase().replace(Gv, "-ms-");
    }
    var qv = function() {
    };
    {
      var t0 = /^(?:webkit|moz|o)[A-Z]/, n0 = /^-ms-/, Qv = /-(.)/g, Rp = /;\s*$/, Wi = {}, $o = {}, Xv = !1, Qs = !1, r0 = function(e) {
        return e.replace(Qv, function(t, a) {
          return a.toUpperCase();
        });
      }, Kv = function(e) {
        Wi.hasOwnProperty(e) && Wi[e] || (Wi[e] = !0, h(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          r0(e.replace(n0, "ms-"))
        ));
      }, kp = function(e) {
        Wi.hasOwnProperty(e) && Wi[e] || (Wi[e] = !0, h("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, Dp = function(e, t) {
        $o.hasOwnProperty(t) && $o[t] || ($o[t] = !0, h(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(Rp, "")));
      }, Jv = function(e, t) {
        Xv || (Xv = !0, h("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Zv = function(e, t) {
        Qs || (Qs = !0, h("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      qv = function(e, t) {
        e.indexOf("-") > -1 ? Kv(e) : t0.test(e) ? kp(e) : Rp.test(t) && Dp(e, t), typeof t == "number" && (isNaN(t) ? Jv(e, t) : isFinite(t) || Zv(e, t));
      };
    }
    var em = qv;
    function a0(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var d = i.indexOf("--") === 0;
              t += a + (d ? i : $u(i)) + ":", t += Sf(i, u, d), a = ";";
            }
          }
        return t || null;
      }
    }
    function tm(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || em(i, t[i]);
          var d = Sf(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, d) : a[i] = d;
        }
    }
    function i0(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function nm(e) {
      var t = {};
      for (var a in e)
        for (var i = Gs[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function l0(e, t) {
      {
        if (!t)
          return;
        var a = nm(e), i = nm(t), u = {};
        for (var d in a) {
          var m = a[d], S = i[d];
          if (S && m !== S) {
            var C = m + "," + S;
            if (u[C])
              continue;
            u[C] = !0, h("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", i0(e[m]) ? "Removing" : "Updating", m, S);
          }
        }
      }
    }
    var Ei = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, Xs = St({
      menuitem: !0
    }, Ei), rm = "__html";
    function Ef(e, t) {
      if (t) {
        if (Xs[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(rm in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && h("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function eo(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
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
    var Ks = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, Cf = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, Wu = {}, o0 = new RegExp("^(aria)-[" + ke + "]*$"), Gu = new RegExp("^(aria)[A-Z][" + ke + "]*$");
    function Op(e, t) {
      {
        if (jr.call(Wu, t) && Wu[t])
          return !0;
        if (Gu.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = Cf.hasOwnProperty(a) ? a : null;
          if (i == null)
            return h("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Wu[t] = !0, !0;
          if (t !== i)
            return h("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), Wu[t] = !0, !0;
        }
        if (o0.test(t)) {
          var u = t.toLowerCase(), d = Cf.hasOwnProperty(u) ? u : null;
          if (d == null)
            return Wu[t] = !0, !1;
          if (t !== d)
            return h("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, d), Wu[t] = !0, !0;
        }
      }
      return !0;
    }
    function Js(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = Op(e, i);
          u || a.push(i);
        }
        var d = a.map(function(m) {
          return "`" + m + "`";
        }).join(", ");
        a.length === 1 ? h("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e) : a.length > 1 && h("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e);
      }
    }
    function Lp(e, t) {
      eo(e, t) || Js(e, t);
    }
    var Mp = !1;
    function wf(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !Mp && (Mp = !0, e === "select" && t.multiple ? h("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : h("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var Wo = function() {
    };
    {
      var yr = {}, Np = /^on./, xf = /^on[^A-Z]/, am = new RegExp("^(aria)-[" + ke + "]*$"), im = new RegExp("^(aria)[A-Z][" + ke + "]*$");
      Wo = function(e, t, a, i) {
        if (jr.call(yr, t) && yr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return h("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), yr[t] = !0, !0;
        if (i != null) {
          var d = i.registrationNameDependencies, m = i.possibleRegistrationNames;
          if (d.hasOwnProperty(t))
            return !0;
          var S = m.hasOwnProperty(u) ? m[u] : null;
          if (S != null)
            return h("Invalid event handler property `%s`. Did you mean `%s`?", t, S), yr[t] = !0, !0;
          if (Np.test(t))
            return h("Unknown event handler property `%s`. It will be ignored.", t), yr[t] = !0, !0;
        } else if (Np.test(t))
          return xf.test(t) && h("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), yr[t] = !0, !0;
        if (am.test(t) || im.test(t))
          return !0;
        if (u === "innerhtml")
          return h("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), yr[t] = !0, !0;
        if (u === "aria")
          return h("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), yr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return h("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), yr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return h("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), yr[t] = !0, !0;
        var C = ln(t), k = C !== null && C.type === Jn;
        if (Ks.hasOwnProperty(u)) {
          var D = Ks[u];
          if (D !== t)
            return h("Invalid DOM property `%s`. Did you mean `%s`?", t, D), yr[t] = !0, !0;
        } else if (!k && t !== u)
          return h("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), yr[t] = !0, !0;
        return typeof a == "boolean" && cn(t, a, C, !1) ? (a ? h('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : h('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), yr[t] = !0, !0) : k ? !0 : cn(t, a, C, !1) ? (yr[t] = !0, !1) : ((a === "false" || a === "true") && C !== null && C.type === Fn && (h("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), yr[t] = !0), !0);
      };
    }
    var lm = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var d = Wo(e, u, t[u], a);
          d || i.push(u);
        }
        var m = i.map(function(S) {
          return "`" + S + "`";
        }).join(", ");
        i.length === 1 ? h("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", m, e) : i.length > 1 && h("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", m, e);
      }
    };
    function om(e, t, a) {
      eo(e, t) || lm(e, t, a);
    }
    var Ap = 1, Tf = 2, Ba = 4, zp = Ap | Tf | Ba, Go = null;
    function u0(e) {
      Go !== null && h("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Go = e;
    }
    function s0() {
      Go === null && h("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Go = null;
    }
    function Zs(e) {
      return e === Go;
    }
    function Up(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === El ? t.parentNode : t;
    }
    var bf = null, qo = null, Wt = null;
    function Rf(e) {
      var t = hs(e);
      if (t) {
        if (typeof bf != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = my(a);
          bf(t.stateNode, t.type, i);
        }
      }
    }
    function kf(e) {
      bf = e;
    }
    function qu(e) {
      qo ? Wt ? Wt.push(e) : Wt = [e] : qo = e;
    }
    function um() {
      return qo !== null || Wt !== null;
    }
    function Df() {
      if (qo) {
        var e = qo, t = Wt;
        if (qo = null, Wt = null, Rf(e), t)
          for (var a = 0; a < t.length; a++)
            Rf(t[a]);
      }
    }
    var Qu = function(e, t) {
      return e(t);
    }, ec = function() {
    }, to = !1;
    function sm() {
      var e = um();
      e && (ec(), Df());
    }
    function cm(e, t, a) {
      if (to)
        return e(t, a);
      to = !0;
      try {
        return Qu(e, t, a);
      } finally {
        to = !1, sm();
      }
    }
    function c0(e, t, a) {
      Qu = e, ec = a;
    }
    function fm(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Of(e, t, a) {
      switch (e) {
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
          return !!(a.disabled && fm(t));
        default:
          return !1;
      }
    }
    function no(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = my(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Of(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var tc = !1;
    if (Pn)
      try {
        var Qo = {};
        Object.defineProperty(Qo, "passive", {
          get: function() {
            tc = !0;
          }
        }), window.addEventListener("test", Qo, Qo), window.removeEventListener("test", Qo, Qo);
      } catch {
        tc = !1;
      }
    function Lf(e, t, a, i, u, d, m, S, C) {
      var k = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, k);
      } catch (D) {
        this.onError(D);
      }
    }
    var Mf = Lf;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var jp = document.createElement("react");
      Mf = function(t, a, i, u, d, m, S, C, k) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var D = document.createEvent("Event"), I = !1, F = !0, K = window.event, te = Object.getOwnPropertyDescriptor(window, "event");
        function le() {
          jp.removeEventListener(oe, nt, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = K);
        }
        var Ne = Array.prototype.slice.call(arguments, 3);
        function nt() {
          I = !0, le(), a.apply(i, Ne), F = !1;
        }
        var Xe, Nt = !1, kt = !1;
        function G(q) {
          if (Xe = q.error, Nt = !0, Xe === null && q.colno === 0 && q.lineno === 0 && (kt = !0), q.defaultPrevented && Xe != null && typeof Xe == "object")
            try {
              Xe._suppressLogging = !0;
            } catch {
            }
        }
        var oe = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", G), jp.addEventListener(oe, nt, !1), D.initEvent(oe, !1, !1), jp.dispatchEvent(D), te && Object.defineProperty(window, "event", te), I && F && (Nt ? kt && (Xe = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Xe = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Xe)), window.removeEventListener("error", G), !I)
          return le(), Lf.apply(this, arguments);
      };
    }
    var dm = Mf, Xu = !1, Nf = null, Ku = !1, Gi = null, pm = {
      onError: function(e) {
        Xu = !0, Nf = e;
      }
    };
    function ro(e, t, a, i, u, d, m, S, C) {
      Xu = !1, Nf = null, dm.apply(pm, arguments);
    }
    function qi(e, t, a, i, u, d, m, S, C) {
      if (ro.apply(this, arguments), Xu) {
        var k = rc();
        Ku || (Ku = !0, Gi = k);
      }
    }
    function nc() {
      if (Ku) {
        var e = Gi;
        throw Ku = !1, Gi = null, e;
      }
    }
    function wl() {
      return Xu;
    }
    function rc() {
      if (Xu) {
        var e = Nf;
        return Xu = !1, Nf = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ju(e) {
      return e._reactInternals;
    }
    function f0(e) {
      return e._reactInternals !== void 0;
    }
    function Xo(e, t) {
      e._reactInternals = t;
    }
    var Ze = (
      /*                      */
      0
    ), Ci = (
      /*                */
      1
    ), Sn = (
      /*                    */
      2
    ), Ot = (
      /*                       */
      4
    ), Ya = (
      /*                */
      16
    ), $a = (
      /*                 */
      32
    ), sn = (
      /*                     */
      64
    ), Je = (
      /*                   */
      128
    ), Mr = (
      /*            */
      256
    ), xn = (
      /*                          */
      512
    ), er = (
      /*                     */
      1024
    ), la = (
      /*                      */
      2048
    ), oa = (
      /*                    */
      4096
    ), In = (
      /*                   */
      8192
    ), Zu = (
      /*             */
      16384
    ), hm = (
      /*               */
      32767
    ), ac = (
      /*                   */
      32768
    ), or = (
      /*                */
      65536
    ), Af = (
      /* */
      131072
    ), Qi = (
      /*                       */
      1048576
    ), es = (
      /*                    */
      2097152
    ), xl = (
      /*                 */
      4194304
    ), zf = (
      /*                */
      8388608
    ), ao = (
      /*               */
      16777216
    ), Xi = (
      /*              */
      33554432
    ), io = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Ot | er | 0
    ), lo = Sn | Ot | Ya | $a | xn | oa | In, oo = Ot | sn | xn | In, Tl = la | Ya, Vn = xl | zf | es, Wa = s.ReactCurrentOwner;
    function Ra(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (Sn | oa)) !== Ze && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === O ? a : null;
    }
    function Ki(e) {
      if (e.tag === W) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function Ji(e) {
      return e.tag === O ? e.stateNode.containerInfo : null;
    }
    function Ko(e) {
      return Ra(e) === e;
    }
    function vm(e) {
      {
        var t = Wa.current;
        if (t !== null && t.tag === T) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || h("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", pt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = Ju(e);
      return u ? Ra(u) === u : !1;
    }
    function Uf(e) {
      if (Ra(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function jf(e) {
      var t = e.alternate;
      if (!t) {
        var a = Ra(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var d = i.return;
        if (d === null)
          break;
        var m = d.alternate;
        if (m === null) {
          var S = d.return;
          if (S !== null) {
            i = u = S;
            continue;
          }
          break;
        }
        if (d.child === m.child) {
          for (var C = d.child; C; ) {
            if (C === i)
              return Uf(d), e;
            if (C === u)
              return Uf(d), t;
            C = C.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = d, u = m;
        else {
          for (var k = !1, D = d.child; D; ) {
            if (D === i) {
              k = !0, i = d, u = m;
              break;
            }
            if (D === u) {
              k = !0, u = d, i = m;
              break;
            }
            D = D.sibling;
          }
          if (!k) {
            for (D = m.child; D; ) {
              if (D === i) {
                k = !0, i = m, u = d;
                break;
              }
              if (D === u) {
                k = !0, u = m, i = d;
                break;
              }
              D = D.sibling;
            }
            if (!k)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== O)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function ua(e) {
      var t = jf(e);
      return t !== null ? sa(t) : null;
    }
    function sa(e) {
      if (e.tag === L || e.tag === V)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = sa(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function mn(e) {
      var t = jf(e);
      return t !== null ? Ga(t) : null;
    }
    function Ga(e) {
      if (e.tag === L || e.tag === V)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== A) {
          var a = Ga(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var Pp = l.unstable_scheduleCallback, mm = l.unstable_cancelCallback, Fp = l.unstable_shouldYield, Hp = l.unstable_requestPaint, tr = l.unstable_now, Pf = l.unstable_getCurrentPriorityLevel, ic = l.unstable_ImmediatePriority, uo = l.unstable_UserBlockingPriority, bl = l.unstable_NormalPriority, d0 = l.unstable_LowPriority, Jo = l.unstable_IdlePriority, Ff = l.unstable_yieldValue, ym = l.unstable_setDisableYieldValue, Zo = null, Dn = null, Me = null, ka = !1, ca = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function ts(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return h("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Pe && (e = St({}, e, {
          getLaneLabelMap: eu,
          injectProfilingHooks: qa
        })), Zo = t.inject(e), Dn = t;
      } catch (a) {
        h("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Ip(e, t) {
      if (Dn && typeof Dn.onScheduleFiberRoot == "function")
        try {
          Dn.onScheduleFiberRoot(Zo, e, t);
        } catch (a) {
          ka || (ka = !0, h("React instrumentation encountered an error: %s", a));
        }
    }
    function Vp(e, t) {
      if (Dn && typeof Dn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Je) === Je;
          if (be) {
            var i;
            switch (t) {
              case Br:
                i = ic;
                break;
              case el:
                i = uo;
                break;
              case Qa:
                i = bl;
                break;
              case Xa:
                i = Jo;
                break;
              default:
                i = bl;
                break;
            }
            Dn.onCommitFiberRoot(Zo, e, i, a);
          }
        } catch (u) {
          ka || (ka = !0, h("React instrumentation encountered an error: %s", u));
        }
    }
    function Bp(e) {
      if (Dn && typeof Dn.onPostCommitFiberRoot == "function")
        try {
          Dn.onPostCommitFiberRoot(Zo, e);
        } catch (t) {
          ka || (ka = !0, h("React instrumentation encountered an error: %s", t));
        }
    }
    function Yp(e) {
      if (Dn && typeof Dn.onCommitFiberUnmount == "function")
        try {
          Dn.onCommitFiberUnmount(Zo, e);
        } catch (t) {
          ka || (ka = !0, h("React instrumentation encountered an error: %s", t));
        }
    }
    function En(e) {
      if (typeof Ff == "function" && (ym(e), p(e)), Dn && typeof Dn.setStrictMode == "function")
        try {
          Dn.setStrictMode(Zo, e);
        } catch (t) {
          ka || (ka = !0, h("React instrumentation encountered an error: %s", t));
        }
    }
    function qa(e) {
      Me = e;
    }
    function eu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < ru; a++) {
          var i = Em(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function $p(e) {
      Me !== null && typeof Me.markCommitStarted == "function" && Me.markCommitStarted(e);
    }
    function Wp() {
      Me !== null && typeof Me.markCommitStopped == "function" && Me.markCommitStopped();
    }
    function Da(e) {
      Me !== null && typeof Me.markComponentRenderStarted == "function" && Me.markComponentRenderStarted(e);
    }
    function Oa() {
      Me !== null && typeof Me.markComponentRenderStopped == "function" && Me.markComponentRenderStopped();
    }
    function Gp(e) {
      Me !== null && typeof Me.markComponentPassiveEffectMountStarted == "function" && Me.markComponentPassiveEffectMountStarted(e);
    }
    function gm() {
      Me !== null && typeof Me.markComponentPassiveEffectMountStopped == "function" && Me.markComponentPassiveEffectMountStopped();
    }
    function Rl(e) {
      Me !== null && typeof Me.markComponentPassiveEffectUnmountStarted == "function" && Me.markComponentPassiveEffectUnmountStarted(e);
    }
    function so() {
      Me !== null && typeof Me.markComponentPassiveEffectUnmountStopped == "function" && Me.markComponentPassiveEffectUnmountStopped();
    }
    function Hf(e) {
      Me !== null && typeof Me.markComponentLayoutEffectMountStarted == "function" && Me.markComponentLayoutEffectMountStarted(e);
    }
    function _m() {
      Me !== null && typeof Me.markComponentLayoutEffectMountStopped == "function" && Me.markComponentLayoutEffectMountStopped();
    }
    function lc(e) {
      Me !== null && typeof Me.markComponentLayoutEffectUnmountStarted == "function" && Me.markComponentLayoutEffectUnmountStarted(e);
    }
    function qp() {
      Me !== null && typeof Me.markComponentLayoutEffectUnmountStopped == "function" && Me.markComponentLayoutEffectUnmountStopped();
    }
    function oc(e, t, a) {
      Me !== null && typeof Me.markComponentErrored == "function" && Me.markComponentErrored(e, t, a);
    }
    function Zi(e, t, a) {
      Me !== null && typeof Me.markComponentSuspended == "function" && Me.markComponentSuspended(e, t, a);
    }
    function uc(e) {
      Me !== null && typeof Me.markLayoutEffectsStarted == "function" && Me.markLayoutEffectsStarted(e);
    }
    function sc() {
      Me !== null && typeof Me.markLayoutEffectsStopped == "function" && Me.markLayoutEffectsStopped();
    }
    function tu(e) {
      Me !== null && typeof Me.markPassiveEffectsStarted == "function" && Me.markPassiveEffectsStarted(e);
    }
    function Qp() {
      Me !== null && typeof Me.markPassiveEffectsStopped == "function" && Me.markPassiveEffectsStopped();
    }
    function nu(e) {
      Me !== null && typeof Me.markRenderStarted == "function" && Me.markRenderStarted(e);
    }
    function Sm() {
      Me !== null && typeof Me.markRenderYielded == "function" && Me.markRenderYielded();
    }
    function If() {
      Me !== null && typeof Me.markRenderStopped == "function" && Me.markRenderStopped();
    }
    function Cn(e) {
      Me !== null && typeof Me.markRenderScheduled == "function" && Me.markRenderScheduled(e);
    }
    function Vf(e, t) {
      Me !== null && typeof Me.markForceUpdateScheduled == "function" && Me.markForceUpdateScheduled(e, t);
    }
    function cc(e, t) {
      Me !== null && typeof Me.markStateUpdateScheduled == "function" && Me.markStateUpdateScheduled(e, t);
    }
    var et = (
      /*                         */
      0
    ), Tt = (
      /*                 */
      1
    ), Ht = (
      /*                    */
      2
    ), en = (
      /*               */
      8
    ), It = (
      /*              */
      16
    ), Bn = Math.clz32 ? Math.clz32 : fc, ur = Math.log, Bf = Math.LN2;
    function fc(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (ur(t) / Bf | 0) | 0;
    }
    var ru = 31, me = (
      /*                        */
      0
    ), jt = (
      /*                          */
      0
    ), st = (
      /*                        */
      1
    ), co = (
      /*    */
      2
    ), wi = (
      /*             */
      4
    ), Nr = (
      /*            */
      8
    ), On = (
      /*                     */
      16
    ), kl = (
      /*                */
      32
    ), fo = (
      /*                       */
      4194240
    ), au = (
      /*                        */
      64
    ), Yf = (
      /*                        */
      128
    ), $f = (
      /*                        */
      256
    ), Wf = (
      /*                        */
      512
    ), Gf = (
      /*                        */
      1024
    ), qf = (
      /*                        */
      2048
    ), Qf = (
      /*                        */
      4096
    ), Xf = (
      /*                        */
      8192
    ), Kf = (
      /*                        */
      16384
    ), iu = (
      /*                       */
      32768
    ), Jf = (
      /*                       */
      65536
    ), ns = (
      /*                       */
      131072
    ), rs = (
      /*                       */
      262144
    ), Zf = (
      /*                       */
      524288
    ), dc = (
      /*                       */
      1048576
    ), ed = (
      /*                       */
      2097152
    ), pc = (
      /*                            */
      130023424
    ), lu = (
      /*                             */
      4194304
    ), td = (
      /*                             */
      8388608
    ), hc = (
      /*                             */
      16777216
    ), nd = (
      /*                             */
      33554432
    ), rd = (
      /*                             */
      67108864
    ), Xp = lu, vc = (
      /*          */
      134217728
    ), Kp = (
      /*                          */
      268435455
    ), mc = (
      /*               */
      268435456
    ), ou = (
      /*                        */
      536870912
    ), fa = (
      /*                   */
      1073741824
    );
    function Em(e) {
      {
        if (e & st)
          return "Sync";
        if (e & co)
          return "InputContinuousHydration";
        if (e & wi)
          return "InputContinuous";
        if (e & Nr)
          return "DefaultHydration";
        if (e & On)
          return "Default";
        if (e & kl)
          return "TransitionHydration";
        if (e & fo)
          return "Transition";
        if (e & pc)
          return "Retry";
        if (e & vc)
          return "SelectiveHydration";
        if (e & mc)
          return "IdleHydration";
        if (e & ou)
          return "Idle";
        if (e & fa)
          return "Offscreen";
      }
    }
    var rn = -1, uu = au, ad = lu;
    function yc(e) {
      switch (po(e)) {
        case st:
          return st;
        case co:
          return co;
        case wi:
          return wi;
        case Nr:
          return Nr;
        case On:
          return On;
        case kl:
          return kl;
        case au:
        case Yf:
        case $f:
        case Wf:
        case Gf:
        case qf:
        case Qf:
        case Xf:
        case Kf:
        case iu:
        case Jf:
        case ns:
        case rs:
        case Zf:
        case dc:
        case ed:
          return e & fo;
        case lu:
        case td:
        case hc:
        case nd:
        case rd:
          return e & pc;
        case vc:
          return vc;
        case mc:
          return mc;
        case ou:
          return ou;
        case fa:
          return fa;
        default:
          return h("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function id(e, t) {
      var a = e.pendingLanes;
      if (a === me)
        return me;
      var i = me, u = e.suspendedLanes, d = e.pingedLanes, m = a & Kp;
      if (m !== me) {
        var S = m & ~u;
        if (S !== me)
          i = yc(S);
        else {
          var C = m & d;
          C !== me && (i = yc(C));
        }
      } else {
        var k = a & ~u;
        k !== me ? i = yc(k) : d !== me && (i = yc(d));
      }
      if (i === me)
        return me;
      if (t !== me && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === me) {
        var D = po(i), I = po(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          D >= I || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          D === On && (I & fo) !== me
        )
          return t;
      }
      (i & wi) !== me && (i |= a & On);
      var F = e.entangledLanes;
      if (F !== me)
        for (var K = e.entanglements, te = i & F; te > 0; ) {
          var le = Yn(te), Ne = 1 << le;
          i |= K[le], te &= ~Ne;
        }
      return i;
    }
    function xi(e, t) {
      for (var a = e.eventTimes, i = rn; t > 0; ) {
        var u = Yn(t), d = 1 << u, m = a[u];
        m > i && (i = m), t &= ~d;
      }
      return i;
    }
    function Jp(e, t) {
      switch (e) {
        case st:
        case co:
        case wi:
          return t + 250;
        case Nr:
        case On:
        case kl:
        case au:
        case Yf:
        case $f:
        case Wf:
        case Gf:
        case qf:
        case Qf:
        case Xf:
        case Kf:
        case iu:
        case Jf:
        case ns:
        case rs:
        case Zf:
        case dc:
        case ed:
          return t + 5e3;
        case lu:
        case td:
        case hc:
        case nd:
        case rd:
          return rn;
        case vc:
        case mc:
        case ou:
        case fa:
          return rn;
        default:
          return h("Should have found matching lanes. This is a bug in React."), rn;
      }
    }
    function ld(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, d = e.expirationTimes, m = a; m > 0; ) {
        var S = Yn(m), C = 1 << S, k = d[S];
        k === rn ? ((C & i) === me || (C & u) !== me) && (d[S] = Jp(C, t)) : k <= t && (e.expiredLanes |= C), m &= ~C;
      }
    }
    function Cm(e) {
      return yc(e.pendingLanes);
    }
    function od(e) {
      var t = e.pendingLanes & ~fa;
      return t !== me ? t : t & fa ? fa : me;
    }
    function wm(e) {
      return (e & st) !== me;
    }
    function gc(e) {
      return (e & Kp) !== me;
    }
    function su(e) {
      return (e & pc) === e;
    }
    function Zp(e) {
      var t = st | wi | On;
      return (e & t) === me;
    }
    function eh(e) {
      return (e & fo) === e;
    }
    function ud(e, t) {
      var a = co | wi | Nr | On;
      return (t & a) !== me;
    }
    function xm(e, t) {
      return (t & e.expiredLanes) !== me;
    }
    function th(e) {
      return (e & fo) !== me;
    }
    function nh() {
      var e = uu;
      return uu <<= 1, (uu & fo) === me && (uu = au), e;
    }
    function Tm() {
      var e = ad;
      return ad <<= 1, (ad & pc) === me && (ad = lu), e;
    }
    function po(e) {
      return e & -e;
    }
    function _c(e) {
      return po(e);
    }
    function Yn(e) {
      return 31 - Bn(e);
    }
    function gr(e) {
      return Yn(e);
    }
    function da(e, t) {
      return (e & t) !== me;
    }
    function cu(e, t) {
      return (e & t) === t;
    }
    function _t(e, t) {
      return e | t;
    }
    function Sc(e, t) {
      return e & ~t;
    }
    function rh(e, t) {
      return e & t;
    }
    function bm(e) {
      return e;
    }
    function Rm(e, t) {
      return e !== jt && e < t ? e : t;
    }
    function Ec(e) {
      for (var t = [], a = 0; a < ru; a++)
        t.push(e);
      return t;
    }
    function as(e, t, a) {
      e.pendingLanes |= t, t !== ou && (e.suspendedLanes = me, e.pingedLanes = me);
      var i = e.eventTimes, u = gr(t);
      i[u] = a;
    }
    function km(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Yn(i), d = 1 << u;
        a[u] = rn, i &= ~d;
      }
    }
    function sd(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function ah(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = me, e.pingedLanes = me, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, d = e.expirationTimes, m = a; m > 0; ) {
        var S = Yn(m), C = 1 << S;
        i[S] = me, u[S] = rn, d[S] = rn, m &= ~C;
      }
    }
    function cd(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var d = Yn(u), m = 1 << d;
        // Is this one of the newly entangled lanes?
        m & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[d] & t && (i[d] |= t), u &= ~m;
      }
    }
    function ih(e, t) {
      var a = po(t), i;
      switch (a) {
        case wi:
          i = co;
          break;
        case On:
          i = Nr;
          break;
        case au:
        case Yf:
        case $f:
        case Wf:
        case Gf:
        case qf:
        case Qf:
        case Xf:
        case Kf:
        case iu:
        case Jf:
        case ns:
        case rs:
        case Zf:
        case dc:
        case ed:
        case lu:
        case td:
        case hc:
        case nd:
        case rd:
          i = kl;
          break;
        case ou:
          i = mc;
          break;
        default:
          i = jt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== jt ? jt : i;
    }
    function Cc(e, t, a) {
      if (ca)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = gr(a), d = 1 << u, m = i[u];
          m.add(t), a &= ~d;
        }
    }
    function Dm(e, t) {
      if (ca)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = gr(t), d = 1 << u, m = a[u];
          m.size > 0 && (m.forEach(function(S) {
            var C = S.alternate;
            (C === null || !i.has(C)) && i.add(S);
          }), m.clear()), t &= ~d;
        }
    }
    function lh(e, t) {
      return null;
    }
    var Br = st, el = wi, Qa = On, Xa = ou, wc = jt;
    function Ka() {
      return wc;
    }
    function $n(e) {
      wc = e;
    }
    function Om(e, t) {
      var a = wc;
      try {
        return wc = e, t();
      } finally {
        wc = a;
      }
    }
    function Lm(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function xc(e, t) {
      return e > t ? e : t;
    }
    function sr(e, t) {
      return e !== 0 && e < t;
    }
    function Mm(e) {
      var t = po(e);
      return sr(Br, t) ? sr(el, t) ? gc(t) ? Qa : Xa : el : Br;
    }
    function fd(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Tc;
    function Ar(e) {
      Tc = e;
    }
    function p0(e) {
      Tc(e);
    }
    var Fe;
    function is(e) {
      Fe = e;
    }
    var dd;
    function Nm(e) {
      dd = e;
    }
    var Am;
    function bc(e) {
      Am = e;
    }
    var Rc;
    function oh(e) {
      Rc = e;
    }
    var pd = !1, kc = [], Dl = null, tl = null, nl = null, Ln = /* @__PURE__ */ new Map(), Yr = /* @__PURE__ */ new Map(), $r = [], zm = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function Um(e) {
      return zm.indexOf(e) > -1;
    }
    function Ti(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function uh(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Dl = null;
          break;
        case "dragenter":
        case "dragleave":
          tl = null;
          break;
        case "mouseover":
        case "mouseout":
          nl = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Ln.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Yr.delete(i);
          break;
        }
      }
    }
    function pa(e, t, a, i, u, d) {
      if (e === null || e.nativeEvent !== d) {
        var m = Ti(t, a, i, u, d);
        if (t !== null) {
          var S = hs(t);
          S !== null && Fe(S);
        }
        return m;
      }
      e.eventSystemFlags |= i;
      var C = e.targetContainers;
      return u !== null && C.indexOf(u) === -1 && C.push(u), e;
    }
    function h0(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var d = u;
          return Dl = pa(Dl, e, t, a, i, d), !0;
        }
        case "dragenter": {
          var m = u;
          return tl = pa(tl, e, t, a, i, m), !0;
        }
        case "mouseover": {
          var S = u;
          return nl = pa(nl, e, t, a, i, S), !0;
        }
        case "pointerover": {
          var C = u, k = C.pointerId;
          return Ln.set(k, pa(Ln.get(k) || null, e, t, a, i, C)), !0;
        }
        case "gotpointercapture": {
          var D = u, I = D.pointerId;
          return Yr.set(I, pa(Yr.get(I) || null, e, t, a, i, D)), !0;
        }
      }
      return !1;
    }
    function sh(e) {
      var t = Hc(e.target);
      if (t !== null) {
        var a = Ra(t);
        if (a !== null) {
          var i = a.tag;
          if (i === W) {
            var u = Ki(a);
            if (u !== null) {
              e.blockedOn = u, Rc(e.priority, function() {
                dd(a);
              });
              return;
            }
          } else if (i === O) {
            var d = a.stateNode;
            if (fd(d)) {
              e.blockedOn = Ji(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function jm(e) {
      for (var t = Am(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < $r.length && sr(t, $r[i].priority); i++)
        ;
      $r.splice(i, 0, a), i === 0 && sh(a);
    }
    function Dc(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = os(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, d = new u.constructor(u.type, u);
          u0(d), u.target.dispatchEvent(d), s0();
        } else {
          var m = hs(i);
          return m !== null && Fe(m), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function ch(e, t, a) {
      Dc(e) && a.delete(t);
    }
    function v0() {
      pd = !1, Dl !== null && Dc(Dl) && (Dl = null), tl !== null && Dc(tl) && (tl = null), nl !== null && Dc(nl) && (nl = null), Ln.forEach(ch), Yr.forEach(ch);
    }
    function ho(e, t) {
      e.blockedOn === t && (e.blockedOn = null, pd || (pd = !0, l.unstable_scheduleCallback(l.unstable_NormalPriority, v0)));
    }
    function fu(e) {
      if (kc.length > 0) {
        ho(kc[0], e);
        for (var t = 1; t < kc.length; t++) {
          var a = kc[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Dl !== null && ho(Dl, e), tl !== null && ho(tl, e), nl !== null && ho(nl, e);
      var i = function(S) {
        return ho(S, e);
      };
      Ln.forEach(i), Yr.forEach(i);
      for (var u = 0; u < $r.length; u++) {
        var d = $r[u];
        d.blockedOn === e && (d.blockedOn = null);
      }
      for (; $r.length > 0; ) {
        var m = $r[0];
        if (m.blockedOn !== null)
          break;
        sh(m), m.blockedOn === null && $r.shift();
      }
    }
    var _r = s.ReactCurrentBatchConfig, Lt = !0;
    function nr(e) {
      Lt = !!e;
    }
    function Wn() {
      return Lt;
    }
    function Sr(e, t, a) {
      var i = hd(t), u;
      switch (i) {
        case Br:
          u = La;
          break;
        case el:
          u = ls;
          break;
        case Qa:
        default:
          u = Mn;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function La(e, t, a, i) {
      var u = Ka(), d = _r.transition;
      _r.transition = null;
      try {
        $n(Br), Mn(e, t, a, i);
      } finally {
        $n(u), _r.transition = d;
      }
    }
    function ls(e, t, a, i) {
      var u = Ka(), d = _r.transition;
      _r.transition = null;
      try {
        $n(el), Mn(e, t, a, i);
      } finally {
        $n(u), _r.transition = d;
      }
    }
    function Mn(e, t, a, i) {
      Lt && Oc(e, t, a, i);
    }
    function Oc(e, t, a, i) {
      var u = os(e, t, a, i);
      if (u === null) {
        M0(e, t, i, rl, a), uh(e, i);
        return;
      }
      if (h0(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (uh(e, i), t & Ba && Um(e)) {
        for (; u !== null; ) {
          var d = hs(u);
          d !== null && p0(d);
          var m = os(e, t, a, i);
          if (m === null && M0(e, t, i, rl, a), m === u)
            break;
          u = m;
        }
        u !== null && i.stopPropagation();
        return;
      }
      M0(e, t, i, null, a);
    }
    var rl = null;
    function os(e, t, a, i) {
      rl = null;
      var u = Up(i), d = Hc(u);
      if (d !== null) {
        var m = Ra(d);
        if (m === null)
          d = null;
        else {
          var S = m.tag;
          if (S === W) {
            var C = Ki(m);
            if (C !== null)
              return C;
            d = null;
          } else if (S === O) {
            var k = m.stateNode;
            if (fd(k))
              return Ji(m);
            d = null;
          } else m !== d && (d = null);
        }
      }
      return rl = d, null;
    }
    function hd(e) {
      switch (e) {
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
          return Br;
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
          return el;
        case "message": {
          var t = Pf();
          switch (t) {
            case ic:
              return Br;
            case uo:
              return el;
            case bl:
            case d0:
              return Qa;
            case Jo:
              return Xa;
            default:
              return Qa;
          }
        }
        default:
          return Qa;
      }
    }
    function Lc(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ha(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function fh(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function us(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Ma = null, ss = null, du = null;
    function vo(e) {
      return Ma = e, ss = Mc(), !0;
    }
    function vd() {
      Ma = null, ss = null, du = null;
    }
    function Ol() {
      if (du)
        return du;
      var e, t = ss, a = t.length, i, u = Mc(), d = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var m = a - e;
      for (i = 1; i <= m && t[a - i] === u[d - i]; i++)
        ;
      var S = i > 1 ? 1 - i : void 0;
      return du = u.slice(e, S), du;
    }
    function Mc() {
      return "value" in Ma ? Ma.value : Ma.textContent;
    }
    function mo(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function cs() {
      return !0;
    }
    function Nc() {
      return !1;
    }
    function zr(e) {
      function t(a, i, u, d, m) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = d, this.target = m, this.currentTarget = null;
        for (var S in e)
          if (e.hasOwnProperty(S)) {
            var C = e[S];
            C ? this[S] = C(d) : this[S] = d[S];
          }
        var k = d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1;
        return k ? this.isDefaultPrevented = cs : this.isDefaultPrevented = Nc, this.isPropagationStopped = Nc, this;
      }
      return St(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = cs);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = cs);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: cs
      }), t;
    }
    var Gn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, al = zr(Gn), Wr = St({}, Gn, {
      view: 0,
      detail: 0
    }), va = zr(Wr), md, Ac, pu;
    function m0(e) {
      e !== pu && (pu && e.type === "mousemove" ? (md = e.screenX - pu.screenX, Ac = e.screenY - pu.screenY) : (md = 0, Ac = 0), pu = e);
    }
    var bi = St({}, Wr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: yn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (m0(e), md);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Ac;
      }
    }), dh = zr(bi), ph = St({}, bi, {
      dataTransfer: 0
    }), hu = zr(ph), hh = St({}, Wr, {
      relatedTarget: 0
    }), Ll = zr(hh), Pm = St({}, Gn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Fm = zr(Pm), vh = St({}, Gn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), yd = zr(vh), y0 = St({}, Gn, {
      data: 0
    }), Hm = zr(y0), Im = Hm, Vm = {
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
    }, vu = {
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
    };
    function g0(e) {
      if (e.key) {
        var t = Vm[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = mo(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? vu[e.keyCode] || "Unidentified" : "";
    }
    var fs = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Bm(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = fs[e];
      return i ? !!a[i] : !1;
    }
    function yn(e) {
      return Bm;
    }
    var _0 = St({}, Wr, {
      key: g0,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: yn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? mo(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? mo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), Ym = zr(_0), S0 = St({}, bi, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), $m = zr(S0), Wm = St({}, Wr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: yn
    }), Gm = zr(Wm), E0 = St({}, Gn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Ja = zr(E0), mh = St({}, bi, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), C0 = zr(mh), yo = [9, 13, 27, 32], zc = 229, Ml = Pn && "CompositionEvent" in window, go = null;
    Pn && "documentMode" in document && (go = document.documentMode);
    var yh = Pn && "TextEvent" in window && !go, gd = Pn && (!Ml || go && go > 8 && go <= 11), qm = 32, _d = String.fromCharCode(qm);
    function w0() {
      wt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), wt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), wt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), wt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var gh = !1;
    function Qm(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function Sd(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function Ed(e, t) {
      return e === "keydown" && t.keyCode === zc;
    }
    function _h(e, t) {
      switch (e) {
        case "keyup":
          return yo.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== zc;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Cd(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function Xm(e) {
      return e.locale === "ko";
    }
    var mu = !1;
    function Sh(e, t, a, i, u) {
      var d, m;
      if (Ml ? d = Sd(t) : mu ? _h(t, i) && (d = "onCompositionEnd") : Ed(t, i) && (d = "onCompositionStart"), !d)
        return null;
      gd && !Xm(i) && (!mu && d === "onCompositionStart" ? mu = vo(u) : d === "onCompositionEnd" && mu && (m = Ol()));
      var S = ry(a, d);
      if (S.length > 0) {
        var C = new Hm(d, t, null, i, u);
        if (e.push({
          event: C,
          listeners: S
        }), m)
          C.data = m;
        else {
          var k = Cd(i);
          k !== null && (C.data = k);
        }
      }
    }
    function wd(e, t) {
      switch (e) {
        case "compositionend":
          return Cd(t);
        case "keypress":
          var a = t.which;
          return a !== qm ? null : (gh = !0, _d);
        case "textInput":
          var i = t.data;
          return i === _d && gh ? null : i;
        default:
          return null;
      }
    }
    function Eh(e, t) {
      if (mu) {
        if (e === "compositionend" || !Ml && _h(e, t)) {
          var a = Ol();
          return vd(), mu = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Qm(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return gd && !Xm(t) ? null : t.data;
        default:
          return null;
      }
    }
    function xd(e, t, a, i, u) {
      var d;
      if (yh ? d = wd(t, i) : d = Eh(t, i), !d)
        return null;
      var m = ry(a, "onBeforeInput");
      if (m.length > 0) {
        var S = new Im("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: S,
          listeners: m
        }), S.data = d;
      }
    }
    function Km(e, t, a, i, u, d, m) {
      Sh(e, t, a, i, u), xd(e, t, a, i, u);
    }
    var x0 = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Uc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!x0[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function T0(e) {
      if (!Pn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function jc() {
      wt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function Jm(e, t, a, i) {
      qu(i);
      var u = ry(t, "onChange");
      if (u.length > 0) {
        var d = new al("onChange", "change", null, a, i);
        e.push({
          event: d,
          listeners: u
        });
      }
    }
    var _o = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function o(e) {
      var t = [];
      Jm(t, n, e, Up(e)), cm(c, t);
    }
    function c(e) {
      DC(e, 0);
    }
    function v(e) {
      var t = Od(e);
      if ($i(t))
        return e;
    }
    function _(e, t) {
      if (e === "change")
        return t;
    }
    var b = !1;
    Pn && (b = T0("input") && (!document.documentMode || document.documentMode > 9));
    function M(e, t) {
      _o = e, n = t, _o.attachEvent("onpropertychange", Z);
    }
    function j() {
      _o && (_o.detachEvent("onpropertychange", Z), _o = null, n = null);
    }
    function Z(e) {
      e.propertyName === "value" && v(n) && o(e);
    }
    function _e(e, t, a) {
      e === "focusin" ? (j(), M(t, a)) : e === "focusout" && j();
    }
    function Ce(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return v(n);
    }
    function ge(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function ze(e, t) {
      if (e === "click")
        return v(t);
    }
    function Ie(e, t) {
      if (e === "input" || e === "change")
        return v(t);
    }
    function $e(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || tt(e, "number", e.value);
    }
    function Nn(e, t, a, i, u, d, m) {
      var S = a ? Od(a) : window, C, k;
      if (r(S) ? C = _ : Uc(S) ? b ? C = Ie : (C = Ce, k = _e) : ge(S) && (C = ze), C) {
        var D = C(t, a);
        if (D) {
          Jm(e, D, i, u);
          return;
        }
      }
      k && k(t, S, a), t === "focusout" && $e(S);
    }
    function $() {
      qt("onMouseEnter", ["mouseout", "mouseover"]), qt("onMouseLeave", ["mouseout", "mouseover"]), qt("onPointerEnter", ["pointerout", "pointerover"]), qt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function H(e, t, a, i, u, d, m) {
      var S = t === "mouseover" || t === "pointerover", C = t === "mouseout" || t === "pointerout";
      if (S && !Zs(i)) {
        var k = i.relatedTarget || i.fromElement;
        if (k && (Hc(k) || zh(k)))
          return;
      }
      if (!(!C && !S)) {
        var D;
        if (u.window === u)
          D = u;
        else {
          var I = u.ownerDocument;
          I ? D = I.defaultView || I.parentWindow : D = window;
        }
        var F, K;
        if (C) {
          var te = i.relatedTarget || i.toElement;
          if (F = a, K = te ? Hc(te) : null, K !== null) {
            var le = Ra(K);
            (K !== le || K.tag !== L && K.tag !== V) && (K = null);
          }
        } else
          F = null, K = a;
        if (F !== K) {
          var Ne = dh, nt = "onMouseLeave", Xe = "onMouseEnter", Nt = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ne = $m, nt = "onPointerLeave", Xe = "onPointerEnter", Nt = "pointer");
          var kt = F == null ? D : Od(F), G = K == null ? D : Od(K), oe = new Ne(nt, Nt + "leave", F, i, u);
          oe.target = kt, oe.relatedTarget = G;
          var q = null, we = Hc(u);
          if (we === a) {
            var je = new Ne(Xe, Nt + "enter", K, i, u);
            je.target = G, je.relatedTarget = kt, q = je;
          }
          dR(e, oe, q, F, K);
        }
      }
    }
    function X(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Se = typeof Object.is == "function" ? Object.is : X;
    function Ve(e, t) {
      if (Se(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var d = a[u];
        if (!jr.call(t, d) || !Se(e[d], t[d]))
          return !1;
      }
      return !0;
    }
    function at(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ot(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function dt(e, t) {
      for (var a = at(e), i = 0, u = 0; a; ) {
        if (a.nodeType === El) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = at(ot(a));
      }
    }
    function cr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, d = i.anchorOffset, m = i.focusNode, S = i.focusOffset;
      try {
        u.nodeType, m.nodeType;
      } catch {
        return null;
      }
      return Vt(e, u, d, m, S);
    }
    function Vt(e, t, a, i, u) {
      var d = 0, m = -1, S = -1, C = 0, k = 0, D = e, I = null;
      e: for (; ; ) {
        for (var F = null; D === t && (a === 0 || D.nodeType === El) && (m = d + a), D === i && (u === 0 || D.nodeType === El) && (S = d + u), D.nodeType === El && (d += D.nodeValue.length), (F = D.firstChild) !== null; )
          I = D, D = F;
        for (; ; ) {
          if (D === e)
            break e;
          if (I === t && ++C === a && (m = d), I === i && ++k === u && (S = d), (F = D.nextSibling) !== null)
            break;
          D = I, I = D.parentNode;
        }
        D = F;
      }
      return m === -1 || S === -1 ? null : {
        start: m,
        end: S
      };
    }
    function So(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), d = e.textContent.length, m = Math.min(t.start, d), S = t.end === void 0 ? m : Math.min(t.end, d);
        if (!u.extend && m > S) {
          var C = S;
          S = m, m = C;
        }
        var k = dt(e, m), D = dt(e, S);
        if (k && D) {
          if (u.rangeCount === 1 && u.anchorNode === k.node && u.anchorOffset === k.offset && u.focusNode === D.node && u.focusOffset === D.offset)
            return;
          var I = a.createRange();
          I.setStart(k.node, k.offset), u.removeAllRanges(), m > S ? (u.addRange(I), u.extend(D.node, D.offset)) : (I.setEnd(D.node, D.offset), u.addRange(I));
        }
      }
    }
    function Zm(e) {
      return e && e.nodeType === El;
    }
    function gC(e, t) {
      return !e || !t ? !1 : e === t ? !0 : Zm(e) ? !1 : Zm(t) ? gC(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function qb(e) {
      return e && e.ownerDocument && gC(e.ownerDocument.documentElement, e);
    }
    function Qb(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function _C() {
      for (var e = window, t = Va(); t instanceof e.HTMLIFrameElement; ) {
        if (Qb(t))
          e = t.contentWindow;
        else
          return t;
        t = Va(e.document);
      }
      return t;
    }
    function b0(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Xb() {
      var e = _C();
      return {
        focusedElem: e,
        selectionRange: b0(e) ? Jb(e) : null
      };
    }
    function Kb(e) {
      var t = _C(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && qb(a)) {
        i !== null && b0(a) && Zb(a, i);
        for (var u = [], d = a; d = d.parentNode; )
          d.nodeType === ia && u.push({
            element: d,
            left: d.scrollLeft,
            top: d.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var m = 0; m < u.length; m++) {
          var S = u[m];
          S.element.scrollLeft = S.left, S.element.scrollTop = S.top;
        }
      }
    }
    function Jb(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = cr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Zb(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : So(e, t);
    }
    var eR = Pn && "documentMode" in document && document.documentMode <= 11;
    function tR() {
      wt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Td = null, R0 = null, Ch = null, k0 = !1;
    function nR(e) {
      if ("selectionStart" in e && b0(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function rR(e) {
      return e.window === e ? e.document : e.nodeType === Cl ? e : e.ownerDocument;
    }
    function SC(e, t, a) {
      var i = rR(a);
      if (!(k0 || Td == null || Td !== Va(i))) {
        var u = nR(Td);
        if (!Ch || !Ve(Ch, u)) {
          Ch = u;
          var d = ry(R0, "onSelect");
          if (d.length > 0) {
            var m = new al("onSelect", "select", null, t, a);
            e.push({
              event: m,
              listeners: d
            }), m.target = Td;
          }
        }
      }
    }
    function aR(e, t, a, i, u, d, m) {
      var S = a ? Od(a) : window;
      switch (t) {
        case "focusin":
          (Uc(S) || S.contentEditable === "true") && (Td = S, R0 = a, Ch = null);
          break;
        case "focusout":
          Td = null, R0 = null, Ch = null;
          break;
        case "mousedown":
          k0 = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          k0 = !1, SC(e, i, u);
          break;
        case "selectionchange":
          if (eR)
            break;
        case "keydown":
        case "keyup":
          SC(e, i, u);
      }
    }
    function ey(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var bd = {
      animationend: ey("Animation", "AnimationEnd"),
      animationiteration: ey("Animation", "AnimationIteration"),
      animationstart: ey("Animation", "AnimationStart"),
      transitionend: ey("Transition", "TransitionEnd")
    }, D0 = {}, EC = {};
    Pn && (EC = document.createElement("div").style, "AnimationEvent" in window || (delete bd.animationend.animation, delete bd.animationiteration.animation, delete bd.animationstart.animation), "TransitionEvent" in window || delete bd.transitionend.transition);
    function ty(e) {
      if (D0[e])
        return D0[e];
      if (!bd[e])
        return e;
      var t = bd[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in EC)
          return D0[e] = t[a];
      return e;
    }
    var CC = ty("animationend"), wC = ty("animationiteration"), xC = ty("animationstart"), TC = ty("transitionend"), bC = /* @__PURE__ */ new Map(), RC = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ds(e, t) {
      bC.set(e, t), wt(t, [e]);
    }
    function iR() {
      for (var e = 0; e < RC.length; e++) {
        var t = RC[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ds(a, "on" + i);
      }
      ds(CC, "onAnimationEnd"), ds(wC, "onAnimationIteration"), ds(xC, "onAnimationStart"), ds("dblclick", "onDoubleClick"), ds("focusin", "onFocus"), ds("focusout", "onBlur"), ds(TC, "onTransitionEnd");
    }
    function lR(e, t, a, i, u, d, m) {
      var S = bC.get(t);
      if (S !== void 0) {
        var C = al, k = t;
        switch (t) {
          case "keypress":
            if (mo(i) === 0)
              return;
          case "keydown":
          case "keyup":
            C = Ym;
            break;
          case "focusin":
            k = "focus", C = Ll;
            break;
          case "focusout":
            k = "blur", C = Ll;
            break;
          case "beforeblur":
          case "afterblur":
            C = Ll;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            C = dh;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            C = hu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            C = Gm;
            break;
          case CC:
          case wC:
          case xC:
            C = Fm;
            break;
          case TC:
            C = Ja;
            break;
          case "scroll":
            C = va;
            break;
          case "wheel":
            C = C0;
            break;
          case "copy":
          case "cut":
          case "paste":
            C = yd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            C = $m;
            break;
        }
        var D = (d & Ba) !== 0;
        {
          var I = !D && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", F = cR(a, S, i.type, D, I);
          if (F.length > 0) {
            var K = new C(S, k, null, i, u);
            e.push({
              event: K,
              listeners: F
            });
          }
        }
      }
    }
    iR(), $(), jc(), tR(), w0();
    function oR(e, t, a, i, u, d, m) {
      lR(e, t, a, i, u, d);
      var S = (d & zp) === 0;
      S && (H(e, t, a, i, u), Nn(e, t, a, i, u), aR(e, t, a, i, u), Km(e, t, a, i, u));
    }
    var wh = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], O0 = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(wh));
    function kC(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, qi(i, t, void 0, e), e.currentTarget = null;
    }
    function uR(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var d = t[u], m = d.instance, S = d.currentTarget, C = d.listener;
          if (m !== i && e.isPropagationStopped())
            return;
          kC(e, C, S), i = m;
        }
      else
        for (var k = 0; k < t.length; k++) {
          var D = t[k], I = D.instance, F = D.currentTarget, K = D.listener;
          if (I !== i && e.isPropagationStopped())
            return;
          kC(e, K, F), i = I;
        }
    }
    function DC(e, t) {
      for (var a = (t & Ba) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], d = u.event, m = u.listeners;
        uR(d, m, a);
      }
      nc();
    }
    function sR(e, t, a, i, u) {
      var d = Up(a), m = [];
      oR(m, e, i, a, d, t), DC(m, t);
    }
    function wn(e, t) {
      O0.has(e) || h('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = Fk(t), u = pR(e);
      i.has(u) || (OC(t, e, Tf, a), i.add(u));
    }
    function L0(e, t, a) {
      O0.has(e) && !t && h('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Ba), OC(a, e, i, t);
    }
    var ny = "_reactListening" + Math.random().toString(36).slice(2);
    function xh(e) {
      if (!e[ny]) {
        e[ny] = !0, it.forEach(function(a) {
          a !== "selectionchange" && (O0.has(a) || L0(a, !1, e), L0(a, !0, e));
        });
        var t = e.nodeType === Cl ? e : e.ownerDocument;
        t !== null && (t[ny] || (t[ny] = !0, L0("selectionchange", !1, t)));
      }
    }
    function OC(e, t, a, i, u) {
      var d = Sr(e, t, a), m = void 0;
      tc && (t === "touchstart" || t === "touchmove" || t === "wheel") && (m = !0), e = e, i ? m !== void 0 ? fh(e, t, d, m) : ha(e, t, d) : m !== void 0 ? us(e, t, d, m) : Lc(e, t, d);
    }
    function LC(e, t) {
      return e === t || e.nodeType === Hn && e.parentNode === t;
    }
    function M0(e, t, a, i, u) {
      var d = i;
      if (!(t & Ap) && !(t & Tf)) {
        var m = u;
        if (i !== null) {
          var S = i;
          e: for (; ; ) {
            if (S === null)
              return;
            var C = S.tag;
            if (C === O || C === A) {
              var k = S.stateNode.containerInfo;
              if (LC(k, m))
                break;
              if (C === A)
                for (var D = S.return; D !== null; ) {
                  var I = D.tag;
                  if (I === O || I === A) {
                    var F = D.stateNode.containerInfo;
                    if (LC(F, m))
                      return;
                  }
                  D = D.return;
                }
              for (; k !== null; ) {
                var K = Hc(k);
                if (K === null)
                  return;
                var te = K.tag;
                if (te === L || te === V) {
                  S = d = K;
                  continue e;
                }
                k = k.parentNode;
              }
            }
            S = S.return;
          }
        }
      }
      cm(function() {
        return sR(e, t, a, d);
      });
    }
    function Th(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function cR(e, t, a, i, u, d) {
      for (var m = t !== null ? t + "Capture" : null, S = i ? m : t, C = [], k = e, D = null; k !== null; ) {
        var I = k, F = I.stateNode, K = I.tag;
        if (K === L && F !== null && (D = F, S !== null)) {
          var te = no(k, S);
          te != null && C.push(Th(k, te, D));
        }
        if (u)
          break;
        k = k.return;
      }
      return C;
    }
    function ry(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var d = u, m = d.stateNode, S = d.tag;
        if (S === L && m !== null) {
          var C = m, k = no(u, a);
          k != null && i.unshift(Th(u, k, C));
          var D = no(u, t);
          D != null && i.push(Th(u, D, C));
        }
        u = u.return;
      }
      return i;
    }
    function Rd(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== L);
      return e || null;
    }
    function fR(e, t) {
      for (var a = e, i = t, u = 0, d = a; d; d = Rd(d))
        u++;
      for (var m = 0, S = i; S; S = Rd(S))
        m++;
      for (; u - m > 0; )
        a = Rd(a), u--;
      for (; m - u > 0; )
        i = Rd(i), m--;
      for (var C = u; C--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Rd(a), i = Rd(i);
      }
      return null;
    }
    function MC(e, t, a, i, u) {
      for (var d = t._reactName, m = [], S = a; S !== null && S !== i; ) {
        var C = S, k = C.alternate, D = C.stateNode, I = C.tag;
        if (k !== null && k === i)
          break;
        if (I === L && D !== null) {
          var F = D;
          if (u) {
            var K = no(S, d);
            K != null && m.unshift(Th(S, K, F));
          } else if (!u) {
            var te = no(S, d);
            te != null && m.push(Th(S, te, F));
          }
        }
        S = S.return;
      }
      m.length !== 0 && e.push({
        event: t,
        listeners: m
      });
    }
    function dR(e, t, a, i, u) {
      var d = i && u ? fR(i, u) : null;
      i !== null && MC(e, t, i, d, !1), u !== null && a !== null && MC(e, a, u, d, !0);
    }
    function pR(e, t) {
      return e + "__bubble";
    }
    var Za = !1, bh = "dangerouslySetInnerHTML", ay = "suppressContentEditableWarning", ps = "suppressHydrationWarning", NC = "autoFocus", Pc = "children", Fc = "style", iy = "__html", N0, ly, Rh, AC, oy, zC, UC;
    N0 = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, ly = function(e, t) {
      Lp(e, t), wf(e, t), om(e, t, {
        registrationNameDependencies: rt,
        possibleRegistrationNames: ct
      });
    }, zC = Pn && !document.documentMode, Rh = function(e, t, a) {
      if (!Za) {
        var i = uy(a), u = uy(t);
        u !== i && (Za = !0, h("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, AC = function(e) {
      if (!Za) {
        Za = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), h("Extra attributes from the server: %s", t);
      }
    }, oy = function(e, t) {
      t === !1 ? h("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : h("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, UC = function(e, t) {
      var a = e.namespaceURI === Sl ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var hR = /\r\n?/g, vR = /\u0000|\uFFFD/g;
    function uy(e) {
      ir(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(hR, `
`).replace(vR, "");
    }
    function sy(e, t, a, i) {
      var u = uy(t), d = uy(e);
      if (d !== u && (i && (Za || (Za = !0, h('Text content did not match. Server: "%s" Client: "%s"', d, u))), a && ce))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function jC(e) {
      return e.nodeType === Cl ? e : e.ownerDocument;
    }
    function mR() {
    }
    function cy(e) {
      e.onclick = mR;
    }
    function yR(e, t, a, i, u) {
      for (var d in i)
        if (i.hasOwnProperty(d)) {
          var m = i[d];
          if (d === Fc)
            m && Object.freeze(m), tm(t, m);
          else if (d === bh) {
            var S = m ? m[iy] : void 0;
            S != null && Bv(t, S);
          } else if (d === Pc)
            if (typeof m == "string") {
              var C = e !== "textarea" || m !== "";
              C && Yu(t, m);
            } else typeof m == "number" && Yu(t, "" + m);
          else d === ay || d === ps || d === NC || (rt.hasOwnProperty(d) ? m != null && (typeof m != "function" && oy(d, m), d === "onScroll" && wn("scroll", t)) : m != null && Pr(t, d, m, u));
        }
    }
    function gR(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var d = t[u], m = t[u + 1];
        d === Fc ? tm(e, m) : d === bh ? Bv(e, m) : d === Pc ? Yu(e, m) : Pr(e, d, m, i);
      }
    }
    function _R(e, t, a, i) {
      var u, d = jC(a), m, S = i;
      if (S === Sl && (S = xp(e)), S === Sl) {
        if (u = eo(e, t), !u && e !== e.toLowerCase() && h("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var C = d.createElement("div");
          C.innerHTML = "<script><\/script>";
          var k = C.firstChild;
          m = C.removeChild(k);
        } else if (typeof t.is == "string")
          m = d.createElement(e, {
            is: t.is
          });
        else if (m = d.createElement(e), e === "select") {
          var D = m;
          t.multiple ? D.multiple = !0 : t.size && (D.size = t.size);
        }
      } else
        m = d.createElementNS(S, e);
      return S === Sl && !u && Object.prototype.toString.call(m) === "[object HTMLUnknownElement]" && !jr.call(N0, e) && (N0[e] = !0, h("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), m;
    }
    function SR(e, t) {
      return jC(t).createTextNode(e);
    }
    function ER(e, t, a, i) {
      var u = eo(t, a);
      ly(t, a);
      var d;
      switch (t) {
        case "dialog":
          wn("cancel", e), wn("close", e), d = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          wn("load", e), d = a;
          break;
        case "video":
        case "audio":
          for (var m = 0; m < wh.length; m++)
            wn(wh[m], e);
          d = a;
          break;
        case "source":
          wn("error", e), d = a;
          break;
        case "img":
        case "image":
        case "link":
          wn("error", e), wn("load", e), d = a;
          break;
        case "details":
          wn("toggle", e), d = a;
          break;
        case "input":
          Si(e, a), d = Bu(e, a), wn("invalid", e);
          break;
        case "option":
          zt(e, a), d = a;
          break;
        case "select":
          Yo(e, a), d = Ws(e, a), wn("invalid", e);
          break;
        case "textarea":
          Ep(e, a), d = Sp(e, a), wn("invalid", e);
          break;
        default:
          d = a;
      }
      switch (Ef(t, d), yR(t, e, i, d, u), t) {
        case "input":
          _i(e), J(e, a, !1);
          break;
        case "textarea":
          _i(e), Iv(e);
          break;
        case "option":
          un(e, a);
          break;
        case "select":
          gp(e, a);
          break;
        default:
          typeof d.onClick == "function" && cy(e);
          break;
      }
    }
    function CR(e, t, a, i, u) {
      ly(t, i);
      var d = null, m, S;
      switch (t) {
        case "input":
          m = Bu(e, a), S = Bu(e, i), d = [];
          break;
        case "select":
          m = Ws(e, a), S = Ws(e, i), d = [];
          break;
        case "textarea":
          m = Sp(e, a), S = Sp(e, i), d = [];
          break;
        default:
          m = a, S = i, typeof m.onClick != "function" && typeof S.onClick == "function" && cy(e);
          break;
      }
      Ef(t, S);
      var C, k, D = null;
      for (C in m)
        if (!(S.hasOwnProperty(C) || !m.hasOwnProperty(C) || m[C] == null))
          if (C === Fc) {
            var I = m[C];
            for (k in I)
              I.hasOwnProperty(k) && (D || (D = {}), D[k] = "");
          } else C === bh || C === Pc || C === ay || C === ps || C === NC || (rt.hasOwnProperty(C) ? d || (d = []) : (d = d || []).push(C, null));
      for (C in S) {
        var F = S[C], K = m != null ? m[C] : void 0;
        if (!(!S.hasOwnProperty(C) || F === K || F == null && K == null))
          if (C === Fc)
            if (F && Object.freeze(F), K) {
              for (k in K)
                K.hasOwnProperty(k) && (!F || !F.hasOwnProperty(k)) && (D || (D = {}), D[k] = "");
              for (k in F)
                F.hasOwnProperty(k) && K[k] !== F[k] && (D || (D = {}), D[k] = F[k]);
            } else
              D || (d || (d = []), d.push(C, D)), D = F;
          else if (C === bh) {
            var te = F ? F[iy] : void 0, le = K ? K[iy] : void 0;
            te != null && le !== te && (d = d || []).push(C, te);
          } else C === Pc ? (typeof F == "string" || typeof F == "number") && (d = d || []).push(C, "" + F) : C === ay || C === ps || (rt.hasOwnProperty(C) ? (F != null && (typeof F != "function" && oy(C, F), C === "onScroll" && wn("scroll", e)), !d && K !== F && (d = [])) : (d = d || []).push(C, F));
      }
      return D && (l0(D, S[Fc]), (d = d || []).push(Fc, D)), d;
    }
    function wR(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && w(e, u);
      var d = eo(a, i), m = eo(a, u);
      switch (gR(e, t, d, m), a) {
        case "input":
          z(e, u);
          break;
        case "textarea":
          Hv(e, u);
          break;
        case "select":
          gf(e, u);
          break;
      }
    }
    function xR(e) {
      {
        var t = e.toLowerCase();
        return Ks.hasOwnProperty(t) && Ks[t] || null;
      }
    }
    function TR(e, t, a, i, u, d, m) {
      var S, C;
      switch (S = eo(t, a), ly(t, a), t) {
        case "dialog":
          wn("cancel", e), wn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          wn("load", e);
          break;
        case "video":
        case "audio":
          for (var k = 0; k < wh.length; k++)
            wn(wh[k], e);
          break;
        case "source":
          wn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          wn("error", e), wn("load", e);
          break;
        case "details":
          wn("toggle", e);
          break;
        case "input":
          Si(e, a), wn("invalid", e);
          break;
        case "option":
          zt(e, a);
          break;
        case "select":
          Yo(e, a), wn("invalid", e);
          break;
        case "textarea":
          Ep(e, a), wn("invalid", e);
          break;
      }
      Ef(t, a);
      {
        C = /* @__PURE__ */ new Set();
        for (var D = e.attributes, I = 0; I < D.length; I++) {
          var F = D[I].name.toLowerCase();
          switch (F) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              C.add(D[I].name);
          }
        }
      }
      var K = null;
      for (var te in a)
        if (a.hasOwnProperty(te)) {
          var le = a[te];
          if (te === Pc)
            typeof le == "string" ? e.textContent !== le && (a[ps] !== !0 && sy(e.textContent, le, d, m), K = [Pc, le]) : typeof le == "number" && e.textContent !== "" + le && (a[ps] !== !0 && sy(e.textContent, le, d, m), K = [Pc, "" + le]);
          else if (rt.hasOwnProperty(te))
            le != null && (typeof le != "function" && oy(te, le), te === "onScroll" && wn("scroll", e));
          else if (m && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof S == "boolean") {
            var Ne = void 0, nt = ln(te);
            if (a[ps] !== !0) {
              if (!(te === ay || te === ps || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              te === "value" || te === "checked" || te === "selected")) {
                if (te === bh) {
                  var Xe = e.innerHTML, Nt = le ? le[iy] : void 0;
                  if (Nt != null) {
                    var kt = UC(e, Nt);
                    kt !== Xe && Rh(te, Xe, kt);
                  }
                } else if (te === Fc) {
                  if (C.delete(te), zC) {
                    var G = a0(le);
                    Ne = e.getAttribute("style"), G !== Ne && Rh(te, Ne, G);
                  }
                } else if (S && !P)
                  C.delete(te.toLowerCase()), Ne = jo(e, te, le), le !== Ne && Rh(te, Ne, le);
                else if (!gn(te, nt, S) && !lr(te, le, nt, S)) {
                  var oe = !1;
                  if (nt !== null)
                    C.delete(nt.attributeName), Ne = $l(e, te, le, nt);
                  else {
                    var q = i;
                    if (q === Sl && (q = xp(t)), q === Sl)
                      C.delete(te.toLowerCase());
                    else {
                      var we = xR(te);
                      we !== null && we !== te && (oe = !0, C.delete(we)), C.delete(te);
                    }
                    Ne = jo(e, te, le);
                  }
                  var je = P;
                  !je && le !== Ne && !oe && Rh(te, Ne, le);
                }
              }
            }
          }
        }
      switch (m && // $FlowFixMe - Should be inferred as not undefined.
      C.size > 0 && a[ps] !== !0 && AC(C), t) {
        case "input":
          _i(e), J(e, a, !0);
          break;
        case "textarea":
          _i(e), Iv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && cy(e);
          break;
      }
      return K;
    }
    function bR(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function A0(e, t) {
      {
        if (Za)
          return;
        Za = !0, h("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function z0(e, t) {
      {
        if (Za)
          return;
        Za = !0, h('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function U0(e, t, a) {
      {
        if (Za)
          return;
        Za = !0, h("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function j0(e, t) {
      {
        if (t === "" || Za)
          return;
        Za = !0, h('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function RR(e, t, a) {
      switch (t) {
        case "input":
          ae(e, a);
          return;
        case "textarea":
          e0(e, a);
          return;
        case "select":
          _p(e, a);
          return;
      }
    }
    var kh = function() {
    }, Dh = function() {
    };
    {
      var kR = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], PC = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], DR = PC.concat(["button"]), OR = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], FC = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      Dh = function(e, t) {
        var a = St({}, e || FC), i = {
          tag: t
        };
        return PC.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), DR.indexOf(t) !== -1 && (a.pTagInButtonScope = null), kR.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var LR = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return OR.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, MR = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, HC = {};
      kh = function(e, t, a) {
        a = a || FC;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && h("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var d = LR(e, u) ? null : i, m = d ? null : MR(e, a), S = d || m;
        if (S) {
          var C = S.tag, k = !!d + "|" + e + "|" + C;
          if (!HC[k]) {
            HC[k] = !0;
            var D = e, I = "";
            if (e === "#text" ? /\S/.test(t) ? D = "Text nodes" : (D = "Whitespace text nodes", I = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : D = "<" + e + ">", d) {
              var F = "";
              C === "table" && e === "tr" && (F += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), h("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", D, C, I, F);
            } else
              h("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", D, C);
          }
        }
      };
    }
    var fy = "suppressHydrationWarning", dy = "$", py = "/$", Oh = "$?", Lh = "$!", NR = "style", P0 = null, F0 = null;
    function AR(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Cl:
        case bp: {
          t = i === Cl ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : Tp(null, "");
          break;
        }
        default: {
          var d = i === Hn ? e.parentNode : e, m = d.namespaceURI || null;
          t = d.tagName, a = Tp(m, t);
          break;
        }
      }
      {
        var S = t.toLowerCase(), C = Dh(null, S);
        return {
          namespace: a,
          ancestorInfo: C
        };
      }
    }
    function zR(e, t, a) {
      {
        var i = e, u = Tp(i.namespace, t), d = Dh(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: d
        };
      }
    }
    function w2(e) {
      return e;
    }
    function UR(e) {
      P0 = Wn(), F0 = Xb();
      var t = null;
      return nr(!1), t;
    }
    function jR(e) {
      Kb(F0), nr(P0), P0 = null, F0 = null;
    }
    function PR(e, t, a, i, u) {
      var d;
      {
        var m = i;
        if (kh(e, null, m.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var S = "" + t.children, C = Dh(m.ancestorInfo, e);
          kh(null, S, C);
        }
        d = m.namespace;
      }
      var k = _R(e, t, a, d);
      return Ah(u, k), G0(k, t), k;
    }
    function FR(e, t) {
      e.appendChild(t);
    }
    function HR(e, t, a, i, u) {
      switch (ER(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function IR(e, t, a, i, u, d) {
      {
        var m = d;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var S = "" + i.children, C = Dh(m.ancestorInfo, t);
          kh(null, S, C);
        }
      }
      return CR(e, t, a, i);
    }
    function H0(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function VR(e, t, a, i) {
      {
        var u = a;
        kh(null, e, u.ancestorInfo);
      }
      var d = SR(e, t);
      return Ah(i, d), d;
    }
    function BR() {
      var e = window.event;
      return e === void 0 ? Qa : hd(e.type);
    }
    var I0 = typeof setTimeout == "function" ? setTimeout : void 0, YR = typeof clearTimeout == "function" ? clearTimeout : void 0, V0 = -1, IC = typeof Promise == "function" ? Promise : void 0, $R = typeof queueMicrotask == "function" ? queueMicrotask : typeof IC < "u" ? function(e) {
      return IC.resolve(null).then(e).catch(WR);
    } : I0;
    function WR(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function GR(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function qR(e, t, a, i, u, d) {
      wR(e, t, a, i, u), G0(e, u);
    }
    function VC(e) {
      Yu(e, "");
    }
    function QR(e, t, a) {
      e.nodeValue = a;
    }
    function XR(e, t) {
      e.appendChild(t);
    }
    function KR(e, t) {
      var a;
      e.nodeType === Hn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && cy(a);
    }
    function JR(e, t, a) {
      e.insertBefore(t, a);
    }
    function ZR(e, t, a) {
      e.nodeType === Hn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function ek(e, t) {
      e.removeChild(t);
    }
    function tk(e, t) {
      e.nodeType === Hn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function B0(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Hn) {
          var d = u.data;
          if (d === py)
            if (i === 0) {
              e.removeChild(u), fu(t);
              return;
            } else
              i--;
          else (d === dy || d === Oh || d === Lh) && i++;
        }
        a = u;
      } while (a);
      fu(t);
    }
    function nk(e, t) {
      e.nodeType === Hn ? B0(e.parentNode, t) : e.nodeType === ia && B0(e, t), fu(e);
    }
    function rk(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function ak(e) {
      e.nodeValue = "";
    }
    function ik(e, t) {
      e = e;
      var a = t[NR], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = Sf("display", i);
    }
    function lk(e, t) {
      e.nodeValue = t;
    }
    function ok(e) {
      e.nodeType === ia ? e.textContent = "" : e.nodeType === Cl && e.documentElement && e.removeChild(e.documentElement);
    }
    function uk(e, t, a) {
      return e.nodeType !== ia || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function sk(e, t) {
      return t === "" || e.nodeType !== El ? null : e;
    }
    function ck(e) {
      return e.nodeType !== Hn ? null : e;
    }
    function BC(e) {
      return e.data === Oh;
    }
    function Y0(e) {
      return e.data === Lh;
    }
    function fk(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function dk(e, t) {
      e._reactRetry = t;
    }
    function hy(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === ia || t === El)
          break;
        if (t === Hn) {
          var a = e.data;
          if (a === dy || a === Lh || a === Oh)
            break;
          if (a === py)
            return null;
        }
      }
      return e;
    }
    function Mh(e) {
      return hy(e.nextSibling);
    }
    function pk(e) {
      return hy(e.firstChild);
    }
    function hk(e) {
      return hy(e.firstChild);
    }
    function vk(e) {
      return hy(e.nextSibling);
    }
    function mk(e, t, a, i, u, d, m) {
      Ah(d, e), G0(e, a);
      var S;
      {
        var C = u;
        S = C.namespace;
      }
      var k = (d.mode & Tt) !== et;
      return TR(e, t, a, S, i, k, m);
    }
    function yk(e, t, a, i) {
      return Ah(a, e), a.mode & Tt, bR(e, t);
    }
    function gk(e, t) {
      Ah(t, e);
    }
    function _k(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Hn) {
          var i = t.data;
          if (i === py) {
            if (a === 0)
              return Mh(t);
            a--;
          } else (i === dy || i === Lh || i === Oh) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function YC(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Hn) {
          var i = t.data;
          if (i === dy || i === Lh || i === Oh) {
            if (a === 0)
              return t;
            a--;
          } else i === py && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Sk(e) {
      fu(e);
    }
    function Ek(e) {
      fu(e);
    }
    function Ck(e) {
      return e !== "head" && e !== "body";
    }
    function wk(e, t, a, i) {
      var u = !0;
      sy(t.nodeValue, a, i, u);
    }
    function xk(e, t, a, i, u, d) {
      if (t[fy] !== !0) {
        var m = !0;
        sy(i.nodeValue, u, d, m);
      }
    }
    function Tk(e, t) {
      t.nodeType === ia ? A0(e, t) : t.nodeType === Hn || z0(e, t);
    }
    function bk(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === ia ? A0(a, t) : t.nodeType === Hn || z0(a, t));
      }
    }
    function Rk(e, t, a, i, u) {
      (u || t[fy] !== !0) && (i.nodeType === ia ? A0(a, i) : i.nodeType === Hn || z0(a, i));
    }
    function kk(e, t, a) {
      U0(e, t);
    }
    function Dk(e, t) {
      j0(e, t);
    }
    function Ok(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && U0(i, t);
      }
    }
    function Lk(e, t) {
      {
        var a = e.parentNode;
        a !== null && j0(a, t);
      }
    }
    function Mk(e, t, a, i, u, d) {
      (d || t[fy] !== !0) && U0(a, i);
    }
    function Nk(e, t, a, i, u) {
      (u || t[fy] !== !0) && j0(a, i);
    }
    function Ak(e) {
      h("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function zk(e) {
      xh(e);
    }
    var kd = Math.random().toString(36).slice(2), Dd = "__reactFiber$" + kd, $0 = "__reactProps$" + kd, Nh = "__reactContainer$" + kd, W0 = "__reactEvents$" + kd, Uk = "__reactListeners$" + kd, jk = "__reactHandles$" + kd;
    function Pk(e) {
      delete e[Dd], delete e[$0], delete e[W0], delete e[Uk], delete e[jk];
    }
    function Ah(e, t) {
      t[Dd] = e;
    }
    function vy(e, t) {
      t[Nh] = e;
    }
    function $C(e) {
      e[Nh] = null;
    }
    function zh(e) {
      return !!e[Nh];
    }
    function Hc(e) {
      var t = e[Dd];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Nh] || a[Dd], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = YC(e); u !== null; ) {
              var d = u[Dd];
              if (d)
                return d;
              u = YC(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function hs(e) {
      var t = e[Dd] || e[Nh];
      return t && (t.tag === L || t.tag === V || t.tag === W || t.tag === O) ? t : null;
    }
    function Od(e) {
      if (e.tag === L || e.tag === V)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function my(e) {
      return e[$0] || null;
    }
    function G0(e, t) {
      e[$0] = t;
    }
    function Fk(e) {
      var t = e[W0];
      return t === void 0 && (t = e[W0] = /* @__PURE__ */ new Set()), t;
    }
    var WC = {}, GC = s.ReactDebugCurrentFrame;
    function yy(e) {
      if (e) {
        var t = e._owner, a = yl(e.type, e._source, t ? t.type : null);
        GC.setExtraStackFrame(a);
      } else
        GC.setExtraStackFrame(null);
    }
    function Nl(e, t, a, i, u) {
      {
        var d = Function.call.bind(jr);
        for (var m in e)
          if (d(e, m)) {
            var S = void 0;
            try {
              if (typeof e[m] != "function") {
                var C = Error((i || "React class") + ": " + a + " type `" + m + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[m] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw C.name = "Invariant Violation", C;
              }
              S = e[m](t, m, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (k) {
              S = k;
            }
            S && !(S instanceof Error) && (yy(u), h("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, m, typeof S), yy(null)), S instanceof Error && !(S.message in WC) && (WC[S.message] = !0, yy(u), h("Failed %s type: %s", a, S.message), yy(null));
          }
      }
    }
    var q0 = [], gy;
    gy = [];
    var yu = -1;
    function vs(e) {
      return {
        current: e
      };
    }
    function ma(e, t) {
      if (yu < 0) {
        h("Unexpected pop.");
        return;
      }
      t !== gy[yu] && h("Unexpected Fiber popped."), e.current = q0[yu], q0[yu] = null, gy[yu] = null, yu--;
    }
    function ya(e, t, a) {
      yu++, q0[yu] = e.current, gy[yu] = a, e.current = t;
    }
    var Q0;
    Q0 = {};
    var Ri = {};
    Object.freeze(Ri);
    var gu = vs(Ri), Eo = vs(!1), X0 = Ri;
    function Ld(e, t, a) {
      return a && Co(t) ? X0 : gu.current;
    }
    function qC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Md(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return Ri;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var d = {};
        for (var m in i)
          d[m] = t[m];
        {
          var S = pt(e) || "Unknown";
          Nl(i, d, "context", S);
        }
        return u && qC(e, t, d), d;
      }
    }
    function _y() {
      return Eo.current;
    }
    function Co(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Sy(e) {
      ma(Eo, e), ma(gu, e);
    }
    function K0(e) {
      ma(Eo, e), ma(gu, e);
    }
    function QC(e, t, a) {
      {
        if (gu.current !== Ri)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ya(gu, t, e), ya(Eo, a, e);
      }
    }
    function XC(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var d = pt(e) || "Unknown";
            Q0[d] || (Q0[d] = !0, h("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", d, d));
          }
          return a;
        }
        var m = i.getChildContext();
        for (var S in m)
          if (!(S in u))
            throw new Error((pt(e) || "Unknown") + '.getChildContext(): key "' + S + '" is not defined in childContextTypes.');
        {
          var C = pt(e) || "Unknown";
          Nl(u, m, "child context", C);
        }
        return St({}, a, m);
      }
    }
    function Ey(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || Ri;
        return X0 = gu.current, ya(gu, a, e), ya(Eo, Eo.current, e), !0;
      }
    }
    function KC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = XC(e, t, X0);
          i.__reactInternalMemoizedMergedChildContext = u, ma(Eo, e), ma(gu, e), ya(gu, u, e), ya(Eo, a, e);
        } else
          ma(Eo, e), ya(Eo, a, e);
      }
    }
    function Hk(e) {
      {
        if (!Ko(e) || e.tag !== T)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case O:
              return t.stateNode.context;
            case T: {
              var a = t.type;
              if (Co(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var ms = 0, Cy = 1, _u = null, J0 = !1, Z0 = !1;
    function JC(e) {
      _u === null ? _u = [e] : _u.push(e);
    }
    function Ik(e) {
      J0 = !0, JC(e);
    }
    function ZC() {
      J0 && ys();
    }
    function ys() {
      if (!Z0 && _u !== null) {
        Z0 = !0;
        var e = 0, t = Ka();
        try {
          var a = !0, i = _u;
          for ($n(Br); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          _u = null, J0 = !1;
        } catch (d) {
          throw _u !== null && (_u = _u.slice(e + 1)), Pp(ic, ys), d;
        } finally {
          $n(t), Z0 = !1;
        }
      }
      return null;
    }
    var Nd = [], Ad = 0, wy = null, xy = 0, il = [], ll = 0, Ic = null, Su = 1, Eu = "";
    function Vk(e) {
      return Bc(), (e.flags & Qi) !== Ze;
    }
    function Bk(e) {
      return Bc(), xy;
    }
    function Yk() {
      var e = Eu, t = Su, a = t & ~$k(t);
      return a.toString(32) + e;
    }
    function Vc(e, t) {
      Bc(), Nd[Ad++] = xy, Nd[Ad++] = wy, wy = e, xy = t;
    }
    function e1(e, t, a) {
      Bc(), il[ll++] = Su, il[ll++] = Eu, il[ll++] = Ic, Ic = e;
      var i = Su, u = Eu, d = Ty(i) - 1, m = i & ~(1 << d), S = a + 1, C = Ty(t) + d;
      if (C > 30) {
        var k = d - d % 5, D = (1 << k) - 1, I = (m & D).toString(32), F = m >> k, K = d - k, te = Ty(t) + K, le = S << K, Ne = le | F, nt = I + u;
        Su = 1 << te | Ne, Eu = nt;
      } else {
        var Xe = S << d, Nt = Xe | m, kt = u;
        Su = 1 << C | Nt, Eu = kt;
      }
    }
    function e_(e) {
      Bc();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Vc(e, a), e1(e, a, i);
      }
    }
    function Ty(e) {
      return 32 - Bn(e);
    }
    function $k(e) {
      return 1 << Ty(e) - 1;
    }
    function t_(e) {
      for (; e === wy; )
        wy = Nd[--Ad], Nd[Ad] = null, xy = Nd[--Ad], Nd[Ad] = null;
      for (; e === Ic; )
        Ic = il[--ll], il[ll] = null, Eu = il[--ll], il[ll] = null, Su = il[--ll], il[ll] = null;
    }
    function Wk() {
      return Bc(), Ic !== null ? {
        id: Su,
        overflow: Eu
      } : null;
    }
    function Gk(e, t) {
      Bc(), il[ll++] = Su, il[ll++] = Eu, il[ll++] = Ic, Su = t.id, Eu = t.overflow, Ic = e;
    }
    function Bc() {
      qr() || h("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Gr = null, ol = null, Al = !1, Yc = !1, gs = null;
    function qk() {
      Al && h("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function t1() {
      Yc = !0;
    }
    function Qk() {
      return Yc;
    }
    function Xk(e) {
      var t = e.stateNode.containerInfo;
      return ol = hk(t), Gr = e, Al = !0, gs = null, Yc = !1, !0;
    }
    function Kk(e, t, a) {
      return ol = vk(t), Gr = e, Al = !0, gs = null, Yc = !1, a !== null && Gk(e, a), !0;
    }
    function n1(e, t) {
      switch (e.tag) {
        case O: {
          Tk(e.stateNode.containerInfo, t);
          break;
        }
        case L: {
          var a = (e.mode & Tt) !== et;
          Rk(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case W: {
          var i = e.memoizedState;
          i.dehydrated !== null && bk(i.dehydrated, t);
          break;
        }
      }
    }
    function r1(e, t) {
      n1(e, t);
      var a = tM();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Ya) : i.push(a);
    }
    function n_(e, t) {
      {
        if (Yc)
          return;
        switch (e.tag) {
          case O: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case L:
                var i = t.type;
                t.pendingProps, kk(a, i);
                break;
              case V:
                var u = t.pendingProps;
                Dk(a, u);
                break;
            }
            break;
          }
          case L: {
            var d = e.type, m = e.memoizedProps, S = e.stateNode;
            switch (t.tag) {
              case L: {
                var C = t.type, k = t.pendingProps, D = (e.mode & Tt) !== et;
                Mk(
                  d,
                  m,
                  S,
                  C,
                  k,
                  // TODO: Delete this argument when we remove the legacy root API.
                  D
                );
                break;
              }
              case V: {
                var I = t.pendingProps, F = (e.mode & Tt) !== et;
                Nk(
                  d,
                  m,
                  S,
                  I,
                  // TODO: Delete this argument when we remove the legacy root API.
                  F
                );
                break;
              }
            }
            break;
          }
          case W: {
            var K = e.memoizedState, te = K.dehydrated;
            if (te !== null) switch (t.tag) {
              case L:
                var le = t.type;
                t.pendingProps, Ok(te, le);
                break;
              case V:
                var Ne = t.pendingProps;
                Lk(te, Ne);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function a1(e, t) {
      t.flags = t.flags & ~oa | Sn, n_(e, t);
    }
    function i1(e, t) {
      switch (e.tag) {
        case L: {
          var a = e.type;
          e.pendingProps;
          var i = uk(t, a);
          return i !== null ? (e.stateNode = i, Gr = e, ol = pk(i), !0) : !1;
        }
        case V: {
          var u = e.pendingProps, d = sk(t, u);
          return d !== null ? (e.stateNode = d, Gr = e, ol = null, !0) : !1;
        }
        case W: {
          var m = ck(t);
          if (m !== null) {
            var S = {
              dehydrated: m,
              treeContext: Wk(),
              retryLane: fa
            };
            e.memoizedState = S;
            var C = nM(m);
            return C.return = e, e.child = C, Gr = e, ol = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function r_(e) {
      return (e.mode & Tt) !== et && (e.flags & Je) === Ze;
    }
    function a_(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function i_(e) {
      if (Al) {
        var t = ol;
        if (!t) {
          r_(e) && (n_(Gr, e), a_()), a1(Gr, e), Al = !1, Gr = e;
          return;
        }
        var a = t;
        if (!i1(e, t)) {
          r_(e) && (n_(Gr, e), a_()), t = Mh(a);
          var i = Gr;
          if (!t || !i1(e, t)) {
            a1(Gr, e), Al = !1, Gr = e;
            return;
          }
          r1(i, a);
        }
      }
    }
    function Jk(e, t, a) {
      var i = e.stateNode, u = !Yc, d = mk(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = d, d !== null;
    }
    function Zk(e) {
      var t = e.stateNode, a = e.memoizedProps, i = yk(t, a, e);
      if (i) {
        var u = Gr;
        if (u !== null)
          switch (u.tag) {
            case O: {
              var d = u.stateNode.containerInfo, m = (u.mode & Tt) !== et;
              wk(
                d,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                m
              );
              break;
            }
            case L: {
              var S = u.type, C = u.memoizedProps, k = u.stateNode, D = (u.mode & Tt) !== et;
              xk(
                S,
                C,
                k,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                D
              );
              break;
            }
          }
      }
      return i;
    }
    function eD(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      gk(a, e);
    }
    function tD(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return _k(a);
    }
    function l1(e) {
      for (var t = e.return; t !== null && t.tag !== L && t.tag !== O && t.tag !== W; )
        t = t.return;
      Gr = t;
    }
    function by(e) {
      if (e !== Gr)
        return !1;
      if (!Al)
        return l1(e), Al = !0, !1;
      if (e.tag !== O && (e.tag !== L || Ck(e.type) && !H0(e.type, e.memoizedProps))) {
        var t = ol;
        if (t)
          if (r_(e))
            o1(e), a_();
          else
            for (; t; )
              r1(e, t), t = Mh(t);
      }
      return l1(e), e.tag === W ? ol = tD(e) : ol = Gr ? Mh(e.stateNode) : null, !0;
    }
    function nD() {
      return Al && ol !== null;
    }
    function o1(e) {
      for (var t = ol; t; )
        n1(e, t), t = Mh(t);
    }
    function zd() {
      Gr = null, ol = null, Al = !1, Yc = !1;
    }
    function u1() {
      gs !== null && (tx(gs), gs = null);
    }
    function qr() {
      return Al;
    }
    function l_(e) {
      gs === null ? gs = [e] : gs.push(e);
    }
    var rD = s.ReactCurrentBatchConfig, aD = null;
    function iD() {
      return rD.transition;
    }
    var zl = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var lD = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & en && (t = a), a = a.return;
        return t;
      }, $c = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, Uh = [], jh = [], Ph = [], Fh = [], Hh = [], Ih = [], Wc = /* @__PURE__ */ new Set();
      zl.recordUnsafeLifecycleWarnings = function(e, t) {
        Wc.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && Uh.push(e), e.mode & en && typeof t.UNSAFE_componentWillMount == "function" && jh.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Ph.push(e), e.mode & en && typeof t.UNSAFE_componentWillReceiveProps == "function" && Fh.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Hh.push(e), e.mode & en && typeof t.UNSAFE_componentWillUpdate == "function" && Ih.push(e));
      }, zl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        Uh.length > 0 && (Uh.forEach(function(F) {
          e.add(pt(F) || "Component"), Wc.add(F.type);
        }), Uh = []);
        var t = /* @__PURE__ */ new Set();
        jh.length > 0 && (jh.forEach(function(F) {
          t.add(pt(F) || "Component"), Wc.add(F.type);
        }), jh = []);
        var a = /* @__PURE__ */ new Set();
        Ph.length > 0 && (Ph.forEach(function(F) {
          a.add(pt(F) || "Component"), Wc.add(F.type);
        }), Ph = []);
        var i = /* @__PURE__ */ new Set();
        Fh.length > 0 && (Fh.forEach(function(F) {
          i.add(pt(F) || "Component"), Wc.add(F.type);
        }), Fh = []);
        var u = /* @__PURE__ */ new Set();
        Hh.length > 0 && (Hh.forEach(function(F) {
          u.add(pt(F) || "Component"), Wc.add(F.type);
        }), Hh = []);
        var d = /* @__PURE__ */ new Set();
        if (Ih.length > 0 && (Ih.forEach(function(F) {
          d.add(pt(F) || "Component"), Wc.add(F.type);
        }), Ih = []), t.size > 0) {
          var m = $c(t);
          h(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, m);
        }
        if (i.size > 0) {
          var S = $c(i);
          h(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, S);
        }
        if (d.size > 0) {
          var C = $c(d);
          h(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, C);
        }
        if (e.size > 0) {
          var k = $c(e);
          y(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, k);
        }
        if (a.size > 0) {
          var D = $c(a);
          y(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, D);
        }
        if (u.size > 0) {
          var I = $c(u);
          y(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, I);
        }
      };
      var Ry = /* @__PURE__ */ new Map(), s1 = /* @__PURE__ */ new Set();
      zl.recordLegacyContextWarning = function(e, t) {
        var a = lD(e);
        if (a === null) {
          h("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!s1.has(e.type)) {
          var i = Ry.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Ry.set(a, i)), i.push(e));
        }
      }, zl.flushLegacyContextWarning = function() {
        Ry.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(d) {
              i.add(pt(d) || "Component"), s1.add(d.type);
            });
            var u = $c(i);
            try {
              Kt(a), h(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              dn();
            }
          }
        });
      }, zl.discardPendingWarnings = function() {
        Uh = [], jh = [], Ph = [], Fh = [], Hh = [], Ih = [], Ry = /* @__PURE__ */ new Map();
      };
    }
    var o_, u_, s_, c_, f_, c1 = function(e, t) {
    };
    o_ = !1, u_ = !1, s_ = {}, c_ = {}, f_ = {}, c1 = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = pt(t) || "Component";
        c_[a] || (c_[a] = !0, h('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function oD(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Vh(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & en || re) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== T) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !oD(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = pt(e) || "Component";
          s_[u] || (h('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), s_[u] = !0);
        }
        if (a._owner) {
          var d = a._owner, m;
          if (d) {
            var S = d;
            if (S.tag !== T)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            m = S.stateNode;
          }
          if (!m)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var C = m;
          ji(i, "ref");
          var k = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === k)
            return t.ref;
          var D = function(I) {
            var F = C.refs;
            I === null ? delete F[k] : F[k] = I;
          };
          return D._stringRef = k, D;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function ky(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Dy(e) {
      {
        var t = pt(e) || "Component";
        if (f_[t])
          return;
        f_[t] = !0, h("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function f1(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function d1(e) {
      function t(G, oe) {
        if (e) {
          var q = G.deletions;
          q === null ? (G.deletions = [oe], G.flags |= Ya) : q.push(oe);
        }
      }
      function a(G, oe) {
        if (!e)
          return null;
        for (var q = oe; q !== null; )
          t(G, q), q = q.sibling;
        return null;
      }
      function i(G, oe) {
        for (var q = /* @__PURE__ */ new Map(), we = oe; we !== null; )
          we.key !== null ? q.set(we.key, we) : q.set(we.index, we), we = we.sibling;
        return q;
      }
      function u(G, oe) {
        var q = tf(G, oe);
        return q.index = 0, q.sibling = null, q;
      }
      function d(G, oe, q) {
        if (G.index = q, !e)
          return G.flags |= Qi, oe;
        var we = G.alternate;
        if (we !== null) {
          var je = we.index;
          return je < oe ? (G.flags |= Sn, oe) : je;
        } else
          return G.flags |= Sn, oe;
      }
      function m(G) {
        return e && G.alternate === null && (G.flags |= Sn), G;
      }
      function S(G, oe, q, we) {
        if (oe === null || oe.tag !== V) {
          var je = lE(q, G.mode, we);
          return je.return = G, je;
        } else {
          var Ae = u(oe, q);
          return Ae.return = G, Ae;
        }
      }
      function C(G, oe, q, we) {
        var je = q.type;
        if (je === Fi)
          return D(G, oe, q.props.children, we, q.key);
        if (oe !== null && (oe.elementType === je || // Keep this check inline so it only runs on the false path:
        yx(oe, q) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof je == "object" && je !== null && je.$$typeof === ht && f1(je) === oe.type)) {
          var Ae = u(oe, q.props);
          return Ae.ref = Vh(G, oe, q), Ae.return = G, Ae._debugSource = q._source, Ae._debugOwner = q._owner, Ae;
        }
        var ft = iE(q, G.mode, we);
        return ft.ref = Vh(G, oe, q), ft.return = G, ft;
      }
      function k(G, oe, q, we) {
        if (oe === null || oe.tag !== A || oe.stateNode.containerInfo !== q.containerInfo || oe.stateNode.implementation !== q.implementation) {
          var je = oE(q, G.mode, we);
          return je.return = G, je;
        } else {
          var Ae = u(oe, q.children || []);
          return Ae.return = G, Ae;
        }
      }
      function D(G, oe, q, we, je) {
        if (oe === null || oe.tag !== N) {
          var Ae = Ds(q, G.mode, we, je);
          return Ae.return = G, Ae;
        } else {
          var ft = u(oe, q);
          return ft.return = G, ft;
        }
      }
      function I(G, oe, q) {
        if (typeof oe == "string" && oe !== "" || typeof oe == "number") {
          var we = lE("" + oe, G.mode, q);
          return we.return = G, we;
        }
        if (typeof oe == "object" && oe !== null) {
          switch (oe.$$typeof) {
            case Fr: {
              var je = iE(oe, G.mode, q);
              return je.ref = Vh(G, null, oe), je.return = G, je;
            }
            case hr: {
              var Ae = oE(oe, G.mode, q);
              return Ae.return = G, Ae;
            }
            case ht: {
              var ft = oe._payload, mt = oe._init;
              return I(G, mt(ft), q);
            }
          }
          if (Ct(oe) || gt(oe)) {
            var nn = Ds(oe, G.mode, q, null);
            return nn.return = G, nn;
          }
          ky(G, oe);
        }
        return typeof oe == "function" && Dy(G), null;
      }
      function F(G, oe, q, we) {
        var je = oe !== null ? oe.key : null;
        if (typeof q == "string" && q !== "" || typeof q == "number")
          return je !== null ? null : S(G, oe, "" + q, we);
        if (typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case Fr:
              return q.key === je ? C(G, oe, q, we) : null;
            case hr:
              return q.key === je ? k(G, oe, q, we) : null;
            case ht: {
              var Ae = q._payload, ft = q._init;
              return F(G, oe, ft(Ae), we);
            }
          }
          if (Ct(q) || gt(q))
            return je !== null ? null : D(G, oe, q, we, null);
          ky(G, q);
        }
        return typeof q == "function" && Dy(G), null;
      }
      function K(G, oe, q, we, je) {
        if (typeof we == "string" && we !== "" || typeof we == "number") {
          var Ae = G.get(q) || null;
          return S(oe, Ae, "" + we, je);
        }
        if (typeof we == "object" && we !== null) {
          switch (we.$$typeof) {
            case Fr: {
              var ft = G.get(we.key === null ? q : we.key) || null;
              return C(oe, ft, we, je);
            }
            case hr: {
              var mt = G.get(we.key === null ? q : we.key) || null;
              return k(oe, mt, we, je);
            }
            case ht:
              var nn = we._payload, Bt = we._init;
              return K(G, oe, q, Bt(nn), je);
          }
          if (Ct(we) || gt(we)) {
            var rr = G.get(q) || null;
            return D(oe, rr, we, je, null);
          }
          ky(oe, we);
        }
        return typeof we == "function" && Dy(oe), null;
      }
      function te(G, oe, q) {
        {
          if (typeof G != "object" || G === null)
            return oe;
          switch (G.$$typeof) {
            case Fr:
            case hr:
              c1(G, q);
              var we = G.key;
              if (typeof we != "string")
                break;
              if (oe === null) {
                oe = /* @__PURE__ */ new Set(), oe.add(we);
                break;
              }
              if (!oe.has(we)) {
                oe.add(we);
                break;
              }
              h("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", we);
              break;
            case ht:
              var je = G._payload, Ae = G._init;
              te(Ae(je), oe, q);
              break;
          }
        }
        return oe;
      }
      function le(G, oe, q, we) {
        for (var je = null, Ae = 0; Ae < q.length; Ae++) {
          var ft = q[Ae];
          je = te(ft, je, G);
        }
        for (var mt = null, nn = null, Bt = oe, rr = 0, Yt = 0, qn = null; Bt !== null && Yt < q.length; Yt++) {
          Bt.index > Yt ? (qn = Bt, Bt = null) : qn = Bt.sibling;
          var _a = F(G, Bt, q[Yt], we);
          if (_a === null) {
            Bt === null && (Bt = qn);
            break;
          }
          e && Bt && _a.alternate === null && t(G, Bt), rr = d(_a, rr, Yt), nn === null ? mt = _a : nn.sibling = _a, nn = _a, Bt = qn;
        }
        if (Yt === q.length) {
          if (a(G, Bt), qr()) {
            var ta = Yt;
            Vc(G, ta);
          }
          return mt;
        }
        if (Bt === null) {
          for (; Yt < q.length; Yt++) {
            var Di = I(G, q[Yt], we);
            Di !== null && (rr = d(Di, rr, Yt), nn === null ? mt = Di : nn.sibling = Di, nn = Di);
          }
          if (qr()) {
            var Ua = Yt;
            Vc(G, Ua);
          }
          return mt;
        }
        for (var ja = i(G, Bt); Yt < q.length; Yt++) {
          var Sa = K(ja, G, Yt, q[Yt], we);
          Sa !== null && (e && Sa.alternate !== null && ja.delete(Sa.key === null ? Yt : Sa.key), rr = d(Sa, rr, Yt), nn === null ? mt = Sa : nn.sibling = Sa, nn = Sa);
        }
        if (e && ja.forEach(function(ep) {
          return t(G, ep);
        }), qr()) {
          var ku = Yt;
          Vc(G, ku);
        }
        return mt;
      }
      function Ne(G, oe, q, we) {
        var je = gt(q);
        if (typeof je != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          q[Symbol.toStringTag] === "Generator" && (u_ || h("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), u_ = !0), q.entries === je && (o_ || h("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), o_ = !0);
          var Ae = je.call(q);
          if (Ae)
            for (var ft = null, mt = Ae.next(); !mt.done; mt = Ae.next()) {
              var nn = mt.value;
              ft = te(nn, ft, G);
            }
        }
        var Bt = je.call(q);
        if (Bt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var rr = null, Yt = null, qn = oe, _a = 0, ta = 0, Di = null, Ua = Bt.next(); qn !== null && !Ua.done; ta++, Ua = Bt.next()) {
          qn.index > ta ? (Di = qn, qn = null) : Di = qn.sibling;
          var ja = F(G, qn, Ua.value, we);
          if (ja === null) {
            qn === null && (qn = Di);
            break;
          }
          e && qn && ja.alternate === null && t(G, qn), _a = d(ja, _a, ta), Yt === null ? rr = ja : Yt.sibling = ja, Yt = ja, qn = Di;
        }
        if (Ua.done) {
          if (a(G, qn), qr()) {
            var Sa = ta;
            Vc(G, Sa);
          }
          return rr;
        }
        if (qn === null) {
          for (; !Ua.done; ta++, Ua = Bt.next()) {
            var ku = I(G, Ua.value, we);
            ku !== null && (_a = d(ku, _a, ta), Yt === null ? rr = ku : Yt.sibling = ku, Yt = ku);
          }
          if (qr()) {
            var ep = ta;
            Vc(G, ep);
          }
          return rr;
        }
        for (var Sv = i(G, qn); !Ua.done; ta++, Ua = Bt.next()) {
          var Oo = K(Sv, G, ta, Ua.value, we);
          Oo !== null && (e && Oo.alternate !== null && Sv.delete(Oo.key === null ? ta : Oo.key), _a = d(Oo, _a, ta), Yt === null ? rr = Oo : Yt.sibling = Oo, Yt = Oo);
        }
        if (e && Sv.forEach(function(NM) {
          return t(G, NM);
        }), qr()) {
          var MM = ta;
          Vc(G, MM);
        }
        return rr;
      }
      function nt(G, oe, q, we) {
        if (oe !== null && oe.tag === V) {
          a(G, oe.sibling);
          var je = u(oe, q);
          return je.return = G, je;
        }
        a(G, oe);
        var Ae = lE(q, G.mode, we);
        return Ae.return = G, Ae;
      }
      function Xe(G, oe, q, we) {
        for (var je = q.key, Ae = oe; Ae !== null; ) {
          if (Ae.key === je) {
            var ft = q.type;
            if (ft === Fi) {
              if (Ae.tag === N) {
                a(G, Ae.sibling);
                var mt = u(Ae, q.props.children);
                return mt.return = G, mt._debugSource = q._source, mt._debugOwner = q._owner, mt;
              }
            } else if (Ae.elementType === ft || // Keep this check inline so it only runs on the false path:
            yx(Ae, q) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ft == "object" && ft !== null && ft.$$typeof === ht && f1(ft) === Ae.type) {
              a(G, Ae.sibling);
              var nn = u(Ae, q.props);
              return nn.ref = Vh(G, Ae, q), nn.return = G, nn._debugSource = q._source, nn._debugOwner = q._owner, nn;
            }
            a(G, Ae);
            break;
          } else
            t(G, Ae);
          Ae = Ae.sibling;
        }
        if (q.type === Fi) {
          var Bt = Ds(q.props.children, G.mode, we, q.key);
          return Bt.return = G, Bt;
        } else {
          var rr = iE(q, G.mode, we);
          return rr.ref = Vh(G, oe, q), rr.return = G, rr;
        }
      }
      function Nt(G, oe, q, we) {
        for (var je = q.key, Ae = oe; Ae !== null; ) {
          if (Ae.key === je)
            if (Ae.tag === A && Ae.stateNode.containerInfo === q.containerInfo && Ae.stateNode.implementation === q.implementation) {
              a(G, Ae.sibling);
              var ft = u(Ae, q.children || []);
              return ft.return = G, ft;
            } else {
              a(G, Ae);
              break;
            }
          else
            t(G, Ae);
          Ae = Ae.sibling;
        }
        var mt = oE(q, G.mode, we);
        return mt.return = G, mt;
      }
      function kt(G, oe, q, we) {
        var je = typeof q == "object" && q !== null && q.type === Fi && q.key === null;
        if (je && (q = q.props.children), typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case Fr:
              return m(Xe(G, oe, q, we));
            case hr:
              return m(Nt(G, oe, q, we));
            case ht:
              var Ae = q._payload, ft = q._init;
              return kt(G, oe, ft(Ae), we);
          }
          if (Ct(q))
            return le(G, oe, q, we);
          if (gt(q))
            return Ne(G, oe, q, we);
          ky(G, q);
        }
        return typeof q == "string" && q !== "" || typeof q == "number" ? m(nt(G, oe, "" + q, we)) : (typeof q == "function" && Dy(G), a(G, oe));
      }
      return kt;
    }
    var Ud = d1(!0), p1 = d1(!1);
    function uD(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = tf(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = tf(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function sD(e, t) {
      for (var a = e.child; a !== null; )
        XL(a, t), a = a.sibling;
    }
    var d_ = vs(null), p_;
    p_ = {};
    var Oy = null, jd = null, h_ = null, Ly = !1;
    function My() {
      Oy = null, jd = null, h_ = null, Ly = !1;
    }
    function h1() {
      Ly = !0;
    }
    function v1() {
      Ly = !1;
    }
    function m1(e, t, a) {
      ya(d_, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== p_ && h("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = p_;
    }
    function v_(e, t) {
      var a = d_.current;
      ma(d_, t), e._currentValue = a;
    }
    function m_(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (cu(i.childLanes, t) ? u !== null && !cu(u.childLanes, t) && (u.childLanes = _t(u.childLanes, t)) : (i.childLanes = _t(i.childLanes, t), u !== null && (u.childLanes = _t(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && h("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function cD(e, t, a) {
      fD(e, t, a);
    }
    function fD(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, d = i.dependencies;
        if (d !== null) {
          u = i.child;
          for (var m = d.firstContext; m !== null; ) {
            if (m.context === t) {
              if (i.tag === T) {
                var S = _c(a), C = Cu(rn, S);
                C.tag = Ay;
                var k = i.updateQueue;
                if (k !== null) {
                  var D = k.shared, I = D.pending;
                  I === null ? C.next = C : (C.next = I.next, I.next = C), D.pending = C;
                }
              }
              i.lanes = _t(i.lanes, a);
              var F = i.alternate;
              F !== null && (F.lanes = _t(F.lanes, a)), m_(i.return, a, e), d.lanes = _t(d.lanes, a);
              break;
            }
            m = m.next;
          }
        } else if (i.tag === ee)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Ye) {
          var K = i.return;
          if (K === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          K.lanes = _t(K.lanes, a);
          var te = K.alternate;
          te !== null && (te.lanes = _t(te.lanes, a)), m_(K, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var le = u.sibling;
            if (le !== null) {
              le.return = u.return, u = le;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Pd(e, t) {
      Oy = e, jd = null, h_ = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (da(a.lanes, t) && rv(), a.firstContext = null);
      }
    }
    function fr(e) {
      Ly && h("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (h_ !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (jd === null) {
          if (Oy === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          jd = a, Oy.dependencies = {
            lanes: me,
            firstContext: a
          };
        } else
          jd = jd.next = a;
      }
      return t;
    }
    var Gc = null;
    function y_(e) {
      Gc === null ? Gc = [e] : Gc.push(e);
    }
    function dD() {
      if (Gc !== null) {
        for (var e = 0; e < Gc.length; e++) {
          var t = Gc[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var d = u.next;
              u.next = i, a.next = d;
            }
            t.pending = a;
          }
        }
        Gc = null;
      }
    }
    function y1(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, y_(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Ny(e, i);
    }
    function pD(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, y_(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function hD(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, y_(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Ny(e, i);
    }
    function ei(e, t) {
      return Ny(e, t);
    }
    var vD = Ny;
    function Ny(e, t) {
      e.lanes = _t(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = _t(a.lanes, t)), a === null && (e.flags & (Sn | oa)) !== Ze && px(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = _t(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = _t(a.childLanes, t) : (u.flags & (Sn | oa)) !== Ze && px(e), i = u, u = u.return;
      if (i.tag === O) {
        var d = i.stateNode;
        return d;
      } else
        return null;
    }
    var g1 = 0, _1 = 1, Ay = 2, g_ = 3, zy = !1, __, Uy;
    __ = !1, Uy = null;
    function S_(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: me
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function S1(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Cu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: g1,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function _s(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (Uy === u && !__ && (h("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), __ = !0), pL()) {
        var d = u.pending;
        return d === null ? t.next = t : (t.next = d.next, d.next = t), u.pending = t, vD(e, a);
      } else
        return hD(e, u, t, a);
    }
    function jy(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (th(a)) {
          var d = u.lanes;
          d = rh(d, e.pendingLanes);
          var m = _t(d, a);
          u.lanes = m, cd(e, m);
        }
      }
    }
    function E_(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var d = null, m = null, S = a.firstBaseUpdate;
          if (S !== null) {
            var C = S;
            do {
              var k = {
                eventTime: C.eventTime,
                lane: C.lane,
                tag: C.tag,
                payload: C.payload,
                callback: C.callback,
                next: null
              };
              m === null ? d = m = k : (m.next = k, m = k), C = C.next;
            } while (C !== null);
            m === null ? d = m = t : (m.next = t, m = t);
          } else
            d = m = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: d,
            lastBaseUpdate: m,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var D = a.lastBaseUpdate;
      D === null ? a.firstBaseUpdate = t : D.next = t, a.lastBaseUpdate = t;
    }
    function mD(e, t, a, i, u, d) {
      switch (a.tag) {
        case _1: {
          var m = a.payload;
          if (typeof m == "function") {
            h1();
            var S = m.call(d, i, u);
            {
              if (e.mode & en) {
                En(!0);
                try {
                  m.call(d, i, u);
                } finally {
                  En(!1);
                }
              }
              v1();
            }
            return S;
          }
          return m;
        }
        case g_:
          e.flags = e.flags & ~or | Je;
        case g1: {
          var C = a.payload, k;
          if (typeof C == "function") {
            h1(), k = C.call(d, i, u);
            {
              if (e.mode & en) {
                En(!0);
                try {
                  C.call(d, i, u);
                } finally {
                  En(!1);
                }
              }
              v1();
            }
          } else
            k = C;
          return k == null ? i : St({}, i, k);
        }
        case Ay:
          return zy = !0, i;
      }
      return i;
    }
    function Py(e, t, a, i) {
      var u = e.updateQueue;
      zy = !1, Uy = u.shared;
      var d = u.firstBaseUpdate, m = u.lastBaseUpdate, S = u.shared.pending;
      if (S !== null) {
        u.shared.pending = null;
        var C = S, k = C.next;
        C.next = null, m === null ? d = k : m.next = k, m = C;
        var D = e.alternate;
        if (D !== null) {
          var I = D.updateQueue, F = I.lastBaseUpdate;
          F !== m && (F === null ? I.firstBaseUpdate = k : F.next = k, I.lastBaseUpdate = C);
        }
      }
      if (d !== null) {
        var K = u.baseState, te = me, le = null, Ne = null, nt = null, Xe = d;
        do {
          var Nt = Xe.lane, kt = Xe.eventTime;
          if (cu(i, Nt)) {
            if (nt !== null) {
              var oe = {
                eventTime: kt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: jt,
                tag: Xe.tag,
                payload: Xe.payload,
                callback: Xe.callback,
                next: null
              };
              nt = nt.next = oe;
            }
            K = mD(e, u, Xe, K, t, a);
            var q = Xe.callback;
            if (q !== null && // If the update was already committed, we should not queue its
            // callback again.
            Xe.lane !== jt) {
              e.flags |= sn;
              var we = u.effects;
              we === null ? u.effects = [Xe] : we.push(Xe);
            }
          } else {
            var G = {
              eventTime: kt,
              lane: Nt,
              tag: Xe.tag,
              payload: Xe.payload,
              callback: Xe.callback,
              next: null
            };
            nt === null ? (Ne = nt = G, le = K) : nt = nt.next = G, te = _t(te, Nt);
          }
          if (Xe = Xe.next, Xe === null) {
            if (S = u.shared.pending, S === null)
              break;
            var je = S, Ae = je.next;
            je.next = null, Xe = Ae, u.lastBaseUpdate = je, u.shared.pending = null;
          }
        } while (!0);
        nt === null && (le = K), u.baseState = le, u.firstBaseUpdate = Ne, u.lastBaseUpdate = nt;
        var ft = u.shared.interleaved;
        if (ft !== null) {
          var mt = ft;
          do
            te = _t(te, mt.lane), mt = mt.next;
          while (mt !== ft);
        } else d === null && (u.shared.lanes = me);
        vv(te), e.lanes = te, e.memoizedState = K;
      }
      Uy = null;
    }
    function yD(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function E1() {
      zy = !1;
    }
    function Fy() {
      return zy;
    }
    function C1(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var d = i[u], m = d.callback;
          m !== null && (d.callback = null, yD(m, a));
        }
    }
    var Bh = {}, Ss = vs(Bh), Yh = vs(Bh), Hy = vs(Bh);
    function Iy(e) {
      if (e === Bh)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function w1() {
      var e = Iy(Hy.current);
      return e;
    }
    function C_(e, t) {
      ya(Hy, t, e), ya(Yh, e, e), ya(Ss, Bh, e);
      var a = AR(t);
      ma(Ss, e), ya(Ss, a, e);
    }
    function Fd(e) {
      ma(Ss, e), ma(Yh, e), ma(Hy, e);
    }
    function w_() {
      var e = Iy(Ss.current);
      return e;
    }
    function x1(e) {
      Iy(Hy.current);
      var t = Iy(Ss.current), a = zR(t, e.type);
      t !== a && (ya(Yh, e, e), ya(Ss, a, e));
    }
    function x_(e) {
      Yh.current === e && (ma(Ss, e), ma(Yh, e));
    }
    var gD = 0, T1 = 1, b1 = 1, $h = 2, Ul = vs(gD);
    function T_(e, t) {
      return (e & t) !== 0;
    }
    function Hd(e) {
      return e & T1;
    }
    function b_(e, t) {
      return e & T1 | t;
    }
    function _D(e, t) {
      return e | t;
    }
    function Es(e, t) {
      ya(Ul, t, e);
    }
    function Id(e) {
      ma(Ul, e);
    }
    function SD(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function Vy(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === W) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || BC(i) || Y0(i))
              return t;
          }
        } else if (t.tag === Ke && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Je) !== Ze;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var ti = (
      /*   */
      0
    ), Er = (
      /* */
      1
    ), wo = (
      /*  */
      2
    ), Cr = (
      /*    */
      4
    ), Qr = (
      /*   */
      8
    ), R_ = [];
    function k_() {
      for (var e = 0; e < R_.length; e++) {
        var t = R_[e];
        t._workInProgressVersionPrimary = null;
      }
      R_.length = 0;
    }
    function ED(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Ue = s.ReactCurrentDispatcher, Wh = s.ReactCurrentBatchConfig, D_, Vd;
    D_ = /* @__PURE__ */ new Set();
    var qc = me, tn = null, wr = null, xr = null, By = !1, Gh = !1, qh = 0, CD = 0, wD = 25, pe = null, ul = null, Cs = -1, O_ = !1;
    function Gt() {
      {
        var e = pe;
        ul === null ? ul = [e] : ul.push(e);
      }
    }
    function De() {
      {
        var e = pe;
        ul !== null && (Cs++, ul[Cs] !== e && xD(e));
      }
    }
    function Bd(e) {
      e != null && !Ct(e) && h("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", pe, typeof e);
    }
    function xD(e) {
      {
        var t = pt(tn);
        if (!D_.has(t) && (D_.add(t), ul !== null)) {
          for (var a = "", i = 30, u = 0; u <= Cs; u++) {
            for (var d = ul[u], m = u === Cs ? e : d, S = u + 1 + ". " + d; S.length < i; )
              S += " ";
            S += m + `
`, a += S;
          }
          h(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function ga() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function L_(e, t) {
      if (O_)
        return !1;
      if (t === null)
        return h("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", pe), !1;
      e.length !== t.length && h(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, pe, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Se(e[a], t[a]))
          return !1;
      return !0;
    }
    function Yd(e, t, a, i, u, d) {
      qc = d, tn = t, ul = e !== null ? e._debugHookTypes : null, Cs = -1, O_ = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = me, e !== null && e.memoizedState !== null ? Ue.current = q1 : ul !== null ? Ue.current = G1 : Ue.current = W1;
      var m = a(i, u);
      if (Gh) {
        var S = 0;
        do {
          if (Gh = !1, qh = 0, S >= wD)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          S += 1, O_ = !1, wr = null, xr = null, t.updateQueue = null, Cs = -1, Ue.current = Q1, m = a(i, u);
        } while (Gh);
      }
      Ue.current = ng, t._debugHookTypes = ul;
      var C = wr !== null && wr.next !== null;
      if (qc = me, tn = null, wr = null, xr = null, pe = null, ul = null, Cs = -1, e !== null && (e.flags & Vn) !== (t.flags & Vn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Tt) !== et && h("Internal React error: Expected static flag was missing. Please notify the React team."), By = !1, C)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return m;
    }
    function $d() {
      var e = qh !== 0;
      return qh = 0, e;
    }
    function R1(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & It) !== et ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Sc(e.lanes, a);
    }
    function k1() {
      if (Ue.current = ng, By) {
        for (var e = tn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        By = !1;
      }
      qc = me, tn = null, wr = null, xr = null, ul = null, Cs = -1, pe = null, I1 = !1, Gh = !1, qh = 0;
    }
    function xo() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return xr === null ? tn.memoizedState = xr = e : xr = xr.next = e, xr;
    }
    function sl() {
      var e;
      if (wr === null) {
        var t = tn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = wr.next;
      var a;
      if (xr === null ? a = tn.memoizedState : a = xr.next, a !== null)
        xr = a, a = xr.next, wr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        wr = e;
        var i = {
          memoizedState: wr.memoizedState,
          baseState: wr.baseState,
          baseQueue: wr.baseQueue,
          queue: wr.queue,
          next: null
        };
        xr === null ? tn.memoizedState = xr = i : xr = xr.next = i;
      }
      return xr;
    }
    function D1() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function M_(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function N_(e, t, a) {
      var i = xo(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var d = {
        pending: null,
        interleaved: null,
        lanes: me,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = d;
      var m = d.dispatch = kD.bind(null, tn, d);
      return [i.memoizedState, m];
    }
    function A_(e, t, a) {
      var i = sl(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var d = wr, m = d.baseQueue, S = u.pending;
      if (S !== null) {
        if (m !== null) {
          var C = m.next, k = S.next;
          m.next = k, S.next = C;
        }
        d.baseQueue !== m && h("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), d.baseQueue = m = S, u.pending = null;
      }
      if (m !== null) {
        var D = m.next, I = d.baseState, F = null, K = null, te = null, le = D;
        do {
          var Ne = le.lane;
          if (cu(qc, Ne)) {
            if (te !== null) {
              var Xe = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: jt,
                action: le.action,
                hasEagerState: le.hasEagerState,
                eagerState: le.eagerState,
                next: null
              };
              te = te.next = Xe;
            }
            if (le.hasEagerState)
              I = le.eagerState;
            else {
              var Nt = le.action;
              I = e(I, Nt);
            }
          } else {
            var nt = {
              lane: Ne,
              action: le.action,
              hasEagerState: le.hasEagerState,
              eagerState: le.eagerState,
              next: null
            };
            te === null ? (K = te = nt, F = I) : te = te.next = nt, tn.lanes = _t(tn.lanes, Ne), vv(Ne);
          }
          le = le.next;
        } while (le !== null && le !== D);
        te === null ? F = I : te.next = K, Se(I, i.memoizedState) || rv(), i.memoizedState = I, i.baseState = F, i.baseQueue = te, u.lastRenderedState = I;
      }
      var kt = u.interleaved;
      if (kt !== null) {
        var G = kt;
        do {
          var oe = G.lane;
          tn.lanes = _t(tn.lanes, oe), vv(oe), G = G.next;
        } while (G !== kt);
      } else m === null && (u.lanes = me);
      var q = u.dispatch;
      return [i.memoizedState, q];
    }
    function z_(e, t, a) {
      var i = sl(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var d = u.dispatch, m = u.pending, S = i.memoizedState;
      if (m !== null) {
        u.pending = null;
        var C = m.next, k = C;
        do {
          var D = k.action;
          S = e(S, D), k = k.next;
        } while (k !== C);
        Se(S, i.memoizedState) || rv(), i.memoizedState = S, i.baseQueue === null && (i.baseState = S), u.lastRenderedState = S;
      }
      return [S, d];
    }
    function x2(e, t, a) {
    }
    function T2(e, t, a) {
    }
    function U_(e, t, a) {
      var i = tn, u = xo(), d, m = qr();
      if (m) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        d = a(), Vd || d !== a() && (h("The result of getServerSnapshot should be cached to avoid an infinite loop"), Vd = !0);
      } else {
        if (d = t(), !Vd) {
          var S = t();
          Se(d, S) || (h("The result of getSnapshot should be cached to avoid an infinite loop"), Vd = !0);
        }
        var C = Eg();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        ud(C, qc) || O1(i, t, d);
      }
      u.memoizedState = d;
      var k = {
        value: d,
        getSnapshot: t
      };
      return u.queue = k, qy(M1.bind(null, i, k, e), [e]), i.flags |= la, Qh(Er | Qr, L1.bind(null, i, k, d, t), void 0, null), d;
    }
    function Yy(e, t, a) {
      var i = tn, u = sl(), d = t();
      if (!Vd) {
        var m = t();
        Se(d, m) || (h("The result of getSnapshot should be cached to avoid an infinite loop"), Vd = !0);
      }
      var S = u.memoizedState, C = !Se(S, d);
      C && (u.memoizedState = d, rv());
      var k = u.queue;
      if (Kh(M1.bind(null, i, k, e), [e]), k.getSnapshot !== t || C || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      xr !== null && xr.memoizedState.tag & Er) {
        i.flags |= la, Qh(Er | Qr, L1.bind(null, i, k, d, t), void 0, null);
        var D = Eg();
        if (D === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        ud(D, qc) || O1(i, t, d);
      }
      return d;
    }
    function O1(e, t, a) {
      e.flags |= Zu;
      var i = {
        getSnapshot: t,
        value: a
      }, u = tn.updateQueue;
      if (u === null)
        u = D1(), tn.updateQueue = u, u.stores = [i];
      else {
        var d = u.stores;
        d === null ? u.stores = [i] : d.push(i);
      }
    }
    function L1(e, t, a, i) {
      t.value = a, t.getSnapshot = i, N1(t) && A1(e);
    }
    function M1(e, t, a) {
      var i = function() {
        N1(t) && A1(e);
      };
      return a(i);
    }
    function N1(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Se(a, i);
      } catch {
        return !0;
      }
    }
    function A1(e) {
      var t = ei(e, st);
      t !== null && kr(t, e, st, rn);
    }
    function $y(e) {
      var t = xo();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: me,
        dispatch: null,
        lastRenderedReducer: M_,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = DD.bind(null, tn, a);
      return [t.memoizedState, i];
    }
    function j_(e) {
      return A_(M_);
    }
    function P_(e) {
      return z_(M_);
    }
    function Qh(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, d = tn.updateQueue;
      if (d === null)
        d = D1(), tn.updateQueue = d, d.lastEffect = u.next = u;
      else {
        var m = d.lastEffect;
        if (m === null)
          d.lastEffect = u.next = u;
        else {
          var S = m.next;
          m.next = u, u.next = S, d.lastEffect = u;
        }
      }
      return u;
    }
    function F_(e) {
      var t = xo();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function Wy(e) {
      var t = sl();
      return t.memoizedState;
    }
    function Xh(e, t, a, i) {
      var u = xo(), d = i === void 0 ? null : i;
      tn.flags |= e, u.memoizedState = Qh(Er | t, a, void 0, d);
    }
    function Gy(e, t, a, i) {
      var u = sl(), d = i === void 0 ? null : i, m = void 0;
      if (wr !== null) {
        var S = wr.memoizedState;
        if (m = S.destroy, d !== null) {
          var C = S.deps;
          if (L_(d, C)) {
            u.memoizedState = Qh(t, a, m, d);
            return;
          }
        }
      }
      tn.flags |= e, u.memoizedState = Qh(Er | t, a, m, d);
    }
    function qy(e, t) {
      return (tn.mode & It) !== et ? Xh(Xi | la | zf, Qr, e, t) : Xh(la | zf, Qr, e, t);
    }
    function Kh(e, t) {
      return Gy(la, Qr, e, t);
    }
    function H_(e, t) {
      return Xh(Ot, wo, e, t);
    }
    function Qy(e, t) {
      return Gy(Ot, wo, e, t);
    }
    function I_(e, t) {
      var a = Ot;
      return a |= xl, (tn.mode & It) !== et && (a |= ao), Xh(a, Cr, e, t);
    }
    function Xy(e, t) {
      return Gy(Ot, Cr, e, t);
    }
    function z1(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || h("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var d = e();
        return u.current = d, function() {
          u.current = null;
        };
      }
    }
    function V_(e, t, a) {
      typeof t != "function" && h("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Ot;
      return u |= xl, (tn.mode & It) !== et && (u |= ao), Xh(u, Cr, z1.bind(null, t, e), i);
    }
    function Ky(e, t, a) {
      typeof t != "function" && h("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return Gy(Ot, Cr, z1.bind(null, t, e), i);
    }
    function TD(e, t) {
    }
    var Jy = TD;
    function B_(e, t) {
      var a = xo(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function Zy(e, t) {
      var a = sl(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var d = u[1];
        if (L_(i, d))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Y_(e, t) {
      var a = xo(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function eg(e, t) {
      var a = sl(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var d = u[1];
        if (L_(i, d))
          return u[0];
      }
      var m = e();
      return a.memoizedState = [m, i], m;
    }
    function $_(e) {
      var t = xo();
      return t.memoizedState = e, e;
    }
    function U1(e) {
      var t = sl(), a = wr, i = a.memoizedState;
      return P1(t, i, e);
    }
    function j1(e) {
      var t = sl();
      if (wr === null)
        return t.memoizedState = e, e;
      var a = wr.memoizedState;
      return P1(t, a, e);
    }
    function P1(e, t, a) {
      var i = !Zp(qc);
      if (i) {
        if (!Se(a, t)) {
          var u = nh();
          tn.lanes = _t(tn.lanes, u), vv(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, rv()), e.memoizedState = a, a;
    }
    function bD(e, t, a) {
      var i = Ka();
      $n(Lm(i, el)), e(!0);
      var u = Wh.transition;
      Wh.transition = {};
      var d = Wh.transition;
      Wh.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if ($n(i), Wh.transition = u, u === null && d._updatedFibers) {
          var m = d._updatedFibers.size;
          m > 10 && y("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), d._updatedFibers.clear();
        }
      }
    }
    function W_() {
      var e = $y(!1), t = e[0], a = e[1], i = bD.bind(null, a), u = xo();
      return u.memoizedState = i, [t, i];
    }
    function F1() {
      var e = j_(), t = e[0], a = sl(), i = a.memoizedState;
      return [t, i];
    }
    function H1() {
      var e = P_(), t = e[0], a = sl(), i = a.memoizedState;
      return [t, i];
    }
    var I1 = !1;
    function RD() {
      return I1;
    }
    function G_() {
      var e = xo(), t = Eg(), a = t.identifierPrefix, i;
      if (qr()) {
        var u = Yk();
        i = ":" + a + "R" + u;
        var d = qh++;
        d > 0 && (i += "H" + d.toString(32)), i += ":";
      } else {
        var m = CD++;
        i = ":" + a + "r" + m.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function tg() {
      var e = sl(), t = e.memoizedState;
      return t;
    }
    function kD(e, t, a) {
      typeof arguments[3] == "function" && h("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Rs(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (V1(e))
        B1(t, u);
      else {
        var d = y1(e, t, u, i);
        if (d !== null) {
          var m = za();
          kr(d, e, i, m), Y1(d, t, i);
        }
      }
      $1(e, i);
    }
    function DD(e, t, a) {
      typeof arguments[3] == "function" && h("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Rs(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (V1(e))
        B1(t, u);
      else {
        var d = e.alternate;
        if (e.lanes === me && (d === null || d.lanes === me)) {
          var m = t.lastRenderedReducer;
          if (m !== null) {
            var S;
            S = Ue.current, Ue.current = jl;
            try {
              var C = t.lastRenderedState, k = m(C, a);
              if (u.hasEagerState = !0, u.eagerState = k, Se(k, C)) {
                pD(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              Ue.current = S;
            }
          }
        }
        var D = y1(e, t, u, i);
        if (D !== null) {
          var I = za();
          kr(D, e, i, I), Y1(D, t, i);
        }
      }
      $1(e, i);
    }
    function V1(e) {
      var t = e.alternate;
      return e === tn || t !== null && t === tn;
    }
    function B1(e, t) {
      Gh = By = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function Y1(e, t, a) {
      if (th(a)) {
        var i = t.lanes;
        i = rh(i, e.pendingLanes);
        var u = _t(i, a);
        t.lanes = u, cd(e, u);
      }
    }
    function $1(e, t, a) {
      cc(e, t);
    }
    var ng = {
      readContext: fr,
      useCallback: ga,
      useContext: ga,
      useEffect: ga,
      useImperativeHandle: ga,
      useInsertionEffect: ga,
      useLayoutEffect: ga,
      useMemo: ga,
      useReducer: ga,
      useRef: ga,
      useState: ga,
      useDebugValue: ga,
      useDeferredValue: ga,
      useTransition: ga,
      useMutableSource: ga,
      useSyncExternalStore: ga,
      useId: ga,
      unstable_isNewReconciler: ie
    }, W1 = null, G1 = null, q1 = null, Q1 = null, To = null, jl = null, rg = null;
    {
      var q_ = function() {
        h("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, vt = function() {
        h("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      W1 = {
        readContext: function(e) {
          return fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", Gt(), Bd(t), B_(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", Gt(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", Gt(), Bd(t), qy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", Gt(), Bd(a), V_(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", Gt(), Bd(t), H_(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", Gt(), Bd(t), I_(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", Gt(), Bd(t);
          var a = Ue.current;
          Ue.current = To;
          try {
            return Y_(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", Gt();
          var i = Ue.current;
          Ue.current = To;
          try {
            return N_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", Gt(), F_(e);
        },
        useState: function(e) {
          pe = "useState", Gt();
          var t = Ue.current;
          Ue.current = To;
          try {
            return $y(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", Gt(), $_(e);
        },
        useTransition: function() {
          return pe = "useTransition", Gt(), W_();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", Gt(), U_(e, t, a);
        },
        useId: function() {
          return pe = "useId", Gt(), G_();
        },
        unstable_isNewReconciler: ie
      }, G1 = {
        readContext: function(e) {
          return fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", De(), B_(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", De(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", De(), qy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", De(), V_(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", De(), H_(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", De(), I_(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", De();
          var a = Ue.current;
          Ue.current = To;
          try {
            return Y_(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", De();
          var i = Ue.current;
          Ue.current = To;
          try {
            return N_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", De(), F_(e);
        },
        useState: function(e) {
          pe = "useState", De();
          var t = Ue.current;
          Ue.current = To;
          try {
            return $y(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", De(), void 0;
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", De(), $_(e);
        },
        useTransition: function() {
          return pe = "useTransition", De(), W_();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", De(), U_(e, t, a);
        },
        useId: function() {
          return pe = "useId", De(), G_();
        },
        unstable_isNewReconciler: ie
      }, q1 = {
        readContext: function(e) {
          return fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", De(), Zy(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", De(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", De(), Kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", De(), Ky(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", De(), Qy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", De(), Xy(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", De();
          var a = Ue.current;
          Ue.current = jl;
          try {
            return eg(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", De();
          var i = Ue.current;
          Ue.current = jl;
          try {
            return A_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", De(), Wy();
        },
        useState: function(e) {
          pe = "useState", De();
          var t = Ue.current;
          Ue.current = jl;
          try {
            return j_(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", De(), Jy();
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", De(), U1(e);
        },
        useTransition: function() {
          return pe = "useTransition", De(), F1();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", De(), Yy(e, t);
        },
        useId: function() {
          return pe = "useId", De(), tg();
        },
        unstable_isNewReconciler: ie
      }, Q1 = {
        readContext: function(e) {
          return fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", De(), Zy(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", De(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", De(), Kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", De(), Ky(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", De(), Qy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", De(), Xy(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", De();
          var a = Ue.current;
          Ue.current = rg;
          try {
            return eg(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", De();
          var i = Ue.current;
          Ue.current = rg;
          try {
            return z_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", De(), Wy();
        },
        useState: function(e) {
          pe = "useState", De();
          var t = Ue.current;
          Ue.current = rg;
          try {
            return P_(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", De(), Jy();
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", De(), j1(e);
        },
        useTransition: function() {
          return pe = "useTransition", De(), H1();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", De(), Yy(e, t);
        },
        useId: function() {
          return pe = "useId", De(), tg();
        },
        unstable_isNewReconciler: ie
      }, To = {
        readContext: function(e) {
          return q_(), fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", vt(), Gt(), B_(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", vt(), Gt(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", vt(), Gt(), qy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", vt(), Gt(), V_(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", vt(), Gt(), H_(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", vt(), Gt(), I_(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", vt(), Gt();
          var a = Ue.current;
          Ue.current = To;
          try {
            return Y_(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", vt(), Gt();
          var i = Ue.current;
          Ue.current = To;
          try {
            return N_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", vt(), Gt(), F_(e);
        },
        useState: function(e) {
          pe = "useState", vt(), Gt();
          var t = Ue.current;
          Ue.current = To;
          try {
            return $y(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", vt(), Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", vt(), Gt(), $_(e);
        },
        useTransition: function() {
          return pe = "useTransition", vt(), Gt(), W_();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", vt(), Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", vt(), Gt(), U_(e, t, a);
        },
        useId: function() {
          return pe = "useId", vt(), Gt(), G_();
        },
        unstable_isNewReconciler: ie
      }, jl = {
        readContext: function(e) {
          return q_(), fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", vt(), De(), Zy(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", vt(), De(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", vt(), De(), Kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", vt(), De(), Ky(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", vt(), De(), Qy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", vt(), De(), Xy(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", vt(), De();
          var a = Ue.current;
          Ue.current = jl;
          try {
            return eg(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", vt(), De();
          var i = Ue.current;
          Ue.current = jl;
          try {
            return A_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", vt(), De(), Wy();
        },
        useState: function(e) {
          pe = "useState", vt(), De();
          var t = Ue.current;
          Ue.current = jl;
          try {
            return j_(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", vt(), De(), Jy();
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", vt(), De(), U1(e);
        },
        useTransition: function() {
          return pe = "useTransition", vt(), De(), F1();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", vt(), De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", vt(), De(), Yy(e, t);
        },
        useId: function() {
          return pe = "useId", vt(), De(), tg();
        },
        unstable_isNewReconciler: ie
      }, rg = {
        readContext: function(e) {
          return q_(), fr(e);
        },
        useCallback: function(e, t) {
          return pe = "useCallback", vt(), De(), Zy(e, t);
        },
        useContext: function(e) {
          return pe = "useContext", vt(), De(), fr(e);
        },
        useEffect: function(e, t) {
          return pe = "useEffect", vt(), De(), Kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return pe = "useImperativeHandle", vt(), De(), Ky(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return pe = "useInsertionEffect", vt(), De(), Qy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return pe = "useLayoutEffect", vt(), De(), Xy(e, t);
        },
        useMemo: function(e, t) {
          pe = "useMemo", vt(), De();
          var a = Ue.current;
          Ue.current = jl;
          try {
            return eg(e, t);
          } finally {
            Ue.current = a;
          }
        },
        useReducer: function(e, t, a) {
          pe = "useReducer", vt(), De();
          var i = Ue.current;
          Ue.current = jl;
          try {
            return z_(e, t, a);
          } finally {
            Ue.current = i;
          }
        },
        useRef: function(e) {
          return pe = "useRef", vt(), De(), Wy();
        },
        useState: function(e) {
          pe = "useState", vt(), De();
          var t = Ue.current;
          Ue.current = jl;
          try {
            return P_(e);
          } finally {
            Ue.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return pe = "useDebugValue", vt(), De(), Jy();
        },
        useDeferredValue: function(e) {
          return pe = "useDeferredValue", vt(), De(), j1(e);
        },
        useTransition: function() {
          return pe = "useTransition", vt(), De(), H1();
        },
        useMutableSource: function(e, t, a) {
          return pe = "useMutableSource", vt(), De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return pe = "useSyncExternalStore", vt(), De(), Yy(e, t);
        },
        useId: function() {
          return pe = "useId", vt(), De(), tg();
        },
        unstable_isNewReconciler: ie
      };
    }
    var ws = l.unstable_now, X1 = 0, ag = -1, Jh = -1, ig = -1, Q_ = !1, lg = !1;
    function K1() {
      return Q_;
    }
    function OD() {
      lg = !0;
    }
    function LD() {
      Q_ = !1, lg = !1;
    }
    function MD() {
      Q_ = lg, lg = !1;
    }
    function J1() {
      return X1;
    }
    function Z1() {
      X1 = ws();
    }
    function X_(e) {
      Jh = ws(), e.actualStartTime < 0 && (e.actualStartTime = ws());
    }
    function ew(e) {
      Jh = -1;
    }
    function og(e, t) {
      if (Jh >= 0) {
        var a = ws() - Jh;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Jh = -1;
      }
    }
    function bo(e) {
      if (ag >= 0) {
        var t = ws() - ag;
        ag = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case O:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case se:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function K_(e) {
      if (ig >= 0) {
        var t = ws() - ig;
        ig = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case O:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case se:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Ro() {
      ag = ws();
    }
    function J_() {
      ig = ws();
    }
    function Z_(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function Pl(e, t) {
      if (e && e.defaultProps) {
        var a = St({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var eS = {}, tS, nS, rS, aS, iS, tw, ug, lS, oS, uS, Zh;
    {
      tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), Zh = /* @__PURE__ */ new Set();
      var nw = /* @__PURE__ */ new Set();
      ug = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          nw.has(a) || (nw.add(a), h("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, tw = function(e, t) {
        if (t === void 0) {
          var a = At(e) || "Component";
          iS.has(a) || (iS.add(a), h("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(eS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(eS);
    }
    function sS(e, t, a, i) {
      var u = e.memoizedState, d = a(i, u);
      {
        if (e.mode & en) {
          En(!0);
          try {
            d = a(i, u);
          } finally {
            En(!1);
          }
        }
        tw(t, d);
      }
      var m = d == null ? u : St({}, u, d);
      if (e.memoizedState = m, e.lanes === me) {
        var S = e.updateQueue;
        S.baseState = m;
      }
    }
    var cS = {
      isMounted: vm,
      enqueueSetState: function(e, t, a) {
        var i = Ju(e), u = za(), d = Rs(i), m = Cu(u, d);
        m.payload = t, a != null && (ug(a, "setState"), m.callback = a);
        var S = _s(i, m, d);
        S !== null && (kr(S, i, d, u), jy(S, i, d)), cc(i, d);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = Ju(e), u = za(), d = Rs(i), m = Cu(u, d);
        m.tag = _1, m.payload = t, a != null && (ug(a, "replaceState"), m.callback = a);
        var S = _s(i, m, d);
        S !== null && (kr(S, i, d, u), jy(S, i, d)), cc(i, d);
      },
      enqueueForceUpdate: function(e, t) {
        var a = Ju(e), i = za(), u = Rs(a), d = Cu(i, u);
        d.tag = Ay, t != null && (ug(t, "forceUpdate"), d.callback = t);
        var m = _s(a, d, u);
        m !== null && (kr(m, a, u, i), jy(m, a, u)), Vf(a, u);
      }
    };
    function rw(e, t, a, i, u, d, m) {
      var S = e.stateNode;
      if (typeof S.shouldComponentUpdate == "function") {
        var C = S.shouldComponentUpdate(i, d, m);
        {
          if (e.mode & en) {
            En(!0);
            try {
              C = S.shouldComponentUpdate(i, d, m);
            } finally {
              En(!1);
            }
          }
          C === void 0 && h("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", At(t) || "Component");
        }
        return C;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ve(a, i) || !Ve(u, d) : !0;
    }
    function ND(e, t, a) {
      var i = e.stateNode;
      {
        var u = At(t) || "Component", d = i.render;
        d || (t.prototype && typeof t.prototype.render == "function" ? h("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : h("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && h("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && h("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && h("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && h("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Zh.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & en) === et && (Zh.add(t), h(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Zh.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & en) === et && (Zh.add(t), h(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && h("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !oS.has(t) && (oS.add(t), h("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && h("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && h("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", At(t) || "A pure component"), typeof i.componentDidUnmount == "function" && h("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && h("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && h("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && h("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var m = i.props !== a;
        i.props !== void 0 && m && h("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && h("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !rS.has(t) && (rS.add(t), h("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", At(t))), typeof i.getDerivedStateFromProps == "function" && h("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && h("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && h("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var S = i.state;
        S && (typeof S != "object" || Ct(S)) && h("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && h("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function aw(e, t) {
      t.updater = cS, e.stateNode = t, Xo(t, e), t._reactInternalInstance = eS;
    }
    function iw(e, t, a) {
      var i = !1, u = Ri, d = Ri, m = t.contextType;
      if ("contextType" in t) {
        var S = (
          // Allow null for conditional declaration
          m === null || m !== void 0 && m.$$typeof === U && m._context === void 0
        );
        if (!S && !uS.has(t)) {
          uS.add(t);
          var C = "";
          m === void 0 ? C = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof m != "object" ? C = " However, it is set to a " + typeof m + "." : m.$$typeof === Ii ? C = " Did you accidentally pass the Context.Provider instead?" : m._context !== void 0 ? C = " Did you accidentally pass the Context.Consumer instead?" : C = " However, it is set to an object with keys {" + Object.keys(m).join(", ") + "}.", h("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", At(t) || "Component", C);
        }
      }
      if (typeof m == "object" && m !== null)
        d = fr(m);
      else {
        u = Ld(e, t, !0);
        var k = t.contextTypes;
        i = k != null, d = i ? Md(e, u) : Ri;
      }
      var D = new t(a, d);
      if (e.mode & en) {
        En(!0);
        try {
          D = new t(a, d);
        } finally {
          En(!1);
        }
      }
      var I = e.memoizedState = D.state !== null && D.state !== void 0 ? D.state : null;
      aw(e, D);
      {
        if (typeof t.getDerivedStateFromProps == "function" && I === null) {
          var F = At(t) || "Component";
          nS.has(F) || (nS.add(F), h("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", F, D.state === null ? "null" : "undefined", F));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof D.getSnapshotBeforeUpdate == "function") {
          var K = null, te = null, le = null;
          if (typeof D.componentWillMount == "function" && D.componentWillMount.__suppressDeprecationWarning !== !0 ? K = "componentWillMount" : typeof D.UNSAFE_componentWillMount == "function" && (K = "UNSAFE_componentWillMount"), typeof D.componentWillReceiveProps == "function" && D.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? te = "componentWillReceiveProps" : typeof D.UNSAFE_componentWillReceiveProps == "function" && (te = "UNSAFE_componentWillReceiveProps"), typeof D.componentWillUpdate == "function" && D.componentWillUpdate.__suppressDeprecationWarning !== !0 ? le = "componentWillUpdate" : typeof D.UNSAFE_componentWillUpdate == "function" && (le = "UNSAFE_componentWillUpdate"), K !== null || te !== null || le !== null) {
            var Ne = At(t) || "Component", nt = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            aS.has(Ne) || (aS.add(Ne), h(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ne, nt, K !== null ? `
  ` + K : "", te !== null ? `
  ` + te : "", le !== null ? `
  ` + le : ""));
          }
        }
      }
      return i && qC(e, u, d), D;
    }
    function AD(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (h("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", pt(e) || "Component"), cS.enqueueReplaceState(t, t.state, null));
    }
    function lw(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var d = pt(e) || "Component";
          tS.has(d) || (tS.add(d), h("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", d));
        }
        cS.enqueueReplaceState(t, t.state, null);
      }
    }
    function fS(e, t, a, i) {
      ND(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, S_(e);
      var d = t.contextType;
      if (typeof d == "object" && d !== null)
        u.context = fr(d);
      else {
        var m = Ld(e, t, !0);
        u.context = Md(e, m);
      }
      {
        if (u.state === a) {
          var S = At(t) || "Component";
          lS.has(S) || (lS.add(S), h("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", S));
        }
        e.mode & en && zl.recordLegacyContextWarning(e, u), zl.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var C = t.getDerivedStateFromProps;
      if (typeof C == "function" && (sS(e, t, C, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (AD(e, u), Py(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var k = Ot;
        k |= xl, (e.mode & It) !== et && (k |= ao), e.flags |= k;
      }
    }
    function zD(e, t, a, i) {
      var u = e.stateNode, d = e.memoizedProps;
      u.props = d;
      var m = u.context, S = t.contextType, C = Ri;
      if (typeof S == "object" && S !== null)
        C = fr(S);
      else {
        var k = Ld(e, t, !0);
        C = Md(e, k);
      }
      var D = t.getDerivedStateFromProps, I = typeof D == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !I && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (d !== a || m !== C) && lw(e, u, a, C), E1();
      var F = e.memoizedState, K = u.state = F;
      if (Py(e, a, u, i), K = e.memoizedState, d === a && F === K && !_y() && !Fy()) {
        if (typeof u.componentDidMount == "function") {
          var te = Ot;
          te |= xl, (e.mode & It) !== et && (te |= ao), e.flags |= te;
        }
        return !1;
      }
      typeof D == "function" && (sS(e, t, D, a), K = e.memoizedState);
      var le = Fy() || rw(e, t, d, a, F, K, C);
      if (le) {
        if (!I && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var Ne = Ot;
          Ne |= xl, (e.mode & It) !== et && (Ne |= ao), e.flags |= Ne;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var nt = Ot;
          nt |= xl, (e.mode & It) !== et && (nt |= ao), e.flags |= nt;
        }
        e.memoizedProps = a, e.memoizedState = K;
      }
      return u.props = a, u.state = K, u.context = C, le;
    }
    function UD(e, t, a, i, u) {
      var d = t.stateNode;
      S1(e, t);
      var m = t.memoizedProps, S = t.type === t.elementType ? m : Pl(t.type, m);
      d.props = S;
      var C = t.pendingProps, k = d.context, D = a.contextType, I = Ri;
      if (typeof D == "object" && D !== null)
        I = fr(D);
      else {
        var F = Ld(t, a, !0);
        I = Md(t, F);
      }
      var K = a.getDerivedStateFromProps, te = typeof K == "function" || typeof d.getSnapshotBeforeUpdate == "function";
      !te && (typeof d.UNSAFE_componentWillReceiveProps == "function" || typeof d.componentWillReceiveProps == "function") && (m !== C || k !== I) && lw(t, d, i, I), E1();
      var le = t.memoizedState, Ne = d.state = le;
      if (Py(t, i, d, u), Ne = t.memoizedState, m === C && le === Ne && !_y() && !Fy() && !Te)
        return typeof d.componentDidUpdate == "function" && (m !== e.memoizedProps || le !== e.memoizedState) && (t.flags |= Ot), typeof d.getSnapshotBeforeUpdate == "function" && (m !== e.memoizedProps || le !== e.memoizedState) && (t.flags |= er), !1;
      typeof K == "function" && (sS(t, a, K, i), Ne = t.memoizedState);
      var nt = Fy() || rw(t, a, S, i, le, Ne, I) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Te;
      return nt ? (!te && (typeof d.UNSAFE_componentWillUpdate == "function" || typeof d.componentWillUpdate == "function") && (typeof d.componentWillUpdate == "function" && d.componentWillUpdate(i, Ne, I), typeof d.UNSAFE_componentWillUpdate == "function" && d.UNSAFE_componentWillUpdate(i, Ne, I)), typeof d.componentDidUpdate == "function" && (t.flags |= Ot), typeof d.getSnapshotBeforeUpdate == "function" && (t.flags |= er)) : (typeof d.componentDidUpdate == "function" && (m !== e.memoizedProps || le !== e.memoizedState) && (t.flags |= Ot), typeof d.getSnapshotBeforeUpdate == "function" && (m !== e.memoizedProps || le !== e.memoizedState) && (t.flags |= er), t.memoizedProps = i, t.memoizedState = Ne), d.props = i, d.state = Ne, d.context = I, nt;
    }
    function Qc(e, t) {
      return {
        value: e,
        source: t,
        stack: gl(t),
        digest: null
      };
    }
    function dS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function jD(e, t) {
      return !0;
    }
    function pS(e, t) {
      try {
        var a = jD(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, d = t.stack, m = d !== null ? d : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === T)
            return;
          console.error(i);
        }
        var S = u ? pt(u) : null, C = S ? "The above error occurred in the <" + S + "> component:" : "The above error occurred in one of your React components:", k;
        if (e.tag === O)
          k = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var D = pt(e) || "Anonymous";
          k = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + D + ".");
        }
        var I = C + `
` + m + `

` + ("" + k);
        console.error(I);
      } catch (F) {
        setTimeout(function() {
          throw F;
        });
      }
    }
    var PD = typeof WeakMap == "function" ? WeakMap : Map;
    function ow(e, t, a) {
      var i = Cu(rn, a);
      i.tag = g_, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        OL(u), pS(e, t);
      }, i;
    }
    function hS(e, t, a) {
      var i = Cu(rn, a);
      i.tag = g_;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var d = t.value;
        i.payload = function() {
          return u(d);
        }, i.callback = function() {
          gx(e), pS(e, t);
        };
      }
      var m = e.stateNode;
      return m !== null && typeof m.componentDidCatch == "function" && (i.callback = function() {
        gx(e), pS(e, t), typeof u != "function" && kL(this);
        var C = t.value, k = t.stack;
        this.componentDidCatch(C, {
          componentStack: k !== null ? k : ""
        }), typeof u != "function" && (da(e.lanes, st) || h("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", pt(e) || "Unknown"));
      }), i;
    }
    function uw(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new PD(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var d = LL.bind(null, e, t, a);
        ca && mv(e, a), t.then(d, d);
      }
    }
    function FD(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var d = /* @__PURE__ */ new Set();
        d.add(a), e.updateQueue = d;
      } else
        u.add(a);
    }
    function HD(e, t) {
      var a = e.tag;
      if ((e.mode & Tt) === et && (a === x || a === ne || a === ue)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function sw(e) {
      var t = e;
      do {
        if (t.tag === W && SD(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function cw(e, t, a, i, u) {
      if ((e.mode & Tt) === et) {
        if (e === t)
          e.flags |= or;
        else {
          if (e.flags |= Je, a.flags |= Af, a.flags &= -52805, a.tag === T) {
            var d = a.alternate;
            if (d === null)
              a.tag = fe;
            else {
              var m = Cu(rn, st);
              m.tag = Ay, _s(a, m, st);
            }
          }
          a.lanes = _t(a.lanes, st);
        }
        return e;
      }
      return e.flags |= or, e.lanes = u, e;
    }
    function ID(e, t, a, i, u) {
      if (a.flags |= ac, ca && mv(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var d = i;
        HD(a), qr() && a.mode & Tt && t1();
        var m = sw(t);
        if (m !== null) {
          m.flags &= ~Mr, cw(m, t, a, e, u), m.mode & Tt && uw(e, d, u), FD(m, e, d);
          return;
        } else {
          if (!wm(u)) {
            uw(e, d, u), GS();
            return;
          }
          var S = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = S;
        }
      } else if (qr() && a.mode & Tt) {
        t1();
        var C = sw(t);
        if (C !== null) {
          (C.flags & or) === Ze && (C.flags |= Mr), cw(C, t, a, e, u), l_(Qc(i, a));
          return;
        }
      }
      i = Qc(i, a), SL(i);
      var k = t;
      do {
        switch (k.tag) {
          case O: {
            var D = i;
            k.flags |= or;
            var I = _c(u);
            k.lanes = _t(k.lanes, I);
            var F = ow(k, D, I);
            E_(k, F);
            return;
          }
          case T:
            var K = i, te = k.type, le = k.stateNode;
            if ((k.flags & Je) === Ze && (typeof te.getDerivedStateFromError == "function" || le !== null && typeof le.componentDidCatch == "function" && !sx(le))) {
              k.flags |= or;
              var Ne = _c(u);
              k.lanes = _t(k.lanes, Ne);
              var nt = hS(k, K, Ne);
              E_(k, nt);
              return;
            }
            break;
        }
        k = k.return;
      } while (k !== null);
    }
    function VD() {
      return null;
    }
    var ev = s.ReactCurrentOwner, Fl = !1, vS, tv, mS, yS, gS, Xc, _S, sg, nv;
    vS = {}, tv = {}, mS = {}, yS = {}, gS = {}, Xc = !1, _S = {}, sg = {}, nv = {};
    function Na(e, t, a, i) {
      e === null ? t.child = p1(t, null, a, i) : t.child = Ud(t, e.child, a, i);
    }
    function BD(e, t, a, i) {
      t.child = Ud(t, e.child, null, i), t.child = Ud(t, null, a, i);
    }
    function fw(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var d = a.propTypes;
        d && Nl(
          d,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var m = a.render, S = t.ref, C, k;
      Pd(t, u), Da(t);
      {
        if (ev.current = t, Zn(!0), C = Yd(e, t, m, i, S, u), k = $d(), t.mode & en) {
          En(!0);
          try {
            C = Yd(e, t, m, i, S, u), k = $d();
          } finally {
            En(!1);
          }
        }
        Zn(!1);
      }
      return Oa(), e !== null && !Fl ? (R1(e, t, u), wu(e, t, u)) : (qr() && k && e_(t), t.flags |= Ci, Na(e, t, C, u), t.child);
    }
    function dw(e, t, a, i, u) {
      if (e === null) {
        var d = a.type;
        if (qL(d) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var m = d;
          return m = Zd(d), t.tag = ue, t.type = m, CS(t, d), pw(e, t, m, i, u);
        }
        {
          var S = d.propTypes;
          if (S && Nl(
            S,
            i,
            // Resolved props
            "prop",
            At(d)
          ), a.defaultProps !== void 0) {
            var C = At(d) || "Unknown";
            nv[C] || (h("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", C), nv[C] = !0);
          }
        }
        var k = aE(a.type, null, i, t, t.mode, u);
        return k.ref = t.ref, k.return = t, t.child = k, k;
      }
      {
        var D = a.type, I = D.propTypes;
        I && Nl(
          I,
          i,
          // Resolved props
          "prop",
          At(D)
        );
      }
      var F = e.child, K = kS(e, u);
      if (!K) {
        var te = F.memoizedProps, le = a.compare;
        if (le = le !== null ? le : Ve, le(te, i) && e.ref === t.ref)
          return wu(e, t, u);
      }
      t.flags |= Ci;
      var Ne = tf(F, i);
      return Ne.ref = t.ref, Ne.return = t, t.child = Ne, Ne;
    }
    function pw(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var d = t.elementType;
        if (d.$$typeof === ht) {
          var m = d, S = m._payload, C = m._init;
          try {
            d = C(S);
          } catch {
            d = null;
          }
          var k = d && d.propTypes;
          k && Nl(
            k,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            At(d)
          );
        }
      }
      if (e !== null) {
        var D = e.memoizedProps;
        if (Ve(D, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (Fl = !1, t.pendingProps = i = D, kS(e, u))
            (e.flags & Af) !== Ze && (Fl = !0);
          else return t.lanes = e.lanes, wu(e, t, u);
      }
      return SS(e, t, a, i, u);
    }
    function hw(e, t, a) {
      var i = t.pendingProps, u = i.children, d = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ye)
        if ((t.mode & Tt) === et) {
          var m = {
            baseLanes: me,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = m, Cg(t, a);
        } else if (da(a, fa)) {
          var I = {
            baseLanes: me,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = I;
          var F = d !== null ? d.baseLanes : a;
          Cg(t, F);
        } else {
          var S = null, C;
          if (d !== null) {
            var k = d.baseLanes;
            C = _t(k, a);
          } else
            C = a;
          t.lanes = t.childLanes = fa;
          var D = {
            baseLanes: C,
            cachePool: S,
            transitions: null
          };
          return t.memoizedState = D, t.updateQueue = null, Cg(t, C), null;
        }
      else {
        var K;
        d !== null ? (K = _t(d.baseLanes, a), t.memoizedState = null) : K = a, Cg(t, K);
      }
      return Na(e, t, u, a), t.child;
    }
    function YD(e, t, a) {
      var i = t.pendingProps;
      return Na(e, t, i, a), t.child;
    }
    function $D(e, t, a) {
      var i = t.pendingProps.children;
      return Na(e, t, i, a), t.child;
    }
    function WD(e, t, a) {
      {
        t.flags |= Ot;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, d = u.children;
      return Na(e, t, d, a), t.child;
    }
    function vw(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= xn, t.flags |= es);
    }
    function SS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var d = a.propTypes;
        d && Nl(
          d,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var m;
      {
        var S = Ld(t, a, !0);
        m = Md(t, S);
      }
      var C, k;
      Pd(t, u), Da(t);
      {
        if (ev.current = t, Zn(!0), C = Yd(e, t, a, i, m, u), k = $d(), t.mode & en) {
          En(!0);
          try {
            C = Yd(e, t, a, i, m, u), k = $d();
          } finally {
            En(!1);
          }
        }
        Zn(!1);
      }
      return Oa(), e !== null && !Fl ? (R1(e, t, u), wu(e, t, u)) : (qr() && k && e_(t), t.flags |= Ci, Na(e, t, C, u), t.child);
    }
    function mw(e, t, a, i, u) {
      {
        switch (sM(t)) {
          case !1: {
            var d = t.stateNode, m = t.type, S = new m(t.memoizedProps, d.context), C = S.state;
            d.updater.enqueueSetState(d, C, null);
            break;
          }
          case !0: {
            t.flags |= Je, t.flags |= or;
            var k = new Error("Simulated error coming from DevTools"), D = _c(u);
            t.lanes = _t(t.lanes, D);
            var I = hS(t, Qc(k, t), D);
            E_(t, I);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var F = a.propTypes;
          F && Nl(
            F,
            i,
            // Resolved props
            "prop",
            At(a)
          );
        }
      }
      var K;
      Co(a) ? (K = !0, Ey(t)) : K = !1, Pd(t, u);
      var te = t.stateNode, le;
      te === null ? (fg(e, t), iw(t, a, i), fS(t, a, i, u), le = !0) : e === null ? le = zD(t, a, i, u) : le = UD(e, t, a, i, u);
      var Ne = ES(e, t, a, le, K, u);
      {
        var nt = t.stateNode;
        le && nt.props !== i && (Xc || h("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", pt(t) || "a component"), Xc = !0);
      }
      return Ne;
    }
    function ES(e, t, a, i, u, d) {
      vw(e, t);
      var m = (t.flags & Je) !== Ze;
      if (!i && !m)
        return u && KC(t, a, !1), wu(e, t, d);
      var S = t.stateNode;
      ev.current = t;
      var C;
      if (m && typeof a.getDerivedStateFromError != "function")
        C = null, ew();
      else {
        Da(t);
        {
          if (Zn(!0), C = S.render(), t.mode & en) {
            En(!0);
            try {
              S.render();
            } finally {
              En(!1);
            }
          }
          Zn(!1);
        }
        Oa();
      }
      return t.flags |= Ci, e !== null && m ? BD(e, t, C, d) : Na(e, t, C, d), t.memoizedState = S.state, u && KC(t, a, !0), t.child;
    }
    function yw(e) {
      var t = e.stateNode;
      t.pendingContext ? QC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && QC(e, t.context, !1), C_(e, t.containerInfo);
    }
    function GD(e, t, a) {
      if (yw(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, d = u.element;
      S1(e, t), Py(t, i, null, a);
      var m = t.memoizedState;
      t.stateNode;
      var S = m.element;
      if (u.isDehydrated) {
        var C = {
          element: S,
          isDehydrated: !1,
          cache: m.cache,
          pendingSuspenseBoundaries: m.pendingSuspenseBoundaries,
          transitions: m.transitions
        }, k = t.updateQueue;
        if (k.baseState = C, t.memoizedState = C, t.flags & Mr) {
          var D = Qc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return gw(e, t, S, a, D);
        } else if (S !== d) {
          var I = Qc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return gw(e, t, S, a, I);
        } else {
          Xk(t);
          var F = p1(t, null, S, a);
          t.child = F;
          for (var K = F; K; )
            K.flags = K.flags & ~Sn | oa, K = K.sibling;
        }
      } else {
        if (zd(), S === d)
          return wu(e, t, a);
        Na(e, t, S, a);
      }
      return t.child;
    }
    function gw(e, t, a, i, u) {
      return zd(), l_(u), t.flags |= Mr, Na(e, t, a, i), t.child;
    }
    function qD(e, t, a) {
      x1(t), e === null && i_(t);
      var i = t.type, u = t.pendingProps, d = e !== null ? e.memoizedProps : null, m = u.children, S = H0(i, u);
      return S ? m = null : d !== null && H0(i, d) && (t.flags |= $a), vw(e, t), Na(e, t, m, a), t.child;
    }
    function QD(e, t) {
      return e === null && i_(t), null;
    }
    function XD(e, t, a, i) {
      fg(e, t);
      var u = t.pendingProps, d = a, m = d._payload, S = d._init, C = S(m);
      t.type = C;
      var k = t.tag = QL(C), D = Pl(C, u), I;
      switch (k) {
        case x:
          return CS(t, C), t.type = C = Zd(C), I = SS(null, t, C, D, i), I;
        case T:
          return t.type = C = JS(C), I = mw(null, t, C, D, i), I;
        case ne:
          return t.type = C = ZS(C), I = fw(null, t, C, D, i), I;
        case de: {
          if (t.type !== t.elementType) {
            var F = C.propTypes;
            F && Nl(
              F,
              D,
              // Resolved for outer only
              "prop",
              At(C)
            );
          }
          return I = dw(
            null,
            t,
            C,
            Pl(C.type, D),
            // The inner type can have defaults too
            i
          ), I;
        }
      }
      var K = "";
      throw C !== null && typeof C == "object" && C.$$typeof === ht && (K = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + C + ". " + ("Lazy element type must resolve to a class or function." + K));
    }
    function KD(e, t, a, i, u) {
      fg(e, t), t.tag = T;
      var d;
      return Co(a) ? (d = !0, Ey(t)) : d = !1, Pd(t, u), iw(t, a, i), fS(t, a, i, u), ES(null, t, a, !0, d, u);
    }
    function JD(e, t, a, i) {
      fg(e, t);
      var u = t.pendingProps, d;
      {
        var m = Ld(t, a, !1);
        d = Md(t, m);
      }
      Pd(t, i);
      var S, C;
      Da(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var k = At(a) || "Unknown";
          vS[k] || (h("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", k, k), vS[k] = !0);
        }
        t.mode & en && zl.recordLegacyContextWarning(t, null), Zn(!0), ev.current = t, S = Yd(null, t, a, u, d, i), C = $d(), Zn(!1);
      }
      if (Oa(), t.flags |= Ci, typeof S == "object" && S !== null && typeof S.render == "function" && S.$$typeof === void 0) {
        var D = At(a) || "Unknown";
        tv[D] || (h("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", D, D, D), tv[D] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof S == "object" && S !== null && typeof S.render == "function" && S.$$typeof === void 0
      ) {
        {
          var I = At(a) || "Unknown";
          tv[I] || (h("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", I, I, I), tv[I] = !0);
        }
        t.tag = T, t.memoizedState = null, t.updateQueue = null;
        var F = !1;
        return Co(a) ? (F = !0, Ey(t)) : F = !1, t.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null, S_(t), aw(t, S), fS(t, a, u, i), ES(null, t, a, !0, F, i);
      } else {
        if (t.tag = x, t.mode & en) {
          En(!0);
          try {
            S = Yd(null, t, a, u, d, i), C = $d();
          } finally {
            En(!1);
          }
        }
        return qr() && C && e_(t), Na(null, t, S, i), CS(t, a), t.child;
      }
    }
    function CS(e, t) {
      {
        if (t && t.childContextTypes && h("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Ir();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", d = e._debugSource;
          d && (u = d.fileName + ":" + d.lineNumber), gS[u] || (gS[u] = !0, h("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var m = At(t) || "Unknown";
          nv[m] || (h("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", m), nv[m] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var S = At(t) || "Unknown";
          yS[S] || (h("%s: Function components do not support getDerivedStateFromProps.", S), yS[S] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var C = At(t) || "Unknown";
          mS[C] || (h("%s: Function components do not support contextType.", C), mS[C] = !0);
        }
      }
    }
    var wS = {
      dehydrated: null,
      treeContext: null,
      retryLane: jt
    };
    function xS(e) {
      return {
        baseLanes: e,
        cachePool: VD(),
        transitions: null
      };
    }
    function ZD(e, t) {
      var a = null;
      return {
        baseLanes: _t(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function eO(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return T_(e, $h);
    }
    function tO(e, t) {
      return Sc(e.childLanes, t);
    }
    function _w(e, t, a) {
      var i = t.pendingProps;
      cM(t) && (t.flags |= Je);
      var u = Ul.current, d = !1, m = (t.flags & Je) !== Ze;
      if (m || eO(u, e) ? (d = !0, t.flags &= ~Je) : (e === null || e.memoizedState !== null) && (u = _D(u, b1)), u = Hd(u), Es(t, u), e === null) {
        i_(t);
        var S = t.memoizedState;
        if (S !== null) {
          var C = S.dehydrated;
          if (C !== null)
            return lO(t, C);
        }
        var k = i.children, D = i.fallback;
        if (d) {
          var I = nO(t, k, D, a), F = t.child;
          return F.memoizedState = xS(a), t.memoizedState = wS, I;
        } else
          return TS(t, k);
      } else {
        var K = e.memoizedState;
        if (K !== null) {
          var te = K.dehydrated;
          if (te !== null)
            return oO(e, t, m, i, te, K, a);
        }
        if (d) {
          var le = i.fallback, Ne = i.children, nt = aO(e, t, Ne, le, a), Xe = t.child, Nt = e.child.memoizedState;
          return Xe.memoizedState = Nt === null ? xS(a) : ZD(Nt, a), Xe.childLanes = tO(e, a), t.memoizedState = wS, nt;
        } else {
          var kt = i.children, G = rO(e, t, kt, a);
          return t.memoizedState = null, G;
        }
      }
    }
    function TS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, d = bS(u, i);
      return d.return = e, e.child = d, d;
    }
    function nO(e, t, a, i) {
      var u = e.mode, d = e.child, m = {
        mode: "hidden",
        children: t
      }, S, C;
      return (u & Tt) === et && d !== null ? (S = d, S.childLanes = me, S.pendingProps = m, e.mode & Ht && (S.actualDuration = 0, S.actualStartTime = -1, S.selfBaseDuration = 0, S.treeBaseDuration = 0), C = Ds(a, u, i, null)) : (S = bS(m, u), C = Ds(a, u, i, null)), S.return = e, C.return = e, S.sibling = C, e.child = S, C;
    }
    function bS(e, t, a) {
      return Sx(e, t, me, null);
    }
    function Sw(e, t) {
      return tf(e, t);
    }
    function rO(e, t, a, i) {
      var u = e.child, d = u.sibling, m = Sw(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Tt) === et && (m.lanes = i), m.return = t, m.sibling = null, d !== null) {
        var S = t.deletions;
        S === null ? (t.deletions = [d], t.flags |= Ya) : S.push(d);
      }
      return t.child = m, m;
    }
    function aO(e, t, a, i, u) {
      var d = t.mode, m = e.child, S = m.sibling, C = {
        mode: "hidden",
        children: a
      }, k;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (d & Tt) === et && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== m
      ) {
        var D = t.child;
        k = D, k.childLanes = me, k.pendingProps = C, t.mode & Ht && (k.actualDuration = 0, k.actualStartTime = -1, k.selfBaseDuration = m.selfBaseDuration, k.treeBaseDuration = m.treeBaseDuration), t.deletions = null;
      } else
        k = Sw(m, C), k.subtreeFlags = m.subtreeFlags & Vn;
      var I;
      return S !== null ? I = tf(S, i) : (I = Ds(i, d, u, null), I.flags |= Sn), I.return = t, k.return = t, k.sibling = I, t.child = k, I;
    }
    function cg(e, t, a, i) {
      i !== null && l_(i), Ud(t, e.child, null, a);
      var u = t.pendingProps, d = u.children, m = TS(t, d);
      return m.flags |= Sn, t.memoizedState = null, m;
    }
    function iO(e, t, a, i, u) {
      var d = t.mode, m = {
        mode: "visible",
        children: a
      }, S = bS(m, d), C = Ds(i, d, u, null);
      return C.flags |= Sn, S.return = t, C.return = t, S.sibling = C, t.child = S, (t.mode & Tt) !== et && Ud(t, e.child, null, u), C;
    }
    function lO(e, t, a) {
      return (e.mode & Tt) === et ? (h("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = st) : Y0(t) ? e.lanes = Nr : e.lanes = fa, null;
    }
    function oO(e, t, a, i, u, d, m) {
      if (a)
        if (t.flags & Mr) {
          t.flags &= ~Mr;
          var G = dS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return cg(e, t, m, G);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Je, null;
          var oe = i.children, q = i.fallback, we = iO(e, t, oe, q, m), je = t.child;
          return je.memoizedState = xS(m), t.memoizedState = wS, we;
        }
      else {
        if (qk(), (t.mode & Tt) === et)
          return cg(
            e,
            t,
            m,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Y0(u)) {
          var S, C, k;
          {
            var D = fk(u);
            S = D.digest, C = D.message, k = D.stack;
          }
          var I;
          C ? I = new Error(C) : I = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var F = dS(I, S, k);
          return cg(e, t, m, F);
        }
        var K = da(m, e.childLanes);
        if (Fl || K) {
          var te = Eg();
          if (te !== null) {
            var le = ih(te, m);
            if (le !== jt && le !== d.retryLane) {
              d.retryLane = le;
              var Ne = rn;
              ei(e, le), kr(te, e, le, Ne);
            }
          }
          GS();
          var nt = dS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return cg(e, t, m, nt);
        } else if (BC(u)) {
          t.flags |= Je, t.child = e.child;
          var Xe = ML.bind(null, e);
          return dk(u, Xe), null;
        } else {
          Kk(t, u, d.treeContext);
          var Nt = i.children, kt = TS(t, Nt);
          return kt.flags |= oa, kt;
        }
      }
    }
    function Ew(e, t, a) {
      e.lanes = _t(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = _t(i.lanes, t)), m_(e.return, t, a);
    }
    function uO(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === W) {
          var u = i.memoizedState;
          u !== null && Ew(i, a, e);
        } else if (i.tag === Ke)
          Ew(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function sO(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && Vy(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function cO(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !_S[e])
        if (_S[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              h('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              h('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              h('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          h('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function fO(e, t) {
      e !== void 0 && !sg[e] && (e !== "collapsed" && e !== "hidden" ? (sg[e] = !0, h('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (sg[e] = !0, h('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function Cw(e, t) {
      {
        var a = Ct(e), i = !a && typeof gt(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return h("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function dO(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Ct(e)) {
          for (var a = 0; a < e.length; a++)
            if (!Cw(e[a], a))
              return;
        } else {
          var i = gt(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var d = u.next(), m = 0; !d.done; d = u.next()) {
                if (!Cw(d.value, m))
                  return;
                m++;
              }
          } else
            h('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function RS(e, t, a, i, u) {
      var d = e.memoizedState;
      d === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = i, d.tail = a, d.tailMode = u);
    }
    function ww(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, d = i.tail, m = i.children;
      cO(u), fO(d, u), dO(m, u), Na(e, t, m, a);
      var S = Ul.current, C = T_(S, $h);
      if (C)
        S = b_(S, $h), t.flags |= Je;
      else {
        var k = e !== null && (e.flags & Je) !== Ze;
        k && uO(t, t.child, a), S = Hd(S);
      }
      if (Es(t, S), (t.mode & Tt) === et)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var D = sO(t.child), I;
            D === null ? (I = t.child, t.child = null) : (I = D.sibling, D.sibling = null), RS(
              t,
              !1,
              // isBackwards
              I,
              D,
              d
            );
            break;
          }
          case "backwards": {
            var F = null, K = t.child;
            for (t.child = null; K !== null; ) {
              var te = K.alternate;
              if (te !== null && Vy(te) === null) {
                t.child = K;
                break;
              }
              var le = K.sibling;
              K.sibling = F, F = K, K = le;
            }
            RS(
              t,
              !0,
              // isBackwards
              F,
              null,
              // last
              d
            );
            break;
          }
          case "together": {
            RS(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function pO(e, t, a) {
      C_(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Ud(t, null, i, a) : Na(e, t, i, a), t.child;
    }
    var xw = !1;
    function hO(e, t, a) {
      var i = t.type, u = i._context, d = t.pendingProps, m = t.memoizedProps, S = d.value;
      {
        "value" in d || xw || (xw = !0, h("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var C = t.type.propTypes;
        C && Nl(C, d, "prop", "Context.Provider");
      }
      if (m1(t, u, S), m !== null) {
        var k = m.value;
        if (Se(k, S)) {
          if (m.children === d.children && !_y())
            return wu(e, t, a);
        } else
          cD(t, u, a);
      }
      var D = d.children;
      return Na(e, t, D, a), t.child;
    }
    var Tw = !1;
    function vO(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (Tw || (Tw = !0, h("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, d = u.children;
      typeof d != "function" && h("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Pd(t, a);
      var m = fr(i);
      Da(t);
      var S;
      return ev.current = t, Zn(!0), S = d(m), Zn(!1), Oa(), t.flags |= Ci, Na(e, t, S, a), t.child;
    }
    function rv() {
      Fl = !0;
    }
    function fg(e, t) {
      (t.mode & Tt) === et && e !== null && (e.alternate = null, t.alternate = null, t.flags |= Sn);
    }
    function wu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), ew(), vv(t.lanes), da(a, t.childLanes) ? (uD(e, t), t.child) : null;
    }
    function mO(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var d = i.deletions;
        return d === null ? (i.deletions = [e], i.flags |= Ya) : d.push(e), a.flags |= Sn, a;
      }
    }
    function kS(e, t) {
      var a = e.lanes;
      return !!da(a, t);
    }
    function yO(e, t, a) {
      switch (t.tag) {
        case O:
          yw(t), t.stateNode, zd();
          break;
        case L:
          x1(t);
          break;
        case T: {
          var i = t.type;
          Co(i) && Ey(t);
          break;
        }
        case A:
          C_(t, t.stateNode.containerInfo);
          break;
        case ee: {
          var u = t.memoizedProps.value, d = t.type._context;
          m1(t, d, u);
          break;
        }
        case se:
          {
            var m = da(a, t.childLanes);
            m && (t.flags |= Ot);
            {
              var S = t.stateNode;
              S.effectDuration = 0, S.passiveEffectDuration = 0;
            }
          }
          break;
        case W: {
          var C = t.memoizedState;
          if (C !== null) {
            if (C.dehydrated !== null)
              return Es(t, Hd(Ul.current)), t.flags |= Je, null;
            var k = t.child, D = k.childLanes;
            if (da(a, D))
              return _w(e, t, a);
            Es(t, Hd(Ul.current));
            var I = wu(e, t, a);
            return I !== null ? I.sibling : null;
          } else
            Es(t, Hd(Ul.current));
          break;
        }
        case Ke: {
          var F = (e.flags & Je) !== Ze, K = da(a, t.childLanes);
          if (F) {
            if (K)
              return ww(e, t, a);
            t.flags |= Je;
          }
          var te = t.memoizedState;
          if (te !== null && (te.rendering = null, te.tail = null, te.lastEffect = null), Es(t, Ul.current), K)
            break;
          return null;
        }
        case Re:
        case ut:
          return t.lanes = me, hw(e, t, a);
      }
      return wu(e, t, a);
    }
    function bw(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return mO(e, t, aE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || _y() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          Fl = !0;
        else {
          var d = kS(e, a);
          if (!d && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Je) === Ze)
            return Fl = !1, yO(e, t, a);
          (e.flags & Af) !== Ze ? Fl = !0 : Fl = !1;
        }
      } else if (Fl = !1, qr() && Vk(t)) {
        var m = t.index, S = Bk();
        e1(t, S, m);
      }
      switch (t.lanes = me, t.tag) {
        case R:
          return JD(e, t, t.type, a);
        case Ee: {
          var C = t.elementType;
          return XD(e, t, C, a);
        }
        case x: {
          var k = t.type, D = t.pendingProps, I = t.elementType === k ? D : Pl(k, D);
          return SS(e, t, k, I, a);
        }
        case T: {
          var F = t.type, K = t.pendingProps, te = t.elementType === F ? K : Pl(F, K);
          return mw(e, t, F, te, a);
        }
        case O:
          return GD(e, t, a);
        case L:
          return qD(e, t, a);
        case V:
          return QD(e, t);
        case W:
          return _w(e, t, a);
        case A:
          return pO(e, t, a);
        case ne: {
          var le = t.type, Ne = t.pendingProps, nt = t.elementType === le ? Ne : Pl(le, Ne);
          return fw(e, t, le, nt, a);
        }
        case N:
          return YD(e, t, a);
        case B:
          return $D(e, t, a);
        case se:
          return WD(e, t, a);
        case ee:
          return hO(e, t, a);
        case Q:
          return vO(e, t, a);
        case de: {
          var Xe = t.type, Nt = t.pendingProps, kt = Pl(Xe, Nt);
          if (t.type !== t.elementType) {
            var G = Xe.propTypes;
            G && Nl(
              G,
              kt,
              // Resolved for outer only
              "prop",
              At(Xe)
            );
          }
          return kt = Pl(Xe.type, kt), dw(e, t, Xe, kt, a);
        }
        case ue:
          return pw(e, t, t.type, t.pendingProps, a);
        case fe: {
          var oe = t.type, q = t.pendingProps, we = t.elementType === oe ? q : Pl(oe, q);
          return KD(e, t, oe, we, a);
        }
        case Ke:
          return ww(e, t, a);
        case We:
          break;
        case Re:
          return hw(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Wd(e) {
      e.flags |= Ot;
    }
    function Rw(e) {
      e.flags |= xn, e.flags |= es;
    }
    var kw, DS, Dw, Ow;
    kw = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === L || u.tag === V)
          FR(e, u.stateNode);
        else if (u.tag !== A) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, DS = function(e, t) {
    }, Dw = function(e, t, a, i, u) {
      var d = e.memoizedProps;
      if (d !== i) {
        var m = t.stateNode, S = w_(), C = IR(m, a, d, i, u, S);
        t.updateQueue = C, C && Wd(t);
      }
    }, Ow = function(e, t, a, i) {
      a !== i && Wd(t);
    };
    function av(e, t) {
      if (!qr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, d = null; u !== null; )
              u.alternate !== null && (d = u), u = u.sibling;
            d === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : d.sibling = null;
            break;
          }
        }
    }
    function Xr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = me, i = Ze;
      if (t) {
        if ((e.mode & Ht) !== et) {
          for (var C = e.selfBaseDuration, k = e.child; k !== null; )
            a = _t(a, _t(k.lanes, k.childLanes)), i |= k.subtreeFlags & Vn, i |= k.flags & Vn, C += k.treeBaseDuration, k = k.sibling;
          e.treeBaseDuration = C;
        } else
          for (var D = e.child; D !== null; )
            a = _t(a, _t(D.lanes, D.childLanes)), i |= D.subtreeFlags & Vn, i |= D.flags & Vn, D.return = e, D = D.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ht) !== et) {
          for (var u = e.actualDuration, d = e.selfBaseDuration, m = e.child; m !== null; )
            a = _t(a, _t(m.lanes, m.childLanes)), i |= m.subtreeFlags, i |= m.flags, u += m.actualDuration, d += m.treeBaseDuration, m = m.sibling;
          e.actualDuration = u, e.treeBaseDuration = d;
        } else
          for (var S = e.child; S !== null; )
            a = _t(a, _t(S.lanes, S.childLanes)), i |= S.subtreeFlags, i |= S.flags, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function gO(e, t, a) {
      if (nD() && (t.mode & Tt) !== et && (t.flags & Je) === Ze)
        return o1(t), zd(), t.flags |= Mr | ac | or, !1;
      var i = by(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (eD(t), Xr(t), (t.mode & Ht) !== et) {
            var u = a !== null;
            if (u) {
              var d = t.child;
              d !== null && (t.treeBaseDuration -= d.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (zd(), (t.flags & Je) === Ze && (t.memoizedState = null), t.flags |= Ot, Xr(t), (t.mode & Ht) !== et) {
            var m = a !== null;
            if (m) {
              var S = t.child;
              S !== null && (t.treeBaseDuration -= S.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return u1(), !0;
    }
    function Lw(e, t, a) {
      var i = t.pendingProps;
      switch (t_(t), t.tag) {
        case R:
        case Ee:
        case ue:
        case x:
        case ne:
        case N:
        case B:
        case se:
        case Q:
        case de:
          return Xr(t), null;
        case T: {
          var u = t.type;
          return Co(u) && Sy(t), Xr(t), null;
        }
        case O: {
          var d = t.stateNode;
          if (Fd(t), K0(t), k_(), d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null), e === null || e.child === null) {
            var m = by(t);
            if (m)
              Wd(t);
            else if (e !== null) {
              var S = e.memoizedState;
              // Check if this is a client root
              (!S.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Mr) !== Ze) && (t.flags |= er, u1());
            }
          }
          return DS(e, t), Xr(t), null;
        }
        case L: {
          x_(t);
          var C = w1(), k = t.type;
          if (e !== null && t.stateNode != null)
            Dw(e, t, k, i, C), e.ref !== t.ref && Rw(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Xr(t), null;
            }
            var D = w_(), I = by(t);
            if (I)
              Jk(t, C, D) && Wd(t);
            else {
              var F = PR(k, i, C, D, t);
              kw(F, t, !1, !1), t.stateNode = F, HR(F, k, i, C) && Wd(t);
            }
            t.ref !== null && Rw(t);
          }
          return Xr(t), null;
        }
        case V: {
          var K = i;
          if (e && t.stateNode != null) {
            var te = e.memoizedProps;
            Ow(e, t, te, K);
          } else {
            if (typeof K != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var le = w1(), Ne = w_(), nt = by(t);
            nt ? Zk(t) && Wd(t) : t.stateNode = VR(K, le, Ne, t);
          }
          return Xr(t), null;
        }
        case W: {
          Id(t);
          var Xe = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Nt = gO(e, t, Xe);
            if (!Nt)
              return t.flags & or ? t : null;
          }
          if ((t.flags & Je) !== Ze)
            return t.lanes = a, (t.mode & Ht) !== et && Z_(t), t;
          var kt = Xe !== null, G = e !== null && e.memoizedState !== null;
          if (kt !== G && kt) {
            var oe = t.child;
            if (oe.flags |= In, (t.mode & Tt) !== et) {
              var q = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              q || T_(Ul.current, b1) ? _L() : GS();
            }
          }
          var we = t.updateQueue;
          if (we !== null && (t.flags |= Ot), Xr(t), (t.mode & Ht) !== et && kt) {
            var je = t.child;
            je !== null && (t.treeBaseDuration -= je.treeBaseDuration);
          }
          return null;
        }
        case A:
          return Fd(t), DS(e, t), e === null && zk(t.stateNode.containerInfo), Xr(t), null;
        case ee:
          var Ae = t.type._context;
          return v_(Ae, t), Xr(t), null;
        case fe: {
          var ft = t.type;
          return Co(ft) && Sy(t), Xr(t), null;
        }
        case Ke: {
          Id(t);
          var mt = t.memoizedState;
          if (mt === null)
            return Xr(t), null;
          var nn = (t.flags & Je) !== Ze, Bt = mt.rendering;
          if (Bt === null)
            if (nn)
              av(mt, !1);
            else {
              var rr = EL() && (e === null || (e.flags & Je) === Ze);
              if (!rr)
                for (var Yt = t.child; Yt !== null; ) {
                  var qn = Vy(Yt);
                  if (qn !== null) {
                    nn = !0, t.flags |= Je, av(mt, !1);
                    var _a = qn.updateQueue;
                    return _a !== null && (t.updateQueue = _a, t.flags |= Ot), t.subtreeFlags = Ze, sD(t, a), Es(t, b_(Ul.current, $h)), t.child;
                  }
                  Yt = Yt.sibling;
                }
              mt.tail !== null && tr() > Jw() && (t.flags |= Je, nn = !0, av(mt, !1), t.lanes = Xp);
            }
          else {
            if (!nn) {
              var ta = Vy(Bt);
              if (ta !== null) {
                t.flags |= Je, nn = !0;
                var Di = ta.updateQueue;
                if (Di !== null && (t.updateQueue = Di, t.flags |= Ot), av(mt, !0), mt.tail === null && mt.tailMode === "hidden" && !Bt.alternate && !qr())
                  return Xr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              tr() * 2 - mt.renderingStartTime > Jw() && a !== fa && (t.flags |= Je, nn = !0, av(mt, !1), t.lanes = Xp);
            }
            if (mt.isBackwards)
              Bt.sibling = t.child, t.child = Bt;
            else {
              var Ua = mt.last;
              Ua !== null ? Ua.sibling = Bt : t.child = Bt, mt.last = Bt;
            }
          }
          if (mt.tail !== null) {
            var ja = mt.tail;
            mt.rendering = ja, mt.tail = ja.sibling, mt.renderingStartTime = tr(), ja.sibling = null;
            var Sa = Ul.current;
            return nn ? Sa = b_(Sa, $h) : Sa = Hd(Sa), Es(t, Sa), ja;
          }
          return Xr(t), null;
        }
        case We:
          break;
        case Re:
        case ut: {
          WS(t);
          var ku = t.memoizedState, ep = ku !== null;
          if (e !== null) {
            var Sv = e.memoizedState, Oo = Sv !== null;
            Oo !== ep && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ye && (t.flags |= In);
          }
          return !ep || (t.mode & Tt) === et ? Xr(t) : da(Do, fa) && (Xr(t), t.subtreeFlags & (Sn | Ot) && (t.flags |= In)), null;
        }
        case Ge:
          return null;
        case he:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function _O(e, t, a) {
      switch (t_(t), t.tag) {
        case T: {
          var i = t.type;
          Co(i) && Sy(t);
          var u = t.flags;
          return u & or ? (t.flags = u & ~or | Je, (t.mode & Ht) !== et && Z_(t), t) : null;
        }
        case O: {
          t.stateNode, Fd(t), K0(t), k_();
          var d = t.flags;
          return (d & or) !== Ze && (d & Je) === Ze ? (t.flags = d & ~or | Je, t) : null;
        }
        case L:
          return x_(t), null;
        case W: {
          Id(t);
          var m = t.memoizedState;
          if (m !== null && m.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            zd();
          }
          var S = t.flags;
          return S & or ? (t.flags = S & ~or | Je, (t.mode & Ht) !== et && Z_(t), t) : null;
        }
        case Ke:
          return Id(t), null;
        case A:
          return Fd(t), null;
        case ee:
          var C = t.type._context;
          return v_(C, t), null;
        case Re:
        case ut:
          return WS(t), null;
        case Ge:
          return null;
        default:
          return null;
      }
    }
    function Mw(e, t, a) {
      switch (t_(t), t.tag) {
        case T: {
          var i = t.type.childContextTypes;
          i != null && Sy(t);
          break;
        }
        case O: {
          t.stateNode, Fd(t), K0(t), k_();
          break;
        }
        case L: {
          x_(t);
          break;
        }
        case A:
          Fd(t);
          break;
        case W:
          Id(t);
          break;
        case Ke:
          Id(t);
          break;
        case ee:
          var u = t.type._context;
          v_(u, t);
          break;
        case Re:
        case ut:
          WS(t);
          break;
      }
    }
    var Nw = null;
    Nw = /* @__PURE__ */ new Set();
    var dg = !1, Kr = !1, SO = typeof WeakSet == "function" ? WeakSet : Set, Be = null, Gd = null, qd = null;
    function EO(e) {
      ro(null, function() {
        throw e;
      }), rc();
    }
    var CO = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ht)
        try {
          Ro(), t.componentWillUnmount();
        } finally {
          bo(e);
        }
      else
        t.componentWillUnmount();
    };
    function Aw(e, t) {
      try {
        xs(Cr, e);
      } catch (a) {
        pn(e, t, a);
      }
    }
    function OS(e, t, a) {
      try {
        CO(e, a);
      } catch (i) {
        pn(e, t, i);
      }
    }
    function wO(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        pn(e, t, i);
      }
    }
    function zw(e, t) {
      try {
        jw(e);
      } catch (a) {
        pn(e, t, a);
      }
    }
    function Qd(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (be && qe && e.mode & Ht)
              try {
                Ro(), i = a(null);
              } finally {
                bo(e);
              }
            else
              i = a(null);
          } catch (u) {
            pn(e, t, u);
          }
          typeof i == "function" && h("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", pt(e));
        } else
          a.current = null;
    }
    function pg(e, t, a) {
      try {
        a();
      } catch (i) {
        pn(e, t, i);
      }
    }
    var Uw = !1;
    function xO(e, t) {
      UR(e.containerInfo), Be = t, TO();
      var a = Uw;
      return Uw = !1, a;
    }
    function TO() {
      for (; Be !== null; ) {
        var e = Be, t = e.child;
        (e.subtreeFlags & io) !== Ze && t !== null ? (t.return = e, Be = t) : bO();
      }
    }
    function bO() {
      for (; Be !== null; ) {
        var e = Be;
        Kt(e);
        try {
          RO(e);
        } catch (a) {
          pn(e, e.return, a);
        }
        dn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Be = t;
          return;
        }
        Be = e.return;
      }
    }
    function RO(e) {
      var t = e.alternate, a = e.flags;
      if ((a & er) !== Ze) {
        switch (Kt(e), e.tag) {
          case x:
          case ne:
          case ue:
            break;
          case T: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, d = e.stateNode;
              e.type === e.elementType && !Xc && (d.props !== e.memoizedProps && h("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(e) || "instance"), d.state !== e.memoizedState && h("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(e) || "instance"));
              var m = d.getSnapshotBeforeUpdate(e.elementType === e.type ? i : Pl(e.type, i), u);
              {
                var S = Nw;
                m === void 0 && !S.has(e.type) && (S.add(e.type), h("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", pt(e)));
              }
              d.__reactInternalSnapshotBeforeUpdate = m;
            }
            break;
          }
          case O: {
            {
              var C = e.stateNode;
              ok(C.containerInfo);
            }
            break;
          }
          case L:
          case V:
          case A:
          case fe:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        dn();
      }
    }
    function Hl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var d = u.next, m = d;
        do {
          if ((m.tag & e) === e) {
            var S = m.destroy;
            m.destroy = void 0, S !== void 0 && ((e & Qr) !== ti ? Rl(t) : (e & Cr) !== ti && lc(t), (e & wo) !== ti && yv(!0), pg(t, a, S), (e & wo) !== ti && yv(!1), (e & Qr) !== ti ? so() : (e & Cr) !== ti && qp());
          }
          m = m.next;
        } while (m !== d);
      }
    }
    function xs(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, d = u;
        do {
          if ((d.tag & e) === e) {
            (e & Qr) !== ti ? Gp(t) : (e & Cr) !== ti && Hf(t);
            var m = d.create;
            (e & wo) !== ti && yv(!0), d.destroy = m(), (e & wo) !== ti && yv(!1), (e & Qr) !== ti ? gm() : (e & Cr) !== ti && _m();
            {
              var S = d.destroy;
              if (S !== void 0 && typeof S != "function") {
                var C = void 0;
                (d.tag & Cr) !== Ze ? C = "useLayoutEffect" : (d.tag & wo) !== Ze ? C = "useInsertionEffect" : C = "useEffect";
                var k = void 0;
                S === null ? k = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof S.then == "function" ? k = `

It looks like you wrote ` + C + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + C + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : k = " You returned: " + S, h("%s must not return anything besides a function, which is used for clean-up.%s", C, k);
              }
            }
          }
          d = d.next;
        } while (d !== u);
      }
    }
    function kO(e, t) {
      if ((t.flags & Ot) !== Ze)
        switch (t.tag) {
          case se: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, d = i.onPostCommit, m = J1(), S = t.alternate === null ? "mount" : "update";
            K1() && (S = "nested-update"), typeof d == "function" && d(u, S, a, m);
            var C = t.return;
            e: for (; C !== null; ) {
              switch (C.tag) {
                case O:
                  var k = C.stateNode;
                  k.passiveEffectDuration += a;
                  break e;
                case se:
                  var D = C.stateNode;
                  D.passiveEffectDuration += a;
                  break e;
              }
              C = C.return;
            }
            break;
          }
        }
    }
    function DO(e, t, a, i) {
      if ((a.flags & oo) !== Ze)
        switch (a.tag) {
          case x:
          case ne:
          case ue: {
            if (!Kr)
              if (a.mode & Ht)
                try {
                  Ro(), xs(Cr | Er, a);
                } finally {
                  bo(a);
                }
              else
                xs(Cr | Er, a);
            break;
          }
          case T: {
            var u = a.stateNode;
            if (a.flags & Ot && !Kr)
              if (t === null)
                if (a.type === a.elementType && !Xc && (u.props !== a.memoizedProps && h("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), u.state !== a.memoizedState && h("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), a.mode & Ht)
                  try {
                    Ro(), u.componentDidMount();
                  } finally {
                    bo(a);
                  }
                else
                  u.componentDidMount();
              else {
                var d = a.elementType === a.type ? t.memoizedProps : Pl(a.type, t.memoizedProps), m = t.memoizedState;
                if (a.type === a.elementType && !Xc && (u.props !== a.memoizedProps && h("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), u.state !== a.memoizedState && h("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), a.mode & Ht)
                  try {
                    Ro(), u.componentDidUpdate(d, m, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    bo(a);
                  }
                else
                  u.componentDidUpdate(d, m, u.__reactInternalSnapshotBeforeUpdate);
              }
            var S = a.updateQueue;
            S !== null && (a.type === a.elementType && !Xc && (u.props !== a.memoizedProps && h("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), u.state !== a.memoizedState && h("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), C1(a, S, u));
            break;
          }
          case O: {
            var C = a.updateQueue;
            if (C !== null) {
              var k = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case L:
                    k = a.child.stateNode;
                    break;
                  case T:
                    k = a.child.stateNode;
                    break;
                }
              C1(a, C, k);
            }
            break;
          }
          case L: {
            var D = a.stateNode;
            if (t === null && a.flags & Ot) {
              var I = a.type, F = a.memoizedProps;
              GR(D, I, F);
            }
            break;
          }
          case V:
            break;
          case A:
            break;
          case se: {
            {
              var K = a.memoizedProps, te = K.onCommit, le = K.onRender, Ne = a.stateNode.effectDuration, nt = J1(), Xe = t === null ? "mount" : "update";
              K1() && (Xe = "nested-update"), typeof le == "function" && le(a.memoizedProps.id, Xe, a.actualDuration, a.treeBaseDuration, a.actualStartTime, nt);
              {
                typeof te == "function" && te(a.memoizedProps.id, Xe, Ne, nt), bL(a);
                var Nt = a.return;
                e: for (; Nt !== null; ) {
                  switch (Nt.tag) {
                    case O:
                      var kt = Nt.stateNode;
                      kt.effectDuration += Ne;
                      break e;
                    case se:
                      var G = Nt.stateNode;
                      G.effectDuration += Ne;
                      break e;
                  }
                  Nt = Nt.return;
                }
              }
            }
            break;
          }
          case W: {
            jO(e, a);
            break;
          }
          case Ke:
          case fe:
          case We:
          case Re:
          case ut:
          case he:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Kr || a.flags & xn && jw(a);
    }
    function OO(e) {
      switch (e.tag) {
        case x:
        case ne:
        case ue: {
          if (e.mode & Ht)
            try {
              Ro(), Aw(e, e.return);
            } finally {
              bo(e);
            }
          else
            Aw(e, e.return);
          break;
        }
        case T: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && wO(e, e.return, t), zw(e, e.return);
          break;
        }
        case L: {
          zw(e, e.return);
          break;
        }
      }
    }
    function LO(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === L) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? rk(u) : ik(i.stateNode, i.memoizedProps);
            } catch (m) {
              pn(e, e.return, m);
            }
          }
        } else if (i.tag === V) {
          if (a === null)
            try {
              var d = i.stateNode;
              t ? ak(d) : lk(d, i.memoizedProps);
            } catch (m) {
              pn(e, e.return, m);
            }
        } else if (!((i.tag === Re || i.tag === ut) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function jw(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case L:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Ht)
            try {
              Ro(), u = t(i);
            } finally {
              bo(e);
            }
          else
            u = t(i);
          typeof u == "function" && h("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", pt(e));
        } else
          t.hasOwnProperty("current") || h("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", pt(e)), t.current = i;
      }
    }
    function MO(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function Pw(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Pw(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === L) {
          var a = e.stateNode;
          a !== null && Pk(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function NO(e) {
      for (var t = e.return; t !== null; ) {
        if (Fw(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Fw(e) {
      return e.tag === L || e.tag === O || e.tag === A;
    }
    function Hw(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Fw(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== L && t.tag !== V && t.tag !== Ye; ) {
          if (t.flags & Sn || t.child === null || t.tag === A)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & Sn))
          return t.stateNode;
      }
    }
    function AO(e) {
      var t = NO(e);
      switch (t.tag) {
        case L: {
          var a = t.stateNode;
          t.flags & $a && (VC(a), t.flags &= ~$a);
          var i = Hw(e);
          MS(e, i, a);
          break;
        }
        case O:
        case A: {
          var u = t.stateNode.containerInfo, d = Hw(e);
          LS(e, d, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function LS(e, t, a) {
      var i = e.tag, u = i === L || i === V;
      if (u) {
        var d = e.stateNode;
        t ? ZR(a, d, t) : KR(a, d);
      } else if (i !== A) {
        var m = e.child;
        if (m !== null) {
          LS(m, t, a);
          for (var S = m.sibling; S !== null; )
            LS(S, t, a), S = S.sibling;
        }
      }
    }
    function MS(e, t, a) {
      var i = e.tag, u = i === L || i === V;
      if (u) {
        var d = e.stateNode;
        t ? JR(a, d, t) : XR(a, d);
      } else if (i !== A) {
        var m = e.child;
        if (m !== null) {
          MS(m, t, a);
          for (var S = m.sibling; S !== null; )
            MS(S, t, a), S = S.sibling;
        }
      }
    }
    var Jr = null, Il = !1;
    function zO(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case L: {
              Jr = i.stateNode, Il = !1;
              break e;
            }
            case O: {
              Jr = i.stateNode.containerInfo, Il = !0;
              break e;
            }
            case A: {
              Jr = i.stateNode.containerInfo, Il = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Jr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        Iw(e, t, a), Jr = null, Il = !1;
      }
      MO(a);
    }
    function Ts(e, t, a) {
      for (var i = a.child; i !== null; )
        Iw(e, t, i), i = i.sibling;
    }
    function Iw(e, t, a) {
      switch (Yp(a), a.tag) {
        case L:
          Kr || Qd(a, t);
        case V: {
          {
            var i = Jr, u = Il;
            Jr = null, Ts(e, t, a), Jr = i, Il = u, Jr !== null && (Il ? tk(Jr, a.stateNode) : ek(Jr, a.stateNode));
          }
          return;
        }
        case Ye: {
          Jr !== null && (Il ? nk(Jr, a.stateNode) : B0(Jr, a.stateNode));
          return;
        }
        case A: {
          {
            var d = Jr, m = Il;
            Jr = a.stateNode.containerInfo, Il = !0, Ts(e, t, a), Jr = d, Il = m;
          }
          return;
        }
        case x:
        case ne:
        case de:
        case ue: {
          if (!Kr) {
            var S = a.updateQueue;
            if (S !== null) {
              var C = S.lastEffect;
              if (C !== null) {
                var k = C.next, D = k;
                do {
                  var I = D, F = I.destroy, K = I.tag;
                  F !== void 0 && ((K & wo) !== ti ? pg(a, t, F) : (K & Cr) !== ti && (lc(a), a.mode & Ht ? (Ro(), pg(a, t, F), bo(a)) : pg(a, t, F), qp())), D = D.next;
                } while (D !== k);
              }
            }
          }
          Ts(e, t, a);
          return;
        }
        case T: {
          if (!Kr) {
            Qd(a, t);
            var te = a.stateNode;
            typeof te.componentWillUnmount == "function" && OS(a, t, te);
          }
          Ts(e, t, a);
          return;
        }
        case We: {
          Ts(e, t, a);
          return;
        }
        case Re: {
          if (
            // TODO: Remove this dead flag
            a.mode & Tt
          ) {
            var le = Kr;
            Kr = le || a.memoizedState !== null, Ts(e, t, a), Kr = le;
          } else
            Ts(e, t, a);
          break;
        }
        default: {
          Ts(e, t, a);
          return;
        }
      }
    }
    function UO(e) {
      e.memoizedState;
    }
    function jO(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var d = u.dehydrated;
            d !== null && Ek(d);
          }
        }
      }
    }
    function Vw(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new SO()), t.forEach(function(i) {
          var u = NL.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), ca)
              if (Gd !== null && qd !== null)
                mv(qd, Gd);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function PO(e, t, a) {
      Gd = a, qd = e, Kt(t), Bw(t, e), Kt(t), Gd = null, qd = null;
    }
    function Vl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var d = i[u];
          try {
            zO(e, t, d);
          } catch (C) {
            pn(d, t, C);
          }
        }
      var m = Xl();
      if (t.subtreeFlags & lo)
        for (var S = t.child; S !== null; )
          Kt(S), Bw(S, e), S = S.sibling;
      Kt(m);
    }
    function Bw(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case x:
        case ne:
        case de:
        case ue: {
          if (Vl(t, e), ko(e), u & Ot) {
            try {
              Hl(wo | Er, e, e.return), xs(wo | Er, e);
            } catch (ft) {
              pn(e, e.return, ft);
            }
            if (e.mode & Ht) {
              try {
                Ro(), Hl(Cr | Er, e, e.return);
              } catch (ft) {
                pn(e, e.return, ft);
              }
              bo(e);
            } else
              try {
                Hl(Cr | Er, e, e.return);
              } catch (ft) {
                pn(e, e.return, ft);
              }
          }
          return;
        }
        case T: {
          Vl(t, e), ko(e), u & xn && i !== null && Qd(i, i.return);
          return;
        }
        case L: {
          Vl(t, e), ko(e), u & xn && i !== null && Qd(i, i.return);
          {
            if (e.flags & $a) {
              var d = e.stateNode;
              try {
                VC(d);
              } catch (ft) {
                pn(e, e.return, ft);
              }
            }
            if (u & Ot) {
              var m = e.stateNode;
              if (m != null) {
                var S = e.memoizedProps, C = i !== null ? i.memoizedProps : S, k = e.type, D = e.updateQueue;
                if (e.updateQueue = null, D !== null)
                  try {
                    qR(m, D, k, C, S, e);
                  } catch (ft) {
                    pn(e, e.return, ft);
                  }
              }
            }
          }
          return;
        }
        case V: {
          if (Vl(t, e), ko(e), u & Ot) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var I = e.stateNode, F = e.memoizedProps, K = i !== null ? i.memoizedProps : F;
            try {
              QR(I, K, F);
            } catch (ft) {
              pn(e, e.return, ft);
            }
          }
          return;
        }
        case O: {
          if (Vl(t, e), ko(e), u & Ot && i !== null) {
            var te = i.memoizedState;
            if (te.isDehydrated)
              try {
                Sk(t.containerInfo);
              } catch (ft) {
                pn(e, e.return, ft);
              }
          }
          return;
        }
        case A: {
          Vl(t, e), ko(e);
          return;
        }
        case W: {
          Vl(t, e), ko(e);
          var le = e.child;
          if (le.flags & In) {
            var Ne = le.stateNode, nt = le.memoizedState, Xe = nt !== null;
            if (Ne.isHidden = Xe, Xe) {
              var Nt = le.alternate !== null && le.alternate.memoizedState !== null;
              Nt || gL();
            }
          }
          if (u & Ot) {
            try {
              UO(e);
            } catch (ft) {
              pn(e, e.return, ft);
            }
            Vw(e);
          }
          return;
        }
        case Re: {
          var kt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Tt
          ) {
            var G = Kr;
            Kr = G || kt, Vl(t, e), Kr = G;
          } else
            Vl(t, e);
          if (ko(e), u & In) {
            var oe = e.stateNode, q = e.memoizedState, we = q !== null, je = e;
            if (oe.isHidden = we, we && !kt && (je.mode & Tt) !== et) {
              Be = je;
              for (var Ae = je.child; Ae !== null; )
                Be = Ae, HO(Ae), Ae = Ae.sibling;
            }
            LO(je, we);
          }
          return;
        }
        case Ke: {
          Vl(t, e), ko(e), u & Ot && Vw(e);
          return;
        }
        case We:
          return;
        default: {
          Vl(t, e), ko(e);
          return;
        }
      }
    }
    function ko(e) {
      var t = e.flags;
      if (t & Sn) {
        try {
          AO(e);
        } catch (a) {
          pn(e, e.return, a);
        }
        e.flags &= ~Sn;
      }
      t & oa && (e.flags &= ~oa);
    }
    function FO(e, t, a) {
      Gd = a, qd = t, Be = e, Yw(e, t, a), Gd = null, qd = null;
    }
    function Yw(e, t, a) {
      for (var i = (e.mode & Tt) !== et; Be !== null; ) {
        var u = Be, d = u.child;
        if (u.tag === Re && i) {
          var m = u.memoizedState !== null, S = m || dg;
          if (S) {
            NS(e, t, a);
            continue;
          } else {
            var C = u.alternate, k = C !== null && C.memoizedState !== null, D = k || Kr, I = dg, F = Kr;
            dg = S, Kr = D, Kr && !F && (Be = u, IO(u));
            for (var K = d; K !== null; )
              Be = K, Yw(
                K,
                // New root; bubble back up to here and stop.
                t,
                a
              ), K = K.sibling;
            Be = u, dg = I, Kr = F, NS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & oo) !== Ze && d !== null ? (d.return = u, Be = d) : NS(e, t, a);
      }
    }
    function NS(e, t, a) {
      for (; Be !== null; ) {
        var i = Be;
        if ((i.flags & oo) !== Ze) {
          var u = i.alternate;
          Kt(i);
          try {
            DO(t, u, i, a);
          } catch (m) {
            pn(i, i.return, m);
          }
          dn();
        }
        if (i === e) {
          Be = null;
          return;
        }
        var d = i.sibling;
        if (d !== null) {
          d.return = i.return, Be = d;
          return;
        }
        Be = i.return;
      }
    }
    function HO(e) {
      for (; Be !== null; ) {
        var t = Be, a = t.child;
        switch (t.tag) {
          case x:
          case ne:
          case de:
          case ue: {
            if (t.mode & Ht)
              try {
                Ro(), Hl(Cr, t, t.return);
              } finally {
                bo(t);
              }
            else
              Hl(Cr, t, t.return);
            break;
          }
          case T: {
            Qd(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && OS(t, t.return, i);
            break;
          }
          case L: {
            Qd(t, t.return);
            break;
          }
          case Re: {
            var u = t.memoizedState !== null;
            if (u) {
              $w(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Be = a) : $w(e);
      }
    }
    function $w(e) {
      for (; Be !== null; ) {
        var t = Be;
        if (t === e) {
          Be = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Be = a;
          return;
        }
        Be = t.return;
      }
    }
    function IO(e) {
      for (; Be !== null; ) {
        var t = Be, a = t.child;
        if (t.tag === Re) {
          var i = t.memoizedState !== null;
          if (i) {
            Ww(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Be = a) : Ww(e);
      }
    }
    function Ww(e) {
      for (; Be !== null; ) {
        var t = Be;
        Kt(t);
        try {
          OO(t);
        } catch (i) {
          pn(t, t.return, i);
        }
        if (dn(), t === e) {
          Be = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Be = a;
          return;
        }
        Be = t.return;
      }
    }
    function VO(e, t, a, i) {
      Be = t, BO(t, e, a, i);
    }
    function BO(e, t, a, i) {
      for (; Be !== null; ) {
        var u = Be, d = u.child;
        (u.subtreeFlags & Tl) !== Ze && d !== null ? (d.return = u, Be = d) : YO(e, t, a, i);
      }
    }
    function YO(e, t, a, i) {
      for (; Be !== null; ) {
        var u = Be;
        if ((u.flags & la) !== Ze) {
          Kt(u);
          try {
            $O(t, u, a, i);
          } catch (m) {
            pn(u, u.return, m);
          }
          dn();
        }
        if (u === e) {
          Be = null;
          return;
        }
        var d = u.sibling;
        if (d !== null) {
          d.return = u.return, Be = d;
          return;
        }
        Be = u.return;
      }
    }
    function $O(e, t, a, i) {
      switch (t.tag) {
        case x:
        case ne:
        case ue: {
          if (t.mode & Ht) {
            J_();
            try {
              xs(Qr | Er, t);
            } finally {
              K_(t);
            }
          } else
            xs(Qr | Er, t);
          break;
        }
      }
    }
    function WO(e) {
      Be = e, GO();
    }
    function GO() {
      for (; Be !== null; ) {
        var e = Be, t = e.child;
        if ((Be.flags & Ya) !== Ze) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Be = u, XO(u, e);
            }
            {
              var d = e.alternate;
              if (d !== null) {
                var m = d.child;
                if (m !== null) {
                  d.child = null;
                  do {
                    var S = m.sibling;
                    m.sibling = null, m = S;
                  } while (m !== null);
                }
              }
            }
            Be = e;
          }
        }
        (e.subtreeFlags & Tl) !== Ze && t !== null ? (t.return = e, Be = t) : qO();
      }
    }
    function qO() {
      for (; Be !== null; ) {
        var e = Be;
        (e.flags & la) !== Ze && (Kt(e), QO(e), dn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Be = t;
          return;
        }
        Be = e.return;
      }
    }
    function QO(e) {
      switch (e.tag) {
        case x:
        case ne:
        case ue: {
          e.mode & Ht ? (J_(), Hl(Qr | Er, e, e.return), K_(e)) : Hl(Qr | Er, e, e.return);
          break;
        }
      }
    }
    function XO(e, t) {
      for (; Be !== null; ) {
        var a = Be;
        Kt(a), JO(a, t), dn();
        var i = a.child;
        i !== null ? (i.return = a, Be = i) : KO(e);
      }
    }
    function KO(e) {
      for (; Be !== null; ) {
        var t = Be, a = t.sibling, i = t.return;
        if (Pw(t), t === e) {
          Be = null;
          return;
        }
        if (a !== null) {
          a.return = i, Be = a;
          return;
        }
        Be = i;
      }
    }
    function JO(e, t) {
      switch (e.tag) {
        case x:
        case ne:
        case ue: {
          e.mode & Ht ? (J_(), Hl(Qr, e, t), K_(e)) : Hl(Qr, e, t);
          break;
        }
      }
    }
    function ZO(e) {
      switch (e.tag) {
        case x:
        case ne:
        case ue: {
          try {
            xs(Cr | Er, e);
          } catch (a) {
            pn(e, e.return, a);
          }
          break;
        }
        case T: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            pn(e, e.return, a);
          }
          break;
        }
      }
    }
    function eL(e) {
      switch (e.tag) {
        case x:
        case ne:
        case ue: {
          try {
            xs(Qr | Er, e);
          } catch (t) {
            pn(e, e.return, t);
          }
          break;
        }
      }
    }
    function tL(e) {
      switch (e.tag) {
        case x:
        case ne:
        case ue: {
          try {
            Hl(Cr | Er, e, e.return);
          } catch (a) {
            pn(e, e.return, a);
          }
          break;
        }
        case T: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && OS(e, e.return, t);
          break;
        }
      }
    }
    function nL(e) {
      switch (e.tag) {
        case x:
        case ne:
        case ue:
          try {
            Hl(Qr | Er, e, e.return);
          } catch (t) {
            pn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var iv = Symbol.for;
      iv("selector.component"), iv("selector.has_pseudo_class"), iv("selector.role"), iv("selector.test_id"), iv("selector.text");
    }
    var rL = [];
    function aL() {
      rL.forEach(function(e) {
        return e();
      });
    }
    var iL = s.ReactCurrentActQueue;
    function lL(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function Gw() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && iL.current !== null && h("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var oL = Math.ceil, AS = s.ReactCurrentDispatcher, zS = s.ReactCurrentOwner, Zr = s.ReactCurrentBatchConfig, Bl = s.ReactCurrentActQueue, Tr = (
      /*             */
      0
    ), qw = (
      /*               */
      1
    ), ea = (
      /*                */
      2
    ), cl = (
      /*                */
      4
    ), xu = 0, lv = 1, Kc = 2, hg = 3, ov = 4, Qw = 5, US = 6, Mt = Tr, Aa = null, An = null, br = me, Do = me, jS = vs(me), Rr = xu, uv = null, vg = me, sv = me, mg = me, cv = null, ni = null, PS = 0, Xw = 500, Kw = 1 / 0, uL = 500, Tu = null;
    function fv() {
      Kw = tr() + uL;
    }
    function Jw() {
      return Kw;
    }
    var yg = !1, FS = null, Xd = null, Jc = !1, bs = null, dv = me, HS = [], IS = null, sL = 50, pv = 0, VS = null, BS = !1, gg = !1, cL = 50, Kd = 0, _g = null, hv = rn, Sg = me, Zw = !1;
    function Eg() {
      return Aa;
    }
    function za() {
      return (Mt & (ea | cl)) !== Tr ? tr() : (hv !== rn || (hv = tr()), hv);
    }
    function Rs(e) {
      var t = e.mode;
      if ((t & Tt) === et)
        return st;
      if ((Mt & ea) !== Tr && br !== me)
        return _c(br);
      var a = iD() !== aD;
      if (a) {
        if (Zr.transition !== null) {
          var i = Zr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Sg === jt && (Sg = nh()), Sg;
      }
      var u = Ka();
      if (u !== jt)
        return u;
      var d = BR();
      return d;
    }
    function fL(e) {
      var t = e.mode;
      return (t & Tt) === et ? st : Tm();
    }
    function kr(e, t, a, i) {
      zL(), Zw && h("useInsertionEffect must not schedule updates."), BS && (gg = !0), as(e, a, i), (Mt & ea) !== me && e === Aa ? PL(t) : (ca && Cc(e, t, a), FL(t), e === Aa && ((Mt & ea) === Tr && (sv = _t(sv, a)), Rr === ov && ks(e, br)), ri(e, i), a === st && Mt === Tr && (t.mode & Tt) === et && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !Bl.isBatchingLegacy && (fv(), ZC()));
    }
    function dL(e, t, a) {
      var i = e.current;
      i.lanes = t, as(e, t, a), ri(e, a);
    }
    function pL(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Mt & ea) !== Tr
      );
    }
    function ri(e, t) {
      var a = e.callbackNode;
      ld(e, t);
      var i = id(e, e === Aa ? br : me);
      if (i === me) {
        a !== null && vx(a), e.callbackNode = null, e.callbackPriority = jt;
        return;
      }
      var u = po(i), d = e.callbackPriority;
      if (d === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(Bl.current !== null && a !== XS)) {
        a == null && d !== st && h("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && vx(a);
      var m;
      if (u === st)
        e.tag === ms ? (Bl.isBatchingLegacy !== null && (Bl.didScheduleLegacyUpdate = !0), Ik(nx.bind(null, e))) : JC(nx.bind(null, e)), Bl.current !== null ? Bl.current.push(ys) : $R(function() {
          (Mt & (ea | cl)) === Tr && ys();
        }), m = null;
      else {
        var S;
        switch (Mm(i)) {
          case Br:
            S = ic;
            break;
          case el:
            S = uo;
            break;
          case Qa:
            S = bl;
            break;
          case Xa:
            S = Jo;
            break;
          default:
            S = bl;
            break;
        }
        m = KS(S, ex.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = m;
    }
    function ex(e, t) {
      if (LD(), hv = rn, Sg = me, (Mt & (ea | cl)) !== Tr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Ru();
      if (i && e.callbackNode !== a)
        return null;
      var u = id(e, e === Aa ? br : me);
      if (u === me)
        return null;
      var d = !ud(e, u) && !xm(e, u) && !t, m = d ? wL(e, u) : wg(e, u);
      if (m !== xu) {
        if (m === Kc) {
          var S = od(e);
          S !== me && (u = S, m = YS(e, S));
        }
        if (m === lv) {
          var C = uv;
          throw Zc(e, me), ks(e, u), ri(e, tr()), C;
        }
        if (m === US)
          ks(e, u);
        else {
          var k = !ud(e, u), D = e.current.alternate;
          if (k && !vL(D)) {
            if (m = wg(e, u), m === Kc) {
              var I = od(e);
              I !== me && (u = I, m = YS(e, I));
            }
            if (m === lv) {
              var F = uv;
              throw Zc(e, me), ks(e, u), ri(e, tr()), F;
            }
          }
          e.finishedWork = D, e.finishedLanes = u, hL(e, m, u);
        }
      }
      return ri(e, tr()), e.callbackNode === a ? ex.bind(null, e) : null;
    }
    function YS(e, t) {
      var a = cv;
      if (fd(e)) {
        var i = Zc(e, t);
        i.flags |= Mr, Ak(e.containerInfo);
      }
      var u = wg(e, t);
      if (u !== Kc) {
        var d = ni;
        ni = a, d !== null && tx(d);
      }
      return u;
    }
    function tx(e) {
      ni === null ? ni = e : ni.push.apply(ni, e);
    }
    function hL(e, t, a) {
      switch (t) {
        case xu:
        case lv:
          throw new Error("Root did not complete. This is a bug in React.");
        case Kc: {
          ef(e, ni, Tu);
          break;
        }
        case hg: {
          if (ks(e, a), su(a) && // do not delay if we're inside an act() scope
          !mx()) {
            var i = PS + Xw - tr();
            if (i > 10) {
              var u = id(e, me);
              if (u !== me)
                break;
              var d = e.suspendedLanes;
              if (!cu(d, a)) {
                za(), sd(e, d);
                break;
              }
              e.timeoutHandle = I0(ef.bind(null, e, ni, Tu), i);
              break;
            }
          }
          ef(e, ni, Tu);
          break;
        }
        case ov: {
          if (ks(e, a), eh(a))
            break;
          if (!mx()) {
            var m = xi(e, a), S = m, C = tr() - S, k = AL(C) - C;
            if (k > 10) {
              e.timeoutHandle = I0(ef.bind(null, e, ni, Tu), k);
              break;
            }
          }
          ef(e, ni, Tu);
          break;
        }
        case Qw: {
          ef(e, ni, Tu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function vL(e) {
      for (var t = e; ; ) {
        if (t.flags & Zu) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var d = i[u], m = d.getSnapshot, S = d.value;
                try {
                  if (!Se(m(), S))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var C = t.child;
        if (t.subtreeFlags & Zu && C !== null) {
          C.return = t, t = C;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function ks(e, t) {
      t = Sc(t, mg), t = Sc(t, sv), km(e, t);
    }
    function nx(e) {
      if (MD(), (Mt & (ea | cl)) !== Tr)
        throw new Error("Should not already be working.");
      Ru();
      var t = id(e, me);
      if (!da(t, st))
        return ri(e, tr()), null;
      var a = wg(e, t);
      if (e.tag !== ms && a === Kc) {
        var i = od(e);
        i !== me && (t = i, a = YS(e, i));
      }
      if (a === lv) {
        var u = uv;
        throw Zc(e, me), ks(e, t), ri(e, tr()), u;
      }
      if (a === US)
        throw new Error("Root did not complete. This is a bug in React.");
      var d = e.current.alternate;
      return e.finishedWork = d, e.finishedLanes = t, ef(e, ni, Tu), ri(e, tr()), null;
    }
    function mL(e, t) {
      t !== me && (cd(e, _t(t, st)), ri(e, tr()), (Mt & (ea | cl)) === Tr && (fv(), ys()));
    }
    function $S(e, t) {
      var a = Mt;
      Mt |= qw;
      try {
        return e(t);
      } finally {
        Mt = a, Mt === Tr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !Bl.isBatchingLegacy && (fv(), ZC());
      }
    }
    function yL(e, t, a, i, u) {
      var d = Ka(), m = Zr.transition;
      try {
        return Zr.transition = null, $n(Br), e(t, a, i, u);
      } finally {
        $n(d), Zr.transition = m, Mt === Tr && fv();
      }
    }
    function bu(e) {
      bs !== null && bs.tag === ms && (Mt & (ea | cl)) === Tr && Ru();
      var t = Mt;
      Mt |= qw;
      var a = Zr.transition, i = Ka();
      try {
        return Zr.transition = null, $n(Br), e ? e() : void 0;
      } finally {
        $n(i), Zr.transition = a, Mt = t, (Mt & (ea | cl)) === Tr && ys();
      }
    }
    function rx() {
      return (Mt & (ea | cl)) !== Tr;
    }
    function Cg(e, t) {
      ya(jS, Do, e), Do = _t(Do, t);
    }
    function WS(e) {
      Do = jS.current, ma(jS, e);
    }
    function Zc(e, t) {
      e.finishedWork = null, e.finishedLanes = me;
      var a = e.timeoutHandle;
      if (a !== V0 && (e.timeoutHandle = V0, YR(a)), An !== null)
        for (var i = An.return; i !== null; ) {
          var u = i.alternate;
          Mw(u, i), i = i.return;
        }
      Aa = e;
      var d = tf(e.current, null);
      return An = d, br = Do = t, Rr = xu, uv = null, vg = me, sv = me, mg = me, cv = null, ni = null, dD(), zl.discardPendingWarnings(), d;
    }
    function ax(e, t) {
      do {
        var a = An;
        try {
          if (My(), k1(), dn(), zS.current = null, a === null || a.return === null) {
            Rr = lv, uv = t, An = null;
            return;
          }
          if (be && a.mode & Ht && og(a, !0), Pe)
            if (Oa(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Zi(a, i, br);
            } else
              oc(a, t, br);
          ID(e, a.return, a, t, br), ux(a);
        } catch (u) {
          t = u, An === a && a !== null ? (a = a.return, An = a) : a = An;
          continue;
        }
        return;
      } while (!0);
    }
    function ix() {
      var e = AS.current;
      return AS.current = ng, e === null ? ng : e;
    }
    function lx(e) {
      AS.current = e;
    }
    function gL() {
      PS = tr();
    }
    function vv(e) {
      vg = _t(e, vg);
    }
    function _L() {
      Rr === xu && (Rr = hg);
    }
    function GS() {
      (Rr === xu || Rr === hg || Rr === Kc) && (Rr = ov), Aa !== null && (gc(vg) || gc(sv)) && ks(Aa, br);
    }
    function SL(e) {
      Rr !== ov && (Rr = Kc), cv === null ? cv = [e] : cv.push(e);
    }
    function EL() {
      return Rr === xu;
    }
    function wg(e, t) {
      var a = Mt;
      Mt |= ea;
      var i = ix();
      if (Aa !== e || br !== t) {
        if (ca) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (mv(e, br), u.clear()), Dm(e, t);
        }
        Tu = lh(), Zc(e, t);
      }
      nu(t);
      do
        try {
          CL();
          break;
        } catch (d) {
          ax(e, d);
        }
      while (!0);
      if (My(), Mt = a, lx(i), An !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return If(), Aa = null, br = me, Rr;
    }
    function CL() {
      for (; An !== null; )
        ox(An);
    }
    function wL(e, t) {
      var a = Mt;
      Mt |= ea;
      var i = ix();
      if (Aa !== e || br !== t) {
        if (ca) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (mv(e, br), u.clear()), Dm(e, t);
        }
        Tu = lh(), fv(), Zc(e, t);
      }
      nu(t);
      do
        try {
          xL();
          break;
        } catch (d) {
          ax(e, d);
        }
      while (!0);
      return My(), lx(i), Mt = a, An !== null ? (Sm(), xu) : (If(), Aa = null, br = me, Rr);
    }
    function xL() {
      for (; An !== null && !Fp(); )
        ox(An);
    }
    function ox(e) {
      var t = e.alternate;
      Kt(e);
      var a;
      (e.mode & Ht) !== et ? (X_(e), a = qS(t, e, Do), og(e, !0)) : a = qS(t, e, Do), dn(), e.memoizedProps = e.pendingProps, a === null ? ux(e) : An = a, zS.current = null;
    }
    function ux(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & ac) === Ze) {
          Kt(t);
          var u = void 0;
          if ((t.mode & Ht) === et ? u = Lw(a, t, Do) : (X_(t), u = Lw(a, t, Do), og(t, !1)), dn(), u !== null) {
            An = u;
            return;
          }
        } else {
          var d = _O(a, t);
          if (d !== null) {
            d.flags &= hm, An = d;
            return;
          }
          if ((t.mode & Ht) !== et) {
            og(t, !1);
            for (var m = t.actualDuration, S = t.child; S !== null; )
              m += S.actualDuration, S = S.sibling;
            t.actualDuration = m;
          }
          if (i !== null)
            i.flags |= ac, i.subtreeFlags = Ze, i.deletions = null;
          else {
            Rr = US, An = null;
            return;
          }
        }
        var C = t.sibling;
        if (C !== null) {
          An = C;
          return;
        }
        t = i, An = t;
      } while (t !== null);
      Rr === xu && (Rr = Qw);
    }
    function ef(e, t, a) {
      var i = Ka(), u = Zr.transition;
      try {
        Zr.transition = null, $n(Br), TL(e, t, a, i);
      } finally {
        Zr.transition = u, $n(i);
      }
      return null;
    }
    function TL(e, t, a, i) {
      do
        Ru();
      while (bs !== null);
      if (UL(), (Mt & (ea | cl)) !== Tr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, d = e.finishedLanes;
      if ($p(d), u === null)
        return Wp(), null;
      if (d === me && h("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = me, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = jt;
      var m = _t(u.lanes, u.childLanes);
      ah(e, m), e === Aa && (Aa = null, An = null, br = me), ((u.subtreeFlags & Tl) !== Ze || (u.flags & Tl) !== Ze) && (Jc || (Jc = !0, IS = a, KS(bl, function() {
        return Ru(), null;
      })));
      var S = (u.subtreeFlags & (io | lo | oo | Tl)) !== Ze, C = (u.flags & (io | lo | oo | Tl)) !== Ze;
      if (S || C) {
        var k = Zr.transition;
        Zr.transition = null;
        var D = Ka();
        $n(Br);
        var I = Mt;
        Mt |= cl, zS.current = null, xO(e, u), Z1(), PO(e, u, d), jR(e.containerInfo), e.current = u, uc(d), FO(u, e, d), sc(), Hp(), Mt = I, $n(D), Zr.transition = k;
      } else
        e.current = u, Z1();
      var F = Jc;
      if (Jc ? (Jc = !1, bs = e, dv = d) : (Kd = 0, _g = null), m = e.pendingLanes, m === me && (Xd = null), F || dx(e.current, !1), Vp(u.stateNode, i), ca && e.memoizedUpdaters.clear(), aL(), ri(e, tr()), t !== null)
        for (var K = e.onRecoverableError, te = 0; te < t.length; te++) {
          var le = t[te], Ne = le.stack, nt = le.digest;
          K(le.value, {
            componentStack: Ne,
            digest: nt
          });
        }
      if (yg) {
        yg = !1;
        var Xe = FS;
        throw FS = null, Xe;
      }
      return da(dv, st) && e.tag !== ms && Ru(), m = e.pendingLanes, da(m, st) ? (OD(), e === VS ? pv++ : (pv = 0, VS = e)) : pv = 0, ys(), Wp(), null;
    }
    function Ru() {
      if (bs !== null) {
        var e = Mm(dv), t = xc(Qa, e), a = Zr.transition, i = Ka();
        try {
          return Zr.transition = null, $n(t), RL();
        } finally {
          $n(i), Zr.transition = a;
        }
      }
      return !1;
    }
    function bL(e) {
      HS.push(e), Jc || (Jc = !0, KS(bl, function() {
        return Ru(), null;
      }));
    }
    function RL() {
      if (bs === null)
        return !1;
      var e = IS;
      IS = null;
      var t = bs, a = dv;
      if (bs = null, dv = me, (Mt & (ea | cl)) !== Tr)
        throw new Error("Cannot flush passive effects while already rendering.");
      BS = !0, gg = !1, tu(a);
      var i = Mt;
      Mt |= cl, WO(t.current), VO(t, t.current, a, e);
      {
        var u = HS;
        HS = [];
        for (var d = 0; d < u.length; d++) {
          var m = u[d];
          kO(t, m);
        }
      }
      Qp(), dx(t.current, !0), Mt = i, ys(), gg ? t === _g ? Kd++ : (Kd = 0, _g = t) : Kd = 0, BS = !1, gg = !1, Bp(t);
      {
        var S = t.current.stateNode;
        S.effectDuration = 0, S.passiveEffectDuration = 0;
      }
      return !0;
    }
    function sx(e) {
      return Xd !== null && Xd.has(e);
    }
    function kL(e) {
      Xd === null ? Xd = /* @__PURE__ */ new Set([e]) : Xd.add(e);
    }
    function DL(e) {
      yg || (yg = !0, FS = e);
    }
    var OL = DL;
    function cx(e, t, a) {
      var i = Qc(a, t), u = ow(e, i, st), d = _s(e, u, st), m = za();
      d !== null && (as(d, st, m), ri(d, m));
    }
    function pn(e, t, a) {
      if (EO(a), yv(!1), e.tag === O) {
        cx(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === O) {
          cx(i, e, a);
          return;
        } else if (i.tag === T) {
          var u = i.type, d = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof d.componentDidCatch == "function" && !sx(d)) {
            var m = Qc(a, e), S = hS(i, m, st), C = _s(i, S, st), k = za();
            C !== null && (as(C, st, k), ri(C, k));
            return;
          }
        }
        i = i.return;
      }
      h(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function LL(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = za();
      sd(e, a), HL(e), Aa === e && cu(br, a) && (Rr === ov || Rr === hg && su(br) && tr() - PS < Xw ? Zc(e, me) : mg = _t(mg, a)), ri(e, u);
    }
    function fx(e, t) {
      t === jt && (t = fL(e));
      var a = za(), i = ei(e, t);
      i !== null && (as(i, t, a), ri(i, a));
    }
    function ML(e) {
      var t = e.memoizedState, a = jt;
      t !== null && (a = t.retryLane), fx(e, a);
    }
    function NL(e, t) {
      var a = jt, i;
      switch (e.tag) {
        case W:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case Ke:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), fx(e, a);
    }
    function AL(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : oL(e / 1960) * 1960;
    }
    function zL() {
      if (pv > sL)
        throw pv = 0, VS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Kd > cL && (Kd = 0, _g = null, h("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function UL() {
      zl.flushLegacyContextWarning(), zl.flushPendingUnsafeLifecycleWarnings();
    }
    function dx(e, t) {
      Kt(e), xg(e, ao, tL), t && xg(e, Xi, nL), xg(e, ao, ZO), t && xg(e, Xi, eL), dn();
    }
    function xg(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var d = i.subtreeFlags & t;
        i !== u && i.child !== null && d !== Ze ? i = i.child : ((i.flags & t) !== Ze && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Tg = null;
    function px(e) {
      {
        if ((Mt & ea) !== Tr || !(e.mode & Tt))
          return;
        var t = e.tag;
        if (t !== R && t !== O && t !== T && t !== x && t !== ne && t !== de && t !== ue)
          return;
        var a = pt(e) || "ReactComponent";
        if (Tg !== null) {
          if (Tg.has(a))
            return;
          Tg.add(a);
        } else
          Tg = /* @__PURE__ */ new Set([a]);
        var i = mr;
        try {
          Kt(e), h("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Kt(e) : dn();
        }
      }
    }
    var qS;
    {
      var jL = null;
      qS = function(e, t, a) {
        var i = Ex(jL, t);
        try {
          return bw(e, t, a);
        } catch (d) {
          if (Qk() || d !== null && typeof d == "object" && typeof d.then == "function")
            throw d;
          if (My(), k1(), Mw(e, t), Ex(t, i), t.mode & Ht && X_(t), ro(null, bw, null, e, t, a), wl()) {
            var u = rc();
            typeof u == "object" && u !== null && u._suppressLogging && typeof d == "object" && d !== null && !d._suppressLogging && (d._suppressLogging = !0);
          }
          throw d;
        }
      };
    }
    var hx = !1, QS;
    QS = /* @__PURE__ */ new Set();
    function PL(e) {
      if (Bi && !RD())
        switch (e.tag) {
          case x:
          case ne:
          case ue: {
            var t = An && pt(An) || "Unknown", a = t;
            if (!QS.has(a)) {
              QS.add(a);
              var i = pt(e) || "Unknown";
              h("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case T: {
            hx || (h("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), hx = !0);
            break;
          }
        }
    }
    function mv(e, t) {
      if (ca) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Cc(e, i, t);
        });
      }
    }
    var XS = {};
    function KS(e, t) {
      {
        var a = Bl.current;
        return a !== null ? (a.push(t), XS) : Pp(e, t);
      }
    }
    function vx(e) {
      if (e !== XS)
        return mm(e);
    }
    function mx() {
      return Bl.current !== null;
    }
    function FL(e) {
      {
        if (e.mode & Tt) {
          if (!Gw())
            return;
        } else if (!lL() || Mt !== Tr || e.tag !== x && e.tag !== ne && e.tag !== ue)
          return;
        if (Bl.current === null) {
          var t = mr;
          try {
            Kt(e), h(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, pt(e));
          } finally {
            t ? Kt(e) : dn();
          }
        }
      }
    }
    function HL(e) {
      e.tag !== ms && Gw() && Bl.current === null && h(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function yv(e) {
      Zw = e;
    }
    var fl = null, Jd = null, IL = function(e) {
      fl = e;
    };
    function Zd(e) {
      {
        if (fl === null)
          return e;
        var t = fl(e);
        return t === void 0 ? e : t.current;
      }
    }
    function JS(e) {
      return Zd(e);
    }
    function ZS(e) {
      {
        if (fl === null)
          return e;
        var t = fl(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Zd(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: ve,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function yx(e, t) {
      {
        if (fl === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, d = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case T: {
            typeof i == "function" && (u = !0);
            break;
          }
          case x: {
            (typeof i == "function" || d === ht) && (u = !0);
            break;
          }
          case ne: {
            (d === ve || d === ht) && (u = !0);
            break;
          }
          case de:
          case ue: {
            (d === yt || d === ht) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var m = fl(a);
          if (m !== void 0 && m === fl(i))
            return !0;
        }
        return !1;
      }
    }
    function gx(e) {
      {
        if (fl === null || typeof WeakSet != "function")
          return;
        Jd === null && (Jd = /* @__PURE__ */ new WeakSet()), Jd.add(e);
      }
    }
    var VL = function(e, t) {
      {
        if (fl === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Ru(), bu(function() {
          eE(e.current, i, a);
        });
      }
    }, BL = function(e, t) {
      {
        if (e.context !== Ri)
          return;
        Ru(), bu(function() {
          gv(t, e, null, null);
        });
      }
    };
    function eE(e, t, a) {
      {
        var i = e.alternate, u = e.child, d = e.sibling, m = e.tag, S = e.type, C = null;
        switch (m) {
          case x:
          case ue:
          case T:
            C = S;
            break;
          case ne:
            C = S.render;
            break;
        }
        if (fl === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var k = !1, D = !1;
        if (C !== null) {
          var I = fl(C);
          I !== void 0 && (a.has(I) ? D = !0 : t.has(I) && (m === T ? D = !0 : k = !0));
        }
        if (Jd !== null && (Jd.has(e) || i !== null && Jd.has(i)) && (D = !0), D && (e._debugNeedsRemount = !0), D || k) {
          var F = ei(e, st);
          F !== null && kr(F, e, st, rn);
        }
        u !== null && !D && eE(u, t, a), d !== null && eE(d, t, a);
      }
    }
    var YL = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return tE(e.current, i, a), a;
      }
    };
    function tE(e, t, a) {
      {
        var i = e.child, u = e.sibling, d = e.tag, m = e.type, S = null;
        switch (d) {
          case x:
          case ue:
          case T:
            S = m;
            break;
          case ne:
            S = m.render;
            break;
        }
        var C = !1;
        S !== null && t.has(S) && (C = !0), C ? $L(e, a) : i !== null && tE(i, t, a), u !== null && tE(u, t, a);
      }
    }
    function $L(e, t) {
      {
        var a = WL(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case L:
              t.add(i.stateNode);
              return;
            case A:
              t.add(i.stateNode.containerInfo);
              return;
            case O:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function WL(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === L)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var nE;
    {
      nE = !1;
      try {
        var _x = Object.preventExtensions({});
      } catch {
        nE = !0;
      }
    }
    function GL(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Ze, this.subtreeFlags = Ze, this.deletions = null, this.lanes = me, this.childLanes = me, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !nE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ki = function(e, t, a, i) {
      return new GL(e, t, a, i);
    };
    function rE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function qL(e) {
      return typeof e == "function" && !rE(e) && e.defaultProps === void 0;
    }
    function QL(e) {
      if (typeof e == "function")
        return rE(e) ? T : x;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ve)
          return ne;
        if (t === yt)
          return de;
      }
      return R;
    }
    function tf(e, t) {
      var a = e.alternate;
      a === null ? (a = ki(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Ze, a.subtreeFlags = Ze, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Vn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case R:
        case x:
        case ue:
          a.type = Zd(e.type);
          break;
        case T:
          a.type = JS(e.type);
          break;
        case ne:
          a.type = ZS(e.type);
          break;
      }
      return a;
    }
    function XL(e, t) {
      e.flags &= Vn | Sn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = me, e.lanes = t, e.child = null, e.subtreeFlags = Ze, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Ze, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function KL(e, t, a) {
      var i;
      return e === Cy ? (i = Tt, t === !0 && (i |= en, i |= It)) : i = et, ca && (i |= Ht), ki(O, null, null, i);
    }
    function aE(e, t, a, i, u, d) {
      var m = R, S = e;
      if (typeof e == "function")
        rE(e) ? (m = T, S = JS(S)) : S = Zd(S);
      else if (typeof e == "string")
        m = L;
      else
        e: switch (e) {
          case Fi:
            return Ds(a.children, u, d, t);
          case pi:
            m = B, u |= en, (u & Tt) !== et && (u |= It);
            break;
          case Hi:
            return JL(a, u, d, t);
          case Le:
            return ZL(a, u, d, t);
          case He:
            return eM(a, u, d, t);
          case kn:
            return Sx(a, u, d, t);
          case on:
          case bt:
          case fn:
          case vr:
          case xt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Ii:
                  m = ee;
                  break e;
                case U:
                  m = Q;
                  break e;
                case ve:
                  m = ne, S = ZS(S);
                  break e;
                case yt:
                  m = de;
                  break e;
                case ht:
                  m = Ee, S = null;
                  break e;
              }
            var C = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (C += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var k = i ? pt(i) : null;
              k && (C += `

Check the render method of \`` + k + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + C));
          }
        }
      var D = ki(m, a, t, u);
      return D.elementType = e, D.type = S, D.lanes = d, D._debugOwner = i, D;
    }
    function iE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, d = e.key, m = e.props, S = aE(u, d, m, i, t, a);
      return S._debugSource = e._source, S._debugOwner = e._owner, S;
    }
    function Ds(e, t, a, i) {
      var u = ki(N, e, i, t);
      return u.lanes = a, u;
    }
    function JL(e, t, a, i) {
      typeof e.id != "string" && h('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = ki(se, e, i, t | Ht);
      return u.elementType = Hi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function ZL(e, t, a, i) {
      var u = ki(W, e, i, t);
      return u.elementType = Le, u.lanes = a, u;
    }
    function eM(e, t, a, i) {
      var u = ki(Ke, e, i, t);
      return u.elementType = He, u.lanes = a, u;
    }
    function Sx(e, t, a, i) {
      var u = ki(Re, e, i, t);
      u.elementType = kn, u.lanes = a;
      var d = {
        isHidden: !1
      };
      return u.stateNode = d, u;
    }
    function lE(e, t, a) {
      var i = ki(V, e, null, t);
      return i.lanes = a, i;
    }
    function tM() {
      var e = ki(L, null, null, et);
      return e.elementType = "DELETED", e;
    }
    function nM(e) {
      var t = ki(Ye, null, null, et);
      return t.stateNode = e, t;
    }
    function oE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = ki(A, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function Ex(e, t) {
      return e === null && (e = ki(R, null, null, et)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function rM(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = V0, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = jt, this.eventTimes = Ec(me), this.expirationTimes = Ec(rn), this.pendingLanes = me, this.suspendedLanes = me, this.pingedLanes = me, this.expiredLanes = me, this.mutableReadLanes = me, this.finishedLanes = me, this.entangledLanes = me, this.entanglements = Ec(me), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var d = this.pendingUpdatersLaneMap = [], m = 0; m < ru; m++)
          d.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Cy:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case ms:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Cx(e, t, a, i, u, d, m, S, C, k) {
      var D = new rM(e, t, a, S, C), I = KL(t, d);
      D.current = I, I.stateNode = D;
      {
        var F = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        I.memoizedState = F;
      }
      return S_(I), D;
    }
    var uE = "18.3.1";
    function aM(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return ra(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: hr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var sE, cE;
    sE = !1, cE = {};
    function wx(e) {
      if (!e)
        return Ri;
      var t = Ju(e), a = Hk(t);
      if (t.tag === T) {
        var i = t.type;
        if (Co(i))
          return XC(t, i, a);
      }
      return a;
    }
    function iM(e, t) {
      {
        var a = Ju(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = ua(a);
        if (u === null)
          return null;
        if (u.mode & en) {
          var d = pt(a) || "Component";
          if (!cE[d]) {
            cE[d] = !0;
            var m = mr;
            try {
              Kt(u), a.mode & en ? h("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d) : h("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d);
            } finally {
              m ? Kt(m) : dn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function xx(e, t, a, i, u, d, m, S) {
      var C = !1, k = null;
      return Cx(e, t, C, k, a, i, u, d, m);
    }
    function Tx(e, t, a, i, u, d, m, S, C, k) {
      var D = !0, I = Cx(a, i, D, e, u, d, m, S, C);
      I.context = wx(null);
      var F = I.current, K = za(), te = Rs(F), le = Cu(K, te);
      return le.callback = t ?? null, _s(F, le, te), dL(I, te, K), I;
    }
    function gv(e, t, a, i) {
      Ip(t, e);
      var u = t.current, d = za(), m = Rs(u);
      Cn(m);
      var S = wx(a);
      t.context === null ? t.context = S : t.pendingContext = S, Bi && mr !== null && !sE && (sE = !0, h(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, pt(mr) || "Unknown"));
      var C = Cu(d, m);
      C.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && h("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), C.callback = i);
      var k = _s(u, C, m);
      return k !== null && (kr(k, u, m, d), jy(k, u, m)), m;
    }
    function bg(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case L:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function lM(e) {
      switch (e.tag) {
        case O: {
          var t = e.stateNode;
          if (fd(t)) {
            var a = Cm(t);
            mL(t, a);
          }
          break;
        }
        case W: {
          bu(function() {
            var u = ei(e, st);
            if (u !== null) {
              var d = za();
              kr(u, e, st, d);
            }
          });
          var i = st;
          fE(e, i);
          break;
        }
      }
    }
    function bx(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Rm(a.retryLane, t));
    }
    function fE(e, t) {
      bx(e, t);
      var a = e.alternate;
      a && bx(a, t);
    }
    function oM(e) {
      if (e.tag === W) {
        var t = vc, a = ei(e, t);
        if (a !== null) {
          var i = za();
          kr(a, e, t, i);
        }
        fE(e, t);
      }
    }
    function uM(e) {
      if (e.tag === W) {
        var t = Rs(e), a = ei(e, t);
        if (a !== null) {
          var i = za();
          kr(a, e, t, i);
        }
        fE(e, t);
      }
    }
    function Rx(e) {
      var t = mn(e);
      return t === null ? null : t.stateNode;
    }
    var kx = function(e) {
      return null;
    };
    function sM(e) {
      return kx(e);
    }
    var Dx = function(e) {
      return !1;
    };
    function cM(e) {
      return Dx(e);
    }
    var Ox = null, Lx = null, Mx = null, Nx = null, Ax = null, zx = null, Ux = null, jx = null, Px = null;
    {
      var Fx = function(e, t, a) {
        var i = t[a], u = Ct(e) ? e.slice() : St({}, e);
        return a + 1 === t.length ? (Ct(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = Fx(e[i], t, a + 1), u);
      }, Hx = function(e, t) {
        return Fx(e, t, 0);
      }, Ix = function(e, t, a, i) {
        var u = t[i], d = Ct(e) ? e.slice() : St({}, e);
        if (i + 1 === t.length) {
          var m = a[i];
          d[m] = d[u], Ct(d) ? d.splice(u, 1) : delete d[u];
        } else
          d[u] = Ix(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return d;
      }, Vx = function(e, t, a) {
        if (t.length !== a.length) {
          y("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              y("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Ix(e, t, a, 0);
      }, Bx = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], d = Ct(e) ? e.slice() : St({}, e);
        return d[u] = Bx(e[u], t, a + 1, i), d;
      }, Yx = function(e, t, a) {
        return Bx(e, t, 0, a);
      }, dE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Ox = function(e, t, a, i) {
        var u = dE(e, t);
        if (u !== null) {
          var d = Yx(u.memoizedState, a, i);
          u.memoizedState = d, u.baseState = d, e.memoizedProps = St({}, e.memoizedProps);
          var m = ei(e, st);
          m !== null && kr(m, e, st, rn);
        }
      }, Lx = function(e, t, a) {
        var i = dE(e, t);
        if (i !== null) {
          var u = Hx(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = St({}, e.memoizedProps);
          var d = ei(e, st);
          d !== null && kr(d, e, st, rn);
        }
      }, Mx = function(e, t, a, i) {
        var u = dE(e, t);
        if (u !== null) {
          var d = Vx(u.memoizedState, a, i);
          u.memoizedState = d, u.baseState = d, e.memoizedProps = St({}, e.memoizedProps);
          var m = ei(e, st);
          m !== null && kr(m, e, st, rn);
        }
      }, Nx = function(e, t, a) {
        e.pendingProps = Yx(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = ei(e, st);
        i !== null && kr(i, e, st, rn);
      }, Ax = function(e, t) {
        e.pendingProps = Hx(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = ei(e, st);
        a !== null && kr(a, e, st, rn);
      }, zx = function(e, t, a) {
        e.pendingProps = Vx(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = ei(e, st);
        i !== null && kr(i, e, st, rn);
      }, Ux = function(e) {
        var t = ei(e, st);
        t !== null && kr(t, e, st, rn);
      }, jx = function(e) {
        kx = e;
      }, Px = function(e) {
        Dx = e;
      };
    }
    function fM(e) {
      var t = ua(e);
      return t === null ? null : t.stateNode;
    }
    function dM(e) {
      return null;
    }
    function pM() {
      return mr;
    }
    function hM(e) {
      var t = e.findFiberByHostInstance, a = s.ReactCurrentDispatcher;
      return ts({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Ox,
        overrideHookStateDeletePath: Lx,
        overrideHookStateRenamePath: Mx,
        overrideProps: Nx,
        overridePropsDeletePath: Ax,
        overridePropsRenamePath: zx,
        setErrorHandler: jx,
        setSuspenseHandler: Px,
        scheduleUpdate: Ux,
        currentDispatcherRef: a,
        findHostInstanceByFiber: fM,
        findFiberByHostInstance: t || dM,
        // React Refresh
        findHostInstancesForRefresh: YL,
        scheduleRefresh: VL,
        scheduleRoot: BL,
        setRefreshHandler: IL,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: pM,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: uE
      });
    }
    var $x = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function pE(e) {
      this._internalRoot = e;
    }
    Rg.prototype.render = pE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? h("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : kg(arguments[1]) ? h("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && h("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Hn) {
          var i = Rx(t.current);
          i && i.parentNode !== a && h("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      gv(e, t, null, null);
    }, Rg.prototype.unmount = pE.prototype.unmount = function() {
      typeof arguments[0] == "function" && h("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        rx() && h("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), bu(function() {
          gv(null, e, null, null);
        }), $C(t);
      }
    };
    function vM(e, t) {
      if (!kg(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      Wx(e);
      var a = !1, i = !1, u = "", d = $x;
      t != null && (t.hydrate ? y("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Fr && h(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (d = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var m = xx(e, Cy, null, a, i, u, d);
      vy(m.current, e);
      var S = e.nodeType === Hn ? e.parentNode : e;
      return xh(S), new pE(m);
    }
    function Rg(e) {
      this._internalRoot = e;
    }
    function mM(e) {
      e && jm(e);
    }
    Rg.prototype.unstable_scheduleHydration = mM;
    function yM(e, t, a) {
      if (!kg(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      Wx(e), t === void 0 && h("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, d = !1, m = !1, S = "", C = $x;
      a != null && (a.unstable_strictMode === !0 && (d = !0), a.identifierPrefix !== void 0 && (S = a.identifierPrefix), a.onRecoverableError !== void 0 && (C = a.onRecoverableError));
      var k = Tx(t, null, e, Cy, i, d, m, S, C);
      if (vy(k.current, e), xh(e), u)
        for (var D = 0; D < u.length; D++) {
          var I = u[D];
          ED(k, I);
        }
      return new Rg(k);
    }
    function kg(e) {
      return !!(e && (e.nodeType === ia || e.nodeType === Cl || e.nodeType === bp));
    }
    function _v(e) {
      return !!(e && (e.nodeType === ia || e.nodeType === Cl || e.nodeType === bp || e.nodeType === Hn && e.nodeValue === " react-mount-point-unstable "));
    }
    function Wx(e) {
      e.nodeType === ia && e.tagName && e.tagName.toUpperCase() === "BODY" && h("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), zh(e) && (e._reactRootContainer ? h("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : h("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var gM = s.ReactCurrentOwner, Gx;
    Gx = function(e) {
      if (e._reactRootContainer && e.nodeType !== Hn) {
        var t = Rx(e._reactRootContainer.current);
        t && t.parentNode !== e && h("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = hE(e), u = !!(i && hs(i));
      u && !a && h("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === ia && e.tagName && e.tagName.toUpperCase() === "BODY" && h("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function hE(e) {
      return e ? e.nodeType === Cl ? e.documentElement : e.firstChild : null;
    }
    function qx() {
    }
    function _M(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var d = i;
          i = function() {
            var F = bg(m);
            d.call(F);
          };
        }
        var m = Tx(
          t,
          i,
          e,
          ms,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          qx
        );
        e._reactRootContainer = m, vy(m.current, e);
        var S = e.nodeType === Hn ? e.parentNode : e;
        return xh(S), bu(), m;
      } else {
        for (var C; C = e.lastChild; )
          e.removeChild(C);
        if (typeof i == "function") {
          var k = i;
          i = function() {
            var F = bg(D);
            k.call(F);
          };
        }
        var D = xx(
          e,
          ms,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          qx
        );
        e._reactRootContainer = D, vy(D.current, e);
        var I = e.nodeType === Hn ? e.parentNode : e;
        return xh(I), bu(function() {
          gv(t, D, a, i);
        }), D;
      }
    }
    function SM(e, t) {
      e !== null && typeof e != "function" && h("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Dg(e, t, a, i, u) {
      Gx(a), SM(u === void 0 ? null : u, "render");
      var d = a._reactRootContainer, m;
      if (!d)
        m = _M(a, t, e, u, i);
      else {
        if (m = d, typeof u == "function") {
          var S = u;
          u = function() {
            var C = bg(m);
            S.call(C);
          };
        }
        gv(t, m, e, u);
      }
      return bg(m);
    }
    var Qx = !1;
    function EM(e) {
      {
        Qx || (Qx = !0, h("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = gM.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || h("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", At(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === ia ? e : iM(e, "findDOMNode");
    }
    function CM(e, t, a) {
      if (h("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !_v(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = zh(t) && t._reactRootContainer === void 0;
        i && h("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Dg(null, e, t, !0, a);
    }
    function wM(e, t, a) {
      if (h("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !_v(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = zh(t) && t._reactRootContainer === void 0;
        i && h("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Dg(null, e, t, !1, a);
    }
    function xM(e, t, a, i) {
      if (h("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !_v(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !f0(e))
        throw new Error("parentComponent must be a valid React Component");
      return Dg(e, t, a, !1, i);
    }
    var Xx = !1;
    function TM(e) {
      if (Xx || (Xx = !0, h("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !_v(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = zh(e) && e._reactRootContainer === void 0;
        t && h("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = hE(e), i = a && !hs(a);
          i && h("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return bu(function() {
          Dg(null, null, e, !1, function() {
            e._reactRootContainer = null, $C(e);
          });
        }), !0;
      } else {
        {
          var u = hE(e), d = !!(u && hs(u)), m = e.nodeType === ia && _v(e.parentNode) && !!e.parentNode._reactRootContainer;
          d && h("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", m ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Ar(lM), is(oM), Nm(uM), bc(Ka), oh(Om), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && h("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), kf(RR), c0($S, yL, bu);
    function bM(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!kg(t))
        throw new Error("Target container is not a DOM element.");
      return aM(e, t, null, a);
    }
    function RM(e, t, a, i) {
      return xM(e, t, a, i);
    }
    var vE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [hs, Od, my, qu, Df, $S]
    };
    function kM(e, t) {
      return vE.usingClientEntryPoint || h('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), vM(e, t);
    }
    function DM(e, t, a) {
      return vE.usingClientEntryPoint || h('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), yM(e, t, a);
    }
    function OM(e) {
      return rx() && h("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), bu(e);
    }
    var LM = hM({
      findFiberByHostInstance: Hc,
      bundleType: 1,
      version: uE,
      rendererPackageName: "react-dom"
    });
    if (!LM && Pn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var Kx = window.location.protocol;
      /^(https?|file):$/.test(Kx) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (Kx === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    ii.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = vE, ii.createPortal = bM, ii.createRoot = kM, ii.findDOMNode = EM, ii.flushSync = OM, ii.hydrate = CM, ii.hydrateRoot = DM, ii.render = wM, ii.unmountComponentAtNode = TM, ii.unstable_batchedUpdates = $S, ii.unstable_renderSubtreeIntoContainer = RM, ii.version = uE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), ii;
}
function YT() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(YT);
    } catch (g) {
      console.error(g);
    }
  }
}
process.env.NODE_ENV === "production" ? (YT(), AE.exports = uN()) : AE.exports = sN();
var cN = AE.exports, up, Lg = cN;
if (process.env.NODE_ENV === "production")
  up = Lg.createRoot, Lg.hydrateRoot;
else {
  var vT = Lg.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  up = function(g, l) {
    vT.usingClientEntryPoint = !0;
    try {
      return Lg.createRoot(g, l);
    } finally {
      vT.usingClientEntryPoint = !1;
    }
  };
}
const fN = ({ item: g }) => /* @__PURE__ */ Y.jsxs("li", { className: "nav-item", children: [
  /* @__PURE__ */ Y.jsxs("a", { href: "#", className: "nav-link route-link", "data-route": g.route, children: [
    /* @__PURE__ */ Y.jsx("i", { "data-lucide": g.icon, className: "nav-icon" }),
    /* @__PURE__ */ Y.jsx("span", { "data-lang": g.dataLang, children: g.label })
  ] }),
  /* @__PURE__ */ Y.jsxs("div", { className: "mega-dropdown", children: [
    /* @__PURE__ */ Y.jsx("div", { className: "mega-menu-list-container", children: g.menuItems.map((l) => /* @__PURE__ */ Y.jsxs(
      "a",
      {
        href: "#",
        className: "mega-menu-item route-link",
        "data-route": l.route,
        "data-preview": l.previewId,
        children: [
          /* @__PURE__ */ Y.jsx("i", { "data-lucide": l.icon, className: "mega-menu-icon" }),
          /* @__PURE__ */ Y.jsx("span", { children: l.label }),
          l.isNew ? /* @__PURE__ */ Y.jsx("span", { className: "badge-new", children: "NEW" }) : null
        ]
      },
      `${l.route}-${l.previewId}`
    )) }),
    /* @__PURE__ */ Y.jsxs("div", { className: "mega-menu-preview", children: [
      /* @__PURE__ */ Y.jsx("div", { className: "preview-loader", children: /* @__PURE__ */ Y.jsx("i", { className: "fas fa-spinner fa-spin" }) }),
      g.previews.map((l, s) => /* @__PURE__ */ Y.jsx(
        "img",
        {
          id: l.id,
          src: l.src,
          alt: l.alt,
          className: `preview-image ${s === 0 ? "active" : ""}`
        },
        l.id
      ))
    ] })
  ] })
] }), dN = [
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
], pN = [
  { route: "SERVICES.STAY.MAIN", dataLang: "mobileNavHotel", label: "숙소 예약", active: !0 },
  { route: "SERVICES.STAY.LIFE", dataLang: "mobileNavLife", label: "한달살기" },
  { route: "SERVICES.TRAVEL.ACTIVITIES", dataLang: "mobileNavActivity", label: "액티비티" },
  { route: "SERVICES.TRAVEL.ESIM", dataLang: "mobileNavEsim", label: "eSIM" },
  { route: "SERVICES.TRAVEL.GUIDE", dataLang: "mobileNavGuide", label: "여행 가이드" },
  { route: "SERVICES.TRAVEL.TIPS", dataLang: "mobileNavTips", label: "여행 일정 팁" },
  { action: "OPEN_RESERVATION_DRAWER", dataLang: "navResCheck", label: "예약 확인" },
  { route: "AUTH.LOGIN", routeParams: '{"shell":"main"}', dataLang: "navLogin", label: "로그인" }
], hN = ({ basePath: g }) => /* @__PURE__ */ Y.jsxs("header", { className: "header hotel-header", id: "header", children: [
  /* @__PURE__ */ Y.jsxs("div", { className: "header-container", children: [
    /* @__PURE__ */ Y.jsx("a", { href: "#", className: "logo route-link", "data-route": "SERVICES.STAY.MAIN", children: /* @__PURE__ */ Y.jsx("img", { src: `${g}jejustay/images/logo_jejuhotel.png`, alt: "JEJU STAY", className: "logo-img" }) }),
    /* @__PURE__ */ Y.jsx("nav", { className: "main-nav", children: /* @__PURE__ */ Y.jsx("ul", { className: "nav-list", children: dN.map((l) => /* @__PURE__ */ Y.jsx(fN, { item: l }, `${l.route}-${l.dataLang}`)) }) }),
    /* @__PURE__ */ Y.jsxs("div", { className: "header-utils", children: [
      /* @__PURE__ */ Y.jsxs(
        "a",
        {
          href: "#",
          className: "util-link admin-link route-link",
          "data-route": "ADMIN.DASHBOARD",
          id: "headerAdminBtn",
          style: { display: "none" },
          children: [
            /* @__PURE__ */ Y.jsx("i", { "data-lucide": "shield-check", className: "util-icon" }),
            /* @__PURE__ */ Y.jsx("span", { children: "관리자 페이지" })
          ]
        }
      ),
      /* @__PURE__ */ Y.jsxs("a", { href: "#", className: "util-link route-link", "data-action": "OPEN_RESERVATION_DRAWER", children: [
        /* @__PURE__ */ Y.jsx("i", { "data-lucide": "clipboard-list", className: "util-icon" }),
        /* @__PURE__ */ Y.jsx("span", { "data-lang": "navResCheck", children: "예약 확인" })
      ] }),
      /* @__PURE__ */ Y.jsxs(
        "a",
        {
          href: "#",
          className: "util-link login-btn route-link",
          "data-route": "AUTH.LOGIN",
          "data-route-params": '{"shell":"main"}',
          id: "headerLoginBtn",
          children: [
            /* @__PURE__ */ Y.jsx("i", { "data-lucide": "user", className: "util-icon" }),
            /* @__PURE__ */ Y.jsx("span", { "data-lang": "navLogin", children: "로그인" })
          ]
        }
      ),
      /* @__PURE__ */ Y.jsxs("a", { href: "#", className: "util-link route-link", "data-route": "CS.CUSTOMER_CENTER", children: [
        /* @__PURE__ */ Y.jsx("i", { "data-lucide": "headphones", className: "util-icon" }),
        /* @__PURE__ */ Y.jsx("span", { "data-lang": "navCs", children: "고객센터" })
      ] })
    ] }),
    /* @__PURE__ */ Y.jsx("button", { className: "mobile-menu-btn", id: "mobileMenuBtn", "aria-label": "메뉴 열기", children: /* @__PURE__ */ Y.jsx("i", { "data-lucide": "menu" }) })
  ] }),
  /* @__PURE__ */ Y.jsx("div", { className: "mobile-nav", id: "mobileNav", children: /* @__PURE__ */ Y.jsx("ul", { className: "mobile-nav-list", children: pN.map((l) => /* @__PURE__ */ Y.jsx("li", { children: /* @__PURE__ */ Y.jsx(
    "a",
    {
      href: "#",
      className: `mobile-nav-link route-link${l.active ? " active" : ""}`,
      "data-route": l.route,
      "data-route-params": l.routeParams,
      "data-action": l.action,
      "data-lang": l.dataLang,
      children: l.label
    }
  ) }, `${l.route ?? l.action ?? l.dataLang}-${l.dataLang}`)) }) })
] }), $T = () => /* @__PURE__ */ Y.jsxs("footer", { className: "footer section", id: "section-footer", children: [
  /* @__PURE__ */ Y.jsxs("div", { className: "footer-content", children: [
    /* @__PURE__ */ Y.jsxs("div", { className: "footer-info", children: [
      /* @__PURE__ */ Y.jsx("p", { children: /* @__PURE__ */ Y.jsx("strong", { "data-lang": "footerCompany", children: "(주) 제주 그룹" }) }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerCEO", children: "대표이사 김대표" }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerBizNum", children: "사업자등록번호 616-81-50527" }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerSaleNum", children: "통신판매신고 제주 2006-125" }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerHosting", children: "호스팅 사업자 AWS" }),
      /* @__PURE__ */ Y.jsx("br", {}),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerAddr", children: "주소: 제주특별자치도 제주시 첨단로 64 (연동, 건설공제회관 3층)" }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerCs", children: "고객센터: 1599-1500 (09:00 ~ 19:00)" }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerCsEmail", children: "고객 문의: jejugroup.help@jejugroup.net" }),
      /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerPartnerEmail", children: "제휴 문의: partnership@jejugroup.net" })
    ] }),
    /* @__PURE__ */ Y.jsxs("div", { className: "footer-social", children: [
      /* @__PURE__ */ Y.jsx("a", { href: "#", className: "social-icon", "aria-label": "YouTube", children: /* @__PURE__ */ Y.jsx("i", { className: "fab fa-youtube" }) }),
      /* @__PURE__ */ Y.jsx("a", { href: "#", className: "social-icon", "aria-label": "Instagram", children: /* @__PURE__ */ Y.jsx("i", { className: "fab fa-instagram" }) }),
      /* @__PURE__ */ Y.jsx("a", { href: "#", className: "social-icon", "aria-label": "TikTok", children: /* @__PURE__ */ Y.jsx("i", { className: "fab fa-tiktok" }) }),
      /* @__PURE__ */ Y.jsx("a", { href: "#", className: "social-icon", "aria-label": "Facebook", children: /* @__PURE__ */ Y.jsx("i", { className: "fab fa-facebook" }) })
    ] })
  ] }),
  /* @__PURE__ */ Y.jsx("div", { className: "footer-copyright", children: /* @__PURE__ */ Y.jsx("p", { "data-lang": "footerCopyright", children: "Copyright © Jeju Group. All Rights Reserved." }) })
] }), vN = ({ basePath: g }) => /* @__PURE__ */ Y.jsxs("header", { className: "header main-header", id: "header", children: [
  /* @__PURE__ */ Y.jsxs("div", { className: "header-util", id: "index-header-util", children: [
    /* @__PURE__ */ Y.jsx(
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
    /* @__PURE__ */ Y.jsx("span", { className: "util-divider", children: "|" }),
    /* @__PURE__ */ Y.jsx(
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
    /* @__PURE__ */ Y.jsx("span", { className: "util-divider", children: "|" }),
    /* @__PURE__ */ Y.jsx("a", { href: "#", className: "util-link route-link", "data-action": "OPEN_RESERVATION_DRAWER", "data-lang": "reservationCheck", children: "예약 확인" }),
    /* @__PURE__ */ Y.jsx("span", { className: "util-divider", children: "|" }),
    /* @__PURE__ */ Y.jsx("a", { href: "#", className: "util-link route-link", "data-route": "CS.CUSTOMER_CENTER", "data-lang": "customerCenter", children: "고객센터" })
  ] }),
  /* @__PURE__ */ Y.jsxs("div", { className: "header-inner", children: [
    /* @__PURE__ */ Y.jsx("div", { className: "logo", children: /* @__PURE__ */ Y.jsx("a", { href: "#", className: "logo-link route-link", "data-route": "HOME", children: /* @__PURE__ */ Y.jsx("img", { src: `${g}jejustay/images/logo_jejuGP_wide.png`, alt: "제주그룹" }) }) }),
    /* @__PURE__ */ Y.jsx("nav", { className: "gnb", id: "gnb", children: /* @__PURE__ */ Y.jsxs("ul", { className: "gnb-list", children: [
      /* @__PURE__ */ Y.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ Y.jsx("a", { href: "#section-2", className: "gnb-link", "data-lang": "navAir", children: "제주항공" }) }),
      /* @__PURE__ */ Y.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ Y.jsx("a", { href: "#section-3", className: "gnb-link", "data-lang": "navHotel", children: "제주 스테이" }) }),
      /* @__PURE__ */ Y.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ Y.jsx("a", { href: "#section-4", className: "gnb-link", "data-lang": "navRentCar", children: "제주 렌트카" }) }),
      /* @__PURE__ */ Y.jsx("li", { className: "gnb-item", children: /* @__PURE__ */ Y.jsx("a", { href: "#section-5", className: "gnb-link", "data-lang": "navMembership", children: "멤버십" }) })
    ] }) }),
    /* @__PURE__ */ Y.jsxs("div", { className: "header-right-controls", children: [
      /* @__PURE__ */ Y.jsx("button", { className: "lang-toggle", children: "English" }),
      /* @__PURE__ */ Y.jsx("div", { id: "weather-widget", className: "weather-widget", children: /* @__PURE__ */ Y.jsx("button", { className: "weather-header-btn", id: "weather-open-btn", children: /* @__PURE__ */ Y.jsx("i", { className: "fa-solid fa-spinner fa-spin" }) }) })
    ] })
  ] })
] }), Qg = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
}, mT = /* @__PURE__ */ new Map(), mN = (g) => {
  requestAnimationFrame(() => {
    Promise.resolve(g == null ? void 0 : g()).catch((l) => {
      console.error("[ShellRuntime] onLoaded failed", l);
    });
  });
}, jg = (g, l, s) => {
  const f = document.getElementById(g);
  if (!f)
    return;
  const p = mT.get(g);
  p && p.unmount();
  const y = up(f);
  mT.set(g, y), y.render(l), mN(s);
}, Pg = (g) => {
  document.dispatchEvent(new Event(g));
}, Fg = () => {
  const g = window.lucide;
  g != null && g.createIcons && g.createIcons();
}, yN = async () => {
  const g = qg();
  jg("main-header-placeholder", /* @__PURE__ */ Y.jsx(vN, { basePath: g }), async () => {
    jv(), Fg(), Pg("mainHeaderLoaded");
  }), jg("main-footer-placeholder", /* @__PURE__ */ Y.jsx($T, {}), async () => {
    Qg(), Fg(), Pg("mainFooterLoaded");
  });
}, gN = async () => {
  const g = qg();
  jg("hotel-header-placeholder", /* @__PURE__ */ Y.jsx(hN, { basePath: g }), async () => {
    jv(), Fg(), Pg("mainHeaderLoaded");
  }), jg("hotel-footer-placeholder", /* @__PURE__ */ Y.jsx($T, {}), async () => {
    Qg(), Fg(), Pg("mainFooterLoaded");
  });
}, _N = () => /* @__PURE__ */ Y.jsxs(Y.Fragment, { children: [
  /* @__PURE__ */ Y.jsx("div", { className: "res-drawer-backdrop", id: "resDrawerBackdrop" }),
  /* @__PURE__ */ Y.jsxs("div", { className: "res-drawer-panel", id: "resDrawerPanel", children: [
    /* @__PURE__ */ Y.jsx("button", { className: "res-drawer-close", id: "resDrawerClose", children: /* @__PURE__ */ Y.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ Y.jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) }),
    /* @__PURE__ */ Y.jsxs("div", { className: "res-drawer-visual", children: [
      /* @__PURE__ */ Y.jsx("h2", { className: "res-drawer-title", "data-lang": "resCheckTitle", children: "비회원 예약 조회" }),
      /* @__PURE__ */ Y.jsx("p", { className: "res-drawer-desc", "data-lang": "resCheckDesc", children: "예약 번호와 이메일 정보를 입력해서 내역을 확인해줘" })
    ] }),
    /* @__PURE__ */ Y.jsxs("div", { className: "res-drawer-body", children: [
      /* @__PURE__ */ Y.jsxs("form", { className: "res-drawer-form", id: "resDrawerForm", children: [
        /* @__PURE__ */ Y.jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ Y.jsx(
            "input",
            {
              type: "text",
              id: "drawerResNum",
              placeholder: "예약 번호 입력",
              "data-lang-placeholder": "resNumPlaceholder",
              required: !0
            }
          ),
          /* @__PURE__ */ Y.jsx("div", { className: "input-focus-bg" })
        ] }),
        /* @__PURE__ */ Y.jsxs("div", { className: "input-group", children: [
          /* @__PURE__ */ Y.jsx(
            "input",
            {
              type: "email",
              id: "drawerEmail",
              placeholder: "가입한 이메일 입력",
              "data-lang-placeholder": "resEmailPlaceholder",
              required: !0
            }
          ),
          /* @__PURE__ */ Y.jsx("div", { className: "input-focus-bg" })
        ] }),
        /* @__PURE__ */ Y.jsx("button", { type: "submit", className: "res-drawer-btn", "data-lang": "checkButton", children: "조회하기" })
      ] }),
      /* @__PURE__ */ Y.jsxs("div", { className: "res-drawer-footer", children: [
        /* @__PURE__ */ Y.jsx("span", { "data-lang": "isMember", children: "회원이신가요" }),
        /* @__PURE__ */ Y.jsx("a", { href: "#", className: "route-link", "data-route": "AUTH.LOGIN", "data-lang": "loginCheckLink", children: "로그인하고 관리하기" })
      ] })
    ] })
  ] })
] });
class SN {
  constructor() {
    nf(this, "isInitialized", !1);
    nf(this, "isOpen", !1);
    nf(this, "root", null);
    nf(this, "backdrop", null);
    nf(this, "panel", null);
    nf(this, "closeButton", null);
  }
  async ensureMarkup() {
    if (this.isInitialized)
      return;
    const l = new URL("components/react/ui/reservationDrawer/drawer.css", vp("./")).href;
    if (!Array.from(document.querySelectorAll("link")).some((p) => p.href === l)) {
      const p = document.createElement("link");
      p.rel = "stylesheet", p.href = l, document.head.appendChild(p);
    }
    let f = document.getElementById("reservation-drawer-container");
    f || (f = document.createElement("div"), f.id = "reservation-drawer-container", document.body.appendChild(f)), this.root || (this.root = up(f)), this.root.render(Ut.createElement(_N)), await new Promise((p) => {
      requestAnimationFrame(() => p());
    }), this.backdrop = document.getElementById("resDrawerBackdrop"), this.panel = document.getElementById("resDrawerPanel"), this.closeButton = document.getElementById("resDrawerClose"), this.bindEvents(), this.isInitialized = !0;
  }
  bindEvents() {
    if (!this.backdrop || !this.panel || !this.closeButton)
      return;
    this.closeButton.addEventListener("click", () => this.close()), this.backdrop.addEventListener("click", () => this.close()), window.addEventListener("popstate", (s) => {
      const f = s.state;
      this.isOpen && (f == null ? void 0 : f.modal) !== "reservation" && this.close(!0);
    }), document.addEventListener("keydown", (s) => {
      s.key === "Escape" && this.isOpen && this.close();
    });
    const l = document.getElementById("resDrawerForm");
    l && l.addEventListener("submit", (s) => {
      s.preventDefault(), alert("예약 API 연동 전 임시 폼 상태");
    }), this.panel.addEventListener("click", (s) => {
      var p;
      ((p = s.target) == null ? void 0 : p.closest("[data-route]")) && this.close();
    });
  }
  async open() {
    await this.ensureMarkup(), !(this.isOpen || !this.backdrop || !this.panel) && (this.isOpen = !0, history.pushState({ modal: "reservation" }, "", "#reservation"), this.backdrop.offsetHeight, requestAnimationFrame(() => {
      var l, s;
      (l = this.backdrop) == null || l.classList.add("active"), (s = this.panel) == null || s.classList.add("active");
    }), document.body.style.overflow = "hidden");
  }
  close(l = !1) {
    var s, f, p;
    this.isOpen && (this.isOpen = !1, (s = this.backdrop) == null || s.classList.remove("active"), (f = this.panel) == null || f.classList.remove("active"), document.body.style.overflow = "", !l && ((p = history.state) == null ? void 0 : p.modal) === "reservation" && history.back());
  }
}
const Xg = new SN();
function Du(g) {
  if (g === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return g;
}
function WT(g, l) {
  g.prototype = Object.create(l.prototype), g.prototype.constructor = g, g.__proto__ = l;
}
/*!
 * GSAP 3.14.2
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var Ai = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, sp = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, ZE, na, Tn, pl = 1e8, vn = 1 / pl, zE = Math.PI * 2, EN = zE / 4, CN = 0, GT = Math.sqrt, wN = Math.cos, xN = Math.sin, Ur = function(l) {
  return typeof l == "string";
}, Qn = function(l) {
  return typeof l == "function";
}, Lu = function(l) {
  return typeof l == "number";
}, eC = function(l) {
  return typeof l > "u";
}, Ao = function(l) {
  return typeof l == "object";
}, li = function(l) {
  return l !== !1;
}, tC = function() {
  return typeof window < "u";
}, Mg = function(l) {
  return Qn(l) || Ur(l);
}, qT = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Ca = Array.isArray, TN = /random\([^)]+\)/g, bN = /,\s*/g, yT = /(?:-?\.?\d|\.)+/gi, QT = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, rp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _E = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, XT = /[+-]=-?[.\d]+/, RN = /[^,'"\[\]\s]+/gi, kN = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, Un, Lo, UE, nC, zi = {}, Hg = {}, KT, JT = function(l) {
  return (Hg = cp(l, zi)) && ci;
}, rC = function(l, s) {
  return console.warn("Invalid property", l, "set to", s, "Missing plugin? gsap.registerPlugin()");
}, Ov = function(l, s) {
  return !s && console.warn(l);
}, ZT = function(l, s) {
  return l && (zi[l] = s) && Hg && (Hg[l] = s) || zi;
}, Lv = function() {
  return 0;
}, DN = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Ag = {
  suppressEvents: !0,
  kill: !1
}, ON = {
  suppressEvents: !0
}, aC = {}, zs = [], jE = {}, eb, Oi = {}, SE = {}, gT = 30, zg = [], iC = "", lC = function(l) {
  var s = l[0], f, p;
  if (Ao(s) || Qn(s) || (l = [l]), !(f = (s._gsap || {}).harness)) {
    for (p = zg.length; p-- && !zg[p].targetTest(s); )
      ;
    f = zg[p];
  }
  for (p = l.length; p--; )
    l[p] && (l[p]._gsap || (l[p]._gsap = new xb(l[p], f))) || l.splice(p, 1);
  return l;
}, cf = function(l) {
  return l._gsap || lC(hl(l))[0]._gsap;
}, tb = function(l, s, f) {
  return (f = l[s]) && Qn(f) ? l[s]() : eC(f) && l.getAttribute && l.getAttribute(s) || f;
}, oi = function(l, s) {
  return (l = l.split(",")).forEach(s) || l;
}, ar = function(l) {
  return Math.round(l * 1e5) / 1e5 || 0;
}, zn = function(l) {
  return Math.round(l * 1e7) / 1e7 || 0;
}, ip = function(l, s) {
  var f = s.charAt(0), p = parseFloat(s.substr(2));
  return l = parseFloat(l), f === "+" ? l + p : f === "-" ? l - p : f === "*" ? l * p : l / p;
}, LN = function(l, s) {
  for (var f = s.length, p = 0; l.indexOf(s[p]) < 0 && ++p < f; )
    ;
  return p < f;
}, Ig = function() {
  var l = zs.length, s = zs.slice(0), f, p;
  for (jE = {}, zs.length = 0, f = 0; f < l; f++)
    p = s[f], p && p._lazy && (p.render(p._lazy[0], p._lazy[1], !0)._lazy = 0);
}, oC = function(l) {
  return !!(l._initted || l._startAt || l.add);
}, nb = function(l, s, f, p) {
  zs.length && !na && Ig(), l.render(s, f, !!(na && s < 0 && oC(l))), zs.length && !na && Ig();
}, rb = function(l) {
  var s = parseFloat(l);
  return (s || s === 0) && (l + "").match(RN).length < 2 ? s : Ur(l) ? l.trim() : l;
}, ab = function(l) {
  return l;
}, Ui = function(l, s) {
  for (var f in s)
    f in l || (l[f] = s[f]);
  return l;
}, MN = function(l) {
  return function(s, f) {
    for (var p in f)
      p in s || p === "duration" && l || p === "ease" || (s[p] = f[p]);
  };
}, cp = function(l, s) {
  for (var f in s)
    l[f] = s[f];
  return l;
}, _T = function g(l, s) {
  for (var f in s)
    f !== "__proto__" && f !== "constructor" && f !== "prototype" && (l[f] = Ao(s[f]) ? g(l[f] || (l[f] = {}), s[f]) : s[f]);
  return l;
}, Vg = function(l, s) {
  var f = {}, p;
  for (p in l)
    p in s || (f[p] = l[p]);
  return f;
}, Rv = function(l) {
  var s = l.parent || Un, f = l.keyframes ? MN(Ca(l.keyframes)) : Ui;
  if (li(l.inherit))
    for (; s; )
      f(l, s.vars.defaults), s = s.parent || s._dp;
  return l;
}, NN = function(l, s) {
  for (var f = l.length, p = f === s.length; p && f-- && l[f] === s[f]; )
    ;
  return f < 0;
}, ib = function(l, s, f, p, y) {
  var h = l[p], E;
  if (y)
    for (E = s[y]; h && h[y] > E; )
      h = h._prev;
  return h ? (s._next = h._next, h._next = s) : (s._next = l[f], l[f] = s), s._next ? s._next._prev = s : l[p] = s, s._prev = h, s.parent = s._dp = l, s;
}, Kg = function(l, s, f, p) {
  f === void 0 && (f = "_first"), p === void 0 && (p = "_last");
  var y = s._prev, h = s._next;
  y ? y._next = h : l[f] === s && (l[f] = h), h ? h._prev = y : l[p] === s && (l[p] = y), s._next = s._prev = s.parent = null;
}, js = function(l, s) {
  l.parent && (!s || l.parent.autoRemoveChildren) && l.parent.remove && l.parent.remove(l), l._act = 0;
}, ff = function(l, s) {
  if (l && (!s || s._end > l._dur || s._start < 0))
    for (var f = l; f; )
      f._dirty = 1, f = f.parent;
  return l;
}, AN = function(l) {
  for (var s = l.parent; s && s.parent; )
    s._dirty = 1, s.totalDuration(), s = s.parent;
  return l;
}, PE = function(l, s, f, p) {
  return l._startAt && (na ? l._startAt.revert(Ag) : l.vars.immediateRender && !l.vars.autoRevert || l._startAt.render(s, !0, p));
}, zN = function g(l) {
  return !l || l._ts && g(l.parent);
}, ST = function(l) {
  return l._repeat ? fp(l._tTime, l = l.duration() + l._rDelay) * l : 0;
}, fp = function(l, s) {
  var f = Math.floor(l = zn(l / s));
  return l && f === l ? f - 1 : f;
}, Bg = function(l, s) {
  return (l - s._start) * s._ts + (s._ts >= 0 ? 0 : s._dirty ? s.totalDuration() : s._tDur);
}, Jg = function(l) {
  return l._end = zn(l._start + (l._tDur / Math.abs(l._ts || l._rts || vn) || 0));
}, Zg = function(l, s) {
  var f = l._dp;
  return f && f.smoothChildTiming && l._ts && (l._start = zn(f._time - (l._ts > 0 ? s / l._ts : ((l._dirty ? l.totalDuration() : l._tDur) - s) / -l._ts)), Jg(l), f._dirty || ff(f, l)), l;
}, lb = function(l, s) {
  var f;
  if ((s._time || !s._dur && s._initted || s._start < l._time && (s._dur || !s.add)) && (f = Bg(l.rawTime(), s), (!s._dur || Pv(0, s.totalDuration(), f) - s._tTime > vn) && s.render(f, !0)), ff(l, s)._dp && l._initted && l._time >= l._dur && l._ts) {
    if (l._dur < l.duration())
      for (f = l; f._dp; )
        f.rawTime() >= 0 && f.totalTime(f._tTime), f = f._dp;
    l._zTime = -vn;
  }
}, Mo = function(l, s, f, p) {
  return s.parent && js(s), s._start = zn((Lu(f) ? f : f || l !== Un ? dl(l, f, s) : l._time) + s._delay), s._end = zn(s._start + (s.totalDuration() / Math.abs(s.timeScale()) || 0)), ib(l, s, "_first", "_last", l._sort ? "_start" : 0), FE(s) || (l._recent = s), p || lb(l, s), l._ts < 0 && Zg(l, l._tTime), l;
}, ob = function(l, s) {
  return (zi.ScrollTrigger || rC("scrollTrigger", s)) && zi.ScrollTrigger.create(s, l);
}, ub = function(l, s, f, p, y) {
  if (sC(l, s, y), !l._initted)
    return 1;
  if (!f && l._pt && !na && (l._dur && l.vars.lazy !== !1 || !l._dur && l.vars.lazy) && eb !== Li.frame)
    return zs.push(l), l._lazy = [y, p], 1;
}, UN = function g(l) {
  var s = l.parent;
  return s && s._ts && s._initted && !s._lock && (s.rawTime() < 0 || g(s));
}, FE = function(l) {
  var s = l.data;
  return s === "isFromStart" || s === "isStart";
}, jN = function(l, s, f, p) {
  var y = l.ratio, h = s < 0 || !s && (!l._start && UN(l) && !(!l._initted && FE(l)) || (l._ts < 0 || l._dp._ts < 0) && !FE(l)) ? 0 : 1, E = l._rDelay, x = 0, T, R, O;
  if (E && l._repeat && (x = Pv(0, l._tDur, s), R = fp(x, E), l._yoyo && R & 1 && (h = 1 - h), R !== fp(l._tTime, E) && (y = 1 - h, l.vars.repeatRefresh && l._initted && l.invalidate())), h !== y || na || p || l._zTime === vn || !s && l._zTime) {
    if (!l._initted && ub(l, s, p, f, x))
      return;
    for (O = l._zTime, l._zTime = s || (f ? vn : 0), f || (f = s && !O), l.ratio = h, l._from && (h = 1 - h), l._time = 0, l._tTime = x, T = l._pt; T; )
      T.r(h, T.d), T = T._next;
    s < 0 && PE(l, s, f, !0), l._onUpdate && !f && Mi(l, "onUpdate"), x && l._repeat && !f && l.parent && Mi(l, "onRepeat"), (s >= l._tDur || s < 0) && l.ratio === h && (h && js(l, 1), !f && !na && (Mi(l, h ? "onComplete" : "onReverseComplete", !0), l._prom && l._prom()));
  } else l._zTime || (l._zTime = s);
}, PN = function(l, s, f) {
  var p;
  if (f > s)
    for (p = l._first; p && p._start <= f; ) {
      if (p.data === "isPause" && p._start > s)
        return p;
      p = p._next;
    }
  else
    for (p = l._last; p && p._start >= f; ) {
      if (p.data === "isPause" && p._start < s)
        return p;
      p = p._prev;
    }
}, dp = function(l, s, f, p) {
  var y = l._repeat, h = zn(s) || 0, E = l._tTime / l._tDur;
  return E && !p && (l._time *= h / l._dur), l._dur = h, l._tDur = y ? y < 0 ? 1e10 : zn(h * (y + 1) + l._rDelay * y) : h, E > 0 && !p && Zg(l, l._tTime = l._tDur * E), l.parent && Jg(l), f || ff(l.parent, l), l;
}, ET = function(l) {
  return l instanceof Pa ? ff(l) : dp(l, l._dur);
}, FN = {
  _start: 0,
  endTime: Lv,
  totalDuration: Lv
}, dl = function g(l, s, f) {
  var p = l.labels, y = l._recent || FN, h = l.duration() >= pl ? y.endTime(!1) : l._dur, E, x, T;
  return Ur(s) && (isNaN(s) || s in p) ? (x = s.charAt(0), T = s.substr(-1) === "%", E = s.indexOf("="), x === "<" || x === ">" ? (E >= 0 && (s = s.replace(/=/, "")), (x === "<" ? y._start : y.endTime(y._repeat >= 0)) + (parseFloat(s.substr(1)) || 0) * (T ? (E < 0 ? y : f).totalDuration() / 100 : 1)) : E < 0 ? (s in p || (p[s] = h), p[s]) : (x = parseFloat(s.charAt(E - 1) + s.substr(E + 1)), T && f && (x = x / 100 * (Ca(f) ? f[0] : f).totalDuration()), E > 1 ? g(l, s.substr(0, E - 1), f) + x : h + x)) : s == null ? h : +s;
}, kv = function(l, s, f) {
  var p = Lu(s[1]), y = (p ? 2 : 1) + (l < 2 ? 0 : 1), h = s[y], E, x;
  if (p && (h.duration = s[1]), h.parent = f, l) {
    for (E = h, x = f; x && !("immediateRender" in E); )
      E = x.vars.defaults || {}, x = li(x.vars.inherit) && x.parent;
    h.immediateRender = li(E.immediateRender), l < 2 ? h.runBackwards = 1 : h.startAt = s[y - 1];
  }
  return new dr(s[0], h, s[y + 1]);
}, Hs = function(l, s) {
  return l || l === 0 ? s(l) : s;
}, Pv = function(l, s, f) {
  return f < l ? l : f > s ? s : f;
}, Ea = function(l, s) {
  return !Ur(l) || !(s = kN.exec(l)) ? "" : s[1];
}, HN = function(l, s, f) {
  return Hs(f, function(p) {
    return Pv(l, s, p);
  });
}, HE = [].slice, sb = function(l, s) {
  return l && Ao(l) && "length" in l && (!s && !l.length || l.length - 1 in l && Ao(l[0])) && !l.nodeType && l !== Lo;
}, IN = function(l, s, f) {
  return f === void 0 && (f = []), l.forEach(function(p) {
    var y;
    return Ur(p) && !s || sb(p, 1) ? (y = f).push.apply(y, hl(p)) : f.push(p);
  }) || f;
}, hl = function(l, s, f) {
  return Tn && !s && Tn.selector ? Tn.selector(l) : Ur(l) && !f && (UE || !pp()) ? HE.call((s || nC).querySelectorAll(l), 0) : Ca(l) ? IN(l, f) : sb(l) ? HE.call(l, 0) : l ? [l] : [];
}, IE = function(l) {
  return l = hl(l)[0] || Ov("Invalid scope") || {}, function(s) {
    var f = l.current || l.nativeElement || l;
    return hl(s, f.querySelectorAll ? f : f === l ? Ov("Invalid scope") || nC.createElement("div") : l);
  };
}, cb = function(l) {
  return l.sort(function() {
    return 0.5 - Math.random();
  });
}, fb = function(l) {
  if (Qn(l))
    return l;
  var s = Ao(l) ? l : {
    each: l
  }, f = df(s.ease), p = s.from || 0, y = parseFloat(s.base) || 0, h = {}, E = p > 0 && p < 1, x = isNaN(p) || E, T = s.axis, R = p, O = p;
  return Ur(p) ? R = O = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[p] || 0 : !E && x && (R = p[0], O = p[1]), function(A, L, V) {
    var N = (V || s).length, B = h[N], Q, ee, ne, se, W, de, ue, Ee, fe;
    if (!B) {
      if (fe = s.grid === "auto" ? 0 : (s.grid || [1, pl])[1], !fe) {
        for (ue = -pl; ue < (ue = V[fe++].getBoundingClientRect().left) && fe < N; )
          ;
        fe < N && fe--;
      }
      for (B = h[N] = [], Q = x ? Math.min(fe, N) * R - 0.5 : p % fe, ee = fe === pl ? 0 : x ? N * O / fe - 0.5 : p / fe | 0, ue = 0, Ee = pl, de = 0; de < N; de++)
        ne = de % fe - Q, se = ee - (de / fe | 0), B[de] = W = T ? Math.abs(T === "y" ? se : ne) : GT(ne * ne + se * se), W > ue && (ue = W), W < Ee && (Ee = W);
      p === "random" && cb(B), B.max = ue - Ee, B.min = Ee, B.v = N = (parseFloat(s.amount) || parseFloat(s.each) * (fe > N ? N - 1 : T ? T === "y" ? N / fe : fe : Math.max(fe, N / fe)) || 0) * (p === "edges" ? -1 : 1), B.b = N < 0 ? y - N : y, B.u = Ea(s.amount || s.each) || 0, f = f && N < 0 ? Eb(f) : f;
    }
    return N = (B[A] - B.min) / B.max || 0, zn(B.b + (f ? f(N) : N) * B.v) + B.u;
  };
}, VE = function(l) {
  var s = Math.pow(10, ((l + "").split(".")[1] || "").length);
  return function(f) {
    var p = zn(Math.round(parseFloat(f) / l) * l * s);
    return (p - p % 1) / s + (Lu(f) ? 0 : Ea(f));
  };
}, db = function(l, s) {
  var f = Ca(l), p, y;
  return !f && Ao(l) && (p = f = l.radius || pl, l.values ? (l = hl(l.values), (y = !Lu(l[0])) && (p *= p)) : l = VE(l.increment)), Hs(s, f ? Qn(l) ? function(h) {
    return y = l(h), Math.abs(y - h) <= p ? y : h;
  } : function(h) {
    for (var E = parseFloat(y ? h.x : h), x = parseFloat(y ? h.y : 0), T = pl, R = 0, O = l.length, A, L; O--; )
      y ? (A = l[O].x - E, L = l[O].y - x, A = A * A + L * L) : A = Math.abs(l[O] - E), A < T && (T = A, R = O);
    return R = !p || T <= p ? l[R] : h, y || R === h || Lu(h) ? R : R + Ea(h);
  } : VE(l));
}, pb = function(l, s, f, p) {
  return Hs(Ca(l) ? !s : f === !0 ? !!(f = 0) : !p, function() {
    return Ca(l) ? l[~~(Math.random() * l.length)] : (f = f || 1e-5) && (p = f < 1 ? Math.pow(10, (f + "").length - 2) : 1) && Math.floor(Math.round((l - f / 2 + Math.random() * (s - l + f * 0.99)) / f) * f * p) / p;
  });
}, VN = function() {
  for (var l = arguments.length, s = new Array(l), f = 0; f < l; f++)
    s[f] = arguments[f];
  return function(p) {
    return s.reduce(function(y, h) {
      return h(y);
    }, p);
  };
}, BN = function(l, s) {
  return function(f) {
    return l(parseFloat(f)) + (s || Ea(f));
  };
}, YN = function(l, s, f) {
  return vb(l, s, 0, 1, f);
}, hb = function(l, s, f) {
  return Hs(f, function(p) {
    return l[~~s(p)];
  });
}, $N = function g(l, s, f) {
  var p = s - l;
  return Ca(l) ? hb(l, g(0, l.length), s) : Hs(f, function(y) {
    return (p + (y - l) % p) % p + l;
  });
}, WN = function g(l, s, f) {
  var p = s - l, y = p * 2;
  return Ca(l) ? hb(l, g(0, l.length - 1), s) : Hs(f, function(h) {
    return h = (y + (h - l) % y) % y || 0, l + (h > p ? y - h : h);
  });
}, Mv = function(l) {
  return l.replace(TN, function(s) {
    var f = s.indexOf("[") + 1, p = s.substring(f || 7, f ? s.indexOf("]") : s.length - 1).split(bN);
    return pb(f ? p : +p[0], f ? 0 : +p[1], +p[2] || 1e-5);
  });
}, vb = function(l, s, f, p, y) {
  var h = s - l, E = p - f;
  return Hs(y, function(x) {
    return f + ((x - l) / h * E || 0);
  });
}, GN = function g(l, s, f, p) {
  var y = isNaN(l + s) ? 0 : function(L) {
    return (1 - L) * l + L * s;
  };
  if (!y) {
    var h = Ur(l), E = {}, x, T, R, O, A;
    if (f === !0 && (p = 1) && (f = null), h)
      l = {
        p: l
      }, s = {
        p: s
      };
    else if (Ca(l) && !Ca(s)) {
      for (R = [], O = l.length, A = O - 2, T = 1; T < O; T++)
        R.push(g(l[T - 1], l[T]));
      O--, y = function(V) {
        V *= O;
        var N = Math.min(A, ~~V);
        return R[N](V - N);
      }, f = s;
    } else p || (l = cp(Ca(l) ? [] : {}, l));
    if (!R) {
      for (x in s)
        uC.call(E, l, x, "get", s[x]);
      y = function(V) {
        return dC(V, E) || (h ? l.p : l);
      };
    }
  }
  return Hs(f, y);
}, CT = function(l, s, f) {
  var p = l.labels, y = pl, h, E, x;
  for (h in p)
    E = p[h] - s, E < 0 == !!f && E && y > (E = Math.abs(E)) && (x = h, y = E);
  return x;
}, Mi = function(l, s, f) {
  var p = l.vars, y = p[s], h = Tn, E = l._ctx, x, T, R;
  if (y)
    return x = p[s + "Params"], T = p.callbackScope || l, f && zs.length && Ig(), E && (Tn = E), R = x ? y.apply(T, x) : y.call(T), Tn = h, R;
}, Tv = function(l) {
  return js(l), l.scrollTrigger && l.scrollTrigger.kill(!!na), l.progress() < 1 && Mi(l, "onInterrupt"), l;
}, ap, mb = [], yb = function(l) {
  if (l)
    if (l = !l.name && l.default || l, tC() || l.headless) {
      var s = l.name, f = Qn(l), p = s && !f && l.init ? function() {
        this._props = [];
      } : l, y = {
        init: Lv,
        render: dC,
        add: uC,
        kill: sA,
        modifier: uA,
        rawVars: 0
      }, h = {
        targetTest: 0,
        get: 0,
        getSetter: fC,
        aliases: {},
        register: 0
      };
      if (pp(), l !== p) {
        if (Oi[s])
          return;
        Ui(p, Ui(Vg(l, y), h)), cp(p.prototype, cp(y, Vg(l, h))), Oi[p.prop = s] = p, l.targetTest && (zg.push(p), aC[s] = 1), s = (s === "css" ? "CSS" : s.charAt(0).toUpperCase() + s.substr(1)) + "Plugin";
      }
      ZT(s, p), l.register && l.register(ci, p, ui);
    } else
      mb.push(l);
}, hn = 255, bv = {
  aqua: [0, hn, hn],
  lime: [0, hn, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, hn],
  navy: [0, 0, 128],
  white: [hn, hn, hn],
  olive: [128, 128, 0],
  yellow: [hn, hn, 0],
  orange: [hn, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [hn, 0, 0],
  pink: [hn, 192, 203],
  cyan: [0, hn, hn],
  transparent: [hn, hn, hn, 0]
}, EE = function(l, s, f) {
  return l += l < 0 ? 1 : l > 1 ? -1 : 0, (l * 6 < 1 ? s + (f - s) * l * 6 : l < 0.5 ? f : l * 3 < 2 ? s + (f - s) * (2 / 3 - l) * 6 : s) * hn + 0.5 | 0;
}, gb = function(l, s, f) {
  var p = l ? Lu(l) ? [l >> 16, l >> 8 & hn, l & hn] : 0 : bv.black, y, h, E, x, T, R, O, A, L, V;
  if (!p) {
    if (l.substr(-1) === "," && (l = l.substr(0, l.length - 1)), bv[l])
      p = bv[l];
    else if (l.charAt(0) === "#") {
      if (l.length < 6 && (y = l.charAt(1), h = l.charAt(2), E = l.charAt(3), l = "#" + y + y + h + h + E + E + (l.length === 5 ? l.charAt(4) + l.charAt(4) : "")), l.length === 9)
        return p = parseInt(l.substr(1, 6), 16), [p >> 16, p >> 8 & hn, p & hn, parseInt(l.substr(7), 16) / 255];
      l = parseInt(l.substr(1), 16), p = [l >> 16, l >> 8 & hn, l & hn];
    } else if (l.substr(0, 3) === "hsl") {
      if (p = V = l.match(yT), !s)
        x = +p[0] % 360 / 360, T = +p[1] / 100, R = +p[2] / 100, h = R <= 0.5 ? R * (T + 1) : R + T - R * T, y = R * 2 - h, p.length > 3 && (p[3] *= 1), p[0] = EE(x + 1 / 3, y, h), p[1] = EE(x, y, h), p[2] = EE(x - 1 / 3, y, h);
      else if (~l.indexOf("="))
        return p = l.match(QT), f && p.length < 4 && (p[3] = 1), p;
    } else
      p = l.match(yT) || bv.transparent;
    p = p.map(Number);
  }
  return s && !V && (y = p[0] / hn, h = p[1] / hn, E = p[2] / hn, O = Math.max(y, h, E), A = Math.min(y, h, E), R = (O + A) / 2, O === A ? x = T = 0 : (L = O - A, T = R > 0.5 ? L / (2 - O - A) : L / (O + A), x = O === y ? (h - E) / L + (h < E ? 6 : 0) : O === h ? (E - y) / L + 2 : (y - h) / L + 4, x *= 60), p[0] = ~~(x + 0.5), p[1] = ~~(T * 100 + 0.5), p[2] = ~~(R * 100 + 0.5)), f && p.length < 4 && (p[3] = 1), p;
}, _b = function(l) {
  var s = [], f = [], p = -1;
  return l.split(Us).forEach(function(y) {
    var h = y.match(rp) || [];
    s.push.apply(s, h), f.push(p += h.length + 1);
  }), s.c = f, s;
}, wT = function(l, s, f) {
  var p = "", y = (l + p).match(Us), h = s ? "hsla(" : "rgba(", E = 0, x, T, R, O;
  if (!y)
    return l;
  if (y = y.map(function(A) {
    return (A = gb(A, s, 1)) && h + (s ? A[0] + "," + A[1] + "%," + A[2] + "%," + A[3] : A.join(",")) + ")";
  }), f && (R = _b(l), x = f.c, x.join(p) !== R.c.join(p)))
    for (T = l.replace(Us, "1").split(rp), O = T.length - 1; E < O; E++)
      p += T[E] + (~x.indexOf(E) ? y.shift() || h + "0,0,0,0)" : (R.length ? R : y.length ? y : f).shift());
  if (!T)
    for (T = l.split(Us), O = T.length - 1; E < O; E++)
      p += T[E] + y[E];
  return p + T[O];
}, Us = function() {
  var g = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", l;
  for (l in bv)
    g += "|" + l + "\\b";
  return new RegExp(g + ")", "gi");
}(), qN = /hsl[a]?\(/, Sb = function(l) {
  var s = l.join(" "), f;
  if (Us.lastIndex = 0, Us.test(s))
    return f = qN.test(s), l[1] = wT(l[1], f), l[0] = wT(l[0], f, _b(l[1])), !0;
}, Nv, Li = function() {
  var g = Date.now, l = 500, s = 33, f = g(), p = f, y = 1e3 / 240, h = y, E = [], x, T, R, O, A, L, V = function N(B) {
    var Q = g() - p, ee = B === !0, ne, se, W, de;
    if ((Q > l || Q < 0) && (f += Q - s), p += Q, W = p - f, ne = W - h, (ne > 0 || ee) && (de = ++O.frame, A = W - O.time * 1e3, O.time = W = W / 1e3, h += ne + (ne >= y ? 4 : y - ne), se = 1), ee || (x = T(N)), se)
      for (L = 0; L < E.length; L++)
        E[L](W, A, de, B);
  };
  return O = {
    time: 0,
    frame: 0,
    tick: function() {
      V(!0);
    },
    deltaRatio: function(B) {
      return A / (1e3 / (B || 60));
    },
    wake: function() {
      KT && (!UE && tC() && (Lo = UE = window, nC = Lo.document || {}, zi.gsap = ci, (Lo.gsapVersions || (Lo.gsapVersions = [])).push(ci.version), JT(Hg || Lo.GreenSockGlobals || !Lo.gsap && Lo || {}), mb.forEach(yb)), R = typeof requestAnimationFrame < "u" && requestAnimationFrame, x && O.sleep(), T = R || function(B) {
        return setTimeout(B, h - O.time * 1e3 + 1 | 0);
      }, Nv = 1, V(2));
    },
    sleep: function() {
      (R ? cancelAnimationFrame : clearTimeout)(x), Nv = 0, T = Lv;
    },
    lagSmoothing: function(B, Q) {
      l = B || 1 / 0, s = Math.min(Q || 33, l);
    },
    fps: function(B) {
      y = 1e3 / (B || 240), h = O.time * 1e3 + y;
    },
    add: function(B, Q, ee) {
      var ne = Q ? function(se, W, de, ue) {
        B(se, W, de, ue), O.remove(ne);
      } : B;
      return O.remove(B), E[ee ? "unshift" : "push"](ne), pp(), ne;
    },
    remove: function(B, Q) {
      ~(Q = E.indexOf(B)) && E.splice(Q, 1) && L >= Q && L--;
    },
    _listeners: E
  }, O;
}(), pp = function() {
  return !Nv && Li.wake();
}, Pt = {}, QN = /^[\d.\-M][\d.\-,\s]/, XN = /["']/g, KN = function(l) {
  for (var s = {}, f = l.substr(1, l.length - 3).split(":"), p = f[0], y = 1, h = f.length, E, x, T; y < h; y++)
    x = f[y], E = y !== h - 1 ? x.lastIndexOf(",") : x.length, T = x.substr(0, E), s[p] = isNaN(T) ? T.replace(XN, "").trim() : +T, p = x.substr(E + 1).trim();
  return s;
}, JN = function(l) {
  var s = l.indexOf("(") + 1, f = l.indexOf(")"), p = l.indexOf("(", s);
  return l.substring(s, ~p && p < f ? l.indexOf(")", f + 1) : f);
}, ZN = function(l) {
  var s = (l + "").split("("), f = Pt[s[0]];
  return f && s.length > 1 && f.config ? f.config.apply(null, ~l.indexOf("{") ? [KN(s[1])] : JN(l).split(",").map(rb)) : Pt._CE && QN.test(l) ? Pt._CE("", l) : f;
}, Eb = function(l) {
  return function(s) {
    return 1 - l(1 - s);
  };
}, Cb = function g(l, s) {
  for (var f = l._first, p; f; )
    f instanceof Pa ? g(f, s) : f.vars.yoyoEase && (!f._yoyo || !f._repeat) && f._yoyo !== s && (f.timeline ? g(f.timeline, s) : (p = f._ease, f._ease = f._yEase, f._yEase = p, f._yoyo = s)), f = f._next;
}, df = function(l, s) {
  return l && (Qn(l) ? l : Pt[l] || ZN(l)) || s;
}, hf = function(l, s, f, p) {
  f === void 0 && (f = function(x) {
    return 1 - s(1 - x);
  }), p === void 0 && (p = function(x) {
    return x < 0.5 ? s(x * 2) / 2 : 1 - s((1 - x) * 2) / 2;
  });
  var y = {
    easeIn: s,
    easeOut: f,
    easeInOut: p
  }, h;
  return oi(l, function(E) {
    Pt[E] = zi[E] = y, Pt[h = E.toLowerCase()] = f;
    for (var x in y)
      Pt[h + (x === "easeIn" ? ".in" : x === "easeOut" ? ".out" : ".inOut")] = Pt[E + "." + x] = y[x];
  }), y;
}, wb = function(l) {
  return function(s) {
    return s < 0.5 ? (1 - l(1 - s * 2)) / 2 : 0.5 + l((s - 0.5) * 2) / 2;
  };
}, CE = function g(l, s, f) {
  var p = s >= 1 ? s : 1, y = (f || (l ? 0.3 : 0.45)) / (s < 1 ? s : 1), h = y / zE * (Math.asin(1 / p) || 0), E = function(R) {
    return R === 1 ? 1 : p * Math.pow(2, -10 * R) * xN((R - h) * y) + 1;
  }, x = l === "out" ? E : l === "in" ? function(T) {
    return 1 - E(1 - T);
  } : wb(E);
  return y = zE / y, x.config = function(T, R) {
    return g(l, T, R);
  }, x;
}, wE = function g(l, s) {
  s === void 0 && (s = 1.70158);
  var f = function(h) {
    return h ? --h * h * ((s + 1) * h + s) + 1 : 0;
  }, p = l === "out" ? f : l === "in" ? function(y) {
    return 1 - f(1 - y);
  } : wb(f);
  return p.config = function(y) {
    return g(l, y);
  }, p;
};
oi("Linear,Quad,Cubic,Quart,Quint,Strong", function(g, l) {
  var s = l < 5 ? l + 1 : l;
  hf(g + ",Power" + (s - 1), l ? function(f) {
    return Math.pow(f, s);
  } : function(f) {
    return f;
  }, function(f) {
    return 1 - Math.pow(1 - f, s);
  }, function(f) {
    return f < 0.5 ? Math.pow(f * 2, s) / 2 : 1 - Math.pow((1 - f) * 2, s) / 2;
  });
});
Pt.Linear.easeNone = Pt.none = Pt.Linear.easeIn;
hf("Elastic", CE("in"), CE("out"), CE());
(function(g, l) {
  var s = 1 / l, f = 2 * s, p = 2.5 * s, y = function(E) {
    return E < s ? g * E * E : E < f ? g * Math.pow(E - 1.5 / l, 2) + 0.75 : E < p ? g * (E -= 2.25 / l) * E + 0.9375 : g * Math.pow(E - 2.625 / l, 2) + 0.984375;
  };
  hf("Bounce", function(h) {
    return 1 - y(1 - h);
  }, y);
})(7.5625, 2.75);
hf("Expo", function(g) {
  return Math.pow(2, 10 * (g - 1)) * g + g * g * g * g * g * g * (1 - g);
});
hf("Circ", function(g) {
  return -(GT(1 - g * g) - 1);
});
hf("Sine", function(g) {
  return g === 1 ? 1 : -wN(g * EN) + 1;
});
hf("Back", wE("in"), wE("out"), wE());
Pt.SteppedEase = Pt.steps = zi.SteppedEase = {
  config: function(l, s) {
    l === void 0 && (l = 1);
    var f = 1 / l, p = l + (s ? 0 : 1), y = s ? 1 : 0, h = 1 - vn;
    return function(E) {
      return ((p * Pv(0, h, E) | 0) + y) * f;
    };
  }
};
sp.ease = Pt["quad.out"];
oi("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(g) {
  return iC += g + "," + g + "Params,";
});
var xb = function(l, s) {
  this.id = CN++, l._gsap = this, this.target = l, this.harness = s, this.get = s ? s.get : tb, this.set = s ? s.getSetter : fC;
}, Av = /* @__PURE__ */ function() {
  function g(s) {
    this.vars = s, this._delay = +s.delay || 0, (this._repeat = s.repeat === 1 / 0 ? -2 : s.repeat || 0) && (this._rDelay = s.repeatDelay || 0, this._yoyo = !!s.yoyo || !!s.yoyoEase), this._ts = 1, dp(this, +s.duration, 1, 1), this.data = s.data, Tn && (this._ctx = Tn, Tn.data.push(this)), Nv || Li.wake();
  }
  var l = g.prototype;
  return l.delay = function(f) {
    return f || f === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + f - this._delay), this._delay = f, this) : this._delay;
  }, l.duration = function(f) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? f + (f + this._rDelay) * this._repeat : f) : this.totalDuration() && this._dur;
  }, l.totalDuration = function(f) {
    return arguments.length ? (this._dirty = 0, dp(this, this._repeat < 0 ? f : (f - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, l.totalTime = function(f, p) {
    if (pp(), !arguments.length)
      return this._tTime;
    var y = this._dp;
    if (y && y.smoothChildTiming && this._ts) {
      for (Zg(this, f), !y._dp || y.parent || lb(y, this); y && y.parent; )
        y.parent._time !== y._start + (y._ts >= 0 ? y._tTime / y._ts : (y.totalDuration() - y._tTime) / -y._ts) && y.totalTime(y._tTime, !0), y = y.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && f < this._tDur || this._ts < 0 && f > 0 || !this._tDur && !f) && Mo(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== f || !this._dur && !p || this._initted && Math.abs(this._zTime) === vn || !this._initted && this._dur && f || !f && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = f), nb(this, f, p)), this;
  }, l.time = function(f, p) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), f + ST(this)) % (this._dur + this._rDelay) || (f ? this._dur : 0), p) : this._time;
  }, l.totalProgress = function(f, p) {
    return arguments.length ? this.totalTime(this.totalDuration() * f, p) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, l.progress = function(f, p) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - f : f) + ST(this), p) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, l.iteration = function(f, p) {
    var y = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (f - 1) * y, p) : this._repeat ? fp(this._tTime, y) + 1 : 1;
  }, l.timeScale = function(f, p) {
    if (!arguments.length)
      return this._rts === -vn ? 0 : this._rts;
    if (this._rts === f)
      return this;
    var y = this.parent && this._ts ? Bg(this.parent._time, this) : this._tTime;
    return this._rts = +f || 0, this._ts = this._ps || f === -vn ? 0 : this._rts, this.totalTime(Pv(-Math.abs(this._delay), this.totalDuration(), y), p !== !1), Jg(this), AN(this);
  }, l.paused = function(f) {
    return arguments.length ? (this._ps !== f && (this._ps = f, f ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (pp(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== vn && (this._tTime -= vn)))), this) : this._ps;
  }, l.startTime = function(f) {
    if (arguments.length) {
      this._start = zn(f);
      var p = this.parent || this._dp;
      return p && (p._sort || !this.parent) && Mo(p, this, this._start - this._delay), this;
    }
    return this._start;
  }, l.endTime = function(f) {
    return this._start + (li(f) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, l.rawTime = function(f) {
    var p = this.parent || this._dp;
    return p ? f && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Bg(p.rawTime(f), this) : this._tTime : this._tTime;
  }, l.revert = function(f) {
    f === void 0 && (f = ON);
    var p = na;
    return na = f, oC(this) && (this.timeline && this.timeline.revert(f), this.totalTime(-0.01, f.suppressEvents)), this.data !== "nested" && f.kill !== !1 && this.kill(), na = p, this;
  }, l.globalTime = function(f) {
    for (var p = this, y = arguments.length ? f : p.rawTime(); p; )
      y = p._start + y / (Math.abs(p._ts) || 1), p = p._dp;
    return !this.parent && this._sat ? this._sat.globalTime(f) : y;
  }, l.repeat = function(f) {
    return arguments.length ? (this._repeat = f === 1 / 0 ? -2 : f, ET(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, l.repeatDelay = function(f) {
    if (arguments.length) {
      var p = this._time;
      return this._rDelay = f, ET(this), p ? this.time(p) : this;
    }
    return this._rDelay;
  }, l.yoyo = function(f) {
    return arguments.length ? (this._yoyo = f, this) : this._yoyo;
  }, l.seek = function(f, p) {
    return this.totalTime(dl(this, f), li(p));
  }, l.restart = function(f, p) {
    return this.play().totalTime(f ? -this._delay : 0, li(p)), this._dur || (this._zTime = -vn), this;
  }, l.play = function(f, p) {
    return f != null && this.seek(f, p), this.reversed(!1).paused(!1);
  }, l.reverse = function(f, p) {
    return f != null && this.seek(f || this.totalDuration(), p), this.reversed(!0).paused(!1);
  }, l.pause = function(f, p) {
    return f != null && this.seek(f, p), this.paused(!0);
  }, l.resume = function() {
    return this.paused(!1);
  }, l.reversed = function(f) {
    return arguments.length ? (!!f !== this.reversed() && this.timeScale(-this._rts || (f ? -vn : 0)), this) : this._rts < 0;
  }, l.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -vn, this;
  }, l.isActive = function() {
    var f = this.parent || this._dp, p = this._start, y;
    return !!(!f || this._ts && this._initted && f.isActive() && (y = f.rawTime(!0)) >= p && y < this.endTime(!0) - vn);
  }, l.eventCallback = function(f, p, y) {
    var h = this.vars;
    return arguments.length > 1 ? (p ? (h[f] = p, y && (h[f + "Params"] = y), f === "onUpdate" && (this._onUpdate = p)) : delete h[f], this) : h[f];
  }, l.then = function(f) {
    var p = this, y = p._prom;
    return new Promise(function(h) {
      var E = Qn(f) ? f : ab, x = function() {
        var R = p.then;
        p.then = null, y && y(), Qn(E) && (E = E(p)) && (E.then || E === p) && (p.then = R), h(E), p.then = R;
      };
      p._initted && p.totalProgress() === 1 && p._ts >= 0 || !p._tTime && p._ts < 0 ? x() : p._prom = x;
    });
  }, l.kill = function() {
    Tv(this);
  }, g;
}();
Ui(Av.prototype, {
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
  _zTime: -vn,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var Pa = /* @__PURE__ */ function(g) {
  WT(l, g);
  function l(f, p) {
    var y;
    return f === void 0 && (f = {}), y = g.call(this, f) || this, y.labels = {}, y.smoothChildTiming = !!f.smoothChildTiming, y.autoRemoveChildren = !!f.autoRemoveChildren, y._sort = li(f.sortChildren), Un && Mo(f.parent || Un, Du(y), p), f.reversed && y.reverse(), f.paused && y.paused(!0), f.scrollTrigger && ob(Du(y), f.scrollTrigger), y;
  }
  var s = l.prototype;
  return s.to = function(p, y, h) {
    return kv(0, arguments, this), this;
  }, s.from = function(p, y, h) {
    return kv(1, arguments, this), this;
  }, s.fromTo = function(p, y, h, E) {
    return kv(2, arguments, this), this;
  }, s.set = function(p, y, h) {
    return y.duration = 0, y.parent = this, Rv(y).repeatDelay || (y.repeat = 0), y.immediateRender = !!y.immediateRender, new dr(p, y, dl(this, h), 1), this;
  }, s.call = function(p, y, h) {
    return Mo(this, dr.delayedCall(0, p, y), h);
  }, s.staggerTo = function(p, y, h, E, x, T, R) {
    return h.duration = y, h.stagger = h.stagger || E, h.onComplete = T, h.onCompleteParams = R, h.parent = this, new dr(p, h, dl(this, x)), this;
  }, s.staggerFrom = function(p, y, h, E, x, T, R) {
    return h.runBackwards = 1, Rv(h).immediateRender = li(h.immediateRender), this.staggerTo(p, y, h, E, x, T, R);
  }, s.staggerFromTo = function(p, y, h, E, x, T, R, O) {
    return E.startAt = h, Rv(E).immediateRender = li(E.immediateRender), this.staggerTo(p, y, E, x, T, R, O);
  }, s.render = function(p, y, h) {
    var E = this._time, x = this._dirty ? this.totalDuration() : this._tDur, T = this._dur, R = p <= 0 ? 0 : zn(p), O = this._zTime < 0 != p < 0 && (this._initted || !T), A, L, V, N, B, Q, ee, ne, se, W, de, ue;
    if (this !== Un && R > x && p >= 0 && (R = x), R !== this._tTime || h || O) {
      if (E !== this._time && T && (R += this._time - E, p += this._time - E), A = R, se = this._start, ne = this._ts, Q = !ne, O && (T || (E = this._zTime), (p || !y) && (this._zTime = p)), this._repeat) {
        if (de = this._yoyo, B = T + this._rDelay, this._repeat < -1 && p < 0)
          return this.totalTime(B * 100 + p, y, h);
        if (A = zn(R % B), R === x ? (N = this._repeat, A = T) : (W = zn(R / B), N = ~~W, N && N === W && (A = T, N--), A > T && (A = T)), W = fp(this._tTime, B), !E && this._tTime && W !== N && this._tTime - W * B - this._dur <= 0 && (W = N), de && N & 1 && (A = T - A, ue = 1), N !== W && !this._lock) {
          var Ee = de && W & 1, fe = Ee === (de && N & 1);
          if (N < W && (Ee = !Ee), E = Ee ? 0 : R % T ? T : R, this._lock = 1, this.render(E || (ue ? 0 : zn(N * B)), y, !T)._lock = 0, this._tTime = R, !y && this.parent && Mi(this, "onRepeat"), this.vars.repeatRefresh && !ue && (this.invalidate()._lock = 1, W = N), E && E !== this._time || Q !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (T = this._dur, x = this._tDur, fe && (this._lock = 2, E = Ee ? T : -1e-4, this.render(E, !0), this.vars.repeatRefresh && !ue && this.invalidate()), this._lock = 0, !this._ts && !Q)
            return this;
          Cb(this, ue);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (ee = PN(this, zn(E), zn(A)), ee && (R -= A - (A = ee._start))), this._tTime = R, this._time = A, this._act = !ne, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = p, E = 0), !E && R && T && !y && !W && (Mi(this, "onStart"), this._tTime !== R))
        return this;
      if (A >= E && p >= 0)
        for (L = this._first; L; ) {
          if (V = L._next, (L._act || A >= L._start) && L._ts && ee !== L) {
            if (L.parent !== this)
              return this.render(p, y, h);
            if (L.render(L._ts > 0 ? (A - L._start) * L._ts : (L._dirty ? L.totalDuration() : L._tDur) + (A - L._start) * L._ts, y, h), A !== this._time || !this._ts && !Q) {
              ee = 0, V && (R += this._zTime = -vn);
              break;
            }
          }
          L = V;
        }
      else {
        L = this._last;
        for (var Ye = p < 0 ? p : A; L; ) {
          if (V = L._prev, (L._act || Ye <= L._end) && L._ts && ee !== L) {
            if (L.parent !== this)
              return this.render(p, y, h);
            if (L.render(L._ts > 0 ? (Ye - L._start) * L._ts : (L._dirty ? L.totalDuration() : L._tDur) + (Ye - L._start) * L._ts, y, h || na && oC(L)), A !== this._time || !this._ts && !Q) {
              ee = 0, V && (R += this._zTime = Ye ? -vn : vn);
              break;
            }
          }
          L = V;
        }
      }
      if (ee && !y && (this.pause(), ee.render(A >= E ? 0 : -vn)._zTime = A >= E ? 1 : -1, this._ts))
        return this._start = se, Jg(this), this.render(p, y, h);
      this._onUpdate && !y && Mi(this, "onUpdate", !0), (R === x && this._tTime >= this.totalDuration() || !R && E) && (se === this._start || Math.abs(ne) !== Math.abs(this._ts)) && (this._lock || ((p || !T) && (R === x && this._ts > 0 || !R && this._ts < 0) && js(this, 1), !y && !(p < 0 && !E) && (R || E || !x) && (Mi(this, R === x && p >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(R < x && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, s.add = function(p, y) {
    var h = this;
    if (Lu(y) || (y = dl(this, y, p)), !(p instanceof Av)) {
      if (Ca(p))
        return p.forEach(function(E) {
          return h.add(E, y);
        }), this;
      if (Ur(p))
        return this.addLabel(p, y);
      if (Qn(p))
        p = dr.delayedCall(0, p);
      else
        return this;
    }
    return this !== p ? Mo(this, p, y) : this;
  }, s.getChildren = function(p, y, h, E) {
    p === void 0 && (p = !0), y === void 0 && (y = !0), h === void 0 && (h = !0), E === void 0 && (E = -pl);
    for (var x = [], T = this._first; T; )
      T._start >= E && (T instanceof dr ? y && x.push(T) : (h && x.push(T), p && x.push.apply(x, T.getChildren(!0, y, h)))), T = T._next;
    return x;
  }, s.getById = function(p) {
    for (var y = this.getChildren(1, 1, 1), h = y.length; h--; )
      if (y[h].vars.id === p)
        return y[h];
  }, s.remove = function(p) {
    return Ur(p) ? this.removeLabel(p) : Qn(p) ? this.killTweensOf(p) : (p.parent === this && Kg(this, p), p === this._recent && (this._recent = this._last), ff(this));
  }, s.totalTime = function(p, y) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = zn(Li.time - (this._ts > 0 ? p / this._ts : (this.totalDuration() - p) / -this._ts))), g.prototype.totalTime.call(this, p, y), this._forcing = 0, this) : this._tTime;
  }, s.addLabel = function(p, y) {
    return this.labels[p] = dl(this, y), this;
  }, s.removeLabel = function(p) {
    return delete this.labels[p], this;
  }, s.addPause = function(p, y, h) {
    var E = dr.delayedCall(0, y || Lv, h);
    return E.data = "isPause", this._hasPause = 1, Mo(this, E, dl(this, p));
  }, s.removePause = function(p) {
    var y = this._first;
    for (p = dl(this, p); y; )
      y._start === p && y.data === "isPause" && js(y), y = y._next;
  }, s.killTweensOf = function(p, y, h) {
    for (var E = this.getTweensOf(p, h), x = E.length; x--; )
      Ls !== E[x] && E[x].kill(p, y);
    return this;
  }, s.getTweensOf = function(p, y) {
    for (var h = [], E = hl(p), x = this._first, T = Lu(y), R; x; )
      x instanceof dr ? LN(x._targets, E) && (T ? (!Ls || x._initted && x._ts) && x.globalTime(0) <= y && x.globalTime(x.totalDuration()) > y : !y || x.isActive()) && h.push(x) : (R = x.getTweensOf(E, y)).length && h.push.apply(h, R), x = x._next;
    return h;
  }, s.tweenTo = function(p, y) {
    y = y || {};
    var h = this, E = dl(h, p), x = y, T = x.startAt, R = x.onStart, O = x.onStartParams, A = x.immediateRender, L, V = dr.to(h, Ui({
      ease: y.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: E,
      overwrite: "auto",
      duration: y.duration || Math.abs((E - (T && "time" in T ? T.time : h._time)) / h.timeScale()) || vn,
      onStart: function() {
        if (h.pause(), !L) {
          var B = y.duration || Math.abs((E - (T && "time" in T ? T.time : h._time)) / h.timeScale());
          V._dur !== B && dp(V, B, 0, 1).render(V._time, !0, !0), L = 1;
        }
        R && R.apply(V, O || []);
      }
    }, y));
    return A ? V.render(0) : V;
  }, s.tweenFromTo = function(p, y, h) {
    return this.tweenTo(y, Ui({
      startAt: {
        time: dl(this, p)
      }
    }, h));
  }, s.recent = function() {
    return this._recent;
  }, s.nextLabel = function(p) {
    return p === void 0 && (p = this._time), CT(this, dl(this, p));
  }, s.previousLabel = function(p) {
    return p === void 0 && (p = this._time), CT(this, dl(this, p), 1);
  }, s.currentLabel = function(p) {
    return arguments.length ? this.seek(p, !0) : this.previousLabel(this._time + vn);
  }, s.shiftChildren = function(p, y, h) {
    h === void 0 && (h = 0);
    var E = this._first, x = this.labels, T;
    for (p = zn(p); E; )
      E._start >= h && (E._start += p, E._end += p), E = E._next;
    if (y)
      for (T in x)
        x[T] >= h && (x[T] += p);
    return ff(this);
  }, s.invalidate = function(p) {
    var y = this._first;
    for (this._lock = 0; y; )
      y.invalidate(p), y = y._next;
    return g.prototype.invalidate.call(this, p);
  }, s.clear = function(p) {
    p === void 0 && (p = !0);
    for (var y = this._first, h; y; )
      h = y._next, this.remove(y), y = h;
    return this._dp && (this._time = this._tTime = this._pTime = 0), p && (this.labels = {}), ff(this);
  }, s.totalDuration = function(p) {
    var y = 0, h = this, E = h._last, x = pl, T, R, O;
    if (arguments.length)
      return h.timeScale((h._repeat < 0 ? h.duration() : h.totalDuration()) / (h.reversed() ? -p : p));
    if (h._dirty) {
      for (O = h.parent; E; )
        T = E._prev, E._dirty && E.totalDuration(), R = E._start, R > x && h._sort && E._ts && !h._lock ? (h._lock = 1, Mo(h, E, R - E._delay, 1)._lock = 0) : x = R, R < 0 && E._ts && (y -= R, (!O && !h._dp || O && O.smoothChildTiming) && (h._start += zn(R / h._ts), h._time -= R, h._tTime -= R), h.shiftChildren(-R, !1, -1 / 0), x = 0), E._end > y && E._ts && (y = E._end), E = T;
      dp(h, h === Un && h._time > y ? h._time : y, 1, 1), h._dirty = 0;
    }
    return h._tDur;
  }, l.updateRoot = function(p) {
    if (Un._ts && (nb(Un, Bg(p, Un)), eb = Li.frame), Li.frame >= gT) {
      gT += Ai.autoSleep || 120;
      var y = Un._first;
      if ((!y || !y._ts) && Ai.autoSleep && Li._listeners.length < 2) {
        for (; y && !y._ts; )
          y = y._next;
        y || Li.sleep();
      }
    }
  }, l;
}(Av);
Ui(Pa.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var eA = function(l, s, f, p, y, h, E) {
  var x = new ui(this._pt, l, s, 0, 1, Ob, null, y), T = 0, R = 0, O, A, L, V, N, B, Q, ee;
  for (x.b = f, x.e = p, f += "", p += "", (Q = ~p.indexOf("random(")) && (p = Mv(p)), h && (ee = [f, p], h(ee, l, s), f = ee[0], p = ee[1]), A = f.match(_E) || []; O = _E.exec(p); )
    V = O[0], N = p.substring(T, O.index), L ? L = (L + 1) % 5 : N.substr(-5) === "rgba(" && (L = 1), V !== A[R++] && (B = parseFloat(A[R - 1]) || 0, x._pt = {
      _next: x._pt,
      p: N || R === 1 ? N : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: B,
      c: V.charAt(1) === "=" ? ip(B, V) - B : parseFloat(V) - B,
      m: L && L < 4 ? Math.round : 0
    }, T = _E.lastIndex);
  return x.c = T < p.length ? p.substring(T, p.length) : "", x.fp = E, (XT.test(p) || Q) && (x.e = 0), this._pt = x, x;
}, uC = function(l, s, f, p, y, h, E, x, T, R) {
  Qn(p) && (p = p(y || 0, l, h));
  var O = l[s], A = f !== "get" ? f : Qn(O) ? T ? l[s.indexOf("set") || !Qn(l["get" + s.substr(3)]) ? s : "get" + s.substr(3)](T) : l[s]() : O, L = Qn(O) ? T ? iA : kb : cC, V;
  if (Ur(p) && (~p.indexOf("random(") && (p = Mv(p)), p.charAt(1) === "=" && (V = ip(A, p) + (Ea(A) || 0), (V || V === 0) && (p = V))), !R || A !== p || BE)
    return !isNaN(A * p) && p !== "" ? (V = new ui(this._pt, l, s, +A || 0, p - (A || 0), typeof O == "boolean" ? oA : Db, 0, L), T && (V.fp = T), E && V.modifier(E, this, l), this._pt = V) : (!O && !(s in l) && rC(s, p), eA.call(this, l, s, A, p, L, x || Ai.stringFilter, T));
}, tA = function(l, s, f, p, y) {
  if (Qn(l) && (l = Dv(l, y, s, f, p)), !Ao(l) || l.style && l.nodeType || Ca(l) || qT(l))
    return Ur(l) ? Dv(l, y, s, f, p) : l;
  var h = {}, E;
  for (E in l)
    h[E] = Dv(l[E], y, s, f, p);
  return h;
}, Tb = function(l, s, f, p, y, h) {
  var E, x, T, R;
  if (Oi[l] && (E = new Oi[l]()).init(y, E.rawVars ? s[l] : tA(s[l], p, y, h, f), f, p, h) !== !1 && (f._pt = x = new ui(f._pt, y, l, 0, 1, E.render, E, 0, E.priority), f !== ap))
    for (T = f._ptLookup[f._targets.indexOf(y)], R = E._props.length; R--; )
      T[E._props[R]] = x;
  return E;
}, Ls, BE, sC = function g(l, s, f) {
  var p = l.vars, y = p.ease, h = p.startAt, E = p.immediateRender, x = p.lazy, T = p.onUpdate, R = p.runBackwards, O = p.yoyoEase, A = p.keyframes, L = p.autoRevert, V = l._dur, N = l._startAt, B = l._targets, Q = l.parent, ee = Q && Q.data === "nested" ? Q.vars.targets : B, ne = l._overwrite === "auto" && !ZE, se = l.timeline, W, de, ue, Ee, fe, Ye, Ke, We, Re, ut, Ge, he, ce;
  if (se && (!A || !y) && (y = "none"), l._ease = df(y, sp.ease), l._yEase = O ? Eb(df(O === !0 ? y : O, sp.ease)) : 0, O && l._yoyo && !l._repeat && (O = l._yEase, l._yEase = l._ease, l._ease = O), l._from = !se && !!p.runBackwards, !se || A && !p.stagger) {
    if (We = B[0] ? cf(B[0]).harness : 0, he = We && p[We.prop], W = Vg(p, aC), N && (N._zTime < 0 && N.progress(1), s < 0 && R && E && !L ? N.render(-1, !0) : N.revert(R && V ? Ag : DN), N._lazy = 0), h) {
      if (js(l._startAt = dr.set(B, Ui({
        data: "isStart",
        overwrite: !1,
        parent: Q,
        immediateRender: !0,
        lazy: !N && li(x),
        startAt: null,
        delay: 0,
        onUpdate: T && function() {
          return Mi(l, "onUpdate");
        },
        stagger: 0
      }, h))), l._startAt._dp = 0, l._startAt._sat = l, s < 0 && (na || !E && !L) && l._startAt.revert(Ag), E && V && s <= 0 && f <= 0) {
        s && (l._zTime = s);
        return;
      }
    } else if (R && V && !N) {
      if (s && (E = !1), ue = Ui({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: E && !N && li(x),
        immediateRender: E,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: Q
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, W), he && (ue[We.prop] = he), js(l._startAt = dr.set(B, ue)), l._startAt._dp = 0, l._startAt._sat = l, s < 0 && (na ? l._startAt.revert(Ag) : l._startAt.render(-1, !0)), l._zTime = s, !E)
        g(l._startAt, vn, vn);
      else if (!s)
        return;
    }
    for (l._pt = l._ptCache = 0, x = V && li(x) || x && !V, de = 0; de < B.length; de++) {
      if (fe = B[de], Ke = fe._gsap || lC(B)[de]._gsap, l._ptLookup[de] = ut = {}, jE[Ke.id] && zs.length && Ig(), Ge = ee === B ? de : ee.indexOf(fe), We && (Re = new We()).init(fe, he || W, l, Ge, ee) !== !1 && (l._pt = Ee = new ui(l._pt, fe, Re.name, 0, 1, Re.render, Re, 0, Re.priority), Re._props.forEach(function(ie) {
        ut[ie] = Ee;
      }), Re.priority && (Ye = 1)), !We || he)
        for (ue in W)
          Oi[ue] && (Re = Tb(ue, W, l, Ge, fe, ee)) ? Re.priority && (Ye = 1) : ut[ue] = Ee = uC.call(l, fe, ue, "get", W[ue], Ge, ee, 0, p.stringFilter);
      l._op && l._op[de] && l.kill(fe, l._op[de]), ne && l._pt && (Ls = l, Un.killTweensOf(fe, ut, l.globalTime(s)), ce = !l.parent, Ls = 0), l._pt && x && (jE[Ke.id] = 1);
    }
    Ye && Lb(l), l._onInit && l._onInit(l);
  }
  l._onUpdate = T, l._initted = (!l._op || l._pt) && !ce, A && s <= 0 && se.render(pl, !0, !0);
}, nA = function(l, s, f, p, y, h, E, x) {
  var T = (l._pt && l._ptCache || (l._ptCache = {}))[s], R, O, A, L;
  if (!T)
    for (T = l._ptCache[s] = [], A = l._ptLookup, L = l._targets.length; L--; ) {
      if (R = A[L][s], R && R.d && R.d._pt)
        for (R = R.d._pt; R && R.p !== s && R.fp !== s; )
          R = R._next;
      if (!R)
        return BE = 1, l.vars[s] = "+=0", sC(l, E), BE = 0, x ? Ov(s + " not eligible for reset") : 1;
      T.push(R);
    }
  for (L = T.length; L--; )
    O = T[L], R = O._pt || O, R.s = (p || p === 0) && !y ? p : R.s + (p || 0) + h * R.c, R.c = f - R.s, O.e && (O.e = ar(f) + Ea(O.e)), O.b && (O.b = R.s + Ea(O.b));
}, rA = function(l, s) {
  var f = l[0] ? cf(l[0]).harness : 0, p = f && f.aliases, y, h, E, x;
  if (!p)
    return s;
  y = cp({}, s);
  for (h in p)
    if (h in y)
      for (x = p[h].split(","), E = x.length; E--; )
        y[x[E]] = y[h];
  return y;
}, aA = function(l, s, f, p) {
  var y = s.ease || p || "power1.inOut", h, E;
  if (Ca(s))
    E = f[l] || (f[l] = []), s.forEach(function(x, T) {
      return E.push({
        t: T / (s.length - 1) * 100,
        v: x,
        e: y
      });
    });
  else
    for (h in s)
      E = f[h] || (f[h] = []), h === "ease" || E.push({
        t: parseFloat(l),
        v: s[h],
        e: y
      });
}, Dv = function(l, s, f, p, y) {
  return Qn(l) ? l.call(s, f, p, y) : Ur(l) && ~l.indexOf("random(") ? Mv(l) : l;
}, bb = iC + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", Rb = {};
oi(bb + ",id,stagger,delay,duration,paused,scrollTrigger", function(g) {
  return Rb[g] = 1;
});
var dr = /* @__PURE__ */ function(g) {
  WT(l, g);
  function l(f, p, y, h) {
    var E;
    typeof p == "number" && (y.duration = p, p = y, y = null), E = g.call(this, h ? p : Rv(p)) || this;
    var x = E.vars, T = x.duration, R = x.delay, O = x.immediateRender, A = x.stagger, L = x.overwrite, V = x.keyframes, N = x.defaults, B = x.scrollTrigger, Q = x.yoyoEase, ee = p.parent || Un, ne = (Ca(f) || qT(f) ? Lu(f[0]) : "length" in p) ? [f] : hl(f), se, W, de, ue, Ee, fe, Ye, Ke;
    if (E._targets = ne.length ? lC(ne) : Ov("GSAP target " + f + " not found. https://gsap.com", !Ai.nullTargetWarn) || [], E._ptLookup = [], E._overwrite = L, V || A || Mg(T) || Mg(R)) {
      if (p = E.vars, se = E.timeline = new Pa({
        data: "nested",
        defaults: N || {},
        targets: ee && ee.data === "nested" ? ee.vars.targets : ne
      }), se.kill(), se.parent = se._dp = Du(E), se._start = 0, A || Mg(T) || Mg(R)) {
        if (ue = ne.length, Ye = A && fb(A), Ao(A))
          for (Ee in A)
            ~bb.indexOf(Ee) && (Ke || (Ke = {}), Ke[Ee] = A[Ee]);
        for (W = 0; W < ue; W++)
          de = Vg(p, Rb), de.stagger = 0, Q && (de.yoyoEase = Q), Ke && cp(de, Ke), fe = ne[W], de.duration = +Dv(T, Du(E), W, fe, ne), de.delay = (+Dv(R, Du(E), W, fe, ne) || 0) - E._delay, !A && ue === 1 && de.delay && (E._delay = R = de.delay, E._start += R, de.delay = 0), se.to(fe, de, Ye ? Ye(W, fe, ne) : 0), se._ease = Pt.none;
        se.duration() ? T = R = 0 : E.timeline = 0;
      } else if (V) {
        Rv(Ui(se.vars.defaults, {
          ease: "none"
        })), se._ease = df(V.ease || p.ease || "none");
        var We = 0, Re, ut, Ge;
        if (Ca(V))
          V.forEach(function(he) {
            return se.to(ne, he, ">");
          }), se.duration();
        else {
          de = {};
          for (Ee in V)
            Ee === "ease" || Ee === "easeEach" || aA(Ee, V[Ee], de, V.easeEach);
          for (Ee in de)
            for (Re = de[Ee].sort(function(he, ce) {
              return he.t - ce.t;
            }), We = 0, W = 0; W < Re.length; W++)
              ut = Re[W], Ge = {
                ease: ut.e,
                duration: (ut.t - (W ? Re[W - 1].t : 0)) / 100 * T
              }, Ge[Ee] = ut.v, se.to(ne, Ge, We), We += Ge.duration;
          se.duration() < T && se.to({}, {
            duration: T - se.duration()
          });
        }
      }
      T || E.duration(T = se.duration());
    } else
      E.timeline = 0;
    return L === !0 && !ZE && (Ls = Du(E), Un.killTweensOf(ne), Ls = 0), Mo(ee, Du(E), y), p.reversed && E.reverse(), p.paused && E.paused(!0), (O || !T && !V && E._start === zn(ee._time) && li(O) && zN(Du(E)) && ee.data !== "nested") && (E._tTime = -vn, E.render(Math.max(0, -R) || 0)), B && ob(Du(E), B), E;
  }
  var s = l.prototype;
  return s.render = function(p, y, h) {
    var E = this._time, x = this._tDur, T = this._dur, R = p < 0, O = p > x - vn && !R ? x : p < vn ? 0 : p, A, L, V, N, B, Q, ee, ne, se;
    if (!T)
      jN(this, p, y, h);
    else if (O !== this._tTime || !p || h || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== R || this._lazy) {
      if (A = O, ne = this.timeline, this._repeat) {
        if (N = T + this._rDelay, this._repeat < -1 && R)
          return this.totalTime(N * 100 + p, y, h);
        if (A = zn(O % N), O === x ? (V = this._repeat, A = T) : (B = zn(O / N), V = ~~B, V && V === B ? (A = T, V--) : A > T && (A = T)), Q = this._yoyo && V & 1, Q && (se = this._yEase, A = T - A), B = fp(this._tTime, N), A === E && !h && this._initted && V === B)
          return this._tTime = O, this;
        V !== B && (ne && this._yEase && Cb(ne, Q), this.vars.repeatRefresh && !Q && !this._lock && A !== N && this._initted && (this._lock = h = 1, this.render(zn(N * V), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (ub(this, R ? p : A, h, y, O))
          return this._tTime = 0, this;
        if (E !== this._time && !(h && this.vars.repeatRefresh && V !== B))
          return this;
        if (T !== this._dur)
          return this.render(p, y, h);
      }
      if (this._tTime = O, this._time = A, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = ee = (se || this._ease)(A / T), this._from && (this.ratio = ee = 1 - ee), !E && O && !y && !B && (Mi(this, "onStart"), this._tTime !== O))
        return this;
      for (L = this._pt; L; )
        L.r(ee, L.d), L = L._next;
      ne && ne.render(p < 0 ? p : ne._dur * ne._ease(A / this._dur), y, h) || this._startAt && (this._zTime = p), this._onUpdate && !y && (R && PE(this, p, y, h), Mi(this, "onUpdate")), this._repeat && V !== B && this.vars.onRepeat && !y && this.parent && Mi(this, "onRepeat"), (O === this._tDur || !O) && this._tTime === O && (R && !this._onUpdate && PE(this, p, !0, !0), (p || !T) && (O === this._tDur && this._ts > 0 || !O && this._ts < 0) && js(this, 1), !y && !(R && !E) && (O || E || Q) && (Mi(this, O === x ? "onComplete" : "onReverseComplete", !0), this._prom && !(O < x && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, s.targets = function() {
    return this._targets;
  }, s.invalidate = function(p) {
    return (!p || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(p), g.prototype.invalidate.call(this, p);
  }, s.resetTo = function(p, y, h, E, x) {
    Nv || Li.wake(), this._ts || this.play();
    var T = Math.min(this._dur, (this._dp._time - this._start) * this._ts), R;
    return this._initted || sC(this, T), R = this._ease(T / this._dur), nA(this, p, y, h, E, R, T, x) ? this.resetTo(p, y, h, E, 1) : (Zg(this, 0), this.parent || ib(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, s.kill = function(p, y) {
    if (y === void 0 && (y = "all"), !p && (!y || y === "all"))
      return this._lazy = this._pt = 0, this.parent ? Tv(this) : this.scrollTrigger && this.scrollTrigger.kill(!!na), this;
    if (this.timeline) {
      var h = this.timeline.totalDuration();
      return this.timeline.killTweensOf(p, y, Ls && Ls.vars.overwrite !== !0)._first || Tv(this), this.parent && h !== this.timeline.totalDuration() && dp(this, this._dur * this.timeline._tDur / h, 0, 1), this;
    }
    var E = this._targets, x = p ? hl(p) : E, T = this._ptLookup, R = this._pt, O, A, L, V, N, B, Q;
    if ((!y || y === "all") && NN(E, x))
      return y === "all" && (this._pt = 0), Tv(this);
    for (O = this._op = this._op || [], y !== "all" && (Ur(y) && (N = {}, oi(y, function(ee) {
      return N[ee] = 1;
    }), y = N), y = rA(E, y)), Q = E.length; Q--; )
      if (~x.indexOf(E[Q])) {
        A = T[Q], y === "all" ? (O[Q] = y, V = A, L = {}) : (L = O[Q] = O[Q] || {}, V = y);
        for (N in V)
          B = A && A[N], B && ((!("kill" in B.d) || B.d.kill(N) === !0) && Kg(this, B, "_pt"), delete A[N]), L !== "all" && (L[N] = 1);
      }
    return this._initted && !this._pt && R && Tv(this), this;
  }, l.to = function(p, y) {
    return new l(p, y, arguments[2]);
  }, l.from = function(p, y) {
    return kv(1, arguments);
  }, l.delayedCall = function(p, y, h, E) {
    return new l(y, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: p,
      onComplete: y,
      onReverseComplete: y,
      onCompleteParams: h,
      onReverseCompleteParams: h,
      callbackScope: E
    });
  }, l.fromTo = function(p, y, h) {
    return kv(2, arguments);
  }, l.set = function(p, y) {
    return y.duration = 0, y.repeatDelay || (y.repeat = 0), new l(p, y);
  }, l.killTweensOf = function(p, y, h) {
    return Un.killTweensOf(p, y, h);
  }, l;
}(Av);
Ui(dr.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
oi("staggerTo,staggerFrom,staggerFromTo", function(g) {
  dr[g] = function() {
    var l = new Pa(), s = HE.call(arguments, 0);
    return s.splice(g === "staggerFromTo" ? 5 : 4, 0, 0), l[g].apply(l, s);
  };
});
var cC = function(l, s, f) {
  return l[s] = f;
}, kb = function(l, s, f) {
  return l[s](f);
}, iA = function(l, s, f, p) {
  return l[s](p.fp, f);
}, lA = function(l, s, f) {
  return l.setAttribute(s, f);
}, fC = function(l, s) {
  return Qn(l[s]) ? kb : eC(l[s]) && l.setAttribute ? lA : cC;
}, Db = function(l, s) {
  return s.set(s.t, s.p, Math.round((s.s + s.c * l) * 1e6) / 1e6, s);
}, oA = function(l, s) {
  return s.set(s.t, s.p, !!(s.s + s.c * l), s);
}, Ob = function(l, s) {
  var f = s._pt, p = "";
  if (!l && s.b)
    p = s.b;
  else if (l === 1 && s.e)
    p = s.e;
  else {
    for (; f; )
      p = f.p + (f.m ? f.m(f.s + f.c * l) : Math.round((f.s + f.c * l) * 1e4) / 1e4) + p, f = f._next;
    p += s.c;
  }
  s.set(s.t, s.p, p, s);
}, dC = function(l, s) {
  for (var f = s._pt; f; )
    f.r(l, f.d), f = f._next;
}, uA = function(l, s, f, p) {
  for (var y = this._pt, h; y; )
    h = y._next, y.p === p && y.modifier(l, s, f), y = h;
}, sA = function(l) {
  for (var s = this._pt, f, p; s; )
    p = s._next, s.p === l && !s.op || s.op === l ? Kg(this, s, "_pt") : s.dep || (f = 1), s = p;
  return !f;
}, cA = function(l, s, f, p) {
  p.mSet(l, s, p.m.call(p.tween, f, p.mt), p);
}, Lb = function(l) {
  for (var s = l._pt, f, p, y, h; s; ) {
    for (f = s._next, p = y; p && p.pr > s.pr; )
      p = p._next;
    (s._prev = p ? p._prev : h) ? s._prev._next = s : y = s, (s._next = p) ? p._prev = s : h = s, s = f;
  }
  l._pt = y;
}, ui = /* @__PURE__ */ function() {
  function g(s, f, p, y, h, E, x, T, R) {
    this.t = f, this.s = y, this.c = h, this.p = p, this.r = E || Db, this.d = x || this, this.set = T || cC, this.pr = R || 0, this._next = s, s && (s._prev = this);
  }
  var l = g.prototype;
  return l.modifier = function(f, p, y) {
    this.mSet = this.mSet || this.set, this.set = cA, this.m = f, this.mt = y, this.tween = p;
  }, g;
}();
oi(iC + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(g) {
  return aC[g] = 1;
});
zi.TweenMax = zi.TweenLite = dr;
zi.TimelineLite = zi.TimelineMax = Pa;
Un = new Pa({
  sortChildren: !1,
  defaults: sp,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
Ai.stringFilter = Sb;
var pf = [], Ug = {}, fA = [], xT = 0, dA = 0, xE = function(l) {
  return (Ug[l] || fA).map(function(s) {
    return s();
  });
}, YE = function() {
  var l = Date.now(), s = [];
  l - xT > 2 && (xE("matchMediaInit"), pf.forEach(function(f) {
    var p = f.queries, y = f.conditions, h, E, x, T;
    for (E in p)
      h = Lo.matchMedia(p[E]).matches, h && (x = 1), h !== y[E] && (y[E] = h, T = 1);
    T && (f.revert(), x && s.push(f));
  }), xE("matchMediaRevert"), s.forEach(function(f) {
    return f.onMatch(f, function(p) {
      return f.add(null, p);
    });
  }), xT = l, xE("matchMedia"));
}, Mb = /* @__PURE__ */ function() {
  function g(s, f) {
    this.selector = f && IE(f), this.data = [], this._r = [], this.isReverted = !1, this.id = dA++, s && this.add(s);
  }
  var l = g.prototype;
  return l.add = function(f, p, y) {
    Qn(f) && (y = p, p = f, f = Qn);
    var h = this, E = function() {
      var T = Tn, R = h.selector, O;
      return T && T !== h && T.data.push(h), y && (h.selector = IE(y)), Tn = h, O = p.apply(h, arguments), Qn(O) && h._r.push(O), Tn = T, h.selector = R, h.isReverted = !1, O;
    };
    return h.last = E, f === Qn ? E(h, function(x) {
      return h.add(null, x);
    }) : f ? h[f] = E : E;
  }, l.ignore = function(f) {
    var p = Tn;
    Tn = null, f(this), Tn = p;
  }, l.getTweens = function() {
    var f = [];
    return this.data.forEach(function(p) {
      return p instanceof g ? f.push.apply(f, p.getTweens()) : p instanceof dr && !(p.parent && p.parent.data === "nested") && f.push(p);
    }), f;
  }, l.clear = function() {
    this._r.length = this.data.length = 0;
  }, l.kill = function(f, p) {
    var y = this;
    if (f ? function() {
      for (var E = y.getTweens(), x = y.data.length, T; x--; )
        T = y.data[x], T.data === "isFlip" && (T.revert(), T.getChildren(!0, !0, !1).forEach(function(R) {
          return E.splice(E.indexOf(R), 1);
        }));
      for (E.map(function(R) {
        return {
          g: R._dur || R._delay || R._sat && !R._sat.vars.immediateRender ? R.globalTime(0) : -1 / 0,
          t: R
        };
      }).sort(function(R, O) {
        return O.g - R.g || -1 / 0;
      }).forEach(function(R) {
        return R.t.revert(f);
      }), x = y.data.length; x--; )
        T = y.data[x], T instanceof Pa ? T.data !== "nested" && (T.scrollTrigger && T.scrollTrigger.revert(), T.kill()) : !(T instanceof dr) && T.revert && T.revert(f);
      y._r.forEach(function(R) {
        return R(f, y);
      }), y.isReverted = !0;
    }() : this.data.forEach(function(E) {
      return E.kill && E.kill();
    }), this.clear(), p)
      for (var h = pf.length; h--; )
        pf[h].id === this.id && pf.splice(h, 1);
  }, l.revert = function(f) {
    this.kill(f || {});
  }, g;
}(), pA = /* @__PURE__ */ function() {
  function g(s) {
    this.contexts = [], this.scope = s, Tn && Tn.data.push(this);
  }
  var l = g.prototype;
  return l.add = function(f, p, y) {
    Ao(f) || (f = {
      matches: f
    });
    var h = new Mb(0, y || this.scope), E = h.conditions = {}, x, T, R;
    Tn && !h.selector && (h.selector = Tn.selector), this.contexts.push(h), p = h.add("onMatch", p), h.queries = f;
    for (T in f)
      T === "all" ? R = 1 : (x = Lo.matchMedia(f[T]), x && (pf.indexOf(h) < 0 && pf.push(h), (E[T] = x.matches) && (R = 1), x.addListener ? x.addListener(YE) : x.addEventListener("change", YE)));
    return R && p(h, function(O) {
      return h.add(null, O);
    }), this;
  }, l.revert = function(f) {
    this.kill(f || {});
  }, l.kill = function(f) {
    this.contexts.forEach(function(p) {
      return p.kill(f, !0);
    });
  }, g;
}(), Yg = {
  registerPlugin: function() {
    for (var l = arguments.length, s = new Array(l), f = 0; f < l; f++)
      s[f] = arguments[f];
    s.forEach(function(p) {
      return yb(p);
    });
  },
  timeline: function(l) {
    return new Pa(l);
  },
  getTweensOf: function(l, s) {
    return Un.getTweensOf(l, s);
  },
  getProperty: function(l, s, f, p) {
    Ur(l) && (l = hl(l)[0]);
    var y = cf(l || {}).get, h = f ? ab : rb;
    return f === "native" && (f = ""), l && (s ? h((Oi[s] && Oi[s].get || y)(l, s, f, p)) : function(E, x, T) {
      return h((Oi[E] && Oi[E].get || y)(l, E, x, T));
    });
  },
  quickSetter: function(l, s, f) {
    if (l = hl(l), l.length > 1) {
      var p = l.map(function(R) {
        return ci.quickSetter(R, s, f);
      }), y = p.length;
      return function(R) {
        for (var O = y; O--; )
          p[O](R);
      };
    }
    l = l[0] || {};
    var h = Oi[s], E = cf(l), x = E.harness && (E.harness.aliases || {})[s] || s, T = h ? function(R) {
      var O = new h();
      ap._pt = 0, O.init(l, f ? R + f : R, ap, 0, [l]), O.render(1, O), ap._pt && dC(1, ap);
    } : E.set(l, x);
    return h ? T : function(R) {
      return T(l, x, f ? R + f : R, E, 1);
    };
  },
  quickTo: function(l, s, f) {
    var p, y = ci.to(l, Ui((p = {}, p[s] = "+=0.1", p.paused = !0, p.stagger = 0, p), f || {})), h = function(x, T, R) {
      return y.resetTo(s, x, T, R);
    };
    return h.tween = y, h;
  },
  isTweening: function(l) {
    return Un.getTweensOf(l, !0).length > 0;
  },
  defaults: function(l) {
    return l && l.ease && (l.ease = df(l.ease, sp.ease)), _T(sp, l || {});
  },
  config: function(l) {
    return _T(Ai, l || {});
  },
  registerEffect: function(l) {
    var s = l.name, f = l.effect, p = l.plugins, y = l.defaults, h = l.extendTimeline;
    (p || "").split(",").forEach(function(E) {
      return E && !Oi[E] && !zi[E] && Ov(s + " effect requires " + E + " plugin.");
    }), SE[s] = function(E, x, T) {
      return f(hl(E), Ui(x || {}, y), T);
    }, h && (Pa.prototype[s] = function(E, x, T) {
      return this.add(SE[s](E, Ao(x) ? x : (T = x) && {}, this), T);
    });
  },
  registerEase: function(l, s) {
    Pt[l] = df(s);
  },
  parseEase: function(l, s) {
    return arguments.length ? df(l, s) : Pt;
  },
  getById: function(l) {
    return Un.getById(l);
  },
  exportRoot: function(l, s) {
    l === void 0 && (l = {});
    var f = new Pa(l), p, y;
    for (f.smoothChildTiming = li(l.smoothChildTiming), Un.remove(f), f._dp = 0, f._time = f._tTime = Un._time, p = Un._first; p; )
      y = p._next, (s || !(!p._dur && p instanceof dr && p.vars.onComplete === p._targets[0])) && Mo(f, p, p._start - p._delay), p = y;
    return Mo(Un, f, 0), f;
  },
  context: function(l, s) {
    return l ? new Mb(l, s) : Tn;
  },
  matchMedia: function(l) {
    return new pA(l);
  },
  matchMediaRefresh: function() {
    return pf.forEach(function(l) {
      var s = l.conditions, f, p;
      for (p in s)
        s[p] && (s[p] = !1, f = 1);
      f && l.revert();
    }) || YE();
  },
  addEventListener: function(l, s) {
    var f = Ug[l] || (Ug[l] = []);
    ~f.indexOf(s) || f.push(s);
  },
  removeEventListener: function(l, s) {
    var f = Ug[l], p = f && f.indexOf(s);
    p >= 0 && f.splice(p, 1);
  },
  utils: {
    wrap: $N,
    wrapYoyo: WN,
    distribute: fb,
    random: pb,
    snap: db,
    normalize: YN,
    getUnit: Ea,
    clamp: HN,
    splitColor: gb,
    toArray: hl,
    selector: IE,
    mapRange: vb,
    pipe: VN,
    unitize: BN,
    interpolate: GN,
    shuffle: cb
  },
  install: JT,
  effects: SE,
  ticker: Li,
  updateRoot: Pa.updateRoot,
  plugins: Oi,
  globalTimeline: Un,
  core: {
    PropTween: ui,
    globals: ZT,
    Tween: dr,
    Timeline: Pa,
    Animation: Av,
    getCache: cf,
    _removeLinkedListItem: Kg,
    reverting: function() {
      return na;
    },
    context: function(l) {
      return l && Tn && (Tn.data.push(l), l._ctx = Tn), Tn;
    },
    suppressOverwrites: function(l) {
      return ZE = l;
    }
  }
};
oi("to,from,fromTo,delayedCall,set,killTweensOf", function(g) {
  return Yg[g] = dr[g];
});
Li.add(Pa.updateRoot);
ap = Yg.to({}, {
  duration: 0
});
var hA = function(l, s) {
  for (var f = l._pt; f && f.p !== s && f.op !== s && f.fp !== s; )
    f = f._next;
  return f;
}, vA = function(l, s) {
  var f = l._targets, p, y, h;
  for (p in s)
    for (y = f.length; y--; )
      h = l._ptLookup[y][p], h && (h = h.d) && (h._pt && (h = hA(h, p)), h && h.modifier && h.modifier(s[p], l, f[y], p));
}, TE = function(l, s) {
  return {
    name: l,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(p, y, h) {
      h._onInit = function(E) {
        var x, T;
        if (Ur(y) && (x = {}, oi(y, function(R) {
          return x[R] = 1;
        }), y = x), s) {
          x = {};
          for (T in y)
            x[T] = s(y[T]);
          y = x;
        }
        vA(E, y);
      };
    }
  };
}, ci = Yg.registerPlugin({
  name: "attr",
  init: function(l, s, f, p, y) {
    var h, E, x;
    this.tween = f;
    for (h in s)
      x = l.getAttribute(h) || "", E = this.add(l, "setAttribute", (x || 0) + "", s[h], p, y, 0, 0, h), E.op = h, E.b = x, this._props.push(h);
  },
  render: function(l, s) {
    for (var f = s._pt; f; )
      na ? f.set(f.t, f.p, f.b, f) : f.r(l, f.d), f = f._next;
  }
}, {
  name: "endArray",
  headless: 1,
  init: function(l, s) {
    for (var f = s.length; f--; )
      this.add(l, f, l[f] || 0, s[f], 0, 0, 0, 0, 0, 1);
  }
}, TE("roundProps", VE), TE("modifiers"), TE("snap", db)) || Yg;
dr.version = Pa.version = ci.version = "3.14.2";
KT = 1;
tC() && pp();
Pt.Power0;
Pt.Power1;
Pt.Power2;
Pt.Power3;
Pt.Power4;
Pt.Linear;
Pt.Quad;
Pt.Cubic;
Pt.Quart;
Pt.Quint;
Pt.Strong;
Pt.Elastic;
Pt.Back;
Pt.SteppedEase;
Pt.Bounce;
Pt.Sine;
Pt.Expo;
Pt.Circ;
/*!
 * CSSPlugin 3.14.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var TT, Ms, lp, pC, uf, bT, hC, mA = function() {
  return typeof window < "u";
}, Mu = {}, of = 180 / Math.PI, op = Math.PI / 180, tp = Math.atan2, RT = 1e8, vC = /([A-Z])/g, yA = /(left|right|width|margin|padding|x)/i, gA = /[\s,\(]\S/, No = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, $E = function(l, s) {
  return s.set(s.t, s.p, Math.round((s.s + s.c * l) * 1e4) / 1e4 + s.u, s);
}, _A = function(l, s) {
  return s.set(s.t, s.p, l === 1 ? s.e : Math.round((s.s + s.c * l) * 1e4) / 1e4 + s.u, s);
}, SA = function(l, s) {
  return s.set(s.t, s.p, l ? Math.round((s.s + s.c * l) * 1e4) / 1e4 + s.u : s.b, s);
}, EA = function(l, s) {
  return s.set(s.t, s.p, l === 1 ? s.e : l ? Math.round((s.s + s.c * l) * 1e4) / 1e4 + s.u : s.b, s);
}, CA = function(l, s) {
  var f = s.s + s.c * l;
  s.set(s.t, s.p, ~~(f + (f < 0 ? -0.5 : 0.5)) + s.u, s);
}, Nb = function(l, s) {
  return s.set(s.t, s.p, l ? s.e : s.b, s);
}, Ab = function(l, s) {
  return s.set(s.t, s.p, l !== 1 ? s.b : s.e, s);
}, wA = function(l, s, f) {
  return l.style[s] = f;
}, xA = function(l, s, f) {
  return l.style.setProperty(s, f);
}, TA = function(l, s, f) {
  return l._gsap[s] = f;
}, bA = function(l, s, f) {
  return l._gsap.scaleX = l._gsap.scaleY = f;
}, RA = function(l, s, f, p, y) {
  var h = l._gsap;
  h.scaleX = h.scaleY = f, h.renderTransform(y, h);
}, kA = function(l, s, f, p, y) {
  var h = l._gsap;
  h[s] = f, h.renderTransform(y, h);
}, jn = "transform", si = jn + "Origin", DA = function g(l, s) {
  var f = this, p = this.target, y = p.style, h = p._gsap;
  if (l in Mu && y) {
    if (this.tfm = this.tfm || {}, l !== "transform")
      l = No[l] || l, ~l.indexOf(",") ? l.split(",").forEach(function(E) {
        return f.tfm[E] = Ou(p, E);
      }) : this.tfm[l] = h.x ? h[l] : Ou(p, l), l === si && (this.tfm.zOrigin = h.zOrigin);
    else
      return No.transform.split(",").forEach(function(E) {
        return g.call(f, E, s);
      });
    if (this.props.indexOf(jn) >= 0)
      return;
    h.svg && (this.svgo = p.getAttribute("data-svg-origin"), this.props.push(si, s, "")), l = jn;
  }
  (y || s) && this.props.push(l, s, y[l]);
}, zb = function(l) {
  l.translate && (l.removeProperty("translate"), l.removeProperty("scale"), l.removeProperty("rotate"));
}, OA = function() {
  var l = this.props, s = this.target, f = s.style, p = s._gsap, y, h;
  for (y = 0; y < l.length; y += 3)
    l[y + 1] ? l[y + 1] === 2 ? s[l[y]](l[y + 2]) : s[l[y]] = l[y + 2] : l[y + 2] ? f[l[y]] = l[y + 2] : f.removeProperty(l[y].substr(0, 2) === "--" ? l[y] : l[y].replace(vC, "-$1").toLowerCase());
  if (this.tfm) {
    for (h in this.tfm)
      p[h] = this.tfm[h];
    p.svg && (p.renderTransform(), s.setAttribute("data-svg-origin", this.svgo || "")), y = hC(), (!y || !y.isStart) && !f[jn] && (zb(f), p.zOrigin && f[si] && (f[si] += " " + p.zOrigin + "px", p.zOrigin = 0, p.renderTransform()), p.uncache = 1);
  }
}, Ub = function(l, s) {
  var f = {
    target: l,
    props: [],
    revert: OA,
    save: DA
  };
  return l._gsap || ci.core.getCache(l), s && l.style && l.nodeType && s.split(",").forEach(function(p) {
    return f.save(p);
  }), f;
}, jb, WE = function(l, s) {
  var f = Ms.createElementNS ? Ms.createElementNS((s || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), l) : Ms.createElement(l);
  return f && f.style ? f : Ms.createElement(l);
}, Ni = function g(l, s, f) {
  var p = getComputedStyle(l);
  return p[s] || p.getPropertyValue(s.replace(vC, "-$1").toLowerCase()) || p.getPropertyValue(s) || !f && g(l, hp(s) || s, 1) || "";
}, kT = "O,Moz,ms,Ms,Webkit".split(","), hp = function(l, s, f) {
  var p = s || uf, y = p.style, h = 5;
  if (l in y && !f)
    return l;
  for (l = l.charAt(0).toUpperCase() + l.substr(1); h-- && !(kT[h] + l in y); )
    ;
  return h < 0 ? null : (h === 3 ? "ms" : h >= 0 ? kT[h] : "") + l;
}, GE = function() {
  mA() && window.document && (TT = window, Ms = TT.document, lp = Ms.documentElement, uf = WE("div") || {
    style: {}
  }, WE("div"), jn = hp(jn), si = jn + "Origin", uf.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", jb = !!hp("perspective"), hC = ci.core.reverting, pC = 1);
}, DT = function(l) {
  var s = l.ownerSVGElement, f = WE("svg", s && s.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), p = l.cloneNode(!0), y;
  p.style.display = "block", f.appendChild(p), lp.appendChild(f);
  try {
    y = p.getBBox();
  } catch {
  }
  return f.removeChild(p), lp.removeChild(f), y;
}, OT = function(l, s) {
  for (var f = s.length; f--; )
    if (l.hasAttribute(s[f]))
      return l.getAttribute(s[f]);
}, Pb = function(l) {
  var s, f;
  try {
    s = l.getBBox();
  } catch {
    s = DT(l), f = 1;
  }
  return s && (s.width || s.height) || f || (s = DT(l)), s && !s.width && !s.x && !s.y ? {
    x: +OT(l, ["x", "cx", "x1"]) || 0,
    y: +OT(l, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : s;
}, Fb = function(l) {
  return !!(l.getCTM && (!l.parentNode || l.ownerSVGElement) && Pb(l));
}, Ps = function(l, s) {
  if (s) {
    var f = l.style, p;
    s in Mu && s !== si && (s = jn), f.removeProperty ? (p = s.substr(0, 2), (p === "ms" || s.substr(0, 6) === "webkit") && (s = "-" + s), f.removeProperty(p === "--" ? s : s.replace(vC, "-$1").toLowerCase())) : f.removeAttribute(s);
  }
}, Ns = function(l, s, f, p, y, h) {
  var E = new ui(l._pt, s, f, 0, 1, h ? Ab : Nb);
  return l._pt = E, E.b = p, E.e = y, l._props.push(f), E;
}, LT = {
  deg: 1,
  rad: 1,
  turn: 1
}, LA = {
  grid: 1,
  flex: 1
}, Fs = function g(l, s, f, p) {
  var y = parseFloat(f) || 0, h = (f + "").trim().substr((y + "").length) || "px", E = uf.style, x = yA.test(s), T = l.tagName.toLowerCase() === "svg", R = (T ? "client" : "offset") + (x ? "Width" : "Height"), O = 100, A = p === "px", L = p === "%", V, N, B, Q;
  if (p === h || !y || LT[p] || LT[h])
    return y;
  if (h !== "px" && !A && (y = g(l, s, f, "px")), Q = l.getCTM && Fb(l), (L || h === "%") && (Mu[s] || ~s.indexOf("adius")))
    return V = Q ? l.getBBox()[x ? "width" : "height"] : l[R], ar(L ? y / V * O : y / 100 * V);
  if (E[x ? "width" : "height"] = O + (A ? h : p), N = p !== "rem" && ~s.indexOf("adius") || p === "em" && l.appendChild && !T ? l : l.parentNode, Q && (N = (l.ownerSVGElement || {}).parentNode), (!N || N === Ms || !N.appendChild) && (N = Ms.body), B = N._gsap, B && L && B.width && x && B.time === Li.time && !B.uncache)
    return ar(y / B.width * O);
  if (L && (s === "height" || s === "width")) {
    var ee = l.style[s];
    l.style[s] = O + p, V = l[R], ee ? l.style[s] = ee : Ps(l, s);
  } else
    (L || h === "%") && !LA[Ni(N, "display")] && (E.position = Ni(l, "position")), N === l && (E.position = "static"), N.appendChild(uf), V = uf[R], N.removeChild(uf), E.position = "absolute";
  return x && L && (B = cf(N), B.time = Li.time, B.width = N[R]), ar(A ? V * y / O : V && y ? O / V * y : 0);
}, Ou = function(l, s, f, p) {
  var y;
  return pC || GE(), s in No && s !== "transform" && (s = No[s], ~s.indexOf(",") && (s = s.split(",")[0])), Mu[s] && s !== "transform" ? (y = Uv(l, p), y = s !== "transformOrigin" ? y[s] : y.svg ? y.origin : Wg(Ni(l, si)) + " " + y.zOrigin + "px") : (y = l.style[s], (!y || y === "auto" || p || ~(y + "").indexOf("calc(")) && (y = $g[s] && $g[s](l, s, f) || Ni(l, s) || tb(l, s) || (s === "opacity" ? 1 : 0))), f && !~(y + "").trim().indexOf(" ") ? Fs(l, s, y, f) + f : y;
}, MA = function(l, s, f, p) {
  if (!f || f === "none") {
    var y = hp(s, l, 1), h = y && Ni(l, y, 1);
    h && h !== f ? (s = y, f = h) : s === "borderColor" && (f = Ni(l, "borderTopColor"));
  }
  var E = new ui(this._pt, l.style, s, 0, 1, Ob), x = 0, T = 0, R, O, A, L, V, N, B, Q, ee, ne, se, W;
  if (E.b = f, E.e = p, f += "", p += "", p.substring(0, 6) === "var(--" && (p = Ni(l, p.substring(4, p.indexOf(")")))), p === "auto" && (N = l.style[s], l.style[s] = p, p = Ni(l, s) || p, N ? l.style[s] = N : Ps(l, s)), R = [f, p], Sb(R), f = R[0], p = R[1], A = f.match(rp) || [], W = p.match(rp) || [], W.length) {
    for (; O = rp.exec(p); )
      B = O[0], ee = p.substring(x, O.index), V ? V = (V + 1) % 5 : (ee.substr(-5) === "rgba(" || ee.substr(-5) === "hsla(") && (V = 1), B !== (N = A[T++] || "") && (L = parseFloat(N) || 0, se = N.substr((L + "").length), B.charAt(1) === "=" && (B = ip(L, B) + se), Q = parseFloat(B), ne = B.substr((Q + "").length), x = rp.lastIndex - ne.length, ne || (ne = ne || Ai.units[s] || se, x === p.length && (p += ne, E.e += ne)), se !== ne && (L = Fs(l, s, N, ne) || 0), E._pt = {
        _next: E._pt,
        p: ee || T === 1 ? ee : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: L,
        c: Q - L,
        m: V && V < 4 || s === "zIndex" ? Math.round : 0
      });
    E.c = x < p.length ? p.substring(x, p.length) : "";
  } else
    E.r = s === "display" && p === "none" ? Ab : Nb;
  return XT.test(p) && (E.e = 0), this._pt = E, E;
}, MT = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, NA = function(l) {
  var s = l.split(" "), f = s[0], p = s[1] || "50%";
  return (f === "top" || f === "bottom" || p === "left" || p === "right") && (l = f, f = p, p = l), s[0] = MT[f] || f, s[1] = MT[p] || p, s.join(" ");
}, AA = function(l, s) {
  if (s.tween && s.tween._time === s.tween._dur) {
    var f = s.t, p = f.style, y = s.u, h = f._gsap, E, x, T;
    if (y === "all" || y === !0)
      p.cssText = "", x = 1;
    else
      for (y = y.split(","), T = y.length; --T > -1; )
        E = y[T], Mu[E] && (x = 1, E = E === "transformOrigin" ? si : jn), Ps(f, E);
    x && (Ps(f, jn), h && (h.svg && f.removeAttribute("transform"), p.scale = p.rotate = p.translate = "none", Uv(f, 1), h.uncache = 1, zb(p)));
  }
}, $g = {
  clearProps: function(l, s, f, p, y) {
    if (y.data !== "isFromStart") {
      var h = l._pt = new ui(l._pt, s, f, 0, 0, AA);
      return h.u = p, h.pr = -10, h.tween = y, l._props.push(f), 1;
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
}, zv = [1, 0, 0, 1, 0, 0], Hb = {}, Ib = function(l) {
  return l === "matrix(1, 0, 0, 1, 0, 0)" || l === "none" || !l;
}, NT = function(l) {
  var s = Ni(l, jn);
  return Ib(s) ? zv : s.substr(7).match(QT).map(ar);
}, mC = function(l, s) {
  var f = l._gsap || cf(l), p = l.style, y = NT(l), h, E, x, T;
  return f.svg && l.getAttribute("transform") ? (x = l.transform.baseVal.consolidate().matrix, y = [x.a, x.b, x.c, x.d, x.e, x.f], y.join(",") === "1,0,0,1,0,0" ? zv : y) : (y === zv && !l.offsetParent && l !== lp && !f.svg && (x = p.display, p.display = "block", h = l.parentNode, (!h || !l.offsetParent && !l.getBoundingClientRect().width) && (T = 1, E = l.nextElementSibling, lp.appendChild(l)), y = NT(l), x ? p.display = x : Ps(l, "display"), T && (E ? h.insertBefore(l, E) : h ? h.appendChild(l) : lp.removeChild(l))), s && y.length > 6 ? [y[0], y[1], y[4], y[5], y[12], y[13]] : y);
}, qE = function(l, s, f, p, y, h) {
  var E = l._gsap, x = y || mC(l, !0), T = E.xOrigin || 0, R = E.yOrigin || 0, O = E.xOffset || 0, A = E.yOffset || 0, L = x[0], V = x[1], N = x[2], B = x[3], Q = x[4], ee = x[5], ne = s.split(" "), se = parseFloat(ne[0]) || 0, W = parseFloat(ne[1]) || 0, de, ue, Ee, fe;
  f ? x !== zv && (ue = L * B - V * N) && (Ee = se * (B / ue) + W * (-N / ue) + (N * ee - B * Q) / ue, fe = se * (-V / ue) + W * (L / ue) - (L * ee - V * Q) / ue, se = Ee, W = fe) : (de = Pb(l), se = de.x + (~ne[0].indexOf("%") ? se / 100 * de.width : se), W = de.y + (~(ne[1] || ne[0]).indexOf("%") ? W / 100 * de.height : W)), p || p !== !1 && E.smooth ? (Q = se - T, ee = W - R, E.xOffset = O + (Q * L + ee * N) - Q, E.yOffset = A + (Q * V + ee * B) - ee) : E.xOffset = E.yOffset = 0, E.xOrigin = se, E.yOrigin = W, E.smooth = !!p, E.origin = s, E.originIsAbsolute = !!f, l.style[si] = "0px 0px", h && (Ns(h, E, "xOrigin", T, se), Ns(h, E, "yOrigin", R, W), Ns(h, E, "xOffset", O, E.xOffset), Ns(h, E, "yOffset", A, E.yOffset)), l.setAttribute("data-svg-origin", se + " " + W);
}, Uv = function(l, s) {
  var f = l._gsap || new xb(l);
  if ("x" in f && !s && !f.uncache)
    return f;
  var p = l.style, y = f.scaleX < 0, h = "px", E = "deg", x = getComputedStyle(l), T = Ni(l, si) || "0", R, O, A, L, V, N, B, Q, ee, ne, se, W, de, ue, Ee, fe, Ye, Ke, We, Re, ut, Ge, he, ce, ie, Te, ye, P, re, Pe, be, qe;
  return R = O = A = N = B = Q = ee = ne = se = 0, L = V = 1, f.svg = !!(l.getCTM && Fb(l)), x.translate && ((x.translate !== "none" || x.scale !== "none" || x.rotate !== "none") && (p[jn] = (x.translate !== "none" ? "translate3d(" + (x.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (x.rotate !== "none" ? "rotate(" + x.rotate + ") " : "") + (x.scale !== "none" ? "scale(" + x.scale.split(" ").join(",") + ") " : "") + (x[jn] !== "none" ? x[jn] : "")), p.scale = p.rotate = p.translate = "none"), ue = mC(l, f.svg), f.svg && (f.uncache ? (ie = l.getBBox(), T = f.xOrigin - ie.x + "px " + (f.yOrigin - ie.y) + "px", ce = "") : ce = !s && l.getAttribute("data-svg-origin"), qE(l, ce || T, !!ce || f.originIsAbsolute, f.smooth !== !1, ue)), W = f.xOrigin || 0, de = f.yOrigin || 0, ue !== zv && (Ke = ue[0], We = ue[1], Re = ue[2], ut = ue[3], R = Ge = ue[4], O = he = ue[5], ue.length === 6 ? (L = Math.sqrt(Ke * Ke + We * We), V = Math.sqrt(ut * ut + Re * Re), N = Ke || We ? tp(We, Ke) * of : 0, ee = Re || ut ? tp(Re, ut) * of + N : 0, ee && (V *= Math.abs(Math.cos(ee * op))), f.svg && (R -= W - (W * Ke + de * Re), O -= de - (W * We + de * ut))) : (qe = ue[6], Pe = ue[7], ye = ue[8], P = ue[9], re = ue[10], be = ue[11], R = ue[12], O = ue[13], A = ue[14], Ee = tp(qe, re), B = Ee * of, Ee && (fe = Math.cos(-Ee), Ye = Math.sin(-Ee), ce = Ge * fe + ye * Ye, ie = he * fe + P * Ye, Te = qe * fe + re * Ye, ye = Ge * -Ye + ye * fe, P = he * -Ye + P * fe, re = qe * -Ye + re * fe, be = Pe * -Ye + be * fe, Ge = ce, he = ie, qe = Te), Ee = tp(-Re, re), Q = Ee * of, Ee && (fe = Math.cos(-Ee), Ye = Math.sin(-Ee), ce = Ke * fe - ye * Ye, ie = We * fe - P * Ye, Te = Re * fe - re * Ye, be = ut * Ye + be * fe, Ke = ce, We = ie, Re = Te), Ee = tp(We, Ke), N = Ee * of, Ee && (fe = Math.cos(Ee), Ye = Math.sin(Ee), ce = Ke * fe + We * Ye, ie = Ge * fe + he * Ye, We = We * fe - Ke * Ye, he = he * fe - Ge * Ye, Ke = ce, Ge = ie), B && Math.abs(B) + Math.abs(N) > 359.9 && (B = N = 0, Q = 180 - Q), L = ar(Math.sqrt(Ke * Ke + We * We + Re * Re)), V = ar(Math.sqrt(he * he + qe * qe)), Ee = tp(Ge, he), ee = Math.abs(Ee) > 2e-4 ? Ee * of : 0, se = be ? 1 / (be < 0 ? -be : be) : 0), f.svg && (ce = l.getAttribute("transform"), f.forceCSS = l.setAttribute("transform", "") || !Ib(Ni(l, jn)), ce && l.setAttribute("transform", ce))), Math.abs(ee) > 90 && Math.abs(ee) < 270 && (y ? (L *= -1, ee += N <= 0 ? 180 : -180, N += N <= 0 ? 180 : -180) : (V *= -1, ee += ee <= 0 ? 180 : -180)), s = s || f.uncache, f.x = R - ((f.xPercent = R && (!s && f.xPercent || (Math.round(l.offsetWidth / 2) === Math.round(-R) ? -50 : 0))) ? l.offsetWidth * f.xPercent / 100 : 0) + h, f.y = O - ((f.yPercent = O && (!s && f.yPercent || (Math.round(l.offsetHeight / 2) === Math.round(-O) ? -50 : 0))) ? l.offsetHeight * f.yPercent / 100 : 0) + h, f.z = A + h, f.scaleX = ar(L), f.scaleY = ar(V), f.rotation = ar(N) + E, f.rotationX = ar(B) + E, f.rotationY = ar(Q) + E, f.skewX = ee + E, f.skewY = ne + E, f.transformPerspective = se + h, (f.zOrigin = parseFloat(T.split(" ")[2]) || !s && f.zOrigin || 0) && (p[si] = Wg(T)), f.xOffset = f.yOffset = 0, f.force3D = Ai.force3D, f.renderTransform = f.svg ? UA : jb ? Vb : zA, f.uncache = 0, f;
}, Wg = function(l) {
  return (l = l.split(" "))[0] + " " + l[1];
}, bE = function(l, s, f) {
  var p = Ea(s);
  return ar(parseFloat(s) + parseFloat(Fs(l, "x", f + "px", p))) + p;
}, zA = function(l, s) {
  s.z = "0px", s.rotationY = s.rotationX = "0deg", s.force3D = 0, Vb(l, s);
}, rf = "0deg", wv = "0px", af = ") ", Vb = function(l, s) {
  var f = s || this, p = f.xPercent, y = f.yPercent, h = f.x, E = f.y, x = f.z, T = f.rotation, R = f.rotationY, O = f.rotationX, A = f.skewX, L = f.skewY, V = f.scaleX, N = f.scaleY, B = f.transformPerspective, Q = f.force3D, ee = f.target, ne = f.zOrigin, se = "", W = Q === "auto" && l && l !== 1 || Q === !0;
  if (ne && (O !== rf || R !== rf)) {
    var de = parseFloat(R) * op, ue = Math.sin(de), Ee = Math.cos(de), fe;
    de = parseFloat(O) * op, fe = Math.cos(de), h = bE(ee, h, ue * fe * -ne), E = bE(ee, E, -Math.sin(de) * -ne), x = bE(ee, x, Ee * fe * -ne + ne);
  }
  B !== wv && (se += "perspective(" + B + af), (p || y) && (se += "translate(" + p + "%, " + y + "%) "), (W || h !== wv || E !== wv || x !== wv) && (se += x !== wv || W ? "translate3d(" + h + ", " + E + ", " + x + ") " : "translate(" + h + ", " + E + af), T !== rf && (se += "rotate(" + T + af), R !== rf && (se += "rotateY(" + R + af), O !== rf && (se += "rotateX(" + O + af), (A !== rf || L !== rf) && (se += "skew(" + A + ", " + L + af), (V !== 1 || N !== 1) && (se += "scale(" + V + ", " + N + af), ee.style[jn] = se || "translate(0, 0)";
}, UA = function(l, s) {
  var f = s || this, p = f.xPercent, y = f.yPercent, h = f.x, E = f.y, x = f.rotation, T = f.skewX, R = f.skewY, O = f.scaleX, A = f.scaleY, L = f.target, V = f.xOrigin, N = f.yOrigin, B = f.xOffset, Q = f.yOffset, ee = f.forceCSS, ne = parseFloat(h), se = parseFloat(E), W, de, ue, Ee, fe;
  x = parseFloat(x), T = parseFloat(T), R = parseFloat(R), R && (R = parseFloat(R), T += R, x += R), x || T ? (x *= op, T *= op, W = Math.cos(x) * O, de = Math.sin(x) * O, ue = Math.sin(x - T) * -A, Ee = Math.cos(x - T) * A, T && (R *= op, fe = Math.tan(T - R), fe = Math.sqrt(1 + fe * fe), ue *= fe, Ee *= fe, R && (fe = Math.tan(R), fe = Math.sqrt(1 + fe * fe), W *= fe, de *= fe)), W = ar(W), de = ar(de), ue = ar(ue), Ee = ar(Ee)) : (W = O, Ee = A, de = ue = 0), (ne && !~(h + "").indexOf("px") || se && !~(E + "").indexOf("px")) && (ne = Fs(L, "x", h, "px"), se = Fs(L, "y", E, "px")), (V || N || B || Q) && (ne = ar(ne + V - (V * W + N * ue) + B), se = ar(se + N - (V * de + N * Ee) + Q)), (p || y) && (fe = L.getBBox(), ne = ar(ne + p / 100 * fe.width), se = ar(se + y / 100 * fe.height)), fe = "matrix(" + W + "," + de + "," + ue + "," + Ee + "," + ne + "," + se + ")", L.setAttribute("transform", fe), ee && (L.style[jn] = fe);
}, jA = function(l, s, f, p, y) {
  var h = 360, E = Ur(y), x = parseFloat(y) * (E && ~y.indexOf("rad") ? of : 1), T = x - p, R = p + T + "deg", O, A;
  return E && (O = y.split("_")[1], O === "short" && (T %= h, T !== T % (h / 2) && (T += T < 0 ? h : -h)), O === "cw" && T < 0 ? T = (T + h * RT) % h - ~~(T / h) * h : O === "ccw" && T > 0 && (T = (T - h * RT) % h - ~~(T / h) * h)), l._pt = A = new ui(l._pt, s, f, p, T, _A), A.e = R, A.u = "deg", l._props.push(f), A;
}, AT = function(l, s) {
  for (var f in s)
    l[f] = s[f];
  return l;
}, PA = function(l, s, f) {
  var p = AT({}, f._gsap), y = "perspective,force3D,transformOrigin,svgOrigin", h = f.style, E, x, T, R, O, A, L, V;
  p.svg ? (T = f.getAttribute("transform"), f.setAttribute("transform", ""), h[jn] = s, E = Uv(f, 1), Ps(f, jn), f.setAttribute("transform", T)) : (T = getComputedStyle(f)[jn], h[jn] = s, E = Uv(f, 1), h[jn] = T);
  for (x in Mu)
    T = p[x], R = E[x], T !== R && y.indexOf(x) < 0 && (L = Ea(T), V = Ea(R), O = L !== V ? Fs(f, x, T, V) : parseFloat(T), A = parseFloat(R), l._pt = new ui(l._pt, E, x, O, A - O, $E), l._pt.u = V || 0, l._props.push(x));
  AT(E, p);
};
oi("padding,margin,Width,Radius", function(g, l) {
  var s = "Top", f = "Right", p = "Bottom", y = "Left", h = (l < 3 ? [s, f, p, y] : [s + y, s + f, p + f, p + y]).map(function(E) {
    return l < 2 ? g + E : "border" + E + g;
  });
  $g[l > 1 ? "border" + g : g] = function(E, x, T, R, O) {
    var A, L;
    if (arguments.length < 4)
      return A = h.map(function(V) {
        return Ou(E, V, T);
      }), L = A.join(" "), L.split(A[0]).length === 5 ? A[0] : L;
    A = (R + "").split(" "), L = {}, h.forEach(function(V, N) {
      return L[V] = A[N] = A[N] || A[(N - 1) / 2 | 0];
    }), E.init(x, L, O);
  };
});
var Bb = {
  name: "css",
  register: GE,
  targetTest: function(l) {
    return l.style && l.nodeType;
  },
  init: function(l, s, f, p, y) {
    var h = this._props, E = l.style, x = f.vars.startAt, T, R, O, A, L, V, N, B, Q, ee, ne, se, W, de, ue, Ee, fe;
    pC || GE(), this.styles = this.styles || Ub(l), Ee = this.styles.props, this.tween = f;
    for (N in s)
      if (N !== "autoRound" && (R = s[N], !(Oi[N] && Tb(N, s, f, p, l, y)))) {
        if (L = typeof R, V = $g[N], L === "function" && (R = R.call(f, p, l, y), L = typeof R), L === "string" && ~R.indexOf("random(") && (R = Mv(R)), V)
          V(this, l, N, R, f) && (ue = 1);
        else if (N.substr(0, 2) === "--")
          T = (getComputedStyle(l).getPropertyValue(N) + "").trim(), R += "", Us.lastIndex = 0, Us.test(T) || (B = Ea(T), Q = Ea(R), Q ? B !== Q && (T = Fs(l, N, T, Q) + Q) : B && (R += B)), this.add(E, "setProperty", T, R, p, y, 0, 0, N), h.push(N), Ee.push(N, 0, E[N]);
        else if (L !== "undefined") {
          if (x && N in x ? (T = typeof x[N] == "function" ? x[N].call(f, p, l, y) : x[N], Ur(T) && ~T.indexOf("random(") && (T = Mv(T)), Ea(T + "") || T === "auto" || (T += Ai.units[N] || Ea(Ou(l, N)) || ""), (T + "").charAt(1) === "=" && (T = Ou(l, N))) : T = Ou(l, N), A = parseFloat(T), ee = L === "string" && R.charAt(1) === "=" && R.substr(0, 2), ee && (R = R.substr(2)), O = parseFloat(R), N in No && (N === "autoAlpha" && (A === 1 && Ou(l, "visibility") === "hidden" && O && (A = 0), Ee.push("visibility", 0, E.visibility), Ns(this, E, "visibility", A ? "inherit" : "hidden", O ? "inherit" : "hidden", !O)), N !== "scale" && N !== "transform" && (N = No[N], ~N.indexOf(",") && (N = N.split(",")[0]))), ne = N in Mu, ne) {
            if (this.styles.save(N), fe = R, L === "string" && R.substring(0, 6) === "var(--") {
              if (R = Ni(l, R.substring(4, R.indexOf(")"))), R.substring(0, 5) === "calc(") {
                var Ye = l.style.perspective;
                l.style.perspective = R, R = Ni(l, "perspective"), Ye ? l.style.perspective = Ye : Ps(l, "perspective");
              }
              O = parseFloat(R);
            }
            if (se || (W = l._gsap, W.renderTransform && !s.parseTransform || Uv(l, s.parseTransform), de = s.smoothOrigin !== !1 && W.smooth, se = this._pt = new ui(this._pt, E, jn, 0, 1, W.renderTransform, W, 0, -1), se.dep = 1), N === "scale")
              this._pt = new ui(this._pt, W, "scaleY", W.scaleY, (ee ? ip(W.scaleY, ee + O) : O) - W.scaleY || 0, $E), this._pt.u = 0, h.push("scaleY", N), N += "X";
            else if (N === "transformOrigin") {
              Ee.push(si, 0, E[si]), R = NA(R), W.svg ? qE(l, R, 0, de, 0, this) : (Q = parseFloat(R.split(" ")[2]) || 0, Q !== W.zOrigin && Ns(this, W, "zOrigin", W.zOrigin, Q), Ns(this, E, N, Wg(T), Wg(R)));
              continue;
            } else if (N === "svgOrigin") {
              qE(l, R, 1, de, 0, this);
              continue;
            } else if (N in Hb) {
              jA(this, W, N, A, ee ? ip(A, ee + R) : R);
              continue;
            } else if (N === "smoothOrigin") {
              Ns(this, W, "smooth", W.smooth, R);
              continue;
            } else if (N === "force3D") {
              W[N] = R;
              continue;
            } else if (N === "transform") {
              PA(this, R, l);
              continue;
            }
          } else N in E || (N = hp(N) || N);
          if (ne || (O || O === 0) && (A || A === 0) && !gA.test(R) && N in E)
            B = (T + "").substr((A + "").length), O || (O = 0), Q = Ea(R) || (N in Ai.units ? Ai.units[N] : B), B !== Q && (A = Fs(l, N, T, Q)), this._pt = new ui(this._pt, ne ? W : E, N, A, (ee ? ip(A, ee + O) : O) - A, !ne && (Q === "px" || N === "zIndex") && s.autoRound !== !1 ? CA : $E), this._pt.u = Q || 0, ne && fe !== R ? (this._pt.b = T, this._pt.e = fe, this._pt.r = EA) : B !== Q && Q !== "%" && (this._pt.b = T, this._pt.r = SA);
          else if (N in E)
            MA.call(this, l, N, T, ee ? ee + R : R);
          else if (N in l)
            this.add(l, N, T || l[N], ee ? ee + R : R, p, y);
          else if (N !== "parseTransform") {
            rC(N, R);
            continue;
          }
          ne || (N in E ? Ee.push(N, 0, E[N]) : typeof l[N] == "function" ? Ee.push(N, 2, l[N]()) : Ee.push(N, 1, T || l[N])), h.push(N);
        }
      }
    ue && Lb(this);
  },
  render: function(l, s) {
    if (s.tween._time || !hC())
      for (var f = s._pt; f; )
        f.r(l, f.d), f = f._next;
    else
      s.styles.revert();
  },
  get: Ou,
  aliases: No,
  getSetter: function(l, s, f) {
    var p = No[s];
    return p && p.indexOf(",") < 0 && (s = p), s in Mu && s !== si && (l._gsap.x || Ou(l, "x")) ? f && bT === f ? s === "scale" ? bA : TA : (bT = f || {}) && (s === "scale" ? RA : kA) : l.style && !eC(l.style[s]) ? wA : ~s.indexOf("-") ? xA : fC(l, s);
  },
  core: {
    _removeProperty: Ps,
    _getMatrix: mC
  }
};
ci.utils.checkPrefix = hp;
ci.core.getStyleSaver = Ub;
(function(g, l, s, f) {
  var p = oi(g + "," + l + "," + s, function(y) {
    Mu[y] = 1;
  });
  oi(l, function(y) {
    Ai.units[y] = "deg", Hb[y] = 1;
  }), No[p[13]] = g + "," + l, oi(f, function(y) {
    var h = y.split(":");
    No[h[1]] = p[h[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
oi("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(g) {
  Ai.units[g] = "px";
});
ci.registerPlugin(Bb);
var Os = ci.registerPlugin(Bb) || ci;
Os.core.Tween;
/*!
 * @gsap/react 2.1.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
let zT = typeof document < "u" ? Ut.useLayoutEffect : Ut.useEffect, UT = (g) => g && !Array.isArray(g) && typeof g == "object", Ng = [], FA = {}, Yb = Os;
const yC = (g, l = Ng) => {
  let s = FA;
  UT(g) ? (s = g, g = null, l = "dependencies" in s ? s.dependencies : Ng) : UT(l) && (s = l, l = "dependencies" in s ? s.dependencies : Ng), g && typeof g != "function" && console.warn("First parameter must be a function or config object");
  const { scope: f, revertOnUpdate: p } = s, y = Ut.useRef(!1), h = Ut.useRef(Yb.context(() => {
  }, f)), E = Ut.useRef((T) => h.current.add(null, T)), x = l && l.length && !p;
  return x && zT(() => (y.current = !0, () => h.current.revert()), Ng), zT(() => {
    if (g && h.current.add(g, f), !x || !y.current)
      return () => h.current.revert();
  }, l), { context: h.current, contextSafe: E.current };
};
yC.register = (g) => {
  Yb = g;
};
yC.headless = !0;
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HA = (g) => g.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), $b = (...g) => g.filter((l, s, f) => !!l && l.trim() !== "" && f.indexOf(l) === s).join(" ").trim();
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var IA = {
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
const VA = Ut.forwardRef(
  ({
    color: g = "currentColor",
    size: l = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: f,
    className: p = "",
    children: y,
    iconNode: h,
    ...E
  }, x) => Ut.createElement(
    "svg",
    {
      ref: x,
      ...IA,
      width: l,
      height: l,
      stroke: g,
      strokeWidth: f ? Number(s) * 24 / Number(l) : s,
      className: $b("lucide", p),
      ...E
    },
    [
      ...h.map(([T, R]) => Ut.createElement(T, R)),
      ...Array.isArray(y) ? y : [y]
    ]
  )
);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vf = (g, l) => {
  const s = Ut.forwardRef(
    ({ className: f, ...p }, y) => Ut.createElement(VA, {
      ref: y,
      iconNode: l,
      className: $b(`lucide-${HA(g)}`, f),
      ...p
    })
  );
  return s.displayName = `${g}`, s;
};
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BA = vf("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const YA = vf("Globe", [
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
const $A = vf("HeartOff", [
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
const WA = vf("Heart", [
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
const GA = vf("House", [
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
const qA = vf("MessageCircle", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const QA = vf("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]), np = Ut.forwardRef(
  ({ id: g, className: l, label: s, icon: f, badgeCount: p, onClick: y, onMouseEnter: h, onMouseLeave: E }, x) => /* @__PURE__ */ Y.jsxs(
    "div",
    {
      id: g,
      ref: x,
      className: `fab-card ${l}`,
      onClick: y,
      onMouseEnter: h,
      onMouseLeave: E,
      children: [
        /* @__PURE__ */ Y.jsx(f, { className: "card-icon" }),
        /* @__PURE__ */ Y.jsx("span", { className: "card-label", children: s }),
        p !== void 0 && p > 0 && /* @__PURE__ */ Y.jsx("span", { className: "fab-badge", children: p })
      ]
    }
  )
);
np.displayName = "ActionCard";
function XA({ isOpen: g, wishlist: l, onClose: s, onRemove: f }) {
  return /* @__PURE__ */ Y.jsxs(Y.Fragment, { children: [
    /* @__PURE__ */ Y.jsx(
      "div",
      {
        className: `modal-overlay ${g ? "active" : ""}`,
        onClick: s
      }
    ),
    /* @__PURE__ */ Y.jsxs("div", { className: `wishlist-window ${g ? "is-active" : ""}`, children: [
      /* @__PURE__ */ Y.jsxs("div", { className: "wishlist-header", children: [
        /* @__PURE__ */ Y.jsx("h3", { children: "MY STAY PICK" }),
        /* @__PURE__ */ Y.jsx("button", { className: "close-wishlist", onClick: s, children: "×" })
      ] }),
      /* @__PURE__ */ Y.jsx("div", { className: "wishlist-content", children: l.length === 0 ? /* @__PURE__ */ Y.jsxs("div", { className: "wishlist-empty", children: [
        /* @__PURE__ */ Y.jsx($A, { size: 48, className: "text-slate-300 mb-4" }),
        /* @__PURE__ */ Y.jsx("p", { children: "저장된 숙소가 없습니다." }),
        /* @__PURE__ */ Y.jsx(
          "button",
          {
            className: "btn-explore",
            onClick: s,
            children: "숙소 둘러보기"
          }
        )
      ] }) : l.map((p) => /* @__PURE__ */ Y.jsxs("div", { className: "wishlist-item-card", children: [
        /* @__PURE__ */ Y.jsx("img", { src: p.image, alt: p.name, className: "wishlist-thumb" }),
        /* @__PURE__ */ Y.jsxs("div", { className: "wishlist-info", children: [
          /* @__PURE__ */ Y.jsxs("div", { className: "wishlist-top", children: [
            /* @__PURE__ */ Y.jsx("span", { className: "wishlist-location", children: p.location }),
            /* @__PURE__ */ Y.jsx(
              "button",
              {
                className: "wishlist-remove",
                onClick: () => f(p.id),
                children: /* @__PURE__ */ Y.jsx(QA, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ Y.jsx("h4", { className: "wishlist-title", children: p.name }),
          /* @__PURE__ */ Y.jsx("div", { className: "wishlist-price", children: p.price })
        ] })
      ] }, p.id)) })
    ] })
  ] });
}
function KA({ onClick: g, isOpen: l }) {
  return /* @__PURE__ */ Y.jsxs("div", { className: "card-holder", onClick: g, children: [
    /* @__PURE__ */ Y.jsx("div", { className: "fab-peek" }),
    /* @__PURE__ */ Y.jsx("div", { className: "fab-body" })
  ] });
}
function JA() {
  const g = Ut.useRef(null), [l, s] = Ut.useState(!1), [f, p] = Ut.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jeju_wishlist") || "[]");
    } catch {
      return [];
    }
  }), [y, h] = Ut.useState(() => localStorage.getItem("jeju_fab_currency") || "KRW"), [E, x] = Ut.useState(!1), [T, R] = Ut.useState(!1);
  Ut.useEffect(() => {
    const B = (Q) => p(Q.detail);
    return document.addEventListener("fabWishlistUpdated", B), () => document.removeEventListener("fabWishlistUpdated", B);
  }, []);
  const { contextSafe: O } = yC({ scope: g }), A = O(() => {
    if (T) return;
    R(!0), setTimeout(() => R(!1), 1600);
    const B = Os.timeline(), Q = ".fab-card", ee = ".card-holder";
    l ? (Os.set(Q, { pointerEvents: "none" }), B.to(".card-0", { x: -225, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1"], { x: -150, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2"], { x: -75, duration: 0.15, ease: "power2.in" }).to([".card-0", ".card-1", ".card-2", ".card-3"], { x: 0, duration: 0.15, ease: "power2.in" }).to(Q, { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" }), Os.to(ee, { y: 0, opacity: 1, duration: 0.3 })) : (Os.set(Q, { opacity: 1, pointerEvents: "auto", display: "flex" }), B.fromTo(
      Q,
      { y: 20, opacity: 0 },
      { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).to(".card-0", { x: -300, duration: 1, ease: "elastic.out(1.2, 0.5)" }).to(".card-1", { x: -225, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.85").to(".card-2", { x: -150, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-3", { x: -75, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9").to(".card-4", { x: 0, duration: 1, ease: "elastic.out(1.2, 0.5)" }, "-=0.9"), Os.to(ee, { y: 5, opacity: 0.9, duration: 0.3 })), s(!l);
  }), L = O((B, Q) => {
    l && Os.to(B, {
      y: Q ? -110 : -100,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }), V = () => {
    const B = y === "KRW" ? "USD" : "KRW";
    h(B), localStorage.setItem("jeju_fab_currency", B), document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: B }));
  }, N = (B) => {
    const Q = f.filter((ee) => ee.id !== B);
    p(Q), localStorage.setItem("jeju_wishlist", JSON.stringify(Q)), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: Q }));
  };
  return /* @__PURE__ */ Y.jsxs("div", { ref: g, className: "original-fab-system", children: [
    /* @__PURE__ */ Y.jsx(
      XA,
      {
        isOpen: E,
        wishlist: f,
        onClose: () => x(!1),
        onRemove: N
      }
    ),
    /* @__PURE__ */ Y.jsxs("div", { className: "fab-wrapper", children: [
      /* @__PURE__ */ Y.jsx(KA, { onClick: A, isOpen: l }),
      /* @__PURE__ */ Y.jsxs("div", { className: "fab-cards-container", children: [
        /* @__PURE__ */ Y.jsx(
          np,
          {
            id: "fabHome",
            className: "card-0",
            label: "HOME",
            icon: GA,
            onClick: () => window.location.href = "/",
            onMouseEnter: () => L(".card-0", !0),
            onMouseLeave: () => L(".card-0", !1)
          }
        ),
        /* @__PURE__ */ Y.jsx(
          np,
          {
            id: "fabTop",
            className: "card-1",
            label: "TOP",
            icon: BA,
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            onMouseEnter: () => L(".card-1", !0),
            onMouseLeave: () => L(".card-1", !1)
          }
        ),
        /* @__PURE__ */ Y.jsx(
          np,
          {
            id: "fabCurrency",
            className: "card-2",
            label: y === "KRW" ? "KOR" : "ENG",
            icon: YA,
            onClick: V,
            onMouseEnter: () => L(".card-2", !0),
            onMouseLeave: () => L(".card-2", !1)
          }
        ),
        /* @__PURE__ */ Y.jsx(
          np,
          {
            id: "fabWishlist",
            className: "card-3",
            label: "PICK",
            icon: WA,
            badgeCount: f.length,
            onClick: () => x(!0),
            onMouseEnter: () => L(".card-3", !0),
            onMouseLeave: () => L(".card-3", !1)
          }
        ),
        /* @__PURE__ */ Y.jsx(
          np,
          {
            id: "fabChatbot",
            className: "card-4",
            label: "CHAT",
            icon: qA,
            onMouseEnter: () => L(".card-4", !0),
            onMouseLeave: () => L(".card-4", !1)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ Y.jsx("style", { children: `
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
const ZA = () => {
  try {
    const g = localStorage.getItem("jeju_wishlist") ?? "[]", l = JSON.parse(g);
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}, e2 = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", t2 = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", n2 = () => ({
  currency: e2(),
  language: t2(),
  wishlist: ZA(),
  drawerOpen: !1,
  chatbotOpen: !1,
  weatherOpen: !1
}), RE = (g, l) => typeof l == "boolean" ? l : !g, r2 = (g, l) => {
  switch (l.type) {
    case "SET_CURRENCY":
      return { ...g, currency: l.payload };
    case "SET_LANGUAGE":
      return { ...g, language: l.payload };
    case "SET_WISHLIST":
      return { ...g, wishlist: [...l.payload] };
    case "TOGGLE_DRAWER":
      return { ...g, drawerOpen: RE(g.drawerOpen, l.payload) };
    case "TOGGLE_CHATBOT":
      return { ...g, chatbotOpen: RE(g.chatbotOpen, l.payload) };
    case "TOGGLE_WEATHER":
      return { ...g, weatherOpen: RE(g.weatherOpen, l.payload) };
    default:
      return g;
  }
}, a2 = Ut.createContext(null), i2 = ({ children: g }) => {
  const [l, s] = Ut.useReducer(r2, void 0, n2), f = Ut.useMemo(
    () => ({
      state: l,
      dispatch: s
    }),
    [l]
  );
  return /* @__PURE__ */ Y.jsx(a2.Provider, { value: f, children: g });
};
let kE = null;
const l2 = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", o2 = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", u2 = () => {
  try {
    const g = localStorage.getItem("jeju_wishlist") ?? "[]", l = JSON.parse(g);
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}, DE = (g, l, s) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: g })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: l })), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: s }));
}, s2 = () => {
  if (window.FABState)
    return;
  const g = {
    currency: l2(),
    language: o2(),
    wishlist: u2(),
    setCurrencyAndLang: (l, s) => {
      g.currency = l, g.language = s, localStorage.setItem("jeju_fab_currency", l), localStorage.setItem("jeju_fab_lang", s), DE(l, s, g.wishlist);
    },
    addToWishlist: (l) => {
      const s = [...g.wishlist], f = Number(l.id), p = s.findIndex((y) => Number(y.id) === f);
      p === -1 ? s.push(l) : s.splice(p, 1), g.wishlist = s, localStorage.setItem("jeju_wishlist", JSON.stringify(s)), DE(g.currency, g.language, s);
    },
    removeFromWishlist: (l) => {
      const s = g.wishlist.filter((f) => Number(f.id) !== l);
      g.wishlist = s, localStorage.setItem("jeju_wishlist", JSON.stringify(s)), DE(g.currency, g.language, s);
    },
    isInWishlist: (l) => g.wishlist.some((s) => Number(s.id) === l)
  };
  window.FABState = g, document.addEventListener("fabCurrencyChanged", (l) => {
    const s = l;
    g.currency = s.detail === "USD" ? "USD" : "KRW";
  }), document.addEventListener("fabLanguageChanged", (l) => {
    const s = l;
    g.language = s.detail === "en" ? "en" : "ko";
  }), document.addEventListener("fabWishlistUpdated", (l) => {
    const s = l;
    g.wishlist = Array.isArray(s.detail) ? [...s.detail] : [];
  });
}, c2 = () => {
  const g = "jeju-fab-root";
  let l = document.getElementById(g);
  l || (l = document.createElement("div"), l.id = g, document.body.appendChild(l)), kE || (kE = up(l)), kE.render(
    /* @__PURE__ */ Y.jsx(i2, { children: /* @__PURE__ */ Y.jsx(JA, {}) })
  ), s2();
}, f2 = (g) => {
  const l = g ?? {};
  return {
    checkIn: l.checkIn ?? null,
    checkOut: l.checkOut ?? null,
    tempCheckIn: l.tempCheckIn ?? null,
    tempCheckOut: l.tempCheckOut ?? null
  };
}, Wb = (g) => {
  const l = {
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
    ...g ?? {}
  }, s = f2(l.state);
  let f = l.initialMonth ? new Date(l.initialMonth) : /* @__PURE__ */ new Date(), p = null, y = !1, h = null, E = null;
  const x = () => E || (E = {
    field: document.getElementById(l.fieldId),
    popup: document.getElementById(l.popupId),
    monthsContainer: document.getElementById(l.monthsContainerId),
    dayPickerContainer: document.getElementById(l.dayPickerContainerId),
    prevButton: document.getElementById(l.prevButtonId),
    nextButton: document.getElementById(l.nextButtonId),
    clearButton: document.getElementById(l.clearButtonId),
    confirmButton: document.getElementById(l.confirmButtonId),
    tabCalendar: document.getElementById(l.tabCalendarId),
    tabFlexible: document.getElementById(l.tabFlexibleId),
    panelCalendar: document.getElementById(l.panelCalendarId),
    panelFlexible: document.getElementById(l.panelFlexibleId)
  }, E), T = (he) => {
    he == null || he.stopPropagation();
  }, R = (he, ce) => {
    typeof he == "function" && he(s, Ge, ce);
  }, O = () => Array.isArray(l.weekdayLabels) && l.weekdayLabels.length === 7 ? l.weekdayLabels : l.weekStartsOn === "sunday" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], A = (he) => {
    const ce = new Date(he);
    return ce.setHours(0, 0, 0, 0), ce.getTime();
  }, L = (he) => l.weekStartsOn === "monday" ? he === 0 ? 6 : he - 1 : he, V = () => s.tempCheckIn || s.checkIn, N = () => s.tempCheckOut || s.checkOut, B = (he) => typeof l.monthLabelFormatter == "function" ? l.monthLabelFormatter(he, s, Ge) : `${he.getFullYear()}-${String(he.getMonth() + 1).padStart(2, "0")}`, Q = (he, ce) => typeof l.dayLabelFormatter == "function" ? l.dayLabelFormatter(he, ce, s, Ge) : String(he), ee = (he) => {
    const ce = he.getFullYear(), ie = he.getMonth(), Te = new Date(ce, ie, 1).getDay(), ye = L(Te), P = new Date(ce, ie + 1, 0).getDate(), re = A(/* @__PURE__ */ new Date()), Pe = V(), be = N();
    let qe = "";
    for (let it = 0; it < ye; it += 1)
      qe += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    for (let it = 1; it <= P; it += 1) {
      const rt = new Date(ce, ie, it).getTime(), ct = ["DayPicker-Day"];
      rt < re && ct.push("DayPicker-Day--disabled"), rt === re && ct.push("DayPicker-Day--today"), Pe && rt === Pe && ct.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange"), be && rt === be && ct.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange"), Pe && be && rt > Pe && rt < be && ct.push("DayPicker-Day--inRange"), l.showHoverRange && Pe && !be && p && rt > Pe && rt <= p && ct.push("DayPicker-Day--hoverRange"), qe += `<div class="${ct.join(" ")}" data-timestamp="${rt}" data-day="${it}">${Q(it, rt)}</div>`;
    }
    return qe;
  }, ne = () => {
    const { popup: he } = x();
    he && he.querySelectorAll(".DayPicker-Day").forEach((ce) => {
      if (ce.classList.remove("DayPicker-Day--hoverRange"), !l.showHoverRange)
        return;
      const ie = Number.parseInt(ce.dataset.timestamp ?? "", 10);
      Number.isFinite(ie) && s.tempCheckIn && !s.tempCheckOut && p && ie > s.tempCheckIn && ie <= p && ce.classList.add("DayPicker-Day--hoverRange");
    });
  }, se = (he) => {
    !s.tempCheckIn || s.tempCheckIn && s.tempCheckOut ? (s.tempCheckIn = he, s.tempCheckOut = null, p = null) : he < s.tempCheckIn ? (s.tempCheckIn = he, p = null) : he > s.tempCheckIn && (s.tempCheckOut = he, p = null), R(l.onTempChange ?? null), Ke();
  }, W = () => {
    const { popup: he, dayPickerContainer: ce } = x();
    he && (he.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)").forEach((ie) => {
      ie.addEventListener("click", (Te) => {
        T(Te);
        const ye = Number.parseInt(ie.dataset.timestamp ?? "", 10);
        Number.isFinite(ye) && se(ye);
      }), l.showHoverRange && ie.addEventListener("mouseenter", () => {
        const Te = Number.parseInt(ie.dataset.timestamp ?? "", 10);
        Number.isFinite(Te) && s.tempCheckIn && !s.tempCheckOut && Te > s.tempCheckIn && (p = Te, ne());
      });
    }), ce && l.showHoverRange && (ce.onmouseleave = () => {
      p && (p = null, ne());
    }));
  }, de = (he) => {
    const { tabCalendar: ce, tabFlexible: ie, panelCalendar: Te, panelFlexible: ye } = x();
    [ce, ie].forEach((P) => {
      P && (P.classList.remove("active"), P.setAttribute("aria-selected", "false"));
    }), [Te, ye].forEach((P) => {
      P && (P.classList.remove("active"), P.style.display = "none");
    }), he && (he.classList.add("active"), he.setAttribute("aria-selected", "true"), he === ce && Te && (Te.classList.add("active"), Te.style.display = "block"), he === ie && ye && (ye.classList.add("active"), ye.style.display = "block"));
  }, ue = () => {
    const { field: he, popup: ce } = x();
    !he || !ce || (typeof l.closeAllPopups == "function" && l.closeAllPopups(l.popupId), s.tempCheckIn = s.checkIn, s.tempCheckOut = s.checkOut, p = null, ce.classList.add("active"), l.toggleFieldActiveClass && he.classList.add("active"), l.openingClass && (ce.classList.add(l.openingClass), h && window.clearTimeout(h), l.openingClassDurationMs > 0 && (h = window.setTimeout(() => {
      ce.classList.remove(l.openingClass);
    }, l.openingClassDurationMs))), R(l.onTempChange ?? null), Ke(), R(l.onOpen ?? null));
  }, Ee = (he) => {
    const { field: ce, popup: ie } = x();
    ie && (ie.classList.remove("active"), l.openingClass && ie.classList.remove(l.openingClass), l.toggleFieldActiveClass && ce && ce.classList.remove("active"), R(l.onClose ?? null, he));
  }, fe = (he) => {
    s.tempCheckIn = null, s.tempCheckOut = null, p = null, R(l.onTempChange ?? null), R(l.onCancel ?? null, he);
  }, Ye = (he) => {
    if (T(he), !(typeof l.onBeforeConfirm == "function" && l.onBeforeConfirm(s, Ge) === !1)) {
      if (s.checkIn = s.tempCheckIn, s.checkOut = s.tempCheckOut, R(l.onConfirm ?? null), typeof l.closeAllPopups == "function") {
        l.closeAllPopups();
        const { field: ce } = x();
        l.toggleFieldActiveClass && ce && ce.classList.remove("active");
        return;
      }
      Ee({ reason: "confirm" });
    }
  }, Ke = () => {
    const { monthsContainer: he } = x();
    if (!he)
      return;
    he.innerHTML = "";
    const ce = O();
    for (let ie = 0; ie < l.monthsToRender; ie += 1) {
      const Te = new Date(f.getFullYear(), f.getMonth() + ie, 1), ye = document.createElement("div");
      ye.className = "DayPicker-Month";
      const P = document.createElement("div");
      P.className = "DayPicker-Caption", P.textContent = B(Te), ye.appendChild(P);
      const re = document.createElement("div");
      re.className = "DayPicker-Weekdays", ce.forEach((be) => {
        const qe = document.createElement("div");
        qe.className = "DayPicker-Weekday", qe.textContent = be, re.appendChild(qe);
      }), ye.appendChild(re);
      const Pe = document.createElement("div");
      Pe.className = "DayPicker-Body", Pe.innerHTML = ee(Te), ye.appendChild(Pe), he.appendChild(ye);
    }
    W();
  }, Ge = {
    init: () => {
      if (y)
        return Ge;
      const { field: he, popup: ce, prevButton: ie, nextButton: Te, clearButton: ye, confirmButton: P, tabCalendar: re, tabFlexible: Pe } = x();
      return !he || !ce || (he.addEventListener("click", (be) => {
        if (T(be), !ce.classList.contains("active")) {
          ue();
          return;
        }
        l.toggleMode === "toggle" && (l.cancelOnToggleClose && fe({ reason: "toggle" }), Ee({ reason: "toggle" }));
      }), ce.addEventListener("click", T), ie == null || ie.addEventListener("click", (be) => {
        T(be), f.setMonth(f.getMonth() - 1), Ke();
      }), Te == null || Te.addEventListener("click", (be) => {
        T(be), f.setMonth(f.getMonth() + 1), Ke();
      }), ye == null || ye.addEventListener("click", (be) => {
        T(be), s.checkIn = null, s.checkOut = null, s.tempCheckIn = null, s.tempCheckOut = null, p = null, R(l.onTempChange ?? null), Ke(), R(l.onClear ?? null);
      }), P == null || P.addEventListener("click", Ye), l.enableTabs && (re == null || re.addEventListener("click", (be) => {
        T(be), de(re);
      }), Pe == null || Pe.addEventListener("click", (be) => {
        T(be), de(Pe);
      })), l.enableFlexibleOptions && ce.querySelectorAll(l.flexibleOptionSelector).forEach((be) => {
        be.addEventListener("click", (qe) => {
          T(qe), ce.querySelectorAll(l.flexibleOptionSelector).forEach((it) => {
            it.classList.remove("active");
          }), be.classList.add("active");
        });
      }), y = !0), Ge;
    },
    renderCalendar: Ke,
    openCalendar: ue,
    closeCalendar: Ee,
    cancelSelection: fe,
    getState: () => s,
    getMonth: () => new Date(f),
    setMonth: (he) => {
      f = new Date(he), Ke();
    }
  };
  return Ge;
}, d2 = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (g) => Wb(g)
  };
}, p2 = (g) => g === "en" ? "Hello, I am your Jeju Group assistant" : "안녕 나는 제주그룹 안내 도우미", h2 = ({ isOpen: g, onOpen: l, onClose: s, language: f, onLanguageChange: p }) => {
  const [y, h] = Ut.useState([]), [E, x] = Ut.useState(""), [T, R] = Ut.useState(!1), O = Ut.useRef(null);
  Ut.useEffect(() => {
    const Q = {
      id: Date.now(),
      type: "bot",
      content: p2(f),
      timestamp: /* @__PURE__ */ new Date()
    };
    h([Q]);
  }, []), Ut.useEffect(() => {
    const Q = (ee) => {
      const ne = ee;
      (ne.detail === "ko" || ne.detail === "en") && p(ne.detail);
    };
    return document.addEventListener("fabLanguageChanged", Q), () => {
      document.removeEventListener("fabLanguageChanged", Q);
    };
  }, [p]), Ut.useEffect(() => {
    O.current && (O.current.scrollTop = O.current.scrollHeight);
  }, [y, g]);
  const A = Ut.useCallback((Q, ee) => {
    h((ne) => [
      ...ne,
      {
        id: Date.now() + ne.length + 1,
        type: Q,
        content: ee,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
  }, []), L = Ut.useMemo(
    () => y.map((Q) => ({ role: Q.type === "user" ? "user" : "assistant", content: Q.content })),
    [y]
  ), V = Ut.useCallback(async () => {
    var ee, ne, se;
    const Q = E.trim();
    if (!(!Q || T)) {
      A("user", Q), x(""), R(!0);
      try {
        const W = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: f === "en" ? "You are Jeju Group assistant" : "너는 제주그룹 안내 도우미"
              },
              ...L,
              {
                role: "user",
                content: Q
              }
            ]
          })
        });
        if (!W.ok)
          throw new Error(`Chat API failed: ${W.status}`);
        const de = await W.json(), ue = ((se = (ne = (ee = de == null ? void 0 : de.choices) == null ? void 0 : ee[0]) == null ? void 0 : ne.message) == null ? void 0 : se.content) ?? "응답 처리 실패";
        A("bot", String(ue));
      } catch (W) {
        A("bot", `오류 상태: ${W.message}`);
      } finally {
        R(!1);
      }
    }
  }, [A, L, E, f, T]), N = (Q) => {
    Q.preventDefault(), V().catch(() => {
    });
  }, B = (Q) => {
    Q.key === "Enter" && (Q.preventDefault(), V().catch(() => {
    }));
  };
  return /* @__PURE__ */ Y.jsxs(Y.Fragment, { children: [
    /* @__PURE__ */ Y.jsx(
      "button",
      {
        className: `chatbot-toggle-btn ${g ? "hidden" : ""}`,
        "aria-label": f === "en" ? "Open chatbot" : "챗봇 열기",
        onClick: l,
        children: /* @__PURE__ */ Y.jsx("i", { "data-lucide": "message-circle" })
      }
    ),
    /* @__PURE__ */ Y.jsxs("div", { className: `chatbot-container ${g ? "active" : ""}`, children: [
      /* @__PURE__ */ Y.jsxs("div", { className: "chatbot-header", children: [
        /* @__PURE__ */ Y.jsx("h3", { children: f === "en" ? "Jeju Chatbot" : "제주 챗봇" }),
        /* @__PURE__ */ Y.jsx("button", { className: "chatbot-close-btn", onClick: s, children: "닫기" })
      ] }),
      /* @__PURE__ */ Y.jsxs("div", { className: "chatbot-messages", ref: O, children: [
        y.map((Q) => /* @__PURE__ */ Y.jsxs("div", { className: `message ${Q.type}`, children: [
          /* @__PURE__ */ Y.jsx("div", { className: "message-bubble", children: Q.content }),
          /* @__PURE__ */ Y.jsx("div", { className: "message-time", children: Q.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
        ] }, Q.id)),
        T ? /* @__PURE__ */ Y.jsx("div", { className: "message bot", children: /* @__PURE__ */ Y.jsxs("div", { className: "typing-indicator", children: [
          /* @__PURE__ */ Y.jsx("div", { className: "typing-dot" }),
          /* @__PURE__ */ Y.jsx("div", { className: "typing-dot" }),
          /* @__PURE__ */ Y.jsx("div", { className: "typing-dot" })
        ] }) }) : null
      ] }),
      /* @__PURE__ */ Y.jsxs("form", { className: "chatbot-input-area", onSubmit: N, children: [
        /* @__PURE__ */ Y.jsx(
          "input",
          {
            value: E,
            onChange: (Q) => x(Q.target.value),
            onKeyDown: B,
            placeholder: f === "en" ? "Type a message" : "메시지 입력"
          }
        ),
        /* @__PURE__ */ Y.jsx("button", { type: "submit", disabled: T, children: f === "en" ? "Send" : "전송" })
      ] })
    ] })
  ] });
};
let QE = null, lf = null, sf = !1, XE = localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
const As = () => {
  QE && QE.render(
    /* @__PURE__ */ Y.jsx(
      h2,
      {
        isOpen: sf,
        onOpen: () => {
          sf = !0, As();
        },
        onClose: () => {
          sf = !1, As();
        },
        language: XE,
        onLanguageChange: (g) => {
          XE = g, localStorage.setItem("jeju_fab_lang", g), As();
        }
      }
    )
  );
}, v2 = () => {
  lf || (lf = document.getElementById("jeju-chatbot-root"), lf || (lf = document.createElement("div"), lf.id = "jeju-chatbot-root", document.body.appendChild(lf)), QE = up(lf), As());
}, m2 = () => {
  v2(), window.hotelChatbot = {
    openChatbot: () => {
      sf = !0, As();
    },
    closeChatbot: () => {
      sf = !1, As();
    },
    toggleChatbot: () => {
      sf = !sf, As();
    },
    updateLanguage: (g) => {
      XE = g, localStorage.setItem("jeju_fab_lang", g), As();
    }
  };
};
let jT = !1;
const y2 = 37.5665, g2 = 126.978, Gb = (g, l = "small") => {
  const s = {
    "01": ["fa-sun", "#ffbd00"],
    "02": ["fa-cloud-sun", "#ffbd00"],
    "03": ["fa-cloud", "#cbd5e1"],
    "04": ["fa-cloud", "#94a3b8"],
    "09": ["fa-cloud-showers-heavy", "#60a5fa"],
    10: ["fa-cloud-rain", "#60a5fa"],
    11: ["fa-bolt", "#fde047"],
    13: ["fa-snowflake", "#99f6e4"],
    50: ["fa-smog", "#94a3b8"]
  }, f = g.slice(0, 2), [p, y] = s[f] ?? ["fa-cloud", "#cbd5e1"];
  return l === "large" ? `<i class="fa-solid ${p} weather-detail-icon-fa" style="color:${y};"></i>` : `<i class="fa-solid ${p}" style="color:${y};margin-right:4px;"></i>`;
}, _2 = async (g, l) => {
  const s = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=current&lat=${g}&lon=${l}`);
  if (!s.ok)
    throw new Error(`weather fetch failed: ${s.status}`);
  return s.json();
}, PT = async (g, l) => {
  const s = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=pollution&lat=${g}&lon=${l}`);
  if (!s.ok)
    throw new Error(`pollution fetch failed: ${s.status}`);
  return s.json();
}, S2 = async () => new Promise((g, l) => {
  if (!navigator.geolocation) {
    l(new Error("geolocation unavailable"));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (s) => {
      g({
        lat: s.coords.latitude,
        lon: s.coords.longitude
      });
    },
    (s) => l(s)
  );
}), FT = (g, l) => {
  var p, y;
  const s = Math.round(l.main.temp), f = ((y = (p = l.weather) == null ? void 0 : p[0]) == null ? void 0 : y.icon) ?? "03d";
  g.innerHTML = `${Gb(f, "small")}<span>${s}°</span>`;
}, OE = (g, l, s) => {
  var x, T, R, O, A, L, V, N, B, Q, ee;
  const f = ((R = (T = (x = s == null ? void 0 : s.list) == null ? void 0 : x[0]) == null ? void 0 : T.main) == null ? void 0 : R.aqi) ?? 1, p = {
    1: ["좋음", "good"],
    2: ["보통", "fair"],
    3: ["나쁨", "poor"],
    4: ["매우나쁨", "very-poor"],
    5: ["매우나쁨", "very-poor"]
  }, [y, h] = p[f] ?? ["정보없음", ""], E = Gb(((A = (O = l.weather) == null ? void 0 : O[0]) == null ? void 0 : A.icon) ?? "03d", "large");
  g.innerHTML = `
    <div class="weather-detail-main">
      <p class="weather-detail-city">${l.name ?? "도시"}</p>
      <div class="weather-detail-info">
        ${E}
        <h2 class="weather-detail-temp">${Math.round(((L = l.main) == null ? void 0 : L.temp) ?? 0)}°</h2>
        <p class="weather-detail-desc">${((N = (V = l.weather) == null ? void 0 : V[0]) == null ? void 0 : N.description) ?? ""}</p>
      </div>
    </div>
    <div class="weather-detail-grid">
      <div class="weather-detail-item">
        <span class="item-label">체감온도</span>
        <span class="item-value">${Math.round(((B = l.main) == null ? void 0 : B.feels_like) ?? 0)}°</span>
      </div>
      <div class="weather-detail-item weather-detail-dust ${h}">
        <span class="item-label">미세먼지</span>
        <span class="item-value">${y}</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">습도</span>
        <span class="item-value">${((Q = l.main) == null ? void 0 : Q.humidity) ?? 0}%</span>
      </div>
      <div class="weather-detail-item">
        <span class="item-label">풍속</span>
        <span class="item-value">${((ee = l.wind) == null ? void 0 : ee.speed) ?? 0}m/s</span>
      </div>
    </div>
  `;
}, E2 = () => {
  if (jT)
    return;
  const g = document.getElementById("weather-open-btn"), l = document.getElementById("weather-overlay"), s = document.getElementById("weather-close-btn"), f = document.getElementById("weather-detail-container"), p = document.getElementById("weather-search-input"), y = document.getElementById("weather-search-btn");
  if (!g || !l || !s || !f)
    return;
  let h = null, E = null;
  const x = async (O, A) => {
    const [L, V] = await Promise.all([_2(O, A), PT(O, A)]);
    h = L, E = V, FT(g, L), l.classList.contains("active") && OE(f, L, V);
  };
  g.addEventListener("click", () => {
    l.classList.add("active"), h && E && OE(f, h, E);
  }), s.addEventListener("click", () => {
    l.classList.remove("active");
  }), l.addEventListener("click", (O) => {
    O.target === l && l.classList.remove("active");
  });
  const T = async () => {
    const O = p == null ? void 0 : p.value.trim();
    if (O)
      try {
        const A = await fetch(`https://jejugroup.alwaysdata.net/api/weather?type=search&q=${encodeURIComponent(O)}`);
        if (!A.ok)
          throw new Error(`city weather failed: ${A.status}`);
        const L = await A.json(), V = await PT(L.coord.lat, L.coord.lon);
        h = L, E = V, FT(g, L), OE(f, L, V);
      } catch (A) {
        f.innerHTML = `<div class="weather-loading-large"><p>조회 실패: ${A.message}</p></div>`;
      }
  };
  y == null || y.addEventListener("click", () => {
    T().catch(() => {
    });
  }), p == null || p.addEventListener("keydown", (O) => {
    O.key === "Enter" && (O.preventDefault(), T().catch(() => {
    }));
  }), (async () => {
    try {
      const O = await S2();
      await x(O.lat, O.lon);
    } catch {
      await x(y2, g2);
    }
  })().catch(() => {
  }), jT = !0;
};
let HT = !1, IT = !1;
const C2 = () => {
  IT || (IT = !0, document.body.addEventListener("click", async (g) => {
    var s;
    (s = g.target) != null && s.closest('[data-action="OPEN_RESERVATION_DRAWER"]') && (g.preventDefault(), await Xg.open());
  }));
}, vl = () => {
  HT || (HT = !0, window.initHeader = () => jv(), window.initFooter = () => Qg(), window.initMegaMenu = () => KE(), window.initStaggerNav = () => Gg(), d2(), KM(), HM(), C2(), tN());
}, R2 = async () => {
  vl(), await yN();
}, k2 = async () => {
  vl(), await gN();
}, D2 = () => {
  vl(), jv();
}, O2 = () => {
  vl(), Qg();
}, L2 = () => {
  vl(), KE();
}, M2 = () => {
  vl(), Gg();
}, N2 = async () => {
  vl(), await Xg.open();
}, A2 = () => {
  vl(), Xg.close();
}, z2 = () => {
  vl(), c2();
}, U2 = () => {
  vl(), m2();
}, j2 = () => {
  vl(), E2();
}, P2 = (g) => (vl(), Wb(g)), F2 = Xg;
export {
  A2 as closeReservationDrawer,
  P2 as createRangeCalendarRuntime,
  O2 as ensureFooterBehavior,
  D2 as ensureHeaderBehavior,
  L2 as ensureMegaMenuBehavior,
  M2 as ensureStaggerNavBehavior,
  vl as installLegacyGlobals,
  k2 as mountHotelShellRuntime,
  R2 as mountMainShellRuntime,
  N2 as openReservationDrawer,
  F2 as runtimeReservationDrawer,
  U2 as setupLegacyChatbotRuntime,
  z2 as setupLegacyFabRuntime,
  j2 as setupWeatherWidgetRuntime
};
