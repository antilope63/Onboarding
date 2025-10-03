"use client";

import BackButton from "@/components/BackButton";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type NavBarProps = {
  classname?: string;
};

export default function NavBar({ classname }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth, email } = useAuth();
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
      <div className="flex items-center gap-2">
        {email ? (
          <Button
            variant="secondary"
            className="h-8 px-3 cursor-pointer mr-4"
            onClick={() => {
              clearAuth();
              router.replace("/Login");
            }}
          >
            Déconnexion
          </Button>
        ) : (
          <div className="w-16 h-4" />
        )}
      </div>
    </div>
  );
}
