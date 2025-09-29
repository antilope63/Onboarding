import Image from "next/image";

export default function LinkText({
  href,
  text = "Lien pour le texte",
  icon,
  sizeIcon = 16,
  sizeText = 20,
  sizeFont,
}: {
  href: string;
  text: string;
  icon: string;
  sizeIcon?: number;
  sizeText?: number;
  sizeFont?: React.CSSProperties["fontWeight"];
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 hover:underline hover:cursor-pointer text-lg text-white"
    >
      <Image src={icon} alt={text} width={sizeIcon} height={sizeIcon} />
      <span style={{ fontSize: sizeText, fontWeight: sizeFont }}>{text}</span>
    </a>
  );
}
