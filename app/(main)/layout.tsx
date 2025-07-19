import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import UserButton from "@/components/auth/user-button"
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

const MainLayout = async ({ children }: Props) => {
  const session = await auth(); // server function, hence can also be used in api routes
  const user = session?.user;

  if (!user) {
    redirect("/login")
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-slate-50/50" style={{fontFamily:'Inter,system-ui,sans-serif'}}>
        <AppSidebar user={user} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* <div className="flex items-center justify-between h-14 px-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center">
              <SidebarTrigger className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg p-2 transition-colors">
                <Menu className="w-4 h-4" />
              </SidebarTrigger>
              <div className="ml-4 text-sm text-slate-500">
                <span className="font-medium text-slate-900" style={{fontFamily:'Inter,system-ui,sans-serif'}}>Snap AI</span> 
                <span className="mx-2 text-slate-300">/</span> 
                <span>Home</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton />
            </div>
          </div> */}
          <div className="flex-1 overflow-auto bg-slate-50/30">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}

export default MainLayout