// app/api/events/route.ts
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

  // heartbeat
  const interval = setInterval(() => {
    writer.write(`:\n\n`);
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
  } catch {
    delete clients[callbackKey];
  }
}
