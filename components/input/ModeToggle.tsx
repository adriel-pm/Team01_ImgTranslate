"use client";

import { useState } from "react";

import useAuth from "@/hooks/useAuth";
import { updateUserMode } from "@/lib/firestore";

import type { UserPreferences } from "@/lib/types";

type Mode = UserPreferences["mode"];

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const options: { id: Mode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "text-only", label: "Text only" },
  { id: "objects-only", label: "Objects only" },
];

function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSelect(next: Mode) {
    onChange(next); // update the UI immediately, don't wait on the network
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserMode(user.uid, next);
    } catch (error) {
      console.error("[mode]", error); // not worth blocking the UI over a failed preference save
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div role="radiogroup" aria-label="Translation mode" className="inline-flex rounded-control border border-line p-1">
      {options.map((option) => (
        <button
          key={option.id}
          role="radio"
          aria-checked={mode === option.id}
          onClick={() => handleSelect(option.id)}
          disabled={isSaving}
          className={`min-h-touch rounded-control px-3 py-1.5 text-sm font-medium ${
            mode === option.id ? "bg-accent text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ModeToggle;