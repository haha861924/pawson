import { getExpenses, getExpenseSummary } from "@/lib/actions/expenses";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function DogExpensesPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const [expenses, summary] = await Promise.all([
    getExpenses(dogId),
    getExpenseSummary(dogId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="花費記錄"
        action={{ label: "新增花費", href: `/dogs/${dogId}/expenses/new` }}
      />
      <ExpenseSummary total={summary.total} byCategory={summary.byCategory} />
      {expenses.length === 0 ? (
        <EmptyState
          title="尚無花費記錄"
          action={{ label: "新增花費", href: `/dogs/${dogId}/expenses/new` }}
        />
      ) : (
        <ExpenseList expenses={expenses} showDog={false} />
      )}
    </div>
  );
}
