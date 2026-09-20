import { isDrugId } from "@/data/metformin";
import { buildCompanionUrl, generateCompanionId } from "@/lib/companion";
import { isLanguageCode } from "@/lib/constants";
import { getPublicOrigin } from "@/lib/public-origin";
import type { CompanionParams, CreateCompanionResponse } from "@/lib/types";

export const runtime = "nodejs";

function bad(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("Request body must be JSON.");
  }
  if (!body || typeof body !== "object") return bad("Request body must be an object.");

  const { drug, language, doctorName, patientName } = body as Record<string, unknown>;

  if (!isDrugId(drug)) return bad("Unknown or unsupported medication.");
  if (!isLanguageCode(language)) return bad("Language must be one of: es, fr, en.");
  if (typeof doctorName !== "string" || doctorName.trim().length === 0 || doctorName.trim().length > 80) {
    return bad("doctorName is required (max 80 characters).");
  }
  let patient: string | undefined;
  if (patientName !== undefined && patientName !== null && patientName !== "") {
    if (typeof patientName !== "string" || patientName.trim().length > 40) {
      return bad("patientName must be a string of at most 40 characters.");
    }
    patient = patientName.trim() || undefined;
  }

  const params: CompanionParams = {
    drug,
    lang: language,
    doctor: doctorName.trim(),
    ...(patient ? { patient } : {}),
  };

  const id = generateCompanionId();
  const origin = getPublicOrigin(req);
  const url = buildCompanionUrl(origin, id, params);

  const payload: CreateCompanionResponse = { id, url, qrData: url };
  return Response.json(payload, { headers: { "Cache-Control": "no-store" } });
}
