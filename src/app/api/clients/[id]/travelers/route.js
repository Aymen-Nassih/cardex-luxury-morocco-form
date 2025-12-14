import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../../../lib/database.js';

export async function GET(request, { params }) {
  try {
    const db = getDatabase();
    const clientId = (await params).id;

    const rawTravelers = db.prepare(`
      SELECT * FROM additional_travelers
      WHERE client_id = ?
      ORDER BY created_date
    `).all(clientId);

    // Parse JSON strings back to arrays/objects
    const travelers = rawTravelers.map(traveler => {
      let dietary_restrictions = [];
      try {
        dietary_restrictions = traveler.dietary_restrictions ? JSON.parse(traveler.dietary_restrictions) : [];
      } catch (e) {
        console.warn('Failed to parse traveler dietary_restrictions:', e);
        dietary_restrictions = [];
      }

      return {
        ...traveler,
        dietary_restrictions
      };
    });

    return NextResponse.json({
      success: true,
      travelers
    });

  } catch (error) {
    console.error('Travelers fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch travelers'
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const db = getDatabase();
    const clientId = (await params).id;
    const travelerData = await request.json();

    const result = db.prepare(`
      INSERT INTO additional_travelers (
        client_id, name, email, phone, age_group, relationship,
        dietary_restrictions, special_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      clientId,
      travelerData.name,
      travelerData.email || null,
      travelerData.phone || null,
      travelerData.age_group || null,
      travelerData.relationship || null,
      JSON.stringify(travelerData.dietary_restrictions || []),
      travelerData.special_notes || null,
      new Date().toISOString()
    );

    return NextResponse.json({
      success: true,
      traveler_id: result.lastInsertRowid,
      message: 'Traveler added successfully'
    });

  } catch (error) {
    console.error('Traveler creation error:', error);
    return NextResponse.json({
      error: 'Failed to add traveler'
    }, { status: 500 });
  }
}