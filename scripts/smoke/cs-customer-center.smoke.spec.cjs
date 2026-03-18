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
  await expect(page.getByRole("button", { name: "챗봇" })).toBeVisible();

  await page.getByRole("button", { name: "챗봇" }).click();
  await expect.poll(() => dialogMessage).toContain("챗봇");

  await page.getByRole("textbox").fill("환불");
  await expect(page.getByText("2026년 2월 제주항공 신규 노선 운항 안내")).toBeVisible();

  await page.getByRole("link", { name: "공지사항 확인" }).click();
  await expect(page).toHaveURL(/#\/notices$/);
  await expect(page.getByText("공지사항")).toBeVisible();

  expectNoRuntimeIssues(issues);
});

test("공지 라우트 스모크 체크", async ({ page }) => {
  const issues = createIssueTracker(page);

  await page.goto(server.url("/cs/customer_center.html#/notices"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByText("공지사항")).toBeVisible();
  await expect(page.getByRole("link", { name: "메인 고객센터" })).toBeVisible();

  await page.getByRole("textbox").fill("방콕");
  await expect(page.getByText("2026년 2월 제주항공 신규 노선 운항 안내")).toBeVisible();
  await expect(
    page.getByText("새소식과 운임 공지를 확인해 보세요"),
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

test("1:1 문의 라우트 스모크 체크 (인증 기반 플로우)", async ({ page }) => {
  const issues = createIssueTracker(page);
  let dialogMessage = "";

  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await page.goto(server.url("/cs/customer_center.html#/inquiries"), {
    waitUntil: "networkidle",
  });

  await expect(page.getByText("나의 문의 내역")).toBeVisible();
  
  // 문의하기 클릭 (비로그인 상태 -> 컨펌창 뜸 -> dialog handler가 자동 수락 -> 자동 로그인됨)
  await page.getByRole("button", { name: /문의하기/ }).click();
  
  // 로그인 성공 후 문의 폼 확인
  await expect(page.getByText("1:1 문의 제출하기")).toBeVisible();
  await expect(page.getByText("님 계정으로 작성 중입니다.")).toBeVisible();

  // 로그인 상태에서는 개인정보 필드(이름, 이메일, 연락처)가 보이지 않아야 함
  await expect(page.getByPlaceholder("성함 입력")).not.toBeVisible();
  await expect(page.getByPlaceholder("010-0000-0000")).not.toBeVisible();
  await expect(page.getByPlaceholder("example@jejuair.com")).not.toBeVisible();

  // 서비스와 유형 선택
  const submitButton = page.getByRole("button", { name: /제출하기/i });
  await page.selectOption("#service", "jeju-air");
  await page.selectOption("#inquiryType", "reservation");

  // 제목 및 내용 입력 (로그인 상태이므로 필수 정보는 이미 채워짐)
  await page.getByPlaceholder(/제목 입력/).fill("로그인 유저 스모크 테스트 제목");
  await page.getByPlaceholder(/상세 문의 내용/).fill("로그인 유저 스모크 테스트 상세 내용입니다. 10자 이상.");
  await page.getByLabel(/개인정보 수집 및 이용에 동의합니다/).check();

  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Mock 제출 후 알림창 확인
  await expect.poll(() => dialogMessage).toContain("성공적으로 접수되었습니다");
  
  // 목록으로 돌아왔는지 확인 (혹은 홈)
  await expect(page).toHaveURL(/#\/inquiries$/);

  expectNoRuntimeIssues(issues);
});
