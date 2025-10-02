// app/achievement/page.tsx
"use client";

import {
  Share2,
  ShieldCheck,
  FileText,
  Settings,
  CheckCircle,
  CheckSquare,
} from "lucide-react"; // Icônes shadcn/lucide

export default function AchievementPage() {
  return (
    <main className="min-h-screen w-full bg-[#04061D] font-display text-gray-200 px-6 py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">Félicitations !</h1>
          <p className="mt-4 text-lg text-gray-400">
            Vous avez terminé votre intégration et débloqué votre statut
            d&apos;employé PixelPlay !
          </p>
        </div>

        {/* Carte principale */}
        <div className="bg-[#663BD6]/10 p-8 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-[#663BD6]/30">
          <div
            className="w-32 h-32 flex-shrink-0 bg-center bg-cover rounded-lg"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8tvLqYwhSi09qWkFfFCEzyw0yAW84ukC0ZXh-lDYxcVvNvq2pnYnh14YaVbPGfTTXbZjEzCpzovxJFpfO28Cq2BYfrc9SwtWhNAtZTdzdy8UPOZzB_gUoLLZUhdMb0OOueXUPyV1EyLMK8F9QG_aI3socs4jMtVvy8DFh4OFoCBg45xLZb4JWN_zz-ynBYa76zQzqLtJaMJluzFBcWlmame8-MfLPB6GZv4f3tfzpK3sniYhHrJDjITM6E3WhUficXcu62gMJ8HD8")',
            }}
          />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-medium uppercase tracking-wider text-[#7D5AE0]">
              Succès débloqué
            </p>
            <h2 className="text-3xl font-bold mt-1 text-white">
              Intégration terminée !
            </h2>
            <p className="mt-2">
              Bienvenue dans l&apos;équipe ! Vous êtes prêt à commencer votre
              aventure chez PixelPlay.
            </p>
          </div>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              "https://ton-site.com"
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
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtRf7fl8VfrV_1qbZfsC2N_n7os5Qcw08nCyVnY1wGF_OrEAaYuSo2XKwA0qrqnK2cqASJ2MkpopzLEtayOe2HyB8unWSBW-3SgQnT33Z2phHS7H7PvrPwJ8VvWQkFcea8UNNdUPo-xKBw492n4zI8w43va1bcRNhIZgQxDFIPQ-tnunZdmZ1tHY98lHY3vGSOWH50bDnZO9Q0ic7fEc9Kal17XWe8QCEhhYpDwGDsYKzM5lPSQnNZmLpP-btn5M4XuA8-LA-_JW9H")',
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
