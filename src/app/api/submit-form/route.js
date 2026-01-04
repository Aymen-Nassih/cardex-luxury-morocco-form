import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function POST(request) {
  try {
    let formData;
    let files = {};

    // Check if request has FormData (files) or JSON
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with files)
      const formDataObj = await request.formData();

      // Extract files
      const passportFile = formDataObj.get('passport_file');
      if (passportFile) {
        files.passport_file = {
          file: passportFile,
          name: passportFile.name,
          size: passportFile.size,
          type: passportFile.type,
          uploadedAt: new Date().toISOString()
        };
      }

      // Extract traveler files
      const travelerFiles = {};
      for (const [key, value] of formDataObj.entries()) {
        if (key.startsWith('traveler_') && key.endsWith('_file')) {
          const travelerId = key.replace('traveler_', '').replace('_file', '');
          travelerFiles[travelerId] = {
            file: value,
            name: value.name,
            size: value.size,
            type: value.type,
            uploadedAt: new Date().toISOString()
          };
        }
      }

      // Parse JSON fields
      formData = {};
      for (const [key, value] of formDataObj.entries()) {
        if (key === 'additional_travelers') {
          formData[key] = JSON.parse(value);
        } else if (key === 'dietary_restrictions' || key === 'accessibility_needs') {
          formData[key] = JSON.parse(value);
        } else if (!key.includes('file')) {
          formData[key] = value;
        }
      }

      // Add files to formData
      if (files.passport_file) {
        formData.passport_file = files.passport_file;
      }

      // Add traveler files to additional_travelers
      if (formData.additional_travelers) {
        formData.additional_travelers = formData.additional_travelers.map(traveler => {
          const fileKey = traveler.id;
          if (travelerFiles[fileKey]) {
            return { ...traveler, passport_file: travelerFiles[fileKey] };
          }
          return traveler;
        });
      }

    } else {
      // Handle JSON (no files)
      formData = await request.json();
    }

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

    // Create client record first (without passport data)
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

    // Upload client passport file if provided
    if (formData.passport_file && formData.passport_file.file) {
      try {
        console.log('📁 Uploading client passport file...');
        console.log('File details:', {
          name: formData.passport_file.name,
          size: formData.passport_file.size,
          type: formData.passport_file.type
        });

        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.passport_file.file)
        uploadFormData.append('fileType', 'client')
        uploadFormData.append('clientId', client.id.toString())

        console.log('Upload FormData created for client passport');

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
          method: 'POST',
          body: uploadFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          console.log('✅ Client passport uploaded:', uploadResult.fileName)
        } else {
          console.log('❌ Client passport upload failed:', uploadResult.error)
        }
      } catch (error) {
        console.log('❌ Client passport upload error:', error.message)
        console.log('Error details:', error)
      }
    }

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

        // Process traveler accessibility needs - include "Other" text if specified
        let travelerAccessibilityNeeds = traveler.accessibility_needs || []
        if (travelerAccessibilityNeeds.includes('Other') && traveler.accessibility_needs_other) {
          travelerAccessibilityNeeds = travelerAccessibilityNeeds.map(item =>
            item === 'Other' ? `Other: ${traveler.accessibility_needs_other}` : item
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
          accessibility_needs: travelerAccessibilityNeeds,
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

        // Upload traveler passport file if provided
        if (traveler.passport_file && traveler.passport_file.file) {
          try {
            const uploadFormData = new FormData()
            uploadFormData.append('file', traveler.passport_file.file)
            uploadFormData.append('fileType', 'traveler')
            uploadFormData.append('clientId', client.id.toString())
            uploadFormData.append('travelerId', newTraveler.id.toString())

            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
              method: 'POST',
              body: uploadFormData
            })

            const uploadResult = await uploadResponse.json()
            if (uploadResult.success) {
              console.log('✅ Traveler passport uploaded:', uploadResult.fileName)
            } else {
              console.log('❌ Traveler passport upload failed:', uploadResult.error)
            }
          } catch (error) {
            console.log('❌ Traveler passport upload error:', error.message)
          }
        }
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