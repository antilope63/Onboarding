"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function RequireRole({
  allow,
  redirectTo = "/login",
  children,
}: {
  allow: Array<"manager" | "rh" | "user">;
  redirectTo?: string;
  children: ReactNode;
}) {
  const { role } = useAuth();
  const router = useRouter();

  const allowed = allow.includes(role);

  useEffect(() => {
    if (!allowed) router.replace(redirectTo);
  }, [allowed, router, redirectTo]);

  if (!allowed) return null;
  return <>{children}</>;
}
