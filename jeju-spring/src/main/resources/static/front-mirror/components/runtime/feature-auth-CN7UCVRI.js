import { j as a, a as c } from "./react-vendor-BoSfm_Te.js";
import { v as J, b as oe, s as Y, d as _, A as C, h as le, a as se, R as q } from "./legacy-core-CEZP4aoH.js";
const ue = ({ children: s, className: e = "" }) => /* @__PURE__ */ a.jsx("div", { className: ["user_box", "inner2", "login-card", e].filter(Boolean).join(" "), children: s }), de = (s) => s === "success" ? "success" : s === "warning" ? "warning" : s === "error" ? "error" : "", P = ({ className: s = "", id: e, message: t, tone: n = "idle" }) => {
  if (!t)
    return null;
  const o = ["input-feedback", de(n), s].filter(Boolean).join(" ");
  return /* @__PURE__ */ a.jsx("p", { className: o, id: e, children: t });
}, x = ({
  autoComplete: s,
  className: e,
  disabled: t,
  feedback: n,
  feedbackTone: l = "idle",
  id: o,
  inputMode: i,
  label: m,
  maxLength: r,
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
      autoComplete: s,
      disabled: t,
      id: o,
      inputMode: i,
      maxLength: r,
      onChange: S,
      placeholder: g,
      readOnly: p,
      type: N,
      value: f
    }
  );
  return /* @__PURE__ */ a.jsxs("div", { className: ["input_group", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ a.jsx("label", { htmlFor: o, children: m }),
    y ? /* @__PURE__ */ a.jsxs("div", { className: "input-with-button", children: [
      k,
      y
    ] }) : k,
    n ? /* @__PURE__ */ a.jsx(P, { message: n, tone: l }) : null
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
  const n = await fetch(`${C}/api/auth/login`, {
    body: t,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  if (!n.ok) {
    let o = "로그인에 실패한 상태";
    try {
      const i = await n.json();
      o = typeof i.message == "string" && i.message ? i.message : o;
    } catch {
    }
    throw new Error(o);
  }
  const l = await n.json();
  return Y(l.user);
}, fe = async (s) => {
  var o;
  const e = new URLSearchParams(window.location.search), t = Z(e.get("redirect")), n = Z(document.referrer);
  if (t) {
    window.location.replace(t);
    return;
  }
  if (n) {
    window.location.replace(n);
    return;
  }
  const l = le(s) ? "ADMIN.DASHBOARD" : "HOME";
  try {
    const i = se(l);
    if ((o = window.__JEJU_ROUTE_NAVIGATOR__) != null && o.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(i, "login-success");
      return;
    }
    window.location.replace(i);
  } catch {
    window.location.replace(l === "ADMIN.DASHBOARD" ? q.ADMIN.DASHBOARD : q.HOME);
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
}, te = c.createContext(null), ae = c.createContext(null), V = ({ children: s, savedLoginId: e = "" }) => {
  const [t, n] = c.useReducer(xe, e, we), l = c.useMemo(() => be(n), [n]);
  return /* @__PURE__ */ a.jsx(te.Provider, { value: t, children: /* @__PURE__ */ a.jsx(ae.Provider, { value: l, children: s }) });
}, j = () => {
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
}, je = () => {
  const { errors: s, login: e } = j(), t = E(), n = c.useMemo(() => e.submitting || e.loginId.trim().length === 0 || e.password.trim().length === 0, [e.loginId, e.password, e.submitting]);
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
  const l = c.useCallback(
    (r) => {
      t.patchLogin({ loginId: r.target.value }), t.resetError("login");
    },
    [t]
  ), o = c.useCallback(
    (r) => {
      t.patchLogin({ password: r.target.value }), t.resetError("login");
    },
    [t]
  ), i = c.useCallback(
    (r) => {
      t.patchLogin({ rememberId: r.target.checked });
    },
    [t]
  ), m = c.useCallback(
    async (r) => {
      r.preventDefault();
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
    handleIdChange: l,
    handlePasswordChange: o,
    handleRememberChange: i,
    handleSubmit: m,
    isDisabled: n,
    login: e
  };
}, ke = () => {
  const { errorMessage: s, handleIdChange: e, handlePasswordChange: t, handleRememberChange: n, handleSubmit: l, isDisabled: o, login: i } = je();
  return /* @__PURE__ */ a.jsxs(ue, { children: [
    /* @__PURE__ */ a.jsxs("div", { className: "login-header", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "login-title", children: "로그인" }),
      /* @__PURE__ */ a.jsx("p", { className: "login-desc", children: "포인트 적립에서 운임 할인까지 회원 전용 혜택을 받아보는 구간" })
    ] }),
    /* @__PURE__ */ a.jsxs("form", { className: "login-form", id: "user_form", onSubmit: l, children: [
      /* @__PURE__ */ a.jsx(
        x,
        {
          autoComplete: "username",
          id: "id",
          label: "이메일/아이디",
          onChange: e,
          placeholder: "아이디 또는 이메일 입력",
          value: i.loginId
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
          value: i.password
        }
      ),
      /* @__PURE__ */ a.jsx("div", { className: "error-wrapper", id: "login-error-wrapper", style: { display: s ? "block" : "none" }, children: /* @__PURE__ */ a.jsx("p", { className: "error-msg", children: s }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "login_options", children: [
        /* @__PURE__ */ a.jsxs("label", { className: "remember-me", children: [
          /* @__PURE__ */ a.jsx("input", { checked: i.rememberId, id: "saveId", onChange: n, type: "checkbox" }),
          /* @__PURE__ */ a.jsx("span", { children: "아이디 저장" })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "nav-links", children: [
          /* @__PURE__ */ a.jsx("a", { href: "#", children: "아이디/비밀번호 찾기" }),
          /* @__PURE__ */ a.jsx("span", { className: "divider", children: "|" }),
          /* @__PURE__ */ a.jsx("a", { className: "route-link", "data-route": "AUTH.SIGNUP", href: "#", children: "회원가입" })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("button", { className: "login-btn btn", "data-state": i.submitting ? "loading" : "idle", disabled: o, type: "submit", children: i.submitting ? "로그인 중" : "로그인" })
    ] })
  ] });
}, gs = () => {
  const s = c.useMemo(() => Ae(), []);
  return /* @__PURE__ */ a.jsx(V, { savedLoginId: s, children: /* @__PURE__ */ a.jsx(ke, {}) });
}, re = ({ accent: s = "orange", currentStep: e, description: t, steps: n, title: l }) => {
  const o = c.useMemo(() => n.length <= 1 ? "0%" : `${(e - 1) / (n.length - 1) * 100}%`, [e, n.length]);
  return /* @__PURE__ */ a.jsxs("header", { className: `step-header ${s === "red" ? "step-header-pass" : ""}`, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "step-header-text", children: [
      /* @__PURE__ */ a.jsx("h1", { className: "step-title", children: l }),
      t ? /* @__PURE__ */ a.jsx("p", { className: "step-desc", children: t }) : null
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "step-indicator", "data-accent": s, children: [
      /* @__PURE__ */ a.jsx("div", { className: "progress-bg" }),
      /* @__PURE__ */ a.jsx("div", { className: "progress-bar", style: { width: o } }),
      /* @__PURE__ */ a.jsx("div", { className: "step-circles", children: n.map((i, m) => {
        const r = m + 1, S = r === e ? "active" : r < e ? "completed" : "";
        return /* @__PURE__ */ a.jsx(
          "div",
          {
            "aria-label": `${r}단계 ${i.label}`,
            className: `step-circle ${S}`.trim(),
            children: r === e && i.iconClassName ? /* @__PURE__ */ a.jsx("i", { className: i.iconClassName }) : null
          },
          i.label
        );
      }) })
    ] })
  ] });
}, X = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", ve = (s) => new Promise((e) => window.setTimeout(e, s)), Ce = async () => {
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
  await ve(3e3);
}, Pe = () => {
  const { passAuth: s } = j(), e = E();
  return c.useEffect(() => {
    let t = !0;
    return s.recaptchaSiteKey ? void 0 : ((async () => {
      const l = await Ce();
      t && e.patchPassAuth({ recaptchaSiteKey: l });
    })(), () => {
      t = !1;
    });
  }, [e, s.recaptchaSiteKey]), null;
}, ne = "JEJU_PASS_AUTH_SUCCESS", Ee = () => {
  const t = window.screenX + Math.max(0, (window.outerWidth - 430) / 2), n = window.screenY + Math.max(0, (window.outerHeight - 800) / 2), l = se("AUTH.PASS_AUTH");
  return window.open(
    l,
    "PASS_Auth_Popup",
    `width=430,height=800,left=${Math.round(t)},top=${Math.round(n)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
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
}, ie = (s) => /^\d{6}$/.test(s), Me = (s) => /^[1-8]$/.test(s), De = (s) => ie(s) ? `${s.slice(0, 2)}-${s.slice(2, 4)}-${s.slice(4, 6)}` : "", Le = (s) => s === "1" || s === "3" || s === "5" || s === "7" ? "M" : s === "2" || s === "4" || s === "6" || s === "8" ? "F" : "", I = () => {
  const { errors: s, passAuth: e } = j(), t = E(), n = c.useRef(null), l = c.useRef(null), o = c.useRef(null), i = c.useRef(null), m = c.useMemo(() => ie(e.birthSix), [e.birthSix]), r = c.useMemo(() => Me(e.rrnDigit), [e.rrnDigit]), S = c.useMemo(() => K(e.phone).length === 11, [e.phone]), g = m && r, p = g && S, y = p && e.recaptchaStatus === "success" && !e.submitting, N = c.useMemo(() => e.step === 1 ? "이용 중인 통신사를 선택해 주세요" : e.step === 2 ? "인증 방법을 선택해 주세요" : e.step === 3 ? "이름을 입력해 주세요" : g ? p ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", [e.step, g, p]), f = c.useCallback(() => {
    var h;
    o.current !== null && ((h = window.grecaptcha) != null && h.reset) && window.grecaptcha.reset(o.current), t.patchPassAuth({
      recaptchaStatus: "idle",
      recaptchaToken: ""
    }), t.resetError("passAuth");
  }, [t]);
  c.useEffect(() => {
    if (!p || !e.recaptchaSiteKey || o.current !== null)
      return;
    let h = 0, b = 0, w = !0;
    const H = () => {
      var B;
      return !w || !i.current || !((B = window.grecaptcha) != null && B.render) ? !1 : (o.current = window.grecaptcha.render(i.current, {
        callback: async (G) => {
          var W;
          t.patchPassAuth({
            recaptchaStatus: "loading",
            recaptchaToken: G
          }), t.setStatus("verifying");
          const z = await Ne(G);
          if (z.success) {
            t.patchPassAuth({ recaptchaStatus: "success" }), t.resetError("passAuth"), t.setStatus("verified");
            return;
          }
          t.patchPassAuth({
            recaptchaStatus: "error",
            recaptchaToken: ""
          }), t.setError("passAuth", z.message), t.setStatus("error"), o.current !== null && ((W = window.grecaptcha) != null && W.reset) && window.grecaptcha.reset(o.current);
        },
        sitekey: e.recaptchaSiteKey
      }), !0);
    };
    return H() || (h = window.setInterval(() => {
      H() && window.clearInterval(h);
    }, 200), b = window.setTimeout(() => {
      window.clearInterval(h);
    }, 4e3)), () => {
      w = !1, h && window.clearInterval(h), b && window.clearTimeout(b);
    };
  }, [t, e.recaptchaSiteKey, p]);
  const k = c.useCallback(
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
        return (w = n.current) == null ? void 0 : w.focus();
      }, 0), (e.recaptchaToken || e.recaptchaStatus === "success") && f();
    },
    [t, e.recaptchaStatus, e.recaptchaToken, f]
  ), v = c.useCallback(
    (h) => {
      const b = h.target.value.replace(/[^1-8]/g, "").slice(0, 1);
      t.patchPassAuth({ rrnDigit: b }), b.length === 1 && window.setTimeout(() => {
        var w;
        return (w = l.current) == null ? void 0 : w.focus();
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
    handleRrnChange: v,
    handleSelectMethod: R,
    handleSelectTelecom: k,
    handleSubmit: D,
    goToIdentityStep: u,
    passAuth: e,
    phoneInputRef: l,
    recaptchaHostRef: i,
    rrnDigitInputRef: n,
    shouldShowPhoneField: g,
    shouldShowRecaptcha: p,
    stepTitle: N
  };
}, Ue = () => {
  const {
    canSubmit: s,
    errorMessage: e,
    handleBirthChange: t,
    handlePhoneChange: n,
    handleRrnChange: l,
    handleSubmit: o,
    passAuth: i,
    phoneInputRef: m,
    recaptchaHostRef: r,
    rrnDigitInputRef: S,
    shouldShowPhoneField: g,
    shouldShowRecaptcha: p
  } = I();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { className: "readonly", id: "passNameDisplay", readOnly: !0, type: "text", value: i.name }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "pass-reg-group", children: [
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum1", maxLength: 6, onChange: t, placeholder: "생년월일 6자리", type: "text", value: i.birthSix }),
      /* @__PURE__ */ a.jsx("span", { className: "dash", children: "-" }),
      /* @__PURE__ */ a.jsx("input", { id: "passRegNum2", maxLength: 1, onChange: l, ref: S, type: "text", value: i.rrnDigit }),
      /* @__PURE__ */ a.jsx("span", { className: "dots", children: "●●●●●●" })
    ] }),
    g ? /* @__PURE__ */ a.jsx("div", { className: "pass-input-group phone-input-group visible", id: "phoneInputGroup", children: /* @__PURE__ */ a.jsx(
      "input",
      {
        id: "passPhoneInput",
        maxLength: 13,
        onChange: n,
        placeholder: "휴대폰 번호",
        ref: m,
        type: "text",
        value: i.phone
      }
    ) }) : null,
    p ? /* @__PURE__ */ a.jsx("div", { className: "captcha-wrapper visible", id: "captchaWrapper", children: /* @__PURE__ */ a.jsx("div", { id: "recaptchaContainer", ref: r }) }) : null,
    i.recaptchaStatus === "success" ? /* @__PURE__ */ a.jsx("div", { className: "pass-inline-meta success", children: "보안문자 확인 완료 상태" }) : null,
    /* @__PURE__ */ a.jsx(P, { message: e, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", disabled: !s, id: "btnPassSubmitAuth", onClick: () => void o(), type: "button", children: "확인" })
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
], Ve = () => {
  const { handleSelectMethod: s } = I();
  return /* @__PURE__ */ a.jsx("div", { className: "pass-screen active", children: /* @__PURE__ */ a.jsx("div", { className: "authmethod-list", children: Fe.map((e) => /* @__PURE__ */ a.jsx("button", { className: "authmethod-btn", onClick: () => s(e.value), type: "button", children: /* @__PURE__ */ a.jsxs("div", { className: "method-info", children: [
    /* @__PURE__ */ a.jsx("strong", { children: e.title }),
    /* @__PURE__ */ a.jsx("span", { children: e.description })
  ] }) }, e.value)) }) });
}, $e = () => {
  const { errorMessage: s, goToIdentityStep: e, handleNameChange: t, passAuth: n } = I();
  return /* @__PURE__ */ a.jsxs("div", { className: "pass-screen active", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pass-input-group", children: /* @__PURE__ */ a.jsx("input", { id: "passNameInput", onChange: t, placeholder: "이름", type: "text", value: n.name }) }),
    /* @__PURE__ */ a.jsx(P, { message: s, tone: "error" }),
    /* @__PURE__ */ a.jsx("button", { className: "pass-next-btn", onClick: e, type: "button", children: "다음" })
  ] });
}, He = () => {
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
] }) }), Ge = (s, e, t) => s === 1 ? "이용 중인 통신사를 선택해 주세요" : s === 2 ? "인증 방법을 선택해 주세요" : s === 3 ? "이름을 입력해 주세요" : e ? t ? "보안문자를 완료해 주세요" : "휴대폰 번호를 입력해 주세요" : "생년월일과 성별 숫자를 입력해 주세요", ze = () => {
  const { passAuth: s } = j(), e = s.birthSix.length === 6 && /^[1-8]$/.test(s.rrnDigit), t = e && s.phone.replace(/\D/g, "").length === 11;
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
    s.step === 1 ? /* @__PURE__ */ a.jsx(He, {}) : null,
    s.step === 2 ? /* @__PURE__ */ a.jsx(Ve, {}) : null,
    s.step === 3 ? /* @__PURE__ */ a.jsx($e, {}) : null,
    s.step === 4 ? /* @__PURE__ */ a.jsx(Ue, {}) : null,
    s.step === 5 ? /* @__PURE__ */ a.jsx(Be, {}) : null,
    /* @__PURE__ */ a.jsxs("div", { className: "pass-footer", children: [
      "이용약관 ",
      /* @__PURE__ */ a.jsx("strong", { children: "개인정보처리방침" }),
      /* @__PURE__ */ a.jsx("br", {}),
      "VeriSign 256-bit SSL 암호화 적용 상태"
    ] })
  ] });
}, Ss = () => /* @__PURE__ */ a.jsx(V, { children: /* @__PURE__ */ a.jsx(ze, {}) }), We = async (s) => {
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
  Object.entries(s).forEach(([l, o]) => {
    e.append(l, _(o));
  });
  const t = await fetch(`${C}/api/auth/signup`, {
    body: e,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }), n = await t.json().catch(() => ({}));
  if (!t.ok || n.success === !1) {
    const l = typeof n.message == "string" && n.message ? n.message : `회원가입 처리 실패 상태 (${t.status})`;
    throw new Error(l);
  }
  return n;
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
}, ce = async () => {
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
  const s = await ce();
  return s.KAKAO_JS_KEY ? (Kakao.isInitialized() || Kakao.init(s.KAKAO_JS_KEY), { message: "", ok: !0 }) : { message: "카카오 JavaScript 키 누락 상태", ok: !1 };
}, Ze = () => new URL(window.location.pathname, window.location.origin).href, Xe = async (s) => {
  if (s === "kakao") {
    const t = await qe();
    return t.ok ? new Promise((n) => {
      Kakao.Auth.login({
        fail: () => {
          n({
            message: "카카오 로그인 연동 실패 상태",
            success: !1
          });
        },
        success: () => {
          Kakao.API.request({
            fail: () => {
              n({
                message: "카카오 사용자 정보 조회 실패 상태",
                success: !1
              });
            },
            success: (l) => {
              var i;
              const o = l.kakao_account ?? {};
              n({
                data: {
                  gender: o.gender === "male" ? "M" : "F",
                  name: o.name || ((i = l.properties) == null ? void 0 : i.nickname) || "회원",
                  phone: F(o.phone_number || "01000000000"),
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
  const e = await ce();
  return typeof naver > "u" || typeof naver.LoginWithNaverId > "u" ? {
    message: "네이버 SDK 로드 실패 상태",
    success: !1
  } : e.NAVER_CLIENT_ID ? new Promise((t) => {
    const n = "naverIdLogin";
    let l = document.getElementById(n);
    l || (l = document.createElement("div"), l.id = n, l.style.display = "none", document.body.appendChild(l));
    try {
      const o = new naver.LoginWithNaverId({
        callbackUrl: Ze(),
        clientId: e.NAVER_CLIENT_ID,
        isPopup: !0,
        loginButton: { color: "green", height: 60, type: 3 }
      });
      o.init(), o.getLoginStatus((i) => {
        if (i) {
          t({
            data: {
              gender: o.user.getGender() === "M" ? "M" : "F",
              name: o.user.getName() || "회원",
              phone: F(o.user.getMobile() || "01000000000"),
              provider: "NAVER"
            },
            success: !0
          });
          return;
        }
        o.authorize(), t({
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
}, Q = /^[A-Za-z0-9]{4,20}$/, ee = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, $ = () => {
  const { errors: s, signup: e } = j(), t = E(), n = c.useMemo(() => e.terms.service && e.terms.privacy, [e.terms.privacy, e.terms.service]), l = c.useMemo(() => e.terms.service && e.terms.privacy && e.terms.marketing, [e.terms.marketing, e.terms.privacy, e.terms.service]), o = c.useMemo(() => {
    const u = e.identity.isVerified && e.identity.provider === "PASS" && !!e.identity.birthDate && !!e.identity.rrnBackFirstDigit, d = e.account.idCheckStatus === "success" && e.account.idCheckedValue === e.account.userId.trim(), v = e.account.passwordStrength === "medium" || e.account.passwordStrength === "strong", T = e.account.passwordConfirmFeedback.tone === "success", D = ee.test(e.account.email.trim());
    return u && d && v && T && D && !e.account.submitting;
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
  ]), i = c.useCallback(
    (u, d) => {
      const v = ss(u), T = ts(u, d);
      t.patchSignupAccount({
        password: u,
        passwordConfirm: d,
        passwordConfirmFeedback: T.feedback,
        passwordFeedback: v.feedback,
        passwordStrength: v.strength
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
  ), r = c.useCallback(
    (u) => (d) => {
      t.patchSignupTerms({ [u]: d.target.checked });
    },
    [t]
  ), S = c.useCallback(() => {
    n && (t.setSignupStep(2), t.resetError("signup"));
  }, [t, n]), g = c.useCallback(() => {
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
      i(u.target.value, e.account.passwordConfirm), t.resetError("signup");
    },
    [t, e.account.passwordConfirm, i]
  ), k = c.useCallback(
    (u) => {
      i(e.account.password, u.target.value), t.resetError("signup");
    },
    [t, e.account.password, i]
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
    const d = await We(u);
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
      if (!o) {
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
    [t, o, e.account.email, e.account.password, e.account.userId, e.identity]
  );
  return {
    allTermsChecked: l,
    canSubmit: o,
    errorMessage: s.signup,
    goToVerificationStep: S,
    handleCheckId: R,
    handleEmailChange: N,
    handleOpenPassAuth: g,
    handlePasswordChange: f,
    handlePasswordConfirmChange: k,
    handleSocialSignup: p,
    handleSubmit: M,
    handleToggleAllTerms: m,
    handleToggleTerm: r,
    handleUserIdChange: y,
    requiredTermsChecked: n,
    signup: e
  };
}, as = (s) => s === "loading" ? "확인 중" : s === "success" ? "확인 완료" : "중복확인", rs = () => {
  const {
    canSubmit: s,
    errorMessage: e,
    handleCheckId: t,
    handleEmailChange: n,
    handlePasswordChange: l,
    handlePasswordConfirmChange: o,
    handleSubmit: i,
    handleUserIdChange: m,
    signup: r
  } = $();
  return /* @__PURE__ */ a.jsxs("form", { className: "step-panel active", onSubmit: i, children: [
    /* @__PURE__ */ a.jsx(
      x,
      {
        id: "userName",
        label: "이름",
        onChange: () => {
        },
        placeholder: "",
        readOnly: !0,
        value: r.identity.name
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
        value: r.identity.phone
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        feedback: r.account.idFeedback.message,
        feedbackTone: r.account.idFeedback.tone,
        id: "userId",
        label: "아이디",
        onChange: m,
        placeholder: "영문과 숫자 4~20자",
        rightSlot: /* @__PURE__ */ a.jsx("button", { className: "btn-secondary btn-verify", disabled: r.account.idCheckStatus === "loading", onClick: () => void t(), type: "button", children: as(r.account.idCheckStatus) }),
        value: r.account.userId
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        feedback: r.account.passwordFeedback.message,
        feedbackTone: r.account.passwordFeedback.tone,
        id: "password",
        label: "비밀번호",
        onChange: l,
        placeholder: "영문과 숫자 조합 8자 이상",
        type: "password",
        value: r.account.password
      }
    ),
    r.account.passwordStrength !== "hidden" ? /* @__PURE__ */ a.jsxs("div", { className: `password-strength-container strength-${r.account.passwordStrength}`, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "password-strength-meter", children: [
        /* @__PURE__ */ a.jsx("div", { className: "meter-bar", id: "meterBar1" }),
        /* @__PURE__ */ a.jsx("div", { className: "meter-bar", id: "meterBar2" }),
        /* @__PURE__ */ a.jsx("div", { className: "meter-bar", id: "meterBar3" })
      ] }),
      /* @__PURE__ */ a.jsx("span", { className: "strength-text", id: "strengthText", children: r.account.passwordStrength === "strong" ? "안전" : r.account.passwordStrength === "medium" ? "보통" : "불가" })
    ] }) : null,
    /* @__PURE__ */ a.jsx(
      x,
      {
        feedback: r.account.passwordConfirmFeedback.message,
        feedbackTone: r.account.passwordConfirmFeedback.tone,
        id: "passwordConfirm",
        label: "비밀번호 확인",
        onChange: o,
        placeholder: "비밀번호 다시 입력",
        type: "password",
        value: r.account.passwordConfirm
      }
    ),
    /* @__PURE__ */ a.jsx(
      x,
      {
        id: "userEmail",
        label: "이메일",
        onChange: n,
        placeholder: "example@email.com",
        type: "email",
        value: r.account.email
      }
    ),
    r.identity.telecom ? /* @__PURE__ */ a.jsxs("div", { className: "auth-summary-chip", children: [
      "PASS 인증 완료",
      /* @__PURE__ */ a.jsx("span", { children: r.identity.telecom })
    ] }) : null,
    /* @__PURE__ */ a.jsx(P, { className: "signup-submit-feedback", message: e, tone: "error" }),
    /* @__PURE__ */ a.jsxs("div", { style: { background: "#ffeeee", padding: "10px", fontSize: "12px", marginTop: "10px", borderRadius: "4px" }, children: [
      /* @__PURE__ */ a.jsx("strong", { children: "[디버그: 다음 항목 중 False인 것을 찾아주세요]" }),
      /* @__PURE__ */ a.jsx("br", {}),
      "1. 본인인증 완료 (hasVerifiedPass): ",
      String(r.identity.isVerified && r.identity.provider === "PASS" && !!r.identity.birthDate && !!r.identity.rrnBackFirstDigit),
      /* @__PURE__ */ a.jsx("br", {}),
      "2. 아이디 중복확인 (idChecked): ",
      String(r.account.idCheckStatus === "success" && r.account.idCheckedValue === r.account.userId.trim()),
      " ",
      /* @__PURE__ */ a.jsx("br", {}),
      "   👉 상세: 상태='",
      r.account.idCheckStatus,
      "', 체크된값='",
      r.account.idCheckedValue,
      "', 현재값='",
      r.account.userId.trim(),
      "'",
      /* @__PURE__ */ a.jsx("br", {}),
      "3. 비밀번호 강도 (passwordReady): ",
      String(r.account.passwordStrength === "medium" || r.account.passwordStrength === "strong"),
      /* @__PURE__ */ a.jsx("br", {}),
      "4. 비밀번호 일치 (passwordMatched): ",
      String(r.account.passwordConfirmFeedback.tone === "success"),
      /* @__PURE__ */ a.jsx("br", {}),
      "5. 이메일 형식 (emailReady): ",
      String(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.account.email.trim())),
      /* @__PURE__ */ a.jsx("br", {}),
      "6. 처리중 여부 (!submitting): ",
      String(!r.account.submitting)
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-primary", disabled: !s, id: "btnSignupSubmit", type: "submit", children: r.account.submitting ? "가입 처리 중" : "가입 완료" }) })
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
}, is = () => {
  const { signup: s } = j();
  return /* @__PURE__ */ a.jsx("div", { className: "step-panel active", children: /* @__PURE__ */ a.jsxs("div", { className: "success-content", children: [
    /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-circle-check success-icon" }),
    /* @__PURE__ */ a.jsxs("h2", { className: "success-title", children: [
      s.completedName || "회원",
      " 가입 완료 상태"
    ] }),
    /* @__PURE__ */ a.jsx("p", { className: "success-desc", children: "제주그룹 계정 생성이 완료된 상태" }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions", children: /* @__PURE__ */ a.jsx("a", { className: "btn-primary route-link", "data-route": "AUTH.LOGIN", href: "#", children: "로그인 페이지로 이동" }) })
  ] }) });
}, cs = Object.freeze([
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
  const { allTermsChecked: s, goToVerificationStep: e, handleToggleAllTerms: t, handleToggleTerm: n, requiredTermsChecked: l, signup: o } = $();
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
      os.map((i) => /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsxs("label", { className: `custom-chk ${i.required ? "" : "opt-chk"}`.trim(), children: [
          /* @__PURE__ */ a.jsx(
            "input",
            {
              checked: o.terms[i.key],
              className: "hidden-chk",
              onChange: n(i.key),
              type: "checkbox"
            }
          ),
          /* @__PURE__ */ a.jsx("span", { className: "chk-mark" }),
          i.label,
          /* @__PURE__ */ a.jsx("i", { className: "fa-solid fa-chevron-right arrow-right" })
        ] }),
        i.description ? /* @__PURE__ */ a.jsx("div", { className: "opt-desc", children: i.description }) : null
      ] }, i.key))
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "form-actions flat-actions", children: /* @__PURE__ */ a.jsx("button", { className: "btn-flat", disabled: !l, onClick: e, type: "button", children: "다음" }) })
  ] });
}, us = () => {
  const { errorMessage: s, handleOpenPassAuth: e, handleSocialSignup: t } = $();
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
  const { signup: s } = j();
  return /* @__PURE__ */ a.jsxs("section", { className: "signup-container", children: [
    /* @__PURE__ */ a.jsx(ns, {}),
    /* @__PURE__ */ a.jsx(re, { currentStep: s.step, steps: cs, title: ds(s.step) }),
    /* @__PURE__ */ a.jsxs("div", { className: "user_form", children: [
      s.step === 1 ? /* @__PURE__ */ a.jsx(ls, {}) : null,
      s.step === 2 ? /* @__PURE__ */ a.jsx(us, {}) : null,
      s.step === 3 ? /* @__PURE__ */ a.jsx(rs, {}) : null,
      s.step === 4 ? /* @__PURE__ */ a.jsx(is, {}) : null
    ] })
  ] });
}, fs = () => /* @__PURE__ */ a.jsx(V, { children: /* @__PURE__ */ a.jsx(hs, {}) });
export {
  gs as L,
  Ss as P,
  fs as S
};
