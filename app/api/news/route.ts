// app/api/news/route.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("News API error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
