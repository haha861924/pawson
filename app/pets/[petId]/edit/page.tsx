import { notFound } from "next/navigation";
import { getPetById, updatePet } from "@/lib/actions/pets";
import { PetForm } from "@/components/pets/PetForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const pet = await getPetById(petId);
  if (!pet) notFound();

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return updatePet(petId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="編輯寵物資料" />
      <PetForm action={action} cancelHref={`/pets/${petId}`} defaultValues={pet} />
    </div>
  );
}
