import type { LanguageCode } from "./types";

export interface UiStrings {
  headerTitle: string;
  headerSubtitle: string;
  inputPlaceholder: string;
  send: string;
  stop: string;
  listening: string;
  tapToSpeak: string;
  speak: string;
  stopSpeaking: string;
  loadingSpeech: string;
  thinking: string;
  prescribedBy: string;
  fallbackGreeting: (drug: string, doctor: string) => string;
  offlineNotice: string;
  errorGeneric: string;
  retry: string;
  disclaimer: string;
  youLabel: string;
  assistantLabel: string;
  micDenied: string;
  ttsUnavailable: string;
  companionName: string;
  talkMode: string;
  typeMode: string;
  tapToTalk: string;
  tapToSend: string;
  transcribing: string;
  speaking: string;
  talkHint: string;
}

export const UI_STRINGS: Record<LanguageCode, UiStrings> = {
  es: {
    headerTitle: "Cora",
    headerSubtitle: "Tu compañera de medicación",
    inputPlaceholder: "Escribe tu pregunta...",
    send: "Enviar",
    stop: "Detener",
    listening: "Escuchando...",
    tapToSpeak: "Toca para hablar",
    speak: "Escuchar este mensaje",
    stopSpeaking: "Detener audio",
    loadingSpeech: "Preparando audio...",
    thinking: "Cora está escribiendo...",
    prescribedBy: "Recetado por",
    fallbackGreeting: (drug, doctor) =>
      `Hi! I'm Cora, your medication companion. ${doctor} prescribed ${drug} for you, and I'm here to help you understand it in plain words. You can ask me how to take it, what side effects to expect, or what to do if you miss a dose. What would you like to know first?`,
    offlineNotice: "La IA en vivo no está disponible. Modo demostración.",
    errorGeneric: "Lo siento, algo salió mal. Por favor, inténtalo de nuevo.",
    retry: "Reintentar",
    disclaimer: "CuraVox es una IA, no un médico. En una emergencia, llama al 911.",
    youLabel: "Tú",
    assistantLabel: "Cora",
    micDenied: "El micrófono está bloqueado. Permite el acceso en tu navegador.",
    ttsUnavailable: "El audio no está disponible en este momento.",
    companionName: "Cora",
    talkMode: "Hablar",
    typeMode: "Escribir",
    tapToTalk: "Toca para hablar con Cora",
    tapToSend: "Toca cuando termines",
    transcribing: "Cora te está escuchando...",
    speaking: "Cora está hablando...",
    talkHint: "Habla con Cora como lo harías con una amiga.",
  },
  fr: {
    headerTitle: "Cora",
    headerSubtitle: "Votre compagne de traitement",
    inputPlaceholder: "Écrivez votre question...",
    send: "Envoyer",
    stop: "Arrêter",
    listening: "Je vous écoute...",
    tapToSpeak: "Appuyez pour parler",
    speak: "Écouter ce message",
    stopSpeaking: "Arrêter l'audio",
    loadingSpeech: "Préparation de l'audio...",
    thinking: "Cora est en train d'écrire...",
    prescribedBy: "Prescrit par",
    fallbackGreeting: (drug, doctor) =>
      `Bonjour ! Je suis CuraVox, votre compagnon de traitement. ${doctor} vous a prescrit ${drug} et je suis là pour vous l'expliquer avec des mots simples. Vous pouvez me demander comment le prendre, ses effets secondaires ou quoi faire si vous oubliez une dose. Que souhaitez-vous savoir en premier ?`,
    offlineNotice: "L'IA en direct est indisponible. Mode démonstration.",
    errorGeneric: "Désolé, une erreur s'est produite. Veuillez réessayer.",
    retry: "Réessayer",
    disclaimer: "CuraVox est une IA, pas un médecin. En cas d'urgence, appelez le 911.",
    youLabel: "Vous",
    assistantLabel: "Cora",
    micDenied: "Le micro est bloqué. Autorisez l'accès dans votre navigateur.",
    ttsUnavailable: "L'audio n'est pas disponible pour le moment.",
    companionName: "Cora",
    talkMode: "Parler",
    typeMode: "Écrire",
    tapToTalk: "Appuyez pour parler à Cora",
    tapToSend: "Appuyez quand vous avez fini",
    transcribing: "Cora vous écoute...",
    speaking: "Cora parle...",
    talkHint: "Parlez à Cora comme à une amie.",
  },
  en: {
    headerTitle: "Cora",
    headerSubtitle: "Your medication companion",
    inputPlaceholder: "Type your question...",
    send: "Send",
    stop: "Stop",
    listening: "Listening...",
    tapToSpeak: "Tap to speak",
    speak: "Listen to this message",
    stopSpeaking: "Stop audio",
    loadingSpeech: "Preparing audio...",
    thinking: "Cora is typing...",
    prescribedBy: "Prescribed by",
    fallbackGreeting: (drug, doctor) =>
      `Hi! I'm CuraVox, your medication companion. ${doctor} prescribed ${drug} for you, and I'm here to help you understand it in plain words. You can ask me how to take it, what side effects to expect, or what to do if you miss a dose. What would you like to know first?`,
    offlineNotice: "Live AI unavailable. Demo mode.",
    errorGeneric: "Sorry, something went wrong. Please try again.",
    retry: "Retry",
    disclaimer: "CuraVox is an AI, not a doctor. In an emergency, call 911.",
    youLabel: "You",
    assistantLabel: "Cora",
    micDenied: "Microphone is blocked. Allow access in your browser settings.",
    ttsUnavailable: "Audio is not available right now.",
    companionName: "Cora",
    talkMode: "Talk",
    typeMode: "Type",
    tapToTalk: "Tap to talk to Cora",
    tapToSend: "Tap when you're done",
    transcribing: "Cora is listening...",
    speaking: "Cora is speaking...",
    talkHint: "Talk to Cora like you would a friend.",
  },
};

export function getStrings(lang: LanguageCode): UiStrings {
  return UI_STRINGS[lang] ?? UI_STRINGS.en;
}

/** Localized display name of the drug for headers and greetings. */
export const DRUG_DISPLAY_NAMES: Record<LanguageCode, Record<string, string>> = {
  es: { metformin: "Metformina" },
  fr: { metformin: "Metformine" },
  en: { metformin: "Metformin" },
};

export function localizedDrugName(drugId: string, lang: LanguageCode, fallback: string): string {
  return DRUG_DISPLAY_NAMES[lang]?.[drugId] ?? fallback;
}
