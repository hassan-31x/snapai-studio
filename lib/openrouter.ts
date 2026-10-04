import "server-only";
import OpenAI from "openai";
import { brand } from "@/lib/brand";
export const textModel = () =>
  process.env.OPENROUTER_TEXT_MODEL || "google/gemini-2.5-flash-lite";
export const imageModel = () =>
  process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3.1-flash-lite-image";
export function getOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY)
    throw new Error(
      "Generation is not configured yet. Please try again later.",
    );
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: { "HTTP-Referer": brand.url, "X-Title": brand.name },
    timeout: 90_000,
    maxRetries: 0,
  });
}
export async function generateImage(
  prompt: string,
  references: string[],
  aspectRatio = "1:1",
) {
  if (!process.env.OPENROUTER_API_KEY)
    throw new Error(
      "Generation is not configured yet. Please try again later.",
    );
  const response = await fetch("https://openrouter.ai/api/v1/images", {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(90_000),
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": brand.url,
      "X-Title": brand.name,
    },
    body: JSON.stringify({
      model: imageModel(),
      prompt,
      n: 1,
      aspect_ratio: aspectRatio,
      input_references: references.map((url) => ({
        type: "image_url",
        image_url: { url },
      })),
      provider: { sort: "price" },
    }),
  });
  if (!response.ok) {
    console.error("OpenRouter image request failed", response.status);
    throw new Error(
      response.status === 429
        ? "The image service is busy. Please try again shortly."
        : "The image service could not complete your shot. Please try again.",
    );
  }
  const result = await response.json();
  const image = result.data?.[0];
  if (typeof image?.b64_json !== "string" || !image.b64_json.length)
    throw new Error("No image was returned. Please try a different prompt.");
  const mime = image.media_type || "image/png";
  if (!["image/png", "image/jpeg", "image/webp"].includes(mime))
    throw new Error("The image service returned an unsupported format");
  return Buffer.from(image.b64_json, "base64");
}
