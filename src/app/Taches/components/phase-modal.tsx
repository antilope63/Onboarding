import { Fragment, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"

import type { Phase, TaskStatus } from "../data"
import { statusMeta } from "./status-meta"

interface PhaseModalProps {
  phase: Phase | null
  onClose: () => void
}

const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "done", "verified"]

export function PhaseModal({ phase, onClose }: PhaseModalProps) {
  const stats = useMemo(() => {
    if (!phase) {
      return { total: 0, verified: 0, completion: 0 }
    }

    const total = phase.tasks.length
    const verified = phase.tasks.filter((task) => task.status === "verified").length
    const completion = total ? Math.round((verified / total) * 100) : 0

    return { total, verified, completion }
  }, [phase])

  return (
    <AnimatePresence>
      {phase && (
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
            className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[#13162F]/95 p-8 text-white shadow-[0_50px_140px_-60px_rgba(4,6,29,0.95)]"
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

            <section className="space-y-6">
              {STATUS_ORDER.map((status) => {
                const tasks = phase.tasks.filter((task) => task.status === status)

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
                      {tasks.map((task) => (
                        <li
                          key={task.name}
                          className="flex flex-col gap-2 rounded-[20px] border border-white/8 bg-[#151936]/80 p-4 shadow-[0_25px_70px_-65px_rgba(8,10,35,0.9)]"
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
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                )
              })}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
