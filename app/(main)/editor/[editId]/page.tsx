import { notFound } from "next/navigation";
import { requireUser } from "@/lib/security";
import { ownsImage } from "@/lib/owned-image";
import { db } from "@/lib/db";
import CanvasEditor from "@/components/canvas-editor";
export const metadata = { title: "Editor" };
export default async function Editor({
  searchParams,
}: {
  params: Promise<{ editId: string }>;
  searchParams: Promise<{ image?: string }>;
}) {
  const { image } = await searchParams;
  const user = await requireUser();
  if (!image || !(await ownsImage(user.id, image))) notFound();
  const design = await db.design.findUnique({
    where: { userId_imageUrl: { userId: user.id, imageUrl: image } },
  });
  return <CanvasEditor imageUrl={image} document={design?.document} />;
}
