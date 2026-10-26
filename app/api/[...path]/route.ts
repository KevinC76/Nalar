import { handle } from "@/lib/api";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;
async function route(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return handle(req, (await context.params).path);
}
export const GET = route;
export const POST = route;
