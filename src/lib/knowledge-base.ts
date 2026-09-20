import { DEMO_RECORDS } from "@/data/demo-companions";

const STORAGE_KEY = "curavox.kb";

/** What the physician keeps on file for a patient. DOB and the patient's own phone stay here and are never sent to the companion. */
export interface PatientRecord {
  dob: string;            // YYYY-MM-DD
  phone: string;          // patient's phone (physician-side only)
  lastVisit: string;      // YYYY-MM-DD
  lastVisitNotes: string; // visit summary / plan, written by the physician
  clinicPhone: string;
  pharmacy: string;       // name + phone
  emergencyContact: string; // name + relationship + phone
}

export interface KnowledgeBase {
  notes: string[];
  record: PatientRecord;
}

export const EMPTY_RECORD: PatientRecord = {
  dob: "",
  phone: "",
  lastVisit: "",
  lastVisitNotes: "",
  clinicPhone: "",
  pharmacy: "",
  emergencyContact: "",
};

function seedFor(companionId: string): KnowledgeBase {
  return { notes: [], record: { ...EMPTY_RECORD, ...(DEMO_RECORDS[companionId] ?? {}) } };
}

export function getKB(companionId: string): KnowledgeBase {
  const seed = seedFor(companionId);
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}.${companionId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<KnowledgeBase>;
      return {
        notes: Array.isArray(parsed.notes) ? parsed.notes : [],
        record: { ...seed.record, ...(parsed.record ?? {}) },
      };
    }
  } catch {}
  return seed;
}

export function saveKB(companionId: string, kb: KnowledgeBase): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}.${companionId}`, JSON.stringify(kb));
  } catch {}
}

export function addNote(companionId: string, note: string): KnowledgeBase {
  const kb = getKB(companionId);
  kb.notes.push(note.trim());
  saveKB(companionId, kb);
  return kb;
}

export function removeNote(companionId: string, index: number): KnowledgeBase {
  const kb = getKB(companionId);
  kb.notes.splice(index, 1);
  saveKB(companionId, kb);
  return kb;
}

export function saveRecord(companionId: string, record: PatientRecord): KnowledgeBase {
  const kb = getKB(companionId);
  kb.record = record;
  saveKB(companionId, kb);
  return kb;
}

function prettyDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/**
 * What the companion receives: last visit, visit notes, contacts, then the free-form notes.
 * Deliberately excludes date of birth and the patient's own phone number.
 */
export function companionNotesFrom(kb: KnowledgeBase): string[] {
  const r = kb.record;
  const lines: string[] = [];
  if (r.lastVisit) lines.push(`Last visit with the doctor: ${prettyDate(r.lastVisit)}.`);
  if (r.lastVisitNotes.trim()) lines.push(`Doctor's notes from the last visit: ${r.lastVisitNotes.trim()}`);
  if (r.clinicPhone.trim()) lines.push(`Clinic phone number (give this when the patient should call the office): ${r.clinicPhone.trim()}`);
  if (r.pharmacy.trim()) lines.push(`Patient's pharmacy: ${r.pharmacy.trim()}`);
  if (r.emergencyContact.trim()) lines.push(`Emergency contact on file: ${r.emergencyContact.trim()}`);
  return [...lines, ...kb.notes].slice(0, 20);
}
