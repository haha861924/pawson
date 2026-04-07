import { createDailyHealthLog } from "@/lib/actions/dailyHealthLogs";
import { DailyHealthLogForm } from "@/components/diary/DailyHealthLogForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export default async function NewDiaryPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createDailyHealthLog(petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增日誌記錄" />
      <DailyHealthLogForm action={action} cancelHref={`/pets/${petId}/diary`} />
    </div>
  );
}
