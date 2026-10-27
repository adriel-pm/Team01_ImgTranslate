"use client";

import { useEffect, useRef, useState } from "react";

import ImageInputTabs from "@/components/input/ImageInputTabs";
import ImagePreview from "@/components/input/ImagePreview";
import OCRResultDisplay from "@/components/output/OCRResult";
import BoundingBoxOverlay from "@/components/output/BoundingBoxOverlay";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { extractText } from "@/lib/ocr";
import { uploadImage } from "@/lib/storage";

import type { OCRResult } from "@/lib/types";

function TranslatePage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WHY a counter: saving and extracting are async, so a slow save for image A
  // can finish after the user has already picked image B (or removed A). Every
  // selection and removal bumps this id, and a result is only applied if its id
  // is still the latest.
  const selectionIdRef = useRef(0);

  // Read the image's natural pixel size ourselves, rather than modifying
  // ImagePreview -- keeps this story from touching a file someone else owns.
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
    const selectionId = ++selectionIdRef.current;
    setSelectedFile(file);
    setImageUrl(null); // never let Extract run against the previous image
    setOcrResult(null);
    setError(null);

    if (!user) return;

    setIsPreparing(true);
    try {
      // uploadImage chooses expiring/ or kept/ from the user's setting
      // (guests are always expiring/).
      const url = await uploadImage(file, user.uid);
      if (selectionId === selectionIdRef.current) setImageUrl(url);
    } catch (uploadError) {
      console.error("[translate] could not save image", uploadError);
      if (selectionId === selectionIdRef.current) {
        setError("We couldn't prepare that image for text extraction. Remove it and try again.");
      }
    } finally {
      if (selectionId === selectionIdRef.current) setIsPreparing(false);
    }
  }

  async function handleExtract() {
    if (!imageUrl) return;
    const selectionId = selectionIdRef.current;
    setIsExtracting(true);
    setError(null);
    try {
      const result = await extractText(imageUrl);
      if (selectionId === selectionIdRef.current) setOcrResult(result);
    } catch (err) {
      if (selectionId === selectionIdRef.current) {
        setError(err instanceof Error ? err.message : "Couldn't extract text. Try again.");
      }
    } finally {
      setIsExtracting(false);
    }
  }

  function handleRemove() {
    selectionIdRef.current++; // invalidates any save or extraction still in flight
    setSelectedFile(null);
    setImageUrl(null);
    setOcrResult(null);
    setIsPreparing(false);
    setError(null);
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Translate</h1>
      <p className="mt-2 text-[15px] text-muted">
        Upload a photo, take one with your camera, or paste one from your clipboard.
      </p>

      <div className="mt-8">
        <ImageInputTabs onImageSelected={handleImageSelected} />

        <div className="relative">
          <ImagePreview file={selectedFile} onRemove={handleRemove} />
          {selectedFile && (
            <BoundingBoxOverlay
              blocks={ocrResult?.blocks ?? []}
              imageWidth={imageDims.width}
              imageHeight={imageDims.height}
            />
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 max-w-xs">
          <Button
            onClick={handleExtract}
            disabled={!imageUrl}
            isLoading={isPreparing || isExtracting}
            loadingLabel={isPreparing ? "Preparing image" : "Extracting text"}
          >
            Extract Text
          </Button>
          {isPreparing && (
            <p role="status" className="mt-2 text-sm text-muted">
              Preparing your image…
            </p>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      <OCRResultDisplay result={ocrResult} />
    </main>
  );
}

export default TranslatePage;
