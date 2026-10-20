"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { validateImageFile } from "@/lib/image";

interface FileUploadProps {
  onImageSelected: (file: File) => void;
}

function FileUpload({ onImageSelected }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = validateImageFile(file);
    if (!result.valid) {
      setError(result.error ?? "That file couldn't be used.");
      return;
    }

    setError(null);
    onImageSelected(file);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="min-h-touch w-full rounded-control border border-dashed border-line px-4 py-8 text-sm text-muted hover:border-accent hover:text-ink"
      >
        Click to choose an image
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/bmp,image/heic"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
