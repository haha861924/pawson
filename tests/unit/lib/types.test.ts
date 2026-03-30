import { describe, it, expect } from "vitest";
import {
  getLabel,
  CARE_TYPES,
  HEALTH_TYPES,
  EXPENSE_CATEGORIES,
  FEED_FREQUENCIES,
  MEAL_TIMES,
  PET_SEX,
  APPETITE_OPTIONS,
  STOOL_OPTIONS,
  MOOD_OPTIONS,
} from "@/lib/types";

describe("getLabel", () => {
  it("returns the label for a known value", () => {
    expect(getLabel(CARE_TYPES, "walk")).toBe("散步");
    expect(getLabel(CARE_TYPES, "bath")).toBe("洗澡");
    expect(getLabel(CARE_TYPES, "grooming")).toBe("美容");
  });

  it("returns the value itself when not found", () => {
    expect(getLabel(CARE_TYPES, "unknown")).toBe("unknown");
  });

  it("covers all HEALTH_TYPES", () => {
    expect(getLabel(HEALTH_TYPES, "vet_visit")).toBe("就診");
    expect(getLabel(HEALTH_TYPES, "vaccine")).toBe("疫苗");
    expect(getLabel(HEALTH_TYPES, "medication")).toBe("用藥");
    expect(getLabel(HEALTH_TYPES, "deworming")).toBe("驅蟲");
    expect(getLabel(HEALTH_TYPES, "dental")).toBe("牙科");
    expect(getLabel(HEALTH_TYPES, "other")).toBe("其他");
  });

  it("covers all EXPENSE_CATEGORIES", () => {
    expect(getLabel(EXPENSE_CATEGORIES, "food")).toBe("飼料");
    expect(getLabel(EXPENSE_CATEGORIES, "vet")).toBe("獸醫");
    expect(getLabel(EXPENSE_CATEGORIES, "grooming")).toBe("美容");
    expect(getLabel(EXPENSE_CATEGORIES, "supplies")).toBe("用品");
    expect(getLabel(EXPENSE_CATEGORIES, "medication")).toBe("藥品");
    expect(getLabel(EXPENSE_CATEGORIES, "training")).toBe("訓練");
  });

  it("covers FEED_FREQUENCIES", () => {
    expect(getLabel(FEED_FREQUENCIES, "once_daily")).toBe("每日一餐");
    expect(getLabel(FEED_FREQUENCIES, "twice_daily")).toBe("每日兩餐");
    expect(getLabel(FEED_FREQUENCIES, "free_feed")).toBe("自由取食");
  });

  it("covers MEAL_TIMES", () => {
    expect(getLabel(MEAL_TIMES, "morning")).toBe("早餐");
    expect(getLabel(MEAL_TIMES, "evening")).toBe("晚餐");
  });

  it("covers PET_SEX", () => {
    expect(getLabel(PET_SEX, "male")).toBe("公");
    expect(getLabel(PET_SEX, "female")).toBe("母");
  });

  it("covers APPETITE_OPTIONS", () => {
    expect(getLabel(APPETITE_OPTIONS, "excellent")).toBe("極佳");
    expect(getLabel(APPETITE_OPTIONS, "good")).toBe("良好");
    expect(getLabel(APPETITE_OPTIONS, "reduced")).toBe("減少");
    expect(getLabel(APPETITE_OPTIONS, "poor")).toBe("很差");
  });

  it("covers STOOL_OPTIONS", () => {
    expect(getLabel(STOOL_OPTIONS, "normal")).toBe("正常");
    expect(getLabel(STOOL_OPTIONS, "soft")).toBe("軟便");
    expect(getLabel(STOOL_OPTIONS, "diarrhea")).toBe("拉肚子");
    expect(getLabel(STOOL_OPTIONS, "constipation")).toBe("便秘");
  });

  it("covers MOOD_OPTIONS", () => {
    expect(getLabel(MOOD_OPTIONS, "energetic")).toBe("活潑有精神");
    expect(getLabel(MOOD_OPTIONS, "normal")).toBe("正常");
    expect(getLabel(MOOD_OPTIONS, "lethargic")).toBe("無精打采");
  });
});
