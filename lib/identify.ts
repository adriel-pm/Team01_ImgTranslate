import type { SceneDescription } from "@/lib/types";

export async function identifyScene(imageUrl: string, targetLanguage: string): Promise<SceneDescription> {
  const response = await fetch("/api/identify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl, targetLanguage }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Couldn't describe this image. Try again.");
  }

  return response.json();
}