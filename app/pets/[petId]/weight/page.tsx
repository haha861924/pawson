import { getWeightRecords } from "@/lib/actions/weights";
import { WeightChart } from "@/components/weights/WeightChart";
import { WeightRecordList } from "@/components/weights/WeightRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function WeightPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const records = await getWeightRecords(petId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="成長曲線"
        action={{ label: "新增體重記錄", href: `/pets/${petId}/weight/new` }}
      />
      {records.length === 0 ? (
        <EmptyState
          title="尚無體重記錄"
          description="開始追蹤寵物的體重變化"
          action={{ label: "新增體重記錄", href: `/pets/${petId}/weight/new` }}
        />
      ) : (
        <>
          <WeightChart records={records} />
          <div>
            <h2 className="text-lg font-semibold mb-3">體重記錄</h2>
            <WeightRecordList records={records} petId={petId} />
          </div>
        </>
      )}
    </div>
  );
}
