import { GoogleGenerativeAI } from "@google/generative-ai";
import { addItem, answerItem, listItems } from "@/lib/inbox-store";
import { GEMINI_CHAT_MODEL, LANGUAGE_NAMES, isLanguageCode } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/** GET ?companion=<id> (patient side) or no param (physician side, everything). */
export async function GET(req: Request): Promise<Response> {
  const companion = new URL(req.url).searchParams.get("companion") ?? undefined;
  return Response.json({ items: listItems(companion) }, { headers: NO_STORE });
}

/** POST: file an item (used by the chat route and available for manual tests). */
export async function POST(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const kind = body.kind === "appointment" || body.kind === "urgent" ? body.kind : "question";
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 600) : "";
  const companionId = typeof body.companionId === "string" ? body.companionId : "";
  if (!text || !companionId) return Response.json({ error: "text and companionId required" }, { status: 400 });
  const item = addItem({
    companionId,
    patient: typeof body.patient === "string" ? body.patient : "Patient",
    lang: isLanguageCode(body.lang) ? body.lang : "en",
    kind,
    text,
  });
  return Response.json({ item }, { headers: NO_STORE });
}

/** PATCH: physician replies. Cora rewrites the reply for the patient in their language. */
export async function PATCH(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => ({}))) as { id?: unknown; reply?: unknown; doctorName?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  const reply = typeof body.reply === "string" ? body.reply.trim().slice(0, 1200) : "";
  const doctor = typeof body.doctorName === "string" && body.doctorName.trim() ? body.doctorName.trim() : "your doctor";
  if (!id || !reply) return Response.json({ error: "id and reply required" }, { status: 400 });

  const existing = listItems().find((i) => i.id === id);
  if (!existing) return Response.json({ error: "not found" }, { status: 404 });

  const language = LANGUAGE_NAMES[isLanguageCode(existing.lang) ? existing.lang : "en"];
  let delivery = `${doctor}: ${reply}`;
  const key = process.env.GEMINI_API_KEY;
  if (key) {
    const prompt =
      `You are Cora, a warm medication companion. The patient (first name ${existing.patient}) earlier ` +
      (existing.kind === "appointment" ? "asked to book a follow-up appointment" : `asked: "${existing.text}"`) +
      `. ${doctor} has now replied: "${reply}".\n` +
      `Deliver this to the patient in ${language}, in 1 to 3 short spoken sentences, warm and plain, attributing it clearly to ${doctor} (for example "${doctor} got back to me:"). ` +
      `${doctor} is a woman: in Spanish say "la Dra. Martinez" / "la doctora", in French "la Dre Martinez". Do not add medical advice beyond what ${doctor} said. Plain text only, no markdown.`;
    for (const modelName of [GEMINI_CHAT_MODEL, "gemini-2.5-flash-lite", "gemini-3.5-flash-lite"]) {
      try {
        const model = new GoogleGenerativeAI(key).getGenerativeModel({ model: modelName });
        const r = await model.generateContent(prompt);
        const text = r.response.text().trim();
        if (text) {
          delivery = text;
          break;
        }
      } catch {
        /* try next model */
      }
    }
  }
  const item = answerItem(id, reply, delivery);
  return Response.json({ item }, { headers: NO_STORE });
}
