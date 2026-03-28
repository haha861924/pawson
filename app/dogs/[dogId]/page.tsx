import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDogById, deleteDog } from "@/lib/actions/dogs";
import { getCareRecordsByDog } from "@/lib/actions/care";
import { getActiveFeedPlan } from "@/lib/actions/feeding";
import { getHealthRecordsByDog } from "@/lib/actions/health";
import { getExpenseSummary } from "@/lib/actions/expenses";
import { CareTypeBadge } from "@/components/care/CareTypeBadge";
import { HealthTypeBadge } from "@/components/health/HealthTypeBadge";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { FEED_FREQUENCIES, getLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DogOverviewPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const dog = await getDogById(dogId);
  if (!dog) notFound();

  const [recentCare, feedPlan, recentHealth, summary] = await Promise.all([
    getCareRecordsByDog(dogId),
    getActiveFeedPlan(dogId),
    getHealthRecordsByDog(dogId),
    getExpenseSummary(dogId),
  ]);

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link href={`/dogs/${dogId}/care/new`} className={cn(buttonVariants({ size: "sm" }))}>
          記錄照護
        </Link>
        <Link href={`/dogs/${dogId}/feeding/new`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          記錄餵食
        </Link>
        <Link href={`/dogs/${dogId}/health/new`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          新增健康記錄
        </Link>
        <Link href={`/dogs/${dogId}/expenses/new`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          新增花費
        </Link>
        <Link href={`/dogs/${dogId}/edit`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          編輯資料
        </Link>
        <DeleteButton
          onDelete={async () => {
            "use server";
            await deleteDog(dogId);
          }}
          label="刪除狗狗"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">目前飼料</CardTitle>
          </CardHeader>
          <CardContent>
            {feedPlan ? (
              <div>
                <p className="font-semibold">{feedPlan.foodName}</p>
                <p className="text-sm text-muted-foreground">
                  {feedPlan.amountGrams}g · {getLabel(FEED_FREQUENCIES, feedPlan.frequency)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                尚未設定{" "}
                <Link href={`/dogs/${dogId}/feeding/plan/new`} className="underline">
                  新增計劃
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">累計花費</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">NT$ {summary.total.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">最近照護</h3>
          <Link href={`/dogs/${dogId}/care`} className="text-xs text-muted-foreground hover:underline">
            查看全部
          </Link>
        </div>
        {recentCare.length === 0 ? (
          <p className="text-sm text-muted-foreground">尚無照護記錄</p>
        ) : (
          <div className="space-y-1">
            {recentCare.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-sm">
                <CareTypeBadge type={c.type} />
                <span className="text-muted-foreground">{format(new Date(c.date), "MM/dd")}</span>
                {c.notes && <span className="truncate">{c.notes}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">最近健康記錄</h3>
          <Link href={`/dogs/${dogId}/health`} className="text-xs text-muted-foreground hover:underline">
            查看全部
          </Link>
        </div>
        {recentHealth.length === 0 ? (
          <p className="text-sm text-muted-foreground">尚無健康記錄</p>
        ) : (
          <div className="space-y-1">
            {recentHealth.slice(0, 3).map((h) => (
              <div key={h.id} className="flex items-center gap-2 text-sm">
                <HealthTypeBadge type={h.type} />
                <span>{h.title}</span>
                <span className="text-muted-foreground">{format(new Date(h.date), "MM/dd")}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {dog.notes && (
        <div>
          <h3 className="font-semibold text-sm mb-1">備註</h3>
          <p className="text-sm text-muted-foreground">{dog.notes}</p>
        </div>
      )}
    </div>
  );
}
