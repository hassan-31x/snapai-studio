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
  LayoutDashboard, 
  Sparkles, 
  PlusCircle, 
  Settings, 
  ImageIcon, 
  TextIcon,
  BarChart3,
  Lightbulb,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Submit Product",
      icon: PlusCircle,
      href: "/submit",
    },
    // {
    //   label: "My Creatives",
    //   icon: Sparkles,
    //   href: "/creatives",
    // },
    {
      label: "Image Gallery",
      icon: ImageIcon,
      href: "/submissions",
    },
    // {
    //   label: "Copy Library",
    //   icon: TextIcon,
    //   href: "/copy",
    // },
    // {
    //   label: "Analytics",
    //   icon: BarChart3,
    //   href: "/analytics",
    // },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <Sidebar className="bg-white border-r border-gray-100">
      <SidebarHeader className="border-b border-gray-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Snap AI Logo" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            Snap AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <Link href={route.href} passHref>
                  <SidebarMenuButton 
                    isActive={pathname === route.href}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      "hover:bg-gray-50 hover:shadow-sm",
                      pathname === route.href 
                        ? "bg-gray-900 text-white shadow-md hover:bg-gray-800" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    style={{fontFamily:'Inter,Geist,sans-serif'}}
                  >
                    <route.icon className={cn(
                      "mr-3 h-5 w-5",
                      pathname === route.href ? "text-gray-800" : "text-gray-500"
                    )} />
                    <span>{route.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-100 p-6">
        <div className="space-y-4">
          {/* Help Section */}
          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Help & Support
            </span>
          </div>
          
          {/* Version */}
          <div className="text-center">
            <div className="text-xs text-gray-400" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              Version 1.0.0
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}