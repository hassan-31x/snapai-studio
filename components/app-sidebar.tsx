"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { 
  Home,
  Library,
  Image as ImageIcon,
  Video,
  Infinity,
  Brush,
  Wand2,
  BarChart3,
  Palette,
  Zap,
  Settings,
  HelpCircle,
  Crown,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AppSidebar() {
  const pathname = usePathname()

  const mainRoutes = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Library",
      icon: Library,
      href: "/submissions",
    },
  ]

  const aiToolsRoutes = [
    {
      label: "Image",
      icon: ImageIcon,
      href: "/submit",
    },
    {
      label: "Video",
      icon: Video,
      href: "/video",
      badge: "New",
      disabled: true,
    },
    {
      label: "Flow State",
      icon: Infinity,
      href: "/flow-state",
      disabled: true,
    },
    {
      label: "Realtime Canvas",
      icon: Brush,
      href: "/canvas",
      disabled: true,
    },
    {
      label: "Realtime Generation",
      icon: Wand2,
      href: "/realtime",
      disabled: true,
    },
    {
      label: "Canvas Editor",
      icon: Palette,
      href: "/editor",
      disabled: true,
    },
    {
      label: "Universal Upscaler",
      icon: Zap,
      href: "/upscaler",
      disabled: true,
    },
  ]

  const advancedRoutes = [
    {
      label: "Models & Training",
      icon: BarChart3,
      href: "/models",
      disabled: true,
    },
    {
      label: "Texture Generation",
      icon: Sparkles,
      href: "/texture",
      badge: "Alpha",
      disabled: true,
    },
  ]

  const bottomRoutes = [
    {
      label: "What's New",
      icon: Sparkles,
      href: "/new",
      disabled: true,
    },
    {
      label: "Premium Plans",
      icon: Crown,
      href: "/premium",
      disabled: true,
    },
    {
      label: "API Access",
      icon: Zap,
      href: "/api",
      disabled: true,
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      label: "Learn",
      icon: HelpCircle,
      href: "/learn",
      disabled: true,
    },
    {
      label: "FAQ & Help",
      icon: HelpCircle,
      href: "/help",
      disabled: true,
    },
  ]

  return (
    <Sidebar className="bg-slate-50/80 border-r border-slate-200/60 backdrop-blur-sm">
      <SidebarHeader className="border-b border-slate-200/60 px-4 py-4">
        <div className="flex items-center gap-1">
          <div className="rounded-full overflow-hidden flex items-center justify-center">
            <Image src="/logo.png" alt="Snap AI" width={36} height={36} />
          </div>
          <span className="text-lg font-semibold text-slate-900" style={{fontFamily:'Inter,system-ui,sans-serif'}}>
            Snap AI
          </span>
        </div>
        
        {/* User Info */}
        <div className="mt-4 flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-slate-200/60">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            H
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">hassan031x</div>
          </div>
          <div className="text-xs text-slate-500">⌄</div>
        </div>

        {/* Credits */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-lg border border-slate-200/60">
            <Crown className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-slate-900">150</span>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
            Upgrade
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {mainRoutes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <Link href={route.href} passHref>
                  <SidebarMenuButton 
                    isActive={pathname === route.href}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      "hover:bg-white/60 hover:shadow-sm",
                      pathname === route.href 
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" 
                        : "text-slate-600 hover:text-slate-900"
                    )}
                    style={{fontFamily:'Inter,system-ui,sans-serif'}}
                  >
                    <route.icon className={cn(
                      "mr-3 h-4 w-4",
                      pathname === route.href ? "text-slate-700" : "text-slate-500"
                    )} />
                    <span>{route.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* AI Tools */}
        <SidebarGroup>
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              AI Tools
            </h3>
          </div>
          <SidebarMenu className="space-y-1">
            {aiToolsRoutes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <Link href={route.disabled ? "#" : route.href} passHref>
                  <SidebarMenuButton 
                    isActive={pathname === route.href}
                    disabled={route.disabled}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      "hover:bg-white/60 hover:shadow-sm",
                      route.disabled && "opacity-50 cursor-not-allowed",
                      pathname === route.href 
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" 
                        : "text-slate-600 hover:text-slate-900"
                    )}
                    style={{fontFamily:'Inter,system-ui,sans-serif'}}
                  >
                    <route.icon className={cn(
                      "mr-3 h-4 w-4",
                      pathname === route.href ? "text-slate-700" : "text-slate-500"
                    )} />
                    <span className="flex-1">{route.label}</span>
                    {route.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-2 py-0.5 ml-2",
                          route.badge === "New" ? "bg-pink-100 text-pink-700" : "bg-violet-100 text-violet-700"
                        )}
                      >
                        {route.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Advanced */}
        <SidebarGroup>
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Advanced
            </h3>
          </div>
          <SidebarMenu className="space-y-1">
            {advancedRoutes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <Link href={route.disabled ? "#" : route.href} passHref>
                  <SidebarMenuButton 
                    disabled={route.disabled}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      "hover:bg-white/60 hover:shadow-sm",
                      route.disabled && "opacity-50 cursor-not-allowed",
                      "text-slate-600 hover:text-slate-900"
                    )}
                    style={{fontFamily:'Inter,system-ui,sans-serif'}}
                  >
                    <route.icon className="mr-3 h-4 w-4 text-slate-500" />
                    <span className="flex-1">{route.label}</span>
                    {route.badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 ml-2 bg-violet-100 text-violet-700"
                      >
                        {route.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/60 p-3">
        <div className="space-y-1">
          {bottomRoutes.map((route) => (
            <Link key={route.href} href={route.disabled ? "#" : route.href} passHref>
              <SidebarMenuButton 
                disabled={route.disabled}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-white/60 hover:shadow-sm",
                  route.disabled && "opacity-50 cursor-not-allowed",
                  pathname === route.href 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" 
                    : "text-slate-600 hover:text-slate-900"
                )}
                style={{fontFamily:'Inter,system-ui,sans-serif'}}
              >
                <route.icon className={cn(
                  "mr-3 h-4 w-4",
                  pathname === route.href ? "text-slate-700" : "text-slate-500"
                )} />
                <span>{route.label}</span>
              </SidebarMenuButton>
            </Link>
          ))}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}