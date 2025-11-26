import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt, imageUrl, image_size = "1:1" } = await req.json();
    if (!process.env.NANOBANANA_API_KEY) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

    // 使用 uuid 當作 callback key
    const callbackKey = uuidv4();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app";
    const callBackUrl = `${baseUrl}/api/callback?key=${callbackKey}`;

    // 送給 NanoBanana
    const apiRes = await fetch("https://api.nanobananaapi.ai/api/v1/nanobanana/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        type: "IMAGETOIAMGE",
        imageUrls: [imageUrl],
        callBackUrl,
        numImages: 1,
        image_size,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return NextResponse.json({ error: "NanoBanana request failed", details: errText }, { status: 500 });
    }

    return NextResponse.json({ callbackKey });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
