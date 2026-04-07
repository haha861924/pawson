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
import { APPETITE_OPTIONS, STOOL_OPTIONS, MOOD_OPTIONS } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface DailyHealthLogFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
}

export function DailyHealthLogForm({ action, cancelHref }: DailyHealthLogFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="date">日期 *</Label>
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
        <Label htmlFor="weight">體重 (kg)</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          min="0"
          placeholder="例如：25.5"
        />
        {errors.weight && <p className="text-destructive text-xs">{errors.weight[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="appetite">食慾</Label>
        <Select
          name="appetite"
          items={Object.fromEntries(APPETITE_OPTIONS.map((o) => [o.value, o.label]))}
        >
          <SelectTrigger id="appetite">
            <SelectValue placeholder="選擇食慾狀況" />
          </SelectTrigger>
          <SelectContent>
            {APPETITE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="stoolCondition">排便</Label>
        <Select
          name="stoolCondition"
          items={Object.fromEntries(STOOL_OPTIONS.map((o) => [o.value, o.label]))}
        >
          <SelectTrigger id="stoolCondition">
            <SelectValue placeholder="選擇排便狀況" />
          </SelectTrigger>
          <SelectContent>
            {STOOL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="mood">精神</Label>
        <Select
          name="mood"
          items={Object.fromEntries(MOOD_OPTIONS.map((o) => [o.value, o.label]))}
        >
          <SelectTrigger id="mood">
            <SelectValue placeholder="選擇精神狀態" />
          </SelectTrigger>
          <SelectContent>
            {MOOD_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="hasVomiting"
          name="hasVomiting"
          type="checkbox"
          value="true"
          className="h-4 w-4"
        />
        <Label htmlFor="hasVomiting">有嘔吐情形</Label>
      </div>

      <div className="space-y-1">
        <Label htmlFor="temperature">體溫 (°C)</Label>
        <Input
          id="temperature"
          name="temperature"
          type="number"
          step="0.1"
          min="35"
          max="45"
          placeholder="例如：38.5"
        />
        {errors.temperature && (
          <p className="text-destructive text-xs">{errors.temperature[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備註</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="記錄任何相關觀察..." />
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
