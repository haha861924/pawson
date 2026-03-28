import { createExpense } from "@/lib/actions/expenses";
import { getDogs } from "@/lib/actions/dogs";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewExpensePage() {
  const dogs = await getDogs();

  return (
    <div>
      <PageHeader title="新增花費" />
      <ExpenseForm
        action={createExpense}
        cancelHref="/expenses"
        dogs={dogs}
        referer="/expenses"
      />
    </div>
  );
}
