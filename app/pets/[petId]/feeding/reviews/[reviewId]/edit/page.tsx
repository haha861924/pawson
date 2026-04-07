import { notFound } from "next/navigation";
import { getFeedReviewById, updateFeedReview } from "@/lib/actions/feedReviews";
import { FeedReviewForm } from "@/components/feeding/FeedReviewForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function EditFeedReviewPage({
  params,
}: {
  params: Promise<{ petId: string; reviewId: string }>;
}) {
  const { petId, reviewId } = await params;
  const review = await getFeedReviewById(reviewId);
  if (!review || review.petId !== petId) notFound();

  async function editAction(_prev: unknown, formData: FormData) {
    "use server";
    return updateFeedReview(reviewId, petId, _prev, formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="編輯飼料評論" />
      <div className="max-w-lg">
        <FeedReviewForm
          action={editAction}
          defaultValues={{
            foodName: review.foodName,
            brand: review.brand,
            rating: review.rating,
            review: review.review,
          }}
        />
      </div>
    </div>
  );
}
