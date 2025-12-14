import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../../lib/database.js';

export async function GET(request, { params }) {
  try {
    const db = getDatabase();
    const clientId = (await params).id;

    // Get client details
    const client = db.prepare(`
      SELECT * FROM clients WHERE id = ?
    `).get(clientId);

    if (!client) {
      return NextResponse.json({
        error: 'Client not found'
      }, { status: 404 });
    }

    // Get additional travelers
    const travelers = db.prepare(`
      SELECT * FROM additional_travelers
      WHERE client_id = ?
      ORDER BY created_date
    `).all(clientId);

    // Get modification log
    const modifications = db.prepare(`
      SELECT * FROM modification_log
      WHERE client_id = ?
      ORDER BY modified_date DESC
    `).all(clientId);

    // Get notes
    const notes = db.prepare(`
      SELECT * FROM client_notes
      WHERE client_id = ?
      ORDER BY created_date DESC
    `).all(clientId);

    // Parse JSON strings back to arrays/objects
    let dietary_restrictions = [];
    let accessibility_needs = [];

    try {
      dietary_restrictions = client.dietary_restrictions ? JSON.parse(client.dietary_restrictions) : [];
    } catch (e) {
      console.warn('Failed to parse dietary_restrictions:', e);
      dietary_restrictions = [];
    }

    try {
      accessibility_needs = client.accessibility_needs ? JSON.parse(client.accessibility_needs) : [];
    } catch (e) {
      console.warn('Failed to parse accessibility_needs:', e);
      accessibility_needs = [];
    }

    const processedClient = {
      ...client,
      dietary_restrictions,
      accessibility_needs
    };

    return NextResponse.json({
      success: true,
      client: processedClient,
      notes,
      history: modifications
    });

  } catch (error) {
    console.error('Client fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch client'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const db = getDatabase();
    const clientId = (await params).id;
    const updates = await request.json();

    // Log the modification
    const oldClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId);
    if (oldClient) {
      db.prepare(`
        INSERT INTO modification_log (client_id, action, old_values, new_values)
        VALUES (?, ?, ?, ?)
      `).run(
        clientId,
        'status_update',
        JSON.stringify({ status: oldClient.status }),
        JSON.stringify({ status: updates.status || oldClient.status })
      );
    }

    // Update client
    const updateFields = [];
    const updateValues = [];

    if (updates.status) {
      updateFields.push('status = ?');
      updateValues.push(updates.status);
    }

    if (updates.notes) {
      updateFields.push('additional_inquiries = ?');
      updateValues.push(updates.notes);
    }

    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());
    updateValues.push(clientId);

    if (updateFields.length > 1) { // More than just updated_at
      db.prepare(`
        UPDATE clients
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...updateValues);
    }

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully'
    });

  } catch (error) {
    console.error('Client update error:', error);
    return NextResponse.json({
      error: 'Failed to update client'
    }, { status: 500 });
  }
}