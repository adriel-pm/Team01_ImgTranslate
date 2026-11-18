"use client";

import { useState } from "react";

import useAuth from "@/hooks/useAuth";
import { updateVoiceFirstEnabled } from "@/lib/firestore";

interface VoiceFirstToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function VoiceFirstToggle({ enabled, onChange }: VoiceFirstToggleProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggle() {
    const next = !enabled;
    onChange(next); // update immediately, don't wait on the Firestore write

    if (!user) return;
    setIsSaving(true);
    try {
      await updateVoiceFirstEnabled(user.uid, next);
    } catch (error) {
      console.error("[voice-first]", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={handleToggle}
      disabled={isSaving}
      className={`min-h-touch rounded-control border border-line px-4 py-2 text-sm font-medium ${
        enabled ? "bg-accent text-paper" : "bg-paper text-ink"
      }`}
    >
      Voice-first mode: {enabled ? "On" : "Off"}
    </button>
  );
}

export default VoiceFirstToggle;