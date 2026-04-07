"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ActionResult = { error?: Record<string, string[]> } | void;

interface CommentFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
}

export function CommentForm({ action }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: unknown, formData: FormData) => {
    const result = await action(prev, formData);
    if (!result) formRef.current?.reset();
    return result;
  }, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <Textarea
        name="content"
        rows={2}
        placeholder="寫下你的回覆..."
        required
      />
      {errors.content && (
        <p className="text-destructive text-xs">{errors.content[0]}</p>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "送出中..." : "送出回覆"}
      </Button>
    </form>
  );
}
