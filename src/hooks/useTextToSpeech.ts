"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LANGUAGE_MAP } from "@/lib/constants";
import type { LanguageCode } from "@/lib/types";

export interface UseTextToSpeechResult {
  speak: (messageId: string, text: string) => Promise<void>;
  stop: () => void;
  playingId: string | null;
  loadingId: string | null;
  error: string | null;
  available: boolean;
}

function subscribeNoop() {
  return () => {};
}

function hasSpeechSynthesis(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function normalizeLang(tag: string): string {
  return tag.replace("_", "-").toLowerCase();
}

/**
 * Pick the best installed voice for a BCP 47 code like "es-ES": exact region
 * match first, then any voice for the same language. Returns null when nothing
 * matches; the browser then falls back to its default voice for `utterance.lang`.
 */
function pickVoice(speechCode: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const wanted = normalizeLang(speechCode);
  const base = wanted.split("-")[0];

  const exact = voices.filter((v) => normalizeLang(v.lang) === wanted);
  const sameLanguage = voices.filter((v) => normalizeLang(v.lang).startsWith(`${base}-`) || normalizeLang(v.lang) === base);
  const pool = exact.length > 0 ? exact : sameLanguage;
  if (pool.length === 0) return null;

  // Prefer higher-quality voices when the platform labels them.
  const premium = pool.find((v) => /natural|premium|enhanced|neural|google/i.test(v.name));
  return premium ?? pool.find((v) => v.default) ?? pool[0];
}

/**
 * Chrome stops long utterances after roughly 15 seconds. Speaking one sentence
 * per utterance keeps every reply complete.
 */
function splitIntoSentences(text: string): string[] {
  const parts = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()];
}

export function useTextToSpeech(language: LanguageCode): UseTextToSpeechResult {
  const speechCode = LANGUAGE_MAP[language].speechCode;
  const available = useSyncExternalStore(subscribeNoop, hasSpeechSynthesis, () => false);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Identifies the current playback so callbacks from a cancelled run are ignored.
  const runRef = useRef(0);

  const stop = useCallback(() => {
    runRef.current += 1;
    if (hasSpeechSynthesis()) window.speechSynthesis.cancel();
    setPlayingId(null);
  }, []);

  useEffect(() => {
    if (!hasSpeechSynthesis()) return;
    const synth = window.speechSynthesis;
    // Voices load asynchronously in Chrome; touching getVoices() primes the list.
    synth.getVoices();
    const prime = () => synth.getVoices();
    synth.addEventListener("voiceschanged", prime);
    return () => {
      synth.removeEventListener("voiceschanged", prime);
      synth.cancel();
    };
  }, []);

  const speak = useCallback(
    async (messageId: string, text: string) => {
      if (!hasSpeechSynthesis()) {
        setError("Voice playback is not supported in this browser.");
        return;
      }
      if (playingId === messageId) {
        stop();
        return;
      }
      stop();
      setError(null);

      const run = runRef.current;
      const synth = window.speechSynthesis;
      const voice = pickVoice(speechCode);
      const sentences = splitIntoSentences(text);
      let remaining = sentences.length;

      const finish = () => {
        if (runRef.current === run) setPlayingId(null);
      };

      for (const sentence of sentences) {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = speechCode;
        if (voice) utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => {
          remaining -= 1;
          if (remaining <= 0) finish();
        };
        utterance.onerror = (event) => {
          // "interrupted" and "canceled" are expected when the user taps Stop.
          if (runRef.current === run && event.error !== "interrupted" && event.error !== "canceled") {
            setError("Voice playback failed.");
          }
          finish();
        };
        synth.speak(utterance);
      }

      // Safari and Chrome occasionally leave the engine paused after cancel().
      if (synth.paused) synth.resume();
      setPlayingId(messageId);
    },
    [playingId, speechCode, stop],
  );

  return { speak, stop, playingId, loadingId: null, error, available };
}

export default useTextToSpeech;
