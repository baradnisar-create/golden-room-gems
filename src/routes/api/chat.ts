import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { SITE, ROOMS, FACILITIES, VALUES } from "@/lib/site";
import { createResponsesCall } from "@/lib/ai/responses.server";

const KNOWLEDGE = `
Resort: ${SITE.name}. Address: ${SITE.address}. Phone/WhatsApp: ${SITE.phone}. Email: ${SITE.email}.
Rooms (price per night, INR):
${ROOMS.map((r) => `- ${r.name}: ₹${r.price} — ${r.guests} — ${r.desc}`).join("\n")}
Facilities:
${FACILITIES.map((f) => `- ${f.title}: ${f.desc}`).join("\n")}
Resort values:
${VALUES.map((v) => `- ${v.title}: ${v.desc}`).join("\n")}
Booking: guests fill the form on the Booking page (/booking) with name, phone, room, dates and guests; the team then confirms on WhatsApp. Guests can also message WhatsApp directly.
About: located in Bhojde village at the edge of Gir National Park; lion safari permits can be arranged.
`;

const INSTRUCTIONS = `You are the friendly guest assistant for ${SITE.name}. Answer only from the resort information below. If something is not covered, say you're not sure and suggest contacting the team on WhatsApp at ${SITE.phone}. Keep answers short and warm. Reply in the guest's language (English, Hindi or Gujarati).
${KNOWLEDGE}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("Assistant is not configured", { status: 500 });
        let messages: UIMessage[];
        try {
          const body = (await request.json()) as { messages?: UIMessage[] };
          if (!Array.isArray(body.messages)) throw new Error();
          messages = body.messages.slice(-20);
        } catch {
          return new Response("Invalid request", { status: 400 });
        }
        const { result, response } = createResponsesCall(
          request,
          { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
          await convertToModelMessages(messages),
          INSTRUCTIONS,
        );
        void result;
        return response();
      },
    },
  },
});
