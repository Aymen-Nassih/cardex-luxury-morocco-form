// Simple working database for Next.js with persistent storage
console.log('DATABASE.JS LOADED - PERSISTENT VERSION');

// Module-level singleton storage to maintain state across requests
const globalForDatabase = globalThis;

// Initialize persistent storage if not already done
if (!globalForDatabase.mockClients) {
  globalForDatabase.mockClients = [{
    id: 1,
    full_name: 'Aymen Nassih',
    email: 'aymennassih70@gmail.com',
    phone: '4805756652',
    age: 24,
    number_of_travelers: 2,
    group_type: 'Family',
    occasion_description: null,
    arrival_date: '2025-12-21',
    departure_date: '2025-12-25',
    flight_number: 'AT205',
    arrival_time: '21:28',
    city_of_arrival: 'RAK',
    dietary_restrictions: '["Vegan"]',
    accessibility_needs: '["Visual assistance"]',
    preferred_language: 'English',
    custom_activities: null,
    food_preferences: null,
    additional_inquiries: null,
    gdpr_consent: 1,
    status: 'Pending',
    created_at: new Date().toISOString()
  }];
}

if (!globalForDatabase.nextClientId) {
  // Calculate next available ID based on existing clients
  const maxId = globalForDatabase.mockClients ? Math.max(...globalForDatabase.mockClients.map(c => c.id)) : 0;
  globalForDatabase.nextClientId = maxId + 1;
  console.log('Calculated next client ID:', globalForDatabase.nextClientId, 'based on max ID:', maxId);
}

if (!globalForDatabase.mockAdditionalTravelers) {
  globalForDatabase.mockAdditionalTravelers = [];
}

if (!globalForDatabase.nextTravelerId) {
  globalForDatabase.nextTravelerId = 1;
}

// Reference to persistent storage
let mockClients = globalForDatabase.mockClients;
let nextClientId = globalForDatabase.nextClientId;
let mockAdditionalTravelers = globalForDatabase.mockAdditionalTravelers;
let nextTravelerId = globalForDatabase.nextTravelerId;

console.log('Persistent database initialized with', mockClients.length, 'clients');

export function getDatabase() {
  console.log('getDatabase called - current client count:', mockClients.length);
  return {
    prepare: (query) => ({
      get: (...params) => {
        console.log('GET query:', query, 'params:', params);
        console.log('Query type:', typeof query, 'Query length:', query.length);
        if (query.includes('SELECT COUNT(*) as count FROM clients')) {
          return { count: mockClients.length };
        }
        if (query.includes('SELECT COUNT(*) as total FROM clients')) {
          return { total: mockClients.length };
        }
        if (query.includes('total_travelers')) {
          const totalTravelers = mockClients.length + mockAdditionalTravelers.length;
          return { total_travelers: totalTravelers };
        }
        if (query.includes('SELECT * FROM clients WHERE id = ?')) {
          return mockClients.find(c => c.id === params[0]) || null;
        }
        if (query.includes('SELECT * FROM clients')) {
          console.log('Returning all clients, count:', mockClients.length);
          return mockClients;
        }
        if (query.includes('SELECT COUNT(*) as count FROM additional_travelers')) {
          return { count: mockAdditionalTravelers.length };
        }
        if (query.includes('SELECT * FROM additional_travelers WHERE client_id = ?')) {
          const clientId = params[0];
          console.log('Getting additional travelers for client ID:', clientId);
          const travelers = mockAdditionalTravelers.filter(t => t.client_id === clientId);
          console.log('Found travelers:', travelers.length);
          return travelers;
        }
        if (query.includes('SELECT * FROM client_notes WHERE client_id = ?')) {
          return [];
        }
        if (query.includes('SELECT * FROM modification_log WHERE client_id = ?')) {
          return [];
        }
        if (query.includes('SELECT id FROM users WHERE email = ?')) {
          return { id: 1 };
        }
        if (query.includes('SELECT id FROM users WHERE username = ?')) {
          return { id: 1, username: params[0], full_name: 'Test Admin', role: 'Admin', can_modify: true, can_delete: true, email: 'test@example.com' };
        }
        return null;
      },
      all: (...params) => {
        console.log('ALL query:', query, 'params:', params);
        if (query.includes('ORDER BY created_at DESC')) {
          console.log('Returning clients ordered by created_at, count:', mockClients.length);
          return mockClients;
        }
        if (query.includes('SELECT * FROM additional_travelers WHERE client_id = ?')) {
          const clientId = params[0];
          console.log('Getting additional travelers for client ID:', clientId);
          const travelers = mockAdditionalTravelers.filter(t => t.client_id == clientId);
          console.log('Found travelers (all method):', travelers.length);
          return travelers;
        }
        if (query.includes('SELECT * FROM users')) {
          return [{
            id: 1,
            username: 'admin',
            full_name: 'Test Admin',
            role: 'Admin',
            can_modify: true,
            can_delete: true,
            email: 'test@example.com',
            created_date: new Date().toISOString(),
            last_login: null
          }];
        }
        if (query.includes('GROUP BY status')) {
          const statusCounts = {};
          mockClients.forEach(client => {
            statusCounts[client.status] = (statusCounts[client.status] || 0) + 1;
          });
          return Object.keys(statusCounts).map(status => ({
            status,
            count: statusCounts[status]
          }));
        }
        return [];
      },
      run: (...params) => {
        console.log('RUN query:', query, 'params:', params);
        if (query.includes('INSERT INTO clients')) {
          console.log('INSERTING CLIENT:', params);
          try {
            const newClient = {
              id: nextClientId,
              full_name: params[0] || null,
              email: params[1] || null,
              phone: params[2] || null,
              age: params[3] || null,
              number_of_travelers: params[4] || 1,
              group_type: params[5] || null,
              occasion_description: params[6] || null,
              arrival_date: params[7] || null,
              departure_date: params[8] || null,
              flight_number: params[9] || null,
              arrival_time: params[10] || null,
              city_of_arrival: params[11] || null,
              dietary_restrictions: params[12] || '[]',
              accessibility_needs: params[13] || '[]',
              preferred_language: params[14] || null,
              custom_activities: params[15] || null,
              food_preferences: params[16] || null,
              additional_inquiries: params[17] || null,
              gdpr_consent: params[18] || 0,
              status: params[19] || 'Pending',
              created_at: new Date().toISOString()
            };
            
            // Add to persistent storage
            mockClients.push(newClient);
            globalForDatabase.mockClients = mockClients; // Ensure persistence
            
            console.log('Client added to mockClients. New count:', mockClients.length);
            console.log('Latest client:', newClient);
            console.log('All clients now:', mockClients.map(c => ({ id: c.id, full_name: c.full_name, email: c.email })));
            
            return { lastInsertRowid: nextClientId++ };
          } catch (error) {
            console.error('Error creating client:', error);
            return { lastInsertRowid: nextClientId++ };
          }
        }
        if (query.includes('INSERT INTO additional_travelers')) {
          console.log('INSERTING ADDITIONAL TRAVELER:', params);
          try {
            const newTraveler = {
              id: nextTravelerId,
              client_id: params[0],
              traveler_number: params[1],
              name: params[2] || null,
              age: params[3] || null,
              relationship: params[4] || null,
              email: params[5] || null,
              phone: params[6] || null,
              dietary_restrictions: params[7] || '[]',
              special_notes: params[8] || null,
              has_different_travel: params[9] || false,
              arrival_date: params[10] || null,
              departure_date: params[11] || null,
              flight_number: params[12] || null,
              arrival_time: params[13] || null,
              city_of_arrival: params[14] || null
            };
            
            mockAdditionalTravelers.push(newTraveler);
            globalForDatabase.mockAdditionalTravelers = mockAdditionalTravelers;
            
            console.log('Additional traveler added:', newTraveler);
            console.log('Total additional travelers:', mockAdditionalTravelers.length);
            
            return { lastInsertRowid: nextTravelerId++ };
          } catch (error) {
            console.error('Error creating additional traveler:', error);
            return { lastInsertRowid: nextTravelerId++ };
          }
        }
        if (query.includes('INSERT INTO client_notes')) {
          return { lastInsertRowid: 1 };
        }
        if (query.includes('INSERT INTO modification_log')) {
          return { lastInsertRowid: 1 };
        }
        if (query.includes('UPDATE clients')) {
          return {};
        }
        if (query.includes('DELETE FROM users')) {
          return {};
        }
        if (query.includes('INSERT INTO users')) {
          return { lastInsertRowid: 1 };
        }
        return {};
      }
    })
  };
}

export function getTravelersByClientId(clientId) {
  console.log('getTravelersByClientId called for client:', clientId);
  const travelers = mockAdditionalTravelers.filter(t => t.client_id === clientId);
  console.log('Found travelers:', travelers.length);
  return travelers;
}

export function initializeDatabase() {
  console.log('initializeDatabase called');
}