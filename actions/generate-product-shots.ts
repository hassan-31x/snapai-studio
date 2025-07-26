"use server"

import { db } from "@/lib/db";
import { generateProductShots, ProductShotGenerationResponse } from "@/utils/generateProductShots";
import { getUserById } from "@/utils/user";
import { createGeneration, updateGenerationStatus } from "@/utils/generations";
import { GenerationType, GenerationStatus } from "@prisma/client";

export interface ProductShotFormData {
  userId: string;
  prompt: string;
  aspectRatio: string;
  scene: string;
  numberOfImages: number;
  productImage: File;
  similarImages?: File[];
  generationId?: string; // For adding more images to existing generation
}

// Server action to handle product shot generation
export async function generateProductShotsAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const user = await getUserById(userId);

    if (!user) {
      return { error: "User not found" };
    }

    console.log("User:", user);

    if (user.generatedImages >= 10) { // Allow more for product shots
      return { error: "You have reached the maximum number of generated images" };
    }

    // Extract form data
    const prompt = formData.get("prompt") as string || "";
    const aspectRatio = formData.get("aspectRatio") as string || "1024x1024";
    const scene = formData.get("scene") as string || "";
    const numberOfImages = parseInt(formData.get("numberOfImages") as string) || 1;
    const productImage = formData.get("productImage") as File;
    const existingGenerationId = formData.get("generationId") as string;

    // Extract similar images if any
    const similarImages: File[] = [];
    let i = 0;
    while (formData.get(`similarImage_${i}`)) {
      similarImages.push(formData.get(`similarImage_${i}`) as File);
      i++;
    }

    console.log("Product shot form data received:", {
      prompt,
      aspectRatio,
      scene,
      numberOfImages,
      hasProductImage: !!productImage,
      similarImagesCount: similarImages.length,
      existingGenerationId
    });

    if (!productImage) {
      return { error: "Product image is required" };
    }

    if (!prompt.trim()) {
      return { error: "Prompt is required" };
    }

    // Create or get existing generation
    let generationId = existingGenerationId;
    if (!generationId) {
      const generation = await createGeneration({
        userId,
        type: GenerationType.PRODUCT_SHOT,
        prompt,
        aspectRatio,
        scene,
        numberOfImages,
      });
      generationId = generation.id;
    }

    // Update status to in progress
    await updateGenerationStatus(generationId, GenerationStatus.IN_PROGRESS);

    // Generate product shots
    const response = await generateProductShots({
      prompt,
      aspectRatio,
      scene,
      numberOfImages,
      productImage,
      similarImages
    });

    // Save product images in database linked to generation
    const savedImages = await Promise.all(
      response.generatedImages.map(async (image) => {
        const savedImage = await db.productImage.create({
          data: {
            userId: user.id,
            generationId,
            prompt: image.prompt,
            aspectRatio: image.aspectRatio,
            scene: image.scene,
            imageUrl: image.imageUrl,
            imagePublicId: image.publicId,
            type: "Original",
            originalImageUrl: response.originalImage?.url || "",
            originalImagePublicId: response.originalImage?.publicId || "",
          }
        });
        
        return {
          id: savedImage.id,
          imageUrl: savedImage.imageUrl,
          prompt: savedImage.prompt,
          aspectRatio: savedImage.aspectRatio,
          scene: savedImage.scene,
          publicId: savedImage.imagePublicId
        };
      })
    );

    // Update generation with original image info if not already set
    if (!existingGenerationId && response.originalImage) {
      await db.generation.update({
        where: { id: generationId },
        data: {
          originalImageUrl: response.originalImage.url,
          originalImagePublicId: response.originalImage.publicId,
        }
      });
    }

    // Update user's generated images count
    await db.user.update({
      where: { id: user.id },
      data: { generatedImages: { increment: numberOfImages } }
    });

    // Update status to completed
    await updateGenerationStatus(generationId, GenerationStatus.COMPLETED);

    return {
      success: true,
      generationId,
      images: savedImages,
      originalImage: response.originalImage
    };

  } catch (error) {
    console.error("Error in generateProductShotsAction:", error);
    
    // If we have a generationId, mark it as failed
    const generationId = formData.get("generationId") as string;
    if (generationId) {
      try {
        await updateGenerationStatus(generationId, GenerationStatus.FAILED);
      } catch (updateError) {
        console.error("Error updating generation status to failed:", updateError);
      }
    }
    
    return {
      success: false,
      error: "Failed to generate product shots. Please try again."
    };
  }
}
