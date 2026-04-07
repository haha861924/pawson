import { getFeedReviews } from "@/lib/actions/feedReviews";
import { FeedReviewList } from "@/components/feeding/FeedReviewList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function FeedReviewsPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const reviews = await getFeedReviews(petId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="飼料評論"
        action={{ label: "新增評論", href: `/pets/${petId}/feeding/reviews/new` }}
      />
      {reviews.length === 0 ? (
        <EmptyState
          title="尚無飼料評論"
          action={{ label: "新增評論", href: `/pets/${petId}/feeding/reviews/new` }}
        />
      ) : (
        <FeedReviewList reviews={reviews} petId={petId} />
      )}
    </div>
  );
}
