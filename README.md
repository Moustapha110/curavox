# CuraVox

A voice-first AI medication companion, built at VTHacks 14 as an extension of Impiricus.

A physician creates a companion in thirty seconds and hands the patient a QR code. The patient scans it, taps once, and talks to **Cora** in Spanish, French, or English. Cora answers out loud using only the approved drug information and the physician's own visit notes. When a question is outside the plan, she files it to the physician's inbox and delivers the doctor's reply back to the patient in their language.

## Run it

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY and DEEPGRAM_API_KEY
npm run dev:https            # HTTPS is required for the microphone on phones
```

Open `https://localhost:3000`. Physician demo login: `demo@impiricus.com` / `curavox2026`. For a phone on the same Wi-Fi, use the address printed as `Network:` and accept the local certificate once. `https://localhost:3000/api/origin` shows the address the QR codes use.

## Stack

Next.js 16, TypeScript, Tailwind v4, Google Gemini 2.5 Flash, Deepgram Nova-3 (speech to text) and Aura-2 (voice), lz-string for the QR payload. No database: the companion link carries the patient's first name, medication, language, physician, visit notes and contacts. Cora's actions (questions, appointment requests, urgent flags) go to an in-memory inbox shared by the dashboard and the patient page.

## Safety

Cora answers only from the physician's care plan, never changes doses or diagnoses, puts "call 911" first for serious symptoms, and always says she is an AI. Date of birth and the patient's phone stay on the physician's record and are never sent to the companion.
