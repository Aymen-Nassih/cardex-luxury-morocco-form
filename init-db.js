import { getDatabase } from './lib/database.js';

console.log('Initializing CARDEX database...');
const db = getDatabase();
console.log('Database initialized successfully!');

// Test query
const admin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
console.log('Default admin user:', admin);

db.close();
console.log('Database connection closed.');