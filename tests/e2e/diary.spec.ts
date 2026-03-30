import { test, expect } from "@playwright/test";
import { format } from "date-fns";

test.describe("健康日記", () => {
  let dogId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/dogs/new");
    await page.getByLabel("名字 *").fill(`日記測試_${Date.now()}`);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/dogs\/(?!new)[^/]+$/);
    dogId = page.url().split("/dogs/")[1];
    await ctx.close();
  });

  test.afterAll(async ({ browser }) => {
    if (!dogId) return;
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto(`/dogs/${dogId}`);
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除狗狗" }).click();
    await page.waitForURL("/dogs");
    await ctx.close();
  });

  test("健康日記頁面初始顯示空狀態", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary`);
    await expect(page.getByText("尚無健康紀錄")).toBeVisible();
    await expect(page.getByText("開始記錄狗狗的日常健康狀況")).toBeVisible();
  });

  test("可以新增包含體重的每日健康紀錄", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary/new`);

    // Fill in date
    const today = format(new Date(), "yyyy-MM-dd");
    await page.getByLabel("日期 *").fill(today);

    // Fill in weight
    await page.getByLabel("體重 (kg)").fill("25.5");

    // Select appetite
    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "良好" }).click();

    // Select stool condition
    await page.locator("[data-slot=select-trigger]").nth(1).click();
    await page.getByRole("option", { name: "正常" }).click();

    // Select mood
    await page.locator("[data-slot=select-trigger]").nth(2).click();
    await page.getByRole("option", { name: "活潑有精神" }).click();

    // Check vomiting checkbox
    await page.getByLabel("有嘔吐症狀").check();

    // Fill temperature
    await page.getByLabel("體溫 (°C)").fill("38.5");

    // Fill notes
    await page.getByLabel("其他症狀或備註").fill("今天特別活潑，飲食正常");

    await page.getByRole("button", { name: "儲存" }).click();

    // Verify redirect and display
    await expect(page).toHaveURL(`/dogs/${dogId}/diary`);
    await expect(page.getByText("25.5 kg")).toBeVisible();
    await expect(page.locator("text=飲食:").locator("..").getByText("良好")).toBeVisible();
    await expect(page.locator("text=排便:").locator("..").getByText("正常")).toBeVisible();
    await expect(page.locator("text=精神:").locator("..").getByText("活潑有精神")).toBeVisible();
    await expect(page.getByText("有嘔吐症狀")).toBeVisible();
    // Fix selector ambiguity: use parent locator to target specific element
    await expect(page.locator("text=體溫:").locator("..").getByText("38.5°C")).toBeVisible();
  });

  test("日曆視圖顯示已記錄的日期", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary`);

    // Calendar should be visible
    const calendar = page.locator("text=日 一 二 三 四 五 六");
    await expect(calendar).toBeVisible();

    // Should show current month/year in Chinese format
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(new RegExp(`${currentYear}年`))).toBeVisible();
  });

  test("體重圖表顯示數據", async ({ page }) => {
    // Add another weight record
    await page.goto(`/dogs/${dogId}/diary/new`);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await page.getByLabel("日期 *").fill(format(yesterday, "yyyy-MM-dd"));
    await page.getByLabel("體重 (kg)").fill("25.3");

    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(`/dogs/${dogId}/diary`);

    // Verify chart title is present
    await expect(page.getByText("體重趨勢圖")).toBeVisible();
  });

  test("可以刪除健康紀錄", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary`);

    // Find and click the first delete button
    const deleteButton = page.getByRole("button", { name: "刪除", exact: false }).first();
    await deleteButton.click();

    // Confirm deletion in dialog
    await page.getByRole("button", { name: "刪除" }).click();

    // Record should be removed - wait for the action to complete
    await page.waitForTimeout(500);
  });

  test("必填欄位驗證", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary/new`);

    // Clear the date field (it has a default value)
    await page.getByLabel("日期 *").clear();

    // Try to submit without required date
    await page.getByRole("button", { name: "儲存" }).click();

    // Should show validation error (HTML5 validation or page doesn't navigate)
    await expect(page).toHaveURL(`/dogs/${dogId}/diary/new`);
  });

  test("體重數值驗證", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary/new`);

    // Try negative weight
    await page.getByLabel("體重 (kg)").fill("-5");
    await page.getByRole("button", { name: "儲存" }).click();

    // Should show validation error
    await expect(page).toHaveURL(`/dogs/${dogId}/diary/new`);
  });

  test("體溫範圍驗證", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary/new`);

    // Try temperature out of range
    await page.getByLabel("體溫 (°C)").fill("50");
    await page.getByRole("button", { name: "儲存" }).click();

    // Should show validation error or be constrained by HTML input
    await expect(page).toHaveURL(`/dogs/${dogId}/diary/new`);
  });

  test("可以記錄僅包含備註的紀錄", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary/new`);

    const today = format(new Date(), "yyyy-MM-dd");
    await page.getByLabel("日期 *").fill(today);
    await page.getByLabel("其他症狀或備註").fill("今天沒有特別異常");

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/dogs/${dogId}/diary`);
    await expect(page.getByText("今天沒有特別異常")).toBeVisible();
  });

  test("最近紀錄列表顯示正確", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/diary`);

    // Should show "最近紀錄" section
    await expect(page.getByText("最近紀錄")).toBeVisible();

    // Should display date in Chinese format
    await expect(page.locator("text=/\\d{4}\\/\\d{2}\\/\\d{2}/")).toBeVisible();
  });
});
