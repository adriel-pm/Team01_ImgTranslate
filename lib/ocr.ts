import type { OCRResult } from "@/lib/types";

export async function extractText(imageUrl: string): Promise<OCRResult> {
  const response = await fetch("/api/ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Couldn't extract text from that image. Try again.");
  }

  return response.json();
}