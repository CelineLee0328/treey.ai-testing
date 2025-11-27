import { NextResponse } from "next/server";

// 全局 SSE 連線池
const sseConnections: Record<string, any[]> = {};

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const callbackKey = new URL(req.url).searchParams.get("key");
    console.log("🔹 Callback received, key:", callbackKey);
    console.log("🔹 Full callback payload:", JSON.stringify(data));

    const generatedUrl = data?.data?.info?.resultImageUrl;
    if (!generatedUrl) {
      return NextResponse.json({ error: "No generated image URL in payload" }, { status: 400 });
    }

    // 如果有 SSE 客戶端正在監聽 callbackKey，推送給前端
    if (callbackKey && sseConnections[callbackKey]) {
      sseConnections[callbackKey].forEach((res) => {
        res.write(`data: ${JSON.stringify({ url: generatedUrl })}\n\n`);
        res.end();
      });
      // 清空連線
      delete sseConnections[callbackKey];
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json({ error: "Callback failed", details: JSON.stringify(err) }, { status: 500 });
  }
}

// SSE endpoint
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return new NextResponse("Missing key", { status: 400 });

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const res = new NextResponse(null, { headers });
  
  // 儲存連線到對應 key
  if (!sseConnections[key]) sseConnections[key] = [];
  sseConnections[key].push(res);

  return res;
}
