"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Star, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteFeedReview } from "@/lib/actions/feedReviews";
import { cn } from "@/lib/utils";

interface FeedReview {
  id: string;
  foodName: string;
  brand: string | null;
  rating: number;
  review: string | null;
  createdAt: Date;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export function FeedReviewList({
  reviews,
  petId,
  showActions = true,
}: {
  reviews: FeedReview[];
  petId: string;
  showActions?: boolean;
}) {
  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 rounded-lg border bg-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{review.foodName}</span>
                {review.brand && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {review.brand}
                  </span>
                )}
              </div>
              <div className="mt-1">
                <StarRating rating={review.rating} />
              </div>
              {review.review && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {review.review}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(review.createdAt), "yyyy/MM/dd")}
              </p>
            </div>
            {showActions && (
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/pets/${petId}/feeding/reviews/${review.id}/edit`}
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  aria-label="編輯"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton
                  onDelete={async () => {
                    await deleteFeedReview(review.id, petId);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
