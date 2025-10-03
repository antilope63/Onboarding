"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AUTH_STORAGE_KEY } from "@/contexts/AuthContext";

const LOCAL_STORAGE_KEY = "tutorial_seen";

export default function TutorialModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      // Ne pas afficher pour les managers ou RH
      const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (rawAuth) {
        try {
          const parsed = JSON.parse(rawAuth) as { role?: unknown };
          const role = parsed?.role;
          if (role === "manager" || role === "rh") {
            return;
          }
        } catch {
          // ignore JSON errors, on continue vers le flux user
        }
      }

      const hasSeen = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!hasSeen) {
        const timeoutId = window.setTimeout(() => setOpen(true), 500);
        return () => window.clearTimeout(timeoutId);
      }
    } catch (error) {
      // ignore storage errors and avoid blocking UI
    }
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      } catch (error) {
        // ignore storage errors
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-noir border-0 text-white">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-white">Tutoriel</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <video
            src="/Tutoriel.mp4"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
