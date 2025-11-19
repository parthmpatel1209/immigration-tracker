// app/api/news/route.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const transformedData = data.map((item: any) => {
      let image_url: string | null = null;

      if (item.image_path) {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(item.image_path);
        image_url = urlData.publicUrl;
      }

      return {
        id: item.id,
        title: item.title,
        summary: item.summary,
        source: item.source ?? undefined,
        published_at: item.published_at ?? undefined,
        url: item.url ?? undefined,
        program: item.program ?? undefined,
        image_url,
      };
    });

    return Response.json(transformedData); // always 200 + valid JSON
  } catch (err: any) {
    console.error("Unexpected news API error:", err);
    return Response.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
