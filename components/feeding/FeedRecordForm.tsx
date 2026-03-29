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
import { MEAL_TIMES } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface FeedRecordFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
  defaultFoodName?: string;
  defaultAmount?: number;
}

export function FeedRecordForm({
  action,
  cancelHref,
  defaultFoodName,
  defaultAmount,
}: FeedRecordFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="foodName">飼料名稱 *</Label>
        <Input id="foodName" name="foodName" defaultValue={defaultFoodName ?? ""} required />
        {errors.foodName && <p className="text-destructive text-xs">{errors.foodName[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="amountGrams">份量 (g) *</Label>
          <Input
            id="amountGrams"
            name="amountGrams"
            type="number"
            min="1"
            step="0.1"
            defaultValue={defaultAmount ?? ""}
            required
          />
          {errors.amountGrams && <p className="text-destructive text-xs">{errors.amountGrams[0]}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="mealTime">餐次</Label>
          <Select name="mealTime" items={Object.fromEntries(MEAL_TIMES.map((t) => [t.value, t.label]))}>
            <SelectTrigger id="mealTime">
              <SelectValue placeholder="選擇餐次" />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TIMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">日期 *</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={format(new Date(), "yyyy-MM-dd")}
          required
        />
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
