# CuraVox Full Build Prompt — Multi-Agent Orchestration

## CONTEXT

You are building **CuraVox**, a multilingual AI patient medication companion for the **VTHacks 14 hackathon** (Sep 18–20, 2026). This is targeting the **Impiricus sponsor prize ($3,000 first place)**.

**What Impiricus does:** Impiricus is an HCP (Healthcare Professional) engagement platform. They help pharmaceutical companies connect with physicians through personalized digital content. Their challenge asks hackers to "build a tool or feature that enhances how pharmaceutical companies engage with healthcare professionals."

**CuraVox's angle:** CuraVox extends Impiricus's platform to solve a real gap — after the physician prescribes a medication, Limited English Proficiency (LEP) patients often can't understand their medication instructions. CuraVox is an Impiricus feature that lets physicians instantly create a persistent, conversational AI companion that explains the prescribed medication to the patient in their native language. This is NOT a standalone product — it's framed as an Impiricus platform extension.

**The hackathon demo drug is Metformin** (most commonly prescribed diabetes medication worldwide, clear health equity angle).

---

## YOUR OPERATING MODEL — FOUR AGENTS

You MUST organize your work using four specialized agents that run in sequence. Spawn them using the Agent tool. Here is exactly how they work:

### Agent 1: THE PLANNER
**Role:** Software architect. Reads the entire existing codebase, understands what's already built, and produces a detailed implementation plan for what remains.

**The Planner must:**
- Read every file in the project's `src/` directory to understand what exists
- Read `package.json` to understand installed dependencies
- Read the Next.js docs at `node_modules/next/dist/docs/01-app/01-getting-started/` — especially `05-server-and-client-components.md`, `15-route-handlers.md`, and `03-layouts-and-pages.md` — to write correct Next.js App Router code
- Produce a file-by-file implementation plan with exact paths, what each file does, and key implementation details
- Identify dependencies between files (what must be built first)
- Flag any risks or decisions needed

### Agent 2: THE BUILDER
**Role:** Full-stack engineer. Takes the Planner's output and builds every file, top to bottom, no shortcuts.

**The Builder must build ALL of the following:**

#### A. Project Scaffolding
- Initialize a Next.js 16 app with TypeScript, Tailwind CSS v4, App Router, src directory if not already done
- Install all dependencies: openai, qrcode, react-qrcode-logo, lz-string, uuid, @types/uuid, @types/lz-string, gsap, @gsap/react, framer-motion, lenis

#### B. Drug Data & System Prompt
- `src/data/metformin.ts` — Complete metformin drug data object with ALL fields: drugName, genericName, drugClass, indication, dosing (standard, titration, maxDose, administration), sideEffects (common, serious, whenToCallDoctor), interactions (avoidOrUseWithCaution, foodInteractions), contraindications, storage, patientAssistanceProgram (programName, description, eligibilityRequirements, potentialSavings, howToApply), keyFacts. Include a `getDrugContextString()` function that formats all data into a labeled string for injection into the system prompt.
- `src/lib/system-prompt.ts` — `buildSystemPrompt(drugContext: string, language: string, doctorName: string)` function that returns the full system prompt. Critical rules: (1) ONLY discuss info from DRUG INFORMATION section, (2) NOT a doctor, no diagnoses, (3) refuse out-of-scope questions and recommend asking Dr. ${doctorName}, (4) ALWAYS respond in ${language}, (5) simple warm language, (6) encouraging/supportive, (7) urgent response for serious side effects (tell them to call 911), (8) concise 2-4 sentences. Personality: warm, patient, reassuring, like a knowledgeable friend. Greeting instructions included.

#### C. Global Layout & Styles
- Update `src/app/layout.tsx` — metadata for "CuraVox by Impiricus", dark theme support, Inter/Space Grotesk fonts from next/font/google
- Update `src/app/globals.css` — design tokens, custom animations, scrollbar styling, dark theme. Dark background #050505, accent teal #00D4AA, secondary amber/gold.

#### D. Landing Page (src/app/page.tsx + components)
**THIS IS THE SHOWSTOPPER. The landing page must be an Apple-style scroll-driven immersive experience.**

The user explicitly said: "I want it to be 3D and interactive, like Apple. As you scroll, it's all one motion."

**Technical approach:**
- Use GSAP ScrollTrigger for scroll-driven animations
- Use CSS 3D transforms (perspective, rotateX, rotateY, translateZ) for depth
- Use Framer Motion for component-level animations
- Use Lenis for buttery smooth scrolling
- The page should feel like ONE continuous motion as you scroll, not discrete sections

**Landing page sections (flowing into each other, not separate blocks):**
1. **Hero** — Dark background. "CuraVox" title animates in with 3D perspective. Subtitle: "Every patient deserves to understand their medication." A glowing orb or abstract 3D shape floats and responds to scroll. "Powered by Impiricus" badge. Two CTAs: "I'm a Physician" → /physician, "I'm a Patient" → explain they need a link from their doctor.
2. **The Problem** — As you scroll, stats fly in with 3D depth: "25M+ LEP patients in the US", "67% of medication errors linked to language barriers", "1 in 5 patients can't read their prescription label". Text and numbers should have parallax depth layers.
3. **How It Works** — Three steps animate in sequence as a continuous flow: (1) Doctor prescribes → (2) CuraVox creates companion → (3) Patient chats in their language. Show a 3D phone mockup rotating into view with the chat interface on screen. Use CSS 3D transforms to make the phone feel real.
4. **Live Demo Preview** — An animated chat mockup showing a conversation in Spanish. Messages appear as you scroll. The phone rotates slightly as messages come in.
5. **Features Grid** — Cards with glassmorphism that tilt on hover (3D perspective). Features: Multilingual AI, Voice Support, Drug Safety Guardrails, Copay Assistance, Zero Patient Friction, HIPAA-Conscious Design.
6. **For Physicians CTA** — "Bridge the language gap today." Button to /physician. Subtle particle effect or gradient animation.
7. **Footer** — "Built at VTHacks 14 · Powered by Impiricus" with Impiricus branding acknowledgment.

**Critical design requirements:**
- Dark theme (near-black background: #050505 or similar)
- Accent color: vibrant teal/cyan (#00D4AA or similar — health/medical feel)
- Secondary accent: warm amber/gold for contrast
- All animations must use GSAP ScrollTrigger with `scrub: true` for scroll-linked motion
- Lenis smooth scroll wrapper
- Mobile responsive (judges may view on phone)
- No static images — everything is CSS/SVG/canvas-rendered
- The scroll experience should feel premium and fluid, like scrolling through apple.com/iphone

#### E. Physician Portal

**Login page (`src/app/physician/page.tsx`):**
- Clean login form (email + password)
- For demo purposes, hardcode: email "demo@impiricus.com", password "curavox2026"
- "Powered by Impiricus" branding
- After login, redirect to dashboard

**Dashboard (`src/app/physician/dashboard/page.tsx`):**
- Welcome message: "Welcome, Dr. Martinez"
- Stats cards: Total Companions Created, Active Patients, Languages Supported
- "Create New Companion" prominent CTA button
- List of previously created companions (hardcoded demo data for the demo)
- Each companion shows: patient name, drug, language, date created, QR code button

**Create Companion Flow (`src/app/physician/create/page.tsx`):**
- Step 1: Select medication (dropdown — only Metformin for demo, but UI should suggest more coming)
- Step 2: Select patient's preferred language (Spanish, French, English)
- Step 3: Enter patient name (optional, for personalization)
- Step 4: Review & Generate
- On submit: generates a unique companion link and QR code
- Show the QR code prominently with "Share with Patient" instructions
- The companion link format: `/patient/[id]?drug=metformin&lang=es&doctor=Dr.+Martinez`
- Use lz-string to compress/encode parameters into the URL
- Use react-qrcode-logo to generate the QR code

#### F. Patient Chat Interface (`src/app/patient/[id]/page.tsx`)

**This is the core product. Mobile-first messaging UI.**

- Parse URL parameters to get drug, language, doctor name
- Full-screen chat interface (like iMessage or WhatsApp)
- Dark theme matching the brand
- On load: AI sends the greeting message (introducing itself, the medication, asking how to help) in the patient's language
- Message bubbles: patient on right (teal), AI on left (dark gray)
- Text input at bottom with send button
- Voice input button (microphone icon) — uses browser's SpeechRecognition API or OpenAI Whisper
- Voice output button on each AI message — uses OpenAI TTS API
- Loading indicator while AI is responding (typing dots animation)
- The chat must feel like a native messaging app
- No login required, no account, zero friction
- Header shows: "CuraVox · Your Medication Companion" and the drug name
- Small "Powered by Impiricus" in header

#### G. API Routes

**Chat API (`src/app/api/chat/route.ts`):**
- POST endpoint
- Accepts: `{ messages: [...], drug: string, language: string, doctorName: string }`
- Uses OpenAI GPT-4o (model: "gpt-4o")
- Builds system prompt using `buildSystemPrompt()` from `src/lib/system-prompt.ts`
- Gets drug context using `getDrugContextString()` from `src/data/metformin.ts`
- Returns streaming response using OpenAI's streaming API
- Environment variable: `OPENAI_API_KEY`

**TTS API (`src/app/api/tts/route.ts`):**
- POST endpoint
- Accepts: `{ text: string, language: string }`
- Uses OpenAI TTS API (model: "tts-1", voice: "nova" for Spanish/French)
- Returns audio as arraybuffer/blob
- Environment variable: `OPENAI_API_KEY`

**Create Companion API (`src/app/api/create-companion/route.ts`):**
- POST endpoint
- Accepts: `{ drug: string, language: string, doctorName: string, patientName?: string }`
- Generates a unique ID using uuid
- Encodes parameters into URL using lz-string
- Returns: `{ id: string, url: string, qrData: string }`

#### H. Shared Components (src/components/)

- `ChatBubble.tsx` — message bubble component (patient vs AI styling)
- `VoiceButton.tsx` — microphone button with recording state animation
- `QRCodeDisplay.tsx` — QR code component using react-qrcode-logo
- `LoadingDots.tsx` — typing indicator animation
- `GlassCard.tsx` — glassmorphism card component for features grid
- `Phone3D.tsx` — CSS 3D phone mockup component for landing page
- `ScrollSection.tsx` — GSAP ScrollTrigger wrapper component
- `SmoothScroll.tsx` — Lenis smooth scroll provider (client component)
- `Navbar.tsx` — top navigation for landing page

#### I. Utilities (src/lib/)

- `companion.ts` — encode/decode companion parameters with lz-string
- `constants.ts` — app-wide constants (colors, supported languages, etc.)

### Agent 3: THE JUDGE
**Role:** Quality assurance engineer and product evaluator. Tests everything against requirements.

**The Judge must:**
1. Run `npm run build` to verify the app compiles with zero errors
2. Check every file the Builder created exists and has substantive content
3. Verify the landing page has GSAP ScrollTrigger animations (not just static sections)
4. Verify the physician portal has login, dashboard, and create companion flow
5. Verify the patient chat has message UI, input, and API integration
6. Verify API routes exist and have correct request/response handling
7. Verify all "use client" directives are on interactive components
8. Verify mobile responsiveness considerations in CSS
9. Verify the app looks like a premium product, not a hackathon throwaway
10. Check for any hardcoded API keys (there should be NONE — only env vars)
11. Verify Impiricus branding appears on physician portal and landing page
12. Verify the QR code generation flow works end-to-end in code
13. Run linting for any issues

**If ANY check fails:** The Judge must produce a specific, actionable list of exactly what needs to be fixed, with file paths and line numbers. Then spawn a new Builder agent to fix those issues. After fixes, re-run all checks.

**The Judge evaluates against these hackathon judging criteria:**
- Innovation & Creativity (is this a novel extension of Impiricus?)
- Technical Complexity (AI, multilingual, voice, real-time chat)
- User Experience (premium feel, zero-friction patient flow)
- Practical Impact (solves a real healthcare equity problem)
- Presentation Quality (does the landing page wow?)

### Agent 4: THE PRESENTER
**Role:** Summarizes everything that was built, explains the architecture, and prepares demo talking points.

**The Presenter must:**
1. List every file created/modified with a one-line description
2. Explain the full user flow: physician creates companion → patient scans QR → patient chats with AI
3. Note what needs an OpenAI API key to work (chat and TTS endpoints)
4. Provide demo talking points for the hackathon presentation
5. List any known limitations or things that would be nice to add
6. Confirm deployment readiness

---

## TECHNICAL CONSTRAINTS

- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS v4)
- **AI:** OpenAI GPT-4o for chat, OpenAI TTS for voice (env var: OPENAI_API_KEY)
- **No database needed** — this is a demo. Companion parameters are encoded in URLs.
- **Physician login is hardcoded** — email: demo@impiricus.com, password: curavox2026
- **Dashboard data is hardcoded** — mock data showing previous companions
- **Supported languages for demo:** Spanish, French, English
- **All client components need `"use client"` directive**
- **Read the Next.js docs at `node_modules/next/dist/docs/01-app/01-getting-started/`** before writing ANY code — this version may have breaking changes from what you know
- **GSAP is already installed** — import from 'gsap' and 'gsap/ScrollTrigger'
- **Framer Motion is already installed** — import from 'framer-motion'
- **Lenis is already installed** — import from 'lenis'

## EXECUTION ORDER

1. Spawn the **Planner** agent first. Wait for its plan.
2. Spawn the **Builder** agent with the Planner's output. Wait for it to finish.
3. Spawn the **Judge** agent. Wait for its evaluation.
4. If the Judge finds issues, spawn a new **Builder** agent to fix them, then re-Judge.
5. Once the Judge passes, spawn the **Presenter** agent.
6. Report completion.

## IMPORTANT NOTES

- The landing page is the FIRST thing judges see. It must be stunning. Apple-level scroll experience.
- The patient chat is the CORE product. It must feel like a native messaging app.
- Impiricus branding must be visible but not overwhelming — CuraVox is the star, Impiricus is the platform.
- Everything should work without an API key for the landing page and physician portal. Only the actual chat and TTS require the key.
- Mobile responsive is non-negotiable. Judges will try it on their phones.
- Dark theme throughout. Premium feel. No default Next.js styling left anywhere.

Now execute. Start with the Planner.
