import type { DrugData, DrugId } from "@/lib/types";

export const metformin: DrugData = {
  id: "metformin",
  drugName: "Metformin",
  genericName: "Metformin hydrochloride",
  brandNames: ["Glucophage", "Glucophage XR", "Fortamet", "Glumetza", "Riomet (liquid)"],
  drugClass: "Biguanide (oral antidiabetic medication)",
  indication:
    "Type 2 diabetes mellitus, to improve blood sugar (glucose) control in adults and children 10 years and older, together with diet and exercise. It is often the first medication prescribed for type 2 diabetes. It is sometimes also used for prediabetes or polycystic ovary syndrome (PCOS) when a doctor decides it is appropriate.",
  dosing: {
    standard:
      "Immediate-release tablets: usually started at 500 mg once or twice daily with meals, or 850 mg once daily with a meal. Extended-release tablets (XR/ER): usually started at 500 mg once daily with the evening meal. The exact dose is decided by the prescribing doctor.",
    titration:
      "The dose is usually increased slowly, by 500 mg every 1 to 2 weeks (or 850 mg every 2 weeks), based on blood sugar results and how well the stomach tolerates it. Slow increases help reduce nausea and diarrhea. Only the doctor should change the dose.",
    maxDose:
      "Immediate-release: 2,550 mg per day in divided doses (adults). Extended-release: 2,000 mg per day (some brands up to 2,500 mg). Never take more than the doctor prescribed.",
    administration:
      "Take with meals (with food) to reduce stomach upset. Swallow extended-release tablets whole; do not crush, chew, or split them. A soft shell of an extended-release tablet may appear in the stool; this is normal and the medicine has been absorbed. Take at the same time(s) each day. Drink plenty of water. Continue taking it even when feeling well, because diabetes usually has no symptoms.",
  },
  sideEffects: {
    common: [
      "Nausea or upset stomach",
      "Diarrhea or loose stools",
      "Stomach pain, gas, or bloating",
      "Loss of appetite",
      "A metallic taste in the mouth",
      "Mild weight loss",
      "These are most common in the first few weeks and usually improve with time, especially when the medicine is taken with food",
    ],
    serious: [
      "Lactic acidosis (rare but serious): unusual muscle pain, trouble breathing, unusual sleepiness, severe stomach pain, feeling very cold, dizziness, slow or irregular heartbeat, or feeling very weak and tired",
      "Low blood sugar (hypoglycemia), mostly when combined with other diabetes medicines or when skipping meals: shakiness, sweating, fast heartbeat, confusion, dizziness, or hunger",
      "Vitamin B12 deficiency with long-term use: numbness or tingling in the hands or feet, unusual tiredness, or memory problems",
      "Severe allergic reaction: rash, hives, swelling of the face, lips, tongue, or throat, or trouble breathing",
    ],
    whenToCallDoctor: [
      "Call 911 or go to the emergency room right away for signs of lactic acidosis (severe muscle pain, trouble breathing, severe stomach pain, very slow heartbeat, extreme drowsiness) or a severe allergic reaction (swelling of the face or throat, trouble breathing)",
      "Call the doctor the same day if there is vomiting or diarrhea that does not stop, if the patient cannot eat or drink, or if signs of low blood sugar happen often",
      "Call the doctor if stomach side effects last longer than 2 to 3 weeks or make it hard to keep taking the medicine",
      "Tell the doctor before any surgery, X-ray or CT scan with contrast dye, or if there is a serious infection, dehydration, or kidney problem",
      "Tell the doctor about numbness or tingling in the hands or feet, which may need a vitamin B12 blood test",
    ],
  },
  interactions: {
    avoidOrUseWithCaution: [
      "Iodinated contrast dye used in some CT scans and X-rays: metformin is often paused before and for 48 hours after the scan. Always tell the imaging staff about metformin.",
      "Other diabetes medicines (insulin, sulfonylureas such as glipizide or glyburide): may increase the chance of low blood sugar",
      "Carbonic anhydrase inhibitors (topiramate, acetazolamide, zonisamide): may increase the risk of lactic acidosis",
      "Medicines that affect the kidneys or metformin levels (cimetidine, ranolazine, dolutegravir, vandetanib): the doctor may adjust the dose",
      "Diuretics (water pills) and blood pressure medicines: may affect kidney function and blood sugar",
      "Corticosteroids (like prednisone), some antipsychotics, and certain hormones: can raise blood sugar and may reduce the effect of metformin",
      "Always tell the doctor and pharmacist about every prescription, over-the-counter medicine, vitamin, and herbal product being taken",
    ],
    foodInteractions: [
      "Alcohol: avoid heavy or binge drinking. Alcohol increases the risk of lactic acidosis and low blood sugar. Ask the doctor about occasional light drinking.",
      "Food: taking metformin with meals reduces stomach upset. Skipping meals can raise the risk of low blood sugar when other diabetes medicines are also used.",
      "High-fiber foods and some supplements may slightly reduce absorption; keep eating habits consistent from day to day.",
      "Metformin does not require a special diet, but it works best with the healthy eating plan the doctor or dietitian recommended.",
    ],
  },
  contraindications: [
    "Severe kidney disease or very reduced kidney function (eGFR below 30 mL/min/1.73 m²)",
    "Metabolic acidosis, including diabetic ketoacidosis (needs insulin treatment instead)",
    "Known allergy to metformin or any ingredient in the tablet",
    "Use with caution and doctor supervision in liver disease, heart failure, heavy alcohol use, dehydration, serious infection, and in adults over 65 or 80",
    "Temporarily stopped around iodinated contrast imaging and major surgery",
  ],
  storage:
    "Store at room temperature, 68 to 77°F (20 to 25°C), in a dry place away from moisture, heat, and direct light. Do not store in the bathroom. Keep the bottle tightly closed and out of the reach of children and pets. Do not use after the expiration date. Liquid metformin may have different storage instructions; check the label.",
  missedDose:
    "If a dose is missed, take it as soon as it is remembered, with food. If it is almost time for the next dose, skip the missed dose and go back to the regular schedule. Never take two doses at once to make up for a missed one.",
  patientAssistanceProgram: {
    programName: "Metformin Savings & Support Program",
    description:
      "A demonstration savings program that helps eligible patients lower the cost of their metformin prescription and get free pharmacist support. Generic metformin is already inexpensive at most pharmacies, and many pharmacies offer a low-cost generic list.",
    eligibilityRequirements: [
      "Has a valid prescription for metformin from a licensed prescriber",
      "Is a resident of the United States",
      "Has commercial insurance with a copay, or has no prescription insurance",
      "Is not enrolled in Medicare, Medicaid, or another government-funded program (demo rule)",
    ],
    potentialSavings:
      "Up to 100% of the copay for eligible commercially insured patients, or a discounted cash price for uninsured patients. Many pharmacies already sell generic metformin for about $4 to $10 per month.",
    howToApply:
      "Ask the doctor's office or pharmacist for the savings card, or scan the program QR code at the clinic. Bring the card and the prescription to the pharmacy. The patient should ask Dr. Martinez's office if they have any questions about eligibility.",
  },
  everydayMedicines: [
    "Acetaminophen (Tylenol, paracetamol) for pain or fever: fine to take with metformin. Follow the package dose.",
    "Ibuprofen (Advil, Motrin), naproxen (Aleve), or aspirin at pain doses: an occasional dose is generally fine when the kidneys are healthy. Avoid taking them every day for more than 2 or 3 days without checking with the doctor, and avoid them entirely while vomiting, having diarrhea, or dehydrated, because together with metformin they can strain the kidneys.",
    "Cold and flu products: ones based on acetaminophen are fine. Decongestants (pseudoephedrine, phenylephrine) can raise blood sugar and blood pressure a little; short-term use is usually okay, check blood sugar a bit more often. Prefer sugar-free cough syrups and lozenges.",
    "Antihistamines for allergies (loratadine, cetirizine, fexofenadine, diphenhydramine): no known interaction with metformin.",
    "Antacids and heartburn medicines (Tums, Maalox, famotidine/Pepcid, omeprazole): fine with metformin. The one exception is cimetidine (Tagamet), which raises metformin levels; choose famotidine instead.",
    "Antibiotics: most are fine with metformin. Some can push blood sugar up or down, so check sugar more often during the course and keep taking metformin with food.",
    "Vitamins and supplements: a daily multivitamin is fine. Long-term metformin can lower vitamin B12, so the doctor may check B12 levels from time to time.",
    "Anything not on this list, or any new prescription medicine: the pharmacist can check it against metformin in a minute, and the doctor should know about it at the next visit.",
  ],
  sickDayRules: [
    "A mild cold or sore throat while eating and drinking normally: keep taking metformin as usual, with food.",
    "Vomiting, diarrhea, a high fever, or not being able to eat or keep fluids down: pause metformin until eating and drinking normally again for about 24 hours. Dehydration plus metformin raises the risk of lactic acidosis. Drink fluids, check blood sugar more often, and tell the doctor's office the same day.",
    "When feeling better, restart the normal dose. Never take extra doses to make up for the pause.",
    "Call the doctor or go to urgent care if vomiting lasts more than a day, if unable to keep any fluids down, or if blood sugar stays very high or very low.",
  ],
  keyFacts: [
    "Metformin lowers blood sugar mainly by reducing the sugar the liver makes and by helping the body respond better to insulin. It does not cause the pancreas to release extra insulin, so it rarely causes low blood sugar when taken alone.",
    "It usually takes 1 to 2 weeks to start working and several weeks to see the full effect on blood sugar.",
    "Take it with meals to reduce stomach upset; this is the most important tip for new patients.",
    "Stomach side effects (nausea, diarrhea) are common at the start and usually fade within a few weeks.",
    "Swallow extended-release tablets whole; a tablet shell in the stool is normal.",
    "Avoid heavy alcohol use while taking metformin.",
    "Tell every doctor, dentist, and imaging center that metformin is being taken, especially before CT scans with contrast dye or surgery.",
    "The doctor will check kidney function with a blood test regularly, and may check vitamin B12 levels with long-term use.",
    "Metformin works best together with healthy eating, regular physical activity, and checking blood sugar as the doctor recommends.",
    "Do not stop taking metformin without talking to the doctor, even when feeling well.",
  ],
};

export const DRUG_DATA: Record<DrugId, DrugData> = { metformin };

export function getDrug(id: string): DrugData {
  if (id in DRUG_DATA) return DRUG_DATA[id as DrugId];
  return metformin;
}

export function isDrugId(id: unknown): id is DrugId {
  return typeof id === "string" && id in DRUG_DATA;
}

function bullets(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function getDrugContextString(drug: DrugData = metformin): string {
  const lines: string[] = [];

  lines.push(`DRUG NAME: ${drug.drugName}`);
  lines.push(`GENERIC NAME: ${drug.genericName}`);
  lines.push(`BRAND NAMES: ${drug.brandNames.join(", ")}`);
  lines.push(`DRUG CLASS: ${drug.drugClass}`);
  lines.push("");
  lines.push("INDICATION (WHAT IT IS FOR):");
  lines.push(drug.indication);
  lines.push("");
  lines.push("DOSING:");
  lines.push(`STANDARD DOSE: ${drug.dosing.standard}`);
  lines.push(`TITRATION (HOW THE DOSE IS INCREASED): ${drug.dosing.titration}`);
  lines.push(`MAXIMUM DOSE: ${drug.dosing.maxDose}`);
  lines.push(`HOW TO TAKE IT: ${drug.dosing.administration}`);
  lines.push("");
  lines.push("MISSED DOSE:");
  lines.push(drug.missedDose);
  lines.push("");
  lines.push("COMMON SIDE EFFECTS:");
  lines.push(bullets(drug.sideEffects.common));
  lines.push("");
  lines.push("SERIOUS SIDE EFFECTS:");
  lines.push(bullets(drug.sideEffects.serious));
  lines.push("");
  lines.push("WHEN TO CALL THE DOCTOR OR 911:");
  lines.push(bullets(drug.sideEffects.whenToCallDoctor));
  lines.push("");
  lines.push("DRUG INTERACTIONS (AVOID OR USE WITH CAUTION):");
  lines.push(bullets(drug.interactions.avoidOrUseWithCaution));
  lines.push("");
  lines.push("FOOD AND ALCOHOL INTERACTIONS:");
  lines.push(bullets(drug.interactions.foodInteractions));
  lines.push("");
  lines.push("CONTRAINDICATIONS (WHO SHOULD NOT TAKE IT):");
  lines.push(bullets(drug.contraindications));
  lines.push("");
  lines.push("STORAGE:");
  lines.push(drug.storage);
  lines.push("");
  lines.push("PATIENT ASSISTANCE / SAVINGS PROGRAM:");
  lines.push(`PROGRAM NAME: ${drug.patientAssistanceProgram.programName}`);
  lines.push(`DESCRIPTION: ${drug.patientAssistanceProgram.description}`);
  lines.push("ELIGIBILITY REQUIREMENTS:");
  lines.push(bullets(drug.patientAssistanceProgram.eligibilityRequirements));
  lines.push(`POTENTIAL SAVINGS: ${drug.patientAssistanceProgram.potentialSavings}`);
  lines.push(`HOW TO APPLY: ${drug.patientAssistanceProgram.howToApply}`);
  lines.push("");
  if (drug.everydayMedicines?.length) {
    lines.push("EVERYDAY MEDICINES AND THIS DRUG (answer these directly; the doctor's notes override anything here):");
    lines.push(bullets(drug.everydayMedicines));
    lines.push("");
  }
  if (drug.sickDayRules?.length) {
    lines.push("SICK DAY RULES (what to do with this drug when unwell):");
    lines.push(bullets(drug.sickDayRules));
    lines.push("");
  }
  lines.push("KEY FACTS:");
  lines.push(bullets(drug.keyFacts));

  return lines.join("\n");
}
