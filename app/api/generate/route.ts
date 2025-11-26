import { NextRequest, NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const { prompt, imageUrl, image_size = "1:1" } = await req.json();

    if (!process.env.NANOBANANA_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    const requestId = uuidv4();
    tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app";
    const callBackUrl = `${baseUrl}/api/callback?requestId=${requestId}`;

    console.log("Sending request to NanoBanana...");

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
      console.error("NanoBanana request failed:", errText);
      return NextResponse.json({ error: "NanoBanana request failed", details: errText }, { status: 500 });
    }

    console.log("NanoBanana request sent, requestId:", requestId);
    return NextResponse.json({ requestId });
  } catch (err) {
    console.error("Generate API server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const requestId = url.searchParams.get("requestId");

  if (!requestId || !tempStore[requestId]) {
    return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });
  }

  const data = tempStore[requestId];
  return NextResponse.json(data);
};
