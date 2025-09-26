import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import Image from "next/image"

type Document = {
  id: number
  title: string
  description: string
  url: string
}

const documents: Document[] = [
  { id: 1, title: "Contrat de travail", description: "Votre contrat de travail signé", url: "/contrat.pdf" },
  { id: 2, title: "Charte informatique", description: "Règles et bonnes pratiques IT", url: "/charte-informatique.pdf" },
  { id: 3, title: "Mutuelle", description: "Informations sur votre mutuelle", url: "/mutuelle.pdf" },
  { id: 4, title: "Livret d’accueil", description: "Toutes les infos pour bien démarrer", url: "/livret.pdf" },
]

export default function DocumentsPage() {
  return (
    <div className="container mx-auto p-6">
      
      <div className="mb-6">
        <Image src="/logo.png" alt="Logo" width={120} height={40} />
      </div>

      {/* Titre principal */}
      <h1 className="text-4xl font-extrabold mb-2">
        Mes documents
      </h1>

      {/* Sous-titre */}
      <p className="text-gray-500 mb-8">
        Retrouvez tous les documents nécessaires pour votre onboarding
      </p>

      {/* Grille des cartes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <FileText className="w-5 h-5 text-blue-600" />
                {doc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
              <Button
                asChild
                className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                variant="outline"
              >
                <a href={doc.url} download>
                  <Download className="w-4 h-4" />
                  Télécharger
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
