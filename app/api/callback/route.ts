import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({ secure: true }); // 使用 CLOUDINARY_URL

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const callbackKey = url.searchParams.get("key");
    if (!callbackKey) return NextResponse.json({ error: "Missing key" }, { status: 400 });

    const data = await req.json();
    const base64Image = data?.data?.[0]?.image || data?.base64;
    if (!base64Image) return NextResponse.json({ error: "No image in payload" }, { status: 400 });

    // Cloudinary 上傳
    const uploadRes = await cloudinary.v2.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: "treey_ai_results",
      resource_type: "image",
      public_id: callbackKey, // 用 key 當 ID，方便前端查
    });

    console.log("Cloudinary upload success:", uploadRes.secure_url);

    return NextResponse.json({ url: uploadRes.secure_url });

  } catch (err: any) {
    console.error("Callback error:", err);
    return NextResponse.json({ error: "Callback failed", details: JSON.stringify(err) }, { status: 500 });
  }
}
