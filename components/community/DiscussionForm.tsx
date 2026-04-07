"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DISCUSSION_CATEGORIES } from "@/lib/types";

type ActionResult = { error?: Record<string, string[]> } | void;

interface DiscussionFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  defaultValues?: {
    title: string;
    content: string;
    category: string;
    imageUrl: string | null;
  };
}

const categoryItems = Object.fromEntries(
  DISCUSSION_CATEGORIES.map((c) => [c.value, c.label])
);

export function DiscussionForm({ action, defaultValues }: DiscussionFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">標題 *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title ?? ""}
          required
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>分類 *</Label>
        <Select
          name="category"
          defaultValue={defaultValues?.category}
          items={categoryItems}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇分類" />
          </SelectTrigger>
          <SelectContent>
            {DISCUSSION_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-destructive text-xs">{errors.category[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">內容 *</Label>
        <Textarea
          id="content"
          name="content"
          rows={6}
          defaultValue={defaultValues?.content ?? ""}
          placeholder="分享你的經驗與心得..."
          required
        />
        {errors.content && (
          <p className="text-destructive text-xs">{errors.content[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="imageUrl">圖片網址（選填）</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={defaultValues?.imageUrl ?? ""}
          placeholder="https://..."
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "儲存中..." : defaultValues ? "更新文章" : "發佈文章"}
      </Button>
    </form>
  );
}
