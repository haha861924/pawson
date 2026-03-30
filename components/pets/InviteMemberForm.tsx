"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionResult = { error?: string; success?: string } | undefined;

interface InviteMemberFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
}

export function InviteMemberForm({ action }: InviteMemberFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="invite-email">電子郵件</Label>
        <div className="flex gap-2">
          <Input
            id="invite-email"
            name="email"
            type="email"
            placeholder="輸入對方帳號的電子郵件"
            className="flex-1"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "邀請中..." : "邀請"}
          </Button>
        </div>
      </div>
      {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm">{state.success}</p>}
    </form>
  );
}
