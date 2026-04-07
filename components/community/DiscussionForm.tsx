"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
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
import { ImagePlus, X, Film } from "lucide-react";

type ActionResult = { error?: Record<string, string[]> } | void;

interface DiscussionFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  defaultValues?: {
    title: string;
    content: string;
    category: string;
    imageUrls: string[];
  };
}

const MAX_MEDIA = 5;

function isVideo(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

function uploadFile(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          resolve(data.url);
        } else {
          reject(new Error(data.error || "上傳失敗"));
        }
      } catch {
        reject(new Error("上傳失敗"));
      }
    };

    xhr.onerror = () => reject(new Error("網路錯誤，請檢查連線"));
    xhr.ontimeout = () => reject(new Error("上傳逾時"));
    xhr.timeout = 120000; // 2 minutes

    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}

const categoryItems = Object.fromEntries(
  DISCUSSION_CATEGORIES.map((c) => [c.value, c.label])
);

export function DiscussionForm({ action, defaultValues }: DiscussionFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = (state as { error?: Record<string, string[]> })?.error ?? {};
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues?.imageUrls ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_MEDIA - imageUrls.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    setUploadError("");
    setUploadProgress(0);

    const newUrls: string[] = [];
    for (let i = 0; i < toUpload.length; i++) {
      try {
        const url = await uploadFile(toUpload[i], (pct) => {
          // Overall progress across all files
          const base = (i / toUpload.length) * 100;
          const filePortion = pct / toUpload.length;
          setUploadProgress(Math.round(base + filePortion));
        });
        newUrls.push(url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "上傳失敗");
        break;
      }
    }

    if (newUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

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

      <div className="space-y-2">
        <Label>圖片 / 影片（最多 {MAX_MEDIA} 個）</Label>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border">
                {isVideo(url) ? (
                  <video src={url} className="object-cover w-full h-full" muted />
                ) : (
                  <Image
                    src={url}
                    alt={`媒體 ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
                {isVideo(url) && (
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white rounded px-1">
                    <Film className="h-3 w-3" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">上傳中... {uploadProgress}%</p>
          </div>
        )}

        {imageUrls.length < MAX_MEDIA && !uploading && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="media-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4 mr-1" />
              選擇圖片 / 影片
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              圖片：JPEG、PNG、WebP、GIF（最大 5MB）｜影片：MP4、WebM、MOV（最大 50MB）
            </p>
          </div>
        )}

        {uploadError && (
          <p className="text-destructive text-xs">{uploadError}</p>
        )}
      </div>

      <input type="hidden" name="imageUrls" value={JSON.stringify(imageUrls)} />

      <Button type="submit" disabled={pending || uploading}>
        {pending ? "儲存中..." : defaultValues ? "更新文章" : "發佈文章"}
      </Button>
    </form>
  );
}
