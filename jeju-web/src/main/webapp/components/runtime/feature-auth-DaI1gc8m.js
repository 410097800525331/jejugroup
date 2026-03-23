import { j as a, a as c } from "./react-vendor-BoSfm_Te.js";
import { v as J, b as oe, s as Y, d as _, A as C, h as le, a as se, R as q } from "./legacy-core-C4kaoWaO.js";
const ue = ({ children: s, className: e = "" }) => /* @__PURE__ */ a.jsx("div", { className: ["user_box", "inner2", "login-card", e].filter(Boolean).join(" "), children: s }), de = (s) => s === "success" ? "success" : s === "warning" ? "warning" : s === "error" ? "error" : "", P = ({ className: s = "", id: e, message: t, tone: r = "idle" }) => {
  if (!t)
    return null;
  const i = ["input-feedback", de(r), s].filter(Boolean).join(" ");
  return /* @__PURE__ */ a.jsx("p", { className: i, id: e, children: t });
}, x = ({
  autoComplete: s,
  className: e,
  disabled: t,
  feedback: r,
  feedbackTone: o = "idle",
  id: i,
  inputMode: n,
  label: m,
  maxLength: l,
  onChange: S,
  placeholder: g,
  readOnly: p,
  rightSlot: y,
  type: N = "text",
  value: f
}) => {
  const j = /* @__PURE__ */ a.jsx(
    "input",
    {
      autoComplete: s,
      disabled: t,
      id: i,
      inputMode: n,
      maxLength: l,
      onChange: S,
      placeholder: g,
      readOnly: p,
      type: N,
      value: f
    }
  );
  return /* @__PURE__ */ a.jsxs("div", { className: ["input_group", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ a.jsx("label", { htmlFor: i, children: m }),
    y ? /* @__PURE__ */ a.jsxs("div", { className: "input-with-button", children: [
      j,
      y
    ] }) : j,
    r ? /* @__PURE__ */ a.jsx(P, { message: r, tone: o }) : null
  ] });
}, he = "test", pe = "1234", me = "/pages/auth/", Z = (s) => {
  if (!s || typeof window > "u" || s.startsWith("javascript:") || s.startsWith("data:"))
    return null;
  try {
    const e = new URL(s, window.location.href), t = new URL(window.location.href);
    return e.origin !== t.origin || e.pathname.includes(me) || e.href === t.href ? null : e.toString();
  } catch {
    return null;
  }
}, ge = (s) => Object.freeze({
  id: "local-test-user",
  loginId: s,
  name: "테스트 사용자",
  email: "test@local.jejugroup",
  role: "USER",
  roles: ["USER"],
  authSource: "LOCAL_LOGIN_OVERRIDE",
  isLocalTestAccount: !0
}), Se = async (s, e) => {
  if (!J(s) || !J(e))
    throw new Error("잘못된 입력 형식이 포함된 상태");
  if (oe() && s === he && e === pe)
    return Y(ge(s));
  const t = new URLSearchParams();
  t.append("id", _(s)), t.append("pw", _(e));
  const r = await fetch(`${C}/api/auth/login`, {
    body: t,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  if (!r.ok) {
    let i = "로그인에 실패한 상태";
    try {
      const n = await r.json();
      i = typeof n.message == "string" && n.message ? n.message : i;
    } catch {
    }
    throw new Error(i);
  }
  const o = await r.json();
  return Y(o.user);
}, fe = async (s) => {
  var i;
  const e = new URLSearchParams(window.location.search), t = Z(e.get("redirect")), r = Z(document.referrer);
  if (t) {
    window.location.replace(t);
    return;
  }
  if (r) {
    window.location.replace(r);
    return;
  }
  const o = le(s) ? "ADMIN.DASHBOARD" : "HOME";
  try {
    const n = se(o);
    if ((i = window.__JEJU_ROUTE_NAVIGATOR__) != null && i.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(n, "login-success");
      return;
    }
    window.location.replace(n);
  } catch {
    window.location.replace(o === "ADMIN.DASHBOARD" ? q.ADMIN.DASHBOARD : q.HOME);
  }
}, be = (s) => ({
  completeSignup: (e) => {
    s({
      payload: { completedName: e },
      type: "COMPLETE_SIGNUP"
    });
  },
  patchLogin: (e) => {
    s({
      payload: e,
      type: "PATCH_LOGIN"
    });
  },
  patchPassAuth: (e) => {
    s({
      payload: e,
      type: "PATCH_PASS_AUTH"
    });
  },
  patchSignupAccount: (e) => {
    s({
      payload: e,
      type: "PATCH_SIGNUP_ACCOUNT"
    });
  },
  patchSignupIdentity: (e) => {
    s({
      payload: e,
      type: "PATCH_SIGNUP_IDENTITY"
    });
  },
  patchSignupTerms: (e) => {
    s({
      payload: e,
      type: "PATCH_SIGNUP_TERMS"
    });
  },
  resetError: (e) => {
    s({
      payload: e,
      type: "RESET_ERROR"
    });
  },
  setError: (e, t) => {
    s({
      payload: { message: t, scope: e },
      type: "SET_ERROR"
    });
  },
  setPassAuthStep: (e) => {
    s({
      payload: e,
      type: "SET_PASS_AUTH_STEP"
    });
  },
  setSignupStep: (e) => {
    s({
      payload: e,
      type: "SET_SIGNUP_STEP"
    });
  },
  setStatus: (e) => {
    s({
      payload: e,
      type: "SET_STATUS"
    });
  }
}), L = () => ({
  message: "",
  tone: "idle"
}), ye = () => ({
  authMethod: "",
  birthDate: "",
  gender: "",
  isVerified: !1,
  name: "",
  phone: "",
  provider: "",
  rrnBackFirstDigit: "",
  telecom: ""
}), we = (s = "") => ({
  errors: {
    global: "",
    login: "",
    passAuth: "",
    signup: ""
  },
  login: {
    loginId: s,
    password: "",
    rememberId: s.length > 0,
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
      idFeedback: L(),
      idCheckStatus: "idle",
      password: "",
      passwordConfirm: "",
      passwordConfirmFeedback: L(),
      passwordFeedback: L(),
      passwordStrength: "hidden",
      submitting: !1,
      userId: ""
    },
    completedName: "",
    identity: ye(),
    step: 1,
    terms: {
      marketing: !1,
      privacy: !1,
      service: !1
    }
  },
  status: "idle"
}), xe = (s, e) => {
  switch (e.type) {
    case "SET_STATUS":
      return {
        ...s,
        status: e.payload
      };
    case "SET_ERROR":
      return {
        ...s,
        errors: {
          ...s.errors,
          [e.payload.scope]: e.payload.message
        }
      };
    case "RESET_ERROR":
      return {
        ...s,
        errors: {
          ...s.errors,
          [e.payload]: ""
        }
      };
    case "PATCH_LOGIN":
      return {
        ...s,
        login: {
          ...s.login,
          ...e.payload
        }
      };
    case "SET_SIGNUP_STEP":
      return {
        ...s,
        signup: {
          ...s.signup,
          step: e.payload
        }
      };
    case "PATCH_SIGNUP_TERMS":
      return {
        ...s,
        signup: {
          ...s.signup,
          terms: {
            ...s.signup.terms,
            ...e.payload
          }
        }
      };
    case "PATCH_SIGNUP_ACCOUNT":
      return {
        ...s,
        signup: {
          ...s.signup,
          account: {
            ...s.signup.account,
            ...e.payload
          }
        }
      };
    case "PATCH_SIGNUP_IDENTITY":
      return {
        ...s,
        signup: {
          ...s.signup,
          identity: {
            ...s.signup.identity,
            ...e.payload
          }
        }
      };
    case "COMPLETE_SIGNUP":
      return {
        ...s,
        signup: {
          ...s.signup,
          completedName: e.payload.completedName,
          step: 4
        }
      };
    case "PATCH_PASS_AUTH":
      return {
        ...s,
        passAuth: {
          ...s.passAuth,
          ...e.payload
        }
      };
    case "SET_PASS_AUTH_STEP":
      return {
        ...s,
        passAuth: {
          ...s.passAuth,
          step: e.payload
        }
      };
    default:
      return s;
  }
}, te = c.createContext(null), ae = c.createContext(null), $ = ({ children: s, savedLoginId: e = "" }) => {
  const [t, r] = c.useReducer(xe, e, we), o = c.useMemo(() => be(r), [r]);
  return /* @__PURE__ */ a.jsx(te.Provider, { value: t, children: /* @__PURE__ */ a.jsx(ae.Provider, { value: o, children: s }) });
}, v = () => {
  const s = c.useContext(te);
  if (!s)
    throw new Error("useAuthState must be used within AuthProvider");
  return s;
}, E = () => {
  const s = c.useContext(ae);
  if (!s)
    throw new Error("useAuthActions must be used within AuthProvider");
  return s;
}, O = "jeju:login-id", Ae = () => {
  try {
    return localStorage.getItem(O) ?? "";
  } catch {
    return "";
  }
}, ve = () => {
  const { errors: s, login: e } = v(), t = E(), r = c.useMemo(() => e.submitting || e.loginId.trim().length === 0 || e.password.trim().length === 0, [e.loginId, e.password, e.submitting]);
  c.useEffect(() => {
    try {
      if (e.rememberId && e.loginId.trim()) {
        localStorage.setItem(O, e.loginId.trim());
        return;
      }
      localStorage.removeItem(O);
    } catch {
    }
  }, [e.loginId, e.rememberId]);
  const o = c.useCallback(
    (l) => {
      t.patchLogin({ loginId: l.target.value }), t.resetError("login");
    },
    [t]
  ), i = c.useCallback(
    (l) => {
      t.patchLogin({ password: l.target.value }), t.resetError("login");
    },
    [t]
  ), n = c.useCallback(
    (l) => {
      t.patchLogin({ rememberId: l.target.checked });
    },
    [t]
  ), m = c.useCallback(
    async (l) => {
      l.preventDefault();
      const S = e.loginId.trim(), g = e.password.trim();
      try {
        t.patchLogin({ submitting: !0 }), t.resetError("login"), t.setStatus("submitting");
        const p = await Se(S, g);
        t.setStatus("success"), await fe(p);
      } catch (p) {
        t.setStatus("error"), t.setError("login", p instanceof Error ? p.message : "로그인 처리 실패 상태");
      } finally {
        t.patchLogin({ submitting: !1 });
      }
    },
    [t, e.loginId, e.password]
  );
  return {
    errorMessage: s.login,
    handleIdChange: o,
    handlePasswordChange: i,
    handleRememberChange: n,
    handleSubmit: m,
    isDisabled: r,
    login: e
  };
}, je = () => {
  const { errorMessage: s, handleIdChange: e, handlePasswordChange: t, handleRememberChange: r, handleSubmit: o, isDisabled: i, login: n } = ve();
  return /* @__PURE__ */ a.jsxs(ue, { children: [
    /* @__PURE__ */ a.jsxs("div", { className: "login-header", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "login-title", children: "로그인" }),
      /* @__PURE__ */ a.jsx("p", { className: "login-desc", children: "포인트 적립에서 운임 할인까지 회원 전용 혜택을 받아보는 구간" })
    ] }),
    /* @__PURE__ */ a.jsxs("form", { className: "login-form", id: "user_form", onSubmit: o, children: [
      /* @__PURE__ */ a.jsx(
        x,
        {
          autoComplete: "username",
          id: "id",
          label: "이메일/아이디",
          onChange: e,
          placeholder: "아이디 또는 이메일 입력",
          value: n.loginId
        }
      ),
      /* @__PURE__ */ a.jsx(
        x,
        {
          autoComplete: "current-password",
          id: "pw",
          label: "비밀번호",
          onChange: t,
          placeholder: "비밀번호 입력",
          type: "password",
          value: n.password
        }
      ),
      /* @__PURE__ */ a.jsx("div", { className: "error-wrapper", id: "login-error-wrapper", style: { display: s ? "block" : "none" }, children: /* @__PURE__ */ a.jsx("p", { className: "error-msg", children: s }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "login_options", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "remember-me", children: [
          /* @__PURE__ */ a.jsx("input", { checked: n.rememberId, id: "saveId", onChange: r, type: "checkbox" }),
          /* @__PURE__ */ a.jsx("span", { children: "아이디 저장" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "nav-links", children: [
          /* @__PURE__ */ a.jsx("a", { href: "#", children: "아이디/비밀번호 찾기" }),
          /* @__PURE__ */ a.jsx("span", { className: "divider", children: "|" }),
          /* @__PURE__ */ a.jsx("a", { className: "route-link", "data-route": "AUTH.SIGNUP", href: "#", children: "회원가입" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("button", { className: "login-btn btn", "data-state": n.submitting ? "loading" : "idle", disabled: i, type: "submit", children: n.submitting ? "로그인 중" : "로그인" })
    ] })
  ] });
}, gs = () => {
  const s = c.useMemo(() => Ae(), []);
  return /* @__PURE__ */ a.jsx($, { savedLoginId: s, children: /* @__PURE__ */ a.jsx(je, {}) });
}, re = ({ accent: s = "orange", currentStep: e, description: t, steps: r, title: o }) => {
  const i = c.useMemo(() => r.length <= 1 ? "0%" : `${(e - 1) / (r.length - 1) * 100}%`, [e, r.length]);
  return /* @__PURE__ */ a.jsxs("header", { className: `step-header ${s === "red" ? "step-header-pass" : ""}`, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "step-header-text", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "step-title", children: o }),
      t ? /* @__PURE__ */ a.jsx("p", { className: "step-desc", children: t }) : null
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "step-indicator", "data-accent": s, children: [
      /* @__PURE__ */ a.jsx("div", { className: "progress-bg" }),
      /* @__PURE__ */ a.jsx("div", { className: "progress-bar", style: { width: i } }),
      /* @__PURE__ */ a.jsx("div", { className: "step-circles", children: r.map((n, m) => {
        const l = m + 1, S = l === e ? "active" : l < e ? "completed" : "";
        return /* @__PURE__ */ a.jsx(
          "div",
          {
            "aria-label": `${l}단계 ${n.label}`,
            className: `step-circle ${S}`.trim(),
            children: l === e && n.iconClassName ? /* @__PURE__ */ a.jsx("i", { className: n.iconClassName }) : null
          },
          n.label
        );
      }) })
    ] })
  ] });
}, X = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", ke = (s) => new Promise((e) => window.setTimeout(e, s)), Ce = async () => {
  try {
    const s = await fetch(`${C}/api/auth/verify`), e = await s.json().catch(() => ({}));
    return !s.ok || typeof e.siteKey != "string" || !e.siteKey.trim() ? X : e.siteKey;
  } catch {
    return X;
  }
}, Ne = async (s) => {
  try {
    const e = await fetch(`${C}/api/auth/verify`, {
      body: new URLSearchParams({
        action: "verifyRecaptcha",
        token: s
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }), t = await e.json().catch(() => ({}));
    return !e.ok || t.success === !1 ? {
      message: typeof t.message == "string" && t.message ? t.message : "보안문자 검증 실패 상태",
      success: !1
    } : {
      message: typeof t.message == "string" && t.message ? t.message : "보안문자 검증 완료 상태",
      success: !0
    };
  } catch {
    return {
      message: "보안문자 검증 응답 지연으로 임시 통과 처리 상태",
      success: !0
    };
  }
}, Te = async () => {
  await ke(3e3);
}, Pe = () => {
  const { passAuth: s } = v(), e = E();
  return c.useEffect(() => {
    let t = !0;
    return s.recaptchaSiteKey ? void 0 : ((async () => {
      const o = await Ce();
      t && e.patchPassAuth({ recaptchaSiteKey: o });
    })(), () => {
      t = !1;
    });
  }, [e, s.recaptchaSiteKey]), null;
}, ne = "JEJU_PASS_AUTH_SUCCESS", Ee = () => {
  const t = window.screenX + Math.max(0, (window.outerWidth - 430) / 2), r = window.screenY + Math.max(0, (window.outerHeight - 800) / 2), o = se("AUTH.PASS_AUTH");
  return window.open(
    o,
    "PASS_Auth_Popup",
    `width=430,height=800,left=${Math.round(t)},top=${Math.round(r)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
  );
}, _e = (s) => ({
  payload: s,
  source: "jeju-pass-auth",
  type: ne
}), Ie = (s) => {
  if (!s || typeof s != "object")
    return !1;
  const e = s;
  return e.type === ne && e.source === "jeju-pass-auth" && !!e.payload;
}, Re = (s) => !window.opener || window.opener.closed ? !1 : (window.opener.postMessage(_e(s), window.location.origin), !0), K = (s) => s.replace(/\D/g, ""), F = (s) => {
  const e = K(s).slice(0, 11);
  return e.length < 4 ? e : e.length < 8 ? `${e.slice(0, 3)}-${e.slice(3)}` : e.length === 10 ? `${e.slice(0, 3)}-${e.slice(3, 6)}-${e.slice(6)}` : `${e.slice(0, 3)}-${e.slice(3, 7)}-${e.slice(7)}`;
}, ce = (s) => /^\d{6}$/.test(s), Me = (s) => /^[1-8]$/.test(s), De = (s) => ce(s) ? `${s.slice(0, 2)}-${s.slice(2, 4)}-${s.slice(4, 6)}` : "", Le = (s) => s === "1" || s === "3" || s === "5" || s === "7" ? "M" : s === "2" || s === "4" || s === "6" || s === "8" ? "F" : "", I = () => {
  const { errors: s, passAuth: e } = v(), t = E(), r = c.useRef(null), o = c.useRef(null), i = c.useRef(null), n = c.useRef(null), m = c.useMemo(() => ce(e.birthSix), [e.birthSix]), l = c.useMemo(() => Me(e.rrnDigit), [e.rrnDigit]), S = c.useMemo(() => K(e.phone).length === 11, [e.phone]), g = m && l, p = g && S, y = p && e.recaptchaStatus === "success" && !e.submitting, N = c.useMemo(() => e.step === 1 ? "이용 중인 통신사를 선택해 주세요" : e.step === 2 ? "인증 방법을 선택해 주세요" : e.step === 3 ? "이름을 입력해 주세요" : g ? p ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", [e.step, g, p]), f = c.useCallback(() => {
    var h;
    i.current !== null && ((h = window.grecaptcha) != null && h.reset) && window.grecaptcha.reset(i.current), t.patchPassAuth({
      recaptchaStatus: "idle",
      recaptchaToken: ""
    }), t.resetError("passAuth");
  }, [t]);
  c.useEffect(() => {
    if (!p || !e.recaptchaSiteKey || i.current !== null)
      return;
    let h = 0, b = 0, w = !0;
    const V = () => {
      var B;
      return !w || !n.current || !((B = window.grecaptcha) != null && B.render) ? !1 : (i.current = window.grecaptcha.render(n.current, {
        callback: async (G) => {
          var z;
          t.patchPassAuth({
            recaptchaStatus: "loading",
            recaptchaToken: G
          }), t.setStatus("verifying");
          const W = await Ne(G);
          if (W.success) {
            t.patchPassAuth({ recaptchaStatus: "success" }), t.resetError("passAuth"), t.setStatus("verified");
            return;
          }
          t.patchPassAuth({
            recaptchaStatus: "error",
            recaptchaToken: ""
          }), t.setError("passAuth", W.message), t.setStatus("error"), i.current !== null && ((z = window.grecaptcha) != null && z.reset) && window.grecaptcha.reset(i.current);
        },
        sitekey: e.recaptchaSiteKey
      }), !0);
    };
    return V() || (h = window.setInterval(() => {
      V() && window.clearInterval(h);
    }, 200), b = window.setTimeout(() => {
      window.clearInterval(h);
    }, 4e3)), () => {
      w = !1, h && window.clearInterval(h), b && window.clearTimeout(b);
    };
  }, [t, e.recaptchaSiteKey, p]);
  const j = c.useCallback(
    (h) => {
      t.patchPassAuth({ telecom: h }), t.setPassAuthStep(2), t.resetError("passAuth");
    },
    [t]
  ), R = c.useCallback(
    (h) => {
      t.patchPassAuth({ authMethod: h }), t.setPassAuthStep(3), t.resetError("passAuth");
    },
    [t]
  ), M = c.useCallback(
    (h) => {
      t.patchPassAuth({ name: h.target.value }), t.resetError("passAuth");
    },
    [t]
  ), u = c.useCallback(() => {
    if (!e.name.trim()) {
      t.setError("passAuth", "이름 입력 필요 상태");
      return;
    }
    t.setPassAuthStep(4), t.resetError("passAuth");
  }, [t, e.name]), d = c.useCallback(
    (h) => {
      const b = K(h.target.value).slice(0, 6);
      t.patchPassAuth({ birthSix: b }), b.length === 6 && window.setTimeout(() => {
        var w;
        return (w = r.current) == null ? void 0 : w.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [t, e.recaptchaStatus, e.recaptchaToken, f]
  ), k = c.useCallback(
    (h) => {
      const b = h.target.value.replace(/[^1-8]/g, "").slice(0, 1);
      t.patchPassAuth({ rrnDigit: b }), b.length === 1 && window.setTimeout(() => {
        var w;
        return (w = o.current) == null ? void 0 : w.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [t, e.recaptchaStatus, e.recaptchaToken, f]
  ), T = c.useCallback(
    (h) => {
      t.patchPassAuth({ phone: F(h.target.value) }), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [t, e.recaptchaStatus, e.recaptchaToken, f]
  ), D = c.useCallback(async () => {
    if (!y) {
      t.setError("passAuth", "입력값 또는 보안문자 확인 필요 상태");
      return;
    }
    const h = {
      authMethod: e.authMethod,
      birthDate: De(e.birthSix),
      gender: Le(e.rrnDigit),
      name: e.name.trim(),
      phone: e.phone.trim(),
      provider: "PASS",
      rrnBackFirstDigit: e.rrnDigit,
      telecom: e.telecom
    };
    if (t.setPassAuthStep(5), t.patchPassAuth({ submitting: !0 }), t.resetError("passAuth"), t.setStatus("submitting"), await Te(), !Re(h)) {
      t.patchPassAuth({ submitting: !1 }), t.setPassAuthStep(4), t.setStatus("error"), t.setError("passAuth", "회원가입 창 연결 실패 상태");
      return;
    }
    t.setStatus("success"), window.close();
  }, [t, y, e.authMethod, e.birthSix, e.name, e.phone, e.rrnDigit, e.telecom]);
  return {
    canSubmit: y,
    errorMessage: s.passAuth,
    handleBirthChange: d,
    handleNameChange: M,
    handlePhoneChange: T,
    handleRrnChange: k,
    handleSelectMethod: R,
    handleSelectTelecom: j,
    handleSubmit: D,
    goToIdentityStep: u,
    passAuth: e,
    phoneInputRef: o,
    recaptchaHostRef: n,
    rrnDigitInputRef: r,
    shouldShowPhoneField: g,
    shouldShowRecaptcha: p,
    stepTitle: N
  };
}, Ue = () => {
  const {
    canSubmit: s,
    errorMessage: e,
    handleBirthChange: t,
    handlePhoneChange: r,
    handleRrnChange: o,
    handleSubmit: i,
    passAuth: n,
    phoneInputRef: m,
    recaptchaHostRef: l,
    rrnDigitInputRef: S,
    shouldShowPhoneField: g,
    shouldShowRecaptcha: p
  } = I();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { className: "readonly", id: "passNameDisplay", readOnly: !0, type: "text", value: n.name }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-reg-group", children: [
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum1", maxLength: 6, onChange: t, placeholder: "생년월일 6자리", type: "text", value: n.birthSix }),
      /* @__PURE__ */ a.jsx("span", { className: "dash", children: "-" }),
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum2", maxLength: 1, onChange: o, ref: S, type: "text", value: n.rrnDigit }),
      /* @__PURE__ */ a.jsx("span", { className: "dots", children: "●●●●●●" })
    ] }),
    g ? /* @__PURE__ */ a.jsx("div", { className: "pass-input-group phone-input-group visible", id: "phoneInputGroup", children: /* @__PURE__ */ a.jsx(
      "input",
      {
        id: "passPhoneInput",
        maxLength: 13,
        onChange: r,
        placeholder: "휴대폰 번호",
        ref: m,
        type: "text",
        value: n.phone
      }
    ) }) : null,
    p ? /* @__PURE__ */ a.jsx("div", { className: "captcha-wrapper visible", id: "captchaWrapper", children: /* @__PURE__ */ a.jsx("div", { id: "recaptchaContainer", ref: l }) }) : null,
    n.recaptchaStatus === "success" ? /* @__PURE__ */ a.jsx("div", { className: "pass-inline-meta success", children: "보안문자 확인 완료 상태" }) : null,
    /* @__PURE__ */ a.jsx(P, { message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", disabled: !s, id: "btnPassSubmitAuth", onClick: () => void i(), type: "button", children: "확인" })
  ] });
}, Oe = Object.freeze([
  { iconClassName: "fa-solid fa-signal", label: "통신사" },
  { label: "인증수단" },
  { label: "이름" },
  { label: "입력" },
  { label: "확인" }
]), Ke = Object.freeze([
  { label: "SKT", value: "SKT" },
  { label: "KT", value: "KT" },
  { label: "LG U+", value: "LG U+" },
  { isMuted: !0, label: `SKT
알뜰폰`, value: "SKT 알뜰폰" },
  { isMuted: !0, label: `KT
알뜰폰`, value: "KT 알뜰폰" },
  { isMuted: !0, label: `LG U+
알뜰폰`, value: "LG U+ 알뜰폰" }
]), Fe = [
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
], $e = () => {
  const { handleSelectMethod: s } = I();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "authmethod-list", children: Fe.map((e) => /* @__PURE__ */ a.jsx("button", { className: "authmethod-btn", onClick: () => s(e.value), type: "button", children: /* @__PURE__ */ a.jsxs("div", { className: "method-info", children: [
    /* @__PURE__ */ a.jsx("strong", { children: e.title }),
    /* @__PURE__ */ a.jsx("span", { children: e.description })
  ] }) }, e.value)) }) });
}, He = () => {
  const { errorMessage: s, goToIdentityStep: e, handleNameChange: t, passAuth: r } = I();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { id: "passNameInput", onChange: t, placeholder: "이름", type: "text", value: r.name }) }),
    /* @__PURE__ */ a.jsx(P, { message: s, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", onClick: e, type: "button", children: "다음" })
  ] });
}, Ve = () => {
  const { handleSelectTelecom: s } = I();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "telecom-grid", children: Ke.map((e) => /* @__PURE__ */ a.jsx(
    "button",
    {
      className: `telecom-btn ${e.isMuted ? "mvno" : ""}`.trim(),
      onClick: () => s(e.value),
      type: "button",
      children: e.label.split(`
`).map((t) => /* @__PURE__ */ a.jsx("span", { children: t }, t))
    },
    e.value
  )) }) });
}, Be = () => /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsxs("div", { className: "pass-confirm-ui", children: [
  /* @__PURE__ */ a.jsx("div", { className: "pass-loader pass-loader-lg" }),
  /* @__PURE__ */ a.jsx("div", { className: "pass-title-center", children: /* @__PURE__ */ a.jsx("strong", { children: "인증 진행 중 상태" }) }),
  /* @__PURE__ */ a.jsx("div", { className: "pass-subtitle", children: "잠시만 기다리면 회원가입 창으로 결과 전달 예정 상태" })
] }) }), Ge = (s, e, t) => s === 1 ? "이용 중인 통신사를 선택해 주세요" : s === 2 ? "인증 방법을 선택해 주세요" : s === 3 ? "이름을 입력해 주세요" : e ? t ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", We = () => {
  const { passAuth: s } = v(), e = s.birthSix.length === 6 && /^[1-8]$/.test(s.rrnDigit), t = e && s.phone.replace(/\D/g, "").length === 11;
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-modal-content", children: [
    /* @__PURE__ */ a.jsx(Pe, {}),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-header", children: [
      /* @__PURE__ */ a.jsx("div", { className: "pass-logo-red", children: "PASS" }),
      /* @__PURE__ */ a.jsxs("div", { className: "pass-header-text", children: [
        "인증부터 본인확인까지",
        /* @__PURE__ */ a.jsx("br", {}),
        "일상으로 PASS"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(
      re,
      {
        accent: "red",
        currentStep: s.step,
        steps: Oe,
        title: Ge(s.step, e, t)
      }
    ),
    s.step === 1 ? /* @__PURE__ */ a.jsx(Ve, {}) : null,
    s.step === 2 ? /* @__PURE__ */ a.jsx($e, {}) : null,
    s.step === 3 ? /* @__PURE__ */ a.jsx(He, {}) : null,
    s.step === 4 ? /* @__PURE__ */ a.jsx(Ue, {}) : null,
    s.step === 5 ? /* @__PURE__ */ a.jsx(Be, {}) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "pass-footer", children: [
      "이용약관 ",
      /* @__PURE__ */ a.jsx("strong", { children: "개인정보처리방침" }),
      /* @__PURE__ */ a.jsx("br", {}),
      "VeriSign 256-bit SSL 암호화 적용 상태"
    ] })
  ] });
}, Ss = () => /* @__PURE__ */ a.jsx($, { children: /* @__PURE__ */ a.jsx(We, {}) }), ze = async (s) => {
  const e = await fetch(`${C}/api/auth/verify`, {
    body: new URLSearchParams({
      action: "checkId",
      id: _(s.trim())
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), t = await e.json().catch(() => ({}));
  return !e.ok || t.success === !1 ? {
    available: !1,
    message: typeof t.message == "string" && t.message ? t.message : "이미 사용 중인 아이디 상태"
  } : {
    available: !0,
    message: typeof t.message == "string" && t.message ? t.message : "사용 가능한 아이디 상태"
  };
}, Je = async (s) => {
  const e = new URLSearchParams();
  Object.entries(s).forEach(([o, i]) => {
    e.append(o, _(i));
  });
  const t = await fetch(`${C}/api/auth/signup`, {
    body: e,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), r = await t.json().catch(() => ({}));
  if (!t.ok || r.success === !1) {
    const o = typeof r.message == "string" && r.message ? r.message : `회원가입 처리 실패 상태 (${t.status})`;
    throw new Error(o);
  }
  return r;
}, U = Object.freeze({
  KAKAO_JS_KEY: "",
  NAVER_CLIENT_ID: ""
});
let A = null;
const Ye = (s) => {
  const e = s && typeof s == "object" ? s.social ?? {} : {};
  return {
    KAKAO_JS_KEY: String(e.kakaoJsKey ?? "").trim(),
    NAVER_CLIENT_ID: String(e.naverClientId ?? "").trim()
  };
}, ie = async () => {
  if (A)
    return { ...A };
  try {
    const s = await fetch(`${C}/api/public/config`, {
      credentials: "same-origin",
      method: "GET"
    });
    if (!s.ok)
      return A = { ...U }, { ...A };
    const e = await s.json().catch(() => ({}));
    A = {
      ...U,
      ...Ye(e)
    };
  } catch {
    A = { ...U };
  }
  return { ...A };
}, qe = async () => {
  if (typeof Kakao > "u")
    return { message: "카카오 SDK 로드 실패 상태", ok: !1 };
  const s = await ie();
  return s.KAKAO_JS_KEY ? (Kakao.isInitialized() || Kakao.init(s.KAKAO_JS_KEY), { message: "", ok: !0 }) : { message: "카카오 JavaScript 키 누락 상태", ok: !1 };
}, Ze = () => new URL(window.location.pathname, window.location.origin).href, Xe = async (s) => {
  if (s === "kakao") {
    const t = await qe();
    return t.ok ? new Promise((r) => {
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
            success: (o) => {
              var n;
              const i = o.kakao_account ?? {};
              r({
                data: {
                  gender: i.gender === "male" ? "M" : "F",
                  name: i.name || ((n = o.properties) == null ? void 0 : n.nickname) || "회원",
                  phone: F(i.phone_number || "01000000000"),
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
      message: t.message,
      success: !1
    };
  }
  const e = await ie();
  return typeof naver > "u" || typeof naver.LoginWithNaverId > "u" ? {
    message: "네이버 SDK 로드 실패 상태",
    success: !1
  } : e.NAVER_CLIENT_ID ? new Promise((t) => {
    const r = "naverIdLogin";
    let o = document.getElementById(r);
    o || (o = document.createElement("div"), o.id = r, o.style.display = "none", document.body.appendChild(o));
    try {
      const i = new naver.LoginWithNaverId({
        callbackUrl: Ze(),
        clientId: e.NAVER_CLIENT_ID,
        isPopup: !0,
        loginButton: { color: "green", height: 60, type: 3 }
      });
      i.init(), i.getLoginStatus((n) => {
        if (n) {
          t({
            data: {
              gender: i.user.getGender() === "M" ? "M" : "F",
              name: i.user.getName() || "회원",
              phone: F(i.user.getMobile() || "01000000000"),
              provider: "NAVER"
            },
            success: !0
          });
          return;
        }
        i.authorize(), t({
          pending: !0,
          success: !1
        });
      });
    } catch {
      t({
        message: "네이버 로그인 초기화 실패 상태",
        success: !1
      });
    }
  }) : {
    message: "네이버 Client ID 누락 상태",
    success: !1
  };
}, Qe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]{8,}$/, es = /[!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]/, ss = (s) => s ? Qe.test(s) ? es.test(s) ? {
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
}, ts = (s, e) => e ? s === e ? {
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
}, Q = /^[A-Za-z0-9]{4,20}$/, ee = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, H = () => {
  const { errors: s, signup: e } = v(), t = E(), r = c.useMemo(() => e.terms.service && e.terms.privacy, [e.terms.privacy, e.terms.service]), o = c.useMemo(() => e.terms.service && e.terms.privacy && e.terms.marketing, [e.terms.marketing, e.terms.privacy, e.terms.service]), i = c.useMemo(() => {
    const u = e.identity.isVerified && e.identity.provider === "PASS" && !!e.identity.birthDate && !!e.identity.rrnBackFirstDigit, d = e.account.idCheckStatus === "success" && e.account.idCheckedValue === e.account.userId.trim(), k = e.account.passwordStrength === "medium" || e.account.passwordStrength === "strong", T = e.account.passwordConfirmFeedback.tone === "success", D = ee.test(e.account.email.trim());
    return u && d && k && T && D && !e.account.submitting;
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
  ]), n = c.useCallback(
    (u, d) => {
      const k = ss(u), T = ts(u, d);
      t.patchSignupAccount({
        password: u,
        passwordConfirm: d,
        passwordConfirmFeedback: T.feedback,
        passwordFeedback: k.feedback,
        passwordStrength: k.strength
      });
    },
    [t]
  ), m = c.useCallback(
    (u) => {
      t.patchSignupTerms({
        marketing: u.target.checked,
        privacy: u.target.checked,
        service: u.target.checked
      });
    },
    [t]
  ), l = c.useCallback(
    (u) => (d) => {
      t.patchSignupTerms({ [u]: d.target.checked });
    },
    [t]
  ), S = c.useCallback(() => {
    r && (t.setSignupStep(2), t.resetError("signup"));
  }, [t, r]), g = c.useCallback(() => {
    if (!Ee()) {
      t.setError("signup", "팝업 차단 해제 필요 상태"), t.setStatus("error");
      return;
    }
    t.setStatus("verifying"), t.setError("signup", "PASS 인증 완료 후 자동 이동 예정 상태");
  }, [t]), p = c.useCallback(
    async (u) => {
      t.setStatus("verifying"), t.resetError("signup");
      const d = await Xe(u);
      if (d.success && d.data) {
        t.patchSignupIdentity({
          gender: d.data.gender,
          isVerified: !0,
          name: d.data.name,
          phone: d.data.phone,
          provider: d.data.provider
        }), t.completeSignup(d.data.name || "회원"), t.setStatus("success");
        return;
      }
      if (d.pending) {
        t.setError("signup", "소셜 인증 팝업 진행 중 상태");
        return;
      }
      t.setStatus("error"), t.setError("signup", d.message || "소셜 인증 실패 상태");
    },
    [t]
  ), y = c.useCallback(
    (u) => {
      t.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "",
          tone: "idle"
        },
        idCheckStatus: "idle",
        userId: u.target.value
      }), t.resetError("signup");
    },
    [t]
  ), N = c.useCallback(
    (u) => {
      t.patchSignupAccount({ email: u.target.value }), t.resetError("signup");
    },
    [t]
  ), f = c.useCallback(
    (u) => {
      n(u.target.value, e.account.passwordConfirm), t.resetError("signup");
    },
    [t, e.account.passwordConfirm, n]
  ), j = c.useCallback(
    (u) => {
      n(e.account.password, u.target.value), t.resetError("signup");
    },
    [t, e.account.password, n]
  ), R = c.useCallback(async () => {
    const u = e.account.userId.trim();
    if (!Q.test(u)) {
      t.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "영문과 숫자 4자 이상 20자 이하 필요 상태",
          tone: "error"
        },
        idCheckStatus: "error"
      });
      return;
    }
    t.patchSignupAccount({
      idFeedback: {
        message: "확인 중 상태",
        tone: "info"
      },
      idCheckStatus: "loading"
    });
    const d = await ze(u);
    t.patchSignupAccount({
      idCheckedValue: d.available ? u : "",
      idFeedback: {
        message: d.message,
        tone: d.available ? "success" : "error"
      },
      idCheckStatus: d.available ? "success" : "error"
    });
  }, [t, e.account.userId]), M = c.useCallback(
    async (u) => {
      if (u.preventDefault(), !e.identity.isVerified || e.identity.provider !== "PASS") {
        t.setError("signup", "PASS 인증 완료 후 가입 진행 가능 상태");
        return;
      }
      if (!Q.test(e.account.userId.trim())) {
        t.setError("signup", "아이디 형식 재확인 필요 상태");
        return;
      }
      if (!ee.test(e.account.email.trim())) {
        t.setError("signup", "이메일 형식 재확인 필요 상태");
        return;
      }
      if (!i) {
        t.setError("signup", "입력값 점검 필요 상태");
        return;
      }
      try {
        t.patchSignupAccount({ submitting: !0 }), t.resetError("signup"), t.setStatus("submitting"), await Je({
          birthDate: e.identity.birthDate,
          email: e.account.email.trim(),
          gender: e.identity.gender,
          id: e.account.userId.trim(),
          name: e.identity.name.trim(),
          phone: e.identity.phone.trim(),
          provider: e.identity.provider || "PASS",
          pw: e.account.password.trim(),
          rrnBackFirstDigit: e.identity.rrnBackFirstDigit
        }), t.completeSignup(e.identity.name || "회원"), t.setStatus("success");
      } catch (d) {
        t.setStatus("error"), t.setError("signup", d instanceof Error ? d.message : "회원가입 처리 실패 상태");
      } finally {
        t.patchSignupAccount({ submitting: !1 });
      }
    },
    [t, i, e.account.email, e.account.password, e.account.userId, e.identity]
  );
  return {
    allTermsChecked: o,
    canSubmit: i,
    errorMessage: s.signup,
    goToVerificationStep: S,
    handleCheckId: R,
    handleEmailChange: N,
    handleOpenPassAuth: g,
    handlePasswordChange: f,
    handlePasswordConfirmChange: j,
    handleSocialSignup: p,
    handleSubmit: M,
    handleToggleAllTerms: m,
    handleToggleTerm: l,
    handleUserIdChange: y,
    requiredTermsChecked: r,
    signup: e
  };
}, as = (s) => s === "loading" ? "확인 중" : s === "success" ? "확인 완료" : "중복확인", rs = () => {
  const {
    canSubmit: s,
    errorMessage: e,
    handleCheckId: t,
    handleEmailChange: r,
    handlePasswordChange: o,
    handlePasswordConfirmChange: i,
    handleSubmit: n,
    handleUserIdChange: m,
    signup: l
  } = H();
  return /* @__PURE__ */ a.jsxs("form", { className: "step-panel active", onSubmit: n, children: [
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
        rightSlot: /* @__PURE__ */ a.jsx("button", { className: "btn-secondary btn-verify", disabled: l.account.idCheckStatus === "loading", onClick: () => void t(), type: "button", children: as(l.account.idCheckStatus) }),
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
        onChange: o,
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
        onChange: i,
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
    /* @__PURE__ */ a.jsx(P, { className: "signup-submit-feedback", message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-primary", disabled: !s, id: "btnSignupSubmit", type: "submit", children: l.account.submitting ? "가입 처리 중" : "가입 완료" }) })
  ] });
}, ns = () => {
  const s = E();
  return c.useEffect(() => {
    const e = (t) => {
      t.origin !== window.location.origin || !Ie(t.data) || (s.patchSignupIdentity({
        authMethod: t.data.payload.authMethod,
        birthDate: t.data.payload.birthDate,
        gender: t.data.payload.gender,
        isVerified: !0,
        name: t.data.payload.name,
        phone: t.data.payload.phone,
        provider: t.data.payload.provider,
        rrnBackFirstDigit: t.data.payload.rrnBackFirstDigit,
        telecom: t.data.payload.telecom
      }), s.setSignupStep(3), s.resetError("signup"), s.setStatus("verified"));
    };
    return window.addEventListener("message", e), () => {
      window.removeEventListener("message", e);
    };
  }, [s]), null;
}, cs = () => {
  const { signup: s } = v();
  return /* @__PURE__ */ a.jsx("div", { className: "step-panel active", children: /* @__PURE__ */ a.jsxs("div", { className: "success-content", children: [
    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-check success-icon" }),
    /* @__PURE__ */ a.jsxs("h2", { className: "success-title", children: [
      s.completedName || "회원",
      " 가입 완료 상태"
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "success-desc", children: "제주그룹 계정 생성이 완료된 상태" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("a", { className: "btn-primary route-link", "data-route": "AUTH.LOGIN", href: "#", children: "로그인 페이지로 이동" }) })
  ] }) });
}, is = Object.freeze([
  { iconClassName: "fa-solid fa-plane", label: "약관동의" },
  { label: "본인인증" },
  { label: "정보입력" },
  { label: "가입완료" }
]), os = [
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
], ls = () => {
  const { allTermsChecked: s, goToVerificationStep: e, handleToggleAllTerms: t, handleToggleTerm: r, requiredTermsChecked: o, signup: i } = H();
  return /* @__PURE__ */ a.jsxs("div", { className: "step-panel active", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "agree_box flat-agree-box", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "check-all-wrapper", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "custom-chk check-all", children: [
          /* @__PURE__ */ a.jsx("input", { checked: s, className: "hidden-chk", id: "termAll", onChange: t, type: "checkbox" }),
          /* @__PURE__ */ a.jsx("span", { className: "chk-mark" }),
          /* @__PURE__ */ a.jsx("span", { children: "전체 동의" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "agree-desc", children: [
          "전체동의에는 필수와 선택 동의가 포함되고 개별 선택도 가능한 상태",
          /* @__PURE__ */ a.jsx("br", {}),
          "선택 항목과 무관하게 정상 서비스 이용은 가능한 상태"
        ] })
      ] }),
      os.map((n) => /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsxs("label", { className: `custom-chk ${n.required ? "" : "opt-chk"}`.trim(), children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              checked: i.terms[n.key],
              className: "hidden-chk",
              onChange: r(n.key),
              type: "checkbox"
            }
          ),
          /* @__PURE__ */ a.jsx("span", { className: "chk-mark" }),
          n.label,
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-right arrow-right" })
        ] }),
        n.description ? /* @__PURE__ */ a.jsx("div", { className: "opt-desc", children: n.description }) : null
      ] }, n.key))
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions flat-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-flat", disabled: !o, onClick: e, type: "button", children: "다음" }) })
  ] });
}, us = () => {
  const { errorMessage: s, handleOpenPassAuth: e, handleSocialSignup: t } = H();
  return /* @__PURE__ */ a.jsxs("div", { className: "step-panel active", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "auth-methods", children: [
      /* @__PURE__ */ a.jsxs("button", { className: "auth-btn kakao", onClick: () => void t("kakao"), type: "button", children: [
        /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-comment" }),
        "카카오로 간편 가입"
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "auth-btn naver", onClick: () => void t("naver"), type: "button", children: [
        /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-n", style: { fontWeight: 900 } }),
        "네이버로 간편 가입"
      ] }),
      /* @__PURE__ */ a.jsxs("button", { className: "auth-btn pass", onClick: e, type: "button", children: [
        /* @__PURE__ */ a.jsx("div", { className: "pass-logo-text", children: "PASS" }),
        "휴대전화 본인 인증"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "auth-method-note", children: "실가입 데이터 연동은 PASS 경로 기준 상태" }),
    /* @__PURE__ */ a.jsx(P, { className: "auth-feedback", message: s, tone: s.includes("완료") ? "info" : "error" })
  ] });
}, ds = (s) => s === 1 ? "약관동의" : s === 2 ? "본인인증" : s === 3 ? "정보입력" : "가입완료", hs = () => {
  const { signup: s } = v();
  return /* @__PURE__ */ a.jsxs("section", { className: "signup-container", children: [
    /* @__PURE__ */ a.jsx(ns, {}),
    /* @__PURE__ */ a.jsx(re, { currentStep: s.step, steps: is, title: ds(s.step) }),
    /* @__PURE__ */ a.jsxs("div", { className: "user_form", children: [
      s.step === 1 ? /* @__PURE__ */ a.jsx(ls, {}) : null,
      s.step === 2 ? /* @__PURE__ */ a.jsx(us, {}) : null,
      s.step === 3 ? /* @__PURE__ */ a.jsx(rs, {}) : null,
      s.step === 4 ? /* @__PURE__ */ a.jsx(cs, {}) : null
    ] })
  ] });
}, fs = () => /* @__PURE__ */ a.jsx($, { children: /* @__PURE__ */ a.jsx(hs, {}) });
export {
  gs as L,
  Ss as P,
  fs as S
};
