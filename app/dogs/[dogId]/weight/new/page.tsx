import { createWeightRecord } from "@/lib/actions/weights";
import { WeightRecordForm } from "@/components/weights/WeightRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export default async function NewWeightRecordPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createWeightRecord(dogId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增體重記錄" />
      <WeightRecordForm action={action} cancelHref={`/dogs/${dogId}/weight`} />
    </div>
  );
}
