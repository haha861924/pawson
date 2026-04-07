import Link from "next/link";
import { getActiveFeedPlan, getFeedRecords } from "@/lib/actions/feeding";
import { getFeedReviews } from "@/lib/actions/feedReviews";
import { FeedPlanCard } from "@/components/feeding/FeedPlanCard";
import { FeedRecordList } from "@/components/feeding/FeedRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/lib/button-variants";
import { Star, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

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

  const avgRating =
    feedReviews.length > 0
      ? feedReviews.reduce((sum, r) => sum + r.rating, 0) / feedReviews.length
      : 0;

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

      <Link
        href={`/pets/${petId}/feeding/reviews`}
        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
            <Star className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">飼料評論</h3>
            <p className="text-xs text-muted-foreground">
              {feedReviews.length > 0
                ? `${feedReviews.length} 則評論・平均 ${avgRating.toFixed(1)} 星`
                : "尚無評論，立即分享心得"}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </Link>
    </div>
  );
}
