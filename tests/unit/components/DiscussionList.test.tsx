import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiscussionList } from "@/components/community/DiscussionList";

const makeDiscussions = () => [
  {
    id: "d1",
    title: "推薦好飼料",
    content: "這款飼料狗狗很喜歡吃",
    category: "feed",
    imageUrl: null,
    createdAt: new Date("2026-04-01T10:00:00"),
    author: { id: "u1", name: "小明", image: null },
    _count: { comments: 3 },
  },
  {
    id: "d2",
    title: "保健品推薦",
    content: "分享幾款保健品",
    category: "supplement",
    imageUrl: null,
    createdAt: new Date("2026-04-02T14:00:00"),
    author: { id: "u2", name: null, image: null },
    _count: { comments: 0 },
  },
];

describe("DiscussionList", () => {
  it("renders discussion titles", () => {
    render(<DiscussionList discussions={makeDiscussions()} />);
    expect(screen.getByText("推薦好飼料")).toBeInTheDocument();
    expect(screen.getByText("保健品推薦")).toBeInTheDocument();
  });

  it("renders category badges", () => {
    render(<DiscussionList discussions={makeDiscussions()} />);
    expect(screen.getByText("飼料")).toBeInTheDocument();
    expect(screen.getByText("保健品")).toBeInTheDocument();
  });

  it("renders author names", () => {
    render(<DiscussionList discussions={makeDiscussions()} />);
    expect(screen.getByText("小明")).toBeInTheDocument();
    expect(screen.getByText("匿名")).toBeInTheDocument();
  });

  it("renders comment counts", () => {
    render(<DiscussionList discussions={makeDiscussions()} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders links to discussion detail pages", () => {
    render(<DiscussionList discussions={makeDiscussions()} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/community/d1");
    expect(links[1]).toHaveAttribute("href", "/community/d2");
  });
});
