# 🏗️ Supabase Database Setup Guide

## Overview
This guide will help you set up a complete PostgreSQL database for your Morocco Tourism Form using Supabase. The database includes full client management, additional travelers, admin features, and enterprise-level security.

## 🚀 Quick Start (Automated)

Run the automated setup script:
```bash
cd cardex-nextjs
node setup-supabase.js
```

## 📋 Manual Setup Steps

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign up or log in to your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `morocco-tourism-form`
   - Enter database password (save this!)
   - Select region (choose closest to your users)
   - Click "Create new project"

3. **Get Project Credentials**
   - Go to Settings > API
   - Copy your Project URL
   - Copy your anon public key
   - Copy your service role key (for admin operations)

### Step 2: Configure Environment

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Update .env.local with your credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 3: Execute Database Schema

**Option A: SQL Editor (Recommended)**
1. In your Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run the SQL
5. You should see "Success. No rows returned"

**Option B: Command Line (Advanced)**
```bash
# Install Supabase CLI first
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push the schema
supabase db push
```

### Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 5: Test the Integration

```bash
node test-supabase-integration.js
```

You should see all tests pass with ✅ marks.

## 📊 Database Schema Overview

The database includes these tables:

### Core Tables

**`clients`**
- Primary client information
- Travel preferences and requirements
- Contact details and booking status
- Additional travelers support

**`additional_travelers`**
- Additional travelers per client
- Dietary restrictions and special notes
- Relationship to primary client

**`users`**
- Admin user management
- Role-based access control

**`client_notes`**
- Internal notes for each client
- User attribution and timestamps

**`modification_log`**
- Audit trail for all changes
- Compliance and tracking

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Policies** for secure data access
- **UUID primary keys** for security
- **Automatic timestamps** and audit trails

### Performance Optimizations

- **Indexes** on frequently queried fields
- **Foreign key constraints** for data integrity
- **JSON fields** for flexible data storage

## 🔧 Configuration Options

### Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional
ADMIN_EMAIL=admin@experiencemorocco.com
ADMIN_PASSWORD=secure-password
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
```

### Security Settings

1. **Authentication**: Enable email/password authentication in Supabase Auth settings
2. **API Security**: Use RLS policies for data protection
3. **CORS**: Configure allowed origins for production

## 📈 Sample Data

The schema includes sample data for testing:

- 3 sample clients with different group types
- Additional travelers for family and group bookings
- Admin users and sample notes
- Various accommodation types and budgets

## 🧪 Testing Your Setup

### 1. Run Integration Tests
```bash
node test-supabase-integration.js
```

### 2. Test Form Submission
1. Start your application: `npm run dev`
2. Go to the form: http://localhost:3000
3. Fill out and submit a test form
4. Check admin panel: http://localhost:3000/admin
5. Verify data appears correctly

### 3. Test Additional Travelers
1. Submit form with additional travelers
2. Check that travelers appear in admin panel
3. Verify dietary restrictions display correctly

## 🚨 Troubleshooting

### Common Issues

**"Table doesn't exist"**
- Solution: Make sure you executed the SQL schema in Supabase
- Check: Verify you're in the correct Supabase project

**"Authentication failed"**
- Solution: Check your environment variables
- Verify: URLs and keys match your Supabase project

**"Permission denied"**
- Solution: RLS policies may be blocking access
- Check: Make sure you're using the anon key, not service role key

**"Connection refused"**
- Solution: Check if your Supabase project is paused
- Verify: Project status in Supabase dashboard

### Debug Steps

1. **Check Project Status**: Ensure project is active in Supabase dashboard
2. **Verify Credentials**: Double-check your URL and keys
3. **Test Connection**: Run `test-supabase-integration.js`
4. **Check Logs**: Look at Supabase dashboard logs for errors
5. **Restart Project**: Try pausing and unpausing your Supabase project

## 🔒 Production Deployment

### 1. Environment Variables
Set production environment variables on your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Database Security
- Enable RLS on all tables (already configured)
- Use service role key only for server-side operations
- Regular database backups (automatic with Supabase)

### 3. Performance
- Monitor query performance in Supabase dashboard
- Use connection pooling for high traffic
- Consider upgrading Supabase plan as needed

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for JavaScript errors
4. Review server logs for API errors

## ✅ Success Checklist

- [ ] Supabase project created and active
- [ ] Environment variables configured
- [ ] Database schema executed successfully
- [ ] Dependencies installed
- [ ] Integration tests passing
- [ ] Form submission working
- [ ] Admin panel displaying data
- [ ] Additional travelers functionality working
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified

Once all items are checked, your Morocco Tourism Form is ready for production use! 🎉