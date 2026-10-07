import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — The Floresta Gir" },
      { name: "description", content: "Sign in to manage bookings at The Floresta Gir." },
      { property: "og:title", content: "Admin Sign In — The Floresta Gir" },
      { property: "og:description", content: "Admin access for resort staff." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

const field = "w-full rounded-sm border border-input bg-card px-4 py-3 outline-none focus:border-gold";

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Check your email to confirm your account.");
      setMode("in");
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-md border-2 border-gold/50 bg-card p-8">
        <p className="eyebrow">Admin panel</p>
        <h1 className="text-4xl text-primary">{mode === "in" ? "Sign in" : "Create account"}</h1>
        <input name="email" type="email" required placeholder="Email" className={field} />
        <input name="password" type="password" required minLength={6} placeholder="Password" className={field} />
        <button disabled={loading} className="w-full rounded-sm bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60">
          {loading ? "Please wait..." : mode === "in" ? "Sign in" : "Sign up"}
        </button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-sm text-muted-foreground underline">
          {mode === "in" ? "First time? Create the admin account" : "Have an account? Sign in"}
        </button>
      </form>
    </section>
  );
}
