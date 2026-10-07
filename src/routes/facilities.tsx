import { createFileRoute } from "@tanstack/react-router";
import pool from "@/assets/pool.jpg";
import { PageHero, SectionTitle } from "@/components/site/SiteChrome";
import { FacilityGrid } from "@/components/site/Facilities";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Facilities — The Floresta Gir" },
      { name: "description", content: "Pool, restaurant, safari assistance, bonfire, kids area and more at The Floresta Gir." },
      { property: "og:title", content: "Facilities — The Floresta Gir" },
      { property: "og:description", content: "Everything you need for a relaxing jungle stay in Gir." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Comfort & leisure" title="Facilities" image={pool} />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle eyebrow="Everything you need" title="Thoughtfully curated" />
        <FacilityGrid />
      </section>
    </>
  ),
});
