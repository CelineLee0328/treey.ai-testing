import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({ secure: true }); // Make sure CLOUDINARY_URL is set

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const callbackKey = url.searchParams.get("key");

    console.log("🔹 Callback received with key:", callbackKey);

    if (!callbackKey) {
      console.error("❌ Missing callback key in request URL");
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const data = await req.json();
    console.log("🔹 Full callback payload:", JSON.stringify(data, null, 2));

    // Extract the result image URL
    const resultUrl = data?.data?.info?.resultImageUrl;
    if (!resultUrl) {
      console.error("⚠ No resultImageUrl found in payload!");
      return NextResponse.json({ error: "No image in payload" }, { status: 400 });
    }

    console.log("🔹 Result image URL from NanoBanana:", resultUrl);

    // Upload directly from URL to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(resultUrl, {
      folder: "treey_ai_results",
      resource_type: "image",
      public_id: callbackKey,
    });

    console.log("✅ Cloudinary upload success:", uploadResponse.secure_url);

    return NextResponse.json({ url: uploadResponse.secure_url });

  } catch (err: any) {
    console.error("❌ Callback error:", err);
    return NextResponse.json({ error: "Callback failed", details: JSON.stringify(err) }, { status: 500 });
  }
}
