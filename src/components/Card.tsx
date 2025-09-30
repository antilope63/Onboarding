import * as React from "react";
import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  type?: "default" | "border";
};

export default function Card({
  className,
  children,
  type = "default",
  ...rest
}: CardProps) {
  if (type === "border") {
    return (
      <div
        className={cn("border border-white/60 rounded-lg p-4", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }

  // default
  return (
    <div className={cn("bg-bleu_fonce_2 p-4 rounded-lg", className)} {...rest}>
      {children}
    </div>
  );
}
