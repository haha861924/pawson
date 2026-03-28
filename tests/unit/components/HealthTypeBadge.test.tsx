import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthTypeBadge } from "@/components/health/HealthTypeBadge";

describe("HealthTypeBadge", () => {
  it("renders correct labels", () => {
    const cases = [
      { type: "vet_visit", label: "就診" },
      { type: "vaccine", label: "疫苗" },
      { type: "medication", label: "用藥" },
      { type: "deworming", label: "驅蟲" },
      { type: "dental", label: "牙科" },
      { type: "other", label: "其他" },
    ];
    for (const { type, label } of cases) {
      const { unmount } = render(<HealthTypeBadge type={type} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });
});
