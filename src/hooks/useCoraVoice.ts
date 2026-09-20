"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LanguageCode } from "@/lib/types";

export type CoraVoiceState = "idle" | "recording" | "transcribing" | "speaking";

/**
 * Tap-to-talk voice loop backed by Deepgram through /api/stt and /api/tts.
 * Records with MediaRecorder, transcribes on stop, and plays MP3 replies.
 * speak() resolves false when the server has no voice for the language or the
 * key is missing, so the caller can fall back to the browser's own voice.
 */
export function useCoraVoice(lang: LanguageCode) {
  const [state, setState] = useState<CoraVoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // One reusable <audio>, created inside a user gesture so iOS lets it play later.
  function ensureAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "auto";
      audioRef.current = a;
    }
    return audioRef.current;
  }

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const a = ensureAudio();
      // Unlock audio playback on mobile Safari/Chrome with a silent play inside the tap.
      a.muted = true;
      a.src = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA";
      a.play().catch(() => {});
      a.muted = false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find(
        (m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m),
      );
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start(250);
      recorderRef.current = rec;
      setState("recording");
    } catch (e) {
      setError((e as Error).message || "Microphone unavailable");
      setState("idle");
    }
  }, []);

  const stopAndTranscribe = useCallback(async (): Promise<string> => {
    const rec = recorderRef.current;
    if (!rec) return "";
    setState("transcribing");
    const mime = rec.mimeType || "audio/webm";
    const blob: Blob = await new Promise((resolve) => {
      rec.onstop = () => resolve(new Blob(chunksRef.current, { type: mime }));
      rec.stop();
    });
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    try {
      const r = await fetch(`/api/stt?lang=${lang}`, { method: "POST", headers: { "Content-Type": mime }, body: blob });
      const data = (await r.json().catch(() => ({}))) as { transcript?: string; error?: string };
      if (!r.ok) {
        setError(data.error || `Transcription failed (${r.status})`);
        setState("idle");
        return "";
      }
      setState("idle");
      return data.transcript ?? "";
    } catch (e) {
      setError((e as Error).message);
      setState("idle");
      return "";
    }
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setState((s) => (s === "speaking" ? "idle" : s));
  }, []);

  /** Returns true if Deepgram audio played; false means "use the browser voice". */
  const speak = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text.trim()) return false;
      try {
        const r = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang }),
        });
        if (r.status === 204 || r.status === 503) return false;
        if (!r.ok) {
          const data = (await r.json().catch(() => ({}))) as { error?: string };
          setError(data.error || `Voice failed (${r.status})`);
          return false;
        }
        const buf = await r.arrayBuffer();
        const url = URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" }));
        const a = ensureAudio();
        setState("speaking");
        await new Promise<void>((resolve) => {
          a.onended = () => resolve();
          a.onerror = () => resolve();
          a.src = url;
          a.play().catch(() => resolve());
        });
        URL.revokeObjectURL(url);
        setState("idle");
        return true;
      } catch (e) {
        setError((e as Error).message);
        setState("idle");
        return false;
      }
    },
    [lang],
  );

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioRef.current?.pause();
    };
  }, []);

  return { state, error, startRecording, stopAndTranscribe, speak, stopSpeaking };
}
