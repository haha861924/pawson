"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteWeightRecord } from "@/lib/actions/weights";

interface WeightRecord {
  id: string;
  weight: number;
  date: Date;
  notes: string | null;
}

export function WeightRecordList({
  records,
  dogId,
}: {
  records: WeightRecord[];
  dogId: string;
}) {
  return (
    <div className="space-y-2">
      {records.map((record) => (
        <div key={record.id} className="p-4 rounded-lg border bg-card">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{record.weight} kg</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(record.date), "yyyy/MM/dd (E)", { locale: zhTW })}
                </span>
              </div>
              {record.notes && (
                <p className="text-sm mt-1 text-muted-foreground">{record.notes}</p>
              )}
            </div>
            <DeleteButton
              onDelete={async () => {
                await deleteWeightRecord(record.id, dogId);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
