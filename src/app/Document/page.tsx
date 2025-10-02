"use client"

import { FormEvent, useMemo, useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Edit,
  FileText,
  Laptop,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import BackButton from "@/components/BackButton" // ajuste le chemin si nécessaire
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"

type DocumentIcon = "file" | "laptop" | "shield" | "book"

type Document = {
  id: number
  title: string
  description: string
  url: string
  icon: DocumentIcon
}

const ICON_MAP: Record<DocumentIcon, typeof FileText> = {
  file: FileText,
  laptop: Laptop,
  shield: ShieldCheck,
  book: BookOpen,
}

const BASE_DOCUMENTS: Document[] = [
  {
    id: 1,
    title: "Contrat de travail",
    description: "Consultez et téléchargez votre contrat de travail.",
    url: "/contrat.pdf",
    icon: "file",
  },
  {
    id: 2,
    title: "Charte IT",
    description: "Révisez la charte informatique de l'entreprise.",
    url: "/charte-informatique.pdf",
    icon: "laptop",
  },
  {
    id: 3,
    title: "Mutuelle",
    description: "Informations sur votre couverture santé.",
    url: "/mutuelle.pdf",
    icon: "shield",
  },
  {
    id: 4,
    title: "Livret d’accueil",
    description: "Découvrez l'entreprise, sa culture et ses valeurs.",
    url: "/livret.pdf",
    icon: "book",
  },
]

export default function DocumentsPage() {
  const [openDocId, setOpenDocId] = useState<number | null>(null)
  const [documents, setDocuments] = useState<Document[]>(BASE_DOCUMENTS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDocId, setEditingDocId] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Document, "id">>({
    title: "",
    description: "",
    url: "",
    icon: "file",
  })

  const { role } = useAuth()
  const canManageDocuments = role === "manager" || role === "rh"

  const iconOptions = useMemo(() => {
    return [
      { value: "file", label: "Document" },
      { value: "laptop", label: "IT" },
      { value: "shield", label: "Sécurité" },
      { value: "book", label: "Guide" },
    ] satisfies Array<{ value: DocumentIcon; label: string }>
  }, [])

  const openDialog = (documentToEdit?: Document) => {
    if (documentToEdit) {
      const { id, ...rest } = documentToEdit
      setForm(rest)
      setEditingDocId(id)
    } else {
      setForm({ title: "", description: "", url: "", icon: "file" })
      setEditingDocId(null)
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingDocId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim() || !form.url.trim()) {
      return
    }

    setDocuments((prev) => {
      if (editingDocId !== null) {
        return prev.map((doc) =>
          doc.id === editingDocId ? { ...doc, ...form } : doc
        )
      }

      const nextId = prev.length ? Math.max(...prev.map((doc) => doc.id)) + 1 : 1
      return [...prev, { id: nextId, ...form }]
    })

    closeDialog()
  }

  const handleDelete = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    if (!window.confirm(`Supprimer le document "${target.title}" ?`)) {
      return
    }
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    if (openDocId === id) {
      setOpenDocId(null)
    }
  }

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

          {canManageDocuments && (
            <div className="flex justify-end mb-6">
              <Button
                type="button"
                onClick={() => openDialog()}
                className="rounded-full bg-violet_fonce_1 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet"
              >
                Ajouter un document
              </Button>
            </div>
          )}

          {/* Liste des documents */}
          <div className="space-y-4">
            {documents.map((doc) => {
              const isOpen = openDocId === doc.id
              const IconComponent = ICON_MAP[doc.icon]
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
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-violet-fonce-1">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-400">{doc.description}</p>
                      </div>
                    </div>

                    {/* Flèche à droite */}
                    <div className="flex items-center gap-3">
                      {canManageDocuments && (
                        <div className="flex items-center gap-2 mr-2 opacity-0 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              openDialog(doc)
                            }}
                            className="flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleDelete(doc.id)
                            }}
                            className="flex items-center gap-1 rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      )}
                      <ArrowRight
                        className={`text-gray-400 transition-transform duration-300 group-hover:text-violet ${
                          isOpen ? "rotate-90 text-violet" : ""
                        }`}
                        size={24}
                      />
                    </div>
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

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
      >
        <DialogContent className="bg-bleu_fonce_2 text-white border-white/10">
          <DialogHeader>
            <DialogTitle>
              {editingDocId ? "Modifier le document" : "Nouveau document"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Renseigne les informations du document à partager avec
              l&apos;équipe.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Titre
              </label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Nom du document"
                className="border-white/20 bg-white/10 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Ajoute un contexte ou des instructions"
                className="min-h-[120px] resize-y rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Lien
              </label>
              <Input
                value={form.url}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, url: event.target.value }))
                }
                placeholder="https://... ou /mon-doc.pdf"
                className="border-white/20 bg-white/10 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Icône
              </label>
              <select
                value={form.icon}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    icon: event.target.value as DocumentIcon,
                  }))
                }
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-violet_fonce_1 hover:bg-violet"
              >
                {editingDocId ? "Enregistrer" : "Publier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
