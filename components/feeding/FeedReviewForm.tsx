"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface FeedReviewFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  defaultFoodName?: string;
}

export function FeedReviewForm({ action, defaultFoodName }: FeedReviewFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="foodName">飼料名稱 *</Label>
          <Input
            id="foodName"
            name="foodName"
            defaultValue={defaultFoodName ?? ""}
            required
          />
          {errors.foodName && (
            <p className="text-destructive text-xs">{errors.foodName[0]}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="brand">品牌</Label>
          <Input id="brand" name="brand" />
        </div>
      </div>

      <div className="space-y-1">
        <Label>評分 *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hovered || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
        {errors.rating && <p className="text-destructive text-xs">{errors.rating[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="review">評論</Label>
        <Textarea id="review" name="review" rows={2} placeholder="狗狗喜歡嗎？有什麼特別之處？" />
      </div>

      <Button type="submit" size="sm" disabled={pending || rating === 0}>
        {pending ? "儲存中..." : "送出評論"}
      </Button>
    </form>
  );
}
