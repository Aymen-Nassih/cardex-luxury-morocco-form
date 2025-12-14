import { NextResponse } from 'next/server';
import { getClientTravelers } from '../../../../lib/supabase-db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const travelers = await getClientTravelers(id);

    return NextResponse.json({
      success: true,
      travelers
    });
  } catch (error) {
    console.error('Error fetching travelers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch travelers' },
      { status: 500 }
    );
  }
}