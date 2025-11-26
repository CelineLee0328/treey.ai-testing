import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // Node.js runtime to allow large POST body

export async function POST(req: Request) {
    try {
        const { prompt, imageUrl, image_size = "1:1" } = await req.json();

        if (!process.env.NANOBANANA_API_KEY) {
            return NextResponse.json({ error: "Missing API key" }, { status: 500 });
        }
        if (!imageUrl) {
            return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
        }

        const requestId = uuidv4();
        tempStore[requestId] = { status: "pending", image: null, createdAt: Date.now() };

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://treey-ai-testing.vercel.app";
        const callBackUrl = `${baseUrl}/api/callback?requestId=${requestId}`;

        // Send public URL directly to NanoBanana
        const apiRes = await fetch("https://api.nanobananaapi.ai/api/v1/nanobanana/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}`,
            },
            body: JSON.stringify({
                prompt,
                type: "IMAGETOIAMGE",
                imageUrls: [imageUrl], // now using ImgBB URL
                callBackUrl,
                numImages: 1,
                image_size,
            }),
        });

        if (!apiRes.ok) {
            const errText = await apiRes.text();
            return NextResponse.json({ error: "NanoBanana request failed", details: errText }, { status: 500 });
        }

        return NextResponse.json({ requestId });

    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET endpoint for polling task result
export async function GET(req: Request) {
    const url = new URL(req.url);
    const requestId = url.searchParams.get("requestId");

    if (!requestId || !tempStore[requestId]) {
        return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });
    }

    const data = tempStore[requestId];
    return NextResponse.json(data);
}
