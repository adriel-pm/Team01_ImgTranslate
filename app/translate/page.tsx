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
import Button from "@/components/ui/Button";
import { extractText } from "@/lib/ocr";
import { identifyScene } from "@/lib/identify";
import { translateOcrResult } from "@/lib/translate";
import { uploadImage } from "@/lib/storage";
import { getUserProfile } from "@/lib/firestore";
import useAuth from "@/hooks/useAuth";

import type { OCRResult, SceneDescription, TranslationResult, UserPreferences } from "@/lib/types";

function TranslatePage() {
  const { user } = useAuth();
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

  // Load the user's saved default target language once on mount, so the
  // picker starts on their preference rather than always resetting to English.
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

    // OCR and scene description are independent, so they still run together.
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

    // Translation depends on OCR's output, so it deliberately runs AFTER
    // the block above completes -- it cannot be part of the same
    // Promise.allSettled, unlike OCR and scene description.
    if (ocr && ocr.rawText.trim() && mode !== "objects-only") {
      try {
        const translation = await translateOcrResult(ocr, targetLanguage);
        setTranslationResult(translation);
      } catch (translateError) {
        setError((prev) => prev ?? (translateError instanceof Error ? translateError.message : "Couldn't translate the extracted text."));
      }
    }

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

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Translate</h1>
      <p className="mt-2 text-[15px] text-muted">
        Upload a photo, take one with your camera, or paste one from your clipboard.
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
    </main>
  );
}

export default TranslatePage;