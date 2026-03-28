import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPENSE_CATEGORIES, getLabel } from "@/lib/types";

interface ExpenseSummaryProps {
  total: number;
  byCategory: Record<string, number>;
}

export function ExpenseSummary({ total, byCategory }: ExpenseSummaryProps) {
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">總花費</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">NT$ {total.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">分類統計</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sorted.map(([category, amount]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{getLabel(EXPENSE_CATEGORIES, category)}</span>
                    <span className="font-medium">NT$ {amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(amount / total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {sorted.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">尚無資料</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
