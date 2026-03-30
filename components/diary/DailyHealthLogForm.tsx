"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPETITE_OPTIONS, STOOL_OPTIONS, MOOD_OPTIONS } from "@/lib/types";

type DailyHealthLogFormProps = {
  action: (_prev: unknown, formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>;
  initialDate?: string;
};

export function DailyHealthLogForm({ action, initialDate }: DailyHealthLogFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const today = initialDate || new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      {/* Date */}
      <div>
        <Label htmlFor="date">日期 *</Label>
        <Input id="date" name="date" type="date" required defaultValue={today} />
        {state?.error?.date && <p className="text-sm text-red-600 mt-1">{state.error.date[0]}</p>}
      </div>

      {/* Weight */}
      <div>
        <Label htmlFor="weight">體重 (kg)</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          min="0"
          placeholder="輸入體重"
        />
        {state?.error?.weight && <p className="text-sm text-red-600 mt-1">{state.error.weight[0]}</p>}
      </div>

      {/* Appetite */}
      <div>
        <Label htmlFor="appetite">飲食</Label>
        <Select name="appetite">
          <SelectTrigger>
            <SelectValue placeholder="選擇飲食狀況" />
          </SelectTrigger>
          <SelectContent>
            {APPETITE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.error?.appetite && <p className="text-sm text-red-600 mt-1">{state.error.appetite[0]}</p>}
      </div>

      {/* Stool Condition */}
      <div>
        <Label htmlFor="stoolCondition">排便</Label>
        <Select name="stoolCondition">
          <SelectTrigger>
            <SelectValue placeholder="選擇排便狀況" />
          </SelectTrigger>
          <SelectContent>
            {STOOL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.error?.stoolCondition && <p className="text-sm text-red-600 mt-1">{state.error.stoolCondition[0]}</p>}
      </div>

      {/* Mood */}
      <div>
        <Label htmlFor="mood">精神</Label>
        <Select name="mood">
          <SelectTrigger>
            <SelectValue placeholder="選擇精神狀況" />
          </SelectTrigger>
          <SelectContent>
            {MOOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.error?.mood && <p className="text-sm text-red-600 mt-1">{state.error.mood[0]}</p>}
      </div>

      {/* Has Vomiting */}
      <div className="flex items-center gap-2">
        <input
          id="hasVomiting"
          name="hasVomiting"
          type="checkbox"
          className="h-4 w-4"
          value="true"
        />
        <Label htmlFor="hasVomiting" className="cursor-pointer">
          有嘔吐症狀
        </Label>
      </div>

      {/* Temperature */}
      <div>
        <Label htmlFor="temperature">體溫 (°C)</Label>
        <Input
          id="temperature"
          name="temperature"
          type="number"
          step="0.1"
          min="35"
          max="45"
          placeholder="輸入體溫"
        />
        {state?.error?.temperature && (
          <p className="text-sm text-red-600 mt-1">{state.error.temperature[0]}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">其他症狀或備註</Label>
        <Textarea id="notes" name="notes" rows={4} placeholder="記錄其他觀察到的症狀或特殊狀況" />
        {state?.error?.notes && <p className="text-sm text-red-600 mt-1">{state.error.notes[0]}</p>}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "儲存中..." : "儲存"}
      </Button>
    </form>
  );
}
