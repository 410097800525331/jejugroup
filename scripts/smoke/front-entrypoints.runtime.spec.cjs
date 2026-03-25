const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const { expectNoRuntimeIssues, createIssueTracker } = require("./helpers/runtime-issues.cjs");
const { createStaticServerController } = require("./helpers/static-server.cjs");
const {
  installAdminSmokeFixtures,
  installCustomerCenterSmokeMocks,
  installMypageSession,
  installOneShotRouteFailure,
} = require("./helpers/smoke-fixtures.cjs");

const HOST = "127.0.0.1";
const PORT = 4174;
const ROOT_DIR = path.resolve("front");
const GENERATED_WEBAPP_OVERLAY_DIR = path.resolve("front", ".generated", "webapp-overlay");
const ADMIN_DASHBOARD_RUNTIME_TITLE = "제주 그룹 관리자 대시보드";
const ADMIN_RUNTIME_TITLES = {
  dashboard: ADMIN_DASHBOARD_RUNTIME_TITLE,
  reservations: "예약 관리",
  lodging: "숙박 관리",
  members: "회원 관리",
  cms: "CMS 관리",
};
const ENTRY_POINTS = [
  path.join(ROOT_DIR, "index.html"),
  path.join(ROOT_DIR, "admin", "pages", "dashboard.html"),
  path.join(ROOT_DIR, "jejuair", "index.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "about", "about.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "baggage", "cabinBaggage.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "baggage", "liability.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "baggage", "preorderedBaggage.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "baggage", "transportLimitation.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "boarding", "eDocument.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "boarding", "fastProcedure.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "boarding", "viewCheckin.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "booking", "Availability.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "booking", "payment.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "booking", "route.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "booking", "viewOnOffReservationList.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "event", "event.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "jmembers", "jmembersAirplane.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "jmembers", "jmembersGolf.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "jmembers", "jmembersInsurance.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "jmembers", "jmembersSightseeing.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "pet", "petPass.html"),
  path.join(ROOT_DIR, "jejuair", "pages", "pet", "petService.html"),
  path.join(ROOT_DIR, "pages", "auth", "login.html"),
  path.join(ROOT_DIR, "pages", "auth", "signup.html"),
  path.join(ROOT_DIR, "pages", "auth", "pass_auth.html"),
  path.join(ROOT_DIR, "pages", "auth", "oauth_callback.html"),
  path.join(ROOT_DIR, "pages", "mypage", "dashboard.html"),
  path.join(ROOT_DIR, "jejustay", "pages", "hotel", "jejuhotel.html"),
  path.join(ROOT_DIR, "jejustay", "pages", "travel", "travel_checklist.html"),
];
const server = createStaticServerController({
  fallbackPath: "/index.html",
  host: HOST,
  port: PORT,
  rootDirs: [GENERATED_WEBAPP_OVERLAY_DIR, ROOT_DIR],
});

const ADMIN_DIRECT_ENTRY_CASES = [
  {
    sectionId: "dashboard",
    path: "/admin/pages/dashboard.html",
    assertVisible: async (page) => {
      await expect(page.locator("#admin-main-chart")).toBeVisible();
      await expect(page.locator("#admin-kpi-grid .admin-card")).toHaveCount(4);
      await expect(page.locator("#admin-domain-filters .segment-btn.active")).toHaveText("전체(종합)");
    },
  },
  {
    sectionId: "reservations",
    path: "/admin/pages/reservations.html",
    assertVisible: async (page) => {
      await expect(page.locator("#reservations-table-body tr")).toContainText("예약 관리");
      await expect(page.locator("#admin-domain-filters .segment-btn.active")).toHaveText("예약");
    },
  },
  {
    sectionId: "lodging",
    path: "/admin/pages/lodging.html",
    assertVisible: async (page) => {
      await expect(page.locator("#lodging-table-body tr")).toContainText("객실 운영");
      await expect(page.locator('#admin-domain-filters .segment-btn.active')).toHaveText("STAY");
    },
  },
  {
    sectionId: "members",
    path: "/admin/pages/members.html",
    assertVisible: async (page) => {
      await expect(page.locator("#members-table-body tr")).toContainText("홍민지");
      await expect(page.locator('#admin-domain-filters .segment-btn.active')).toHaveText("회원");
    },
  },
  {
    sectionId: "cms",
    path: "/admin/pages/cms.html",
    assertVisible: async (page) => {
      await expect(page.locator("#cms-table-body tr")).toContainText("시스템 점검 안내");
      await expect(page.locator('#admin-domain-filters .segment-btn.active')).toHaveText("공지사항");
    },
  },
];

const JEJUAIR_DIRECT_ENTRY_CASES = [
  "/jejuair/pages/baggage/cabinBaggage.html",
  "/jejuair/pages/baggage/liability.html",
  "/jejuair/pages/baggage/preorderedBaggage.html",
  "/jejuair/pages/baggage/transportLimitation.html",
  "/jejuair/pages/boarding/eDocument.html",
  "/jejuair/pages/boarding/fastProcedure.html",
  "/jejuair/pages/boarding/viewCheckin.html",
  "/jejuair/pages/booking/Availability.html",
  "/jejuair/pages/booking/payment.html",
  "/jejuair/pages/booking/route.html",
  "/jejuair/pages/booking/viewOnOffReservationList.html",
  "/jejuair/pages/event/event.html",
  "/jejuair/pages/jmembers/jmembersAirplane.html",
  "/jejuair/pages/jmembers/jmembersGolf.html",
  "/jejuair/pages/jmembers/jmembersInsurance.html",
  "/jejuair/pages/jmembers/jmembersSightseeing.html",
  "/jejuair/pages/pet/petPass.html",
  "/jejuair/pages/pet/petService.html",
];

async function assertJejuAirDirectEntry(page, pathName) {
  await page.goto(server.url(pathName), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle(/제주항공/);
  await expect(page.locator("body")).toHaveClass(/jejuair-main-content/);
  await expect(page.locator("header#header_wrap")).toBeVisible();
  await expect(page.locator("footer#footer_wrap")).toBeVisible();
}

async function waitForAdminShellReady(page) {
  await page.waitForFunction(() => {
    const userName = document.querySelector("#admin-user-name")?.textContent?.trim();
    const menuLinks = document.querySelectorAll("#admin-sidebar-menu a[data-admin-section]");
    return userName === "로컬 관리자" && menuLinks.length > 0;
  }, { timeout: 15000 });
}

test.beforeAll(async () => {
  for (const entryPoint of ENTRY_POINTS) {
    expect(fs.existsSync(entryPoint), `${entryPoint} entrypoint missing`).toBeTruthy();
  }

  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("main landing smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/index.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator("#header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator(".hero-title")).toBeVisible();
  await expect(page.locator(".hero-subtitle")).toBeVisible();
  await expect(page.locator('[data-route="SERVICES.AIR.MAIN"] .cta-button')).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("main landing customer center link routes to bundled customer center page", async ({ page }) => {
  await installCustomerCenterSmokeMocks(page);

  await page.goto(server.url("/index.html"), {
    waitUntil: "domcontentloaded",
  });

  const customerCenterLink = page.locator('[data-route="CS.CUSTOMER_CENTER"]').first();
  await expect(customerCenterLink).toBeVisible();

  await customerCenterLink.click();

  await expect(page).toHaveURL(server.url("/pages/cs/customer_center.html"));
  await expect(page.locator("#root")).toBeVisible();
  await expect(page).toHaveTitle("제주항공 통합 고객센터");
});

test("login page smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/login.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator("h1.login-title")).toBeVisible();
  await expect(page.locator("#id")).toBeVisible();
  await expect(page.locator("button.login-btn")).toBeVisible();
  await expect(page.locator('[data-state="idle"]')).toBeVisible();

  expectNoRuntimeIssues(issues);
});

for (const testCase of ADMIN_DIRECT_ENTRY_CASES) {
  test(`admin direct entry smoke: ${testCase.sectionId}`, async ({ page }) => {
    const issues = createIssueTracker(page);

  await installAdminSmokeFixtures(page);
  await page.goto(server.url(testCase.path), {
    waitUntil: "domcontentloaded",
  });

  await waitForAdminShellReady(page);
  await expect(page).toHaveTitle(ADMIN_RUNTIME_TITLES[testCase.sectionId]);
  await expect(page.locator(`#admin-sidebar-menu a[data-admin-section="${testCase.sectionId}"]`)).toHaveClass(/active/);
  await expect(page.locator("#admin-sidebar-toggle")).toBeVisible();
  await expect(page.locator("#admin-user-name")).toContainText("로컬 관리자");
  await testCase.assertVisible(page);

    expectNoRuntimeIssues(issues);
  });
}

test("admin shell switches sections without full reload", async ({ page }) => {
  const issues = createIssueTracker(page);

  await installAdminSmokeFixtures(page);

  await page.goto(server.url("/admin/pages/dashboard.html"), {
    waitUntil: "domcontentloaded",
  });

  await waitForAdminShellReady(page);
  await expect(page).toHaveTitle(ADMIN_RUNTIME_TITLES.dashboard);

  const documentMarker = await page.evaluate(() => {
    window.__adminSmokeDocumentMarker = `doc-${Math.random().toString(36).slice(2)}`;
    return window.__adminSmokeDocumentMarker;
  });

  await page.locator('#admin-sidebar-menu a[data-admin-section="lodging"]').click();

  await expect(page).toHaveURL(server.url("/admin/pages/lodging.html"));
  await expect(page).toHaveTitle(ADMIN_RUNTIME_TITLES.lodging);
  await expect(page.locator('#admin-sidebar-menu a[data-admin-section="lodging"]')).toHaveClass(/active/);
  await expect(page.locator("#lodging-table-body tr")).toContainText("객실 운영");
  expect(await page.evaluate(() => window.__adminSmokeDocumentMarker)).toBe(documentMarker);

  expectNoRuntimeIssues(issues);
});

test("admin shell restores cms state after failed section switch", async ({ page }) => {
  const issues = createIssueTracker(page);

  await installAdminSmokeFixtures(page);

  await page.goto(server.url("/admin/pages/cms.html"), {
    waitUntil: "domcontentloaded",
  });

  await waitForAdminShellReady(page);
  await expect(page).toHaveTitle(ADMIN_RUNTIME_TITLES.cms);
  const documentMarker = await page.evaluate(() => {
    window.__adminSmokeDocumentMarker = `doc-${Math.random().toString(36).slice(2)}`;
    return window.__adminSmokeDocumentMarker;
  });
  await page.locator('#admin-domain-filters .segment-btn[data-domain="faqs"]').click();
  await page.locator('.admin-table-actions input[type="text"]').fill("제주");
  await page.locator('#cms-status-filter').selectOption("inactive");

  await expect(page.locator("#cms-table-body tr")).toContainText("예약 취소는 어떻게 하나요?");
  await expect(page.locator('.admin-table-actions input[type="text"]')).toHaveValue("제주");
  await expect(page.locator('#cms-status-filter')).toHaveValue("inactive");

  const beforeRollback = await page.evaluate(() => ({
    section: document.body.dataset.adminSection,
    tab: document.querySelector('#admin-domain-filters .segment-btn.active')?.dataset.domain,
    search: document.querySelector('.admin-table-actions input[type="text"]')?.value,
    status: document.querySelector('#cms-status-filter')?.value,
    marker: window.__adminSmokeDocumentMarker,
  }));

  await installOneShotRouteFailure(page, "**/admin/pages/members.html");
  await page.locator('#admin-sidebar-menu a[data-admin-section="members"]').click();

  await expect(page).toHaveURL(server.url("/admin/pages/cms.html"));
  await expect(page).toHaveTitle(ADMIN_RUNTIME_TITLES.cms);
  await expect(page.locator('#admin-sidebar-menu a[data-admin-section="cms"]')).toHaveClass(/active/);
  await expect(page.locator('#admin-domain-filters .segment-btn.active')).toHaveAttribute("data-domain", "faqs");
  await expect(page.locator('.admin-table-actions input[type="text"]')).toHaveValue("제주");
  await expect(page.locator('#cms-status-filter')).toHaveValue("inactive");
  await expect(page.locator("#cms-table-body tr")).toContainText("예약 취소는 어떻게 하나요?");
  expect(await page.evaluate(() => window.__adminSmokeDocumentMarker)).toBe(documentMarker);

  const afterRollback = await page.evaluate(() => ({
    section: document.body.dataset.adminSection,
    tab: document.querySelector('#admin-domain-filters .segment-btn.active')?.dataset.domain,
    search: document.querySelector('.admin-table-actions input[type="text"]')?.value,
    status: document.querySelector('#cms-status-filter')?.value,
    marker: window.__adminSmokeDocumentMarker,
  }));

  expect(afterRollback).toEqual(beforeRollback);
  const expectedRollbackFailure = `500 ${server.url("/admin/pages/members.html")}`;
  const filteredResponseErrors = [...issues.responseErrors];
  const expectedFailureIndex = filteredResponseErrors.indexOf(expectedRollbackFailure);

  if (expectedFailureIndex !== -1) {
    filteredResponseErrors.splice(expectedFailureIndex, 1);
  }

  expectNoRuntimeIssues({
    ...issues,
    responseErrors: filteredResponseErrors,
  });
});

test("jeju air landing smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/jejuair/index.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle(/제주항공/);
  await expect(page.locator(".swiper.mySwiper")).toBeVisible();
  await expect(page.locator('.allmore_btn.route-link[data-route="SERVICES.AIR.BOOKING.ROUTE"]').first()).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("jeju air about direct entry smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/jejuair/pages/about/about.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("제주항공");
  await expect(page.locator(".header_intro_section")).toBeVisible();
  await expect(page.locator(".eco_ideas_list .eco_idea_item")).toHaveCount(3);
  await expect(page.locator("footer")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

for (const pathName of JEJUAIR_DIRECT_ENTRY_CASES) {
  test(`jeju air direct entry smoke: ${pathName}`, async ({ page }) => {
    const issues = createIssueTracker(page);

    await assertJejuAirDirectEntry(page, pathName);

    expectNoRuntimeIssues(issues);
  });
}

test("oauth callback page smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/oauth_callback.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("OAuth Callback Placeholder");
  await expect(page.locator("body > h1")).toHaveText(/OAuth/i);

  expectNoRuntimeIssues(issues);
});

test("login air shell footer smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/login.html?shell=air"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator(".company_info h3")).toHaveText(/\(주\)\s*제주항공/);
  await expect(page.locator('a[data-route="SERVICES.AIR.ABOUT.COMPANY"]').first()).toBeVisible();
  await expect(page.locator('footer a[href="https://www.youtube.com/@jejuair_official"]').first()).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("signup page smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/signup.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator("#jeju-signup-app .signup-container")).toBeVisible();
  await expect(page.locator("#termAll")).toBeVisible();
  await expect(page.locator(".step-title")).toBeVisible();
  await expect(page.locator(".form-actions .btn-flat")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("pass auth page smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/pass_auth.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator("#jeju-pass-auth-app .pass-modal-content")).toBeVisible({ timeout: 10000 });
  await expect(page.locator(".pass-logo-red")).toHaveText("PASS");
  await expect(page.getByRole("button", { exact: true, name: "SKT" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "KT" })).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("mypage dashboard smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await installMypageSession(page);

  await page.goto(server.url("/pages/mypage/dashboard.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator("#mypage-dashboard-root .meta-dashboard-layout")).toBeVisible();
  await expect(page.locator(".full-width-trip-list")).toBeVisible();
  await expect(page.getByRole("heading", { name: /홍민지 님 어서오세요!/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "예약 현황" })).toBeVisible();
  await expect(page.locator(".summary-stats-column .stat-card").first()).toContainText("보유 포인트");

  expectNoRuntimeIssues(issues);
});

test("jeju stay hotel landing smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/jejustay/pages/hotel/jejuhotel.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle(/JEJU STAY/);
  await expect(page.locator(".hero-subtitle-top")).toBeVisible();
  await expect(page.locator(".deals-section .section-title")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("jeju stay travel checklist smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/jejustay/pages/travel/travel_checklist.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle(/JEJU STAY/);
  await expect(page.locator("#jeju-travel-checklist-app .travel-checklist-shell")).toBeVisible();
  await expect(page.locator(".travel-checklist-progress-card")).toBeVisible();
  await expect(page.locator(".travel-checklist-section-card")).toHaveCount(4);

  expectNoRuntimeIssues(issues);
});
