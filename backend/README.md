# CARDEX Tourism Database System

A comprehensive client management system for luxury Morocco tourism services, featuring a multi-step form interface and admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Install dependencies:**
   ```bash
   cd cardex-system
   pip install -r requirements.txt
   ```

2. **Run the system:**
   ```bash
   python run_system.py
   ```

   Or use the simple batch file:
   ```bash
   start.bat
   ```

3. **Access the system:**
   - **Client Form:** http://localhost:5000/
   - **Admin Dashboard:** http://localhost:5000/static/admin-dashboard.html

## 📋 Features

### Client Form
- **4-Step Process:**
  1. Personal Information
  2. Travel Preferences
  3. Accommodation Details
  4. Additional Requirements

- **File Upload Support:** PDF, DOCX, images
- **Real-time Validation**
- **Responsive Design**

### Admin Dashboard
- **Client Management:** View, search, filter, and update client records
- **Status Tracking:** New, In Progress, Completed, Cancelled
- **Assignment System:** Assign clients to managers
- **Data Export:** CSV export functionality
- **Real-time Statistics:** Live dashboard with key metrics
- **File Management:** Access uploaded documents

### Database
- **SQLite Database:** `cardex_clients.db`
- **Automatic Schema Creation**
- **Data Persistence**

## 🏗️ System Architecture

```
cardex-system/
├── cardex_database.py          # Flask backend & API
├── run_system.py              # Startup script with browser auto-open
├── start.bat                  # Simple Windows batch starter
├── requirements.txt           # Python dependencies
├── static/
│   ├── admin-dashboard.html   # Admin interface
│   └── cardex-form-integration.js  # Form integration
├── uploads/                   # File storage
└── cardex_clients.db         # SQLite database
```

## 🔧 API Endpoints

### Client Management
- `POST /api/submit` - Submit new client form
- `GET /api/clients` - Get paginated client list
- `PUT /api/clients/<id>` - Update client record
- `DELETE /api/clients/<id>` - Delete client record

### File Management
- `POST /api/upload` - Upload files
- `GET /api/files/<filename>` - Download files

### Analytics
- `GET /api/stats` - Get system statistics

## 👥 User Roles

### Client
- Submit tourism inquiry forms
- Upload supporting documents
- Receive confirmation

### Admin/Manager
- View all client submissions
- Update client status and assignments
- Export data for reporting
- Access uploaded files

## 📊 Data Fields

### Personal Information
- Full Name
- Email
- Phone
- Country
- Preferred Language

### Travel Details
- Travel Dates
- Group Size
- Budget Range
- Travel Purpose
- Special Interests

### Accommodation
- Hotel Category
- Room Type
- Meal Plan
- Location Preferences

### Additional Requirements
- Special Requests
- Medical Conditions
- Accessibility Needs
- File Attachments

## 🔒 Security Features

- Input validation and sanitization
- File type restrictions
- CORS enabled for cross-origin requests
- Secure file storage with unique naming

## 📈 Monitoring

The system provides real-time statistics:
- Total clients
- Status distribution
- Recent submissions
- Manager assignments

## 🛠️ Development

### Adding New Fields
1. Update database schema in `cardex_database.py`
2. Modify form HTML in client interface
3. Update admin dashboard display
4. Adjust API endpoints if needed

### Customizing Styling
- Client form: Modify `luxury-morocco-form/styles.css`
- Admin dashboard: Inline styles in `admin-dashboard.html`

## 📞 Support

For technical issues or feature requests, please check:
1. Flask server logs in terminal
2. Browser developer console for JavaScript errors
3. Database integrity: `cardex_clients.db`

## 📝 License

This project is developed for luxury Morocco tourism services.