import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { generateImage } from "@/lib/openrouter";
import { imageDataUrl } from "@/lib/validation";
import type { CreativeAssetsResponse } from "./generateCreativeAssets";
export interface GeneratedImage {
  type: string;
  title: string;
  imageUrl: string;
  dimensions: string;
  assetDetails: unknown;
  publicId: string;
}
export interface ImageGenerationResponse {
  generatedImages: GeneratedImage[];
  originalImage?: { url: string; publicId: string };
}
const formats = [
  ["instagram_post", "Instagram post", "1080 × 1080", "1:1", 1080, 1080],
  ["instagram_story", "Instagram story", "1080 × 1920", "9:16", 1080, 1920],
  ["facebook_post", "Facebook post", "1200 × 630", "16:9", 1200, 630],
  ["linkedin_post", "LinkedIn post", "1200 × 627", "16:9", 1200, 627],
  ["website_banner", "Website banner", "1200 × 400", "3:1", 1200, 400],
] as const;
export async function generateImages(
  creativeAssets: CreativeAssetsResponse,
  productData: Record<string, string> = {},
  productImage?: File | null,
): Promise<ImageGenerationResponse> {
  if (!productImage) throw new Error("Upload a product photo first");
  const reference = await imageDataUrl(productImage);
  const original = await uploadToCloudinary(
    Buffer.from(await productImage.arrayBuffer()),
    { folder: "stillframe/originals" },
  );
  const generatedImages: GeneratedImage[] = [];
  const outcomes = await Promise.allSettled(
    formats.map(async ([type, title, dimensions, ratio, width, height]) => {
      const prompt = `Create a polished product advertisement for ${title}. Preserve the exact product and its branding in the reference image. Product details: ${JSON.stringify(productData)}. Creative direction: ${JSON.stringify(creativeAssets.assets)}. Use the supplied tagline only, never invent reviews or claims. Balanced composition with negative space for text.`;
      const bytes = await generateImage(
        prompt,
        [reference],
        ratio === "3:1" ? "21:9" : ratio,
      );
      const result = await uploadToCloudinary(bytes, {
        folder: "stillframe/campaigns",
        transformation: { width, height, crop: "fill", gravity: "auto" },
      });
      generatedImages.push({
        type,
        title,
        dimensions,
        imageUrl: result.secure_url,
        publicId: result.public_id,
        assetDetails: creativeAssets,
      });
    }),
  );
  const failed = outcomes.find(
    (outcome): outcome is PromiseRejectedResult =>
      outcome.status === "rejected",
  );
  if (failed) {
    await Promise.allSettled(
      [
        original.public_id,
        ...generatedImages.map((image) => image.publicId),
      ].map(deleteFromCloudinary),
    );
    throw failed.reason;
  }
  generatedImages.sort(
    (a, b) =>
      formats.findIndex((f) => f[0] === a.type) -
      formats.findIndex((f) => f[0] === b.type),
  );
  return {
    generatedImages,
    originalImage: { url: original.secure_url, publicId: original.public_id },
  };
}
