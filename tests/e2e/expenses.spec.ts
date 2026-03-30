import { test, expect } from "@playwright/test";

test.describe("花費記錄", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`花費測試_${Date.now()}`);
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

  test("花費頁面顯示正確統計初始狀態", async ({ page }) => {
    await page.goto(`/pets/${petId}/expenses`);
    await expect(page.getByText("總花費")).toBeVisible();
    await expect(page.getByText("尚無花費記錄")).toBeVisible();
  });

  test("可以從寵物頁面新增花費", async ({ page }) => {
    await page.goto(`/pets/${petId}/expenses/new`);
    await expect(page.getByRole("heading", { name: "新增花費" })).toBeVisible();

    // Select category
    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "獸醫" }).click();

    await page.getByLabel("金額 (NT$) *").fill("1500");
    await page.getByLabel("說明 *").fill("年度健康檢查");

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/expenses`);
    await expect(page.getByText("年度健康檢查").first()).toBeVisible();
    await expect(page.getByText("獸醫").first()).toBeVisible();
  });

  test("全部花費統計頁面顯示該筆花費", async ({ page }) => {
    await page.goto("/expenses");
    await expect(page.getByRole("heading", { name: "全部花費統計" })).toBeVisible();
    await expect(page.getByText("年度健康檢查").first()).toBeVisible();
  });

  test("可以新增全域花費（從 /expenses/new）", async ({ page }) => {
    await page.goto("/expenses/new");

    // Pet selector should be visible
    await expect(page.locator("[data-slot=select-trigger]").first()).toBeVisible();

    // Select pet
    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option").first().click();

    // Select category
    await page.locator("[data-slot=select-trigger]").last().click();
    await page.getByRole("option", { name: "飼料" }).click();

    await page.getByLabel("金額 (NT$) *").fill("800");
    await page.getByLabel("說明 *").fill("每月飼料費");
    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL("/expenses");
    await expect(page.getByText("每月飼料費").first()).toBeVisible();
  });
});
