"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  HouseIcon,
  CameraIcon,
  StackIcon,
  GearSixIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { BrandLogo } from "@/components/brand-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
const links = [
  ["/dashboard", "Overview", HouseIcon],
  ["/generate", "Create", CameraIcon],
  ["/submissions", "Your projects", StackIcon],
  ["/settings", "Settings", GearSixIcon],
] as const;
export function AppSidebar({
  user,
}: {
  user: { email?: string | null; tokens?: number };
}) {
  const path = usePathname();
  const { data: session } = useSession();
  const currentUser = session?.user ?? user;
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <BrandLogo />
        <span className="mt-2 text-xs text-muted-foreground">
          Independent creative studio
        </span>
      </SidebarHeader>
      <SidebarContent className="px-3 pt-6">
        <SidebarMenu>
          {links.map(([href, label, Icon]) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={path === href || path.startsWith(`${href}/`)}
                className="h-11"
              >
                <Link
                  href={href}
                  onClick={() => setOpenMobile(false)}
                  aria-current={path === href ? "page" : undefined}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="gap-4 p-6">
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">
            {currentUser.tokens ?? 0} credits remaining
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Free studio · 1 credit per shot
          </p>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {currentUser.email}
        </p>
        <button
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ redirectTo: "/" })}
        >
          <SignOutIcon size={16} />
          Sign out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
