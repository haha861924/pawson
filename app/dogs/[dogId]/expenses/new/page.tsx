import { createExpense } from "@/lib/actions/expenses";
import { getDogs } from "@/lib/actions/dogs";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function NewDogExpensePage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const dogs = await getDogs();

  return (
    <div>
      <PageHeader title="新增花費" />
      <ExpenseForm
        action={createExpense}
        cancelHref={`/dogs/${dogId}/expenses`}
        dogs={dogs}
        preselectedDogId={dogId}
        referer={`/dogs/${dogId}/expenses`}
      />
    </div>
  );
}
