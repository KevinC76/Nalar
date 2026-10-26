export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function assert(
  condition: unknown,
  message: string,
  status = 400,
): asserts condition {
  if (!condition) throw new AppError(status, message);
}
// ponytail: single-process demo; use shared rate-limit storage before multiple instances.
const limits = new Map<string, { count: number; until: number }>();
export function rateLimit(key: string, max: number, windowMs = 60000) {
  const now = Date.now();
  if (limits.size > 10000)
    for (const [k, v] of limits) if (v.until < now) limits.delete(k);
  const r = limits.get(key);
  if (!r || r.until < now) {
    limits.set(key, { count: 1, until: now + windowMs });
    return;
  }
  if (++r.count > max)
    throw new AppError(429, "Terlalu banyak permintaan. Coba lagi sebentar.");
}
