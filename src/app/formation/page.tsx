import NavBar from "@/components/NavBar";
import SessionCard from "@/components/Formation/SessionCard";
import Avatar from "@/components/Formation/Avatar";
import { sessions } from "./data";
import NoScroll from "@/components/NoScroll";

export default function FormationPage() {
  return (
    <section className="flex flex-col justify-center items-center gap-20 w-full min-h-screen relative bg-noir">
      <NavBar classname="absolute top-0 left-0" />
      <NoScroll />
      <div className="flex flex-col justify-center items-center gap-1">
        <p className="text-violet">Nos formations</p>
        <p className="text-white text-6xl font-bold">
          Tu as besoin d'un coup de boost ?
        </p>
        <p className="text-white/80 text-2xl">
          Tes collègues seront ravis de te rencontrer !
        </p>
      </div>
      <div className="flex flex-col justify-center items-center gap-8">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col justify-center items-center gap-2"
          >
            <SessionCard
              title={session.title}
              description={session.description}
              image={session.image}
              duration={session.duration}
              version={session.version}
            />
            <p className="text-sm text-white">{session.description}</p>
            {session.speaker && (
              <Avatar
                name={session.speaker.name}
                role={session.speaker.role}
                avatar={session.speaker.avatar}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
