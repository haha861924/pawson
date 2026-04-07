import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the server action to avoid Prisma initialization
vi.mock("@/lib/actions/feedReviews", () => ({
  deleteFeedReview: vi.fn(),
}));

import { FeedReviewList } from "@/components/feeding/FeedReviewList";

const makeReviews = () => [
  {
    id: "r1",
    foodName: "皇家小型犬",
    brand: "Royal Canin",
    rating: 4,
    review: "狗狗很喜歡",
    createdAt: new Date("2026-04-01"),
  },
  {
    id: "r2",
    foodName: "希爾思",
    brand: null,
    rating: 2,
    review: null,
    createdAt: new Date("2026-04-02"),
  },
];

describe("FeedReviewList", () => {
  it("renders food names", () => {
    render(<FeedReviewList reviews={makeReviews()} petId="pet1" />);
    expect(screen.getByText("皇家小型犬")).toBeInTheDocument();
    expect(screen.getByText("希爾思")).toBeInTheDocument();
  });

  it("renders brand badge when present", () => {
    render(<FeedReviewList reviews={makeReviews()} petId="pet1" />);
    expect(screen.getByText("Royal Canin")).toBeInTheDocument();
  });

  it("renders review text when present", () => {
    render(<FeedReviewList reviews={makeReviews()} petId="pet1" />);
    expect(screen.getByText("狗狗很喜歡")).toBeInTheDocument();
  });

  it("renders edit links", () => {
    render(<FeedReviewList reviews={makeReviews()} petId="pet1" />);
    const editLinks = screen.getAllByLabelText("編輯");
    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute(
      "href",
      "/pets/pet1/feeding/reviews/r1/edit"
    );
  });

  it("hides actions when showActions is false", () => {
    render(
      <FeedReviewList reviews={makeReviews()} petId="pet1" showActions={false} />
    );
    expect(screen.queryAllByLabelText("編輯")).toHaveLength(0);
    expect(screen.queryAllByLabelText("刪除")).toHaveLength(0);
  });
});
