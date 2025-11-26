// pages/api/upload.ts 或 app/api/upload/route.ts (app router)
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

// 設定 body 最大限制
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // 適合一般圖片
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
    console.error("Missing Cloudinary env variables");
    return res.status(500).json({ error: "Cloudinary environment variables not set" });
  }

  const { image } = req.body; // Base64 string
  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    // 2️⃣ 移除 Base64 前綴
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 3️⃣ 上傳到 Cloudinary
    const uploadRes = await cloudinary.v2.uploader.upload(
      `data:image/png;base64,${base64Data}`, 
      {
        folder: "treey_ai_uploads", // 自訂資料夾
        resource_type: "image",
      }
    );

    console.log("Cloudinary upload success:", uploadRes.secure_url);

    // 4️⃣ 回傳 URL
    return res.status(200).json({ url: uploadRes.secure_url });

  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    return res.status(500).json({ error: "Cloudinary upload failed", details: err.message || err });
  }
}
