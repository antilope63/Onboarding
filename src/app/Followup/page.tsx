// app/followup/page.tsx
"use client";

import { prochainRdv, suivis } from "./data";
import {
  CalendarClock,
  Users,
  Briefcase,
} from "lucide-react"; // Icônes Lucide/Shadcn

export default function FollowupPage() {
  return (
    <main className="min-h-screen w-full bg-[#04061D] font-display text-gray-200 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Bienvenue dans votre suivi, Sarah
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Voici un aperçu de vos prochains rendez-vous.
          </p>
        </div>

        {/* Prochain rendez-vous */}
        <div className="rounded-lg p-6 bg-[#1D1E3B] border border-[#22254C] shadow-lg">
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-sm font-medium text-[#7D5AE0]">
                {prochainRdv.date}
              </p>
              <p className="text-xl font-bold text-white">{prochainRdv.titre}</p>
              <p className="text-base text-gray-400">{prochainRdv.type}</p>
              <span className="inline-flex items-center rounded-full bg-green-100/20 text-green-300 px-3 py-1 text-xs font-medium w-fit">
                {prochainRdv.statut}
              </span>
            </div>
            <div
              className="w-full md:w-1/3 aspect-video md:aspect-auto bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${prochainRdv.image})` }}
            />
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-300">
                Temps avant le prochain rendez-vous
              </p>
              <p className="text-sm font-bold text-[#663BD6]">
                {prochainRdv.tempsRestant}
              </p>
            </div>
            <div className="w-full bg-[#22254C] rounded-full h-2.5">
              <div
                className="bg-[#663BD6] h-2.5 rounded-full"
                style={{ width: `${prochainRdv.progression}%` }}
              />
            </div>
          </div>
        </div>

        {/* Suivis */}
        <div className="flex flex-col gap-4 p-6 rounded-lg bg-[#1D1E3B] border border-[#22254C] shadow-lg">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Suivis à venir
          </h2>

          {suivis.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-[#22254C] hover:bg-[#663BD6]/20 transition-colors cursor-pointer"
            >
              {/* Icône dynamique */}
              <div
                className={`flex items-center justify-center rounded-lg shrink-0 size-12
                ${
                  item.couleur === "vert"
                    ? "bg-green-500/20 text-green-400"
                    : item.couleur === "violet"
                    ? "bg-[#7D5AE0]/20 text-[#7D5AE0]"
                    : item.couleur === "orange"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {item.couleur === "vert" ? (
                  <CalendarClock className="w-6 h-6" />
                ) : item.couleur === "violet" ? (
                  <Briefcase className="w-6 h-6" />
                ) : (
                  <Users className="w-6 h-6" />
                )}
              </div>

              <div className="flex flex-col justify-center flex-1">
                <p className="font-bold text-white">{item.titre}</p>
                <p className="text-sm text-gray-400">{item.type}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-300">
                  {item.date}
                </p>
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                  ${
                    item.couleur === "vert"
                      ? "bg-green-100/20 text-green-300"
                      : item.couleur === "violet"
                      ? "bg-[#7D5AE0]/20 text-[#7D5AE0]"
                      : item.couleur === "orange"
                      ? "bg-orange-100/20 text-orange-400"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {item.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

