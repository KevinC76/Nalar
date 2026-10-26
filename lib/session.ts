import "server-only";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { createHash, randomBytes } from "node:crypto";
import { sql, ensureSchema } from "./db";
import { AppError } from "./errors";
import type { Grade } from "./curriculum";
export type User = {
  id: string;
  email: string;
  full_name: string;
  grade_level: Grade;
};
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export function newSession() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    hash: hashToken(token),
    expires: new Date(Date.now() + 7 * 86400000).toISOString(),
  };
}
async function cookieSession() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32)
    throw new AppError(503, "Rahasia sesi belum dikonfigurasi.");
  return getIronSession<{ token?: string }>(await cookies(), {
    password,
    cookieName: "nalar_session",
    ttl: 7 * 86400,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.APP_ORIGIN?.startsWith("https://") ?? false,
      path: "/",
    },
  });
}
export async function currentUser(): Promise<User | null> {
  const session = await cookieSession();
  if (!session.token) return null;
  await ensureSchema();
  return (
    (
      await sql<User>(
        "SELECT u.id, u.email, u.full_name, u.grade_level FROM users u INNER JOIN auth_sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>$2",
        [hashToken(session.token), new Date().toISOString()],
      )
    )[0] ?? null
  );
}
export async function requireUser() {
  const u = await currentUser();
  if (!u)
    throw new AppError(
      401,
      "Masuk terlebih dahulu untuk menyimpan progres dan berbincang dengan tutor.",
    );
  return u;
}
export async function setSession(token: string) {
  const s = await cookieSession();
  s.token = token;
  await s.save();
}
export async function logout() {
  const s = await cookieSession();
  if (s.token)
    await sql("DELETE FROM auth_sessions WHERE token_hash=$1", [
      hashToken(s.token),
    ]);
  s.destroy();
}
