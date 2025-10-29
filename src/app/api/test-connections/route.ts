import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const results = {
    supabase: { connected: false, error: null as string | null },
    klaviyo: { connected: false, error: null as string | null },
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      klaviyoKey: !!process.env.KLAVIYO_API_KEY,
      klaviyoList: !!process.env.KLAVIYO_LIST_ID,
    }
  };

  // Test Supabase connection
  try {
    const { data, error } = await supabase
      .from('players')
      .select('id')
      .limit(1);
      
    if (error) {
      results.supabase.error = error.message;
    } else {
      results.supabase.connected = true;
    }
  } catch (error) {
    results.supabase.error = error instanceof Error ? error.message : 'Unknown Supabase error';
  }

  // Test Klaviyo connection
  try {
    const response = await fetch(`https://a.klaviyo.com/api/lists/${process.env.KLAVIYO_LIST_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
        'revision': '2024-10-15'
      }
    });

    if (response.ok) {
      results.klaviyo.connected = true;
    } else {
      results.klaviyo.error = `HTTP ${response.status}: ${await response.text()}`;
    }
  } catch (error) {
    results.klaviyo.error = error instanceof Error ? error.message : 'Unknown Klaviyo error';
  }

  return NextResponse.json(results);
}
