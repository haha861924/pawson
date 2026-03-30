import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { FEED_FREQUENCIES, getLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeedPlan {
  id: string;
  foodName: string;
  brand: string | null;
  amountGrams: number;
  frequency: string;
  notes: string | null;
}

export function FeedPlanCard({
  plan,
  petId,
}: {
  plan: FeedPlan | null;
  petId: string;
}) {
  if (!plan) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-8">
          <p className="text-muted-foreground text-sm">尚未設定飼料計劃</p>
          <Link
            href={`/pets/${petId}/feeding/plan/new`}
            className={cn(buttonVariants(), "mt-3 inline-flex")}
          >
            新增飼料計劃
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">目前飼料計劃</CardTitle>
          <Link
            href={`/pets/${petId}/feeding/plan/new`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            更換
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">飼料</dt>
            <dd className="font-medium">
              {plan.foodName}
              {plan.brand && ` (${plan.brand})`}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">每餐份量</dt>
            <dd className="font-medium">{plan.amountGrams} g</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">頻率</dt>
            <dd className="font-medium">{getLabel(FEED_FREQUENCIES, plan.frequency)}</dd>
          </div>
          {plan.notes && (
            <div className="pt-1 text-muted-foreground">{plan.notes}</div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
