import { motion } from "motion/react"

import type { TaskStatus } from "../data"
import { statusMeta } from "./status-meta"

interface KanbanViewProps {
  columns: Record<
    TaskStatus,
    { phase: string; name: string; description: string }[]
  >
}

const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "done", "verified"]

export function KanbanView({ columns }: KanbanViewProps) {
  return (
    <motion.div
      key="kanban-view"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-4"
    >
      {STATUS_ORDER.map((status) => (
        <KanbanColumn key={status} status={status} tasks={columns[status]} />
      ))}
    </motion.div>
  )
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: { phase: string; name: string; description: string }[]
}

function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  return (
    <motion.div
      layout
      className={`flex min-h-[460px] flex-col gap-5 rounded-[26px] border p-6 text-white shadow-[0_35px_100px_-70px_rgba(4,6,29,0.95)] ${statusMeta[status].panel}`}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-white/70">
          <span className={`h-2.5 w-2.5 rounded-full ${statusMeta[status].dot}`} />
          {statusMeta[status].label}
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.length ? (
          tasks.map((task) => (
            <motion.div
              layout
              key={`${task.phase}-${task.name}`}
              className="rounded-[22px] border border-white/10 bg-[#151935]/85 p-4 shadow-[0_25px_70px_-65px_rgba(4,6,29,0.95)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-white">{task.name}</p>
                <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                  {task.phase}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60">{task.description}</p>
            </motion.div>
          ))
        ) : (
          <motion.div
            layout
            className="flex flex-1 items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-xs font-medium uppercase tracking-wide text-white/40"
          >
            Aucune tâche ici
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
