"use client"

import { useCallback, type DragEvent } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

import type { TaskStatus } from "@/types/tasks"
import { statusMeta } from "./status-meta"

interface KanbanTask {
  phase: string
  phaseIndex: number
  taskIndex: number
  name: string
  description: string
  locked: boolean
}

interface KanbanViewProps {
  columns: Record<TaskStatus, KanbanTask[]>
  onStatusChange: (phaseIndex: number, taskIndex: number, nextStatus: TaskStatus) => void
  allowVerifiedDrop?: boolean
}

const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "done", "verified"]

export function KanbanView({
  columns,
  onStatusChange,
  allowVerifiedDrop = false,
}: KanbanViewProps) {
  return (
    <motion.div
      key="kanban-view"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-4"
    >
      {STATUS_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={columns[status]}
          onStatusChange={onStatusChange}
          allowVerifiedDrop={allowVerifiedDrop}
        />
      ))}
    </motion.div>
  )
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: KanbanTask[]
  onStatusChange: (phaseIndex: number, taskIndex: number, nextStatus: TaskStatus) => void
  allowVerifiedDrop: boolean
}

function KanbanColumn({
  status,
  tasks,
  onStatusChange,
  allowVerifiedDrop,
}: KanbanColumnProps) {
  const isDroppable = allowVerifiedDrop || status !== "verified"

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!isDroppable) return
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
    },
    [isDroppable]
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (!isDroppable) return
      event.preventDefault()
      const raw = event.dataTransfer.getData("application/json")
      if (!raw) return

      try {
        const payload = JSON.parse(raw) as {
          phaseIndex: number
          taskIndex: number
          status: TaskStatus
        }

        if (
          typeof payload?.phaseIndex !== "number" ||
          typeof payload?.taskIndex !== "number"
        ) {
          return
        }

        if (payload.status === status) return

        onStatusChange(payload.phaseIndex, payload.taskIndex, status)
      } catch (error) {
        console.error("Invalid drag payload", error)
      }
    },
    [isDroppable, onStatusChange, status]
  )

  return (
    <motion.div
      layout
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-droppable={isDroppable}
      className={cn(
        "flex min-h-[560px] flex-col gap-6 rounded-[28px] border p-7 text-white shadow-[0_45px_120px_-70px_rgba(4,6,29,0.95)] transition",
        statusMeta[status].panel,
        isDroppable
          ? "border-white/12 bg-opacity-90"
          : "opacity-70 border-white/20"
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-white/70">
            <span className={`h-2.5 w-2.5 rounded-full ${statusMeta[status].dot}`} />
            {statusMeta[status].label}
          </div>
          {isDroppable && (
            <p className="text-[11px] uppercase tracking-widest text-white/40">
              Glisse une carte ici pour changer de statut
            </p>
          )}
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4">
        {tasks.length ? (
          tasks.map((task) => (
            <KanbanCard
              key={`${task.phaseIndex}-${task.taskIndex}`}
              task={task}
              status={status}
              isDroppable={isDroppable}
            />
          ))
        ) : (
          <motion.div
            layout
            className="flex flex-1 items-center justify-center rounded-[22px] border border-dashed border-white/12 bg-white/[0.03] p-6 text-center text-[11px] font-semibold uppercase tracking-wide text-white/40"
          >
            Aucune tâche ici
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

interface KanbanCardProps {
  task: KanbanTask
  status: TaskStatus
  isDroppable: boolean
}

function KanbanCard({ task, status, isDroppable }: KanbanCardProps) {
  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (task.locked || !isDroppable) {
        event.preventDefault()
        return
      }

      const node = event.currentTarget as HTMLElement | null
      if (node) {
        const preview = node.cloneNode(true) as HTMLElement
        preview.style.position = "fixed"
        preview.style.top = "-1000px"
        preview.style.left = "-1000px"
        preview.style.width = `${node.offsetWidth}px`
        preview.style.height = `${node.offsetHeight}px`
        preview.style.pointerEvents = "none"
        preview.style.borderRadius = getComputedStyle(node).borderRadius
        const previewId = `drag-preview-${task.phaseIndex}-${task.taskIndex}-${Date.now()}`
        preview.id = previewId
        document.body.appendChild(preview)

        const nodeWithDataset = node as HTMLElement & {
          dataset: DOMStringMap & { dragPreviewId?: string }
        }
        nodeWithDataset.dataset.dragPreviewId = previewId

        event.dataTransfer.setDragImage(
          preview,
          preview.offsetWidth / 2,
          preview.offsetHeight / 2
        )

        requestAnimationFrame(() => {
          node.classList.add("opacity-0")
        })
      }

      event.dataTransfer.effectAllowed = "move"
      const payload = JSON.stringify({
        phaseIndex: task.phaseIndex,
        taskIndex: task.taskIndex,
        status,
      })
      event.dataTransfer.setData("application/json", payload)
      event.dataTransfer.setData("text/plain", task.name)
    },
    [isDroppable, status, task]
  )

  const handleDragEnd = useCallback((event: DragEvent<HTMLDivElement>) => {
    const node = event.currentTarget as HTMLElement | null
    if (!node) return

    const nodeWithDataset = node as HTMLElement & {
      dataset: DOMStringMap & { dragPreviewId?: string }
    }
    const previewId = nodeWithDataset.dataset.dragPreviewId
    if (previewId) {
      const preview = document.getElementById(previewId)
      if (preview?.parentNode) {
        preview.parentNode.removeChild(preview)
      }
      delete nodeWithDataset.dataset.dragPreviewId
    }
    node.classList.remove("opacity-0")
  }, [])

  return (
    <motion.div layout>
      <div
        draggable={isDroppable && !task.locked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          "rounded-[24px] border border-white/10 bg-[#151935]/85 p-5 shadow-[0_30px_90px_-70px_rgba(4,6,29,0.95)] transition",
          task.locked
            ? "cursor-not-allowed opacity-40"
            : "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-medium text-white">{task.name}</p>
            <p className="mt-2 text-xs text-white/60">{task.description}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
            {task.phase}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
