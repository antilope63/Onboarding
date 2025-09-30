import Image from "next/image";

export type SessionCardProps = {
  title: string;
  subtitle: string;
  image: string;
  isActive: boolean;
};

export default function SessionCard({
  title,
  subtitle,
  image,
  isActive,
}: SessionCardProps) {
  return (
    <article
      className={`relative flex h-[340px] w-[240px] flex-col justify-end overflow-hidden rounded-3xl border transition-[transform,box-shadow] duration-300 ${
        isActive
          ? "border-white/70 shadow-[0_20px_35px_rgba(10,10,23,0.45)]"
          : "border-white/10 shadow-none"
      }`}
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

      <div className="relative z-10 flex flex-col gap-1 px-5 pb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
    </article>
  );
}
