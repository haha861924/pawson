import { Suspense } from "react";
import { getDiscussions } from "@/lib/actions/discussions";
import { DiscussionList } from "@/components/community/DiscussionList";
import { DiscussionFilter } from "@/components/community/DiscussionFilter";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  const discussions = await getDiscussions({ category, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="共同討論區"
        description="與其他飼主分享飼料、用藥、鮮食、保健品心得"
        action={{ label: "發佈文章", href: "/community/new" }}
      />
      <Suspense>
        <DiscussionFilter />
      </Suspense>
      {discussions.length === 0 ? (
        <EmptyState
          title="尚無討論"
          description={search ? "找不到符合的討論，試試其他關鍵字" : undefined}
          action={!search ? { label: "發佈第一篇文章", href: "/community/new" } : undefined}
        />
      ) : (
        <DiscussionList discussions={discussions} />
      )}
    </div>
  );
}
