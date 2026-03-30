import { test, expect } from "@playwright/test";

test.describe("寵物管理", () => {
  test("儀表板可以正常載入", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "儀表板" })).toBeVisible();
    await expect(page.getByText("累計總花費")).toBeVisible();
  });

  test("寵物列表頁面正常顯示", async ({ page }) => {
    await page.goto("/pets");
    await expect(page.getByRole("heading", { name: "寵物管理" })).toBeVisible();
    await expect(page.getByRole("link", { name: "新增寵物" })).toBeVisible();
  });

  test("可以新增並查看寵物", async ({ page }) => {
    await page.goto("/pets/new");
    await expect(page.getByRole("heading", { name: "新增寵物" })).toBeVisible();

    const petName = `測試寵物_${Date.now()}`;
    await page.getByLabel("名字 *").fill(petName);
    await page.getByLabel("品種").fill("柴犬");
    await page.getByLabel("體重 (kg)").fill("7.5");

    await page.getByRole("button", { name: "儲存" }).click();

    // Wait for redirect to pet page (not /pets/new)
    await page.waitForURL(/\/pets\/(?!new)[^/]+$/);
    await expect(page.getByText(petName)).toBeVisible();
    await expect(page.getByText("柴犬")).toBeVisible();

    // Cleanup: delete the pet
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除寵物" }).click();
    await expect(page).toHaveURL("/pets");
  });

  test("可以新增含晶片號碼的寵物並在頁面顯示", async ({ page }) => {
    await page.goto("/pets/new");

    const petName = `晶片測試_${Date.now()}`;
    await page.getByLabel("名字 *").fill(petName);
    await page.getByLabel("晶片號碼", { exact: true }).fill("123456789012345");
    await page.getByLabel("親代晶片號碼").fill("987654321098765");

    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/pets\/(?!new)[^/]+$/);

    await expect(page.getByText("晶片：123456789012345")).toBeVisible();
    await expect(page.getByText("親代晶片：987654321098765")).toBeVisible();

    // Cleanup
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除寵物" }).click();
    await expect(page).toHaveURL("/pets");
  });

  test("可以從 layout 編輯寵物資料", async ({ page }) => {
    // Create a pet first
    await page.goto("/pets/new");
    const petName = `編輯測試_${Date.now()}`;
    await page.getByLabel("名字 *").fill(petName);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/pets\/(?!new)[^/]+$/);

    // Click pencil edit button in header
    await page.getByRole("link", { name: "編輯", exact: true }).click();
    await expect(page).toHaveURL(/\/pets\/[^/]+\/edit$/);

    const updatedName = `${petName}_已編輯`;
    await page.getByLabel("名字 *").fill(updatedName);
    await page.getByRole("button", { name: "儲存" }).click();
    await page.waitForURL(/\/pets\/(?!new)[^/]+$/);

    await expect(page.getByText(updatedName)).toBeVisible();

    // Cleanup
    await page.getByRole("button", { name: "刪除", exact: false }).click();
    await page.getByRole("button", { name: "刪除寵物" }).click();
    await expect(page).toHaveURL("/pets");
  });

  test("名字為空時 HTML 驗證阻止提交", async ({ page }) => {
    await page.goto("/pets/new");
    await page.getByRole("button", { name: "儲存" }).click();
    const nameInput = page.getByLabel("名字 *");
    await expect(nameInput).toBeFocused();
  });
});
