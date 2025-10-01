import { motion } from "motion/react"

import { cn } from "@/lib/utils"

import type { Phase, TaskStatus } from "../data"
import { statusMeta, type StatusMeta } from "./status-meta"
import { OverviewCard } from "./overview-card"

interface Overview {
  completion: number
  totalTasks: number
  completedTasks: number
  activePhaseName: string
}

interface PhaseViewProps {
  phases: Phase[]
  overview: Overview
  onPhaseOpen: (phase: Phase) => void
}

export function PhaseView({ phases, overview, onPhaseOpen }: PhaseViewProps) {
  return (
    <motion.div
      key="phase-view"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      <OverviewCard overview={overview} className="lg:col-span-2" />

      {phases.map((phase, index) => (
        <PhaseCard
          key={phase.name}
          phase={phase}
          order={index}
          statusMeta={statusMeta}
          onClick={() => onPhaseOpen(phase)}
        />
      ))}
    </motion.div>
  )
}

interface PhaseCardProps {
  phase: Phase
  order: number
  statusMeta: StatusMeta
  onClick: () => void
}

function PhaseCard({ phase, order, statusMeta, onClick }: PhaseCardProps) {
  const totalTasks = phase.tasks.length
  const verifiedTasks = phase.tasks.filter((task) => task.status === "verified").length
  const completion = totalTasks ? Math.round((verifiedTasks / totalTasks) * 100) : 0

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(34,37,76,0.92),_rgba(25,27,56,0.94))] p-6 text-left text-white shadow-[0_35px_90px_-60px_rgba(8,10,35,0.95)]"
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
            Phase {order + 1}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {phase.name}
          </h3>
          <p className="text-sm text-white/60">
            {verifiedTasks}/{totalTasks} tâches validées
          </p>
        </div>

        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            layout
            className="h-full rounded-full bg-gradient-to-r from-[#663BD6] via-[#7D5AE0] to-[#9D7BFF]"
            style={{ width: `${completion}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          {(Object.keys(statusMeta) as TaskStatus[]).map((status) => {
            const count = phase.tasks.filter((task) => task.status === status).length

            if (!count) return null

            return (
              <span
                key={status}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1",
                  statusMeta[status].badge
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", statusMeta[status].dot)} />
                {count} {statusMeta[status].label.toLowerCase()}
              </span>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-semibold text-white/80">
          {completion}%
        </span>

        <span className="pointer-events-none inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium uppercase tracking-wide text-white/50 transition-colors duration-300 group-hover:text-white/90">
          Voir les détails
          <svg
            className="h-3.5 w-3.5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.button>
  )
}
