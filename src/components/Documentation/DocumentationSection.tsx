import Card from "@/components/Card";
import { BookText } from "lucide-react";
import LinkText from "@/components/LinkText";

export type DocumentationSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export default function DocumentationSection({
  className,
  ...rest
}: DocumentationSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 mb-4">
        <BookText className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold text-white">Documentation</h1>
      </div>
      <Card type="default" className="flex flex-col w-full gap-2 max-w-[550px]">
        <p className="text-white text-lg">
          La documentation du projet est disponible sur le lien Google Drive
          ci-dessous. Ce lien sera à conserver par la suite.
        </p>
        <p className="text-white/70 text-sm">
          Pour se connecter, utilisez l'accès à votre compte google de
          l'entreprise dont les accès sont disponibles dans la section "Mes
          accès" sur la page d'accueil.
        </p>
        <LinkText
          href="https://drive.google.com/drive/folders/1bBX0g4-h4U7mK5pGwK_Z3W74Zv-zOo-9?usp=sharing"
          text="Google Drive"
          icon="/IconGoogleDrive.png"
          sizeIcon={20}
          sizeText={20}
          sizeFont={600}
        />
      </Card>
    </div>
  );
}
