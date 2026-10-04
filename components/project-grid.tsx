import Link from "next/link";
import { getUserGenerations } from "@/utils/generations";
import { Button } from "@/components/ui/button";
type Projects = Awaited<ReturnType<typeof getUserGenerations>>;
export function ProjectGrid({ projects }: { projects: Projects }) {
  if (!projects.length)
    return (
      <div className="rounded-xl border bg-secondary/40 px-6 py-16 text-center">
        <span aria-hidden="true" className="text-4xl text-muted-foreground">
          ▧
        </span>
        <h2 className="mt-6 text-xl font-medium">
          Your first idea belongs here.
        </h2>
        <p className="mb-6 mt-3 text-sm text-muted-foreground">
          Upload a product photo and start with one studio shot.
        </p>
        <Button asChild>
          <Link href="/generate">Create your first project ↗</Link>
        </Button>
      </div>
    );
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const url =
          project.productImages[0]?.imageUrl ||
          project.submissions[0]?.instagramPostImageUrl ||
          project.originalImageUrl;
        return (
          <Link
            key={project.id}
            href={`/generate?id=${project.id}`}
            className="group min-w-0 overflow-hidden rounded-xl border bg-card hover:border-foreground/30"
          >
            <div className="aspect-[4/3] bg-secondary">
              {url ? (
                <img
                  loading="lazy"
                  src={url}
                  className="h-full w-full object-cover"
                  alt={project.productName || project.prompt || "Product shot"}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {project.status === "FAILED"
                    ? "Generation did not complete"
                    : "Your project is being prepared"}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-between gap-3">
                <h3 className="min-w-0 truncate text-base font-medium">
                  {project.productName || project.prompt || "Untitled shot"}
                </h3>
                <span
                  className="shrink-0 text-muted-foreground"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {project.type === "AD_CREATIVE"
                    ? "Campaign"
                    : "Product photography"}{" "}
                  · {project.status.toLowerCase().replaceAll("_", " ")}
                </span>
                <time dateTime={project.createdAt.toISOString()}>
                  {project.createdAt.toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
