// app/api/pathways/route.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pr_pathways")
      .select("id, province, program, summary, url, status, key_requirements")
      .order("province", { ascending: true });

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Pathways API error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
