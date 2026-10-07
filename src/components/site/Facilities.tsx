import * as Icons from "lucide-react";
import { FACILITIES, VIDEOS } from "@/lib/site";

export function FacilityGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {FACILITIES.map((f) => {
        const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[f.icon] ?? Icons.Star;
        return (
          <div key={f.title} className="group rounded-md border border-gold/40 bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-gold">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-gold">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-2xl text-primary">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export function VideoGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {VIDEOS.map((v) => (
        <div key={v.id} className={`overflow-hidden rounded-md border-2 border-gold/60 bg-maroon ${v.short ? "aspect-[9/16]" : "aspect-[9/16] md:aspect-[9/16]"}`}>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${v.id}`}
            title="The Floresta Gir video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}
