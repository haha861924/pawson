# Pawson 🐾

寵物犬隻管理系統 — 多人共養、追蹤狗狗的照護、餵食、健康與花費紀錄。

## 技術棧

| 項目                        | 版本    |
| --------------------------- | ------- |
| Next.js (App Router)        | 16      |
| React                       | 19      |
| TypeScript                  | 5       |
| Tailwind CSS                | 4       |
| shadcn/ui (base-ui variant) | -       |
| Prisma ORM                  | 7       |
| PostgreSQL (Supabase)       | -       |
| NextAuth.js                 | v5 beta |
| Zod                         | 4       |
| Recharts                    | -       |

## 快速開始

```bash
npm install
cp .env.example .env   # 填入必要環境變數
npm run dev            # 開發伺服器 http://localhost:3000
```

## 環境變數

```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://..."        # Transaction pooler (pgbouncer=true)
DIRECT_URL="postgresql://..."          # Direct connection，供 Prisma 遷移使用

# NextAuth
AUTH_SECRET="..."                      # 隨機亂數，可用 openssl rand -hex 32 產生

# Google OAuth（可選）
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Supabase Storage（production 圖片上傳必填）
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."        # Supabase Dashboard → Settings → API → service_role

# Google Analytics（可選）
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"  # GA4 Measurement ID
```

> **本機開發**：未設定 `SUPABASE_SERVICE_ROLE_KEY` 時，圖片改存至 `public/uploads/`（本機路徑，不納入 git）。
> **Production**：必須在 Supabase Dashboard → Storage 建立名為 `pawson-uploads` 的 **public bucket**。

## 常用指令

```bash
npm run dev        # 啟動開發伺服器
npm run build      # 正式建置 + 型別檢查
npm run lint       # ESLint 檢查

# 資料庫
npx prisma migrate dev --name <名稱>   # 建立並套用新遷移
npx prisma migrate deploy              # 套用待定遷移（CI/CD）
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

**Select 顯示 label：** base-ui 的 `Select.Value` 不自動顯示 `ItemText`，必須在 `<Select>` 根元件傳入 `items` prop（`Record<string, string>`）：

```tsx
<Select name="type" items={Object.fromEntries(CARE_TYPES.map((t) => [t.value, t.label]))}>
  <SelectTrigger>
    <SelectValue placeholder="選擇類型" />
  </SelectTrigger>
  ...
</Select>
```

**驗證：** 所有表單資料透過 `lib/validations.ts` 的 Zod schema 驗證。錯誤訊息使用繁體中文。回傳格式統一為 `{ error?: Record<string, string[]> } | void`。

### 認證與權限

- 使用 NextAuth v5（credentials + Google OAuth）
- 路由 `/dogs/*`、`/expenses/*` 需登入（Middleware 守衛）
- 每隻狗狗透過 `DogMember` 關聯使用者，角色分為 `OWNER`（飼主）/ `CARETAKER`（共同扶養）
- 權限欄位：`canView`（預設 true）、`canEdit`（預設 false，OWNER 為 true）
- Server Action 權限檢查工具：`assertCanEdit(userId, dogId)`、`assertOwner(userId, dogId)`
- **邀請限制**：邀請成員透過電子郵件查詢已註冊帳號（`prisma.user.findUnique({ where: { email } })`）；若對方尚未在 Pawson 建立帳號，系統回傳錯誤「找不到此電子郵件的使用者」

### 資料庫規則

- PostgreSQL（Supabase）+ `@prisma/adapter-pg`
- `DATABASE_URL` 使用 pgbouncer transaction pool，`DIRECT_URL` 供遷移使用
- Schema 變更後必須依序執行：`prisma migrate dev` → `prisma generate`

### 路由結構

```
/                          首頁 dashboard
/auth/login                登入
/auth/register             註冊
/dogs                      犬隻列表
/dogs/new                  新增狗狗
/dogs/[dogId]              狗狗總覽
/dogs/[dogId]/edit         編輯狗狗
/dogs/[dogId]/care         照護記錄
/dogs/[dogId]/feeding      飼料管理 + 飼料評論
/dogs/[dogId]/health       健康照護 + 用藥提醒
/dogs/[dogId]/diary        成長曲線（健康日記 + 體重追蹤）
/dogs/[dogId]/expenses     單狗花費
/dogs/[dogId]/members      成員管理（飼主限定）
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
- 上傳後回傳 `{ url: string }`
- **本機**（未設定 Supabase Storage 環境變數）：存至 `public/uploads/`
- **Production**：上傳至 Supabase Storage bucket `pawson-uploads`，回傳公開 URL

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

### 測試

**測試狀態：**

- ✅ 單元測試：68/68 通過（覆蓋 validations、actions、components）
- ✅ E2E 測試：34 個測試（7 個測試檔案）
- ✅ Build：正式建置通過

```bash
# 單元測試（Vitest）
npx vitest run                # 執行所有單元測試（68 tests）
npx vitest --coverage         # 執行並產生覆蓋率報告

# E2E 測試（Playwright）— 需先啟動開發伺服器
npm run dev &
npx playwright test           # 執行所有 E2E 測試（34 tests）
npx playwright test --ui      # 互動式 UI 模式（推薦用於開發/除錯）
npx playwright show-report    # 開啟測試報告（http://localhost:9323）

# 可選：透過環境變數指定 E2E 測試帳號（預設使用 e2e@pawson.test）
E2E_EMAIL=your@email.com E2E_PASSWORD=YourPassword npx playwright test
```

> E2E 測試的 global setup 會自動建立測試帳號（若不存在），並將 session 儲存至 `tests/.auth/user.json`。

#### 測試報告檢視器

執行 `npx playwright show-report` 後，會在 `http://localhost:9323` 開啟互動式 HTML 報告，包含：

- 所有測試的執行結果（通過/失敗/略過）
- 失敗測試的詳細錯誤訊息與堆疊追蹤
- 測試執行時的截圖與影片（如有配置）
- 每個測試的執行時間與重試記錄

#### Playwright UI 模式

`npx playwright test --ui` 提供即時互動式除錯體驗：

- 即時觀看測試執行過程
- 暫停/逐步執行測試
- 檢視 DOM 快照與網路請求
- 直接在 UI 中重新執行單一測試
- 適合開發時快速驗證與修正測試

#### 測試涵蓋範圍

- ✅ 犬隻管理（CRUD + 成員邀請）
- ✅ 日常照護記錄
- ✅ 飼料管理（計畫、記錄、評論）
- ✅ 健康照護（用藥提醒）
- ✅ 成長曲線（每日健康記錄 + 體重追蹤）
- ✅ 花費記錄與統計
- ✅ 單元測試（驗證、型別、元件）

---

## 功能清單

| 功能                                | 路徑                     |
| ----------------------------------- | ------------------------ |
| 會員登入（email/密碼 + Google）     | `/auth/login`            |
| 犬隻管理（含大頭貼、晶片號碼）      | `/dogs`                  |
| 成員管理（邀請、權限、移除）        | `/dogs/[dogId]/members`  |
| 日常照護記錄                        | `/dogs/[dogId]/care`     |
| 飼料管理 + 餵食記錄                 | `/dogs/[dogId]/feeding`  |
| 飼料評論（星等+文字）               | `/dogs/[dogId]/feeding`  |
| 健康照護 + 用藥提醒                 | `/dogs/[dogId]/health`   |
| 成長曲線（每日健康記錄 + 體重追蹤） | `/dogs/[dogId]/diary`    |
| 花費記錄 + 統一發票                 | `/dogs/[dogId]/expenses` |
| 全部花費統計 + 圖表                 | `/expenses`              |
