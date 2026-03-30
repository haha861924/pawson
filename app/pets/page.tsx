import { getPets } from "@/lib/actions/pets";
import { PetListManager } from "@/components/pets/PetListManager";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const dynamic = 'force-dynamic';

export default async function PetsPage() {
  const pets = await getPets();

  return (
    <div>
      <PageHeader title="寵物管理" />
      {pets.length === 0 ? (
        <EmptyState
          title="尚未新增任何寵物"
          action={{ label: "新增寵物", href: "/pets/new" }}
        />
      ) : (
        <PetListManager pets={pets} />
      )}
    </div>
  );
}
