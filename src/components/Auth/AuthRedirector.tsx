"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AUTH_STORAGE_KEY } from "@/contexts/AuthContext";

function isValidAuth(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const data = JSON.parse(raw) as { email?: unknown; role?: unknown };
    const emailOk = typeof data.email === "string" && data.email.length > 3;
    const roleOk =
      data.role === "manager" || data.role === "rh" || data.role === "user";
    return emailOk && roleOk;
  } catch {
    return false;
  }
}

export default function AuthRedirector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/Login") return;
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem(AUTH_STORAGE_KEY)
        : null;
    if (!isValidAuth(raw)) {
      router.replace("/Login");
    }
  }, [router, pathname]);

  return null;
}
