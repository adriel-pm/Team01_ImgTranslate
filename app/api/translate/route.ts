import { NextRequest, NextResponse } from "next/server";

import type { SegmentResult, TextBlock, TranslationResult } from "@/lib/types";

const TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

export async function POST(request: NextRequest) {
  const { text, blocks, targetLanguage, sourceLanguage } = await request.json();

  if (!text || !targetLanguage) {
    return NextResponse.json({ error: "text and targetLanguage are required" }, { status: 400 });
  }

  // Skip the API call entirely when source and target already match --
  // there's nothing to translate, and it saves a real API call every time.
  if (sourceLanguage && sourceLanguage === targetLanguage) {
    const identity: TranslationResult = {
      originalText: text,
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      segments: (blocks ?? []).map((b: TextBlock) => ({
        blockIndex: b.blockIndex,
        originalText: b.text,
        translatedText: b.text,
      })),
    };
    return NextResponse.json(identity);
  }

  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GOOGLE_CLOUD_API_KEY" }, { status: 500 });
  }

  try {
    // Batch the full text plus every individual block into ONE call --
    // translating each word with its own request would be slow and wasteful.
    // The API returns translations in the same order as the input array.
    const blockTexts: string[] = (blocks ?? []).map((b: TextBlock) => b.text);
    const queries = [text, ...blockTexts];

    const translateResponse = await fetch(`${TRANSLATE_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: queries,
        target: targetLanguage,
        source: sourceLanguage || undefined,
        format: "text",
      }),
    });

    if (!translateResponse.ok) {
      return NextResponse.json({ error: "The translation service didn't respond. Try again." }, { status: 502 });
    }

    const data = await translateResponse.json();
    const translations = data.data?.translations ?? [];

    if (translations.length === 0) {
      return NextResponse.json({ error: "Couldn't translate this text. Try again." }, { status: 502 });
    }

    const [fullTranslation, ...blockTranslations] = translations;
    const detectedSource = fullTranslation.detectedSourceLanguage || sourceLanguage || "unknown";

    const segments: SegmentResult[] = (blocks ?? []).map((b: TextBlock, index: number) => ({
      blockIndex: b.blockIndex,
      originalText: b.text,
      translatedText: blockTranslations[index]?.translatedText ?? b.text,
    }));

    const result: TranslationResult = {
      originalText: text,
      translatedText: fullTranslation.translatedText,
      sourceLanguage: detectedSource,
      targetLanguage,
      segments,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[translate]", error);
    return NextResponse.json({ error: "Something went wrong translating. Try again." }, { status: 500 });
  }
}