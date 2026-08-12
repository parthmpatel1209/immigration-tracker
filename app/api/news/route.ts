// app/api/news/route.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    const limit = parseInt(searchParams.get('limit') || '15'); // Default to 15 items
    const offset = parseInt(searchParams.get('offset') || '0'); // Default to 0 offset
    const month = searchParams.get('month'); // Optional month filter (01-12)
    const year = searchParams.get('year'); // Optional year filter

    // Build query
    let query = supabase
      .from("news")
      .select("*", { count: 'exact' })
      .order("published_at", { ascending: false });

    // Apply date filters if provided
    if (year && month) {
      // Filter by specific month and year
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      query = query
        .gte("published_at", startDate.toISOString())
        .lt("published_at", endDate.toISOString());
    } else if (year) {
      // Filter by year only
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);

      query = query
        .gte("published_at", startDate.toISOString())
        .lt("published_at", endDate.toISOString());
    }

    // Get total count with filters
    const { count: totalCount } = await query;

    // Get paginated data with filters
    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const transformedData = data.map((item: any) => {
      let image_url: string | null = item.cover_image_url ?? null;

      if (!image_url && item.image_path) {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(item.image_path);
        image_url = urlData.publicUrl;
      }

      const instagram_url = item.instagram_url ? item.instagram_url.trim() : null;
      let instagram_reel_id = item.instagram_reel_id ?? null;
      if (!instagram_reel_id && instagram_url) {
        const match = instagram_url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
        if (match) instagram_reel_id = match[1];
      }

      // Automatic fallback to server-side Instagram thumbnail proxy if no custom image is provided
      if (!image_url && instagram_reel_id) {
        image_url = `/api/news/thumbnail?reel_id=${instagram_reel_id}`;
      }

      const media_type = (instagram_reel_id || instagram_url || item.media_type === "instagram_reel")
        ? "instagram_reel"
        : (item.media_type || "supabase_image");

      return {
        id: item.id,
        title: item.title,
        title_text: item.title_text,
        summary: item.summary,
        source: item.source ?? undefined,
        published_at: item.published_at ?? undefined,
        url: item.url ?? undefined,
        program: item.program ?? undefined,
        image_url,
        media_type,
        instagram_url,
        instagram_reel_id,
        cover_image_url: item.cover_image_url ?? null,
      };
    });

    // Translate if not English
    if (language !== 'en' && transformedData) {
      const translatedData = await Promise.all(
        transformedData.map(async (news) => {
          try {
            const [title_text, summary] = await Promise.all([
              news.title_text ? translateText(news.title_text, language) : null,
              news.summary ? translateText(news.summary, language) : null,
            ]);

            return {
              ...news,
              title_text: title_text || news.title_text,
              summary: summary || news.summary,
            };
          } catch (err) {
            console.error('Translation error for news:', news.id, err);
            return news; // Return original if translation fails
          }
        })
      );

      return Response.json({ items: translatedData, total: totalCount || 0 });
    }

    return Response.json({ items: transformedData, total: totalCount || 0 });
  } catch (err: any) {
    console.error("Unexpected news API error:", err);
    return Response.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0]?.map((item: any) => item[0]).join('') || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
