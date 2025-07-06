'use client';

import Link from "next/link";
import Image from "next/image";
import { TwitterIcon, Github } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Snap AI Logo" width={36} height={36} className="rounded-full" />
          <span className="text-lg font-semibold tracking-tight select-none">Snap AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link target="_blank" href='https://x.com/hassan_dev31' className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <TwitterIcon className="w-5 h-5 text-gray-700" />
          </Link>
          <Link target="_blank" href='https://github.com/hassan-31x' className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Github className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;