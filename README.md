# CARDEX Luxury Morocco Travel Form (Next.js)

A modern, full-stack web application for CARDEX's luxury tourism and B2B travel clients visiting Morocco. This Next.js application provides a sophisticated form system for gathering pre-arrival needs and inquiries, with integrated admin dashboard and Supabase authentication.

## 🚀 Features

- **Multi-step Client Form**: Professional form with validation for individuals, groups, and families
- **Supabase Authentication**: Secure admin login with role-based access control
- **Admin Dashboard**: Comprehensive client management with search, filtering, and status tracking
- **Database Integration**: SQLite with proper relationships and audit trails
- **Responsive Design**: Mobile-first approach with CARDEX branding
- **API-First Architecture**: RESTful endpoints for all operations
- **Security**: Input validation, GDPR compliance, and data protection
- **Real-time Updates**: Live form validation and dynamic traveler management

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom CARDEX theme
- **Deployment**: Ready for Vercel/Netlify

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for authentication)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aymen-Nassih/cardex-luxury-morocco-form.git
   cd cardex-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://cpdyuabpnaeljcxlnelm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize database**
   ```bash
   node init-db.js
   ```

5. **Set up Supabase authentication**
   - Create admin user in Supabase Authentication
   - Add user to admin_users table
   - Run the SQL setup script in Supabase

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Client Form: http://localhost:3000
   - Admin Login: http://localhost:3000/login
   - Admin Dashboard: http://localhost:3000/admin

## 🔐 Authentication Setup

### 1. Supabase Configuration
- Create project at https://supabase.com
- Get your URL and anon key from Settings → API

### 2. Database Setup
Run this SQL in Supabase SQL Editor:
```sql
-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  can_modify BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read admin_users"
ON admin_users FOR SELECT TO authenticated USING (true);

-- Insert admin user
INSERT INTO admin_users (email, full_name, role, can_modify, can_delete)
VALUES ('your-email@example.com', 'Admin Name', 'admin', true, true);
```

### 3. Create Auth User
- Go to Authentication → Users → Add User
- Email: your-email@example.com
- Password: your-password
- ✅ Check "Auto Confirm User"

## � Project Structure

```
cardex-nextjs/
├── app/                          # Next.js App Router
│   ├── page.js                   # Home page with form
│   ├── login/                    # Authentication
│   ├── admin/                    # Admin dashboard
│   │   ├── page.js
│   │   └── users/                # User management
│   ├── api/                      # API routes
│   │   ├── submit-form/
│   │   ├── clients/
│   │   ├── stats/
│   │   └── users/
│   └── components/               # React components
├── lib/
│   ├── database.js               # SQLite connection
│   └── supabase.js               # Supabase client
├── database/
│   └── cardex.db                 # SQLite database
├── middleware.js                 # Route protection
├── .env.local                    # Environment vars
└── tailwind.config.js           # Styling config
```

## 🔧 API Endpoints

### Form Operations
- `POST /api/submit-form` - Submit client form
- `GET /api/clients` - Get all clients (admin)
- `GET /api/clients/[id]` - Get single client
- `PUT /api/clients/[id]` - Update client

### Admin Operations
- `GET /api/stats` - Dashboard statistics
- `POST /api/clients/[id]/note` - Add client note
- `GET /api/users` - User management

## 🎨 Branding

**CARDEX Color Palette:**
- Primary: Morocco Blue (#2563eb)
- Secondary: Morocco Sand (#f4f1e8)
- Accent: Morocco Orange (#ea580c)
- Teal: Morocco Teal (#14b8a6)

**Typography:**
- Headers: Modern sans-serif stack
- Body: Clean, readable fonts

## 🔒 Security Features

- Supabase authentication with JWT
- Row Level Security (RLS) policies
- Input sanitization and validation
- GDPR compliance with consent tracking
- SQL injection prevention
- XSS protection
- Secure API endpoints

## 📱 Mobile Responsiveness

- Breakpoints: 480px, 768px, 1024px
- Touch-friendly interfaces
- Optimized form layouts
- Progressive enhancement

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Manual Build
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to CARDEX. All rights reserved.

## 📞 Support

For support or questions, contact the CARDEX development team.

---

**Built with ❤️ for CARDEX Luxury Travel**
