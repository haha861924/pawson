import { describe, it, expect } from "vitest";
import {
  petSchema,
  inviteMemberSchema,
  careSchema,
  feedPlanSchema,
  feedRecordSchema,
  healthSchema,
  expenseSchema,
  dailyHealthLogSchema,
} from "@/lib/validations";

describe("petSchema", () => {
  it("passes with name only", () => {
    const result = petSchema.safeParse({ name: "小白" });
    expect(result.success).toBe(true);
  });

  it("passes with all fields", () => {
    const result = petSchema.safeParse({
      name: "小黑",
      species: "dog",
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
    const result = petSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it("accepts empty string weight (optional)", () => {
    const result = petSchema.safeParse({ name: "小白", weight: "" });
    expect(result.success).toBe(true);
  });

  it("accepts species field for different pet types", () => {
    for (const species of ["dog", "cat", "rabbit", "bird"]) {
      const result = petSchema.safeParse({ name: "小白", species });
      expect(result.success).toBe(true);
      expect(result.data?.species).toBe(species);
    }
  });

  it("species is optional", () => {
    const result = petSchema.safeParse({ name: "小白" });
    expect(result.success).toBe(true);
    expect(result.data?.species).toBeUndefined();
  });

  it("accepts chipNumber and motherChipNumber", () => {
    const result = petSchema.safeParse({
      name: "小白",
      chipNumber: "123456789012345",
      motherChipNumber: "987654321098765",
    });
    expect(result.success).toBe(true);
    expect(result.data?.chipNumber).toBe("123456789012345");
    expect(result.data?.motherChipNumber).toBe("987654321098765");
  });

  it("passes without chipNumber and motherChipNumber (optional)", () => {
    const result = petSchema.safeParse({ name: "小白" });
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
      petId: "abc123",
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
      petId: "abc123",
      category: "vet",
      amount: "0",
      description: "健檢",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("fails without description", () => {
    const result = expenseSchema.safeParse({
      petId: "abc123",
      category: "vet",
      amount: "500",
      description: "",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("fails without petId", () => {
    const result = expenseSchema.safeParse({
      petId: "",
      category: "vet",
      amount: "500",
      description: "健檢",
      date: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("dailyHealthLogSchema", () => {
  it("passes with only required date", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      hasVomiting: "false",
    });
    expect(result.success).toBe(true);
  });

  it("passes with all fields", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      weight: "25.5",
      appetite: "good",
      stoolCondition: "normal",
      mood: "energetic",
      hasVomiting: "true",
      temperature: "38.5",
      notes: "今天很活潑",
    });
    expect(result.success).toBe(true);
    expect(result.data?.weight).toBe(25.5);
    expect(result.data?.temperature).toBe(38.5);
    expect(result.data?.hasVomiting).toBe(true);
  });

  it("fails without date", () => {
    const result = dailyHealthLogSchema.safeParse({ hasVomiting: "false" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.date).toBeDefined();
  });

  it("rejects negative weight", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      weight: "-5",
      hasVomiting: "false",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weight of 0", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      weight: "0",
      hasVomiting: "false",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional weight", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      weight: "",
      hasVomiting: "false",
    });
    expect(result.success).toBe(true);
  });

  it("rejects temperature below 35", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      temperature: "30",
      hasVomiting: "false",
    });
    expect(result.success).toBe(false);
  });

  it("rejects temperature above 45", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      temperature: "50",
      hasVomiting: "false",
    });
    expect(result.success).toBe(false);
  });

  it("accepts temperature within range", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      temperature: "38.5",
      hasVomiting: "false",
    });
    expect(result.success).toBe(true);
    expect(result.data?.temperature).toBe(38.5);
  });

  it("coerces hasVomiting string to boolean", () => {
    const uncheckedResult = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      hasVomiting: undefined,
    });
    expect(uncheckedResult.success).toBe(true);
    expect(uncheckedResult.data?.hasVomiting).toBe(false);

    const checkedResult = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      hasVomiting: "on",
    });
    expect(checkedResult.success).toBe(true);
    expect(checkedResult.data?.hasVomiting).toBe(true);
  });

  it("accepts empty string for optional temperature", () => {
    const result = dailyHealthLogSchema.safeParse({
      date: "2024-01-01",
      temperature: "",
      hasVomiting: "false",
    });
    expect(result.success).toBe(true);
  });
});
