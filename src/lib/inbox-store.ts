/**
 * In-memory inbox shared by the physician portal and every patient companion.
 * Lives for the life of the dev server, which is exactly the hackathon's lifetime.
 * Production swaps this for a table under the physician's account.
 */
export type InboxKind = "question" | "appointment" | "urgent";

export interface InboxItem {
  id: string;
  companionId: string;
  patient: string;
  lang: string;
  kind: InboxKind;
  text: string;          // what Cora filed, in English, for the physician
  createdAt: number;
  status: "open" | "answered";
  reply?: string;        // physician's reply (English)
  delivery?: string;     // Cora's version for the patient, in their language
  answeredAt?: number;
}

type Store = { items: InboxItem[] };
const g = globalThis as unknown as { __curavoxInbox?: Store };
const store: Store = g.__curavoxInbox ?? (g.__curavoxInbox = { items: [] });

export function addItem(input: Omit<InboxItem, "id" | "createdAt" | "status">): InboxItem {
  const item: InboxItem = {
    ...input,
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
    status: "open",
  };
  store.items.unshift(item);
  if (store.items.length > 200) store.items.length = 200;
  return item;
}

export function listItems(companionId?: string): InboxItem[] {
  return companionId ? store.items.filter((i) => i.companionId === companionId) : store.items;
}

export function answerItem(id: string, reply: string, delivery: string): InboxItem | null {
  const item = store.items.find((i) => i.id === id);
  if (!item) return null;
  item.reply = reply;
  item.delivery = delivery;
  item.status = "answered";
  item.answeredAt = Date.now();
  return item;
}
