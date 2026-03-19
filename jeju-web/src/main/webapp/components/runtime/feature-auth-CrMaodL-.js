import { j as a, a as i } from "./react-vendor-BoSfm_Te.js";
import { v as z, s as I, A as C, b as ce, h as ie, a as Q, R as Y } from "./legacy-core-0fkWHL1L.js";
const oe = ({ children: t, className: e = "" }) => /* @__PURE__ */ a.jsx("div", { className: ["user_box", "inner2", "login-card", e].filter(Boolean).join(" "), children: t }), le = (t) => t === "success" ? "success" : t === "warning" ? "warning" : t === "error" ? "error" : "", P = ({ className: t = "", id: e, message: s, tone: r = "idle" }) => {
  if (!s)
    return null;
  const n = ["input-feedback", le(r), t].filter(Boolean).join(" ");
  return /* @__PURE__ */ a.jsx("p", { className: n, id: e, children: s });
}, x = ({
  autoComplete: t,
  className: e,
  disabled: s,
  feedback: r,
  feedbackTone: o = "idle",
  id: n,
  inputMode: c,
  label: m,
  maxLength: l,
  onChange: S,
  placeholder: g,
  readOnly: p,
  rightSlot: y,
  type: N = "text",
  value: f
}) => {
  const k = /* @__PURE__ */ a.jsx(
    "input",
    {
      autoComplete: t,
      disabled: s,
      id: n,
      inputMode: c,
      maxLength: l,
      onChange: S,
      placeholder: g,
      readOnly: p,
      type: N,
      value: f
    }
  );
  return /* @__PURE__ */ a.jsxs("div", { className: ["input_group", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ a.jsx("label", { htmlFor: n, children: m }),
    y ? /* @__PURE__ */ a.jsxs("div", { className: "input-with-button", children: [
      k,
      y
    ] }) : k,
    r ? /* @__PURE__ */ a.jsx(P, { message: r, tone: o }) : null
  ] });
}, ue = async (t, e) => {
  if (!z(t) || !z(e))
    throw new Error("잘못된 입력 형식이 포함된 상태");
  const s = new URLSearchParams();
  s.append("id", I(t)), s.append("pw", I(e));
  const r = await fetch(`${C}/api/auth/login`, {
    body: s,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  if (!r.ok) {
    let n = "로그인에 실패한 상태";
    try {
      const c = await r.json();
      n = typeof c.message == "string" && c.message ? c.message : n;
    } catch {
    }
    throw new Error(n);
  }
  const o = await r.json();
  return ce(o.user);
}, de = async (t) => {
  var o;
  const s = new URLSearchParams(window.location.search).get("redirect");
  if (s && !s.startsWith("javascript:") && !s.startsWith("data:")) {
    window.location.replace(s);
    return;
  }
  const r = ie(t) ? "ADMIN.DASHBOARD" : "HOME";
  try {
    const n = Q(r);
    if ((o = window.__JEJU_ROUTE_NAVIGATOR__) != null && o.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(n, "login-success");
      return;
    }
    window.location.replace(n);
  } catch {
    window.location.replace(r === "ADMIN.DASHBOARD" ? Y.ADMIN.DASHBOARD : Y.HOME);
  }
}, he = (t) => ({
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
}), U = () => ({
  message: "",
  tone: "idle"
}), pe = () => ({
  authMethod: "",
  birthDate: "",
  gender: "",
  isVerified: !1,
  name: "",
  phone: "",
  provider: "",
  rrnBackFirstDigit: "",
  telecom: ""
}), me = (t = "") => ({
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
      idFeedback: U(),
      idCheckStatus: "idle",
      password: "",
      passwordConfirm: "",
      passwordConfirmFeedback: U(),
      passwordFeedback: U(),
      passwordStrength: "hidden",
      submitting: !1,
      userId: ""
    },
    completedName: "",
    identity: pe(),
    step: 1,
    terms: {
      marketing: !1,
      privacy: !1,
      service: !1
    }
  },
  status: "idle"
}), ge = (t, e) => {
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
}, ee = i.createContext(null), se = i.createContext(null), $ = ({ children: t, savedLoginId: e = "" }) => {
  const [s, r] = i.useReducer(ge, e, me), o = i.useMemo(() => he(r), [r]);
  return /* @__PURE__ */ a.jsx(ee.Provider, { value: s, children: /* @__PURE__ */ a.jsx(se.Provider, { value: o, children: t }) });
}, v = () => {
  const t = i.useContext(ee);
  if (!t)
    throw new Error("useAuthState must be used within AuthProvider");
  return t;
}, E = () => {
  const t = i.useContext(se);
  if (!t)
    throw new Error("useAuthActions must be used within AuthProvider");
  return t;
}, O = "jeju:login-id", Se = () => {
  try {
    return localStorage.getItem(O) ?? "";
  } catch {
    return "";
  }
}, fe = () => {
  const { errors: t, login: e } = v(), s = E(), r = i.useMemo(() => e.submitting || e.loginId.trim().length === 0 || e.password.trim().length === 0, [e.loginId, e.password, e.submitting]);
  i.useEffect(() => {
    try {
      if (e.rememberId && e.loginId.trim()) {
        localStorage.setItem(O, e.loginId.trim());
        return;
      }
      localStorage.removeItem(O);
    } catch {
    }
  }, [e.loginId, e.rememberId]);
  const o = i.useCallback(
    (l) => {
      s.patchLogin({ loginId: l.target.value }), s.resetError("login");
    },
    [s]
  ), n = i.useCallback(
    (l) => {
      s.patchLogin({ password: l.target.value }), s.resetError("login");
    },
    [s]
  ), c = i.useCallback(
    (l) => {
      s.patchLogin({ rememberId: l.target.checked });
    },
    [s]
  ), m = i.useCallback(
    async (l) => {
      l.preventDefault();
      const S = e.loginId.trim(), g = e.password.trim();
      try {
        s.patchLogin({ submitting: !0 }), s.resetError("login"), s.setStatus("submitting");
        const p = await ue(S, g);
        s.setStatus("success"), await de(p);
      } catch (p) {
        s.setStatus("error"), s.setError("login", p instanceof Error ? p.message : "로그인 처리 실패 상태");
      } finally {
        s.patchLogin({ submitting: !1 });
      }
    },
    [s, e.loginId, e.password]
  );
  return {
    errorMessage: t.login,
    handleIdChange: o,
    handlePasswordChange: n,
    handleRememberChange: c,
    handleSubmit: m,
    isDisabled: r,
    login: e
  };
}, be = () => {
  const { errorMessage: t, handleIdChange: e, handlePasswordChange: s, handleRememberChange: r, handleSubmit: o, isDisabled: n, login: c } = fe();
  return /* @__PURE__ */ a.jsxs(oe, { children: [
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
          value: c.loginId
        }
      ),
      /* @__PURE__ */ a.jsx(
        x,
        {
          autoComplete: "current-password",
          id: "pw",
          label: "비밀번호",
          onChange: s,
          placeholder: "비밀번호 입력",
          type: "password",
          value: c.password
        }
      ),
      /* @__PURE__ */ a.jsx("div", { className: "error-wrapper", id: "login-error-wrapper", style: { display: t ? "block" : "none" }, children: /* @__PURE__ */ a.jsx("p", { className: "error-msg", children: t }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "login_options", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "remember-me", children: [
          /* @__PURE__ */ a.jsx("input", { checked: c.rememberId, id: "saveId", onChange: r, type: "checkbox" }),
          /* @__PURE__ */ a.jsx("span", { children: "아이디 저장" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "nav-links", children: [
          /* @__PURE__ */ a.jsx("a", { href: "#", children: "아이디/비밀번호 찾기" }),
          /* @__PURE__ */ a.jsx("span", { className: "divider", children: "|" }),
          /* @__PURE__ */ a.jsx("a", { className: "route-link", "data-route": "AUTH.SIGNUP", href: "#", children: "회원가입" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("button", { className: "login-btn btn", "data-state": c.submitting ? "loading" : "idle", disabled: n, type: "submit", children: c.submitting ? "로그인 중" : "로그인" })
    ] })
  ] });
}, ls = () => {
  const t = i.useMemo(() => Se(), []);
  return /* @__PURE__ */ a.jsx($, { savedLoginId: t, children: /* @__PURE__ */ a.jsx(be, {}) });
}, te = ({ accent: t = "orange", currentStep: e, description: s, steps: r, title: o }) => {
  const n = i.useMemo(() => r.length <= 1 ? "0%" : `${(e - 1) / (r.length - 1) * 100}%`, [e, r.length]);
  return /* @__PURE__ */ a.jsxs("header", { className: `step-header ${t === "red" ? "step-header-pass" : ""}`, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "step-header-text", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "step-title", children: o }),
      s ? /* @__PURE__ */ a.jsx("p", { className: "step-desc", children: s }) : null
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "step-indicator", "data-accent": t, children: [
      /* @__PURE__ */ a.jsx("div", { className: "progress-bg" }),
      /* @__PURE__ */ a.jsx("div", { className: "progress-bar", style: { width: n } }),
      /* @__PURE__ */ a.jsx("div", { className: "step-circles", children: r.map((c, m) => {
        const l = m + 1, S = l === e ? "active" : l < e ? "completed" : "";
        return /* @__PURE__ */ a.jsx(
          "div",
          {
            "aria-label": `${l}단계 ${c.label}`,
            className: `step-circle ${S}`.trim(),
            children: l === e && c.iconClassName ? /* @__PURE__ */ a.jsx("i", { className: c.iconClassName }) : null
          },
          c.label
        );
      }) })
    ] })
  ] });
}, q = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", ye = (t) => new Promise((e) => window.setTimeout(e, t)), we = async () => {
  try {
    const t = await fetch(`${C}/api/auth/verify`), e = await t.json().catch(() => ({}));
    return !t.ok || typeof e.siteKey != "string" || !e.siteKey.trim() ? q : e.siteKey;
  } catch {
    return q;
  }
}, xe = async (t) => {
  try {
    const e = await fetch(`${C}/api/auth/verify`, {
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
}, Ae = async () => {
  await ye(3e3);
}, ve = () => {
  const { passAuth: t } = v(), e = E();
  return i.useEffect(() => {
    let s = !0;
    return t.recaptchaSiteKey ? void 0 : ((async () => {
      const o = await we();
      s && e.patchPassAuth({ recaptchaSiteKey: o });
    })(), () => {
      s = !1;
    });
  }, [e, t.recaptchaSiteKey]), null;
}, ae = "JEJU_PASS_AUTH_SUCCESS", ke = () => {
  const s = window.screenX + Math.max(0, (window.outerWidth - 430) / 2), r = window.screenY + Math.max(0, (window.outerHeight - 800) / 2), o = Q("AUTH.PASS_AUTH");
  return window.open(
    o,
    "PASS_Auth_Popup",
    `width=430,height=800,left=${Math.round(s)},top=${Math.round(r)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
  );
}, je = (t) => ({
  payload: t,
  source: "jeju-pass-auth",
  type: ae
}), Ce = (t) => {
  if (!t || typeof t != "object")
    return !1;
  const e = t;
  return e.type === ae && e.source === "jeju-pass-auth" && !!e.payload;
}, Ne = (t) => !window.opener || window.opener.closed ? !1 : (window.opener.postMessage(je(t), window.location.origin), !0), K = (t) => t.replace(/\D/g, ""), F = (t) => {
  const e = K(t).slice(0, 11);
  return e.length < 4 ? e : e.length < 8 ? `${e.slice(0, 3)}-${e.slice(3)}` : e.length === 10 ? `${e.slice(0, 3)}-${e.slice(3, 6)}-${e.slice(6)}` : `${e.slice(0, 3)}-${e.slice(3, 7)}-${e.slice(7)}`;
}, re = (t) => /^\d{6}$/.test(t), Te = (t) => /^[1-8]$/.test(t), Pe = (t) => re(t) ? `${t.slice(0, 2)}-${t.slice(2, 4)}-${t.slice(4, 6)}` : "", Ee = (t) => t === "1" || t === "3" || t === "5" || t === "7" ? "M" : t === "2" || t === "4" || t === "6" || t === "8" ? "F" : "", _ = () => {
  const { errors: t, passAuth: e } = v(), s = E(), r = i.useRef(null), o = i.useRef(null), n = i.useRef(null), c = i.useRef(null), m = i.useMemo(() => re(e.birthSix), [e.birthSix]), l = i.useMemo(() => Te(e.rrnDigit), [e.rrnDigit]), S = i.useMemo(() => K(e.phone).length === 11, [e.phone]), g = m && l, p = g && S, y = p && e.recaptchaStatus === "success" && !e.submitting, N = i.useMemo(() => e.step === 1 ? "이용 중인 통신사를 선택해 주세요" : e.step === 2 ? "인증 방법을 선택해 주세요" : e.step === 3 ? "이름을 입력해 주세요" : g ? p ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", [e.step, g, p]), f = i.useCallback(() => {
    var h;
    n.current !== null && ((h = window.grecaptcha) != null && h.reset) && window.grecaptcha.reset(n.current), s.patchPassAuth({
      recaptchaStatus: "idle",
      recaptchaToken: ""
    }), s.resetError("passAuth");
  }, [s]);
  i.useEffect(() => {
    if (!p || !e.recaptchaSiteKey || n.current !== null)
      return;
    let h = 0, b = 0, w = !0;
    const V = () => {
      var B;
      return !w || !c.current || !((B = window.grecaptcha) != null && B.render) ? !1 : (n.current = window.grecaptcha.render(c.current, {
        callback: async (G) => {
          var W;
          s.patchPassAuth({
            recaptchaStatus: "loading",
            recaptchaToken: G
          }), s.setStatus("verifying");
          const J = await xe(G);
          if (J.success) {
            s.patchPassAuth({ recaptchaStatus: "success" }), s.resetError("passAuth"), s.setStatus("verified");
            return;
          }
          s.patchPassAuth({
            recaptchaStatus: "error",
            recaptchaToken: ""
          }), s.setError("passAuth", J.message), s.setStatus("error"), n.current !== null && ((W = window.grecaptcha) != null && W.reset) && window.grecaptcha.reset(n.current);
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
  }, [s, e.recaptchaSiteKey, p]);
  const k = i.useCallback(
    (h) => {
      s.patchPassAuth({ telecom: h }), s.setPassAuthStep(2), s.resetError("passAuth");
    },
    [s]
  ), R = i.useCallback(
    (h) => {
      s.patchPassAuth({ authMethod: h }), s.setPassAuthStep(3), s.resetError("passAuth");
    },
    [s]
  ), M = i.useCallback(
    (h) => {
      s.patchPassAuth({ name: h.target.value }), s.resetError("passAuth");
    },
    [s]
  ), u = i.useCallback(() => {
    if (!e.name.trim()) {
      s.setError("passAuth", "이름 입력 필요 상태");
      return;
    }
    s.setPassAuthStep(4), s.resetError("passAuth");
  }, [s, e.name]), d = i.useCallback(
    (h) => {
      const b = K(h.target.value).slice(0, 6);
      s.patchPassAuth({ birthSix: b }), b.length === 6 && window.setTimeout(() => {
        var w;
        return (w = r.current) == null ? void 0 : w.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [s, e.recaptchaStatus, e.recaptchaToken, f]
  ), j = i.useCallback(
    (h) => {
      const b = h.target.value.replace(/[^1-8]/g, "").slice(0, 1);
      s.patchPassAuth({ rrnDigit: b }), b.length === 1 && window.setTimeout(() => {
        var w;
        return (w = o.current) == null ? void 0 : w.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [s, e.recaptchaStatus, e.recaptchaToken, f]
  ), T = i.useCallback(
    (h) => {
      s.patchPassAuth({ phone: F(h.target.value) }), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [s, e.recaptchaStatus, e.recaptchaToken, f]
  ), D = i.useCallback(async () => {
    if (!y) {
      s.setError("passAuth", "입력값 또는 보안문자 확인 필요 상태");
      return;
    }
    const h = {
      authMethod: e.authMethod,
      birthDate: Pe(e.birthSix),
      gender: Ee(e.rrnDigit),
      name: e.name.trim(),
      phone: e.phone.trim(),
      provider: "PASS",
      rrnBackFirstDigit: e.rrnDigit,
      telecom: e.telecom
    };
    if (s.setPassAuthStep(5), s.patchPassAuth({ submitting: !0 }), s.resetError("passAuth"), s.setStatus("submitting"), await Ae(), !Ne(h)) {
      s.patchPassAuth({ submitting: !1 }), s.setPassAuthStep(4), s.setStatus("error"), s.setError("passAuth", "회원가입 창 연결 실패 상태");
      return;
    }
    s.setStatus("success"), window.close();
  }, [s, y, e.authMethod, e.birthSix, e.name, e.phone, e.rrnDigit, e.telecom]);
  return {
    canSubmit: y,
    errorMessage: t.passAuth,
    handleBirthChange: d,
    handleNameChange: M,
    handlePhoneChange: T,
    handleRrnChange: j,
    handleSelectMethod: R,
    handleSelectTelecom: k,
    handleSubmit: D,
    goToIdentityStep: u,
    passAuth: e,
    phoneInputRef: o,
    recaptchaHostRef: c,
    rrnDigitInputRef: r,
    shouldShowPhoneField: g,
    shouldShowRecaptcha: p,
    stepTitle: N
  };
}, Ie = () => {
  const {
    canSubmit: t,
    errorMessage: e,
    handleBirthChange: s,
    handlePhoneChange: r,
    handleRrnChange: o,
    handleSubmit: n,
    passAuth: c,
    phoneInputRef: m,
    recaptchaHostRef: l,
    rrnDigitInputRef: S,
    shouldShowPhoneField: g,
    shouldShowRecaptcha: p
  } = _();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { className: "readonly", id: "passNameDisplay", readOnly: !0, type: "text", value: c.name }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-reg-group", children: [
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum1", maxLength: 6, onChange: s, placeholder: "생년월일 6자리", type: "text", value: c.birthSix }),
      /* @__PURE__ */ a.jsx("span", { className: "dash", children: "-" }),
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum2", maxLength: 1, onChange: o, ref: S, type: "text", value: c.rrnDigit }),
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
        value: c.phone
      }
    ) }) : null,
    p ? /* @__PURE__ */ a.jsx("div", { className: "captcha-wrapper visible", id: "captchaWrapper", children: /* @__PURE__ */ a.jsx("div", { id: "recaptchaContainer", ref: l }) }) : null,
    c.recaptchaStatus === "success" ? /* @__PURE__ */ a.jsx("div", { className: "pass-inline-meta success", children: "보안문자 확인 완료 상태" }) : null,
    /* @__PURE__ */ a.jsx(P, { message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", disabled: !t, id: "btnPassSubmitAuth", onClick: () => void n(), type: "button", children: "확인" })
  ] });
}, _e = Object.freeze([
  { iconClassName: "fa-solid fa-signal", label: "통신사" },
  { label: "인증수단" },
  { label: "이름" },
  { label: "입력" },
  { label: "확인" }
]), Re = Object.freeze([
  { label: "SKT", value: "SKT" },
  { label: "KT", value: "KT" },
  { label: "LG U+", value: "LG U+" },
  { isMuted: !0, label: `SKT
알뜰폰`, value: "SKT 알뜰폰" },
  { isMuted: !0, label: `KT
알뜰폰`, value: "KT 알뜰폰" },
  { isMuted: !0, label: `LG U+
알뜰폰`, value: "LG U+ 알뜰폰" }
]), Me = [
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
], De = () => {
  const { handleSelectMethod: t } = _();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "authmethod-list", children: Me.map((e) => /* @__PURE__ */ a.jsx("button", { className: "authmethod-btn", onClick: () => t(e.value), type: "button", children: /* @__PURE__ */ a.jsxs("div", { className: "method-info", children: [
    /* @__PURE__ */ a.jsx("strong", { children: e.title }),
    /* @__PURE__ */ a.jsx("span", { children: e.description })
  ] }) }, e.value)) }) });
}, Ue = () => {
  const { errorMessage: t, goToIdentityStep: e, handleNameChange: s, passAuth: r } = _();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { id: "passNameInput", onChange: s, placeholder: "이름", type: "text", value: r.name }) }),
    /* @__PURE__ */ a.jsx(P, { message: t, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", onClick: e, type: "button", children: "다음" })
  ] });
}, Le = () => {
  const { handleSelectTelecom: t } = _();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "telecom-grid", children: Re.map((e) => /* @__PURE__ */ a.jsx(
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
}, Oe = () => /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsxs("div", { className: "pass-confirm-ui", children: [
  /* @__PURE__ */ a.jsx("div", { className: "pass-loader pass-loader-lg" }),
  /* @__PURE__ */ a.jsx("div", { className: "pass-title-center", children: /* @__PURE__ */ a.jsx("strong", { children: "인증 진행 중 상태" }) }),
  /* @__PURE__ */ a.jsx("div", { className: "pass-subtitle", children: "잠시만 기다리면 회원가입 창으로 결과 전달 예정 상태" })
] }) }), Ke = (t, e, s) => t === 1 ? "이용 중인 통신사를 선택해 주세요" : t === 2 ? "인증 방법을 선택해 주세요" : t === 3 ? "이름을 입력해 주세요" : e ? s ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", Fe = () => {
  const { passAuth: t } = v(), e = t.birthSix.length === 6 && /^[1-8]$/.test(t.rrnDigit), s = e && t.phone.replace(/\D/g, "").length === 11;
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-modal-content", children: [
    /* @__PURE__ */ a.jsx(ve, {}),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-header", children: [
      /* @__PURE__ */ a.jsx("div", { className: "pass-logo-red", children: "PASS" }),
      /* @__PURE__ */ a.jsxs("div", { className: "pass-header-text", children: [
        "인증부터 본인확인까지",
        /* @__PURE__ */ a.jsx("br", {}),
        "일상으로 PASS"
      ] })
    ] }),
    /* @__PURE__ */ a.jsx(
      te,
      {
        accent: "red",
        currentStep: t.step,
        steps: _e,
        title: Ke(t.step, e, s)
      }
    ),
    t.step === 1 ? /* @__PURE__ */ a.jsx(Le, {}) : null,
    t.step === 2 ? /* @__PURE__ */ a.jsx(De, {}) : null,
    t.step === 3 ? /* @__PURE__ */ a.jsx(Ue, {}) : null,
    t.step === 4 ? /* @__PURE__ */ a.jsx(Ie, {}) : null,
    t.step === 5 ? /* @__PURE__ */ a.jsx(Oe, {}) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "pass-footer", children: [
      "이용약관 ",
      /* @__PURE__ */ a.jsx("strong", { children: "개인정보처리방침" }),
      /* @__PURE__ */ a.jsx("br", {}),
      "VeriSign 256-bit SSL 암호화 적용 상태"
    ] })
  ] });
}, us = () => /* @__PURE__ */ a.jsx($, { children: /* @__PURE__ */ a.jsx(Fe, {}) }), $e = async (t) => {
  const e = await fetch(`${C}/api/auth/verify`, {
    body: new URLSearchParams({
      action: "checkId",
      id: I(t.trim())
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
}, He = async (t) => {
  const e = new URLSearchParams();
  Object.entries(t).forEach(([o, n]) => {
    e.append(o, I(n));
  });
  const s = await fetch(`${C}/api/auth/signup`, {
    body: e,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), r = await s.json().catch(() => ({}));
  if (!s.ok || r.success === !1) {
    const o = typeof r.message == "string" && r.message ? r.message : `회원가입 처리 실패 상태 (${s.status})`;
    throw new Error(o);
  }
  return r;
}, L = Object.freeze({
  KAKAO_JS_KEY: "",
  NAVER_CLIENT_ID: ""
});
let A = null;
const Ve = (t) => {
  const e = t && typeof t == "object" ? t.social ?? {} : {};
  return {
    KAKAO_JS_KEY: String(e.kakaoJsKey ?? "").trim(),
    NAVER_CLIENT_ID: String(e.naverClientId ?? "").trim()
  };
}, ne = async () => {
  if (A)
    return { ...A };
  try {
    const t = await fetch(`${C}/api/public/config`, {
      credentials: "same-origin",
      method: "GET"
    });
    if (!t.ok)
      return A = { ...L }, { ...A };
    const e = await t.json().catch(() => ({}));
    A = {
      ...L,
      ...Ve(e)
    };
  } catch {
    A = { ...L };
  }
  return { ...A };
}, Be = async () => {
  if (typeof Kakao > "u")
    return { message: "카카오 SDK 로드 실패 상태", ok: !1 };
  const t = await ne();
  return t.KAKAO_JS_KEY ? (Kakao.isInitialized() || Kakao.init(t.KAKAO_JS_KEY), { message: "", ok: !0 }) : { message: "카카오 JavaScript 키 누락 상태", ok: !1 };
}, Ge = () => new URL(window.location.pathname, window.location.origin).href, Je = async (t) => {
  if (t === "kakao") {
    const s = await Be();
    return s.ok ? new Promise((r) => {
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
              var c;
              const n = o.kakao_account ?? {};
              r({
                data: {
                  gender: n.gender === "male" ? "M" : "F",
                  name: n.name || ((c = o.properties) == null ? void 0 : c.nickname) || "회원",
                  phone: F(n.phone_number || "01000000000"),
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
  const e = await ne();
  return typeof naver > "u" || typeof naver.LoginWithNaverId > "u" ? {
    message: "네이버 SDK 로드 실패 상태",
    success: !1
  } : e.NAVER_CLIENT_ID ? new Promise((s) => {
    const r = "naverIdLogin";
    let o = document.getElementById(r);
    o || (o = document.createElement("div"), o.id = r, o.style.display = "none", document.body.appendChild(o));
    try {
      const n = new naver.LoginWithNaverId({
        callbackUrl: Ge(),
        clientId: e.NAVER_CLIENT_ID,
        isPopup: !0,
        loginButton: { color: "green", height: 60, type: 3 }
      });
      n.init(), n.getLoginStatus((c) => {
        if (c) {
          s({
            data: {
              gender: n.user.getGender() === "M" ? "M" : "F",
              name: n.user.getName() || "회원",
              phone: F(n.user.getMobile() || "01000000000"),
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
}, We = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]{8,}$/, ze = /[!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]/, Ye = (t) => t ? We.test(t) ? ze.test(t) ? {
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
}, qe = (t, e) => e ? t === e ? {
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
}, Z = /^[A-Za-z0-9]{4,20}$/, X = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, H = () => {
  const { errors: t, signup: e } = v(), s = E(), r = i.useMemo(() => e.terms.service && e.terms.privacy, [e.terms.privacy, e.terms.service]), o = i.useMemo(() => e.terms.service && e.terms.privacy && e.terms.marketing, [e.terms.marketing, e.terms.privacy, e.terms.service]), n = i.useMemo(() => {
    const u = e.identity.isVerified && e.identity.provider === "PASS" && !!e.identity.birthDate && !!e.identity.rrnBackFirstDigit, d = e.account.idCheckStatus === "success" && e.account.idCheckedValue === e.account.userId.trim(), j = e.account.passwordStrength === "medium" || e.account.passwordStrength === "strong", T = e.account.passwordConfirmFeedback.tone === "success", D = X.test(e.account.email.trim());
    return u && d && j && T && D && !e.account.submitting;
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
  ]), c = i.useCallback(
    (u, d) => {
      const j = Ye(u), T = qe(u, d);
      s.patchSignupAccount({
        password: u,
        passwordConfirm: d,
        passwordConfirmFeedback: T.feedback,
        passwordFeedback: j.feedback,
        passwordStrength: j.strength
      });
    },
    [s]
  ), m = i.useCallback(
    (u) => {
      s.patchSignupTerms({
        marketing: u.target.checked,
        privacy: u.target.checked,
        service: u.target.checked
      });
    },
    [s]
  ), l = i.useCallback(
    (u) => (d) => {
      s.patchSignupTerms({ [u]: d.target.checked });
    },
    [s]
  ), S = i.useCallback(() => {
    r && (s.setSignupStep(2), s.resetError("signup"));
  }, [s, r]), g = i.useCallback(() => {
    if (!ke()) {
      s.setError("signup", "팝업 차단 해제 필요 상태"), s.setStatus("error");
      return;
    }
    s.setStatus("verifying"), s.setError("signup", "PASS 인증 완료 후 자동 이동 예정 상태");
  }, [s]), p = i.useCallback(
    async (u) => {
      s.setStatus("verifying"), s.resetError("signup");
      const d = await Je(u);
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
  ), y = i.useCallback(
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
  ), N = i.useCallback(
    (u) => {
      s.patchSignupAccount({ email: u.target.value }), s.resetError("signup");
    },
    [s]
  ), f = i.useCallback(
    (u) => {
      c(u.target.value, e.account.passwordConfirm), s.resetError("signup");
    },
    [s, e.account.passwordConfirm, c]
  ), k = i.useCallback(
    (u) => {
      c(e.account.password, u.target.value), s.resetError("signup");
    },
    [s, e.account.password, c]
  ), R = i.useCallback(async () => {
    const u = e.account.userId.trim();
    if (!Z.test(u)) {
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
    const d = await $e(u);
    s.patchSignupAccount({
      idCheckedValue: d.available ? u : "",
      idFeedback: {
        message: d.message,
        tone: d.available ? "success" : "error"
      },
      idCheckStatus: d.available ? "success" : "error"
    });
  }, [s, e.account.userId]), M = i.useCallback(
    async (u) => {
      if (u.preventDefault(), !e.identity.isVerified || e.identity.provider !== "PASS") {
        s.setError("signup", "PASS 인증 완료 후 가입 진행 가능 상태");
        return;
      }
      if (!Z.test(e.account.userId.trim())) {
        s.setError("signup", "아이디 형식 재확인 필요 상태");
        return;
      }
      if (!X.test(e.account.email.trim())) {
        s.setError("signup", "이메일 형식 재확인 필요 상태");
        return;
      }
      if (!n) {
        s.setError("signup", "입력값 점검 필요 상태");
        return;
      }
      try {
        s.patchSignupAccount({ submitting: !0 }), s.resetError("signup"), s.setStatus("submitting"), await He({
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
    allTermsChecked: o,
    canSubmit: n,
    errorMessage: t.signup,
    goToVerificationStep: S,
    handleCheckId: R,
    handleEmailChange: N,
    handleOpenPassAuth: g,
    handlePasswordChange: f,
    handlePasswordConfirmChange: k,
    handleSocialSignup: p,
    handleSubmit: M,
    handleToggleAllTerms: m,
    handleToggleTerm: l,
    handleUserIdChange: y,
    requiredTermsChecked: r,
    signup: e
  };
}, Ze = (t) => t === "loading" ? "확인 중" : t === "success" ? "확인 완료" : "중복확인", Xe = () => {
  const {
    canSubmit: t,
    errorMessage: e,
    handleCheckId: s,
    handleEmailChange: r,
    handlePasswordChange: o,
    handlePasswordConfirmChange: n,
    handleSubmit: c,
    handleUserIdChange: m,
    signup: l
  } = H();
  return /* @__PURE__ */ a.jsxs("form", { className: "step-panel active", onSubmit: c, children: [
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
        rightSlot: /* @__PURE__ */ a.jsx("button", { className: "btn-secondary btn-verify", disabled: l.account.idCheckStatus === "loading", onClick: () => void s(), type: "button", children: Ze(l.account.idCheckStatus) }),
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
    /* @__PURE__ */ a.jsx(P, { className: "signup-submit-feedback", message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-primary", disabled: !t, id: "btnSignupSubmit", type: "submit", children: l.account.submitting ? "가입 처리 중" : "가입 완료" }) })
  ] });
}, Qe = () => {
  const t = E();
  return i.useEffect(() => {
    const e = (s) => {
      s.origin !== window.location.origin || !Ce(s.data) || (t.patchSignupIdentity({
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
}, es = () => {
  const { signup: t } = v();
  return /* @__PURE__ */ a.jsx("div", { className: "step-panel active", children: /* @__PURE__ */ a.jsxs("div", { className: "success-content", children: [
    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-check success-icon" }),
    /* @__PURE__ */ a.jsxs("h2", { className: "success-title", children: [
      t.completedName || "회원",
      " 가입 완료 상태"
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "success-desc", children: "제주그룹 계정 생성이 완료된 상태" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("a", { className: "btn-primary route-link", "data-route": "AUTH.LOGIN", href: "#", children: "로그인 페이지로 이동" }) })
  ] }) });
}, ss = Object.freeze([
  { iconClassName: "fa-solid fa-plane", label: "약관동의" },
  { label: "본인인증" },
  { label: "정보입력" },
  { label: "가입완료" }
]), ts = [
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
], as = () => {
  const { allTermsChecked: t, goToVerificationStep: e, handleToggleAllTerms: s, handleToggleTerm: r, requiredTermsChecked: o, signup: n } = H();
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
      ts.map((c) => /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsxs("label", { className: `custom-chk ${c.required ? "" : "opt-chk"}`.trim(), children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              checked: n.terms[c.key],
              className: "hidden-chk",
              onChange: r(c.key),
              type: "checkbox"
            }
          ),
          /* @__PURE__ */ a.jsx("span", { className: "chk-mark" }),
          c.label,
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-right arrow-right" })
        ] }),
        c.description ? /* @__PURE__ */ a.jsx("div", { className: "opt-desc", children: c.description }) : null
      ] }, c.key))
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions flat-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-flat", disabled: !o, onClick: e, type: "button", children: "다음" }) })
  ] });
}, rs = () => {
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
    /* @__PURE__ */ a.jsx(P, { className: "auth-feedback", message: t, tone: t.includes("완료") ? "info" : "error" })
  ] });
}, ns = (t) => t === 1 ? "약관동의" : t === 2 ? "본인인증" : t === 3 ? "정보입력" : "가입완료", cs = () => {
  const { signup: t } = v();
  return /* @__PURE__ */ a.jsxs("section", { className: "signup-container", children: [
    /* @__PURE__ */ a.jsx(Qe, {}),
    /* @__PURE__ */ a.jsx(te, { currentStep: t.step, steps: ss, title: ns(t.step) }),
    /* @__PURE__ */ a.jsxs("div", { className: "user_form", children: [
      t.step === 1 ? /* @__PURE__ */ a.jsx(as, {}) : null,
      t.step === 2 ? /* @__PURE__ */ a.jsx(rs, {}) : null,
      t.step === 3 ? /* @__PURE__ */ a.jsx(Xe, {}) : null,
      t.step === 4 ? /* @__PURE__ */ a.jsx(es, {}) : null
    ] })
  ] });
}, ds = () => /* @__PURE__ */ a.jsx($, { children: /* @__PURE__ */ a.jsx(cs, {}) });
export {
  ls as L,
  us as P,
  ds as S
};
