import { getDogs } from "@/lib/actions/dogs";
import { DogCard } from "@/components/dogs/DogCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function DogsPage() {
  const dogs = await getDogs();

  return (
    <div>
      <PageHeader
        title="犬隻管理"
        action={{ label: "新增狗狗", href: "/dogs/new" }}
      />
      {dogs.length === 0 ? (
        <EmptyState
          title="尚未新增任何狗狗"
          action={{ label: "新增狗狗", href: "/dogs/new" }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}
