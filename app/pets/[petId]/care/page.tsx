import { getCareRecords } from "@/lib/actions/care";
import { CareRecordList } from "@/components/care/CareRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = 'force-dynamic';

export default async function CarePage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const records = await getCareRecords(petId);

  return (
    <div>
      <PageHeader
        title="日常照護"
        action={{ label: "記錄照護", href: `/pets/${petId}/care/new` }}
      />
      {records.length === 0 ? (
        <EmptyState
          title="尚無照護記錄"
          action={{ label: "記錄照護", href: `/pets/${petId}/care/new` }}
        />
      ) : (
        <CareRecordList records={records} petId={petId} />
      )}
    </div>
  );
}
