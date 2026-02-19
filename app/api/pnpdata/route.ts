// app/api/pnpdata/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pnp_quotas")
      .select(
        `
        id,
        code,
        name,
        total,
        filled,
        remaining,
        bonus_points,
        bonus_note,
        note,
        source_url,
        updated_at
      `
      )
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("PNP API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch PNP data" },
      { status: 500 }
    );
  }
}
