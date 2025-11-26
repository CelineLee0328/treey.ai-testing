import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({ secure: true }); // Make sure CLOUDINARY_URL is set

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const callbackKey = req.url.includes("?key=") ? new URL(req.url).searchParams.get("key") : null;
    console.log("🔹 Callback received, key:", callbackKey);
    console.log("🔹 Full callback payload:", JSON.stringify(data));

    // Get the NanoBanana URL directly
    const generatedUrl = data?.data?.info?.resultImageUrl;
    if (!generatedUrl) {
      return NextResponse.json({ error: "No generated image URL in payload" }, { status: 400 });
    }

    // Just return the URL
    return NextResponse.json({ url: generatedUrl });
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json({ error: "Callback failed", details: JSON.stringify(err) }, { status: 500 });
  }
}

