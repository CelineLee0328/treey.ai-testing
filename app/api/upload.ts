// /pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image } = req.body; // Expect a Base64 string
  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Call ImgBB API
    const formData = new URLSearchParams();
    formData.append("key", process.env.IMGBB_API_KEY!);
    formData.append("image", base64Data);

    const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await imgbbRes.json();

    if (!data.success) {
      console.error("ImgBB upload failed:", data);
      return res.status(500).json({ error: "ImgBB upload failed", details: data });
    }

    const url = data.data.url; // Public URL of uploaded image
    return res.status(200).json({ url });
  } catch (err) {
    console.error("Upload API error:", err);
    return res.status(500).json({ error: "Server error during upload" });
  }
}
