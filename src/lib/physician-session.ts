"use client";

import { PHYSICIAN_SESSION_KEY } from "./constants";

const EVENT_NAME = "curavox:physician-session";

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function isPhysicianLoggedIn(): boolean {
  if (!hasWindow()) return false;
  try {
    return window.sessionStorage.getItem(PHYSICIAN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function notify() {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function loginPhysician(): void {
  if (!hasWindow()) return;
  try {
    window.sessionStorage.setItem(PHYSICIAN_SESSION_KEY, "1");
  } catch {
    // storage unavailable (private mode); auth guard will simply bounce to login
  }
  notify();
}

export function logoutPhysician(): void {
  if (!hasWindow()) return;
  try {
    window.sessionStorage.removeItem(PHYSICIAN_SESSION_KEY);
  } catch {
    // ignore
  }
  notify();
}

/** Subscribe to session changes (same tab via custom event, other tabs via storage). */
export function subscribePhysicianSession(callback: () => void): () => void {
  if (!hasWindow()) return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === PHYSICIAN_SESSION_KEY) callback();
  };
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getPhysicianServerSnapshot(): boolean {
  return false;
}
