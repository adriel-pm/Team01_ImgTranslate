"use client";

import { useState } from "react";

import FileUpload from "@/components/input/FileUpload";
import CameraCapture from "@/components/input/CameraCapture";
import ClipboardPaste from "@/components/input/ClipboardPaste";

type InputTab = "upload" | "camera" | "paste";

interface ImageInputTabsProps {
  onImageSelected: (file: File) => void;
}

function ImageInputTabs({ onImageSelected }: ImageInputTabsProps) {
  const [tab, setTab] = useState<InputTab>("upload");

  const tabs: { id: InputTab; label: string }[] = [
    { id: "upload", label: "Upload" },
    { id: "camera", label: "Camera" },
    { id: "paste", label: "Paste" },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Choose how to add an image" className="flex gap-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-touch px-4 py-2 text-sm font-medium ${
              tab === t.id ? "border-b-2 border-accent text-ink" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "upload" && <FileUpload onImageSelected={onImageSelected} />}
        {tab === "camera" && <CameraCapture onImageSelected={onImageSelected} />}
        {tab === "paste" && <ClipboardPaste onImageSelected={onImageSelected} />}
      </div>
    </div>
  );
}

export default ImageInputTabs;