"use server";
import { db } from "@/lib/db";
import { generateImage } from "@/lib/openrouter";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  requireUser,
  reserveCredits,
  settleCredits,
  refundCredits,
  rateLimit,
  actionError,
} from "@/lib/security";
import { objectIdSchema, imageCountSchema } from "@/lib/validation";
export interface GenerateVariationsParams {
  originalImageId: string;
  numberOfVariations: number;
  userId?: string;
}
export interface UpscaleImageParams {
  originalImageId: string;
  userId?: string;
}
export interface ImageVariationResponse {
  success: boolean;
  variations?: Array<{
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  }>;
  error?: string;
}
export interface ImageUpscaleResponse {
  success: boolean;
  upscaledImage?: {
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  };
  error?: string;
}
export async function generateImageVariations(
  params: GenerateVariationsParams,
): Promise<ImageVariationResponse> {
  let reserved: string | undefined;
  let userId: string | undefined;
  try {
    const user = await requireUser();
    userId = user.id;
    await rateLimit(`generate:${user.id}`, 3);
    const count = imageCountSchema.parse(params.numberOfVariations);
    const original = await db.productImage.findFirst({
      where: {
        id: objectIdSchema.parse(params.originalImageId),
        userId: user.id,
      },
    });
    if (!original) throw new Error("Image not found");
    reserved = await reserveCredits(user.id, count);
    const ratio =
      original.aspectRatio === "1536x1024"
        ? "3:2"
        : original.aspectRatio === "1024x1536"
          ? "2:3"
          : "1:1";
    const uploads: Awaited<ReturnType<typeof uploadToCloudinary>>[] = [];
    for (let i = 0; i < count; i++) {
      const bytes = await generateImage(
        `Create variation ${i + 1} of this product photograph. Keep product identity, labels, and proportions exact. Change lighting and camera angle. Direction: ${original.prompt}`,
        [original.originalImageUrl || original.imageUrl, original.imageUrl],
        ratio,
      );
      uploads.push(
        await uploadToCloudinary(bytes, { folder: "stillframe/variations" }),
      );
    }
    const variations = await db.$transaction(async (tx) => {
      await settleCredits(tx, reserved!);
      const saved = [];
      for (const upload of uploads)
        saved.push(
          await tx.productImage.create({
            data: {
              userId: user.id,
              generationId: original.generationId,
              prompt: original.prompt,
              scene: original.scene,
              aspectRatio: original.aspectRatio,
              imageUrl: upload.secure_url,
              imagePublicId: upload.public_id,
              type: "Variation",
              originalImageUrl: original.originalImageUrl,
              originalImagePublicId: original.originalImagePublicId,
            },
          }),
        );
      await tx.user.update({
        where: { id: user.id },
        data: { generatedImages: { increment: count } },
      });
      return saved;
    });
    reserved = undefined;
    return { success: true, variations };
  } catch (error) {
    if (reserved && userId) await refundCredits(userId, reserved);
    return { success: false, error: actionError(error) };
  }
}
// Do not misrepresent an AI redraw as an actual super-resolution operation.
export async function upscaleImage(
  _params: UpscaleImageParams,
): Promise<ImageUpscaleResponse> {
  await requireUser();
  return {
    success: false,
    error:
      "Upscaling is not available. Download your original image at full resolution.",
  };
}
