import type { Metadata } from "next";
import {
  Share2,
  ShieldCheck,
  FileText,
  Settings,
  CheckCircle,
  CheckSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PixelPlay - Intégration terminée 🎉",
  description:
    "J'ai terminé mon intégration chez PixelPlay et je suis officiellement employé ! 🚀",
  openGraph: {
    title: "PixelPlay - Intégration terminée 🎉",
    description:
      "J'ai terminé mon intégration chez PixelPlay et je suis officiellement employé ! 🚀",
    url: "https://onboarding-brown-rho.vercel.app/Recompense", // l’URL publique de ta page
    siteName: "PixelPlay",
    images: [
      {
        url: "https://onboarding-brown-rho.vercel.app/Image_recompense.png", // 👉 image de félicitations
        width: 1200,
        height: 630,
        alt: "Succès PixelPlay - Intégration terminée",
      },
    ],
    type: "website",
  },
};

export default function AchievementPage() {
  return (
    <main className="min-h-screen w-full bg-[#04061D] font-display text-gray-200 px-6 py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">Félicitations !</h1>
          <p className="mt-4 text-lg text-gray-400">
            Vous avez terminé votre intégration et débloqué votre statut
            d&apos;employé PixelPlay !
          </p>
        </div>

        {/* Carte principale */}
        <div className="bg-[#663BD6]/10 p-8 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-[#663BD6]/30">
          <div
            className="w-32 h-32 flex-shrink-0 bg-center bg-cover rounded-lg"
            style={{
              backgroundImage:
                'url("https://ton-site.com/images/achievement.png")',
            }}
          />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-medium uppercase tracking-wider text-[#7D5AE0]">
              Succès débloqué
            </p>
            <h2 className="text-3xl font-bold mt-1 text-white">
              Intégration terminée !
            </h2>
            <p className="mt-2">
              Bienvenue dans l&apos;équipe ! Vous êtes prêt à commencer votre
              aventure chez PixelPlay.
            </p>
          </div>

          {/* Bouton LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              "https://onboarding-brown-rho.vercel.app/Recompense"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 bg-[#7D5AE0] text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 hover:bg-[#663BD6] transition-all duration-200"
          >
            <Share2 className="w-5 h-5" />
            Partager
          </a>
        </div>

        {/* Carte statut employé */}
        <div className="bg-[#1D1E3B] p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-[#22254C]">
          <div
            className="w-32 h-32 flex-shrink-0 bg-center bg-cover rounded-lg"
            style={{
              backgroundImage:
                'url("https://ton-site.com/images/avatar.png")',
            }}
          />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-medium uppercase tracking-wider text-[#7D5AE0]">
              Nouveau statut
            </p>
            <h2 className="text-3xl font-bold mt-1 text-white">
              Employé PixelPlay
            </h2>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-sm text-[#7D5AE0]">
              <ShieldCheck className="w-5 h-5" />
              <span>Niveau 1</span>
            </div>
          </div>
        </div>

        {/* Mini-achievements */}
        <div className="bg-[#1D1E3B] p-6 rounded-xl border border-[#22254C]">
          <h3 className="text-lg font-bold text-white mb-4">Succès réalisés</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#22254C] p-3 rounded-lg">
              <FileText className="w-6 h-6 text-[#7D5AE0]" />
              <p className="font-semibold text-white">Documentation</p>
              <CheckCircle className="w-5 h-5 text-[#663BD6] ml-auto" />
            </div>
            <div className="flex items-center gap-4 bg-[#22254C] p-3 rounded-lg">
              <Settings className="w-6 h-6 text-[#7D5AE0]" />
              <p className="font-semibold text-white">Accès configuré</p>
              <CheckCircle className="w-5 h-5 text-[#663BD6] ml-auto" />
            </div>
            <div className="flex items-center gap-4 bg-[#22254C] p-3 rounded-lg">
              <CheckSquare className="w-6 h-6 text-[#7D5AE0]" />
              <p className="font-semibold text-white">Tâches terminées</p>
              <CheckCircle className="w-5 h-5 text-[#663BD6] ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}