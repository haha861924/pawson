"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface WeightRecordFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
}

export function WeightRecordForm({ action, cancelHref }: WeightRecordFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="weight">體重 (kg) *</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          min="0"
          placeholder="例如：25.5"
          required
        />
        {errors.weight && <p className="text-destructive text-xs">{errors.weight[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">測量日期 *</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={format(new Date(), "yyyy-MM-dd")}
          required
        />
        {errors.date && <p className="text-destructive text-xs">{errors.date[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備註</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="記錄任何相關資訊..." />
        {errors.notes && <p className="text-destructive text-xs">{errors.notes[0]}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "儲存中..." : "儲存"}
        </Button>
        <Link href={cancelHref} className={cn(buttonVariants({ variant: "outline" }))}>
          取消
        </Link>
      </div>
    </form>
  );
}
