import { getDogs } from "@/lib/actions/dogs";
import { DogListManager } from "@/components/dogs/DogListManager";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function DogsPage() {
  const dogs = await getDogs();

  return (
    <div>
      <PageHeader title="犬隻管理" />
      {dogs.length === 0 ? (
        <EmptyState
          title="尚未新增任何狗狗"
          action={{ label: "新增狗狗", href: "/dogs/new" }}
        />
      ) : (
        <DogListManager dogs={dogs} />
      )}
    </div>
  );
}
