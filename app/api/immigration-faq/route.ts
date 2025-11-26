import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const language = searchParams.get('language') || 'en';

        let query = supabase
            .from('immigration_faq')
            .select('*')
            .order('id', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Translate if not English
        if (language !== 'en' && data) {
            const translatedData = await Promise.all(
                data.map(async (faq) => {
                    try {
                        const [question, answer, key_detail] = await Promise.all([
                            translateText(faq.question, language),
                            translateText(faq.answer, language),
                            faq.key_detail ? translateText(faq.key_detail, language) : null,
                        ]);

                        return {
                            ...faq,
                            question,
                            answer,
                            key_detail,
                        };
                    } catch (err) {
                        console.error('Translation error for FAQ:', faq.id, err);
                        return faq; // Return original if translation fails
                    }
                })
            );

            return NextResponse.json({ data: translatedData }, { status: 200 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
