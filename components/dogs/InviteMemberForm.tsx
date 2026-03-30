"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ActionResult = { error?: string; success?: string } | undefined;

interface InviteMemberFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
}

export function InviteMemberForm({ action }: InviteMemberFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
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
    </form>
  );
}
