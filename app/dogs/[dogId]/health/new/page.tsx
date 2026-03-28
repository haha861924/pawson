import { createHealthRecord } from "@/lib/actions/health";
import { HealthRecordForm } from "@/components/health/HealthRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function NewHealthRecordPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createHealthRecord(dogId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增健康記錄" />
      <HealthRecordForm action={action} cancelHref={`/dogs/${dogId}/health`} />
    </div>
  );
}
