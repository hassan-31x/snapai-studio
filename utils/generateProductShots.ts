import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { generateImage } from "@/lib/openrouter";
import { imageDataUrl } from "@/lib/validation";
export interface GeneratedProductImage {
  id?: string;
  imageUrl: string;
  publicId: string;
  aspectRatio: string;
  scene: string;
  prompt: string;
}
export interface ProductShotGenerationResponse {
  generatedImages: GeneratedProductImage[];
  originalImage?: { url: string; publicId: string };
}
export interface ProductShotParams {
  prompt: string;
  aspectRatio: string;
  scene: string;
  numberOfImages: number;
  productImage: File;
  similarImages?: File[];
}
export async function generateProductShots(
  params: ProductShotParams,
): Promise<ProductShotGenerationResponse> {
  const reference = await imageDataUrl(params.productImage);
  const references = [
    reference,
    ...(await Promise.all((params.similarImages || []).map(imageDataUrl))),
  ];
  const original = await uploadToCloudinary(
    Buffer.from(await params.productImage.arrayBuffer()),
    { folder: "stillframe/originals" },
  );
  const ratio =
    params.aspectRatio === "1536x1024"
      ? "3:2"
      : params.aspectRatio === "1024x1536"
        ? "2:3"
        : "1:1";
  const generatedImages: GeneratedProductImage[] = [];
  const outcomes = await Promise.allSettled(
    Array.from({ length: params.numberOfImages }, async (_, i) => {
      const prompt = `Professional commercial product photograph. Preserve the exact product shape, label, color, and branding in the first reference. Other references guide the style only. Scene: ${params.scene || "studio"}. ${params.prompt}. Composition variation ${i + 1}: ${["front three quarter view", "slightly elevated camera", "low camera angle", "wider composition"][i]}. No added text or watermarks.`;
      const bytes = await generateImage(prompt, references, ratio);
      const uploaded = await uploadToCloudinary(bytes, {
        folder: "stillframe/shots",
      });
      generatedImages.push({
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        prompt: params.prompt,
        aspectRatio: params.aspectRatio,
        scene: params.scene,
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
  return {
    generatedImages,
    originalImage: { url: original.secure_url, publicId: original.public_id },
  };
}
