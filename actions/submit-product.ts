"use server"

import { db } from "@/lib/db";
import { generateCreativeAssets, CreativeAssetsResponse } from "@/utils/generateCreativeAssets";
import { generateImages, ImageGenerationResponse } from "@/utils/generateImages";
import { getUserByEmail, getUserById } from "@/utils/user";
import { createGeneration, updateGenerationStatus } from "@/utils/generations";
import { GenerationType, GenerationStatus } from "@prisma/client";

// Server action to handle product submission and generate AI creatives
export async function submitProductAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const user = await getUserById(userId);

    if (!user) {
      return { error: "User not found" }
    }

    console.log("User:", user);

    if (user.generatedImages >= 1) {
      return { error: "You have reached the maximum number of generated images" }
    }

    // Extract all form data
    const productName = formData.get("productName") as string || "";
    const productTagline = formData.get("productTagline") as string || "";
    const productCategory = formData.get("productCategory") as string || "";
    const highlightedBenefit = formData.get("highlightedBenefit") as string || "";
    const productDescription = formData.get("productDescription") as string || "";
    
    // Advanced fields
    const brandName = formData.get("brandName") as string || "LUMISÉRA";
    const brandTone = formData.get("brandTone") as string || "Luxury skincare — clean, calm, and elegant.";
    const colorTheme = formData.get("colorTheme") as string || "";
    const backgroundStyle = formData.get("backgroundStyle") as string || "";
    const lightingStyle = formData.get("lightingStyle") as string || "";
    const productPlacement = formData.get("productPlacement") as string || "";
    const typographyStyle = formData.get("typographyStyle") as string || "";
    const compositionGuidelines = formData.get("compositionGuidelines") as string || "";

    // Extract product image if available
    const productImage = formData.get("productImage") as File | null;
    const existingGenerationId = formData.get("generationId") as string;
    
    console.log("Form data received:", {
      productName,
      productTagline,
      productCategory,
      highlightedBenefit,
      brandName,
      brandTone,
      hasImage: !!productImage,
      existingGenerationId
    });

    // Create or get existing generation
    let generationId = existingGenerationId;
    if (!generationId) {
      const generation = await createGeneration({
        userId,
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
      });
      generationId = generation.id;
    }

    // Update status to in progress
    await updateGenerationStatus(generationId, GenerationStatus.IN_PROGRESS);

    // Prepare product data object to pass to image generation
    const productData = {
      productName,
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
      compositionGuidelines
    };

    // Step 1: Generate creative assets using OpenAI
    let creativeAssets;
    

    // Generate real creative assets using OpenAI
    creativeAssets = await generateCreativeAssets({
      productName,
      productTagline,
      brandName,
      brandTone,
      productCategory,
      highlightedBenefit
    });
    
    // Log the generated assets
    console.log("Generated creative assets:", JSON.stringify(creativeAssets, null, 2));

    // Step 2: Generate images based on the creative assets
    const imageResponse = await generateImages(creativeAssets, productData, productImage);
    const { generatedImages, originalImage } = imageResponse;

    // Save submission in DB with Cloudinary URLs and public IDs, linked to generation
    const submission = await db.submission.create({
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
        originalImageUrl: originalImage?.url || '',
        originalImagePublicId: originalImage?.publicId || '',
        
        // Generated creative images
        instagramPostImageUrl: generatedImages.find((img: any) => img.type === 'instagram_post')?.imageUrl || '',
        instagramPostImagePublicId: generatedImages.find((img: any) => img.type === 'instagram_post')?.publicId || '',
        instagramStoryImageUrl: generatedImages.find((img: any) => img.type === 'instagram_story')?.imageUrl || '',
        instagramStoryImagePublicId: generatedImages.find((img: any) => img.type === 'instagram_story')?.publicId || '',
        facebookPostImageUrl: generatedImages.find((img: any) => img.type === 'facebook_post')?.imageUrl || '',
        facebookPostImagePublicId: generatedImages.find((img: any) => img.type === 'facebook_post')?.publicId || '',
        linkedinPostImageUrl: generatedImages.find((img: any) => img.type === 'linkedin_post')?.imageUrl || '',
        linkedinPostImagePublicId: generatedImages.find((img: any) => img.type === 'linkedin_post')?.publicId || '',
        websiteBannerImageUrl: generatedImages.find((img: any) => img.type === 'website_banner')?.imageUrl || '',
        websiteBannerImagePublicId: generatedImages.find((img: any) => img.type === 'website_banner')?.publicId || '',
      }
    });

    // Update generation with original image info if not already set
    if (!existingGenerationId && originalImage) {
      await db.generation.update({
        where: { id: generationId },
        data: {
          originalImageUrl: originalImage.url,
          originalImagePublicId: originalImage.publicId,
        }
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: { generatedImages: { increment: 1 } }
    });

    // Update status to completed
    await updateGenerationStatus(generationId, GenerationStatus.COMPLETED);
    
    // Return the generated images and submission id to the frontend
    return {
      success: true,
      generationId,
      creatives: generatedImages,
      submissionId: submission.id
    };
  } catch (error) {
    console.error("Error in submitProductAction:", error);
    
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
      error: "Failed to generate creative assets. Please try again."
    };
  }
}
