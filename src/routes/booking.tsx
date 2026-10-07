import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import room from "@/assets/room.jpg";
import { PageHero } from "@/components/site/SiteChrome";
import { ROOMS, SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  room_type: z.string().min(1),
  check_in: z.string().min(1, "Choose check-in"),
  check_out: z.string().min(1, "Choose check-out"),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(20),
  message: z.string().trim().max(1000).optional(),
}).refine((d) => d.check_out > d.check_in, { message: "Check-out must be after check-in", path: ["check_out"] });

export const Route = createFileRoute("/booking")({
  validateSearch: (s: Record<string, unknown>): { room?: string } => (typeof s.room === "string" ? { room: s.room } : {}),
  head: () => ({
    meta: [
      { title: "Book Your Stay — The Floresta Gir" },
      { name: "description", content: "Send a booking request for rooms and villas at The Floresta Gir and confirm on WhatsApp." },
      { property: "og:title", content: "Book Your Stay — The Floresta Gir" },
      { property: "og:description", content: "Request your dates online and confirm on WhatsApp." },
    ],
  }),
  component: Booking,
});

const field = "w-full rounded-sm border border-input bg-card px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-ring/40";

function Booking() {
  const { room: preset } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const d = parsed.data;
    setLoading(true);
    const { error } = await supabase.from("booking_requests").insert({
      ...d, email: d.email || null, message: d.message || null,
    });
    setLoading(false);
    if (error) return toast.error("Could not send request. Please try WhatsApp.");
    setDone(true);
    const text = `New Booking Request – The Floresta Gir\nName: ${d.name}\nPhone: ${d.phone}\nRoom: ${d.room_type}\nCheck-in: ${d.check_in}\nCheck-out: ${d.check_out}\nGuests: ${d.adults} adults, ${d.children} children${d.message ? `\nNote: ${d.message}` : ""}`;
    window.open(whatsappLink(text), "_blank");
  }

  return (
    <>
      <PageHero eyebrow="Reserve" title="Book Your Stay" image={room} />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-3">
        <aside className="space-y-4 lg:order-2">
          <div className="rounded-md bg-maroon p-6 text-maroon-foreground">
            <h3 className="text-3xl text-gold-gradient">Tariff</h3>
            <ul className="mt-4 divide-y divide-gold/20">
              {ROOMS.map((r) => (
                <li key={r.name} className="flex justify-between py-3 text-sm"><span>{r.name}</span><span className="text-gold">₹{r.price.toLocaleString("en-IN")}</span></li>
              ))}
            </ul>
            <p className="mt-4 text-xs opacity-70">Per night, prices may vary in peak season.</p>
          </div>
          <div className="rounded-md border border-gold/40 p-6 text-sm">
            <p className="eyebrow">Booking details</p>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-muted-foreground">
              <li>Check-in 12:00 PM · Check-out 10:00 AM</li>
              <li>Safari permits arranged on request</li>
              <li>Call {SITE.phone} for group bookings</li>
            </ul>
          </div>
        </aside>
        <div className="lg:col-span-2">
          {done ? (
            <div className="rounded-md border-2 border-gold bg-card p-10 text-center">
              <h2 className="text-4xl text-primary">Thank you!</h2>
              <p className="mt-3 text-muted-foreground">Your request is received. We've opened WhatsApp so you can send the details and get quick confirmation.</p>
              <button onClick={() => setDone(false)} className="mt-6 text-sm font-semibold text-primary underline decoration-gold">Make another request</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 rounded-md border border-gold/40 bg-card p-8 sm:grid-cols-2">
              <h2 className="text-4xl text-primary sm:col-span-2">Booking Request</h2>
              <input name="name" placeholder="Full name *" className={field} maxLength={100} />
              <input name="phone" placeholder="Phone / WhatsApp *" className={field} maxLength={20} />
              <input name="email" type="email" placeholder="Email" className={`${field} sm:col-span-2`} maxLength={255} />
              <select name="room_type" defaultValue={preset ?? ROOMS[0].name} className={`${field} sm:col-span-2`}>
                {ROOMS.map((r) => <option key={r.name}>{r.name}</option>)}
              </select>
              <label className="text-sm">Check-in<input name="check_in" type="date" className={`${field} mt-1`} /></label>
              <label className="text-sm">Check-out<input name="check_out" type="date" className={`${field} mt-1`} /></label>
              <label className="text-sm">Adults<input name="adults" type="number" min={1} defaultValue={2} className={`${field} mt-1`} /></label>
              <label className="text-sm">Children<input name="children" type="number" min={0} defaultValue={0} className={`${field} mt-1`} /></label>
              <textarea name="message" placeholder="Special requests" rows={4} maxLength={1000} className={`${field} sm:col-span-2`} />
              <button disabled={loading} className="rounded-sm bg-gold-gradient py-4 font-semibold text-gold-foreground shadow-gold disabled:opacity-60 sm:col-span-2">
                {loading ? "Sending..." : "Send Request & Open WhatsApp"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
