import { requireUser } from "@/lib/security";
import { getUserGenerations } from "@/utils/generations";
import { ProjectGrid } from "@/components/project-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Your projects" };
export default async function Projects() {
  const user = await requireUser();
  const projects = await getUserGenerations(user.id);
  return (
    <div className="studio-page">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">Your projects</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Every direction you explored, saved in one place.
          </p>
        </div>
        <Button asChild>
          <Link href="/generate">New project ↗</Link>
        </Button>
      </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
