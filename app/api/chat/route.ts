// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getRelevantDocs } from "@/utils/rag";
import { streamResponse } from "@/utils/stream";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OR_MODEL || "mistralai/mistral-7b-instruct:free";
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) throw new Error("OPENROUTER_API_KEY missing in .env.local");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    console.log("📩 User message:", message);
    console.log("💬 History length:", history?.length || 0);

    // 🔍 Retrieve relevant IRCC documents for context (RAG)
    const contextDocs = await getRelevantDocs(message, 3);
    console.log("📚 Retrieved", contextDocs.length, "relevant documents");

    // 🧠 Construct system prompt with RAG context
    const systemPrompt = `You are a professional Canadian immigration assistant with expertise in IRCC policies and procedures.

IMPORTANT GUIDELINES:
1. Base your answers on the following official IRCC information:
${contextDocs.length > 0 ? contextDocs.map((doc, i) => `\n[Document ${i + 1}]\n${doc}`).join("\n\n") : "No specific documents found. Use general knowledge but recommend checking IRCC website."}

2. Keep responses concise (2-3 sentences maximum)
3. Always cite official IRCC sources when available
4. If you're unsure, say: "I don't have enough information. Please verify with IRCC at canada.ca"
5. Be professional, helpful, and empathetic
6. Never make up information or provide legal advice
7. Recommend consulting an immigration lawyer for complex cases

Remember: You're providing general information, not legal advice.`;

    // 📝 Prepare conversation history (keep last 6 messages for context)
    const conversationHistory = (history || [])
      .slice(-6) // Sliding window of last 6 messages
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      }));

    // 🚀 Call OpenRouter API with streaming
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Canadian Immigration Assistant",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        max_tokens: 400,
        temperature: 0.7,
        top_p: 0.9,
        stream: true, // ✨ Enable streaming for better UX
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ OpenRouter Error:", errorData);
      return NextResponse.json(
        { error: `API error: ${res.status} - ${errorData.error?.message || "Unknown error"}` },
        { status: res.status }
      );
    }

    // 📡 Stream the response back to client
    console.log("✅ Streaming response to client");
    return streamResponse(res);

  } catch (error: any) {
    console.error("💥 Server error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
