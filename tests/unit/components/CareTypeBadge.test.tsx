import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareTypeBadge } from "@/components/care/CareTypeBadge";

describe("CareTypeBadge", () => {
  it("renders the correct label for each type", () => {
    const cases = [
      { type: "walk", label: "散步" },
      { type: "bath", label: "洗澡" },
      { type: "grooming", label: "美容" },
      { type: "play", label: "玩耍" },
      { type: "training", label: "訓練" },
      { type: "other", label: "其他" },
    ];
    for (const { type, label } of cases) {
      const { unmount } = render(<CareTypeBadge type={type} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it("falls back to 'other' styling for unknown type", () => {
    render(<CareTypeBadge type="unknown_type" />);
    expect(screen.getByText("unknown_type")).toBeInTheDocument();
  });
});
