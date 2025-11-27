// SSE endpoint
import { NextRequest } from "next/server";

export const runtime = "edge";

// key → writer
const clients: Record<string, WritableStreamDefaultWriter> = {};

export async function GET(req: NextRequest) {
  const callbackKey = req.nextUrl.searchParams.get("key");
  if (!callbackKey) return new Response("Missing key", { status: 400 });

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // 儲存對應 key 的 writer
  clients[callbackKey] = writer;

  // heartbeat，避免連線被 proxy 關閉
  const interval = setInterval(() => {
    try {
      writer.write(`:\n\n`);
    } catch {
      clearInterval(interval);
      delete clients[callbackKey];
    }
  }, 20000);

  const close = () => {
    clearInterval(interval);
    delete clients[callbackKey];
    writer.close();
  };

  req.signal.addEventListener("abort", close);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

// Helper: 只推送給對應 callbackKey
export function broadcast(callbackKey: string, payload: any) {
  const writer = clients[callbackKey];
  if (!writer) return;
  try {
    writer.write(`data: ${JSON.stringify(payload)}\n\n`);
    // 不要關閉 writer，保持 SSE 長連線
  } catch {
    delete clients[callbackKey];
  }
}
