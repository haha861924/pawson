import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalendarView } from "@/components/diary/CalendarView";
import { format } from "date-fns";

describe("CalendarView", () => {
  const mockLogs = [
    {
      id: "1",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      weight: 25.5,
      appetite: "good",
      stoolCondition: "normal",
      mood: "energetic",
      hasVomiting: false,
      temperature: 38.5,
    },
    {
      id: "2",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      weight: null,
      appetite: "excellent",
      stoolCondition: null,
      mood: null,
      hasVomiting: true,
      temperature: null,
    },
  ];

  it("renders calendar with current month", () => {
    render(<CalendarView logs={[]} />);
    const currentMonth = format(new Date(), "yyyy年 M月");
    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });

  it("renders weekday headers", () => {
    render(<CalendarView logs={[]} />);
    expect(screen.getByText("日")).toBeInTheDocument();
    expect(screen.getByText("一")).toBeInTheDocument();
    expect(screen.getByText("二")).toBeInTheDocument();
    expect(screen.getByText("三")).toBeInTheDocument();
    expect(screen.getByText("四")).toBeInTheDocument();
    expect(screen.getByText("五")).toBeInTheDocument();
    expect(screen.getByText("六")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<CalendarView logs={[]} />);
    expect(screen.getByText("今天")).toBeInTheDocument();
  });

  it("displays weight indicator for logs with weight", () => {
    render(<CalendarView logs={mockLogs} />);
    expect(screen.getByText("📊 25.5kg")).toBeInTheDocument();
  });

  it("displays appetite indicator", () => {
    render(<CalendarView logs={mockLogs} />);
    expect(screen.getAllByTitle("good")[0]).toHaveTextContent("🍽️");
  });

  it("displays stool condition indicator", () => {
    render(<CalendarView logs={mockLogs} />);
    expect(screen.getByTitle("normal")).toHaveTextContent("💩");
  });

  it("displays vomiting indicator", () => {
    render(<CalendarView logs={mockLogs} />);
    expect(screen.getByTitle("嘔吐")).toHaveTextContent("🤮");
  });

  it("displays mood indicator", () => {
    render(<CalendarView logs={mockLogs} />);
    expect(screen.getByTitle("energetic")).toHaveTextContent("😊");
  });

  it("displays temperature indicator with value", () => {
    render(<CalendarView logs={mockLogs} />);
    const tempElement = screen.getByTitle("體溫 38.5°C");
    expect(tempElement).toBeInTheDocument();
    expect(tempElement).toHaveTextContent("🌡️ 38.5°C");
  });

  it("displays legend with all indicators", () => {
    render(<CalendarView logs={[]} />);
    expect(screen.getByText(/📊 體重/)).toBeInTheDocument();
    expect(screen.getByText(/🍽️ 飲食/)).toBeInTheDocument();
    expect(screen.getByText(/💩 排便/)).toBeInTheDocument();
    expect(screen.getByText(/🤮 嘔吐/)).toBeInTheDocument();
    expect(screen.getByText(/😊 精神/)).toBeInTheDocument();
    expect(screen.getByText(/🌡️ 體溫/)).toBeInTheDocument();
  });

  it("renders all days of the month", () => {
    render(<CalendarView logs={[]} />);
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Check that day 1 and last day are rendered
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(daysInMonth.toString())).toBeInTheDocument();
  });

  it("highlights today with special class", () => {
    render(<CalendarView logs={[]} />);
    const todayButton = screen.getAllByRole("button").find((btn) => {
      return btn.classList.contains("bg-blue-50");
    });
    expect(todayButton).toBeDefined();
  });

  it("highlights days with logs", () => {
    render(<CalendarView logs={mockLogs} />);
    const logButtons = screen.getAllByRole("button").filter((btn) => {
      return btn.classList.contains("bg-green-50");
    });
    // Should have at least the buttons with logs (may overlap with today)
    expect(logButtons.length).toBeGreaterThan(0);
  });
});
