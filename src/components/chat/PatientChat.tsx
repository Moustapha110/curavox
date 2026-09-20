"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useCoraVoice } from "@/hooks/useCoraVoice";
import { TalkPanel } from "./TalkPanel";
import { getDrug } from "@/data/metformin";
import { LANGUAGE_MAP } from "@/lib/constants";
import { getStrings, localizedDrugName } from "@/lib/i18n";
import type { ApiChatMessage, ChatMessage, ChatRequestBody, CompanionParams } from "@/lib/types";
import { newId } from "@/lib/id";

export interface PatientChatProps {
  companion: CompanionParams & { id: string };
}

export function PatientChat({ companion }: PatientChatProps) {
  const { drug, lang, doctor, patient } = companion;
  const strings = getStrings(lang);
  const drugData = getDrug(drug);
  const drugName = localizedDrugName(drug, lang, drugData.drugName);
  const speechCode = LANGUAGE_MAP[lang].speechCode;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<"talk" | "type">("talk");
  const cora = useCoraVoice(lang);

  const greetedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const tts = useTextToSpeech(lang);

  function patch(id: string, partial: Partial<ChatMessage>) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...partial } : m)));
  }

  async function send(userText: string | null): Promise<string> {
    const history: ApiChatMessage[] = messages
      .filter((m) => m.status !== "error" && m.content.trim().length > 0)
      .map(({ role, content }) => ({ role, content }));

    const now = Date.now();
    const userMsg: ChatMessage | null = userText
      ? { id: newId(), role: "user", content: userText, status: "done", createdAt: now }
      : null;
    const assistantId = newId();

    setMessages((prev) => [
      ...prev,
      ...(userMsg ? [userMsg] : []),
      { id: assistantId, role: "assistant", content: "", status: "streaming", createdAt: now + 1 },
    ]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const body: ChatRequestBody = {
      messages: [...history, ...(userText ? [{ role: "user" as const, content: userText }] : [])],
      drug,
      language: lang,
      doctorName: doctor,
      patientName: patient,
      knowledgeBase: companion.notes,
      companionId: companion.id,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({ error: strings.errorGeneric }))) as { error?: string };
        if (res.status === 503) setApiAvailable(false);
        patch(assistantId, {
          content: userText ? (data.error ?? strings.errorGeneric) : strings.fallbackGreeting(drugName, doctor),
          status: userText ? "error" : "done",
        });
        return userText ? "" : strings.fallbackGreeting(drugName, doctor);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        patch(assistantId, { content: acc });
      }
      acc += decoder.decode();
      patch(assistantId, { content: acc.trim() || strings.errorGeneric, status: acc.trim() ? "done" : "error" });
      return acc.trim();
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? m.content
                ? { ...m, status: "done" }
                : { ...m, status: "error", content: strings.stop }
              : m,
          ),
        );
      } else {
        patch(assistantId, { status: "error", content: strings.errorGeneric });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
    return "";
  }

  /** Talk mode: tap starts recording, next tap sends; Cora answers out loud. */
  async function handleTalkTap() {
    if (cora.state === "idle") {
      await cora.startRecording();
      return;
    }
    if (cora.state === "recording") {
      const text = await cora.stopAndTranscribe();
      if (!text) return;
      const reply = await send(text);
      if (!reply) return;
      const played = await cora.speak(reply);
      if (!played) {
        const last = messagesRef.current[messagesRef.current.length - 1];
        void tts.speak(last?.id ?? "reply", reply);
      }
    }
  }

  const speech = useSpeechRecognition(speechCode, {
    onResult: (text, isFinal) => {
      setInput(text);
      if (isFinal && text.trim()) {
        setInput("");
        void send(text.trim());
      }
    },
    onError: (code) => {
      if (code === "not-allowed") setMicNotice(strings.micDenied);
    },
  });

  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    queueMicrotask(() => {
      void send(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Doctor replies arrive through the shared inbox; Cora delivers them here, spoken.
  const deliveredRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    let stopped = false;
    const startedAt = Date.now() - 5 * 60 * 1000;
    const tick = async () => {
      try {
        const r = await fetch(`/api/inbox?companion=${encodeURIComponent(companion.id)}`, { cache: "no-store" });
        if (!r.ok) return;
        const data = (await r.json()) as { items: Array<{ id: string; status: string; delivery?: string; answeredAt?: number }> };
        for (const item of data.items) {
          if (item.status !== "answered" || !item.delivery) continue;
          if ((item.answeredAt ?? 0) < startedAt) continue;
          if (deliveredRef.current.has(item.id)) continue;
          deliveredRef.current.add(item.id);
          const id = newId();
          setMessages((prev) => [...prev, { id, role: "assistant", content: item.delivery!, status: "done", createdAt: Date.now() }]);
          const played = await cora.speak(item.delivery);
          if (!played) void tts.speak(id, item.delivery);
        }
      } catch {
        /* offline; try again next tick */
      }
    };
    const handle = window.setInterval(() => { if (!stopped) void tick(); }, 4000);
    return () => { stopped = true; window.clearInterval(handle); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companion.id]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend(text: string) {
    setInput("");
    void send(text);
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleSpeak(m: ChatMessage) {
    void tts.speak(m.id, m.content);
  }

  const notice = !apiAvailable
    ? strings.offlineNotice
    : micNotice ?? (tts.available ? tts.error : strings.ttsUnavailable);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative mx-auto flex h-dvh-screen w-full max-w-2xl flex-col overflow-hidden bg-canvas md:my-0 md:border-x md:border-line">
        <ChatHeader
          drugName={drugName}
          doctorName={doctor}
          language={lang}
          strings={strings}
          notice={notice}
        />

        <div ref={listRef} className="chat-scroll relative flex-1 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col justify-end gap-3 px-4 pb-4 pt-5">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <ChatBubble
                  key={m.id}
                  message={m}
                  strings={strings}
                  ttsAvailable={tts.available}
                  onSpeak={handleSpeak}
                  speaking={tts.playingId === m.id}
                  loadingSpeech={tts.loadingId === m.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Mode switch: two big, obvious choices */}
        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+0px)] z-30 mx-auto flex w-full max-w-2xl gap-2 px-3 pb-2">
          <button
            type="button"
            onClick={() => { cora.stopSpeaking(); setMode("talk"); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
              mode === "talk" ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink hover:border-accent/50"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></svg>
            {strings.talkMode}
          </button>
          <button
            type="button"
            onClick={() => { cora.stopSpeaking(); setMode("type"); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
              mode === "type" ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink hover:border-accent/50"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></svg>
            {strings.typeMode}
          </button>
        </div>

        {mode === "talk" ? (
          <TalkPanel
            state={cora.state}
            thinking={isStreaming}
            onTap={() => void handleTalkTap()}
            onStop={cora.stopSpeaking}
            strings={strings}
            error={cora.error}
          />
        ) : (
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
            strings={strings}
            voice={{ supported: speech.supported, listening: speech.listening, onToggle: speech.toggle }}
          />
        )}
      </div>
    </MotionConfig>
  );
}

export default PatientChat;
