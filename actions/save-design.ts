"use server";
import { db } from "@/lib/db";
import { requireUser, rateLimit, actionError } from "@/lib/security";
import { ownsImage } from "@/lib/owned-image";
export async function saveDesign(imageUrl: string, document: string) {
  try {
    const user = await requireUser();
    await rateLimit(`design:${user.id}`, 20);
    if (typeof document !== "string" || document.length > 500_000)
      throw new Error("Design is too large to save");
    if (!(await ownsImage(user.id, imageUrl)))
      throw new Error("Image not found");
    const json = JSON.parse(document);
    if (!Array.isArray(json.objects) || json.objects.length > 100)
      throw new Error("Design has too many objects");
    if (
      ![json.width, json.height].every(
        (value) => Number.isInteger(value) && value >= 64 && value <= 8192,
      )
    )
      throw new Error("Invalid canvas dimensions");
    for (const object of json.objects) {
      if (object.clipPath || object.objects || object.filters?.length)
        throw new Error("Unsupported nested design element");
      if (
        !["Image", "Textbox", "Rect", "Circle", "Triangle"].includes(
          object.type,
        )
      )
        throw new Error("Unsupported design element");
      if (object.type === "Image" && object.src !== imageUrl)
        throw new Error("Unsupported image source");
    }
    await db.design.upsert({
      where: { userId_imageUrl: { userId: user.id, imageUrl } },
      create: { userId: user.id, imageUrl, document },
      update: { document },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}
