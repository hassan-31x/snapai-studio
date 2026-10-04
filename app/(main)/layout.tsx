import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger aria-label="Toggle navigation" />
            <span className="text-sm text-muted-foreground">
              Your workspace
            </span>
          </div>
          <Link href="/generate" className="text-sm font-medium">
            New project ↗
          </Link>
        </header>
        <main id="main-content" className="min-w-0 flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
