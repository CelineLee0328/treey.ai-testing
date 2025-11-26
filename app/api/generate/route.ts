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

    // upload image to upload API
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://treey.ai"}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: init_image }),
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.url) return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });

    const requestId = uuidv4();

    // temporary store the initial state
    tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

    // call NanoBanana API
    await fetch("https://api.nanobananaapi.ai/api/v1/nanobanana/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        type: "IMAGETOIAMGE",
        imageUrls: [uploadData.url],
        callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://treey.ai"}/api/callback?requestId=${encodeURIComponent(requestId)}`,
      }),
    });

    return NextResponse.json({ requestId });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
