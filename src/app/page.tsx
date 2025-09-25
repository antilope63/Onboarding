export default function Home() {
  return (
    <div className="min-h-screen w-full p-8">
      <div className="grid grid-cols-12 grid-rows-4 h-screen gap-6">
        {/* A - Bloc gauche haut */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2">
          A
        </div>

        {/* B - Hero centre */}
        <div className="bg-[#121622] rounded-[32px] p-6 md:col-span-6 md:row-span-2 lg:col-span-6 lg:row-span-2">
          B
        </div>

        {/* C - Petit pilule haut droite */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1">
          C
        </div>

        {/* D - Stats droite */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1">
          D
        </div>

        {/* E - Petit bloc sous A */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1">
          E
        </div>

        {/* F - Branching paths */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2">
          F
        </div>

        {/* G - Keyword enhancer */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2">
          G
        </div>

        {/* H - Prompt templates droite */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-6 md:row-span-2 lg:col-span-3 lg:row-span-2">
          H
        </div>

        {/* I - Bouton bas gauche */}
        <div className="bg-[#121622] rounded-2xl p-6 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1">
          I
        </div>
      </div>
    </div>
  );
}
