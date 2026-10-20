"use client";

import { useRef, useState, type ChangeEvent } from "react";

import Spinner from "@/components/ui/Spinner";
import { validateImageFile } from "@/lib/image";
import { uploadImage } from "@/lib/storage";
import useAuth from "@/hooks/useAuth";

interface FileUploadProps {
  onImageSelected: (file: File) => void;
}

function FileUpload({ onImageSelected }: FileUploadProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = validateImageFile(file);
    if (!result.valid) {
      setError(result.error ?? "That file couldn't be used.");
      return;
    }

    setError(null);
    onImageSelected(file); // Show the local preview immediately.

    if (user) {
      setIsUploading(true);
      try {
        await uploadImage(file, user.uid);
      } catch (uploadError) {
        console.error("[upload]", uploadError);
        setError("The image couldn't be saved, but you can still continue.");
      } finally {
        setIsUploading(false);
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="min-h-touch w-full rounded-control border border-dashed border-line px-4 py-8 text-sm text-muted hover:border-accent hover:text-ink"
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Saving your image…
          </span>
        ) : (
          "Click to choose an image"
        )}
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
``
