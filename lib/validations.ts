import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "請輸入名稱"),
  email: z.string().email("請輸入有效電子郵件"),
  password: z.string().min(8, "密碼至少 8 個字元"),
});

export const loginSchema = z.object({
  email: z.string().email("請輸入有效電子郵件"),
  password: z.string().min(1, "請輸入密碼"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("請輸入有效電子郵件"),
});

export const dogSchema = z.object({
  name: z.string().min(1, "請輸入名字"),
  breed: z.string().optional(),
  dob: z.string().optional(),
  weight: z.coerce.number().positive().optional().or(z.literal("")),
  sex: z.string().optional(),
  notes: z.string().optional(),
});

export const careSchema = z.object({
  type: z.string().min(1, "請選擇類型"),
  date: z.string().min(1, "請選擇日期"),
  durationMins: z.coerce.number().int().positive().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const feedPlanSchema = z.object({
  foodName: z.string().min(1, "請輸入飼料名稱"),
  brand: z.string().optional(),
  amountGrams: z.coerce.number().positive("請輸入有效重量"),
  frequency: z.string().min(1, "請選擇頻率"),
  notes: z.string().optional(),
});

export const feedRecordSchema = z.object({
  foodName: z.string().min(1, "請輸入飼料名稱"),
  date: z.string().min(1, "請選擇日期"),
  amountGrams: z.coerce.number().positive("請輸入有效重量"),
  mealTime: z.string().optional(),
  notes: z.string().optional(),
});

export const healthSchema = z.object({
  type: z.string().min(1, "請選擇類型"),
  title: z.string().min(1, "請輸入標題"),
  date: z.string().min(1, "請選擇日期"),
  description: z.string().optional(),
  vetName: z.string().optional(),
  nextDueDate: z.string().optional(),
  reminderInterval: z.string().optional(),
});

export const feedReviewSchema = z.object({
  foodName: z.string().min(1, "請輸入飼料名稱"),
  brand: z.string().optional(),
  rating: z.coerce.number().int().min(1, "請選擇評分").max(5),
  review: z.string().optional(),
});

export const expenseSchema = z.object({
  dogId: z.string().min(1, "請選擇狗狗"),
  category: z.string().min(1, "請選擇類別"),
  amount: z.coerce.number().positive("請輸入有效金額"),
  description: z.string().min(1, "請輸入說明"),
  date: z.string().min(1, "請選擇日期"),
  notes: z.string().optional(),
  invoiceNumber: z.string().optional().refine(
    (v) => !v || /^[A-Z]{2}\d{8}$/.test(v),
    "格式應為兩個大寫英文字母加八位數字，例如：AB12345678"
  ),
});
