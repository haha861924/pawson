export const dynamic = "force-dynamic";

import { getExpenses, getExpenseSummary, getBreeds } from "@/lib/actions/expenses";
import { getDogs } from "@/lib/actions/dogs";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseChart } from "@/components/expenses/ExpenseChart";
import { ExpenseFilter } from "@/components/expenses/ExpenseFilter";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Suspense } from "react";

interface SearchParams {
  dogId?: string;
  breed?: string;
  category?: string;
}

export default async function AllExpensesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { dogId, breed, category } = await searchParams;

  const [allExpenses, summary, dogs, breeds] = await Promise.all([
    getExpenses(dogId, breed),
    getExpenseSummary(dogId, breed),
    getDogs(),
    getBreeds(),
  ]);

  // Apply category filter client-side (after summary is computed from full set)
  const expenses = category
    ? allExpenses.filter((e: (typeof allExpenses)[number]) => e.category === category)
    : allExpenses;

  return (
    <div className="space-y-6">
      <PageHeader
        title="全部花費統計"
        description="所有犬隻的花費總覽"
        action={{ label: "新增花費", href: "/expenses/new" }}
      />

      <Suspense>
        <ExpenseFilter
          dogs={dogs}
          breeds={breeds}
          selectedDogId={dogId}
          selectedBreed={breed}
          selectedCategory={category}
        />
      </Suspense>

      <ExpenseSummary total={summary.total} byCategory={summary.byCategory} />
      <ExpenseChart byCategory={summary.byCategory} byMonth={summary.byMonth} />

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
