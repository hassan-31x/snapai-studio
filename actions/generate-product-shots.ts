"use server";
import { db } from "@/lib/db";
import { generateProductShots } from "@/utils/generateProductShots";
import {
  requireUser,
  reserveCredits,
  settleCredits,
  refundCredits,
  rateLimit,
  actionError,
} from "@/lib/security";
import {
  promptSchema,
  imageCountSchema,
  aspectRatioSchema,
  objectIdSchema,
  validateImage,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";
export async function generateProductShotsAction(formData: FormData) {
  let generationId: string | undefined;
  let reserved: string | undefined;
  let userId: string | undefined;
  try {
    const user = await requireUser();
    userId = user.id;
    await rateLimit(`generate:${user.id}`, 3);
    const prompt = promptSchema.parse(formData.get("prompt"));
    const numberOfImages = imageCountSchema.parse(
      formData.get("numberOfImages") || 1,
    );
    const aspectRatio = aspectRatioSchema.parse(
      formData.get("aspectRatio") || "1024x1024",
    );
    const scene = String(formData.get("scene") || "studio").slice(0, 100);
    const productImage = formData.get("productImage");
    validateImage(productImage);
    const similarImages: File[] = [];
    for (let i = 0; i < 3; i++) {
      const file = formData.get(`similarImage_${i}`);
      if (file) {
        validateImage(file);
        similarImages.push(file);
      }
    }
    const existingId = formData.get("generationId");
    if (existingId) {
      const id = objectIdSchema.parse(existingId);
      const existing = await db.generation.findFirst({
        where: { id, userId: user.id, type: "PRODUCT_SHOT" },
      });
      if (!existing) throw new Error("Project not found");
      if (existing.status === "IN_PROGRESS")
        throw new Error("This project is already generating. Please wait.");
      generationId = existing.id;
    }
    reserved = await reserveCredits(user.id, numberOfImages);
    if (!generationId) {
      const generation = await db.generation.create({
        data: {
          userId: user.id,
          type: "PRODUCT_SHOT",
          prompt,
          scene,
          aspectRatio,
          numberOfImages,
          status: "IN_PROGRESS",
        },
      });
      generationId = generation.id;
    } else {
      const claim = await db.generation.updateMany({
        where: {
          id: generationId,
          userId: user.id,
          status: { not: "IN_PROGRESS" },
        },
        data: { status: "IN_PROGRESS" },
      });
      if (!claim.count) {
        generationId = undefined;
        throw new Error("This project is already generating. Please wait.");
      }
    }
    const response = await generateProductShots({
      prompt,
      scene,
      aspectRatio,
      numberOfImages,
      productImage,
      similarImages,
    });
    const id = generationId;
    const images = await db.$transaction(async (tx) => {
      await settleCredits(tx, reserved!);
      const saved = [];
      for (const image of response.generatedImages)
        saved.push(
          await tx.productImage.create({
            data: {
              userId: user.id,
              generationId: id,
              prompt,
              aspectRatio,
              scene,
              imageUrl: image.imageUrl,
              imagePublicId: image.publicId,
              type: "Original",
              originalImageUrl: response.originalImage?.url,
              originalImagePublicId: response.originalImage?.publicId,
            },
          }),
        );
      await tx.user.update({
        where: { id: user.id },
        data: { generatedImages: { increment: saved.length } },
      });
      await tx.generation.update({
        where: { id },
        data: {
          status: "COMPLETED",
          originalImageUrl: response.originalImage?.url,
          originalImagePublicId: response.originalImage?.publicId,
        },
      });
      return saved;
    });
    reserved = undefined;
    revalidatePath("/dashboard");
    revalidatePath("/submissions");
    return {
      success: true,
      generationId,
      images,
      originalImage: response.originalImage,
    };
  } catch (error) {
    if (reserved && userId) await refundCredits(userId, reserved);
    if (generationId)
      await db.generation.update({
        where: { id: generationId },
        data: { status: "FAILED" },
      });
    return { success: false, error: actionError(error) };
  }
}
