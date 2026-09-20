export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Temporary debug: which Gemini models this key can use. Delete after the hackathon. */
export async function GET(): Promise<Response> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "no key" }, { status: 503 });
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=100`);
  const data = (await r.json()) as { models?: Array<{ name: string; supportedGenerationMethods?: string[] }> };
  const names = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace("models/", ""));
  return Response.json({ status: r.status, names });
}
