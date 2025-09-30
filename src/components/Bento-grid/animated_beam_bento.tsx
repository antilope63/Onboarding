"use client";

import React, { forwardRef, useRef } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import Image from "next/image";
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const drive = useRef<HTMLDivElement>(null);
  const jira = useRef<HTMLDivElement>(null);
  const github = useRef<HTMLDivElement>(null);
  const unity = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full flex-row items-center justify-between gap-10 ">
        {/* User à gauche */}
        <Circle ref={div1Ref}>
          <Icons.user />
        </Circle>

        {/* Colonne à droite (OpenAI + Drive empilés) */}
        <div className="flex flex-col gap-6">
          <Circle ref={div2Ref}>
            <Icons.unreal />
          </Circle>
          <Circle ref={drive}>
            <Icons.Drive />
          </Circle>
          <Circle ref={jira}>
            <Icons.Jira />
          </Circle>
          <Circle ref={github}>
            <Icons.github />
          </Circle>
          <Circle ref={unity}>
            <Icons.unity />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref} // user
        toRef={div2Ref} // openai
        curvature={130}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref} // user
        toRef={drive} // drive
        delay={0.3}
        curvature={70}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref} // user
        toRef={jira} // drive
        delay={0.6}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref} // user
        toRef={github} // drive
        delay={0.9}
        curvature={-70}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref} // user
        toRef={unity} // drive
        delay={1.2}
        curvature={-130}
      />
    </div>
  );
}

const Icons = {
  unreal: () => (
    <Image src="/unreal-engine.webp" width={24} height={24} alt="drive" />
  ),
  Drive: () => (
    <Image src="/GoogleDrive.svg" width={24} height={24} alt="drive" />
  ),
  Jira: () => <Image src="/jira.svg" width={24} height={24} alt="jira" />,
  github: () => (
    <Image src="/Unity_N.svg" width={24} height={24} alt="github" />
  ),
  unity: () => <Image src="/Github_N.svg" width={24} height={24} alt="unity" />,

  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
