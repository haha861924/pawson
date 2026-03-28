import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="尚無資料" />);
    expect(screen.getByText("尚無資料")).toBeInTheDocument();
  });

  it("renders optional description", () => {
    render(<EmptyState title="空的" description="請先新增資料" />);
    expect(screen.getByText("請先新增資料")).toBeInTheDocument();
  });

  it("renders action link when provided", () => {
    render(<EmptyState title="空的" action={{ label: "新增", href: "/new" }} />);
    const link = screen.getByText("新增");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/new");
  });

  it("does not render action link when not provided", () => {
    render(<EmptyState title="空的" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
