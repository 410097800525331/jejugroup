import { c as r, S as x, j as e, r as a } from "./index-CoeQRDgQ.js";
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v = r("BriefcaseBusiness", [
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2", key: "1ksdt3" }],
  ["path", { d: "M22 13a18.15 18.15 0 0 1-20 0", key: "12hx5q" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g = r("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j = r("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const y = r("HeartPulse", [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ],
  ["path", { d: "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "1uw2ng" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b = r("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M = r("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]), N = {
  document: j,
  device: x,
  health: y,
  luggage: v
}, S = ({ checkedIds: s, onToggle: i, section: l }) => {
  const h = N[l.icon];
  return /* @__PURE__ */ e.jsxs("section", { className: "travel-checklist-section-card", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "travel-checklist-section-head", children: [
      /* @__PURE__ */ e.jsx("div", { className: "travel-checklist-section-icon", children: /* @__PURE__ */ e.jsx(h, { size: 20, strokeWidth: 2.25 }) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h2", { className: "travel-checklist-section-title", children: l.title }),
        /* @__PURE__ */ e.jsx("p", { className: "travel-checklist-section-desc", children: l.description })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "travel-checklist-items", children: l.items.map((t) => {
      const n = s.has(t.id);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          "aria-pressed": n,
          className: `travel-checklist-item${n ? " is-checked" : ""}`,
          onClick: () => i(t.id),
          type: "button",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "travel-checklist-item-check", children: n ? /* @__PURE__ */ e.jsx(g, { size: 16, strokeWidth: 3 }) : null }),
            /* @__PURE__ */ e.jsxs("span", { className: "travel-checklist-item-copy", children: [
              /* @__PURE__ */ e.jsx("strong", { children: t.label }),
              t.note ? /* @__PURE__ */ e.jsx("small", { children: t.note }) : null
            ] })
          ]
        },
        t.id
      );
    }) })
  ] });
}, o = [
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
], k = "jeju:travel-checklist-items", C = () => {
  try {
    const s = window.localStorage.getItem(k);
    if (!s)
      return [];
    const i = JSON.parse(s);
    return Array.isArray(i) ? i.filter((l) => typeof l == "string") : [];
  } catch {
    return [];
  }
}, A = () => {
  const [s, i] = a.useState(() => C());
  a.useEffect(() => {
    window.localStorage.setItem(k, JSON.stringify(s));
  }, [s]);
  const l = a.useMemo(() => o.reduce((c, d) => c + d.items.length, 0), []), h = a.useMemo(() => new Set(s), [s]), t = a.useMemo(() => l === 0 ? 0 : Math.round(s.length / l * 100), [s.length, l]), n = a.useMemo(() => t === 100 ? "짐 싸기 전에 한 번만 더 훑으면 끝" : t >= 70 ? "거의 다 됨 이제 빠진 것만 마무리" : t >= 40 ? "절반 넘김 아직 헷갈리는 것만 정리하면 됨" : "출국 직전에 멘붕 오기 싫으면 지금 채워두는 구간", [t]), p = a.useCallback((c) => {
    i((d) => d.includes(c) ? d.filter((u) => u !== c) : [...d, c]);
  }, []), m = a.useCallback(() => {
    i([]);
  }, []);
  return /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-shell", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "travel-checklist-hero", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-hero-copy", children: [
        /* @__PURE__ */ e.jsx("span", { className: "travel-checklist-badge", children: "JEJU STAY CHECKLIST" }),
        /* @__PURE__ */ e.jsx("h1", { children: "출국 직전 체크리스트" }),
        /* @__PURE__ */ e.jsxs("p", { children: [
          "여권, 결제, 통신, 짐 정리까지",
          /* @__PURE__ */ e.jsx("br", {}),
          "마지막에 허둥대지 않게 한 화면에 묶어둔 여행 준비판"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("aside", { className: "travel-checklist-progress-card", children: [
        /* @__PURE__ */ e.jsx("div", { className: "travel-checklist-progress-ring", style: { "--progress": `${t}%` }, children: /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-progress-ring-inner", children: [
          /* @__PURE__ */ e.jsxs("strong", { children: [
            t,
            "%"
          ] }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            s.length,
            " / ",
            l
          ] })
        ] }) }),
        /* @__PURE__ */ e.jsx("p", { className: "travel-checklist-progress-label", children: n }),
        /* @__PURE__ */ e.jsxs("button", { className: "travel-checklist-reset", onClick: m, type: "button", children: [
          /* @__PURE__ */ e.jsx(b, { size: 16, strokeWidth: 2.4 }),
          "초기화"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("section", { className: "travel-checklist-summary", children: /* @__PURE__ */ e.jsxs("div", { className: "travel-checklist-summary-card", children: [
      /* @__PURE__ */ e.jsx(M, { size: 18, strokeWidth: 2.3 }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("strong", { children: "첫날 동선만큼은 미리 캡처" }),
        /* @__PURE__ */ e.jsx("p", { children: "공항에서 숙소까지, 체크인 시간, 현지 결제 수단 세 개만 챙겨도 절반은 안 꼬임" })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsx("section", { className: "travel-checklist-grid", children: o.map((c) => /* @__PURE__ */ e.jsx(S, { checkedIds: h, onToggle: p, section: c }, c.id)) })
  ] });
};
export {
  A as TravelChecklistApp
};
