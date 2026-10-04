"use server";
import { getGeneration } from "@/utils/generations";
import { requireUser, actionError } from "@/lib/security";
import { objectIdSchema } from "@/lib/validation";
export async function getGenerationAction(
  generationId: string,
  _userId?: string,
) {
  try {
    const user = await requireUser();
    const generation = await getGeneration(
      objectIdSchema.parse(generationId),
      user.id,
    );
    if (!generation) return { success: false, error: "Project not found" };
    return { success: true, generation };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}
