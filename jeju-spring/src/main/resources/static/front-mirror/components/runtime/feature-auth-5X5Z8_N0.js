import { j as a, a as c } from "./react-vendor-BoSfm_Te.js";
import { v as W, s as _, A as v, b as ce, h as oe, r as ee, R as q } from "./legacy-core-CYHwlLlr.js";
const le = ({ children: t, className: e = "" }) => /* @__PURE__ */ a.jsx("div", { className: ["user_box", "inner2", "login-card", e].filter(Boolean).join(" "), children: t }), ue = (t) => t === "success" ? "success" : t === "warning" ? "warning" : t === "error" ? "error" : "", E = ({ className: t = "", id: e, message: s, tone: r = "idle" }) => {
  if (!s)
    return null;
  const n = ["input-feedback", ue(r), t].filter(Boolean).join(" ");
  return /* @__PURE__ */ a.jsx("p", { className: n, id: e, children: s });
}, x = ({
  autoComplete: t,
  className: e,
  disabled: s,
  feedback: r,
  feedbackTone: i = "idle",
  id: n,
  inputMode: o,
  label: m,
  maxLength: l,
  onChange: h,
  placeholder: S,
  readOnly: g,
  rightSlot: f,
  type: C = "text",
  value: b
}) => {
  const j = /* @__PURE__ */ a.jsx(
    "input",
    {
      autoComplete: t,
      disabled: s,
      id: n,
      inputMode: o,
      maxLength: l,
      onChange: h,
      placeholder: S,
      readOnly: g,
      type: C,
      value: b
    }
  );
  return /* @__PURE__ */ a.jsxs("div", { className: ["input_group", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ a.jsx("label", { htmlFor: n, children: m }),
    f ? /* @__PURE__ */ a.jsxs("div", { className: "input-with-button", children: [
      j,
      f
    ] }) : j,
    r ? /* @__PURE__ */ a.jsx(E, { message: r, tone: i }) : null
  ] });
}, de = "/pages/auth/", Y = (t) => {
  if (!t || typeof window > "u" || t.startsWith("javascript:") || t.startsWith("data:"))
    return null;
  try {
    const e = new URL(t, window.location.href), s = new URL(window.location.href);
    return e.origin !== s.origin || e.pathname.includes(de) || e.href === s.href ? null : e.toString();
  } catch {
    return null;
  }
}, he = async (t, e) => {
  if (!W(t) || !W(e))
    throw new Error("로그인 입력값 검증 실패 상태");
  const s = new URLSearchParams();
  s.append("id", _(t)), s.append("pw", _(e));
  const r = await fetch(`${v}/api/auth/login`, {
    body: s,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  if (!r.ok) {
    let n = "로그인 처리 실패 상태";
    try {
      const o = await r.json();
      n = typeof o.message == "string" && o.message ? o.message : n;
    } catch {
    }
    throw new Error(n);
  }
  const i = await r.json();
  return ce(i.user);
}, pe = async (t) => {
  var n;
  const e = new URLSearchParams(window.location.search), s = Y(e.get("redirect")), r = Y(document.referrer);
  if (s) {
    window.location.replace(s);
    return;
  }
  if (r) {
    window.location.replace(r);
    return;
  }
  const i = oe(t) ? "ADMIN.DASHBOARD" : "HOME";
  try {
    const o = ee(i);
    if ((n = window.__JEJU_ROUTE_NAVIGATOR__) != null && n.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(o, "login-success");
      return;
    }
    window.location.replace(o);
  } catch {
    window.location.replace(i === "ADMIN.DASHBOARD" ? q.ADMIN.DASHBOARD : q.HOME);
  }
}, O = (t) => t.replace(/\D/g, ""), K = (t) => {
  const e = O(t).slice(0, 11);
  return e.length < 4 ? e : e.length < 8 ? `${e.slice(0, 3)}-${e.slice(3)}` : e.length === 10 ? `${e.slice(0, 3)}-${e.slice(3, 6)}-${e.slice(6)}` : `${e.slice(0, 3)}-${e.slice(3, 7)}-${e.slice(7)}`;
}, se = (t) => /^\d{6}$/.test(t), me = (t) => /^[1-8]$/.test(t), ge = (t) => se(t) ? `${t.slice(0, 2)}-${t.slice(2, 4)}-${t.slice(4, 6)}` : "", fe = (t) => t === "1" || t === "3" || t === "5" || t === "7" ? "M" : t === "2" || t === "4" || t === "6" || t === "8" ? "F" : "", L = Object.freeze({
  KAKAO_JS_KEY: "",
  NAVER_CLIENT_ID: ""
}), Se = "/pages/auth/oauth_callback.html", be = ["/api/auth/naver/start", "/api/auth/naver/init"];
let A = null;
const we = (t) => {
  const e = t && typeof t == "object" ? t.social ?? {} : {};
  return {
    KAKAO_JS_KEY: String(e.kakaoJsKey ?? "").trim(),
    NAVER_CLIENT_ID: String(e.naverClientId ?? "").trim()
  };
}, te = async () => {
  if (A)
    return { ...A };
  try {
    const t = await fetch(`${v}/api/public/config`, {
      credentials: "same-origin",
      method: "GET"
    });
    if (!t.ok)
      return A = { ...L }, { ...A };
    const e = await t.json().catch(() => ({}));
    A = {
      ...L,
      ...we(e)
    };
  } catch {
    A = { ...L };
  }
  return { ...A };
}, ye = async () => {
  if (typeof Kakao > "u")
    return { message: "카카오 SDK 로딩 실패 상태", ok: !1 };
  const t = await te();
  return t.KAKAO_JS_KEY ? (Kakao.isInitialized() || Kakao.init(t.KAKAO_JS_KEY), { message: "", ok: !0 }) : { message: "카카오 JavaScript 키 누락 상태", ok: !1 };
}, xe = () => new URL(window.location.pathname, window.location.origin).href, Ae = () => new URL(Se, window.location.origin).href, ve = (t, e) => {
  if (t && typeof t == "object") {
    const s = t.message;
    if (typeof s == "string" && s.trim())
      return s.trim();
  }
  return e;
}, ke = (t) => {
  if (!t || typeof t != "object")
    return "";
  const e = t, s = e.data && typeof e.data == "object" ? e.data : null, r = [
    e.authorizationUrl,
    e.authUrl,
    e.redirectUrl,
    e.url,
    s == null ? void 0 : s.authorizationUrl,
    s == null ? void 0 : s.authUrl,
    s == null ? void 0 : s.redirectUrl,
    s == null ? void 0 : s.url
  ];
  for (const i of r)
    if (typeof i == "string" && i.trim())
      return i.trim();
  return "";
}, je = async (t, e) => {
  const s = await fetch(`${v}${t}`, {
    body: new URLSearchParams(e),
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  return { body: await s.json().catch(() => ({})), response: s };
}, Ne = async (t, e) => {
  let s = "네이버 로그인 처리 실패 상태";
  for (const r of t) {
    const { body: i, response: n } = await je(r, e);
    if (n.status === 404 || n.status === 405) {
      s = ve(i, s);
      continue;
    }
    return { body: i, response: n };
  }
  throw new Error(s);
}, Ce = async () => {
  try {
    const { body: t, response: e } = await Ne(be, {
      callbackUrl: Ae(),
      flow: "login",
      provider: "NAVER"
    });
    if (!e.ok || t.success === !1)
      return {
        message: "네이버 로그인 준비 실패 상태",
        success: !1
      };
    const s = ke(t);
    return s ? {
      authorizationUrl: s,
      success: !0
    } : {
      message: "네이버 로그인 주소를 불러오지 못한 상태",
      success: !1
    };
  } catch {
    return {
      message: "네이버 로그인 준비 실패 상태",
      success: !1
    };
  }
}, Te = async (t) => {
  if (t === "kakao") {
    const s = await ye();
    return s.ok ? new Promise((r) => {
      Kakao.Auth.login({
        fail: () => {
          r({
            message: "카카오 로그인 시작 실패 상태",
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
              var o;
              const n = i.kakao_account ?? {};
              r({
                data: {
                  gender: n.gender === "male" ? "M" : "F",
                  name: n.name || ((o = i.properties) == null ? void 0 : o.nickname) || "회원",
                  phone: K(n.phone_number || "01000000000"),
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
      message: s.message,
      success: !1
    };
  }
  const e = await te();
  return typeof naver > "u" || typeof naver.LoginWithNaverId > "u" ? {
    message: "네이버 SDK 로딩 실패 상태",
    success: !1
  } : e.NAVER_CLIENT_ID ? new Promise((s) => {
    const r = "naverIdLogin";
    let i = document.getElementById(r);
    i || (i = document.createElement("div"), i.id = r, i.style.display = "none", document.body.appendChild(i));
    try {
      const n = new naver.LoginWithNaverId({
        callbackUrl: xe(),
        clientId: e.NAVER_CLIENT_ID,
        isPopup: !0,
        loginButton: { color: "green", height: 60, type: 3 }
      });
      n.init(), n.getLoginStatus((o) => {
        if (o) {
          s({
            data: {
              gender: n.user.getGender() === "M" ? "M" : "F",
              name: n.user.getName() || "회원",
              phone: K(n.user.getMobile() || "01000000000"),
              provider: "NAVER"
            },
            success: !0
          });
          return;
        }
        n.authorize(), s({
          pending: !0,
          success: !1
        });
      });
    } catch {
      s({
        message: "네이버 로그인 초기화 실패 상태",
        success: !1
      });
    }
  }) : {
    message: "네이버 Client ID 누락 상태",
    success: !1
  };
}, Ee = (t) => ({
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
  setError: (e, s) => {
    t({
      payload: { message: s, scope: e },
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
}), D = () => ({
  message: "",
  tone: "idle"
}), Pe = () => ({
  authMethod: "",
  birthDate: "",
  gender: "",
  isVerified: !1,
  name: "",
  phone: "",
  provider: "",
  rrnBackFirstDigit: "",
  telecom: ""
}), _e = (t = "") => ({
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
      idFeedback: D(),
      idCheckStatus: "idle",
      password: "",
      passwordConfirm: "",
      passwordConfirmFeedback: D(),
      passwordFeedback: D(),
      passwordStrength: "hidden",
      submitting: !1,
      userId: ""
    },
    completedName: "",
    identity: Pe(),
    step: 1,
    terms: {
      marketing: !1,
      privacy: !1,
      service: !1
    }
  },
  status: "idle"
}), Ie = (t, e) => {
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
}, ae = c.createContext(null), re = c.createContext(null), $ = ({ children: t, savedLoginId: e = "" }) => {
  const [s, r] = c.useReducer(Ie, e, _e), i = c.useMemo(() => Ee(r), [r]);
  return /* @__PURE__ */ a.jsx(ae.Provider, { value: s, children: /* @__PURE__ */ a.jsx(re.Provider, { value: i, children: t }) });
}, k = () => {
  const t = c.useContext(ae);
  if (!t)
    throw new Error("useAuthState must be used within AuthProvider");
  return t;
}, P = () => {
  const t = c.useContext(re);
  if (!t)
    throw new Error("useAuthActions must be used within AuthProvider");
  return t;
}, F = "jeju:login-id", Re = () => {
  try {
    return localStorage.getItem(F) ?? "";
  } catch {
    return "";
  }
}, Me = () => {
  const { errors: t, login: e } = k(), s = P(), r = c.useMemo(() => e.submitting || e.loginId.trim().length === 0 || e.password.trim().length === 0, [e.loginId, e.password, e.submitting]);
  c.useEffect(() => {
    try {
      if (e.rememberId && e.loginId.trim()) {
        localStorage.setItem(F, e.loginId.trim());
        return;
      }
      localStorage.removeItem(F);
    } catch {
    }
  }, [e.loginId, e.rememberId]);
  const i = c.useCallback(
    (h) => {
      s.patchLogin({ loginId: h.target.value }), s.resetError("login");
    },
    [s]
  ), n = c.useCallback(
    (h) => {
      s.patchLogin({ password: h.target.value }), s.resetError("login");
    },
    [s]
  ), o = c.useCallback(
    (h) => {
      s.patchLogin({ rememberId: h.target.checked });
    },
    [s]
  ), m = c.useCallback(
    async (h) => {
      h.preventDefault();
      const S = e.loginId.trim(), g = e.password.trim();
      try {
        s.patchLogin({ submitting: !0 }), s.resetError("login"), s.setStatus("submitting");
        const f = await he(S, g);
        s.setStatus("success"), await pe(f);
      } catch (f) {
        s.setStatus("error"), s.setError("login", f instanceof Error ? f.message : "로그인 처리 실패 상태");
      } finally {
        s.patchLogin({ submitting: !1 });
      }
    },
    [s, e.loginId, e.password]
  ), l = c.useCallback(async () => {
    try {
      s.patchLogin({ submitting: !0 }), s.resetError("login"), s.setStatus("verifying");
      const h = await Ce();
      if (!h.success || !h.authorizationUrl) {
        s.setStatus("error"), s.setError("login", h.message || "네이버 로그인 준비 실패 상태");
        return;
      }
      window.location.replace(h.authorizationUrl);
    } catch {
      s.setStatus("error"), s.setError("login", "네이버 로그인 준비 실패 상태");
    } finally {
      s.patchLogin({ submitting: !1 });
    }
  }, [s]);
  return {
    errorMessage: t.login,
    handleIdChange: i,
    handleNaverLogin: l,
    handlePasswordChange: n,
    handleRememberChange: o,
    handleSubmit: m,
    isDisabled: r,
    login: e
  };
}, Ue = () => {
  const {
    errorMessage: t,
    handleIdChange: e,
    handleNaverLogin: s,
    handlePasswordChange: r,
    handleRememberChange: i,
    handleSubmit: n,
    isDisabled: o,
    login: m
  } = Me();
  return /* @__PURE__ */ a.jsxs(le, { children: [
    /* @__PURE__ */ a.jsxs("div", { className: "login-header", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "login-title", children: "로그인" }),
      /* @__PURE__ */ a.jsx("p", { className: "login-desc", children: "포인트 적립부터 운임 혜택까지 한 번에 이용하세요." })
    ] }),
    /* @__PURE__ */ a.jsxs("form", { className: "login-form", id: "user_form", onSubmit: n, children: [
      /* @__PURE__ */ a.jsx(
        x,
        {
          autoComplete: "username",
          id: "id",
          label: "이메일/아이디",
          onChange: e,
          placeholder: "아이디 또는 이메일을 입력해 주세요",
          value: m.loginId
        }
      ),
      /* @__PURE__ */ a.jsx(
        x,
        {
          autoComplete: "current-password",
          id: "pw",
          label: "비밀번호",
          onChange: r,
          placeholder: "비밀번호를 입력해 주세요",
          type: "password",
          value: m.password
        }
      ),
      /* @__PURE__ */ a.jsx("div", { className: "error-wrapper", id: "login-error-wrapper", style: { display: t ? "block" : "none" }, children: /* @__PURE__ */ a.jsx("p", { className: "error-msg", children: t }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "login_options", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "remember-me", children: [
          /* @__PURE__ */ a.jsx("input", { checked: m.rememberId, id: "saveId", onChange: i, type: "checkbox" }),
          /* @__PURE__ */ a.jsx("span", { children: "아이디 저장" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "nav-links", children: [
          /* @__PURE__ */ a.jsx("a", { href: "#", children: "아이디/비밀번호 찾기" }),
          /* @__PURE__ */ a.jsx("span", { className: "divider", children: "|" }),
          /* @__PURE__ */ a.jsx("a", { className: "route-link", "data-route": "AUTH.SIGNUP", href: "#", children: "회원가입" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("button", { className: "login-btn btn", "data-state": m.submitting ? "loading" : "idle", disabled: o, type: "submit", children: m.submitting ? "로그인 중" : "로그인" }),
      /* @__PURE__ */ a.jsx("div", { className: "quick_login", children: "간편 로그인" }),
      /* @__PURE__ */ a.jsx("div", { className: "sns_login", children: /* @__PURE__ */ a.jsxs("button", { className: "sns_btn naver", disabled: m.submitting, onClick: () => void s(), type: "button", children: [
        /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true", children: "N" }),
        "네이버로 로그인"
      ] }) })
    ] })
  ] });
}, ws = () => {
  const t = c.useMemo(() => Re(), []);
  return /* @__PURE__ */ a.jsx($, { savedLoginId: t, children: /* @__PURE__ */ a.jsx(Ue, {}) });
}, ne = ({ accent: t = "orange", currentStep: e, description: s, steps: r, title: i }) => {
  const n = c.useMemo(() => r.length <= 1 ? "0%" : `${(e - 1) / (r.length - 1) * 100}%`, [e, r.length]);
  return /* @__PURE__ */ a.jsxs("header", { className: `step-header ${t === "red" ? "step-header-pass" : ""}`, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "step-header-text", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "step-title", children: i }),
      s ? /* @__PURE__ */ a.jsx("p", { className: "step-desc", children: s }) : null
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "step-indicator", "data-accent": t, children: [
      /* @__PURE__ */ a.jsx("div", { className: "progress-bg" }),
      /* @__PURE__ */ a.jsx("div", { className: "progress-bar", style: { width: n } }),
      /* @__PURE__ */ a.jsx("div", { className: "step-circles", children: r.map((o, m) => {
        const l = m + 1, h = l === e ? "active" : l < e ? "completed" : "";
        return /* @__PURE__ */ a.jsx(
          "div",
          {
            "aria-label": `${l}단계 ${o.label}`,
            className: `step-circle ${h}`.trim(),
            children: l === e && o.iconClassName ? /* @__PURE__ */ a.jsx("i", { className: o.iconClassName }) : null
          },
          o.label
        );
      }) })
    ] })
  ] });
}, Z = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", Le = (t) => new Promise((e) => window.setTimeout(e, t)), De = async () => {
  try {
    const t = await fetch(`${v}/api/auth/verify`), e = await t.json().catch(() => ({}));
    return !t.ok || typeof e.siteKey != "string" || !e.siteKey.trim() ? Z : e.siteKey;
  } catch {
    return Z;
  }
}, Oe = async (t) => {
  try {
    const e = await fetch(`${v}/api/auth/verify`, {
      body: new URLSearchParams({
        action: "verifyRecaptcha",
        token: t
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }), s = await e.json().catch(() => ({}));
    return !e.ok || s.success === !1 ? {
      message: typeof s.message == "string" && s.message ? s.message : "보안문자 검증 실패 상태",
      success: !1
    } : {
      message: typeof s.message == "string" && s.message ? s.message : "보안문자 검증 완료 상태",
      success: !0
    };
  } catch {
    return {
      message: "보안문자 검증 응답 지연으로 임시 통과 처리 상태",
      success: !0
    };
  }
}, Ke = async () => {
  await Le(3e3);
}, Fe = () => {
  const { passAuth: t } = k(), e = P();
  return c.useEffect(() => {
    let s = !0;
    return t.recaptchaSiteKey ? void 0 : ((async () => {
      const i = await De();
      s && e.patchPassAuth({ recaptchaSiteKey: i });
    })(), () => {
      s = !1;
    });
  }, [e, t.recaptchaSiteKey]), null;
}, ie = "JEJU_PASS_AUTH_SUCCESS", $e = () => {
  const s = window.screenX + Math.max(0, (window.outerWidth - 430) / 2), r = window.screenY + Math.max(0, (window.outerHeight - 800) / 2), i = ee("AUTH.PASS_AUTH");
  return window.open(
    i,
    "PASS_Auth_Popup",
    `width=430,height=800,left=${Math.round(s)},top=${Math.round(r)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
  );
}, He = (t) => ({
  payload: t,
  source: "jeju-pass-auth",
  type: ie
}), Ve = (t) => {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return e.type === ie && e.source === "jeju-pass-auth" && !!e.payload;
}, Be = (t) => !window.opener || window.opener.closed ? !1 : (window.opener.postMessage(He(t), window.location.origin), !0), I = () => {
  const { errors: t, passAuth: e } = k(), s = P(), r = c.useRef(null), i = c.useRef(null), n = c.useRef(null), o = c.useRef(null), m = c.useMemo(() => se(e.birthSix), [e.birthSix]), l = c.useMemo(() => me(e.rrnDigit), [e.rrnDigit]), h = c.useMemo(() => O(e.phone).length === 11, [e.phone]), S = m && l, g = S && h, f = g && e.recaptchaStatus === "success" && !e.submitting, C = c.useMemo(() => e.step === 1 ? "이용 중인 통신사를 선택해 주세요" : e.step === 2 ? "인증 방법을 선택해 주세요" : e.step === 3 ? "이름을 입력해 주세요" : S ? g ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", [e.step, S, g]), b = c.useCallback(() => {
    var p;
    n.current !== null && ((p = window.grecaptcha) != null && p.reset) && window.grecaptcha.reset(n.current), s.patchPassAuth({
      recaptchaStatus: "idle",
      recaptchaToken: ""
    }), s.resetError("passAuth");
  }, [s]);
  c.useEffect(() => {
    if (!g || !e.recaptchaSiteKey || n.current !== null)
      return;
    let p = 0, w = 0, y = !0;
    const V = () => {
      var B;
      return !y || !o.current || !((B = window.grecaptcha) != null && B.render) ? !1 : (n.current = window.grecaptcha.render(o.current, {
        callback: async (G) => {
          var J;
          s.patchPassAuth({
            recaptchaStatus: "loading",
            recaptchaToken: G
          }), s.setStatus("verifying");
          const z = await Oe(G);
          if (z.success) {
            s.patchPassAuth({ recaptchaStatus: "success" }), s.resetError("passAuth"), s.setStatus("verified");
            return;
          }
          s.patchPassAuth({
            recaptchaStatus: "error",
            recaptchaToken: ""
          }), s.setError("passAuth", z.message), s.setStatus("error"), n.current !== null && ((J = window.grecaptcha) != null && J.reset) && window.grecaptcha.reset(n.current);
        },
        sitekey: e.recaptchaSiteKey
      }), !0);
    };
    return V() || (p = window.setInterval(() => {
      V() && window.clearInterval(p);
    }, 200), w = window.setTimeout(() => {
      window.clearInterval(p);
    }, 4e3)), () => {
      y = !1, p && window.clearInterval(p), w && window.clearTimeout(w);
    };
  }, [s, e.recaptchaSiteKey, g]);
  const j = c.useCallback(
    (p) => {
      s.patchPassAuth({ telecom: p }), s.setPassAuthStep(2), s.resetError("passAuth");
    },
    [s]
  ), R = c.useCallback(
    (p) => {
      s.patchPassAuth({ authMethod: p }), s.setPassAuthStep(3), s.resetError("passAuth");
    },
    [s]
  ), M = c.useCallback(
    (p) => {
      s.patchPassAuth({ name: p.target.value }), s.resetError("passAuth");
    },
    [s]
  ), u = c.useCallback(() => {
    if (!e.name.trim()) {
      s.setError("passAuth", "이름 입력 필요 상태");
      return;
    }
    s.setPassAuthStep(4), s.resetError("passAuth");
  }, [s, e.name]), d = c.useCallback(
    (p) => {
      const w = O(p.target.value).slice(0, 6);
      s.patchPassAuth({ birthSix: w }), w.length === 6 && window.setTimeout(() => {
        var y;
        return (y = r.current) == null ? void 0 : y.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && b();
    },
    [s, e.recaptchaStatus, e.recaptchaToken, b]
  ), N = c.useCallback(
    (p) => {
      const w = p.target.value.replace(/[^1-8]/g, "").slice(0, 1);
      s.patchPassAuth({ rrnDigit: w }), w.length === 1 && window.setTimeout(() => {
        var y;
        return (y = i.current) == null ? void 0 : y.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && b();
    },
    [s, e.recaptchaStatus, e.recaptchaToken, b]
  ), T = c.useCallback(
    (p) => {
      s.patchPassAuth({ phone: K(p.target.value) }), (e.recaptchaToken || e.recaptchaStatus === "success") && b();
    },
    [s, e.recaptchaStatus, e.recaptchaToken, b]
  ), U = c.useCallback(async () => {
    if (!f) {
      s.setError("passAuth", "입력값 또는 보안문자 확인 필요 상태");
      return;
    }
    const p = {
      authMethod: e.authMethod,
      birthDate: ge(e.birthSix),
      gender: fe(e.rrnDigit),
      name: e.name.trim(),
      phone: e.phone.trim(),
      provider: "PASS",
      rrnBackFirstDigit: e.rrnDigit,
      telecom: e.telecom
    };
    if (s.setPassAuthStep(5), s.patchPassAuth({ submitting: !0 }), s.resetError("passAuth"), s.setStatus("submitting"), await Ke(), !Be(p)) {
      s.patchPassAuth({ submitting: !1 }), s.setPassAuthStep(4), s.setStatus("error"), s.setError("passAuth", "회원가입 창 연결 실패 상태");
      return;
    }
    s.setStatus("success"), window.close();
  }, [s, f, e.authMethod, e.birthSix, e.name, e.phone, e.rrnDigit, e.telecom]);
  return {
    canSubmit: f,
    errorMessage: t.passAuth,
    handleBirthChange: d,
    handleNameChange: M,
    handlePhoneChange: T,
    handleRrnChange: N,
    handleSelectMethod: R,
    handleSelectTelecom: j,
    handleSubmit: U,
    goToIdentityStep: u,
    passAuth: e,
    phoneInputRef: i,
    recaptchaHostRef: o,
    rrnDigitInputRef: r,
    shouldShowPhoneField: S,
    shouldShowRecaptcha: g,
    stepTitle: C
  };
}, Ge = () => {
  const {
    canSubmit: t,
    errorMessage: e,
    handleBirthChange: s,
    handlePhoneChange: r,
    handleRrnChange: i,
    handleSubmit: n,
    passAuth: o,
    phoneInputRef: m,
    recaptchaHostRef: l,
    rrnDigitInputRef: h,
    shouldShowPhoneField: S,
    shouldShowRecaptcha: g
  } = I();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { className: "readonly", id: "passNameDisplay", readOnly: !0, type: "text", value: o.name }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-reg-group", children: [
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum1", maxLength: 6, onChange: s, placeholder: "생년월일 6자리", type: "text", value: o.birthSix }),
      /* @__PURE__ */ a.jsx("span", { className: "dash", children: "-" }),
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum2", maxLength: 1, onChange: i, ref: h, type: "text", value: o.rrnDigit }),
      /* @__PURE__ */ a.jsx("span", { className: "dots", children: "●●●●●●" })
    ] }),
    S ? /* @__PURE__ */ a.jsx("div", { className: "pass-input-group phone-input-group visible", id: "phoneInputGroup", children: /* @__PURE__ */ a.jsx(
      "input",
      {
        id: "passPhoneInput",
        maxLength: 13,
        onChange: r,
        placeholder: "휴대폰 번호",
        ref: m,
        type: "text",
        value: o.phone
      }
    ) }) : null,
    g ? /* @__PURE__ */ a.jsx("div", { className: "captcha-wrapper visible", id: "captchaWrapper", children: /* @__PURE__ */ a.jsx("div", { id: "recaptchaContainer", ref: l }) }) : null,
    o.recaptchaStatus === "success" ? /* @__PURE__ */ a.jsx("div", { className: "pass-inline-meta success", children: "보안문자 확인 완료 상태" }) : null,
    /* @__PURE__ */ a.jsx(E, { message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", disabled: !t, id: "btnPassSubmitAuth", onClick: () => void n(), type: "button", children: "확인" })
  ] });
}, ze = Object.freeze([
  { iconClassName: "fa-solid fa-signal", label: "통신사" },
  { label: "인증수단" },
  { label: "이름" },
  { label: "입력" },
  { label: "확인" }
]), Je = Object.freeze([
  { label: "SKT", value: "SKT" },
  { label: "KT", value: "KT" },
  { label: "LG U+", value: "LG U+" },
  { isMuted: !0, label: `SKT
알뜰폰`, value: "SKT 알뜰폰" },
  { isMuted: !0, label: `KT
알뜰폰`, value: "KT 알뜰폰" },
  { isMuted: !0, label: `LG U+
알뜰폰`, value: "LG U+ 알뜰폰" }
]), We = [
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
], qe = () => {
  const { handleSelectMethod: t } = I();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "authmethod-list", children: We.map((e) => /* @__PURE__ */ a.jsx("button", { className: "authmethod-btn", onClick: () => t(e.value), type: "button", children: /* @__PURE__ */ a.jsxs("div", { className: "method-info", children: [
    /* @__PURE__ */ a.jsx("strong", { children: e.title }),
    /* @__PURE__ */ a.jsx("span", { children: e.description })
  ] }) }, e.value)) }) });
}, Ye = () => {
  const { errorMessage: t, goToIdentityStep: e, handleNameChange: s, passAuth: r } = I();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { id: "passNameInput", onChange: s, placeholder: "이름", type: "text", value: r.name }) }),
    /* @__PURE__ */ a.jsx(E, { message: t, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", onClick: e, type: "button", children: "다음" })
  ] });
}, Ze = () => {
  const { handleSelectTelecom: t } = I();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "telecom-grid", children: Je.map((e) => /* @__PURE__ */ a.jsx(
    "button",
    {
      className: `telecom-btn ${e.isMuted ? "mvno" : ""}`.trim(),
      onClick: () => t(e.value),
      type: "button",
      children: e.label.split(`
`).map((s) => /* @__PURE__ */ a.jsx("span", { children: s }, s))
    },
    e.value
  )) }) });
}, Xe = () => /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsxs("div", { className: "pass-confirm-ui", children: [
  /* @__PURE__ */ a.jsx("div", { className: "pass-loader pass-loader-lg" }),
  /* @__PURE__ */ a.jsx("div", { className: "pass-title-center", children: /* @__PURE__ */ a.jsx("strong", { children: "인증 진행 중 상태" }) }),
  /* @__PURE__ */ a.jsx("div", { className: "pass-subtitle", children: "잠시만 기다리면 회원가입 창으로 결과 전달 예정 상태" })
] }) }), Qe = (t, e, s) => t === 1 ? "이용 중인 통신사를 선택해 주세요" : t === 2 ? "인증 방법을 선택해 주세요" : t === 3 ? "이름을 입력해 주세요" : e ? s ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", es = () => {
  const { passAuth: t } = k(), e = t.birthSix.length === 6 && /^[1-8]$/.test(t.rrnDigit), s = e && t.phone.replace(/\D/g, "").length === 11;
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-modal-content", children: [
    /* @__PURE__ */ a.jsx(Fe, {}),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-header", children: [
      /* @__PURE__ */ a.jsx("div", { className: "pass-logo-red", children: "PASS" }),
      /* @__PURE__ */ a.jsxs("div", { className: "pass-header-text", children: [
        "인증부터 본인확인까지",
        /* @__PURE__ */ a.jsx("br", {}),
        "일상으로 PASS"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(
      ne,
      {
        accent: "red",
        currentStep: t.step,
        steps: ze,
        title: Qe(t.step, e, s)
      }
    ),
    t.step === 1 ? /* @__PURE__ */ a.jsx(Ze, {}) : null,
    t.step === 2 ? /* @__PURE__ */ a.jsx(qe, {}) : null,
    t.step === 3 ? /* @__PURE__ */ a.jsx(Ye, {}) : null,
    t.step === 4 ? /* @__PURE__ */ a.jsx(Ge, {}) : null,
    t.step === 5 ? /* @__PURE__ */ a.jsx(Xe, {}) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "pass-footer", children: [
      "이용약관 ",
      /* @__PURE__ */ a.jsx("strong", { children: "개인정보처리방침" }),
      /* @__PURE__ */ a.jsx("br", {}),
      "VeriSign 256-bit SSL 암호화 적용 상태"
    ] })
  ] });
}, ys = () => /* @__PURE__ */ a.jsx($, { children: /* @__PURE__ */ a.jsx(es, {}) }), ss = async (t) => {
  const e = await fetch(`${v}/api/auth/verify`, {
    body: new URLSearchParams({
      action: "checkId",
      id: _(t.trim())
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), s = await e.json().catch(() => ({}));
  return !e.ok || s.success === !1 ? {
    available: !1,
    message: typeof s.message == "string" && s.message ? s.message : "이미 사용 중인 아이디 상태"
  } : {
    available: !0,
    message: typeof s.message == "string" && s.message ? s.message : "사용 가능한 아이디 상태"
  };
}, ts = async (t) => {
  const e = new URLSearchParams();
  Object.entries(t).forEach(([i, n]) => {
    e.append(i, _(n));
  });
  const s = await fetch(`${v}/api/auth/signup`, {
    body: e,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), r = await s.json().catch(() => ({}));
  if (!s.ok || r.success === !1) {
    const i = typeof r.message == "string" && r.message ? r.message : `회원가입 처리 실패 상태 (${s.status})`;
    throw new Error(i);
  }
  return r;
}, as = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]{8,}$/, rs = /[!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]/, ns = (t) => t ? as.test(t) ? rs.test(t) ? {
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
}, is = (t, e) => e ? t === e ? {
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
}, X = /^[A-Za-z0-9]{4,20}$/, Q = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, H = () => {
  const { errors: t, signup: e } = k(), s = P(), r = c.useMemo(() => e.terms.service && e.terms.privacy, [e.terms.privacy, e.terms.service]), i = c.useMemo(() => e.terms.service && e.terms.privacy && e.terms.marketing, [e.terms.marketing, e.terms.privacy, e.terms.service]), n = c.useMemo(() => {
    const u = e.identity.isVerified && e.identity.provider === "PASS" && !!e.identity.birthDate && !!e.identity.rrnBackFirstDigit, d = e.account.idCheckStatus === "success" && e.account.idCheckedValue === e.account.userId.trim(), N = e.account.passwordStrength === "medium" || e.account.passwordStrength === "strong", T = e.account.passwordConfirmFeedback.tone === "success", U = Q.test(e.account.email.trim());
    return u && d && N && T && U && !e.account.submitting;
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
  ]), o = c.useCallback(
    (u, d) => {
      const N = ns(u), T = is(u, d);
      s.patchSignupAccount({
        password: u,
        passwordConfirm: d,
        passwordConfirmFeedback: T.feedback,
        passwordFeedback: N.feedback,
        passwordStrength: N.strength
      });
    },
    [s]
  ), m = c.useCallback(
    (u) => {
      s.patchSignupTerms({
        marketing: u.target.checked,
        privacy: u.target.checked,
        service: u.target.checked
      });
    },
    [s]
  ), l = c.useCallback(
    (u) => (d) => {
      s.patchSignupTerms({ [u]: d.target.checked });
    },
    [s]
  ), h = c.useCallback(() => {
    r && (s.setSignupStep(2), s.resetError("signup"));
  }, [s, r]), S = c.useCallback(() => {
    if (!$e()) {
      s.setError("signup", "팝업 차단 해제 필요 상태"), s.setStatus("error");
      return;
    }
    s.setStatus("verifying"), s.setError("signup", "PASS 인증 완료 후 자동 이동 예정 상태");
  }, [s]), g = c.useCallback(
    async (u) => {
      s.setStatus("verifying"), s.resetError("signup");
      const d = await Te(u);
      if (d.success && d.data) {
        s.patchSignupIdentity({
          gender: d.data.gender,
          isVerified: !0,
          name: d.data.name,
          phone: d.data.phone,
          provider: d.data.provider
        }), s.completeSignup(d.data.name || "회원"), s.setStatus("success");
        return;
      }
      if (d.pending) {
        s.setError("signup", "소셜 인증 팝업 진행 중 상태");
        return;
      }
      s.setStatus("error"), s.setError("signup", d.message || "소셜 인증 실패 상태");
    },
    [s]
  ), f = c.useCallback(
    (u) => {
      s.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "",
          tone: "idle"
        },
        idCheckStatus: "idle",
        userId: u.target.value
      }), s.resetError("signup");
    },
    [s]
  ), C = c.useCallback(
    (u) => {
      s.patchSignupAccount({ email: u.target.value }), s.resetError("signup");
    },
    [s]
  ), b = c.useCallback(
    (u) => {
      o(u.target.value, e.account.passwordConfirm), s.resetError("signup");
    },
    [s, e.account.passwordConfirm, o]
  ), j = c.useCallback(
    (u) => {
      o(e.account.password, u.target.value), s.resetError("signup");
    },
    [s, e.account.password, o]
  ), R = c.useCallback(async () => {
    const u = e.account.userId.trim();
    if (!X.test(u)) {
      s.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "영문과 숫자 4자 이상 20자 이하 필요 상태",
          tone: "error"
        },
        idCheckStatus: "error"
      });
      return;
    }
    s.patchSignupAccount({
      idFeedback: {
        message: "확인 중 상태",
        tone: "info"
      },
      idCheckStatus: "loading"
    });
    const d = await ss(u);
    s.patchSignupAccount({
      idCheckedValue: d.available ? u : "",
      idFeedback: {
        message: d.message,
        tone: d.available ? "success" : "error"
      },
      idCheckStatus: d.available ? "success" : "error"
    });
  }, [s, e.account.userId]), M = c.useCallback(
    async (u) => {
      if (u.preventDefault(), !e.identity.isVerified || e.identity.provider !== "PASS") {
        s.setError("signup", "PASS 인증 완료 후 가입 진행 가능 상태");
        return;
      }
      if (!X.test(e.account.userId.trim())) {
        s.setError("signup", "아이디 형식 재확인 필요 상태");
        return;
      }
      if (!Q.test(e.account.email.trim())) {
        s.setError("signup", "이메일 형식 재확인 필요 상태");
        return;
      }
      if (!n) {
        s.setError("signup", "입력값 점검 필요 상태");
        return;
      }
      try {
        s.patchSignupAccount({ submitting: !0 }), s.resetError("signup"), s.setStatus("submitting"), await ts({
          birthDate: e.identity.birthDate,
          email: e.account.email.trim(),
          gender: e.identity.gender,
          id: e.account.userId.trim(),
          name: e.identity.name.trim(),
          phone: e.identity.phone.trim(),
          provider: e.identity.provider || "PASS",
          pw: e.account.password.trim(),
          rrnBackFirstDigit: e.identity.rrnBackFirstDigit
        }), s.completeSignup(e.identity.name || "회원"), s.setStatus("success");
      } catch (d) {
        s.setStatus("error"), s.setError("signup", d instanceof Error ? d.message : "회원가입 처리 실패 상태");
      } finally {
        s.patchSignupAccount({ submitting: !1 });
      }
    },
    [s, n, e.account.email, e.account.password, e.account.userId, e.identity]
  );
  return {
    allTermsChecked: i,
    canSubmit: n,
    errorMessage: t.signup,
    goToVerificationStep: h,
    handleCheckId: R,
    handleEmailChange: C,
    handleOpenPassAuth: S,
    handlePasswordChange: b,
    handlePasswordConfirmChange: j,
    handleSocialSignup: g,
    handleSubmit: M,
    handleToggleAllTerms: m,
    handleToggleTerm: l,
    handleUserIdChange: f,
    requiredTermsChecked: r,
    signup: e
  };
}, cs = (t) => t === "loading" ? "확인 중" : t === "success" ? "확인 완료" : "중복확인", os = () => {
  const {
    canSubmit: t,
    errorMessage: e,
    handleCheckId: s,
    handleEmailChange: r,
    handlePasswordChange: i,
    handlePasswordConfirmChange: n,
    handleSubmit: o,
    handleUserIdChange: m,
    signup: l
  } = H();
  return /* @__PURE__ */ a.jsxs("form", { className: "step-panel active", onSubmit: o, children: [
    /* @__PURE__ */ a.jsx(
      x,
      {
        id: "userName",
        label: "이름",
        onChange: () => {
        },
        placeholder: "",
        readOnly: !0,
        value: l.identity.name
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        id: "verifiedPhone",
        label: "휴대전화번호",
        onChange: () => {
        },
        placeholder: "",
        readOnly: !0,
        value: l.identity.phone
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        feedback: l.account.idFeedback.message,
        feedbackTone: l.account.idFeedback.tone,
        id: "userId",
        label: "아이디",
        onChange: m,
        placeholder: "영문과 숫자 4~20자",
        rightSlot: /* @__PURE__ */ a.jsx("button", { className: "btn-secondary btn-verify", disabled: l.account.idCheckStatus === "loading", onClick: () => void s(), type: "button", children: cs(l.account.idCheckStatus) }),
        value: l.account.userId
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        feedback: l.account.passwordFeedback.message,
        feedbackTone: l.account.passwordFeedback.tone,
        id: "password",
        label: "비밀번호",
        onChange: i,
        placeholder: "영문과 숫자 조합 8자 이상",
        type: "password",
        value: l.account.password
      }
    ),
    l.account.passwordStrength !== "hidden" ? /* @__PURE__ */ a.jsxs("div", { className: `password-strength-container strength-${l.account.passwordStrength}`, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "password-strength-meter", children: [
        /* @__PURE__ */ a.jsx("div", { className: "meter-bar", id: "meterBar1" }),
        /* @__PURE__ */ a.jsx("div", { className: "meter-bar", id: "meterBar2" }),
        /* @__PURE__ */ a.jsx("div", { className: "meter-bar", id: "meterBar3" })
      ] }),
      /* @__PURE__ */ a.jsx("span", { className: "strength-text", id: "strengthText", children: l.account.passwordStrength === "strong" ? "안전" : l.account.passwordStrength === "medium" ? "보통" : "불가" })
    ] }) : null,
    /* @__PURE__ */ a.jsx(
      x,
      {
        feedback: l.account.passwordConfirmFeedback.message,
        feedbackTone: l.account.passwordConfirmFeedback.tone,
        id: "passwordConfirm",
        label: "비밀번호 확인",
        onChange: n,
        placeholder: "비밀번호 다시 입력",
        type: "password",
        value: l.account.passwordConfirm
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        id: "userEmail",
        label: "이메일",
        onChange: r,
        placeholder: "example@email.com",
        type: "email",
        value: l.account.email
      }
    ),
    l.identity.telecom ? /* @__PURE__ */ a.jsxs("div", { className: "auth-summary-chip", children: [
      "PASS 인증 완료",
      /* @__PURE__ */ a.jsx("span", { children: l.identity.telecom })
    ] }) : null,
    /* @__PURE__ */ a.jsx(E, { className: "signup-submit-feedback", message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-primary", disabled: !t, id: "btnSignupSubmit", type: "submit", children: l.account.submitting ? "가입 처리 중" : "가입 완료" }) })
  ] });
}, ls = () => {
  const t = P();
  return c.useEffect(() => {
    const e = (s) => {
      s.origin !== window.location.origin || !Ve(s.data) || (t.patchSignupIdentity({
        authMethod: s.data.payload.authMethod,
        birthDate: s.data.payload.birthDate,
        gender: s.data.payload.gender,
        isVerified: !0,
        name: s.data.payload.name,
        phone: s.data.payload.phone,
        provider: s.data.payload.provider,
        rrnBackFirstDigit: s.data.payload.rrnBackFirstDigit,
        telecom: s.data.payload.telecom
      }), t.setSignupStep(3), t.resetError("signup"), t.setStatus("verified"));
    };
    return window.addEventListener("message", e), () => {
      window.removeEventListener("message", e);
    };
  }, [t]), null;
}, us = () => {
  const { signup: t } = k();
  return /* @__PURE__ */ a.jsx("div", { className: "step-panel active", children: /* @__PURE__ */ a.jsxs("div", { className: "success-content", children: [
    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-check success-icon" }),
    /* @__PURE__ */ a.jsxs("h2", { className: "success-title", children: [
      t.completedName || "회원",
      " 가입 완료 상태"
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "success-desc", children: "제주그룹 계정 생성이 완료된 상태" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("a", { className: "btn-primary route-link", "data-route": "AUTH.LOGIN", href: "#", children: "로그인 페이지로 이동" }) })
  ] }) });
}, ds = Object.freeze([
  { iconClassName: "fa-solid fa-plane", label: "약관동의" },
  { label: "본인인증" },
  { label: "정보입력" },
  { label: "가입완료" }
]), hs = [
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
], ps = () => {
  const { allTermsChecked: t, goToVerificationStep: e, handleToggleAllTerms: s, handleToggleTerm: r, requiredTermsChecked: i, signup: n } = H();
  return /* @__PURE__ */ a.jsxs("div", { className: "step-panel active", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "agree_box flat-agree-box", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "check-all-wrapper", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "custom-chk check-all", children: [
          /* @__PURE__ */ a.jsx("input", { checked: t, className: "hidden-chk", id: "termAll", onChange: s, type: "checkbox" }),
          /* @__PURE__ */ a.jsx("span", { className: "chk-mark" }),
          /* @__PURE__ */ a.jsx("span", { children: "전체 동의" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "agree-desc", children: [
          "전체동의에는 필수와 선택 동의가 포함되고 개별 선택도 가능한 상태",
          /* @__PURE__ */ a.jsx("br", {}),
          "선택 항목과 무관하게 정상 서비스 이용은 가능한 상태"
        ] })
      ] }),
      hs.map((o) => /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsxs("label", { className: `custom-chk ${o.required ? "" : "opt-chk"}`.trim(), children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              checked: n.terms[o.key],
              className: "hidden-chk",
              onChange: r(o.key),
              type: "checkbox"
            }
          ),
          /* @__PURE__ */ a.jsx("span", { className: "chk-mark" }),
          o.label,
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-right arrow-right" })
        ] }),
        o.description ? /* @__PURE__ */ a.jsx("div", { className: "opt-desc", children: o.description }) : null
      ] }, o.key))
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions flat-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-flat", disabled: !i, onClick: e, type: "button", children: "다음" }) })
  ] });
}, ms = () => {
  const { errorMessage: t, handleOpenPassAuth: e, handleSocialSignup: s } = H();
  return /* @__PURE__ */ a.jsxs("div", { className: "step-panel active", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "auth-methods", children: [
      /* @__PURE__ */ a.jsxs("button", { className: "auth-btn kakao", onClick: () => void s("kakao"), type: "button", children: [
        /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-comment" }),
        "카카오로 간편 가입"
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "auth-btn naver", onClick: () => void s("naver"), type: "button", children: [
        /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-n", style: { fontWeight: 900 } }),
        "네이버로 간편 가입"
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "auth-btn pass", onClick: e, type: "button", children: [
        /* @__PURE__ */ a.jsx("div", { className: "pass-logo-text", children: "PASS" }),
        "휴대전화 본인 인증"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "auth-method-note", children: "실가입 데이터 연동은 PASS 경로 기준 상태" }),
    /* @__PURE__ */ a.jsx(E, { className: "auth-feedback", message: t, tone: t.includes("완료") ? "info" : "error" })
  ] });
}, gs = (t) => t === 1 ? "약관동의" : t === 2 ? "본인인증" : t === 3 ? "정보입력" : "가입완료", fs = () => {
  const { signup: t } = k();
  return /* @__PURE__ */ a.jsxs("section", { className: "signup-container", children: [
    /* @__PURE__ */ a.jsx(ls, {}),
    /* @__PURE__ */ a.jsx(ne, { currentStep: t.step, steps: ds, title: gs(t.step) }),
    /* @__PURE__ */ a.jsxs("div", { className: "user_form", children: [
      t.step === 1 ? /* @__PURE__ */ a.jsx(ps, {}) : null,
      t.step === 2 ? /* @__PURE__ */ a.jsx(ms, {}) : null,
      t.step === 3 ? /* @__PURE__ */ a.jsx(os, {}) : null,
      t.step === 4 ? /* @__PURE__ */ a.jsx(us, {}) : null
    ] })
  ] });
}, xs = () => /* @__PURE__ */ a.jsx($, { children: /* @__PURE__ */ a.jsx(fs, {}) });
export {
  ws as L,
  ys as P,
  xs as S
};
