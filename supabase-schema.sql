-- =====================================================
-- MOROCCO TOURISM FORM - SUPABASE DATABASE SCHEMA
-- =====================================================

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token';

-- Create custom types
CREATE TYPE user_role AS ENUM ('Admin', 'User', 'Manager');
CREATE TYPE client_status AS ENUM ('Pending', 'Confirmed', 'Cancelled', 'In Progress', 'Completed');

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- Users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'User',
    can_modify BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Main clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    age INTEGER,
    number_of_travelers INTEGER DEFAULT 1,
    group_type VARCHAR(100),
    occasion_description TEXT,
    arrival_date DATE,
    departure_date DATE,
    flight_number VARCHAR(50),
    arrival_time TIME,
    city_of_arrival VARCHAR(10), -- Airport codes: CMN, RAK, TNG, etc.
    dietary_restrictions JSONB DEFAULT '[]'::jsonb,
    accessibility_needs JSONB DEFAULT '[]'::jsonb,
    preferred_language VARCHAR(50),
    custom_activities TEXT,
    food_preferences TEXT,
    additional_inquiries TEXT,
    gdpr_consent BOOLEAN DEFAULT false,
    status client_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional travelers table
CREATE TABLE additional_travelers (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    traveler_number INTEGER NOT NULL, -- 2, 3, 4, etc.
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    relationship VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    dietary_restrictions JSONB DEFAULT '[]'::jsonb,
    accessibility_needs JSONB DEFAULT '[]'::jsonb,
    special_notes TEXT,
    has_different_travel BOOLEAN DEFAULT false,
    arrival_date DATE,
    departure_date DATE,
    flight_number VARCHAR(50),
    arrival_time TIME,
    city_of_arrival VARCHAR(10), -- Airport codes: CMN, RAK, TNG, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client notes for admin comments
CREATE TABLE client_notes (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    note TEXT NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modification log for audit trail
CREATE TABLE modification_log (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Client indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_arrival_date ON clients(arrival_date);
CREATE INDEX idx_clients_group_type ON clients(group_type);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- Additional travelers indexes
CREATE INDEX idx_additional_travelers_client_id ON additional_travelers(client_id);
CREATE INDEX idx_additional_travelers_number ON additional_travelers(client_id, traveler_number);

-- Notes and logs indexes
CREATE INDEX idx_client_notes_client_id ON client_notes(client_id, created_date DESC);
CREATE INDEX idx_modification_log_client_id ON modification_log(client_id, modified_date DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data (for multi-tenant setups)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Clients are publicly readable (for the form submissions)
CREATE POLICY "Anyone can view clients" ON clients
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert clients" ON clients
    FOR INSERT WITH CHECK (true);

-- Additional travelers follow client permissions
CREATE POLICY "Anyone can view additional travelers" ON additional_travelers
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert additional travelers" ON additional_travelers
    FOR INSERT WITH CHECK (true);

-- Notes and logs are admin-only
CREATE POLICY "Authenticated users can view notes" ON client_notes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert notes" ON client_notes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view logs" ON modification_log
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for clients table
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log modifications
CREATE OR REPLACE FUNCTION log_client_modifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Log changes to key fields
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO modification_log (client_id, field_name, old_value, new_value)
            VALUES (NEW.id, 'status', OLD.status::text, NEW.status::text);
        END IF;
        
        IF OLD.full_name IS DISTINCT FROM NEW.full_name THEN
            INSERT INTO modification_log (client_id, field_name, old_value, new_value)
            VALUES (NEW.id, 'full_name', OLD.full_name::text, NEW.full_name::text);
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for modification logging
CREATE TRIGGER log_client_changes
    AFTER UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION log_client_modifications();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, full_name, password_hash, role, can_modify, can_delete) VALUES 
('admin', 'admin@experiencemorocco.com', 'System Administrator', '$2b$10$rOz8vKjKwHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHhHh', 'Admin', true, true);

-- Sample clients
INSERT INTO clients (
    full_name, email, phone, age, number_of_travelers, group_type, 
    arrival_date, departure_date, flight_number, arrival_time, city_of_arrival,
    dietary_restrictions, accessibility_needs, preferred_language, 
    custom_activities, food_preferences, additional_inquiries, gdpr_consent, status
) VALUES 
(
    'Aymen Nassih', 'aymennassih70@gmail.com', '4805756652', 24, 2, 'Family',
    '2025-12-21', '2025-12-25', 'AT205', '21:28', 'RAK',
    '["Vegan"]'::jsonb, '["Visual assistance"]'::jsonb, 'English',
    'Atlas Mountains hiking', 'Traditional Moroccan tagine', 'Looking forward to cultural experiences', true, 'Pending'
),
(
    'Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0123', 32, 4, 'Family',
    '2025-12-25', '2025-12-30', 'BA1234', '14:30', 'CMN',
    '["Vegetarian", "Gluten-free"]'::jsonb, '[]'::jsonb, 'English',
    'Sahara desert tour', 'Moroccan vegetarian cuisine', 'Honeymoon trip with children', true, 'Confirmed'
),
(
    'Jean Dubois', 'jean.dubois@email.fr', '+33-6-12-34-56-78', 45, 2, 'Couple',
    '2025-12-28', '2026-01-05', 'AF2345', '16:45', 'CMN',
    '[]'::jsonb, '[]'::jsonb, 'French',
    'Cooking classes in Marrakech', 'French-Moroccan fusion', 'Anniversary celebration', true, 'Pending'
);

-- Sample additional travelers
INSERT INTO additional_travelers (client_id, traveler_number, name, age, relationship, email, phone, dietary_restrictions, accessibility_needs, special_notes) VALUES
(2, 2, 'Mike Johnson', 8, 'Child', NULL, NULL, '[]'::jsonb, '[]'::jsonb, 'Child menu required, booster seat'),
(2, 3, 'Emma Johnson', 6, 'Child', NULL, NULL, '[]'::jsonb, '[]'::jsonb, 'No spicy food'),
(2, 4, 'Baby Johnson', 2, 'Child', NULL, NULL, '[]'::jsonb, '[]'::jsonb, 'Baby food and high chair needed'),
(3, 2, 'Marie Dubois', 43, 'Spouse', 'marie.dubois@email.fr', '+33-6-98-76-54-32', '[]'::jsonb, '[]'::jsonb, 'Prefers window seat');

-- Sample notes
INSERT INTO client_notes (client_id, user_id, note) VALUES 
(1, 1, 'Client interested in Atlas Mountains trekking. Follow up needed.'),
(2, 1, 'Family with dietary restrictions - ensure restaurant reservations accommodate needs.'),
(3, 1, 'French couple - assign French-speaking guide for activities.');

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Client summary view
CREATE VIEW client_summary AS
SELECT 
    c.id,
    c.full_name,
    c.email,
    c.phone,
    c.number_of_travelers,
    c.group_type,
    c.arrival_date,
    c.departure_date,
    c.status,
    c.created_at,
    COUNT(at.id) as additional_travelers_count,
    array_agg(at.name) FILTER (WHERE at.name IS NOT NULL) as additional_traveler_names
FROM clients c
LEFT JOIN additional_travelers at ON c.id = at.client_id
GROUP BY c.id, c.full_name, c.email, c.phone, c.number_of_travelers, 
         c.group_type, c.arrival_date, c.departure_date, c.status, c.created_at
ORDER BY c.created_at DESC;

-- Statistics view
CREATE VIEW client_statistics AS
SELECT 
    COUNT(*) as total_clients,
    COUNT(*) FILTER (WHERE status = 'Pending') as pending_clients,
    COUNT(*) FILTER (WHERE status = 'Confirmed') as confirmed_clients,
    COUNT(*) FILTER (WHERE status = 'Cancelled') as cancelled_clients,
    SUM(number_of_travelers) as total_travelers,
    AVG(number_of_travelers) as avg_travelers_per_group,
    COUNT(*) FILTER (WHERE arrival_date >= CURRENT_DATE AND arrival_date <= CURRENT_DATE + INTERVAL '30 days') as upcoming_arrivals
FROM clients;

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Query to get all client details with additional travelers
/*
SELECT 
    c.*,
    json_agg(
        json_build_object(
            'name', at.name,
            'age', at.age,
            'relationship', at.relationship,
            'email', at.email,
            'phone', at.phone,
            'dietary_restrictions', at.dietary_restrictions,
            'special_notes', at.special_notes
        ) ORDER BY at.traveler_number
    ) FILTER (WHERE at.id IS NOT NULL) as additional_travelers
FROM clients c
LEFT JOIN additional_travelers at ON c.id = at.client_id
GROUP BY c.id
ORDER BY c.created_at DESC;
*/

-- Query to get clients by status with travel dates
/*
SELECT 
    full_name,
    email,
    status,
    arrival_date,
    departure_date,
    number_of_travelers
FROM clients
WHERE status = 'Pending'
  AND arrival_date >= CURRENT_DATE
ORDER BY arrival_date;
*/

-- =====================================================
-- MAINTENANCE AND CLEANUP
-- =====================================================

-- Function to clean old logs (keep last 1000 entries per client)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM modification_log 
    WHERE id NOT IN (
        SELECT id FROM modification_log 
        ORDER BY modified_date DESC 
        LIMIT 1000
    );
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;