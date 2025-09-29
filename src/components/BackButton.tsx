"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

type BackButtonProps = {
  label?: string;
  href?: string;
  className?: string;
};

export default function BackButton({
  label = "Accueil",
  href = "/",
  className,
}: BackButtonProps) {
  return (
    <div
      className={
        "w-min flex items-center px-2 h-min cursor-pointer" + (className ?? "")
      }
    >
      <Link
        href={href}
        aria-label={label}
        className="group inline-flex items-center gap-1 no-underline"
      >
        <ArrowLeftIcon className="text-white w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="font-medium text-white">{label}</span>
      </Link>
    </div>
  );
}
