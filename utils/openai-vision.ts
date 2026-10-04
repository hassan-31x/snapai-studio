import { getOpenRouter, textModel } from "@/lib/openrouter";

/**
 * Analyze image using OpenRouter Vision API
 */
export async function analyzeImageWithVision(
  base64Image: string,
): Promise<string> {
  try {
    const response = await getOpenRouter().chat.completions.create({
      model: textModel(),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ad creative in detail. Describe:
              - overall layout of the ad (what is present in top, left, right, center of the ad)
              - typography: The typography of the ad creative (what kind of font, size, color, where its placed, etc.)
              - productPlacement (the exact location, is it grounded, floating, its angle, etc.)
              - sideProps (what are the items complementing the product, what are the colors, materials, etc.)
              - colors (what are the colors used in the ad to highlight the product. what types are used)
              - The visual characteristics of the ad creative
              - Overall theme (is it luxury, modern, cool, etc.)
              - Background - what kind of environment is it in etc (is it outdoor or on a beach etc).
              `,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Unable to analyze image";
  } catch (error) {
    console.error("Error analyzing image with Vision API:", error);
    throw new Error("Failed to analyze image");
  }
}

/**
 * Generate advanced product information using OpenRouter
 */
export async function generateAdvancedProductInfo(
  productName: string,
  productCategory: string,
  userDescription?: string,
  imageAnalysis?: string,
): Promise<{
  brandName: string;
  brandTone: string;
  colorTheme: string;
  backgroundStyle: string;
  lightingStyle: string;
  productPlacement: string;
  typographyStyle: string;
  compositionGuidelines: string;
}> {
  try {
    const systemPrompt = `You are a luxury brand and visual design expert. Your task is to generate sophisticated brand and visual styling guidelines for a product.

Based on the product information provided, create comprehensive styling guidelines that would be suitable for premium marketing materials.

Return your response as a JSON object with exactly these fields:
- brandName: A sophisticated brand name (if not provided, suggest one that fits the product)
- brandTone: Brand personality and voice description
- colorTheme: Detailed color palette description
- backgroundStyle: Background styling recommendations
- lightingStyle: Lighting recommendations for photography
- productPlacement: Product positioning and placement guidelines
- typographyStyle: Typography and text styling guidelines
- compositionGuidelines: Overall composition and layout guidelines

Make everything sound premium, sophisticated, and luxury-oriented.`;

    const userPrompt = `Product Name: ${productName}
Product Category: ${productCategory}
${userDescription ? `User Description: ${userDescription}` : ""}
${imageAnalysis ? `Image Analysis: ${imageAnalysis}` : ""}

Please generate comprehensive brand and visual styling guidelines for this product. Here's an example of the expected format:

{
  "brandName": "LUMISÉRA",
  "brandTone": "Luxury skincare — clean, calm, and elegant.",
  "colorTheme": "Deep sea blues, emerald greens, warm golds, and beige.",
  "backgroundStyle": "Soft gradients or realistic textures like water, marble, or satin.",
  "lightingStyle": "Always soft, diffused lighting with a subtle spotlight effect and gentle reflections.",
  "productPlacement": "The product should feel grounded, not floating — placed on surfaces like trays, marble slabs, or fabric. Props like flower petals, ribbons, or boxes can be used sparingly.",
  "typographyStyle": "Use serif fonts in uppercase for titles. For secondary text, use thin script or modern sans-serif. Font color should be white, soft gold, or dark green — never harsh.",
  "compositionGuidelines": "Maintain clean symmetry or elegant off-center balance. Always leave intentional space around the product. Keep supporting elements minimal and refined."
}`;

    const response = await getOpenRouter().chat.completions.create({
      model: textModel(),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("No content returned from OpenRouter");
    }

    const parsedResponse = JSON.parse(content);
    return parsedResponse;
  } catch {
    throw new Error(
      "Could not suggest a creative direction. Please try again.",
    );
  }
}
