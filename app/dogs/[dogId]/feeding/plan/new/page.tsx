import { createFeedPlan } from "@/lib/actions/feeding";
import { FeedPlanForm } from "@/components/feeding/FeedPlanForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewFeedPlanPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createFeedPlan(dogId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="新增飼料計劃" />
      <FeedPlanForm action={action} cancelHref={`/dogs/${dogId}/feeding`} />
    </div>
  );
}
