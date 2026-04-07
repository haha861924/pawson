import { describe, it, expect } from "vitest";
import { discussionSchema, discussionCommentSchema, feedReviewSchema } from "@/lib/validations";

describe("feedReviewSchema", () => {
  it("passes with all required fields", () => {
    const result = feedReviewSchema.safeParse({
      foodName: "皇家小型犬",
      brand: "Royal Canin",
      rating: "4",
      review: "狗狗很喜歡",
    });
    expect(result.success).toBe(true);
    expect(result.data?.rating).toBe(4);
  });

  it("fails without foodName", () => {
    const result = feedReviewSchema.safeParse({
      foodName: "",
      rating: "3",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.foodName).toBeDefined();
  });

  it("fails with rating 0", () => {
    const result = feedReviewSchema.safeParse({
      foodName: "皇家",
      rating: "0",
    });
    expect(result.success).toBe(false);
  });

  it("fails with rating above 5", () => {
    const result = feedReviewSchema.safeParse({
      foodName: "皇家",
      rating: "6",
    });
    expect(result.success).toBe(false);
  });

  it("brand and review are optional", () => {
    const result = feedReviewSchema.safeParse({
      foodName: "皇家",
      rating: "5",
    });
    expect(result.success).toBe(true);
  });
});

describe("discussionSchema", () => {
  it("passes with all required fields", () => {
    const result = discussionSchema.safeParse({
      title: "推薦好飼料",
      content: "這款飼料狗狗非常喜歡",
      category: "feed",
    });
    expect(result.success).toBe(true);
  });

  it("fails without title", () => {
    const result = discussionSchema.safeParse({
      title: "",
      content: "內容",
      category: "feed",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.title).toBeDefined();
  });

  it("fails without content", () => {
    const result = discussionSchema.safeParse({
      title: "標題",
      content: "",
      category: "feed",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.content).toBeDefined();
  });

  it("fails without category", () => {
    const result = discussionSchema.safeParse({
      title: "標題",
      content: "內容",
      category: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.category).toBeDefined();
  });

  it("imageUrl is optional", () => {
    const result = discussionSchema.safeParse({
      title: "標題",
      content: "內容",
      category: "medication",
    });
    expect(result.success).toBe(true);
    expect(result.data?.imageUrl).toBeUndefined();
  });

  it("accepts imageUrl", () => {
    const result = discussionSchema.safeParse({
      title: "標題",
      content: "內容",
      category: "supplement",
      imageUrl: "https://example.com/image.jpg",
    });
    expect(result.success).toBe(true);
    expect(result.data?.imageUrl).toBe("https://example.com/image.jpg");
  });
});

describe("discussionCommentSchema", () => {
  it("passes with content", () => {
    const result = discussionCommentSchema.safeParse({
      content: "好文章！",
    });
    expect(result.success).toBe(true);
  });

  it("fails without content", () => {
    const result = discussionCommentSchema.safeParse({
      content: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.content).toBeDefined();
  });
});
