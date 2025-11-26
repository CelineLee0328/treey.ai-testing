import { NextResponse } from "next/server";
import { tempStore } from "@/server/memoryStore";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const requestId = url.searchParams.get("requestId");
    if (!requestId || !tempStore[requestId]) return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });

    const data = await req.json();
    console.log("Callback data:", data);

    // 官方文件說明圖片會在 data.data[0].image 或 data.imageUrl
    const image =
      data.data?.[0]?.image ||
      data.imageUrl ||
      (data.base64 ? `data:image/png;base64,${data.base64}` : null);

    tempStore[requestId].status = "done";
    tempStore[requestId].image = image;

    // clear after 5 mon
    setTimeout(() => delete tempStore[requestId], 5 * 60 * 1000);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Callback error" }, { status: 500 });
  }
}
