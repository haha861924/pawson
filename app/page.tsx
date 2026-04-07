import Link from "next/link";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { getPets } from "@/lib/actions/pets";
import { getUpcomingHealthDue } from "@/lib/actions/health";
import { getRequiredSession } from "@/lib/auth-utils";
import { getExpenseSummary, getExpenses } from "@/lib/actions/expenses";
import { HealthDueCount, HealthDueList } from "@/components/health/HealthDueCard";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getRequiredSession();
  const [pets, upcomingHealth, summary, recentExpenses] = await Promise.all([
    getPets(),
    getUpcomingHealthDue(session.user.id, 180),
    getExpenseSummary(),
    getExpenses(),
  ]);

  const recent = recentExpenses.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">儀表板</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {format(new Date(), "yyyy年MM月dd日 EEEE", { locale: zhTW })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{pets.length}</p>
            <p className="text-sm text-muted-foreground">隻寵物</p>
          </CardContent>
        </Card>
        <HealthDueCount items={upcomingHealth} />
        <Card className="col-span-2">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">NT$ {summary.total.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">累計總花費</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <HealthDueList items={upcomingHealth} />

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">最近花費</CardTitle>
              <Link href="/expenses" className={buttonVariants({ variant: "link", size: "sm" })}>
                查看全部
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">尚無花費記錄</p>
            ) : (
              <div className="space-y-2">
                {recent.map((e: (typeof recent)[number]) => (
                  <div key={e.id} className="flex justify-between text-sm">
                    <div className="flex-1 truncate">
                      <span className="text-muted-foreground">{e.pet.name} · </span>
                      {e.description}
                    </div>
                    <span className="font-medium ml-2">NT$ {e.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {pets.length === 0 && (
        <div className="mt-8 text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">還沒有任何寵物，先新增一隻吧！</p>
          <Link href="/pets/new" className={buttonVariants()}>
            新增寵物
          </Link>
        </div>
      )}
    </div>
  );
}
