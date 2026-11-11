"use client";

import { useCallback, useEffect, useState } from "react";

import { speak as speakText, stop as stopSpeaking } from "@/lib/tts";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, lang?: string) => {
    speakText(text, lang);
    setIsSpeaking(true);
  }, []);

  const stop = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // SpeechSynthesisUtterance's own onend event is unreliable across
  // browsers for short utterances, so this polls the synthesis object
  // directly as a fallback to keep isSpeaking accurate.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking) setIsSpeaking(false);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return { speak, stop, isSpeaking };
}

export default useTTS;