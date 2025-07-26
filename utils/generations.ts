import { db } from "@/lib/db";
import { GenerationType, GenerationStatus } from "@prisma/client";
import { getUserById } from "@/utils/user";

export interface CreateGenerationParams {
  userId: string;
  type: GenerationType;
  prompt?: string;
  aspectRatio?: string;
  scene?: string;
  numberOfImages?: number;
  originalImageUrl?: string;
  originalImagePublicId?: string;
  productName?: string;
  productCategory?: string;
  productTagline?: string;
  productDescription?: string;
  brandName?: string;
  brandTone?: string;
  colorTheme?: string;
  backgroundStyle?: string;
  lightingStyle?: string;
  productPlacement?: string;
  typographyStyle?: string;
  compositionGuidelines?: string;
  highlightedBenefit?: string;
}

export async function createGeneration(params: CreateGenerationParams) {
  const user = await getUserById(params.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const generation = await db.generation.create({
    data: {
      userId: user.id,
      type: params.type,
      status: GenerationStatus.PENDING,
      prompt: params.prompt,
      aspectRatio: params.aspectRatio,
      scene: params.scene,
      numberOfImages: params.numberOfImages || 1,
      originalImageUrl: params.originalImageUrl,
      originalImagePublicId: params.originalImagePublicId,
      productName: params.productName,
      productCategory: params.productCategory,
      productTagline: params.productTagline,
      productDescription: params.productDescription,
      brandName: params.brandName,
      brandTone: params.brandTone,
      colorTheme: params.colorTheme,
      backgroundStyle: params.backgroundStyle,
      lightingStyle: params.lightingStyle,
      productPlacement: params.productPlacement,
      typographyStyle: params.typographyStyle,
      compositionGuidelines: params.compositionGuidelines,
      highlightedBenefit: params.highlightedBenefit,
    },
  });

  return generation;
}

export async function updateGenerationStatus(
  generationId: string,
  status: GenerationStatus
) {
  return await db.generation.update({
    where: { id: generationId },
    data: { status },
  });
}

export async function getGeneration(generationId: string, userId: string) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await db.generation.findFirst({
    where: {
      id: generationId,
      userId: user.id,
    },
    include: {
      productImages: {
        orderBy: { createdAt: "desc" },
      },
      submissions: true,
    },
  });
}

export async function getUserGenerations(userId: string) {
  return await db.generation.findMany({
    where: { userId },
    include: {
      productImages: {
        orderBy: { createdAt: "desc" },
      },
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
