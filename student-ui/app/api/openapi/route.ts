import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.API_BASE;
  if (!base) {
    return NextResponse.json({ error: "API_BASE is not set on the server. Create student-ui/.env.local" }, { status: 500 });
  }
  const upstream = await fetch(`${base}/openapi.json`);
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" }
  });
}
