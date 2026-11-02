import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side scene description via Gemini. Unlike Vision, Gemini can't
 * fetch an arbitrary image URL itself -- we download the image bytes here,
 * server-side, and send them inline as base64. The key never reaches the
 * browser either way.
 */
export async function POST(request: NextRequest) {
  const { imageUrl, targetLanguage } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Couldn't load the image to describe it." }, { status: 502 });
    }
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const base64 = buffer.toString("base64");

    // Written for the voice-first mode specifically: conversational and
    // descriptive, the way you'd describe a scene out loud to someone who
    // can't see it -- not a dry, technical caption.
    const prompt = `Describe this scene in ${targetLanguage || "English"} in two to three conversational sentences, the way you'd describe it out loud to someone who can't see it. Be specific and concrete, not generic.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }, { inline_data: { mime_type: contentType, data: base64 } }],
            },
          ],
        }),
      },
    );

    if (!geminiResponse.ok) {
      if (geminiResponse.status === 429) {
        return NextResponse.json({ error: "Too many requests right now. Wait a moment and try again." }, { status: 429 });
      }
      return NextResponse.json({ error: "The scene description service didn't respond. Try again." }, { status: 502 });
    }

    const data = await geminiResponse.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!description) {
      return NextResponse.json({ error: "Couldn't describe this image. Try a different photo." }, { status: 502 });
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error("[identify]", error);
    return NextResponse.json({ error: "Something went wrong describing the image. Try again." }, { status: 500 });
  }
}