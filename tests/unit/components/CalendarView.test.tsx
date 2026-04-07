import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarView } from "@/components/diary/CalendarView";

// react-day-picker uses matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const makeLogs = () => [
  {
    id: "log1",
    date: new Date("2026-03-01"),
    weight: 5.2,
    appetite: "good",
    stoolCondition: "normal",
    mood: "energetic",
    hasVomiting: false,
    temperature: 38.5,
    notes: "狀況良好",
  },
  {
    id: "log2",
    date: new Date("2026-03-10"),
    weight: null,
    appetite: null,
    stoolCondition: null,
    mood: "lethargic",
    hasVomiting: true,
    temperature: null,
    notes: null,
  },
];

describe("CalendarView", () => {
  it("renders calendar heading", () => {
    render(<CalendarView logs={[]} />);
    expect(screen.getByText("日曆視圖")).toBeInTheDocument();
  });

  it("shows placeholder text before any date selected", () => {
    render(<CalendarView logs={[]} />);
    expect(screen.getByText("點選日期查看當日摘要")).toBeInTheDocument();
  });

  it("renders without crashing when logs provided", () => {
    const { container } = render(<CalendarView logs={makeLogs()} />);
    expect(container).toBeTruthy();
  });
});
