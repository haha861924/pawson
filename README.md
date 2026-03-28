# Pawson 🐾

寵物犬隻管理系統 — 追蹤狗狗的照護、餵食、健康與花費紀錄。

## 技術棧

| 項目 | 版本 |
|------|------|
| Next.js (App Router) | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| shadcn/ui (base-ui variant) | - |
| Prisma ORM | 7 |
| SQLite (better-sqlite3) | - |
| Zod | 4 |
| Recharts | - |

## 快速開始

```bash
npm install
npm run dev        # 開發伺服器 http://localhost:3000
```

## 常用指令

```bash
npm run dev        # 啟動開發伺服器
npm run build      # 正式建置 + 型別檢查
npm run lint       # ESLint 檢查

# 資料庫
npx prisma migrate dev --name <名稱>   # 建立並套用新遷移
npx prisma migrate deploy              # 套用待定遷移
npx prisma generate                    # 更新 Prisma client（schema 變更後必跑）
npx prisma studio                      # 資料庫 GUI
```

---

## 開發守則

### 架構原則

**資料流：** 全部讀取在 async Server Components 直接呼叫 Prisma，寫入使用 Server Actions，不使用 API Routes（除了檔案上傳）。

**表單模式：** 所有表單使用 `useActionState(action, undefined)` + `FormData`，Server Action 簽名為 `(prev: unknown, formData: FormData)`。需要閉包（如 dogId）時，在 page 檔案包裝：

```ts
async function action(_prev: unknown, fd: FormData) {
  "use server";
  return createCareRecord(dogId, _prev, fd);
}
```

**Button 匯入規則：**
- Server Components / layouts → 從 `@/lib/button-variants` 匯入 `buttonVariants`
- Client form Components → 從 `@/components/ui/button` 匯入 `Button`，從 `@/lib/button-variants` 匯入 `buttonVariants`

**驗證：** 所有表單資料透過 `lib/validations.ts` 的 Zod schema 驗證。錯誤訊息使用繁體中文。回傳格式統一為 `{ error?: Record<string, string[]> } | void`。

### 資料庫規則

- SQLite 預設不啟用外鍵，**刪除父記錄前必須手動刪除子記錄**（見 `deleteDog`）。
- Schema 變更後必須依序執行：`prisma migrate dev` → `prisma generate`。
- Prisma client singleton 在 `lib/prisma.ts`，使用 `PrismaBetterSqlite3` 適配器，直接指向 `./dev.db`。

### 路由結構

```
/                          首頁 dashboard
/dogs                      犬隻列表
/dogs/new                  新增狗狗
/dogs/[dogId]              狗狗總覽
/dogs/[dogId]/edit         編輯狗狗
/dogs/[dogId]/care         照護記錄
/dogs/[dogId]/feeding      飼料管理 + 飼料評論
/dogs/[dogId]/health       健康照護 + 用藥提醒
/dogs/[dogId]/expenses     單狗花費
/expenses                  全部花費統計（含篩選與圖表）
```

### 新增功能 Checklist

1. **Schema 變更** → 在 `prisma/schema.prisma` 新增欄位或 model
2. **執行遷移** → `npx prisma migrate dev --name <name>` + `npx prisma generate`
3. **型別/常數** → 在 `lib/types.ts` 新增 enum 常數
4. **驗證** → 在 `lib/validations.ts` 新增或更新 Zod schema
5. **Server Actions** → 在 `lib/actions/<domain>.ts` 新增，記得 `"use server"` + `revalidatePath`
6. **元件** → 在 `components/<domain>/` 建立 Form / List 元件
7. **頁面** → 在 `app/` 建立對應路由

### 刪除資料

使用 `components/shared/DeleteButton.tsx`（含 AlertDialog 確認）。傳入 `onDelete` async 函數即可。

### 圖片上傳

- API Route：`POST /api/upload`（最大 5MB，支援 JPG/PNG/WebP/GIF）
- 上傳後回傳 `{ url: string }`，路徑格式為 `/uploads/<filename>`
- 檔案存放於 `public/uploads/`（已加入 `.gitignore` 中的靜態資源）

### 統一發票

花費記錄支援儲存統一發票號碼（格式：兩位大寫英文 + 八位數字，如 `AB12345678`）。列表頁提供「對獎」連結導向財政部電子發票平台。

### 飼料評論

每隻狗狗可針對吃過的飼料留下星等評分（1–5 顆星）與文字評論。資料存於 `FeedReview` model，整合於飼料管理頁下方。

### 用藥提醒週期

健康記錄支援設定提醒週期（每月、每三個月、每半年、每年）。儲存後系統自動從記錄日期計算 `nextDueDate`，Dashboard 和健康列表會顯示逾期/即將到期提示。

### 花費圖表

`ExpenseChart` 元件（recharts）提供：
- 圓餅圖：各類別花費比例
- 長條圖：近六個月花費趨勢

全域花費頁 `/expenses` 支援依狗狗、品種、類別篩選。

---

## 功能清單

| 功能 | 路徑 |
|------|------|
| 犬隻管理（含大頭貼上傳） | `/dogs` |
| 列表一鍵快速操作 | `/dogs`（每張卡片） |
| 日常照護記錄 | `/dogs/[dogId]/care` |
| 飼料管理 + 餵食記錄 | `/dogs/[dogId]/feeding` |
| 飼料評論（星等+文字） | `/dogs/[dogId]/feeding` |
| 健康照護 + 用藥提醒 | `/dogs/[dogId]/health` |
| 花費記錄 + 統一發票 | `/dogs/[dogId]/expenses` |
| 全部花費統計 + 圖表 | `/expenses` |
