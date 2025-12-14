import { NextResponse } from 'next/server';
import { getClients } from '../../../../../lib/supabase-db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const perPage = parseInt(searchParams.get('per_page')) || 50;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const groupType = searchParams.get('group_type') || '';

    const result = await getClients(page, perPage, search, status, groupType);

    return NextResponse.json({
      success: true,
      clients: result.clients,
      total_pages: result.total_pages,
      current_page: result.current_page,
      total_count: result.total_count
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}