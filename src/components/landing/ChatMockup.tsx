"use client";

import { DEMO_DOCTOR } from "@/lib/constants";

export interface MockMessage {
  role: "assistant" | "user";
  text: string;
}

export const DEMO_MESSAGES: MockMessage[] = [
  {
    role: "assistant",
    text: "¡Hola, María! Soy CuraVox. La Dra. Martinez me creó para ayudarte a entender tu metformina. ¿Qué te gustaría saber?",
  },
  { role: "user", text: "¿Cómo debo tomarla?" },
  {
    role: "assistant",
    text: "Toma una tableta con el desayuno y otra con la cena. Tomarla con comida ayuda a evitar molestias en el estómago.",
  },
  { role: "user", text: "¿Y si me da náuseas?" },
  {
    role: "assistant",
    text: "Es común al principio y suele mejorar en unas semanas. Si es intenso o tienes vómitos, llama a la Dra. Martinez.",
  },
];

function MockAvatar() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F75E5E]/12 ring-1 ring-[#F75E5E]/40">
      <span className="h-2.5 w-2.5 rounded-full bg-[#F75E5E] shadow-[0_0_10px_rgba(247,94,94,.9)]" />
    </span>
  );
}

/**
 * Static phone screen — always shows the chat view with all messages visible.
 * All colors hardcoded dark since global tokens are light.
 */
export function ChatMockup() {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#FBF8F1] text-[#2F3142]">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#2F3142]/10 px-4 pb-3 pt-12">
        <MockAvatar />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[13px] font-semibold text-[#2F3142]">CuraVox</div>
          <div className="truncate text-[10px] text-[#2F3142]/55">Metformina · {DEMO_DOCTOR.name}</div>
        </div>
        <span className="rounded-full border border-[#F75E5E]/30 bg-[#F75E5E]/12 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#F75E5E]">
          ES
        </span>
      </div>

      {/* Chat messages */}
      <div className="flex flex-1 flex-col justify-end gap-2 px-3 pb-2">
        {DEMO_MESSAGES.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11.5px] leading-snug ${
                m.role === "user"
                  ? "rounded-br-sm bg-[#F75E5E] text-[#2F3142]"
                  : "rounded-bl-sm bg-white text-[#2F3142] ring-1 ring-[#2F3142]/10"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 border-t border-[#2F3142]/10 bg-[#FBF8F1] px-3 pb-5 pt-2">
        <div className="flex h-9 flex-1 items-center rounded-full bg-white ring-1 ring-[#2F3142]/10 px-3 text-[11px] text-[#2F3142]/55">
          Escribe un mensaje…
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F75E5E]/12 text-[#F75E5E] ring-1 ring-[#F75E5E]/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default ChatMockup;
