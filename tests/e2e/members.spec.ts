import { test, expect } from "@playwright/test";

test.describe("成員管理", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`成員測試_${Date.now()}`);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/pets\/(?!new)[^/]+$/);
    petId = page.url().split("/pets/")[1];
    await ctx.close();
  });

  test.afterAll(async ({ browser }) => {
    if (!petId) return;
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto(`/pets/${petId}`);
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除寵物" }).click();
    await page.waitForURL("/pets");
    await ctx.close();
  });

  test("成員頁面顯示飼主資訊", async ({ page }) => {
    await page.goto(`/pets/${petId}/members`);
    await expect(page.getByRole("heading", { name: "成員管理" })).toBeVisible();
    await expect(page.getByText("飼主")).toBeVisible();
    await expect(page.getByText("邀請共同扶養者")).toBeVisible();
  });

  test("成員分頁在導覽列可見（飼主限定）", async ({ page }) => {
    await page.goto(`/pets/${petId}`);
    await expect(page.getByRole("link", { name: "成員" })).toBeVisible();
  });

  test("邀請未註冊的電子郵件顯示錯誤", async ({ page }) => {
    await page.goto(`/pets/${petId}/members`);
    await page.getByLabel("電子郵件").fill("notregistered@example.com");
    await page.getByRole("button", { name: "邀請" }).click();
    await expect(page.getByText("找不到此電子郵件的使用者")).toBeVisible();
  });

  test("邀請自己的電子郵件顯示錯誤", async ({ page }) => {
    const EMAIL = process.env.E2E_EMAIL ?? "e2e@pawson.test";
    await page.goto(`/pets/${petId}/members`);
    await page.getByLabel("電子郵件").fill(EMAIL);
    await page.getByRole("button", { name: "邀請" }).click();
    await expect(page.getByText("無法邀請自己")).toBeVisible();
  });
});
