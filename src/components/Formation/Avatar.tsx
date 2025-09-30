import Image from "next/image";

export default function Avatar({
  name,
  role,
  avatar,
}: {
  name: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center px-3 py-3 rounded-md shadow-sm w-[160px]">
      <Image
        src={avatar}
        alt={name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover mb-2"
      />
      <p className="text-sm font-semibold text-white truncate max-w-[140px] mx-auto">
        {name}
      </p>
      <p className="text-[11px] text-gray-400 font-bold truncate max-w-[140px] mx-auto">
        {role}
      </p>
    </div>
  );
}
