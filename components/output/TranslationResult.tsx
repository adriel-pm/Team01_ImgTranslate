import type { TranslationResult } from "@/lib/types";

interface TranslationResultProps {
  result: TranslationResult | null;
}

function TranslationResultDisplay({ result }: TranslationResultProps) {
  if (!result) return null;

  const isSameLanguage = result.sourceLanguage === result.targetLanguage;

  return (
    <div className="mt-6">
      <h2 className="text-sm font-medium text-ink">Translation</h2>

      {isSameLanguage ? (
        <p className="mt-2 text-sm text-muted">
          Already in {result.targetLanguage.toUpperCase()} — no translation needed.
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted">
          Detected: {result.sourceLanguage.toUpperCase()} → {result.targetLanguage.toUpperCase()}
        </p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-control border border-line bg-wash px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Original</p>
          <p className="mt-1 whitespace-pre-wrap text-[15px] text-ink">{result.originalText}</p>
        </div>
        <div className="rounded-control border border-line bg-wash px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Translated</p>
          <p className="mt-1 whitespace-pre-wrap text-[15px] text-ink">{result.translatedText}</p>
        </div>
      </div>
    </div>
  );
}

export default TranslationResultDisplay;