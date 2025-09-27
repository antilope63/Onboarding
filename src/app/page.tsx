"use client";
import { CircularProgress } from "@/components/ui/CircularProgress.tsx";
import { BentoGrid } from "@/components/ui/bento-grid";
export default function Home() {
  return (
    <div className="relative min-h-[100svh] bg-[#02061B] overflow-hidden">
      {/* ORB au-dessus (pas masqué) */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center z-20">
        {/* léger halo pour le relief du bord */}
        <div className="w-[calc(2*var(--r)+40px)] h-[calc(2*var(--r)+40px)] rounded-full bg-black/60 blur-[24px] opacity-30" />
        <CircularProgress
          strokeWidth={18}
          size={350}
          from="#A855F7"
          to="#6366F1"
          trackColor="#02061B"
        />

        <div className="w-[calc(2*var(--r))] h-[calc(2*var(--r))] rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] opacity-90" />
      </div>

      {/* WRAPPER + MASQUE (toutes les cards sont “creusées” par ce masque) */}
      <div
        className={[
          "h-[100svh] p-8 z-10",
          // masque radial centré : transparent jusqu'à --r (le trou), opaque au-delà
          "[--r:clamp(140px,22vmin,190px)]",
          "[mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[-webkit-mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[mask-repeat:no-repeat] [mask-position:center] [mask-size:100%_100%]",
        ].join(" ")}
      >
        <div className="grid h-full grid-cols-12 grid-rows-4 gap-6">
          {/* A - Bloc gauche haut */}
          <div className="rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-linear-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]"></div>

          {/* B - Hero centre */}
          <div className=" rounded-[32px] p-6 lg:col-span-6 lg:row-span-2 border border-white/7 bg-radial-[at_50%_100%] from-[#805CE3] from-30% via-[#683DD9]  to-[#663AD8]">
            <div className="text-white text-8xl font-bold flex items-center justify-center text-center">
              Pixelpay <br /> Onboarding
            </div>
          </div>

          {/* C - Petit pilule haut droite */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-linear-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]">
            C
          </div>

          {/* D - Stats droite */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-linear-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]">
            D
          </div>

          {/* E - Petit bloc sous A */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-linear-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]">
            E
          </div>

          {/* F - Branching paths */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-linear-to-tr from-[#1B1B37] via-[#1F2245] to-[#25284F]">
            F
          </div>

          {/* G - Keyword enhancer */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-linear-to-tl from-[#1B1B37] via-[#1F2245] to-[#25284F]">
            G
          </div>

          {/* H - Prompt templates droite */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-2 border border-white/7 bg-linear-to-r from-[#25284F] via-[#1F2245] to-[#1B1B37]">
            H
          </div>

          {/* I - Bouton bas gauche */}
          <div className=" rounded-2xl p-6 lg:col-span-3 lg:row-span-1 border border-white/7 bg-linear-to-r from-[#1B1B37] via-[#1F2245] to-[#25284F]">
            I
          </div>
        </div>
      </div>
    </div>
  );
}
