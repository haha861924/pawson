import { createDog } from "@/lib/actions/dogs";
import { DogForm } from "@/components/dogs/DogForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewDogPage() {
  return (
    <div>
      <PageHeader title="新增狗狗" />
      <DogForm action={createDog} cancelHref="/dogs" />
    </div>
  );
}
