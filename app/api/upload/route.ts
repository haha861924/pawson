import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { StorageClient } from "@supabase/storage-js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadToSupabase(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const storage = new StorageClient(`${supabaseUrl}/storage/v1`, {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  });
  const { error } = await storage
    .from("pawson-uploads")
    .upload(filename, buffer, { contentType, upsert: false });
  if (error) throw error;
  return `${supabaseUrl}/storage/v1/object/public/pawson-uploads/${filename}`;
}

async function uploadToLocal(buffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "未提供檔案" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "僅支援 JPEG、PNG、WebP、GIF 格式" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "檔案大小不得超過 5MB" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const url = useSupabase
      ? await uploadToSupabase(buffer, filename, file.type)
      : await uploadToLocal(buffer, filename);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "上傳失敗，請稍後再試" }, { status: 500 });
  }
}
