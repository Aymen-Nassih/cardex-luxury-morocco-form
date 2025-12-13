# CARDEX Luxury Morocco Travel Pre-Arrival Form

A sophisticated web application for collecting pre-arrival information from luxury tourism and B2B travel clients visiting Morocco. This system features a branded, mobile-responsive form with Salesforce integration capabilities and a secure backend for data management.

## 🌟 Features

- **Luxury User Experience**: Elegant, mobile-responsive design with CARDEX branding
- **Multi-Step Form**: Intuitive 4-step wizard for seamless data collection
- **Salesforce Integration**: Ready for auto-filling client data from Salesforce CRM
- **Group Support**: Accommodates individuals, families, and groups with dynamic form fields
- **Admin Dashboard**: Secure employee access for managing submissions
- **File Uploads**: Support for document attachments (passports, etc.)
- **GDPR Compliant**: Built-in consent management and data protection
- **Real-time Validation**: Client-side and server-side form validation

## 🏗️ Architecture

```
cardex-luxury-morocco-form/
├── frontend/                 # Static HTML/CSS/JS form
│   ├── index.html           # Main form page
│   ├── styles.css           # CARDEX branded styling
│   ├── script.js            # Form logic and validation
│   ├── cardex-form-integration.js  # API integration
│   └── logo.png             # CARDEX brand assets
├── backend/                 # Flask application
│   ├── cardex_database.py   # Database models and API
│   ├── run_system.py        # Startup script
│   ├── requirements.txt     # Python dependencies
│   ├── static/              # Admin dashboard
│   └── uploads/             # File storage
└── docs/
    └── luxury_morocco_form_design_spec.md  # Design specification
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cardex-luxury-morocco-form.git
   cd cardex-luxury-morocco-form
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the application**
   ```bash
   python run_system.py
   ```

4. **Access the application**
   - Client Form: http://localhost:5000/
   - Admin Dashboard: http://localhost:5000/static/admin-dashboard.html

## 🎨 Design & Branding

- **Colors**: Burgundy (#800020), Cream (#FFFDD0), Gold (#FFD700)
- **Typography**: Amiri & Noto Sans Arabic fonts
- **Logo**: Custom riad facade SVG design
- **Responsive**: Optimized for desktop, tablet, and mobile

## 🔧 Configuration

### Salesforce Integration
The system includes placeholders for Salesforce REST API integration:
- Auto-fill client data from Lead/Contact objects
- OAuth 2.0 authentication ready
- Configurable field mappings

### Security Features
- HTTPS enforcement
- Data minimization
- GDPR consent tracking
- Secure file uploads (5MB limit)
- Input sanitization

## 📊 Admin Dashboard

Access the admin dashboard at `/static/admin-dashboard.html` to:
- View all form submissions
- Search and filter clients
- Update submission status
- Export data to CSV
- Monitor real-time statistics

## 🛠️ Development

### Project Structure Details

**Frontend (`frontend/`)**
- Pure HTML5/CSS3/JavaScript implementation
- No build process required
- WCAG 2.1 AA accessibility compliant

**Backend (`backend/`)**
- Flask web framework
- SQLite database (easily replaceable with PostgreSQL/MySQL)
- RESTful API design
- CORS enabled for cross-origin requests

### Key Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python Flask, SQLite
- **Styling**: Custom CSS with Google Fonts
- **Icons**: Inline SVG for crisp rendering

## 📝 API Documentation

### Form Submission
```http
POST /api/submit-form
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "group_type": "Family",
  "dietary_restrictions": ["vegetarian"],
  "gdpr_consent": true
}
```

### Response
```json
{
  "success": true,
  "client_id": "CARD-2025-001",
  "message": "Form submitted successfully"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by CARDEX Travel & Tourism. All rights reserved.

## 📞 Support

For support or questions:
- Email: support@cardex.ma
- Documentation: See `docs/` directory

## 🎯 Target Audience

- High-end travelers seeking luxury Morocco experiences
- B2B corporate travel clients
- Travel agencies and tour operators
- Families, couples, and individual travelers

---

**Built with ❤️ for exceptional travel experiences in Morocco**