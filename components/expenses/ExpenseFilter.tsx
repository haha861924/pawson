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

interface Dog {
  id: string;
  name: string;
  breed: string | null;
}

interface ExpenseFilterProps {
  dogs: Dog[];
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
    // When switching dog/breed filter, clear the other
    if (key === "dogId") params.delete("breed");
    if (key === "breed") params.delete("dogId");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">篩選狗狗：</span>
        <Select
          value={selectedDogId ?? "all"}
          onValueChange={(v) => update("dogId", v ?? "all")}
        >
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue>
              {(v: string | null) =>
                v && v !== "all"
                  ? (dogs.find((d) => d.id === v)?.name ?? "全部狗狗")
                  : "全部狗狗"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狗狗</SelectItem>
            {dogs.map((dog) => (
              <SelectItem key={dog.id} value={dog.id}>
                {dog.name}
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
