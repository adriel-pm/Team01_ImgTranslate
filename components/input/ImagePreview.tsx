"use client";

import { useEffect, useState } from "react";

interface ImagePreviewProps {
  file: File | null;
  onRemove: () => void;
}

function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // avoid leaking memory on every new pick
  }, [file]);

  if (!file || !url) return null;

  return (
    <div className="mt-6">
      <img
        src={url}
        alt="Selected"
        className="max-h-80 w-full rounded-control border border-line object-contain"
      />
      <button onClick={onRemove} className="mt-2 text-sm text-muted underline underline-offset-2">
        Remove image
      </button>
    </div>
  );
}

export default ImagePreview;
