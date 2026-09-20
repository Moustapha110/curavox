import { getPublicOrigin, lanDebug } from "@/lib/public-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tells the browser which origin to bake into QR codes so a phone can open them. */
export async function GET(req: Request): Promise<Response> {
  const debug = new URL(req.url).searchParams.has("debug");
  return Response.json(
    { origin: getPublicOrigin(req), ...(debug ? { debug: lanDebug() } : {}) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
