import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE;

export async function POST(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json({ error: "API base URL not configured" }, { status: 500 });
  }

  const body = await req.json();

  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
