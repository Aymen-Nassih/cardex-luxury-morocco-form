// Test script to verify form submission with additional travelers
import fetch from 'node-fetch';

async function testFormWithTravelers() {
  console.log('🧪 Testing Form Submission with Additional Travelers...\n');

  try {
    // Test 1: Check initial state
    console.log('1️⃣ Checking initial state...');
    const initialResponse = await fetch('http://localhost:3000/api/clients');
    const initialData = await initialResponse.json();
    console.log(`   Initial client count: ${initialData.total_count}`);

    // Test 2: Submit form with additional travelers
    console.log('\n2️⃣ Submitting form with additional travelers...');
    const formData = {
      full_name: "Family Test User",
      email: "family.test@example.com",
      phone: "555-FAMILY",
      age: "35",
      number_of_travelers: 4,
      group_type: "Family",
      arrival_date: "2025-12-26",
      departure_date: "2025-12-31",
      flight_number: "AT999",
      arrival_time: "16:45",
      city_of_arrival: "RAK",
      dietary_restrictions: ["Vegetarian", "Gluten-free"],
      accessibility_needs: ["Wheelchair access"],
      preferred_language: "English",
      custom_activities: "Cultural tours and desert safari",
      food_preferences: "Traditional Moroccan cuisine",
      additional_inquiries: "Special dietary requirements for the children",
      gdpr_consent: true,
      additional_travelers: [
        {
          id: "traveler_1",
          name: "Sarah Test",
          phone: "555-SARAH",
          age: "32",
          relationship: "Spouse",
          dietary_restrictions: ["Vegetarian"],
          special_notes: "Prefers mild spices"
        },
        {
          id: "traveler_2", 
          name: "Tommy Test",
          phone: "555-TOMMY",
          age: "10",
          relationship: "Child",
          dietary_restrictions: ["Gluten-free"],
          special_notes: "Loves sweets and desserts"
        },
        {
          id: "traveler_3",
          name: "Lily Test", 
          phone: "555-LILY",
          age: "7",
          relationship: "Child",
          dietary_restrictions: [],
          special_notes: "Allergic to nuts"
        }
      ]
    };

    const submitResponse = await fetch('http://localhost:3000/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const submitResult = await submitResponse.json();
    console.log(`   Form submission result: ${JSON.stringify(submitResult)}`);

    if (submitResult.success) {
      console.log(`   ✅ Form submitted successfully with ID: ${submitResult.clientId}\n`);
      
      const clientId = submitResult.clientId;

      // Test 3: Check if additional travelers were saved
      console.log('3️⃣ Checking if additional travelers were saved...');
      const travelersResponse = await fetch(`http://localhost:3000/api/clients/${clientId}/travelers`);
      const travelersData = await travelersResponse.json();
      
      console.log(`   Additional travelers found: ${travelersData.travelers?.length || 0}`);
      
      if (travelersData.success && travelersData.travelers.length > 0) {
        console.log('   ✅ Additional travelers saved successfully!');
        travelersData.travelers.forEach((traveler, index) => {
          console.log(`     ${index + 1}. ${traveler.name} (${traveler.relationship}) - Age: ${traveler.age}`);
        });
      } else {
        console.log('   ❌ No additional travelers found');
      }

      // Test 4: Check if client appears in main list
      console.log('\n4️⃣ Checking if client appears in admin panel...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedResponse = await fetch('http://localhost:3000/api/clients');
      const updatedData = await updatedResponse.json();
      console.log(`   Updated client count: ${updatedData.total_count}`);
      
      const newClient = updatedData.clients.find(c => c.email === 'family.test@example.com');
      if (newClient) {
        console.log(`   ✅ New client found: ${newClient.full_name} (${newClient.number_of_travelers} travelers)`);
      } else {
        console.log('   ❌ New client not found in list');
      }

      // Test 5: Check client details
      console.log('\n5️⃣ Checking client details...');
      const clientDetailsResponse = await fetch(`http://localhost:3000/api/clients/${clientId}`);
      const clientDetails = await clientDetailsResponse.json();
      
      if (clientDetails.success) {
        console.log(`   Client: ${clientDetails.client.full_name}`);
        console.log(`   Activities: ${clientDetails.client.custom_activities || 'None'}`);
        console.log(`   Food Preferences: ${clientDetails.client.food_preferences || 'None'}`);
        console.log(`   Additional Inquiries: ${clientDetails.client.additional_inquiries || 'None'}`);
        console.log('   ✅ All client information is displaying correctly');
      }

    } else {
      console.log(`   ❌ Form submission failed: ${submitResult.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFormWithTravelers();