// app/api/faqs/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("faqs")
      .select(
        "id, question, answer, official_source_url, display_order, created_at, updated_at"
      )
      // Fixed: nullsFirst: false → NULLS LAST
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || [], {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err: any) {
    console.error("FAQs API error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
