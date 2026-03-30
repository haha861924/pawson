import { test, expect } from "@playwright/test";

test.describe("飼料管理", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`飼料測試_${Date.now()}`);
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

  test("飼料頁面初始顯示無計劃", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding`);
    await expect(page.getByText("尚未設定飼料計劃")).toBeVisible();
    await expect(page.getByText("尚無餵食記錄")).toBeVisible();
  });

  test("可以建立飼料計劃", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/plan/new`);
    await expect(page.getByRole("heading", { name: "新增飼料計劃" })).toBeVisible();

    await page.getByLabel("飼料名稱 *").fill("皇家小型犬");
    await page.getByLabel("品牌").fill("Royal Canin");
    await page.getByLabel("每餐份量 (g) *").fill("80");

    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "每日兩餐" }).click();

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/feeding`);
    await expect(page.getByText("皇家小型犬")).toBeVisible();
    await expect(page.getByText("80 g")).toBeVisible();
    await expect(page.getByText("每日兩餐")).toBeVisible();
  });

  test("記錄餵食時預填飼料計劃資料", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/new`);
    await expect(page.getByLabel("飼料名稱 *")).toHaveValue("皇家小型犬");
    await expect(page.getByLabel("份量 (g) *")).toHaveValue("80");
  });

  test("可以記錄餵食", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/new`);

    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "早餐" }).click();

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/feeding`);
    await expect(page.getByText("早餐")).toBeVisible();
  });
});
