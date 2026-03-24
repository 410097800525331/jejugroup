const ADMIN_SESSION = {
  id: "local-admin",
  name: "로컬 관리자",
  email: "admin@local.jejugroup",
  phone: "010-0000-0000",
  role: "ADMIN",
  roles: ["ADMIN", "SUPER_ADMIN"],
  authSource: "LOCAL_FRONT_ADMIN",
  isLocalAdmin: true,
};

const MYPAGE_SESSION = {
  id: "hong_minji",
  name: "홍민지",
  email: "minji.hong@jejugroup.example",
  phone: "010-1234-5678",
  role: "MEMBER",
  roles: ["MEMBER"],
  tier: "GOLD",
  memberships: ["GOLD"],
};

const CUSTOMER_CENTER_PUBLIC_SESSION = {
  user: null,
};

const CUSTOMER_CENTER_MEMBER_SESSION = {
  user: {
    id: "hong_minji",
    name: "홍민지",
    email: "minji.hong@jejugroup.example",
    phone: "010-1234-5678",
    role: "MEMBER",
    roles: ["MEMBER"],
  },
};

const CUSTOMER_CENTER_NOTICES = [
  {
    id: 1,
    serviceType: "jeju-air",
    title: "2026년 2월 제주항공 신규 노선 운항 안내",
    excerpt: "서울 인천공항에서 방콕, 홍콩, 타이페이로 운항하는 신규 노선이 시작됩니다.",
    content: "제주항공에서 새로운 국제선 노선을 개설합니다. 서울 인천공항에서 방콕, 홍콩, 타이페이로 운항하는 신규 노선이 2026년 3월부터 시작됩니다.",
    active: true,
    publishedAt: "2026-02-27",
  },
  {
    id: 2,
    serviceType: "jeju-stay",
    title: "제주스테이 봄 시즌 특가 이벤트 시작",
    excerpt: "최대 40% 할인된 가격으로 제주의 아름다운 숙소를 예약하세요.",
    content: "제주스테이에서 봄 시즌 특가 이벤트를 진행합니다. 2026년 3월 1일부터 5월 31일까지 최대 40% 할인된 가격으로 예약하실 수 있습니다.",
    active: true,
    publishedAt: "2026-02-25",
  },
];

const CUSTOMER_CENTER_FAQS = [
  {
    id: 1,
    serviceType: "jeju-air",
    category: "예약 및 변경",
    question: "제주항공 항공권 예약 후 취소는 어떻게 하나요?",
    answer: "제주항공 웹사이트 또는 모바일 앱에서 '예약 조회'를 통해 예약 번호와 이메일을 입력하여 취소할 수 있습니다.",
    active: true,
    sortOrder: 0,
  },
  {
    id: 2,
    serviceType: "jeju-stay",
    category: "예약",
    question: "제주스테이 예약은 어디서 확인하나요?",
    answer: "마이페이지 또는 고객센터 문의 내역에서 예약 상태를 확인할 수 있습니다.",
    active: true,
    sortOrder: 1,
  },
];

const CUSTOMER_CENTER_TICKETS = [
  {
    id: 1001,
    ticketId: 1001,
    userId: "hong_minji",
    serviceType: "jeju-air",
    inquiryType: "reservation",
    requesterName: "홍민지",
    requesterEmail: "minji.hong@jejugroup.example",
    requesterPhone: "010-1234-5678",
    title: "항공권 예약 변경 문의",
    content: "예약 날짜를 하루 미루고 싶어.",
    status: "pending",
    createdAt: "2026-03-23T09:00:00.000Z",
    updatedAt: "2026-03-23T09:00:00.000Z",
    messages: [],
    comments: [],
    attachments: [],
  },
  {
    id: 1002,
    ticketId: 1002,
    userId: "hong_minji",
    serviceType: "jeju-stay",
    inquiryType: "booking",
    requesterName: "홍민지",
    requesterEmail: "minji.hong@jejugroup.example",
    requesterPhone: "010-1234-5678",
    title: "제주스테이 예약 확인",
    content: "예약이 정상적으로 완료됐는지 확인하고 싶어.",
    status: "completed",
    reply: "예약이 확정됐어. 체크인은 15:00부터 가능해.",
    createdAt: "2026-03-22T14:00:00.000Z",
    updatedAt: "2026-03-22T14:00:00.000Z",
    messages: [{ body: "예약이 확정됐어." }],
    comments: [],
    attachments: [],
  },
];

const ADMIN_DASHBOARD_SEED = {
  success: true,
  data: {
    kpi: {
      todayReservations: 128,
      revenue: "34,820,000",
      cancelRate: "4.1%",
      activeUsers: 28,
    },
    recentActivity: [
      {
        type: "NOTICE",
        desc: "제주항공 신규 노선 공지 등록",
        time: "2026-03-24 09:00",
        status: "게시",
      },
    ],
    ui: {
      activeMenu: "dashboard",
      theme: "system",
      domain: "all",
    },
  },
};

const CUSTOMER_CENTER_ROUTE_PATTERNS = {
  authSession: "**/api/auth/session",
  notices: "**/api/customer-center/notices",
  faqs: "**/api/customer-center/faqs",
  tickets: "**/api/customer-center/support/tickets**",
};

const toJsonResponse = (payload, status = 200) => ({
  status,
  contentType: "application/json; charset=utf-8",
  body: JSON.stringify(payload),
});

const routeJson = async (route, payload, status = 200) => {
  await route.fulfill(toJsonResponse(payload, status));
};

const seedLocalStorageSession = async (page, session) => {
  await page.addInitScript(
    (nextSession) => {
      localStorage.setItem("userSession", JSON.stringify(nextSession));
    },
    session,
  );
};

const installAdminDashboardMock = async (page) => {
  await page.route("**/api/admin/dashboard**", async (route) => {
    await routeJson(route, ADMIN_DASHBOARD_SEED);
  });
};

const installMypageSession = async (page) => {
  await seedLocalStorageSession(page, MYPAGE_SESSION);
};

const installAdminSession = async (page) => {
  await seedLocalStorageSession(page, ADMIN_SESSION);
};

const installCustomerCenterSmokeMocks = async (page, { authenticated = false } = {}) => {
  await page.route(CUSTOMER_CENTER_ROUTE_PATTERNS.authSession, async (route) => {
    await routeJson(route, authenticated ? CUSTOMER_CENTER_MEMBER_SESSION : CUSTOMER_CENTER_PUBLIC_SESSION);
  });

  await page.route(CUSTOMER_CENTER_ROUTE_PATTERNS.notices, async (route) => {
    await routeJson(route, CUSTOMER_CENTER_NOTICES);
  });

  await page.route(CUSTOMER_CENTER_ROUTE_PATTERNS.faqs, async (route) => {
    await routeJson(route, CUSTOMER_CENTER_FAQS);
  });

  await page.route(CUSTOMER_CENTER_ROUTE_PATTERNS.tickets, async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;
    const ticketMatch = pathname.match(/\/support\/tickets\/(\d+)(?:\/(comments|attachments))?$/);

    if (pathname.endsWith("/comments")) {
      await routeJson(route, []);
      return;
    }

    if (pathname.endsWith("/attachments")) {
      await routeJson(route, []);
      return;
    }

    if (pathname.endsWith("/support/tickets")) {
      await routeJson(route, CUSTOMER_CENTER_TICKETS);
      return;
    }

    if (ticketMatch) {
      const ticketId = Number(ticketMatch[1]);
      const ticket = CUSTOMER_CENTER_TICKETS.find((item) => Number(item.id) === ticketId || Number(item.ticketId) === ticketId);
      await routeJson(route, ticket ?? null);
      return;
    }

    await routeJson(route, CUSTOMER_CENTER_TICKETS);
  });
};

module.exports = {
  ADMIN_DASHBOARD_SEED,
  ADMIN_SESSION,
  CUSTOMER_CENTER_FAQS,
  CUSTOMER_CENTER_NOTICES,
  CUSTOMER_CENTER_PUBLIC_SESSION,
  CUSTOMER_CENTER_TICKETS,
  CUSTOMER_CENTER_MEMBER_SESSION,
  MYPAGE_SESSION,
  installAdminDashboardMock,
  installAdminSession,
  installCustomerCenterSmokeMocks,
  installMypageSession,
  routeJson,
  seedLocalStorageSession,
};
