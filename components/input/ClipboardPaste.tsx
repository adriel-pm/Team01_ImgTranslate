"use client";

import { useEffect, useState } from "react";

interface ClipboardPasteProps {
  onImageSelected: (file: File) => void;
}

function ClipboardPaste({ onImageSelected }: ClipboardPasteProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) {
        setError("No image found on your clipboard. Copy an image, then press Ctrl+V (or Cmd+V) here.");
        return;
      }

      const file = imageItem.getAsFile();
      if (file) {
        setError(null);
        onImageSelected(file);
      }
    }

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onImageSelected]);

  return (
    <div className="rounded-control border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
      Copy an image, then press Ctrl+V (Cmd+V on Mac) anywhere on this page.
      {error && (
        <p role="alert" className="mt-2 text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default ClipboardPaste;