"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/lib/types";

interface Pet {
  id: string;
  name: string;
  breed: string | null;
}

interface ExpenseFilterProps {
  dogs: Pet[];
  breeds: string[];
  selectedDogId?: string;
  selectedBreed?: string;
  selectedCategory?: string;
}

export function ExpenseFilter({
  dogs,
  breeds,
  selectedDogId,
  selectedBreed,
  selectedCategory,
}: ExpenseFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // When switching pet/breed filter, clear the other
    if (key === "petId") params.delete("breed");
    if (key === "breed") params.delete("petId");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">篩選寵物：</span>
        <Select
          value={selectedDogId ?? "all"}
          onValueChange={(v) => update("petId", v ?? "all")}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue>
              {(v: string | null) =>
                v && v !== "all"
                  ? (dogs.find((d) => d.id === v)?.name ?? "全部寵物")
                  : "全部寵物"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部寵物</SelectItem>
            {dogs.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {breeds.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">品種：</span>
          <Select
            value={selectedBreed ?? "all"}
            onValueChange={(v) => update("breed", v ?? "all")}
          >
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue>
                {(v: string | null) => (v && v !== "all" ? v : "全部品種")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部品種</SelectItem>
              {breeds.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">類別：</span>
        <Select
          value={selectedCategory ?? "all"}
          onValueChange={(v) => update("category", v ?? "all")}
        >
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue>
              {(v: string | null) =>
                v && v !== "all"
                  ? (EXPENSE_CATEGORIES.find((c) => c.value === v)?.label ?? "全部類別")
                  : "全部類別"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部類別</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
