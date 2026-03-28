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
import { DOG_SEX } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ActionResult = { error?: Record<string, string[]> } | void;

interface DogFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
  defaultValues?: {
    name?: string;
    breed?: string | null;
    dob?: Date | null;
    weight?: number | null;
    sex?: string | null;
    notes?: string | null;
  };
}

export function DogForm({ action, cancelHref, defaultValues }: DogFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="name">名字 *</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        {errors.name && <p className="text-destructive text-xs">{errors.name[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="breed">品種</Label>
        <Input id="breed" name="breed" defaultValue={defaultValues?.breed ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="sex">性別</Label>
          <Select name="sex" defaultValue={defaultValues?.sex ?? ""}>
            <SelectTrigger id="sex">
              <SelectValue placeholder="選擇性別" />
            </SelectTrigger>
            <SelectContent>
              {DOG_SEX.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="weight">體重 (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            defaultValue={defaultValues?.weight ?? ""}
          />
          {errors.weight && <p className="text-destructive text-xs">{errors.weight[0]}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="dob">生日</Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          defaultValue={
            defaultValues?.dob
              ? format(new Date(defaultValues.dob), "yyyy-MM-dd")
              : ""
          }
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備註</Label>
        <Textarea id="notes" name="notes" defaultValue={defaultValues?.notes ?? ""} rows={3} />
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
