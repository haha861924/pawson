"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Camera } from "lucide-react";

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
    avatarUrl?: string | null;
    chipNumber?: string | null;
    motherChipNumber?: string | null;
  };
}

export function DogForm({ action, cancelHref, defaultValues }: DogFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};
  const [preview, setPreview] = useState<string | null>(defaultValues?.avatarUrl ?? null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(defaultValues?.avatarUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "上傳失敗");
        setPreview(defaultValues?.avatarUrl ?? null);
      } else {
        setAvatarUrl(data.url);
      }
    } catch {
      setUploadError("上傳失敗，請稍後再試");
      setPreview(defaultValues?.avatarUrl ?? null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      {/* Avatar upload */}
      <div className="space-y-1">
        <Label>大頭貼</Label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative h-20 w-20 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted hover:bg-muted/80 flex items-center justify-center overflow-hidden transition-colors"
            disabled={uploading}
          >
            {preview ? (
              <Image src={preview} alt="預覽" fill className="object-cover" sizes="80px" />
            ) : (
              <Camera className="h-6 w-6 text-muted-foreground" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs">上傳中</span>
              </div>
            )}
          </button>
          <div className="text-sm text-muted-foreground">
            <p>點擊上傳圖片</p>
            <p className="text-xs">支援 JPG、PNG、WebP，最大 5MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
        <input type="hidden" name="avatarUrl" value={avatarUrl ?? ""} />
        {uploadError && <p className="text-destructive text-xs">{uploadError}</p>}
      </div>

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
          <Select name="sex" defaultValue={defaultValues?.sex ?? ""} items={Object.fromEntries(DOG_SEX.map((s) => [s.value, s.label]))}>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="chipNumber">晶片號碼</Label>
          <Input id="chipNumber" name="chipNumber" defaultValue={defaultValues?.chipNumber ?? ""} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="motherChipNumber">母犬晶片號碼</Label>
          <Input id="motherChipNumber" name="motherChipNumber" defaultValue={defaultValues?.motherChipNumber ?? ""} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">備註</Label>
        <Textarea id="notes" name="notes" defaultValue={defaultValues?.notes ?? ""} rows={3} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "儲存中..." : "儲存"}
        </Button>
        <Link href={cancelHref} className={cn(buttonVariants({ variant: "outline" }))}>
          取消
        </Link>
      </div>
    </form>
  );
}
