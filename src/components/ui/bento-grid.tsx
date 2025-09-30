"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string; // mets border + bg gradient ici
  Icon: React.ElementType;

  // Couleurs paramétrables
  iconColor?: string; // ex: "text-white/90"
  nameColor?: string; // ex: "text-white"
  descriptionColor?: string; // ex: "text-white/70"
  ctaColor?: string; // ex: "text-pink-400"

  // Contenu standard
  description?: string;
  href?: string;
  cta?: string;

  // Masquer totalement le CTA (mobile + desktop)
  hideCta?: boolean;

  // Layout spécial "hero" centré
  layout?: "default" | "center";
  children?: ReactNode; // utilisé quand layout="center"

  // Background optionnel (affiché derrière le contenu)
  background?: ReactNode;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  Icon,
  iconColor = "text-neutral-700 dark:text-neutral-200",
  nameColor = "text-neutral-800 dark:text-neutral-100",
  descriptionColor = "text-neutral-500 dark:text-neutral-300",
  ctaColor = "text-violet-400",
  description,
  href = "/",
  cta = "Learn more",
  hideCta = false,
  layout = "default",
  children,
  background,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group group/logos relative col-span-3 overflow-hidden rounded-xl",
      // ombre MagicUI
      "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    {/* Background optionnel au-dessus pour capter le hover */}
    {background && <div className="absolute inset-0 z-0">{background}</div>}

    {layout === "center" ? (
      // --- HERO CENTRÉ ---
      <div className="absolute inset-0 grid place-items-center p-6 text-center pointer-events-none">
        {children}
      </div>
    ) : (
      // --- LAYOUT PAR DÉFAUT : contenu aligné en bas ---
      <>
        <div className="relative z-10 flex h-full flex-col p-4 pointer-events-none">
          <div className="mt-auto transform-gpu transition-all duration-300 lg:group-hover:-translate-y-10">
            <Icon
              className={cn(
                "h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75",
                iconColor
              )}
            />
            <h3 className={cn("mt-3 text-xl font-semibold", nameColor)}>
              {name}
            </h3>
            {description && (
              <p className={cn("mt-1 max-w-lg", descriptionColor)}>
                {description}
              </p>
            )}
          </div>

          {/* CTA mobile (cliquable) */}
          {!hideCta && (
            <div className="flex w-full lg:hidden">
              <Button
                variant="link"
                asChild
                size="sm"
                className={cn("pointer-events-auto p-0", ctaColor)}
              >
                <a href={href}>
                  {cta}
                  <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* CTA desktop (cliquable) */}
        {!hideCta && (
          <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex z-10">
            <Button
              variant="link"
              asChild
              size="sm"
              className={cn("pointer-events-auto p-0", ctaColor)}
            >
              <a href={href}>
                {cta}
                <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
              </a>
            </Button>
          </div>
        )}
      </>
    )}

    {/* Overlay hover */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
