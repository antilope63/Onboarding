"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number; // pixels
  className?: string;
};

export default function Avatar({
  src,
  alt = "",
  size = 48,
  className,
}: AvatarProps) {
  const dimension = size;
  const wrapperClass = twMerge(
    "inline-flex items-center justify-center rounded-full overflow-hidden bg-white/10 ring-1 ring-white/15",
    className
  );

  if (src) {
    return (
      <span
        className={wrapperClass}
        style={{ width: dimension, height: dimension }}
      >
        <Image
          src={src}
          alt={alt}
          width={dimension}
          height={dimension}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  // Fallback simple sans image
  return (
    <span
      className={wrapperClass}
      style={{ width: dimension, height: dimension }}
      aria-hidden
    />
  );
}
