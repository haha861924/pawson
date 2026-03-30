import { test, expect } from "@playwright/test";

test.describe("日常照護", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`照護測試_${Date.now()}`);
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

  test("照護頁面顯示空狀態", async ({ page }) => {
    await page.goto(`/pets/${petId}/care`);
    await expect(page.getByText("尚無照護記錄")).toBeVisible();
  });

  test("可以新增照護記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/care/new`);
    await expect(page.getByRole("heading", { name: "記錄照護" })).toBeVisible();

    // Click the Select trigger button
    await page.locator("[data-slot=select-trigger]").first().click();
    await page.getByRole("option", { name: "散步" }).click();

    await page.getByLabel("時長 (分鐘)").fill("30");
    await page.getByLabel("備註").fill("今天走了公園");
    await page.getByRole("button", { name: "儲存" }).click();

    await expect(page).toHaveURL(`/pets/${petId}/care`);
    await expect(page.getByText("散步")).toBeVisible();
    await expect(page.getByText("30 分鐘")).toBeVisible();
    await expect(page.getByText("今天走了公園")).toBeVisible();
  });

  test("可以刪除照護記錄", async ({ page }) => {
    await page.goto(`/pets/${petId}/care`);
    // Delete the care record we just added
    await page.getByRole("button", { name: "刪除", exact: false }).first().click();
    await page.getByRole("button", { name: "刪除" }).last().click();
    await expect(page.getByText("尚無照護記錄")).toBeVisible();
  });
});
