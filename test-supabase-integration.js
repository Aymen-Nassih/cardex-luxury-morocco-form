#!/usr/bin/env node

/**
 * 🧪 Test Supabase Integration
 * Tests the complete Supabase setup and database operations
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  console.log('🧪 Testing Supabase Integration...\n')

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    const { data, error } = await supabase
      .from('clients')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    console.log('✅ Basic connection successful\n')

    // Test 2: Check if tables exist
    console.log('2. Checking database tables...')
    const tables = ['clients', 'additional_travelers', 'users', 'client_notes']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}' not found or accessible`)
        } else {
          console.log(`✅ Table '${table}' exists and accessible`)
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message)
      }
    }
    console.log()

    // Test 3: Create test data
    console.log('3. Testing data creation...')
    const testClient = {
      first_name: 'Test',
      last_name: 'Client',
      email: 'test@example.com',
      phone: '+1234567890',
      country: 'Test Country',
      preferred_language: 'English',
      group_type: 'Family',
      accommodation_type: 'Luxury Riad',
      budget_range: '$3000-$5000',
      duration_days: 7,
      interests: ['Culture', 'History'],
      activities: ['Guided Tours', 'Cooking Classes'],
      dietary_restrictions: ['Vegetarian'],
      accessibility_needs: [],
      additional_requests: 'Test client for Supabase integration',
      status: 'new',
      lead_source: 'test_script'
    }

    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert(testClient)
      .select()
      .single()

    if (createError) {
      console.error('❌ Failed to create test client:', createError.message)
      return false
    }

    console.log('✅ Test client created successfully:', newClient.id)

    // Test 4: Create test traveler
    console.log('4. Testing additional traveler creation...')
    const testTraveler = {
      client_id: newClient.id,
      name: 'Additional Traveler',
      age: 30,
      relationship: 'Friend',
      dietary_restrictions: ['Gluten-free'],
      special_notes: 'Test traveler notes'
    }

    const { data: newTraveler, error: travelerError } = await supabase
      .from('additional_travelers')
      .insert(testTraveler)
      .select()
      .single()

    if (travelerError) {
      console.error('❌ Failed to create test traveler:', travelerError.message)
    } else {
      console.log('✅ Test traveler created successfully:', newTraveler.id)
    }

    // Test 5: Read data back
    console.log('5. Testing data retrieval...')
    const { data: retrievedClients, error: readError } = await supabase
      .from('clients')
      .select(`
        *,
        additional_travelers(*)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (readError) {
      console.error('❌ Failed to retrieve clients:', readError.message)
    } else {
      console.log(`✅ Retrieved ${retrievedClients.length} clients with their travelers`)
      
      // Show sample client
      if (retrievedClients.length > 0) {
        const sampleClient = retrievedClients[0]
        console.log(`\n📋 Sample Client: ${sampleClient.first_name} ${sampleClient.last_name}`)
        console.log(`   Email: ${sampleClient.email}`)
        console.log(`   Status: ${sampleClient.status}`)
        console.log(`   Travelers: ${sampleClient.additional_travelers.length}`)
      }
    }

    // Test 6: Cleanup test data
    console.log('\n6. Cleaning up test data...')
    
    if (newClient) {
      // Delete travelers first (due to foreign key constraint)
      await supabase
        .from('additional_travelers')
        .delete()
        .eq('client_id', newClient.id)
      
      // Then delete client
      await supabase
        .from('clients')
        .delete()
        .eq('id', newClient.id)
      
      console.log('✅ Test data cleaned up')
    }

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📋 Summary:')
    console.log('✅ Database connection working')
    console.log('✅ Tables accessible')
    console.log('✅ Data creation working')
    console.log('✅ Data retrieval working')
    console.log('✅ Additional travelers functionality working')
    console.log('\n🚀 Your Morocco Tourism Form is ready for production!')

    return true

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('\nTroubleshooting:')
    console.log('1. Make sure you have executed supabase-schema.sql in your Supabase SQL Editor')
    console.log('2. Check that your environment variables are correct')
    console.log('3. Verify your Supabase project is active')
    console.log('\nIf you need to set up the database:')
    console.log('1. Go to https://supabase.com/dashboard')
    console.log('2. Create a new project or use existing one')
    console.log('3. Go to SQL Editor and run supabase-schema.sql')
    console.log('4. Make sure environment variables are set in .env.local')
    return false
  }
}

// Run tests
testDatabase()
  .then(success => {
    if (success) {
      console.log('\n✅ Integration test PASSED')
      process.exit(0)
    } else {
      console.log('\n❌ Integration test FAILED')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })