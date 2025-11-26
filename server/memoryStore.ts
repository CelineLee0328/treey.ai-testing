
export interface TempData {
  status: "pending" | "done" | "error";
  image?: string | null;
  error?: string;
  createdAt: number; 
}

export const tempStore: Record<string, TempData> = {};

const CLEANUP_INTERVAL = 60 * 1000; // clean each 1 min
const EXPIRATION_TIME = 10 * 60 * 1000; // 10 min

setInterval(() => {
  const now = Date.now();
  for (const id in tempStore) {
    if (now - tempStore[id].createdAt > EXPIRATION_TIME) {
      delete tempStore[id];
      console.log(`tempStore: cleaned up expired requestId ${id}`);
    }
  }
}, CLEANUP_INTERVAL);
