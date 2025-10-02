"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormulairePage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    // Redirection après 2 secondes
    setTimeout(() => {
      router.push("/Recompense");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#04061D] font-display text-white">
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl space-y-8 rounded-xl bg-[#1D1E3B]/60 p-6 shadow-2xl shadow-[#7D5AE0]/20 sm:p-8">
          {!submitted ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold">Ton retour sur ton onboarding</h1>
                <p className="mt-2 text-gray-300">
                  Aide-nous à améliorer l&apos;expérience des futurs PixelPlayers !
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Q1 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    1. Comment évaluerais-tu ton expérience globale d&apos;onboarding ?
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {["Très mauvaise", "Mauvaise", "Neutre", "Bonne", "Très bonne"].map(
                      (label) => (
                        <label
                          key={label}
                          className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-transparent bg-[#22254C]/70 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#663BD6]/20 has-[:checked]:border-[#7D5AE0] has-[:checked]:bg-[#7D5AE0]/10 has-[:checked]:text-[#7D5AE0]"
                        >
                          {label}
                          <input
                            type="radio"
                            name="experience"
                            required
                            className="absolute h-full w-full cursor-pointer opacity-0"
                          />
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Q2 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    2. Quels aspects de l&apos;onboarding ont été les plus utiles ?
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Tâches",
                      "FAQ et documentation",
                      "Follow up",
                      "Autres (préciser)",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 cursor-pointer rounded border-2 border-gray-500 bg-transparent checked:border-[#7D5AE0] checked:bg-[#7D5AE0] focus:ring-2 focus:ring-[#7D5AE0]/50 focus:ring-offset-2 focus:ring-offset-[#04061D]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <textarea
                    className="mt-2 w-full resize-none rounded-lg border-2 border-gray-600 bg-[#22254C]/50 p-3 text-gray-200 placeholder-gray-400 focus:border-[#7D5AE0] focus:ring-[#7D5AE0]/50"
                    placeholder="Préciser"
                  />
                </div>

                {/* Q3 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    3. Sur une échelle de 1 à 5, qu&apos;as-tu pensé de l&apos;outil d&apos;onboarding de PixelPlay ?
                  </h3>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Mauvais</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <input
                          key={n}
                          type="radio"
                          name="preparedness"
                          required
                          className="h-6 w-6 cursor-pointer rounded-full border-2 checked:border-[#7D5AE0] checked:bg-[#7D5AE0]"
                        />
                      ))}
                    </div>
                    <span>Très bien</span>
                  </div>
                </div>

                {/* Q4 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    4. As-tu rencontré des problèmes techniques ou des difficultés lors de l&apos;onboarding ?
                  </h3>
                  <textarea
                    className="w-full resize-none rounded-lg border-2 border-gray-600 bg-[#22254C]/50 p-3 text-gray-200 placeholder-gray-400 focus:border-[#7D5AE0] focus:ring-[#7D5AE0]/50"
                    placeholder="Si oui, décris les problèmes rencontrés..."
                  required
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="rounded-lg bg-[#7D5AE0] px-8 py-3 font-bold text-white transition-transform hover:scale-105"
                  >
                    Valider mon feedback
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-green-500">Formulaire envoyé avec succès !</h2>
              <p className="text-gray-300">Redirection vers la récompense...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
