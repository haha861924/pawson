import { notFound } from "next/navigation";
import { getHealthRecord, updateHealthRecord } from "@/lib/actions/health";
import { HealthRecordForm } from "@/components/health/HealthRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function EditHealthRecordPage({
  params,
}: {
  params: Promise<{ petId: string; recordId: string }>;
}) {
  const { petId, recordId } = await params;
  const record = await getHealthRecord(recordId);
  if (!record || record.petId !== petId) notFound();

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return updateHealthRecord(recordId, petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="編輯健康記錄" />
      <HealthRecordForm
        action={action}
        cancelHref={`/pets/${petId}/health`}
        defaultValues={record}
      />
    </div>
  );
}
