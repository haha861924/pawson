import { createHealthRecord } from "@/lib/actions/health";
import { HealthRecordForm } from "@/components/health/HealthRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewHealthRecordPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createHealthRecord(petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增健康記錄" />
      <HealthRecordForm action={action} cancelHref={`/pets/${petId}/health`} />
    </div>
  );
}
