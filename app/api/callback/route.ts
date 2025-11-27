import { NextResponse } from "next/server";
import { broadcast } from "../events/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const callbackKey = new URL(req.url).searchParams.get("key");
    const data = await req.json();

    console.log("🔹 Callback received, key:", callbackKey);
    console.log("🔹 Full callback payload:", JSON.stringify(data));

    const generatedUrl = data?.data?.info?.resultImageUrl;
    if (!generatedUrl) {
      return NextResponse.json({ error: "No generated image URL in payload" }, { status: 400 });
    }

    // 推送到對應 SSE 連線
    if (callbackKey) {
      broadcast(callbackKey, { url: generatedUrl });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json({ error: "Callback failed", details: JSON.stringify(err) }, { status: 500 });
  }
}
