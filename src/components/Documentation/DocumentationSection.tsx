import { ArrowUpRight, BookText, Folder } from "lucide-react";
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
import { cn } from "@/lib/utils";

export type DocumentationSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const DOCUMENTS_BY_CATEGORY = DOCUMENT_LINKS.reduce<
  Record<string, DocumentLink[]>
>((acc, doc) => {
  (acc[doc.category] ||= []).push(doc);
  return acc;
}, {});

const DOCUMENTS_BY_ID = Object.fromEntries(
  DOCUMENT_LINKS.map((doc) => [doc.id, doc] as const)
) as Record<string, DocumentLink>;

function isExternalLink(href: string, explicit?: boolean) {
  if (typeof explicit === "boolean") {
    return explicit;
  }
  return /^https?:\/\//.test(href);
}

export default function DocumentationSection({
  className,
}: DocumentationSectionProps) {
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
            const docEntries = folder.documents
              .map(({ id, note }) => {
                const doc = DOCUMENTS_BY_ID[id];
                if (!doc) return null;
                return { doc, note };
              })
              .filter((value): value is { doc: DocumentLink; note?: string } =>
                Boolean(value)
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
        {Object.entries(DOCUMENTS_BY_CATEGORY).map(([category, docs]) => (
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
    </div>
  );
}
