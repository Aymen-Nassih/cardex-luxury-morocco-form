import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'cardex.db');

let db = null;

export function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH);

    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');

    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        can_modify BOOLEAN DEFAULT 0,
        can_delete BOOLEAN DEFAULT 0,
        email TEXT UNIQUE NOT NULL,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      );

      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        number_of_travelers INTEGER DEFAULT 1,
        group_type TEXT,
        arrival_date DATE,
        departure_date DATE,
        dietary_restrictions TEXT DEFAULT '[]',
        accessibility_needs TEXT DEFAULT '[]',
        preferred_language TEXT,
        custom_activities TEXT,
        food_preferences TEXT,
        additional_inquiries TEXT,
        gdpr_consent BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS additional_travelers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        traveler_number INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        age_group TEXT,
        relationship TEXT,
        dietary_restrictions TEXT DEFAULT '[]',
        special_notes TEXT,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS client_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        note TEXT NOT NULL,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS modification_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        old_values TEXT,
        new_values TEXT,
        modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Insert default admin user if not exists
    try {
      const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('a.nassih@experiencemorocco.com');
      if (!adminExists) {
        db.prepare(`
          INSERT INTO users (username, full_name, role, can_modify, can_delete, email)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('admin', 'Admin Nassih', 'Admin', 1, 1, 'a.nassih@experiencemorocco.com');
      }
    } catch (error) {
      // Admin user might already exist, ignore error
      console.log('Admin user setup skipped:', error.message);
    }
  }

  return db;
}

export function initializeDatabase() {
  getDatabase();
}