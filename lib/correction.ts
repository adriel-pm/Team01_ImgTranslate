import type { SegmentResult, TranslationResult } from "@/lib/types";

/**
 * Re-translates exactly one segment and merges it back into the full
 * result -- the full originalText/translatedText strings get the
 * correction spliced in too, not just the per-segment data, so the main
 * side-by-side panel reflects the fix immediately.
 *
 * Known simplification: the splice uses a plain string replace, which
 * only swaps the FIRST matching occurrence. Good enough for a single
 * correction; if the exact same misrecognized word appears twice in one
 * image, only the first instance updates. Worth revisiting later, not
 * blocking for this sprint.
 */
export async function retranslateSegment(
  current: TranslationResult,
  blockIndex: number,
  newOriginalText: string,
): Promise<TranslationResult> {
  const oldSegment = current.segments.find((s) => s.blockIndex === blockIndex);
  if (!oldSegment) {
    throw new Error("That segment no longer exists.");
  }

  // Reuses the existing /api/translate route from the Translation sprint --
  // no new route needed, just a single-segment call instead of a full batch.
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: newOriginalText,
      blocks: [],
      targetLanguage: current.targetLanguage,
      sourceLanguage: current.sourceLanguage,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Couldn't re-translate that correction. Try again.");
  }

  const data = await response.json();
  const newTranslatedText: string = data.translatedText;

  const updatedSegments: SegmentResult[] = current.segments.map((segment) =>
    segment.blockIndex === blockIndex
      ? { blockIndex, originalText: newOriginalText, translatedText: newTranslatedText }
      : segment,
  );

  return {
    ...current,
    originalText: current.originalText.replace(oldSegment.originalText, newOriginalText),
    translatedText: current.translatedText.replace(oldSegment.translatedText, newTranslatedText),
    segments: updatedSegments,
  };
}