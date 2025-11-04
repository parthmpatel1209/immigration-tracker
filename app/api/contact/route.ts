// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------------
// 1. Load env vars EXACTLY as they appear in your .env.local
// ------------------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ------------------------------------------------------------------
// 2. Guard against placeholder / missing keys
// ------------------------------------------------------------------
if (!supabaseUrl) {
  console.error("SUPABASE_URL is missing in .env.local");
  throw new Error("Missing SUPABASE_URL");
}

if (
  !supabaseServiceKey ||
  supabaseServiceKey.includes("your_service_role_key_here")
) {
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY is missing or still contains the placeholder.\n" +
      "Replace the whole value (including the leading 'your_service_role_key_here') with the real key."
  );
  throw new Error("Invalid SUPABASE_SERVICE_ROLE_KEY");
}

// ------------------------------------------------------------------
// 3. Initialise Supabase client (server-side only)
// ------------------------------------------------------------------
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ------------------------------------------------------------------
// 4. POST handler – **named export** required by Next.js App Router
// ------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, status, message } = body;

    // ---- basic required-field validation ----
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    // ---- insert into Supabase ----
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          status: status?.trim() || null,
          message: message.trim(),
        },
      ])
      .select(); // returns the inserted row(s)

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save message", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error in /api/contact:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// Force fresh execution on every request (optional but safe for forms)
export const dynamic = "force-dynamic";
