"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DailyLog = {
  id: string;
  date: Date;
  weight: number | null;
  appetite: string | null;
  stoolCondition: string | null;
  mood: string | null;
  hasVomiting: boolean;
  temperature: number | null;
};

type CalendarViewProps = {
  logs: DailyLog[];
};

export function CalendarView({ logs }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  const logsByDate = new Map(
    logs.map((log) => [format(log.date, "yyyy-MM-dd"), log])
  );

  const getEmojiIndicators = (log: DailyLog | undefined) => {
    if (!log) return null;
    return (
      <div className="flex flex-wrap gap-0.5 text-xs mt-1 justify-center">
        {log.weight && <div title="體重">📊 {log.weight}kg</div>}
        {log.appetite && <div title={log.appetite}>🍽️</div>}
        {log.stoolCondition && <div title={log.stoolCondition}>💩</div>}
        {log.hasVomiting && <div title="嘔吐">🤮</div>}
        {log.mood && <div title={log.mood}>😊</div>}
        {log.temperature && (
          <div title={`體溫 ${log.temperature}°C`} className="text-red-600 dark:text-red-400">
            🌡️ {log.temperature}°C
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          {format(currentMonth, "yyyy年 M月", { locale: zhTW })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            今天
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month start */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days of month */}
        {daysInMonth.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const log = logsByDate.get(dateKey);
          const isToday = isSameDay(day, new Date());

          return (
            <Button
              key={dateKey}
              variant="ghost"
              className={cn(
                "h-auto min-h-[80px] flex-col items-start p-2 relative",
                isToday && "bg-blue-50 dark:bg-blue-950",
                log && "bg-green-50 dark:bg-green-950"
              )}
            >
              <div className="font-medium">{format(day, "d")}</div>
              {getEmojiIndicators(log)}
            </Button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        📊 體重 | 🍽️ 飲食 | 💩 排便 | 🤮 嘔吐 | 😊 精神 | 🌡️ 體溫
      </div>
    </div>
  );
}
