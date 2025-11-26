import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({ secure: true });

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  console.log("Upload API called");

  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      console.log("No image provided");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    if (!base64Regex.test(image)) {
      console.log("Invalid Base64 format");
      return NextResponse.json({ error: "Invalid Base64 image format" }, { status: 400 });
    }

    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "treey_ai_uploads",
      resource_type: "image",
    });

    console.log("Cloudinary upload success:", uploadRes.secure_url);

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err: any) {
    console.error("Cloudinary upload failed full error:", err);
    return NextResponse.json(
      { error: "Cloudinary upload failed", details: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      { status: 500 }
    );
  }
};
