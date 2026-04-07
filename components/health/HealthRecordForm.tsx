"use client";

import { useActionState, useState } from "react";
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
import { HEALTH_TYPES, REMINDER_INTERVALS } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface HealthRecordFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
  defaultValues?: {
    type: string;
    title: string;
    date: Date | string;
    description: string | null;
    vetName: string | null;
    nextDueDate: Date | string | null;
    reminderInterval: string | null;
  };
}

export function HealthRecordForm({ action, cancelHref, defaultValues }: HealthRecordFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};
  const [reminderInterval, setReminderInterval] = useState(
    defaultValues?.reminderInterval || ""
  );

  const dateStr = defaultValues?.date
    ? format(new Date(defaultValues.date), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const nextDueDateStr = defaultValues?.nextDueDate
    ? format(new Date(defaultValues.nextDueDate), "yyyy-MM-dd")
    : "";

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="type">類型 *</Label>
        <Select
          name="type"
          required
          defaultValue={defaultValues?.type}
          items={Object.fromEntries(HEALTH_TYPES.map((t) => [t.value, t.label]))}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="選擇健康記錄類型" />
          </SelectTrigger>
          <SelectContent>
            {HEALTH_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="text-destructive text-xs">{errors.type[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">標題 *</Label>
        <Input id="title" name="title" required defaultValue={defaultValues?.title} />
        {errors.title && <p className="text-destructive text-xs">{errors.title[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">日期 *</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={dateStr}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="vetName">獸醫/診所</Label>
        <Input id="vetName" name="vetName" defaultValue={defaultValues?.vetName ?? ""} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="reminderInterval">提醒週期</Label>
        <Select
          value={reminderInterval}
          onValueChange={(v) => setReminderInterval(v ?? "")}
          items={{ none: "不設定週期", ...Object.fromEntries(REMINDER_INTERVALS.map((r) => [r.value, r.label])) }}
        >
          <SelectTrigger id="reminderInterval">
            <SelectValue placeholder="選擇週期（自動計算下次日期）" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">不設定週期</SelectItem>
            {REMINDER_INTERVALS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="hidden"
          name="reminderInterval"
          value={reminderInterval === "none" ? "" : reminderInterval}
        />
        <p className="text-xs text-muted-foreground">
          選擇週期後，系統將自動從記錄日期計算下次提醒日期
        </p>
      </div>

      {reminderInterval === "" || reminderInterval === "none" ? (
        <div className="space-y-1">
          <Label htmlFor="nextDueDate">下次日期（手動設定）</Label>
          <Input id="nextDueDate" name="nextDueDate" type="date" defaultValue={nextDueDateStr} />
        </div>
      ) : null}

      <div className="space-y-1">
        <Label htmlFor="description">說明</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description ?? ""} />
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
