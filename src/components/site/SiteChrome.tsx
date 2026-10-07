import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/facilities", label: "Facilities" },
  { to: "/gallery", label: "Gallery" },
  { to: "/booking", label: "Booking" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-maroon text-maroon-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold text-gold-gradient">The Floresta</span>
          <span className="eyebrow mt-1 text-[0.6rem]">Gir · Resort</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm tracking-wide transition-colors hover:text-gold" activeProps={{ className: "text-gold" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
          <Link to="/booking" className="rounded-sm bg-gold-gradient px-5 py-2 text-sm font-semibold text-gold-foreground shadow-gold">
            Book Now
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-gold/20 px-5 py-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="hover:text-gold">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-maroon text-maroon-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-3xl text-gold-gradient">The Floresta Gir</h3>
          <p className="mt-3 text-sm opacity-80">A royal jungle retreat at the doorstep of Gir — home of the Asiatic lion.</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow">Reach us</p>
          <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-gold" />{SITE.address}</p>
          <a href={`tel:${SITE.phone}`} className="flex gap-2 hover:text-gold"><Phone className="h-4 w-4 text-gold" />{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="flex gap-2 hover:text-gold"><Mail className="h-4 w-4 text-gold" />{SITE.email}</a>
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow">Explore</p>
          {NAV.map((n) => <Link key={n.to} to={n.to} className="block hover:text-gold">{n.label}</Link>)}
          <Link to="/admin" className="block opacity-60 hover:text-gold">Admin</Link>
        </div>
      </div>
      <p className="border-t border-gold/20 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} The Floresta Gir. All rights reserved.</p>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lg transition-transform hover:scale-110">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function PageHero({ eyebrow, title, image }: { eyebrow: string; title: string; image: string }) {
  return (
    <section className="relative flex h-[45vh] min-h-72 items-center justify-center overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative text-center text-maroon-foreground">
        <p className="eyebrow ornament justify-center">{eyebrow}</p>
        <h1 className="mt-3 text-5xl md:text-6xl">{title}</h1>
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      <p className="eyebrow ornament justify-center">{eyebrow}</p>
      <h2 className="mt-3 text-4xl text-primary md:text-5xl">{title}</h2>
    </div>
  );
}
