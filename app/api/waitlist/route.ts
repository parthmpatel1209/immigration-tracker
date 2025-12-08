// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Use the correct environment variable names from your .env.local
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log('Supabase URL exists:', !!supabaseUrl);
        console.log('Service key exists:', !!supabaseServiceKey);

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase credentials:', {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseServiceKey
            });
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Create Supabase client with service role key
        const supabase = createClient(
            supabaseUrl,
            supabaseServiceKey,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                }
            }
        );

        // Test connection first
        try {
            const { data: test, error: testError } = await supabase
                .from('waitlist')
                .select('count', { count: 'exact', head: true });

            if (testError) {
                console.error('Supabase connection test failed:', testError);
                // Check if table doesn't exist
                if (testError.code === '42P01') {
                    return NextResponse.json(
                        {
                            error: 'Database table not found',
                            message: 'Please create the waitlist table in Supabase'
                        },
                        { status: 500 }
                    );
                }
                throw testError;
            }
        } catch (connectionError) {
            console.error('Connection test error:', connectionError);
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }

        // Check if email already exists
        const { data: existing, error: checkError } = await supabase
            .from('waitlist')
            .select('email')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (checkError) {
            console.error('Check existing email error:', checkError);
            throw checkError;
        }

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email already registered',
                    message: 'You are already on our waitlist! Thank you for your interest.'
                },
                { status: 409 }
            );
        }

        // Insert new waitlist entry
        const { data, error: insertError } = await supabase
            .from('waitlist')
            .insert([
                {
                    email: email.toLowerCase().trim(),
                    subscribed_at: new Date().toISOString(),
                    source: 'website',
                    status: 'active'
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase insert error:', insertError);

            // Handle duplicate email error (race condition)
            if (insertError.code === '23505') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Email already registered',
                        message: 'You are already on our waitlist!'
                    },
                    { status: 409 }
                );
            }

            throw insertError;
        }

        console.log('Successfully added to waitlist:', data.email);

        return NextResponse.json(
            {
                success: true,
                message: '🎉 Success! You have been added to the waitlist.',
                data: {
                    email: data.email,
                    subscribed_at: data.subscribed_at
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Waitlist API error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Something went wrong. Please try again later.'
            },
            { status: 500 }
        );
    }
}

// Optional: GET method for checking count
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { count, error } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            count: count || 0
        });

    } catch (error: any) {
        console.error('GET waitlist error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}