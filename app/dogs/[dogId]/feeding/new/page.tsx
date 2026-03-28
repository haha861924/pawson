import { createFeedRecord, getActiveFeedPlan } from "@/lib/actions/feeding";
import { FeedRecordForm } from "@/components/feeding/FeedRecordForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewFeedRecordPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const feedPlan = await getActiveFeedPlan(dogId);

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return createFeedRecord(dogId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="記錄餵食" />
      <FeedRecordForm
        action={action}
        cancelHref={`/dogs/${dogId}/feeding`}
        defaultFoodName={feedPlan?.foodName}
        defaultAmount={feedPlan?.amountGrams}
      />
    </div>
  );
}
