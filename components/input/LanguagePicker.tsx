"use client";

import { useState, type ChangeEvent } from "react";

import useAuth from "@/hooks/useAuth";
import { updateDefaultTargetLanguage } from "@/lib/firestore";

interface LanguagePickerProps {
  targetLanguage: string;
  onChange: (language: string) => void;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese (Simplified)" },
  { code: "ar", label: "Arabic" },
];

function LanguagePicker({ targetLanguage, onChange }: LanguagePickerProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    onChange(next); // update immediately, don't wait on the Firestore write

    if (!user) return;
    setIsSaving(true);
    try {
      await updateDefaultTargetLanguage(user.uid, next);
    } catch (error) {
      console.error("[language]", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="target-language" className="text-sm font-medium text-ink">
        Translate to
      </label>
      <select
        id="target-language"
        value={targetLanguage}
        onChange={handleChange}
        disabled={isSaving}
        className="min-h-touch rounded-control border border-line bg-paper px-3 py-2 text-sm text-ink"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguagePicker;