import { test, expect } from "@playwright/test";
import { format, addDays } from "date-fns";

test.describe("健康照護", () => {
  let dogId: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/dogs/new");
    await page.getByLabel("名字 *").fill(`健康測試_${Date.now()}`);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/dogs\/(?!new)[^/]+$/);
    dogId = page.url().split("/dogs/")[1];
    await page.close();
  });

  test.afterAll(async ({ browser }) => {
    if (!dogId) return;
    const page = await browser.newPage();
    await page.goto(`/dogs/${dogId}`);
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除狗狗" }).click();
    await page.waitForURL("/dogs");
    await page.close();
  });

  test("健康頁面初始顯示空狀態", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/health`);
    await expect(page.getByText("尚無健康記錄")).toBeVisible();
  });

  test("可以新增健康記錄（含下次日期）", async ({ page }) => {
    await page.goto(`/dogs/${dogId}/health/new`);

    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "疫苗" }).click();

    await page.getByLabel("標題 *").fill("狂犬病疫苗");
    await page.getByLabel("獸醫/診所").fill("台北動物醫院");

    const nextDue = format(addDays(new Date(), 365), "yyyy-MM-dd");
    await page.getByLabel("下次日期").fill(nextDue);
    await page.getByLabel("說明").fill("每年施打");

    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/dogs/${dogId}/health`);
    await expect(page.getByText("狂犬病疫苗")).toBeVisible();
    await expect(page.getByText("疫苗").first()).toBeVisible();
    await expect(page.getByText("台北動物醫院")).toBeVisible();
  });

  test("即將到期記錄在儀表板顯示", async ({ page }) => {
    // Add a record due in 7 days
    await page.goto(`/dogs/${dogId}/health/new`);

    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "驅蟲" }).click();

    await page.getByLabel("標題 *").fill("心絲蟲預防藥");

    const nextDue = format(addDays(new Date(), 7), "yyyy-MM-dd");
    await page.getByLabel("下次日期").fill(nextDue);
    await page.getByRole("button", { name: "儲存" }).click();

    await page.goto("/");
    await expect(page.getByText("心絲蟲預防藥")).toBeVisible();
  });
});
