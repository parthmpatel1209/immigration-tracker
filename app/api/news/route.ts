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
      .limit(500);

    if (error) throw error;

    const transformedData =
      data?.map((item: any) => {
        let imageUrl: string | null = null;

        if (item.image_path) {
          // `image_path` is just the file name → build public URL
          const { data: urlData } = supabase.storage
            .from("images")
            .getPublicUrl(item.image_path);

          imageUrl = urlData.publicUrl; // e.g. https://…/Id1_Image.png
        }

        return { ...item, image_url: imageUrl };
      }) ?? [];

    return new Response(JSON.stringify(transformedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("News API error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
