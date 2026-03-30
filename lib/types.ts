export const CARE_TYPES = [
  { value: "walk", label: "散步" },
  { value: "bath", label: "洗澡" },
  { value: "grooming", label: "美容" },
  { value: "play", label: "玩耍" },
  { value: "training", label: "訓練" },
  { value: "other", label: "其他" },
] as const;

export const MEAL_TIMES = [
  { value: "morning", label: "早餐" },
  { value: "afternoon", label: "午餐" },
  { value: "evening", label: "晚餐" },
  { value: "night", label: "宵夜" },
] as const;

export const FEED_FREQUENCIES = [
  { value: "once_daily", label: "每日一餐" },
  { value: "twice_daily", label: "每日兩餐" },
  { value: "three_daily", label: "每日三餐" },
  { value: "free_feed", label: "自由取食" },
] as const;

export const HEALTH_TYPES = [
  { value: "vet_visit", label: "就診" },
  { value: "vaccine", label: "疫苗" },
  { value: "medication", label: "用藥" },
  { value: "deworming", label: "驅蟲" },
  { value: "dental", label: "牙科" },
  { value: "other", label: "其他" },
] as const;

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "飼料" },
  { value: "vet", label: "獸醫" },
  { value: "grooming", label: "美容" },
  { value: "supplies", label: "用品" },
  { value: "medication", label: "藥品" },
  { value: "training", label: "訓練" },
  { value: "other", label: "其他" },
] as const;

export const REMINDER_INTERVALS = [
  { value: "monthly", label: "每月", months: 1 },
  { value: "3months", label: "每三個月", months: 3 },
  { value: "6months", label: "每半年", months: 6 },
  { value: "yearly", label: "每年", months: 12 },
] as const;

export const DOG_SEX = [
  { value: "male", label: "公" },
  { value: "female", label: "母" },
] as const;

export const APPETITE_OPTIONS = [
  { value: "excellent", label: "極佳" },
  { value: "good", label: "良好" },
  { value: "reduced", label: "減少" },
  { value: "poor", label: "很差" },
] as const;

export const STOOL_OPTIONS = [
  { value: "normal", label: "正常" },
  { value: "soft", label: "軟便" },
  { value: "diarrhea", label: "拉肚子" },
  { value: "constipation", label: "便秘" },
] as const;

export const MOOD_OPTIONS = [
  { value: "energetic", label: "活潑有精神" },
  { value: "normal", label: "正常" },
  { value: "lethargic", label: "無精打采" },
] as const;

export function getLabel(
  list: readonly { value: string; label: string }[],
  value: string
) {
  return list.find((i) => i.value === value)?.label ?? value;
}
