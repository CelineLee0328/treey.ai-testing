import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

// Serverless 最大 body size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

// Cloudinary 設定
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // 1️⃣ 確認環境變數
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary env variables missing");
    return res.status(500).json({ error: "Cloudinary environment variables not set" });
  }

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "No image provided" });

  // 2️⃣ 驗證 Base64 格式
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
  if (!base64Regex.test(image)) {
    console.error("Invalid Base64 format");
    return res.status(400).json({ error: "Invalid Base64 image format" });
  }

  // 3️⃣ 檢查圖片大小（保險起見）
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const imageSizeInBytes = (base64Data.length * (3/4));
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (imageSizeInBytes > maxSize) {
    return res.status(400).json({ error: "Image too large. Max 5MB allowed." });
  }

  try {
    // 4️⃣ 上傳到 Cloudinary
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "treey_ai_uploads",
      resource_type: "image",
    });

    console.log("Cloudinary upload success:", uploadRes.secure_url);
    return res.status(200).json({ url: uploadRes.secure_url });

  } catch (err: any) {
    console.error("Cloudinary upload failed full error:", err);
    return res.status(500).json({ error: "Cloudinary upload failed", details: JSON.stringify(err) });
  }
}
