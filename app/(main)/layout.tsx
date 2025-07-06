import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import UserButton from "@/components/auth/user-button"

type Props = {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white" style={{fontFamily:'Inter,Geist,sans-serif'}}>
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
            <div className="flex items-center">
              <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
              <div className="ml-4 text-sm text-gray-500">
                <span className="font-medium text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>AI Creatives</span> 
                <span className="mx-2">/</span> 
                <span>Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton />
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}

export default MainLayout