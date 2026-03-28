"use client";

import { format } from "date-fns";
import { Star } from "lucide-react";
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
  dogId,
}: {
  reviews: FeedReview[];
  dogId: string;
}) {
  return (
    <div className="space-y-2">
      {reviews.map((review) => (
        <div key={review.id} className="p-3 rounded-lg border bg-card flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{review.foodName}</span>
              {review.brand && (
                <span className="text-xs text-muted-foreground">{review.brand}</span>
              )}
              <StarRating rating={review.rating} />
            </div>
            {review.review && (
              <p className="text-sm text-muted-foreground mt-0.5">{review.review}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(review.createdAt), "yyyy/MM/dd")}
            </p>
          </div>
          <DeleteButton
            onDelete={async () => {
              await deleteFeedReview(review.id, dogId);
            }}
          />
        </div>
      ))}
    </div>
  );
}
