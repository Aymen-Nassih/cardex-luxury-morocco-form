// Test script to verify database persistence and form submission
import fetch from 'node-fetch';

async function testFormSubmission() {
  console.log('🧪 Testing Form Submission and Database Persistence...\n');

  try {
    // Test 1: Check initial client count
    console.log('1️⃣ Checking initial client count...');
    const initialResponse = await fetch('http://localhost:3000/api/clients');
    const initialData = await initialResponse.json();
    console.log(`   Initial client count: ${initialData.total_count}`);
    console.log(`   Sample client: ${initialData.clients[0]?.full_name || 'None'}\n`);

    // Test 2: Submit a new form
    console.log('2️⃣ Submitting new form...');
    const formData = {
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-1234",
      age: 28,
      number_of_travelers: 2,
      group_type: "Couple",
      arrival_date: "2025-12-23",
      departure_date: "2025-12-26",
      flight_number: "AT456",
      arrival_time: "14:15",
      city_of_arrival: "CMN",
      dietary_restrictions: ["Vegetarian"],
      accessibility_needs: [],
      preferred_language: "English",
      custom_activities: null,
      food_preferences: null,
      additional_inquiries: "Looking forward to exploring Morocco!",
      gdpr_consent: true
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
      console.log(`   ✅ Form submitted successfully with ID: ${submitResult.client_id}\n`);
    } else {
      console.log(`   ❌ Form submission failed: ${submitResult.message}\n`);
      return;
    }

    // Test 3: Check if new client appears in database
    console.log('3️⃣ Checking if new client appears in database...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for persistence

    const updatedResponse = await fetch('http://localhost:3000/api/clients');
    const updatedData = await updatedResponse.json();
    console.log(`   Updated client count: ${updatedData.total_count}`);
    console.log(`   Expected count: ${initialData.total_count + 1}`);

    if (updatedData.total_count === initialData.total_count + 1) {
      console.log('   ✅ SUCCESS: New client appears in database!');
      
      // Find the new client
      const newClient = updatedData.clients.find(c => c.email === 'jane.smith@example.com');
      if (newClient) {
        console.log(`   New client details: ${newClient.full_name} (${newClient.email})`);
        console.log(`   Status: ${newClient.status}, Group Type: ${newClient.group_type}`);
      }
    } else {
      console.log('   ❌ FAILED: New client does not appear in database');
    }

    console.log('\n📊 Final Results:');
    console.log(`   Total clients now: ${updatedData.total_count}`);
    console.log(`   All clients:`);
    updatedData.clients.forEach((client, index) => {
      console.log(`     ${index + 1}. ${client.full_name} - ${client.email}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFormSubmission();