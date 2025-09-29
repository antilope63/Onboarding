import { BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type DocumentationSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export default function DocumentationSection({
  className,
}: DocumentationSectionProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center gap-4">
        <BookText className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold text-white">Documentation</h1>
      </div>
      <p className="text-white text-lg">
        La documentation du projet est rédigée et stockée sur Google Drive. Le
        lien vers la documentation sera à conserver par la suite. Nous te
        sonseillons de le sauvegarder 😉
      </p>
      <p className="text-white/70 text-sm">
        Pour se connecter, utilise l&apos;accès à ton compte google de
        l&apos;entreprise dont les accès sont disponibles dans la section
        &quot;Mes accès&quot; sur la page d&apos;accueil.
      </p>
      <Button className="w-[200px] flex items-center justify-center px-4 h-12 bg-violet_fonce_1 hover:bg-violet hover:cursor-pointer">
        <Link
          href="https://drive.google.com/drive/folders/1bBX0g4-h4U7mK5pGwK_Z3W74Zv-zOo-9?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3"
        >
          <Image
            src="/IconGoogleDrive.png"
            alt="Google Drive"
            width={20}
            height={20}
          />
          <p className="text-white text-[15px] font-bold mr-1">Google Drive</p>
        </Link>
      </Button>
    </div>
  );
}
