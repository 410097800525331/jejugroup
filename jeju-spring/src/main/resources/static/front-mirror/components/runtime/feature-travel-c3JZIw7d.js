import { j as e, a as t } from "./react-vendor-BoSfm_Te.js";
import { x as w, y as C, S, F as y, z as T, R as A, D as I } from "./icon-vendor-Dpra3II6.js";
const E = {
  document: y,
  device: S,
  health: C,
  luggage: w
}, R = ({ checkedIds: s, onToggle: c, section: a }) => {
  const o = E[a.icon];
  return /* @__PURE__ */ e.jsxs("section", { className: "travel-checklist-section-card", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "travel-checklist-section-head", children: [
      /* @__PURE__ */ e.jsx("div", { className: "travel-checklist-section-icon", children: /* @__PURE__ */ e.jsx(o, { size: 20, strokeWidth: 2.25 }) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h2", { className: "travel-checklist-section-title", children: a.title }),
        /* @__PURE__ */ e.jsx("p", { className: "travel-checklist-section-desc", children: a.description })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "travel-checklist-items", children: a.items.map((l) => {
      const n = s.has(l.id);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          "aria-pressed": n,
          className: `travel-checklist-item${n ? " is-checked" : ""}`,
          onClick: () => c(l.id),
          type: "button",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "travel-checklist-item-check", children: n ? /* @__PURE__ */ e.jsx(T, { size: 16, strokeWidth: 3 }) : null }),
            /* @__PURE__ */ e.jsxs("span", { className: "travel-checklist-item-copy", children: [
              /* @__PURE__ */ e.jsx("strong", { children: l.label }),
              l.note ? /* @__PURE__ */ e.jsx("small", { children: l.note }) : null
            ] })
          ]
        },
        l.id
      );
    }) })
  ] });
}, x = [
  {
    id: "documents",
    icon: "document",
    title: "필수 서류와 결제",
    description: "출국 전 마지막으로 확인해야 하는 기본 세트",
    items: [
      { id: "passport", label: "여권 만료일 확인", note: "출국일 기준 6개월 이상 남았는지 확인" },
      { id: "visa", label: "비자 또는 전자입국 서류 준비" },
      { id: "booking", label: "항공권과 숙소 예약 확인서 저장" },
      { id: "insurance", label: "여행자 보험 가입 내역 저장" },
      { id: "payment", label: "현지 결제 카드와 비상용 현금 준비" }
    ]
  },
  {
    id: "devices",
    icon: "device",
    title: "스마트폰과 통신",
    description: "도착 직후 길을 잃지 않게 만드는 생존 장비",
    items: [
      { id: "esim", label: "eSIM 또는 로밍 설정 확인" },
      { id: "charger", label: "충전기와 케이블 챙기기" },
      { id: "battery", label: "보조 배터리 완충하기" },
      { id: "maps", label: "오프라인 지도 저장" },
      { id: "translator", label: "번역 앱과 현지 교통 앱 설치" }
    ]
  },
  {
    id: "luggage",
    icon: "luggage",
    title: "짐과 개인 물품",
    description: "현지에서 다시 사기 귀찮은 것들 위주",
    items: [
      { id: "clothes", label: "날씨에 맞는 옷과 얇은 겉옷 준비" },
      { id: "toiletries", label: "세면도구와 상비약 챙기기" },
      { id: "sleep", label: "목베개와 안대 같은 이동용 소품 챙기기" },
      { id: "sun", label: "선크림과 모자 준비" },
      { id: "laundry", label: "압축팩과 세탁 파우치 정리" }
    ]
  },
  {
    id: "wellness",
    icon: "health",
    title: "도착 직후 루틴",
    description: "첫날 컨디션과 동선을 망치지 않게 만드는 체크",
    items: [
      { id: "arrival", label: "공항에서 숙소까지 이동 경로 캡처" },
      { id: "checkin", label: "체크인 시간과 프런트 운영 시간 확인" },
      { id: "emergency", label: "현지 비상 연락처 저장" },
      { id: "schedule", label: "첫날 일정은 느슨하게 비워두기" },
      { id: "rest", label: "도착 후 바로 쉴 수 있는 간단한 식사 계획 세우기" }
    ]
  }
], M = (s) => 1 - (1 - s) ** 3, P = (s, c = 420) => {
  const [a, o] = t.useState(s), l = t.useRef(s);
  return t.useEffect(() => {
    const n = l.current, d = s - n;
    if (Math.abs(d) < 0.01) {
      l.current = s, o(s);
      return;
    }
    const g = window.performance.now();
    let i = 0;
    const u = (k) => {
      const p = Math.min((k - g) / c, 1), m = n + d * M(p);
      l.current = m, o(m), p < 1 && (i = window.requestAnimationFrame(u));
    };
    return i = window.requestAnimationFrame(u), () => {
      window.cancelAnimationFrame(i);
    };
  }, [c, s]), a;
}, v = "jeju:travel-checklist-items", $ = () => {
  try {
    const s = window.localStorage.getItem(v);
    if (!s)
      return [];
    const c = JSON.parse(s);
    return Array.isArray(c) ? c.filter((a) => typeof a == "string") : [];
  } catch {
    return [];
  }
}, z = () => {
  const [s, c] = t.useState(() => $()), [a, o] = t.useState(!1), [l, n] = t.useState(!1);
  t.useEffect(() => {
    window.localStorage.setItem(v, JSON.stringify(s));
  }, [s]);
  const d = t.useMemo(() => x.reduce((r, h) => r + h.items.length, 0), []), g = t.useMemo(() => new Set(s), [s]), i = t.useMemo(() => d === 0 ? 0 : Math.round(s.length / d * 100), [s.length, d]), u = P(i), k = t.useMemo(() => Math.round(u), [u]), p = t.useRef(i), m = i === 100;
  t.useEffect(() => {
    o(!0);
    const r = window.setTimeout(() => {
      o(!1);
    }, 480);
    return () => {
      window.clearTimeout(r);
    };
  }, [i]), t.useEffect(() => {
    const r = p.current;
    if (p.current = i, i !== 100 || r === 100)
      return;
    n(!0);
    const h = window.setTimeout(() => {
      n(!1);
    }, 1400);
    return () => {
      window.clearTimeout(h);
    };
  }, [i]);
  const j = t.useMemo(() => i === 100 ? "짐 싸기 전에 한 번만 더 훑으면 끝" : i >= 70 ? "거의 다 됨 이제 빠진 것만 마무리" : i >= 40 ? "절반 넘김 아직 헷갈리는 것만 정리하면 됨" : "출국 직전에 멘붕 오기 싫으면 지금 채워두는 구간", [i]), b = t.useCallback((r) => {
    c((h) => h.includes(r) ? h.filter((N) => N !== r) : [...h, r]);
  }, []), f = t.useCallback(() => {
    c([]);
  }, []);
  return /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-shell", children: [
    /* @__PURE__ */ e.jsx("section", { className: "travel-checklist-hero", children: /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-hero-copy", children: [
      /* @__PURE__ */ e.jsx("span", { className: "travel-checklist-badge", children: "JEJU STAY CHECKLIST" }),
      /* @__PURE__ */ e.jsx("h1", { children: "출국 직전 체크리스트" }),
      /* @__PURE__ */ e.jsxs("p", { children: [
        "여권, 결제, 통신, 짐 정리까지",
        /* @__PURE__ */ e.jsx("br", {}),
        "마지막에 허둥대지 않게 한 화면에 묶어둔 여행 준비판"
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs(
      "aside",
      {
        className: `travel-checklist-progress-card${m ? " is-complete" : ""}${l ? " is-celebrating" : ""}`,
        children: [
          /* @__PURE__ */ e.jsx(
            "div",
            {
              className: `travel-checklist-progress-ring${a ? " is-animating" : ""}${m ? " is-complete" : ""}${l ? " is-celebrating" : ""}`,
              style: { "--progress": `${u}%` },
              children: /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-progress-ring-inner", children: [
                /* @__PURE__ */ e.jsxs("strong", { children: [
                  /* @__PURE__ */ e.jsx("span", { className: "travel-checklist-progress-value", children: k }),
                  /* @__PURE__ */ e.jsx("span", { className: "travel-checklist-progress-unit", children: "%" })
                ] }),
                /* @__PURE__ */ e.jsxs("span", { children: [
                  s.length,
                  " / ",
                  d
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ e.jsx("p", { className: "travel-checklist-progress-label", children: j }),
          m ? /* @__PURE__ */ e.jsx("span", { className: `travel-checklist-complete-badge${l ? " is-celebrating" : ""}`, children: "출국 준비 완료" }) : null,
          /* @__PURE__ */ e.jsxs("button", { className: "travel-checklist-reset", onClick: f, type: "button", children: [
            /* @__PURE__ */ e.jsx(A, { size: 16, strokeWidth: 2.4 }),
            "초기화"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ e.jsx("section", { className: "travel-checklist-summary", children: /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-summary-card", children: [
      /* @__PURE__ */ e.jsx(I, { size: 18, strokeWidth: 2.3 }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("strong", { children: "첫날 동선만큼은 미리 캡처" }),
        /* @__PURE__ */ e.jsx("p", { children: "공항에서 숙소까지, 체크인 시간, 현지 결제 수단 세 개만 챙겨도 절반은 안 꼬임" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsx("section", { className: "travel-checklist-grid", children: x.map((r) => /* @__PURE__ */ e.jsx(R, { checkedIds: g, onToggle: b, section: r }, r.id)) })
  ] });
};
export {
  z as T
};
