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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .range(from, to);

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
        title_text: item.title_text,
        summary: item.summary,
        source: item.source ?? undefined,
        published_at: item.published_at ?? undefined,
        url: item.url ?? undefined,
        program: item.program ?? undefined,
        image_url,
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

      return Response.json(translatedData);
    }

    return Response.json(transformedData); // always 200 + valid JSON
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
