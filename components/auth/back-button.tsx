"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

const BackButton = ({ href, label }: Props) => {
  return (
    <div className="text-center">
      <span className="text-sm text-slate-600">{label}</span>{" "}
      <Link
        href={href}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
      >
        {href.includes("register") ? "Create account" : "Sign in"}
      </Link>
    </div>
  );
};

export default BackButton;
