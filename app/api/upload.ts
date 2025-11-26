// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

// 設定 Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image } = req.body; // Base64 string
  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 上傳到 Cloudinary
    const uploadRes = await cloudinary.v2.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder: "treey_ai_uploads", // 可以自訂資料夾
    });

    return res.status(200).json({ url: uploadRes.secure_url }); // 回傳 Cloudinary URL
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return res.status(500).json({ error: "Cloudinary upload failed", details: err });
  }
}
