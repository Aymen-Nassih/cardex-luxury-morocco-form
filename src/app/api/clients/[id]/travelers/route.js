import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database';

export async function GET(request, { params }) {
  try {
    const db = getDatabase();
    const { id } = params;

    const travelers = db.prepare(`
      SELECT * FROM additional_travelers
      WHERE client_id = ?
      ORDER BY traveler_number ASC
    `).all(id);

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
    console.error('Error fetching travelers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch travelers' },
      { status: 500 }
    );
  }
}