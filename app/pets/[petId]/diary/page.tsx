import { getDailyHealthLogs } from "@/lib/actions/dailyHealthLogs";
import { getWeightRecords } from "@/lib/actions/weights";
import { CalendarView } from "@/components/diary/CalendarView";
import { DailyHealthLogList } from "@/components/diary/DailyHealthLogList";
import { WeightChart } from "@/components/weights/WeightChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const [logs, weightRecords] = await Promise.all([
    getDailyHealthLogs(petId),
    getWeightRecords(petId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="成長日誌"
        action={{ label: "新增記錄", href: `/pets/${petId}/diary/new` }}
      />

      <CalendarView logs={logs} />

      {weightRecords.length >= 2 && (
        <WeightChart records={weightRecords} />
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">最近紀錄</h2>
        {logs.length === 0 ? (
          <EmptyState
            title="尚無日誌記錄"
            description="開始記錄寵物每日的健康狀況"
            action={{ label: "新增記錄", href: `/pets/${petId}/diary/new` }}
          />
        ) : (
          <DailyHealthLogList logs={logs} petId={petId} />
        )}
      </div>
    </div>
  );
}
