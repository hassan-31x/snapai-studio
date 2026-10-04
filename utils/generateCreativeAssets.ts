import { z } from "zod";
import { getOpenRouter, textModel } from "@/lib/openrouter";
type ProductData = {
  productName: string;
  productTagline: string;
  brandName: string;
  brandTone: string;
  productCategory: string;
  highlightedBenefit: string;
};
const assetSchema = z.object({
  assetType: z.string(),
  backgroundTone: z.string(),
  surfaceType: z.string(),
  accentProp: z.string(),
  lighting: z.string(),
  cameraAngle: z.string(),
  overlayText: z.string(),
});
export type CreativeAsset = z.infer<typeof assetSchema>;
export interface CreativeAssetsResponse {
  assets: CreativeAsset[];
}
export async function generateCreativeAssets(
  productData: ProductData,
): Promise<CreativeAssetsResponse> {
  const response = await getOpenRouter().chat.completions.create({
    model: textModel(),
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You are a commercial product art director. Use the actual product and brand supplied. Return JSON {"assets": [...]} with exactly 5 assets: Instagram Post, Instagram Story, Ad Creative, Testimonial Graphic, Website Banner. Each must have string fields assetType, backgroundTone, surfaceType, accentProp, lighting, cameraAngle, overlayText. Do not invent testimonials or product claims. Use only the supplied tagline as overlayText.',
      },
      { role: "user", content: JSON.stringify(productData) },
    ],
  });
  return z
    .object({ assets: z.array(assetSchema).length(5) })
    .parse(JSON.parse(response.choices[0]?.message.content || "{}"));
}
