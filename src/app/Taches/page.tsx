"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"

import type { Phase, TaskStatus } from "@/types/tasks"
import {
  createTask,
  deleteTask,
  listPhasesWithTasks,
  updateTask,
  updateTaskStatus,
} from "@/lib/supabase/services/tasks"
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
  const [phasesState, setPhasesState] = useState<Phase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      try {
        const data = await listPhasesWithTasks()
        if (!active) return
        setPhasesState(clonePhases(data))
        setError(null)
      } catch (err) {
        if (!active) return
        console.error("TasksPage: unable to load phases", err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])
  const [view, setView] = useState<ViewOption>("phase")
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(
    null
  )

  const { role } = useAuth()
  const canManageTasks = role === "manager"

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [taskForm, setTaskForm] = useState<{
    phaseIndex: number
    name: string
    description: string
    status: TaskStatus
  }>(() => ({
    phaseIndex: 0,
    name: "",
    description: "",
    status: "todo",
  }))
  const [editingContext, setEditingContext] = useState<
    { phaseIndex: number; taskIndex: number } | null
  >(null)

  const selectedPhase =
    selectedPhaseIndex !== null ? phasesState[selectedPhaseIndex] ?? null : null

  const activePhaseIndex = useMemo(() => {
    const idx = phasesState.findIndex((phase) =>
      phase.tasks.some((task) => task.status !== "verified")
    )

    return idx === -1 ? null : idx
  }, [phasesState])

  const lockedPhaseIndices = useMemo(() => {
    if (canManageTasks) {
      return new Set<number>()
    }
    const locked = new Set<number>()
    if (activePhaseIndex === null) {
      return locked
    }

    for (let index = activePhaseIndex + 1; index < phasesState.length; index++) {
      locked.add(index)
    }
    return locked
  }, [activePhaseIndex, phasesState.length, canManageTasks])

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
            locked:
              !canManageTasks && (isLocked || task.status === "verified"),
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
  }, [phasesState, lockedPhaseIndices, canManageTasks])

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
    async (phaseIndex: number, taskIndex: number, nextStatus: TaskStatus) => {
      const phase = phasesState[phaseIndex]
      const task = phase?.tasks[taskIndex]
      if (!phase || !task) return

      const phaseLocked = lockedPhaseIndices.has(phaseIndex)
      if (!canManageTasks) {
        if (nextStatus === "verified" || phaseLocked) {
          return
        }
      } else if (phaseLocked) {
        return
      }

      if (task.status === "verified" || task.status === nextStatus) {
        return
      }

      try {
        const updated = await updateTaskStatus(task.id, nextStatus)
        setPhasesState((prev) =>
          prev.map((currentPhase, index) => {
            if (index !== phaseIndex) return currentPhase
            const tasks = currentPhase.tasks.map((currentTask, idx) => {
              if (idx !== taskIndex) return currentTask
              return { ...currentTask, ...updated }
            })
            return { ...currentPhase, tasks }
          })
        )
      } catch (err) {
        console.error("TasksPage: unable to update task status", err)
      }
    },
    [canManageTasks, lockedPhaseIndices, phasesState]
  )

  const openTaskDialog = useCallback(
    (phaseIndex: number | null, taskIndex: number | null) => {
      const safePhaseIndex = Math.max(
        0,
        Math.min(phaseIndex ?? activePhaseIndex ?? 0, phasesState.length - 1)
      )
      if (taskIndex !== null && phaseIndex !== null) {
        const task = phasesState[phaseIndex]?.tasks[taskIndex]
        if (!task) return
        setTaskForm({
          phaseIndex,
          name: task.name,
          description: task.description,
          status: task.status,
        })
        setEditingContext({ phaseIndex, taskIndex })
      } else {
        setTaskForm({
          phaseIndex: safePhaseIndex,
          name: "",
          description: "",
          status: "todo",
        })
        setEditingContext(null)
      }
      setIsTaskDialogOpen(true)
    },
    [activePhaseIndex, phasesState]
  )

  const handleTaskDelete = useCallback(
    async (phaseIndex: number, taskIndex: number) => {
      const phase = phasesState[phaseIndex]
      const task = phase?.tasks[taskIndex]
      if (!phase || !task) {
        return
      }

      const confirmed = window.confirm(
        `Supprimer la tâche "${task.name}" de la phase ${phase.name} ?`
      )
      if (!confirmed) return

      try {
        await deleteTask(task.id)
        setPhasesState((prev) =>
          prev.map((currentPhase, index) => {
            if (index !== phaseIndex) return currentPhase
            const tasks = currentPhase.tasks.filter((currentTask) => currentTask.id !== task.id)
            return { ...currentPhase, tasks }
          })
        )
      } catch (err) {
        console.error("TasksPage: unable to delete task", err)
      }
    },
    [phasesState]
  )

  const handleTaskFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (phasesState.length === 0) return

      const phase = phasesState[taskForm.phaseIndex]
      if (!phase) return

      const name = taskForm.name.trim()
      if (!name) return

      const payload = {
        name,
        description: taskForm.description.trim(),
        status: taskForm.status,
      }

      try {
        if (editingContext) {
          const targetPhase = phasesState[editingContext.phaseIndex]
          const targetTask = targetPhase?.tasks[editingContext.taskIndex]
          if (!targetTask) {
            return
          }
          const updated = await updateTask(targetTask.id, payload)
          setPhasesState((prev) =>
            prev.map((currentPhase, index) => {
              if (index !== editingContext.phaseIndex) return currentPhase
              const tasks = currentPhase.tasks.map((currentTask, idx) =>
                idx === editingContext.taskIndex
                  ? { ...currentTask, ...updated }
                  : currentTask
              )
              return { ...currentPhase, tasks }
            })
          )
        } else {
          const created = await createTask({
            phaseId: phase.id,
            ...payload,
          })
          setPhasesState((prev) =>
            prev.map((currentPhase, index) => {
              if (index !== taskForm.phaseIndex) return currentPhase
              return { ...currentPhase, tasks: [...currentPhase.tasks, created] }
            })
          )
        }

        setIsTaskDialogOpen(false)
        setEditingContext(null)
      } catch (err) {
        console.error("TasksPage: unable to save task", err)
      }
    },
    [editingContext, phasesState, taskForm]
  )

  const handleTaskEditRequest = useCallback(
    (phaseIndex: number, taskIndex: number) => {
      openTaskDialog(phaseIndex, taskIndex)
    },
    [openTaskDialog]
  )

  const handleTaskCreateRequest = useCallback(() => {
    openTaskDialog(activePhaseIndex ?? 0, null)
  }, [activePhaseIndex, openTaskDialog])

  const resetTaskDialog = useCallback(() => {
    setIsTaskDialogOpen(false)
    setEditingContext(null)
  }, [])

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#090B1E] py-16 text-white flex items-center justify-center">
        <p className="text-white/70 text-lg">Chargement des tâches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-[#090B1E] py-16 text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Impossible de charger les tâches</h1>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }

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
          <div className="flex flex-wrap items-center gap-4">
            <ViewToggle value={view} onChange={setView} options={viewTabs} />
            {canManageTasks && (
              <Button
                type="button"
                onClick={handleTaskCreateRequest}
                className="rounded-full bg-violet_fonce_1 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet"
              >
                Ajouter une tâche
              </Button>
            )}
          </div>
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
              allowVerifiedDrop={canManageTasks}
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
        canManageTasks={canManageTasks}
        onTaskEdit={canManageTasks ? handleTaskEditRequest : undefined}
        onTaskDelete={canManageTasks ? handleTaskDelete : undefined}
      />

      <Dialog open={isTaskDialogOpen} onOpenChange={(open) => (!open ? resetTaskDialog() : null)}>
        <DialogContent className="bg-[#13162F] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>
              {editingContext ? "Modifier la tâche" : "Nouvelle tâche"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {editingContext
                ? "Mets à jour les informations de la tâche sélectionnée."
                : "Ajoute une tâche dans la phase de ton choix."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTaskFormSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Phase
              </label>
              <select
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
                value={taskForm.phaseIndex}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    phaseIndex: Number(event.target.value),
                  }))
                }
              >
                {phasesState.map((phase, index) => (
                  <option key={phase.name} value={index}>
                    {phase.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Nom
              </label>
              <Input
                required
                value={taskForm.name}
                onChange={(event) =>
                  setTaskForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Titre de la tâche"
                className="border-white/10 bg-white/10 text-white"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Description
              </label>
              <textarea
                value={taskForm.description}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Décris la tâche et ses objectifs"
                className="min-h-[120px] resize-y rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Statut initial
              </label>
              <select
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
                value={taskForm.status}
                onChange={(event) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    status: event.target.value as TaskStatus,
                  }))
                }
              >
                <option value="todo">À faire</option>
                <option value="in-progress">En cours</option>
                <option value="done">Fait</option>
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={resetTaskDialog}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-violet_fonce_1 hover:bg-violet"
              >
                {editingContext ? "Enregistrer" : "Créer la tâche"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
