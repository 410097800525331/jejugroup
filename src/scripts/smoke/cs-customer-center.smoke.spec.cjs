const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const { expectNoRuntimeIssues, createIssueTracker } = require("./helpers/runtime-issues.cjs");
const { createStaticServerController } = require("./helpers/static-server.cjs");
const {
  installCustomerCenterSmokeMocks,
} = require("./helpers/smoke-fixtures.cjs");

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
  expect(fs.existsSync(ENTRY_PATH), `${ENTRY_PATH} 엔트리 파일이 없어`).toBeTruthy();
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("홈 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);
  let dialogMessage = "";

  await installCustomerCenterSmokeMocks(page);

  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await page.goto(server.url("/cs/customer_center.html"), {
    waitUntil: "networkidle",
  });

  await expect(page).toHaveTitle("제주항공 통합 고객센터");
  await expect(page.locator("#root")).toBeVisible();
  await expect(page.getByText("세 가지 서비스, 한 화면에서")).toBeVisible();
  await expect(page.getByRole("button", { name: "챗봇" })).toBeVisible();

  await page.getByRole("button", { name: "챗봇" }).click();
  await expect.poll(() => dialogMessage).toBe("지금은 읽기 전용이야. 문의가 필요하면 고객센터 1:1 문의를 써줘.");

  await page.getByRole("textbox").fill("방콕");
  await expect(page.getByText("2026년 2월 제주항공 신규 노선 운항 안내")).toBeVisible();

  await page.getByRole("link", { name: "공지사항 확인" }).click();
  await expect(page).toHaveURL(/#\/notices$/);
  await expect(page.getByText("공지사항")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("공지 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await installCustomerCenterSmokeMocks(page);

  await page.goto(server.url("/cs/customer_center.html#/notices"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByText("공지사항")).toBeVisible();
  await expect(page.getByRole("link", { name: "메인 고객센터" })).toBeVisible();

  await page.getByRole("textbox").fill("방콕");
  await expect(page.getByText("2026년 2월 제주항공 신규 노선 운항 안내")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("FAQ 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await installCustomerCenterSmokeMocks(page);

  await page.goto(server.url("/cs/customer_center.html#/faqs"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByText("FAQ Library")).toBeVisible();

  await page.getByRole("textbox").fill("취소");
  const faqItems = page.locator("main button").filter({ has: page.locator("h3") });
  await expect(faqItems.first()).toBeVisible();
  await faqItems.first().click();
  await expect(
    page.getByText("제주항공 웹사이트 또는 모바일 앱에서 '예약 조회'를 통해 예약 번호와 이메일을 입력하여 취소할 수 있습니다."),
  ).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("1:1 문의 라우트 스모크 체크 (인증 기반 플로우)", async ({ page }) => {
  const issues = createIssueTracker(page);

  await installCustomerCenterSmokeMocks(page, { authenticated: true });

  await page.goto(server.url("/cs/customer_center.html#/inquiries"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByRole("heading", { name: "내 문의 내역" })).toBeVisible();
  await expect(page.getByRole("button", { name: "문의하기" })).toBeVisible();
  await expect(page.getByRole("button", { name: /항공권 예약 변경 문의/ }).first()).toBeVisible();

  await page.getByRole("button", { name: /항공권 예약 변경 문의/ }).first().click();
  await expect(page.getByRole("heading", { name: "항공권 예약 변경 문의" })).toBeVisible();
  await expect(page.getByText("답변대기")).toBeVisible();

  await page.getByRole("button", { name: "문의하기" }).click();
  await expect(page.getByText("1:1 문의하기")).toBeVisible();
  await expect(page.getByText("홍민지 계정으로 작성 중이야")).toBeVisible();

  expectNoRuntimeIssues(issues);
});
