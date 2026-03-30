import { notFound } from "next/navigation";
import { getDogById } from "@/lib/actions/dogs";
import { createDailyHealthLog } from "@/lib/actions/dailyHealthLogs";
import { getRequiredSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { DailyHealthLogForm } from "@/components/diary/DailyHealthLogForm";

export default async function NewDiaryPage({ params }: { params: Promise<{ dogId: string }> }) {
  const { dogId } = await params;
  const session = await getRequiredSession();

  const [dog, member] = await Promise.all([
    getDogById(dogId),
    prisma.dogMember.findUnique({
      where: { dogId_userId: { dogId, userId: session.user.id } },
    }),
  ]);

  if (!dog || !member?.canEdit) notFound();

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createDailyHealthLog(dogId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增健康紀錄" />
      <div className="max-w-2xl">
        <DailyHealthLogForm action={action} />
      </div>
    </div>
  );
}
