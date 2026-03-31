const fs = require("node:fs");
const path = require("node:path");

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

const ADMIN_CHART_STUB = `
window.Chart = class Chart {
  constructor() {}
  destroy() {}
  update() {}
};
`;

const ADMIN_LUCIDE_STUB = `
window.lucide = {
  createIcons() {}
};
`;

const ADMIN_RESERVATIONS_TABLES = {
  defaultTab: "booking",
  tabs: {
    booking: {
      searchPlaceholder: "예약 테이블 또는 도메인 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "예약 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          domainKey: "air",
          searchText: "예약 제주항공",
          cells: ["AIR", "jeju_air_reservations", "예약 관리", "정상", "18", "예약 기준", "관리"],
        },
      ],
    },
    payment: {
      searchPlaceholder: "결제 테이블 또는 도메인 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "결제 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          domainKey: "stay",
          searchText: "결제 제주스테이",
          cells: ["STAY", "jeju_stay_payments", "결제 관리", "정상", "9", "결제 기준", "관리"],
        },
      ],
    },
    refund: {
      searchPlaceholder: "환불 테이블 또는 도메인 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "환불 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          domainKey: "air",
          searchText: "환불 제주항공",
          cells: ["AIR", "jeju_air_refunds", "환불 관리", "정상", "2", "환불 기준", "관리"],
        },
      ],
    },
    traveler: {
      searchPlaceholder: "이용자 테이블 또는 도메인 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "탑승객 / 이용자 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          domainKey: "air",
          searchText: "여행자 홍민지",
          cells: ["AIR", "jeju_air_travelers", "탑승객 관리", "정상", "24", "여행자 기준", "관리"],
        },
      ],
    },
  },
};

const ADMIN_LODGING_TABLES = {
  defaultTab: "stay",
  tabs: {
    stay: {
      searchPlaceholder: "stay 테이블 또는 역할 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "stay 상품 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          searchText: "제주스테이 객실 운영",
          cells: ["STAY", "jeju_stay_rooms", "객실 운영", "정상", "128", "숙박 기준", "관리"],
        },
      ],
    },
    air: {
      searchPlaceholder: "air 테이블 또는 역할 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "air 상품 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          searchText: "제주항공 운항 스키마",
          cells: ["AIR", "jeju_air_routes", "운항 관리", "정상", "84", "항공 기준", "관리"],
        },
      ],
    },
    rent: {
      searchPlaceholder: "rent 테이블 또는 역할 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "rent 상품 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          searchText: "렌터카 예약 스키마",
          cells: ["RENT", "jeju_rent_bookings", "차량 예약", "정상", "31", "렌터카 기준", "관리"],
        },
      ],
    },
    voucher: {
      searchPlaceholder: "voucher 테이블 또는 역할 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "voucher 상품 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          searchText: "바우처 배포 스키마",
          cells: ["VOUCHER", "jeju_voucher_codes", "바우처 관리", "정상", "12", "배포 기준", "관리"],
        },
      ],
    },
    special: {
      searchPlaceholder: "special 테이블 또는 역할 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "special 상품 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          searchText: "특가 상품 편성",
          cells: ["SPECIAL", "jeju_special_products", "특가 관리", "정상", "7", "특가 기준", "관리"],
        },
      ],
    },
    usim: {
      searchPlaceholder: "usim 테이블 또는 역할 검색",
      primaryAction: "스키마 새로고침",
      secondaryAction: "현재 DB 기준",
      emptyMessage: "usim 상품 스키마가 아직 없습니다.",
      columns: ["도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"],
      rows: [
        {
          searchText: "유심 재고 스키마",
          cells: ["USIM", "jeju_usim_inventory", "유심 관리", "정상", "44", "유심 기준", "관리"],
        },
      ],
    },
  },
};

const ADMIN_MEMBERS_TABLES = {
  defaultTab: "member",
  tabs: {
    member: {
      searchPlaceholder: "회원명 또는 ID 검색",
      primaryAction: "회원 DB 보기",
      secondaryAction: "새로고침",
      emptyMessage: "회원 데이터가 없습니다.",
      columns: ["사용자 ID", "구분", "기본 정보", "기준 일시", "상태 / 권한", "관리"],
      rows: [
        {
          searchText: "홍민지 local-admin",
          cells: ["hong_minji", "회원", "홍민지 / minji.hong@jejugroup.example", "2026-03-24 09:00", "GOLD / MEMBER", "관리"],
        },
      ],
    },
    accounts: {
      searchPlaceholder: "연동 계정 또는 provider 검색",
      primaryAction: "계정 DB 보기",
      secondaryAction: "새로고침",
      emptyMessage: "연동 계정 데이터가 없습니다.",
      columns: ["사용자 ID", "구분", "연동 정보", "최근 인증", "상태 / 기본값", "관리"],
      rows: [
        {
          searchText: "naver hong_minji",
          cells: ["hong_minji", "연동 계정", "NAVER / 기본", "2026-03-24 08:50", "활성 / 기본", "관리"],
        },
      ],
    },
    permissions: {
      searchPlaceholder: "권한명 또는 식별자 검색",
      primaryAction: "권한 DB 보기",
      secondaryAction: "새로고침",
      emptyMessage: "권한 데이터가 없습니다.",
      columns: ["식별자", "구분", "기본 정보", "기준 일시", "상태 / 연결", "관리"],
      rows: [
        {
          searchText: "SUPER_ADMIN local-admin",
          cells: ["super_admin", "권한", "전체 관리자 권한", "2026-03-24 09:05", "활성 / 연결", "관리"],
        },
      ],
    },
    inquiries: {
      searchPlaceholder: "문의번호 또는 문의 제목 검색",
      primaryAction: "문의 DB 보기",
      secondaryAction: "새로고침",
      emptyMessage: "문의 데이터가 없습니다.",
      columns: ["문의 ID", "서비스", "문의 요약", "작성 일시", "처리 상태", "관리"],
      rows: [
        {
          searchText: "예약 변경 문의",
          cells: ["T-1001", "제주항공", "항공권 예약 변경 문의", "2026-03-23 09:00", "pending", "관리"],
        },
      ],
    },
  },
};

const ADMIN_CMS_TABLES = {
  defaultTab: "notices",
  tabs: {
    notices: {
      searchPlaceholder: "공지 제목 또는 서비스 검색",
      primaryAction: "공지 DB 보기",
      secondaryAction: "정렬",
      emptyMessage: "공지 데이터가 없습니다.",
      columns: ["공지 ID", "서비스", "유형", "제목", "게시 / 예약일", "노출 상태", "관리"],
      rows: [
        {
          statusKey: "active",
          searchText: "제주항공 점검 공지",
          cells: ["N-001", "제주항공", "공지", "시스템 점검 안내", "2026-03-24", "노출", "관리"],
        },
      ],
    },
    faqs: {
      searchPlaceholder: "FAQ 질문 또는 서비스 검색",
      primaryAction: "FAQ DB 보기",
      secondaryAction: "정렬",
      emptyMessage: "FAQ 데이터가 없습니다.",
      columns: ["FAQ ID", "서비스", "질문 유형", "질문", "등록일", "노출 상태", "관리"],
      rows: [
        {
          statusKey: "inactive",
          searchText: "제주 스테이 예약 취소",
          cells: ["F-014", "제주스테이", "예약", "제주 스테이 예약 취소는 어떻게 하나요?", "2026-03-23", "비노출", "관리"],
        },
      ],
    },
    categories: {
      searchPlaceholder: "서비스 또는 카테고리 코드 검색",
      primaryAction: "분류 DB 보기",
      secondaryAction: "정렬",
      emptyMessage: "문의 카테고리 데이터가 없습니다.",
      columns: ["카테고리 ID", "서비스", "코드 / 정렬", "이름", "설명", "노출 상태", "관리"],
      rows: [
        {
          statusKey: "draft",
          searchText: "예약 변경 분류",
          cells: ["C-003", "제주스테이", "예약 / 변경", "예약 변경", "예약 변경 문의 분류", "예약 중", "관리"],
        },
      ],
    },
  },
};

const ADMIN_SECTION_TABLE_FIXTURES = {
  reservations: ADMIN_RESERVATIONS_TABLES,
  lodging: ADMIN_LODGING_TABLES,
  members: ADMIN_MEMBERS_TABLES,
  cms: ADMIN_CMS_TABLES,
};

const ADMIN_SECTION_CONFIG_PATHS = {
  reservations: path.resolve("front", "admin", "data", "reservations-config.js"),
  lodging: path.resolve("front", "admin", "data", "lodging-config.js"),
  members: path.resolve("front", "admin", "data", "members-config.js"),
  cms: path.resolve("front", "admin", "data", "cms-config.js"),
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

const routeScript = async (route, body) => {
  await route.fulfill({
    status: 200,
    contentType: "application/javascript; charset=utf-8",
    body,
  });
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

const installAdminRuntimeStubs = async (page) => {
  await page.route("**/cdn.jsdelivr.net/npm/chart.js**", async (route) => {
    await routeScript(route, ADMIN_CHART_STUB);
  });

  await page.route("**/unpkg.com/lucide@latest**", async (route) => {
    await routeScript(route, ADMIN_LUCIDE_STUB);
  });
};

const buildAdminConfigModuleBody = (filePath) => {
  const source = fs.readFileSync(filePath, "utf8");
  const shellExports = [
    "const forwardToShell = (method, ...args) => window.AdminShell?.[method]?.(...args);",
    "export const registerSection = (...args) => forwardToShell('registerSection', ...args);",
    "export const bootSection = (...args) => forwardToShell('bootSection', ...args);",
    "export const getSectionDefinition = (...args) => forwardToShell('getSectionDefinition', ...args);",
  ].join("\n");

  return `${source}\n${shellExports}\n`;
};

const installAdminConfigModuleShims = async (page) => {
  for (const [sectionId, filePath] of Object.entries(ADMIN_SECTION_CONFIG_PATHS)) {
    await page.route(`**/admin/data/${sectionId}-config.js`, async (route) => {
      await routeScript(route, buildAdminConfigModuleBody(filePath));
    });
  }
};

const installAdminApiMocks = async (page) => {
  await page.route("**/api/admin/**", async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;

    if (pathname.includes("/api/admin/dashboard")) {
      await routeJson(route, ADMIN_DASHBOARD_SEED);
      return;
    }

    const tableMatch = pathname.match(/\/api\/admin\/tables\/([^/]+)$/);
    if (tableMatch) {
      const sectionId = tableMatch[1];
      const tableFixture = ADMIN_SECTION_TABLE_FIXTURES[sectionId];
      if (tableFixture) {
        await routeJson(route, {
          success: true,
          data: tableFixture,
        });
        return;
      }
    }

    await route.continue();
  });
};

const installAdminSmokeFixtures = async (page, options = {}) => {
  const { session = ADMIN_SESSION } = options;

  await seedLocalStorageSession(page, session);
  await installAdminRuntimeStubs(page);
  await installAdminConfigModuleShims(page);
  await installAdminApiMocks(page);
};

const installOneShotRouteFailure = async (page, pattern, options = {}) => {
  const { status = 500, body = "<!doctype html><title>admin section failed</title>" } = options;
  let failed = false;

  await page.route(pattern, async (route) => {
    if (failed) {
      await route.continue();
      return;
    }

    failed = true;
    await route.fulfill({
      status,
      contentType: "text/html; charset=utf-8",
      body,
    });
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
  ADMIN_SECTION_TABLE_FIXTURES,
  ADMIN_SESSION,
  CUSTOMER_CENTER_FAQS,
  CUSTOMER_CENTER_NOTICES,
  CUSTOMER_CENTER_PUBLIC_SESSION,
  CUSTOMER_CENTER_TICKETS,
  CUSTOMER_CENTER_MEMBER_SESSION,
  MYPAGE_SESSION,
  installAdminDashboardMock,
  installAdminSession,
  installAdminSmokeFixtures,
  installOneShotRouteFailure,
  installCustomerCenterSmokeMocks,
  installMypageSession,
  routeJson,
  seedLocalStorageSession,
};
