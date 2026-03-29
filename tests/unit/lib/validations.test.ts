import { describe, it, expect } from "vitest";
import {
  dogSchema,
  inviteMemberSchema,
  careSchema,
  feedPlanSchema,
  feedRecordSchema,
  healthSchema,
  expenseSchema,
} from "@/lib/validations";

describe("dogSchema", () => {
  it("passes with name only", () => {
    const result = dogSchema.safeParse({ name: "小白" });
    expect(result.success).toBe(true);
  });

  it("passes with all fields", () => {
    const result = dogSchema.safeParse({
      name: "小黑",
      breed: "柴犬",
      dob: "2020-01-01",
      weight: "5.5",
      sex: "male",
      notes: "很乖",
    });
    expect(result.success).toBe(true);
    expect(result.data?.weight).toBe(5.5);
  });

  it("fails when name is empty", () => {
    const result = dogSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it("accepts empty string weight (optional)", () => {
    const result = dogSchema.safeParse({ name: "小白", weight: "" });
    expect(result.success).toBe(true);
  });

  it("accepts chipNumber and motherChipNumber", () => {
    const result = dogSchema.safeParse({
      name: "小白",
      chipNumber: "123456789012345",
      motherChipNumber: "987654321098765",
    });
    expect(result.success).toBe(true);
    expect(result.data?.chipNumber).toBe("123456789012345");
    expect(result.data?.motherChipNumber).toBe("987654321098765");
  });

  it("passes without chipNumber and motherChipNumber (optional)", () => {
    const result = dogSchema.safeParse({ name: "小白" });
    expect(result.success).toBe(true);
    expect(result.data?.chipNumber).toBeUndefined();
    expect(result.data?.motherChipNumber).toBeUndefined();
  });
});

describe("inviteMemberSchema", () => {
  it("passes with valid email", () => {
    const result = inviteMemberSchema.safeParse({ email: "friend@example.com" });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email format", () => {
    const result = inviteMemberSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it("fails with empty email", () => {
    const result = inviteMemberSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });
});

describe("careSchema", () => {
  it("passes with required fields", () => {
    const result = careSchema.safeParse({ type: "walk", date: "2024-01-01" });
    expect(result.success).toBe(true);
  });

  it("fails without type", () => {
    const result = careSchema.safeParse({ type: "", date: "2024-01-01" });
    expect(result.success).toBe(false);
  });

  it("fails without date", () => {
    const result = careSchema.safeParse({ type: "walk", date: "" });
    expect(result.success).toBe(false);
  });

  it("coerces durationMins to number", () => {
    const result = careSchema.safeParse({
      type: "walk",
      date: "2024-01-01",
      durationMins: "30",
    });
    expect(result.success).toBe(true);
    expect(result.data?.durationMins).toBe(30);
  });
});

describe("feedPlanSchema", () => {
  it("passes with required fields", () => {
    const result = feedPlanSchema.safeParse({
      foodName: "皇家",
      amountGrams: "100",
      frequency: "twice_daily",
    });
    expect(result.success).toBe(true);
    expect(result.data?.amountGrams).toBe(100);
  });

  it("fails when amountGrams is 0", () => {
    const result = feedPlanSchema.safeParse({
      foodName: "皇家",
      amountGrams: "0",
      frequency: "twice_daily",
    });
    expect(result.success).toBe(false);
  });

  it("fails without foodName", () => {
    const result = feedPlanSchema.safeParse({
      foodName: "",
      amountGrams: "100",
      frequency: "twice_daily",
    });
    expect(result.success).toBe(false);
  });
});

describe("feedRecordSchema", () => {
  it("passes with required fields", () => {
    const result = feedRecordSchema.safeParse({
      foodName: "皇家",
      date: "2024-01-01",
      amountGrams: "80",
    });
    expect(result.success).toBe(true);
  });
});

describe("healthSchema", () => {
  it("passes with required fields", () => {
    const result = healthSchema.safeParse({
      type: "vaccine",
      title: "狂犬病疫苗",
      date: "2024-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("fails without title", () => {
    const result = healthSchema.safeParse({
      type: "vaccine",
      title: "",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("expenseSchema", () => {
  it("passes with all required fields", () => {
    const result = expenseSchema.safeParse({
      dogId: "abc123",
      category: "vet",
      amount: "500",
      description: "年度健檢",
      date: "2024-01-01",
    });
    expect(result.success).toBe(true);
    expect(result.data?.amount).toBe(500);
  });

  it("fails when amount is 0", () => {
    const result = expenseSchema.safeParse({
      dogId: "abc123",
      category: "vet",
      amount: "0",
      description: "健檢",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("fails without description", () => {
    const result = expenseSchema.safeParse({
      dogId: "abc123",
      category: "vet",
      amount: "500",
      description: "",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("fails without dogId", () => {
    const result = expenseSchema.safeParse({
      dogId: "",
      category: "vet",
      amount: "500",
      description: "健檢",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });
});
