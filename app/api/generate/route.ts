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

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      console.error("Upload failed:", text);
      return NextResponse.json({ error: "Failed to upload image", details: text }, { status: 500 });
    }

    let uploadData: { url?: string };
    try {
      uploadData = await uploadRes.json();
    } catch (e) {
      console.error("Failed to parse upload response:", e);
      return NextResponse.json({ error: "Failed to parse upload response" }, { status: 500 });
    }

    if (!uploadData.url) {
      return NextResponse.json({ error: "Upload did not return URL" }, { status: 500 });
    }

    const requestId = uuidv4();
    // temporary store the initial state
    tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

    // call NanoBanana API
    const apiRes = await fetch("https://api.nanobananaapi.ai/api/v1/nanobanana/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        type: "IMAGETOIAMGE",
        imageUrls: [uploadData.url],
        callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app"}/api/callback?requestId=${encodeURIComponent(requestId)}`,
      }),
    });

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
