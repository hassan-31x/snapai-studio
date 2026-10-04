import { auth } from "@/auth";
import { db } from "@/lib/db";
import { imageTypes } from "@/lib/image-types";
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const value = new URL(request.url).searchParams.get("url");
  if (!value) return Response.json({ error: "Missing image" }, { status: 400 });
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return Response.json({ error: "Invalid image" }, { status: 400 });
  }
  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com")
    return Response.json({ error: "Invalid image host" }, { status: 400 });
  const userId = session.user.id;
  const [shot, submission] = await Promise.all([
    db.productImage.findFirst({
      where: { userId, imageUrl: value },
      select: { id: true },
    }),
    db.submission.findFirst({
      where: { userId, OR: imageTypes.map((type) => ({ [type.key]: value })) },
      select: { id: true },
    }),
  ]);
  if (!shot && !submission)
    return Response.json({ error: "Image not found" }, { status: 404 });
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15_000),
      redirect: "error",
    });
    if (
      !response.ok ||
      !response.headers.get("content-type")?.startsWith("image/")
    )
      throw new Error();
    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/png",
        "Content-Disposition": "attachment; filename=snapai-studio-image.png",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return Response.json({ error: "Download failed" }, { status: 502 });
  }
}
