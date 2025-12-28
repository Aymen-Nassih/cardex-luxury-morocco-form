import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function POST(request) {
  try {
    const formData = await request.json()

    console.log('📝 Form submission received:', formData)

    // Process dietary restrictions - include "Other" text if specified
    let dietaryRestrictions = formData.dietary_restrictions || []
    if (dietaryRestrictions.includes('Other') && formData.dietary_restrictions_other) {
      // Replace "Other" with the actual text or append it
      dietaryRestrictions = dietaryRestrictions.map(item =>
        item === 'Other' ? `Other: ${formData.dietary_restrictions_other}` : item
      )
    }

    // Process accessibility needs - include "Other" text if specified
    let accessibilityNeeds = formData.accessibility_needs || []
    if (accessibilityNeeds.includes('Other') && formData.accessibility_needs_other) {
      // Replace "Other" with the actual text or append it
      accessibilityNeeds = accessibilityNeeds.map(item =>
        item === 'Other' ? `Other: ${formData.accessibility_needs_other}` : item
      )
    }

    // Create client record
    const clientData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      number_of_travelers: formData.number_of_travelers,
      group_type: formData.group_type,
      occasion_description: formData.occasion_description || '',
      arrival_date: formData.arrival_date,
      departure_date: formData.departure_date,
      flight_number: formData.flight_number,
      arrival_time: formData.arrival_time,
      city_of_arrival: formData.city_of_arrival,
      dietary_restrictions: dietaryRestrictions,
      accessibility_needs: accessibilityNeeds,
      preferred_language: formData.preferred_language,
      custom_activities: formData.custom_activities || '',
      food_preferences: formData.food_preferences || '',
      additional_inquiries: formData.additional_inquiries || '',
      gdpr_consent: formData.gdpr_consent,
      status: 'Pending'
    }

    const client = await db.createClient(clientData)
    console.log('✅ Client created:', client.id)

    // Add additional travelers if any
    const travelers = formData.additional_travelers || []
    if (travelers.length > 0) {
      for (let i = 0; i < travelers.length; i++) {
        const traveler = travelers[i]

        // Process traveler dietary restrictions - include "Other" text if specified
        let travelerDietaryRestrictions = traveler.dietary_restrictions || []
        if (travelerDietaryRestrictions.includes('Other') && traveler.dietary_restrictions_other) {
          travelerDietaryRestrictions = travelerDietaryRestrictions.map(item =>
            item === 'Other' ? `Other: ${traveler.dietary_restrictions_other}` : item
          )
        }

        const travelerData = {
          client_id: client.id,
          traveler_number: i + 2, // Traveler 2, 3, 4, etc.
          name: traveler.name,
          age: parseInt(traveler.age) || null,
          relationship: traveler.relationship,
          email: traveler.email || null,
          phone: traveler.phone || null,
          dietary_restrictions: travelerDietaryRestrictions,
          special_notes: traveler.special_notes || '',
          has_different_travel: traveler.has_different_travel || false,
          arrival_date: traveler.arrival_date || null,
          departure_date: traveler.departure_date || null,
          flight_number: traveler.flight_number || null,
          arrival_time: traveler.arrival_time || null,
          city_of_arrival: traveler.city_of_arrival || null
        }

        const newTraveler = await db.addTraveler(travelerData)
        console.log('✅ Additional traveler added:', newTraveler.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully!',
      clientId: client.id
    })

  } catch (error) {
    console.error('❌ Form submission error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit form'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // For testing - return all clients
    const clients = await db.getClients()
    return NextResponse.json({
      success: true,
      clients: clients
    })
  } catch (error) {
    console.error('❌ GET clients error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}