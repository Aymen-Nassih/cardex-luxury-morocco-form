#!/usr/bin/env node

/**
 * 🏗️ Morocco Tourism Form - Supabase Setup Script
 * 
 * This script helps you quickly set up Supabase for your application.
 * Run with: node setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🏗️  Morocco Tourism Form - Supabase Setup');
console.log('==========================================\n');

async function main() {
  try {
    // Check if .env.local exists
    const envPath = path.join(__dirname, '.env.local');
    const envExamplePath = path.join(__dirname, '.env.example');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ .env.local already exists');
    } else if (fs.existsSync(envExamplePath)) {
      console.log('📝 Creating .env.local from .env.example...');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env.local created from template');
    } else {
      console.log('❌ .env.example not found');
      return;
    }

    // Prompt for Supabase credentials
    console.log('\n🔑 Supabase Configuration Required:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Create a new project or select existing one');
    console.log('3. Go to Settings > API');
    console.log('4. Copy your Project URL and anon public key\n');

    const supabaseUrl = await question('Project URL: ');
    const supabaseKey = await question('Anon Public Key: ');
    const serviceRoleKey = await question('Service Role Key (optional): ');
    
    // Update .env.local
    const envContent = fs.readFileSync(envPath, 'utf8');
    const updatedContent = envContent
      .replace('https://your-project-ref.supabase.co', supabaseUrl)
      .replace('your-anon-key-here', supabaseKey)
      .replace('your-service-role-key-here', serviceRoleKey || 'not-required-for-demo');

    fs.writeFileSync(envPath, updatedContent);
    console.log('\n✅ Environment variables updated');

    // Check if supabase-schema.sql exists
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('\n📋 Database Schema Ready');
      console.log('Next steps:');
      console.log('1. Open your Supabase dashboard');
      console.log('2. Go to SQL Editor');
      console.log('3. Copy and paste the contents of supabase-schema.sql');
      console.log('4. Run the SQL to create all tables and sample data');
    }

    // Install dependencies
    console.log('\n📦 Installing Supabase client...');
    const { execSync } = require('child_process');
    
    try {
      execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
      console.log('✅ Supabase client installed');
    } catch (error) {
      console.log('❌ Failed to install Supabase client');
      console.log('Please run manually: npm install @supabase/supabase-js');
    }

    console.log('\n🎉 Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Execute the SQL schema in Supabase');
    console.log('2. Update your API routes to use Supabase');
    console.log('3. Test the application');
    console.log('\nFor detailed instructions, see SUPABASE-SETUP-GUIDE.md');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

if (require.main === module) {
  main();
}

module.exports = { main };