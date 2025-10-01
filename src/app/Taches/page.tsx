"use client";

import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";

import { KanbanView } from "./components/kanban-view";
import { PhaseModal } from "./components/phase-modal";
import { PhaseView } from "./components/phase-view";
import { ViewOption, ViewToggle } from "./components/view-toggle";
import type { Phase, TaskStatus } from "./data";
import { phases } from "./data";

type Overview = {
  completion: number;
  totalTasks: number;
  completedTasks: number;
  activePhaseName: string;
};

type KanbanColumns = Record<
  TaskStatus,
  { phase: string; name: string; description: string }[]
>;

const viewTabs: { id: ViewOption; label: string }[] = [
  { id: "phase", label: "Par phase" },
  { id: "kanban", label: "Kanban" },
];

export default function TasksPage() {
  const [view, setView] = useState<ViewOption>("phase");
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const kanbanColumns = useMemo<KanbanColumns>(() => {
    return phases.reduce<KanbanColumns>(
      (acc, phase) => {
        phase.tasks.forEach((task) => {
          acc[task.status].push({
            phase: phase.name,
            name: task.name,
            description: task.description,
          });
        });
        return acc;
      },
      {
        todo: [],
        "in-progress": [],
        done: [],
        verified: [],
      }
    );
  }, []);

  const overview = useMemo<Overview>(() => {
    const totalTasks = phases.reduce(
      (acc, phase) => acc + phase.tasks.length,
      0
    );
    const completedTasks = phases.reduce(
      (acc, phase) =>
        acc + phase.tasks.filter((task) => task.status === "verified").length,
      0
    );

    const activePhase = phases.find((phase) =>
      phase.tasks.some((task) => task.status !== "verified")
    );

    const completion = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      completion,
      totalTasks,
      completedTasks,
      activePhaseName: activePhase?.name ?? "Tout est validé 🎉",
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090B1E] py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(123,92,224,0.18),_rgba(8,10,35,0.75))]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[#7D5AE0]/30 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-[480px] w-[480px] rounded-full bg-[#1D1E3B]/30 blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-12">
        <header className="flex flex-col gap-6">
          <div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Pilotage des tâches
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Choisis une vue pour suivre l&apos;avancement des phases ou
              navigue par statut avec le Kanban.
            </p>
          </div>

          <ViewToggle value={view} onChange={setView} options={viewTabs} />
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {view === "phase" ? (
            <PhaseView
              key="phase"
              phases={phases}
              overview={overview}
              onPhaseOpen={setSelectedPhase}
            />
          ) : (
            <KanbanView key="kanban" columns={kanbanColumns} />
          )}
        </AnimatePresence>
      </div>

      <PhaseModal
        phase={selectedPhase}
        onClose={() => setSelectedPhase(null)}
      />
    </div>
  );
}
