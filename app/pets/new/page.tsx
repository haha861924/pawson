import { createPet } from "@/lib/actions/pets";
import { PetForm } from "@/components/pets/PetForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default function NewPetPage() {
  return (
    <div>
      <PageHeader title="新增寵物" />
      <PetForm action={createPet} cancelHref="/pets" />
    </div>
  );
}
