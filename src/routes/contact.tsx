import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { PageHero } from "@/components/site/SiteChrome";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Floresta Gir" },
      { name: "description", content: "Call, email or WhatsApp The Floresta Gir at Bhojde, Talala, Gir Somnath." },
      { property: "og:title", content: "Contact — The Floresta Gir" },
      { property: "og:description", content: "Get in touch with The Floresta Gir resort." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const items = [
    { icon: MapPin, label: "Address", value: SITE.address },
    { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone}` },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: whatsappLink() },
  ];
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact Us" image={hero} />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2">
        <div className="space-y-5">
          {items.map((i) => (
            <a key={i.label} href={i.href} target={i.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              className="flex items-start gap-4 rounded-md border border-gold/40 bg-card p-5 hover:shadow-gold">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-gold"><i.icon className="h-5 w-5" /></span>
              <span><span className="eyebrow block">{i.label}</span><span className="mt-1 block text-lg">{i.value}</span></span>
            </a>
          ))}
        </div>
        <iframe title="Map" className="min-h-96 w-full rounded-md border-2 border-gold/50" loading="lazy"
          src="https://www.google.com/maps?q=Bhojde+Gir+Talala+Gujarat&output=embed" />
      </section>
    </>
  );
}
