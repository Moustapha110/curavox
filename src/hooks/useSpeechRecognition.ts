"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getSpeechRecognitionCtor, isSpeechSupported } from "@/lib/speech";

export interface UseSpeechRecognitionOptions {
  onResult?: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (code: SpeechErrorCode) => void;
}

export type SpeechErrorCode = "not-allowed" | "no-speech" | "network" | "aborted" | "unknown";

export interface UseSpeechRecognitionResult {
  supported: boolean;
  listening: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  error: SpeechErrorCode | null;
}

const noopSubscribe = () => () => {};
const serverSnapshot = () => false;

function mapError(code: string): SpeechErrorCode {
  if (code === "not-allowed" || code === "service-not-allowed") return "not-allowed";
  if (code === "no-speech") return "no-speech";
  if (code === "network") return "network";
  if (code === "aborted") return "aborted";
  return "unknown";
}

export function useSpeechRecognition(
  speechCode: string,
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionResult {
  const supported = useSyncExternalStore(noopSubscribe, isSpeechSupported, serverSnapshot);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<SpeechErrorCode | null>(null);

  const recognizerRef = useRef<SpeechRecognitionLike | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    return () => {
      recognizerRef.current?.abort();
      recognizerRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    recognizerRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    if (recognizerRef.current) {
      recognizerRef.current.abort();
      recognizerRef.current = null;
    }

    const rec = new Ctor();
    rec.lang = speechCode;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setError(null);
      setListening(true);
    };

    rec.onresult = (e) => {
      let transcript = "";
      let isFinal = false;
      for (let i = 0; i < e.results.length; i += 1) {
        const result = e.results[i];
        transcript += result[0]?.transcript ?? "";
        if (result.isFinal) isFinal = true;
      }
      optionsRef.current.onResult?.(transcript.trim(), isFinal);
    };

    rec.onerror = (e) => {
      const code = mapError(e.error);
      if (code !== "aborted") {
        setError(code);
        optionsRef.current.onError?.(code);
      }
    };

    rec.onend = () => {
      setListening(false);
      if (recognizerRef.current === rec) recognizerRef.current = null;
      optionsRef.current.onEnd?.();
    };

    recognizerRef.current = rec;
    try {
      rec.start();
    } catch {
      setListening(false);
      setError("unknown");
    }
  }, [speechCode]);

  const toggle = useCallback(() => {
    if (recognizerRef.current) stop();
    else start();
  }, [start, stop]);

  return { supported, listening, start, stop, toggle, error };
}

export default useSpeechRecognition;
