import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Plus } from "lucide-react";
import { getDailyHealthLogs } from "@/lib/actions/dailyHealthLogs";
import { getDogById } from "@/lib/actions/dogs";
import { getRequiredSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarView } from "@/components/diary/CalendarView";
import { WeightChart } from "@/components/weights/WeightChart";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteDailyHealthLog } from "@/lib/actions/dailyHealthLogs";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { getLabel, APPETITE_OPTIONS, STOOL_OPTIONS, MOOD_OPTIONS } from "@/lib/types";

export default async function DiaryPage({ params }: { params: Promise<{ dogId: string }> }) {
  const { dogId } = await params;
  const session = await getRequiredSession();

  const [dog, member, logs] = await Promise.all([
    getDogById(dogId),
    prisma.dogMember.findUnique({
      where: { dogId_userId: { dogId, userId: session.user.id } },
    }),
    getDailyHealthLogs(dogId),
  ]);

  if (!dog || !member?.canView) notFound();

  // Transform logs for calendar
  type Log = typeof logs[number];
  const calendarLogs = logs.map((log: Log) => ({
    ...log,
    date: new Date(log.date),
  }));

  // Prepare weight records for chart (filter logs with weight data)
  const weightRecords = logs
    .filter((log: Log) => log.weight)
    .map((log: Log) => ({
      id: log.id,
      weight: log.weight!,
      date: new Date(log.date),
    }));

  return (
    <div>
      <PageHeader title="成長曲線" />

      {member.canEdit && (
        <div className="mb-6">
          <Link href={`/dogs/${dogId}/diary/new`} className={cn(buttonVariants(), "gap-2")}>
            <Plus className="h-4 w-4" />
            新增紀錄
          </Link>
        </div>
      )}

      {logs.length === 0 ? (
        <EmptyState
          title="尚無健康紀錄"
          description="開始記錄狗狗的日常健康狀況"
        />
      ) : (
        <div className="space-y-6">
          {/* Calendar View */}
          <CalendarView logs={calendarLogs} />

          {/* Weight Chart */}
          <WeightChart records={weightRecords} />

          {/* Recent Logs */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">最近紀錄</h3>
            <div className="space-y-4">
              {logs.map((log: Log) => (
                <div key={log.id} className="flex justify-between items-start border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex-1">
                    <div className="font-medium mb-2">
                      {format(new Date(log.date), "yyyy/MM/dd (EEE)", { locale: zhTW })}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {log.weight && (
                        <div>
                          <span className="text-muted-foreground">體重:</span> {log.weight} kg
                        </div>
                      )}
                      {log.appetite && (
                        <div>
                          <span className="text-muted-foreground">飲食:</span>{" "}
                          {getLabel(APPETITE_OPTIONS, log.appetite)}
                        </div>
                      )}
                      {log.stoolCondition && (
                        <div>
                          <span className="text-muted-foreground">排便:</span>{" "}
                          {getLabel(STOOL_OPTIONS, log.stoolCondition)}
                        </div>
                      )}
                      {log.mood && (
                        <div>
                          <span className="text-muted-foreground">精神:</span>{" "}
                          {getLabel(MOOD_OPTIONS, log.mood)}
                        </div>
                      )}
                      {log.hasVomiting && <div className="text-orange-600">有嘔吐症狀</div>}
                      {log.temperature && (
                        <div>
                          <span className="text-muted-foreground">體溫:</span>{" "}
                          <span>{log.temperature}°C</span>
                        </div>
                      )}
                    </div>
                    {log.notes && <p className="text-sm text-muted-foreground mt-2">{log.notes}</p>}
                  </div>
                  {member.canEdit && (
                    <DeleteButton
                      label="刪除"
                      onDelete={async () => {
                        "use server";
                        await deleteDailyHealthLog(log.id, dogId);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
