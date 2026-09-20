import { isLanguageCode } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 30;

// Aura-2 voices. French has no Aura-2 voice yet: return 204 and the client
// falls back to the browser voice.
const VOICES: Record<string, string | null> = {
  en: "aura-2-thalia-en",
  es: "aura-2-celeste-es",
  fr: null,
};

export async function POST(req: Request): Promise<Response> {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) return new Response(null, { status: 503 });

  let body: { text?: unknown; lang?: unknown };
  try {
    body = (await req.json()) as { text?: unknown; lang?: unknown };
  } catch {
    return Response.json({ error: "JSON body required" }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 1500) : "";
  const lang = isLanguageCode(body.lang) ? body.lang : "en";
  if (!text) return Response.json({ error: "text required" }, { status: 400 });

  const model = VOICES[lang];
  if (!model) return new Response(null, { status: 204 });

  const r = await fetch(`https://api.deepgram.com/v1/speak?model=${model}&encoding=mp3`, {
    method: "POST",
    headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!r.ok || !r.body) {
    const detail = await r.text().catch(() => "");
    return Response.json({ error: `Deepgram TTS failed (${r.status}): ${detail.slice(0, 200)}` }, { status: 502 });
  }
  return new Response(r.body, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}
