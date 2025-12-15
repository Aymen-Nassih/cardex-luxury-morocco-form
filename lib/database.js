// Simple in-memory database for Next.js compatibility
// This replaces SQLite with a basic JSON-based storage that persists to disk

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'database', 'cardex-data.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data structure
let data = {
  clients: [],
  additional_travelers: [],
  users: [
    {
      id: 1,
      username: 'admin',
      full_name: 'System Administrator',
      role: 'Admin',
      can_modify: true,
      can_delete: true,
      email: 'a.nassih@experiencemorocco.com',
      created_date: new Date().toISOString(),
      last_login: null
    }
  ],
  modification_log: [],
  client_notes: []
};

// Load data from file
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Initialize with default data
function initDatabase() {
  loadData();

  // Add default admin user if not exists
  const adminExists = data.users.find(u => u.email === 'a.nassih@experiencemorocco.com');
  if (!adminExists) {
    data.users.push({
      id: 1,
      username: 'admin',
      full_name: 'Admin Nassih',
      role: 'Admin',
      can_modify: true,
      can_delete: true,
      email: 'a.nassih@experiencemorocco.com',
      created_date: new Date().toISOString(),
      last_login: null
    });
    saveData();
  }
}

// Get next ID for a collection
function getNextId(collection) {
  const items = data[collection];
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id || 0)) + 1;
}

export function getDatabase() {
  initDatabase();
  return {
    prepare: (query) => ({
      get: (...params) => {
        if (query.includes('SELECT COUNT(*) as count FROM clients')) {
          return { count: data.clients.length };
        }
        if (query.includes('SELECT COUNT(*) as total FROM clients')) {
          return { total: data.clients.length };
        }
        if (query.includes('SELECT * FROM clients WHERE id = ?')) {
          return data.clients.find(c => c.id === params[0]);
        }
        if (query.includes('SELECT * FROM clients')) {
          return data.clients;
        }
        if (query.includes('SELECT COUNT(*) as count FROM additional_travelers')) {
          return { count: data.additional_travelers.length };
        }
        if (query.includes('SELECT * FROM additional_travelers WHERE client_id = ?')) {
          return data.additional_travelers.filter(t => t.client_id === params[0]);
        }
        if (query.includes('SELECT * FROM client_notes WHERE client_id = ?')) {
          return data.client_notes.filter(n => n.client_id === params[0]);
        }
        if (query.includes('SELECT * FROM modification_log WHERE client_id = ?')) {
          return data.modification_log.filter(m => m.client_id === params[0]);
        }
        if (query.includes('SELECT id FROM users WHERE email = ?')) {
          const user = data.users.find(u => u.email === params[0]);
          return user ? { id: user.id } : undefined;
        }
        if (query.includes('SELECT id FROM users WHERE username = ?')) {
          const user = data.users.find(u => u.username === params[0]);
          return user ? user : undefined;
        }
        return null;
      },
      all: (...params) => {
        if (query.includes('ORDER BY created_at DESC')) {
          return [...data.clients].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
        if (query.includes('SELECT * FROM users')) {
          return data.users;
        }
        // Status breakdown for stats
        if (query.includes('GROUP BY status')) {
          const statusCounts = {};
          data.clients.forEach(client => {
            const status = client.status || 'Pending';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });
          return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
        }
        return [];
      },
      run: (...params) => {
        if (query.includes('INSERT INTO clients')) {
          const newClient = {
            id: getNextId('clients'),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: params[0],
            email: params[1],
            phone: params[2],
            number_of_travelers: params[3],
            group_type: params[4],
            arrival_date: params[5],
            departure_date: params[6],
            dietary_restrictions: params[7],
            accessibility_needs: params[8],
            preferred_language: params[9],
            custom_activities: params[10],
            food_preferences: params[11],
            additional_inquiries: params[12],
            gdpr_consent: params[13],
            status: params[14] || 'Pending'
          };
          data.clients.push(newClient);
          saveData();
          return { lastInsertRowid: newClient.id };
        }
        if (query.includes('INSERT INTO additional_travelers')) {
          const newTraveler = {
            id: getNextId('additional_travelers'),
            client_id: params[0],
            traveler_number: params[1],
            name: params[2],
            email: params[3],
            phone: params[4],
            age_group: params[5],
            relationship: params[6],
            dietary_restrictions: params[7],
            special_notes: params[8],
            created_date: new Date().toISOString()
          };
          data.additional_travelers.push(newTraveler);
          saveData();
          return { lastInsertRowid: newTraveler.id };
        }
        if (query.includes('INSERT INTO client_notes')) {
          const newNote = {
            id: getNextId('client_notes'),
            client_id: params[0],
            user_id: params[1],
            note: params[2],
            created_date: new Date().toISOString()
          };
          data.client_notes.push(newNote);
          saveData();
          return { lastInsertRowid: newNote.id };
        }
        if (query.includes('INSERT INTO modification_log')) {
          const newLog = {
            id: getNextId('modification_log'),
            client_id: params[0],
            user_id: params[1],
            action: params[2],
            old_values: params[3],
            new_values: params[4],
            modified_date: new Date().toISOString()
          };
          data.modification_log.push(newLog);
          saveData();
          return { lastInsertRowid: newLog.id };
        }
        if (query.includes('UPDATE clients')) {
          const clientId = params[params.length - 1]; // Last parameter is usually the ID
          const clientIndex = data.clients.findIndex(c => c.id === clientId);
          if (clientIndex !== -1) {
            // Simple update - assume status update for now
            data.clients[clientIndex].status = params[0];
            data.clients[clientIndex].updated_at = new Date().toISOString();
            saveData();
          }
        }
        if (query.includes('DELETE FROM users')) {
          data.users = data.users.filter(u => u.id !== params[0]);
          saveData();
        }
        if (query.includes('INSERT INTO users')) {
          const newUser = {
            id: getNextId('users'),
            username: params[0],
            full_name: params[1],
            role: params[2],
            can_modify: params[3],
            can_delete: params[4],
            email: params[5],
            created_date: new Date().toISOString(),
            last_login: null
          };
          data.users.push(newUser);
          saveData();
          return { lastInsertRowid: newUser.id };
        }
        return {};
      }
    })
  };
}

export function initializeDatabase() {
  initDatabase();
}