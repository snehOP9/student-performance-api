import { NextResponse } from "next/server";

export async function POST (req: Request) {
  const base = process.env.API_BASE;
  if (!base) {
    return NextResponse.json({ error: "API_BASE is not set on the server. Create student-ui/.env.local" }, { status: 500 });
  }
  const url = `${base}/uncertainty`;
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  if ("POST" !== "GET") {
    const body = await req.json();
    init.body = JSON.stringify(body);
  }
  const upstream = await fetch(url, init);
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json"
    }
  });
}
