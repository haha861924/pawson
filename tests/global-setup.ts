import { chromium } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const AUTH_STATE_PATH = "tests/.auth/user.json";
const EMAIL = process.env.E2E_EMAIL ?? "e2e@pawson.test";
const PASSWORD = process.env.E2E_PASSWORD ?? "TestPawson123";

export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Try login first (user may already exist from a previous run)
  await page.goto(`${BASE_URL}/auth/login`);
  await page.getByLabel("電子郵件").fill(EMAIL);
  await page.getByLabel("密碼").fill(PASSWORD);
  await page.getByRole("button", { name: "登入", exact: true }).click();

  // Wait up to 15s for any navigation after login attempt
  const afterLogin = await page
    .waitForURL((url) => !url.href.endsWith("/auth/login"), { timeout: 15000 })
    .then(() => page.url())
    .catch(() => page.url());

  if (afterLogin.includes("/auth/login") || afterLogin.includes("/auth/")) {
    await page.goto(`${BASE_URL}/auth/register`);
    await page.getByLabel("名稱").fill("E2E 測試帳號");
    await page.getByLabel("電子郵件").fill(EMAIL);
    await page.getByLabel("密碼").fill(PASSWORD);
    await page.getByRole("button", { name: "建立帳號" }).click();
    // Registration includes bcrypt + DB insert, allow up to 30s
    await page.waitForURL((url) => !url.pathname.startsWith("/auth/"), { timeout: 30000 });
  }

  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
