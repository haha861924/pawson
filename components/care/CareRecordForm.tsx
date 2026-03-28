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
import { CARE_TYPES } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface CareRecordFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
}

export function CareRecordForm({ action, cancelHref }: CareRecordFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="type">類型 *</Label>
        <Select name="type" required>
          <SelectTrigger id="type">
            <SelectValue placeholder="選擇照護類型" />
          </SelectTrigger>
          <SelectContent>
            {CARE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="text-destructive text-xs">{errors.type[0]}</p>}
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
        {errors.date && <p className="text-destructive text-xs">{errors.date[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="durationMins">時長 (分鐘)</Label>
        <Input id="durationMins" name="durationMins" type="number" min="1" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備註</Label>
        <Textarea id="notes" name="notes" rows={3} />
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
