import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE;

  if (!base) {
    return NextResponse.json(
      { error: "API base URL not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const upstream = await fetch(`${base}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();

  return NextResponse.json(data, {
    status: upstream.status,
  });
}
