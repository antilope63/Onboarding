"use client";

import BackButton from "@/components/BackButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type NavBarProps = {
  classname?: string;
};

export default function NavBar({ classname }: NavBarProps) {
  const pathname = usePathname();
  const segments = (pathname ?? "/").split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";
  const normalized = lastSegment
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const computedTitle =
    segments.length === 0 ? "PixelPlay" : normalized || "PixelPlay";
  const finalTitle = computedTitle;
  return (
    <div
      className={cn(
        "flex justify-between items-center gap-2 w-full h-16",
        classname
      )}
    >
      <BackButton />

      <h1 className="text-2xl font-bold text-white">{finalTitle}</h1>
      {/* pour rpousser correctement le titre au milieu de la navbar */}
      <div className="w-16 h-4" />
    </div>
  );
}
