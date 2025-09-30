import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Avatar from "./Avatar";

export type SessionCardProps = {
  title: string;
  description: string;
  image: string;
  duration: string;
  version?: "color" | "black_and_white";
};

export default function SessionCard({
  title,
  description,
  image,
  duration,
  version = "color",
}: SessionCardProps) {
  return (
    <section className="flex flex-col items-center justify-end p-3 rounded-lg overflow-hidden relative bg-amber-100 w-[400px] h-[240px]">
      <Image
        src={image}
        alt={title}
        width={300}
        height={300}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{
          filter: version === "black_and_white" ? "grayscale(100%)" : "none",
        }}
      />
      <div className="flex flex-col w-full py-2 px-4 rounded-lg z-10 bg-bleu_fonce_2/90 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white">{duration}</p>
      </div>
    </section>
  );
}
