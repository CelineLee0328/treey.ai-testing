import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // 重要：確保支援大 body

export async function POST(req: Request) {
  try {
    const { prompt, init_image } = await req.json();

    if (!process.env.NANOBANANA_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    if (!init_image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 產生 requestId
    const requestId = uuidv4();
    tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app";

    const callBackUrl = `${baseUrl}/api/callback?requestId=${requestId}`;

    console.log("Sending request to NanoBanana with requestId:", requestId);
    console.log("Callback URL:", callBackUrl);
    console.log("Image size (base64 length):", init_image.length);

    // 🔥 舊版方式上傳 Base64，但使用新版 async API
    const apiRes = await fetch(
      "https://api.nanobananaapi.ai/api/v1/nanobanana/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          type: "IMAGETOIAMGE",
          imageBase64: [init_image], // 🔥 核心：繼續使用舊版 Base64 字段
          callBackUrl,              // 🔥 但觸發新版 async callback
          numImages: 1,
        }),
      }
    );

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("NanoBanana API failed:", errText);
      return NextResponse.json(
        { error: "API request failed", details: errText },
        { status: 500 }
      );
    }

    const result = await apiRes.json();
    console.log("NanoBanana accepted task:", result);

    return NextResponse.json({ requestId });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
