import { createExpense } from "@/lib/actions/expenses";
import { getPets } from "@/lib/actions/pets";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewExpensePage() {
  const pets = await getPets();

  return (
    <div>
      <PageHeader title="新增花費" />
      <ExpenseForm
        action={createExpense}
        cancelHref="/expenses"
        dogs={pets}
        referer="/expenses"
      />
    </div>
  );
}
