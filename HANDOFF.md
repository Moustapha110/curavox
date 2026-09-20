# CuraVox Handoff

Multilingual AI medication companion built at VTHacks 14 (Sep 18 to 20, 2026) for the Impiricus sponsor challenge. A physician creates a companion in four clicks, a patient scans a QR code, and an AI explains their Metformin prescription in Spanish, French, or English, by text or voice.

Repo: `/Users/moustaphaba/Desktop/curavox`
Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, GSAP + Lenis + Framer Motion, Google Gemini 2.5 Flash for chat, browser SpeechSynthesis for voice, react-qrcode-logo, lz-string.
Build status: `npm run build`, `npm run lint`, and `npx tsc --noEmit` all pass. Judge verdict: PASS. Zero console or hydration errors in the live browser test.

---

## 1. What was built

Every file created or modified, grouped by area.

### Foundation (src/lib, src/data, src/types)
- `src/lib/types.ts`: all shared TypeScript types (languages, companion params, chat messages, API bodies, drug data shape).
- `src/lib/constants.ts`: app name, tagline, colors, the three languages, the drug list (Metformin live, three "coming soon"), demo credentials, demo doctor, model names, routes, landing stats and features.
- `src/lib/companion.ts`: compresses companion params into a short URL token (lz-string) and decodes them back, with safe defaults for bad input; builds companion URLs; makes short random ids.
- `src/lib/system-prompt.ts`: builds the GPT-4o system prompt with the 8 safety rules, personality, and greeting instruction. Server only.
- `src/lib/gemini-errors.ts`: turns raw Gemini errors into short, safe messages (bad key, model not found, quota). Server only.
- `src/lib/i18n.ts`: every chat UI string in Spanish, French, and English, plus the offline fallback greeting and localized drug names.
- `src/lib/physician-session.ts`: tiny sessionStorage login state with subscribe/notify so the portal shell can react to sign in and sign out.
- `src/lib/speech.ts`: finds the browser SpeechRecognition constructor (Chrome, Safari, Edge).
- `src/lib/gsap.ts`: registers GSAP ScrollTrigger and useGSAP once; exports reduced-motion media queries.
- `src/data/metformin.ts`: complete patient-safe Metformin data (dosing, side effects, interactions, contraindications, storage, missed dose, savings program, key facts) and `getDrugContextString()` that flattens it into the prompt.
- `src/data/demo-companions.ts`: seven hardcoded companions for the dashboard table plus the three stat numbers.
- `src/types/speech.d.ts`: ambient typings for the Web Speech API (not in the default TypeScript DOM lib).

### Styles and layout (src/app)
- `src/app/globals.css`: Tailwind v4 theme tokens (ink #050505, brand #00D4AA, gold #F5B94A), keyframes, glass and 3D utilities, grid background, chat scroll styling, safe-area helpers.
- `src/app/layout.tsx`: root layout with Inter and Space Grotesk fonts, "CuraVox by Impiricus" metadata, dark color scheme, viewport settings.
- `src/app/icon.svg`: favicon (chat bubble with a heartbeat line, brand gradient).

### Landing page (src/app/page.tsx, src/components/landing, shared components)
- `src/app/page.tsx`: composes the landing sections inside the smooth scroll provider.
- `src/components/SmoothScroll.tsx`: Lenis smooth scroll synced to the GSAP ticker so scroll animations and scrolling share one clock.
- `src/components/Navbar.tsx`: fixed nav that turns to glass on scroll, with a thin brand progress bar.
- `src/components/landing/AmbientOrb.tsx`: one glowing orb fixed behind the page that travels through every section as you scroll.
- `src/components/landing/Hero.tsx`: "CuraVox" letters animate in with 3D perspective, tagline, Impiricus badge, two CTAs; pinned scroll-out.
- `src/components/landing/ProblemSection.tsx`: pinned section where the three stats fly in from depth with parallax ghost numbers.
- `src/components/landing/PhoneStage.tsx`: pinned stage that rotates a 3D phone into view, walks through the three "how it works" steps, then plays a Spanish chat on the phone screen as you scroll.
- `src/components/landing/ChatMockup.tsx`: the fake phone screen (prescription card, QR placeholder, Spanish conversation).
- `src/components/Phone3D.tsx`: pure CSS 3D phone frame (no images).
- `src/components/ScrollSection.tsx`: reusable wrapper that creates one scrubbed GSAP timeline per section and respects reduced motion.
- `src/components/landing/FeaturesGrid.tsx`: six glass cards that reveal on scroll.
- `src/components/GlassCard.tsx`: glassmorphism card that tilts in 3D toward the cursor with a moving glare.
- `src/components/landing/PhysicianCTA.tsx`: "Bridge the language gap today" with animated gradient, drifting blobs, and particles.
- `src/components/landing/ParticleField.tsx`: canvas particle drift (brand and gold), pauses off screen.
- `src/components/landing/Footer.tsx`: "Built at VTHacks 14 · Powered by Impiricus" plus trademark note.
- `src/components/ui/Logo.tsx`, `src/components/ui/ImpiricusBadge.tsx`, `src/components/ui/Button.tsx`: brand mark, "Powered by Impiricus" pill, animated button (link or button).

### Physician portal (src/app/physician, src/components/physician)
- `src/app/physician/page.tsx`: split login page with value points and Impiricus branding.
- `src/components/physician/LoginForm.tsx`: email + password form, "use demo account" shortcut, shake on wrong credentials, redirects to dashboard.
- `src/components/physician/PortalShell.tsx`: header, nav, sign out, and the auth guard that bounces to login if not signed in.
- `src/app/physician/dashboard/page.tsx`: "Welcome, Dr. Martinez", three stat cards, Create New Companion button, recent companions table.
- `src/components/physician/StatCard.tsx`: animated count-up stat card.
- `src/components/physician/CompanionTable.tsx`: table (desktop) and card list (mobile) of demo companions, each with a QR button.
- `src/components/physician/QRModal.tsx`: modal that shows a companion's QR code, link, and sharing steps.
- `src/app/physician/create/page.tsx`: page wrapper for the wizard.
- `src/components/physician/CreateCompanionWizard.tsx`: four steps (Medication, Language, Patient, Review), calls the API, then shows the QR code, link, copy, download, "Open patient view", and "Create another".
- `src/components/QRCodeDisplay.tsx`: QR code with the CuraVox logo in the center, copy link and download PNG actions.

### Patient chat (src/app/patient, src/components/chat, src/hooks)
- `src/app/patient/page.tsx`: "For patients" explainer with a demo companion button.
- `src/app/patient/[id]/page.tsx`: server page that reads the URL params, decodes the companion, and renders the chat.
- `src/components/chat/PatientChat.tsx`: the full chat: greeting on load, streaming replies, stop button, voice in, voice out, demo mode fallback, auto scroll.
- `src/components/chat/ChatHeader.tsx`: sticky header with drug name, prescribing doctor, language pill, Impiricus badge, disclaimer, and notice bar.
- `src/components/chat/ChatInput.tsx`: auto-growing text box, send button, stop button while streaming, microphone button.
- `src/components/ChatBubble.tsx`: patient (teal, right) and AI (dark, left) bubbles with a speaker button on AI messages.
- `src/components/VoiceButton.tsx`: microphone button with pulsing rings while listening.
- `src/components/LoadingDots.tsx`: typing indicator.
- `src/hooks/useSpeechRecognition.ts`: wraps the browser Web Speech API (speech to text) in the patient's language.
- `src/hooks/useTextToSpeech.ts`: reads replies aloud with the browser's built in SpeechSynthesis. Picks a voice for the patient's language, speaks sentence by sentence, no API or cost.

### API routes (src/app/api)
- `src/app/api/chat/route.ts`: POST. Validates input, builds the system prompt with the Metformin data, calls Gemini 2.5 Flash with streaming, returns plain text chunks. Returns a friendly error if the key is missing or invalid.
- `src/app/api/create-companion/route.ts`: POST. Validates input, makes a short id, compresses the params into a URL using the request origin, returns `{ id, url, qrData }`.

### Config and docs
- `package.json`: dependencies and scripts (see section 5).
- `.env.example`: the one variable, `GEMINI_API_KEY=`.
- `.env.local`: holds the real key (git ignored, never commit).
- `.gitignore`: ignores node_modules, .next, all .env files except .env.example.
- `README.md`: setup, routes, credentials.
- `PLAN.md`: the Planner's file-by-file plan and Next.js 16 notes.
- `CURAVOX_BUILD_PROMPT.md`: the original build brief.
- `AGENTS.md`, `CLAUDE.md`: managed by `next dev`, leave alone.
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`: default create-next-app config, unchanged.

---

## 2. Architecture in plain English

- **No database.** Nothing is stored on a server. Everything a companion needs (drug, language, doctor name, patient first name) is packed into the link itself.
- **lz-string URL state.** lz-string is a tiny compression library. The four companion values are turned into a short JSON string, compressed, and placed after `?c=` in the URL. When the patient opens the link, the server page decompresses it. If the token is missing or broken, the page falls back to plain `?drug=&lang=&doctor=&name=` params, then to a default English Metformin companion.
- **Server page, client chat.** `/patient/[id]/page.tsx` runs on the server, reads the URL, and passes plain props to `PatientChat`, which runs in the browser.
- **Streaming chat.** The browser POSTs the conversation to `/api/chat`. The route builds a system prompt from the Metformin data plus the eight safety rules, asks Gemini 2.5 Flash for a streamed answer, and pipes each text chunk straight back. The browser appends chunks as they arrive, so the reply "types" itself. A stop button aborts the request and stops reading from Gemini.
- **Greeting.** On first load the browser sends an empty history. The route inserts a hidden `[[GREETING]]` trigger so the AI introduces itself in the patient's language. If the API fails, the app shows a pre-written greeting in that language and a "demo mode" notice.
- **Voice in (free, in the browser).** The microphone button uses the browser's Web Speech API (speech to text) set to es-ES, fr-FR, or en-US. When the sentence is final it is sent automatically. Works in Chrome, Edge, and Safari. The button hides itself if the browser does not support it.
- **Voice out (browser).** The speaker button on any AI message uses the browser's built in SpeechSynthesis in the patient's language. No server call, no cost. Works in Chrome, Safari, and Edge.
- **Physician login.** Hardcoded demo credentials checked in the browser. Success writes a flag to sessionStorage (cleared when the tab closes). The portal shell reads that flag and redirects to login if missing.
- **QR codes.** react-qrcode-logo draws the companion URL as a QR code with the CuraVox mark in the center. The dashboard builds URLs from `window.location.origin`; the wizard gets its URL from the API, which uses the request origin. Either way the QR points at whatever domain the app is running on.
- **Landing page motion.** Lenis smooths the scroll. GSAP ScrollTrigger ties every animation to scroll position (scrub), so scrolling backward reverses it. Sections pin in place while their timelines play, which makes the page feel like one continuous motion. Framer Motion handles hover tilt, page transitions, and count-ups. Everything respects the OS reduced-motion setting.

---

## 3. The full user flow

### Demo credentials
- Email: `demo@impiricus.com`
- Password: `curavox2026`
- The login form has a "use demo account" button that fills these in.

### Physician side
1. Open `/` (landing). Click "I'm a Physician" or go to `/physician`.
2. Sign in with the demo credentials. You land on `/physician/dashboard` as Dr. Martinez.
3. The dashboard shows stat cards, a "Create New Companion" button, and a table of seven demo companions. Any "QR code" button opens a modal with that companion's QR and link.
4. Click "Create New Companion" (`/physician/create`).
   - Step 1 Medication: pick Metformin (three others show "Coming soon").
   - Step 2 Language: Spanish, French, or English.
   - Step 3 Patient: optional first name (example: María).
   - Step 4 Review: confirm and click Generate.
5. The result screen shows a large QR code, the companion link, Copy, Download PNG, "Open patient view", "Create another", and sharing instructions.

### Patient side
6. The patient scans the QR with their phone camera (no app, no account). The link opens `/patient/<id>?c=<token>`.
7. CuraVox greets them by name in their language, names the medication, and says Dr. Martinez prescribed it.
8. They type or tap the microphone and speak. Answers stream in, 2 to 4 sentences, in their language only.
9. They tap the speaker icon on any answer to hear it read aloud.
10. Out-of-scope questions are politely refused and redirected to Dr. Martinez. Serious symptoms trigger a "call 911 first" response.

### Example URLs (local dev at http://localhost:3000)
- Landing: `http://localhost:3000/`
- Physician login: `http://localhost:3000/physician`
- Dashboard: `http://localhost:3000/physician/dashboard`
- Create wizard: `http://localhost:3000/physician/create`
- Patient explainer: `http://localhost:3000/patient`
- Spanish companion for María (compressed form, same as the QR codes produce):
  `http://localhost:3000/patient/a7f3c2e1?c=N4IgJiBcILYKYBcBmB7ATjAlgOxAGhABsoQ4BnfcNEgETQDoACAWQEM0Ec4AvSgBxJs0AW9YgAvkA`
- French companion for Amadou:
  `http://localhost:3000/patient/b91d4f08?c=N4IgJiBcILYKYBcBmB7ATjAlgOxAGhABsoQk19xzoARNAOgAIBZAQzQRzgC8KAHEgIIwWYFAFcQAXyA`
- Plain param form (also works, handy for typing by hand):
  `http://localhost:3000/patient/demo?drug=metformin&lang=es&doctor=Dr.+Martinez&name=Mar%C3%ADa`
  `http://localhost:3000/patient/demo?drug=metformin&lang=fr&doctor=Dr.+Martinez`
  `http://localhost:3000/patient/demo?drug=metformin&lang=en&doctor=Dr.+Martinez&name=Linda`

---

## 4. What needs the Gemini key

- Needs the key: `/api/chat` (live Gemini answers). Voice playback is free and needs nothing.
- Does not need the key: landing page, physician login, dashboard, QR modal, create wizard, `/api/create-companion`, the patient chat shell, the voice-in microphone (browser only).

### Current situation
- `.env.local` has an empty `GEMINI_API_KEY`. Paste a key from https://aistudio.google.com/apikey (free tier is enough for a demo).
- Until then `/api/chat` returns HTTP 503 and the chat shows the demo mode greeting.
- The chat still opens and shows the pre-written greeting in the right language. Typed questions show that error text in the bubble. The speaker button shows "Audio unavailable".

### The fix (about 3 minutes)
1. Create a key at https://aistudio.google.com/apikey and paste it after `GEMINI_API_KEY=` in `.env.local`.
2. Make sure the key in `.env.local` belongs to that same organization or project.
3. Restart the dev server: stop `npm run dev` (Ctrl+C) and run it again. Next.js reads `.env.local` at startup.
4. Open a companion link and ask one question. If the reply streams, you are live. Tap the speaker to hear it read aloud.

If you swap keys instead, edit `.env.local`, then restart the dev server the same way. Never paste the key into any file that gets committed.

---

## 5. How to run

```bash
cd /Users/moustaphaba/Desktop/curavox
npm install                  # install packages (already done once)
cp .env.example .env.local   # only if .env.local does not exist; then paste the Gemini key
npm run dev                  # development server at http://localhost:3000
npm run build                # production build (must pass before deploy)
npm start                    # serve the production build at http://localhost:3000
npm run lint                 # ESLint check
```

- Node 20 or newer.
- For the demo, `npm run build` then `npm start` gives the smoothest landing page animations (no dev overlays, no hot reload).
- Voice input needs HTTPS or localhost. Localhost is fine on the demo laptop. A phone on the same Wi-Fi hitting `http://<laptop-ip>:3000` will get chat but not the microphone; deploy to Vercel for phone voice.

---

## 6. Demo script (3 to 4 minutes)

Before you start: production build running (`npm start`), Gemini key in place, one browser window at `/` and a second tab already logged in at `/physician/dashboard`. Phone unlocked with the camera app ready. Sound on.

### 0:00 to 0:30, the hook (landing page)
- Show `/`. Scroll slowly through the hero and the stats.
- Say: "Impiricus already connects pharma with physicians. CuraVox extends that relationship one step further, to the moment after the prescription, when 25 million patients in the US with limited English cannot understand their medication."
- Keep scrolling into the phone stage while you talk. Let the Spanish chat play on the 3D phone.
- Talking point (Innovation, Practical Impact): "This is not a chatbot. It is a physician-created, drug-specific companion. Pharma brand teams get patient education at the point of care, in the patient's language, delivered through the physician they already reach on Impiricus."

### 0:30 to 1:15, the physician flow
- Switch to the dashboard tab. Say: "Dr. Martinez just prescribed Metformin to María, who speaks Spanish."
- Click Create New Companion. Pick Metformin, Spanish, type María, Generate.
- Talking point (UX): "Four clicks, under twenty seconds, inside the workflow. No new app for the physician, no account for the patient."
- Point at the QR code. Say: "She scans this at checkout or it goes on her after-visit summary."

### 1:15 to 2:45, the patient flow (the core)
- Scan the QR with the phone if the app is deployed, otherwise click "Open patient view" on the laptop.
- Show the greeting arriving in Spanish, by name.
- Ask these three Spanish questions (type or use the mic):
  1. `¿Cómo debo tomar la metformina?` (how to take it; expect: with meals, swallow XR whole)
  2. `¿Qué hago si olvido una dosis?` (missed dose; expect: take when remembered, never double)
  3. `¿Hay algún programa para pagar menos?` (savings program; expect: the Metformin Savings & Support Program and how to apply)
- Tap the speaker on one reply so the room hears Spanish audio.
- Tap the mic and speak one of the questions to show voice in.
- Talking point (Technical Complexity): "Streaming Gemini 2.5 Flash, grounded only in physician-approved drug data. Browser speech recognition in, browser speech synthesis out, so voice costs nothing. Companion state lives compressed inside the URL, so there is no patient database to breach."
- Now the guardrail. Ask the out-of-scope question:
  `¿Puedo dejar de tomar mi medicina para la presión?` (can I stop my blood pressure medicine)
  Expect a polite refusal that redirects to Dr. Martinez.
- Talking point (Practical Impact, safety): "It will not diagnose, will not change doses, and will not talk about other drugs. Serious symptoms get a call-911-first answer. That is what makes it something a pharma company and a physician can actually put their name on."

### 2:45 to 3:30, the Impiricus fit and close
- Flip back to the landing features grid or the dashboard.
- Map to the challenge in one breath: "The Impiricus challenge asks how pharma can better engage healthcare professionals. CuraVox gives physicians a reason to open Impiricus after the prescription is written, gives pharma a compliant patient-education and copay-assistance channel, and gives the patient understanding in their own language. Everyone in the chain wins."
- Judging criteria in one line each:
  - Innovation: patient-facing extension of an HCP platform, drug-specific and language-specific companions generated on demand.
  - Technical Complexity: streaming LLM, prompt guardrails, voice in and out, URL-encoded state, scroll-driven 3D landing page.
  - UX: zero-friction patient side (scan, talk), four-click physician side, mobile first.
  - Practical Impact: health equity for LEP patients, adherence, and copay awareness for a drug taken by hundreds of millions of people.
  - Presentation: the landing page you saw first.
- Close: "Today it is Metformin. The data file is the only thing that changes to add the next drug."

### Fallback if the Gemini key is missing or fails
- The app does not crash. The chat opens, greets in the patient's language, and shows a gold "Live AI unavailable. Demo mode." bar.
- Do the physician flow exactly as scripted (it is fully live without the key).
- On the patient side: open the companion, show the localized greeting, the header, the language pill, the mic button, and the input. Say: "The live model is paused on this account right now; here is what the exchange looks like." Then scroll the landing page phone stage, which plays a real scripted Spanish conversation.
- Have the three Spanish answers ready in your own words: take it with meals and swallow XR tablets whole; if you miss a dose take it when you remember but never double up; the savings program can cover the copay and the clinic gives you the card.
- If a key is added mid-event, restart the server and the chat is live immediately.

---

## 7. Known limitations and nice-to-haves

### Known limitations (accepted for the demo)
- Only Metformin has drug data. The other three drugs in the picker are disabled "coming soon" entries.
- Physician auth is a hardcoded demo account stored in sessionStorage. Not real authentication.
- The doctor name from the URL is placed into the system prompt as-is. A crafted link could try to inject instructions. Fine for a demo, would need sanitizing or a server-side lookup in production.
- Any `/patient/<id>` with missing or garbage params renders a default English Metformin companion instead of a 404.
- Dashboard stats and the companions table are hardcoded demo data. Companions created in the wizard do not appear in the table.
- Pinch zoom is disabled on the chat page (`maximumScale: 1`) to keep the iOS layout stable. This hurts accessibility for low-vision users.
- Voice input depends on the browser Web Speech API. It works in Chrome, Edge, and Safari, not Firefox. It also needs HTTPS (or localhost).
- Voice playback depends on the voices installed in the viewer's browser and operating system. Chrome and macOS ship Spanish and French voices; quality varies by device.
- Chat history is in memory only. Refreshing the page starts over.
- The last 12 messages are sent to the model, so very long conversations lose early context.
- No rate limiting on the chat route. Anyone with the deployed URL can use your Gemini quota.
- The landing page is heavy on scroll animation. On very old phones it can stutter. Reduced motion users get a static version.

### Nice-to-haves (if there is time after the demo)
- Add a second drug data file (for example Atorvastatin) to prove the "only the data file changes" claim live.
- Persist created companions in the dashboard table (localStorage is enough for the demo).
- Return a real 404 for unknown companion ids and invalid tokens.
- Escape or allowlist the doctor name before it enters the prompt.
- Language auto-detect on the first patient message, with the physician's choice as default.
- A "read every reply aloud" toggle for low-literacy patients.
- Simple rate limit on `/api/chat` (per IP, per minute) before sharing the URL widely.
- A physician-facing "conversation summary" so the doctor sees what the patient asked (would need storage and consent).
- Companion expiry date baked into the token.
- PWA install banner on the patient page.

---

## 8. Deployment readiness

- Confirmed: `npm run build` exits 0 with the full route table (`/`, `/patient`, `/patient/[id]`, `/physician`, `/physician/create`, `/physician/dashboard`, `/api/chat`, `/api/create-companion`, `/icon.svg`, `/_not-found`). Lint and type check also pass.
- Framework: Next.js 16, App Router. Vercel detects it automatically. No custom `next.config.ts` options needed.

### Vercel steps
1. Push the repo to GitHub (do not commit `.env.local`; it is git ignored).
2. In Vercel: New Project, import the repo, framework preset "Next.js", leave build settings at defaults.
3. Environment Variables: add `GEMINI_API_KEY` with the key value, for Production (and Preview if you want preview links to chat). This is the only variable.
4. Deploy. Wait for the build to finish and open the `.vercel.app` URL.
5. Optional: add a custom domain in the Vercel project settings.

### The one thing to double-check after deploy
- Companion URLs use the request origin. The wizard's `/api/create-companion` reads the `Origin` header (falling back to the request URL) and the dashboard uses `window.location.origin`. So QR codes automatically point at the deployed domain with no config change. After deploying, create one companion and confirm the link in the result screen starts with your Vercel domain, then scan it with a phone once. If you later add a custom domain, QR codes switch to it automatically as well.

### Other notes for production day
- Voice input on phones works only over HTTPS, which Vercel provides by default.
- `maxDuration = 60` is set on the chat route, within the Vercel Hobby limit.
- Keep an eye on Gemini usage during the event; there is no rate limit in the app.
