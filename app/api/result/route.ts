import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestId = url.searchParams.get("requestId");

  if (!requestId || !tempStore[requestId]) return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });

  const data = tempStore[requestId];
  return NextResponse.json(data);
}
