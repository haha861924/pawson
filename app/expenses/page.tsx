export const dynamic = "force-dynamic";

import { getExpenses, getExpenseSummary } from "@/lib/actions/expenses";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AllExpensesPage() {
  const [expenses, summary] = await Promise.all([
    getExpenses(),
    getExpenseSummary(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="全部花費統計"
        description="所有犬隻的花費總覽"
        action={{ label: "新增花費", href: "/expenses/new" }}
      />
      <ExpenseSummary total={summary.total} byCategory={summary.byCategory} />
      {expenses.length === 0 ? (
        <EmptyState
          title="尚無花費記錄"
          action={{ label: "新增花費", href: "/expenses/new" }}
        />
      ) : (
        <ExpenseList expenses={expenses} showDog={true} />
      )}
    </div>
  );
}
