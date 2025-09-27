// components/ui/bento-grid.tsx
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
  nameColor: string;
  className: string; // ⚠️ mets ici bg-gradient + border comme "avant"
  Icon: React.ElementType;
  iconColor?: string; // ex: "text-white/90"
  description: string;
  descriptionColor: string;
  href: string;
  cta: string;
  ctaColor: string;
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
  nameColor = "text-neutral-700 dark:text-neutral-200",
  className,
  Icon,
  iconColor = "text-neutral-700 dark:text-neutral-200",
  description,
  descriptionColor = "text-neutral-700 dark:text-neutral-200",
  href,
  cta,
  ctaColor = "text-neutral-700 dark:text-neutral-200",
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      // conteneur carte
      "group relative col-span-3 overflow-hidden rounded-xl",
      // on garde la shadow MagicUI mais on n'impose plus de bg ici
      "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    {/* Contenu en bas */}
    <div className="relative z-10 flex h-full flex-col p-4">
      <div className="pointer-events-none mt-auto transform-gpu transition-all duration-300 lg:group-hover:-translate-y-10">
        <Icon
          className={cn(
            "h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-75",
            iconColor
          )}
        />
        <h3
          className={cn(
            "mt-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100",
            nameColor
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-1 max-w-lg text-neutral-500 dark:text-neutral-300",
            descriptionColor
          )}
        >
          {description}
        </p>
      </div>

      {/* CTA mobile (collé en bas) */}
      <div className="pointer-events-none flex w-full transform-gpu flex-row items-center transition-all duration-300 group-hover:opacity-100 lg:hidden">
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
    </div>

    {/* CTA desktop (absolu bas) */}
    <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex z-10">
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

    {/* Overlay hover */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
