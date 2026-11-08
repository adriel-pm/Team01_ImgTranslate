import type { OCRResult, TranslationResult } from "@/lib/types";

export async function translateOcrResult(
  ocrResult: OCRResult,
  targetLanguage: string,
): Promise<TranslationResult> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: ocrResult.rawText,
      blocks: ocrResult.blocks,
      targetLanguage,
      sourceLanguage: ocrResult.detectedLanguage ?? undefined,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Couldn't translate this text. Try again.");
  }

  return response.json();
}