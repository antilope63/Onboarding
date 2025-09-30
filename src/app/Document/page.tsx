"use client"

import { useState } from "react"
import {
  FileText,
  Laptop,
  ShieldCheck,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import BackButton from "@/components/BackButton" // ajuste le chemin si nécessaire

type Document = {
  id: number
  title: string
  description: string
  url: string
  icon: React.ReactNode
}

const documents: Document[] = [
  {
    id: 1,
    title: "Contrat de travail",
    description: "Consultez et téléchargez votre contrat de travail.",
    url: "/contrat.pdf",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Charte IT",
    description: "Révisez la charte informatique de l'entreprise.",
    url: "/charte-informatique.pdf",
    icon: <Laptop className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "Mutuelle",
    description: "Informations sur votre couverture santé.",
    url: "/mutuelle.pdf",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Livret d’accueil",
    description: "Découvrez l'entreprise, sa culture et ses valeurs.",
    url: "/livret.pdf",
    icon: <BookOpen className="w-6 h-6" />,
  },
]

export default function DocumentsPage() {
  const [openDocId, setOpenDocId] = useState<number | null>(null)

  return (
    <div className="bg-noir font-sans text-gray-200 min-h-screen flex flex-col relative">
      <div className="absolute top-4 left-4 z-10">
        <BackButton label="Accueil" href="/" />
      </div>


      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-violet-fonce-1">
              Mes documents            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Retrouvez ici tous vos documents essentiels pour bien démarrer.
            </p>
          </div>

          {/* Liste des documents */}
          <div className="space-y-4">
            {documents.map((doc) => {
              const isOpen = openDocId === doc.id
              return (
                <div
                  key={doc.id}
                  onClick={() => setOpenDocId(isOpen ? null : doc.id)}
                  className="group flex flex-col p-6 rounded-lg bg-bleu_fonce_2 shadow-sm transition-all duration-300 cursor-pointer"
                >
                  {/* Ligne principale : icône + titre à gauche, flèche à droite */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 flex items-center justify-center bg-violet-fonce-1/10 text-violet group-hover:bg-violet group-hover:text-white rounded-lg transition-colors duration-300">
                        {doc.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-violet-fonce-1">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-400">{doc.description}</p>
                      </div>
                    </div>

                    {/* Flèche à droite */}
                    <ArrowRight
                      className={`text-gray-400 transition-transform duration-300
                        group-hover:text-violet ${
                          isOpen ? "rotate-90 text-violet" : ""
                        }`}
                      size={24}
                    />
                  </div>

                  {/* Partie qui s’affiche seulement si la carte est ouverte avec animation */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out
                      ${isOpen ? "max-h-[700px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
                  >
                    <iframe
                      src={doc.url}
                      className="w-full h-[700px] border rounded-lg"
                      title={doc.title}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
