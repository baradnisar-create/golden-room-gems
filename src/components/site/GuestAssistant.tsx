import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, X, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import hostAsset from "@/assets/welcome-host.png.asset.json";

const SUGGESTIONS = ["Which rooms do you have?", "Is there a swimming pool?", "How do I book?"];

export function GuestAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(/402/.test(e.message) ? "Assistant is unavailable right now." : /429/.test(e.message) ? "Too many questions — please wait a moment." : "Couldn't reach the assistant. Please try again."),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { if (open && !busy) inputRef.current?.focus(); }, [open, busy]);

  function send(q: string) {
    const t = q.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setText("");
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Ask our assistant"
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-maroon shadow-gold transition-transform hover:scale-110">
          <img src={hostAsset.url} alt="" className="h-12 w-auto translate-y-2" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-4 z-50 flex h-[34rem] max-h-[85vh] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-md border border-gold/50 bg-card shadow-gold">
          <div className="flex items-center gap-3 bg-maroon px-4 py-3 text-maroon-foreground">
            <img src={hostAsset.url} alt="" className="h-10 w-auto" />
            <div className="flex-1">
              <p className="font-display text-lg leading-none text-gold-gradient">Ask Floresta</p>
              <p className="mt-1 text-xs opacity-80">Rooms, facilities, booking</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <div>
                <p className="text-muted-foreground">Namaste! Ask me anything about your stay.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-gold/50 px-3 py-1 text-xs text-primary hover:bg-gold/10">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => {
              const t = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              if (!t && m.role === "assistant") return null;
              return m.role === "user" ? (
                <p key={m.id} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">{t}</p>
              ) : (
                <p key={m.id} className="max-w-[95%] whitespace-pre-wrap text-foreground">{t}</p>
              );
            })}
            {status === "submitted" && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Thinking…</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-end gap-2 border-t border-gold/30 p-3">
            <textarea ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder="Type your question…"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }}
              className="max-h-24 flex-1 resize-none rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold" />
            {busy ? (
              <button type="button" onClick={() => stop()} aria-label="Stop" className="flex h-9 w-9 items-center justify-center rounded-sm bg-maroon text-maroon-foreground"><Square className="h-4 w-4" /></button>
            ) : (
              <button type="submit" aria-label="Send" disabled={!text.trim()} className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold-gradient text-gold-foreground disabled:opacity-50"><Send className="h-4 w-4" /></button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
