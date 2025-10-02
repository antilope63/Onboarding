"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormulairePage() {
  const [submitted, setSubmitted] = useState(false);
  const [q1Value, setQ1Value] = useState(3);
  const [q3Value, setQ3Value] = useState(3);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      router.push("/Recompense");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#04061D] font-display text-white">
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl space-y-10 rounded-2xl bg-[#1D1E3B]/60 p-10 shadow-2xl shadow-[#7D5AE0]/20">
          {!submitted ? (
            <>
              <div className="text-center">
                <h1 className="text-4xl font-bold">Ton retour sur ton onboarding</h1>
                <p className="mt-3 text-gray-300 text-lg">
                  Aide-nous à améliorer l&apos;expérience des futurs PixelPlayers !
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Q1 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">
                    1. Comment évaluerais-tu ton expérience globale d&apos;onboarding ?
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-lg">Très mauvaise</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={q1Value}
                      onChange={(e) => setQ1Value(parseInt(e.target.value))}
                      className="w-full cursor-pointer rounded-lg accent-[#7D5AE0]"
                      required
                    />
                    <span className="text-gray-300 text-lg">Très bonne</span>
                  </div>
                </div>

                {/* Q2 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">
                    2. Quels aspects de l&apos;onboarding ont été les plus utiles ?
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["Tâches", "FAQ et documentation", "Follow up", "Autres (préciser)"].map(
                      (option) => (
                        <label key={option} className="flex items-center gap-3 text-gray-300">
                          <input
                            type="checkbox"
                            className="h-6 w-6 cursor-pointer rounded border-2 border-gray-500 bg-transparent checked:border-[#7D5AE0] checked:bg-[#7D5AE0] focus:ring-2 focus:ring-[#7D5AE0]/50 focus:ring-offset-2 focus:ring-offset-[#04061D]"
                            required={false}
                          />
                          {option}
                        </label>
                      )
                    )}
                  </div>
                  <textarea
                    className="mt-2 w-full resize-none rounded-lg border-2 border-gray-600 bg-[#22254C]/50 p-4 text-gray-200 placeholder-gray-400 text-lg focus:border-[#7D5AE0] focus:ring-[#7D5AE0]/50"
                    placeholder="Préciser"
                  />
                </div>

                {/* Q3 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">
                    3. Sur une échelle de 1 à 5, qu&apos;as-tu pensé de l&apos;outil d&apos;onboarding de PixelPlay ?
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-lg">Mauvais</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={q3Value}
                      onChange={(e) => setQ3Value(parseInt(e.target.value))}
                      className="w-full cursor-pointer rounded-lg accent-[#7D5AE0]"
                      required
                    />
                    <span className="text-gray-300 text-lg">Très bien</span>
                  </div>
                </div>

                {/* Q4 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">
                    4. As-tu rencontré des problèmes techniques ou des difficultés lors de l&apos;onboarding ?
                  </h3>
                  <textarea
                    className="w-full resize-none rounded-lg border-2 border-gray-600 bg-[#22254C]/50 p-4 text-gray-200 placeholder-gray-400 text-lg focus:border-[#7D5AE0] focus:ring-[#7D5AE0]/50"
                    placeholder="Si oui, décris les problèmes rencontrés..."
                    required
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="rounded-lg bg-[#7D5AE0] px-12 py-4 font-bold text-xl text-white transition-transform hover:scale-105"
                  >
                    Valider mon feedback
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-green-500">
                Formulaire envoyé avec succès !
              </h2>
              <p className="text-gray-300 text-lg">Redirection vers la récompense...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
