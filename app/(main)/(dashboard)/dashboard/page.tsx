import Link from "next/link";
import { requireUser } from "@/lib/security";
import { getUserGenerations } from "@/utils/generations";
import { ProjectGrid } from "@/components/project-grid";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Overview" };
export default async function Dashboard() {
  const user = await requireUser();
  const projects = await getUserGenerations(user.id);
  return (
    <div className="studio-page">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Your studio, ready when you are
          </p>
          <h1 className="text-3xl font-medium">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick up an idea, or give your product a new perspective.
          </p>
        </div>
        <Button asChild>
          <Link href="/generate">Create a project ↗</Link>
        </Button>
      </div>
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {[
          ["Credits remaining", user.tokens],
          ["Images created", user.generatedImages],
          ["Saved projects", projects.length],
        ].map(([label, value]) => (
          <div className="rounded-xl border p-6" key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium">Recent projects</h2>
        <Link
          href="/submissions"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all ↗
        </Link>
      </div>
      <ProjectGrid projects={projects.slice(0, 6)} />
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-secondary p-6">
        <div>
          <h2 className="text-base font-medium">
            Start with a clear product photo.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep the label visible, describe your light, and let the product
            lead.
          </p>
        </div>
        <Link href="/generate" className="text-sm font-medium">
          Try a studio shot ↗
        </Link>
      </div>
    </div>
  );
}
