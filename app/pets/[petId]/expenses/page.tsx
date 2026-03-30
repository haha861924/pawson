import { getExpenses, getExpenseSummary } from "@/lib/actions/expenses";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseChart } from "@/components/expenses/ExpenseChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = 'force-dynamic';

export default async function PetExpensesPage({
  params,
  searchParams,
}: {
  params: Promise<{ petId: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { petId } = await params;
  const { category } = await searchParams;
  const [allExpenses, summary] = await Promise.all([
    getExpenses(petId),
    getExpenseSummary(petId),
  ]);

  const expenses = category
    ? allExpenses.filter((e: (typeof allExpenses)[number]) => e.category === category)
    : allExpenses;

  return (
    <div className="space-y-6">
      <PageHeader
        title="花費記錄"
        action={{ label: "新增花費", href: `/pets/${petId}/expenses/new` }}
      />
      <ExpenseSummary total={summary.total} byCategory={summary.byCategory} />
      <ExpenseChart byCategory={summary.byCategory} byMonth={summary.byMonth} />
      {expenses.length === 0 ? (
        <EmptyState
          title="尚無花費記錄"
          action={{ label: "新增花費", href: `/pets/${petId}/expenses/new` }}
        />
      ) : (
        <ExpenseList expenses={expenses} showDog={false} />
      )}
    </div>
  );
}
