const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const { expectNoRuntimeIssues, createIssueTracker } = require("./helpers/runtime-issues.cjs");
const { createStaticServerController } = require("./helpers/static-server.cjs");

const HOST = "127.0.0.1";
const PORT = 4173;
const ROOT_DIR = path.resolve("front", ".generated", "webapp-overlay", "pages");
const ENTRY_PATH = path.join(ROOT_DIR, "cs", "customer_center.html");
const server = createStaticServerController({
  fallbackPath: "/cs/customer_center.html",
  host: HOST,
  port: PORT,
  rootDir: ROOT_DIR,
});

test.beforeAll(async () => {
  expect(fs.existsSync(ENTRY_PATH), `${ENTRY_PATH} 산출물 누락 상태`).toBeTruthy();
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("홈 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);
  let dialogMessage = "";

  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await page.goto(server.url("/cs/customer_center.html"), {
    waitUntil: "networkidle",
  });

  await expect(page).toHaveTitle("제주항공 통합 고객센터");
  await expect(page.locator("#root")).toBeVisible();
  await expect(page.getByText("세 가지 서비스, 하나의 완벽한 여행")).toBeVisible();
  await expect(page.getByRole("button", { name: "팻봇" })).toBeVisible();

  await page.getByRole("button", { name: "팻봇" }).click();
  await expect.poll(() => dialogMessage).toContain("팻봇");

  await page.getByRole("textbox").fill("환불");
  await expect(page.getByText("2026년 2월 제주항공 신규 노선 운항 안내")).toBeVisible();

  await page.getByRole("link", { name: "공지사항 확인" }).click();
  await expect(page).toHaveURL(/#\/notices$/);
  await expect(page.getByText("LATEST ANNOUNCEMENTS")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("공지 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/cs/customer_center.html#/notices"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByText("LATEST ANNOUNCEMENTS")).toBeVisible();
  await expect(page.getByRole("link", { name: "메인 고객센터로 돌아가기" })).toBeVisible();

  await page.getByRole("textbox").fill("방콕");
  await expect(page.getByText("2026년 2월 제주항공 신규 노선 운항 안내")).toBeVisible();
  await expect(
    page.getByText("제주 그룹의 변화와 새로운 소식을 가장 입체적인 타임라인으로 확인하세요."),
  ).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("FAQ 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/cs/customer_center.html#/faqs"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByText("JEJU GROUP FAQ LIBRARY")).toBeVisible();

  await page.getByRole("textbox").fill("취소");
  const faqItems = page.locator("main button").filter({ has: page.locator("h3") });
  await expect(faqItems.first()).toBeVisible();
  await faqItems.first().click();
  await expect(
    page.getByText(
      "제주항공 웹사이트 또는 모바일 앱에서 '예약 조회'를 통해 예약 번호와 이메일을 입력하여 취소할 수 있습니다.",
    ),
  ).toBeVisible();

  expectNoRuntimeIssues(issues);
});
