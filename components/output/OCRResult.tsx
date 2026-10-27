import type { OCRResult } from "@/lib/types";

interface OCRResultProps {
  result: OCRResult | null;
}

function OCRResultDisplay({ result }: OCRResultProps) {
  // Show nothing until OCR has returned a result.
  if (!result) return null;

  if (!result.rawText.trim()) {
    return (
      <section aria-label="OCR result" role="status" className="mt-6 rounded-control border border-line p-4">
        <h2 className="text-lg font-semibold">No text found</h2>
        <p className="mt-2 text-sm text-muted">
          Try a clearer image with readable text, good lighting, and less blur.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="OCR result" className="mt-6 rounded-control border border-line p-4">
      <h2 className="text-lg font-semibold">Extracted text</h2>
      {/* dir="auto" lets the browser pick left-to-right or right-to-left from the
          text itself, so Arabic or Hebrew results read correctly. */}
      <p dir="auto" className="mt-3 whitespace-pre-wrap break-words">
        {result.rawText}
      </p>
      {result.detectedLanguage && (
        <p className="mt-3 text-sm text-muted">Detected language: {result.detectedLanguage}</p>
      )}
    </section>
  );
}

export default OCRResultDisplay;