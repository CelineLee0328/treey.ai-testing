import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

export const config = {
    api: { bodyParser: { sizeLimit: "10mb" } },
};

// 使用 CLOUDINARY_URL 自動解析
cloudinary.v2.config({ secure: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    // Base64 驗證
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    if (!base64Regex.test(image)) {
        return res.status(400).json({ error: "Invalid Base64 image format" });
    }

    try {
        const uploadRes = await cloudinary.v2.uploader.upload(image, {
            folder: "treey_ai_uploads",
            resource_type: "image",
        });
        console.log("Cloudinary upload success:", uploadRes.secure_url);
        return res.status(200).json({ url: uploadRes.secure_url });
    } catch (err: any) {
        console.error("Cloudinary upload failed full error:", err);
        return res.status(500).json({
            error: "Cloudinary upload failed",
            details: JSON.stringify(err, Object.getOwnPropertyNames(err)),
        });
    }
}
