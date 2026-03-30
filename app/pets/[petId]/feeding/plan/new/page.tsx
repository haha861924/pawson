import { createFeedPlan } from "@/lib/actions/feeding";
import { FeedPlanForm } from "@/components/feeding/FeedPlanForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewFeedPlanPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createFeedPlan(petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增飼料計劃" />
      <FeedPlanForm action={action} cancelHref={`/pets/${petId}/feeding`} />
    </div>
  );
}
