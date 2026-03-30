import { test, expect } from "@playwright/test";
import { format } from "date-fns";

test.describe("成長曲線", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`體重測試_${Date.now()}`);
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

  test("成長曲線頁面初始顯示空狀態", async ({ page }) => {
    await page.goto(`/pets/${petId}/weight`);
    await expect(page.getByText("尚無體重記錄")).toBeVisible();
  });

  test("可以新增體重記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/weight/new`);
    await expect(page.getByRole("heading", { name: "新增體重記錄" })).toBeVisible();

    await page.getByLabel("體重 (kg) *").fill("25.5");
    const today = format(new Date(), "yyyy-MM-dd");
    await page.getByLabel("日期 *").fill(today);
    await page.getByLabel("備註").fill("今天量的體重");
    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/weight`);
    await expect(page.getByText("25.5 kg")).toBeVisible();
    await expect(page.getByText("今天量的體重")).toBeVisible();
  });

  test("可以新增第二筆體重記錄並顯示圖表", async ({ page }) => {
    await page.goto(`/pets/${petId}/weight/new`);

    await page.getByLabel("體重 (kg) *").fill("25.3");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await page.getByLabel("日期 *").fill(format(yesterday, "yyyy-MM-dd"));
    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/weight`);
    // After two records, chart should be visible
    await expect(page.getByText("體重趨勢圖")).toBeVisible();
  });

  test("可以刪除體重記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/weight`);

    const deleteButtons = page.getByRole("button", { name: "刪除", exact: false });
    await deleteButtons.first().click();
    await page.getByRole("button", { name: "刪除" }).last().click();
    await page.waitForTimeout(300);

    // At least one record should still remain
    await expect(page.getByText("kg").first()).toBeVisible();
  });

  test("體重欄位驗證 — 不允許負值", async ({ page }) => {
    await page.goto(`/pets/${petId}/weight/new`);

    await page.getByLabel("體重 (kg) *").fill("-5");
    await page.getByRole("button", { name: "儲存" }).click();

    // Should stay on the form (validation error)
    await expect(page).toHaveURL(`/pets/${petId}/weight/new`);
  });
});
