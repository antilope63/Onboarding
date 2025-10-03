"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TaskRedirector() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Récupère le chemin actuel

  useEffect(() => {
    // Vérifie si toutes les tâches sont verified
    const checkTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("status");

      if (error) {
        console.error("Erreur récupération des tâches:", error);
        return;
      }

      const allVerified = data?.every((task) => task.status === "verified");

      // ✅ On ne redirige pas si on est déjà sur /Recompense
      if (allVerified && pathname !== "/Recompense") {
        router.push("/Formulaire");
      }
    };

    // Vérif initiale
    checkTasks();

    // 🔄 Abonnement en temps réel
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          checkTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, pathname]);

  return null;
}
