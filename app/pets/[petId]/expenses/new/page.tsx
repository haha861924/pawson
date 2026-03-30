import { createExpense } from "@/lib/actions/expenses";
import { getPets } from "@/lib/actions/pets";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function NewPetExpensePage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const pets = await getPets();

  return (
    <div>
      <PageHeader title="新增花費" />
      <ExpenseForm
        action={createExpense}
        cancelHref={`/pets/${petId}/expenses`}
        dogs={pets}
        preselectedDogId={petId}
        referer={`/pets/${petId}/expenses`}
      />
    </div>
  );
}
