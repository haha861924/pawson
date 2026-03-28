import { notFound } from "next/navigation";
import { getDogById, updateDog } from "@/lib/actions/dogs";
import { DogForm } from "@/components/dogs/DogForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = 'force-dynamic';

export default async function EditDogPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const dog = await getDogById(dogId);
  if (!dog) notFound();

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    return updateDog(dogId, _prev, formData);
  }

  return (
    <div>
      <PageHeader title="編輯狗狗資料" />
      <DogForm action={action} cancelHref={`/dogs/${dogId}`} defaultValues={dog} />
    </div>
  );
}
