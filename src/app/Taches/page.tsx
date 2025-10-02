"use client"

import { useCallback, useMemo, useState } from "react"
import { AnimatePresence } from "motion/react"

import type { Phase, TaskStatus } from "./data"
import { phases as initialPhases } from "./data"
import { KanbanView } from "./components/kanban-view"
import { PhaseModal } from "./components/phase-modal"
import { PhaseView } from "./components/phase-view"
import { ViewOption, ViewToggle } from "./components/view-toggle"

type KanbanColumns = Record<
  TaskStatus,
  {
    phase: string
    phaseIndex: number
    taskIndex: number
    name: string
    description: string
    locked: boolean
  }[]
>

const viewTabs: { id: ViewOption; label: string }[] = [
  { id: "phase", label: "Par phase" },
  { id: "kanban", label: "Kanban" },
]

const clonePhases = (source: Phase[]): Phase[] =>
  source.map((phase) => ({
    ...phase,
    tasks: phase.tasks.map((task) => ({ ...task })),
  }))

export default function TasksPage() {
  const [phasesState, setPhasesState] = useState<Phase[]>(() =>
    clonePhases(initialPhases)
  )
  const [view, setView] = useState<ViewOption>("phase")
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(
    null
  )

  const selectedPhase =
    selectedPhaseIndex !== null ? phasesState[selectedPhaseIndex] ?? null : null

  const activePhaseIndex = useMemo(() => {
    const idx = phasesState.findIndex((phase) =>
      phase.tasks.some((task) => task.status !== "verified")
    )

    return idx === -1 ? null : idx
  }, [phasesState])

  const lockedPhaseIndices = useMemo(() => {
    const locked = new Set<number>()
    if (activePhaseIndex === null) {
      return locked
    }

    for (let index = activePhaseIndex + 1; index < phasesState.length; index++) {
      locked.add(index)
    }
    return locked
  }, [activePhaseIndex, phasesState.length])

  const overview = useMemo(() => {
    const totalTasks = phasesState.reduce(
      (acc, phase) => acc + phase.tasks.length,
      0
    )
    const completedTasks = phasesState.reduce(
      (acc, phase) =>
        acc + phase.tasks.filter((task) => task.status === "verified").length,
      0
    )

    const completion = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    const activeName =
      activePhaseIndex !== null
        ? phasesState[activePhaseIndex]?.name ?? "Tout est validé 🎉"
        : "Tout est validé 🎉"

    return {
      completion,
      totalTasks,
      completedTasks,
      activePhaseName: activeName,
    }
  }, [phasesState, activePhaseIndex])

  const kanbanColumns = useMemo<KanbanColumns>(() => {
    return phasesState.reduce<KanbanColumns>(
      (acc, phase, phaseIndex) => {
        const isLocked = lockedPhaseIndices.has(phaseIndex)

        phase.tasks.forEach((task, taskIndex) => {
          acc[task.status].push({
            phase: phase.name,
            phaseIndex,
            taskIndex,
            name: task.name,
            description: task.description,
            locked: isLocked || task.status === "verified",
          })
        })

        return acc
      },
      {
        todo: [],
        "in-progress": [],
        done: [],
        verified: [],
      }
    )
  }, [phasesState, lockedPhaseIndices])

  const handlePhaseOpen = useCallback(
    (phaseIndex: number) => {
      if (lockedPhaseIndices.has(phaseIndex)) {
        return
      }
      setSelectedPhaseIndex(phaseIndex)
    },
    [lockedPhaseIndices]
  )

  const handleModalClose = useCallback(() => {
    setSelectedPhaseIndex(null)
  }, [])

  const handleTaskStatusChange = useCallback(
    (phaseIndex: number, taskIndex: number, nextStatus: TaskStatus) => {
      if (nextStatus === "verified" || lockedPhaseIndices.has(phaseIndex)) {
        return
      }

      setPhasesState((prev) =>
        prev.map((phase, index) => {
          if (index !== phaseIndex) {
            return phase
          }

          const tasks = phase.tasks.map((task, currentIndex) => {
            if (currentIndex !== taskIndex) {
              return task
            }

            if (task.status === "verified" || task.status === nextStatus) {
              return task
            }

            return { ...task, status: nextStatus }
          })

          return { ...phase, tasks }
        })
      )
    },
    [lockedPhaseIndices]
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090B1E] py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(123,92,224,0.18),_rgba(8,10,35,0.75))]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[#7D5AE0]/30 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-[480px] w-[480px] rounded-full bg-[#1D1E3B]/30 blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-12">
        <header className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
              Pixelpay Onboarding
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Pilotage des tâches
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Choisis une vue pour suivre l&apos;avancement des phases ou navigue par
              statut avec le Kanban.
            </p>
          </div>

          <ViewToggle value={view} onChange={setView} options={viewTabs} />
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {view === "phase" ? (
            <PhaseView
              key="phase"
              phases={phasesState}
              overview={overview}
              onPhaseOpen={handlePhaseOpen}
              activeIndex={activePhaseIndex}
              lockedPhaseIndices={lockedPhaseIndices}
            />
          ) : (
            <KanbanView
              key="kanban"
              columns={kanbanColumns}
              onStatusChange={handleTaskStatusChange}
            />
          )}
        </AnimatePresence>
      </div>

      <PhaseModal
        phase={selectedPhase}
        phaseIndex={selectedPhaseIndex}
        onClose={handleModalClose}
        onStatusChange={handleTaskStatusChange}
        lockedPhaseIndices={lockedPhaseIndices}
      />
    </div>
  )
}
