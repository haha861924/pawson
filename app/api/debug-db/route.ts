import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL ?? "";
  // Only show host portion, never expose password
  let host = "(not set)";
  try {
    const parsed = new URL(url);
    host = `${parsed.hostname}:${parsed.port}`;
  } catch {
    host = "(failed to parse)";
  }
  return NextResponse.json({ db_host: host });
}
