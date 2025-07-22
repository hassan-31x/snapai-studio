"use server"

import { db } from "@/lib/db";
import { generateProductShots, ProductShotGenerationResponse } from "@/utils/generateProductShots";
import { getUserById } from "@/utils/user";

export interface ProductShotFormData {
  userId: string;
  prompt: string;
  aspectRatio: string;
  scene: string;
  numberOfImages: number;
  productImage: File;
  similarImages?: File[];
}

// Server action to handle product shot generation
export async function generateProductShotsAction(formData: FormData) {
  try {
    const user = await getUserById(formData.get("userId") as string);

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
      similarImagesCount: similarImages.length
    });

    if (!productImage) {
      return { error: "Product image is required" };
    }

    if (!prompt.trim()) {
      return { error: "Prompt is required" };
    }

    // Generate product shots
    const response = await generateProductShots({
      prompt,
      aspectRatio,
      scene,
      numberOfImages,
      productImage,
      similarImages
    });

    // Save product images in database
    const productImagePromises = response.generatedImages.map(async (image: any) => {
      return db.productImage.create({
        data: {
          userId: user.id,
          prompt,
          aspectRatio,
          scene,
          imageUrl: image.imageUrl,
          imagePublicId: image.publicId,
          type: "Variation",
          originalImageUrl: response.originalImage?.url || "",
          originalImagePublicId: response.originalImage?.publicId || "",
        }
      });
    });

    await Promise.all(productImagePromises);

    // Update user's generated images count
    await db.user.update({
      where: { id: user.id },
      data: { generatedImages: { increment: numberOfImages } }
    });

    return {
      success: true,
      images: response.generatedImages,
      originalImage: response.originalImage
    };

  } catch (error) {
    console.error("Error in generateProductShotsAction:", error);
    return {
      success: false,
      error: "Failed to generate product shots. Please try again."
    };
  }
}
