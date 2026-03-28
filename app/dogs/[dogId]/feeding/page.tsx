import { getActiveFeedPlan, getFeedRecordsByDog } from "@/lib/actions/feeding";
import { FeedPlanCard } from "@/components/feeding/FeedPlanCard";
import { FeedRecordList } from "@/components/feeding/FeedRecordList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function FeedingPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const [feedPlan, feedRecords] = await Promise.all([
    getActiveFeedPlan(dogId),
    getFeedRecordsByDog(dogId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="飼料管理"
        action={{ label: "記錄餵食", href: `/dogs/${dogId}/feeding/new` }}
      />
      <FeedPlanCard plan={feedPlan} dogId={dogId} />

      <div>
        <h3 className="font-semibold mb-3">餵食記錄</h3>
        {feedRecords.length === 0 ? (
          <EmptyState
            title="尚無餵食記錄"
            action={{ label: "記錄餵食", href: `/dogs/${dogId}/feeding/new` }}
          />
        ) : (
          <FeedRecordList records={feedRecords} dogId={dogId} />
        )}
      </div>
    </div>
  );
}
