// components/ui/CircularProgress.tsx
"use client";
import { nullBrand } from "@/lib/font";
import { useId } from "react";
// ⚠️ Garde ce chemin identique à ton projet (les accents peuvent poser souci selon la config)
import { getPhaseStats, phases } from "@/app/Tâches/data";

type Props = {
  /** taille en px (diamètre) */
  size?: number;
  /** épaisseur de l’anneau en px */
  strokeWidth?: number;
  /** couleur du track (anneau de fond) */
  trackColor?: string;
  /** gradient du progress (début → fin) */
  from?: string;
  to?: string;
  /** couleur du texte */
  labelColor?: string;
};

export function CircularProgress({
  size = 220,
  strokeWidth = 18,
  trackColor = "rgba(255,255,255,0.08)", // track discret par défaut
  from = "#8B5CF6",
  to = "#6D28D9",
  labelColor = "#E5E7EB",
}: Props) {
  const id = useId();

  // ---- Récup des stats depuis tes données ---------------------------------
  const { activeIndex, done, total, percent } = getPhaseStats(phases);

  // Numéro de phase à afficher au centre
  const phaseNumber = activeIndex !== null ? activeIndex + 1 : phases.length;

  // ---- Géométrie du cercle -------------------------------------------------
  const r = (size - strokeWidth) / 2; // rayon utile
  const c = 2 * Math.PI * r; // circonférence
  const dash = (percent / 100) * c; // portion peinte
  const gap = c - dash; // portion restante

  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {/* Track (anneau de fond) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Progress (anneau coloré) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#grad-${id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // démarrer en haut
          strokeDasharray={`${dash} ${gap}`}
        />

        {/* Disque intérieur (fond) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - strokeWidth / 2 - 1} // -1px pour éviter tout liseré
          fill="#02061B"
        />
      </svg>

      {/* Numéro de phase au centre */}
      <div
        className={`${nullBrand.className} absolute inset-0 grid place-items-center select-none`}
        style={{
          color: labelColor,
          fontSize: Math.round(size * 0.33),
          lineHeight: 1, // supprime le leading
        }}
      >
        <span className="block translate-y-[-1px]">{phaseNumber}</span>
      </div>

      {/* Pourcentage en bas, petit */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-8 text-xs font-medium select-none"
        style={{ color: "rgba(229,231,235,0.8)" }}
      >
        {percent}% • {done}/{total}
      </div>
    </div>
  );
}
