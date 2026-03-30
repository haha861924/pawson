import { getHealthRecords } from "@/lib/actions/health";
import { HealthRecordList } from "@/components/health/HealthRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = 'force-dynamic';

export default async function HealthPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const records = await getHealthRecords(petId);

  return (
    <div>
      <PageHeader
        title="健康照護"
        action={{ label: "新增健康記錄", href: `/pets/${petId}/health/new` }}
      />
      {records.length === 0 ? (
        <EmptyState
          title="尚無健康記錄"
          action={{ label: "新增健康記錄", href: `/pets/${petId}/health/new` }}
        />
      ) : (
        <HealthRecordList records={records} petId={petId} />
      )}
    </div>
  );
}
