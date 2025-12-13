from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import json
import os
import base64
import csv
from datetime import datetime, timedelta
from io import StringIO, BytesIO

app = Flask(__name__)
CORS(app)

DATABASE = 'cardex_clients.db'
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        # Create clients table
        conn.execute('''CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            -- Basic Information
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            number_of_travelers INTEGER DEFAULT 1,
            group_type TEXT,
            arrival_date TEXT,
            departure_date TEXT,

            -- Accommodation & Budget
            accommodation_type TEXT,
            budget_range TEXT,

            -- Preferences
            dietary_restrictions TEXT,
            accessibility_needs TEXT,
            preferred_language TEXT,

            -- Special Requests
            custom_activities TEXT,
            food_preferences TEXT,
            additional_inquiries TEXT,
            attached_document TEXT,
            gdpr_consent BOOLEAN DEFAULT 0,

            -- Administrative
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'normal',
            assigned_to TEXT,
            last_modified TIMESTAMP,
            modified_by TEXT,
            internal_notes TEXT,

            UNIQUE(email, submission_date)
        )''')

        # Create users table
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            full_name TEXT,
            role TEXT NOT NULL,
            can_modify BOOLEAN DEFAULT 0,
            can_delete BOOLEAN DEFAULT 0,
            email TEXT,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )''')

        # Create modification log table
        conn.execute('''CREATE TABLE IF NOT EXISTS modification_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            modified_by TEXT,
            modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            action TEXT,
            field_changed TEXT,
            old_value TEXT,
            new_value TEXT,
            FOREIGN KEY (client_id) REFERENCES clients (id)
        )''')

        # Create client notes table
        conn.execute('''CREATE TABLE IF NOT EXISTS client_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            user TEXT NOT NULL,
            note TEXT NOT NULL,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients (id)
        )''')

        # Create additional travelers table
        conn.execute('''CREATE TABLE IF NOT EXISTS additional_travelers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            traveler_number INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            age_group TEXT,
            relationship TEXT,
            dietary_restrictions TEXT,
            special_notes TEXT,
            FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
        )''')

        # Create default admin users if not exists
        admin_users = [
            ('admin', 'Administrator', 'Admin', 1, 1, 'admin@cardex.ma'),
            ('manager', 'Operations Manager', 'Admin', 1, 0, 'manager@cardex.ma')
        ]

        for username, full_name, role, can_modify, can_delete, email in admin_users:
            user_exists = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
            if not user_exists:
                conn.execute('''INSERT INTO users (username, full_name, role, can_modify, can_delete, email)
                              VALUES (?, ?, ?, ?, ?, ?)''',
                            (username, full_name, role, can_modify, can_delete, email))

        # Insert sample data for testing
        sample_clients = [
            ('John Smith', 'john@example.com', '+1234567890', 2, 'Family', '2025-01-15', '2025-01-20',
             'Luxury Riad', 'High', '["vegetarian"]', '["wheelchair_access"]', 'English',
             'Private cooking class', 'Moroccan cuisine', 'Need airport transfer', '', 1,
             'confirmed', 'normal', 'admin', None, 'admin', 'VIP client'),

            ('Sarah Johnson', 'sarah@example.com', '+1987654321', 1, 'Individual', '2025-02-10', '2025-02-15',
             'Boutique Hotel', 'Medium', '["vegan", "gluten_free"]', '[]', 'French',
             'Desert safari', 'Vegetarian options', 'Allergic to nuts', '', 1,
             'pending', 'normal', None, None, None, None),

            ('Ahmed Hassan', 'ahmed@example.com', '+212600000000', 4, 'Group', '2025-03-05', '2025-03-12',
             'Private Villa', 'High', '["halal"]', '[]', 'Arabic',
             'Cultural tours', 'Halal food', 'Business meeting requirements', '', 1,
             'confirmed', 'high', 'admin', None, 'admin', 'Corporate group'),

            ('Maria Garcia', 'maria@example.com', '+34987654321', 3, 'Family', '2025-01-25', '2025-02-02',
             'Luxury Riad', 'High', '[]', '["mobility_assistance"]', 'Spanish',
             'Spa treatments', 'Mediterranean diet', 'Children activities needed', '', 1,
             'pending', 'normal', None, None, None, None),

            ('David Wilson', 'david@example.com', '+447000000000', 1, 'Individual', '2025-04-01', '2025-04-08',
             'Boutique Hotel', 'Medium', '["vegetarian"]', '[]', 'English',
             'Photography tour', 'Local specialties', 'Professional photographer', '', 1,
             'completed', 'normal', 'admin', None, 'admin', 'Repeat customer'),

            ('Fatima Alaoui', 'fatima@example.com', '+212661111111', 2, 'Family', '2025-02-20', '2025-02-25',
             'Private Villa', 'High', '["halal"]', '[]', 'Arabic',
             'Family activities', 'Traditional Moroccan', 'Family celebration', '', 1,
             'confirmed', 'high', 'admin', None, 'admin', 'Local VIP'),

            ('Michael Brown', 'michael@example.com', '+1555123456', 6, 'Group', '2025-05-10', '2025-05-18',
             'Luxury Riad', 'High', '["vegetarian", "vegan"]', '[]', 'English',
             'Team building', 'International cuisine', 'Conference facilities', '', 1,
             'pending', 'high', None, None, None, None),

            ('Emma Davis', 'emma@example.com', '+61400000000', 1, 'Individual', '2025-03-15', '2025-03-22',
             'Boutique Hotel', 'Medium', '["gluten_free"]', '[]', 'English',
             'Wellness retreat', 'Healthy options', 'Yoga instructor needed', '', 1,
             'confirmed', 'normal', 'admin', None, 'admin', 'Wellness focus'),

            ('Carlos Rodriguez', 'carlos@example.com', '+5255123456', 2, 'Family', '2025-06-01', '2025-06-10',
             'Private Villa', 'High', '[]', '[]', 'Spanish',
             'Beach activities', 'Seafood', 'Summer vacation', '', 1,
             'pending', 'normal', None, None, None, None),

            ('Anna Schmidt', 'anna@example.com', '+49123456789', 1, 'Individual', '2025-07-05', '2025-07-12',
             'Luxury Riad', 'High', '["vegetarian"]', '[]', 'German',
             'Cultural immersion', 'Local cuisine', 'German speaking guide', '', 1,
             'cancelled', 'normal', 'admin', None, 'admin', 'Cancelled due to health')
        ]

        for client in sample_clients:
            try:
                conn.execute('''INSERT INTO clients (
                    full_name, email, phone, number_of_travelers, group_type, arrival_date, departure_date,
                    accommodation_type, budget_range, dietary_restrictions, accessibility_needs, preferred_language,
                    custom_activities, food_preferences, additional_inquiries, attached_document, gdpr_consent,
                    status, priority, assigned_to, last_modified, modified_by, internal_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', client)
            except sqlite3.IntegrityError:
                pass  # Skip if email/submission_date already exists

        conn.commit()

@app.route('/api/submit-form', methods=['POST'])
def submit_form():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['full_name', 'email', 'phone', 'gdpr_consent']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400

        if not data.get('gdpr_consent'):
            return jsonify({'success': False, 'message': 'GDPR consent is required'}), 400

        # Handle file upload if present
        attached_document = ''
        if data.get('attached_document'):
            try:
                # Decode base64 file
                file_data = base64.b64decode(data['attached_document']['data'])
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{data['attached_document']['name']}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)

                with open(filepath, 'wb') as f:
                    f.write(file_data)

                attached_document = filepath
            except Exception as e:
                print(f"File upload error: {e}")

        # Convert arrays to JSON
        dietary_restrictions = json.dumps(data.get('dietary_restrictions', []))
        accessibility_needs = json.dumps(data.get('accessibility_needs', []))

        with get_db() as conn:
            cursor = conn.execute('''INSERT INTO clients (
                full_name, email, phone, number_of_travelers, group_type, arrival_date, departure_date,
                accommodation_type, budget_range, dietary_restrictions, accessibility_needs, preferred_language,
                custom_activities, food_preferences, additional_inquiries, attached_document, gdpr_consent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
                data['full_name'], data['email'], data['phone'], data.get('number_of_travelers', 1),
                data.get('group_type'), data.get('arrival_date'), data.get('departure_date'),
                data.get('accommodation_type'), data.get('budget_range'), dietary_restrictions,
                accessibility_needs, data.get('preferred_language'), data.get('custom_activities'),
                data.get('food_preferences'), data.get('additional_inquiries'), attached_document,
                data['gdpr_consent']
            ))

            client_id = cursor.lastrowid

            # Handle additional travelers
            additional_travelers = data.get('additional_travelers', [])
            for traveler in additional_travelers:
                conn.execute('''
                    INSERT INTO additional_travelers (
                        client_id, traveler_number, name, email, phone,
                        age_group, relationship, dietary_restrictions, special_notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    client_id,
                    traveler.get('traveler_number'),
                    traveler.get('name'),
                    traveler.get('email'),
                    traveler.get('phone'),
                    traveler.get('age_group'),
                    traveler.get('relationship'),
                    json.dumps(traveler.get('dietary_restrictions', [])),
                    traveler.get('special_notes')
                ))

            # Log the submission
            conn.execute('''INSERT INTO modification_log (client_id, modified_by, action, field_changed)
                          VALUES (?, ?, ?, ?)''', (client_id, 'system', 'Created', 'New submission'))

            conn.commit()

        return jsonify({'success': True, 'message': 'Form submitted successfully', 'client_id': client_id})

    except Exception as e:
        print(f"Submit form error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        status_filter = request.args.get('status')
        search = request.args.get('search')
        group_type = request.args.get('group_type')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        print(f"DEBUG: page={page}, search='{search}', status='{status_filter}', group='{group_type}'")

        offset = (page - 1) * per_page

        query = 'SELECT * FROM clients WHERE 1=1'
        params = []

        if status_filter and status_filter != 'All' and status_filter.strip():
            query += ' AND status = ?'
            params.append(status_filter)

        if search:
            query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
            search_param = f'%{search}%'
            params.extend([search_param, search_param, search_param])

        if group_type and group_type != 'All' and group_type.strip():
            query += ' AND group_type = ?'
            params.append(group_type)

        if start_date:
            query += ' AND arrival_date >= ?'
            params.append(start_date)

        if end_date:
            query += ' AND arrival_date <= ?'
            params.append(end_date)

        query += ' ORDER BY submission_date DESC LIMIT ? OFFSET ?'
        params.extend([per_page, offset])

        print(f"DEBUG: main query: {query}")
        print(f"DEBUG: main params: {params}")

        with get_db() as conn:
            clients = conn.execute(query, params).fetchall()

            # Parse JSON fields
            clients_list = []
            for client in clients:
                client_dict = dict(client)
                try:
                    client_dict['dietary_restrictions'] = json.loads(client_dict['dietary_restrictions'] or '[]')
                    client_dict['accessibility_needs'] = json.loads(client_dict['accessibility_needs'] or '[]')
                except:
                    client_dict['dietary_restrictions'] = []
                    client_dict['accessibility_needs'] = []
                clients_list.append(client_dict)

            # Get total count - rebuild the query without LIMIT/OFFSET
            count_query = 'SELECT COUNT(*) FROM clients WHERE 1=1'
            count_params = []

            if status_filter and status_filter != 'All' and status_filter.strip():
                count_query += ' AND status = ?'
                count_params.append(status_filter)

            if search:
                count_query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
                count_params.extend([search_param, search_param, search_param])

            if group_type and group_type != 'All' and group_type.strip():
                count_query += ' AND group_type = ?'
                count_params.append(group_type)

            if start_date:
                count_query += ' AND arrival_date >= ?'
                count_params.append(start_date)

            if end_date:
                count_query += ' AND arrival_date <= ?'
                count_params.append(end_date)

            print(f"DEBUG: count query: {count_query}")
            print(f"DEBUG: count params: {count_params}")

            total = conn.execute(count_query, count_params).fetchone()[0]

        return jsonify({
            'success': True,
            'clients': clients_list,
            'total': total,
            'page': page,
            'total_pages': (total + per_page - 1) // per_page
        })

    except Exception as e:
        print(f"Get clients error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/client/<int:client_id>', methods=['GET'])
def get_client(client_id):
    try:
        with get_db() as conn:
            client = conn.execute('SELECT * FROM clients WHERE id = ?', (client_id,)).fetchone()
            if not client:
                return jsonify({'success': False, 'message': 'Client not found'}), 404

            client_dict = dict(client)
            try:
                client_dict['dietary_restrictions'] = json.loads(client_dict['dietary_restrictions'] or '[]')
                client_dict['accessibility_needs'] = json.loads(client_dict['accessibility_needs'] or '[]')
            except:
                client_dict['dietary_restrictions'] = []
                client_dict['accessibility_needs'] = []

            # Get notes
            notes = conn.execute('SELECT * FROM client_notes WHERE client_id = ? ORDER BY created_date DESC',
                               (client_id,)).fetchall()
            notes_list = [dict(note) for note in notes]

            # Get modification history (last 20)
            history = conn.execute('''SELECT * FROM modification_log WHERE client_id = ?
                                    ORDER BY modification_date DESC LIMIT 20''', (client_id,)).fetchall()
            history_list = [dict(h) for h in history]

        return jsonify({
            'success': True,
            'client': client_dict,
            'notes': notes_list,
            'history': history_list
        })

    except Exception as e:
        print(f"Get client error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/client/<int:client_id>/travelers', methods=['GET'])
def get_client_travelers(client_id):
    """Get additional travelers for a client"""
    try:
        with get_db() as conn:
            travelers = conn.execute('''
                SELECT * FROM additional_travelers
                WHERE client_id = ?
                ORDER BY traveler_number
            ''', (client_id,)).fetchall()

            travelers_list = [dict(traveler) for traveler in travelers]

            # Parse dietary restrictions JSON
            for traveler in travelers_list:
                try:
                    traveler['dietary_restrictions'] = json.loads(traveler['dietary_restrictions'] or '[]')
                except:
                    traveler['dietary_restrictions'] = []

        return jsonify({
            'success': True,
            'travelers': travelers_list
        }), 200

    except Exception as e:
        print(f"Get client travelers error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/client/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    try:
        data = request.get_json()
        modified_by = data.get('modified_by')

        if not modified_by:
            return jsonify({'success': False, 'message': 'modified_by is required'}), 400

        # Check user permissions
        with get_db() as conn:
            user = conn.execute('SELECT can_modify FROM users WHERE username = ?', (modified_by,)).fetchone()
            if not user or not user['can_modify']:
                return jsonify({'success': False, 'message': 'Insufficient permissions'}), 403

            # Get current client data for logging changes
            current_client = conn.execute('SELECT * FROM clients WHERE id = ?', (client_id,)).fetchone()
            if not current_client:
                return jsonify({'success': False, 'message': 'Client not found'}), 404

            # Update client
            update_fields = []
            params = []

            allowed_fields = [
                'full_name', 'email', 'phone', 'number_of_travelers', 'group_type', 'arrival_date', 'departure_date',
                'accommodation_type', 'budget_range', 'preferred_language', 'custom_activities',
                'food_preferences', 'additional_inquiries', 'status', 'priority', 'assigned_to', 'internal_notes'
            ]

            for field in allowed_fields:
                if field in data:
                    update_fields.append(f'{field} = ?')
                    params.append(data[field])

                    # Log field changes
                    current_value = current_client[field]
                    new_value = data[field]
                    if str(current_value) != str(new_value):
                        conn.execute('''INSERT INTO modification_log
                                      (client_id, modified_by, action, field_changed, old_value, new_value)
                                      VALUES (?, ?, ?, ?, ?, ?)''',
                                   (client_id, modified_by, 'Updated', field, str(current_value), str(new_value)))

            if update_fields:
                update_fields.append('last_modified = CURRENT_TIMESTAMP')
                update_fields.append('modified_by = ?')
                params.append(modified_by)

                query = f'UPDATE clients SET {", ".join(update_fields)} WHERE id = ?'
                params.append(client_id)

                conn.execute(query, params)
                conn.commit()

        return jsonify({'success': True, 'message': 'Client updated successfully'})

    except Exception as e:
        print(f"Update client error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/client/<int:client_id>/note', methods=['POST'])
def add_client_note(client_id):
    try:
        data = request.get_json()
        user = data.get('user')
        note = data.get('note')

        if not user or not note:
            return jsonify({'success': False, 'message': 'user and note are required'}), 400

        with get_db() as conn:
            conn.execute('INSERT INTO client_notes (client_id, user, note) VALUES (?, ?, ?)',
                        (client_id, user, note))
            conn.commit()

        return jsonify({'success': True, 'message': 'Note added successfully'})

    except Exception as e:
        print(f"Add note error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        with get_db() as conn:
            users = conn.execute('SELECT id, username, full_name, role, email, created_date, last_login FROM users').fetchall()
            users_list = [dict(user) for user in users]

        return jsonify({'success': True, 'users': users_list})

    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        required_fields = ['username', 'full_name', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400

        with get_db() as conn:
            conn.execute('''INSERT INTO users (username, full_name, role, can_modify, can_delete, email)
                          VALUES (?, ?, ?, ?, ?, ?)''', (
                data['username'], data['full_name'], data['role'],
                data.get('can_modify', 0), data.get('can_delete', 0), data.get('email')
            ))
            conn.commit()

        return jsonify({'success': True, 'message': 'User created successfully'})

    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    except Exception as e:
        print(f"Create user error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        with get_db() as conn:
            # Total clients
            total_clients = conn.execute('SELECT COUNT(*) FROM clients').fetchone()[0]

            # Status counts
            status_counts = conn.execute('''SELECT status, COUNT(*) as count
                                          FROM clients GROUP BY status''').fetchall()
            by_status = {row['status']: row['count'] for row in status_counts}

            # Group type counts
            group_counts = conn.execute('''SELECT group_type, COUNT(*) as count
                                         FROM clients WHERE group_type IS NOT NULL
                                         GROUP BY group_type''').fetchall()
            by_group_type = {row['group_type']: row['count'] for row in group_counts}

            # Monthly submissions (last 12 months)
            monthly_data = conn.execute('''SELECT strftime('%Y-%m', submission_date) as month,
                                                 COUNT(*) as count
                                          FROM clients
                                          WHERE submission_date >= date('now', '-12 months')
                                          GROUP BY month ORDER BY month''').fetchall()
            monthly_submissions = {row['month']: row['count'] for row in monthly_data}

            # Upcoming arrivals (next 30 days)
            upcoming_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
            upcoming_arrivals = conn.execute('''SELECT COUNT(*) FROM clients
                                              WHERE arrival_date BETWEEN date('now') AND ?''',
                                           (upcoming_date,)).fetchone()[0]

        return jsonify({
            'success': True,
            'stats': {
                'total_clients': total_clients,
                'by_status': by_status,
                'by_group_type': by_group_type,
                'monthly_submissions': monthly_submissions,
                'upcoming_arrivals': upcoming_arrivals
            }
        })

    except Exception as e:
        print(f"Get stats error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/export', methods=['GET'])
def export_csv():
    try:
        with get_db() as conn:
            clients = conn.execute('SELECT * FROM clients ORDER BY submission_date DESC').fetchall()

        # Create CSV
        output = StringIO()
        writer = csv.writer(output)

        # Write header
        writer.writerow([
            'ID', 'Submission Date', 'Full Name', 'Email', 'Phone', 'Travelers', 'Group Type',
            'Arrival Date', 'Departure Date', 'Accommodation Type', 'Budget Range',
            'Dietary Restrictions', 'Accessibility Needs', 'Preferred Language',
            'Custom Activities', 'Food Preferences', 'Additional Inquiries',
            'GDPR Consent', 'Status', 'Priority', 'Assigned To', 'Internal Notes'
        ])

        # Write data
        for client in clients:
            writer.writerow([
                client['id'], client['submission_date'], client['full_name'], client['email'],
                client['phone'], client['number_of_travelers'], client['group_type'],
                client['arrival_date'], client['departure_date'], client['accommodation_type'],
                client['budget_range'], client['dietary_restrictions'], client['accessibility_needs'],
                client['preferred_language'], client['custom_activities'], client['food_preferences'],
                client['additional_inquiries'], client['gdpr_consent'], client['status'],
                client['priority'], client['assigned_to'], client['internal_notes']
            ])

        output.seek(0)
        return send_file(
            BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='cardex_clients_export.csv'
        )

    except Exception as e:
        print(f"Export error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/')
def serve_form():
    # Read the form HTML file and serve it
    try:
        with open('../luxury-morocco-form/index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        return html_content
    except FileNotFoundError:
        return "Form file not found. Make sure the luxury-morocco-form directory is in the parent directory."

@app.route('/<path:filename>')
def serve_static(filename):
    # Serve static files from the luxury-morocco-form directory
    try:
        with open(f'../luxury-morocco-form/{filename}', 'r', encoding='utf-8') as f:
            content = f.read()
        # Set content type based on file extension
        if filename.endswith('.css'):
            response = app.response_class(content, mimetype='text/css')
        elif filename.endswith('.js'):
            response = app.response_class(content, mimetype='application/javascript')
        else:
            response = app.response_class(content, mimetype='text/html')
        return response
    except FileNotFoundError:
        return "File not found", 404

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)