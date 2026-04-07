import { getActiveFeedPlan } from "@/lib/actions/feeding";
import { createFeedReview } from "@/lib/actions/feedReviews";
import { FeedReviewForm } from "@/components/feeding/FeedReviewForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function NewFeedReviewPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const feedPlan = await getActiveFeedPlan(petId);

  async function reviewAction(_prev: unknown, formData: FormData) {
    "use server";
    return createFeedReview(petId, _prev, formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="新增飼料評論" />
      <div className="max-w-lg">
        <FeedReviewForm action={reviewAction} defaultFoodName={feedPlan?.foodName} />
      </div>
    </div>
  );
}
