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
import { EXPENSE_CATEGORIES } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface Dog {
  id: string;
  name: string;
}

interface ExpenseFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
  dogs: Dog[];
  preselectedDogId?: string;
  referer?: string;
}

export function ExpenseForm({
  action,
  cancelHref,
  dogs,
  preselectedDogId,
  referer,
}: ExpenseFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      {referer && <input type="hidden" name="_referer" value={referer} />}

      {preselectedDogId ? (
        <input type="hidden" name="dogId" value={preselectedDogId} />
      ) : (
        <div className="space-y-1">
          <Label htmlFor="dogId">狗狗 *</Label>
          <Select name="dogId" required>
            <SelectTrigger id="dogId">
              <SelectValue placeholder="選擇狗狗" />
            </SelectTrigger>
            <SelectContent>
              {dogs.map((dog) => (
                <SelectItem key={dog.id} value={dog.id}>
                  {dog.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.dogId && <p className="text-destructive text-xs">{errors.dogId[0]}</p>}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="category">類別 *</Label>
        <Select name="category" required>
          <SelectTrigger id="category">
            <SelectValue placeholder="選擇類別" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-destructive text-xs">{errors.category[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount">金額 (NT$) *</Label>
        <Input id="amount" name="amount" type="number" min="0" step="1" required />
        {errors.amount && <p className="text-destructive text-xs">{errors.amount[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">說明 *</Label>
        <Input id="description" name="description" required />
        {errors.description && <p className="text-destructive text-xs">{errors.description[0]}</p>}
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
