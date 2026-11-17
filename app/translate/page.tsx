"use client";

import { useEffect, useState } from "react";

import ImageInputTabs from "@/components/input/ImageInputTabs";
import ImagePreview from "@/components/input/ImagePreview";
import ModeToggle from "@/components/input/ModeToggle";
import LanguagePicker from "@/components/input/LanguagePicker";
import OCRResultDisplay from "@/components/output/OCRResult";
import BoundingBoxOverlay from "@/components/output/BoundingBoxOverlay";
import ObjectDescription from "@/components/output/ObjectDescription";
import TranslationResultDisplay from "@/components/output/TranslationResult";
import LiveAnnouncer from "@/components/accessibility/LiveAnnouncer";
import Button from "@/components/ui/Button";
import { extractText } from "@/lib/ocr";
import { identifyScene } from "@/lib/identify";
import { translateOcrResult } from "@/lib/translate";
import { uploadImage } from "@/lib/storage";
import { getUserProfile } from "@/lib/firestore";
import useAuth from "@/hooks/useAuth";
import useTTS from "@/hooks/useTTS";

import type { OCRResult, SceneDescription, TranslationResult, UserPreferences } from "@/lib/types";

function TranslatePage() {
  const { user } = useAuth();
  const { speak, stop } = useTTS();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [mode, setMode] = useState<UserPreferences["mode"]>("auto");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneDescription | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((profile) => {
      if (profile?.defaultTargetLang) setTargetLanguage(profile.defaultTargetLang);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedFile) {
      setImageDims({ width: 0, height: 0 });
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    img.onload = () => setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  async function handleImageSelected(file: File) {
    setSelectedFile(file);
    setOcrResult(null);
    setTranslationResult(null);
    setSceneResult(null);
    setError(null);

    if (user) {
      try {
        const url = await uploadImage(file, user.uid);
        setImageUrl(url);
      } catch {
        setError("The image was selected but couldn't be saved. Try again.");
      }
    }
  }

  async function handleExtract() {
    if (!imageUrl) return;
    setIsExtracting(true);
    setError(null);
    setOcrResult(null);
    setTranslationResult(null);
    setSceneResult(null);
    setAnnouncement("Processing image");

    const runOcr = mode !== "objects-only" ? extractText(imageUrl) : Promise.resolve(null);
    const runScene = mode !== "text-only" ? identifyScene(imageUrl, targetLanguage) : Promise.resolve(null);

    const [ocrOutcome, sceneOutcome] = await Promise.allSettled([runOcr, runScene]);

    let ocr: OCRResult | null = null;
    if (ocrOutcome.status === "fulfilled") {
      ocr = ocrOutcome.value;
      setOcrResult(ocr);
    }
    if (sceneOutcome.status === "fulfilled") setSceneResult(sceneOutcome.value);

    const ocrFailed = ocrOutcome.status === "rejected";
    const sceneFailed = sceneOutcome.status === "rejected";

    if ((mode === "auto" && ocrFailed && sceneFailed) || (mode === "text-only" && ocrFailed) || (mode === "objects-only" && sceneFailed)) {
      setError("Couldn't process this image. Try again.");
      setAnnouncement("Processing failed");
      setIsExtracting(false);
      return;
    }
    if (mode === "auto" && (ocrFailed || sceneFailed)) {
      setError(
        ocrFailed
          ? "Text extraction failed, but the scene description below still worked."
          : "Scene description failed, but the extracted text below still worked.",
      );
    }

    if (ocr && ocr.rawText.trim() && mode !== "objects-only") {
      try {
        const translation = await translateOcrResult(ocr, targetLanguage);
        setTranslationResult(translation);
      } catch (translateError) {
        setError((prev) => prev ?? (translateError instanceof Error ? translateError.message : "Couldn't translate the extracted text."));
      }
    }

    setAnnouncement("Results ready");
    setIsExtracting(false);
  }

  function handleRemove() {
    setSelectedFile(null);
    setImageUrl(null);
    setOcrResult(null);
    setTranslationResult(null);
    setSceneResult(null);
    setError(null);
  }

  // Space = extract, Escape = stop any speech in progress, R = re-read the
  // best available result. Skipped entirely while focus is in a form field,
  // so typing a letter "r" in, say, a future notes field doesn't trigger it.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isTyping = ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
      if (isTyping) return;

      if (event.code === "Space" && selectedFile && imageUrl && !isExtracting) {
        event.preventDefault();
        handleExtract();
      } else if (event.key === "Escape") {
        stop();
      } else if (event.key.toLowerCase() === "r") {
        const lastText = translationResult?.translatedText ?? ocrResult?.rawText ?? sceneResult?.description;
        if (lastText) speak(lastText, translationResult?.targetLanguage ?? "en-US");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, imageUrl, isExtracting, translationResult, ocrResult, sceneResult]);

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Translate</h1>
      <p className="mt-2 text-[15px] text-muted">
        Upload a photo, take one with your camera, or paste one from your clipboard. Press Space to
        extract, R to re-read the result, Escape to stop reading.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ModeToggle mode={mode} onChange={setMode} />
        <LanguagePicker targetLanguage={targetLanguage} onChange={setTargetLanguage} />
      </div>

      <div className="mt-8">
        <ImageInputTabs onImageSelected={handleImageSelected} />
        <div className="relative">
          <ImagePreview file={selectedFile} onRemove={handleRemove} />
          {selectedFile && mode !== "objects-only" && (
            <BoundingBoxOverlay blocks={ocrResult?.blocks ?? []} imageWidth={imageDims.width} imageHeight={imageDims.height} />
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 max-w-xs">
          <Button onClick={handleExtract} disabled={!imageUrl || isExtracting} isLoading={isExtracting} loadingLabel="Processing">
            Extract Text
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      {mode !== "objects-only" &&
        (translationResult ? (
          <TranslationResultDisplay result={translationResult} />
        ) : (
          <OCRResultDisplay result={ocrResult} />
        ))}
      {mode !== "text-only" && <ObjectDescription result={sceneResult} />}

      <LiveAnnouncer message={announcement} />
    </main>
  );
}

export default TranslatePage;