import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"




type Document = {
  id: number
  title: string
  description: string
  url: string
}

const documents: Document[] = [
  {
    id: 1,
    title: "Contrat de travail",
    description: "Votre contrat de travail signé",
    url: "/docs/contrat.pdf",
  },
  {
    id: 2,
    title: "Charte informatique",
    description: "Règles et bonnes pratiques IT",
    url: "/docs/charte-informatique.pdf",
  },
  {
    id: 3,
    title: "Mutuelle",
    description: "Informations sur votre mutuelle",
    url: "/docs/mutuelle.pdf",
  },
  {
    id: 4,
    title: "Livret d’accueil",
    description: "Toutes les infos pour bien démarrer",
    url: "/docs/livret.pdf",
  },
]

export default function DocumentsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mes documents</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                {doc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
              <Button
                asChild
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
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
