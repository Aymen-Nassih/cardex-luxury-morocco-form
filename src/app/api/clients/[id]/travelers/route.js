import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const db = getDatabase();
    const { id: clientId } = await params;

    const travelers = db.prepare(`
      SELECT * FROM additional_travelers
      WHERE client_id = ?
      ORDER BY traveler_number ASC
    `).all(clientId);

    // Parse JSON fields
    const parsedTravelers = travelers.map(traveler => ({
      ...traveler,
      dietary_restrictions: JSON.parse(traveler.dietary_restrictions || '[]')
    }));

    return NextResponse.json({
      success: true,
      travelers: parsedTravelers
    });

  } catch (error) {
    console.error('Get travelers error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}