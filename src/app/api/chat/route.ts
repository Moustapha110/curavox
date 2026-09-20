import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  type Content,
  type GenerateContentStreamResult,
  type GenerationConfig,
} from "@google/generative-ai";
import { getDrug, getDrugContextString, isDrugId } from "@/data/metformin";
import { buildSystemPrompt } from "@/lib/system-prompt";
import {
  GEMINI_CHAT_MODEL,
  GREETING_TRIGGER,
  LANGUAGE_NAMES,
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_CHARS,
  isLanguageCode,
} from "@/lib/constants";
import type { ApiChatMessage } from "@/lib/types";
import { friendlyGeminiError } from "@/lib/gemini-errors";
import { addItem } from "@/lib/inbox-store";

export const runtime = "nodejs";
export const maxDuration = 60;

const MISSING_KEY_MESSAGE =
  "Gemini API key not configured. Add GEMINI_API_KEY to .env.local and restart the dev server.";

// Medication guidance (side effects, emergencies, "call 911") can trip the default
// safety filters. Only block genuinely high-risk content.
const SAFETY_SETTINGS = [
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }));

// Gemini 2.5 models "think" before answering by default, which adds latency and
// spends the output budget on hidden tokens. The API accepts thinkingBudget: 0
// even though this SDK version's types do not list it yet.
const GENERATION_CONFIG = {
  temperature: 0.4,
  maxOutputTokens: 350,
  thinkingConfig: { thinkingBudget: 0 },
} as GenerationConfig;

const MODEL_FALLBACKS = [GEMINI_CHAT_MODEL, "gemini-2.5-flash-lite", "gemini-3.5-flash-lite", "gemini-3.5-flash"] as const;

function bad(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

function sanitizeMessages(raw: unknown): ApiChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ApiChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length > MAX_MESSAGE_CHARS) return null;
    const trimmed = content.trim();
    if (trimmed.length === 0) continue;
    out.push({ role, content: trimmed });
  }
  return out.slice(-MAX_HISTORY_MESSAGES);
}

/**
 * Gemini needs the conversation to start with a user turn, alternate roles,
 * and end with a user turn. Merge consecutive same-role turns and prepend the
 * greeting sentinel when the history starts with the assistant's greeting.
 */
function toGeminiContents(history: ApiChatMessage[]): Content[] {
  const contents: Content[] = [];
  for (const m of history) {
    const role = m.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts.push({ text: m.content });
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: GREETING_TRIGGER }] });
  }
  return contents;
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return bad(MISSING_KEY_MESSAGE, 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("Request body must be JSON.");
  }
  if (!body || typeof body !== "object") return bad("Request body must be an object.");

  const { messages, drug, language, doctorName, patientName, knowledgeBase, companionId } = body as Record<string, unknown>;
  const companion = typeof companionId === "string" && companionId.length > 0 && companionId.length <= 40 ? companionId : null;

  if (!isDrugId(drug)) return bad("Unknown or unsupported medication.");
  if (!isLanguageCode(language)) return bad("Language must be one of: es, fr, en.");
  if (typeof doctorName !== "string" || doctorName.trim().length === 0 || doctorName.length > 80) {
    return bad("doctorName is required.");
  }
  const patient =
    typeof patientName === "string" && patientName.trim().length > 0
      ? patientName.trim().slice(0, 40)
      : undefined;

  const kb = Array.isArray(knowledgeBase)
    ? (knowledgeBase as unknown[]).filter((n): n is string => typeof n === "string" && n.trim().length > 0).slice(0, 20)
    : undefined;

  const history = sanitizeMessages(messages ?? []);
  if (!history) return bad("messages must be an array of { role, content }.");
  if (history.length === 0) history.push({ role: "user", content: GREETING_TRIGGER });

  const system = buildSystemPrompt(
    getDrugContextString(getDrug(drug)),
    LANGUAGE_NAMES[language],
    doctorName.trim(),
    patient,
    kb,
  );

  // Aborting this controller stops the SDK's fetch when the client disconnects.
  const abort = new AbortController();
  req.signal.addEventListener("abort", () => abort.abort(), { once: true });

  // Free-tier quotas are per model. On a rate limit, fall through to the next model.
  const genAI = new GoogleGenerativeAI(apiKey);
  const contents = toGeminiContents(history);
  let result: GenerateContentStreamResult | null = null;
  let lastErr: unknown = null;
  const errors: string[] = [];
  for (const modelName of MODEL_FALLBACKS) {
    const isPrimary = modelName === GEMINI_CHAT_MODEL;
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: system,
      safetySettings: SAFETY_SETTINGS,
      // thinkingBudget is a 2.5-flash knob; fallbacks get a plain config.
      generationConfig: isPrimary ? GENERATION_CONFIG : { temperature: 0.4, maxOutputTokens: 400 },
    });
    try {
      result = await model.generateContentStream({ contents }, { signal: abort.signal });
      break;
    } catch (err) {
      lastErr = err;
      const raw = (err as { status?: number; message?: string }) ?? {};
      const text = String(raw.message ?? "");
      errors.push(`${modelName}: ${raw.status ?? "?"} ${text.slice(0, 160)}`);
      console.warn("[chat] model failed", modelName, raw.status, text.slice(0, 300));
      // Auth failures are not model-specific; everything else is worth trying the next model.
      if (raw.status === 401 || raw.status === 403) break;
    }
  }
  if (!result) {
    const { message, status } = friendlyGeminiError(lastErr, {
      fallback: "The AI service is temporarily unavailable. Please try again.",
    });
    return Response.json({ error: message, detail: errors }, { status });
  }

  const ACTION_RE = /\[\[ACTION:(appointment|question|urgent)\|([^\]]*)\]\]/gi;
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let acc = "";
      try {
        for await (const chunk of result.stream) {
          const delta = chunk.text();
          if (delta) acc += delta;
        }
      } catch {
        // mid-stream failure, safety block, or abort: deliver what we have
      }
      // Pull Cora's actions out of the reply and file them for the physician.
      const actions: Array<{ kind: "appointment" | "question" | "urgent"; text: string }> = [];
      const clean = acc
        .replace(ACTION_RE, (_m, kind: string, text: string) => {
          actions.push({ kind: kind.toLowerCase() as "appointment" | "question" | "urgent", text: text.trim() });
          return "";
        })
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (companion) {
        for (const a of actions) {
          if (a.text) addItem({ companionId: companion, patient: patient ?? "Patient", lang: language, kind: a.kind, text: a.text });
        }
      }
      try {
        controller.enqueue(encoder.encode(clean));
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
