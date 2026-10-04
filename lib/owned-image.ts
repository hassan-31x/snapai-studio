import "server-only";
import { db } from "@/lib/db";
import { imageTypes } from "@/lib/image-types";
export async function ownsImage(userId: string, imageUrl: string) {
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com")
    return false;
  const [shot, campaign] = await Promise.all([
    db.productImage.findFirst({
      where: { userId, imageUrl },
      select: { id: true },
    }),
    db.submission.findFirst({
      where: {
        userId,
        OR: imageTypes.map((type) => ({ [type.key]: imageUrl })),
      },
      select: { id: true },
    }),
  ]);
  return !!(shot || campaign);
}
