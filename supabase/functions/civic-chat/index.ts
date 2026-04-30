import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 20;

const SYSTEM_PROMPT = `You are CivicFlow India, a neutral, factual civic education assistant focused EXCLUSIVELY on Indian elections and governance.

SCOPE: Republic of India ONLY. Do NOT answer questions about elections in any other country.

RULES:
- Provide accurate, balanced information about Indian elections, the Election Commission of India (ECI), and civic processes.
- Reference Indian laws: Constitution of India, Representation of the People Act 1950 & 1951, Model Code of Conduct.
- Reference Indian institutions: ECI, CEO offices, NVSP portal, Voter Helpline 1950.
- NEVER recommend candidates, parties, or how to vote.
- NEVER predict election outcomes.
- NEVER express political opinions or bias.
- If asked who to vote for, respond: "I provide information about the election process but cannot recommend candidates."
- If asked for predictions, respond: "I provide factual information about Indian elections but cannot predict outcomes."
- Use clear, accessible language.
- Cite general civic knowledge and official ECI guidelines; do not fabricate statistics.
- When unsure, say so honestly.
- Keep responses informational and educational.
- This is for educational purposes only, not an official government source. Not affiliated with the Election Commission of India.`;

const STRUCTURED_TOOL = {
  type: "function" as const,
  function: {
    name: "civic_response",
    description: "Return a structured civic education response about Indian elections with clear sections.",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string", description: "A brief 1-2 sentence summary of the answer about Indian elections/governance." },
        timeline_stage: { type: "string", description: "Which Indian election timeline stage this relates to, or empty if not applicable." },
        steps: { type: "array", items: { type: "string" }, description: "Ordered action steps the Indian citizen should take, if applicable." },
        documents_required: { type: "array", items: { type: "string" }, description: "Documents or forms needed, if applicable." },
        eligibility_rules: { type: "array", items: { type: "string" }, description: "Eligibility requirements under Indian law, if applicable." },
        deadlines: { type: "string", description: "Relevant deadlines, if applicable." },
        official_links: { type: "array", items: { type: "string" }, description: "Official Indian government resource URLs, if applicable." },
        warnings: { type: "array", items: { type: "string" }, description: "Important warnings or caveats." },
        confidence_score: { type: "string", enum: ["high", "medium", "low"], description: "How confident you are." },
      },
      required: ["summary", "confidence_score"],
    },
  },
};

function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: "Messages array is required" };
  }
  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Maximum ${MAX_MESSAGES} messages allowed` };
  }
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: "Each message must be an object" };
    }
    if (typeof msg.content !== "string") {
      return { valid: false, error: "Each message must have a string content" };
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Each message must be under ${MAX_MESSAGE_LENGTH} characters` };
    }
    if (msg.role !== "user" && msg.role !== "assistant") {
      return { valid: false, error: "Each message must have role 'user' or 'assistant'" };
    }
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, detailLevel, structured } = body;

    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const levelInstruction =
      detailLevel === "detailed"
        ? "Provide detailed, comprehensive explanations suitable for someone with civic knowledge of India."
        : "Provide simple, beginner-friendly explanations about Indian elections. Use short sentences and avoid legal jargon.";

    const apiMessages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${levelInstruction}\n\nIf the user provides an image, analyze it in the context of Indian elections and civic documentation (e.g., Voter ID, Election Slip).` },
      ...(messages as Array<{ role: string; content: string; image?: string }>).map((m) => {
        if (m.role === "user" && m.image) {
          return {
            role: m.role,
            content: [
              { type: "text", text: m.content.slice(0, MAX_MESSAGE_LENGTH) },
              { type: "image_url", image_url: { url: m.image } }
            ],
          };
        }
        return {
          role: m.role,
          content: m.content.slice(0, MAX_MESSAGE_LENGTH),
        };
      }),
    ];

    if (structured) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: apiMessages,
          tools: [STRUCTURED_TOOL],
          tool_choice: { type: "function", function: { name: "civic_response" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ error: "AI service error" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          const parsed = JSON.parse(toolCall.function.arguments);
          return new Response(JSON.stringify({ structured: parsed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        } catch {
          const content = data.choices?.[0]?.message?.content || "Unable to parse structured response.";
          return new Response(JSON.stringify({ content }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      const content = data.choices?.[0]?.message?.content || "Unable to generate response.";
      return new Response(JSON.stringify({ content }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Streaming mode
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
