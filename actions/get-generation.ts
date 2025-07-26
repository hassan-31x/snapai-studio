"use server";

import { getGeneration } from "@/utils/generations";

export async function getGenerationAction(generationId: string, userId: string) {
  try {
    const generation = await getGeneration(generationId, userId);
    
    if (!generation) {
      return {
        success: false,
        error: "Generation not found"
      };
    }

    return {
      success: true,
      generation
    };
  } catch (error) {
    console.error("Error fetching generation:", error);
    return {
      success: false,
      error: "Failed to fetch generation"
    };
  }
}
