"use client";

import { useState } from "react";
import Link from "next/link";
import { format, differenceInDays, isPast } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HealthTypeBadge } from "@/components/health/HealthTypeBadge";

type HealthDueItem = {
  id: string;
  petId: string;
  type: string;
  title: string;
  date: Date | string;
  nextDueDate: Date | string | null;
  pet: { name: string };
};

const FILTERS = [
  { label: "7 天", days: 7 },
  { label: "30 天", days: 30 },
  { label: "半年", days: 180 },
] as const;

function getEffectiveDue(h: HealthDueItem): Date {
  return new Date(h.nextDueDate ?? h.date);
}

function filterItems(items: HealthDueItem[], days: number) {
  const now = new Date();
  return items.filter((h) => {
    const due = getEffectiveDue(h);
    if (isPast(due)) return true;
    return differenceInDays(due, now) <= days;
  });
}

export function HealthDueCount({ items }: { items: HealthDueItem[] }) {
  // Default 30-day count for the stats card
  const filtered = filterItems(items, 30);
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-3xl font-bold text-destructive">{filtered.length}</p>
        <p className="text-sm text-muted-foreground">健康待辦</p>
      </CardContent>
    </Card>
  );
}

export function HealthDueList({ items }: { items: HealthDueItem[] }) {
  const [days, setDays] = useState(30);
  const filtered = filterItems(items, days);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">即將到期健康記錄</CardTitle>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <Button
                key={f.days}
                variant={days === f.days ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setDays(f.days)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">暫無待辦</p>
        ) : (
          <div className="space-y-2">
            {filtered.slice(0, 5).map((h) => {
              const due = getEffectiveDue(h);
              const overdue = isPast(due);
              return (
                <Link
                  key={h.id}
                  href={`/pets/${h.petId}/health`}
                  className="flex items-center gap-2 text-sm hover:opacity-70"
                >
                  <HealthTypeBadge type={h.type} />
                  <span className="flex-1 truncate">
                    {h.pet.name} · {h.title}
                  </span>
                  <span
                    className={`text-xs ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
                  >
                    {format(due, "MM/dd")}
                    {overdue && " 逾期"}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
