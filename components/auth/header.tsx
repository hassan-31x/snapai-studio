"use client"

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

type Props = {
  label: string;
}

const AuthHeader = ({ label }: Props) => {
  return (
    <div className="text-center space-y-2">
      <h1 className={cn(
        "text-3xl font-semibold text-slate-900",
        font.className
      )}>
        {label}
      </h1>
      <p className="text-slate-500 text-sm">
        {label.includes("Welcome") 
          ? "Log in to Snap AI to continue creating marketing magic." 
          : "Create your account to start generating AI-powered creatives."
        }
      </p>
    </div>
  )
}

export default AuthHeader