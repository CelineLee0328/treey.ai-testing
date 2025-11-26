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
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const data = await req.json();
    const base64Image = data?.data?.[0]?.image || data?.base64;

    if (!base64Image) {
      return NextResponse.json({ error: "No image in payload" }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(
      base64Image.startsWith("data:") ? base64Image : `data:image/png;base64,${base64Image}`,
      {
        folder: "treey_ai_results",
        resource_type: "image",
        public_id: callbackKey, // Use key as public ID
      }
    );

    console.log("Cloudinary upload success:", uploadResponse.secure_url);

    return NextResponse.json({ url: uploadResponse.secure_url });

  } catch (err: any) {
    console.error("Callback error:", err);
    return NextResponse.json({ error: "Callback failed", details: JSON.stringify(err) }, { status: 500 });
  }
}
