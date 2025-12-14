# CARDEX Luxury Morocco Travel Form (Next.js)

A modern, full-stack web application for CARDEX's luxury tourism and B2B travel clients visiting Morocco. This Next.js application provides a sophisticated form system for gathering pre-arrival needs and inquiries, with integrated admin dashboard and Salesforce connectivity.

## 🚀 Features

- **Multi-step Client Form**: Professional form with validation for individuals, groups, and families
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
- **Styling**: Tailwind CSS with custom CARDEX theme
- **TypeScript**: Full type safety
- **Deployment**: Ready for Vercel/Netlify

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cardex-nextjs.git
   cd cardex-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize database**
   ```bash
   node init-db.js
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Client Form: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## 📁 Project Structure

```
cardex-nextjs/
├── app/                          # Next.js App Router
│   ├── page.js                   # Home page with form
│   ├── admin/                    # Admin dashboard
│   │   └── page.js
│   ├── api/                      # API routes
│   │   ├── submit-form/
│   │   ├── clients/
│   │   └── stats/
│   └── components/               # React components
├── lib/
│   └── database.js               # Database helper
├── database/
│   └── cardex.db                 # SQLite database
├── public/                       # Static assets
└── styles/                       # Global styles
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
- Primary: Burgundy (#800020)
- Secondary: Cream (#FFFDD0)
- Accent: Gold (#FFD700)

**Typography:**
- Headers: Amiri (Arabic-inspired)
- Body: Noto Sans Arabic

## 🔒 Security Features

- Input sanitization and validation
- GDPR compliance with consent tracking
- SQL injection prevention
- XSS protection
- Data minimization principles

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
