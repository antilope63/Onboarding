"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  ArrowUpRight,
  BookOpen,
  BookText,
  Edit,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderKanban,
  Laptop,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  DOCUMENT_LINKS,
  PROJECT_FOLDERS,
  type DocumentLink,
} from "@/app/documentation/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogFooter as DialogActions,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { LucideIcon } from "lucide-react";

export type DocumentationSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

type IconKey = "file" | "sheet" | "shield" | "laptop" | "folder" | "book";

const ICON_MAP: Record<IconKey, LucideIcon> = {
  file: FileText,
  sheet: FileSpreadsheet,
  shield: ShieldCheck,
  laptop: Laptop,
  folder: FolderKanban,
  book: BookOpen,
};

const ICON_CHOICES: Array<{ value: IconKey; label: string }> = [
  { value: "file", label: "Document" },
  { value: "sheet", label: "Tableur" },
  { value: "shield", label: "Sécurité" },
  { value: "laptop", label: "Technologie" },
  { value: "folder", label: "Organisation" },
  { value: "book", label: "Guide" },
];

function isExternalLink(href: string, explicit?: boolean) {
  if (typeof explicit === "boolean") {
    return explicit;
  }
  return /^https?:\/\//.test(href);
}

export default function DocumentationSection({
  className,
}: DocumentationSectionProps) {
  const { role } = useAuth();
  const canManageDocs = role === "manager";

  const [documents, setDocuments] = useState<DocumentLink[]>(DOCUMENT_LINKS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    href: "",
    category: DOCUMENT_LINKS[0]?.category ?? "",
    iconKey: ICON_CHOICES[0]?.value ?? "file",
    external: false,
  });

  const documentsByCategory = useMemo(() => {
    return documents.reduce<Record<string, DocumentLink[]>>((acc, doc) => {
      (acc[doc.category] ||= []).push(doc);
      return acc;
    }, {});
  }, [documents]);

  const documentsById = useMemo(() => {
    return Object.fromEntries(documents.map((doc) => [doc.id, doc] as const));
  }, [documents]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(documents.map((doc) => doc.category)));
  }, [documents]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      href: "",
      category: availableCategories[0] ?? "",
      iconKey: ICON_CHOICES[0]?.value ?? "file",
      external: false,
    });
    setEditingDocId(null);
  };

  const openDialog = (doc?: DocumentLink) => {
    if (doc) {
      const iconEntry = Object.entries(ICON_MAP).find(([, icon]) => icon === doc.icon);
      setForm({
        title: doc.title,
        description: doc.description,
        href: doc.href,
        category: doc.category,
        iconKey: (iconEntry?.[0] as IconKey) ?? "file",
        external: Boolean(doc.external),
      });
      setEditingDocId(doc.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.href.trim() || !form.category.trim()) {
      return;
    }

    const iconComponent = ICON_MAP[form.iconKey];

    setDocuments((prev) => {
      if (editingDocId) {
        return prev.map((doc) =>
          doc.id === editingDocId
            ? {
                ...doc,
                title: form.title,
                description: form.description,
                href: form.href,
                category: form.category,
                icon: iconComponent,
                external: form.external,
              }
            : doc
        );
      }

      const newId = (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `doc-${Date.now()}`) as string;

      return [
        ...prev,
        {
          id: newId,
          title: form.title,
          description: form.description,
          href: form.href,
          category: form.category,
          icon: iconComponent,
          external: form.external,
        },
      ];
    });

    setIsDialogOpen(false);
    setEditingDocId(null);
  };

  const handleDelete = (id: string) => {
    const target = documents.find((doc) => doc.id === id);
    if (!target) return;
    if (!window.confirm(`Supprimer la ressource "${target.title}" ?`)) {
      return;
    }
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
              <BookText className="h-6 w-6 text-white" />
            </span>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">Documentation</h1>
              <p className="text-base text-white/70">
                Toutes les ressources essentielles pour démarrer et rester
                autonome.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-violet_fonce_1 px-6 text-white hover:bg-violet"
          >
            <Link
              href="https://drive.google.com/drive/folders/1bBX0g4-h4U7mK5pGwK_Z3W74Zv-zOo-9?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Image
                src="/GoogleDrive.svg"
                alt="Google Drive"
                width={20}
                height={20}
              />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Google Drive
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p>
            La documentation est centralisée sur Drive. Garde le lien
            précieusement, il te sera utile tout au long de ta mission.
          </p>
          <p>
            Pour t&apos;identifier, utilise ton compte Google entreprise (accès
            disponibles dans &laquo; Mes accès &raquo;).
          </p>
        </div>
      </header>

      {canManageDocs && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => openDialog()}
            className="inline-flex items-center gap-2 rounded-full bg-violet_fonce_1 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet"
          >
            <Plus className="h-4 w-4" />
            Ajouter une ressource
          </Button>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Dossiers projet
          </h2>
          <span className="text-xs text-white/40">
            {PROJECT_FOLDERS.length} dossiers disponibles
          </span>
        </div>
        <div
          className="flex gap-4 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Dossiers de documentation"
        >
          {PROJECT_FOLDERS.map((folder) => {
            type DocEntry = { doc: DocumentLink; note?: string };

            const docEntries: DocEntry[] = folder.documents.flatMap(
              ({ id, note }) => {
                const doc = documentsById[id];
                return doc ? [{ doc, note }] : [];
              }
            );

            return (
              <Dialog key={folder.id}>
                <div className="py-1">
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "group relative flex h-40 w-48 shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br p-5 text-left text-white transition-transform duration-300",
                        folder.accentColor,
                        "hover:-translate-y-1 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
                      )}
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-white/80">
                        <Folder className="h-4 w-4" />
                        {folder.description}
                      </span>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold leading-tight">
                          {folder.name}
                        </p>
                        <p className="text-xs text-white/70">
                          {docEntries.length} document
                          {docEntries.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </button>
                  </DialogTrigger>
                </div>
                <DialogContent className="max-w-3xl gap-8 border-white/10 bg-bleu_fonce_2/95 text-white sm:rounded-3xl">
                  <DialogHeader className="gap-3">
                    <DialogTitle className="text-3xl font-semibold text-white">
                      {folder.name}
                    </DialogTitle>
                    <DialogDescription className="text-base leading-relaxed text-white/70">
                      {folder.summary}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                        Ressources associées
                      </h3>
                      {docEntries.length === 0 ? (
                        <p className="mt-4 text-sm text-white/60">
                          Aucun document lié pour l&apos;instant.
                        </p>
                      ) : (
                        <ul className="mt-4 space-y-3">
                          {docEntries.map(({ doc, note }) => {
                            const Icon = doc.icon;
                            const external = isExternalLink(
                              doc.href,
                              doc.external
                            );
                            return (
                              <li
                                key={doc.id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                    <Icon className="h-5 w-5 text-white" />
                                  </span>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">
                                      {doc.title}
                                    </p>
                                    <p className="text-xs text-white/60">
                                      {note ?? doc.description}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={doc.href}
                                  target={external ? "_blank" : undefined}
                                  rel={
                                    external ? "noopener noreferrer" : undefined
                                  }
                                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:text-white"
                                >
                                  Ouvrir
                                  <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                  {folder.driveUrl ? (
                    <DialogActions>
                      <Button
                        asChild
                        className="rounded-full bg-violet_fonce_1 px-5 text-white hover:bg-violet"
                      >
                        <Link
                          href={folder.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Ouvrir dans Drive
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </DialogActions>
                  ) : null}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        {Object.entries(documentsByCategory).map(([category, docs]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              {category}
            </h3>
            <div className="space-y-4">
              {docs.map((doc) => {
                const Icon = doc.icon;
                const external = isExternalLink(doc.href, doc.external);
                return (
                  <Card
                    key={doc.id}
                    className="group border-white/10 bg-white/[0.04] text-white/90 shadow-2xl shadow-black/40 transition hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <CardHeader className="flex flex-row items-start gap-4 border-b border-white/5 pb-4">
                      <div className="flex flex-1 items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                          <Icon className="h-6 w-6 text-white" />
                        </span>
                        <div className="space-y-2">
                          <CardTitle className="text-2xl font-semibold text-white">
                            {doc.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed text-white/70">
                            {doc.description}
                          </CardDescription>
                        </div>
                      </div>
                      {canManageDocs && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDialog(doc)}
                            className="flex items-center gap-1 rounded-full border border-white/25 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" />
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc.id)}
                            className="flex items-center gap-1 rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </CardHeader>
                    <CardFooter className="pt-4">
                      <Link
                        href={doc.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80 transition group-hover:text-white"
                      >
                        Ouvrir le document
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-w-xl border-white/10 bg-bleu_fonce_2 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingDocId ? "Modifier la ressource" : "Nouvelle ressource"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Renseigne les informations de la ressource que tu veux partager.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Titre
              </label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Nom de la ressource"
                className="border-white/20 bg-white/10 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
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
                placeholder="Quelques mots sur l'utilisation de ce document"
                className="min-h-[110px] resize-y rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Lien
              </label>
              <Input
                value={form.href}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, href: event.target.value }))
                }
                placeholder="https://..."
                className="border-white/20 bg-white/10 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Catégorie
              </label>
              <Input
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, category: event.target.value }))
                }
                placeholder="Ex: Documentations techniques"
                list="documentation-categories"
                className="border-white/20 bg-white/10 text-white"
                required
              />
              <datalist id="documentation-categories">
                {availableCategories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Icône
              </label>
              <select
                value={form.iconKey}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    iconKey: event.target.value as IconKey,
                  }))
                }
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet_fonce_1"
              >
                {ICON_CHOICES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.external}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    external: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border border-white/20 bg-white/10"
              />
              Ouvrir dans un nouvel onglet
            </label>

            <DialogActions>
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
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
