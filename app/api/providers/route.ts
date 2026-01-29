import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const service = searchParams.get('service');
    const evidenceLevel = searchParams.get('evidence_level');

    let query = supabase
      .from('providers')
      .select(`
        *,
        provider_services (
          intervention_id,
          notes,
          intervention_categories (
            name,
            evidence_level,
            evidence_label
          )
        )
      `)
      .eq('verified', true);

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch providers' },
        { status: 500 }
      );
    }

    // Filter by service or evidence level in-memory if needed
    let filteredData = data;

    if (service) {
      filteredData = data?.filter(provider =>
        provider.provider_services?.some((ps: any) =>
          ps.intervention_categories?.name.toLowerCase().includes(service.toLowerCase())
        )
      );
    }

    if (evidenceLevel) {
      filteredData = filteredData?.filter(provider =>
        provider.provider_services?.some((ps: any) =>
          ps.intervention_categories?.evidence_level === evidenceLevel
        )
      );
    }

    return NextResponse.json({ providers: filteredData || [] });
  } catch (error) {
    console.error('Provider API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
