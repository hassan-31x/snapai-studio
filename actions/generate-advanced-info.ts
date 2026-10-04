"use server";

import { requireUser, rateLimit } from "@/lib/security";
import { validateImage } from "@/lib/validation";
import {
  analyzeImageWithVision,
  generateAdvancedProductInfo,
} from "@/utils/openai-vision";

export async function generateAdvancedInfoAction(formData: FormData) {
  try {
    const user = await requireUser();
    await rateLimit(`assistant:${user.id}`, 10);
    const productName = formData.get("productName") as string;
    const productCategory = formData.get("productCategory") as string;
    const userDescription = (formData.get("description") as string) || "";

    // Handle image files
    const images: File[] = [];
    const image1 = formData.get("image1") as File | null;
    const image2 = formData.get("image2") as File | null;

    if (image1 && image1.size > 0) images.push(image1);
    if (image2 && image2.size > 0) images.push(image2);

    for (const image of images) validateImage(image);
    if (
      [productName, productCategory, userDescription].some(
        (value) => value && value.length > 2000,
      )
    )
      throw new Error("Input is too long");
    // Analyze images if provided
    let imageAnalysis = "";
    if (images.length > 0) {
      const analysisPromises = images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        return analyzeImageWithVision(base64);
      });

      const analyses = await Promise.all(analysisPromises);
      imageAnalysis = analyses.join("\n\n");
    }

    // Generate advanced product information
    const advancedInfo = await generateAdvancedProductInfo(
      productName,
      productCategory,
      userDescription,
      imageAnalysis,
    );

    return {
      success: true,
      data: advancedInfo,
    };
  } catch (error) {
    console.error("Error in generateAdvancedInfoAction:", error);
    return {
      success: false,
      error: "Failed to generate advanced information. Please try again.",
    };
  }
}
