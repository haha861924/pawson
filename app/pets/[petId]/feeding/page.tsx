import { getActiveFeedPlan, getFeedRecords } from "@/lib/actions/feeding";
import { getFeedReviews, createFeedReview } from "@/lib/actions/feedReviews";
import { FeedPlanCard } from "@/components/feeding/FeedPlanCard";
import { FeedRecordList } from "@/components/feeding/FeedRecordList";
import { FeedReviewForm } from "@/components/feeding/FeedReviewForm";
import { FeedReviewList } from "@/components/feeding/FeedReviewList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Separator } from "@/components/ui/separator";

export const dynamic = 'force-dynamic';

export default async function FeedingPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const [feedPlan, feedRecords, feedReviews] = await Promise.all([
    getActiveFeedPlan(petId),
    getFeedRecords(petId),
    getFeedReviews(petId),
  ]);

  async function reviewAction(_prev: unknown, formData: FormData) {
    "use server";
    return createFeedReview(petId, _prev, formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="飼料管理"
        action={{ label: "記錄餵食", href: `/pets/${petId}/feeding/new` }}
      />
      <FeedPlanCard plan={feedPlan} petId={petId} />

      <div>
        <h3 className="font-semibold mb-3">餵食記錄</h3>
        {feedRecords.length === 0 ? (
          <EmptyState
            title="尚無餵食記錄"
            action={{ label: "記錄餵食", href: `/pets/${petId}/feeding/new` }}
          />
        ) : (
          <FeedRecordList records={feedRecords} petId={petId} />
        )}
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">飼料評論</h3>
        <div className="space-y-4">
          <FeedReviewForm
            action={reviewAction}
            defaultFoodName={feedPlan?.foodName}
          />
          {feedReviews.length > 0 && (
            <FeedReviewList reviews={feedReviews} petId={petId} />
          )}
        </div>
      </div>
    </div>
  );
}
