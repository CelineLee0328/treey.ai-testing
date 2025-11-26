import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";

export const runtime = "nodejs"; // 🔥 必加：否則外部服務無法 POST

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const requestId = url.searchParams.get("requestId");

    if (!requestId || !tempStore[requestId]) {
      console.error("Invalid requestId:", requestId);
      return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });
    }

    const data = await req.json();
    console.log("🔥 Callback received:", JSON.stringify(data, null, 2));

    // ---- 解析圖片 ----
    const image =
      data?.data?.[0]?.image ||        // 官方 data[].image 格式
      data?.imageUrl ||                // 有些模式用 imageUrl
      (data?.base64
        ? `data:image/png;base64,${data.base64}`
        : null);                       // fallback base64

    if (!image) {
      console.warn("⚠ No image found in callback payload!");
    }

    // ---- 更新暫存 ----
    tempStore[requestId].status = "done";
    tempStore[requestId].image = image;

    // 自動清除資料（5 分鐘）
    setTimeout(() => {
      delete tempStore[requestId];
    }, 5 * 60 * 1000);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("❌ Callback error:", err);
    return NextResponse.json({ error: "Callback error" }, { status: 500 });
  }
}
