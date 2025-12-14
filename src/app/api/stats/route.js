import { NextResponse } from 'next/server';
import { getStats } from '../../../lib/supabase-db';

export async function GET() {
  try {
    const stats = await getStats();

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}