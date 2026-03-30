import { createWeightRecord } from "@/lib/actions/weights";
import { WeightRecordForm } from "@/components/weights/WeightRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export default async function NewWeightRecordPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createWeightRecord(petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增體重記錄" />
      <WeightRecordForm action={action} cancelHref={`/pets/${petId}/weight`} />
    </div>
  );
}
