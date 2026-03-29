import { test, expect } from "@playwright/test";

test.describe("犬隻管理", () => {
  test("儀表板可以正常載入", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "儀表板" })).toBeVisible();
    await expect(page.getByText("累計總花費")).toBeVisible();
  });

  test("犬隻列表頁面正常顯示", async ({ page }) => {
    await page.goto("/dogs");
    await expect(page.getByRole("heading", { name: "犬隻管理" })).toBeVisible();
    await expect(page.getByRole("link", { name: "新增狗狗" })).toBeVisible();
  });

  test("可以新增並查看狗狗", async ({ page }) => {
    await page.goto("/dogs/new");
    await expect(page.getByRole("heading", { name: "新增狗狗" })).toBeVisible();

    const dogName = `測試狗狗_${Date.now()}`;
    await page.getByLabel("名字 *").fill(dogName);
    await page.getByLabel("品種").fill("柴犬");
    await page.getByLabel("體重 (kg)").fill("7.5");

    await page.getByRole("button", { name: "儲存" }).click();

    // Wait for redirect to dog page (not /dogs/new)
    await page.waitForURL(/\/dogs\/(?!new)[^/]+$/);
    await expect(page.getByText(dogName)).toBeVisible();
    await expect(page.getByText("柴犬")).toBeVisible();

    // Cleanup: delete the dog
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除狗狗" }).click();
    await expect(page).toHaveURL("/dogs");
  });

  test("可以新增含晶片號碼的狗狗並在頁面顯示", async ({ page }) => {
    await page.goto("/dogs/new");

    const dogName = `晶片測試_${Date.now()}`;
    await page.getByLabel("名字 *").fill(dogName);
    await page.getByLabel("晶片號碼").fill("123456789012345");
    await page.getByLabel("母犬晶片號碼").fill("987654321098765");

    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/dogs\/(?!new)[^/]+$/);

    await expect(page.getByText("晶片：123456789012345")).toBeVisible();
    await expect(page.getByText("母犬晶片：987654321098765")).toBeVisible();

    // Cleanup
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除狗狗" }).click();
    await expect(page).toHaveURL("/dogs");
  });

  test("可以從 layout 編輯狗狗資料", async ({ page }) => {
    // Create a dog first
    await page.goto("/dogs/new");
    const dogName = `編輯測試_${Date.now()}`;
    await page.getByLabel("名字 *").fill(dogName);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/dogs\/(?!new)[^/]+$/);

    // Click pencil edit button in header
    await page.getByRole("link", { name: "編輯" }).click();
    await expect(page).toHaveURL(/\/dogs\/[^/]+\/edit$/);

    const updatedName = `${dogName}_已編輯`;
    await page.getByLabel("名字 *").fill(updatedName);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/dogs\/(?!new)[^/]+$/);

    await expect(page.getByText(updatedName)).toBeVisible();

    // Cleanup
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除狗狗" }).click();
    await expect(page).toHaveURL("/dogs");
  });

  test("名字為空時 HTML 驗證阻止提交", async ({ page }) => {
    await page.goto("/dogs/new");
    await page.getByRole("button", { name: "儲存" }).click();
    const nameInput = page.getByLabel("名字 *");
    await expect(nameInput).toBeFocused();
  });
});
