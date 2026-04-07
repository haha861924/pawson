import { test, expect } from "@playwright/test";
import { format, addDays } from "date-fns";

test.describe("健康照護", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`健康測試_${Date.now()}`);
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

  test("健康頁面初始顯示空狀態", async ({ page }) => {
    await page.goto(`/pets/${petId}/health`);
    await expect(page.getByText("尚無健康記錄")).toBeVisible();
  });

  test("可以新增健康記錄（含下次日期）", async ({ page }) => {
    await page.goto(`/pets/${petId}/health/new`);

    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "疫苗" }).click();

    await page.getByLabel("標題 *").fill("狂犬病疫苗");
    await page.getByLabel("獸醫/診所").fill("台北動物醫院");

    const nextDue = format(addDays(new Date(), 365), "yyyy-MM-dd");
    await page.getByLabel("下次日期").fill(nextDue);
    await page.getByLabel("說明").fill("每年施打");

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/health`);
    await expect(page.getByText("狂犬病疫苗")).toBeVisible();
    await expect(page.getByText("疫苗").first()).toBeVisible();
    await expect(page.getByText("台北動物醫院")).toBeVisible();
  });

  test("可以編輯健康記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/health`);

    // Click the edit button (pencil icon) on the first record
    await page.locator("a[href*='/edit']").first().click();
    await expect(page.getByText("編輯健康記錄")).toBeVisible();

    // Update the title
    await page.getByLabel("標題 *").fill("狂犬病疫苗（已更新）");
    await page.getByLabel("獸醫/診所").fill("新北動物醫院");

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/health`);
    await expect(page.getByText("狂犬病疫苗（已更新）")).toBeVisible();
    await expect(page.getByText("新北動物醫院")).toBeVisible();
  });

  test("即將到期記錄在儀表板顯示", async ({ page }) => {
    // Add a record due in 7 days
    await page.goto(`/pets/${petId}/health/new`);

    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "驅蟲" }).click();

    await page.getByLabel("標題 *").fill("心絲蟲預防藥");

    const nextDue = format(addDays(new Date(), 7), "yyyy-MM-dd");
    await page.getByLabel("下次日期").fill(nextDue);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(`/pets/${petId}/health`);

    await page.goto("/");
    await expect(page.getByText("心絲蟲預防藥").first()).toBeVisible();
  });

  test("儀表板可切換待辦時間範圍", async ({ page }) => {
    await page.goto("/");

    // Default is 30 days, the 7-day due record should be visible
    await expect(page.getByText("心絲蟲預防藥").first()).toBeVisible();

    // Switch to 7 days filter
    await page.getByRole("button", { name: "7 天" }).click();
    await expect(page.getByText("心絲蟲預防藥").first()).toBeVisible();

    // Switch to 半年 filter
    await page.getByRole("button", { name: "半年" }).click();
    await expect(page.getByText("心絲蟲預防藥").first()).toBeVisible();
  });

  test("未來日期的健康記錄也出現在儀表板待辦", async ({ page }) => {
    // Add a record with date in the future (no nextDueDate, no reminder interval)
    await page.goto(`/pets/${petId}/health/new`);

    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "就診" }).click();

    await page.getByLabel("標題 *").fill("預約回診");

    const futureDate = format(addDays(new Date(), 14), "yyyy-MM-dd");
    await page.getByLabel("日期 *").fill(futureDate);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(`/pets/${petId}/health`);

    await page.goto("/");
    await expect(page.getByText("預約回診").first()).toBeVisible();
  });
});
