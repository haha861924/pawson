"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteFeedRecord } from "@/lib/actions/feeding";
import { MEAL_TIMES, getLabel } from "@/lib/types";

interface FeedRecord {
  id: string;
  foodName: string;
  amountGrams: number;
  mealTime: string | null;
  date: Date;
  notes: string | null;
}

export function FeedRecordList({
  records,
  dogId,
}: {
  records: FeedRecord[];
  dogId: string;
}) {
  return (
    <div className="space-y-2">
      {records.map((record) => (
        <div key={record.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{record.foodName}</span>
              <span className="text-xs text-muted-foreground">{record.amountGrams} g</span>
              {record.mealTime && (
                <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                  {getLabel(MEAL_TIMES, record.mealTime)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(record.date), "yyyy/MM/dd (EEEE)", { locale: zhTW })}
            </p>
            {record.notes && (
              <p className="text-sm mt-1 text-muted-foreground">{record.notes}</p>
            )}
          </div>
          <DeleteButton
            onDelete={async () => {
              await deleteFeedRecord(record.id, dogId);
            }}
          />
        </div>
      ))}
    </div>
  );
}
