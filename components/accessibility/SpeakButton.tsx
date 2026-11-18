"use client";

import useTTS from "@/hooks/useTTS";
import Button from "@/components/ui/Button";

interface SpeakButtonProps {
  text: string;
  lang?: string;
  label?: string;
}

function SpeakButton({ text, lang = "en-US", label = "Read aloud" }: SpeakButtonProps) {
  const { speak, stop, isSpeaking } = useTTS();

  if (!text.trim()) return null;

  function handleClick() {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  }

  return (
    <Button variant="ghost" onClick={handleClick} aria-pressed={isSpeaking}>
      {isSpeaking ? "Stop" : label}
    </Button>
  );
}

export default SpeakButton;