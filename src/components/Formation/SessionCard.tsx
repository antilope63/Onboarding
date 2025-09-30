import Image from "next/image";
import Avatar from "@/components/Formation/Avatar";

export type SessionCardProps = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  isActive: boolean;
  formatter: {
    name: string;
    role: string;
    image: string;
  };
};

export default function SessionCard({
  title,
  subtitle,
  description,
  image,
  isActive,
  formatter,
}: SessionCardProps) {
  return (
    <section
      className="relative flex h-[250px] w-[420px] p-2 flex-col justify-end overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-300 cursor-pointer"
      aria-label={title}
    >
      <Image
        src={image}
        alt={title}
        width={480}
        height={480}
        className="absolute inset-0 h-full w-full object-cover"
        priority={isActive}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
          isActive ? "opacity-60" : "opacity-90"
        }`}
      />

      <div className="relative z-10 flex flex-col p-2 px-4 bg-white rounded-2xl">
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-sm text-black/70">{subtitle}</p>
      </div>
    </section>
  );
}
