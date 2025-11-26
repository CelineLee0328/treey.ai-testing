import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { prompt, init_image } = await req.json();

    if (!process.env.NANOBANANA_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    if (!init_image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // 產生 requestId 並暫存狀態
    const requestId = uuidv4();
    tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

    // 直接呼叫 NanoBanana API，傳 Base64
    const apiRes = await fetch("https://api.nanobananaapi.ai/api/v1/nanobanana/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        type: "IMAGETOIMAGE",         // 注意拼寫
        images: [init_image],         // 直接傳 Base64
        callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app"}/api/callback?requestId=${encodeURIComponent(requestId)}`,
      }),
    });

    // 檢查 NanoBanana API 回傳狀態
    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("NanoBanana API failed:", errText);
      return NextResponse.json({ error: "API request failed", details: errText }, { status: 500 });
    }

    return NextResponse.json({ requestId });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
