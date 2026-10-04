import { notFound } from "next/navigation";
import { requireUser } from "@/lib/security";
import { objectIdSchema } from "@/lib/validation";
import { getGeneration } from "@/utils/generations";
import Studio from "@/components/studio";
export const maxDuration = 300;
export const metadata = { title: "Create" };
export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const user = await requireUser();
  if (!id) return <Studio key="new" />;
  if (!objectIdSchema.safeParse(id).success) notFound();
  const project = await getGeneration(id, user.id);
  if (!project) notFound();
  return <Studio key={id} initialProject={project} />;
}
