import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL ?? "";
  let info: Record<string, string> = { raw: "(not set)" };
  try {
    const parsed = new URL(url);
    info = {
      host: parsed.hostname,
      port: parsed.port,
      user: parsed.username,
      database: parsed.pathname.replace(/^\//, ""),
    };
  } catch (e) {
    info = { error: String(e) };
  }
  return NextResponse.json(info);
}
