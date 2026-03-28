"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { CareTypeBadge } from "./CareTypeBadge";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteCareRecord } from "@/lib/actions/care";

interface CareRecord {
  id: string;
  type: string;
  date: Date;
  durationMins: number | null;
  notes: string | null;
}

export function CareRecordList({
  records,
  dogId,
}: {
  records: CareRecord[];
  dogId: string;
}) {
  return (
    <div className="space-y-2">
      {records.map((record) => (
        <div
          key={record.id}
          className="flex items-start gap-3 p-4 rounded-lg border bg-card"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CareTypeBadge type={record.type} />
              {record.durationMins && (
                <span className="text-xs text-muted-foreground">
                  {record.durationMins} 分鐘
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(record.date), "yyyy/MM/dd (EEEE)", { locale: zhTW })}
            </p>
            {record.notes && (
              <p className="text-sm mt-1 text-muted-foreground">{record.notes}</p>
            )}
          </div>
          <DeleteButton
            onDelete={async () => {
              await deleteCareRecord(record.id, dogId);
            }}
          />
        </div>
      ))}
    </div>
  );
}
