// Server-only helper: import this ONLY from route handlers (src/app/api/**).
// It maps raw Google Gemini SDK errors to short, user-safe messages.

interface GeminiErrorShape {
  status?: number;
  statusText?: string;
  message?: string;
  errorDetails?: Array<{ reason?: string; message?: string }>;
}

const INVALID_KEY_MARKERS = ["API_KEY_INVALID", "API key not valid", "API key expired"];
const QUOTA_MARKERS = ["RESOURCE_EXHAUSTED", "quota", "Quota"];

function errorText(e: GeminiErrorShape): string {
  const details = (e.errorDetails ?? [])
    .map((d) => [d.reason, d.message].filter((s): s is string => typeof s === "string").join(" "))
    .join(" ");
  return [e.message, e.statusText, details].filter((s): s is string => typeof s === "string").join(" ");
}

export interface FriendlyGeminiErrorOptions {
  /** Message for any error not matched by a specific branch. */
  fallback: string;
}

export function friendlyGeminiError(
  err: unknown,
  { fallback }: FriendlyGeminiErrorOptions,
): { message: string; status: number } {
  const e = (err ?? {}) as GeminiErrorShape;
  const text = errorText(e);
  const status = e.status;

  if (INVALID_KEY_MARKERS.some((m) => text.includes(m)) || status === 401 || status === 403) {
    return { message: "Invalid Gemini API key. Check GEMINI_API_KEY in .env.local.", status: 502 };
  }
  if (status === 404 || text.includes("is not found for API version")) {
    return { message: "The configured Gemini model was not found. Check GEMINI_CHAT_MODEL.", status: 502 };
  }
  if (status === 429 || QUOTA_MARKERS.some((m) => text.includes(m))) {
    return { message: "Gemini rate limit or quota reached. Please try again in a moment.", status: 502 };
  }
  if (status === 400) {
    return { message: "Gemini rejected the request.", status: 502 };
  }
  return { message: fallback, status: 502 };
}
