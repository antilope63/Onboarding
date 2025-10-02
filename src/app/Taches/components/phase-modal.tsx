import { Fragment, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

import type { Phase, TaskStatus } from "../data"
import { statusMeta } from "./status-meta"

interface PhaseModalProps {
  phase: Phase | null
  phaseIndex: number | null
  onClose: () => void
  onStatusChange: (phaseIndex: number, taskIndex: number, nextStatus: TaskStatus) => void
  lockedPhaseIndices: Set<number>
  canManageTasks?: boolean
  onTaskEdit?: (phaseIndex: number, taskIndex: number) => void
  onTaskDelete?: (phaseIndex: number, taskIndex: number) => void
}

const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "done", "verified"]
const EDITABLE_STATUSES = ["todo", "in-progress", "done"] as const satisfies TaskStatus[]

const STATUS_BUTTON_STYLE: Record<(typeof EDITABLE_STATUSES)[number], string> = {
  todo: "border-white/10 bg-[#1F234A]/70 text-[#C8CEFF] hover:border-[#7D5AE0]/40 hover:bg-[#1F234A]/90",
  "in-progress": "border-white/10 bg-[#2A214C]/70 text-[#E3D9FF] hover:border-[#663BD6]/40 hover:bg-[#2A214C]/90",
  done: "border-[#3DD68C]/30 bg-[#163C30]/70 text-[#9AF3CB] hover:border-[#3DD68C]/50 hover:bg-[#163C30]/90",
}

export function PhaseModal({
  phase,
  phaseIndex,
  onClose,
  onStatusChange,
  lockedPhaseIndices,
  canManageTasks = false,
  onTaskEdit,
  onTaskDelete,
}: PhaseModalProps) {
  const stats = useMemo(() => {
    if (!phase) {
      return { total: 0, verified: 0, completion: 0 }
    }

    const total = phase.tasks.length
    const verified = phase.tasks.filter((task) => task.status === "verified").length
    const completion = total ? Math.round((verified / total) * 100) : 0

    return { total, verified, completion }
  }, [phase])

  const isLocked = phaseIndex !== null && lockedPhaseIndices.has(phaseIndex)
  const canEdit = phaseIndex !== null && !isLocked
  const canManage = canManageTasks && !isLocked && phaseIndex !== null

  return (
    <AnimatePresence>
      {phase && phaseIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04061D]/70 px-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <motion.div
            layout
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#13162F]/95 p-6 text-white shadow-[0_50px_140px_-60px_rgba(4,6,29,0.95)] sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Fermer"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>

            <div className="flex-1 overflow-y-auto pr-2 sm:pr-3">
              <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Phase
                  </span>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    {phase.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">
                    {stats.verified}/{stats.total} tâches validées
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/80 sm:items-end">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                    Progression
                  </span>
                  <span className="text-3xl font-semibold text-white">
                    {stats.completion}%
                  </span>
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      layout
                      className="h-full rounded-full bg-gradient-to-r from-[#663BD6] via-[#7D5AE0] to-[#9D7BFF]"
                      style={{ width: `${stats.completion}%` }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </header>

              {isLocked && (
                <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  Cette phase est verrouillée tant que les phases précédentes ne sont pas validées.
                </div>
              )}

              <section className="space-y-6 pb-6">
                {STATUS_ORDER.map((status) => {
                  const tasks = phase.tasks
                    .map((task, index) => ({ task, index }))
                    .filter(({ task }) => task.status === status)

                  if (!tasks.length) return null

                  return (
                    <Fragment key={status}>
                      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-white/60">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusMeta[status].dot}`} />
                        {statusMeta[status].label}
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                          {tasks.length}
                        </span>
                      </div>
                      <ul className="grid gap-3 rounded-[24px] border border-white/8 bg-white/[0.04] p-4 sm:grid-cols-2">
                        {tasks.map(({ task, index: taskIndex }) => {
                          const isReadonly =
                            !canEdit ||
                            (task.status === "verified" && !canManage)

                          return (
                            <li
                              key={`${task.name}-${taskIndex}`}
                              className="flex flex-col gap-3 rounded-[20px] border border-white/8 bg-[#151936]/80 p-4 shadow-[0_25px_70px_-65px_rgba(8,10,35,0.9)]"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-base font-medium text-white">
                                  {task.name}
                                </p>
                                <span
                                  className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusMeta[task.status].badge}`}
                                >
                                  {statusMeta[task.status].label}
                                </span>
                              </div>
                              <p className="text-sm text-white/60">{task.description}</p>

                              {!isReadonly && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {EDITABLE_STATUSES.map((statusOption) => (
                                    <button
                                      key={statusOption}
                                      type="button"
                                      onClick={() =>
                                        onStatusChange(
                                          phaseIndex,
                                          taskIndex,
                                          statusOption
                                        )
                                      }
                                      disabled={task.status === statusOption}
                                      className={cn(
                                        "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition",
                                        STATUS_BUTTON_STYLE[statusOption] ?? "",
                                        task.status === statusOption
                                          ? "ring-1 ring-inset ring-white/40"
                                          : "opacity-80 hover:opacity-100"
                                      )}
                                    >
                                      {statusMeta[statusOption].label}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {canManage && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {task.status !== "verified" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (phaseIndex !== null) {
                                          onStatusChange(
                                            phaseIndex,
                                            taskIndex,
                                            "verified"
                                          )
                                        }
                                      }}
                                      className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-100 transition hover:bg-emerald-500/30 hover:text-white"
                                    >
                                      Valider
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (phaseIndex !== null) {
                                        onTaskEdit?.(phaseIndex, taskIndex)
                                      }
                                    }}
                                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 transition hover:bg-white/20 hover:text-white"
                                  >
                                    Modifier
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (phaseIndex !== null) {
                                        onTaskDelete?.(phaseIndex, taskIndex)
                                      }
                                    }}
                                    className="rounded-full border border-red-400/50 bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-200 transition hover:bg-red-500/30 hover:text-white"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </Fragment>
                  )
                })}
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
