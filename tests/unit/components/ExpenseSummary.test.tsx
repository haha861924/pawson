import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";

describe("ExpenseSummary", () => {
  it("displays total amount formatted", () => {
    render(<ExpenseSummary total={12500} byCategory={{}} />);
    expect(screen.getByText("NT$ 12,500")).toBeInTheDocument();
  });

  it("shows zero total when no expenses", () => {
    render(<ExpenseSummary total={0} byCategory={{}} />);
    expect(screen.getByText("NT$ 0")).toBeInTheDocument();
    expect(screen.getByText("尚無資料")).toBeInTheDocument();
  });

  it("shows category breakdown", () => {
    render(
      <ExpenseSummary
        total={3000}
        byCategory={{ vet: 2000, food: 1000 }}
      />
    );
    expect(screen.getByText("獸醫")).toBeInTheDocument();
    expect(screen.getByText("NT$ 2,000")).toBeInTheDocument();
    expect(screen.getByText("飼料")).toBeInTheDocument();
    expect(screen.getByText("NT$ 1,000")).toBeInTheDocument();
  });

  it("renders category bars based on proportions", () => {
    const { container } = render(
      <ExpenseSummary total={100} byCategory={{ food: 75, vet: 25 }} />
    );
    const bars = container.querySelectorAll(".bg-primary");
    expect(bars.length).toBe(2);
  });
});
