import { createCareRecord } from "@/lib/actions/care";
import { CareRecordForm } from "@/components/care/CareRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewCareRecordPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createCareRecord(petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="記錄照護" />
      <CareRecordForm action={action} cancelHref={`/pets/${petId}/care`} />
    </div>
  );
}
