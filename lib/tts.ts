/**
 * Thin wrapper around the browser's native SpeechSynthesis API.
 * Deliberately a plain module, not a class -- there is only ever one
 * active utterance at a time for the whole app, so module-level state is
 * simpler than an instance anyone has to remember to create.
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, lang: string = "en-US"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  stop(); // never let two utterances overlap
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stop(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}