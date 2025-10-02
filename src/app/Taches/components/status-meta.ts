import type { TaskStatus } from "@/types/tasks"

type StatusStyle = {
  label: string
  badge: string
  dot: string
  panel: string
}

export const statusMeta: Record<TaskStatus, StatusStyle> = {
  todo: {
    label: "À faire",
    badge:
      "border-white/10 bg-[#1F234A]/80 text-[#C8CEFF] shadow-[0_10px_20px_-15px_rgba(4,6,29,0.8)]",
    dot: "bg-[#7D5AE0]",
    panel: "border-white/8 bg-[#151935]/90",
  },
  "in-progress": {
    label: "En cours",
    badge:
      "border-white/10 bg-[#2A214C]/85 text-[#E3D9FF] shadow-[0_10px_20px_-15px_rgba(4,6,29,0.8)]",
    dot: "bg-[#663BD6]",
    panel: "border-white/8 bg-[#1A1C3A]/90",
  },
  done: {
    label: "Clôturé",
    badge:
      "border-[#3DD68C]/30 bg-[#163C30]/85 text-[#9AF3CB] shadow-[0_10px_20px_-15px_rgba(4,6,29,0.8)]",
    dot: "bg-[#3DD68C]",
    panel: "border-[#3DD68C]/20 bg-[#112D24]/90",
  },
  verified: {
    label: "Validé",
    badge:
      "border-[#8B5CF6]/30 bg-[#241C47]/85 text-[#CFC2FF] shadow-[0_10px_20px_-15px_rgba(4,6,29,0.8)]",
    dot: "bg-[#8B5CF6]",
    panel: "border-[#8B5CF6]/20 bg-[#191739]/90",
  },
}

export type StatusMeta = typeof statusMeta
