import type { OCRResult } from "@/lib/types";

interface OCRResultDisplayProps {
  result: OCRResult | null;
}

export default function OCRResultDisplay({
  result,
}: OCRResultDisplayProps) {
  // Show nothing until OCR has returned a result.
  if (!result) return null;

  if (!result.rawText.trim()) {
    return (
      <section
        aria-label="OCR result"
        role="status"
        className="rounded-control border border-line p-4"
      >
        <h2 className="text-lg font-semibold">No text found</h2>
        <p className="mt-2 text-sm text-muted">
          Try a clearer image with readable text, good lighting,
          and less blur.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="OCR result"
      className="rounded-control border border-line p-4"
    >
      <h2 className="text-lg font-semibold">Extracted text</h2>
      <p
        dir="auto"
        className="mt-3 whitespace-pre-wrap break-words"
      >
        {result.rawText}
      </p>
    </section>
  );
}
