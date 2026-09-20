export type LanguageCode = "es" | "fr" | "en";

export type DrugId = "metformin";

export interface Language {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  speechCode: "es-ES" | "fr-FR" | "en-US";
  flag: string;
}

export interface CompanionParams {
  drug: DrugId;
  lang: LanguageCode;
  doctor: string;
  patient?: string;
  notes?: string[];
}

export interface Companion extends CompanionParams {
  id: string;
  /** ISO 8601 timestamp */
  createdAt: string;
}

export type ChatRole = "user" | "assistant";

export interface ApiChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatMessageStatus = "streaming" | "done" | "error";

export interface ChatMessage extends ApiChatMessage {
  id: string;
  status?: ChatMessageStatus;
  createdAt: number;
}

export interface ChatRequestBody {
  messages: ApiChatMessage[];
  drug: DrugId;
  language: LanguageCode;
  doctorName: string;
  patientName?: string;
  knowledgeBase?: string[];
  companionId?: string;
}

export interface CreateCompanionRequest {
  drug: DrugId;
  language: LanguageCode;
  doctorName: string;
  patientName?: string;
}

export interface CreateCompanionResponse {
  id: string;
  url: string;
  qrData: string;
}

export interface ApiError {
  error: string;
}

export interface DrugDosing {
  standard: string;
  titration: string;
  maxDose: string;
  administration: string;
}

export interface DrugSideEffects {
  common: string[];
  serious: string[];
  whenToCallDoctor: string[];
}

export interface DrugInteractions {
  avoidOrUseWithCaution: string[];
  foodInteractions: string[];
}

export interface PatientAssistanceProgram {
  programName: string;
  description: string;
  eligibilityRequirements: string[];
  potentialSavings: string;
  howToApply: string;
}

export interface DrugData {
  id: DrugId;
  drugName: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  indication: string;
  dosing: DrugDosing;
  sideEffects: DrugSideEffects;
  interactions: DrugInteractions;
  contraindications: string[];
  storage: string;
  missedDose: string;
  patientAssistanceProgram: PatientAssistanceProgram;
  keyFacts: string[];
  /** Plain guidance for everyday over-the-counter medicines patients actually ask about. */
  everydayMedicines?: string[];
  /** What to do with the drug on days the patient is unwell. */
  sickDayRules?: string[];
}

export interface DrugOption {
  id: string;
  name: string;
  generic: string;
  available: boolean;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: "globe" | "mic" | "shield" | "wallet" | "zap" | "lock";
}

export interface StatItem {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
}
