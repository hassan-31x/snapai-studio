"use client";

import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { User, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/logout-button";

const UserButton = () => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-gray-100 text-gray-600">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
              {session?.user?.email}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="end" style={{fontFamily:'Inter,Geist,sans-serif'}}>
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
          <p className="text-xs text-gray-500">{session?.user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-lg cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="rounded-lg cursor-pointer text-red-600 focus:text-red-600">
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
