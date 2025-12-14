import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(__dirname, '..', 'database', 'cardex.db');
    db = new Database(dbPath);
    initDatabase();
  }
  return db;
}

export function initDatabase() {
  if (!db) return;

  // Create clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      number_of_travelers INTEGER DEFAULT 1,
      group_type TEXT CHECK(group_type IN ('Individual', 'Family', 'Group')),
      arrival_date DATE,
      departure_date DATE,
      accommodation_type TEXT,
      budget_range TEXT,
      dietary_restrictions TEXT, -- JSON string
      accessibility_needs TEXT, -- JSON string
      preferred_language TEXT,
      custom_activities TEXT,
      food_preferences TEXT,
      additional_inquiries TEXT,
      attached_document TEXT, -- base64 encoded
      gdpr_consent BOOLEAN DEFAULT 0,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Confirmed', 'Cancelled')),
      priority TEXT DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High')),
      assigned_to TEXT,
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified_by TEXT,
      internal_notes TEXT
    )
  `);

  // Create additional_travelers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS additional_travelers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      traveler_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      age_group TEXT CHECK(age_group IN ('Child', 'Teen', 'Adult', 'Senior')),
      relationship TEXT,
      dietary_restrictions TEXT, -- JSON string
      special_notes TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
    )
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'User',
      can_modify BOOLEAN DEFAULT 0,
      can_delete BOOLEAN DEFAULT 0,
      email TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Create modification_log table
  db.exec(`
    CREATE TABLE IF NOT EXISTS modification_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      user_id INTEGER,
      action TEXT NOT NULL,
      old_values TEXT, -- JSON string
      new_values TEXT, -- JSON string
      modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Create client_notes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS client_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      user_id INTEGER,
      note TEXT NOT NULL,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
    CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
    CREATE INDEX IF NOT EXISTS idx_additional_travelers_client_id ON additional_travelers(client_id);
  `);

  // Insert default admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    db.prepare(`
      INSERT INTO users (username, full_name, role, can_modify, can_delete, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('admin', 'System Administrator', 'Admin', 1, 1, 'admin@cardex.com');
  }
}