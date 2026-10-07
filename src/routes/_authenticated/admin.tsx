import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, MessageCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — The Floresta Gir" },
      { name: "description", content: "Manage booking requests." },
      { property: "og:title", content: "Admin Panel — The Floresta Gir" },
      { property: "og:description", content: "Manage booking requests." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const STATUSES = ["pending", "confirmed", "cancelled"] as const;

function Admin() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  const isAdmin = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => (await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })).data === true,
  });
  const bookings = useQuery({
    queryKey: ["bookings"],
    enabled: isAdmin.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("booking_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("booking_requests").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["bookings"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("booking_requests").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["bookings"] });
  }
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  if (isAdmin.isLoading) return <p className="p-20 text-center">Loading…</p>;
  if (!isAdmin.data)
    return (
      <div className="p-20 text-center">
        <h1 className="text-4xl text-primary">No admin access</h1>
        <p className="mt-2 text-muted-foreground">This account is not an admin.</p>
        <button onClick={signOut} className="mt-6 underline">Sign out</button>
      </div>
    );

  const rows = (bookings.data ?? []).filter((b) => filter === "all" || b.status === filter);
  const count = (s: string) => (bookings.data ?? []).filter((b) => b.status === s).length;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h1 className="text-5xl text-primary">Bookings</h1>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 rounded-sm border border-gold px-4 py-2 text-sm"><LogOut className="h-4 w-4" />Sign out</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[["all", bookings.data?.length ?? 0], ...STATUSES.map((s) => [s, count(s)])].map(([s, n]) => (
          <button key={s} onClick={() => setFilter(String(s))}
            className={`rounded-md border p-5 text-left transition ${filter === s ? "border-gold bg-maroon text-maroon-foreground" : "border-gold/40 bg-card"}`}>
            <p className="eyebrow">{s}</p>
            <p className="mt-1 font-display text-4xl">{n}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-gold/40 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-maroon text-left text-maroon-foreground">
            <tr>{["Guest", "Room", "Dates", "Guests", "Note", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No bookings yet.</td></tr>}
            {rows.map((b) => (
              <tr key={b.id} className="align-top">
                <td className="px-4 py-3"><p className="font-semibold">{b.name}</p><p className="text-muted-foreground">{b.phone}</p>{b.email && <p className="text-muted-foreground">{b.email}</p>}</td>
                <td className="px-4 py-3">{b.room_type}</td>
                <td className="px-4 py-3 whitespace-nowrap">{b.check_in} → {b.check_out}</td>
                <td className="px-4 py-3">{b.adults}A · {b.children}C</td>
                <td className="max-w-48 px-4 py-3 text-muted-foreground">{b.message}</td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)} className="rounded-sm border border-input bg-background px-2 py-1">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${b.name}, regarding your booking at The Floresta Gir (${b.check_in} to ${b.check_out})...`)}`} target="_blank" rel="noreferrer" className="text-whatsapp" aria-label="WhatsApp guest"><MessageCircle className="h-5 w-5" /></a>
                    <button onClick={() => remove(b.id)} className="text-destructive" aria-label="Delete"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Tip: guests are also sent to <a className="underline" href={whatsappLink()}>your WhatsApp</a> after submitting.</p>
    </section>
  );
}
