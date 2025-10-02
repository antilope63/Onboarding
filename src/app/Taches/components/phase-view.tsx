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
  onPhaseOpen: (phaseIndex: number) => void
  activeIndex: number | null
  lockedPhaseIndices: Set<number>
}

export function PhaseView({
  phases,
  overview,
  onPhaseOpen,
  activeIndex,
  lockedPhaseIndices,
}: PhaseViewProps) {
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

      {phases.map((phase, index) => {
        const locked = lockedPhaseIndices.has(index)
        const isActive = activeIndex === index

        return (
          <PhaseCard
            key={phase.name}
            phase={phase}
            order={index}
            statusMeta={statusMeta}
            locked={locked}
            isActive={isActive}
            onClick={() => {
              if (!locked) {
                onPhaseOpen(index)
              }
            }}
          />
        )
      })}
    </motion.div>
  )
}

interface PhaseCardProps {
  phase: Phase
  order: number
  statusMeta: StatusMeta
  locked: boolean
  isActive: boolean
  onClick: () => void
}

function PhaseCard({
  phase,
  order,
  statusMeta,
  locked,
  isActive,
  onClick,
}: PhaseCardProps) {
  const totalTasks = phase.tasks.length
  const verifiedTasks = phase.tasks.filter((task) => task.status === "verified").length
  const completion = totalTasks ? Math.round((verifiedTasks / totalTasks) * 100) : 0

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={locked ? undefined : { translateY: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(34,37,76,0.92),_rgba(25,27,56,0.94))] p-6 text-left text-white shadow-[0_35px_90px_-60px_rgba(8,10,35,0.95)] transition",
        locked
          ? "cursor-not-allowed opacity-35 saturate-50"
          : "hover:-translate-y-1 hover:shadow-[0_45px_120px_-80px_rgba(8,10,35,0.95)]",
        isActive && !locked
          ? "border-[#7D5AE0]/40 bg-[radial-gradient(ellipse_at_top,_rgba(123,92,224,0.28),_rgba(27,30,63,0.9))]"
          : undefined
      )}
      aria-disabled={locked}
      tabIndex={locked ? -1 : 0}
    >
      {locked && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
          Phase verrouillée
        </span>
      )}

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Phase {order + 1}
            </span>
            {isActive && !locked && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#7D5AE0]/30 bg-[#7D5AE0]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E4DEFF]">
                Phase active
              </span>
            )}
          </div>
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
