import type {
  DrugOption,
  FeatureItem,
  Language,
  LanguageCode,
  StatItem,
} from "./types";

export const APP_NAME = "CuraVox";
export const TAGLINE = "Every patient deserves to understand their medication.";
export const POWERED_BY = "Powered by Impiricus";
export const EVENT = "VTHacks 14";

export const COLORS = {
  ink: "#2F3142",
  brand: "#F75E5E",
  brandDeep: "#E04747",
  gold: "#E04747",
  surface: "#FFFFFF",
  surface2: "#FBF8F1",
  line: "rgba(26,26,26,0.08)",
} as const;

export const LANGUAGES: Language[] = [
  { code: "es", label: "Spanish", nativeLabel: "Español", speechCode: "es-ES", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeLabel: "Français", speechCode: "fr-FR", flag: "🇫🇷" },
  { code: "en", label: "English", nativeLabel: "English", speechCode: "en-US", flag: "🇺🇸" },
];

export const LANGUAGE_MAP: Record<LanguageCode, Language> = {
  es: LANGUAGES[0],
  fr: LANGUAGES[1],
  en: LANGUAGES[2],
};

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  es: "Spanish",
  fr: "French",
  en: "English",
};

export function isLanguageCode(x: unknown): x is LanguageCode {
  return x === "es" || x === "fr" || x === "en";
}

export const DRUGS: DrugOption[] = [
  { id: "metformin", name: "Metformin", generic: "Metformin hydrochloride", available: true },
  { id: "atorvastatin", name: "Atorvastatin", generic: "Atorvastatin calcium", available: false },
  { id: "lisinopril", name: "Lisinopril", generic: "Lisinopril", available: false },
  { id: "semaglutide", name: "Semaglutide", generic: "Semaglutide", available: false },
];

export const DEMO_CREDENTIALS = {
  email: "demo@impiricus.com",
  password: "curavox2026",
} as const;

export const DEMO_DOCTOR = {
  name: "Dr. Martinez",
  fullName: "Dr. Elena Martinez",
  specialty: "Internal Medicine",
  clinic: "Blacksburg Family Health",
} as const;

export const PHYSICIAN_SESSION_KEY = "curavox.physician.session";

export const GEMINI_CHAT_MODEL = "gemini-2.5-flash";
export const MAX_HISTORY_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 2000;

export const ROUTES = {
  home: "/",
  physician: "/physician",
  dashboard: "/physician/dashboard",
  create: "/physician/create",
  patient: (id: string) => `/patient/${id}`,
  patientInfo: "/patient",
} as const;

export const GREETING_TRIGGER = "[[GREETING]]";

export const STATS: StatItem[] = [
  { value: 25, suffix: "M+", label: "LEP patients in the US" },
  { value: 67, suffix: "%", label: "of medication errors linked to language barriers" },
  { prefix: "1 in ", value: 5, label: "patients can't read their prescription label" },
];

export const FEATURES: FeatureItem[] = [
  {
    title: "Multilingual AI",
    description:
      "Every answer arrives in the patient's own language, whether they write in Spanish, French, or English.",
    icon: "globe",
  },
  {
    title: "Voice Support",
    description:
      "Patients can speak their questions and hear the answers read aloud, no reading or typing required.",
    icon: "mic",
  },
  {
    title: "Drug Safety Guardrails",
    description:
      "The companion only speaks from physician-approved drug information and redirects anything outside its scope.",
    icon: "shield",
  },
  {
    title: "Copay Assistance",
    description:
      "Savings programs and eligibility are explained in plain words so cost never blocks adherence.",
    icon: "wallet",
  },
  {
    title: "Zero Patient Friction",
    description:
      "Scan a QR code and start talking. No app store, no account, no password.",
    icon: "zap",
  },
  {
    title: "HIPAA-Conscious Design",
    description:
      "No patient records are stored. Companion links carry only a first name and the medication.",
    icon: "lock",
  },
];
