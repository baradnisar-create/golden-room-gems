import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import hero from "@/assets/hero.jpg";
import room from "@/assets/room.jpg";
import safari from "@/assets/safari.jpg";
import pool from "@/assets/pool.jpg";
import { PageHero, SectionTitle } from "@/components/site/SiteChrome";
import { VideoGrid } from "@/components/site/Facilities";

const IMAGES = [
  { src: hero, alt: "Resort at sunset", cls: "md:col-span-2 md:row-span-2" },
  { src: room, alt: "Royal room", cls: "" },
  { src: safari, alt: "Gir lion safari", cls: "" },
  { src: pool, alt: "Swimming pool", cls: "md:col-span-2" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — The Floresta Gir" },
      { name: "description", content: "Photos and videos of rooms, pool, safari and life at The Floresta Gir." },
      { property: "og:title", content: "Gallery — The Floresta Gir" },
      { property: "og:description", content: "See the resort through photos and videos." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero eyebrow="Moments" title="Gallery" image={safari} />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle eyebrow="Photos" title="Glimpses of Floresta" />
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
          {IMAGES.map((i) => (
            <button key={i.alt} onClick={() => setOpen(i.src)} className={`group overflow-hidden rounded-md border-2 border-gold/40 ${i.cls}`}>
              <img src={i.src} alt={i.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </button>
          ))}
        </div>
      </section>
      <section className="bg-maroon py-20">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="mb-10 text-center text-5xl text-gold-gradient">Videos</h2>
          <VideoGrid />
        </div>
      </section>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/95 p-6" onClick={() => setOpen(null)}>
          <button className="absolute right-6 top-6 text-gold" aria-label="Close"><X className="h-8 w-8" /></button>
          <img src={open} alt="" className="max-h-full max-w-full rounded-md border-2 border-gold" />
        </div>
      )}
    </>
  );
}
