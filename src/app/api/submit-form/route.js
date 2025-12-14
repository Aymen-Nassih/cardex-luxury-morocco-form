import { NextResponse } from 'next/server';
import { createClient, createTravelers } from '../../../../lib/supabase-db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { additional_travelers, ...clientData } = body;

    // Generate unique client ID
    const clientId = `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Prepare client data
    const clientPayload = {
      id: clientId,
      full_name: clientData.full_name,
      email: clientData.email,
      phone: clientData.phone,
      number_of_travelers: clientData.number_of_travelers,
      group_type: clientData.group_type,
      arrival_date: clientData.arrival_date || null,
      departure_date: clientData.departure_date || null,
      dietary_restrictions: JSON.stringify(clientData.dietary_restrictions || []),
      accessibility_needs: JSON.stringify(clientData.accessibility_needs || []),
      preferred_language: clientData.preferred_language || null,
      custom_activities: clientData.custom_activities || null,
      food_preferences: clientData.food_preferences || null,
      additional_inquiries: clientData.additional_inquiries || null,
      gdpr_consent: clientData.gdpr_consent || false,
      status: 'Pending'
    };

    // Create client
    const client = await createClient(clientPayload);

    // Create additional travelers if any
    if (additional_travelers && additional_travelers.length > 0) {
      await createTravelers(clientId, additional_travelers);
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