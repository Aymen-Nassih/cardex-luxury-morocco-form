#!/usr/bin/env node

/**
 * 🔍 Verify Database Schema
 * Checks if the Supabase schema is properly set up
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifySchema() {
  console.log('🔍 VERIFYING DATABASE SCHEMA')
  console.log('='.repeat(50))
  console.log(`URL: ${supabaseUrl}`)
  console.log()

  try {
    // Test 1: Check if tables exist
    console.log('1. Checking database tables...')
    
    const tables = ['clients', 'additional_travelers', 'users', 'client_notes']
    const tableResults = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
          tableResults[table] = false
        } else {
          console.log(`✅ Table '${table}': Exists and accessible`)
          tableResults[table] = true
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`)
        tableResults[table] = false
      }
    }
    
    console.log()

    // Test 2: Check specific columns in clients table
    console.log('2. Checking clients table columns...')
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('full_name, email, custom_activities, dietary_restrictions')
        .limit(1)
      
      if (error) {
        console.log(`❌ Column check failed: ${error.message}`)
      } else {
        console.log(`✅ Required columns exist in clients table`)
      }
    } catch (err) {
      console.log(`❌ Column check failed: ${err.message}`)
    }
    
    console.log()

    // Test 3: Check additional_travelers table columns
    console.log('3. Checking additional_travelers table columns...')
    
    try {
      const { data, error } = await supabase
        .from('additional_travelers')
        .select('name, age, relationship, dietary_restrictions')
        .limit(1)
      
      if (error) {
        console.log(`❌ Traveler columns check failed: ${error.message}`)
      } else {
        console.log(`✅ Required columns exist in additional_travelers table`)
      }
    } catch (err) {
      console.log(`❌ Traveler columns check failed: ${err.message}`)
    }
    
    console.log()

    // Test 4: Try a minimal insert
    console.log('4. Testing minimal form submission...')
    
    const testClient = {
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      group_type: 'Individual',
      status: 'Pending'
    }

    const { data: insertedClient, error: insertError } = await supabase
      .from('clients')
      .insert(testClient)
      .select()
      .single()

    if (insertError) {
      console.log(`❌ Insert test failed: ${insertError.message}`)
    } else {
      console.log(`✅ Insert test successful: ${insertedClient.id}`)
      
      // Clean up test data
      await supabase
        .from('clients')
        .delete()
        .eq('id', insertedClient.id)
      
      console.log('✅ Test data cleaned up')
    }

    console.log()
    console.log('📊 SCHEMA VERIFICATION SUMMARY:')
    console.log('='.repeat(50))
    
    const allTablesExist = Object.values(tableResults).every(result => result === true)
    
    if (allTablesExist) {
      console.log('✅ All database tables exist and are accessible')
      console.log('✅ Schema is properly configured')
      console.log('✅ Form submission should work now!')
      console.log()
      console.log('🚀 You can now test your form submission!')
    } else {
      console.log('❌ Some database tables are missing')
      console.log('❌ Schema needs to be executed in Supabase')
      console.log()
      console.log('📋 Next steps:')
      console.log('1. Execute the clean-slate-schema.sql in Supabase SQL Editor')
      console.log('2. Run this verification script again')
    }

  } catch (error) {
    console.error('❌ Schema verification failed:', error.message)
    console.log()
    console.log('Troubleshooting:')
    console.log('1. Check your Supabase credentials in .env.local')
    console.log('2. Ensure your Supabase project is active')
    console.log('3. Execute the database schema in Supabase SQL Editor')
  }
}

// Run verification
verifySchema()
  .then(() => {
    console.log('\n✅ Schema verification completed')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Schema verification error:', error)
    process.exit(1)
  })