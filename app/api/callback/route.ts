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

    // Try all possible fields NanoBanana may send
    const base64Image =
      data?.data?.[0]?.image ||   // primary field
      data?.data?.[0]?.url ||     // sometimes API returns a URL
      data?.imageUrl ||           // fallback
      data?.base64;               // fallback base64

    if (!base64Image) {
      console.error("⚠ No image found in callback payload!");
      return NextResponse.json({ error: "No image in payload" }, { status: 400 });
    }

    // If the image is a URL, fetch it and convert to base64
    let finalImage: string;
    if (base64Image.startsWith("http")) {
      console.log("🔹 Image is a URL, fetching...");
      const resp = await fetch(base64Image);
      const buffer = await resp.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString("base64");
      finalImage = `data:image/png;base64,${base64Data}`;
    } else {
      finalImage = base64Image.startsWith("data:") ? base64Image : `data:image/png;base64,${base64Image}`;
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(finalImage, {
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
