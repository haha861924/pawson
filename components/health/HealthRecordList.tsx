"use client";

import { format, isPast, isFuture, differenceInDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { HealthTypeBadge } from "./HealthTypeBadge";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteHealthRecord } from "@/lib/actions/health";
import { cn } from "@/lib/utils";

interface HealthRecord {
  id: string;
  type: string;
  title: string;
  description: string | null;
  vetName: string | null;
  date: Date;
  nextDueDate: Date | null;
}

export function HealthRecordList({
  records,
  dogId,
}: {
  records: HealthRecord[];
  dogId: string;
}) {
  return (
    <div className="space-y-2">
      {records.map((record) => {
        const nextDue = record.nextDueDate ? new Date(record.nextDueDate) : null;
        const isOverdue = nextDue && isPast(nextDue);
        const daysUntil = nextDue ? differenceInDays(nextDue, new Date()) : null;

        return (
          <div key={record.id} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <HealthTypeBadge type={record.type} />
                  <span className="font-medium">{record.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(record.date), "yyyy/MM/dd", { locale: zhTW })}
                  {record.vetName && ` · ${record.vetName}`}
                </p>
                {record.description && (
                  <p className="text-sm mt-1 text-muted-foreground">{record.description}</p>
                )}
                {nextDue && (
                  <p
                    className={cn(
                      "text-xs mt-1 font-medium",
                      isOverdue ? "text-destructive" : daysUntil! <= 7 ? "text-orange-600" : "text-muted-foreground"
                    )}
                  >
                    下次：{format(nextDue, "yyyy/MM/dd")}
                    {isOverdue && " (已過期)"}
                    {!isOverdue && daysUntil! <= 30 && ` (剩 ${daysUntil} 天)`}
                  </p>
                )}
              </div>
              <DeleteButton
                onDelete={async () => {
                  await deleteHealthRecord(record.id, dogId);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
