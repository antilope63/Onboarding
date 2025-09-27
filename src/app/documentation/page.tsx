import NavBar from "@/components/NavBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DocumentationPage() {
  return (
    <section className="flex flex-col items-center gap-8 w-full min-h-screen relative bg-noir pt-20 px-6">
      <NavBar classname="absolute top-0 left-0" />
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">FAQ</h1>
        <p className="text-white/80 mb-8">
          Retrouvez ici les réponses aux questions les plus fréquentes.
        </p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="doc-item-1">
            <AccordionTrigger className="text-white font-bold">
              Comment est structurée la documentation ?
            </AccordionTrigger>
            <AccordionContent className="text-white/80">
              La documentation est organisée par rubriques avec des exemples
              concrets et des guides étape par étape pour vous aider à avancer
              rapidement. Elle est accessible via le lien One drive dans la
              section "Documentation", depuis la page d'accueil.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="doc-item-2">
            <AccordionTrigger className="text-white font-bold">
              Où trouver des exemples de code réutilisables ?
            </AccordionTrigger>
            <AccordionContent className="text-white/80">
              Des snippets sont disponibles dans chaque section ainsi que dans
              le dossier `components/ui`. Vous pouvez les copier/coller et les
              adapter à vos besoins.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="doc-item-3">
            <AccordionTrigger className="text-white font-bold">
              Comment contribuer ou signaler un problème ?
            </AccordionTrigger>
            <AccordionContent className="text-white/80">
              Ouvrez une issue sur le dépôt GitHub du projet avec une
              description claire, des étapes de reproduction et des captures si
              possible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
