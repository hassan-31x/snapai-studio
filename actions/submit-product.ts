"use server";

import {
  requireUser,
  reserveCredits,
  settleCredits,
  refundCredits,
  rateLimit,
  actionError,
} from "@/lib/security";
import { validateImage, objectIdSchema } from "@/lib/validation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  generateCreativeAssets,
  CreativeAssetsResponse,
} from "@/utils/generateCreativeAssets";
import {
  generateImages,
  ImageGenerationResponse,
} from "@/utils/generateImages";
import { getUserByEmail, getUserById } from "@/utils/user";
import { createGeneration, updateGenerationStatus } from "@/utils/generations";
import { GenerationType, GenerationStatus } from "@prisma/client";

// Server action to handle product submission and generate AI creatives
export async function submitProductAction(formData: FormData) {
  let generationId: string | undefined;
  let userId: string | undefined;
  let reserved: string | undefined;
  try {
    const user = await requireUser();
    userId = user.id;
    await rateLimit(`generate:${user.id}`, 3);
    // Extract all form data
    const productName = (formData.get("productName") as string) || "";
    const productTagline = (formData.get("productTagline") as string) || "";
    const productCategory = (formData.get("productCategory") as string) || "";
    const highlightedBenefit =
      (formData.get("highlightedBenefit") as string) || "";
    const productDescription =
      (formData.get("productDescription") as string) || "";

    // Advanced fields
    const brandName = (formData.get("brandName") as string) || productName;
    const brandTone =
      (formData.get("brandTone") as string) || "Clean and considered";
    const colorTheme = (formData.get("colorTheme") as string) || "";
    const backgroundStyle = (formData.get("backgroundStyle") as string) || "";
    const lightingStyle = (formData.get("lightingStyle") as string) || "";
    const productPlacement = (formData.get("productPlacement") as string) || "";
    const typographyStyle = (formData.get("typographyStyle") as string) || "";
    const compositionGuidelines =
      (formData.get("compositionGuidelines") as string) || "";

    // Extract product image if available
    const productImage = formData.get("productImage") as File | null;
    const existingGenerationId = formData.get("generationId") as string;

    z.string().trim().min(1).max(100).parse(productName);
    z.string().trim().min(1).max(100).parse(productCategory);
    validateImage(productImage);
    for (const value of formData.values())
      if (typeof value === "string" && value.length > 2000)
        throw new Error("Keep each field shorter than 2000 characters");
    if (existingGenerationId) {
      objectIdSchema.parse(existingGenerationId);
      const existing = await db.generation.findFirst({
        where: {
          id: existingGenerationId,
          userId: user.id,
          type: "AD_CREATIVE",
        },
      });
      if (!existing) throw new Error("Project not found");
      if (existing.status === "IN_PROGRESS")
        throw new Error("This project is already generating");
    }
    reserved = await reserveCredits(user.id, 5);
    if (existingGenerationId) {
      const claim = await db.generation.updateMany({
        where: {
          id: existingGenerationId,
          userId: user.id,
          status: { not: "IN_PROGRESS" },
        },
        data: { status: "IN_PROGRESS" },
      });
      if (!claim.count) throw new Error("This project is already generating");
      generationId = existingGenerationId;
    } else {
      const generation = await createGeneration({
        userId: user.id,
        type: GenerationType.AD_CREATIVE,
        productName,
        productTagline,
        productCategory,
        highlightedBenefit,
        productDescription,
        brandName,
        brandTone,
        colorTheme,
        backgroundStyle,
        lightingStyle,
        productPlacement,
        typographyStyle,
        compositionGuidelines,
        numberOfImages: 5,
      });
      generationId = generation.id;
    }
    // Update status to in progress
    await updateGenerationStatus(generationId, GenerationStatus.IN_PROGRESS);

    // Prepare product data object to pass to image generation
    const productData = {
      productName,
      productDescription,
      productTagline,
      brandName,
      brandTone,
      productCategory,
      highlightedBenefit,
      colorTheme,
      backgroundStyle,
      lightingStyle,
      productPlacement,
      typographyStyle,
      compositionGuidelines,
    };

    // Step 1: Generate creative assets using OpenRouter

    // Generate real creative assets using OpenRouter
    const creativeAssets = await generateCreativeAssets({
      productName,
      productTagline,
      brandName,
      brandTone,
      productCategory,
      highlightedBenefit,
    });

    // Log the generated assets

    // Step 2: Generate images based on the creative assets
    const imageResponse = await generateImages(
      creativeAssets,
      productData,
      productImage,
    );
    const { generatedImages, originalImage } = imageResponse;

    // Save submission in DB with Cloudinary URLs and public IDs, linked to generation
    const submission = await db.$transaction(async (tx) => {
      await settleCredits(tx, reserved!);
      const saved = await tx.submission.create({
        data: {
          userId: user.id,
          generationId,
          productName,
          productTagline,
          productCategory,
          highlightedBenefit,
          productDescription,
          brandName,
          brandTone,
          colorTheme,
          backgroundStyle,
          lightingStyle,
          productPlacement,
          typographyStyle,
          compositionGuidelines,

          // Original uploaded image
          originalImageUrl: originalImage?.url || "",
          originalImagePublicId: originalImage?.publicId || "",

          // Generated creative images
          instagramPostImageUrl:
            generatedImages.find((img: any) => img.type === "instagram_post")
              ?.imageUrl || "",
          instagramPostImagePublicId:
            generatedImages.find((img: any) => img.type === "instagram_post")
              ?.publicId || "",
          instagramStoryImageUrl:
            generatedImages.find((img: any) => img.type === "instagram_story")
              ?.imageUrl || "",
          instagramStoryImagePublicId:
            generatedImages.find((img: any) => img.type === "instagram_story")
              ?.publicId || "",
          facebookPostImageUrl:
            generatedImages.find((img: any) => img.type === "facebook_post")
              ?.imageUrl || "",
          facebookPostImagePublicId:
            generatedImages.find((img: any) => img.type === "facebook_post")
              ?.publicId || "",
          linkedinPostImageUrl:
            generatedImages.find((img: any) => img.type === "linkedin_post")
              ?.imageUrl || "",
          linkedinPostImagePublicId:
            generatedImages.find((img: any) => img.type === "linkedin_post")
              ?.publicId || "",
          websiteBannerImageUrl:
            generatedImages.find((img: any) => img.type === "website_banner")
              ?.imageUrl || "",
          websiteBannerImagePublicId:
            generatedImages.find((img: any) => img.type === "website_banner")
              ?.publicId || "",
        },
      });

      await tx.generation.update({
        where: { id: generationId! },
        data: {
          status: "COMPLETED",
          originalImageUrl: originalImage?.url,
          originalImagePublicId: originalImage?.publicId,
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { generatedImages: { increment: generatedImages.length } },
      });
      return saved;
    });
    reserved = undefined;
    revalidatePath("/dashboard");
    revalidatePath("/submissions");
    // Return the generated images and submission id to the frontend
    return {
      success: true,
      generationId,
      creatives: generatedImages,
      submissionId: submission.id,
    };
  } catch (error) {
    if (reserved && userId) await refundCredits(userId, reserved);
    if (generationId)
      await updateGenerationStatus(generationId, GenerationStatus.FAILED);
    return { success: false, error: actionError(error) };
  }
}
