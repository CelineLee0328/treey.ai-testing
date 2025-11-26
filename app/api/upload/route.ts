import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export const runtime = "nodejs";

// 10MB 上傳限制
export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

// Cloudinary 自動讀 CLOUDINARY_URL
cloudinary.v2.config({ secure: true });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // Base64 驗證
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    if (!base64Regex.test(image)) {
      return NextResponse.json({ error: "Invalid Base64 image format" }, { status: 400 });
    }

    try {
      const uploadRes = await cloudinary.v2.uploader.upload(image, {
        folder: "treey_ai_uploads",
        resource_type: "image",
      });

      console.log("Cloudinary upload success:", uploadRes.secure_url);
      return NextResponse.json({ url: uploadRes.secure_url });

    } catch (err: any) {
      console.error("Cloudinary upload failed full error:", err);
      return NextResponse.json({
        error: "Cloudinary upload failed",
        details: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      }, { status: 500 });
    }

  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Server error during upload" }, { status: 500 });
  }
}
