// app/followup/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { prochainRdv, suivis } from "./data";
import { CalendarClock, Users, Briefcase } from "lucide-react";
import BackButton from "@/components/BackButton";
import FollowupCalendar from "@/components/FollowupCalendar";

export default function FollowupPage() {
  const [activeTab, setActiveTab] = useState<"liste" | "calendrier">("liste");

  const listeRef = useRef<HTMLButtonElement>(null);
  const calendrierRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeRef = activeTab === "liste" ? listeRef : calendrierRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen w-full bg-[#04061D] font-display text-gray-200 px-4 py-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">
        <BackButton label="Retour" href="/" className="mb-4" />

        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-white">Bienvenue dans votre suivi</h1>
          <p className="mt-3 text-lg text-gray-400">Voici un aperçu de vos prochains rendez-vous.</p>
        </div>

        <div className="rounded-xl border border-[#22254C] shadow-xl overflow-hidden bg-[#1D1E3B] min-h-[250px]">
          <div className="md:flex md:items-stretch">
            <div className="p-8 flex flex-col justify-between flex-1">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-[#7D5AE0]">{prochainRdv.date}</p>
                <p className="text-2xl font-bold text-white">{prochainRdv.titre}</p>
                <p className="text-base text-gray-400">
                  {prochainRdv.type} - Préparez vos notes et objectifs pour
                  cette session.
                </p>
                <span className="inline-flex items-center rounded-full bg-green-100/20 text-green-300 px-4 py-1.5 text-sm font-medium w-fit">
                  {prochainRdv.statut}
                </span>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-300">Temps avant le prochain rendez-vous</p>
                  <p className="text-sm font-bold text-[#663BD6]">{prochainRdv.tempsRestant}</p>
                </div>
                <div className="w-full bg-[#22254C] rounded-full h-3">
                  <div className="bg-[#663BD6] h-3 rounded-full" style={{ width: `${prochainRdv.progression}%` }} />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-cover bg-center min-h-[250px]" style={{ backgroundImage: `url(${prochainRdv.image})` }} />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 rounded-lg bg-[#1D1E3B] border border-[#22254C] shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">Suivis à venir</h2>

            {/* Switch Liste | Calendrier */}
            <div className="relative flex bg-[#22254C] rounded-lg p-1">
              <div
                className="absolute top-1 bottom-1 bg-[#7D5AE0] rounded-md transition-all duration-500 ease-in-out"
                style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
              />
              <button
                ref={listeRef}
                onClick={() => setActiveTab("liste")}
                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "liste" ? "text-white" : "text-gray-300 hover:text-white"}`}
              >
                Liste
              </button>
              <button
                ref={calendrierRef}
                onClick={() => setActiveTab("calendrier")}
                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "calendrier" ? "text-white" : "text-gray-300 hover:text-white"}`}
              >
                Calendrier
              </button>
            </div>
          </div>

          {activeTab === "liste" ? (
            <div className="flex flex-col gap-4">
              {suivis.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5 rounded-lg bg-[#22254C] hover:bg-[#663BD6]/20 transition-colors cursor-pointer">
                  <div
                    className={`flex items-center justify-center rounded-lg shrink-0 w-12 h-12 ${
                      item.couleur === "vert" ? "bg-green-500/20 text-green-400" : item.couleur === "violet" ? "bg-[#7D5AE0]/20 text-[#7D5AE0]" : item.couleur === "orange" ? "bg-orange-500/20 text-orange-400" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {item.couleur === "vert" ? <CalendarClock className="w-6 h-6" /> : item.couleur === "violet" ? <Briefcase className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>

                  <div className="flex flex-col justify-center flex-1">
                    <p className="font-bold text-white">{item.titre}</p>
                    <p className="text-sm text-gray-400">{item.type}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-300">{item.date}</p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.couleur === "vert" ? "bg-green-100/20 text-green-300" : item.couleur === "violet" ? "bg-[#7D5AE0]/20 text-[#7D5AE0]" : item.couleur === "orange" ? "bg-orange-100/20 text-orange-400" : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[650px]">
              <FollowupCalendar />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
