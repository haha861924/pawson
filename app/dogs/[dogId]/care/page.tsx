import { getCareRecordsByDog } from "@/lib/actions/care";
import { CareRecordList } from "@/components/care/CareRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function CarePage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const records = await getCareRecordsByDog(dogId);

  return (
    <div>
      <PageHeader
        title="日常照護"
        action={{ label: "記錄照護", href: `/dogs/${dogId}/care/new` }}
      />
      {records.length === 0 ? (
        <EmptyState
          title="尚無照護記錄"
          action={{ label: "記錄照護", href: `/dogs/${dogId}/care/new` }}
        />
      ) : (
        <CareRecordList records={records} dogId={dogId} />
      )}
    </div>
  );
}
