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
    expect(fs.existsSync(entryPoint), `${entryPoint} 진입점 누락 상태`).toBeTruthy();
  }

  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("메인 랜딩 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/index.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("제주 그룹 - 모든 여행을 제주그룹 하나로");
  await expect(page.getByText("모든 여행의 시작과 끝, 제주그룹이 함께합니다.")).toBeVisible();
  await expect(page.getByText("가장 빠르고 편안한 하늘길")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("로그인 페이지 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/login.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("로그인 | 제주그룹");
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  await expect(page.getByLabel("이메일/아이디")).toBeVisible();
  await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
  await expect(page.locator('[data-state="idle"]')).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("로그인 air shell footer 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/login.html?shell=air"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("로그인 | 제주그룹");
  await expect(page.getByText("(주)제주항공")).toBeVisible();
  await expect(page.getByRole("link", { name: "회사소개" }).first()).toBeVisible();
  await expect(page.getByAltText("유튜브")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("회원가입 페이지 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/signup.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("회원가입 | 제주그룹");
  await expect(page.getByRole("heading", { name: "약관동의" })).toBeVisible();
  await expect(page.getByText("전체 동의")).toBeVisible();
  await expect(page.getByRole("button", { name: "다음" })).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("PASS 인증 페이지 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/auth/pass_auth.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("PASS 인증 | 제주그룹");
  await expect(page.getByRole("heading", { name: "이용 중인 통신사를 선택해 주세요" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "SKT" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "KT" })).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("마이페이지 대시보드 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/pages/mypage/dashboard.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("마이페이지 | 제주그룹 통합 대시보드");
  await expect(page.getByText("통합 예약 관리")).toBeVisible();
  await expect(page.getByText("Jeju Ocean Suite")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("JEJU STAY 호텔 랜딩 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/jejustay/pages/hotel/jejuhotel.html"), {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveTitle("JEJU STAY | 전 세계 호텔 예약");
  await expect(page.getByText("전 세계 200만 개 이상의 호텔, 리조트, 펜션을 최저가로 예약")).toBeVisible();
  await expect(page.getByText("이달의 특가 호텔")).toBeVisible();

  expectNoRuntimeIssues(issues);
});
