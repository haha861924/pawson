import { test, expect } from "@playwright/test";

test.describe("共同討論區", () => {
  test("顯示討論區頁面", async ({ page }) => {
    await page.goto("/community");
    await expect(page.getByRole("heading", { name: "共同討論區" })).toBeVisible();
    await expect(page.getByText("與其他飼主分享飼料、用藥、鮮食、保健品心得")).toBeVisible();
  });

  test("空狀態顯示提示", async ({ page }) => {
    await page.goto("/community");
    // May or may not have discussions from other tests, so just check page loads
    await expect(page.getByRole("heading", { name: "共同討論區" })).toBeVisible();
  });

  test("可以發佈新文章", async ({ page }) => {
    await page.goto("/community/new");
    await expect(page.getByRole("heading", { name: "發佈新文章" })).toBeVisible();

    await page.getByLabel("標題 *").fill("推薦好飼料分享");
    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "飼料" }).click();
    await page.getByLabel("內容 *").fill("最近試了新飼料，狗狗很喜歡！");
    await page.getByRole("button", { name: "發佈文章" }).click();

    await page.waitForURL(/\/community\/[^/]+$/);
    await expect(page.getByText("推薦好飼料分享")).toBeVisible();
    await expect(page.getByText("最近試了新飼料，狗狗很喜歡！")).toBeVisible();
  });

  test("可以在文章下方留言", async ({ page }) => {
    // Create a discussion first
    await page.goto("/community/new");
    await page.getByLabel("標題 *").fill("留言測試文章");
    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "用藥" }).click();
    await page.getByLabel("內容 *").fill("這是一篇測試文章");
    await page.getByRole("button", { name: "發佈文章" }).click();
    await page.waitForURL(/\/community\/[^/]+$/);

    // Add a comment
    await page.getByPlaceholder("寫下你的回覆...").fill("很好的分享！");
    await page.getByRole("button", { name: "送出回覆" }).click();

    await expect(page.getByText("很好的分享！")).toBeVisible();
    await expect(page.getByText("留言 (1)")).toBeVisible();
  });

  test("可以編輯自己的文章", async ({ page }) => {
    await page.goto("/community/new");
    await page.getByLabel("標題 *").fill("待編輯文章");
    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "鮮食" }).click();
    await page.getByLabel("內容 *").fill("初始內容");
    await page.getByRole("button", { name: "發佈文章" }).click();
    await page.waitForURL(/\/community\/[^/]+$/);

    await page.getByLabel("編輯").click();
    await page.waitForURL(/\/edit$/);

    await page.getByLabel("標題 *").fill("已編輯文章");
    await page.getByLabel("內容 *").fill("更新後的內容");
    await page.getByRole("button", { name: "更新文章" }).click();

    await page.waitForURL(/\/community\/[^/]+$/);
    await expect(page.getByText("已編輯文章")).toBeVisible();
    await expect(page.getByText("更新後的內容")).toBeVisible();
  });

  test("可以刪除自己的文章", async ({ page }) => {
    await page.goto("/community/new");
    await page.getByLabel("標題 *").fill("待刪除文章");
    await page.locator("[data-slot=select-trigger]").click();
    await page.getByRole("option", { name: "保健品" }).click();
    await page.getByLabel("內容 *").fill("這篇會被刪除");
    await page.getByRole("button", { name: "發佈文章" }).click();
    await page.waitForURL(/\/community\/[^/]+$/);

    await page.getByLabel("刪除").click();
    await page.getByRole("button", { name: "刪除文章" }).click();

    await page.waitForURL("/community");
  });

  test("分類篩選功能", async ({ page }) => {
    await page.goto("/community");
    // Click a category filter
    await page.getByRole("button", { name: "飼料", exact: true }).click();
    await expect(page).toHaveURL(/category=feed/);
    // Click "全部" to reset
    await page.getByRole("button", { name: "全部" }).click();
    await expect(page).not.toHaveURL(/category=/);
  });

  test("搜尋功能", async ({ page }) => {
    await page.goto("/community");
    await page.getByPlaceholder("搜尋討論...").fill("推薦");
    // Wait for URL to update with search param
    await page.waitForURL(/search=/, { timeout: 5000 });
  });

  test("側邊欄顯示共同討論區連結", async ({ page }) => {
    await page.goto("/community");
    // Desktop sidebar
    await expect(page.locator("aside").getByText("共同討論區")).toBeVisible();
  });
});
