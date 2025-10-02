import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type ViewOption = "phase" | "kanban"

interface ViewToggleProps {
  value: ViewOption
  onChange: (value: ViewOption) => void
  options: { id: ViewOption; label: string }[]
}

export function ViewToggle({ value, onChange, options }: ViewToggleProps) {
  return (
    <div className="relative grid h-12 w-full max-w-md grid-cols-2 overflow-hidden rounded-full border border-white/10 bg-white/5 p-[5px] text-sm font-medium text-white/70 shadow-[0_25px_60px_-45px_rgba(4,6,29,0.95)] backdrop-blur-lg saturate-150">
      <motion.span
        layout
        layoutId="view-toggle"
        initial={false}
        animate={{ left: value === "phase" ? "0.35rem" : "calc(50% + 0.35rem)" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[5px] bottom-[5px] rounded-full bg-gradient-to-br from-white/20 via-white/15 to-white/5 shadow-[0_20px_50px_-25px_rgba(8,10,35,0.9)]"
        style={{ width: "calc(50% - 0.7rem)" }}
      />
      {options.map((option) => {
        const isActive = option.id === value

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "relative z-10 flex items-center justify-center rounded-full transition-colors",
              isActive
                ? "text-[#04061D]"
                : "text-white/60 hover:text-white/90"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
