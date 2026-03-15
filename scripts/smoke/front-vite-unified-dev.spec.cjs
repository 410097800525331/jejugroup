const { test, expect } = require("@playwright/test");
const { spawn, execFileSync } = require("node:child_process");
const path = require("node:path");

const HOST = "127.0.0.1";
const PORT = 4311;
const BASE_URL = `http://${HOST}:${PORT}`;
const ROOT_DIR = path.resolve(__dirname, "..", "..");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async (url, timeoutMs = 30000) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch (error) {
      await wait(250);
      continue;
    }

    await wait(250);
  }

  throw new Error(`통합 Vite 서버 대기 시간 초과: ${url}`);
};

const killProcessTree = (pid) => {
  if (!pid) {
    return;
  }

  try {
    execFileSync("taskkill", ["/pid", String(pid), "/t", "/f"], {
      stdio: "ignore",
    });
  } catch (error) {
    return;
  }
};

test.describe("unified front vite dev server", () => {
  let devServerProcess;

  test.beforeAll(async () => {
    devServerProcess = spawn("cmd.exe", ["/c", "pnpm", "run", "dev:front"], {
      cwd: ROOT_DIR,
      env: {
        ...process.env,
        FRONT_VITE_PORT: String(PORT),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    await waitForServer(`${BASE_URL}/index.html`);
  });

  test.afterAll(async () => {
    killProcessTree(devServerProcess?.pid);
  });

  test("main landing routes to customer center on same origin", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, {
      waitUntil: "domcontentloaded",
    });

    const customerCenterLink = page.locator('[data-route="CS.CUSTOMER_CENTER"]').first();
    await expect(customerCenterLink).toBeVisible();

    await customerCenterLink.click();

    await expect(page).toHaveURL(`${BASE_URL}/pages/cs/customer_center.html`);
    await expect(page).toHaveTitle("제주항공 통합 고객센터");
  });

  test("main landing scroll down control moves to next section", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page.locator(".scroll-down")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));

    const beforeScrollY = await page.evaluate(() => window.scrollY);
    await page.locator(".scroll-down").click({ force: true });
    await page.waitForTimeout(1600);
    const afterScrollY = await page.evaluate(() => window.scrollY);

    expect(afterScrollY).toBeGreaterThan(beforeScrollY + 100);
  });

  test("main landing wheel scroll moves one full section", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, {
      waitUntil: "domcontentloaded",
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    const beforeScrollY = await page.evaluate(() => window.scrollY);

    await page.evaluate(() => {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1200, cancelable: true }));
    });

    await page.waitForTimeout(1600);

    const afterScrollY = await page.evaluate(() => window.scrollY);
    expect(afterScrollY).toBeGreaterThan(beforeScrollY + 500);
  });

  test("login page renders on unified dev server", async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/auth/login.html`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page.locator("#jeju-page-shell-header .logo-link")).toBeVisible();
    await expect(page.locator("h1.login-title")).toBeVisible();
    await expect(page.locator("#id")).toBeVisible();
    await expect(page.locator("button.login-btn")).toBeVisible();
  });

  test("hotel landing renders on unified dev server", async ({ page }) => {
    await page.goto(`${BASE_URL}/jejustay/pages/hotel/jejuhotel.html`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveTitle(/JEJU STAY/);
    await expect(page.locator(".hero-subtitle-top")).toBeVisible();
    await expect(page.locator("#hotel-header-placeholder .hotel-shell-header")).toBeVisible();
  });

  test("jeju air landing renders on unified dev server", async ({ page }) => {
    await page.goto(`${BASE_URL}/jejuair/index.html`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveTitle(/제주항공/);
    await expect(page.locator(".swiper.mySwiper")).toBeVisible();
    await expect(page.locator('.allmore_btn.route-link[data-route="SERVICES.AIR.BOOKING.ROUTE"]').first()).toBeVisible();
  });

  test("admin dashboard renders on unified dev server", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/pages/dashboard.html`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveTitle(/관리자 대시보드/);
    await expect(page.locator("#admin-sidebar-toggle")).toBeVisible();
    await expect(page.locator("#admin-user-name")).toContainText("로컬 관리자");
  });

  test("bootstrap route points to live shell bootstrap source", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/components/runtime/bootstrap.js`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toContainText("/apps/shell/src/runtime/bootstrap.js");
  });

  test("backup path is excluded from unified dev server", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/backup/README.md`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).toContainText("Not Found");
  });
});
