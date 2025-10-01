import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface OverviewCardProps {
  overview: {
    completion: number
    totalTasks: number
    completedTasks: number
    activePhaseName: string
  }
  className?: string
}

export function OverviewCard({ overview, className }: OverviewCardProps) {
  const remaining = Math.max(overview.totalTasks - overview.completedTasks, 0)

  return (
    <motion.div
      layout
      className={cn("relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(123,92,224,0.28),_rgba(27,30,63,0.9))] p-7 text-white shadow-[0_40px_100px_-60px_rgba(8,10,35,0.9)]", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              Vue d&apos;ensemble
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {overview.completion}%
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/70">
              {overview.completedTasks} tâches validées sur {overview.totalTasks}.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              Phase active
            </span>
            <span className="text-lg font-medium text-white">
              {overview.activePhaseName}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Progression globale</span>
            <span>{overview.completion}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              layout
              className="h-full rounded-full bg-gradient-to-r from-[#663BD6] via-[#7D5AE0] to-[#9D7BFF]"
              style={{ width: `${overview.completion}%` }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/90">
            {overview.completedTasks} tâches validées
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {remaining} restantes
          </span>
        </div>
      </div>
    </motion.div>
  )
}
