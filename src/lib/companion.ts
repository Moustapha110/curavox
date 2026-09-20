import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { v4 as uuidv4 } from "uuid";
import type { CompanionParams, DrugId, LanguageCode } from "./types";
import { DEMO_DOCTOR, ROUTES, isLanguageCode } from "./constants";

const KNOWN_DRUGS: DrugId[] = ["metformin"];

function isDrug(x: unknown): x is DrugId {
  return typeof x === "string" && (KNOWN_DRUGS as string[]).includes(x);
}

function cleanText(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function defaultCompanionParams(): CompanionParams {
  return { drug: "metformin", lang: "en", doctor: DEMO_DOCTOR.name };
}

/** Compress params into a short URL-safe token (short keys keep it small). */
export function encodeCompanionParams(p: CompanionParams): string {
  const payload: Record<string, unknown> = { d: p.drug, l: p.lang, dr: p.doctor };
  if (p.patient) payload.p = p.patient;
  if (p.notes && p.notes.length > 0) payload.n = p.notes;
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

/** Decode a compressed token; returns null on any invalid input. */
export function decodeCompanionParams(
  raw: string | null | undefined,
): CompanionParams | null {
  if (!raw) return null;
  try {
    const json = decompressFromEncodedURIComponent(raw);
    if (!json) return null;
    const obj = JSON.parse(json) as Record<string, unknown>;
    if (!obj || typeof obj !== "object") return null;
    const drug = obj.d;
    const lang = obj.l;
    const doctor = cleanText(obj.dr, 80);
    if (!isDrug(drug) || !isLanguageCode(lang) || !doctor) return null;
    const patient = cleanText(obj.p, 40);
    const notesRaw = obj.n;
    const notes =
      Array.isArray(notesRaw) &&
      notesRaw.every((n): n is string => typeof n === "string")
        ? (notesRaw as string[])
        : undefined;
    const result: CompanionParams = { drug, lang, doctor };
    if (patient) result.patient = patient;
    if (notes && notes.length > 0) result.notes = notes;
    return result;
  } catch {
    return null;
  }
}

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

/**
 * Read companion params from a page's searchParams.
 * Prefers `?c=<compressed>`; falls back to plain `drug`, `lang`, `doctor`, `name`; then defaults.
 */
export function parseCompanionSearchParams(
  sp: Record<string, string | string[] | undefined>,
): CompanionParams {
  const fromToken = decodeCompanionParams(first(sp.c));
  if (fromToken) return fromToken;

  const defaults = defaultCompanionParams();
  const drugRaw = first(sp.drug);
  const langRaw = first(sp.lang);
  const doctor = cleanText(first(sp.doctor), 80) ?? defaults.doctor;
  const patient = cleanText(first(sp.name) ?? first(sp.patient), 40);

  const drug: DrugId = isDrug(drugRaw) ? drugRaw : defaults.drug;
  const lang: LanguageCode = isLanguageCode(langRaw) ? langRaw : defaults.lang;

  return patient ? { drug, lang, doctor, patient } : { drug, lang, doctor };
}

export function buildCompanionPath(id: string, params: CompanionParams): string {
  return `${ROUTES.patient(id)}?c=${encodeCompanionParams(params)}`;
}

export function buildCompanionUrl(
  origin: string,
  id: string,
  params: CompanionParams,
): string {
  const base = origin.replace(/\/+$/, "");
  return `${base}${buildCompanionPath(id, params)}`;
}

/** Short random id. Call only inside handlers or route handlers (never during render). */
export function generateCompanionId(): string {
  return uuidv4().split("-")[0];
}
