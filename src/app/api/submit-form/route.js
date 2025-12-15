import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(request) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { additional_travelers, ...clientData } = body;

    // Insert client
    const clientResult = db.prepare(`
      INSERT INTO clients (
        full_name, email, phone, number_of_travelers, group_type,
        arrival_date, departure_date, dietary_restrictions, accessibility_needs,
        preferred_language, custom_activities, food_preferences,
        additional_inquiries, gdpr_consent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      clientData.full_name,
      clientData.email,
      clientData.phone,
      clientData.number_of_travelers,
      clientData.group_type,
      clientData.arrival_date || null,
      clientData.departure_date || null,
      JSON.stringify(clientData.dietary_restrictions || []),
      JSON.stringify(clientData.accessibility_needs || []),
      clientData.preferred_language || null,
      clientData.custom_activities || null,
      clientData.food_preferences || null,
      clientData.additional_inquiries || null,
      clientData.gdpr_consent ? 1 : 0,
      'Pending'
    );

    const clientId = clientResult.lastInsertRowid;

    // Insert additional travelers if any
    if (additional_travelers && additional_travelers.length > 0) {
      const travelerStmt = db.prepare(`
        INSERT INTO additional_travelers (
          client_id, traveler_number, name, email, phone, age_group,
          relationship, dietary_restrictions, special_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < additional_travelers.length; i++) {
        const traveler = additional_travelers[i];
        travelerStmt.run(
          clientId,
          i + 1,
          traveler.name,
          traveler.email || null,
          traveler.phone || null,
          traveler.age_group || null,
          traveler.relationship || null,
          JSON.stringify(traveler.dietary_restrictions || []),
          traveler.special_notes || null
        );
      }
    }

    return NextResponse.json({
      success: true,
      client_id: clientId,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit form' },
      { status: 500 }
    );
  }
}