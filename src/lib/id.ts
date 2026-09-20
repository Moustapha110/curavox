/**
 * crypto.randomUUID() exists only in secure contexts (https or localhost).
 * Patients open companion links over plain http on the LAN, so fall back.
 */
export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
