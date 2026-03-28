import { getHealthRecordsByDog } from "@/lib/actions/health";
import { HealthRecordList } from "@/components/health/HealthRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function HealthPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const records = await getHealthRecordsByDog(dogId);

  return (
    <div>
      <PageHeader
        title="健康照護"
        action={{ label: "新增健康記錄", href: `/dogs/${dogId}/health/new` }}
      />
      {records.length === 0 ? (
        <EmptyState
          title="尚無健康記錄"
          action={{ label: "新增健康記錄", href: `/dogs/${dogId}/health/new` }}
        />
      ) : (
        <HealthRecordList records={records} dogId={dogId} />
      )}
    </div>
  );
}
