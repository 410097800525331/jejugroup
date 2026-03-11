const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const { expectNoRuntimeIssues, createIssueTracker } = require("./helpers/runtime-issues.cjs");
const { createStaticServerController } = require("./helpers/static-server.cjs");

const HOST = "127.0.0.1";
const PORT = 4174;
const ROOT_DIR = path.resolve("front");
const ENTRY_POINTS = [
  path.join(ROOT_DIR, "index.html"),
  path.join(ROOT_DIR, "pages", "auth", "login.html"),
  path.join(ROOT_DIR, "pages", "auth", "signup.html"),
  path.join(ROOT_DIR, "pages", "auth", "pass_auth.html"),
  path.join(ROOT_DIR, "pages", "mypage", "dashboard.html"),
  path.join(ROOT_DIR, "jejustay", "pages", "hotel", "jejuhotel.html"),
];
const server = createStaticServerController({
  fallbackPath: "/index.html",
  host: HOST,
  port: PORT,
  rootDir: ROOT_DIR,
});

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

  await expect(page.locator(".hero-title")).toBeVisible();
  await expect(page.locator(".hero-subtitle")).toBeVisible();
  await expect(page.locator('[data-route="SERVICES.AIR.MAIN"] .cta-button')).toBeVisible();

  expectNoRuntimeIssues(issues);
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

test("login air shell footer smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/login.html?shell=air"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator(".company_info h3")).toHaveText(/\(주\)\s*제주항공/);
  await expect(page.locator('a[data-route="SERVICES.AIR.ABOUT.COMPANY"]').first()).toBeVisible();
  await expect(page.locator('img[alt="유튜브"]')).toBeVisible();

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

  await expect(page.locator("#jeju-pass-auth-app .pass-modal-content")).toBeVisible();
  await expect(page.locator(".pass-logo-red")).toHaveText("PASS");
  await expect(page.getByRole("button", { exact: true, name: "SKT" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "KT" })).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("mypage dashboard smoke", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/mypage/dashboard.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator("#mypage-dashboard-root .meta-dashboard-layout")).toBeVisible();
  await expect(page.locator(".full-width-trip-list")).toBeVisible();
  await expect(page.getByText("Jeju Ocean Suite")).toBeVisible();

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
