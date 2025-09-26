export default function Home() {
  return (
    <div className="relative min-h-[100svh] bg-[#0B0E16] overflow-hidden">
      {/* ORB au-dessus (pas masqué) */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center z-20">
        {/* léger halo pour le relief du bord */}
        <div className="w-[calc(2*var(--r)+40px)] h-[calc(2*var(--r)+40px)] rounded-full bg-black/60 blur-[24px] opacity-30" />
        {/* orb centrale (placeholder) */}
        <div className="w-[calc(2*var(--r))] h-[calc(2*var(--r))] rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] opacity-90" />
      </div>

      {/* WRAPPER + MASQUE (toutes les cards sont “creusées” par ce masque) */}
      <div
        className={[
          "h-[100svh] p-8 z-10",
          // masque radial centré : transparent jusqu'à --r (le trou), opaque au-delà
          "[--r:260px]",
          "[mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[-webkit-mask-image:radial-gradient(circle_at_center,transparent_var(--r),#000_var(--r))]",
          "[mask-repeat:no-repeat] [mask-position:center] [mask-size:100%_100%]",
        ].join(" ")}
      >
        <div className="grid h-full grid-cols-12 grid-rows-4 gap-6">
          {/* A - Bloc gauche haut */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-2">
            A
          </div>

          {/* B - Hero centre */}
          <div className="bg-[#7D5AE0] rounded-[32px] p-6 lg:col-span-6 lg:row-span-2">
            B
          </div>

          {/* C - Petit pilule haut droite */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-1">
            C
          </div>

          {/* D - Stats droite */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-1">
            D
          </div>

          {/* E - Petit bloc sous A */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-1">
            E
          </div>

          {/* F - Branching paths */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-2">
            F
          </div>

          {/* G - Keyword enhancer */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-2">
            G
          </div>

          {/* H - Prompt templates droite */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-2">
            H
          </div>

          {/* I - Bouton bas gauche */}
          <div className="bg-[#7D5AE0] rounded-2xl p-6 lg:col-span-3 lg:row-span-1">
            I
          </div>
        </div>
      </div>
    </div>
  );
}
