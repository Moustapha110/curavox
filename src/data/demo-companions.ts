import type { Companion } from "@/lib/types";
import type { PatientRecord } from "@/lib/knowledge-base";
import { DEMO_DOCTOR } from "@/lib/constants";

export const DEMO_COMPANIONS: Companion[] = [
  {
    id: "a7f3c2e1",
    drug: "metformin",
    lang: "es",
    doctor: DEMO_DOCTOR.name,
    patient: "María",
    createdAt: "2026-09-18T14:32:00.000Z",
  },
  {
    id: "b91d4f08",
    drug: "metformin",
    lang: "fr",
    doctor: DEMO_DOCTOR.name,
    patient: "Amadou",
    createdAt: "2026-09-17T09:15:00.000Z",
  },
  {
    id: "c3e8a5b2",
    drug: "metformin",
    lang: "es",
    doctor: DEMO_DOCTOR.name,
    patient: "José",
    createdAt: "2026-09-16T16:48:00.000Z",
  },
  {
    id: "d6b2f9c4",
    drug: "metformin",
    lang: "en",
    doctor: DEMO_DOCTOR.name,
    patient: "Linda",
    createdAt: "2026-09-15T11:05:00.000Z",
  },
  {
    id: "e2a7d1f6",
    drug: "metformin",
    lang: "fr",
    doctor: DEMO_DOCTOR.name,
    patient: "Fatou",
    createdAt: "2026-09-12T13:22:00.000Z",
  },
  {
    id: "f8c4e3a9",
    drug: "metformin",
    lang: "es",
    doctor: DEMO_DOCTOR.name,
    createdAt: "2026-09-10T08:40:00.000Z",
  },
  {
    id: "0a5b9d7e",
    drug: "metformin",
    lang: "es",
    doctor: DEMO_DOCTOR.name,
    patient: "Carlos",
    createdAt: "2026-09-08T15:10:00.000Z",
  },
];

export const DASHBOARD_STATS = {
  companionsCreated: 128,
  activePatients: 94,
  languagesSupported: 3,
} as const;

/** Seed records for the demo patients (editable in the portal; edits are kept in the browser). */
export const DEMO_RECORDS: Record<string, Partial<PatientRecord>> = {
  a7f3c2e1: {
    dob: "1961-03-14",
    phone: "(540) 555-0142",
    lastVisit: "2026-09-18",
    lastVisitNotes:
      "New type 2 diabetes diagnosis, A1c 8.1. Started metformin 500 mg with dinner, increase to twice daily after 2 weeks if tolerated. Patient fasts during the day for religious reasons: take the evening dose with the evening meal. Mild kidney impairment (eGFR 58): no ibuprofen or naproxen, acetaminophen only. Follow-up in 3 months with repeat A1c.",
    clinicPhone: "(540) 555-0100",
    pharmacy: "CVS Pharmacy, South Main St, (540) 555-0177",
    emergencyContact: "Luis (son), (540) 555-0188",
  },
  d6b2f9c4: {
    dob: "1958-11-02",
    phone: "(540) 555-0121",
    lastVisit: "2026-09-15",
    lastVisitNotes:
      "Metformin restarted at 500 mg twice daily after stomach upset on the previous dose; take with breakfast and dinner. Patient reports occasional dizziness in the morning: check blood sugar before breakfast for two weeks and bring the log. Blood pressure well controlled. Follow-up in 6 weeks.",
    clinicPhone: "(540) 555-0100",
    pharmacy: "Kroger Pharmacy, University City Blvd, (540) 555-0133",
    emergencyContact: "Robert (husband), (540) 555-0190",
  },
  b91d4f08: {
    dob: "1974-06-21",
    phone: "(540) 555-0156",
    lastVisit: "2026-09-17",
    lastVisitNotes:
      "Started metformin 500 mg once daily with dinner. Works night shifts: take the dose with the main meal, whenever that falls. Counseled on alcohol; limit to occasional. Follow-up in 3 months.",
    clinicPhone: "(540) 555-0100",
    pharmacy: "Walgreens, North Main St, (540) 555-0165",
    emergencyContact: "Aissatou (wife), (540) 555-0199",
  },
  c3e8a5b2: {
    dob: "1966-01-09",
    phone: "(540) 555-0111",
    lastVisit: "2026-09-16",
    lastVisitNotes: "Metformin 1000 mg twice daily, stable. B12 slightly low: started daily B12 supplement. Follow-up in 6 months.",
    clinicPhone: "(540) 555-0100",
    pharmacy: "CVS Pharmacy, South Main St, (540) 555-0177",
    emergencyContact: "Ana (daughter), (540) 555-0170",
  },
  e2a7d1f6: {
    dob: "1980-08-30",
    phone: "(540) 555-0104",
    lastVisit: "2026-09-12",
    lastVisitNotes: "Metformin 500 mg with dinner, first month. Nausea in week one, improving. Continue and recheck in 4 weeks.",
    clinicPhone: "(540) 555-0100",
    pharmacy: "Walgreens, North Main St, (540) 555-0165",
    emergencyContact: "Moussa (brother), (540) 555-0180",
  },
  "0a5b9d7e": {
    dob: "1955-04-17",
    phone: "(540) 555-0129",
    lastVisit: "2026-09-08",
    lastVisitNotes: "Metformin 850 mg twice daily. Scheduled for a CT scan with contrast on Oct 2: hold metformin the day of the scan and for 48 hours after, then restart.",
    clinicPhone: "(540) 555-0100",
    pharmacy: "Kroger Pharmacy, University City Blvd, (540) 555-0133",
    emergencyContact: "Elena (wife), (540) 555-0195",
  },
};
