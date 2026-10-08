import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import room from "@/assets/room.jpg";
import safari from "@/assets/safari.jpg";
import pool from "@/assets/pool.jpg";
import welcomeHost from "@/assets/welcome-host.png.asset.json";
import { Medal, Eye, Trophy } from "lucide-react";
import { ROOMS, VALUES, whatsappLink } from "@/lib/site";
import { SectionTitle } from "@/components/site/SiteChrome";
import { FacilityGrid, VideoGrid } from "@/components/site/Facilities";

const VALUE_ICONS = { Medal, Eye, Trophy } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Floresta Gir — Luxury Jungle Resort in Sasan Gir" },
      { name: "description", content: "Royal stays near Gir National Park with pool, restaurant, safari assistance and easy WhatsApp booking." },
      { property: "og:title", content: "The Floresta Gir — Luxury Jungle Resort" },
      { property: "og:description", content: "Royal stays near Gir National Park. Book on WhatsApp or online." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <img src={hero} alt="The Floresta Gir resort at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-7xl px-5 text-maroon-foreground">
          <p className="eyebrow ornament">Welcome to</p>
          <h1 className="mt-4 max-w-3xl text-6xl leading-[0.95] md:text-8xl">
            The <span className="text-gold-gradient italic">Floresta</span> Gir
          </h1>
          <p className="mt-6 max-w-xl text-lg opacity-90">A royal jungle retreat beside the land of the Asiatic lion.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/booking" className="rounded-sm bg-gold-gradient px-8 py-3 font-semibold text-gold-foreground shadow-gold">Book Your Stay</Link>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="rounded-sm border border-gold px-8 py-3 font-semibold text-gold hover:bg-gold/10">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <div className="relative">
          <img src={safari} alt="Asiatic lion in Gir" loading="lazy" width={1200} height={912} className="rounded-md border-4 border-gold/60 shadow-gold" />
          <img src={pool} alt="Resort pool" loading="lazy" width={1200} height={912} className="absolute -bottom-10 -right-4 hidden w-1/2 rounded-md border-4 border-background md:block" />
        </div>
        <div>
          <p className="eyebrow">About the resort</p>
          <h2 className="mt-3 text-5xl text-primary">Where the forest meets royalty</h2>
          <p className="mt-6 text-muted-foreground">Nestled in Bhojde village at the edge of Gir National Park, The Floresta Gir blends warm Kathiyawadi hospitality with refined comfort. Wake up to birdsong, set out on a lion safari, and return to a poolside evening and bonfire.</p>
          <Link to="/facilities" className="mt-8 inline-block border-b-2 border-gold pb-1 font-semibold text-primary">Explore facilities →</Link>
        </div>
      </section>

      <section className="border-y border-gold/30 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle eyebrow="What we stand for" title="Our Resort Values" />
          <div className="grid items-center gap-10 lg:grid-cols-[260px_1fr]">
          <img src={welcomeHost.url} alt="Floresta host welcoming guests with folded hands" loading="lazy" className="mx-auto h-80 w-auto lg:h-[26rem]" />
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => {
              const Icon = VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS] ?? Medal;
              return (
                <div key={v.title} className="rounded-md border border-gold/40 bg-card p-8 text-center shadow-gold">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-3xl text-primary">{v.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle eyebrow="Stay with us" title="Rooms & Villas" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ROOMS.map((r) => (
              <div key={r.name} className="overflow-hidden rounded-md border border-gold/40 bg-card">
                <img src={room} alt={r.name} loading="lazy" width={1200} height={912} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-2xl text-primary">{r.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{r.guests}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <p><span className="text-2xl font-semibold text-primary">₹{r.price.toLocaleString("en-IN")}</span><span className="text-xs text-muted-foreground"> /night</span></p>
                    <Link to="/booking" search={{ room: r.name }} className="text-sm font-semibold text-primary underline decoration-gold underline-offset-4">Book</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionTitle eyebrow="Comfort & leisure" title="Our Facilities" />
        <FacilityGrid />
      </section>

      <section className="bg-maroon py-24 text-maroon-foreground">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-12 text-center">
            <p className="eyebrow ornament justify-center">Watch</p>
            <h2 className="mt-3 text-5xl text-gold-gradient">Experience The Floresta</h2>
          </div>
          <VideoGrid />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h2 className="text-5xl text-primary">Ready for your Gir getaway?</h2>
        <p className="mt-4 text-muted-foreground">Send a booking request and we'll confirm on WhatsApp.</p>
        <Link to="/booking" className="mt-8 inline-block rounded-sm bg-primary px-10 py-3 font-semibold text-primary-foreground">Book Now</Link>
      </section>
    </>
  );
}
