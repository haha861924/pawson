"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEED_FREQUENCIES } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface FeedPlanFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
}

export function FeedPlanForm({ action, cancelHref }: FeedPlanFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="foodName">飼料名稱 *</Label>
        <Input id="foodName" name="foodName" required />
        {errors.foodName && <p className="text-destructive text-xs">{errors.foodName[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="brand">品牌</Label>
        <Input id="brand" name="brand" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="amountGrams">每餐份量 (g) *</Label>
        <Input id="amountGrams" name="amountGrams" type="number" min="1" step="0.1" required />
        {errors.amountGrams && <p className="text-destructive text-xs">{errors.amountGrams[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="frequency">頻率 *</Label>
        <Select name="frequency" required items={Object.fromEntries(FEED_FREQUENCIES.map((f) => [f.value, f.label]))}>
          <SelectTrigger id="frequency">
            <SelectValue placeholder="選擇餵食頻率" />
          </SelectTrigger>
          <SelectContent>
            {FEED_FREQUENCIES.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.frequency && <p className="text-destructive text-xs">{errors.frequency[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備註</Label>
        <Textarea id="notes" name="notes" rows={2} />
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
