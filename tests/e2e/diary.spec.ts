import { test, expect } from "@playwright/test";
import { format } from "date-fns";

test.describe("成長日誌", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`日誌測試_${Date.now()}`);
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

  test("日誌頁面初始顯示空狀態", async ({ page }) => {
    await page.goto(`/pets/${petId}/diary`);
    await expect(page.getByText("尚無日誌記錄")).toBeVisible();
  });

  test("可以新增日誌記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/diary/new`);
    await expect(page.getByRole("heading", { name: "新增日誌記錄" })).toBeVisible();

    const today = format(new Date(), "yyyy-MM-dd");
    await page.getByLabel("日期 *").fill(today);
    await page.getByLabel("體重 (kg)").fill("5.5");
    await page.getByLabel("體溫 (°C)").fill("38.5");
    await page.getByLabel("備註").fill("今日記錄");
    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/diary`);
    await expect(page.getByText("5.5 kg")).toBeVisible();
    await expect(page.getByText("38.5 °C")).toBeVisible();
    await expect(page.getByText("今日記錄")).toBeVisible();
  });

  test("日誌頁顯示日曆視圖", async ({ page }) => {
    await page.goto(`/pets/${petId}/diary`);
    await expect(page.getByText("日曆視圖")).toBeVisible();
  });

  test("可以刪除日誌記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/diary`);
    const deleteButtons = page.getByRole("button", { name: "刪除", exact: false });
    await deleteButtons.first().click();
    await page.getByRole("button", { name: "刪除" }).last().click();
    await page.waitForTimeout(300);
    await expect(page.getByText("尚無日誌記錄")).toBeVisible();
  });
});
