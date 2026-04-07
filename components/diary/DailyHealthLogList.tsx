"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteDailyHealthLog } from "@/lib/actions/dailyHealthLogs";
import { APPETITE_OPTIONS, STOOL_OPTIONS, MOOD_OPTIONS, getLabel } from "@/lib/types";

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

export function DailyHealthLogList({
  logs,
  petId,
}: {
  logs: DailyHealthLog[];
  petId: string;
}) {
  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="p-4 rounded-lg border bg-card">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-2">
                {format(new Date(log.date), "yyyy/MM/dd (E)", { locale: zhTW })}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {log.weight != null && <span>體重：{log.weight} kg</span>}
                {log.appetite && <span>食慾：{getLabel(APPETITE_OPTIONS, log.appetite)}</span>}
                {log.stoolCondition && (
                  <span>排便：{getLabel(STOOL_OPTIONS, log.stoolCondition)}</span>
                )}
                {log.mood && <span>精神：{getLabel(MOOD_OPTIONS, log.mood)}</span>}
                <span>嘔吐：{log.hasVomiting ? "有" : "無"}</span>
                {log.temperature != null && <span>體溫：{log.temperature} °C</span>}
              </div>
              {log.notes && (
                <p className="text-sm mt-1 text-muted-foreground">{log.notes}</p>
              )}
            </div>
            <DeleteButton
              onDelete={async () => {
                await deleteDailyHealthLog(log.id, petId);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
