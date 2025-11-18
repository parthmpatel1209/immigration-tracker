// app/api/chat/route.ts
import { NextResponse } from "next/server";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OR_MODEL || "meta-llama/llama-3.2-3b-instruct:free";
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) throw new Error("OPENROUTER_API_KEY missing");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message?.trim())
      return NextResponse.json({ error: "Empty message" }, { status: 400 });

    console.log("User message:", message);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // Your site URL
        "X-Title": "Immigration Bot",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a concise Canadian immigration expert. Answer in 2 sentences max.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    console.log("OpenRouter Response:", data);

    if (!res.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json(
        { error: `API error: ${res.status}` },
        { status: 500 }
      );
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "No reply.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
