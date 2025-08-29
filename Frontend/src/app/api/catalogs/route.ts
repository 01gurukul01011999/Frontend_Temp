import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    let supabase;
    try {
      supabase = createSupabaseAdmin();
    } catch (e: any) {
      console.error('createSupabaseAdmin failed', e);
      return NextResponse.json({ error: 'Server configuration error: ' + (e?.message || String(e)) }, { status: 500 });
    }

    const { data, error } = await supabase.from('catalogs').insert([payload]).select();

    if (error) {
      console.error('Supabase insert error', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/catalogs error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
