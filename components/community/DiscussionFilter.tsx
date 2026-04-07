"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DISCUSSION_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DiscussionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const searchQuery = searchParams.get("search") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/community?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜尋討論..."
          defaultValue={searchQuery}
          className="pl-9"
          onChange={(e) => {
            const value = e.target.value;
            // debounce
            const timer = setTimeout(() => updateParams("search", value), 300);
            return () => clearTimeout(timer);
          }}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => updateParams("category", "")}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
            !activeCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:text-foreground hover:border-foreground"
          )}
        >
          全部
        </button>
        {DISCUSSION_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() =>
              updateParams("category", activeCategory === cat.value ? "" : cat.value)
            }
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:text-foreground hover:border-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
