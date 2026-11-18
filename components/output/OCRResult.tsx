import SpeakButton from "@/components/accessibility/SpeakButton";

import type { OCRResult } from "@/lib/types";

interface OCRResultProps {
  result: OCRResult | null;
}

function OCRResultDisplay({ result }: OCRResultProps) {
  if (!result) return null;

  if (!result.rawText.trim()) {
    return (
      <div className="mt-6 rounded-control border border-line bg-wash px-4 py-6 text-center">
        <p className="text-sm font-medium text-ink">No text found in this image.</p>
        <p className="mt-1 text-sm text-muted">Try a clearer photo, or crop closer to the text.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-ink">Extracted text</h2>
        <SpeakButton text={result.rawText} lang={result.detectedLanguage ?? "en-US"} />
      </div>
      <p className="mt-2 whitespace-pre-wrap rounded-control border border-line bg-wash px-4 py-3 text-[15px] text-ink">
        {result.rawText}
      </p>
      {result.detectedLanguage && (
        <p className="mt-2 text-sm text-muted">Detected language: {result.detectedLanguage}</p>
      )}
    </div>
  );
}

export default OCRResultDisplay;