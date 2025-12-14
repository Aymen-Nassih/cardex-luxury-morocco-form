import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/database.js';

export async function POST(request) {
  try {
    const db = getDatabase();
    const data = await request.json();

    // Insert main client data
    const clientResult = db.prepare(`
      INSERT INTO clients (
        full_name, email, phone, number_of_travelers, group_type,
        arrival_date, departure_date,
        dietary_restrictions, accessibility_needs, preferred_language,
        custom_activities, food_preferences, additional_inquiries,
        gdpr_consent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.full_name,
      data.email,
      data.phone,
      data.number_of_travelers,
      data.group_type,
      data.arrival_date || null,
      data.departure_date || null,
      JSON.stringify(data.dietary_restrictions || []),
      JSON.stringify(data.accessibility_needs || []),
      data.preferred_language || null,
      data.custom_activities || null,
      data.food_preferences || null,
      data.additional_inquiries || null,
      data.gdpr_consent ? 1 : 0,
      'Pending'
    );

    const clientId = clientResult.lastInsertRowid;

    // Insert additional travelers if any
    if (data.additional_travelers && data.additional_travelers.length > 0) {
      const travelerStmt = db.prepare(`
        INSERT INTO additional_travelers (
          client_id, traveler_number, name, email, phone, age_group, relationship,
          dietary_restrictions, special_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < data.additional_travelers.length; i++) {
        const traveler = data.additional_travelers[i];
        if (traveler.name) { // Only insert if name is provided
          travelerStmt.run(
            clientId,
            i + 1, // traveler_number starts from 1
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
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully!',
      client_id: clientId
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit form. Please try again.'
    }, { status: 500 });
  }
}