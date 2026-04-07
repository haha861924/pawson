"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { zhTW } from "date-fns/locale";
import {
  APPETITE_OPTIONS,
  STOOL_OPTIONS,
  MOOD_OPTIONS,
  getLabel,
} from "@/lib/types";

interface DailyHealthLog {
  id: string;
  date: Date;
  weight: number | null;
  appetite: string | null;
  stoolCondition: string | null;
  mood: string | null;
  hasVomiting: boolean;
  temperature: number | null;
  notes: string | null;
}

interface CalendarViewProps {
  logs: DailyHealthLog[];
}

export function CalendarView({ logs }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const logDates = logs.map((l) => new Date(l.date));

  const selectedLog = selectedDate
    ? logs.find((l) => isSameDay(new Date(l.date), selectedDate))
    : undefined;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">日曆視圖</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={zhTW}
          modifiers={{ hasLog: logDates }}
          modifiersClassNames={{ hasLog: "bg-primary/20 font-semibold rounded-full" }}
        />
        <div className="flex-1 min-w-0">
          {selectedDate && (
            <p className="text-sm font-medium mb-2">
              {format(selectedDate, "yyyy/MM/dd (E)", { locale: zhTW })}
            </p>
          )}
          {selectedLog ? (
            <div className="space-y-1 text-sm">
              {selectedLog.weight != null && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">體重</span>
                  <span>{selectedLog.weight} kg</span>
                </div>
              )}
              {selectedLog.appetite && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">食慾</span>
                  <span>{getLabel(APPETITE_OPTIONS, selectedLog.appetite)}</span>
                </div>
              )}
              {selectedLog.stoolCondition && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">排便</span>
                  <span>{getLabel(STOOL_OPTIONS, selectedLog.stoolCondition)}</span>
                </div>
              )}
              {selectedLog.mood && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">精神</span>
                  <span>{getLabel(MOOD_OPTIONS, selectedLog.mood)}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-muted-foreground w-16 shrink-0">嘔吐</span>
                <span>{selectedLog.hasVomiting ? "有" : "無"}</span>
              </div>
              {selectedLog.temperature != null && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">體溫</span>
                  <span>{selectedLog.temperature} °C</span>
                </div>
              )}
              {selectedLog.notes && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-16 shrink-0">備註</span>
                  <span>{selectedLog.notes}</span>
                </div>
              )}
            </div>
          ) : selectedDate ? (
            <p className="text-sm text-muted-foreground">此日無記錄</p>
          ) : (
            <p className="text-sm text-muted-foreground">點選日期查看當日摘要</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
