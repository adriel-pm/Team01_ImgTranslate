import { NextRequest, NextResponse } from "next/server";

import type { OCRResult, TextBlock } from "@/lib/types";

const VISION_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";

/**
 * Server-side OCR. The Google Cloud API key never reaches the browser --
 * this route is the only thing that ever sees it. The client sends a
 * Firebase Storage download URL; Vision can read directly from that URL
 * via `imageUri`, so we never have to read or re-upload the image bytes
 * ourselves.
 */
export async function POST(request: NextRequest) {
  const { imageUrl } = await request.json();

  // Only accept images from our own Storage bucket. Without this, anyone could
  // point our API key at any URL on the internet and have us pay to OCR it.
  const allowedPrefix = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/`;
  if (typeof imageUrl !== "string" || !imageUrl.startsWith(allowedPrefix)) {
    return NextResponse.json({ error: "A valid image URL from our storage is required." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GOOGLE_CLOUD_API_KEY" }, { status: 500 });
  }

  try {
    const visionResponse = await fetch(`${VISION_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }),
    });

    if (!visionResponse.ok) {
      return NextResponse.json({ error: "The text-extraction service didn't respond. Try again." }, { status: 502 });
    }

    const data = await visionResponse.json();
    const annotation = data.responses?.[0];

    if (annotation?.error) {
      return NextResponse.json(
        { error: annotation.error.message || "The text-extraction service returned an error." },
        { status: 502 },
      );
    }

    const textAnnotations = annotation?.textAnnotations ?? [];

    // No text found is a valid, non-error result -- not every photo has text in it.
    if (textAnnotations.length === 0) {
      const empty: OCRResult = { rawText: "", blocks: [], detectedLanguage: null, overallConfidence: 0 };
      return NextResponse.json(empty);
    }

    // The first entry is the full block of text; everything after it is one
    // individual word/phrase with its own bounding box.
    const [full, ...words] = textAnnotations;

    const blocks: TextBlock[] = words.map((word: { description?: string; confidence?: number; boundingPoly?: { vertices?: { x?: number; y?: number }[] } }, index: number) => {
      const vertices = word.boundingPoly?.vertices ?? [];
      const xs = vertices.map((v) => v.x ?? 0);
      const ys = vertices.map((v) => v.y ?? 0);
      return {
        text: word.description ?? "",
        confidence: word.confidence ?? 1,
        blockIndex: index,
        position: {
          x: Math.min(...xs),
          y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        },
      };
    });

    const result: OCRResult = {
      rawText: full?.description ?? "",
      blocks,
      detectedLanguage: full?.locale ?? null,
      overallConfidence: blocks.length ? blocks.reduce((sum, b) => sum + b.confidence, 0) / blocks.length : 0,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ocr]", error);
    return NextResponse.json({ error: "Something went wrong extracting text. Try again." }, { status: 500 });
  }
}