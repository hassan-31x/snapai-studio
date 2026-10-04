import { z } from "zod";
export const objectIdSchema = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, "Invalid project ID");
export const promptSchema = z
  .string()
  .trim()
  .min(10, "Describe your shot in at least 10 characters")
  .max(2000);
export const imageCountSchema = z.coerce.number().int().min(1).max(4);
export const aspectRatioSchema = z.enum([
  "1024x1024",
  "1536x1024",
  "1024x1536",
]);
export function validateImage(file: unknown): asserts file is File {
  if (!(file instanceof File) || !file.size)
    throw new Error("Upload a product photo first");
  if (file.size > 3 * 1024 * 1024)
    throw new Error("Images must be smaller than 3 MB");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Use a JPG, PNG, or WebP image");
}
export async function imageDataUrl(file: File) {
  validateImage(file);
  const bytes = Buffer.from(await file.arrayBuffer());
  const valid =
    file.type === "image/png"
      ? bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : file.type === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP";
  if (!valid) throw new Error("This file is not a valid image");
  return `data:${file.type};base64,${bytes.toString("base64")}`;
}
