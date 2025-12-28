import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpdyuabpnaeljcxlnelm.supabase.co';
const supabaseAnonKey = 'sb_publishable_MrjhUf7sWhYs-U8mhGZv1Q_ZJBK7PEW';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection Error:', error.message);
      console.log('Error details:', error);
      return;
    }
    
    console.log('✅ Supabase Connection Successful!');
    console.log('Sample data:', data);
    
    // Test inserting a test record
    console.log('\n📝 Testing INSERT operation...');
    const insertResult = await supabase
      .from('clients')
      .insert({
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        number_of_travelers: 1,
        group_type: 'Individual',
        arrival_date: '2025-12-22',
        departure_date: '2025-12-25',
        gdpr_consent: true,
        status: 'Pending'
      })
      .select();
    
    if (insertResult.error) {
      console.log('❌ INSERT Error:', insertResult.error.message);
    } else {
      console.log('✅ INSERT Successful!', insertResult.data);
    }
    
  } catch (err) {
    console.log('❌ Connection Failed:', err.message);
    console.log('Full error:', err);
  }
}

testSupabaseConnection();