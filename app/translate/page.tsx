"use client";

import { useState } from "react";

import ImageInputTabs from "@/components/input/ImageInputTabs";
import ImagePreview from "@/components/input/ImagePreview";
import Button from "@/components/ui/Button";

function TranslatePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Translate</h1>
      <p className="mt-2 text-[15px] text-muted">
        Upload a photo, take one with your camera, or paste one from your clipboard.
      </p>

      <div className="mt-8">
        <ImageInputTabs onImageSelected={setSelectedFile} />
        <ImagePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
      </div>

      {selectedFile && (
        <div className="mt-6 max-w-xs">
          <Button disabled>Extract Text (coming in a future sprint)</Button>
        </div>
      )}
    </main>
  );
}

export default TranslatePage;