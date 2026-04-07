import { test, expect } from "@playwright/test";

test.describe("飼料評論 CRUD", () => {
  let petId: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/.auth/user.json" });
    const page = await ctx.newPage();
    await page.goto("/pets/new");
    await page.getByLabel("名字 *").fill(`評論測試_${Date.now()}`);
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

  test("飼料頁面顯示評論入口連結", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding`);
    await expect(page.getByText("飼料評論")).toBeVisible();
    await expect(page.getByText("尚無評論，立即分享心得")).toBeVisible();
  });

  test("可以新增飼料評論", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/reviews/new`);
    await expect(page.getByRole("heading", { name: "新增飼料評論" })).toBeVisible();

    await page.getByLabel("飼料名稱 *").fill("皇家小型犬");
    await page.getByLabel("品牌").fill("Royal Canin");

    // Click 4th star
    const stars = page.locator("form button[type=button]");
    await stars.nth(3).click();

    await page.getByLabel("評論").fill("狗狗非常喜歡這款飼料");
    await page.getByRole("button", { name: "送出評論" }).click();

    await page.waitForURL(new RegExp(`/pets/${petId}/feeding/reviews`));
    await expect(page.getByText("皇家小型犬")).toBeVisible();
    await expect(page.getByText("Royal Canin")).toBeVisible();
    await expect(page.getByText("狗狗非常喜歡這款飼料")).toBeVisible();
  });

  test("評論列表頁顯示已新增的評論", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/reviews`);
    await expect(page.getByRole("heading", { name: "飼料評論" })).toBeVisible();
    await expect(page.getByText("皇家小型犬")).toBeVisible();
  });

  test("可以編輯飼料評論", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/reviews`);
    await page.getByLabel("編輯").first().click();
    await page.waitForURL(/\/edit$/);

    await expect(page.getByRole("heading", { name: "編輯飼料評論" })).toBeVisible();
    await page.getByLabel("飼料名稱 *").fill("希爾思小型犬");
    await page.getByRole("button", { name: "更新評論" }).click();

    await page.waitForURL(new RegExp(`/pets/${petId}/feeding/reviews`));
    await expect(page.getByText("希爾思小型犬")).toBeVisible();
  });

  test("可以刪除飼料評論", async ({ page }) => {
    await page.goto(`/pets/${petId}/feeding/reviews`);
    await expect(page.getByText("希爾思小型犬")).toBeVisible();

    await page.getByLabel("刪除").first().click();
    await page.getByRole("button", { name: "刪除" }).click();

    await expect(page.getByText("尚無飼料評論")).toBeVisible();
  });

  test("飼料頁面評論入口顯示統計資訊", async ({ page }) => {
    // Add a review first
    await page.goto(`/pets/${petId}/feeding/reviews/new`);
    await page.getByLabel("飼料名稱 *").fill("測試飼料");
    const stars = page.locator("form button[type=button]");
    await stars.nth(4).click(); // 5 stars
    await page.getByRole("button", { name: "送出評論" }).click();
    await page.waitForURL(new RegExp(`/pets/${petId}/feeding/reviews`));

    // Go to feeding page and check summary
    await page.goto(`/pets/${petId}/feeding`);
    await expect(page.getByText("1 則評論")).toBeVisible();
  });
});
