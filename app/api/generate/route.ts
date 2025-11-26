import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // Ensure Node.js runtime for large body

export async function POST(req: Request) {
  try {
    const { prompt, init_image, image_size = "1:1" } = await req.json();

    if (!process.env.NANOBANANA_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    if (!init_image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Generate requestId and store pending status
    const requestId = uuidv4();
    tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app";
    const callBackUrl = `${baseUrl}/api/callback?requestId=${requestId}`;

    console.log("Uploading image to public URL...");

    // Upload Base64 image to your /api/upload endpoint to get a public URL
    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: init_image }),
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      console.error("Upload API failed:", text);
      return NextResponse.json({ error: "Image upload failed", details: text }, { status: 500 });
    }

    const { url: imageUrl } = await uploadRes.json();
    console.log("Image uploaded, URL:", imageUrl);

    // Send image URL to NanoBanana
    const apiRes = await fetch("https://api.nanobananaapi.ai/api/v1/nanobanana/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        type: "IMAGETOIAMGE",
        imageUrls: [imageUrl], // pass public URL instead of Base64
        callBackUrl,
        numImages: 1,
        image_size, // optional, default 1:1
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("NanoBanana API failed:", errText);
      return NextResponse.json({ error: "NanoBanana request failed", details: errText }, { status: 500 });
    }

    const result = await apiRes.json();
    console.log("NanoBanana accepted task:", result);

    return NextResponse.json({ requestId });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Keep GET endpoint for polling task result
export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestId = url.searchParams.get("requestId");

  if (!requestId || !tempStore[requestId]) {
    return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });
  }

  const data = tempStore[requestId];
  return NextResponse.json(data);
}
