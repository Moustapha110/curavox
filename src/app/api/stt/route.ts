import { isLanguageCode } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Speech to text via Deepgram (pre-recorded). The browser records a short clip
 * with MediaRecorder and POSTs the raw audio here; the key never leaves the server.
 */
export async function POST(req: Request): Promise<Response> {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) return Response.json({ error: "DEEPGRAM_API_KEY not configured" }, { status: 503 });

  const url = new URL(req.url);
  const langRaw = url.searchParams.get("lang");
  const lang = isLanguageCode(langRaw) ? langRaw : "en";
  const contentType = req.headers.get("content-type") || "audio/webm";
  const audio = await req.arrayBuffer();
  if (audio.byteLength < 1000) return Response.json({ transcript: "" });

  async function ask(model: string, language: string) {
    const params = new URLSearchParams({ model, language, smart_format: "true", punctuate: "true" });
    const r = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": contentType },
      body: audio,
    });
    return r;
  }

  // Nova-3: English natively, "multi" for code-switching Spanish/French. Fall back to Nova-2.
  let r = await ask("nova-3", lang === "en" ? "en" : "multi");
  if (!r.ok) r = await ask("nova-2", lang);
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return Response.json({ error: `Deepgram STT failed (${r.status}): ${detail.slice(0, 200)}` }, { status: 502 });
  }
  const data = (await r.json()) as {
    results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> };
  };
  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? "";
  return Response.json({ transcript });
}
